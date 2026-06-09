---
description: Stage 6 — Dispatch the coding swarm (foundation then modules) with TDD and worktree isolation. Each feature proceeds to /feature-check.
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

You are at **Stage 6 — Build (coding swarm)**. **Precondition: Stage 5 build-plan sign-off.** If the build plan is not explicitly approved, STOP and route to `/build-plan` — do not write code.

Notes / scope from the user: $ARGUMENTS

Do this:
1. Confirm the Stage 5 go is in hand. State that we're executing the approved roadmap.
2. Dispatch the coding swarm via the **dispatching-parallel-agents** skill, with **test-driven-development** throughout (failing test → pass → refactor). Use **using-git-worktrees** for isolated parallel work.
3. Order: **foundation first, then modules in dependency order.** **Design before code:** for any
   UI, the **ui-ux-designer** first produces the design spec (tokens/components/states/responsive);
   engineers implement it — they do not make design decisions. Delegate by department:
   - **ui-ux-designer** — the design spec + journey the frontend implements (design only, no code).
   - **frontend-engineer** — implements the designer's spec to the token; sends feasibility feedback
     back to the designer; keeps UI in sync with the backend.
   - **backend-engineer** — services, APIs, contracts.
   - **data-engineer** — data models, pipelines, migrations.
   - **devops-sre** — infra, CI, deploy.
   - **ai-agent-engineer** — any AI/agent features.
4. Follow the principles: surgical changes, no speculative scope, OWASP-secure defaults, and end-to-end consistency (no orphans) as each piece lands.
5. As **each feature** reaches working state, hand it to **`/feature-check`** (Stage 7) — do not self-certify a feature as done here.

Operate autonomously within the build, but surface blockers and material deviations from the plan. When a feature is implemented, advance it to `/feature-check`.
