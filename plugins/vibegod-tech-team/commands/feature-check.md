---
description: Stage 7 — Run the QA lenses IN PARALLEL — 4 core (security, quality, adversarial, functional+no-orphans) plus the ux-design-reviewer render for UI features and performance-engineer for perf-sensitive ones. Advance only when every applicable lens passes.
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

**State — read first, write last.** Read `VIBEGOD-STATE.md` and resume from `In flight:`; never redo work already recorded as done. On completion record each lens verdict per feature under `## PER-FEATURE LENS STATUS` **with its `verified:` signal** (commit SHA, command + result, or render-report path) — the GOAL block demands proof rather than self-report for acceptance criteria, and a lens tick with nothing behind it is exactly the self-report it bans. If you cannot name the signal, it is a `?`, not a pass, update `In flight:` / `Blocked on:`, and append the decision **and the alternative it ruled out** to `## DECISIONS`.

You are at **Stage 7 — Per-Feature QA Gate**. Runs before closing EACH feature. Pass is **evidence-based only** — a lens passes when it has actually run and verified, never on assertion.

Feature under review: $ARGUMENTS

Do this:
1. State the stage and the gate (all four lenses pass → feature closes). Drive with the **qa-gates** skill.
2. Dispatch these four QA lenses **IN PARALLEL** (do not serialize):
   - **security-engineer** — OWASP + cyber best practices: authz at boundaries, input validation/output encoding, secrets handling, dependency/SCA scan, no injection sinks.
   - **code-quality-reviewer** — simplify/refactor where warranted: dead code, duplication, readability, surgical-change discipline, anti-overeagerness.
   - **adversarial-tester** — attack the feature: edge cases, boundaries, races, malformed input; find and fix defects.
   - **qa-engineer** — functional QA from frontend, backend, USER, and code perspectives, INCLUDING the **consistency / no-orphans check**: UI ↔ backend in sync, every call site of changed code updated, no dead/orphaned code, WCAG 2.2 AA + cross-browser/perf budgets for UI. **For call-site/dependency/orphan/impact questions use graphify, NOT grep** (`G="$(cat .graphify-path 2>/dev/null || echo graphify)"; $G affected/explain "<symbol>"`; grep only confirms a literal string; no graph yet → run `/graph`).
   - **ux-design-reviewer (any feature with UI — REQUIRED live render):** render the feature across the breakpoint matrix with `visual-check` (`${CLAUDE_PLUGIN_ROOT}/skills/ui-ux-excellence/tools/visual-check.mjs`; **install Playwright if missing — do not skip**) and gate on `ui-ux-excellence`. A UI feature **cannot close without a live render** (screenshots / `report.json` you looked at); static analysis can only FAIL, never PASS. No render possible → **BLOCKED**, not pass.
3. Aggregate per-lens results with evidence (test output, scan results, **the visual-check report/screenshots for UI**). Each lens fixes what it finds (or files it precisely) before declaring pass. Re-run after fixes until clean.

◆ Gate: A single failing lens blocks the feature — surface it plainly, do not paper over it. **Only when every applicable lens confirms green** — the four core lenses, plus the **ux-design-reviewer render lens for any UI feature** — does the feature close and the swarm move to the next task (back to `/build`). When all features are done, point to `/ship-check` (Stage 8).

<!-- Under consequence-based gating this is NOT an automatic stop. Present the result, record it in
     VIBEGOD-STATE.md, and CONTINUE — unless a trigger fires (cost · undeclared sensitive domain ·
     irreversibility or the must-ask list · scope drift · genuine ambiguity · repeated failure), or the
     tier in `change-risk-triage` says this one stops. The user is the visionary: bring them decisions at
     outcome altitude, not artifacts for approval. -->
