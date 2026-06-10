# Changelog

All notable changes to the `vibegod-tech-team` plugin are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

## [0.7.0] — Journey canvas (Stage 2): readable + server-less
### Fixed (from field feedback)
- **The canvas server no longer dies.** The old `canvas/server.mjs` was launched inside the
  ui-ux-designer subagent and reaped on return (dead port). **Retired the server entirely** — the
  canvas is now a **self-contained single-file HTML** (`canvas/journey-canvas.html`) the agent injects
  the journey into (`__JOURNEY_DATA__` token) and writes as `journey.html`; the user opens it directly
  (`file://`), no process to keep alive. Deleted `server.mjs` and the old fetch-based `index.html`.
- **Readable by default (was 68 nodes on one plane).** New `journey-mapping` generation rules: **happy
  path ≤ ~12 boxes**, **swimlanes**, **plain-language labels** (never technical ids like `b_ai_trigger`),
  and error/loading/empty states as `level:"detail"` **collapsed under their parent** with progressive
  disclosure. The canvas renders swimlanes, shows the happy path by default, and expands detail on demand.
### Changed
- **Journey JSON schema v2:** added `lanes[]`, and per-node `lane` / `kind` / `level` / `parent`
  (backward-tolerant defaults). `x`/`y` are now optional drag overrides (auto-layout by lane + sequence).
- **Read-back is now Copy-JSON → paste in chat** (no server, no file to locate). Always also commit a
  happy-path Mermaid snapshot for diffability. `journey.md` + `ui-ux-designer` updated.
- Canvas is **keyboard-accessible** (Tab/arrows/Enter/Del, ARIA, focus ring) and respects reduced-motion.
- `ingest/validate.mjs` guards the new template (1 injection token, Copy-JSON control, no leftover server).
  Verified in jsdom: renders 4 lanes, happy-path-only by default, progressive-disclosure toggle, 0 runtime errors. Bump 0.6.1 → 0.7.0.

