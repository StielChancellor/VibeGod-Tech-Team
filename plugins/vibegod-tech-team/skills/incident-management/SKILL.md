---
name: incident-management
description: Use to run a production incident or set up on-call/reliability ops — declare + command an incident (IC/Ops/Comms/Planning roles), classify severity, mitigate before root-cause, communicate on a cadence, then run a blameless postmortem with tracked action items. Trigger on "incident", "outage", "production is down", "SEV1/P1", "on-call/escalation/paging", "postmortem", "runbook", or "we broke prod".
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Incident Management

When production breaks, structure beats heroics. This skill runs the incident and the learning after.
Backs the `incident-manager` (the Incident Commander); `devops-sre` is the Ops Lead who applies fixes.
Part of Stage 10 (Operate). Honors vibegod-principles; user > skills > default.

## Incident command roles (Google SRE) — separate decide / fix / communicate / plan
- **Incident Commander (IC) — exactly ONE.** Holds the high-level state, structures the response,
  delegates, and **holds any undelegated role**. The IC **decides; the IC does NOT fix.**
- **Ops Lead** (our `devops-sre`) — the ONLY party that modifies the system during the incident.
- **Comms Lead** — the single public voice: stakeholder/status-page updates under IC approval.
- **Planning Lead** — bugs, tracking divergence from normal (to restore later), handoffs, logistics.
Consolidate roles for small incidents, but the IC stays singular and command/fix/comms stay separate.

## Severity (set shared expectations)
- **SEV1 (Critical):** full outage / breach / data loss — ack ~5 min, page on-call + backup + lead,
  status-page + exec/customer notice ~30 min, updates every 15–30 min.
- **SEV2 (High):** major degradation, key feature broken / large segment, limited workaround — ack ~15 min.
- **SEV3 (Medium):** core usable, degraded perf / non-critical feature — next business hour/day.
- **SEV4 (Low):** cosmetic / edge / few users — logged, scheduled.

## Lifecycle — mitigate BEFORE root-cause
detect → **declare** (bias to declaring) → mobilize → **contain/mitigate (stop the bleeding)** →
resolve/recover → close → **learn**. Use generic mitigations FIRST (roll back the recent release,
drain/reroute traffic) before the root cause is understood. Never block service restoration on RCA.
For security incidents, isolate/stop the attack before forensics.

## On-call
- **Primary + secondary** coverage; explicit **escalation thresholds** (ack window → auto-escalate),
  with the backup staffed to retain context. **Alerts must be actionable** — page a human only on a
  **burn-rate** event consuming a large fraction of the error budget (multi-window, multi-burn-rate:
  e.g. page 2%/1h or 5%/6h; ticket 10%/3d). **Every actionable alert has a runbook.** Actively cut
  noise/fatigue (no paging-everyone, no raw-threshold pages).

## Communication
One **Comms owner** + one **war-room/channel** as the single source of truth. Keep a **rigid heartbeat
cadence even with no news** ("still investigating, next update in 30 min"). Never pull resolvers off
troubleshooting to write updates.

## Blameless postmortem / PIR
- **Trigger** on pre-agreed criteria: user-visible downtime past a threshold, **any data loss**, an
  on-call intervention (rollback/reroute), over-threshold resolution time, or a monitoring miss. Any
  stakeholder may request one. **Every SEV1/SEV2 gets one.**
- **Blameless — always:** identify contributing causes without indicting anyone; assume good intent.
- **Structure:** timeline · impact · root cause + contributing factors · actions taken · **prevention
  action items with owners + priority.** Track action items **to closure**; senior-review + publish to
  a searchable repo for org learning.

## Metrics
MTTA / MTTR (decompose into time-to-detect + time-to-mitigate); % incidents with a postmortem; %
action items closed. Tie recovery to **DORA "failed-deployment recovery time"** (elite < 1h).

## Guardrails (MUST / NEVER)
- **MUST** declare early (2nd team needed, customers impacted, or unsolved after ~1h); exactly one IC
  who decides + delegates (never resolves); **mitigate before debugging**; stay **blameless always**;
  give every SEV1/2 a postmortem with tracked owned action items; **link incidents to the error budget**;
  one Comms owner + one war-room + a fixed cadence.
- **NEVER** page on non-actionable/raw-threshold alerts; **NEVER** ship an alert without a runbook;
  **NEVER** block restoration on root-cause; **NEVER** assign blame to a person.

## Sources
- Google SRE — Managing Incidents: https://sre.google/sre-book/managing-incidents/ · Postmortem Culture:
  https://sre.google/sre-book/postmortem-culture/ · Alerting on SLOs: https://sre.google/workbook/alerting-on-slos/ ·
  Incident Response: https://sre.google/workbook/incident-response/
- PagerDuty roles/escalation/lifecycle: https://response.pagerduty.com/before/different_roles/ ·
  https://support.pagerduty.com/main/docs/escalation-policies-and-schedules
- Severity: https://www.atlassian.com/incident-management/kpis/severity-levels · https://incident.io/guide/foundations/severities
- DORA recovery metric: https://dora.dev/guides/dora-metrics/
