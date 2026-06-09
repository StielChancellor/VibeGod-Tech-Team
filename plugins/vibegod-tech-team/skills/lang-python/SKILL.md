---
name: lang-python
description: Use when writing or reviewing Python (.py/.pyi) or FastAPI/Django/Flask code — idiomatic 3.11+ style, type hints + mypy/pyright, pydantic boundary validation, error handling, and the language's top security pitfalls. Triggers on pyproject.toml, requirements.txt, ruff/black, pytest, venv/poetry/uv projects.
allowed-tools: Read, Grep, Glob, Bash
---

# Python — idiomatic & safe

The language lens for Python work. Backs the build agents at Stage 6. Honors
`_shared/vibegod-principles.md` (simplicity, surgical, typed/no-`Any`-by-default,
no silent error-swallowing, consistency, cost-awareness). Defer security depth to
`secure-coding` and test discipline to `test-driven-development`.

## Fits in the pipeline
Stage 6 (Build): write code to this standard. Stage 7 (per-feature QA): the
code-quality-reviewer + security-engineer lenses check it against this skill. Priority:
**user > skills > default.**

## Style & layout
- Python **3.11+**. `src/` layout package, tests in `tests/`. PEP 8 via tooling, not by hand.
- Type hints on every public function signature and dataclass/model field. Prefer
  `dataclass`/`pydantic` models over loose dicts. Use modern syntax: `X | None`, `list[str]`.
- Small pure functions; modules grouped by feature. No wildcard imports.

## Toolchain (canonical)
- **Env/deps:** `uv` (preferred) or Poetry; committed lockfile. Never install into system Python.
- **Lint/format:** `ruff check` + `ruff format` (or black). CI runs both.
- **Type-check:** `mypy --strict` or `pyright`. Treat type errors as build failures; avoid `Any`
  and bare `# type: ignore` (scope and justify them).
- **Test:** `pytest` (+ `pytest-cov`). Fixtures over setup boilerplate.

## Types & boundary validation
- Validate all external input (HTTP bodies, query/env, file/JSON, message payloads) with
  **pydantic v2** models at the boundary; pass typed objects inward. One typed `Settings`
  (pydantic-settings) for env config — no scattered `os.environ[...]`.

## Error handling & concurrency
- Catch the **narrowest** exception; never bare `except:` or `except Exception: pass` (silent
  swallow). Re-raise with `raise ... from e` to keep the chain. Use custom exception types at
  boundaries; let unexpected errors surface.
- Async: `async def` + `await`; don't block the loop with sync I/O — use async drivers or
  `asyncio.to_thread`. `asyncio.gather` for concurrency. For CPU-bound work use processes, not threads.

## Top security pitfalls → safe alternative
- **`pickle` / `yaml.load`** on untrusted data → `json` for data; `yaml.safe_load`; never
  unpickle untrusted bytes.
- **`subprocess(..., shell=True)`** with interpolated input → pass an arg **list**, `shell=False`;
  never build shell strings from user input.
- **Raw SQL / ORM `.raw()` / f-string queries** → parameterized queries / ORM query API with
  bound params; never f-string user input into SQL.
- **Jinja autoescape off** → keep autoescape on; never disable it or mark untrusted text `|safe`.
- **`eval` / `exec` / `__import__`** on input → remove; use dispatch dicts or `ast.literal_eval`
  for literals only.
- **Mutable default args** (`def f(x=[])`) → default `None`, assign inside.
- **Broad `except`** hiding failures → narrow it (see error handling above).

## Definition of done
`mypy`/`pyright` clean · `ruff check` + format pass · no bare `except`/mutable defaults ·
boundaries validated with pydantic · tests written first and green (see
`test-driven-development`) · security pitfalls above checked.
