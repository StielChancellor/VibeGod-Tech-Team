<!-- VibeGod pipeline state — the persistent memory that lets a fresh session RESUME the pipeline
     instead of re-discovering it. Created by /kickoff, updated at every stage transition and gate.

     This file is a REAL RUN of the plugin against its own codebase, kept in the repo deliberately:
     until v0.20.0 the project had never once run its own persistent-memory mechanism, which is why a
     15-release gap in it went unnoticed. Every claim below carries the signal that proves it. -->

## GOAL (frozen at kickoff — do not edit; only flip acceptance-criteria [ ] -> [x])
Objective: the pipeline must stop the user on CONSEQUENCE rather than at every stage boundary — so the person paying for the work sets the boundary once and is interrupted only when it is genuinely crossed, instead of approving engineering artifacts they cannot meaningfully judge.
Acceptance criteria (machine-checkable; mark [x] ONLY with a claim-verifier-reproduced signal in `verified:` — proof, not self-report):
- [x] AC-1: work reaching an UNDECLARED payments / logins / personal-data surface stops the run — proof: `node ingest/test-hooks.mjs` guard-domain block reports ✓ — verified: reproduced 2026-08-03 at 46de9c3, suite 286 passed 0 failed
- [x] AC-2: the trigger stays QUIET on ordinary work (author.ts, healthcheck.ts, a stray "email") — proof: the guard-domain noise cases report ✓ — verified: reproduced 2026-08-03 at 46de9c3, suite 286 passed 0 failed
- [x] AC-3: the tier sets trigger sensitivity and may be moved in EITHER direction — proof: `change-risk-triage` SKILL.md carries the trigger-sensitivity matrix and the bidirectional override; `/triage` no longer says "override UP" — verified: reproduced 2026-08-03, `grep -c "EITHER direction"` returns 2 in the skill and 1 in the command
- [x] AC-4: the user types ~4 commands, and every other command still works if typed — proof: the orchestrator carries the four-command table; all 27 commands still validate — verified: reproduced 2026-08-03, `node ingest/validate.mjs` reports 27 commands, 0 errors
- [x] AC-5: a state file whose claims predate HEAD says so, unprompted — proof: `node ingest/test-hooks.mjs` cases "warns when state was verified at an older commit" and "silent when state matches HEAD" report ✓ — verified: reproduced 2026-08-03 at 46de9c3, suite 286 passed 0 failed
- [x] AC-6: no regression — proof: `node ingest/test-hooks.mjs` exits 0 and `node ingest/validate.mjs` reports 0 errors — verified: reproduced 2026-08-03 — 286 passed 0 failed; validator 0 errors 0 warnings
Hard constraints: zero runtime dependencies · fail-open on error · no new false-positive class · every command keeps working if typed · £0 ceiling
Non-goals: covering the shell path · making the four judgement triggers mechanical · an external user trial

## WHERE
Repo / branch: /home/i-main/projects/Hi-ITCHL/Vibe-FDE-Agent · main
Last verified against commit: 46de9c3 — re-verified at 286 passed / 0 failed
Install / run: `npm ci` (no deps) · Tests: `node ingest/test-hooks.mjs` · Expected: 286 passed, 0 failed
Pipeline docs: the stage model, the ◆ gates and the 4 safety gates are defined in the
`vibegod-orchestrator` skill — read it if any term here is unfamiliar.

## ENVELOPE (agreed at kickoff — the boundary the team works inside)
Cost ceiling: £0 over 12 months   <!-- covers BUILD + RUN; genuinely zero, see ledger -->
Sensitive domains: none — the hook inspects credential SHAPES in memory and stores or transmits nothing
Must ask before doing: relax any existing guard · add a runtime dependency · introduce a false-positive class
Interrupt appetite: only-expensive-or-risky
Interrupt above: any new dependency, or any change that could block legitimate work

## COST LEDGER
Window: 2026-08-03 → 2027-08-02
Committed: one-time=0 monthly=0
Remaining: £0 of £0 — at ceiling by design, which is the point of the constraint
2026-08-03 — no paid service — one-time=0 monthly=0 — why: a PreToolUse hook must run offline in every user's session; rejected a hosted secret-scanning API (adds latency, network dependency and cost to every write)

## STATUS
Stage: 8 — final QA / ship
Triage tier: standard   <!-- security-relevant change to an enforced guard -->
In flight: —
Blocked on: —

