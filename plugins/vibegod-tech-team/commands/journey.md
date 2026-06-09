---
description: Stage 2 — Map the full FE+BE UX journey via a frontier-model agent (Mermaid simple / interactive canvas complex). Gates on journey approval.
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

You are at **Stage 2 — Journey / Flow Canvas**. Requires an approved PRD (Stage 1). Still no production code.

Notes / focus from the user: $ARGUMENTS

Do this:
1. State the stage and the gate (user approves the journey). Confirm the PRD is approved; if not, route to `/prd`.
2. Delegate to the **ui-ux-designer** subagent **at the frontier (highest) model**, driven by the **journey-mapping** skill. Map the complete flow — **frontend AND backend UI/UX** — every screen, state, transition, and the backend touchpoints behind them.
3. Choose the representation per the `journey-mapping` skill: **Mermaid diagram for simple journeys; auto-switch to the interactive local drag-and-drop canvas for complex ones**, so the user can rearrange steps, add comments, connect nodes, and insert sections. Edits persist to a JSON the agent reads back. Keep it modular.
4. Honor accessibility (WCAG 2.2 AA) in the flow itself — keyboard paths, focus order, error/empty/loading states.

◆ Gate: Present the journey. STOP for the user to approve or improve it (and re-read the canvas JSON if they edited it). Only on approval, point to `/stack-and-cost` (Stage 3).
