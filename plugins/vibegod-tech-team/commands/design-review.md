---
description: Architecture + security design gate — solution-architect + security-architect + security-engineer review the blueprint, ADRs, and threat model BEFORE any code.
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

This is an **architecture review gate** — run it before code is written (typically after Stage 4 module map / before Stage 5 build plan). Following top-tier engineering practice: design docs get a design review before implementation.

Review scope: $ARGUMENTS

Do this:
1. State that this is a pre-code design review and the gate it guards.
2. Dispatch reviewers in parallel:
   - **solution-architect** — review the **blueprint and ADRs** (via `platform-blueprint` + `module-architecture`): soundness of decomposition, module contracts, dependency direction, foundation correctness, scalability/cost fit, and consistency with the PRD and journey. No orphans in the design.
   - **security-architect** — review the **security design** (via `security-architecture`): zero-trust, identity/access & multi-tenant isolation, threat model (STRIDE), trust boundaries, crypto/key strategy, privacy-by-design.
   - **security-engineer** — review **code-level threat surface** (via `secure-coding`): authn/authz at boundaries, data classification, secrets handling, injection sinks, dependency risk, encryption in transit/at rest, secure defaults (OWASP).
3. Produce a clear verdict per reviewer with specific, actionable findings (not vague concerns). Reconcile any conflict between architecture and security tradeoffs.

◆ Gate: Surface blockers plainly. **Do not advance to the build plan / code until the design review is resolved.** Recommend the next command (`/build-plan`) only when the design is sound and the threat model is acceptable.
