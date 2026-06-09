---
name: lang-go
description: Use when writing or reviewing Go (.go) code or modules — idiomatic style, gofmt/vet/staticcheck, wrapped errors, context propagation, goroutine/channel discipline, the race detector, and Go's top security pitfalls. Triggers on go.mod/go.sum, net/http, database/sql, html/template projects.
allowed-tools: Read, Grep, Glob, Bash
---

# Go — idiomatic & safe

The language lens for Go work. Backs the build agents at Stage 6. Honors
`_shared/vibegod-principles.md` (simplicity, surgical, no silent error-swallowing, consistency,
cost-awareness). Defer security depth to `secure-coding` and test discipline to
`test-driven-development`.

## Fits in the pipeline
Stage 6 (Build): write code to this standard. Stage 7 (per-feature QA): the
code-quality-reviewer + security-engineer lenses check it against this skill. Priority:
**user > skills > default.**

## Style & layout
- Standard module layout: `cmd/<bin>/main.go`, `internal/` for non-exported packages, package per
  directory named after its dir. Accept interfaces, return concrete types.
- Keep it boring and explicit — no clever generics or reflection unless the problem demands it.
  Exported identifiers `CamelCase` with doc comments starting with the name; small interfaces.
- Zero values useful; constructors only when needed. No global mutable state.

## Toolchain (canonical)
- **Format/imports:** `gofmt` / `goimports` (non-negotiable, enforced in CI).
- **Vet/lint:** `go vet ./...` + `staticcheck ./...` (or golangci-lint).
- **Test:** `go test ./...`; **table-driven** tests with subtests (`t.Run`). Run
  `go test -race ./...` for any concurrent code.
- **Build:** `go build ./...`; tidy deps with `go mod tidy`, committed `go.sum`.

## Error handling & concurrency
- Errors are values: return `error`, check **every** one — never `_ = f()` to discard an error.
  Wrap with `fmt.Errorf("doing X: %w", err)` to preserve the chain; inspect with
  `errors.Is`/`errors.As`. Sentinel errors via `errors.New`. No `panic` for ordinary failures.
- Propagate `context.Context` as the first arg through call chains; honor cancellation/deadlines;
  never store a context in a struct.
- Goroutine discipline: every goroutine has a clear owner and exit path; use `sync.WaitGroup` or
  `errgroup`; close channels from the sender only; guard shared state with mutexes or channels.
  Verify with `-race`. Avoid leaking goroutines on early return.

## Top security pitfalls → safe alternative
- **Ignored errors** → check and handle/return every error; lint with `errcheck`.
- **SQL via `fmt.Sprintf`** → parameterized queries: `db.QueryContext(ctx, "... WHERE id=$1", id)`;
  never build SQL strings from input.
- **`text/template` for HTML output** → use **`html/template`** (contextual auto-escaping);
  `text/template` does not escape and invites XSS.
- **Command injection** via `sh -c` strings → `exec.CommandContext(ctx, bin, args...)` with
  separate args, never a shell string.
- **SSRF / unvalidated outbound URLs** → allowlist + block private/metadata IPs (see `secure-coding`).
- **Unscanned dependencies** → run `govulncheck ./...` in CI; keep modules current.

## Definition of done
`gofmt`/`goimports` clean · `go vet` + `staticcheck` pass · `go test -race ./...` green ·
every error checked & wrapped with `%w` · context propagated · `govulncheck` clean · tests
written first (see `test-driven-development`) · security pitfalls above checked.
