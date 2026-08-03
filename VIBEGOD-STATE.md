<!-- VibeGod pipeline state — the persistent memory that lets a fresh session RESUME the pipeline
     instead of re-discovering it. Created by /kickoff, updated at every stage transition and gate.

     This file is a REAL RUN of the plugin against its own codebase, kept in the repo deliberately:
     until v0.20.0 the project had never once run its own persistent-memory mechanism, which is why a
     15-release gap in it went unnoticed. Every claim below carries the signal that proves it. -->

## GOAL (frozen at kickoff — do not edit; only flip acceptance-criteria [ ] -> [x])
Objective: `guard-write` must block a real credential even when the value is assembled across several edits in one tool call, or completed against content already on disk — so the never-commit-a-credential floor cannot be stepped around by splitting the value in two.
Acceptance criteria (machine-checkable; mark [x] ONLY with a claim-verifier-reproduced signal in `verified:` — proof, not self-report):
- [x] AC-1: a credential split across two MultiEdit edits is blocked — proof: `node ingest/test-hooks.mjs` case "blocks a credential split across MultiEdit edits" reports ✓ — verified: reproduced 2026-08-03, suite 250 passed 0 failed
- [x] AC-2: a credential completed against existing on-disk content is blocked — proof: `node ingest/test-hooks.mjs` case "blocks a credential completed against on-disk content" reports ✓ — verified: reproduced 2026-08-03, suite 250 passed 0 failed
- [x] AC-3: editing a file that ALREADY contains a secret is still allowed, so the file remains fixable — proof: `node ingest/test-hooks.mjs` case "allows editing a file that already contains a secret" reports ✓ — verified: reproduced 2026-08-03, suite 250 passed 0 failed
- [x] AC-4: no regression — proof: `node ingest/test-hooks.mjs` exits 0 with 0 failed, and `node ingest/validate.mjs` reports 0 errors — verified: reproduced 2026-08-03 — `node ingest/test-hooks.mjs` exit 0, 250 passed 0 failed; `node ingest/validate.mjs` 0 errors 0 warnings
Hard constraints: zero runtime dependencies · fail-open on error · no new false-positive class · £0 ceiling
Non-goals: covering the shell path · notebook `new_source` · novel credential formats

## WHERE
Repo / branch: /home/i-main/projects/Hi-ITCHL/Vibe-FDE-Agent · main
Last verified against commit: 535bfd8 (parent) — this change verified at 250 passed / 0 failed before commit
Install / run: `npm ci` (no deps) · Tests: `node ingest/test-hooks.mjs` · Expected: 250 passed, 0 failed
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
2026-08-03 — scan the RESULTING DOCUMENT and report only NEWLY-introduced secrets, rather than scanning the edit fragments — why: fragments cannot see a value split across two edits, and scanning the whole document without differencing would block every edit to a file that already contains a secret, making such a file unfixable — ruled out: catching a secret that was already on disk before this change (guard-commit is the net for that)
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
guard-write-document-scan — security — pass — verified: the 3 evasion shapes (split MultiEdit, completed-on-disk, clean-file introduction) all exit 2; reproduced 2026-08-03
guard-write-document-scan — adversarial — pass — verified: fix stashed and the split-secret case flips to ✗, so the guard is load-bearing rather than passing for free
guard-write-document-scan — functional — pass — verified: editing around, and removing, a pre-existing secret both exit 0 — the file stays fixable
guard-write-document-scan — quality — pass — verified: reuses `applyToolEdit`; no new dependency; `node ingest/validate.mjs` 0 errors

## NEXT ACTION
All four GOAL criteria are [x] with reproduced evidence, so the DONE predicate holds. Commit, then the
remaining known-open items are: notebook `new_source` is unread and `NotebookEdit` is not in the hook
matcher; the shell path stays outside every file guard; Step 4 of the redesign (trigger rewiring and
command collapse) has not started.
