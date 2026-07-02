# Changelog

All notable changes to the `vibegod-tech-team` plugin are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

## [0.12.1] — Frozen GOAL survives context compaction (north-star re-injection)
### Added
- **`reinforce-goal.mjs` — a `SessionStart` `compact`-matcher hook** that re-injects the frozen `## GOAL`
  block from `VIBEGOD-STATE.md` (objective + acceptance criteria) after context compaction, so the
  north-star isn't lost when the summarizer drops standing context. Grounded in governance-decay research:
  post-compaction, dropped constraints push violation 0% → 30-59%; re-pinning the goal restores it toward 0%.
  Inject-only, fail-open, symlink-guarded, length-bounded; the goal is framed as data to **serve** (not new
  instructions), with invisibles stripped. `PreCompact` cannot persist context into the post-compaction
  window, so the supported channel is `SessionStart` + `compact` matcher — **verified against the live Claude
  Code hook contract** before building (which also confirmed token/$/wall-clock budgets are NOT hook-visible,
  so the loop-budget brake belongs with a future opt-in autonomous mode, not a standalone hook).
### Tests
- +6 reinforce-goal tests (re-injects the goal; frames as data not instructions; skips STATUS/comments;
  silent when absent / no GOAL block; strips invisibles). Suite **92 → 98**.

## [0.12.0] — Frozen GOAL block: VIBEGOD-STATE.md becomes a real, enforced state file
### Added
- **Frozen `## GOAL` block + a committed state template** (`skills/_shared/VIBEGOD-STATE.template.md`).
  `/kickoff` now instantiates the template and fills a **write-once GOAL block** — the Stage-0 objective +
  **machine-checkable acceptance criteria** (each naming the test/render/scan that proves it) + hard
  constraints + non-goals. It is the pipeline's north-star and the anti-goalpost-moving anchor: a
  machine-checkable definition of "done" the user signs off *against*, not the agent's prose. Valuable even
  in pure human-gated mode; it is also the substrate a future autonomous loop / drift check would read.
- **`guard-state.mjs` — a new hard-block hook** that keeps the GOAL block write-once. Only acceptance-criteria
  checkboxes may flip (`[ ] -> [x]`, and only when an agent-independent signal proves the criterion); any edit
  to the objective / criteria / constraints / non-goals is blocked, so a real goal change is a **deliberate
  Stage-9 change-request** (re-baseline from the template with user sign-off), never silent drift. Fail-open,
  cross-platform, zero-dep; downgrade with `VIBEGOD_GUARDRAILS=advisory`. Block extraction is **fence-aware**
  (a `## `-prefixed line inside a code fence in the GOAL body cannot truncate the frozen region).
### Changed
- Orchestrator "pipeline state" section documents the frozen GOAL block + the write-once rule + maker
  (`product-manager`) / checker (`claim-verifier` — each `[x]` must trace to reproduced real signal, not self-report).
- `change-request.md` (Stage 9) documents the sanctioned GOAL re-baseline path (recreate from template with sign-off).
- README "What's enforced vs guided" table gains the `guard-state` hard-block row.
### Tests
- +10 hook tests (the guard-state freeze/allow matrix, incl. **two fence-bypass regression cases**). Suite **82 → 92**.
### Gate / process
- Built via the plugin's own express-lane discipline — maker + independent maker-checker (no agent checks its own
  work). The **adversarial-tester** lens found and fixed a fenced-`## ` GOAL-truncation **bypass** under TDD
  (red-before-green); the **code-quality-reviewer** lens caught the change-request re-baseline propagation gap.
  Both closed before ship.

