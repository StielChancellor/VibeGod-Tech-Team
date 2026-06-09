---
name: identity-access
description: Use for authentication, authorization, SSO, and multi-tenant isolation — OIDC/OAuth2 + PKCE, enterprise SAML SSO, SCIM provisioning, RBAC/ABAC/ReBAC, deny-by-default server-side authz, tenant isolation, sessions/tokens/MFA. Trigger on "login/auth", "SSO/SAML/OIDC", "SCIM/provisioning", "roles/permissions/RBAC", "multi-tenant isolation", "tokens/sessions/MFA", or any identity/access decision.
allowed-tools: Read, Grep, Glob, Bash
---

# Identity & Access (IAM)

Standards-based identity, authorization, and tenant isolation for enterprise multi-tenant SaaS. Backs
the `identity-access-engineer`; implements under the `security-architect`'s zero-trust design and is
reviewed by `security-engineer`. Honors vibegod-principles + `secure-coding`. User > skills > default.

## Fits in the pipeline
Stage 4 (the security-architect sets the isolation/trust model), Stage 6 (implementation), Stage 7
(security review of authz + cross-tenant isolation). Continuous.

## AuthN — standards only
- **OIDC (Authorization Code + PKCE) for user login** — PKCE is mandatory for public clients and the
  AS must reject downgrade. OAuth alone = delegated access ("what can this app do"); OIDC adds identity
  ("who is the user") via a signed ID token. **SAML 2.0 for enterprise SSO** where the customer IdP
  (Okta/Entra/Google) requires it — validate assertion signature, issuer, audience, timestamps.
- **Bans:** the Implicit grant and **ROPC/password grant** (blocks MFA, leaks creds). **Exact-match
  redirect URIs** (no wildcards). **Audience-restrict** access tokens (`aud`). Prefer **short-lived
  access tokens + refresh-token rotation** (one-time use; reuse → revoke the chain) or sender-constraint.

## Provisioning + SSO lifecycle
- **SCIM 2.0** for the full lifecycle: provision (POST), update (PATCH/PUT), and **DELETE to
  deprovision** (a security control on offboarding, not a convenience). **JIT** from the SSO assertion
  for low-friction onboarding; pair with SCIM for authoritative deprovisioning. Per-tenant IdP config —
  never share trust across tenants.

## AuthZ
- **Deny by default**; explicit grant only. **Enforce server-side in ONE trusted code path, on EVERY
  object access** (the attacker can modify the client). **Least privilege**; verify record ownership to
  stop IDOR. RBAC (coarse) / ABAC (context) / ReBAC (relationships); externalize policy with **OPA/Rego
  or Cedar** so rules change without redeploying app code.

## Multi-tenancy isolation (non-negotiable)
- A single cross-tenant crossing is potentially unrecoverable — **authentication is NOT isolation.**
  Pick a model deliberately (silo / pool / bridge); enforce an isolation construct on every request.
- **Derive tenant context from the validated token, NEVER from a client-supplied `tenant_id`.** Use DB
  **row-level security** as defense-in-depth for pool models (`ENABLE ROW LEVEL SECURITY` + a tenant
  policy); the app/connection role must NOT hold superuser/`BYPASSRLS` (use `FORCE ROW LEVEL SECURITY`).

## Sessions, tokens, secrets
- Cookies `HttpOnly` + `Secure` + `SameSite` explicitly. Session IDs ≥64-bit entropy; **regenerate on
  login** (anti-fixation). Idle + absolute timeouts server-side. **MFA** wherever practical and
  **required for privileged/admin**. Generic, **constant-time** auth errors (anti-enumeration); lockout/
  rate-limit **per account**. Strong adaptive password hashing.
- **Never hardcode keys/secrets** — managed KMS/secret store; rotate signing keys via **JWKS/`kid`** with
  overlapping keys for zero-downtime rollover.

## Guardrails (MUST / NEVER)
- **MUST** deny-by-default; enforce authz server-side on every object access from the validated token;
  guarantee **zero cross-tenant leakage** (authz check + RLS, not auth alone); require MFA for privileged
  access; use standards (OIDC/OAuth/SAML/SCIM).
- **NEVER** use implicit/ROPC; trust a client-supplied `tenant_id`/object id without an ownership check;
  roll homegrown crypto or homegrown SSO; hardcode keys; leak which usernames exist.

## Sources
- OAuth 2.0 BCP RFC 9700: https://datatracker.ietf.org/doc/html/rfc9700 · OIDC Core: https://openid.net/specs/openid-connect-core-1_0.html
- SCIM RFC 7644: https://datatracker.ietf.org/doc/html/rfc7644 · Okta SAML: https://developer.okta.com/docs/concepts/saml/
- OWASP A01 Broken Access Control: https://owasp.org/Top10/2021/A01_2021-Broken_Access_Control/ ·
  Session/Auth cheat sheets: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html ·
  https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- Tenant isolation (AWS SaaS Lens): https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/tenant-isolation.html ·
  Postgres RLS: https://www.postgresql.org/docs/current/ddl-rowsecurity.html · OPA: https://www.openpolicyagent.org/docs · Cedar: https://docs.cedarpolicy.com/
