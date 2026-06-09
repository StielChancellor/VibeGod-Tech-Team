---
name: accessibility-wcag
description: Use when building, reviewing, or signing off any UI to enforce WCAG 2.2 AA — color contrast, keyboard operability, focus management, ARIA, alt text, reduced-motion, and forms. Trigger on "is this accessible", "a11y", "WCAG", "keyboard navigation", "screen reader", "contrast", or as part of "done" for any user-facing feature. Provides a concrete checklist an engineer can apply and verify.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Accessibility — WCAG 2.2 AA

Accessibility is part of "done" for UI (principle #8), not a later pass. Apply this while
building and verify it at QA. Test for real: keyboard-only, a screen reader, and an automated
checker (axe). Don't claim "accessible" without having actually checked.

## Fits in the pipeline
- **Stage 6** (`/build`) — applied while the frontend is built (pairs with `frontend-craft`).
- **Stage 7** (`/feature-check`) — `qa-engineer` verifies a11y before a feature closes.
- **Stage 8** (`/ship-check`) — final accessibility + cross-browser pass before ship.

## The checklist (organized by POUR)

### Perceivable
- **Contrast:** text ≥ 4.5:1 (large text ≥ 3:1); UI components & graphical objects ≥ 3:1.
  Measure against the real rendered background, including layered/atmospheric ones.
- **Text alternatives:** meaningful `alt` on informative images; `alt=""` on decorative ones;
  icons that convey meaning have accessible names. No information conveyed by color alone.
- **Structure:** semantic HTML (`<button>`, `<nav>`, `<main>`, `<h1..h6>` in order, lists,
  `<table>` with headers). Landmarks present. Don't fake controls with `<div onClick>`.
- **Resize/reflow:** usable at 200% zoom and 320px width without loss of content or function.

### Operable
- **Keyboard:** every interactive element reachable and operable by keyboard; logical tab order;
  no keyboard traps. Custom widgets implement expected key patterns (Esc closes, arrows in menus).
- **Focus visible (2.4.7):** clear, high-contrast focus indicator — never `outline:none` without
  a replacement. **Focus not obscured (2.4.11, new in 2.2):** focused element isn't hidden behind
  sticky headers/footers.
- **Target size (2.5.8, new in 2.2):** interactive targets ≥ 24×24 CSS px (or adequate spacing).
- **Reduced motion:** honor `prefers-reduced-motion`; no content that flashes > 3×/sec.
- **Timeouts:** warn and allow extension; nothing critical lost to a timer.

### Understandable
- **Labels:** every form control has a programmatic label; placeholder is not a label.
- **Errors:** identify the field, describe the problem in text, suggest a fix; associate the
  message with the input (`aria-describedby`). **Don't re-ask info already given (3.3.7, new in 2.2).**
- **Predictable:** consistent navigation/identification; no surprise context changes on focus.
- **Language:** `lang` set on `<html>`.

### Robust
- **ARIA — last resort, used right:** prefer native elements. When ARIA is needed, roles/states/
  properties are valid and kept in sync (`aria-expanded`, `aria-current`, `aria-live` for dynamic
  updates). Never an `aria-*` that contradicts the element. "No ARIA is better than bad ARIA."
- **Name/Role/Value:** custom components expose all three to assistive tech.

## How to verify (evidence, not assertion)
1. **Keyboard pass:** unplug the mouse — Tab through the whole flow, operate everything, confirm
   visible focus and no traps.
2. **Automated:** run axe (or equivalent); fix violations. Automated tools catch ~30–40% — they
   don't replace the manual passes.
3. **Screen reader spot-check:** key flows make sense with VoiceOver/NVDA.
4. **Contrast:** check actual tokens against actual backgrounds.

## Definition of done
A UI feature is not done until the keyboard pass, automated check, contrast check, and
reduced-motion support all pass. This is enforced at Stage 7.
