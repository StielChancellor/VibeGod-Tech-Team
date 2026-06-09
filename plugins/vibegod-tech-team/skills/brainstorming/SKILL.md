---
name: brainstorming
description: Use BEFORE any creative or build work — creating features, components, functionality, a new project, or modifying behavior. Explores user intent, requirements, and design through one-question-at-a-time dialogue and produces an approved design/spec before any code. Triggers on "build/create/add/start a ...", vague feature requests, or any task where jumping to code would be premature.
---
<!-- Adapted from superpowers (https://github.com/obra/superpowers), MIT (c) Jesse Vincent. -->

# Brainstorming Ideas Into Designs

Turn ideas into fully formed designs and specs through natural, collaborative dialogue. This is the front door of the VibeGod pipeline — never start with code.

## Fits in the pipeline

This skill drives **Stage 0 (Discover, `/kickoff`)** and **Stage 1 (PRD & Brainstorm, `/prd`)** of the VibeGod Tech Team flow. The approved design becomes the seed of the PRD; the terminal handoff is `writing-plans` (Stage 5). Priority: **user > skills > default behavior**; the `_shared/vibegod-principles.md` apply throughout (esp. #1 think-before-coding, #2 simplicity, #3 modularity).

<HARD-GATE>
Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have presented a design and the user has approved it. This applies to EVERY project regardless of perceived simplicity. (vibegod-principles #1.)
</HARD-GATE>

## Anti-Pattern: "This Is Too Simple To Need A Design"

Every project goes through this. A todo list, a one-function utility, a config change — all of them. "Simple" projects are where unexamined assumptions cause the most wasted work. The design can be short (a few sentences for truly simple work), but you MUST present it and get approval.

## Checklist

Create a task for each item and complete them in order:

1. **Explore project context** — files, docs, recent commits. Never speculate about unopened code (principle #1).
2. **Scope check** — if the request describes multiple independent subsystems, flag it and decompose FIRST; don't refine details of a project that needs splitting.
3. **Ask clarifying questions** — one at a time; understand purpose, constraints, success criteria. Multiple-choice preferred.
4. **Propose 2-3 approaches** — trade-offs + your recommendation, lead with the recommended one and why. Where a choice is expensive, name a cheaper alternative and what's lost (principle #9).
5. **Present design** — in sections scaled to complexity; get approval after each section. Design for **full modularity** from the start: self-contained modules, dynamically linked, an upgrade in one propagates to dependents (FLOW-SPEC Stage 1).
6. **Write design doc** — save to `docs/vibegod/specs/YYYY-MM-DD-<topic>-design.md` and commit (user location preferences override).
7. **Spec self-review** — scan for placeholders, contradictions, ambiguity, scope (see below); fix inline.
8. **User reviews the written spec** — ask before proceeding.
9. **Transition** — invoke the `writing-plans` skill. That is the ONLY skill you invoke next.

## The Process

**Understanding the idea:**
- Check current project state first (files, docs, recent commits).
- Assess scope before detailed questions. If too large for a single spec, decompose into sub-projects (independent pieces, how they relate, build order). Each sub-project gets its own spec → plan → implementation cycle.
- For appropriately-scoped work, ask questions one at a time; multiple choice when possible; one question per message.
- Focus on purpose, constraints, success criteria.

**Exploring approaches:**
- Propose 2-3 approaches with trade-offs; lead with your recommendation and reasoning.

**Presenting the design:**
- Scale each section to its complexity (a sentence to ~300 words). Ask after each section whether it looks right.
- Cover: architecture, modules + interfaces/contracts, data flow, error handling, security boundaries (OWASP, principle #7), accessibility for UI (WCAG, principle #11), testing.
- Be ready to go back and clarify.

**Design for isolation and clarity:**
- Break the system into units with one clear purpose, well-defined interfaces, independently testable. For each unit: what does it do, how do you use it, what does it depend on?
- Can someone understand a unit without reading its internals? Can you change internals without breaking consumers? If not, the boundaries need work.

**Working in existing codebases:**
- Explore current structure first; follow existing patterns.
- Include targeted improvements where existing problems affect the work (oversized file, tangled responsibilities). Don't propose unrelated refactoring (principle #3).

## After the Design

**Documentation:** write the validated spec to `docs/vibegod/specs/YYYY-MM-DD-<topic>-design.md` and commit.

**Spec self-review** (fresh eyes):
1. **Placeholder scan** — "TBD", "TODO", incomplete sections, vague requirements? Fix them.
2. **Internal consistency** — sections contradict? Architecture match the features?
3. **Scope check** — single implementation plan, or needs decomposition?
4. **Ambiguity check** — any requirement readable two ways? Pick one, make it explicit.

Fix inline; no re-review.

**User review gate:**
> "Spec written and committed to `<path>`. Please review it and tell me if you want changes before we write the implementation plan."

Wait. If changes requested, make them and re-run the spec review. Proceed only on approval (◆ gate, principle #10).

**Implementation:** invoke `writing-plans`. Do NOT invoke any other skill.

## Key Principles

- **One question at a time** — don't overwhelm.
- **Multiple choice preferred** — easier to answer.
- **YAGNI ruthlessly** — remove unnecessary features (principle #2).
- **Explore alternatives** — always 2-3 approaches.
- **Incremental validation** — approval before moving on.
- **Be flexible** — go back when something doesn't make sense.
