---
name: finishing-a-development-branch
description: Use when implementation is complete, all tests pass, and you need to decide how to integrate the work — presents structured options for merge, PR, keep, or discard, and handles worktree cleanup safely. Triggers at the end of executing/subagent-driven development or whenever a feature branch is ready to land.
---
<!-- Adapted from superpowers (https://github.com/obra/superpowers), MIT (c) Jesse Vincent. -->

# Finishing a Development Branch

## Overview

Guide completion of development work by presenting clear options and handling the chosen workflow.

**Core principle:** Verify tests → detect environment → present options → execute choice → clean up.

**Announce at start:** "I'm using the finishing-a-development-branch skill to complete this work."

## Fits in the pipeline

The exit ramp of **Stage 6 (Build)** for each feature branch, just before the **Stage 7 per-feature QA gate** and **Stage 8 ship**. It enforces the principle #8 rule — no merge/PR without green tests — and keeps worktrees (from `using-git-worktrees`) clean. Priority: **user > skills > default**; `_shared/vibegod-principles.md` apply. Do not treat a clean merge here as "shipped"; the QA gates still run.

## The Process

### Step 1: Verify Tests
Run the project's suite (`npm test` / `cargo test` / `pytest` / `go test ./...`). If tests fail: report the failures, state "Cannot proceed with merge/PR until tests pass," and STOP — don't reach Step 2. If they pass, continue. (Use `verification-before-completion` — fresh evidence.)

### Step 2: Detect Environment
```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
```
| State | Menu | Cleanup |
|-------|------|---------|
| `GIT_DIR == GIT_COMMON` (normal repo) | Standard 4 options | No worktree to clean up |
| `GIT_DIR != GIT_COMMON`, named branch | Standard 4 options | Provenance-based (Step 6) |
| `GIT_DIR != GIT_COMMON`, detached HEAD | Reduced 3 options (no merge) | None (externally managed) |

### Step 3: Determine Base Branch
```bash
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```
Or ask: "This branch split from main — is that correct?"

### Step 4: Present Options

**Normal repo / named-branch worktree — exactly these 4:**
```
Implementation complete. What would you like to do?

1. Merge back to <base-branch> locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work

Which option?
```

**Detached HEAD — exactly these 3:**
```
Implementation complete. You're on a detached HEAD (externally managed workspace).

1. Push as new branch and create a Pull Request
2. Keep as-is (I'll handle it later)
3. Discard this work

Which option?
```

Don't add explanation — keep options concise.

### Step 5: Execute Choice

**Option 1 — Merge locally:** `cd` to main repo root first; merge first and verify tests on the merged result BEFORE removing anything; then cleanup worktree (Step 6); then `git branch -d <feature-branch>`.
```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
git checkout <base-branch> && git pull && git merge <feature-branch>
<test command>   # verify on merged result
```

**Option 2 — Push and create PR:**
```bash
git push -u origin <feature-branch>
gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
<2-3 bullets of what changed>

## Test Plan
- [ ] <verification steps>
EOF
)"
```
**Do NOT clean up the worktree** — the user needs it for PR-feedback iteration.

**Option 3 — Keep as-is:** "Keeping branch <name>. Worktree preserved at <path>." Don't clean up.

**Option 4 — Discard:** confirm first.
```
This will permanently delete:
- Branch <name>
- All commits: <commit-list>
- Worktree at <path>

Type 'discard' to confirm.
```
Wait for the exact word. If confirmed: `cd` to main root → cleanup worktree (Step 6) → `git branch -D <feature-branch>`.

### Step 6: Cleanup Workspace
**Only for Options 1 and 4.** (2 and 3 always preserve the worktree.)
```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
WORKTREE_PATH=$(git rev-parse --show-toplevel)
```
- `GIT_DIR == GIT_COMMON` → normal repo, nothing to clean up.
- Worktree under `.worktrees/`, `worktrees/`, or `~/.config/vibegod/worktrees/` → we created it, we clean up:
  ```bash
  MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
  cd "$MAIN_ROOT"
  git worktree remove "$WORKTREE_PATH"
  git worktree prune
  ```
- Otherwise → the harness owns this workspace. Do NOT remove it; use a workspace-exit tool if your platform provides one, else leave it.

## Quick Reference

| Option | Merge | Push | Keep Worktree | Cleanup Branch |
|--------|-------|------|---------------|----------------|
| 1. Merge locally | yes | - | - | yes |
| 2. Create PR | - | yes | yes | - |
| 3. Keep as-is | - | - | yes | - |
| 4. Discard | - | - | - | yes (force) |

## Red Flags

**Never:** proceed with failing tests · merge without verifying tests on the result · delete work without typed confirmation · force-push without explicit request · remove a worktree before confirming merge success · clean up worktrees you didn't create · run `git worktree remove` from inside the worktree.

**Always:** verify tests before offering options · detect environment before the menu · present exactly 4 options (or 3 for detached HEAD) · get typed "discard" for Option 4 · clean up only for Options 1 & 4 · `cd` to main root before worktree removal · `git worktree prune` after.
