---
name: test-automation
description: Use when authoring, shaping, or hardening automated tests and CI test infrastructure — the test pyramid (unit/integration/contract/E2E), headless runners, test data and doubles, consumer-driven contracts, flaky-test detection/quarantine, and the green-build gate that backs QA. Trigger on "add tests", "set up CI tests", "this test is flaky", "contract test", "e2e/visual/regression automation", or "why is the suite slow/red".
allowed-tools: Read, Grep, Glob, Bash
---

# Test Automation (SDET)

Own the automated test portfolio and the CI that runs it, so the QA gate is fast, deterministic,
and repeatable. This is SDET craft — it backs `qa-engineer`'s functional judgment with reliable
automation; it never replaces it. Honor `${CLAUDE_PLUGIN_ROOT}/skills/_shared/vibegod-principles.md`.
Priority: **user > skills > default behavior** — the user can always override.

## Fits in the pipeline
- **Stage 6 (Build):** the test scaffolding that makes TDD real — fast unit/contract suites devs
  run on every change, plus the staged secondary build for integration/E2E.
- **Stage 7 (Per-feature QA gate):** supplies the deterministic automated coverage of critical
  paths that `qa-engineer` signs the functional lens against. The gate is only as trustworthy as
  the suite under it — keep it green, fast, and flake-free.
- **Stage 8 (Ship gate):** green-build sign-off and critical-journey coverage status as a hard
  release blocker.

## Best practices
**Pyramid shape (not an ice-cream cone)**
- Many unit, fewer integration, very few E2E — target ~**70% unit / 20% integration / 10% E2E**
  as a starting balance.
- If a higher-level test fails and **no lower-level test fails**, write the missing lower-level
  test — push tests *down* the pyramid.
- Higher-level tests cover only what lower levels cannot; delete redundant high-level tests for
  logic already covered below.

**Unit layer**
- Test the **public interface / observable behavior** — never private methods or implementation
  details. The urge to test a private method is a design smell: refactor instead.
- Don't test trivial code (getters/setters); don't chase 100% coverage as a goal.
- Each unit test runs **<100ms**, asserts one condition, and is structured Arrange-Act-Assert /
  Given-When-Then.

**Integration & contract layer**
- Test **one integration point at a time**, replacing other externals with test doubles.
- Run dependencies **locally / against a dedicated test instance** — never a real third-party or
  production system.
- Use **consumer-driven contract tests** (e.g., Pact): consumers publish expectations; providers
  run them in their pipeline to catch breaking changes before release.

**E2E layer**
- Cover **only core user journeys** that define product value — not edge cases (those belong
  lower in the pyramid).
- Run UI tests **headless**; assume false positives and plan for them.

**Determinism**
- Every test runs **independently** of other tests and of execution order; reset/clean test data
  between runs — no shared global state (e.g. shared `/tmp` files).
- Eliminate timing flakiness with **explicit synchronization** (wait for state), never fixed sleeps.

**Flaky-test management**
- **Detect** statistically: rerun N times, track pass-rate; a test that fails then passes
  unchanged is flaky.
- **Quarantine** identified flaky tests out of the blocking CI path so they can't block
  submissions — but keep tracking them for coverage and ticket them the same cycle.
- A flaky failure rooted in **production code is a bug**, not test noise.

**CI integration**
- **Every push to mainline triggers a build** that runs the tests automatically (self-testing build).
- Keep the **commit build ≤10 minutes** — fast unit/contract first; slow integration/E2E in a
  staged secondary build.
- Any failing test fails the build — **99.9% green is still red**; a broken build is the team's
  top-priority fix (revert-first).

## Guardrails
**MUST enforce**
- The suite MUST keep pyramid shape — reject changes that add E2E coverage where a unit or
  integration test would suffice.
- Any failing test MUST block the merge/release — no partial-green gates.
- New flaky tests MUST be quarantined AND ticketed within the same cycle, never silently ignored.
- Test environments MUST mirror production (same DB / OS / library versions).

**MUST NEVER**
- NEVER hit a real production system or live third-party service from automated tests.
- NEVER mask flakiness by blanket-rerunning all tests — rerun is only for *identified* flaky
  tests, and a flaky failure rooted in product code is a bug to fix.
- NEVER test private methods or implementation details — refactor the design instead.
- NEVER let the commit build creep past ~10 minutes or let a red build sit unaddressed.
- NEVER make 100% coverage the goal; NEVER write order-dependent or shared-state tests.
- NEVER substitute automation for functional QA judgment — `qa-engineer` owns the verdict; this
  skill makes that verdict fast, deterministic, and repeatable.

## Sources
- https://martinfowler.com/articles/practical-test-pyramid.html
- https://martinfowler.com/bliki/TestPyramid.html
- https://martinfowler.com/articles/continuousIntegration.html
- https://martinfowler.com/bliki/ContractTest.html
- https://martinfowler.com/articles/consumerDrivenContracts.html
- https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html
- https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html
- https://testing.googleblog.com/2017/04/where-do-our-flaky-tests-come-from.html
