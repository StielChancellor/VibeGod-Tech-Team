---
name: product-discovery
description: Apply how high-performing product teams work — continuous discovery, opportunity-solution trees, Amazon working-backwards / PR-FAQ specs, prioritization (RICE/ICE/MoSCoW/Kano/WSJF), goal-setting (OKRs, North Star, HEART, AARRR), outcome-based roadmaps, JTBD + usability testing + MVP, Cagan's four risks, empowered teams, and accessibility as a product duty. Use during discovery, PRD/brainstorm, prioritization, roadmapping, defining success metrics, validating an idea, or any change request — i.e. Stages 0/1/9 and whenever deciding WHAT to build and why.
allowed-tools: Read, Grep, Glob, Bash
---

# Product Discovery — how top product teams operate

Backs the `product-manager` agent and the PRD/brainstorm/change stages. Pairs with
`prd-authoring`, `platform-blueprint`, and `accessibility-wcag`. User > skills > default.

## Fits in the pipeline
Stage 0 (discover), Stage 1 (PRD/brainstorm), Stage 9 (change requests). Outcomes feed Stage 3+.

## Continuous discovery
- Interview customers **weekly and continuously** — never a one-time upfront phase. Discovery and
  delivery run in parallel (**dual-track**).
- Use **opportunity-solution trees**: a single controllable **outcome** at the root → **opportunities**
  (real customer needs/pains, gathered via story-based prompts "tell me about a time when…") →
  **solutions** → **assumption tests**. Limit WIP: one opportunity at a time; advance **~3 solutions**
  and compare by testing their riskiest assumptions, never one idea in isolation.
- Source: https://www.producttalk.org/opportunity-solution-trees/

## PRD / spec (working-backwards)
- Separate **problem from solution**; spend disproportionate effort on the problem. Include:
  problem/background, **target user (never "everyone")**, goals, **non-goals (explicit scope-out)**,
  **success metrics**, requirements, risks, open questions. Favor a tight **1-pager**.
- For new products/major bets, use **Amazon Working Backwards**: write the **fictional press release
  first** (customer POV) + an **FAQ** (external: how/price/support; internal: finance/legal/risk).
  Treat the PR-FAQ as a truth-seeking forcing function before committing engineering capacity.
- Sources: https://workingbackwards.com/concepts/working-backwards-pr-faq-process/ ·
  https://www.svpg.com/four-big-risks/

## Prioritization (pick the right frame)
- **RICE** = (Reach × Impact × Confidence) ÷ Effort — compare dissimilar ideas; scores are advisory.
- **ICE** — lighter quick triage. **MoSCoW** — release-scope alignment (Must/Should/Could/Won't).
- **Kano** — balance basics/performance/delighters. **WSJF** = Cost of Delay ÷ Duration — sequence
  under limited capacity. Source: https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/

## Goals & metrics
- **OKRs:** "I will [Objective] as measured by [Key Results]." ≤3–5 objectives, 3–5 measurable KRs;
  separate committed vs aspirational; decouple from comp. (https://www.whatmatters.com/faqs/okr-examples-and-how-to-write-them)
- **North Star:** one metric capturing the core "aha" value and leading revenue, with 3–5 input
  metrics. Avoid vanity (DAU) and pure-lagging NSMs. **HEART** (Happiness/Engagement/Adoption/
  Retention/Task-success via Goals→Signals→Metrics). **AARRR** funnel to find the bottleneck.
  Pair leading + lagging indicators. (https://amplitude.com/blog/product-north-star-metric)

## Roadmapping
- **Outcome/theme-based**, not dated feature lists. **Now / Next / Later** with decreasing certainty
  outward. The roadmap is the **output of discovery + prioritization**, not a wishlist.
- Source: https://www.svpg.com/the-art-of-the-product-roadmap/

## Validation (de-risk before building)
- **JTBD:** "When [situation], I want [motivation], so I can [outcome]." Frame around the job, not personas.
- **Usability test ~5 users**, realistic tasks, think-aloud, observe behavior not opinions.
- **MVP = smallest valuable + usable + feasible product.** Address **Cagan's 4 risks BEFORE building:**
  **value/desirability, usability, feasibility, business viability.** Discovery exists to kill these
  via prototypes, interviews, spikes, stakeholder review.
- Sources: https://www.nngroup.com/articles/usability-testing-101/ · https://www.svpg.com/four-big-risks/

## Working with engineering
- **Empowered teams:** give problems to solve, not feature lists. Hold to **outcomes, not output.**
  Bring engineers into discovery. Meet a **definition of ready** (clear problem, de-risked, acceptance
  criteria) and **slice work thin** before delivery. Source: https://www.svpg.com/empowered-product-teams/

## Accessibility as a product duty
- Build to **WCAG 2.2** (POUR: Perceivable/Operable/Understandable/Robust) from inception — retrofitting
  costs more. It benefits everyone and expands reach. See the `accessibility-wcag` skill.
- Source: https://www.w3.org/WAI/standards-guidelines/wcag/
