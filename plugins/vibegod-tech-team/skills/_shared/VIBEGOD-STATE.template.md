<!-- VibeGod pipeline state — the persistent memory that lets a fresh session (or a parallel swarm)
     RESUME the pipeline instead of re-discovering it. Created by /kickoff, updated at every stage
     transition and every ◆ gate. Commit it with the work.

     The `## GOAL` block below is FROZEN at kickoff: the objective, acceptance criteria, hard
     constraints, and non-goals are write-once. Only the acceptance-criteria checkboxes and their
     `verified:` evidence slot may change — flip [ ] -> [x] ONLY with a claim-verifier-reproduced
     signal recorded in `verified:` (real proof, not self-report). `guard-state` hard-blocks any other
     edit to this block AND any [x] flip that lacks a `verified:` reference (fail-open; downgrade with
     VIBEGOD_GUARDRAILS=advisory). Changing the goal itself is a Stage-9 change-request — re-baseline
     deliberately, with user sign-off. -->

## GOAL (frozen at kickoff — do not edit; only flip acceptance-criteria [ ] -> [x])
Objective: <the Stage-0 end objective, verbatim — one or two sentences: what "done" looks like for the end user>
Acceptance criteria (machine-checkable; mark [x] ONLY with a claim-verifier-reproduced signal in `verified:` — proof, not self-report):
- [ ] AC-1: <criterion> — proof: <command / visual-check render / scan that verifies it> — verified: —
- [ ] AC-2: <criterion> — proof: <...> — verified: —
Hard constraints: OWASP Top 10 · WCAG 2.2 AA · the 4 safety gates (CI+tests · secret scan · >=1 non-author review · consistency/no-orphans) · <cost ceiling if any>
Non-goals: <explicitly out of scope>

## STATUS
Stage: 0 — Discover
Triage tier: <trivial | low | standard | high>   <!-- set after /triage -->

## AUTOPILOT
<!-- Opt-in unattended mode (/autopilot on|off|status). OFF unless the user explicitly arms it.
     Budget is WRITE-ONCE while armed and Spent is INCREMENT-ONLY — `guard-autopilot` hard-blocks
     raising the ceiling or rewinding the counter, and blocks ALL writes once Spent reaches Budget
     (fail-open; downgrade with VIBEGOD_GUARDRAILS=advisory). Disarming is always allowed. Token/$
     budgets are not visible to a hook, so iterations + stage-advances are the countable proxy. -->
Mode: off                       <!-- off | full-auto -->
Budget: iterations=0 stages=0   <!-- set at arm time; frozen while armed -->
Spent: iterations=0 stages=0    <!-- increment-only; the loop bumps this every iteration / stage advance -->
Halt: —                         <!-- why the last run stopped: done | drift | budget | user | error -->

## GATES PASSED
<!-- one row per ◆ gate: stage — user decision (approved/changed) — date — evidence ref -->

## OPEN HANDOVERS
<!-- maker -> checker -> owner : what is open / deferred -->

## PER-FEATURE LENS STATUS (Stage 7)
<!-- feature — security / quality / adversarial / functional (+ ux / perf where applicable) — pass/fail -->

## NEXT ACTION
Run /prd to begin Stage 1.
