# Ingest Security Scan — Impeccable (pbakaus/impeccable)

Date: 2026-06. Method: static, read-only audit of a shallow clone in `ingest/_scratch/impeccable`.
No scripts executed.

## What it is
A Claude Code design-refinement skill (one `impeccable` skill, ~23 `/`-commands) + an Astro
marketing site. ~1889 files / 73MB — but the **skill substance is ~392KB of markdown** under
`.agents/skills/impeccable/` (`SKILL.md` + `reference/*.md`). The 73MB is the site (46MB) + git (44MB).

## License
**Apache-2.0**, © 2025 Paul Bakaus — MIT-compatible; adaptation allowed WITH attribution + a note
of modification. Per `NOTICE.md` it derives from **Anthropic's `frontend-design` skill (Apache-2.0)**
and `ehmo/typecraft-guide-skill`. Attribution must credit **Bakaus + Anthropic + ehmo**.

## Findings
- **Prompt-injection in the markdown: NONE.** All `reference/*.md` are legitimate UI/UX steering
  (anti-cliché font/lane reject lists, OKLCH color strategy, audit/polish/critique rubrics). No
  hidden unicode, no exfiltration, no permission-escalation text. `critique.md` even ADDS safety
  hygiene (stop background servers, ask before spawning sub-agents).
- **Scripts — EXCLUDE ALL (we ingest text only):**
  - `live-copy-edit-agent.mjs` spawns child agents with `--dangerously-bypass-approvals-and-sandbox`
    / `--permission-mode bypassPermissions` and forwards `ANTHROPIC_API_KEY` — **must not ship.**
  - `cleanup-deprecated.mjs` does recursive `rmSync(...,{recursive,force})` deletes — **exclude.**
  - `context.mjs` phones home (`fetch impeccable.style/api/version`) + writes `~/.impeccable/` — **exclude.**
  - other `live-*` = local server + Puppeteer — not needed.
- **Install-time risk: NONE** (no preinstall/postinstall/prepare in package.json).

## Verdict: CLEAN to adapt the TEXT (NEEDS-EDITS = strip all scripts + build placeholders)
We author our own `design-refinement` skill in our words, capturing the anti-cliché substance
(reflex-reject lists, font procedure, color strategy, register brand/product, AI-slop test,
audit→polish→critique workflow, the "design boldly, audit a11y after" insight). **No scripts, no
`live` mode, no phone-home, no `<post-update-cleanup>` mechanism.** Attribution recorded in
`ATTRIBUTION.md`.