## [0.11.1] — Honesty + update-nudge injection fix
### Security
- **Update-nudge prompt-injection closed (U15).** The SessionStart hook fetches the latest plugin version
  from GitHub and caches it in a **world-writable** tmpdir file, then previously interpolated that `version`
  string **verbatim** into the posture banner — the highest-trust channel. A multi-line / instruction-bearing
  "version" (from the network *or* a locally-poisoned cache) could become standing instructions every session.
  A new `cleanVersion()` now runs the value through the SAME boundary as untrusted recipe fields
  (`stripInvisible` → strict `^\d+\.\d+\.\d+$` semver → shared `looksInjected` scan) on **both** the cache-read
  and fetch paths; an unclean value is never cached, compared, or shown, and a fresh-but-poisoned cache falls
  back to the local version with **no nudge** (and no refetch). Independently maker-checked (security-engineer,
  no bypass found).
### Changed (honesty)
- **Posture banner reworded** — `Security guardrails: ENFORCING` → `Guardrails: … best-effort heuristics,
  fail-open; a safety net, not a security boundary`. The ENFORCING/ADVISORY block-vs-warn toggle is unchanged;
  the wording no longer implies a completeness the fail-open regex hooks don't deliver.
- **README** — added a **"What's enforced vs guided"** table that separates the mechanical hooks (secret /
  dangerous-command hard-block, recipe lint, structural `validate.mjs`) from the model-followed doctrine
  (the gated pipeline, maker-checker, no-orphans, OWASP/WCAG), so the two kinds of promise aren't conflated.
### Tests
- +2 hermetic, offline regression tests (a poisoned update cache is neutralized — no injection, no nudge;
  a clean newer cached version still nudges). Suite **80 → 82** passing; `validate.mjs` clean.

## [0.11.0] — Recipes (Tier-1 codified flows) — replay a proven flow, don't re-derive it
### Added
- **`recipes` skill + `/recipe` command** — capture a *proven, recurring* flow as a committed markdown
  **checklist** (`<project>/.vibegod/recipes/<slug>.md`) the agent **replays instead of re-deriving**.
  Recipes are **prose** referencing existing commands — they never embed an AI-authored script. Adapted
  clean-room from gstack's "skillify" idea (MIT; no code copied — see ATTRIBUTION). Replaying is
  **GUIDED**; the lint + the index bounds are **MECHANICAL**.
- **`recipe-lint.mjs`** (zero-dep, the local injection-scan for recipes, which bypass `/ingest-scan`):
  hard-fails on fenced code blocks (the mechanical enforcement of "prose only"), a step missing a real
  `verify:`, a vacuous `verify:`, a missing `## Fallback`, an unknown `owner`, a future `last-verified`,
  or prompt-injection markers in `name`/`trigger`. The shipped example (`examples/no-orphans-sweep.md`)
  is lint-gated in CI (test-hooks), so the gate can't rot.
- **SessionStart recipe index** — when `.vibegod/recipes/` exists, the hook surfaces each recipe's
  `name`+`trigger` so the agent reaches for one. Hardened per the design-panel's HIGH finding: injects
  **only** name+trigger, **sanitized** (control/zero-width/bidi/newline/backtick/angle-bracket stripped)
  + truncated, **bounded** (≤12, frontmatter-only, non-symlink children, realpath-inside-project),
  framed as **UNTRUSTED data — not instructions**, and **DRAFT** (`proven-runs: 0`) recipes are excluded
  from the trusted index. Fail-open.
- **No `/recipe run`** — replay is the agent *reading and following* the prose (honoring each `verify:`);
  a runner would pressure batching past the checks.
### Gate / process
- Took the proper Stage-9 change-request path: a 4-lens design-hardening panel (architect, security,
  simplicity, adversarial) reviewed the spec FIRST — all four independently flagged the SessionStart
  injection vector, which is now closed before any code shipped. Maker–checker row added (recipe owner →
  `code-quality-reviewer`, GUIDED); orchestrator Stage-6 + delegation updated. The executable **capsule**
  tier stays **shelved** behind a 3-part evidence gate (real computation + ≥10 runs + human-confirmed
  contract test).
