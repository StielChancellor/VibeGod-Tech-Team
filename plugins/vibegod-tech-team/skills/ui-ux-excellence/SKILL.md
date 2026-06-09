---
name: ui-ux-excellence
description: The golden rules an expert UI/UX designer applies when building or reviewing any page, screen, or component — usability heuristics, color (60-30-10, WCAG contrast), typography, 8-pt spacing/grid, design tokens, responsive/cross-device behavior, the four data states, motion, and a visual-QA checklist for catching broken or inconsistent layouts. Use when designing UI, building a page/screen/component, choosing colors/typography/layout, judging "does this look right / is it broken", or reviewing a front-end for quality and cross-screen consistency.
allowed-tools: Read, Grep, Glob, Bash
---

# UI/UX Excellence — how an expert designs and reviews UI

The standard the `ui-ux-designer`, `ux-design-reviewer`, and `frontend-engineer` hold every
page to. Pairs with `frontend-craft` (aesthetics/anti-AI-slop) and `accessibility-wcag`.
User > skills > default.

## Fits in the pipeline
Stage 2 (journey/UX), Stage 6 (build UI), **Stage 7 (the UX review lens — gate each UI feature)**,
Stage 8 (ship). A UI feature does not close until it PASSES this review.

## 1. Usability golden rules (check each)
- **Nielsen's 10 heuristics:** visible system status; match real world (user language); user control
  (undo/cancel/exit); consistency & standards; error prevention; recognition over recall; flexibility/
  shortcuts; aesthetic & minimalist; help users recover from errors (plain-language, propose a fix);
  help/docs in context. (https://www.nngroup.com/articles/ten-usability-heuristics/)
- **Gestalt:** proximity (group related, separate unrelated), similarity (same function → same look),
  closure, continuity (align along a path), common region (cards/containers group). (nngroup.com/articles/gestalt-proximity/)
- **Laws of UX:** Fitts (big, close targets), Hick (reduce/chunk choices), Jakob (follow familiar
  patterns), Miller (~7±2 chunks), Doherty (<400ms response or mask it), Aesthetic-Usability.
  (https://lawsofux.com/laws/)

## 2. Color
- **60-30-10:** ~60% neutral surface / 30% secondary / 10% accent (primary action). Accent must not flood.
- **Structured palette:** neutrals (8–10 shades) + 1–2 brand colors (5–10 shades each, 100–900 scale)
  + semantic (error=red, warning=amber, success=green, info=blue). Define shades upfront. (refactoringui.com)
- **WCAG AA contrast:** normal text **≥4.5:1**; large text (≥24px, or bold ≥18.5px) **≥3:1**; UI
  components/icons/state boundaries **≥3:1**. (https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- **Never color alone** (WCAG 1.4.1) — pair with text/icon/pattern. Themes via tokens; contrast must
  pass in BOTH light and dark.

## 3. Typography
- Body **≥16px**; **line length 45–75 chars** (~66 ideal, constrain with max-width); body line-height
  **1.4–1.6**. Modular type scale with clear hierarchy; **1–2 font families**, a defined set of weights.
  (https://practicaltypography.com/summary-of-key-rules.html)

## 4. Layout, spacing & grid
- **8-pt spacing system** — every margin/padding/gap is a multiple of 8 (4 allowed as half-step):
  4/8/16/24/32/48/64. Arbitrary values (13px, 27px) = fail. Align to a shared (12-col) grid; deliberate
  whitespace; visual weight reflects importance. (https://spec.fm/specifics/8-pt-grid)

## 5. Design systems & tokens
- **Atomic design** (atoms→molecules→organisms→templates→pages); reuse components, no divergent
  re-implementations of the same control. **Design tokens are the single source of truth** (color/
  space/type/radius); hardcoded raw values = fail. (https://atomicdesign.bradfrost.com/chapter-2/)

## 6. Responsive & cross-device (the "not broken across screens" core)
- **Mobile-first**, fluid layouts; test the breakpoint matrix **320 / 375 / 768 / 1024 / 1280 / 1440 /
  1920**. Use container queries for component-level responsiveness. (MDN Responsive Design)
- **Touch targets ≥ 44–48px** for primary controls (WCAG 2.5.5; Material 48dp / Apple 44pt).
- **No horizontal overflow** at any breakpoint; content fits, nothing clipped.
- **Consistency across sizes & pages:** the same component looks/behaves identically everywhere; content
  hierarchy survives resizing. Divergence = fail.

## 7. Journey & flows
- Key scenarios have a journey map (actions/thoughts/emotions → opportunities); discrete tasks have user
  flows. Minimize steps to value (Hick). (https://www.nngroup.com/articles/journey-mapping-101/)

## 8. Frontend ↔ backend UX
- **Design all four states for every data view:** empty, loading, error, ideal. **Skeleton screens** for
  loading (reserve space → no layout shift); **optimistic UI** with rollback on failure.
- **Latency budgets (RAIL):** input response <100ms; animation frame ~16ms; idle chunks ≤50ms; interactive
  ~5s on mid-range mobile. Plus Doherty <400ms. (https://web.dev/articles/rail)
- **Forms:** inline validation, plain-language field-level errors, required indicators not by color alone.

## 9. Motion
- Purposeful only (state/relationship/feedback). Duration scaled to distance, real easing (no linear).
  Provide hover/press/loading/success feedback. **Respect `prefers-reduced-motion`.** (m3.material.io motion)

## 10. Visual QA checklist — any = BROKEN (fail)
Horizontal overflow/sideways scroll · overlapping/colliding elements · text truncation/clipping ·
broken/missing images/icons · off-token colors or spacing · layout shift after load (CLS) · z-index
errors (menu/modal behind content) · contrast failures (§2) · touch targets below minimum (§6) ·
inconsistent rendering of the same component across breakpoints or pages.
- **Core Web Vitals (good @ p75):** LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. (https://web.dev/articles/vitals)

## Review verification protocol (how to prove a page isn't broken)
1. Render the page at each breakpoint in the matrix (320→1920). **Easiest: the bundled `visual-check`
   tool** (portable Playwright — resolves Playwright from the project):
   `node "${CLAUDE_PLUGIN_ROOT}/skills/ui-ux-excellence/tools/visual-check.mjs" --url <url>` — it
   screenshots every breakpoint and reports horizontal overflow / broken images / oversized elements /
   console errors to `report.json` (exit 1 if broken). First run needs
   `npm i -D playwright && npx playwright install chromium`. Alternatives: a Preview/Chrome MCP, or the
   project's run/preview skill.
2. At each width, scan the §10 checklist; measure contrast (§2), spacing on the 8-pt grid (§4), and touch
   targets (§6).
3. Exercise the four states (§8) and `prefers-reduced-motion`.
4. Compare the same component across breakpoints AND across pages — flag any inconsistency.
5. Prefer **visual-regression** (screenshot diffs vs an approved baseline) in CI: Playwright/BackstopJS/
   Percy/Chromatic. (https://percy.io/blog/visual-regression-testing-tools)
6. Output: PASS, or a defect list (severity · exact file/selector/breakpoint · expected vs actual · fix).
