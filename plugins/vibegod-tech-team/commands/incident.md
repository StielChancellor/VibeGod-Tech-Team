---
description: "Declare and run a production incident — assign IC/Ops/Comms/Planning, set severity, mitigate before root-cause, communicate on a cadence, then run a blameless postmortem with tracked action items. Args: what's happening (symptoms/impact)."
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

**Incident:** $ARGUMENTS — this is **Stage 10 (Operate)**. Load the `incident-management` skill and put the
**incident-manager** in command (Incident Commander).

1. **Declare + classify** severity (SEV1–4). Bias to declaring. State the impact and who's affected.
2. **Assign roles:** ONE IC (incident-manager), **Ops Lead = `devops-sre`** (the only one who touches the
   system), **Comms Lead**, **Planning Lead**. Keep decide / fix / communicate separate.
3. **Mitigate first** — generic mitigations before root-cause: roll back the recent release, drain/reroute
   traffic, disable the offending flag. Do NOT block restoration on RCA. (Security incident: isolate/stop
   the attack first; `security-engineer` leads forensics.)
4. **Communicate** on a heartbeat cadence (SEV1: every 15–30 min, even with "no new info") through one
   Comms owner + one war-room.
5. **Recover + close**; record the timeline.
6. **Blameless postmortem** (mandatory SEV1/2 or any data loss): timeline · impact · root cause +
   contributing factors · actions taken · **prevention action items with owners + priority**, tracked to
   closure. Blameless always. Link the incident to the error budget (a burn may freeze launches).

◆ Report status + error-budget impact. Postmortem action items become tracked work and feed the next
discovery cycle.
