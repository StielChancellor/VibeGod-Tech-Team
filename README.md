# God-Mode SDE

> **One plugin that drops an entire software company into Claude Code** — product managers,
> designers, architects, engineers, security, QA, and release crew — so you can vibe-code an idea
> into a real, enterprise-grade platform without it falling apart at scale.

Install it, describe what you want to build, and a lead orchestrator walks you through the whole
thing the way a top engineering org actually works: plan it, design it, cost it, build it, test it
from every angle, and ship it — pausing for your **go / no-go** at each step. Security (OWASP) and
accessibility (WCAG) are baked in, so you don't have to know about them to get them.

---

## The problem this solves (if you've vibe-coded, you've felt this)

You can get a slick prototype in an afternoon. Then reality hits:

- 😬 **It works on the demo, breaks in the real world** — no edge cases, no error handling, no tests.
- 🔓 **Security holes you can't see** — exposed secrets, injection, broken auth. You find out the bad way.
- ♿ **Unusable for half your users** — no keyboard support, bad contrast, no screen-reader labels.
- 🎨 **It looks "AI-generated"** — the same purple-gradient, Inter-font, centered-card template as everyone else.
- 🍝 **Spaghetti at scale** — change one thing, three others break, nothing is wired end-to-end.
- 🤷 **No plan, no structure** — the AI jumps straight to code and you're left holding the mess.

**God-Mode SDE fixes the root cause:** instead of one assistant guessing, you get a *coordinated
team* that refuses to skip the steps a real company never skips.

## Why it's different

- 🏢 **A whole org, not a single bot.** 27 specialists, each with one job, handing off to each other.
- 🚦 **It never jumps straight to code.** A gated pipeline keeps you in control with a checkpoint at every stage.
- 🛡️ **Security & accessibility are automatic**, not an afterthought — enforced at build *and* review.
- 🎨 **Anti "AI-slop" design** built in — real fonts, a committed color story, distinctive UI by default.
- 🧱 **End-to-end consistency** — every change flows through the whole stack with *no orphans left behind*.
- 💸 **Cost-aware by default** — every tech choice shows the price tag *and* a cheaper alternative.
- 🤖 **Self-checking** — a dedicated agent tries to prove the team's own conclusions *wrong* before you see them.

---

## How it works: one plugin = a complete company

You talk to **one coordinator** (the `sde-orchestrator`). Under the hood it runs a real product
org — **27 specialist agents across 11 departments**, each staying in its lane and collaborating
through explicit hand-offs:

### 🧭 Product team
Turns your idea into a clear plan — requirements, user research, and the metrics that prove it worked.
*(product-manager, ux-researcher, analytics-engineer)*

### 🎨 Design team
Owns how it looks and feels — user journeys, screens, components, fonts, color, motion — and reviews
every built screen across all device sizes so nothing ships broken.
*(ui-ux-designer, ux-design-reviewer)*

### 🏛️ Architecture & Tech-lead
Designs the system, picks the stack with real cost numbers + a cheaper option, and sets the
security blueprint before a line of code is written.
*(solution-architect, tech-lead, security-architect)*

### 🛠️ Engineering team
Builds it for real — frontend, backend, data, AI/agents, login & multi-tenant access, integrations,
and the deploy/infra pipeline.
*(frontend-engineer, backend-engineer, data-engineer, ai-agent-engineer, identity-access-engineer,
integration-engineer, devops-sre)*

### 🔍 Quality team
Tries to break every feature from four angles in parallel — functional, code-quality, adversarial
edge-cases, performance — backed by real automated tests, plus a verifier that catches confident mistakes.
*(qa-engineer, adversarial-tester, code-quality-reviewer, test-automation-engineer,
performance-engineer, claim-verifier)*

### 🔐 Security & Compliance
Hunts OWASP-class vulnerabilities in the code and handles the serious stuff (SOC 2, GDPR, HIPAA,
PCI, accessibility conformance) when your product needs it.
*(security-engineer, compliance-grc)*

### 🚀 Delivery, Release & Ops
Keeps the program on track, runs the go/no-go call, ships with safe staged rollouts, and runs the
incident response if something breaks in production.
*(delivery-manager, release-manager, incident-manager)*

### 📚 Documentation
Writes the guides, API references, and runbooks so the thing you built can actually be used and maintained.
*(technical-writer)*

### The pipeline (you approve every ◆ gate)

```
Discover → PRD → User Journey → Stack & Cost → Modules → Security Review
   → Foundation-first Build → Per-feature QA (4 lenses in parallel) → UAT & Smoke
   → Compliance / Performance / Docs gates → Release & Launch readiness → Operate
```

Any change you ask for re-enters at the planning stage and propagates cleanly through the whole
stack — so the system never drifts out of sync.

---

## Everything the swarm takes care of — so you don't have to

