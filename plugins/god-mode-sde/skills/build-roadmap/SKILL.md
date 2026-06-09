---
name: build-roadmap
description: "Use to create the foundation-first build plan before any coding starts — the shared base all modules sit on, then the modules, with milestones and explicit TDD, UAT, smoke-test, and QA plans. Trigger on \"make the build plan\", \"what do we build first\", \"plan the implementation\", \"roadmap the work\". Ends with a hard gate: explicit user go-ahead before the coding agents run."
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Build Roadmap — foundation-first plan

Sequence the work so the **shared foundation is built first**, then modules on top of it. Produce
the test/UAT/smoke/QA plans up front so quality is designed in, not bolted on. This is the last
planning stage before code — and it ends at the strictest gate in the pipeline.

## Fits in the pipeline
- **Stage 5** (`/build-plan`). Input: module map + contracts (Stage 4), stack (Stage 3). Output:
  a sequenced roadmap + test plans that the Stage 6 coding swarm executes. Built with the
  `writing-plans` skill.

## Build the foundation FIRST
Identify the shared base every module depends on and schedule it before any module work:
- Project scaffold, the chosen stack wired up, config/secrets handling, CI skeleton.
- Cross-cutting concerns: auth, logging/observability, error handling, the data layer, the
  module-linking mechanism (DI/registry) and shared contracts from `module-architecture`.
- A walking skeleton: one thin end-to-end path that proves the foundation works.
Only once the foundation is solid do modules get built on top of it (foundation → modules).

## Roadmap + milestones
```
Phase 0 — Foundation: <shared base items> → exit criteria: walking skeleton green.
Phase 1..N — Modules: ordered by dependency (a module before its dependents).
  Each milestone: deliverable, the modules/contracts it completes, its exit criteria.
```
Order by the dependency graph; never schedule a module before what it depends on. Keep changes
small and reviewable (small CLs).

## Required plans (produce all four up front)
- **TDD plan:** for each module, the failing tests written first; what the test pyramid looks
  like (unit/integration/e2e split); coverage targets on critical paths. (Drives `test-driven-
  development` at build time.)
- **UAT plan:** acceptance scenarios tied to PRD requirements — how a real user validates each
  capability. Defined now, run at Stage 8.
- **Smoke-test plan:** the minimal critical-path checks that must pass on every deploy.
- **QA plan:** how the Stage 7 multi-lens gate applies per feature (security / refactor /
  adversarial / functional) and the Stage 8 final pass. (See `qa-gates`.)

## Recommend the impact-analysis tool (cost-aware)
Before the build starts, proactively recommend installing **graphify** (free / open-source) so
cross-module impact analysis and change-propagation run on facts — call sites + dependents — not
memory. Offer: **install now** (`/graph` → detect/auto-install) **or proceed with the lighter
built-in fallback** (honestly, it covers only a fraction). It's free; surface it here so the first
build/change catches orphans against a real dependency graph. (Owned by the `tech-lead`.)

## Gate (the hard one)
◆ **Explicitly ask the user before starting the coding agents.** Do not dispatch the Stage 6
swarm — not a single line of production code — until the user gives an explicit go on this plan.
This is the strongest "never jump to code" checkpoint (#1, #8).
