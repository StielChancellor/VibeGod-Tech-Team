---
description: "Program/Delivery — stand up and maintain the RAID log (Risks, Assumptions, Issues, Dependencies, Decisions) and track cross-team status. Args: optional focus (a risk, dependency, or milestone)."
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

This is the **cross-cutting Program/Delivery track** — it runs alongside every stage, it does not replace a gate.

Focus from the user: $ARGUMENTS

Delegate to the **delivery-manager** (TPM), driven by the **program-management** skill:
1. Stand up / update the **RAID log** — Risks (+ mitigation/owner), Assumptions, Issues (triage/owner),
   Dependencies (blockers + resolution owner + due), Decisions (trade-off + rationale + date).
2. Surface the **critical path** and any cross-department blockers; assign owners and dates.
3. Report status against the pipeline gates; **escalate** blockers that put a gate at risk.
4. The delivery-manager COORDINATES — it does not make product/design/architecture/eng decisions; it
   routes them to the accountable department and tracks them to closure.

Output: the current RAID log + a short status (on-track / at-risk / blocked) per active workstream.
