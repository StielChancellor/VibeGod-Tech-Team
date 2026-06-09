---
name: lang-rust
description: Use when writing or reviewing Rust (.rs) code or crates — idiomatic style, cargo fmt/clippy, Result/Option error handling (thiserror/anyhow), ownership/borrowing, minimal justified unsafe, and Rust's top safety/security pitfalls. Triggers on Cargo.toml/Cargo.lock, tokio, axum/actix projects.
allowed-tools: Read, Grep, Glob, Bash
---

# Rust — idiomatic & safe

The language lens for Rust work. Backs the build agents at Stage 6. Honors
`_shared/vibegod-principles.md` (simplicity, surgical, no silent error-swallowing, consistency,
cost-awareness). Defer security depth to `secure-coding` and test discipline to
`test-driven-development`.

## Fits in the pipeline
Stage 6 (Build): write code to this standard. Stage 7 (per-feature QA): the
code-quality-reviewer + security-engineer lenses check it against this skill. Priority:
**user > skills > default.**

## Style & layout
- Cargo workspace; lib + thin bin. Modules by feature; `pub` only what the API needs. Prefer
  owned types at boundaries, borrows internally. Lean on the type system (newtypes, enums,
  `#[non_exhaustive]`) to make illegal states unrepresentable.
- Derive `Debug`/`Clone`/`PartialEq` where sensible; implement `From`/`TryFrom` for conversions.
  Iterators over manual loops; avoid premature `clone()` to "fix" borrow errors — restructure instead.

## Toolchain (canonical)
- **Format:** `cargo fmt` (enforced). **Lint:** `cargo clippy -- -D warnings` (deny warnings in CI).
- **Test:** `cargo test` (unit `#[cfg(test)]` modules + `tests/` integration); doctests for examples.
- **Build:** `cargo build`; committed `Cargo.lock` for binaries.

## Error handling
- Return `Result<T, E>` / `Option<T>` — make fallibility explicit; propagate with `?`.
- **Libraries:** typed errors via **`thiserror`**; do NOT `unwrap()`/`expect()`/`panic!` in library
  code paths. **Applications/bin:** `anyhow::Result` with `.context(...)` is fine at the top level.
- Never silently discard a `Result` (`let _ = ...` only with a justified comment). No
  panic-as-control-flow.

## Concurrency
- Prefer message passing (channels) and `Arc<Mutex<_>>`/`RwLock` for shared state; let the borrow
  checker and `Send`/`Sync` guide you. Async with `tokio`; don't block the runtime — use async I/O
  or `spawn_blocking`. Avoid holding a lock across `.await`.

## Top safety/security pitfalls → safe alternative
- **`.unwrap()` / `.expect()` in libraries** → return `Result`/`Option` and propagate with `?`;
  reserve `expect` for proven invariants with a message explaining why.
- **Panics across an FFI boundary** (UB) → wrap `extern "C"` bodies in
  `std::panic::catch_unwind` and convert to error codes; never let a panic unwind into C.
- **Integer overflow** (silent wrap in release) → use `checked_*`/`saturating_*`/`wrapping_*`
  explicitly per intent; enable `overflow-checks` where feasible.
- **`unsafe` misuse** → avoid it; when truly required, isolate in a small module, document the
  invariants you uphold, and cover with tests/Miri. Justify every `unsafe` block.
- **Vulnerable/yanked deps** → run `cargo audit` and `cargo deny check` in CI; keep `Cargo.lock` current.

## Definition of done
`cargo fmt` clean · `cargo clippy -D warnings` passes · `cargo test` green · no `unwrap`/`panic`
in library paths · errors typed (thiserror/anyhow) · every `unsafe` justified & isolated ·
`cargo audit`/`deny` clean · tests written first (see `test-driven-development`) · pitfalls above checked.