### Hardened by the QA-gate panel (5 lenses re-reviewed the build adversarially)
- The panel found the SessionStart injection filter could be split by **zero-width characters** and
  **Cyrillic homoglyphs**, and that the lint↔index marker lists had **diverged**. Closed with a single
  shared **de-obfuscating** detector — `hooks/scripts/_markers.mjs` (strip zero-width/bidi → fold homoglyphs
  → squash to letters → match injection-phrase stems) — imported by BOTH the index and `recipe-lint`, so
  they can never drift. Also: tilde (`~~~`) fence detection, a sub-bullet-only Steps lint fix
  (filter-before-trim), and strict integer `proven-runs` in the index.
- Honest limit (relabeled to match reality): the markers are **best-effort heuristics, not proof** — the
  safe-charset sanitization + UNTRUSTED framing + human `code-quality-reviewer` review are the real boundary.
- `ingest/test-hooks.mjs` +24 cases (now **80**), incl. regression tests for every gap above. Counts: 52
  skills · 25 commands. Bump 0.10.0 → 0.11.0.

## [0.10.0] — /doctor + maker–checker + pipeline state + ERD + update nudge
### Added
- **`/doctor` + `toolchain-health` skill + `toolchain-doctor` agent (28th specialist).** One bundled,
  zero-dep script (`skills/toolchain-health/tools/doctor.mjs`) health-checks every external tool the
  pipeline assumes — Node ≥18, git, Claude CLI, **Playwright** (the render mandate), **graphify**
  (incl. a stale `.graphify-path` = BROKEN → re-run `/graph`), mermaid-cli, guardrails mode — with a
  ✓/–/✗ table, a FIX per finding, and exit 0/1. Run at `/kickoff`, before the Stage-5 go, or on any
  tool failure. The agent is new because `devops-sre` is at the ≤2-skill cap; it reports into
  Reliability/Ops, and `claim-verifier` is its checker. Verified live both ways (healthy → exit 0;
  planted stale marker → ✗ exit 1).
- **Maker–Checker (four-eyes) protocol** in `vibegod-orchestrator`: a 12-row matrix mapping every
  load-bearing artifact (PRD, journey, blueprint, stack/cost, roadmap, code, tests, release plan,
  docs, incident actions, toolchain health, any high-stakes claim) to its independent checker. Rules:
  no agent checks its own work; checkers run in PARALLEL; a FAIL returns to the maker with precise
  findings; nothing reaches a ◆ gate unchecked.
- **Hand-offs + pipeline state:** every delegation returns a 3-line handover (**DONE** with evidence /
  **OPEN** / **NEXT**), and **`VIBEGOD-STATE.md`** at the project root is the pipeline's persistent
  memory — created by `/kickoff`, updated at every stage transition and ◆ gate, read FIRST on
  invocation so a fresh session (or a parallel swarm) RESUMES instead of re-discovering. SessionStart
  banner now says so.
- **ER-diagram convention** appended to `_shared/c4-mermaid-convention.md` (singular UpperCamel
  entities, PK/FK/UK, verb-labeled relationships, ≤~10 entities, committed in the schema/migration
  doc) and required from `data-engineering` on every schema design/change. The template is covered by
  the 0.9.3 mermaid render gate (3/3 blocks render).
- **Update nudge** in `session-start.mjs`: compares the installed version to the GitHub manifest at
  most once per 24h (tmpdir cache, 1.5s timeout, fully fail-open; `VIBEGOD_NO_UPDATE_CHECK=1` skips)
  and prints a one-line `claude plugin update` hint when newer. Banner lens-count drift fixed
  ("4 parallel lenses" → "4 core + UX/perf where applicable"). +2 session-start tests.
- Totals now **28 agents · 51 skills · 24 commands** (README + orchestrator updated).
  Bump 0.9.3 → 0.10.0.

## [0.9.3] — Validator hardening + Mermaid render gate in CI
### Added
- **`ingest/validate.mjs` now also catches:** duplicate frontmatter `name`s (skills + agents) and
  name-vs-location mismatches (a skill's `name` must equal its directory; an agent's its filename);
  unknown agent `model:` values (whitelist `opus/sonnet/haiku/inherit`); unknown tools in
  `allowed-tools` (catches typos like `Reads`) for skills AND commands.
