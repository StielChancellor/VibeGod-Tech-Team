---
name: platform-blueprint
description: Use when defining the enterprise architecture of a non-trivial system — Architecture Decision Records (ADRs), non-functional requirements (scale, latency, cost, security, privacy), C4-style views, and a threat-model hook. Trigger when the user asks to "design the architecture", "write an ADR", "what are the NFRs", "how should this be structured at scale", or after the PRD is approved and before stack selection. Produces a modular-by-default decomposition the rest of the pipeline builds on.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Platform Blueprint — enterprise architecture

The architecture layer that sits atop brainstorming/writing-plans. Turn an approved PRD into a
defensible, modular system design with decisions recorded and tradeoffs surfaced. Investigate
first: read the PRD and any existing code before asserting structure. Never invent constraints
the user didn't give — ask when a critical NFR (scale, budget, latency target) is unknown.

## Fits in the pipeline
- **Stage 1** (alongside `/prd`) to frame NFRs and architectural constraints early.
- **Stage 3** (`/stack-and-cost`) — NFRs drive stack choices and the cost conversation.
- **Stage 4** (`/module-map`) — the C4 container/component views become the module decomposition.
Owned by `solution-architect`. Re-entered on any Stage 9 change that shifts a system property.

## What this skill produces

### 1. Non-functional requirements (NFRs) — make them measurable
For each, capture a target, not an adjective. "Fast" is not an NFR; "p95 < 200ms at 1k RPS" is.
- **Scale:** expected + peak load, data volume, growth horizon. State the design point.
- **Latency:** p50/p95/p99 targets per critical path.
- **Cost:** target run-cost envelope (ties directly to `tech-stack-and-cost`).
- **Security:** authn/authz model, data classification, compliance regime (if any).
- **Privacy:** what PII is collected, retention, residency, deletion path. (See `data-engineering`.)
- **Availability/reliability:** SLO target, RTO/RPO if stateful.
If a target is unknown and material, ASK — don't pick silently.

### 2. ADRs (Architecture Decision Records)
One short record per significant, hard-to-reverse decision. Keep them tight:
```
# ADR-NNN: <decision title>
Status: proposed | accepted | superseded by ADR-MMM
Context: the forces — NFRs, constraints, what the PRD demands.
Decision: what we chose.
Consequences: what we gain, what we give up, what becomes harder.
Alternatives considered: each with the reason it lost.
```
Record only consequential decisions (data store, sync vs async, monolith vs services, auth
model). Don't ADR trivia. Every ADR must trace to an NFR or PRD requirement.

### 3. C4-style views (text/Mermaid — pick the lowest level that communicates)
- **Context:** the system + its users + external systems.
- **Container:** deployable/runnable units (web app, API, worker, DB, queue) and how they talk.
- **Component:** inside a container, the major modules — this is the seed for Stage 4.
Stop at the level that conveys the decision. Don't draw class diagrams nobody asked for.

### 4. Threat-model hook
For any internet-facing or data-handling system, run a lightweight STRIDE pass over the trust
boundaries in the container view: where does untrusted input cross a boundary, where does data
at rest live, where is authz enforced. Hand the findings to the `security-engineer` and
`secure-coding` skill — don't reimplement OWASP here, just surface the boundaries and risks.

## Modular-by-default decomposition
Default to self-contained modules with explicit interfaces, dynamically linked so an upgrade in
one propagates to dependents. The component view names the modules and their contracts; Stage 4
(`module-architecture`) formalizes them. Do not over-decompose a simple product into microservices
— senior-engineer test: "Would this be called overcomplicated?" If yes, keep it modular-monolith.

## Gate
The blueprint (NFRs + ADRs + C4 views + threat boundaries) is reviewed with the user before the
stack is chosen. Surface the load-bearing tradeoffs; don't bury them.
