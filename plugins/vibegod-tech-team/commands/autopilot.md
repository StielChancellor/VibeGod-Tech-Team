---
description: Arm or stand down unattended autopilot — runs the gated pipeline to the DONE predicate under a write-once iteration/stage budget.
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.
Drive with the **autopilot** skill (`${CLAUDE_PLUGIN_ROOT}/skills/autopilot/SKILL.md`) — read it before arming.

Requested action and budget from the user: $ARGUMENTS

`/autopilot on [iterations=N] [stages=M]` · `/autopilot off` · `/autopilot status` (default when no argument).

**Autopilot is OFF unless the user explicitly arms it in this session.** Never arm it because a task
looks long, and never re-arm after a budget halt without the user asking — the halt exists to return
the decision to them.

Do this:

**`status`** — read the `## AUTOPILOT` block of `VIBEGOD-STATE.md` and report Mode, Budget, Spent,
remaining headroom, the last Halt reason, and how many GOAL criteria are `[x]`-with-evidence out of
the total. If there is no state file, say so and point at `/kickoff`.

**`on`** — arm it, in this order:
1. **Preflight, all must hold — refuse and explain if any fails.** `VIBEGOD-STATE.md` exists; its
   `## GOAL` block is filled in (no `<placeholder>` text left); every acceptance criterion names a real,
   machine-checkable `proof:`. An unattended loop against a vague goal burns budget producing the wrong
   thing — a criterion with no reproducible proof can never be certified, so it can never terminate.
2. **Confirm the budget with the user** — default `iterations=25 stages=12` if they gave none. State it
   plainly: this is the mechanical stop, it is **write-once once armed**, and raising it mid-run is
   blocked by `guard-autopilot`. Re-budgeting costs a deliberate `/autopilot off` → `/autopilot on`.
   Say honestly how far it reaches: it is enforced on the **file-edit path**, and no hook guards the
   state file against shell commands — so it stops drift and accident, not a determined workaround.
3. **Tell them what unattended means here** — it auto-passes the ◆ approval gates that would normally
   stop for them, through to the Stage-8 ship gate, and stops only on DONE / drift / budget / error.
   The mechanical guardrails stay in force regardless: `guard-bash` still blocks dangerous shell, and
   `guard-state` still refuses to mark any criterion done without reproduced evidence.
4. Write the `## AUTOPILOT` block — `Mode: full-auto`, the agreed `Budget:`, `Spent: iterations=0 stages=0`,
   `Halt: —`. (`Spent` may only be reset while disarming; the counter is increment-only once armed.)
5. Hand straight over to the **autopilot** skill and begin the loop.

**`off`** — set `Mode: off` and record the `Halt:` reason. Always permitted, even at exhausted budget.
Then report: what completed, which GOAL criteria are `[x]`-with-evidence, what is still open, and the
recommended next step. Leave `Spent` intact as the run's audit trail.
