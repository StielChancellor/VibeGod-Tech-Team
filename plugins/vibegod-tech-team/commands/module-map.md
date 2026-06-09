---
description: Stage 4 — Decompose the PRD into modules with explicit inter-module contracts (API/events/protocol). Gates on decomposition sign-off.
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

You are at **Stage 4 — Module Map & Interfaces**. Requires cost sign-off (Stage 3). Still no code.

Notes from the user: $ARGUMENTS

Do this:
1. State the stage and the gate (user confirms the decomposition).
2. Delegate to the **solution-architect** subagent, driven by the **module-architecture** skill (and the `platform-blueprint` skill for the system blueprint/ADRs). Decompose the PRD into **self-contained modules**, dynamically linked so an upgrade in one propagates to dependents.
3. For each module define: responsibility, owned data, and **explicit contracts** — how it talks to other modules (API / events / other protocol), inputs/outputs, and versioning. Map the dependency graph between modules.
4. Identify the **foundation** (the shared base every module sits on) so Stage 5 can build it first. Call out cross-cutting concerns (auth, logging, error handling) and where security boundaries fall.

◆ Gate: Present the module map + contracts + dependency graph. STOP for the user to confirm the decomposition. Only on confirmation, point to `/build-plan` (Stage 5).
