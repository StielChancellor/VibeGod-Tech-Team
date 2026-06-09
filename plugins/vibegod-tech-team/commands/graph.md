---
description: Refresh the codebase knowledge graph (graphify) for impact analysis — detect/auto-install/fallback. Part of change-propagation.
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

Refresh the **codebase knowledge graph** so change propagation operates on facts, not memory. This is the **graphify** link in the chain (PRD → blueprint → roadmap → **graphify** → code). Drive the **codebase-knowledge-graph** skill. Investigate before asserting impact — query the graph, don't guess.

Scope (optional — module/path/symbol): $ARGUMENTS

Do this:
1. **Detect** whether graphify is installed (`graphify --version`).
2. If not installed, **do not silently pick** — offer both:
   - **Auto-install** the latest, then re-run `graphify --version` to **confirm success** before relying on it.
   - **Proceed without it** using the lighter built-in fallback (markdown change-log + module/dependency map + `Grep`/`Glob` call-site enumeration), stating honestly that it covers only a fraction of what graphify does.
3. **Refresh the graph** for the repo (scoped to `$ARGUMENTS` if given). Query the **impact set** of the change — every dependent and call site — and feed it into `change-propagation` so nothing is orphaned.
4. For high-stakes changes (deletions, contract changes), cross-check graph results with a repo search. The graph informs the change; the Stage 7 consistency/no-orphans check still verifies it.

Report the refreshed map / impact set. If invoked as part of `/change-request`, return control there for the in-code propagation step.
