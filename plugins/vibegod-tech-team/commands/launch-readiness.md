---
description: "GA launch readiness — run the Google SRE launch checklist (architecture, capacity, reliability, monitoring, security, automation, scalability, dependencies) and drive the staged/canary rollout. Args: the launch scope."
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

You are at **GA launch readiness** (final gate before general availability). Scope: $ARGUMENTS

Delegate to **release-manager** + **devops-sre** (driven by **release-management** + **devops-delivery**):
1. Run the **SRE launch-readiness checklist** (9 categories): architecture, infrastructure, capacity,
   reliability/failover, monitoring/alerting, security, automation, scalability, dependencies.
2. Confirm must-pass items: critical defects = 0, all gates signed (QA/security/compliance/perf/docs),
   monitoring + alerts live, **runbooks** written, on-call + **incident** escalation defined.
3. Execute the **staged/canary rollout**: 10% → 25% → 50% → 100% with an observe window at each step and
   error-rate/latency thresholds; **roll back** automatically if a threshold trips.
4. Declare GA only when every category passes.

◆ **Gate:** GA is BLOCKED until the SRE checklist passes and the canary is healthy. After GA, hand to
**Stage 10 — Operate** (devops-sre: monitoring, incident response, blameless postmortems; feedback to discovery).
