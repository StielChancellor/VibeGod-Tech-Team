# Attribution & Third-Party Notices

VibeGod Tech Team incorporates ideas and adapted content from the following open-source
projects. Each was security-scanned before ingestion (see `ingest/reports/`). Licenses
(MIT / Apache-2.0) and copyright/permission notices are preserved here.

## superpowers — https://github.com/obra/superpowers
Copyright (c) Jesse Vincent (@obra). MIT License.
Methodology skills (TDD, systematic debugging, planning, code review, parallel-agent
dispatch, git worktrees, verification-before-completion) are adapted into this plugin's
`skills/` with modifications for the VibeGod Tech Team pipeline.

## graphify — https://github.com/safishamsi/graphify
Copyright (c) Safi Shamsi. MIT License.
Integrated as an optional external tool via the `codebase-knowledge-graph` skill (detect /
auto-install / fallback). The graphify package itself is NOT bundled; users install it.

## andrej-karpathy-skills — https://github.com/multica-ai/andrej-karpathy-skills
Behavioral coding guidelines (CLAUDE.md) incorporated into
`skills/_shared/vibegod-principles.md`.

## Impeccable — https://github.com/pbakaus/impeccable
**Apache License 2.0, Copyright (c) 2025 Paul Bakaus.** The design-steering TEXT (anti-cliché
font/lane reject lists, font-selection procedure, color strategy, the AI-slop test, the audit →
polish → critique workflow, the brand-vs-product register) is **adapted with modification** into
this plugin's `skills/design-refinement/SKILL.md`. NONE of Impeccable's scripts/`live` mode are
included. Impeccable itself derives from **Anthropic's `frontend-design` skill (Apache-2.0,
(c) 2025 Anthropic PBC)** and **ehmo/typecraft-guide-skill** — both are credited here per its NOTICE.

---
If you are a maintainer of any of the above and want attribution adjusted, please open an
issue on this repository.
