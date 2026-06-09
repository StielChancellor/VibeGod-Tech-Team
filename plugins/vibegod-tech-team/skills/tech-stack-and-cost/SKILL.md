---
name: tech-stack-and-cost
description: Use to design the technology stack for a product from its frontend, backend, UI/UX, and end outcome — and to attach implementation and run cost to every significant choice. Trigger on "what stack should we use", "pick the technologies", "how much will this cost to run", "is there a cheaper option". ALWAYS shows cost, and whenever a choice is expensive presents a cheaper alternative with pros/cons and exactly what is lost. Requires explicit cost sign-off before proceeding.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Tech Stack & Cost — design with the bill attached

Design the full stack to fit the actual requirements (FE + BE + UI/UX + end outcome + the NFRs
from `platform-blueprint`), and **never present a stack without its cost.** Cost-awareness is a
core principle (#9): a recommendation the user can't afford is a wrong recommendation.

## Fits in the pipeline
- **Stage 3** (`/stack-and-cost`). Input: approved PRD + journey + blueprint NFRs. Output: a
  signed-off stack and cost envelope that constrains Stage 4 (modules) and Stage 5 (build).
Owned by `solution-architect`.

## Rules
1. **Design from the requirement, not from fashion.** Choose each layer (frontend framework,
   backend runtime, data store, hosting/compute, queue/cache, auth, AI/LLM if any, CI/CD) by what
   the PRD and NFRs actually demand. Justify each choice against a specific requirement.
2. **Always show cost — implementation AND run.**
   - *Implementation cost:* relative build effort/time, team skill fit, integration risk.
   - *Run cost:* concrete monthly estimate at the design load (compute, storage, egress, managed
     services, per-request/LLM-token costs, licenses). State the assumptions and the load point.
3. **Expensive choice → mandatory cheaper alternative.** Whenever a choice is costly, present a
   cheaper option alongside it with **pros / cons AND exactly what is LOST** by going cheaper
   (performance, scale headroom, managed convenience, reliability, dev speed). Don't hide the
   tradeoff and don't pre-decide for the user.
4. **Explicit cost sign-off.** Do not proceed past this stage until the user confirms the cost.
   This is a hard gate.

## Output format
```
## Recommended stack
**Default web UI** (unless a requirement says otherwise): **Tailwind v4 + shadcn/ui (Radix) + real
fonts** (Fontsource / `next/font`) — free, accessible primitives, removes the hand-CSS "AI" tells;
re-theme the tokens (no default Tailwind blue / shadcn slate). See `frontend-craft` + `design-refinement`.

| Layer | Choice | Why (which requirement/NFR) | Impl cost | Run cost @ <load> |
|-------|--------|------------------------------|-----------|-------------------|

## Expensive decisions — alternatives
For each costly choice:
- Recommended: <X> — <run cost>. Pros: … Cons: …
- Cheaper alternative: <Y> — <run cost>. Pros: … Cons: …
  WHAT YOU LOSE going cheaper: <explicit list>.

## Total cost envelope
- Estimated monthly run cost: <range> at <load>, scaling to <…> at <peak>.
- Key cost drivers + assumptions stated.
- Biggest cost risk + how to cap it.
```

## Guardrails
- Estimate honestly with stated assumptions; never fabricate precise figures — give ranges and
  say what they depend on. Read pricing/usage facts before asserting them.
- A cheaper stack that fails an NFR isn't cheaper — say so, and tie the comparison back to the
  blueprint's targets.

## Gate
◆ The user finalizes/confirms cost before Stage 4. No module work begins until cost is signed off.
