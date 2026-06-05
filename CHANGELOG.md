# Changelog

All notable changes to the `god-mode-sde` plugin are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

## [0.2.0] — Unreleased (enterprise org expansion)
### Added — full internal product org (departments → lead + specialists) + enterprise gates
- **8 new research-backed agents** (each ≤2 skills, one role, cited best-practices + guardrails):
  `delivery-manager` (TPM/RAID), `release-manager` (release trains/CAB/go-no-go),
  `ux-researcher`, `security-architect` (zero-trust/threat model/IAM), `compliance-grc`
  (SOC2/ISO27001/GDPR/HIPAA/PCI/VPAT), `test-automation-engineer` (SDET), `performance-engineer`
  (load/scale/SLA), `technical-writer` (Diataxis docs).
- **8 new skills** (each with a Guardrails section + cited sources): program-management,
  release-management, ux-research, security-architecture, compliance-grc, test-automation,
  performance-engineering, technical-writing.
- **6 new gate commands:** `/raid`, `/compliance-check`, `/perf-check`, `/docs-check`, `/release`,
  `/launch-readiness`. `/design-review` now adds the security-architect; `/ship-check` chains the
  pre-ship + release/GA gates.
- **Pipeline expanded:** cross-cutting Program/RAID track (TPM), security & privacy design review
  (Stage 4-5), performance lens in Stage 7 (SDET-backed), pre-ship gates (compliance/perf/docs),
  Release & GA launch readiness (SRE checklist + staged/canary rollout), and Stage 10 Operate.
- **Org model + RACI:** orchestrator delegation map reorganized into 11 departments with leads +
  specialists; one Accountable agent per gate; explicit hand-offs/feedback. No customer-facing roles.
- **Multi-swarm scaling pattern** documented in `dispatching-parallel-agents` (+ orchestrator
  Stage 6): when a build exceeds one swarm, the orchestrator + delivery-manager spin up multiple
  parallel swarms — partition chosen per build (module vs workstream) from the dependency graph,
  foundation-first, worktree-isolated, RAID-tracked, reconciled at the QA gate.
- Totals: **22 agents, 44 skills, 20 commands.** Validation clean; hooks 25/25.

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
- 2 web-sourced, cited best-practice skills: `engineering-excellence` (Google eng-practices,
  design docs, small-PR/fast-review, test pyramid/sizes, trunk-based dev, DORA, SRE SLOs/error
  budgets/blameless postmortems, NIST SSDF, AI harness engineering) and `product-discovery`
  (continuous discovery + opportunity-solution trees, working-backwards/PR-FAQ, RICE/WSJF/Kano,
  OKRs/North Star/HEART/AARRR, outcome roadmaps, JTBD/usability/MVP, Cagan's 4 risks, empowered
  teams, accessibility). `god-mode-principles` gained a Team Operating Standards section; the
  product-manager / solution-architect / devops-sre agents bind the new skills.
- UI/UX quality gate (web-sourced, cited): `ui-ux-excellence` skill (Nielsen heuristics, Gestalt,
  Laws of UX, 60-30-10 + WCAG contrast, type scale/measure, 8-pt grid, design tokens, responsive
  matrix + touch targets, four states + RAIL, motion/reduced-motion, broken-UI checklist + Core Web
  Vitals + visual-regression) + the `ux-design-reviewer` agent that renders a page across the
  breakpoint matrix, gates it for broken/inconsistent UI, and dispatches fixes to frontend-engineer
  + the `/ux-check` command. Wired as the Stage-7 UX lens (qa-gates + orchestrator); frontend-engineer
  now binds `ui-ux-excellence`.

### Changed — strict department isolation (one role per agent, ≤2 skills)
- **Design and engineering are now separate departments.** New `ui-ux-designer` agent (frontier
  model) owns ALL design — journeys, pages, components, buttons, fonts, color, spacing, motion,
  and the design system/tokens — plus every UI/UX guardrail (skills: ui-ux-excellence +
  frontend-craft). It produces a design spec; it does NOT write code.
- `frontend-engineer` is now pure implementation: it realizes the designer's spec to the token,
  makes no design decisions, and feeds feasibility back to the designer (skills: lang-typescript +
  test-driven-development).
- New `tech-lead` agent owns stack+cost (Stage 3) and the build roadmap (Stage 5) so the
  `solution-architect` narrows to blueprint + module architecture. Removed `ux-journey-designer`
  (folded into `ui-ux-designer`).
- **Every agent capped at ≤2 skills** (product-manager, backend-engineer, qa-engineer,
  ux-design-reviewer, solution-architect re-scoped accordingly).
- Orchestrator gained a **Team & collaboration model**: departments hand off and give feedback
  to each other (PM→designer→engineer; designer↔reviewer; architect↔tech-lead↔engineers; QA
  lenses→owning agent). Designers don't code; engineers don't design; reviewers don't ship past a fail.
- 14 agents total; validation clean.

### Deferred
- End-to-end dogfood of a full sample platform build.
