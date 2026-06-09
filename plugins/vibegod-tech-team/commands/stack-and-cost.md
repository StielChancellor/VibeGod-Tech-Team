---
description: Stage 3 — Design the full stack with implementation/run cost plus a cheaper alternative and tradeoffs. HARD gate on cost sign-off.
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

You are at **Stage 3 — Tech Stack & Cost**. Requires an approved journey (Stage 2). Still no code.

Notes / constraints from the user: $ARGUMENTS

Do this:
1. State the stage and the gate (user confirms COST). This is a **hard gate** — do not proceed past it without explicit cost sign-off.
2. Delegate to the **solution-architect** subagent, driven by the **tech-stack-and-cost** skill. Design the full stack derived from FE + BE + UI/UX + the end outcome in the PRD/journey. Justify each choice against the actual requirement (no speculative tech).
3. Show the **implementation cost AND run cost** (build effort + ongoing $/infra/licenses). For every expensive choice, present a **cheaper alternative with pros/cons and exactly WHAT IS LOST** by going cheaper (cost-aware engineering, principle #9). Flag the high-cost decisions explicitly.
4. Note security and accessibility implications of the stack (OWASP-aligned libraries, a11y-capable UI framework).

◆ Hard gate: Present stack + cost + alternatives side by side. STOP and get the user to finalize/confirm the cost before anything proceeds. Only on sign-off, point to `/module-map` (Stage 4).