## [0.6.1] — Acceptance test: guardrail hardening
### Fixed (clear-win weak links found by the adversarial hook break-tests)
- **Guardrails now fail OPEN on internal error.** `guard-bash`/`guard-write` install
  `uncaughtException`/`unhandledRejection` handlers that exit 0 — a thrown heuristic never aborts a
  legitimate command/write (they're a best-effort safety net, not a boundary).
- **`guard-bash`:** `find … -exec (chmod|chown|shred|truncate|dd|mv)` on a critical path now blocks
  (previously only `-delete`/`-exec rm`); interpreter fork-bombs (`perl/ruby/php/python … fork … while`)
  now block; `rm -rf $(…)` command-substitution targets now raise an advisory (previously silent).
- **`guard-write`:** private-key detection extended to `ENCRYPTED PRIVATE KEY` (PKCS#8 encrypted) headers.
- **`ingest/test-hooks.mjs`:** +4 cases for the above (now **46/46**).
- **journey canvas server:** handles `EADDRINUSE`/listen errors gracefully (friendly message + exit 1)
  instead of an unhandled `error` event crash.
### Accepted (inherent heuristic limits — documented, not "fixed")
- Fully runtime-resolved indirection (e.g. a dangerous path entirely inside a shell variable, or a
  base64-decoded command target) can't be statically caught — these now warn where detectable, but the
  guards remain best-effort and fail-open by design.

## [0.6.0] — Rebrand: God-Mode SDE → VibeGod Tech Team
### Changed
- **Full rebrand.** Display name `God-Mode SDE` → **`VibeGod Tech Team`**; plugin id `god-mode-sde`
  → `vibegod-tech-team`; marketplace `vibe-fde` → `vibegod` (install: `vibegod-tech-team@vibegod`);
  GitHub repo `God-Mode-VibeSDE` → `VibeGod-Tech-Team` (install URLs updated in `install.ps1`/`install.sh`).
- **Deep scrub of internal handles:** the lead skill `sde-orchestrator` → `vibegod-orchestrator`, and
  the shared `_shared/god-mode-principles.md` → `_shared/vibegod-principles.md` (all ~115 references
  across the 27 agents / 50 skills / 23 commands updated in lockstep).
- **Guardrail env var renamed** `GODMODE_GUARDRAILS` → `VIBEGOD_GUARDRAILS` (and `[GODMODE advisory]`
  → `[VIBEGOD advisory]`) across the hook scripts + tests.
- **Note:** this is a NEW plugin identity — `vibegod-tech-team@vibegod` does not auto-update from
  `god-mode-sde@vibe-fde`; reinstall under the new name. License id `LicenseRef-GodModeSDE-1.0` →
  `LicenseRef-VibeGodTechTeam-1.0`. Validation clean; hooks 42/42.

## [0.5.1] — Unreleased (README rewrite + source-available license)
### Changed
- **README fully rewritten for clarity and audience.** Leads with the problem vibe-coders feel
  (AI-slop look, security holes, no tests, spaghetti-at-scale), the USPs, then "one plugin = a
  complete company" (27 agents across 11 departments grouped into Product / Design / Architecture /
  Engineering / Quality / Security & Compliance / Delivery-Release-Ops / Docs teams), a plain-English
  feature table, install, credits, and contributing. Counts corrected to 27 agents · 50 skills · 23 commands.
- **Credits section** thanks and links every upstream project (superpowers/@obra, graphify/safishamsi,
  Impeccable/@pbakaus + Anthropic frontend-design + ehmo/typecraft, andrej-karpathy-skills).
- **License changed from MIT to a custom source-available license** (`LICENSE`,
  `LicenseRef-GodModeSDE-1.0`): personal/non-commercial use is free; commercial use requires visible
  credit + a link back; any modification to the project's code must be contributed back as a PR; no
  rebranding/reselling as your own. Bundled third-party components KEEP their original MIT/Apache-2.0
  licenses (Section 6 + `ATTRIBUTION.md`) — those rights are unaffected. Project open for contribution.
- plugin.json `license` field updated accordingly; validation clean, official `claude plugin validate` ✔.

## [0.5.0] — Unreleased (anti-hallucination — claim-verifier agent)
### Added
- **`claim-verifier` agent (27th specialist).** An epistemic red-team that independently
  FALSIFIES the team's CLAIMS — diagnoses, root-cause stories, and "fixed / works / non-issue"
  verdicts — before they reach the user. Complements `adversarial-tester` (which breaks *features*)
  by breaking *claims*. Skills: `verification-before-completion` + `systematic-debugging`. Wired into
  the Stage 7 per-feature gate (it validates the other lenses' verdicts, not just the code), the
  Stage 8 ship gate, and any conclusion that overrides prior evidence.
### Changed
- **`verification-before-completion` skill hardened with five anti-hallucination rules:**
  (1) verify the real user-observable end state, not a proxy/inventory/count; (2) reproduce the exact
  reported symptom before calling it absent/fixed/non-issue; (3) run a disconfirmation pass ("if I'm
  wrong, what would I see?"); (4) treat any contradiction with another agent / the user / a prior run
  as a STOP — reconcile by reproducing both, never override evidence with an argument; (5) escalate
  high-stakes/contested claims to `claim-verifier`. New table rows + red flags encode the
  `plugin details` (proxy) vs `plugin list` (real load) trap that produced a wrong "non-issue" call.
- Orchestrator delegation map + Stage 7 row updated to include `claim-verifier`. README agent count
  corrected to **27** (was a stale "22").
- Rationale: the duplicate-hooks miss was a *verification-methodology* failure (a proxy metric read
  as ground truth, a contradicting hands-on result dismissed by argument), not a knowledge gap —
  so the fix is process, enforced by a dedicated lens.

## [0.4.2] — Unreleased (plugin load fix — duplicate hooks)
### Fixed
- **The plugin failed to load (`✘ failed to load`).** `plugin.json` declared
  `"hooks": "./hooks/hooks.json"`, but Claude Code already auto-loads `hooks/hooks.json` by
  convention — so the manifest reference is a *second* registration of the same file, and the
  loader rejects it: *"Duplicate hooks file detected … The standard hooks/hooks.json is loaded
  automatically, so manifest.hooks should only reference additional hook files."* Removed the
  field (kept `hooks/hooks.json` itself untouched — it auto-loads). Verified the plugin now
  loads `✔ enabled` via `claude plugin list` with all 3 hook events active.
- **`ingest/validate.mjs` now guards against this regression.** It errors if `plugin.json`'s
  `hooks` field points at the auto-loaded `hooks/hooks.json`. Note: the official
  `claude plugin validate` does **not** catch this (it reports ✔ even when the plugin fails to
  load — the failure only surfaces in `claude plugin list`), so the homegrown guard is the real
  backstop here. Mutation-tested.
- Note for verifiers: check real load status with `claude plugin list` (`✔ enabled` /
  `✘ failed to load`), NOT `claude plugin details` — `details` prints the static inventory
  (e.g. `Hooks (3)`) even for a plugin that fails to load.

## [0.4.1] — Unreleased (frontmatter integrity fix)
### Fixed
- **13 skills/commands silently loaded with EMPTY metadata.** Their YAML frontmatter
  `description:` values were unquoted but contained a colon-space (`: `) — e.g. "Start a new
  **build: dump** everything", a trailing "**Args: **…", "**Verdict: **…", or "a hard **gate: **…".
  A real YAML parser reads `: ` as a nested mapping → "Unexpected token" → it drops the ENTIRE
  frontmatter, so those commands shipped with no description (blank in the `/` menu) and
  `build-roadmap` lost its `name`, `description`, AND `allowed-tools`. Affected: `build-roadmap`
  (skill) + commands `compliance-check, docs-check, incident, ingest-scan, kickoff,
  launch-readiness, perf-check, polish, raid, release, triage, ux-check`. All values are now
  quoted (inner quotes escaped). Verified with the official `claude plugin validate` (✔ pass).
- **Hardened `ingest/validate.mjs`** so this class can't regress: it now rejects unquoted
  frontmatter scalars a YAML parser would choke on (colon-space, trailing colon, inline `' #'`,
  or a leading indicator char). Previously its field regex grabbed everything after the first
  colon, so it reported "clean" while the real parser failed. Mutation-tested (re-breaking a
  file is now caught).
- **CI cross-checks with the official validator.** The GitHub Action now also runs
  `claude plugin validate ./plugins/god-mode-sde` (installs `@anthropic-ai/claude-code`) so
  anything the homegrown linter misses is caught upstream. Hooks still 42/42.

## [0.4.0] — Unreleased (enterprise-coverage gaps from the audit)
### Added — close the top audit gaps (each research-backed + cited)
- **Gap #1 — analytics-engineer + `analytics-instrumentation` skill:** tracking-plan-as-contract,
  Object-Action events, server-preferred instrumentation + identity stitching + idempotency, North Star
  + inputs / AARRR / HEART, experiment guardrails, and hard privacy rules (no PII in events, consent,
  instrument before GA). Wired into the orchestrator (Analytics & data) + Stages 1/6/8/10.
- **Gap #3 — risk-tiered express lane:** `change-risk-triage` skill + `/triage` command. A 4-tier model
  (trivial/low/standard/high-emergency) + gate matrix so trivial changes skip non-applicable gates, with
  FOUR always-on safety gates that never skip (CI+tests, security scan, ≥1 non-author review, no-orphans);
  emergency post-hoc audit + PIR. Owned by delivery-manager; orchestrator runs it first.
- **Gap #2 — identity-access-engineer + integration-engineer (+ `identity-access`, `integration-engineering`
  skills):** IAM (OIDC/PKCE, SAML SSO, SCIM, RBAC/ABAC/ReBAC, deny-by-default server-side authz, multi-tenant
  isolation + RLS, sessions/MFA) and integrations (OpenAPI contracts + versioning + idempotency, signed/
  idempotent webhooks, transactional outbox + DLQ, resilient outbound + SSRF guards, contract testing).
- **Operate depth — incident-manager + `incident-management` skill + `/incident`:** Incident Commander
  role (Google SRE — IC/Ops/Comms/Planning, decide≠fix≠communicate), severity tiers, **mitigate before
  root-cause**, burn-rate on-call alerting + runbooks, and **blameless postmortems** with tracked action
  items (every SEV1/2); ties incidents to the error budget. Wired into Stage 10 (incident-manager = IC,
  devops-sre = Ops Lead) + the Reliability/Ops delegation.
- **Proactive graphify recommendation (tech-lead):** at the build plan (Stage 5), the tech-lead now
  proactively recommends installing graphify (free/OSS) for real cross-module impact analysis, with the
  install-now (`/graph`) or proceed-with-fallback choice — surfaced before the first build/change so
  change-propagation runs on facts, not memory. (tech-lead agent + build-roadmap skill + /build-plan.)
- **Tidy + integrity:** the validator now also enforces **agent↔skill existence**, the **≤2-skills
  cap**, and that every **`${CLAUDE_PLUGIN_ROOT}` file reference resolves** (60 checked, 0 dangling) —
  so stale bindings/refs can't slip in (and CI catches them). Removed the stale one-shot
  `ingest/fix-frontmatter.mjs`; reclaimed the gitignored scratch (172 MB → 126 KB).
- Totals: **26 agents, 50 skills, 23 commands.** Validation clean; hooks 42/42. Bump to 0.4.0.

## [0.3.0] — Unreleased (design refinement — kill the "AI-slop" look)
### Added
- **`design-refinement` skill** (adapted from Impeccable, pbakaus/impeccable, Apache-2.0 — TEXT only,
  no scripts; credits Bakaus + Anthropic frontend-design + ehmo): register (brand vs product), the
  slop test, reflex-reject font list, font-selection procedure, committed color strategy, an
  anti-cliché blocklist, and the audit→polish→critique workflow. Plus the **`/polish`** command.
- **Default web stack = Tailwind v4 + shadcn/ui (Radix) + real fonts** (Fontsource/`next/font`) wired
  into `frontend-craft`, `lang-typescript`, `tech-stack-and-cost` — re-theme tokens (no default
  Tailwind blue / system fonts).
- **Per-project `DESIGN.md`** required from `ui-ux-designer` (named aesthetic + real reference + real
  fonts + tokens + banned-patterns list); `frontend-engineer` builds to it and runs `/polish`.
- **Distinctiveness/cliché lens** added to `ux-design-reviewer` + the Stage-7 `qa-gates`.
- Key insight encoded: **design boldly first, audit a11y at review** (a11y reminders mid-design make
  output timid). Impeccable scanned CLEAN (text only); attribution + report recorded.
- **Dogfood proof:** the Focus Timer was rebuilt with real Google Fonts (Big Shoulders Display +
  Hanken Grotesk + Spline Sans Mono) and a committed "anodized instrument" aesthetic — no longer a
  generic centered card. Visual gate caught a 320px overflow → fixed → 7/7 clean.
- 45 skills / 22 agents / 21 commands; validation clean.

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
- **Single front-door interaction model:** the orchestrator is the one user-facing coordinator
  (program/delivery-lead persona) consulting product-manager (scope) + delivery-manager (delivery)
  underneath; user decision-gates preserved; direct specialist consult on request; delivery-manager
  and product-manager clarified to never message the user directly. A coordinator-led
  **user-perspective acceptance** pass runs before ship — user's final sign-off still required.
- **Portable Playwright visual-check tool** (`skills/ui-ux-excellence/tools/visual-check.mjs`): renders a
  URL across the 320→1920 breakpoint matrix, screenshots each, and flags horizontal overflow / broken
  images / oversized elements / console errors to `report.json` (exit 1 if broken). Resolves Playwright
  from the project; graceful install message if missing. Wired into ui-ux-excellence, ux-design-reviewer,
  and `/ux-check`. Verified end-to-end (caught a planted overflow + broken image).
- **CI:** GitHub Action (`.github/workflows/ci.yml`) runs `validate.mjs` + `test-hooks.mjs` on
  every push and PR, keeping manifests/skills/agents/commands and the guardrail hooks green.
- Totals: **22 agents, 44 skills, 20 commands.** Validation clean; guardrail hooks 42/42
  (after the runtime-hardening pass).

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
