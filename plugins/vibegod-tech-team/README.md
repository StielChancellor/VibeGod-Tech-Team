# vibegod-tech-team (plugin)

The VibeGod Tech Team plugin. See the [repository README](../../README.md) for the full overview
and install instructions.

## Layout
```
vibegod-tech-team/
├── .claude-plugin/plugin.json
├── skills/
│   ├── _shared/vibegod-principles.md   # canonical operating principles
│   ├── vibegod-orchestrator/                # the lead — drives the gated pipeline
│   └── <domain + methodology skills>/
├── agents/                              # the specialist team (subagents)
├── commands/                            # pipeline entry points (/kickoff, /prd, ...)
└── hooks/                               # runtime security/QA guardrails (Node.js)
```

## How it works
The `vibegod-orchestrator` skill triggers when you ask to build/improve a platform. It runs a
strict, gated SDLC, delegating to the specialist subagents and applying the methodology
skills, while the hooks apply best-effort security/QA guardrails (heuristic, fail-open — a
safety net, not a security boundary).

Guardrail mode: best-effort blocking by default (these are bypassable regex heuristics, not a
security boundary — they fail open); set `VIBEGOD_GUARDRAILS=advisory` to downgrade blocks to
warnings. The dangerous-delete guard intentionally ALLOWS deletes of build/dependency dirs
(node_modules, dist, build, .cache, target, …) — even by absolute path — while still blocking
home-root, system, drive-root, and bare-root targets.
