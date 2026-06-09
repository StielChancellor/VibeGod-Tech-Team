---
description: Stage 9 — Any change re-enters at the PRD and propagates downstream (PRD→blueprint→roadmap→graphify→code). Never starts by editing code.
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

You are at **Stage 9 — Change Management**. Hard rule: **ANY change re-enters at the PRD stage. Never start by editing code.**

Requested change: $ARGUMENTS

Do this:
1. State the stage and that the change re-enters at the PRD. Delegate to the **product-manager** subagent and drive the propagation with the **change-propagation** skill.
2. **Edit the full PRD** (and the remaining downstream artifacts) to reflect the add/change/delete — not just a patch note. Update goals/non-goals, requirements, and journey impact.
3. Propagate the change **in order, end to end**:
   **PRD → blueprint → code roadmap → graphify → actual code.**
   - Update the PRD (product-manager) and the blueprint/module map (solution-architect, `module-architecture`).
   - Update the build roadmap (`build-roadmap`).
   - Refresh the codebase knowledge graph via **`/graph`** to get the accurate impact set / call sites.
   - Only then touch code — surgically, with TDD, removing any orphans the change creates.
4. Re-run the gates the change touches: **`/feature-check`** for affected features, and **`/ship-check`** before re-shipping. Keep UI ↔ backend in sync throughout.

◆ Gate: Confirm the revised PRD/blueprint with the user before propagating into code. Do not skip a downstream stage.
