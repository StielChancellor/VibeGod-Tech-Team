---
name: toolchain-health
description: "Use to verify every external tool the pipeline assumes before relying on it — Node, git, the Claude CLI, Playwright (the UI render mandate), graphify (.graphify-path validity), mermaid-cli, and the guardrails mode. Trigger on /doctor, \"health check\", \"is everything set up\", \"tools not working\", a failed render/graph step, or at the start of a build. One bundled script, one verdict, concrete fixes."
allowed-tools: Read, Grep, Glob, Bash
---

# Toolchain Health — verify the assumptions before they bite

Every field failure this team has hit traces to an *assumed* tool that wasn't there: Playwright
skipped (the two-gradient UI shipped "verified"), graphify off the PATH (agents fell back to grep),
a canvas server that died. This skill checks the assumptions up front — evidence, not hope.

## Fits in the pipeline
- **Stage 0/5 (recommended):** run at `/kickoff` and before the Stage-5 go-for-code gate.
- **On any tool failure:** a failed render, graph query, or hook — diagnose here first.
- Owned by `toolchain-doctor` (Reliability/Ops). Checked by `claim-verifier` (see below).

## How to run it
Run the bundled doctor from the PROJECT directory (it probes the project's own setup):
```
node "${CLAUDE_PLUGIN_ROOT}/skills/toolchain-health/tools/doctor.mjs"
```
Exit 0 = healthy (missing OPTIONAL tools don't fail) · exit 1 = something configured/required is
BROKEN. It checks: **Node ≥18 · git · Claude CLI · Playwright resolvable from the project (the
v0.8.0 render mandate) · graphify** (a `.graphify-path` marker that doesn't run = BROKEN → re-run
`/graph`; absent graphify = optional) **· mermaid-cli (optional) · VIBEGOD_GUARDRAILS mode**.

## Discipline
1. **Paste the actual table** — the verdict is the script's output, never a summary from memory.
2. **Fix forward:** each ✗/– line carries a FIX command. Offer to run the fixes (installs need the
   user's yes); re-run the doctor after, and only then report healthy.
3. **Maker–checker:** an "all healthy" claim that gates a build (e.g. before Stage 5 go) is a
   high-stakes claim — `claim-verifier` re-runs the script independently before the gate closes.
4. Don't gold-plate: absent OPTIONAL tools (graphify, mermaid-cli) are a note, not a blocker —
   install them when the pipeline actually needs them (`/graph`, UI work → Playwright).
