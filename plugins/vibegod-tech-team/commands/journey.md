---
description: Stage 2 — Map the full FE+BE UX journey via a frontier-model agent (Mermaid simple / interactive canvas complex). Gates on journey approval.
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

You are at **Stage 2 — Journey / Flow Canvas**. Requires an approved PRD (Stage 1). Still no production code.

Notes / focus from the user: $ARGUMENTS

Do this:
1. State the stage and the gate (user approves the journey). Confirm the PRD is approved; if not, route to `/prd`.
2. Delegate to the **ui-ux-designer** subagent **at the frontier (highest) model**, driven by the **journey-mapping** skill. Map the complete flow — **frontend AND backend UI/UX** — every screen, state, transition, and the backend touchpoints behind them.
3. Choose the representation per the `journey-mapping` skill: **Mermaid for simple journeys; for complex ones, the static single-file canvas** (`canvas/journey-canvas.html` — inject the journey JSON into the `__JOURNEY_DATA__` token and Write it to `journey.html`; no server). **Generate for readability:** happy path ≤ ~12 boxes, swimlanes, plain-language labels (never technical ids), and error/loading/empty states collapsed as `level:"detail"` under their parent (progressive disclosure).
4. Honor accessibility (WCAG 2.2 AA) in the flow itself — keyboard paths, focus order, error/empty/loading states.

◆ Gate: Present the journey. The user opens `journey.html`, redlines it, and clicks **Copy JSON** to paste the approved journey back into the chat (treat the pasted JSON as approved). Also keep a happy-path Mermaid snapshot for diffability. STOP for approval; only then point to `/stack-and-cost` (Stage 3).
