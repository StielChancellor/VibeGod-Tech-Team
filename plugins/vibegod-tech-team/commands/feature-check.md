---
description: Stage 7 — Run the 4 QA lenses IN PARALLEL (security, quality, adversarial, functional+no-orphans). Advance only when all pass.
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

You are at **Stage 7 — Per-Feature QA Gate**. Runs before closing EACH feature. Pass is **evidence-based only** — a lens passes when it has actually run and verified, never on assertion.

Feature under review: $ARGUMENTS

Do this:
1. State the stage and the gate (all four lenses pass → feature closes). Drive with the **qa-gates** skill.
2. Dispatch these four QA lenses **IN PARALLEL** (do not serialize):
   - **security-engineer** — OWASP + cyber best practices: authz at boundaries, input validation/output encoding, secrets handling, dependency/SCA scan, no injection sinks.
   - **code-quality-reviewer** — simplify/refactor where warranted: dead code, duplication, readability, surgical-change discipline, anti-overeagerness.
   - **adversarial-tester** — attack the feature: edge cases, boundaries, races, malformed input; find and fix defects.
   - **qa-engineer** — functional QA from frontend, backend, USER, and code perspectives, INCLUDING the **consistency / no-orphans check**: UI ↔ backend in sync, every call site of changed code updated, no dead/orphaned code, WCAG 2.2 AA + cross-browser/perf budgets for UI.
3. Aggregate per-lens results with evidence (test output, scan results, a11y screenshots). Each lens fixes what it finds (or files it precisely) before declaring pass. Re-run after fixes until clean.

◆ Gate: A single failing lens blocks the feature — surface it plainly, do not paper over it. **Only when all four confirm green** does the feature close and the swarm move to the next task (back to `/build`). When all features are done, point to `/ship-check` (Stage 8).
