---
description: Stage 8 — Fresh best-practices QA pass + fixes, then UAT and smoke tests. Confirm, then ship for end-user review.
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

You are at **Stage 8 — Final QA, UAT & Smoke, Ship**. All features should already have passed Stage 7. Pass is **observed-green only**, never asserted.

Notes / release scope from the user: $ARGUMENTS

Do this:
1. State the stage and the gate (user confirms → ship for end-user review). Drive with the **qa-gates** skill.
2. Run a **fresh** set of QA agents (fresh eyes — `security-engineer` + `code-quality-reviewer` + `adversarial-tester` + `qa-engineer`) for a thorough **best-practices pass**, and fix findings.
3. Run the **UAT plan** — real-world acceptance scenarios tied to PRD requirements.
4. Run the **smoke-test plan** — critical-path checks on a deploy-like environment.
5. Final consistency sweep: confirm the full propagation chain is in sync (**PRD → blueprint → roadmap → graphify → code**) — no orphans, no half-wired features. Refresh the graph via `/graph` if needed.
6. **Pre-ship gates** — run `/compliance-check` (compliance-grc: SOC2/GDPR/VPAT), `/perf-check` (performance-engineer: load/stress vs SLA), and `/docs-check` (technical-writer: docs-ready). All must sign off.
7. **Release & GA readiness** — run `/release` (release-manager: version, CAB, go/no-go) then `/launch-readiness` (release-manager + devops-sre: SRE launch checklist + staged/canary rollout). Post-GA → Stage 10 Operate.
8. **User-perspective acceptance** — as the single front-door coordinator, dogfood the assembled build from the USER's point of view (real end-to-end flows, the four states, broken-UI/cross-screen consistency). On any breakage, route the fix to the owning agent and re-check. This is YOUR acceptance; it does not replace the user's sign-off.

◆ Gate: Present the acceptance result + all gates green-with-evidence. STOP and get the **user's explicit final go/no-go**, **then ship for end-user review.** If anything is red, fix and re-run — do not ship on a fail.
