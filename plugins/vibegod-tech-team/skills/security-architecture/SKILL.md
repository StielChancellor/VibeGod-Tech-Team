---
name: security-architecture
description: Use when setting the SECURITY DESIGN of a system or major feature — zero-trust architecture, identity/access and multi-tenant isolation strategy, STRIDE threat modeling, trust boundaries, crypto/key-management strategy, and security-by-design reviews of the blueprint. Trigger for Stage 4 (module map / blueprint) security review and whenever a new service, trust boundary, tenancy model, or auth model is introduced. NOT for code-level OWASP review of an implementation (that is the security-engineer / secure-coding lens).
allowed-tools: Read, Grep, Glob, Bash
---

# Security Architecture

Owns the system's secure DESIGN: trust boundaries, identity & access model, zero-trust
enforcement points, multi-tenant isolation, data-protection/key strategy, and the threat model.
Honors `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`. Priority order:
**user > skills > default behavior** — never silently override the user. You set the secure
baseline the build must follow; you do not perform code-level review.

## Fits in the pipeline
Serves the **Architecture department (Stage 4 — module map & blueprint)** and feeds the
**Stage 5 build plan** with security acceptance criteria. Threat modeling is continuous, not a
one-time gate: any new service, trust boundary, tenancy model, or auth change re-enters here.
The implementation-time OWASP lens lives in the **Stage 7 per-feature QA gate** (security-engineer
+ `secure-coding`) — this skill writes the design that lens checks against.

## Best practices

**Zero Trust (NIST SP 800-207 §2.1 tenets):**
- Treat every data source and service as a **resource to protect** — nothing exposed without an explicit policy.
- **Secure all communication regardless of network location** — "internal network" / VPN never grants implicit trust.
- Grant access **per-session, per-request, least privilege**, re-evaluated each time — never "authenticate once, trust forever".
- Make access decisions **dynamic** — from client identity, service identity, device posture, and observable attributes/behavior.
- Complete **authentication AND authorization (discrete functions) before** any session to a resource is established.
- **Continuously monitor** integrity and posture of all assets — no asset is inherently trusted.
- Collect **as much identity/asset/network state as possible** and feed it back into policy enforcement.

**Architecture / decision points:**
- Route every access through a **Policy Enforcement Point (PEP)** that defers to the **Policy Engine (PE)** via the **Policy Administrator (PA)** — no bypass path may exist.
- **Deny by default** — an explicit allow/deny decision on every request; never rely on framework defaults alone (OWASP).
- **Complete mediation** — authorize *every* request server-side (gateway or function), regardless of source (AJAX, server-side, internal) (OWASP).
- **Defense in depth** — at least one independent layer backs each critical control; no single point of total compromise (OWASP).
- **Fail safe / fail securely** — on error default to the denied state, never open (OWASP).
- **Secure by default** — ship the most restrictive workable config; hardening is opt-out, not opt-in (OWASP).
- **Economy of mechanism** — simplest design, smallest attack surface; reuse vetted components over new code (OWASP).
- **Open design** — security must not depend on secrecy of the architecture; assume attackers know it (OWASP).
- **Separation of duties** — critical actions require two or more independent conditions/actors (OWASP).

**Threat modeling (OWASP Threat Modeling Cheat Sheet):**
- Model **early (design phase)** and **keep it living** — refine as the system changes.
- Produce a **system model (DFD)** showing data flows, external entities, and **trust boundaries** *before* identifying threats.
- Apply **STRIDE** systematically: **S**poofing (auth), **T**ampering (integrity), **R**epudiation (accountability), **I**nformation disclosure (confidentiality), **D**enial of service (availability), **E**levation of privilege (authorization).
- Every threat gets a **mitigation, an explicit accepted-risk decision (with owner), or a documented assumption** — none left open; rank by likelihood × impact.

**Identity / IAM / multi-tenant (OWASP Authorization + NIST SP 800-207A):**
- Enforce **least privilege** horizontally and vertically — minimum rights for the minimum time.
- Prefer **ABAC / ReBAC** over plain RBAC for fine-grained and **multi-tenant** authorization.
- Authorization is **server-side**; client-side checks are never the decisive control.
- Access-check **every object/ID accessed** — protect direct object references (prevent IDOR/BOLA).
- For cloud-native / multi-cloud, segmentation is **identity-based** (service + workload identity, e.g. SPIFFE) — not IP/subnet/perimeter — enforced at API gateways and sidecar proxies irrespective of location (NIST SP 800-207A).
- **Bind tenant context to identity**, validated server-side on every request; cross-tenant access requires an explicit, separately-authorized policy.

**Artifacts you produce:** a living **threat-model package** (DFDs + trust boundaries, STRIDE
list, ranked risks, mitigation/assumption decisions); a **security reference design** (PE/PA/PEP
placement, identity & segmentation model, data-protection & key-management design, multi-tenant
isolation); an **authorization model spec** (ABAC/ReBAC/RBAC, deny-by-default, tenant binding);
and the **secure-design baseline + security acceptance criteria** handed to engineering and the
review lens.

## Guardrails

**MUST enforce:**
- A current **threat model + STRIDE pass** for any new service or material design change before sign-off.
- **Deny-by-default authorization on every request**, server-side, through a PEP with no bypass.
- **Mutual authentication of subject AND service identity** before a session, with per-request re-evaluation.
- **Continuous monitoring / posture** of assets feeding access decisions.
- **Tenant isolation** that is identity-bound and verified server-side.
- **Encryption of all communication regardless of network location**, and secure-by-default configuration.

**MUST NEVER allow (hard stops):**
- **Implicit trust by network location / VPN / "internal" zone** (NIST 800-207 tenet).
- **Client-side-only authorization** or trusting client-supplied roles / tenant IDs (OWASP).
- A request path that **skips the PEP / authorization check**, or "authenticate once then trust" sessions.
- **Fail-open** error handling on a security control (OWASP).
- **Security through obscurity** as the primary defense (OWASP open design).
- **Shared secrets, hardcoded credentials, or over-broad privileges** in a design — least privilege is mandatory.
- A **single control as the sole barrier** to total compromise (defense in depth required).
- Shipping a design with **unmitigated, undocumented threats** — every STRIDE threat is mitigated, accepted (with owner), or explicitly assumed-away.
- **Doing code-level OWASP review** — that is the security-engineer's lane; stay on DESIGN.

## Sources
- NIST SP 800-207, Zero Trust Architecture — https://csrc.nist.gov/pubs/sp/800/207/final (PDF: https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207.pdf)
- NIST SP 800-207A, ZTA for Cloud-Native Apps in Multi-Cloud — https://csrc.nist.gov/pubs/sp/800/207/a/final (PDF: https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207A.pdf)
- OWASP Threat Modeling Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html
- OWASP Threat Modeling (community) — https://owasp.org/www-community/Threat_Modeling
- OWASP Developer Guide — Principles of Security — https://devguide.owasp.org/en/02-foundations/03-security-principles/
- OWASP Authorization Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- OWASP Least Privilege Principle — https://owasp.org/www-community/controls/Least_Privilege_Principle
- OWASP Fail Securely — https://owasp.org/www-community/Fail_securely
- OWASP Secure Product Design Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html
