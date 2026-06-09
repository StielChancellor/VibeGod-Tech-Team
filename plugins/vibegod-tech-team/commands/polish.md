---
description: "Design-refinement pass — make a UI distinctive (not \"AI-slop\"): audit fonts/color/spacing/cliché patterns, fix the highest-impact gaps, then re-run the visual + a11y gates. Args: the page/component/route."
---

Adopt the `vibegod-orchestrator` mindset and honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.

Run a **design-refinement** pass on: **$ARGUMENTS** (if empty, use the page most recently built/changed).

Load the `design-refinement` skill (+ `frontend-craft`, `ui-ux-excellence`) and drive the
`ui-ux-designer` (judgment) + `frontend-engineer` (fixes):

1. **Name the register** (brand vs product) and the **aesthetic reference** in one sentence. If that
   sentence fits the modal page in the category, the direction is too safe — restart it.
2. **Audit** against the cliché blocklist + `ui-ux-excellence`: training-data fonts (Inter/DM/Space
   Grotesk/Fraunces/etc.), system-font fallback, purple→blue gradients, glassmorphism, centered-card-
   on-a-void, nested cards, eyebrow-label scaffolding, icon-tile-above-every-heading, gray-on-color,
   timid even palette, default Tailwind blue / untouched shadcn slate. Cite exact files/lines.
3. **Fix** the highest-impact gaps via the `frontend-engineer`: pick a real loaded font (Fontsource/
   next-font/Google), commit to a color strategy (one color ~60%, tinted neutrals), strengthen
   hierarchy/scale, remove cliché decoration.
4. **Re-verify:** run `/ux-check` (the Playwright visual gate) AND the `accessibility-wcag` audit via
   `ux-design-reviewer`. Loop until it passes the **slop test** AND the broken-UI/contrast checks.

Note: design boldly first; the a11y audit is the review step — don't let it flatten the design before
it exists. Honest caveat: tooling removes the hand-rolled tells; distinctiveness still comes from the
committed font/color/reference choices.
