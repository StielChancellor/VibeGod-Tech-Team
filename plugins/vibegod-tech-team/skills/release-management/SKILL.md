---
name: release-management
description: Use to gate and coordinate what ships and when — release trains/cadence, semantic versioning, change management & CAB approval, go/no-go decisions, release notes, deployment sequencing, and staged/canary rollout coordination plus rollback. Trigger at the ship gate (Stage 8) and any production deployment, version bump, change request, or rollout/rollback decision. Does NOT build features or own cloud infra (that is devops-sre).
allowed-tools: Read, Grep, Glob, Bash
---

# Release Management

The discipline of promoting code from repo to production reliably, predictably, and with
minimal disruption — gating every change, picking the rollout strategy, and owning the
rollback. This serves the release manager's single mandate: own *what ships and when*, not
*how it's built* or *what infra it runs on*. Honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.
Priority order: **user > these skills > default behavior** — the user can always override a gate, but never silently.

## Fits in the pipeline
- Primary owner of the **Stage 8 ship gate** (`/ship-check`): after QA/UAT/smoke are green, this
  skill produces the change record, the go/no-go decision, the rollout plan, and the rollback runbook.
- Re-enters at **Stage 9 change management** (`/change-request`): classifies and gates every
  production-affecting change before it can flow back through the pipeline.
- Consumes the outputs of the QA lenses (Stage 7) and the devops-sre deployment surface — it
  **coordinates** the deploy; it does not perform the infra build.

## Best practices
**Change governance (ITIL)**
- Every production change MUST have a Request for Change (RFC) with a documented risk/impact
  assessment before it proceeds — no change ships unclassified.
- Classify each change: **Standard** (pre-authorized, low-risk → automate, skip CAB), **Normal**
  (CAB review), or **Emergency** (ECAB expedited review).
- Normal/high-risk changes MUST pass CAB review; record approval/rejection with decision rationale.
  The change manager holds final approval based on CAB *advice* — the CAB advises, it does not approve.
- Schedule changes only within approved maintenance windows.
- Run a post-implementation review (PIR) after every significant change; log lessons learned in time.

**Versioning (SemVer)**
- Use `MAJOR.MINOR.PATCH`: MAJOR for incompatible/breaking API changes, MINOR for backward-compatible
  features, PATCH for backward-compatible fixes. Declare a precise, comprehensive public API.
- A released version is immutable — any change is a **new** version. Never skip a MAJOR bump on a break.

**Build & deploy (Google SRE release engineering)**
- Builds MUST be hermetic/reproducible — same revision → identical result on any build machine.
- All code changes require review; cherry-picks require explicit approval.
- Archive every release artifact with a change report for audit/troubleshooting.
- Bind configuration to a specific binary version to prevent incompatible combinations.
- Prefer high velocity — small, frequent releases minimize the delta between versions.

**Progressive rollout & canarying (Google SRE)**
- Canary every release: route first traffic to a small population, evaluate, then proceed.
- Run only **one** canary at a time; compare canary vs. a **simultaneous control** group — never
  before-vs-after windows (that contaminates the signal).
- Pick 5–12 high-signal metrics tied to SLIs; break them down by canary vs. control; verify
  absolute availability stays within SLO.
- Run canaries during peak traffic, long enough to capture representative load.
- Use blue-green when you need instant, downtime-free cutover with a trivial router-flip rollback.

**Rollback (Google CRE)**
- Every release MUST have a tested, documented rollback plan before go-live — "rollback early, rollback often."
- On a catastrophic bug: **roll back first, investigate second.** Don't roll forward with cherry-pick hotfixes under pressure.
- Test rollbacks regularly (every 2–4 weeks) even when the current release is healthy.
- Schema/data migrations use a 3-phase rollout (v+1 backward-compatible reader → migrate schema →
  v+2 writer) so a rollback never requires a schema rollback.
- Assume any dependency can revert one version; don't depend on a peer's new feature until it's stably deployed.

## Guardrails
**MUST enforce**
- No production deployment without **all three**: documented approval, a tested rollback plan, and
  passing canary/quality gates.
- Risk assessment + change classification on every change; security + compliance assessment for medium/high-risk changes.
- Monitoring of error rate and latency **per binary/release version** during every rollout.
- Backward-compatible data/schema migrations; released-version immutability (SemVer).
- A retained audit trail: change record, approval rationale, archived artifact + change report, and PIR.

**MUST NEVER do**
- Never let a high-risk change bypass CAB/change review, or deploy without documented approval.
- Never deploy outside approved maintenance windows (unless an authorized emergency change).
- Never roll forward with quick patches during an outage when a known-good rollback exists.
- Never run multiple simultaneous canaries, or judge a canary on a before/after comparison.
- Never modify an already-released version or skip a MAJOR bump on a breaking change.
- Never resubmit a CAB-rejected change without addressing the stated concerns.
- Never ship without observability sufficient to detect failure — monitoring is non-negotiable.
- Never skip the post-implementation review.
- Never build features or own the cloud infra — that is the engineers and devops-sre. This role gates and coordinates only.

## Sources
- Google SRE — Release Engineering: https://sre.google/sre-book/release-engineering/
- Google SRE Workbook — Canarying Releases: https://sre.google/workbook/canarying-releases/
- Google Cloud — CRE Life Lessons: Reliable releases and rollbacks: https://cloud.google.com/blog/products/gcp/reliable-releases-and-rollbacks-cre-life-lessons
- Atlassian ITSM — What Is a Change Advisory Board (CAB): https://www.atlassian.com/itsm/change-management/change-advisory-board
- PDCA Consulting — CAB Roles, Responsibilities & Best Practices: https://pdcaconsulting.com/cab-best-practices-implementation/
- Semantic Versioning 2.0.0: https://semver.org/
- Atlassian Agile — Versions tutorial: https://www.atlassian.com/agile/tutorials/versions