- **NEW `ingest/check-mermaid.mjs` + CI step:** extracts every line-start ```` ```mermaid ```` fence
  shipped in the plugin (the canonical C4 convention template + the journey-mapping example) and
  **renders each via mermaid-cli** (chromium, `--no-sandbox` for CI). A diagram that stops parsing
  fails the build — the same "machine-enforced, un-forgettable gate" philosophy as the visual-check
  CI gate (v0.8.0). Inline prose mentions of ```` ```mermaid ```` are ignored (line-start fences only).
  `npm run check:mermaid` runs it locally. Bump 0.9.2 → 0.9.3.

## [0.9.2] — Repo-audit cleanup (loose ends + polish)
### Fixed
- **`.gitignore` now ignores `.graphify-path`** (the machine-specific marker `/graph` writes since v0.9.0).
- **`ingest/validate.mjs` path-ref check now covers `.yml`/`.yaml`** — the `visual-check.ci.yml` template
  reference was silently unchecked, so a future move/delete couldn't be caught by CI.
- **Lens-count drift fixed:** `feature-check` frontmatter said "4 QA lenses" and `qa-gates` description
  omitted `performance-engineer`, while both bodies gate on up to 6 (4 core + UX render for UI +
  performance for perf-sensitive). Descriptions + "dispatch the four lenses" line now match reality.
- **CHANGELOG:** removed stale "Unreleased" markers from 8 shipped entries (0.1.0–0.5.1).
- `visual-check.mjs`: a `0` (or junk) in `--breakpoints` is now filtered explicitly (`> 0`) instead of
  silently via `filter(Boolean)`. Journey canvas: a bad `__JOURNEY_DATA__` injection now logs a
  `console.warn` instead of silently falling back to the sample journey. `visual-check.ci.yml` header
  TODO count wording corrected.
### Added
- **Root `package.json`** (`private: true`, `engines >=18`, zero deps) with `npm run validate` /
  `npm test` / `npm run check` so contributors and CI have one obvious entry point.
