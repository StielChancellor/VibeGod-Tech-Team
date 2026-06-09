---
name: requesting-code-review
description: Use when completing a task, finishing a major feature, or before merging — dispatch a fresh code-reviewer subagent with precisely-crafted context to catch issues before they cascade. Triggers after each task in subagent-driven development, before merge to main, or when stuck and needing a fresh perspective.
---
<!-- Adapted from superpowers (https://github.com/obra/superpowers), MIT (c) Jesse Vincent. -->

# Requesting Code Review

Dispatch a code-reviewer subagent to catch issues before they cascade. The reviewer gets precisely crafted context — never your session history — so it stays focused on the work product, not your thought process, and your own context is preserved.

**Core principle:** Review early, review often.

## Fits in the pipeline

The mechanism behind the **Stage 7 per-feature QA gate** — the four lenses (security-engineer, code-quality-reviewer, adversarial-tester, qa-engineer) are dispatched this way — and the final review in **Stage 8**. Inside `subagent-driven-development` it runs after every task. Priority: **user > skills > default**; `_shared/vibegod-principles.md` apply. Reviewers must include the consistency/no-orphans check (principle #6) — see `verification-before-completion`.

## When to Request Review

**Mandatory:** after each task in subagent-driven development; after a major feature; before merge to main.
**Optional but valuable:** when stuck (fresh perspective); before refactoring (baseline check); after fixing a complex bug.

## How to Request

**1. Get git SHAs:**
```bash
BASE_SHA=$(git rev-parse HEAD~1)   # or origin/main
HEAD_SHA=$(git rev-parse HEAD)
```

**2. Dispatch a code-reviewer subagent** (Task tool, general-purpose). Give it exactly:
- **Description** — brief summary of what you built.
- **Plan/requirements** — what it should do (link the plan task or spec).
- **Diff range** — `BASE_SHA..HEAD_SHA` to review.
- **What to check** — correctness, requirement coverage, security (OWASP), tests present and meaningful, and the **consistency/no-orphans check** (data model → API → frontend → call sites → docs → tests all updated; no dead code; UI ↔ backend in sync — principle #6).
- **Output format** — categorize findings as **Critical / Important / Minor**, plus a one-line assessment (ready to proceed or not).

**3. Act on feedback:**
- Fix **Critical** immediately.
- Fix **Important** before proceeding.
- Note **Minor** for later.
- Push back if the reviewer is wrong — with technical reasoning (see `receiving-code-review`).

## Example

```
[Completed Task 2: Add verifyIndex() / repairIndex()]

BASE_SHA=a7981ec   HEAD_SHA=3df7661

[Dispatch code reviewer]
  Description: Added verifyIndex() and repairIndex() with 4 issue types
  Requirements: Task 2 from docs/vibegod/plans/deployment-plan.md
  Check: correctness, OWASP, tests, consistency/no-orphans

[Returns]
  Strengths: clean architecture, real tests
  Important: missing progress indicators
  Minor: magic number (100) for reporting interval
  Assessment: ready to proceed after Important fix

[Fix progress indicators] → continue to Task 3
```

## Integration with Workflows

- **Subagent-Driven Development:** review after EACH task; catch issues before they compound; fix before the next task.
- **Executing Plans:** review at task boundaries / natural checkpoints.
- **Ad-hoc:** review before merge or when stuck.

## Red Flags

**Never:** skip review because "it's simple" · ignore Critical issues · proceed with unfixed Important issues · argue with valid technical feedback.

**If the reviewer is wrong:** push back with technical reasoning; show code/tests that prove it works; request clarification.
