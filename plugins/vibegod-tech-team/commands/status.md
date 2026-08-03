---
description: Where the build stands — position, budget, what is verified, what is open, and what happens next. Reads VIBEGOD-STATE.md; changes nothing.
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

**State — read only.** Read `VIBEGOD-STATE.md` and report from it. Change nothing: this command never
edits state, never advances a stage, and never starts work.

Report, in this order, in plain English — the reader is the person paying for this, not an engineer:

1. **Where we are.** The stage, and `In flight:` verbatim — the resumable position, not a stage label.
   If `Blocked on:` is set, lead with that instead; it is the only thing they can act on.
2. **What it has cost.** From `## COST LEDGER`: committed one-time and monthly, the ceiling, the window,
   and **how much headroom is left** — as a total and per month. Do the arithmetic for them; never make
   them derive a number that governs a decision. Say plainly that these are committed estimates rather
   than a measured bill.
3. **What is actually proven.** Count the GOAL criteria that are `[x]` **with a real `verified:` signal**
   against the total, and say which remain. A criterion ticked without evidence does not count — and
   `guard-state` would have refused it anyway. Do the same for lens rows.
4. **What is open.** `## OPEN HANDOVERS`, plus anything a trigger has paused (`Mode: paused` with its
   `Pause reason:`, or a `Halt:` value). If a pause has outlived its timeout, say so — it is now a halt.
5. **What happens next**, and whether it needs them. Distinguish *"I will do this next"* from *"I need a
   decision from you"*, and if the latter, state the decision at outcome altitude with the options and
   your recommendation.

If `VIBEGOD-STATE.md` does not exist, say so and point at `/kickoff` — there is nothing to report and
nothing has been lost.

Be honest about gaps rather than filling them: if the file claims work the repo does not contain, say
that plainly. A status report that reads well and is wrong is worse than one that admits it cannot tell.
