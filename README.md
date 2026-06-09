# God-Mode SDE

> A virtual enterprise engineering + product team for Claude Code. Install it, and a lead
> orchestrator guides you through building (or improving) any platform end-to-end — with a
> strict, gated SDLC, best-effort security/QA guardrails at runtime, and OWASP + WCAG + OODA
> baked in.

This repository is a **Claude Code plugin marketplace** (`vibe-fde`) hosting one plugin:
**`god-mode-sde`**.

## Install (Claude Code desktop)

```
/plugin marketplace add StielChancellor/God-Mode-VibeSDE
/plugin install god-mode-sde@vibe-fde
```

## What you get

- **A lead orchestrator** (`sde-orchestrator`) that runs a strict, gated pipeline and never
  jumps straight to code:

  `Discover -> PRD -> Journey -> Stack & Cost -> Modules -> Security/Privacy review ->
   Foundation-first Build -> Per-feature QA -> UAT/Smoke -> Compliance/Perf/Docs gates ->
   Release & GA readiness -> Operate`  (any change re-enters at PRD; a cross-cutting RAID/TPM
   track runs throughout)

- **A full internal product org — 27 specialist subagents across 11 departments** (each ≤2
  skills, one role, collaborating via explicit hand-offs/RACI):
  - **Program/Delivery:** delivery-manager (TPM), release-manager
  - **Product:** product-manager · **Design/UX:** ui-ux-designer (frontier), ux-researcher
  - **Architecture:** solution-architect, tech-lead, security-architect
  - **Engineering:** frontend-, backend-, data-, ai-agent-, identity-access-, integration-engineer · **Reliability/Ops:** devops-sre, incident-manager (Incident Commander)
  - **Analytics:** analytics-engineer (tracking plan, instrumentation, dashboards)
  - **Quality:** qa-engineer, adversarial-tester, code-quality-reviewer, ux-design-reviewer,
    test-automation-engineer (SDET), performance-engineer, claim-verifier (independent
    falsification of claims/diagnoses — catches confident hallucinations)
  - **Security & Compliance:** security-engineer, compliance-grc · **Docs:** technical-writer
  - (No customer-facing roles — internal product delivery only.)

- **One coordinator voice (single front-door):** you talk to the `sde-orchestrator`
  (program/delivery-lead); it consults product-manager (scope) + delivery-manager (delivery) and
  the specialists underneath, preserves your decision-gates, and runs a **user-perspective
  acceptance** pass before ship — you still give the final go/no-go. You can ask to hear any
  specialist directly ("front-door, not a wall").

- **Battle-tested methodology skills** (adapted from superpowers): TDD, systematic debugging,
  planning, code review, parallel-agent dispatch, git worktrees, verification-before-completion.

- **Distinctive UI, not AI-slop:** the `design-refinement` skill (adapted from Impeccable, Apache-2.0)
  + the `/polish` gate enforce real loaded fonts (no Inter/system), a committed color strategy (no
  default Tailwind blue), a default Tailwind + shadcn/Radix component system, a per-project `DESIGN.md`,
  and an anti-cliché blocklist — audited by the `ux-design-reviewer` before ship.

- **Runtime guardrails (hooks):** best-effort blocks for secrets-in-code and common dangerous
  shell commands (POSIX **and** Windows/PowerShell), plus advisory flags for injection sinks and
  unquoted secrets and nudges for tests/lint/change-propagation. These are heuristic speed bumps —
  a safety net, **not** a security boundary, and they fail open. Node.js, no deps. Downgrade blocks
  to warnings with `GODMODE_GUARDRAILS=advisory`.

- **Compliance by default:** OWASP Top 10 + Secure Coding, WCAG 2.2 AA accessibility, OODA
  iteration, and cost-aware stack selection (always shows cheaper alternatives + tradeoffs).

- **Codebase awareness:** optional [graphify](https://github.com/safishamsi/graphify)
  integration (detect -> offer auto-install -> proceed-without -> lighter built-in fallback).

## Commands

`/kickoff` `/triage` `/prd` `/journey` `/stack-and-cost` `/module-map` `/design-review` `/build-plan`
`/build` `/feature-check` `/ux-check` `/polish` `/ship-check` `/compliance-check` `/perf-check`
`/docs-check` `/release` `/launch-readiness` `/change-request` `/raid` `/incident` `/ingest-scan` `/graph`

## Security & provenance

Every third-party source bundled here was security-scanned (static, read-only, no install
scripts executed; markdown checked for prompt-injection) before ingestion. See
[`ingest/reports/`](ingest/reports/) and [`ATTRIBUTION.md`](ATTRIBUTION.md).

## License

MIT — see [`LICENSE`](LICENSE).
