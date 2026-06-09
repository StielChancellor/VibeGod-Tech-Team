---
name: secure-coding
description: Apply OWASP-grounded secure coding when writing or reviewing backend, frontend, API, data, or infrastructure code, handling auth/secrets/user input, or doing a security pass. Use whenever code touches authentication, authorization, secrets, databases, file/network I/O, deserialization, or external input — and during the security-engineer QA lens and /ship-check.
allowed-tools: Read, Grep, Glob, Bash
---

# Secure Coding (OWASP)

Security is a default, not a phase. This skill backs the `security-engineer` agent, the
Stage-7 security QA lens, and `/ship-check`. The runtime guardrail hooks
(`guard-bash`, `guard-write`) enforce the hardest rules automatically; this skill is the
judgment layer.

## Fits in the pipeline
Continuous. Explicit gates at Stage 3 (threat model in the blueprint), Stage 6 (secure
implementation), Stage 7 (security QA lens), Stage 8 (`/ship-check`). Honors
vibegod-principles #7 (security by default). User > skills > default.

## OWASP Top 10 (2021) — what to enforce
- **A01 Broken Access Control** — deny by default; enforce authz on EVERY request server-side
  (never trust the client/UI); check object ownership (no IDOR); no privilege escalation paths.
- **A02 Cryptographic Failures** — TLS everywhere; encrypt sensitive data at rest; strong,
  current algorithms (Argon2/bcrypt/scrypt for passwords, AES-GCM, SHA-256+); never roll your
  own crypto; no secrets in code (hooks block this).
- **A03 Injection** — parameterized queries / prepared statements ONLY; never concatenate or
  interpolate untrusted input into SQL, shell, HTML, LDAP, or templates; encode output per
  context; avoid `eval`/dynamic code (hooks warn).
- **A04 Insecure Design** — threat-model in the blueprint (STRIDE); secure defaults; rate
  limits; abuse cases; fail safely (closed).
- **A05 Security Misconfiguration** — harden defaults; remove debug/sample/admin; least
  privilege; security headers (CSP, HSTS, X-Content-Type-Options, frame-ancestors).
- **A06 Vulnerable & Outdated Components** — pin & lock dependencies; run SCA (npm/pip/govuln
  audit); track CVEs; remove unused deps; never run untrusted package install scripts.
- **A07 Identification & Auth Failures** — strong session management (HttpOnly, Secure,
  SameSite cookies); MFA where appropriate; lockout/throttle; no default creds; rotate secrets.
- **A08 Software & Data Integrity Failures** — verify integrity of dependencies & CI artifacts;
  no insecure deserialization (`pickle`/`yaml.load`/Java native — hooks warn); sign releases.
- **A09 Logging & Monitoring Failures** — log security events; NEVER log secrets/PII/tokens;
  alert on anomalies; keep an audit trail.
- **A10 SSRF** — validate/allowlist outbound URLs; block private/loopback/metadata IPs
  (169.254.169.254, 10/8, 127/8); no user-controlled fetch without validation.

