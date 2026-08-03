// PreToolUse(Edit|Write|MultiEdit): keep the frozen GOAL block of VIBEGOD-STATE.md write-once.
// The Stage-0 objective + acceptance criteria are the pipeline's north-star; freezing them is the
// anti-goalpost-moving anchor (and the substrate a future autonomous loop / drift check reads). Only
// acceptance-criteria checkboxes ([ ] <-> [x]) may change; editing the objective/criteria/constraints
// text is blocked so a goal change is a DELIBERATE act (Stage-9 change-request), not silent drift.
//
// BEST-EFFORT, fail-open: only acts on a file literally named VIBEGOD-STATE.md; any error => allow.
import { readStdin, hardBlock, sectionBlock, applyToolEdit } from './_lib.mjs';
import { readFileSync, realpathSync } from 'node:fs';


process.on('uncaughtException', () => process.exit(0));
process.on('unhandledRejection', () => process.exit(0));

const inp = await readStdin();
const ti = inp?.tool_input ?? {};
const file = String(ti.file_path ?? '');
// Match the basename of the given path OR of what it really points at. Resolving the symlink is what
// closes the escape: `notes.md -> VIBEGOD-STATE.md` passed a basename-only test, and the frozen GOAL
// was freely rewritable through the alias. Deliberately NOT resolved against a project root — this
// hook protects any file of that name wherever it sits, and must not depend on knowing the root.
const baseOf = (p) => String(p).split(/[\\/]/).pop();
const realBase = (() => { try { return baseOf(realpathSync(file)); } catch { return null; } })();
if (baseOf(file) !== 'VIBEGOD-STATE.md' && realBase !== 'VIBEGOD-STATE.md') process.exit(0);

// The GOAL block = from the `## GOAL` heading up to (not including) the next `## ` section or EOF,
// fence-aware so a `## `-prefixed line inside a code fence can't truncate it early — see sectionBlock.
const goalBlock = (text) => sectionBlock(text, 'GOAL');
// Normalize for comparison: the checkbox STATE and the `verified:` evidence value are mutable STATUS,
// not frozen text — neutralize both so recording progress/evidence isn't seen as a goal mutation. The
// objective / criteria text / proof / constraints / non-goals stay frozen.
//
// The evidence FIELD is the LAST `verified:` on the line (the template always appends it at line-end).
// Matching the first occurrence instead would let prose that happens to contain the substring
// "verified:" (e.g. `proof: manually verified: by QA`, or `unverified:`) swallow everything after it —
// including the real evidence field — hiding both a frozen-text mutation and a missing/fake evidence
// value from every check below. The negative lookahead forces the match to the last occurrence.
const LAST_VERIFIED = /verified:(?!.*verified:).*$/gim;
function norm(block) {
  if (block == null) return null;
  return block.replace(/\[[ xX]\]/g, '[]').replace(LAST_VERIFIED, 'verified:')
    .replace(/[ \t]+$/gm, '').replace(/\n{2,}/g, '\n').trim();
}
// Marking a criterion done is EVIDENCE-GATED: a [ ] -> [x] flip requires a real (non-placeholder)
// `verified:` reference on that line — claim-verifier's reproduced signal, not self-report. guard-state
// enforces evidence PRESENCE; claim-verifier + the ship gate certify the evidence is TRUE.
const boxState = (l) => (l.match(/^\s*[-*]\s*\[([ xX])\]/) || [])[1]?.toLowerCase();
const lineKey = (l) => l.replace(/^(\s*[-*]\s*)\[[ xX]\]/, '$1[]').replace(/verified:(?!.*verified:).*$/i, 'verified:');
const hasEvidence = (l) => {
  const m = l.match(/verified:(?!.*verified:)\s*(.*)$/i);
  if (!m) return false;
  const v = m[1].replace(/[—–-]/g, '').trim();
  // A real reproduced signal NAMES something — a command and its result, a commit, a report path. The
  // old test (>=6 chars, and an ANCHORED list of six words) waved through `pending review`, `TBD later`,
  // `n/a for now`, a bare date, and `aaaaaa`. Placeholder stems are now rejected ANYWHERE in the value,
  // and a signal must carry both a letter and a digit — which a date alone or a run of letters does not.
  if (/\b(?:tbd|pending|todo|wip|none|n\/?a|later|soon|assume[ds]?|probably|should\s+be)\b/i.test(v)) return false;
  return v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v);
};

let onDisk;
try { onDisk = readFileSync(file, 'utf8'); } catch { process.exit(0); } // no file yet (e.g. /kickoff create) => allow

const current = goalBlock(onDisk);
if (current == null) process.exit(0); // nothing frozen yet => allow (backward-compatible with legacy state files)

// Compute the proposed full content, then compare the GOAL block before/after. applyToolEdit models
// what the tool ACTUALLY writes (honors replace_all, inserts `$&`/`$'` literally) — simulating with a
// plain String.replace let a decoy occurrence absorb the edit and hide a frozen-GOAL mutation entirely.
const proposed = applyToolEdit(onDisk, ti);
if (proposed == null) process.exit(0);

// A goal that has been MET may be re-baselined. Goalpost-moving means changing the goal to avoid
// meeting it; changing it once every criterion is [x] with reproduced evidence is simply starting the
// next piece of work. Without this the freeze had no exit at all: after a goal completed, dropping a
// non-goal, adding a criterion and even a deliberate whole-file re-baseline were all blocked, and the
// only escape was VIBEGOD_GUARDRAILS=advisory — which disables every guard, secret-blocking included.
// Surfaced by running this pipeline on real work and finishing a goal.
//
// This is not a loophole: unlocking it requires first satisfying the evidence gate on EVERY criterion,
// and `hasEvidence` already refuses placeholders. The barrier to re-baselining is doing the work.
const acLines = (b) => (b || '').split('\n').filter((l) => boxState(l) !== undefined);
const goalMet = (b) => { const a = acLines(b); return a.length > 0 && a.every((l) => boxState(l) === 'x' && hasEvidence(l)); };

if (norm(current) !== norm(goalBlock(proposed)) && !goalMet(current))
  hardBlock('PreToolUse',
    `VibeGod Tech Team blocked an edit to the FROZEN GOAL block of VIBEGOD-STATE.md.\n` +
    `The Stage-0 objective, acceptance criteria, constraints and non-goals are write-once — only the\n` +
    `acceptance-criteria checkboxes ([ ] -> [x]) may change. A real goal change is a Stage-9 change-request:\n` +
    `get the user's sign-off and re-baseline deliberately (or set VIBEGOD_GUARDRAILS=advisory to override).`);

// Freeze passed => only checkbox / verified STATUS changed. Evidence-gate every [ ] -> [x] "mark done".
const propGoal = goalBlock(proposed);
if (propGoal) {
  const wasChecked = new Map(current.split('\n').map((l) => [lineKey(l), boxState(l)]));
  for (const pl of propGoal.split('\n'))
    if (boxState(pl) === 'x' && wasChecked.get(lineKey(pl)) === ' ' && !hasEvidence(pl))
      hardBlock('PreToolUse',
        `VibeGod Tech Team blocked marking a GOAL acceptance criterion done without evidence.\n` +
        `Flip a checkbox to [x] only with a claim-verifier-reproduced signal recorded in \`verified:\` on\n` +
        `that line (real reproduced proof + date/commit, NOT self-report). Record it, then mark it done.`);
}

process.exit(0);
