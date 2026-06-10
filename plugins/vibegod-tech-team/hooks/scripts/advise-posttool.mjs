// PostToolUse(Edit|Write|MultiEdit): non-blocking reminders for tests, lint, and change-propagation.
import { readStdin, advise } from './_lib.mjs';

const inp = await readStdin();
const file = String(inp?.tool_input?.file_path ?? '');
if (!file) process.exit(0);

const isCode = /\.(?:ts|tsx|js|jsx|mjs|cjs|py|go|java|kt|rb|php|rs|c|cc|cpp|h|hpp|cs|swift|vue|svelte|scala|ex|exs)$/i.test(file);
const isUI = /\.(?:tsx|jsx|vue|svelte|css|scss|sass|less|html|astro)$/i.test(file);
if (!isCode && !isUI) process.exit(0);

const base = file.split(/[\\/]/).pop();
let msg =
  `[VIBEGOD] Edited ${base}. Before closing this out: (1) add/adjust tests and run them — no "done" without evidence; ` +
  `(2) run lint/format; (3) if this changed a feature, propagate end-to-end (data model → API → UI → EVERY call site → docs) ` +
  `and delete any code this made dead; (4) keep UI ↔ backend in sync (no orphaned endpoints or dead UI).`;
if (isUI) msg +=
  ` (5) UI CHANGED — do NOT call it done/looks-right until you RENDER it: run the bundled visual-check tool ` +
  `across the breakpoints (skills/ui-ux-excellence/tools/visual-check.mjs --url <url>; install Playwright if ` +
  `missing — don't skip). Reading the code/CSS is not proof of appearance.`;
advise('PostToolUse', msg);
