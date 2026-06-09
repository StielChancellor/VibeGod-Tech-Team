---
name: analytics-instrumentation
description: Use to make a product MEASURABLE — define the tracking plan / event taxonomy, instrument events (client + server), and tie dashboards to the PRD success metrics (North Star + inputs). Trigger on "how do we measure this", "add analytics/tracking", "instrument the funnel", "set up events/metrics/dashboards", "North Star", "A/B test measurement", or before any GA so the launch can be measured.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Analytics & Instrumentation

A product you can't measure can't be improved. This skill makes success measurable — it backs the
`analytics-engineer` and closes the loop from the PRD's success metrics to live dashboards.

## Fits in the pipeline
Stage 1 (PRD success metrics → tracking plan), Stage 6 (instrument alongside the engineers),
Stage 8 (**instrument BEFORE GA** so launch is measurable), Stage 10 (measure outcomes → feed
discovery). Honors vibegod-principles; user > skills > default.

## Best practices (enforceable, cited)
- **Tracking plan = the contract (single source of truth).** Every event is defined before it ships:
  name, meaning, properties (required/optional + allowed values), where it fires. Validate inbound
  events against it; reject violations. (segment.com/docs/protocols/tracking-plan, amplitude data-planning)
- **Object-Action naming, one casing, forever.** `Order Completed`, `Signup Started` (noun + past-tense
  verb). Pick the platform's casing and never deviate — `Song Played` ≠ `song played` fragments data.
- **Never put a value in the event name.** No dynamic/templated names — emit `Plan Upgraded` with
  property `plan:"pro"`, not `Plan Upgraded Pro`. Don't invent events to carry a property.
- **Metrics that ladder up:** one **North Star** + **3–5 input metrics** (breadth/depth/frequency/
  efficiency). Pair leading (activation, inputs) with lagging (retention, NSM) — never report a lagging
  output alone. Use AARRR for the funnel, HEART (Goals→Signals→Metrics) for UX quality. (amplitude north-star, kerryrodden.com/heart)
- **Instrumentation:** prefer **server-side** for events you control (reliable, durable, ad-block-proof);
  client-side only for what the server can't see — a deliberate hybrid, not duplicate firing. **Stitch
  identity** (anonymous_id → user_id on login; pass both explicitly server-side). **Validate against a
  schema** at PR time; require backward-compatible changes. **Idempotency + dedup** (stable event id,
  upsert semantics) so retries don't double-count. Land raw → model with dbt. (posthog/mixpanel best-practices)
- **Experiments:** one primary metric + a power analysis up front; don't peek/stop early. **2–4 guardrail
  metrics** with thresholds (non-inferiority test); keep the list short (many guardrails at α=.05 inflate
  false positives). Gate variants behind feature flags. A primary win that trips a guardrail is not a ship. (statsig/eppo/posthog)

## Guardrails (MUST / NEVER)
- **MUST** ship every event from the tracking plan; **MUST** instrument before launch (no GA without it);
  **MUST** map every dashboard to a PRD success metric / the North Star + inputs; **MUST** validate the
  schema + enforce idempotency/dedup.
- **NEVER put PII or secrets in event names, properties, or IDs** (same rule as OWASP logging — masks/
  opaque IDs only). **NEVER** fire tracking without honoring **consent / Do-Not-Track** (GDPR opt-in,
  CCPA opt-out). **NEVER** ship ad-hoc/undocumented or dynamic-named events. **NEVER** report a lagging
  metric alone or call an experiment a win when a guardrail regresses. **NEVER** over-collect — minimize
  + set retention; tag PII fields so they can be governed/purged.

## Sources
- Tracking plan / taxonomy: https://segment.com/docs/protocols/tracking-plan/best-practices/ ·
  https://amplitude.com/docs/data/data-planning-playbook · https://posthog.com/docs/product-analytics/best-practices
- Metrics: https://amplitude.com/books/north-star/about-north-star-framework · https://kerryrodden.com/heart/ ·
  https://amplitude.com/blog/pirate-metrics-framework
- Experiments: https://statsig.com/blog/what-are-guardrail-metrics-in-ab-tests · https://www.geteppo.com/blog/what-are-guardrail-metrics-with-examples
- Privacy/governance: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html ·
  https://owasp.org/Top10/2025/A09_2025-Security_Logging_and_Alerting_Failures/ · https://posthog.com/docs/product-analytics/best-practices
