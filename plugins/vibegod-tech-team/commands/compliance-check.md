---
description: "Pre-ship Compliance gate — SOC2/ISO27001/GDPR/HIPAA/PCI + VPAT/Section 508 accessibility conformance, audit evidence, data retention, privacy-by-design. Args: scope/frameworks in play."
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

You are at the **Compliance gate** (pre-ship, part of the expanded Stage 8). Scope: $ARGUMENTS

Delegate to **compliance-grc**, driven by the **compliance-grc** skill:
1. Confirm the applicable frameworks (SOC 2 Type II, ISO 27001, GDPR, HIPAA, PCI-DSS as relevant).
2. Verify the required **controls + audit evidence**: access control, encryption in transit/at rest,
   logging/monitoring, change management, incident response, data retention & deletion, DPIA where needed.
3. Verify **privacy-by-design** (data minimization, lawful basis, subject-rights workflows) and
   **accessibility conformance** (VPAT / Section 508 / WCAG 2.2 AA — coordinate with ux-design-reviewer).
4. Produce a sign-off or a precise remediation list (control · gap · required evidence · owner).

◆ **Gate:** ship is BLOCKED until compliance signs off (or risk is formally accepted by the user).
compliance-grc specifies controls and verifies evidence — it does not implement; it hands fixes to the
owning engineer/security-engineer.
