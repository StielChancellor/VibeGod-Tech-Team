---
name: codebase-knowledge-graph
description: Use to keep codebase awareness current via graphify — a knowledge graph of modules, symbols, and dependencies used for impact analysis during change propagation. Trigger on "graphify", "update the code graph", "what depends on this", "impact of this change", or whenever a change needs a full picture of call sites and dependents. Detects whether graphify is installed; if not, offers to auto-install it or proceed with a lighter built-in fallback.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Codebase Knowledge Graph — graphify integration

Maintain a live map of the codebase — modules, symbols, dependencies, call sites — so change
propagation operates on facts, not memory. This is the `graphify` link in the propagation chain.
Investigate before asserting impact: query the graph, don't guess what depends on what.

## Fits in the pipeline
- **Stage 9 + continuous** — the `graphify` step in `change-propagation`'s chain
  (PRD → blueprint → roadmap → **graphify** → code). Refresh it before in-code changes so the
  impact/call-site set is accurate.

## On invocation — detect, then choose a path

### 1. Detect
Check whether graphify is installed (try both — on Windows, pip often installs it OFF the PATH):
```
graphify --version
python -m graphify --version
```
- If either responds → **resolve & persist the invocation (step 1b)**, then go to "Using graphify".
- If not found → present the two options below. Don't silently pick.
- Field notes: the pip distribution is named **`graphifyy`** (double-y), so `pip show graphify` reports
  "not found" even when installed — detect via `--version`, never via pip. And if the user already ran
  `graphify claude install` (graphify's own Claude Code integration), that's compatible — this skill's
  flow and the grep-nudge hook push the same direction; don't treat the duplicate CLAUDE.md section as an error.

### 1b. Resolve & persist the invocation (the step that stops agents falling back to grep)
The #1 reason a built graph goes unused is a bare `graphify` that isn't on the PATH — on Windows pip
drops it in `%APPDATA%\Python\Python3xx\Scripts\graphify.exe`, so `graphify` "command not found" and the
agent reaches for grep instead. Resolve a command that actually runs, in this order:
1. `graphify` (already on PATH) · 2. `python -m graphify` (PATH-independent) · 3. the absolute exe —
   Windows: `%APPDATA%\Python\Python3*\Scripts\graphify.exe`; POSIX: `~/.local/bin/graphify`.

Write that working invocation (one line) to **`.graphify-path`** at the repo root, and **add
`.graphify-path` to `.gitignore`** (it's machine-specific). Every later step and subagent reads it:
```
G="$(cat .graphify-path 2>/dev/null || echo graphify)"   # the resolved graphify invocation
$G --version
```
A bare-command failure must NEVER be the reason to fall back to grep — re-resolve, or run `/graph`.

### 2a. Offer to auto-install the latest
Offer to install graphify and CONFIRM it succeeded:
```
pip install git+https://github.com/safishamsi/graphify.git
```
After installing, re-run `graphify --version` (or `python -m graphify --version`) to **confirm success**,
then **persist the resolved invocation (step 1b)**. If the install fails (no network, no pip, error),
report it honestly and fall back to 2b.

### 2b. Offer to proceed WITHOUT graphify (lighter built-in fallback)
Also offer to proceed without installing. If the user chooses this, use the lighter fallback and
**tell them honestly it covers only a fraction of what graphify does** — it's a manual,
best-effort map, not a real program-analysis graph.

**Fallback (built-in, dependency-free):**
- Maintain a simple **markdown change-log** of what changed and where.
- Maintain a **module / dependency map** in markdown: each module, what it depends on, and the
  key symbols/endpoints it exposes — updated as the code changes.
- For impact analysis, drive it with `Grep`/`Glob` across the repo to enumerate call sites of a
  changed symbol, and record the findings in the map.
- State plainly: this is coarse and manual; it can miss dynamic/indirect references that graphify
  would catch. Recommend installing graphify when the codebase grows.

## Using graphify
Always invoke via the resolved command: `G="$(cat .graphify-path 2>/dev/null || echo graphify)"`.
Build/refresh the graph, then **QUERY it** — don't grep for call sites:
```
$G affected "<symbol>" --depth 2   # blast radius: everything that (transitively) depends on <symbol>
$G explain "<symbol>"              # what <symbol> is + its direct callers/callees (dependents)
$G query "<question>"              # natural language, e.g. "what depends on the auth middleware?"
$G path "<A>" "<B>"                # the dependency path from A to B
```
(Confirm exact subcommand names with `$G --help` if one differs.) Reading the result:
- **Orphan / dead code** = the symbol has **no node**, or **no inbound edges** (nothing depends on it).
- **Impact set** of a change = the `affected` set — feed it into `change-propagation` so every dependent
  and call site is updated. Refresh after each change; a stale graph gives false confidence.

## Which tool for which question — graphify is for the GRAPH, grep is for TEXT
| Question / task | Use | Not |
|---|---|---|
| "what depends on X / who calls X / call sites of X" | graphify `affected` / `explain` | grep — it matches *text*, not calls |
| orphan / dead-code / "is this used anywhere?" | graphify (no node / no inbound edges ⇒ orphan) | grep — misses dynamic/indirect refs |
| blast radius / impact of a change | graphify `affected --depth N` | memory / guessing |
| exact line, string, or literal-text confirmation | `grep` / `Read` | graphify |
| lint / format · run tests · dependency CVEs | ruff/eslint · pytest/vitest · pip-audit/npm audit | grep |

Use grep only to **confirm a literal string** after graphify has given you the impact set — never as the
primary way to find dependents or to prove something is unused.

## Discipline
- Honesty over polish: never imply the fallback equals graphify. For high-stakes changes (deletions,
  contract changes), cross-check the graph result with a targeted grep — the graph informs the change;
  the consistency/no-orphans check at Stage 7 still verifies it.
