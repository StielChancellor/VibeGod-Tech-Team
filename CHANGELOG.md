# Changelog

All notable changes to the `god-mode-sde` plugin are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.0] — Unreleased (Phase A complete)
### Added
- Marketplace (`vibe-fde`) + plugin (`god-mode-sde`).
- `sde-orchestrator` lead skill driving the gated enterprise SDLC pipeline (FLOW-SPEC).
- `god-mode-principles.md` shared operating principles (Karpathy guidelines + user intake +
  OWASP/WCAG/OODA + consistency/no-orphans rule + cost-awareness + anti-AI-slop design).
- 28 skills total: 13 methodology skills adapted from superpowers (TDD, debugging, planning,
  code review, parallel agents, worktrees, verification) + 15 new domain skills (orchestrator,
  platform-blueprint, secure-coding, frontend-craft, accessibility-wcag, prd-authoring,
  journey-mapping, tech-stack-and-cost, module-architecture, build-roadmap, qa-gates,
  change-propagation, devops-delivery, data-engineering, codebase-knowledge-graph).
- 12 role subagents (architect, PM, ux-journey-designer, FE/BE/data engineers, devops-sre,
  ai-agent-engineer, + 4-lens QA swarm: security-engineer, code-quality-reviewer,
  adversarial-tester, qa-engineer).
- 13 pipeline commands (/kickoff /prd /journey /stack-and-cost /module-map /build-plan /build
  /feature-check /ship-check /change-request /design-review /ingest-scan /graph).
- 4 cross-platform Node.js guardrail hooks (guard-bash, guard-write, advise-posttool,
  session-start) — 23 unit tests passing; `GODMODE_GUARDRAILS=advisory` escape hatch.
- Self-validation (`ingest/validate.mjs`) + hook tests (`ingest/test-hooks.mjs`).
- Attribution for ingested sources (all security-scanned CLEAN); ingest scan checklist.

- Interactive drag-drop journey canvas: dependency-free local Node server + HTML/JS canvas
  (`journey-mapping/canvas/`) — add/connect/comment/insert-on-edge steps, persists to JSON;
  server endpoints smoke-tested.
- 5 language-specific skills: `lang-typescript`, `lang-python`, `lang-go`, `lang-java-kotlin`,
  `lang-rust` (idiomatic style, toolchain, error/concurrency norms, language security pitfalls).
- `secure-coding` enriched with web-sourced, cited OWASP material: Top 10 **2025 RC1** mapping
  (A03 Supply-Chain, A10 Exceptional Conditions, SSRF→A01), supply-chain hardening (SCA tools,
  SLSA/provenance, install-script + typosquat defense), per-language injection-sink grep guide,
  and a primary-source reference list.
- Guardrail `guard-write` hook extended with SendGrid/npm/broader-Stripe secret patterns
  (gitleaks-derived); hook tests now 25/25.

### Deferred
- End-to-end dogfood of a full sample platform build.
