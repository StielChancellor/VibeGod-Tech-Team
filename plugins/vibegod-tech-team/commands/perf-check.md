---
description: "Performance & scale gate — load/stress/soak/spike testing vs SLAs (p50/p95/p99, throughput, error rate), perf budgets, capacity planning, Core Web Vitals. Args: the target/scenario."
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

You are at the **Performance/scale gate**. Target/scenario: $ARGUMENTS

Delegate to **performance-engineer**, driven by the **performance-engineering** skill:
1. Define the load model + targets (p50/p95/p99 latency, throughput, error-rate, resource budgets;
   Core Web Vitals LCP/INP/CLS for UI).
2. Run **load / stress / soak / spike** tests against a production-like environment; identify the
   breakpoint and capacity headroom.
3. Compare results to the SLAs/budgets; profile and hand specific optimizations to the owning engineer.
4. Produce a PASS or a defect list (scenario · metric · target vs actual · fix owner).

◆ **Gate:** ship is BLOCKED until performance meets the agreed SLAs/budgets. performance-engineer proves
scale — it does not own deploy infra (that is devops-sre); it feeds fixes back to the engineers.
