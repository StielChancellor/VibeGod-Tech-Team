<!-- VibeGod pipeline state — the persistent memory that lets a fresh session (or a parallel swarm)
     RESUME the pipeline instead of re-discovering it. Created by /kickoff, updated at every stage
     transition and every ◆ gate. Commit it with the work.

     The `## GOAL` block below is FROZEN at kickoff: the objective, acceptance criteria, hard
     constraints, and non-goals are write-once. Only the acceptance-criteria checkboxes and their
     `verified:` evidence slot may change — flip [ ] -> [x] ONLY with a claim-verifier-reproduced
     signal recorded in `verified:` (real proof, not self-report). `guard-state` hard-blocks any other
     edit to this block AND any [x] flip that lacks a `verified:` reference (fail-open; downgrade with
     VIBEGOD_GUARDRAILS=advisory). Changing the goal itself is a Stage-9 change-request — re-baseline
     deliberately, with user sign-off.

     SCOPE OF "FROZEN": the guard runs on Edit/Write/MultiEdit. No hook protects this file from shell
     commands — a `sed -i` or `rm` rewrites it and nothing here would see it. So "frozen" means held
     against drift and accident on the path an agent takes while working; it is not tamper-proof, and
     no hook can be (it runs on behalf of the agent it constrains). Keep this file in git: the commit
     history, not the hook, is what lets you prove the goal never moved. -->

## GOAL (frozen at kickoff — do not edit; only flip acceptance-criteria [ ] -> [x])
Objective: <the Stage-0 end objective, verbatim — one or two sentences: what "done" looks like for the end user>
Acceptance criteria (machine-checkable; mark [x] ONLY with a claim-verifier-reproduced signal in `verified:` — proof, not self-report):
- [ ] AC-1: <criterion> — proof: <command / visual-check render / scan that verifies it> — verified: —
- [ ] AC-2: <criterion> — proof: <...> — verified: —
Hard constraints: OWASP Top 10 · WCAG 2.2 AA · the 4 safety gates (CI+tests · secret scan · >=1 non-author review · consistency/no-orphans) · <cost ceiling if any>
Non-goals: <explicitly out of scope>

## ENVELOPE (agreed at kickoff — the boundary the team works inside)
<!-- These four are what let the user be the VISIONARY rather than the reviewer: every one is a
     business question, not an engineering artifact. The team works freely inside this boundary and
     stops only when it would cross it — so this replaces stopping at every stage to approve a
     document the user cannot meaningfully judge.

     Ceiling / sensitive domains / must-ask are a CONTRACT: changing them is a deliberate act on the
     record, not a silent adjustment. Interrupt appetite is a preference and may be changed any time.

     A hard ceiling needs a horizon to mean anything — build cost is one-time and run cost recurs, so
     "is £250/mo within £5,000?" is undefined without one. Total = one-time + (monthly x horizon). -->
Cost ceiling: <hard total, e.g. £5,000> over <horizon, default 12 months>   <!-- covers BUILD + RUN -->
Sensitive domains: <none | payments · personal data · health data · user logins · other>
Must ask before doing: <e.g. delete user data · email real users · touch production · publish anything>
Interrupt appetite: <only-expensive-or-risky | every meaningful choice>   <!-- changeable any time -->

## COST LEDGER
<!-- What has actually been COMMITTED against the ENVELOPE ceiling. `guard-cost` checks the arithmetic:
     total = one-time + (monthly x horizon), and blocks a choice that would cross the ceiling.

     HONEST SCOPE: this is arithmetic over DECLARED ESTIMATES, not spend monitoring. The plugin has no
     billing API and cannot see your bill; a wrong estimate passes cleanly. It catches the thing that
     actually sinks small projects — committing to expensive architecture without noticing — and it is
     not a spend monitor. Never describe it as one.

     `Committed` is INCREMENT-ONLY and the ceiling is frozen while it is non-zero (halt the run to
     change either) — the same invariants as the autopilot brake, for the same reason: a budget you can
     quietly raise is not a budget. -->
Committed: one-time=0 monthly=0
<!-- one row per commitment: date — item — one-time — monthly — why, and the cheaper alternative rejected -->

## STATUS
Stage: 0 — Discover
Triage tier: <trivial | low | standard | high>   <!-- set after /triage -->
<!-- `In flight` is what makes this file RESUMABLE rather than merely descriptive. Write it at a grain
     you could restart from cold, with no memory of the conversation: not "Stage 6" but
     "feature 3/5 `booking-flow` — contract written, e2e red on case 2 (expired-card)". A stage number
     alone is not a position; it is a label. Update it as the work moves, not only at gates. -->
In flight: —
Blocked on: —   <!-- what is stopping progress right now (a decision, a missing tool, a failing gate) -->

## DECISIONS
<!-- Append-only, newest last: date — what was decided — why — what it rules out.
     This is the record a user reads to reconstruct a run they did not watch, and the reason a
     resumed session can act on the same reasoning instead of re-deriving (or contradicting) it.
     Log the CHOICE and the ALTERNATIVE rejected, not just the outcome. -->

## AUTOPILOT
<!-- Opt-in unattended mode (/autopilot on|off|status). OFF unless the user explicitly arms it.
     Same scope limit as the GOAL block above: enforced on the file-edit path, not against a shell.
     Budget is WRITE-ONCE while armed and Spent is INCREMENT-ONLY — `guard-autopilot` hard-blocks
     raising the ceiling or rewinding the counter, and blocks ALL writes once Spent reaches Budget
     (fail-open; downgrade with VIBEGOD_GUARDRAILS=advisory). Disarming is always allowed. Token/$
     budgets are not visible to a hook, so iterations + stage-advances are the countable proxy. -->
Mode: off                       <!-- off | full-auto | paused -->
Budget: iterations=0 stages=0   <!-- set at arm time; frozen while armed -->
Spent: iterations=0 stages=0    <!-- increment-only; the loop bumps this every iteration / stage advance -->
Halt: —                         <!-- why the last run stopped: done | drift | budget | user | error | pause-timeout -->
<!-- PAUSED is not HALTED. A halt ends the run and hands back; a pause holds position and waits for one
     decision, then continues from where it stopped — which is why `In flight:` must be precise.
     A pause nobody answers is indistinguishable from a hang, so it TIMES OUT INTO A DOCUMENTED HALT:
     past the timeout, `guard-cost` stops the run and requires the halt be recorded with what was being
     asked. Resume by answering the question, not by clearing the field. -->
Paused at: —                    <!-- ISO timestamp when the pause began -->
Pause reason: —                 <!-- the decision being waited on, in the user's terms -->
Pause timeout: 60m              <!-- after this, the pause becomes Halt: pause-timeout -->

## GATES PASSED
<!-- one row per ◆ gate: stage — user decision (approved/changed) — date — evidence ref -->

## OPEN HANDOVERS
<!-- maker -> checker -> owner : what is open / deferred -->

## PER-FEATURE LENS STATUS (Stage 7)
<!-- feature — security / quality / adversarial / functional (+ ux / perf where applicable) — pass/fail -->

## NEXT ACTION
Run /prd to begin Stage 1.
