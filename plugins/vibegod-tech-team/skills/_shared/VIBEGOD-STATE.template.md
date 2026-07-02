<!-- VibeGod pipeline state — the persistent memory that lets a fresh session (or a parallel swarm)
     RESUME the pipeline instead of re-discovering it. Created by /kickoff, updated at every stage
     transition and every ◆ gate. Commit it with the work.

     The `## GOAL` block below is FROZEN at kickoff: the objective, acceptance criteria, hard
     constraints, and non-goals are write-once. Only the acceptance-criteria checkboxes may change
     ([ ] -> [x], and only when a real, agent-independent signal proves the criterion). `guard-state`
     hard-blocks any other edit to this block (fail-open; downgrade with VIBEGOD_GUARDRAILS=advisory).
     Changing the goal itself is a Stage-9 change-request — re-baseline deliberately, with user sign-off. -->

## GOAL (frozen at kickoff — do not edit; only flip acceptance-criteria [ ] -> [x])
Objective: <the Stage-0 end objective, verbatim — one or two sentences: what "done" looks like for the end user>
Acceptance criteria (machine-checkable; each names the test / render / scan that proves it):
- [ ] AC-1: <criterion> — proof: <command / visual-check render / scan that verifies it>
- [ ] AC-2: <criterion> — proof: <...>
Hard constraints: OWASP Top 10 · WCAG 2.2 AA · the 4 safety gates (CI+tests · secret scan · >=1 non-author review · consistency/no-orphans) · <cost ceiling if any>
Non-goals: <explicitly out of scope>

## STATUS
Stage: 0 — Discover
Triage tier: <trivial | low | standard | high>   <!-- set after /triage -->

## GATES PASSED
<!-- one row per ◆ gate: stage — user decision (approved/changed) — date — evidence ref -->

## OPEN HANDOVERS
<!-- maker -> checker -> owner : what is open / deferred -->

## PER-FEATURE LENS STATUS (Stage 7)
<!-- feature — security / quality / adversarial / functional (+ ux / perf where applicable) — pass/fail -->

## NEXT ACTION
Run /prd to begin Stage 1.
