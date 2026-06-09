---
name: qa-gates
description: Use to run the multi-lens QA model that gates every feature and the final ship. Trigger before closing any feature ("is this feature done", "QA this", "feature check") and before shipping ("ship check", "final QA", "ready to release"). Per feature, dispatch security-engineer + code-quality-reviewer + adversarial-tester + qa-engineer (plus ux-design-reviewer for UI) in PARALLEL — all must pass. Final gate adds a best-practices pass + UAT + smoke before ship.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# QA Gates — the multi-lens quality model

Quality is gated, not assumed. No feature closes and nothing ships without the lenses confirming.
Evidence-based only: a lens "passes" when it has actually run and verified, never on assertion
(#8). Each lens fixes what it finds (or files it precisely) before declaring pass.

## Fits in the pipeline
- **Stage 7** (`/feature-check`) — runs before closing EACH feature.
- **Stage 8** (`/ship-check`) — final pass + UAT + smoke before shipping to end users.

## Stage 7 — per-feature gate (QA lenses + UX + performance, IN PARALLEL)
Before a feature is marked done, dispatch these agents **in parallel**; all must pass:

1. **`security-engineer`** — OWASP + cyber best practices: authz at boundaries, input validation/
   output encoding, secrets handling, dependency/SCA scan, no injection sinks. (See `secure-coding`.)
2. **`code-quality-reviewer`** — refactor/simplify where warranted: anti-overeagerness, dead code,
   duplication, readability, surgical-change discipline. Simpler-where-simpler-is-correct.
3. **`adversarial-tester`** — flaw-finding: attack the feature, hunt edge cases, boundary
   conditions, race conditions, malformed input; find and fix defects.
4. **`qa-engineer`** — functional QA from frontend, backend, USER, and code perspectives. Verifies
   it works as intended AND runs the **consistency / no-orphans check**:
   - UI ↔ backend in sync (no UI element without a working backend; no removed backend the UI
     still advertises).
   - Every call site of changed code updated; no half-wired feature.
   - No dead/orphaned code the change left behind.
   - Accessibility (WCAG 2.2 AA) + cross-browser/perf budgets for UI.
5. **`ux-design-reviewer`** (UI features only) — first confirm the feature passed **`/polish`**
   (`design-refinement`), then render across the breakpoint matrix and gate on `ui-ux-excellence`:
   not broken (no overflow/overlap/truncation/CLS/contrast fails), visually consistent across screens,
   design-token-clean, AND **not generic** — fail the slop test if it's a centered-card-on-a-void with
   a training-data font (Inter/DM/Space Grotesk), default Tailwind blue, a purple→blue gradient,
   eyebrow-label scaffolding, or an icon-tile above every heading. On fail it hands a precise fix list
   to the `frontend-engineer` and re-reviews. (See `/ux-check` + `/polish`.)
6. **`performance-engineer`** (perf-sensitive features) — checks the change against perf budgets/SLAs
   (p95/p99, Core Web Vitals) and flags regressions. `test-automation-engineer` (SDET) backs the whole
   gate with the regression/e2e automation that makes it fast and repeatable. (See `/perf-check`.)

◆ **Only when all lenses confirm** (UX lens for any UI feature; perf lens for perf-sensitive ones)
does the feature close
and the swarm move to the next task. A single failing lens blocks the feature.

## Stage 8 — final gate before ship
1. A **fresh** set of QA agents runs a thorough **best-practices pass** and fixes findings (fresh
   eyes catch what the build team normalized).
2. Run the **UAT plan** — real-world acceptance scenarios from the build roadmap, tied to PRD
   requirements.
3. Run the **smoke-test plan** — critical-path checks on a deploy-like environment.
4. **Pre-ship gates** (parallel): `compliance-grc` (`/compliance-check` — SOC2/GDPR/VPAT),
   `performance-engineer` (`/perf-check` — load/stress vs SLA), `technical-writer` (`/docs-check` —
   docs-ready). All must sign off.
5. **Release & GA readiness**: `release-manager` (`/release` — versioning, CAB, go/no-go) +
   `devops-sre` (`/launch-readiness` — SRE launch checklist + staged/canary rollout).
6. **User-perspective acceptance** (the coordinator/orchestrator): dogfood the assembled build from
   the USER's POV — real end-to-end flows, the four states, broken-UI/cross-screen consistency. On
   any breakage, route the fix to the owning agent and re-check. This is the coordinator's acceptance;
   it does NOT replace the user's final sign-off.
◆ Present the acceptance result + all gates green-with-evidence; the **user gives the final go/no-go**, then ship.

## How to run it
- Dispatch the four Stage-7 lenses concurrently (one agent per lens) — don't serialize them.
- Aggregate: report per-lens pass/fail with evidence (test output, scan results, screenshots for
  a11y). Surface any blocker plainly; don't paper over a fail to advance.
- Re-run after fixes until clean. "Green" means actually green, observed.
