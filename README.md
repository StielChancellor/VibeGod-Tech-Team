# VibeGod Tech Team

> Install one plugin and a **whole software company** shows up inside Claude Code — product, design,
> security, engineering, QA, and release — and turns your idea into a real, production-grade platform.
> **You approve. The team does the work.**

---

## Who it's for

Two kinds of people, one problem: **the idea (or the skill) is there — the rest of the team isn't.**

- 🚀 **You have the vision, not the team.** You can describe a great product, or vibe-code a prototype —
  but you're not a security engineer *and* a designer *and* a DBA *and* an SRE all at once. VibeGod Tech Team
  **is** that team. It turns *"I have an idea"* into shipped software without you needing every expertise.
- 🧑‍💻 **You're already a strong coder.** You ship fast solo — but solo means no design review, no threat
  model, no QA swarm, no release process. This wraps a senior org around you and turns your pro skills
  into **god mode**.

**The gap it closes:** real software isn't just code. It's requirements, UX, architecture, security,
accessibility, tests, performance, docs, and a safe release. Doing all of that alone is why most
prototypes never become products. This brings the whole org.

## What you get

- 🏢 **A coordinated expert team**, not a lone assistant — it plans → designs → builds → tests → ships.
- 🛡️ **Security (OWASP) & accessibility (WCAG 2.2 AA) automatic** — built into build *and* review, not bolted on.
- 🎨 **Design that isn't "AI slop"** — real fonts, a committed color story, distinctive UI by default.
- 🧱 **End-to-end consistency** — every change flows DB → API → UI → docs with *no orphans left behind*.
- 💸 **Cost-aware** — every tech choice shows the price tag *and* a cheaper alternative.
- 🔍 **Self-checking** — a verifier agent tries to prove the team's own conclusions wrong before you see them.
- 🚦 **You stay in control** — it never jumps straight to code, and pauses at every decision gate for your yes.

**The org, by department:** Product · Design · Architecture · Engineering · Quality · Security & Compliance · Delivery/Release/Ops · Docs.

## How it works — install it, and the team just runs

Here's the part that matters: **once it's live, you don't manage anyone.**

Describe what you want, and the **right specialist activates itself** — mention anything security-related
and the security expert wakes up; talk about the database and the data engineer steps in. **Each agent
carries the distilled knowledge of a senior expert in that exact field** — not a generalist guessing, but
real vertical-specific know-how. As the work moves, **they hand off to each other**, and a **project
manager oversees the whole thing**. The flow just happens. Your only job: **approve at each ◆ gate.**

**Under the hood:** 27 specialists · 11 departments · 50 skills · 23 commands · **1 coordinator** you talk to.

The gated flow (you approve every ◆; any change re-enters at the PRD and propagates cleanly downstream):

```
Discover → PRD → Journey → Stack & Cost → Modules → Security review
   → Build → Per-feature QA (4 lenses in parallel) → UAT & Smoke
   → Compliance / Performance / Docs → Release → Operate
```

## Using it (once it's installed)

Just talk to it in plain English — nothing to memorize:

> 💬 *"use vibegod-tech-team to build a booking app for a yoga studio — members sign up, book classes, pay online"*
>
> 💬 *"use vibegod-tech-team to add Stripe checkout to this existing app"*  — mid-project; it re-plans and wires it through cleanly
>
> 💬 *"ask the security-architect to review this auth flow"*  — summon a specialist whenever you want

It plans *with* you and stops at each gate for approval. Prefer commands? `/kickoff` starts a new build
(full list near the end).

## Quick start (cheat-sheet)

- ✅ **Already installed?** Just type `use vibegod-tech-team to …`, or run `/kickoff`. That's it.
- ⬇️ **Not installed yet?** Run the one-liner for your setup (below), restart, then talk to it.

## Install — pick your setup

`/plugin` only exists in some Claude surfaces, so pick yours. **Rule of thumb:** any `/plugin …` command
has a terminal twin — prefix it with `claude` (e.g. `claude plugin install …`). Everything lives in
`~/.claude/`, shared across surfaces.

**🖥️ Terminal (Claude Code CLI)**
```text
/plugin marketplace add StielChancellor/VibeGod-Tech-Team
/plugin install vibegod-tech-team@vibegod
```

**🧩 VS Code (extension)** — type `/plugins` to open the plugin manager → add `StielChancellor/VibeGod-Tech-Team`
→ install `vibegod-tech-team`. (Or use the integrated terminal with the commands above.)

**🧠 JetBrains & other IDEs** — open the integrated terminal:
```text
claude plugin marketplace add StielChancellor/VibeGod-Tech-Team
claude plugin install vibegod-tech-team@vibegod
```

**💻 Claude Desktop app** — `/plugin` isn't available in the chat, so use the one-line installer (run in a
terminal, *or* paste it into the Desktop chat and say *"run this"*):

Windows (PowerShell):
```powershell
irm https://raw.githubusercontent.com/StielChancellor/VibeGod-Tech-Team/main/install.ps1 | iex
```
macOS / Linux (Terminal):
```bash
curl -fsSL https://raw.githubusercontent.com/StielChancellor/VibeGod-Tech-Team/main/install.sh | bash
```
It finds your Claude CLI (installs it via `npm` if missing), adds the marketplace, installs the plugin,
and leaves it **off by default** (token-safe). Restart Desktop after.

