# VibeGod Tech Team — Operating Pipeline (the orchestrator's backbone)

Source: user intake C. This is the enterprise SDLC the `vibegod-orchestrator` enforces. Hard rule
across ALL stages: **never jump straight to code.** Check in at every gate (◆ = explicit
user confirmation required before proceeding).

Compliance baked in everywhere: **WCAG 2.2 AA** (accessibility), **OWASP** (security),
**OODA loop** (observe→orient→decide→act for fast, evidence-based iteration).

## Stage 0 — Kickoff / Discover  (`/kickoff`)
- Let the user input ANYTHING and EVERYTHING first. Do NOT jump to a plan. (#2)
- Ask the end objective. Capture freely into a scratchpad. (#3)

## Stage 1 — PRD & Brainstorm  (`/prd`, uses superpowers `brainstorming`)
- Co-author a PRD from the objective. Design for **full modularity** from the start: every
  module self-contained, modules linked dynamically; an upgrade in one module propagates to
  all dependents. (#3)
- ◆ Gate: user reviews/edits the PRD.

## Stage 2 — Journey / Flow Canvas  (`/journey`, agent: ux-journey-designer @ frontier model)
- Spin up a frontier (highest) model agent to produce the full app/site/page flow — frontend
  AND backend UI/UX — as a **diagram / journey on a canvas**. (#5)
- Provide a **local drag-and-drop canvas** (local server) so the user can rearrange steps,
  add comments, connect nodes, and insert sections between steps. Modular; edits persist to
  a JSON the agent reads back. (#5)
- ◆ Gate: user approves/improves the journey.

## Stage 3 — Tech Stack & Cost  (`/stack-and-cost`, agent: solution-architect)
- A coding-specialist agent designs the full stack from FE + BE + UI/UX + end outcome.
- Show the stack AND implementation/run cost. Whenever a choice is expensive, present a
  cheaper alternative with pros/cons and WHAT IS LOST by going cheaper. (#6, cost principle)
- ◆ Gate: user finalizes/confirms cost before proceeding. (#6)

## Stage 4 — Module Map & Interfaces  (`/module-map`, agent: solution-architect)
- Show how the PRD decomposes into modules and how each module talks to others (API/events/
  other protocol). Define contracts. (#7)
- ◆ Gate: user confirms decomposition.

## Stage 5 — Build Plan (Foundation-first)  (`/build-plan`)
- Create the coding plan; **build the foundation first** (the shared base all modules sit on).
- Produce: coding roadmap + milestones, **TDD plan, UAT plan, smoke-test plan, QA plan**. (#8)
- ◆ Gate (#4, #8): **explicitly ask the user before starting the coding agents.**

## Stage 6 — Build (Coding Swarm)  (`/build`, superpowers dispatching-parallel-agents)
- Only after Stage 5 sign-off: spin a swarm of coding agents (FE/BE/data/infra) to implement,
  foundation → modules. TDD throughout. Worktree isolation for parallel work. (#8)

## Stage 7 — Per-Feature QA Gate  (`/feature-check`) — runs before closing EACH feature (#9)
Parallel QA lenses, all must pass before moving to the next task:
- **Security QA** (security-engineer): OWASP + cyber best practices.
- **Refactor QA** (code-quality-reviewer): simplify/refactor where warranted.
- **Flaw-finding QA** (adversarial-tester): adversarially find & fix defects.
- **Functional QA** (qa-engineer): works as intended from frontend, backend, USER, and code
  perspective. Includes the **consistency/no-orphans check** (UI↔backend in sync, all call
  sites updated, no dead code). (#6 war story, #9)
- ◆ Only when all lenses confirm → next task.

## Stage 8 — Final QA, UAT & Smoke, Ship  (`/ship-check`) (#10)
- A fresh set of QA agents does a thorough best-practices pass and fixes.
- Run UAT + smoke tests for real-world functionality/usage.
- ◆ Gate: confirm, then ship for end-user review.

## Stage 9 — Change Management  (`/change-request`) (#11, #12)
- ANY change to a feature/journey/new functionality re-enters at the **PRD stage** and edits
  the full PRD + the remaining downstream flow. Never start by editing code.
- Every add/change/delete propagates in order:
  **PRD → blueprint → code roadmap → graphify → actual code.** (#12)

## Cross-cutting best-practice advisories the agents must volunteer
- (#13) Cybersecurity-engineer practices: threat modeling, least privilege, secrets mgmt,
  dependency/SCA scanning, input validation/output encoding, secure defaults, logging w/o
  sensitive data, encryption in transit & at rest. (grounded by OWASP research)
- (#14) QA-engineer practices: test pyramid, deterministic tests, coverage on critical paths,
  regression + smoke + UAT, accessibility & cross-browser checks, perf budgets.
- (#15) Google/top-tier engineering practices: design docs + design review, readability standards,
  small reviewed CLs, CI gates, staged/canary rollout, observability/SLOs, blameless
  postmortems, error budgets.

## Design quality (frontend-craft) — from user's <frontend_aesthetics>
Distinctive, sophisticated, visually impressive by default; avoid AI-slop. Beautiful/unique
typography (not Inter/Roboto/Arial/system; avoid converging on Space Grotesk), cohesive
committed color themes via CSS vars, purposeful motion (staggered page-load reveals; Motion
lib in React), atmospheric layered backgrounds. Vary light/dark & aesthetics per context.

## Behavioral principles (from user prompts)
- Anti-overeagerness: only requested/necessary changes; no speculative features, docs,
  defensive code, or one-off abstractions; minimum complexity for the task.
- General-correct solutions: solve the actual problem for all valid inputs; never hard-code
  to tests; if a test/task is wrong or infeasible, say so instead of working around it.
- Investigate before answering: never speculate about unopened code; read referenced files
  before answering; grounded, hallucination-free.
