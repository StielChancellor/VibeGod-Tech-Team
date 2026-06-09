# Final deduped taxonomy (vibegod-tech-team)

Decisions: lead = vibegod-orchestrator absorbs superpowers' dispatcher · planning = layer
(reuse superpowers + add architecture) · test/review = adopt superpowers as canonical, drop
my dupes · graphify = detect/auto-install/proceed-without + fallback skill.

## Skills

### Adopted verbatim-ish from superpowers (MIT, attributed)
- brainstorming
- writing-plans
- writing-skills
- test-driven-development          ← canonical testing (my `testing-verification` DROPPED)
- verification-before-completion   ← canonical "prove it" gate
- systematic-debugging
- subagent-driven-development
- executing-plans
- dispatching-parallel-agents
- finishing-a-development-branch
- using-git-worktrees
- requesting-code-review            ← canonical review (my `code-review-discipline` DROPPED)
- receiving-code-review
(using-superpowers → ABSORBED into vibegod-orchestrator, not shipped separately)

### New (authored for this plugin)
- vibegod-orchestrator      (LEAD: enterprise SDLC + dispatch; absorbs using-superpowers)
- platform-blueprint    (enterprise architecture layer atop brainstorming/writing-plans: ADRs, NFRs, threat model)
- secure-coding         (OWASP, secrets, authz, supply chain)
- frontend-craft        (builds on user's settings.json aesthetics)
- devops-delivery       (CI/CD, IaC, containers, release)
- data-engineering      (schemas, pipelines, migrations)
- codebase-knowledge-graph (graphify detect/auto-install/fallback)
- _shared/vibegod-principles.md (Karpathy 4 guidelines + superpowers priority rule + user principles + enterprise defaults)

### Dropped (my duplicates, superseded by superpowers)
- testing-verification   → use test-driven-development + verification-before-completion
- code-review-discipline → use requesting-code-review + receiving-code-review
- agent-orchestration    → covered by subagent-driven-development + dispatching-parallel-agents + vibegod-orchestrator

## Agents
solution-architect · backend-engineer · frontend-engineer · security-engineer (also powers
/ingest-scan) · qa-engineer · devops-sre · data-engineer · ai-agent-engineer · product-manager

## Commands
/kickoff · /design-review · /ship-check (enterprise security+QA gate; calls superpowers
review+verification) · /ingest-scan

## Hooks (Node.js, cross-platform)
guard-bash.mjs (PreToolUse Bash, hard block) · guard-write.mjs (PreToolUse Edit|Write,
secrets/injection) · advise-posttool.mjs (PostToolUse, nudges incl. change-propagation
reminder) · session-start.mjs (SessionStart, bootstrap orchestrator + principles; adapted
from superpowers' hook pattern)

---

# v2 — EXPANDED after intake C (pipeline, design, QA swarm)
See `FLOW-SPEC.md` for the full 15-step pipeline. Additions below.

## New skills
- prd-authoring          (PRD create/maintain; modular-by-default; change re-enters here)
- journey-mapping        (frontier-model flow/journey diagram + local drag-drop canvas)
- tech-stack-and-cost    (stack design + cost gate; cheaper-alternative-with-tradeoffs)
- module-architecture    (module decomposition + interfaces/contracts; dynamic linking)
- build-roadmap          (foundation-first roadmap, milestones, TDD/UAT/smoke/QA plans)
- qa-gates               (per-feature multi-lens QA swarm + final UAT/smoke; #9/#10)
- accessibility-wcag     (WCAG 2.2 AA enforcement)
- change-propagation     (PRD→blueprint→roadmap→graphify→code sync; #6/#12)
- (platform-blueprint absorbs OWASP/OODA/NFR framing; frontend-craft absorbs <frontend_aesthetics>)

## New / refined agents
- ux-journey-designer    (NEW; runs at FRONTIER model for the journey canvas, Stage 2)
- code-quality-reviewer  (NEW; refactor/simplify QA lens, Stage 7)
- adversarial-tester     (NEW; flaw-finding QA lens, Stage 7)
- (qa-engineer = functional/UAT/smoke lens; security-engineer = security lens)
- product-manager owns PRD + change-requests; solution-architect owns stack/cost + module map.

## New commands (pipeline entry points)
/prd · /journey · /stack-and-cost · /module-map · /build-plan · /build · /feature-check ·
/change-request · /graph   (plus existing /kickoff · /design-review · /ship-check · /ingest-scan)

## Notes
- Large bundle by design ("host of skill sets"); vibegod-orchestrator gates which skills load per
  stage to avoid trigger confusion.
- Local journey canvas = dependency-free Node static server + self-contained HTML/JS (adapts
  superpowers' brainstorming localhost-server pattern); journey persists to JSON.
- All intake C text is user-authored directives (benign); no external code ingested from it.
