---
name: lang-typescript
description: Use when writing or reviewing TypeScript/JavaScript (.ts/.tsx/.js/.mjs/.cts) or Node/Next.js/React/Nest/Express code — idiomatic style, strict typing, async error handling, and the language's top security pitfalls. Triggers on tsconfig, package.json, ESLint/Prettier, Vitest/Jest, pnpm/npm/yarn projects.
allowed-tools: Read, Grep, Glob, Bash
---

# TypeScript / Node — idiomatic & safe

The language lens for TS/JS work. Backs the build agents at Stage 6. Honors
`_shared/vibegod-principles.md` (simplicity, surgical, no `any`, no silent error-swallowing,
consistency, cost-awareness). Defer security depth to `secure-coding` and test discipline to
`test-driven-development` — do not repeat them here.

## Fits in the pipeline
Stage 6 (Build): write code to this standard. Stage 7 (per-feature QA): the
code-quality-reviewer + security-engineer lenses check it against this skill. Priority:
**user > skills > default.**

## Style & layout
- `src/` for code, `tests/` or co-located `*.test.ts`. ESM (`"type": "module"`) for new packages.
- Prefer `type` aliases for unions/shapes; `interface` for extensible public contracts. Name
  types `PascalCase`, values `camelCase`, consts `UPPER_SNAKE` only for true constants.
- Functions over classes unless you need instances/state. Pure, small, single-purpose.
- Export explicitly; no barrel files that hide cycles. Co-locate by feature, not by layer.

## Toolchain (canonical)
- **Type-check:** `tsc --noEmit`. Strict tsconfig is mandatory: `strict: true`
  (implies `noImplicitAny` + `strictNullChecks`), plus `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `noImplicitOverride`.
- **Lint/format:** ESLint (`@typescript-eslint`, `no-explicit-any`, `no-floating-promises`) +
  Prettier. CI runs `eslint . && prettier --check .`.
- **Test:** Vitest (preferred) or Jest. Coverage via `vitest --coverage`.
- **Build/pkg:** `tsup`/`tsc`/Next build. Use **pnpm** (or npm) with a committed lockfile.
- **UI:** default to **Tailwind v4 + shadcn/ui (Radix)** + real fonts via `next/font`/Fontsource —
  not hand-rolled CSS or the system font stack. Re-theme the tokens (never ship the default Tailwind
  blue / shadcn slate). See `design-refinement` + `frontend-craft`.

## Types — no `any`, no unsafe casts
- Ban `any`. Use `unknown` + narrowing, generics, or a precise type. `as` only when you can
  prove the invariant; never `as any` or `as unknown as T` to silence the compiler.
- Validate all external data (HTTP bodies, env, `JSON.parse`, query params) with **Zod/valibot**
  at the boundary; flow only typed values inward. `process.env` access goes through one parsed,
  typed config module.

## Error handling & concurrency
- `async/await` with `try/catch` at boundaries; never leave promises floating (`no-floating-promises`).
  Use `Promise.all`/`allSettled` for concurrency; don't `await` in a loop when parallel is correct.
- Throw `Error` subclasses with context; never `catch (e) {}` (silent swallow) or `catch` only to
  re-log and continue. Propagate or handle meaningfully. Add `.catch`/`unhandledRejection` guard at
  the process edge.

## Top security pitfalls → safe alternative
- **`any`/unsafe casts** bypassing validation → parse at the boundary (Zod), keep types honest.
- **Prototype pollution** (deep-merge, `JSON.parse` into objects, `obj[userKey]=v`) → reject
  `__proto__`/`constructor`/`prototype` keys; use `Map`, `Object.create(null)`, or vetted merge.
- **`eval` / `new Function` / dynamic `require`** → remove; data-driven dispatch maps instead.
- **ReDoS** from user-fed regex / catastrophic backtracking → bound input length, use linear
  patterns or `re2`.
- **`JSON.parse` of untrusted input** unvalidated → validate the parsed shape before use.
- **SSRF** in `fetch`/axios with user URLs → allowlist host/scheme, block private/metadata IPs
  (see `secure-coding` A10).
- **`dangerouslySetInnerHTML`** / raw HTML → avoid; if unavoidable, sanitize with DOMPurify.
- **npm supply chain** → committed lockfile, `npm ci`, `--ignore-scripts` for untrusted installs,
  `npm audit`/`pnpm audit` in CI, pin & review new deps.

## Definition of done
`tsc --noEmit` clean · ESLint + Prettier pass · no `any`/floating promises · boundaries validated ·
tests written first and green (see `test-driven-development`) · security pitfalls above checked.
