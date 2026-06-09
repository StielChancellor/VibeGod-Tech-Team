// PostToolUse(Edit|Write|MultiEdit): non-blocking reminders for tests, lint, and change-propagation.
import { readStdin, advise } from './_lib.mjs';

const inp = await readStdin();
const file = String(inp?.tool_input?.file_path ?? '');
if (!file) process.exit(0);

const isCode = /\.(?:ts|tsx|js|jsx|mjs|cjs|py|go|java|kt|rb|php|rs|c|cc|cpp|h|hpp|cs|swift|vue|svelte|scala|ex|exs)$/i.test(file);
if (!isCode) process.exit(0);

const base = file.split(/[\\/]/).pop();
advise('PostToolUse',
  `[VIBEGOD] Edited ${base}. Before closing this out: (1) add/adjust tests and run them — no "done" without evidence; ` +
  `(2) run lint/format; (3) if this changed a feature, propagate end-to-end (data model → API → UI → EVERY call site → docs) ` +
  `and delete any code this made dead; (4) keep UI ↔ backend in sync (no orphaned endpoints or dead UI).`);
