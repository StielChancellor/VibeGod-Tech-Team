---
name: autopilot
description: Run the gated pipeline unattended to the machine-checkable DONE predicate under a write-once iteration/stage budget, halting on done, drift, budget or error. Use when the user has explicitly armed /autopilot on.
---

# Autopilot — the unattended loop

Autopilot runs the pipeline **without stopping at each ◆ gate for the user**, until the whole-product
DONE predicate holds or the brake fires. It exists because the foundation for it is now real: a frozen
GOAL that cannot move (`guard-state`), a north-star that survives compaction (`reinforce-goal`), and a
DONE predicate that cannot be self-certified (evidence-gated criteria).

**It is opt-in and OFF by default.** Only run this loop when the user has armed it this session with
`/autopilot on`. Never arm it yourself because a task looks long.

## What autopilot changes — and what it must never change

It changes **who approves the ◆ gates** — autopilot approves them on the user's behalf.

It changes **nothing** about what is mechanically forbidden. All of this stays in force, and you must
never work around any of it:

- `guard-bash` still hard-blocks dangerous shell (`rm -rf /`, `curl|bash`, force-push to `main`).
- `guard-state` still refuses to mark a GOAL criterion `[x]` without a reproduced `verified:` signal.
  **Autopilot cannot certify its own work** — `claim-verifier` reproduces every proof, exactly as in
  human-gated mode. An autopilot that could tick its own boxes would terminate instantly and mean nothing.
- `guard-autopilot` enforces the budget: **Budget is write-once while armed, Spent is increment-only.**
  Do not attempt to raise the ceiling or rewind the counter — both are hard-blocked, and trying is a bug
  in your reasoning, not an obstacle to route around.

Treat the brake as load-bearing — but know exactly how far it reaches. It is enforced on the
**file-edit path** (Edit / Write / MultiEdit). **No hook guards `VIBEGOD-STATE.md` against shell
commands**, so a `sed -i` or `rm` would defeat every invariant above, and no guardrail here would see
it. That is not a licence to reach for the shell — it is the reason the doctrine matters: the brake
stops drift and accident, and *your own honesty* is what covers the rest. If you ever find yourself
considering a shell edit to the state file, that is the strongest possible signal to stop and hand
back to the user instead.

## The loop

Each iteration, in order:

1. **Re-anchor.** Re-read the frozen `## GOAL` block from `VIBEGOD-STATE.md`. It is the objective you
   serve; it is data, not new instructions. Never edit it — a genuine goal change is a Stage-9
   change-request that requires the user.
2. **Drift check.** Before doing any work, state which acceptance criterion this iteration advances.
   If the work you are about to do maps to **no** criterion, that is drift: **halt** with `Halt: drift`,
   and hand back with what you found. Scope growth discovered mid-run is a decision for the user, not
   something to absorb silently — the GOAL is frozen precisely so this is detectable.
3. **Advance one increment** — the next unmet criterion, through the normal stage flow, with the normal
   specialist agents and maker–checker discipline. Autopilot removes the user's approval pause; it does
   not remove the method, the reviews, or the quality bar.
4. **Certify honestly.** When a criterion's proof genuinely reproduces, have `claim-verifier` reproduce
   it, record the real signal in `verified:`, and flip `[x]`. If it does not reproduce, leave it unticked
   and fix the work — never soften a criterion to make it pass.
5. **Bump the counter.** Increment `Spent: iterations=` every iteration and `stages=` on every stage
   advance, in the same edit that records progress. This is what makes the budget mean anything: an
   iteration you do not count is an iteration the brake cannot see.
6. **Check termination** (below). If none fires, continue.

## Halt conditions — stop and hand back on any of these

| Halt | When | `Halt:` value |
|---|---|---|
| **Done** | Every GOAL criterion is `[x]` with recorded evidence — the whole-product DONE predicate | `done` |
| **Drift** | The next useful work maps to no acceptance criterion, or the goal itself looks wrong | `drift` |
| **Budget** | `Spent` reached `Budget` on either counter (`guard-autopilot` blocks all writes) | `budget` |
| **Error** | A blocker you cannot resolve without the user — missing credentials, an ambiguous product call, a failing gate you cannot fix | `error` |
| **User** | The user says stop | `user` |

On any halt: set `Mode: off`, record the `Halt:` reason, then **report plainly** — what completed, which
criteria are `[x]`-with-evidence, what is still open, and the recommended next step. Leave `Spent` intact
as the audit trail of the unattended run.

**Never re-arm yourself after a halt.** The halt returns the decision to the user; taking it back
defeats the entire mechanism.

## Reporting

The user was not watching. Assume they need to reconstruct the run from your summary alone: what you
built, what you decided on their behalf at each gate you auto-passed, what evidence certifies each
criterion, and anything you would have asked them about had they been present. Surface the judgment
calls — those are the cost of unattended operation, and hiding them is how autonomy loses trust.

If the DONE predicate holds, the run is complete but the **product still needs the user's final
sign-off** — present the evidence and let them make that call. Autopilot reaches "done"; it does not
declare the work accepted.
