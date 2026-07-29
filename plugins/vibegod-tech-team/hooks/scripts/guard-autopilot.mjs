// PreToolUse(Edit|Write|MultiEdit): the AUTOPILOT budget brake — the one mechanical stop on an
// unattended loop. Token / $ / wall-clock budgets are NOT visible to a hook (verified against the
// live Claude Code hook contract in v0.12.1), so the brake counts what IS countable and lives in the
// state file: loop iterations and stage advances, declared up front when autopilot is armed.
//
// Two invariants are what make the brake real rather than decorative — without them a loop can
// simply rewrite its own limit and run forever:
//   1. Budget is WRITE-ONCE while armed  — no raising your own ceiling mid-flight.
//   2. Spent is INCREMENT-ONLY           — no rewinding your own counter to buy more room.
// On exhaustion every write is blocked until a human disarms. Disarming (`Mode: off`) is ALWAYS
// allowed, so a halted run can still record why it stopped and hand back cleanly.
//
// This hook governs the BUDGET only. It deliberately does not relax any other guardrail: guard-bash
// still blocks dangerous shell and guard-state still evidence-gates every criterion, so autopilot
// cannot self-certify "done" — it changes WHO approves the ◆ gates, not WHAT is mechanically forbidden.
//
// KNOWN LIMIT — be honest about the edge of the guarantee. A hook sees file edits, not who asked for
// them, so it cannot tell a user's `/autopilot on` from the agent re-arming itself after a halt. The
// budget is therefore mechanically enforced WITHIN an armed run; "do not re-arm yourself" is doctrine
// (the autopilot skill), not enforcement. Making the arm itself unforgeable needs a signal a hook does
// not get. Treated the same way as the rest of the plugin's guided layer: stated, not overclaimed.
//
// BEST-EFFORT, fail-open: acts only when VIBEGOD-STATE.md holds an `## AUTOPILOT` block whose Mode is
// not `off`; any error => allow. Downgrade to warnings with VIBEGOD_GUARDRAILS=advisory.
import { readStdin, hardBlock, sectionBlock, applyToolEdit } from './_lib.mjs';
import { readFileSync, existsSync, realpathSync } from 'node:fs';
import { join, sep } from 'node:path';

process.on('uncaughtException', () => process.exit(0));
process.on('unhandledRejection', () => process.exit(0));

const inp = await readStdin();
const ti = inp?.tool_input ?? {};

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
let statePath;
try {
  statePath = join(root, 'VIBEGOD-STATE.md');
  if (!existsSync(statePath)) process.exit(0);                                       // no pipeline => brake inactive
  if (!realpathSync(statePath).startsWith(realpathSync(root) + sep)) process.exit(0); // refuse a symlink out of project
} catch { process.exit(0); }

let onDisk;
try { onDisk = readFileSync(statePath, 'utf8'); } catch { process.exit(0); }

const armedBlock = sectionBlock(onDisk, 'AUTOPILOT');
if (armedBlock == null) process.exit(0);   // legacy / autopilot-unaware state file => allow

