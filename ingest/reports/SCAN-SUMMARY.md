# Ingest Security Scan — Summary

Date: 2026-06-05. Method: static, read-only audit of shallow clones in `ingest/_scratch/`.
**No install/build scripts were executed during scanning.**

## Sources

### 1. graphify — https://github.com/safishamsi/graphify
- **What:** Python (3.10+) tool that turns a codebase/docs into a queryable knowledge graph;
  integrates with Claude Code via a `skill.md`. MIT, YC-backed, well-tested (80 test files).
- **Install risk:** None. `pyproject.toml` only; no `setup.py`/postinstall/shell installers.
- **Code risk:** None. No `eval`/`exec`/`shell=True`. Ships its own security module
  (`security.py`) with SSRF guards, path-traversal protection, label sanitization, size caps.
- **Network/telemetry:** No phone-home. Outbound calls are user-invoked only (LLM APIs via
  env-var keys, user-supplied URLs behind `validate_url()`). Query log is local + opt-out.
- **Prompt injection:** None in `skill.md` / `always_on/*.md` / `AGENTS.md`.
- **Verdict:** ✅ CLEAN. Note: it's a *tool*, not a skill library — integrate as an optional
  capability, not by bundling the Python package.

### 2. superpowers — https://github.com/obra/superpowers
- **What:** Zero-dependency Claude Code plugin (v5.1.0, MIT, @obra). 14 methodology skills +
  SessionStart hook + plugin/marketplace metadata. Strict contributor governance (94% PR reject).
- **Install risk:** None. `package.json` has zero deps and no scripts. Shell scripts are local
  utilities (version bump, file sync, a localhost-only brainstorm WebSocket server).
- **Hook:** `hooks/session-start` reads `using-superpowers/SKILL.md` and injects it into the
  session. Safe (no network/exec) — but it means ingested SKILL.md content runs every session,
  so the markdown audit mattered (done: clean).
- **Code risk:** None. `child_process` uses are test/server only; no eval/dynamic-require/exfil.
- **Prompt injection:** None across all 14 skills. "Red Flags" tables are educational guardrails,
  not malicious. Documented priority: user instructions > superpowers skills > default.
- **Verdict:** ✅ CLEAN. Primary source for methodology skills.

### 3. Karpathy CLAUDE.md — multica-ai/andrej-karpathy-skills
- **What:** 4 concise behavioral guidelines: (1) Think before coding, (2) Simplicity first,
  (3) Surgical changes, (4) Goal-driven execution.
- **Risk:** n/a (plain guidance, fetched read-only). No injection.
- **Verdict:** ✅ CLEAN. Fold into `vibegod-principles.md`.

## superpowers skill inventory (for de-dup)
using-superpowers (meta/dispatch), brainstorming, writing-plans, writing-skills,
test-driven-development, systematic-debugging, subagent-driven-development, executing-plans,
dispatching-parallel-agents, finishing-a-development-branch, using-git-worktrees,
requesting-code-review, receiving-code-review, verification-before-completion. All CLEAN.
