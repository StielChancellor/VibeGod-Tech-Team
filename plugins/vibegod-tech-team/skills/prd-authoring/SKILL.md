---
name: prd-authoring
description: Use to create or maintain the Product Requirements Document — the source of truth for what is being built. Trigger at project kickoff ("let's build X", "write the PRD", "what are the requirements") and on ANY feature change/add/removal, which re-enters here first. Starts from the end objective, lets the user dump everything before any planning, and designs for modularity by default. Never jumps to a solution or a plan.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# PRD Authoring — the source of truth

The PRD is the root artifact every downstream stage derives from. Get it right and propagate
from it. **Never jump to a plan or a solution from the PRD stage** (#1) — the PRD captures
*what* and *why*, not *how*.

## Fits in the pipeline
- **Stage 1** (`/prd`) — co-author the PRD from the objective, using the `brainstorming` skill.
- **Stage 9** (`/change-request`) — EVERY change re-enters here first, then propagates downstream
  via `change-propagation`. Editing code before the PRD is a process violation.
Owned by `product-manager`.

## Operating rules
1. **End-objective first.** Open by asking the single end objective: what does success look like
   for the user/business? Everything else hangs off this.
2. **Let the user dump everything.** Invite them to share anything and everything — context,
   constraints, half-formed ideas, references — before you structure anything. Capture freely
   into a scratchpad. Do NOT start planning, designing, or estimating yet.
3. **Reflect, then structure.** Once the dump is done, organize it into the PRD below, asking
   targeted questions only where a material gap exists. Present interpretations when ambiguous;
   don't pick silently.
4. **Modular by default.** Frame requirements so the system decomposes into self-contained
   modules, dynamically linked, where an upgrade in one propagates to dependents. This framing
   carries into `platform-blueprint` (Stage 1/3) and `module-architecture` (Stage 4).
5. **No solutioning.** Capture requirements and constraints, not the tech stack or the build plan
   — those are Stage 3 and Stage 5.

## PRD structure
```
# PRD: <product>
## Objective            — the one end goal; what success looks like.
## Problem & context    — who has the problem, why now, what exists today.
## Users & personas     — who uses it; their goals.
## Scope                — in / out (be explicit about out-of-scope).
## Requirements (modular)
   For each module/capability: user-facing behavior, acceptance criteria,
   dependencies on other modules, the contract it exposes.
## Non-functional needs — pointers to NFRs (scale/latency/cost/security/privacy → blueprint).
## Constraints & assumptions — budget, timeline, compliance, platforms. Flag unknowns.
## Open questions       — anything still unresolved (don't paper over gaps).
## Success metrics      — how we'll know it worked.
```

## Change management (Stage 9) — the FULL PRD, not a patch
When a change arrives:
1. Edit the **full PRD** — update scope, the affected module's requirements/acceptance criteria,
   dependencies, and any open questions. Keep it internally consistent (no orphaned requirements).
2. Note which downstream artifacts the change touches (blueprint, roadmap, code) and hand off to
   `change-propagation` to flow it end-to-end. The PRD is never edited in isolation.

## Gate
◆ The user reviews and edits the PRD before Stage 2. Don't advance to journey/stack/build until
the PRD is approved.
