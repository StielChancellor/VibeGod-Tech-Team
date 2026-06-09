---
name: data-engineering
description: Use for anything touching data at rest or in motion — schema design, database migrations, data pipelines/ETL, data quality, and PII handling. Trigger on "design the schema", "write a migration", "change the database", "build a pipeline/ETL", "data validation", "handle PII", or any change to data models. Enforces safe, reversible migrations and privacy-by-design.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Data Engineering — schemas, migrations, pipelines, PII

Data is the hardest thing to change safely — a bad migration or a PII leak isn't a rollback away.
Design schemas deliberately, make migrations safe and reversible, validate data at boundaries,
and treat PII as a first-class constraint (#7). The data layer is part of the foundation.

## Fits in the pipeline
- **Stage 6** (`/build`) — the data layer is foundation work (built before the modules that
  depend on it). Migrations and pipelines are built and tested here. Owned by `data-engineer`.
- Any schema change re-enters via `change-propagation` (Stage 9): data model → API → frontend →
  call sites → tests.

## Schema design
- Model from the domain and the module that **owns** the data (single source of truth — ties to
  `module-architecture`). Right normalization for the access pattern; denormalize deliberately,
  not accidentally.
- Constraints in the schema: keys, foreign keys, NOT NULL, uniqueness, checks — let the database
  enforce invariants, don't rely on app code alone.
- Index for the real query patterns; don't speculatively index everything.
- Parameterized access only — never string-concat SQL (#7).

## Migrations — safe and reversible
- **Every migration is reversible** (a real down path), or the irreversibility is called out
  explicitly and coordinated with rollout (`devops-delivery`).
- **Expand → migrate → contract** for changes to live data: add the new shape, backfill, switch
  reads/writes, then remove the old — so deploys don't require downtime and can roll back.
- Backfills are batched, idempotent, and resumable on large tables. Test the migration on
  production-like data volume before running it for real.
- Never edit a shipped migration in place — add a new one.

## Pipelines / ETL
- Idempotent, restartable stages; explicit schemas at each boundary; handle late/duplicate/
  out-of-order data deliberately. Validate on ingest, not deep downstream.
- Make failures observable and recoverable (dead-letter, retries with backoff); no silent drops.

## Data quality
- Validate at boundaries (ingress, external sources) — the rest of the system trusts clean data.
- Quality checks: completeness, uniqueness, referential integrity, freshness, range/format. Alert
  on violations; quarantine bad records rather than corrupting downstream.

## PII handling (privacy by design)
- **Classify** data; know where PII lives end-to-end (this maps directly to the blueprint's
  privacy NFRs and the threat model).
- **Minimize:** collect only what's needed; set retention and a real deletion path.
- **Protect:** encryption in transit and at rest; least-privilege access; **never log PII** (#7).
- **Respect residency/compliance** where applicable. Mask/anonymize in non-prod environments and
  analytics.

## Discipline
- Surgical schema changes scoped to the request; propagate every one through the chain. Verify
  migrations both up AND down on real-shaped data before calling them done (#8).
