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
Check whether graphify is installed:
```
graphify --version
```
- If it responds → use graphify (skip to "Using graphify").
- If not found → present the two options below. Don't silently pick.

### 2a. Offer to auto-install the latest
Offer to install graphify and CONFIRM it succeeded:
```
pip install git+https://github.com/safishamsi/graphify.git
```
After installing, re-run `graphify --version` to **confirm success** before relying on it. If
the install fails (no network, no pip, error), report it honestly and fall back to 2b.

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
- Build/refresh the graph for the repo, then query it for the **impact set** of a change (what
  depends on the symbol/module being changed). Feed that set into `change-propagation` so every
  dependent and call site is updated — no orphans.
- Refresh after each change so the graph stays current; a stale graph gives false confidence.

## Discipline
- Honesty over polish: never imply the fallback equals graphify. Cross-check graph results with a
  repo search when the stakes are high (deletions, contract changes). The graph informs the
  change; the consistency/no-orphans check at Stage 7 still verifies it.
