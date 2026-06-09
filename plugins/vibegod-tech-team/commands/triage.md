---
description: "Classify a change (trivial / low / standard / high-or-emergency) and pick the express lane — run only the gates that fit, while always keeping the safety gates. Args: the change/feature being assessed."
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

Run **change-risk triage** on: **$ARGUMENTS** (if empty, use the change just described).

Load the `change-risk-triage` skill and delegate the judgment to the **delivery-manager**:
1. Score the dimensions — blast radius, reversibility, coupling (billing/authN-Z/security/data/queues/
   third-party), data/security/compliance impact, user-facing vs internal, diff size, incident history.
2. Set the **tier = the worst dimension**: trivial / low / standard / high-or-emergency.
3. Apply the **gate matrix**: state which gates RUN and which are SKIPPED (with why). The four always-on
   gates NEVER skip on any lane: **CI + automated tests · security/secret scan · ≥1 non-author review ·
   consistency/no-orphans.**
4. For an emergency/hotfix: ship with minimal smoke + the always-on gates, then complete the full record
   retrospectively and run a PIR linked to the incident.

◆ Present the tier + the chosen lane (gates run vs skipped) for the user to confirm or override UP (more
rigor). Only the delivery-manager + user may waive a NON-safety gate — never a safety gate. Then enter
the pipeline at the appropriate stage with the reduced/full gate set.
