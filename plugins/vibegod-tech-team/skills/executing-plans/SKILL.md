---
name: executing-plans
description: Use when you have a written implementation plan to execute inline in the current/separate session with review checkpoints, and subagents are unavailable or the tasks are tightly coupled. Triggers after writing-plans when the user picks inline execution. If subagents ARE available, prefer subagent-driven-development.
---
<!-- Adapted from superpowers (https://github.com/obra/superpowers), MIT (c) Jesse Vincent. -->

# Executing Plans

## Overview

Load the plan, review it critically, execute all tasks, report when complete.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

**Note:** Work is significantly higher quality with subagent support. If subagents are available, use `subagent-driven-development` instead of this skill.

## Fits in the pipeline

The inline alternative for **Stage 6 (Build, `/build`)** when subagents aren't available or tasks are tightly coupled. Reviews happen at checkpoints rather than per-task; results still feed the **Stage 7 per-feature QA gate**. Priority: **user > skills > default**; `_shared/vibegod-principles.md` apply (TDD, surgical changes, evidence-based completion).

## The Process

### Step 1: Load and Review Plan
1. Read the plan file.
2. Review critically — identify questions or concerns about the plan itself.
3. Concerns → raise them with the user before starting.
4. No concerns → create TodoWrite and proceed.

### Step 2: Execute Tasks
For each task: mark in_progress → follow each bite-sized step exactly → run the verifications as specified (don't skip) → mark completed. Follow TDD (`test-driven-development`) throughout.

### Step 3: Complete Development
After all tasks complete and verified:
- Announce: "I'm using the finishing-a-development-branch skill to complete this work."
- **REQUIRED SUB-SKILL:** `finishing-a-development-branch` — verify tests, present options, execute choice.

## When to Stop and Ask for Help

STOP immediately when: you hit a blocker (missing dependency, failing test, unclear instruction); the plan has critical gaps; you don't understand an instruction; verification fails repeatedly. **Ask for clarification rather than guessing** (principle #1).

## When to Revisit Earlier Steps

Return to Review (Step 1) when the user updates the plan based on your feedback, or the fundamental approach needs rethinking. Don't force through blockers — stop and ask.

## Remember
- Review the plan critically first.
- Follow plan steps exactly; don't skip verifications.
- Reference skills when the plan says to.
- Stop when blocked; don't guess.
- Never start implementation on main/master without explicit user consent.

## Integration

**Required workflow skills:** `using-git-worktrees` (isolation), `writing-plans` (creates the plan), `finishing-a-development-branch` (after all tasks).
