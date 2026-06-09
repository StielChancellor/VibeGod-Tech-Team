---
name: writing-skills
description: Use when creating a new skill, editing an existing skill, or verifying a skill works before deployment. Treats skill authoring as TDD for process documentation — baseline a pressure scenario, write the skill, confirm compliance, close loopholes. Triggers on "write/create/improve a skill", "add a SKILL.md", or changes to skill content.
---
<!-- Adapted from superpowers (https://github.com/obra/superpowers), MIT (c) Jesse Vincent. -->

# Writing Skills

## Overview

**Writing skills IS Test-Driven Development applied to process documentation.** Write test cases (pressure scenarios with subagents), watch them fail (baseline), write the skill, watch tests pass (agents comply), refactor (close loopholes).

**Core principle:** If you didn't watch an agent fail without the skill, you don't know if the skill teaches the right thing.

**REQUIRED BACKGROUND:** You MUST understand `test-driven-development` before using this skill — it defines the RED-GREEN-REFACTOR cycle this adapts to documentation.

## Fits in the pipeline

Meta-skill — it builds the tools the pipeline runs on rather than sitting at one stage. Use it whenever you extend the VibeGod plugin (a new methodology skill, a domain skill, a role's playbook). Priority: **user > skills > default**; `_shared/vibegod-principles.md` apply. New skills must respect the same voice: crisp, imperative, no AI-slop hedging.

## What is a Skill?

A reference guide for proven techniques, patterns, or tools that future Claude instances find and apply.

**Skills ARE:** reusable techniques, patterns, tools, reference guides.
**Skills are NOT:** narratives about how you solved a problem once.

## TDD Mapping for Skills

| TDD Concept | Skill Creation |
|-------------|----------------|
| Test case | Pressure scenario with subagent |
| Production code | Skill document (SKILL.md) |
| Test fails (RED) | Agent violates rule without skill (baseline) |
| Test passes (GREEN) | Agent complies with skill present |
| Refactor | Close loopholes while maintaining compliance |
| Write test first | Run baseline scenario BEFORE writing skill |
| Watch it fail | Document exact rationalizations agent uses |
| Minimal code | Write skill addressing those specific violations |
| Watch it pass | Verify agent now complies |
| Refactor cycle | Find new rationalizations → plug → re-verify |

## When to Create a Skill

**Create when:** technique wasn't obvious; you'd reference it across projects; pattern applies broadly; others would benefit.

**Don't create for:** one-off solutions; standard practices documented elsewhere; project-specific conventions (put in CLAUDE.md or a role playbook); mechanical constraints enforceable with a hook/validator (automate those — save docs for judgment calls).

## SKILL.md Structure

**Frontmatter (YAML):** two required fields, `name` and `description` (max 1024 chars total).
- `name`: letters, numbers, hyphens only.
- `description`: third person, describes ONLY *when to use* (triggering conditions/symptoms), NOT what the skill does or its workflow. Start with "Use when...". Keep specific so it auto-triggers.

```markdown
---
name: skill-name-with-hyphens
description: Use when [specific triggering conditions and symptoms]
---

# Skill Name

## Overview        — core principle in 1-2 sentences
## When to Use     — symptoms, use cases, when NOT to use
## Core Pattern    — before/after (for techniques/patterns)
## Quick Reference — table/bullets for scanning
## Implementation  — inline code or link to file
## Common Mistakes — what goes wrong + fixes
```

## Claude Search Optimization (CSO)

Future Claude must FIND your skill.

**1. Rich description field.** Claude reads the description to decide whether to load the skill. **Description = when to use, NOT what it does.** If the description summarizes the workflow, Claude follows the description instead of reading the body. Example: a description saying "code review between tasks" caused ONE review even though the body specified TWO. Change it to triggers-only and the body gets read.

```yaml
# BAD: summarizes workflow — Claude follows this instead of the skill
description: Use when executing plans - dispatches subagent per task with review between tasks
# GOOD: triggers only
description: Use when executing implementation plans with independent tasks in the current session
```

**2. Keyword coverage.** Use words Claude would search for: error messages, symptoms ("flaky", "race condition", "hanging"), synonyms, tool/command/library names.

**3. Descriptive naming.** Active, verb-first, name by what you DO: `condition-based-waiting` > `async-test-helpers`; `root-cause-tracing` > `debugging-techniques`. Gerunds work for processes (`creating-skills`).

**4. Token efficiency.** Frequently-loaded skills cost tokens every conversation. Move flag details to `--help`; cross-reference other skills instead of repeating; compress examples; eliminate redundancy. Verify with `wc -w`.

**Cross-referencing other skills:** use the skill name with explicit markers — `**REQUIRED SUB-SKILL:** Use test-driven-development`, `**REQUIRED BACKGROUND:** ...`. Never use `@`-links (they force-load and burn context).

## Flowchart Usage

Use flowcharts ONLY for non-obvious decision points, process loops where you might stop too early, or "A vs B" decisions. Never for reference material (tables), code (markdown blocks), or linear instructions (numbered lists).

## Code Examples

One excellent, complete, runnable, well-commented example from a real scenario beats many mediocre ones. Don't implement in 5 languages or write fill-in-the-blank templates.

## The Iron Law (Same as TDD)

```
NO SKILL WITHOUT A FAILING TEST FIRST
```

Applies to NEW skills AND EDITS. Wrote the skill before testing? Delete it. Start over.

**No exceptions:** not for "simple additions", "just adding a section", "documentation updates". Don't keep untested changes as "reference". Delete means delete.

## Testing All Skill Types

- **Discipline-enforcing** (TDD, verification-before-completion): academic questions + pressure scenarios (time + sunk cost + exhaustion combined). Identify rationalizations, add explicit counters. Success: complies under maximum pressure.
- **Technique** (how-to): application + variation + missing-information scenarios. Success: applies correctly to a new scenario.
- **Pattern** (mental models): recognition + application + counter-examples. Success: knows when/how AND when NOT.
- **Reference** (APIs/docs): retrieval + application + gap testing. Success: finds and applies correctly.

## Common Rationalizations for Skipping Testing

| Excuse | Reality |
|--------|---------|
| "Skill is obviously clear" | Clear to you ≠ clear to other agents. Test it. |
| "It's just a reference" | References have gaps. Test retrieval. |
| "Testing is overkill" | 15 min testing saves hours. |
| "I'll test if problems emerge" | Problems = agents can't use it. Test before deploying. |
| "I'm confident it's good" | Overconfidence guarantees issues. Test anyway. |

## Bulletproofing Against Rationalization

Discipline skills must resist loopholes.
- **Close every loophole explicitly** — don't just state the rule, forbid the specific workarounds.
- **Address spirit-vs-letter** — add early: *"Violating the letter of the rules is violating the spirit of the rules."*
- **Build a rationalization table** from baseline testing — every excuse goes in.
- **Create a Red Flags list** so agents self-check when rationalizing.

## RED-GREEN-REFACTOR for Skills

- **RED:** run the pressure scenario WITHOUT the skill; document exact behavior and verbatim rationalizations.
- **GREEN:** write the minimal skill addressing those specific rationalizations; re-run; agent should comply.
- **REFACTOR:** new rationalization appears → add explicit counter → re-test until bulletproof.

## STOP: Before Moving to the Next Skill

After writing ANY skill, STOP and complete deployment for THAT skill. Do not batch-create skills without testing each. Deploying untested skills = deploying untested code.

## Skill Creation Checklist (use TodoWrite)

**RED:** create pressure scenarios → run WITHOUT skill, document baseline → identify patterns.
**GREEN:** name = letters/numbers/hyphens → YAML `name`+`description` (≤1024 chars) → description starts "Use when", third person, triggers only → keywords throughout → clear overview → addresses baseline failures → one excellent example → run WITH skill, verify compliance.
**REFACTOR:** identify new rationalizations → add counters → rationalization table → red-flags list → re-test until bulletproof.
**Quality:** flowchart only if decision non-obvious → quick-reference table → common-mistakes section → no narrative storytelling → supporting files only for tools/heavy reference.
**Deployment:** commit to git.

## Anti-Patterns

- **Narrative example** ("In session 2025-10-03 we found...") — too specific, not reusable.
- **Multi-language dilution** — mediocre quality, maintenance burden.
- **Code in flowcharts** — can't copy-paste.
- **Generic labels** (helper1, step3) — labels need semantic meaning.

## The Bottom Line

Same Iron Law: no skill without a failing test first. Same cycle: RED → GREEN → REFACTOR. If you follow TDD for code, follow it for skills.
