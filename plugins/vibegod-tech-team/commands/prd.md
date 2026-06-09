---
description: Stage 1 — Co-author the PRD from the objective (modular by default). Gates on user PRD approval.
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

You are at **Stage 1 — PRD & Brainstorm**. Still no code. Build the requirements before anything downstream.

Scope / notes from the user: $ARGUMENTS

Do this:
1. State the stage and the gate (user approves the PRD). Pull in the Stage 0 scratchpad/objective if it exists; if there's no objective yet, run a quick discovery first or send the user to `/kickoff`.
2. Delegate to the **product-manager** subagent and drive it with the **prd-authoring** skill; use **brainstorming** to pressure-test scope, surface alternatives, and expose hidden requirements. Don't silently pick between interpretations — present them.
3. Co-author (or update) the PRD: problem, users, goals/non-goals, functional + non-functional requirements, success metrics, constraints, risks. Bake in compliance up front: **WCAG 2.2 AA** accessibility and **OWASP** security expectations.
4. **Modular by default**: design every module to be self-contained and dynamically linked, so an upgrade in one module propagates to its dependents. Call out the seams.
5. Keep it terse and decision-led; flag assumptions and open questions explicitly.

◆ Gate: Present the PRD for review. STOP and get explicit approval/edits before advancing. Only when the user approves, point to `/journey` (Stage 2).
