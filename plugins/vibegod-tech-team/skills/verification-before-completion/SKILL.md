---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, passing, or done — before committing, creating a PR, marking a task complete, or moving on. Requires running the verification commands and confirming output (and the consistency/no-orphans check) BEFORE any success claim. Evidence before assertions, always.
---
<!-- Adapted from superpowers (https://github.com/obra/superpowers), MIT (c) Jesse Vincent. -->

# Verification Before Completion

## Overview

Claiming work is complete without verification is dishonesty, not efficiency.

**Core principle:** Evidence before claims, always.

**Violating the letter of this rule is violating the spirit of this rule.**

## Fits in the pipeline

The completion gate enforced at the close of **Stage 6 (Build)**, throughout the **Stage 7 per-feature QA gate** (`/feature-check`), and at the **Stage 8 ship gate** (`/ship-check`). The Consistency & no-orphans section below is the teeth of principle #6 and is checked here AND at `/ship-check`. Priority: **user > skills > default**; `_shared/vibegod-principles.md` apply (#8 evidence-based completion only).

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

## The Gate Function

```
BEFORE claiming any status or expressing satisfaction:
1. IDENTIFY: what command proves this claim?
2. RUN: execute the FULL command (fresh, complete)
3. READ: full output, check exit code, count failures
4. VERIFY: does the output confirm the claim?
     NO  → state actual status with evidence
     YES → state the claim WITH evidence
5. ONLY THEN: make the claim
Skip any step = lying, not verifying
```

## Verify the Real Signal — Anti-Hallucination Rules (MANDATORY)

A confident, well-argued conclusion can still be wrong. These five rules exist because the worst
errors are *verified against the wrong thing*, not unverified. They apply to every diagnosis,
root-cause story, and "fixed / works / passing / non-issue" claim.

1. **Real signal, not a proxy.** Verify what the USER actually observes (does it load? does the
   command appear? does the request succeed?), never a related count/inventory/log that merely
   correlates. *Canonical trap: `claude plugin details` prints `Hooks (3)` even for a plugin that
   `✘ failed to load`; only `claude plugin list` shows the real load status.* Confirm the command
   measures the property you care about (static parse ≠ runtime load; cached ≠ fresh; one scope ≠ all).
2. **Reproduce the exact reported symptom** before calling it absent, fixed, or a non-issue. Same
   command, same state the reporter used.
3. **Disconfirmation pass.** Ask "if I'm wrong, what would I see?" — then go look for it. A claim you
   only tried to confirm is unverified.
4. **Contradiction = STOP.** If your conclusion clashes with another agent's hands-on result, the
   user's report, or a prior run, reconcile by reproducing BOTH observations until they agree. Never
   override empirical evidence with a theoretical argument — the reproduction wins, not the argument.
5. **Escalate high-stakes/contested claims to `claim-verifier`.** For any conclusion that overrides
   prior evidence, removes something as "safe", or declares a hard-to-see bug fixed, dispatch the
   `claim-verifier` agent for an independent falsification pass before presenting it as fact.

## Common Failures

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| Tests pass | Test command output: 0 failures | Previous run, "should pass" |
| Linter clean | Linter output: 0 errors | Partial check, extrapolation |
| Build succeeds | Build command: exit 0 | Linter passing, logs look good |
| Bug fixed | Test original symptom: passes | Code changed, assumed fixed |
| Regression test works | Red-green cycle verified | Test passes once |
| Agent completed | VCS diff shows changes | Agent reports "success" |
| Requirements met | Line-by-line checklist | Tests passing |
| Feature fully wired | Consistency/no-orphans check (below) | Backend works in isolation |
| "It works / it loads" | The user-observable end state (e.g. `plugin list` load status) | A proxy/inventory that merely correlates (`plugin details`) |
| "X is a non-issue / safe to remove" | Reproduced the reported symptom both ways | A theoretical argument that contradicts someone's hands-on result |

## Consistency & No-Orphans (MANDATORY — blocks completion)

**On ANY feature add, change, or removal, completion is BLOCKED until you have verified the FULL path is updated end-to-end.** This is the most common real-world failure (principle #6). Partial propagation = not done. Run this every time, with evidence:

**1. Full-path propagation — trace and verify each link:**
`data model / schema → API / contract / events → frontend / UI → EVERY call site → docs → tests`
- Search the whole repo for references to the thing you changed (renamed field, removed endpoint, new param). Update them ALL. Show the search.
- A new field exists in the DB AND the API response AND the UI AND its tests — or it isn't done.
- A removed endpoint is gone from the backend AND every caller AND the docs that advertised it.

**2. No dead / obsolete code:** the change makes some code unreachable (old endpoint, replaced helper, orphaned component, stale flag)? Confirm nothing depends on it, then remove it. Grep proves it's unreferenced.

**3. UI ↔ backend in sync:** no UI element without a working backend behind it; no backend feature the UI still advertises after removal; no half-wired feature working in one place but broken in another. Verify the round trip, not just one side.

**4. Pipeline-artifact propagation:** the change is reflected through the VibeGod artifacts in order — **PRD → blueprint → code roadmap → graphify → actual code** (FLOW-SPEC Stage 9). A code change with no upstream artifact update (or vice versa) is an orphan. Any feature/journey change re-enters at the PRD stage.

**Evidence required:** state which call sites you searched (and the search command), which were updated, what dead code was removed, and that UI↔backend round-trips. **If any of the four is not satisfied, you CANNOT claim completion** — report the gap instead.

## Red Flags — STOP

"should" / "probably" / "seems to" · expressing satisfaction before verification ("Great!"/"Perfect!"/"Done!") · about to commit/push/PR without verification · trusting agent success reports · relying on partial verification · "just this once" · tired and wanting it over · **ANY wording implying success without having run verification** · claiming a feature done while a call site, the UI, or a doc still references the old behavior · verifying a proxy/inventory/count instead of the real user-observable end state · dismissing another agent's or the user's reproduced result with an argument instead of a reproduction · calling something a "non-issue" or "safe to remove" without reproducing the reported symptom.

## Rationalization Prevention

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence ≠ evidence |
| "Just this once" | No exceptions |
| "Linter passed" | Linter ≠ compiler |
| "Agent said success" | Verify independently (check the diff) |
| "I'm tired" | Exhaustion ≠ excuse |
| "Partial check is enough" | Partial proves nothing |
| "Different words so rule doesn't apply" | Spirit over letter |
| "Backend works, frontend later" | Half-wired = not done. Run the consistency check. |
| "I only changed one place" | Search the repo. Every call site, or it's an orphan. |
| "The inventory/count looks right" | Counts ≠ outcome. Verify the real end state the user sees. |
| "My reasoning says the other agent is wrong" | Reproduce their observation. Argument ≠ evidence. |

## Key Patterns

**Tests:** `[run test command] [see 34/34 pass] "All tests pass"` ❌ "Should pass now".
**Regression (TDD red-green):** `Write → Run (pass) → Revert fix → Run (MUST FAIL) → Restore → Run (pass)` ❌ "I've written a regression test" without red-green.
**Build:** `[run build] [see exit 0] "Build passes"` ❌ "Linter passed".
**Requirements:** `Re-read plan → checklist → verify each → report gaps or completion` ❌ "Tests pass, phase complete".
**Agent delegation:** `Agent reports success → check VCS diff → verify changes → report actual state` ❌ trust the report.
**Consistency:** `Grep every call site → update all → remove dead code → verify UI↔backend round trip → confirm PRD→...→code propagation` ❌ "I changed the one file I was looking at".

## When To Apply

ALWAYS before: any success/completion claim · any expression of satisfaction · any positive statement about work state · committing, PR creation, task completion · moving to the next task · delegating to agents. Applies to exact phrases, paraphrases, synonyms, and ANY implication of success/correctness.

## The Bottom Line

Run the command. Read the output. Run the consistency/no-orphans check. THEN claim the result. This is non-negotiable.