| Area | What you get, automatically |
|------|------------------------------|
| 📋 **Planning** | A real PRD from your idea, user journeys, and a modular design — before any code. |
| 💸 **Smart tech choices** | The right stack with implementation + running cost, always with a cheaper alternative and the trade-offs. |
| 🎨 **Standout design** | Real loaded fonts (no generic defaults), a committed color scheme, distinctive UI — audited against an "AI-slop" checklist. |
| ♿ **Accessibility (WCAG 2.2 AA)** | Contrast, keyboard navigation, focus, screen-reader labels, reduced-motion — checked at review. |
| 🛡️ **Security (OWASP)** | Threat modeling, secure coding, injection/secret/auth checks — at design, build, and review. |
| 🔑 **Auth & multi-tenant** | Login, SSO, roles/permissions, and tenant isolation done the safe, standard way. |
| 🔌 **APIs & integrations** | Versioned API contracts, reliable webhooks, and resilient third-party connections. |
| 🧪 **Testing done right** | TDD, the test pyramid, automated CI tests, and flaky-test handling. |
| 🔍 **Multi-angle QA** | Every feature attacked from four lenses in parallel; nothing closes until they all pass. |
| 🧱 **No-orphans guarantee** | Every change flows DB → API → UI → every call site → docs → tests. No half-wired features. |
| 📈 **Measurable** | A tracking plan and dashboards tied to your success metrics, so you can see if it worked. |
| 🚀 **Safe shipping** | Launch-readiness checklist, staged/canary rollout, versioning, and release notes. |
| 🛟 **When things break** | Incident command, mitigate-first response, and blameless postmortems. |
| 📚 **Real docs** | User guides, API reference, and runbooks written for you. |
| 🚧 **Runtime guardrails** | Best-effort hooks that block secrets-in-code and dangerous shell commands (a safety net, not a hard boundary). |
| ⚖️ **Right-sized process** | A triage step so a typo doesn't pay the full enterprise tax, while risky changes get the whole pipeline. |

**By the numbers:** 27 specialist agents · 50 skills · 23 commands · 11 departments · 1 coordinator.

---

## Install & use (Claude Code)

```
/plugin marketplace add StielChancellor/God-Mode-VibeSDE
/plugin install god-mode-sde@vibe-fde
```

⚠️ That's the whole install. Don't copy the plugin files by hand — it breaks the plugin. Always use
the two commands above, then start a fresh session.

Then just describe what you want to build, or jump in with a command:

`/kickoff` (start here) · `/triage` · `/prd` · `/journey` · `/stack-and-cost` · `/module-map` ·
`/design-review` · `/build-plan` · `/build` · `/feature-check` · `/ux-check` · `/polish` ·
`/ship-check` · `/compliance-check` · `/perf-check` · `/docs-check` · `/release` ·
`/launch-readiness` · `/change-request` · `/raid` · `/incident` · `/ingest-scan` · `/graph`

---

## 🙏 Credits & thanks

God-Mode SDE stands on the shoulders of these open-source projects. Huge thanks to their authors —
please give their repos a star:

- **superpowers** — Jesse Vincent ([@obra](https://github.com/obra)) · https://github.com/obra/superpowers
  — the battle-tested methodology skills (TDD, systematic debugging, planning, code review,
  parallel-agent dispatch, git worktrees, verification).
- **graphify** — Safi Shamsi · https://github.com/safishamsi/graphify
  — optional codebase knowledge-graph for real cross-module impact analysis.
- **Impeccable** — Paul Bakaus ([@pbakaus](https://github.com/pbakaus)) · https://github.com/pbakaus/impeccable
  — the design-steering ideas behind the anti "AI-slop" `design-refinement` skill. Impeccable itself
  builds on **Anthropic's `frontend-design` skill** and **[ehmo/typecraft-guide-skill](https://github.com/ehmo/typecraft-guide-skill)**.
- **andrej-karpathy-skills** — https://github.com/multica-ai/andrej-karpathy-skills
  — behavioral coding guidelines woven into the shared operating principles.

Full notices and licenses are preserved in [`ATTRIBUTION.md`](ATTRIBUTION.md). Every bundled source
was security-scanned before inclusion (see [`ingest/reports/`](ingest/reports/)).

---

## 🤝 Contributing

**Contributions are very welcome — this project is open for contribution.** Found a bug, have an
idea, or improved something? Please open an issue or a pull request. Improvements to the agents,
skills, and pipeline are exactly what makes the team stronger.

---

## ⚖️ License

This is **source-available, not a free-for-all** — see [`LICENSE`](LICENSE) for the exact terms. In plain English:

- ✅ **Personal & non-commercial use is free.** Use it, learn from it, build your own projects with it.
- 💼 **Commercial use is allowed — but you must give visible credit** to the author (ITCHL) with a link back to this repo.
- 🔁 **Changed the code? Contribute it back.** Any modification to this project's code must be submitted as a pull request to this repository.
- 🚫 **No rebranding / reselling it as your own** product without permission.

> **Note on bundled parts:** the third-party skills listed in **Credits** keep their original
> open-source licenses (MIT / Apache-2.0) as noted in [`ATTRIBUTION.md`](ATTRIBUTION.md) — those
> rights are unaffected. The terms above cover the original God-Mode SDE work.
>
> This is a custom, source-available license (not an OSI-approved one). If you need different terms
> for a commercial arrangement, open an issue.