- **graphify field notes** in `codebase-knowledge-graph`: the pip distribution is named `graphifyy`
  (double-y) so `pip show graphify` misleads — detect via `--version`; and `graphify claude install`
  (graphify's own integration) is compatible with this skill, not a conflict.
### Noted (audit follow-through)
- Audit false-positives verified and dismissed: the force-push guard already covers both argument orders
  (`guard-bash.mjs` lines 91–92, exercised live), and `install.sh` already guards the empty-CLI case.
  Bump 0.9.1 → 0.9.2.

## [0.9.1] — Always-on, consistent C4 Mermaid blueprint (no new UI)
### Added / Changed
- **The architecture blueprint now always ships a clean, consistent diagram** — and it renders where
  architecture is actually reviewed (GitHub PRs / IDE / docs), at near-zero cost. New shared
  **`skills/_shared/c4-mermaid-convention.md`** defines one visual language: typed node shapes/colors
  (actor / app / service / worker / datastore / cache / queue / external), edges labeled
  `mechanism: contract` (async dashed), trust boundaries as `subgraph`, a legend, a ≤~12-box size rule,
  and a copy-paste starter template.
- **`platform-blueprint`:** the C4 **Container diagram is now REQUIRED** (was "pick the lowest level
  that communicates" — so it was often skipped), rendered per the shared convention and **committed
  inside the blueprint markdown**. Context/Component stay optional. Gate updated.
- **`module-architecture` + `/module-map`:** the module-boundary diagram is **required** and uses the
  **same** convention (so blueprint and module map look identical), surfaced at the ◆ gate.
  `solution-architect` output list names the diagram explicitly.
- Verified: validate 0/0, hooks 53/53 (unchanged), the canonical Mermaid template renders cleanly
  (mermaid-cli PNG, inspected — distinct shapes/colors, legible labels, visible trust boundary).
- Context: a drag-and-drop architecture canvas was considered and **rejected** (architecture is
  authored ~once; the load-bearing detail is prose; a `file://` canvas doesn't render in PRs; a second
  bespoke canvas doubles the render-gate/maintenance tax). Hardening Mermaid captures ~80% of the value
  at ~0 cost. Read-only by design — no new UI, dependencies, or render gate. Bump 0.9.0 → 0.9.1.

## [0.9.0] — Use graphify (not grep) for dependency / orphan / impact
### Fixed (from field feedback — graphify built ~1k nodes/8.5k edges but went unused)
- **The graphify invocation is now persisted, so a built graph actually gets used.** Root cause of the
  agents falling back to grep: a bare `graphify` that isn't on the PATH (Windows pip drops it in
  `%APPDATA%\Python\Python3xx\Scripts\graphify.exe`) → "command not found" → grep. Now `/graph` +
  `codebase-knowledge-graph` resolve a working command (`graphify` → `python -m graphify` → the absolute
  exe) and write it to a gitignored **`.graphify-path`** marker; every step/subagent reads
  `G="$(cat .graphify-path 2>/dev/null || echo graphify)"`. A bare-command failure no longer pushes agents to grep.
### Added / Changed
- **`codebase-knowledge-graph/SKILL.md`:** Windows non-PATH detection + persistence (step 1b), a
  **tool-selection table** (graphify = the GRAPH: depends/orphans/blast-radius; grep/Read = exact TEXT;
  ruff/pytest/pip-audit = lint/tests/CVEs), and a fleshed-out **"Using graphify"** with copy-paste
  queries — `$G affected "<sym>" --depth 2`, `$G explain`, `$G query`, `$G path` — plus the orphan rule:
  **no node / no inbound edges ⇒ orphan**.
- **The no-orphans lenses are now graphify-aware** (they named grep before): `qa-gates`, `feature-check`,
  `qa-engineer` (was "search the repo for stragglers"), and `code-quality-reviewer` (orphan confirm via
  `$G explain/affected`) now say *use graphify for call-site/dependency/orphan/impact; grep only confirms
  literal text.* `change-propagation` + `verification-before-completion` strengthened to graphify-first and
  reference the table.
- **Optional guardrail hook (tight heuristic):** new `nudge-graphify.mjs` (PostToolUse on `Grep|Bash`)
  fires ONLY when graphify is installed (`.graphify-path` exists) AND the search term is a **bare
  identifier** (a symbol/call-site lookup, not literal text/regex) — nudging toward `graphify affected/
  explain`. Silent otherwise; fail-open. Same PostToolUse event (no new hook type — load profile
  unchanged). `ingest/test-hooks.mjs` +6 cases (now 53/53).
- Honest limit: the lens-prompt changes are still model-followed; the **path-persistence** (mechanical)
  and the **grep nudge** (forcing-function) are the teeth. End-to-end "agents query graphify in a live
  run" needs a real project with graphify installed — verified here: persistence logic, prompts/table/
  examples present, and the hook fires/stays-silent correctly. Bump 0.8.0 → 0.9.0.

## [0.8.0] — Mandatory render before "UI done" + machine-enforced visual CI gate
### Added / Changed
- **No UI is "ready/complete/looks-right" without a fresh render.** Closes the loophole that let an
  agent (and the maintainer, this session) skip Playwright and "eyeball" / static-analyze UI:
  - `verification-before-completion`: new **rule 6** (UI = render it, not describe it; install Playwright
    if missing; "static analysis" is never appearance evidence; no render possible → UNVERIFIED, never PASS)
    + Common-Failures and Rationalization rows.
  - `claim-verifier`: new **check #6** — a UI "done/looks-right" claim with no render is **REFUTED until rendered**.
  - `ux-design-reviewer` / `ux-check` / `ui-ux-excellence`: a **live render is REQUIRED to PASS**; static
    analysis can only FAIL; missing Playwright → **install it, don't skip**; no render → **BLOCKED/UNVERIFIED**.
  - `feature-check`: the `ux-design-reviewer` render is now an explicit **required lens for any UI feature**
    (was missing inline); a UI feature can't close without the screenshots/`report.json`.
  - `advise-posttool` hook: editing a UI file (.tsx/.jsx/.vue/.svelte/.css/.scss/.html…) now auto-nudges
    "render it before calling it done." (+ a hook test; suite green.)
- **Machine-enforced visual CI gate (the robust, un-forgettable part):** new reusable workflow template
  `skills/devops-delivery/templates/visual-check.ci.yml` — installs Playwright, builds/serves the app, runs
  `visual-check.mjs` across breakpoints, uploads screenshots+report, and **fails the build on broken UI**.
  Wired into `devops-delivery` (Stage-6 CI), and added to the `launch-readiness` + `release` pre-ship gates.
- Honest limit: the in-session rules are still model-followed (a plugin can't hard-block a "done" claim) —
  the **CI gate** is the true mechanical enforcement. Bump 0.7.3 → 0.8.0.

## [0.7.3] — Journey canvas: light-theme background fix
### Fixed
- The light theme (0.7.2) carried over the dark theme's **two radial gradients**, which on a light
  background looked like mismatched colored blotches ("looks broken"). Replaced with a **flat, uniform
  light canvas**; removed the alternating lane-band tint (which formed a stray "panel" rectangle) — lanes
  are now clean dashed separators. **Fit** now keeps the lane-label gutter in view (labels were clipped).
- **Verified visually this time** with a real Playwright render + screenshot (not just jsdom): uniform
  background, all four lane labels visible, readable cards/edges, 0 console errors. Bump 0.7.2 → 0.7.3.

## [0.7.2] — Journey canvas: light theme
### Changed
- Switched the journey canvas to a **light theme** (was dark): light page/surfaces, dark navy ink,
  re-tuned lane bands, node cards, chips (white text on accent), edges, toasts, overlays, and `kbd` for
  light-mode contrast. Layout, interactions (pan/zoom/drag/connect), readability model, and schema unchanged.
- Verified: validate 0/0 (canvas guard), jsdom 0 runtime errors, no residual dark colors. Bump 0.7.1 → 0.7.2.

## [0.7.1] — Journey canvas: fluid interactions restored
### Changed (from field feedback — v0.7.0 felt less fluid than the old server canvas)
- Re-added the **pan/zoom "infinite canvas"** layer the readability rebuild had dropped, kept fully
  client-side (still server-less): **mouse-wheel zoom anchored at the cursor**, **grab-to-pan** empty
  space (replaces scrollbars; `#stage` is `overflow:hidden` again), `+`/`−`/**Fit** controls, and
  node drag that divides by zoom so it tracks the cursor at any scale. Auto-fits on load.
- **Drag-from-handle connect:** hover a step → drag its pink ● port onto another step (rubber-band
  preview). The Connect button + keyboard `C` remain as the accessible fallback.
- Restored node **entrance/hover animations** (inside `prefers-reduced-motion: no-preference`).
- Lane labels now ride inside the pan/zoom world (sticky doesn't survive a transformed ancestor); Fit re-frames.
- Readability (swimlanes, happy-path default, progressive-disclosure collapse) is unchanged.
- Verified in jsdom: 0 runtime errors, lanes + happy-path-default + Show-detail counts hold, pan/zoom
  transform active, zoom/fit callable. Bump 0.7.0 → 0.7.1.

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

## [0.5.1] — README rewrite + source-available license
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

## [0.5.0] — anti-hallucination — claim-verifier agent
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

## [0.4.2] — plugin load fix — duplicate hooks
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

## [0.4.1] — frontmatter integrity fix
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

## [0.4.0] — enterprise-coverage gaps from the audit
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

## [0.3.0] — design refinement — kill the "AI-slop" look
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

## [0.2.0] — enterprise org expansion
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

## [0.1.0] — Phase A complete
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
