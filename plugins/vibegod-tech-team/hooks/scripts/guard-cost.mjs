// PreToolUse(Edit|Write|MultiEdit): the COST BRAKE — the team may not commit the user past the hard
// ceiling they set at kickoff, and a pause nobody answers may not masquerade as work in progress.
//
// WHAT THIS IS: arithmetic over DECLARED ESTIMATES. total = one-time + (monthly x horizon), compared
// against the ENVELOPE ceiling. It is NOT spend monitoring — the plugin has no billing API and cannot
// see a real bill, and a wrong estimate passes cleanly. It catches the failure that actually sinks
// small projects: committing to expensive architecture without noticing. Saying more than that would
// repeat the 0.14.0 overclaim.
//
// Invariants are lifted wholesale from guard-autopilot, which has already been hardened against a
// round of real bypasses (write-once ceiling, increment-only counter, no field garbling, fail-closed on
// a malformed brake, resolved-path matching):
//   1. The CEILING is frozen while anything is committed — a budget you can quietly raise is not a
//      budget. To change it, halt the run (always allowed), exactly like autopilot's off-then-re-arm.
//   2. COMMITTED is increment-only — rewinding it silently buys unbudgeted room.
//   3. Crossing the ceiling stops the work and requires a PAUSE recording what is being asked.
//   4. A pause past its timeout becomes a documented HALT. Hooks block and instruct; they never write
//      state themselves, so the halt is recorded by the agent, in the open.
//
// Note on clocks: v0.12.1 established that token/$/wall-clock BUDGETS are not hook-visible — that is
// the harness not exposing them. Reading the system clock to age a stored timestamp is a different
// thing and works fine, which is what makes the timeout implementable.
//
// BEST-EFFORT, fail-open: no state file, no ENVELOPE, or an unset/placeholder ceiling => allow.
import { readStdin, hardBlock, sectionBlock, applyToolEdit } from './_lib.mjs';
import { readFileSync, existsSync, realpathSync } from 'node:fs';
import { join, sep, resolve } from 'node:path';

process.on('uncaughtException', () => process.exit(0));
process.on('unhandledRejection', () => process.exit(0));

const inp = await readStdin();
const ti = inp?.tool_input ?? {};

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
let statePath;
try {
  statePath = join(root, 'VIBEGOD-STATE.md');
  if (!existsSync(statePath)) process.exit(0);
  if (!realpathSync(statePath).startsWith(realpathSync(root) + sep)) process.exit(0);
} catch { process.exit(0); }

let onDisk;
try { onDisk = readFileSync(statePath, 'utf8'); } catch { process.exit(0); }

const envOf = (t) => sectionBlock(t, 'ENVELOPE');
const ledgerOf = (t) => sectionBlock(t, 'COST LEDGER');
const autoOf = (t) => sectionBlock(t, 'AUTOPILOT');

// `Cost ceiling: £5,000 over 12 months` — strip currency symbols and thousands separators before
// parsing, and treat a template placeholder (`<...>`) as "not set yet".
const ceilingOf = (b) => {
  const m = (b || '').match(/^Cost ceiling:\s*(.*)$/im);
  if (!m || /[<>]/.test(m[1])) return null;
  // Strip thousands separators FIRST: naively blanking non-digits turns "£5,000" into "5" and "000",
  // and the first-number match then reads a £5,000 ceiling as £5 — which blocks everything.
  const s = m[1].replace(/,/g, '');
  const hor = s.match(/over\s+(\d+)\s*month/i);
  // Remove the horizon clause before taking the amount, so "over 12 months" can't be read as the total.
  const amt = s.replace(/over\s+\d+\s*months?/i, ' ').match(/\d[\d.]*/);
  if (!amt) return null;
  return { total: Number(amt[0]), months: hor ? Number(hor[1]) : 12, raw: m[1].trim() };
};
const committedOf = (b) => {
  const m = (b || '').match(/^Committed:\s*(.*)$/im);
  if (!m) return null;
  const n = (k) => {
    // ALL occurrences, not the first. A line like `Committed: monthly=180 (superseded: monthly=580)`
    // reads honestly to a human while the brake silently scored the smaller number — so take the
    // LARGEST value present, and treat a second differing figure as ambiguity rather than detail.
    const all = [...m[1].matchAll(new RegExp(k + '\\s*=\\s*([\\d.]+)', 'gi'))].map((x) => Number(x[1]));
    const finite = all.filter((v) => Number.isFinite(v));
    if (!all.length) return null;
    if (finite.length !== all.length) return NaN;   // `58.0.0` -> NaN; must fail closed, not vanish
    return Math.max(...finite);
  };
  return { one: n('one-time'), monthly: n('monthly') };
};
const fieldOf = (b, label) => ((b || '').match(new RegExp('^' + label + ':\\s*(.*)$', 'im')) || [])[1]?.trim();

const ceiling = ceilingOf(envOf(onDisk));
if (!ceiling) process.exit(0);                     // no ceiling agreed yet => nothing to enforce
const committed = committedOf(ledgerOf(onDisk));

// Which file this write targets, resolved (never basename) and realpath'd so a symlink pointing at the
// state file cannot be edited through under another name. Computed BEFORE anything simulates the edit.
const real = (p) => { try { return realpathSync(p); } catch { return resolve(p); } };
const isState = (() => {
  try { return real(resolve(root, String(ti.file_path ?? ''))) === real(statePath); } catch { return false; }
})();
const proposed = isState ? applyToolEdit(onDisk, ti) : null;

