---
name: using-git-worktrees
description: Use when starting feature work that needs isolation from the current workspace, or before executing an implementation plan, or before dispatching parallel coding agents. Ensures an isolated workspace exists — detect existing isolation, prefer the harness's native worktree tools, fall back to git worktree only if none.
---
<!-- Adapted from superpowers (https://github.com/obra/superpowers), MIT (c) Jesse Vincent. -->

# Using Git Worktrees

## Overview

Ensure work happens in an isolated workspace. Prefer your platform's native worktree tools. Fall back to manual git worktrees only when no native tool is available.

**Core principle:** Detect existing isolation first. Then native tools. Then git fallback. Never fight the harness.

**Announce at start:** "I'm using the using-git-worktrees skill to set up an isolated workspace."

## Fits in the pipeline

Sets up isolation BEFORE **Stage 6 (Build)** — required by `executing-plans`, `subagent-driven-development`, and `dispatching-parallel-agents` so parallel coding agents don't collide. Cleanup is handled by `finishing-a-development-branch`. Priority: **user > skills > default**; `_shared/vibegod-principles.md` apply.

## Step 0: Detect Existing Isolation

Before creating anything, check whether you're already isolated.
```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
```
**Submodule guard:** `GIT_DIR != GIT_COMMON` is also true inside submodules. Verify you're not in one:
```bash
git rev-parse --show-superproject-working-tree 2>/dev/null   # returns a path → submodule, treat as normal repo
```
- **`GIT_DIR != GIT_COMMON` (not a submodule):** already in a linked worktree → skip to Step 3. Don't create another. Report: "Already in isolated workspace at `<path>` on branch `<name>`." (or "detached HEAD, externally managed; branch creation needed at finish time.")
- **`GIT_DIR == GIT_COMMON` (or submodule):** normal checkout. If the user hasn't already declared a worktree preference, ask consent: *"Would you like me to set up an isolated worktree? It protects your current branch from changes."* Honor any declared preference without asking. If declined, work in place and skip to Step 3.

## Step 1: Create Isolated Workspace

Try these in order.

### 1a. Native Worktree Tools (preferred)
Do you already have a way to create a worktree — a tool named like `EnterWorktree`/`WorktreeCreate`, a `/worktree` command, or a `--worktree` flag? If so, use it and skip to Step 3. Native tools handle placement, branch creation, and cleanup; using `git worktree add` when a native tool exists creates phantom state the harness can't manage. Proceed to 1b only if no native tool exists.

### 1b. Git Worktree Fallback (only if 1a doesn't apply)

**Directory selection** (explicit user preference beats filesystem state):
1. Declared preference in your instructions → use it.
2. Existing project-local dir: `.worktrees` (preferred) or `worktrees`; if both, `.worktrees` wins.
3. Existing global dir: `~/.config/vibegod/worktrees/<project>`.
4. Otherwise default to `.worktrees/` at project root.

**Safety verification (project-local only):** MUST be git-ignored before creating.
```bash
git check-ignore -q .worktrees 2>/dev/null || git check-ignore -q worktrees 2>/dev/null
```
If NOT ignored: add to `.gitignore`, commit, then proceed. (Prevents committing worktree contents.) Global dirs need no verification.

**Create:**
```bash
project=$(basename "$(git rev-parse --show-toplevel)")
# project-local: path="$LOCATION/$BRANCH_NAME"  |  global: path="~/.config/vibegod/worktrees/$project/$BRANCH_NAME"
git worktree add "$path" -b "$BRANCH_NAME"
cd "$path"
```
**Sandbox fallback:** if `git worktree add` fails with a permission/sandbox error, tell the user the sandbox blocked creation and you're working in the current directory; run setup and baseline tests in place.

## Step 3: Project Setup
Auto-detect and run:
```bash
[ -f package.json ] && npm install
[ -f Cargo.toml ] && cargo build
[ -f requirements.txt ] && pip install -r requirements.txt
[ -f pyproject.toml ] && poetry install
[ -f go.mod ] && go mod download
```

## Step 4: Verify Clean Baseline
Run the project-appropriate test command. **Tests fail:** report failures, ask whether to proceed or investigate. **Tests pass:** report ready.
```
Worktree ready at <full-path>
Tests passing (<N> tests, 0 failures)
Ready to implement <feature-name>
```

## Quick Reference

| Situation | Action |
|-----------|--------|
| Already in linked worktree | Skip creation (Step 0) |
| In a submodule | Treat as normal repo (Step 0 guard) |
| Native worktree tool available | Use it (Step 1a) |
| No native tool | Git fallback (Step 1b) |
| `.worktrees/` exists | Use it (verify ignored) |
| Both `.worktrees/` & `worktrees/` | Use `.worktrees/` |
| Neither exists | Instruction preference, else default `.worktrees/` |
| Global path exists | Use it (backward compat) |
| Directory not ignored | Add to .gitignore + commit |
| Permission error on create | Sandbox fallback, work in place |
| Tests fail during baseline | Report + ask |

## Red Flags

**Never:** create a worktree when Step 0 detects existing isolation · use `git worktree add` when you have a native tool (the #1 mistake) · skip Step 1a · create a project-local worktree without verifying it's ignored · skip baseline tests · proceed with failing tests without asking.

**Always:** run Step 0 first · prefer native tools · follow the directory priority · verify ignored for project-local · run project setup · verify a clean test baseline.
