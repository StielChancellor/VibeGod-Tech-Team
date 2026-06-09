---
name: performance-engineering
description: Use to define and enforce performance & scale gates — load/stress/soak/spike tests, latency SLOs (p95/p99), throughput/error-rate targets, capacity & breaking-point analysis, profiling, and Core Web Vitals/RAIL budgets for UI. Use whenever someone asks "is it fast enough", "will it scale", "what's our p99", "load/stress/soak/spike test", "performance budget", "capacity plan", or before any ship gate on a user-facing or high-traffic surface. Gates ship on performance.
allowed-tools: Read, Grep, Glob, Bash
---

# Performance Engineering

The performance & scale conscience of the build: prove the system meets its latency, throughput,
error-rate, and capacity targets — with numbers, not vibes. Honors
`${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`; priority is **user > skills >
default**. This skill proves performance; it does NOT own deploy infra (that's `devops-sre`).

## Fits in the pipeline
- **Stage 3 (Stack & cost)** — supply the performance NFRs the architecture must hit (SLO targets,
  expected/peak/spike traffic), so the stack is chosen against real load, not guesses.
- **Stage 7 (Per-feature QA gate)** — the performance lens: run the relevant profile(s) against the
  feature and fail the gate on any breached threshold or regression vs baseline.
- **Stage 8 (Ship gate)** — the binding pre-ship proof: full load/stress/soak/spike sign-off,
  breaking-point + capacity headroom, and p75 field Core Web Vitals for user-facing surfaces.
A "performance tested" claim is only valid here when it is reproducible, thresholded, and run on a
representative system.

## Best practices
- **Gate on percentiles, never averages.** Every latency SLO is p95 and/or p99 (p99.9 for critical
  paths). Averages are forbidden as pass/fail criteria.
- **Codify SLOs as machine-checkable thresholds.** Each test declares them, e.g.
  `http_req_duration: ['p(95)<200','p(99)<300']`, `http_req_failed: ['rate<0.01']`,
  `checks: ['rate>0.99']`. A breached threshold MUST produce a non-zero exit so CI fails.
- **Always co-locate an error-rate threshold.** A latency gate without `rate<0.01` (errors) is
  invalid — fast 500s must not pass.
- **Run all four profiles before sign-off:** load (expected peak), stress (find the break point),
  soak/endurance (sustained run for leaks/pool exhaustion/GC drift), spike (sudden-surge recovery).
- **Monitor the four golden signals every run:** latency, traffic, errors, saturation. Without
  saturation (CPU/mem/connection-pool/queue) the run cannot inform capacity.
- **Frontend gate on Core Web Vitals at p75, field data:** LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
  Lab data is for regression only and MUST NOT be the sole signal.
- **Apply RAIL budgets:** respond to input within 100ms (process events ≤50ms), animation frames
  ≤10ms, chunk idle work into ≤50ms blocks, load-to-interactive ≤5s on mid-range mobile/slow 3G.
- **Diff against the last green baseline.** A statistically significant regression (e.g. p99 up
  beyond tolerance) fails the gate even when absolute thresholds still pass.
- **Make the SUT representative.** Production-like data volume, topology, and config; state the
  environment in the report. Toy-environment numbers are non-binding.
- **Use `abortOnFail` for protective limits** (e.g. error-rate explosion) so doomed runs stop early
  and don't mask the breaking point.
- **Set SLOs "just reliable enough."** Don't over-tighten beyond what's needed — chasing 100% breeds
  hidden dependence on unguaranteed performance and wastes engineering. Track an error budget and
  reference remaining budget in gate decisions, not perfection.

## Guardrails
**MUST enforce**
- Block release if any performance threshold is breached — non-zero exit is the contract. No "merge
  anyway" without an explicit, time-boxed, logged waiver from the SLO owner.
- Report latency as a distribution (p50/p95/p99, max) together with error rate, throughput, and
  saturation — never a single number.
- Measure CWV at p75 from field/real-user data for any user-facing release claim.
- Identify and document the **breaking point** (the load at which SLOs fail) so capacity headroom is
  quantified.
- Keep an **error budget**; gate decisions reference remaining budget.

**MUST NEVER**
- Pass/fail on average latency or on a single request.
- Report a latency gate without an accompanying error-rate gate (it masks fast failures).
- Promote on lab CWV alone — lab is not a substitute for field.
- Over-tighten an SLO far beyond the published target.
- Sign off on load testing without a soak run — leaks/pool exhaustion/GC drift are invisible short.
- Run against a non-representative environment and present the numbers as release-binding.
- Ship a perf test with no thresholds — a run that cannot fail is not a gate.
- Own deploy infra, CI/CD wiring, or runbooks — that is `devops-sre`. This role proves the targets.

## Sources
- k6 thresholds & CI exit-code gating: https://grafana.com/docs/k6/latest/using-k6/thresholds/
- Google SRE — Service Level Objectives (percentiles, error budget, don't over-achieve): https://sre.google/sre-book/service-level-objectives/
- Google SRE — Monitoring Distributed Systems (four golden signals): https://sre.google/sre-book/monitoring-distributed-systems/
- web.dev — RAIL performance model: https://web.dev/articles/rail
- web.dev — Web Vitals (LCP/INP/CLS at p75; field vs lab): https://web.dev/articles/vitals
- web.dev — Defining Core Web Vitals thresholds (p75 rationale): https://web.dev/articles/defining-core-web-vitals-thresholds
