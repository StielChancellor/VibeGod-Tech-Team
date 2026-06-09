---
name: devops-delivery
description: Use to set up or improve delivery and operations — CI/CD pipelines, containers, infrastructure-as-code, staged/canary rollouts, observability/SLOs, rollback, and blameless postmortems. Trigger on "set up CI/CD", "containerize", "deploy", "Terraform/IaC", "canary release", "monitoring/alerting", "SLO", "rollback", or "the deploy broke". Applies top-tier release-engineering practices.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# DevOps Delivery — ship safely, operate well

Make delivery automated, observable, and reversible. Apply Google/top-tier SRE practices (#15):
CI gates, staged rollout, observability/SLOs, error budgets, blameless postmortems. Fit the
sophistication to the project — a small app needs a clean pipeline, not a service mesh
(anti-overeagerness still applies).

## Fits in the pipeline
- **Stage 6** (`/build`) — establish the CI/CD pipeline, containers, and IaC as part of the
  foundation (the build roadmap schedules a CI skeleton in Phase 0).
- **Stage 8** (`/ship-check`) — staged/canary rollout, smoke checks on deploy, rollback readiness.
Owned by `devops-sre`.

## What to set up

### CI/CD
- **CI:** on every change — build, lint, full test suite, security/dependency (SCA) scan,
  a11y checks for UI. Red CI blocks merge (#8). Keep CLs small so CI stays fast and signal stays
  high.
- **CD:** automated, repeatable deploys. Promote the same artifact through environments
  (build once, deploy many). Secrets from a secret manager, never baked into images (#7).

### Containers
- Minimal, pinned base images; multi-stage builds; non-root user; no secrets in layers; scan
  images. Reproducible builds.

### Infrastructure as Code
- All infra in version-controlled IaC (Terraform/Pulumi/etc.) — no click-ops. Plan/review before
  apply. Least-privilege IAM. Environments parameterized, not copy-pasted.

### Staged / canary rollout
- Roll out progressively (canary → percentage → full), watching health signals at each step.
  Automatic halt/rollback on SLO breach or error spike. Feature flags to decouple deploy from
  release where useful.

### Observability & SLOs
- The three pillars: metrics, logs (no sensitive data — #7), traces. Define **SLOs** on the
  critical user journeys and an **error budget**; alert on symptoms (SLO burn), not noise.
  Dashboards for the golden signals (latency, traffic, errors, saturation).

### Rollback & incident response
- Every deploy is reversible — a tested, fast rollback path (and forward-fix when reversal is
  unsafe, e.g. irreversible migrations — coordinate with `data-engineering`).
- **Blameless postmortems** for incidents: timeline, contributing causes, action items. Focus on
  systems, not people. Feed fixes back into the pipeline.

## Discipline
- Build the minimum delivery setup the project needs; add canary/SLO machinery when scale or risk
  warrants it. Verify the pipeline actually works end-to-end before calling it done (#8).
