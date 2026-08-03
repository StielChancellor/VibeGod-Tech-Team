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
5. **Diverge before committing — do NOT just write down the first idea.** Drive this with the **`brainstorming`** skill and the **`ux-researcher`** subagent. Offer **two or three genuinely different product shapes** that would satisfy the stated objective — narrower/faster, richer/slower, a different framing of the problem — each with its rough cost, what it wins, and what it gives up. **Recommend one and say why.** The user's job is to pick an outcome, not to design a system; this is the single step where you are most useful, because a wrong shape chosen here cannot be recovered by any amount of good engineering downstream. Only once they choose do you write the objective and acceptance criteria.
6. **Agree the ENVELOPE — ask these four in plain business language.** They are the boundary the team then works inside without stopping to ask permission at every stage, so get real answers, don't assume defaults:
   - **"What's your hard ceiling for this project, and over what period?"** — e.g. *"£5,000 covering build plus the first 12 months of running."* One number. It covers **build and run together**; a ceiling needs a horizon because build cost is one-time and run cost recurs (default to 12 months if they don't say). State plainly that you will stop and ask rather than cross it.
   - **"Will this handle payments, personal data, health data, or user logins?"** — anything they name is declared and worked on under its constraints; anything they *don't* name will stop the run if the work reaches it.
   - **"Is there anything I must ask you about before doing it?"** — e.g. deleting user data, emailing real users, touching production, publishing anything.
   - **"Do you want to hear about every meaningful choice, or only when something is expensive or risky?"** — this one they can change at any time.
7. **Secrets hygiene (do this before any code exists).** Confirm the project's `.gitignore` covers
   `.env` and `.env.*` (keeping `!.env.example`); add it if missing, creating `.gitignore` if there is
   none. Prevention is the point — `guard-commit` hard-blocks a recognisable credential reaching a
   commit, and this is what should mean it never has to fire. A secret that reaches a commit is in the
   history even after deletion, and must be rotated if it was ever pushed.
8. **Create `VIBEGOD-STATE.md`** at the project root from the template (`${CLAUDE_PLUGIN_ROOT}/skills/_shared/VIBEGOD-STATE.template.md`) — the pipeline's persistent memory (see the orchestrator's Hand-offs & pipeline state protocol). Fill the **`## ENVELOPE`** block with the four answers from step 6, then the **frozen `## GOAL` block** with the captured objective + machine-checkable acceptance criteria (each naming the test/render/scan that proves it) + hard constraints + non-goals, then stage (0), triage tier (after `/triage`), gates passed, open handovers, next action. The GOAL block is **write-once** — `guard-state` blocks later edits to it (only acceptance-criteria checkboxes flip `[ ] -> [x]`); a real goal change is a Stage-9 change-request. (Enforced on the file-edit path; no hook guards the file against shell commands, so commit it to git — the history is what proves the goal never moved.) Every later stage command updates the other sections at its ◆ gate, so a fresh session resumes instead of re-discovering. Offer (don't force) a quick `/doctor` toolchain check now so missing tools (Playwright, graphify) surface before the build depends on them.

Do NOT: propose architecture, pick a stack, or write a PRD. That is later. The rough costs in step 5 are **order-of-magnitude shape comparisons** to help the user choose ("roughly £2k vs roughly £8k"), not an estimate of the work — costing the chosen stack is Stage 3.

◆ Gate: Once the dump feels complete, a shape is chosen, the objective is captured and the envelope is agreed, stop. Summarize the scratchpad, the chosen shape (and what it ruled out), the stated objective and the four envelope answers; confirm all of it with the user; record the gate in `VIBEGOD-STATE.md`; and point them to `/prd` to begin Stage 1. **The envelope is the contract the rest of the pipeline works inside — if it is vague here, everything downstream inherits the vagueness, and there are far fewer gates later to catch it.**
