---
name: integration-engineering
description: Use for public APIs, webhooks, third-party connectors, and data integration — REST/OpenAPI contracts + versioning + idempotency, signed/idempotent webhooks, the transactional outbox + DLQ, resilient outbound calls (timeout/retry/circuit-breaker), contract testing, and SSRF-safe boundaries. Trigger on "build/expose an API", "webhooks", "integrate with <service>", "connector", "ETL/sync", "rate limit/versioning", or any system-to-system boundary.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Integration Engineering

The boundaries between systems — public APIs, webhooks, connectors, data sync — are where enterprise
products break. This skill makes them contract-driven, idempotent, resilient, and secure. Backs the
`integration-engineer`; consumes contracts from the `solution-architect`; security-reviewed before
release. Honors `secure-coding`. User > skills > default.

## Fits in the pipeline
Stage 4 (contracts in the module map), Stage 6 (implementation with backend-engineer), Stage 7 (security
review of the integration boundary + contract tests).

## API design (public REST)
- **Resource-oriented**, plural nouns, no deeper than collection/item/collection; never mirror the DB
  schema. Correct HTTP semantics + status codes. **OpenAPI is the versioned contract** (source of truth;
  spec diffs are a breaking-change review gate). **Every breaking change = a new explicit version.**
- **Idempotency:** PUT/DELETE idempotent; mutating **POST/PATCH MUST accept an `Idempotency-Key`** and
  dedupe server-side. **Pagination** with a continuation token + an **enforced server-side max page
  size** (cap oversized `limit` to prevent DoS). **Errors = `application/problem+json` (RFC 9457)**
  (`type`/`title`/`status`/`detail`/`instance`). **Rate-limit** per client → `429` + retry hints.

## Webhooks
- Assume **at-least-once** (duplicates, out-of-order). **Sign + verify HMAC over the RAW body BEFORE
  parsing** (parsing first corrupts the signed bytes); bind `id.timestamp.body`; **timing-safe** compare;
  **replay window** (~5 min, NTP-synced) reject stale. **Idempotent consumers:** persist the event id,
  skip seen ids, and commit the idempotency record + side-effect in the **same transaction**. **Ack fast,
  work async** (verify → enqueue → 2xx). Producers **retry with exponential backoff**; HTTPS/TLS only;
  IP allowlist is secondary to signature verification.

## Async / event-driven
- **No dual writes** — use the **transactional outbox** (write the event in the SAME transaction as the
  business change; a relay publishes it). At-least-once → **idempotent consumers dedupe on event id**.
  Preserve per-aggregate ordering. **Dead-letter queue** for persistent failures — never silently drop.

## Third-party / connectors + ETL
- OAuth to external APIs with **least-privilege scopes**; secrets in a vault, never in code/config/repo.
  **Every outbound call: timeout + bounded retry (backoff + jitter, transient only) + circuit breaker**
  (use Polly/Resilience4j, don't hand-roll). **Contract tests (Pact)** gate provider/consumer changes in
  CI (`can-i-deploy`); keep contracts loose. ETL: prefer **ELT**, validate at the boundary (quarantine/
  DLQ bad records), **idempotent upsert loads**, re-runnable backfills.

## Security at the boundary
- **Inbound:** validate + authN + authZ everything; no endpoint trusts its caller.
- **Outbound SSRF (OWASP A10):** allowlist scheme/host/port (http/https only), **disable redirect
  following**, validate the **resolved IP** (defeat DNS rebinding), and **block private/loopback +
  metadata IPs** (`169.254.169.254`, `metadata.google.internal`, 10/8, 172.16/12, 192.168/16, 127/8).
  No secrets in URLs or logs; least-privilege scopes on every credential.

## Guardrails (MUST / NEVER)
- **MUST:** versioned OpenAPI per API; RFC 9457 errors; webhooks HMAC-signed/verified-over-raw-body/
  replay-windowed/idempotent; idempotency keys on mutating POST; every outbound call has timeout+retry+
  circuit-breaker+SSRF-guard; outbox for publish-after-commit + DLQ; contract tests gate changes.
- **NEVER:** secrets in code/config/URLs/logs; dual-write DB+broker; trust a webhook by IP alone; parse a
  webhook body before verifying its signature; follow redirects or skip the resolved-IP check on
  user-influenced outbound URLs; silently drop a failed message.

## Sources
- RFC 9457 (problem+json): https://www.rfc-editor.org/rfc/rfc9457.html · MS API design:
  https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design · MS REST guidelines: https://github.com/microsoft/api-guidelines
- Webhooks: https://docs.stripe.com/webhooks · https://docs.svix.com/security
- Outbox: https://microservices.io/patterns/data/transactional-outbox.html · Resilience: https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker · https://learn.microsoft.com/en-us/azure/architecture/patterns/retry
- Contract testing: https://docs.pact.io/consumer · SSRF: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
