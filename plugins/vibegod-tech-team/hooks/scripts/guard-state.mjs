// PreToolUse(Edit|Write|MultiEdit): keep the frozen GOAL block of VIBEGOD-STATE.md write-once.
// The Stage-0 objective + acceptance criteria are the pipeline's north-star; freezing them is the
// anti-goalpost-moving anchor (and the substrate a future autonomous loop / drift check reads). Only
// acceptance-criteria checkboxes ([ ] <-> [x]) may change; editing the objective/criteria/constraints
// text is blocked so a goal change is a DELIBERATE act (Stage-9 change-request), not silent drift.
//
// BEST-EFFORT, fail-open: only acts on a file literally named VIBEGOD-STATE.md; any error => allow.
import { readStdin, hardBlock } from './_lib.mjs';
import { readFileSync } from 'node:fs';

process.on('uncaughtException', () => process.exit(0));
process.on('unhandledRejection', () => process.exit(0));

const inp = await readStdin();
const ti = inp?.tool_input ?? {};
const file = String(ti.file_path ?? '');
if (file.split(/[\\/]/).pop() !== 'VIBEGOD-STATE.md') process.exit(0);

// The GOAL block = from the `## GOAL` heading up to (not including) the next `## ` section or EOF.
// A `## `-prefixed line inside a fenced code block (e.g. a proof snippet or example output) is body
// text, not a section boundary — skip fenced regions so it can't be used to truncate the block early.
function goalBlock(text) {
  const lines = String(text ?? '').split(/\r?\n/);
  const start = lines.findIndex((l) => /^##\s+GOAL\b/i.test(l));
  if (start === -1) return null;
  let end = lines.length;
  let inFence = false;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^```/.test(lines[i].trim())) { inFence = !inFence; continue; }
    if (!inFence && /^##\s/.test(lines[i])) { end = i; break; }
  }
  return lines.slice(start, end).join('\n').trimEnd();
}
// Normalize for comparison: a checkbox flip is NOT a mutation; ignore trailing ws + blank-line churn.
function norm(block) {
  if (block == null) return null;
  return block.replace(/\[[ xX]\]/g, '[]').replace(/[ \t]+$/gm, '').replace(/\n{2,}/g, '\n').trim();
}

let onDisk;
try { onDisk = readFileSync(file, 'utf8'); } catch { process.exit(0); } // no file yet (e.g. /kickoff create) => allow

const current = goalBlock(onDisk);
if (current == null) process.exit(0); // nothing frozen yet => allow (backward-compatible with legacy state files)

// Compute the proposed full content, then compare the GOAL block before/after.
let proposed = onDisk;
if (typeof ti.content === 'string') proposed = ti.content;                                   // Write (overwrite)
else if (typeof ti.new_string === 'string') proposed = onDisk.replace(ti.old_string, ti.new_string); // Edit
else if (Array.isArray(ti.edits)) for (const e of ti.edits) if (e && typeof e.new_string === 'string') proposed = proposed.replace(e.old_string, e.new_string); // MultiEdit
else process.exit(0);

if (norm(current) !== norm(goalBlock(proposed)))
  hardBlock('PreToolUse',
    `VibeGod Tech Team blocked an edit to the FROZEN GOAL block of VIBEGOD-STATE.md.\n` +
    `The Stage-0 objective, acceptance criteria, constraints and non-goals are write-once — only the\n` +
    `acceptance-criteria checkboxes ([ ] -> [x]) may change. A real goal change is a Stage-9 change-request:\n` +
    `get the user's sign-off and re-baseline deliberately (or set VIBEGOD_GUARDRAILS=advisory to override).`);

process.exit(0);
