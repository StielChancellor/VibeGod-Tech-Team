---
name: systematic-debugging
description: Use when encountering ANY bug, test failure, crash, performance problem, build failure, or unexpected behavior, BEFORE proposing or attempting fixes. Forces root-cause investigation before patches. Triggers especially under time pressure, when a "quick fix" seems obvious, or when previous fixes didn't work.
---
<!-- Adapted from superpowers (https://github.com/obra/superpowers), MIT (c) Jesse Vincent. -->

# Systematic Debugging

## Overview

Random fixes waste time and create new bugs. Quick patches mask underlying issues.

**Core principle:** ALWAYS find the root cause before attempting fixes. Symptom fixes are failure.

**Violating the letter of this process is violating the spirit of debugging.**

## Fits in the pipeline

Used inside **Stage 6 (Build)** and the **Stage 7 per-feature QA gate** — the adversarial-tester and qa-engineer lenses lean on it. A confirmed root cause feeds a failing test via `test-driven-development` before the fix lands. Priority: **user > skills > default**; `_shared/vibegod-principles.md` apply (#1 investigate before answering, #4 general correct solutions — never code to the symptom).

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes.

## When to Use

ANY technical issue: test failures, production bugs, unexpected behavior, performance, build failures, integration issues.

**ESPECIALLY when:** under time pressure (emergencies make guessing tempting); "just one quick fix" seems obvious; you've already tried multiple fixes; a previous fix didn't work; you don't fully understand the issue.

**Don't skip when:** the issue seems simple (simple bugs have root causes too); you're in a hurry (rushing guarantees rework); someone wants it fixed NOW (systematic is faster than thrashing).

## The Four Phases

Complete each before the next.

### Phase 1: Root Cause Investigation

**BEFORE any fix:**

1. **Read error messages carefully** — don't skip errors/warnings; read full stack traces; note line numbers, paths, codes.
2. **Reproduce consistently** — exact steps, every time? If not reproducible, gather more data; don't guess.
3. **Check recent changes** — git diff, recent commits, new deps, config/env differences.
4. **Gather evidence in multi-component systems** — when the system has multiple boundaries (CI → build → signing, API → service → DB), add diagnostic instrumentation at EACH boundary (log data in, data out, env/config propagation, state at each layer). Run once to show WHERE it breaks, then investigate that component.

   ```bash
   echo "IDENTITY: ${IDENTITY:+SET}${IDENTITY:-UNSET}"   # layer 1
   env | grep IDENTITY || echo "not in environment"      # layer 2
   security find-identity -v                              # layer 3
   ```
5. **Trace data flow** — when the error is deep in the call stack, trace backward: where does the bad value originate? what called this with it? Keep tracing up to the source. Fix at the source, not the symptom.

### Phase 2: Pattern Analysis

1. **Find working examples** — similar working code in the same codebase.
2. **Compare against references** — read the reference implementation COMPLETELY (every line), not skimmed.
3. **Identify differences** — list every difference, however small. Don't assume "that can't matter".
4. **Understand dependencies** — what components, settings, config, env, assumptions does it need?

### Phase 3: Hypothesis and Testing

1. **Form a single hypothesis** — "I think X is the root cause because Y." Write it down. Be specific.
2. **Test minimally** — the SMALLEST change to test it; one variable at a time.
3. **Verify before continuing** — worked? → Phase 4. Didn't? Form a NEW hypothesis; don't stack fixes.
4. **When you don't know** — say "I don't understand X"; don't pretend; ask or research.

### Phase 4: Implementation

Fix the root cause, not the symptom.

1. **Create a failing test case** — simplest reproduction; automated if possible. MUST have before fixing. Use `test-driven-development`.
2. **Implement a single fix** — address the root cause; ONE change; no "while I'm here" improvements or bundled refactoring (principle #3).
3. **Verify the fix** — test passes? other tests still pass? issue actually resolved? (Use `verification-before-completion` — evidence, not assumption.)
4. **If the fix doesn't work** — STOP. Count attempts. If < 3, return to Phase 1 with new info. If ≥ 3, question the architecture (step 5).
5. **If 3+ fixes failed: question the architecture** — pattern: each fix reveals new coupling/state elsewhere; fixes need "massive refactoring"; each fix creates new symptoms. STOP and question fundamentals (is this pattern sound? sticking with it through inertia? refactor vs. keep patching?). Discuss with the user before more fixes. This is a wrong architecture, not a failed hypothesis.

## Red Flags — STOP and Follow Process

"Quick fix for now, investigate later" · "just try changing X" · "add multiple changes, run tests" · "skip the test, I'll manually verify" · "it's probably X" · "I don't fully understand but this might work" · proposing solutions before tracing data flow · "one more fix attempt" (after 2+) · each fix reveals a new problem elsewhere.

**All mean: STOP. Return to Phase 1.** 3+ failed fixes → question the architecture.

## User Signals You're Doing It Wrong

"Is that not happening?" (assumed without verifying) · "Will it show us...?" (should have added evidence gathering) · "Stop guessing" (proposing fixes without understanding) · "Ultrathink this" (question fundamentals) · "We're stuck?" (approach isn't working). When you see these: STOP, return to Phase 1.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Issue is simple, don't need process" | Simple issues have root causes too. Process is fast for them. |
| "Emergency, no time for process" | Systematic is FASTER than guess-and-check thrashing. |
| "Just try this first, then investigate" | The first fix sets the pattern. Do it right from the start. |
| "I'll write the test after the fix works" | Untested fixes don't stick. Test-first proves it. |
| "Multiple fixes at once saves time" | Can't isolate what worked. Causes new bugs. |
| "Reference too long, I'll adapt the pattern" | Partial understanding guarantees bugs. Read it fully. |
| "One more fix attempt" (after 2+) | 3+ failures = architectural problem. Question the pattern. |

## Quick Reference

| Phase | Key Activities | Success Criteria |
|-------|---------------|------------------|
| 1. Root Cause | Read errors, reproduce, check changes, gather evidence | Understand WHAT and WHY |
| 2. Pattern | Find working examples, compare | Identify differences |
| 3. Hypothesis | Form theory, test minimally | Confirmed or new hypothesis |
| 4. Implementation | Create test, fix, verify | Bug resolved, tests pass |

## When Process Reveals "No Root Cause"

If investigation shows the issue is truly environmental, timing-dependent, or external: you've completed the process; document what you investigated; implement appropriate handling (retry, timeout, error message); add monitoring/logging. **But:** 95% of "no root cause" cases are incomplete investigation.

## Related Skills

- `test-driven-development` — failing test before the fix (Phase 4).
- `verification-before-completion` — verify the fix worked before claiming success.