// --- (0) STRUCTURAL INTEGRITY — fail CLOSED, the lesson from v0.14.1 -----------------------------
// Every parse target is a single point of failure: `ceilingOf` returns null on a `<placeholder>`, and
// the hook then exits 0 for good. So one edit — append `<agreed>` to the ceiling, delete the line, or
// rename `## ENVELOPE` / `## COST LEDGER` — silently disabled the whole brake, exactly the "malformed
// brake fails open" bug already fixed in guard-autopilot. If it parsed on disk, it must still parse.
if (proposed != null) {
  const stillParses = ceilingOf(envOf(proposed)) != null
    && (committed == null || committedOf(ledgerOf(proposed)) != null);
  if (!stillParses)
    hardBlock('PreToolUse',
      `VibeGod Tech Team blocked an edit that would make the COST BRAKE unreadable.\n` +
      `The \`## ENVELOPE\` / \`## COST LEDGER\` headings and the \`Cost ceiling:\` / \`Committed:\` lines must\n` +
      `stay present and parseable — removing, renaming or garbling one disables the ceiling entirely on\n` +
      `the next run. Keep the shape; change the numbers through a pause, on the record.`);
}

// --- (4) A stale pause must not look like work in progress -------------------------------------
const auto = autoOf(onDisk);
if ((fieldOf(auto, 'Mode') || 'off').toLowerCase() === 'paused') {
  const at = Date.parse(fieldOf(auto, 'Paused at') || '');
  const tmo = (fieldOf(auto, 'Pause timeout') || '60m').match(/(\d+)\s*([mh])/i);
  const ms = tmo ? Number(tmo[1]) * (tmo[2].toLowerCase() === 'h' ? 3600e3 : 60e3) : 3600e3;
  const proposedMode = (fieldOf(autoOf(proposed ?? onDisk), 'Mode') || '').toLowerCase();
  // Standing down or resuming deliberately is always allowed — otherwise a timed-out run could never
  // record its own halt, which is the whole point of the timeout.
  if (proposedMode !== 'off' && proposedMode !== 'full-auto' && Number.isFinite(at) && Date.now() - at > ms)
    hardBlock('PreToolUse',
      `AUTOPILOT PAUSE TIMED OUT — it has been waiting longer than ${fieldOf(auto, 'Pause timeout') || '60m'} for:\n` +
      `  ${fieldOf(auto, 'Pause reason') || '(no reason recorded — record one next time)'}\n\n` +
      `An unanswered pause is indistinguishable from a hang, so it becomes a documented halt. Set\n` +
      `\`Mode: off\` and \`Halt: pause-timeout\`, then report to the user: what was finished, what the\n` +
      `open decision is, and what it would cost either way. Do not silently continue.`);
}

// --- (1)+(2) Ceiling frozen while committed; committed increment-only ---------------------------
if (proposed != null) {
  const nc = ceilingOf(envOf(proposed));
  const ncm = committedOf(ledgerOf(proposed));
  const live = committed && ((committed.one ?? 0) > 0 || (committed.monthly ?? 0) > 0);
  if (live && nc && (nc.total !== ceiling.total || nc.months !== ceiling.months))
    hardBlock('PreToolUse',
      `VibeGod Tech Team blocked a change to the agreed COST CEILING (${ceiling.raw}).\n` +
      `It is frozen while anything is committed against it — a budget the team can quietly raise is not\n` +
      `a budget, and this is the user's hard number. If the work genuinely needs more, PAUSE and ask:\n` +
      `set \`Mode: paused\`, record \`Pause reason:\`, and present the cost, the cheaper alternative and a\n` +
      `recommendation. The user raises it on the record, or picks the cheaper path.`);
  if (committed && ncm) for (const k of ['one', 'monthly'])
    if (committed[k] != null && ncm[k] != null && ncm[k] < committed[k])
      hardBlock('PreToolUse',
        `VibeGod Tech Team blocked rewinding the committed cost (${k}: ${committed[k]} -> ${ncm[k]}).\n` +
        `Committed is increment-only — lowering it silently buys unbudgeted room under the ceiling.\n` +
        `If a commitment was genuinely dropped, record it as a new ledger entry saying so.`);
}

// --- (3) The brake itself ----------------------------------------------------------------------
const state = proposed != null ? proposed : onDisk;
const cur = committedOf(ledgerOf(state)) ?? committed;
if (cur && (cur.one != null || cur.monthly != null)) {
  // An unparseable figure (`monthly=58.0.0`) yields NaN, and every comparison against NaN is false —
  // so the brake AND the rewind check would both silently disappear. Malformed => stop.
  if (Number.isNaN(cur.one) || Number.isNaN(cur.monthly))
    hardBlock('PreToolUse',
      `VibeGod Tech Team blocked work: the committed cost is unreadable.\n` +
      `\`Committed:\` must be \`one-time=<number> monthly=<number>\`. A figure that will not parse leaves\n` +
      `the ceiling unenforced, so it stops the run rather than passing silently. Repair the line.`);
  const total = (cur.one ?? 0) + (cur.monthly ?? 0) * ceiling.months;
  if (total > ceiling.total) {
    const paused = (fieldOf(autoOf(state), 'Mode') || '').toLowerCase() === 'paused';
    if (!paused)
      hardBlock('PreToolUse',
        `COST CEILING EXCEEDED — committed ${cur.one ?? 0} one-time + ${cur.monthly ?? 0}/mo over ` +
        `${ceiling.months} months = ${total}, against a ceiling of ${ceiling.total}.\n\n` +
        `Stop and ask, do not decide this for the user. Set \`Mode: paused\`, record \`Paused at:\` and a\n` +
        `\`Pause reason:\` in their terms, then present: the cost (annualised if that changes the feel),\n` +
        `a costed cheaper alternative, and your recommendation. They raise the ceiling or take the\n` +
        `cheaper path — either way it is their call, on the record.`);
  }
}

process.exit(0);