// `null` when the Mode line is absent — deliberately NOT defaulted to 'off' here. Defaulting would let
// deleting the line read as a legitimate disarm and silently switch the brake off (bypass 3 below).
const modeOf = (b) => ((b || '').match(/^Mode:\s*([A-Za-z-]+)/im) || [])[1]?.toLowerCase() ?? null;
// Counters live on one line as `Budget: iterations=25 stages=12`. Returns null only when the LINE is
// absent; a present-but-unparseable value yields nulls and is simply not enforced, so a partially
// filled block degrades to "unbraked" rather than to "blocked" (fail-open is the house rule).
const counters = (b, label) => {
  const m = (b || '').match(new RegExp('^' + label + ':\\s*(.*)$', 'im'));
  if (!m) return null;
  const num = (k) => { const x = m[1].match(new RegExp(k + '\\s*=\\s*(\\d+)', 'i')); return x ? Number(x[1]) : null; };
  return { iterations: num('iterations'), stages: num('stages') };
};
const headings = (t) => (String(t ?? '').match(/^##\s+AUTOPILOT\b/gim) || []).length;

// Disarmed => the brake is entirely inactive, INCLUDING the write-once budget rule. That is what makes
// arming (`off` -> `full-auto`, with a fresh budget) possible; re-budgeting therefore costs a
// deliberate `/autopilot off` first, which is exactly the human checkpoint the brake exists to force.
// An unparseable Mode reads as disarmed, matching the fail-open posture of every other hook here.
if ((modeOf(armedBlock) ?? 'off') === 'off') process.exit(0);

// Compute the proposed AUTOPILOT block, but only when this write targets the state file itself.
// applyToolEdit models what the tool ACTUALLY writes: it honors `replace_all` and inserts `$&`/`$'`
// literally. Simulating with a plain String.replace let a decoy copy of old_string earlier in the file
// absorb the edit, so a real budget raise looked like a no-op to every check below.
const isState = String(ti.file_path ?? '').split(/[\\/]/).pop() === 'VIBEGOD-STATE.md';
const proposed = isState ? applyToolEdit(onDisk, ti) : null;
const propBlock = proposed == null ? null : sectionBlock(proposed, 'AUTOPILOT');

// (1) STRUCTURAL INTEGRITY — checked before the disarm allowance below, because every bypass in this
//     family works by making the NEXT run read a block that no longer brakes anything:
//       a. delete or rename the `## AUTOPILOT` heading  -> next run finds no block and exits early;
//       b. prepend a SECOND `## AUTOPILOT` block saying `Mode: off` -> sectionBlock reads the FIRST
//          match, so both this run's disarm check and the next run's arm check read the decoy (the
//          same first-vs-last trap that hid a fake done-flip behind prose `verified:` in v0.13.0);
//       c. delete the Mode / Budget / Spent line -> the field reads as absent, i.e. unarmed.
//     None of these are legitimate edits while armed, so require the block's shape to survive intact.
if (isState && proposed != null) {
  const fieldsIntact = propBlock != null && modeOf(propBlock) != null
    && counters(propBlock, 'Budget') != null && counters(propBlock, 'Spent') != null;
  if (headings(proposed) !== headings(onDisk) || !fieldsIntact)
    hardBlock('PreToolUse',
      `VibeGod Tech Team blocked a structural edit to the ARMED "## AUTOPILOT" block of VIBEGOD-STATE.md.\n` +
      `While armed, the block must keep exactly one heading and its Mode / Budget / Spent lines — removing,\n` +
      `renaming or duplicating them disables the budget brake on the next run. To stand down legitimately,\n` +
      `set \`Mode: off\` in place (always allowed), or run /autopilot off.`);
}

// (2) Halting is ALWAYS allowed. A brake that can trap a run with no way to stand down would leave the
//     loop unable to record its own halt reason, so `Mode: off` short-circuits every check below.
if (propBlock && modeOf(propBlock) === 'off') process.exit(0);

const budget = counters(armedBlock, 'Budget');
const spent = counters(armedBlock, 'Spent');

if (propBlock) {
  const nb = counters(propBlock, 'Budget');
  const ns = counters(propBlock, 'Spent');
  // (3) Budget is write-once while armed.
  if (budget && nb && (budget.iterations !== nb.iterations || budget.stages !== nb.stages))
    hardBlock('PreToolUse',
      `VibeGod Tech Team blocked an edit to the ARMED autopilot Budget in VIBEGOD-STATE.md.\n` +
      `The budget is write-once while autopilot is armed — a loop that can raise its own ceiling has no\n` +
      `ceiling. To re-budget deliberately: run /autopilot off, then /autopilot on with the new limits.`);
  // (4) Spent is increment-only.
  if (spent && ns) for (const k of ['iterations', 'stages'])
    if (spent[k] != null && ns[k] != null && ns[k] < spent[k])
      hardBlock('PreToolUse',
        `VibeGod Tech Team blocked rewinding the autopilot Spent counter (${k}: ${spent[k]} -> ${ns[k]}).\n` +
        `Spent is increment-only — rewinding it silently buys unbudgeted iterations. If the run genuinely\n` +
        `needs more room, stop and re-arm on the record: /autopilot off, then /autopilot on.`);
}

// (5) The brake itself: at or over budget, ALL writes stop until a human disarms. This is intentionally
//     project-wide rather than state-file-only — a halt that still let the loop edit source code would
//     not be a halt. `/autopilot off` (rule 1) is always available to stand down and hand back.
if (budget && spent) for (const k of ['iterations', 'stages'])
  if (budget[k] != null && spent[k] != null && spent[k] >= budget[k])
    hardBlock('PreToolUse',
      `AUTOPILOT BUDGET EXHAUSTED — ${k}: ${spent[k]}/${budget[k]}. Autonomous work is halted.\n` +
      `Report to the user what was completed, which GOAL criteria are still open, and what the next step\n` +
      `is. Then run /autopilot off to stand down (always allowed), and let the user decide whether to\n` +
      `re-arm with a fresh budget. Do not continue working around this stop.`);

process.exit(0);
