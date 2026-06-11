---
description: "Health-check the toolchain (Node, git, Claude CLI, Playwright, graphify, mermaid-cli, guardrails) via the bundled doctor script — diagnose, fix with approval, re-verify. Run before a build or whenever a tool-dependent step fails."
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

Verify the pipeline's external assumptions BEFORE relying on them. Delegate to the **toolchain-doctor** subagent, driven by the **toolchain-health** skill.

Focus (optional — a specific tool or failure to diagnose): $ARGUMENTS

Do this:
1. Run the bundled doctor from the PROJECT directory and paste its table verbatim:
   `node "${CLAUDE_PLUGIN_ROOT}/skills/toolchain-health/tools/doctor.mjs"`
2. For each ✗ broken line, apply the FIX it names (installs need the user's yes; a stale `.graphify-path` → re-run `/graph`). Re-run the doctor after each fix — report observed state only.
3. For each – optional line, say when it will matter (Playwright before ANY UI work — the render mandate; graphify before impact analysis) and move on. Don't install what isn't needed yet.
4. **Maker–checker:** if this verdict gates a build (pre-Stage-5 go) or closes a "tool fixed" claim, dispatch `claim-verifier` to re-run the script independently and confirm before reporting healthy.

Report: the table, what was fixed (with re-run evidence), what's deferred, and the 3-line handover (DONE / OPEN / NEXT). If invoked from `/kickoff` or `/build-plan`, return control there.
