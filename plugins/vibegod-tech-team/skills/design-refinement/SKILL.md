---
name: design-refinement
description: Use to make a UI distinctive instead of generic — when a design "looks AI-made / Claude-type / templated", needs to be bolder or quieter, or before shipping any user-facing surface. Picks real fonts (not training-data defaults), commits to a color strategy, kills cliché patterns, and runs an audit -> polish pass. Trigger on "make it look better", "less generic", "design critique", "polish the UI", "pick fonts/colors", "this looks like AI slop".
allowed-tools: Read, Grep, Glob, Bash
---
<!-- Adapted (text only, no scripts) from Impeccable — https://github.com/pbakaus/impeccable — Apache-2.0,
     (c) 2025 Paul Bakaus; itself derived from Anthropic's frontend-design skill (Apache-2.0, (c) Anthropic)
     and ehmo/typecraft-guide-skill. Modified for the VibeGod Tech Team pipeline. -->

# Design Refinement — distinctive, not generic

The default output of an AI frontend is generic: a centered rounded card on a flat background, one
timid accent, a system/Inter font, gentle whitespace. This skill exists to break that. Pairs with
`frontend-craft` (the doctrine) and is run via `/polish`. User > skills > default.

## Fits in the pipeline
Stage 6 (design + build) and a `/polish` pass at Stage 7 **before** the `ux-design-reviewer`
visual gate. The designer/engineer run it; the reviewer then audits.

## The slop test (the bar)
If someone could glance at it and say **"AI made that"** without hesitation, it failed. The target:
a viewer asks *"how was this made?"*, never *"which AI made this?"* Restraint **without intent** now
reads as mediocre, not refined.

## Pick the register first (brand vs product)
- **Brand** (design IS the product: landing/marketing/portfolio/campaign): the bar is
  **distinctiveness** — POV, risk, committed scale, real imagery. Go big.
- **Product** (design SERVES the product: app UI, dashboards, tools): the bar is **earned
  familiarity** — a fluent Linear/Figma/Notion/Raycast/Stripe user should trust it. Distinctive but
  calm; "bolder" = stronger hierarchy + one sharper accent + more committed density, NOT theatrics.
Name the register before making moves; they diverge on almost every decision.

## Typography — the highest-leverage lever
Real fonts move the needle more than color. **Procedure, every project, never skipped:**
1. Write **three concrete brand-voice words** — physical-object words ("warm, mechanical,
   opinionated"), not "modern/elegant".
2. List the 3 fonts you'd reach for by reflex. If any are on the **reflex-reject list**, drop them —
   they're training-data defaults that create monoculture.
3. Browse a **real catalog** (Google Fonts, Fontsource, Pangram Pangram, Future Fonts, Klim,
   Velvetyne) with those words in mind; pick the font for the brand-as-physical-object.
4. Cross-check: "elegant" ≠ serif, "technical" ≠ sans, "warm" ≠ Fraunces. If the final pick matches
   the original reflex, start over.
- **Reflex-reject fonts (greenfield):** Inter · DM Sans · DM Serif · Plus Jakarta Sans · Outfit ·
  Instrument Sans/Serif · Space Grotesk · Space Mono · IBM Plex (any) · Fraunces · Newsreader · Lora ·
  Crimson (any) · Playfair Display · Cormorant (any) · Syne. (Identity-preservation wins on an
  existing brand that already ships one of these — the list is for new decisions.)
- **Reflex-reject aesthetic lane:** "editorial-typographic" (display-serif italic + tiny mono labels +
  ruled separators + monochrome) unless the brief is *literally* a magazine. It has flooded brand
  surfaces — it's the trap one tier past picking Fraunces.
- **Load fonts for real** (Fontsource/`next/font`/Google Fonts) — do NOT fall back to the system
  stack. Modular scale, fluid `clamp()` headings, **≥1.25 ratio** (flat 1.1× scales read uncommitted).
  Light-on-dark: add 0.05–0.1 to line-height. A single committed family with strong weight/size
  contrast beats a timid display+body pair.

## Color — commit
- **Name a real reference before picking a strategy** ("Stripe purple-on-white restraint", "Klim
  #ff4500 drench", "Mailchimp yellow full palette"). Unnamed ambition becomes beige.
- Palette IS voice. Let **one color own ~60%**; sharp high-contrast accents over a timid even spread.
- **Tinted neutrals**, never pure gray / pure black / pure white. (OKLCH makes consistent ramps easy.)
- Don't converge across projects; if the last surface was restrained-on-cream, this one isn't.

## Anti-cliché blocklist (these scream "AI made it")
- Purple→blue (or cyan→purple) gradients; **gradient text on metrics**; neon accents on dark.
- **Glassmorphism** as a default; generic drop shadows on rounded-rect cards.
- The **centered-card hero on a flat void**; nested cards (a card inside a card inside a card).
- **Gray text on a colored background**; all-caps body copy.
- **Tiny uppercase tracked "eyebrow" labels above every section** (AI scaffolding) — one strong
  kicker can be voice; repeating it as section grammar is slop.
- **A large rounded icon tile above every heading**; emoji used as product icons.
- **Scroll-fade-rise on every section** (the saturated "bolder" default — the opposite of bold).
- Default Tailwind blue (`#3b82f6`) / default shadcn slate left untouched as if it were a decision.
- Zero imagery on an image-led brief (restaurant/hotel/travel/fashion/product) — a colored block
  where a hero photo belongs is a bug, not restraint.

## Bolder vs quieter
- **Bolder** = stronger hierarchy (3–5× size jumps, 900 vs 200 weights), one committed dominant
  color, asymmetry/break-the-grid, ONE signature page-load moment — NOT more effects.
- **Quieter** = remove decoration, tighten the scale, let type + space carry it.
Either way: distinctive ≠ chaotic; readability and a coherent system are non-negotiable.

## Design boldly first, audit accessibility AFTER (important)
Reminding the model about a11y *during the creative pass* makes it underdesign into safe, timid
output. So: make the distinctive design first; then run the **accessibility audit** at review time
(`accessibility-wcag` + the `ux-design-reviewer`). Never SHIP inaccessible — but don't let a11y
anxiety flatten the design before it exists.

## The /polish workflow (audit -> fix -> re-check)
1. **Audit** against this list + `ui-ux-excellence` (typography, color, spacing/hierarchy, motion,
   the cliché blocklist). Score the gaps; cite exact files/lines.
2. **Fix** the highest-impact gaps (route to the `frontend-engineer`); re-name the aesthetic if it's
   drifting toward the modal/category default.
3. **Re-run** the `ux-design-reviewer` visual gate (`/ux-check`) + the a11y audit. Loop until it
   passes the slop test AND the broken-UI/contrast checks.

## Honest limits
A component system (Tailwind + shadcn) and generators have their OWN recognizable house style.
Distinctiveness still comes from the committed font + color + reference choices above — the tooling
just removes the hand-rolled-CSS tells. There is no "make it unique" button.
