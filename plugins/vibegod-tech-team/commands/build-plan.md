---
description: Stage 5 — Foundation-first build roadmap with milestones and TDD/UAT/smoke/QA plans. EXPLICIT go-before-coding gate.
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

You are at **Stage 5 — Build Plan (foundation-first)**. Requires a confirmed module map (Stage 4). This is the **last gate before any code is written** — treat it as the explicit go/no-go.

Notes from the user: $ARGUMENTS

Do this:
1. State the stage and the gate: **explicit user GO before starting the coding agents.**
2. Drive the plan with the **writing-plans** and **build-roadmap** skills. Build the **foundation FIRST** (the shared base all modules sit on), then modules in dependency order.
3. Produce: coding **roadmap + milestones**, plus the **TDD plan, UAT plan, smoke-test plan, and QA plan**. Each milestone has verifiable success criteria. Tie QA back to the Stage 7 four-lens model and Stage 8 UAT/smoke.
4. State how the swarm will run (which agents, worktree isolation for parallel work, TDD throughout) without launching anything yet.
5. **Recommend impact-analysis tooling (tech-lead, cost-aware):** proactively recommend installing **graphify** (free/OSS) for real cross-module impact analysis via `/graph` — or proceed with the lighter built-in fallback (honest: it covers only a fraction). Surface it HERE so the first build/change operates on a real dependency graph (call sites + dependents), not memory — catching orphans early.

◆ EXPLICIT gate: Present the full plan and **ask the user, in plain terms, for the go-ahead to start coding.** Do NOT dispatch any coding agent until they say go. On approval, point to `/build` (Stage 6).
