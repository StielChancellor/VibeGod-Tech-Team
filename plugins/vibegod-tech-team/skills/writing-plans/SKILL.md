---
name: writing-plans
description: Use when you have an approved spec/PRD/requirements for a multi-step task and need a concrete implementation plan, BEFORE touching code. Produces bite-sized, TDD-structured tasks with exact file paths, real code, and exact verification commands. Triggers after brainstorming/PRD approval or whenever someone says "write a plan", "plan this out", or hands you requirements to build.
---
<!-- Adapted from superpowers (https://github.com/obra/superpowers), MIT (c) Jesse Vincent. -->

# Writing Plans

## Overview

Write comprehensive implementation plans assuming the engineer (a fresh subagent or a future you) has zero context for this codebase. Document everything: which files to touch per task, the actual code, tests, docs to check, how to verify. Give the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Assume a skilled developer who knows almost nothing about our toolset, problem domain, or good test design.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

## Fits in the pipeline

This skill drives **Stage 5 — Build Plan (`/build-plan`, foundation-first)**. Input is the approved PRD/spec + module map; output is the coding roadmap + TDD/UAT/smoke/QA plan. **Build the foundation first** (the shared base all modules sit on). End with the ◆ gate: explicitly ask before starting coding agents. Priority: **user > skills > default**; `_shared/vibegod-principles.md` apply (esp. #2 simplicity, #3 surgical, #6 consistency, #8 TDD).

**Save plans to:** `docs/vibegod/plans/YYYY-MM-DD-<feature-name>.md` (user preferences override).

**Context:** If working in an isolated worktree, it should have been created via the `using-git-worktrees` skill.

## Scope Check

If the spec covers multiple independent subsystems, it should have been split during brainstorming. If not, suggest separate plans — one per subsystem, each producing working, testable software on its own.

## File Structure

Before defining tasks, map which files are created/modified and what each is responsible for. This locks in decomposition.

- Units with clear boundaries and well-defined interfaces; one responsibility per file.
- Prefer smaller, focused files; files that change together live together (split by responsibility, not technical layer).
- In existing codebases follow established patterns; don't unilaterally restructure, but splitting a file you're already modifying that has grown unwieldy is reasonable.
- **Foundation first:** order tasks so the shared base lands before the modules that depend on it (FLOW-SPEC Stage 5).

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):** write the failing test → run it, see it fail → minimal code to pass → run tests, see pass → commit.

## Plan Document Header

Every plan MUST start with:

```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

---
```

## Task Structure

````markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

- [ ] **Step 1: Write the failing test**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL with "function not defined"

- [ ] **Step 3: Write minimal implementation**

```python
def function(input):
    return expected
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/path/test.py::test_name -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```
````

## No Placeholders

Every step must contain the actual content an engineer needs. These are **plan failures** — never write them:
- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (repeat the code — tasks may be read out of order)
- Steps that describe what without showing how (code blocks required for code steps)
- References to types, functions, or methods not defined in any task

## Remember
- Exact file paths always
- Complete code in every step — if a step changes code, show the code
- Exact commands with expected output
- DRY, YAGNI, TDD, frequent commits
- Plan the consistency path up front: a feature that touches the data model also touches API/contract → frontend → call sites → docs → tests (principle #6). Each plan should account for that full path.

## Self-Review

After writing the complete plan, check it against the spec with fresh eyes (a checklist you run yourself — not a subagent dispatch).

1. **Spec coverage:** skim each spec requirement; point to a task that implements it. List gaps; add tasks for any requirement with no task.
2. **Placeholder scan:** search for the red flags above; fix them.
3. **Type consistency:** do types, signatures, and property names in later tasks match earlier ones? (`clearLayers()` in Task 3 vs `clearFullLayers()` in Task 7 is a bug.)

Fix inline; no re-review.

## Execution Handoff

After saving the plan, offer the execution choice:

> **"Plan complete and saved to `docs/vibegod/plans/<filename>.md`. Two execution options:**
>
> **1. Subagent-Driven (recommended)** — fresh subagent per task, two-stage review between tasks, fast iteration.
> **2. Inline Execution** — execute in this session with checkpoints.
>
> **Which approach?"**

- **Subagent-Driven →** REQUIRED SUB-SKILL: `subagent-driven-development`.
- **Inline →** REQUIRED SUB-SKILL: `executing-plans`.

This is the Stage 5 ◆ gate: get the explicit go before coding agents start (FLOW-SPEC Stage 5, principle #10).
