---
name: engineering-excellence
description: Apply how high-performing engineering teams (Google/SRE/DORA) actually work — design docs & design review, code-review standards (small CLs, fast SLAs, improve-code-health), the test pyramid & test sizes, trunk-based development + CI, DORA delivery metrics, SRE SLOs/error budgets/blameless postmortems, secure SDLC (NIST SSDF), and AI-era harness engineering. Use during design review, planning delivery, setting team standards, code review, release/CI-CD decisions, reliability work, or whenever asked "how should we work" / "what's best practice".
allowed-tools: Read, Grep, Glob, Bash
---

# Engineering Excellence — how top engineering teams operate

The standards a Google/Anthropic-grade team holds. Backs `solution-architect`, `devops-sre`,
the code-review skills, and the QA lenses. Honors vibegod-principles; user > skills > default.

## Fits in the pipeline
Stage 2/4 (design review), Stage 5 (build plan), Stage 6 (build/CI), Stage 7-8 (review, QA,
ship, reliability). Continuous.

## Code review (Google eng-practices)
- **Approve once the change definitely improves overall code health — even if imperfect.** Block
  on degradation, not on perfection. Prefix optional polish with `Nit:`.
- Reviewers check, in order: **design → functionality → complexity (over-engineered?) → tests →
  naming → comments (explain *why*) → style → docs.** If you can't understand it, ask before approving.
- **Small CLs/PRs:** one logical change; ~100 lines good, ~1000 too large. A PR may be rejected
  solely for being too big. "Write CLs smaller than you think you need."
- **Review SLA ≤ 1 business day** to respond. "LGTM with comments" when remaining notes are minor.
- Automated checks (CI/lint/format) run **before** human review so humans spend effort on design/correctness.
- Source: https://google.github.io/eng-practices/

## Design docs & design review
- Write a **design doc before coding** any non-trivial system: strategy, key decisions, and the
  **trade-offs considered (alternatives + why rejected)**. Decide by cost/benefit; skip for trivial work.
- Review async on the doc; formal design-review meeting for high-impact designs. Sign-off is a gate.
- Source: https://www.industrialempathy.com/posts/design-docs-at-google/

## Testing
- **Pyramid ≈ 70% unit / 20% integration / 10% e2e.** Classify by **size**: small (in-process, no
  I/O — fast/deterministic) / medium (localhost) / large (multi-machine/e2e).
- **Minimize e2e** (slow, flaky, hard to localize) — reserve for critical journeys. **Flakiness is a
  defect** — quarantine/fix, don't tolerate. Coverage guides, it doesn't define done.
- Sources: https://testing.googleblog.com/2010/12/test-sizes.html ·
  https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html ·
  https://martinfowler.com/articles/practical-test-pyramid.html

## Trunk-based development & CI
- Develop on trunk; integrate at least **daily**. Branches are **short-lived (≤ ~2 days)**, for
  review+CI only. Use **feature flags / branch-by-abstraction** to merge incomplete work and
  decouple deploy from release. **Keep the build green** — a red trunk is stop-the-line.
- Source: https://trunkbaseddevelopment.com/

## DORA delivery metrics (target elite)
- Track the four keys: **deployment frequency, change lead time, change fail rate, failed-deploy
  recovery time** (+ reliability). Throughput and stability rise together — not a trade-off.
- Elite benchmarks (2021): deploy on-demand; lead time < 1 day; change-fail ~0–15%; restore < 1 hr.
- Source: https://dora.dev/guides/dora-metrics-four-keys/

## SRE / reliability
- Define **SLIs**, set **SLOs**; **error budget = 1 − SLO.** Enforce an **error-budget policy**:
  budget exhausted → freeze risky launches, redirect to reliability.
- **Blameless postmortems** on systemic causes (mandatory when one incident burns >20% of the
  4-week budget). Cap and reduce **toil**; engineer on-call for sustainability.
- Sources: https://sre.google/sre-book/ · https://sre.google/workbook/error-budget-policy/

## Secure SDLC (shift-left)
- Adopt **NIST SSDF (SP 800-218)** outcomes: Prepare Org, Protect Software, Produce Well-Secured
  Software, Respond to Vulnerabilities. SAST/DAST/SCA + secret-scanning in CI; threat-model at
  design and on significant change; sign/verify artifacts. Benchmark with OWASP SAMM.
- Sources: https://csrc.nist.gov/pubs/sp/800/218/final · https://owaspsamm.org/

## AI-era harness engineering
- Humans stay **on the loop** (a human owns the merge button). **Spec-first**: prompts/specs are
  versioned artifacts. Wrap agents in **feedforward guardrails** + **feedback sensors** (tests, CI,
  lint) so they self-correct. Keep small CLs, strong tests, and human review as the safety net.
- Source: https://martinfowler.com/articles/harness-engineering.html
