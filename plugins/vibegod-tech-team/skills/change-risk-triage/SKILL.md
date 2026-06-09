---
name: change-risk-triage
description: Use to right-size the process to the change — classify a change as trivial / low / standard / high-or-emergency and run only the gates that fit, so a typo doesn't pay the full enterprise gate tax while a risky change gets the whole pipeline. Trigger at the start of any build or change request, on "is this a big change", "fast-track this", "do we need the full process", "hotfix", or "express lane".
allowed-tools: Read, Grep, Glob, Bash
---

# Change Risk Triage — the express lane

The full gated pipeline is correct for a new platform or a risky feature; it's overkill for a typo.
This skill picks the lane. Owned by the `delivery-manager` (TPM); the orchestrator runs it FIRST on
every build/change and applies the resulting gate matrix. Honors vibegod-principles (simplicity;
never skip a SAFETY gate). User > skills > default.

## Fits in the pipeline
Runs at Stage 0 (new build) and Stage 9 (change request) BEFORE committing to the full flow. The tier
selects which downstream gates run vs skip.

## Score the tier (the tier = the WORST dimension)
Score the change on each dimension; one high dimension promotes the whole change:
- **Blast radius** — one internal user → one tenant/region → all users / a critical workflow.
- **Reversibility** — instant flag-off/rollback → redeploy → hard/irreversible (data migration).
- **Coupling** — does it touch billing, **authN/Z**, security, data consistency, queues, caches, or a
  third-party contract?
- **Data / security / compliance impact**, **user-facing vs internal**, **diff size** (keep CLs ~100
  lines so most work qualifies for the fast lane by construction), and **incident history** of the area.

| Tier | Looks like |
|---|---|
| **Trivial** | copy/typo, log-level, comment, a flag-OFF code path, docs |
| **Low** | small reversible CL, flag-gated, narrow blast radius, no sensitive coupling |
| **Standard** | user-facing or medium blast radius, normal rollback |
| **High / Emergency** | wide blast radius, hard rollback, identity/data/security/compliance — or an incident hotfix |

## Gate matrix (what runs vs skips)
| Gate | Trivial | Low | Standard | High / Emergency |
|---|---|---|---|---|
| **CI + automated tests green** | ✅ | ✅ | ✅ | ✅ (hotfix: smoke now + full post-hoc) |
| **Security / secret scan (hooks)** | ✅ | ✅ | ✅ | ✅ |
| **Code review (≥1 non-author)** | ✅ lightweight | ✅ lightweight | ✅ full | ✅ full + **post-hoc** for emergency |
| **Consistency / no-orphans** | ✅ | ✅ | ✅ | ✅ |
| Full PRD / spec | ⛔ | ⛔ | ✅ | ✅ |
| Journey / UX design + `/polish` | ⛔ | ⚠️ if UI | ✅ if UI | ✅ if UI |
| Stack & cost | ⛔ | ⛔ | ✅ if new tech | ✅ |
| Module map | ⛔ | ⛔ | ✅ if structural | ✅ |
| Perf gate (`/perf-check`) | ⛔ | ⚠️ if perf-sensitive | ✅ | ✅ |
| Compliance gate (`/compliance-check`) | ⛔ | ⛔ | ✅ if regulated data | ✅ |
| Multi-lens QA swarm (`/feature-check`) | ⛔ (the 4 always-on gates suffice) | ⛔ | ✅ | ⚠️ emergency: deferred to the PIR |
| Release/GA readiness | ⛔ | ⚠️ progressive flag | ✅ | ✅ where feasible |
| Audit trail + incident link | standard | standard | standard | ✅ **mandatory** |

## The four ALWAYS-ON gates (never skip on any lane)
CI + automated tests · security/secret scan · **at least one non-author review** (segregation of duties)
· consistency/no-orphans. These pipeline-embedded checks are the substitute for a heavyweight CAB —
DORA: external change-approval boards do **not** lower change-fail rate and correlate with low performers.

## Emergency / hotfix path
Expedited but **never unaudited**: ship with minimal smoke + the four always-on gates, then **complete
the full record retrospectively** and run a **post-implementation review (PIR)** linking the change to
its incident. Speed is bought with post-hoc audit, never with skipped review or security.

## Output
State the **tier + the dimension that set it**, the gates that will run, and the gates being skipped
(with why). The user can override the tier up (more rigor) at any time; only the `delivery-manager` +
user may waive a non-safety gate — never a safety gate.

## Sources
- ITIL standard/normal/emergency: https://www.atlassian.com/itsm/change-management/types
- DORA streamlining change approval: https://dora.dev/capabilities/streamlining-change-approval/
- Google small CLs / review speed: https://google.github.io/eng-practices/review/developer/small-cls.html ·
  https://google.github.io/eng-practices/review/reviewer/speed.html
- Trunk-based + flags: https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development
