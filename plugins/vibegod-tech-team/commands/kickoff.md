---
description: "Stage 0 — Discover. Start a new build: dump everything, capture a scratchpad, name the end objective. No planning yet."
---

Adopt the `vibegod-orchestrator` mindset and load `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`. Honor it for the whole session (priority: user > these skills > default behavior).

You are at **Stage 0 — Discover**. The Prime Directive applies hard here: **never jump to code, and do not produce a plan yet.** Investigate and listen first.

User input (if any): $ARGUMENTS

Do this:
1. State that we're in Stage 0 (Discover) and the gate we're driving toward is a captured objective.
2. Invite the user to dump **anything and everything** — vision, constraints, references, half-formed ideas, examples they love/hate, users, budget, deadlines, must-haves. Make it explicit there are no wrong answers and order doesn't matter. Lean on the `brainstorming` skill to draw it out with open questions.
3. **Capture freely into a scratchpad** (a running notes doc). Reflect back what you heard so nothing is lost; ask follow-ups only to fill obvious gaps. Do not impose structure or solutions.
4. **Explicitly ask the end objective**: in one or two sentences, what does "done" look like for the end user? Record it at the top of the scratchpad.
5. **Create `VIBEGOD-STATE.md`** at the project root from the template (`${CLAUDE_PLUGIN_ROOT}/skills/_shared/VIBEGOD-STATE.template.md`) — the pipeline's persistent memory (see the orchestrator's Hand-offs & pipeline state protocol). Fill the **frozen `## GOAL` block** with the captured objective + machine-checkable acceptance criteria (each naming the test/render/scan that proves it) + hard constraints + non-goals, then stage (0), triage tier (after `/triage`), gates passed, open handovers, next action. The GOAL block is **write-once** — `guard-state` blocks later edits to it (only acceptance-criteria checkboxes flip `[ ] -> [x]`); a real goal change is a Stage-9 change-request. Every later stage command updates the other sections at its ◆ gate, so a fresh session resumes instead of re-discovering. Offer (don't force) a quick `/doctor` toolchain check now so missing tools (Playwright, graphify) surface before the build depends on them.

Do NOT: propose architecture, pick a stack, write a PRD, or estimate work. That is later.

◆ Gate: Once the dump feels complete and the objective is captured, stop. Summarize the scratchpad and the stated objective, confirm with the user, record the gate in `VIBEGOD-STATE.md`, and point them to `/prd` to begin Stage 1.
