---
name: module-architecture
description: Use to decompose the system into self-contained modules and define exactly how they communicate — API/events/protocol contracts, dynamic linking, and how upgrades propagate to dependents. Trigger on "break this into modules", "define the interfaces", "how do these services talk", "module map", "what are the contracts". Runs after the stack is confirmed and before the build plan.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Module Architecture — modules and their contracts

Turn the blueprint's component view into a concrete module map: self-contained modules with
explicit interfaces, dynamically linked, where an upgrade in one module propagates safely to its
dependents (#6, modular-by-default). The goal is loose coupling with contracts you can verify.

## Fits in the pipeline
- **Stage 4** (`/module-map`). Input: approved stack (Stage 3) + journey + blueprint. Output: a
  module map + contracts that the foundation-first build plan (Stage 5) is built on.
Owned by `solution-architect`.

## What to produce

### 1. Module decomposition
List the modules. Each module is **self-contained**: owns its data and logic, exposes a narrow
interface, hides its internals. For each:
```
Module: <name>
Responsibility: one sentence — what it owns (single responsibility).
Owns: data/state it is the source of truth for.
Depends on: which other modules' contracts it consumes.
Exposes: the contract other modules use (see below).
```
Don't over-decompose — a simple product may be a modular monolith, not 12 services. Match the
decomposition to the actual complexity (senior-engineer test).

### 2. Communication & contracts (be explicit)
For each link between modules, name the mechanism and pin the contract:
- **Synchronous API:** endpoint/method signature, request/response schema, error semantics,
  versioning policy, auth.
- **Events/async:** event name, payload schema, producer, consumers, ordering/delivery guarantees
  (at-least-once? idempotency required?).
- **Other protocol:** gRPC/queue/shared-store — state the contract and its invariants.
The contract is the boundary. Internals can change freely as long as the contract holds.

### 3. Dynamic linking & upgrade propagation
Define how modules bind at runtime (DI, service registry, config, package versions) so a
dependency can be swapped/upgraded without rewiring consumers. Specify the **upgrade-propagation
rule**: when a module's contract changes, every dependent is identified and updated, and a
compatibility/version strategy (semver, contract tests, deprecation window) prevents silent breaks.
This is the structural backbone the `change-propagation` skill relies on at Stage 9.

### 4. Boundary diagram
A Mermaid graph of modules as nodes and contracts as labeled edges (API/event/protocol). Mark
trust boundaries for the `security-engineer`.

## Consistency check
Every PRD requirement and journey step must land in exactly one owning module — no orphaned
behavior, no two modules silently owning the same data. Flag overlaps and gaps.

## Gate
◆ The user confirms the decomposition and contracts before Stage 5. Changes here re-enter via
the PRD (Stage 9), not by editing the module map in isolation.