## OWASP Top 10:2025 (RC1 — forward-guidance, published Nov 2025)
Treat 2021 as the stable reference and 2025 RC1 as forward-guidance. Encode these deltas:
- **A03 Software Supply Chain Failures (NEW)** — now a top-tier risk (expands 2021 "Vulnerable
  Components"). Pin & lock deps, verify integrity/provenance (SLSA), vet packages, secure the
  build pipeline, block untrusted install scripts. See Supply chain below.
- **A10 Mishandling of Exceptional Conditions (NEW)** — handle errors/exceptions securely:
  fail CLOSED, never leak stack traces/secrets in error paths, don't swallow exceptions
  (ties to vibegod-principle #2: no silent error-swallowing).
- **SSRF folded into A01 Broken Access Control**; **Security Misconfiguration rises to A02**.
- Cheat-sheet note: the Access Control cheat sheet is **deprecated** → use the **Authorization**
  cheat sheet.

## OWASP Secure Coding Practices — checklist
- **Input validation:** validate at every trust boundary (type, length, range, format);
  allowlist over denylist; reject, don't sanitize-and-hope.
- **Output encoding:** context-aware (HTML, attribute, JS, URL, SQL) to prevent XSS/injection.
- **AuthN/Z:** centralize; enforce server-side; least privilege; re-check on every action.
- **Session mgmt:** secure cookies, rotation on login, idle/absolute timeouts, invalidate on logout.
- **Crypto:** vetted libraries; manage keys via a secret manager/KMS; encrypt in transit & at rest.
- **Error handling/logging:** generic errors to users, detailed server-side; no stack traces or
  secrets leaked; structured, tamper-evident logs without sensitive data.
- **Data protection:** classify data; minimize collection; mask/redact PII; secure deletion.
- **Comms:** TLS 1.2+; verify certs (never disable — hooks block); HSTS.
- **Config:** secure defaults; secrets from env/secret manager; separate per-environment config.

## Supply chain (OWASP A03:2025)
- Commit & pin lockfiles; enforce them in CI (`npm ci`, `pip install --require-hashes`,
  `go mod verify`); pin GitHub Actions to full commit SHAs, not tags.
- Run SCA in CI and fail on threshold: **`npm audit`**, **`pip-audit`**, **`govulncheck`**
  (call-graph-aware), **OWASP Dependency-Check** / **OSV-Scanner** (multi-ecosystem).
- Generate & verify build provenance (SLSA / in-toto / Sigstore `cosign`). Caveat: valid SLSA
  provenance proves *which pipeline* built an artifact, not that it was clean — also vet packages.
- Block untrusted lifecycle scripts (`npm ci --ignore-scripts`; prefer Python wheels over sdists).
- Defend dependency-confusion/typosquatting/"slopsquatting": verify name/owner/downloads before
  adding (esp. AI-suggested packages); scope internal packages (`@org/`).
- Scan ingested third-party content with `/ingest-scan` before adopting it.

## Secrets — absolute rules
- No secrets in code, commits, logs, error messages, or client bundles. Env vars / secret
  manager only. The `guard-write` hook blocks known secret patterns by default (a best-effort,
  fail-open heuristic — not a security boundary); treat a block as a prompt to fix the secret,
  not an obstacle to route around.

## How to run a security pass
1. Map trust boundaries and data flows; identify where untrusted input enters.
2. Walk the Top-10 against the change; check authz on every new endpoint/action.
3. Grep for sinks (`eval`, `exec`, shell=True, string-built SQL, innerHTML, deserialization).
4. Confirm secrets handling, TLS, headers, logging-without-PII, dependency posture.
5. Produce findings with severity + concrete fix; REJECT if a critical issue is unresolved.

## Injection sinks to grep, per language (warn → fix)
The real fix is always: arg-array exec (`shell=false`), parameterized queries, framework
auto-escaping, and safe parsers — regex detection is only defense-in-depth (CWE-77/78/94).
- **JS/TS:** `eval`, `Function`, `child_process.exec`/`execSync`, `spawn({shell:true})`,
  `innerHTML`/`document.write`/`insertAdjacentHTML`, `dangerouslySetInnerHTML`, proto-pollution merges.
- **Python:** `eval`/`exec`/`compile`, `os.system`/`os.popen`, `subprocess(shell=True)`,
  `pickle.load(s)`, `yaml.load` (non-safe), Django `.raw()`/`.extra()`/`RawSQL`, XML w/o `defusedxml`.
- **Go:** `exec.Command` with `sh -c`, `fmt.Sprintf` into `db.Query/Exec`, `text/template` for HTML,
  `template.HTML`/`template.JS` escape-bypass.
- **Java/Kotlin:** `Runtime.exec(String)`/`ProcessBuilder` concat, `ObjectInputStream.readObject`,
  `XMLDecoder`, `ScriptEngine.eval`, SpEL/OGNL, `Statement` + concat (use `PreparedStatement`).
- **Ruby:** `system`/`exec`/backticks/`%x`, `eval`/`instance_eval`, `Marshal.load`, `YAML.load`,
  `where("...#{x}...")`.
- **PHP:** `exec`/`shell_exec`/`system`/`passthru`/backticks, `eval`/`assert`/`create_function`,
  `unserialize`, `include`/`require` with input, concatenated `mysqli_query`/`PDO::query`.

## Sources (primary, 2024–2026)
- OWASP Top 10: https://owasp.org/Top10/2021/ · 2025 RC1: https://owasp.org/Top10/2025/0x00_2025-Introduction/
- OWASP Cheat Sheets: Input Validation, SQL Injection, XSS, Authentication, Session Management,
  Authorization (supersedes deprecated Access Control), Cryptographic Storage, Secrets Management,
  Logging, SSRF, Deserialization, OS Command Injection, Vulnerable Dependency Management, CI/CD,
  Node.js, NPM, Prototype Pollution, Django — https://cheatsheetseries.owasp.org/
- CWE-77/78/88/94: https://cwe.mitre.org/ · Secret rules: gitleaks/trufflehog/detect-secrets
- Supply chain: SLSA https://slsa.dev/ · govulncheck https://go.dev/security/vuln/ ·
  pip-audit · npm audit/provenance · OWASP Dependency-Check · OSV-Scanner