## DECISIONS
2026-08-03 — RE-BASELINE (Stage-9). Previous goal met; new objective is consequence gating — why: the critique found the gates were pitched at the wrong ALTITUDE, so the user was approving artifacts they could not judge while being the throughput bottleneck — ruled out: keeping stage gates and only rewording them (fixes comprehension, not throughput)
2026-08-03 — SELF-INFLICTED FINDING: this state file went FOUR releases stale (v0.21.1 → v0.24.0) while the README claimed every stage maintains it — why it happened: the wiring is per-COMMAND, and work done directly, outside a command, updates nothing and nobody notices — fixed by a SessionStart stale-state notice comparing the recorded commit to HEAD; ruled out: a hook that writes state itself (hooks block and instruct, they never author the record)
2026-08-03 — scan the RESULTING DOCUMENT and report only NEWLY-introduced secrets, rather than scanning the edit fragments — why: fragments cannot see a value split across two edits, and scanning the whole document without differencing would block every edit to a file that already contains a secret, making such a file unfixable — ruled out: catching a secret that was already on disk before this change (guard-commit is the net for that)
2026-08-03 — RE-BASELINE (Stage-9 change request). The previous goal was met, so notebooks moved from Non-goals into scope — why: running the pipeline on real work showed the frozen GOAL correctly caught this as drift, and that a met goal had NO mechanical path to re-baseline at all; the only escape was VIBEGOD_GUARDRAILS=advisory, which disables every guard including secret-blocking — ruled out: silently widening scope, and disabling the guardrails to do it
2026-08-03 — allow a GOAL change only once every criterion is [x] with reproduced evidence — why: goalpost-moving means changing the goal to AVOID meeting it; changing it after meeting it is starting the next piece of work, and the evidence gate is what makes that distinction checkable — ruled out: a dedicated re-baseline env var (a second bypass surface nobody would audit)
2026-08-03 — exempt test files by NAMING convention (`test-*`, `*_test`), not only by directory — why: running the guard against a real commit blocked this repo from committing `ingest/test-hooks.mjs`, the suite that proves the scanner works; a secret-scanner's own tests necessarily contain real-looking keys — ruled out: obfuscating the fixtures to dodge the scanner (makes the tests less readable and fights our own tooling), and an inline allow-comment (a new mechanism, and abusable)
2026-08-03 — reuse `applyToolEdit` from `_lib.mjs` rather than re-deriving the proposed content — why: it already models `replace_all` and literal `$&`, the divergence that caused a real bypass in v0.15.0 — ruled out: a second, subtly different simulator

## AUTOPILOT
Mode: off
Budget: iterations=0 stages=0
Spent: iterations=0 stages=0
Halt: —
Paused at: —
Pause reason: —
Pause timeout: 60m

## GATES PASSED
Stage 3 — cost approved (£0, zero-dependency constraint) — 2026-08-03 — evidence: COST LEDGER above
Stage 5 — approach approved (difference-based document scan) — 2026-08-03 — evidence: DECISIONS above
Stage 7 — lens sweep passed — 2026-08-03 — evidence: PER-FEATURE LENS STATUS below, every row carrying its signal

## OPEN HANDOVERS
<!-- maker -> checker -> owner — state (sent | accepted | blocked) — raised <date> — what is open -->

## PER-FEATURE LENS STATUS (Stage 7)
guard-domain — security — pass — verified: payment/auth paths, stripe and bcrypt imports, and a 2+ PII-field schema all exit 2 when undeclared; all exit 0 once declared
guard-domain — functional — pass — verified: author.ts, authoring/, healthcheck.ts, healthz.ts and a stray "email" mention all exit 0 — the guard stays quiet on ordinary work
session-start-staleness — functional — pass — verified: warns with the commit distance when state predates HEAD, silent when current, silent with no state file, silent outside a git repo
guard-write-document-scan — security — pass — verified: the 3 evasion shapes (split MultiEdit, completed-on-disk, clean-file introduction) all exit 2; reproduced 2026-08-03
guard-write-document-scan — adversarial — pass — verified: fix stashed and the split-secret case flips to ✗, so the guard is load-bearing rather than passing for free
guard-write-document-scan — functional — pass — verified: editing around, and removing, a pre-existing secret both exit 0 — the file stays fixable
guard-write-notebooks — security — pass — verified: a credential in `new_source` exits 2 and `NotebookEdit` is in the PreToolUse matcher; ordinary notebook code and placeholders exit 0
guard-state-rebaseline — adversarial — pass — verified: met goal re-baselines (exit 0); unmet, partially-met and placeholder-evidence goals all exit 2, so the unlock cannot be faked
guard-write-fixture-naming — functional — pass — verified: `ingest/test-hooks.mjs`, `test_parser.py`, `foo_test.go`, `lib/spec-helpers.mjs` exit 0 while `src/testUtils.ts`, `config/latest-config.json`, `src/latest.ts` still exit 2; the repo can now commit its own suite and a planted key in `src/` still blocks
guard-write-document-scan — quality — pass — verified: reuses `applyToolEdit`; no new dependency; `node ingest/validate.mjs` 0 errors

## NEXT ACTION
The plan from the critique is complete (steps 0-5). What remains is NOT more building: install the plugin
and run one real project through it end to end. Four of the six triggers are model discipline rather than
mechanism, `/status` and the command collapse have been exercised by nobody, and there is still no
external user. That run is the only thing that will show whether consequence gating actually feels better
than what it replaced.
