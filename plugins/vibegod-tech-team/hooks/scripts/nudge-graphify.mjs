// PostToolUse(Grep|Bash): when graphify is installed (a .graphify-path marker exists), nudge toward
// graphify for dependency/orphan/call-site searches. Tight heuristic — fires ONLY on a bare-symbol
// search (a likely call-site/dependency lookup), never on literal text or regex. Non-blocking.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { readStdin, advise } from './_lib.mjs';

process.on('uncaughtException', () => process.exit(0));
process.on('unhandledRejection', () => process.exit(0));

const inp = await readStdin();
const ti = inp?.tool_input ?? {};

// graphify installed? (the persisted marker written by /graph — see codebase-knowledge-graph step 1b)
const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
if (!existsSync(join(root, '.graphify-path'))) process.exit(0);

// Extract the search term: Grep tool → `pattern`; Bash → the grep/rg argument.
let term = '';
if (typeof ti.pattern === 'string') {
  term = ti.pattern;                                   // Grep tool
} else if (typeof ti.command === 'string') {
  const m = ti.command.match(/\b(?:grep|egrep|fgrep|rg)\b[^|;&]*/); // first grep/rg segment
  if (!m) process.exit(0);
  const toks = m[0].split(/\s+/).slice(1).filter((t) => t && !t.startsWith('-'));
  term = (toks.find((t) => /^["']?[A-Za-z_]/.test(t)) || '').replace(/^["']|["']$/g, '');
} else {
  process.exit(0);
}

// Tight heuristic: a bare identifier (symbol/call-site search), not literal text or a regex.
term = term.trim();
if (!/^[A-Za-z_][A-Za-z0-9_]{2,}$/.test(term)) process.exit(0);

advise(
  'PostToolUse',
  `[VIBEGOD] graphify is installed (.graphify-path) — for "${term}" prefer the GRAPH over grep: ` +
    `G="$(cat .graphify-path 2>/dev/null || echo graphify)"; $G affected "${term}" --depth 2 ` +
    `(dependents / blast radius) or $G explain "${term}". grep matches text, not calls, and misses ` +
    `dynamic/indirect refs — use it only to confirm a literal string.`,
);
