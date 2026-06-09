---
name: receiving-code-review
description: Use when receiving code review feedback (from a reviewer subagent, an external reviewer, or the user), before implementing any suggestion — especially if feedback seems unclear or technically questionable. Requires verifying against the codebase and reasoned pushback, not performative agreement or blind implementation.
---
<!-- Adapted from superpowers (https://github.com/obra/superpowers), MIT (c) Jesse Vincent. -->

# Receiving Code Review

## Overview

Code review requires technical evaluation, not emotional performance.

**Core principle:** Verify before implementing. Ask before assuming. Technical correctness over social comfort.

## Fits in the pipeline

The receiving end of the **Stage 7 per-feature QA gate** and **Stage 8** reviews — how you process findings from the four QA lenses and external reviewers. Pairs with `requesting-code-review`. Priority: **user > skills > default**; `_shared/vibegod-principles.md` apply (#2 YAGNI on "professional" features, #4 don't break working behavior, #10 terse senior tone).

## The Response Pattern

```
WHEN receiving code review feedback:
1. READ: complete feedback without reacting
2. UNDERSTAND: restate the requirement in your own words (or ask)
3. VERIFY: check against codebase reality (read the actual code — principle #1)
4. EVALUATE: technically sound for THIS codebase?
5. RESPOND: technical acknowledgment or reasoned pushback
6. IMPLEMENT: one item at a time, test each
```

## Forbidden Responses

**NEVER:** "You're absolutely right!" · "Great point!" / "Excellent feedback!" · "Let me implement that now" (before verification).
**INSTEAD:** restate the technical requirement · ask clarifying questions · push back with reasoning if wrong · just start working (actions > words).

## Handling Unclear Feedback

If any item is unclear: STOP — implement nothing yet — ask for clarification on the unclear items. Items may be related; partial understanding = wrong implementation.

```
Reviewer: "Fix 1-6"   (you understand 1,2,3,6; unclear on 4,5)
WRONG: implement 1,2,3,6 now, ask about 4,5 later
RIGHT: "I understand 1,2,3,6. Need clarification on 4 and 5 before proceeding."
```

## Source-Specific Handling

**From the user:** trusted — implement after understanding; still ask if scope unclear; no performative agreement; skip to action or technical acknowledgment.

**From external reviewers** (incl. reviewer subagents) — be skeptical, check carefully before implementing:
1. Technically correct for THIS codebase?
2. Breaks existing functionality?
3. Reason the current implementation exists?
4. Works on all platforms/versions?
5. Does the reviewer understand full context?

If a suggestion seems wrong → push back with technical reasoning. If you can't verify → say so: "I can't verify this without [X]. Should I [investigate/ask/proceed]?" If it conflicts with the user's prior decisions → stop and discuss with the user first.

## YAGNI Check for "Professional" Features

If a reviewer suggests "implementing properly", grep the codebase for actual usage. **Unused:** "This endpoint isn't called. Remove it (YAGNI)?" **Used:** implement properly. (Principle #2 — don't add what wasn't asked for.)

## Implementation Order

For multi-item feedback: clarify anything unclear FIRST, then implement — blocking issues (breaks, security) → simple fixes (typos, imports) → complex fixes (refactoring, logic). Test each fix individually; verify no regressions (`verification-before-completion`).

## When To Push Back

Push back when a suggestion breaks existing functionality, the reviewer lacks full context, it violates YAGNI, it's technically incorrect for this stack, legacy/compat reasons exist, or it conflicts with the user's architectural decisions.

**How:** technical reasoning, not defensiveness; specific questions; reference working tests/code; involve the user if architectural.

## Acknowledging Correct Feedback

```
GOOD: "Fixed. [what changed]"   ·   "Good catch — [issue]. Fixed in [location]."   ·   [just fix it; the code shows it]
BAD:  "You're absolutely right!" · "Great point!" · "Thanks for catching that!" · ANY gratitude expression
```
Actions speak. If you catch yourself about to write "Thanks": delete it, state the fix.

## Gracefully Correcting Your Pushback

If you pushed back and were wrong:
```
GOOD: "You were right — I checked [X] and it does [Y]. Implementing now."
BAD:  long apology · defending why you pushed back · over-explaining
```
State the correction factually and move on.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Performative agreement | State the requirement or just act |
| Blind implementation | Verify against the codebase first |
| Batch without testing | One at a time, test each |
| Assuming reviewer is right | Check if it breaks things |
| Avoiding pushback | Technical correctness > comfort |
| Partial implementation | Clarify all items first |
| Can't verify, proceed anyway | State the limitation, ask for direction |

## GitHub Thread Replies

Reply to inline review comments in the comment thread (`gh api repos/{owner}/{repo}/pulls/{pr}/comments/{id}/replies`), not as a top-level PR comment.

## The Bottom Line

**External feedback = suggestions to evaluate, not orders to follow.** Verify. Question. Then implement. No performative agreement. Technical rigor always.