**Update / uninstall** — from the same surface you installed in:
```text
/plugin update vibegod-tech-team@vibegod       # terminal/Desktop:  claude plugin update vibegod-tech-team@vibegod
/plugin uninstall vibegod-tech-team@vibegod    # terminal/Desktop:  claude plugin uninstall vibegod-tech-team@vibegod
```

> ⚠️ Never copy the plugin files by hand — always use the commands above, then start a fresh session.

## Save tokens — turn it on only where you need it

The team is powerful but not free: while **enabled**, it adds **~9.5k tokens to every session** (the skills
stay "on call"). **Disabled, it costs 0** — nothing loads. So keep it **off by default** and switch it on
per project:

```text
claude plugin disable vibegod-tech-team@vibegod --scope user      # OFF everywhere by default
claude plugin enable  vibegod-tech-team@vibegod --scope project   # ON for just this project (run inside it)
```

(In the terminal / VS Code you can also use `/plugin enable|disable`.) Changes apply on the next session —
**restart** after. Check with `claude plugin list` (`✔ enabled` / `✘ disabled`).

## Languages & platform

- **Languages:** TypeScript/JS, Python, Go, Rust, Java/Kotlin — idiomatic style, strict typing, boundary
  validation, and per-language security pitfalls.
- **Default web stack:** Tailwind v4 + shadcn/ui (Radix) + **real loaded fonts** — re-themed tokens and a
  committed color strategy; **no** default-blue / Inter / system-font "AI slop."
- **Quality bar everywhere:** TDD and the test pyramid, **OWASP** security and **WCAG 2.2 AA** accessibility
  in build *and* review, and cost-aware stack choices.
- **Runtime guardrails:** best-effort hooks block secrets-in-code and dangerous shell commands (a safety
  net, not a hard boundary — fail-open). Soften to warnings with `VIBEGOD_GUARDRAILS=advisory`.

## Meet the team — and when each wakes up

**You rarely call anyone by name.** Describe the work and the relevant expert self-activates, hands off to
the next as the job moves, while the **project manager keeps it on track** and brings you the decisions.
The eight teams:

- **Product** — turns your idea into a clear PRD, user research, and success metrics.
- **Design** — journeys, screens, fonts, color, motion; reviews every build across screen sizes.
- **Architecture** — system blueprint, module contracts, and the security design *up front*.
- **Engineering** — frontend, backend, data, AI/agents, auth & multi-tenant, integrations, infra.
- **Quality** — four parallel lenses (functional · code-quality · adversarial · performance) + a
  claim-verifier that catches confident-but-wrong conclusions.
- **Security & Compliance** — OWASP code review + SOC 2 / GDPR / HIPAA / PCI when you need it.
- **Delivery / Release / Ops** — keeps the program on track, ships with safe rollouts, runs incidents.
- **Docs** — guides, API reference, and runbooks.

You *can* still summon a specialist directly, e.g.:
- *"have the security-architect threat-model this"*
- *"ask the tech-lead what this stack costs to run"*
- *"get the ui-ux-designer to make this screen less generic"*
- *"will this scale? ask the performance-engineer"*
- *"production's down — run an incident"*
- *"have the claim-verifier double-check that's really fixed"*

## Commands

`/kickoff` · `/triage` · `/prd` · `/journey` · `/stack-and-cost` · `/module-map` · `/design-review` ·
`/build-plan` · `/build` · `/feature-check` · `/ux-check` · `/polish` · `/ship-check` ·
`/compliance-check` · `/perf-check` · `/docs-check` · `/release` · `/launch-readiness` ·
`/change-request` · `/raid` · `/incident` · `/ingest-scan` · `/graph`

## 🙏 Credits & acknowledgements

Built on the shoulders of these open-source projects — please give them a star:

- **superpowers** — Jesse Vincent ([@obra](https://github.com/obra)) · https://github.com/obra/superpowers
  — the methodology skills (TDD, systematic debugging, planning, code review, parallel agents, worktrees, verification).
- **graphify** — Safi Shamsi · https://github.com/safishamsi/graphify — optional codebase knowledge-graph for impact analysis.
- **Impeccable** — Paul Bakaus ([@pbakaus](https://github.com/pbakaus)) · https://github.com/pbakaus/impeccable
  — the anti "AI-slop" design ideas (itself building on **Anthropic's `frontend-design` skill** and **[ehmo/typecraft-guide-skill](https://github.com/ehmo/typecraft-guide-skill)**).
- **andrej-karpathy-skills** — https://github.com/multica-ai/andrej-karpathy-skills — behavioral coding guidelines.

Full notices in [`ATTRIBUTION.md`](ATTRIBUTION.md); every bundled source was security-scanned before inclusion.

## 🤝 Contributing

Open to contribution — issues and PRs welcome. Improvements to the agents, skills, and pipeline are
exactly what makes the team stronger.

## ⚖️ License

Source-available — see [`LICENSE`](LICENSE). In plain English:

- ✅ **Personal & non-commercial use is free.**
- 💼 **Commercial use is allowed — with visible credit** to the author and a link back to this repo.
- 🔁 **Changed the code? Contribute it back** as a pull request.
- 🚫 **No rebranding / reselling it as your own.**

Bundled third-party skills keep their original MIT / Apache-2.0 licenses (see [`ATTRIBUTION.md`](ATTRIBUTION.md)).
Custom, source-available license (not OSI-approved); open an issue for other commercial terms.
