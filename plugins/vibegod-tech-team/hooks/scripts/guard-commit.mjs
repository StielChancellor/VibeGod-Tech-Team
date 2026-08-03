// PreToolUse(Bash): the NON-NEGOTIABLE FLOOR — never commit a real credential.
//
// Why this exists as its own hook. Three individually-correct decisions used to compose into exactly
// the outcome this forbids, and auditing hooks one at a time never revealed it:
//   1. guard-write treats a bare `KEY=value` in a `.env` as ADVISORY, not blocking — correct, because a
//      dotenv file is precisely where a real secret is supposed to live.
//   2. Nothing guarantees the project gitignores `.env`.
//   3. Nothing inspected `git add` / `git commit` at all.
// Composed: secret written to .env (allowed) -> .env not ignored -> `git add . && git commit` (unseen).
// guard-write even carried the string "never commit a real credential here" as ADVICE while no
// mechanism enforced it.
//
// This inspects what is actually about to be committed (the staged diff), not the tool input — the
// secret is normally already on disk by then, which is why a write-time hook cannot cover this.
//
// SCOPE, stated so the docs stay honest: it catches RECOGNISABLE credential shapes in a TRACKED commit.
// It cannot catch a novel secret format, and — like every guard here — a determined shell can go around
// it (`git -c core.hooksPath=... `, a raw plumbing commit, etc.). It is a floor, not a vault.
//
// BEST-EFFORT, fail-open: not a git repo, git unavailable, or any error => allow.
import { readStdin, hardBlock } from './_lib.mjs';
import { FIXTURE_PATH, scanSecrets } from './_secrets.mjs';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

process.on('uncaughtException', () => process.exit(0));
process.on('unhandledRejection', () => process.exit(0));

const inp = await readStdin();
const cmd = String(inp?.tool_input?.command ?? '');
if (!cmd.trim()) process.exit(0);

// Blank quoted spans first: `git commit -m "wip: git commit"` must not self-trigger on its own message,
// and a message is where the word "commit" most often appears innocently.
const codeView = cmd.replace(/'[^']*'|"[^"]*"/g, (m) => ' '.repeat(m.length));
// Test BOTH views: blanking quotes stops a commit message self-triggering, but it also hid the
// command itself in `sh -c 'git commit -m wip'`. Detect on either; the message-only case is then
// excluded by requiring `git` and `commit` to survive together in at least one view.
const looksLikeCommit = (t) => /\bgit\b[^\n]*\bcommit\b/.test(t);
if (!looksLikeCommit(codeView) && !looksLikeCommit(cmd)) process.exit(0);
// `--no-verify` is about git's own hooks, not ours; nothing to special-case. `--amend` still commits.

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const git = (args) => {
  const r = spawnSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  return r.status === 0 ? String(r.stdout ?? '') : null;
};

if (git(['rev-parse', '--is-inside-work-tree']) === null) process.exit(0); // not a repo => not our business

// What will actually land. Three cases, and missing the third made this guard near-useless:
//   a) already staged            -> `git diff --cached`
//   b) `commit -a/-am/--all`     -> also `git diff HEAD` (staged at commit time)
//   c) `git add … && git commit` -> NOTHING IS STAGED YET when this hook runs, so (a) is empty and the
//      commit sailed through. That chained form is the single most common way an agent commits, so the
//      floor only held when staging and committing happened to be separate tool calls. For it we scan
//      what the add WOULD stage: tracked modifications, plus untracked non-ignored files, plus any
//      path named explicitly (which covers `git add -f .env` defeating gitignore).
const usesAll = /\bcommit\b[^\n]*\s-[A-Za-z]*a/.test(codeView) || /--all\b/.test(codeView);
const stagesFirst = /\bgit\s+(?:add|stage)\b/.test(codeView);

let diff = git(['diff', '--cached', '--unified=0']) ?? '';
if (usesAll || stagesFirst) diff += git(['diff', 'HEAD', '--unified=0']) ?? '';
if (stagesFirst) {
  // Untracked files the add would pick up; `+`-prefix each line so the added-line parser below sees them.
  const untracked = (git(['ls-files', '--others', '--exclude-standard']) ?? '').split('\n').filter(Boolean);
  // Paths named on the add line — needed because `git add -f <ignored>` stages a file ls-files omits.
  const named = (codeView.match(/\bgit\s+(?:add|stage)\b([^&|;]*)/) || [, ''])[1]
    .split(/\s+/).filter((t) => t && !t.startsWith('-') && t !== '.');
  for (const f of [...new Set([...untracked, ...named])]) {
    let body;
    try { body = readFileSync(join(root, f), 'utf8'); } catch { continue; }
    if (body.length > 512 * 1024) continue;
    diff += `\n+++ b/${f}\n` + body.split('\n').map((l) => '+' + l).join('\n');
  }
}
if (!diff.trim()) process.exit(0); // nothing staged (or an empty/--amend-only commit) => allow

// Walk the diff per file, collecting ADDED lines only. Removing a credential must never be blocked —
// that is the fix, and blocking it would trap the secret in the repo.
const findings = new Map();          // file -> Set(names)
let file = '', added = [];
const flush = () => {
  if (!file || !added.length) return;
  // Fixture/example/docs paths carry deliberately fake credentials; guard-write already allows writing
  // them, so blocking the commit would be an inconsistency the user cannot resolve.
  if (!FIXTURE_PATH.test(file)) {
    const hits = scanSecrets(added.join('\n'));   // bareAssignments ON: committing a .env IS the thing to stop
    if (hits.size) findings.set(file, hits);
  }
  added = [];
};
for (const line of diff.split('\n')) {
  const m = line.match(/^\+\+\+ b\/(.+)$/);
  if (m) { flush(); file = m[1]; continue; }
  if (line.startsWith('diff --git')) { flush(); file = ''; continue; }
  if (line.startsWith('+') && !line.startsWith('+++')) added.push(line.slice(1));
}
flush();

if (findings.size) {
  const detail = [...findings].map(([f, names]) => `  ${f}: ${[...names].join(', ')}`).join('\n');
  hardBlock('PreToolUse',
    `VibeGod Tech Team blocked a commit: it would commit a real credential.\n${detail}\n\n` +
    `A committed secret is in the history even after you delete it — rotate it if it was ever pushed.\n` +
    `Fix: remove the value, put it in an environment variable or secret manager, and make sure the file\n` +
    `is gitignored (\`.env\` and \`.env.*\` should be). Then commit again.\n` +
    `Set VIBEGOD_GUARDRAILS=advisory to downgrade this to a warning.`);
}

process.exit(0);
