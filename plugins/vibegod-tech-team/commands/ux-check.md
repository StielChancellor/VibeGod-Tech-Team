---
description: "Review a page/screen/component for UI/UX best practices and cross-screen integrity — renders across all breakpoints, flags broken/inconsistent UI, and dispatches fixes to the frontend-engineer. Args: the page/route/component (path or URL)."
---

Run a full UI/UX quality gate on: **$ARGUMENTS** (if empty, ask which page/route/component, or use the
one most recently built/changed).

Load `vibegod-principles.md` and the `ui-ux-excellence` skill, then delegate to the
**`ux-design-reviewer`** agent. It must:

1. Render the target across the breakpoint matrix (320 / 375 / 768 / 1024 / 1280 / 1440 / 1920).
   Preferred: the bundled tool — `node "${CLAUDE_PLUGIN_ROOT}/skills/ui-ux-excellence/tools/visual-check.mjs"
   --url <url>` (portable Playwright; screenshots + `report.json`, exit 1 if broken; first run needs
   `npm i -D playwright && npx playwright install chromium`). Else a Preview/Chrome MCP or the project's
   run/preview skill. If no live rendering is possible, do static analysis and say so.
2. Check the `ui-ux-excellence` rules at each width: broken-UI list (overflow/overlap/truncation/broken
   images/off-token/CLS/z-index/contrast/touch targets), usability heuristics, color (60-30-10 + WCAG
   contrast, never color-alone), typography, 8-pt spacing, token consistency, the four states,
   motion/reduced-motion, and WCAG 2.2 AA.
3. Verify **consistency** of the same component across breakpoints and across pages.
4. Return **PASS**, or a defect list (severity · file/selector/breakpoint · expected vs actual · fix).
5. On FAIL, **dispatch the fixes to the `frontend-engineer`**, then re-render and re-check the affected
   breakpoints. Loop until PASS. The UI feature does not close until it passes.

This is the Stage-7 UX lens; for full sign-off also run `/feature-check` and `/ship-check`.
