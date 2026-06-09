---
name: change-propagation
description: Use on EVERY add, change, or delete to a feature or behavior to flow it end-to-end through all artifacts and code with no orphans left behind. Trigger on "change this feature", "add/remove X", "update the behavior", "rename", "refactor across the codebase", or whenever a modification touches more than one place. Enforces PRD -> blueprint -> code roadmap -> graphify -> actual code, updates every call site, and keeps UI and backend in sync.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Change Propagation — no orphans, ever

The most common failure mode is a change applied in one place and forgotten everywhere else: a
half-wired feature, a UI button with no backend, dead code, a stale doc. This skill exists to
make every change propagate completely. It is the operational form of principle #6.

## Fits in the pipeline
- **Stage 9** (`/change-request`) — the formal change path.
- **Continuous** — applies to ANY modification at any stage, not only formal change requests.

## The propagation chain (in order — never skip a link)
Every add/change/delete flows through, in this order:

**PRD → blueprint → code roadmap → graphify → actual code**

1. **PRD** (`prd-authoring`): re-enter at the PRD stage. Edit the full PRD — scope, the affected
   requirements, acceptance criteria, dependencies. Never start by editing code.
2. **Blueprint** (`platform-blueprint` / `module-architecture`): update affected NFRs, ADRs,
   module responsibilities, and any contract that changed. A changed contract triggers the
   upgrade-propagation rule for its dependents.
3. **Code roadmap** (`build-roadmap`): update the plan/milestones and the TDD/UAT/smoke/QA plans
   for the change.
4. **Graphify** (`codebase-knowledge-graph`): refresh the codebase knowledge graph (or the
   lighter fallback) so impact analysis reflects reality before touching code.
5. **Actual code**: implement, then propagate through the code itself (below).

## In-code propagation — update EVERY reference
Treat the codebase as a graph, not a file:
1. **Find all references** — search the whole repo for the symbol/endpoint/event/UI string being
   changed (use graphify's impact set; cross-check with Grep). Don't trust memory.
2. **Trace the full path:** data model → API/contract → frontend → **every call site** → docs →
   tests. Update them all in the same change.
3. **UI ↔ backend sync:** no UI element without a working backend; no backend feature the UI
   still advertises after removal; no feature working in one place but not another.
4. **Remove orphans the change created:** delete code made unreachable by the change, after
   confirming nothing depends on it. Surgical — don't delete unrelated code.
5. **Verify:** tests green, no dangling references, the consistency/no-orphans lens passes (this
   is exactly what `qa-engineer` checks at Stage 7).

## Discipline
- Scope strictly to the change (#3) — propagate the change everywhere, but don't "improve"
  unrelated code along the way.
- If the blast radius is larger than expected, surface it before proceeding — don't quietly
  rewrite half the system.
- A change isn't done when the code compiles; it's done when every link in the chain and every
  call site is consistent and verified.
