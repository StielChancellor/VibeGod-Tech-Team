// PostToolUse(Edit|Write|MultiEdit): non-blocking reminders for tests, lint, and change-propagation.
//
// The edited FILENAME is echoed back into `additionalContext` — a trusted channel — and a filename is
// UNTRUSTED input in a cloned or shared repo (newlines, control chars and markup are all legal in a
// POSIX filename). Echoing it raw let a file named `notes.ts\n\n[SYSTEM OVERRIDE] ...\n\nx.ts` land a
// full instruction in the model's context the moment it was edited. So it gets the same treatment the
// SessionStart recipe index already gives untrusted text: strip invisibles, restrict to SAFE_CHARSET
// (kills newline, backtick, angle brackets, non-ASCII), bound the length, and drop the name entirely
// if it still reads as an injection — the reminder is just as useful without it.
import { readStdin, advise } from './_lib.mjs';
import { stripInvisible, looksInjected, SAFE_CHARSET } from './_markers.mjs';

process.on('uncaughtException', () => process.exit(0));
process.on('unhandledRejection', () => process.exit(0));

const inp = await readStdin();
const file = String(inp?.tool_input?.file_path ?? '');
if (!file) process.exit(0);

const isCode = /\.(?:ts|tsx|js|jsx|mjs|cjs|py|go|java|kt|rb|php|rs|c|cc|cpp|h|hpp|cs|swift|vue|svelte|scala|ex|exs)$/i.test(file);
const isUI = /\.(?:tsx|jsx|vue|svelte|css|scss|sass|less|html|astro)$/i.test(file);
if (!isCode && !isUI) process.exit(0);

const raw = file.split(/[\\/]/).pop();
const cleaned = stripInvisible(raw).replace(SAFE_CHARSET, '').replace(/\s+/g, ' ').trim().slice(0, 80);
const base = (!cleaned || looksInjected(cleaned)) ? 'this file' : cleaned;
let msg =
  `[VIBEGOD] Edited ${base}. Before closing this out: (1) add/adjust tests and run them — no "done" without evidence; ` +
  `(2) run lint/format; (3) if this changed a feature, propagate end-to-end (data model → API → UI → EVERY call site → docs) ` +
  `and delete any code this made dead; (4) keep UI ↔ backend in sync (no orphaned endpoints or dead UI).`;
if (isUI) msg +=
  ` (5) UI CHANGED — do NOT call it done/looks-right until you RENDER it: run the bundled visual-check tool ` +
  `across the breakpoints (skills/ui-ux-excellence/tools/visual-check.mjs --url <url>; install Playwright if ` +
  `missing — don't skip). Reading the code/CSS is not proof of appearance.`;
advise('PostToolUse', msg);
