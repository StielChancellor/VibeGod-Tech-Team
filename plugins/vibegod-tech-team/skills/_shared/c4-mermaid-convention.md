# VibeGod C4 Mermaid convention — one visual language for every architecture diagram

The shared standard so the **platform-blueprint** (C4 Container view) and **module-architecture**
(module-boundary graph) diagrams look and read the same everywhere. Mermaid is chosen on purpose:
it renders **read-only, for free, inside GitHub PRs, IDEs, and docs** — exactly where architecture is
reviewed. **Commit the diagram inside the blueprint / module-map markdown** (a fenced ```mermaid```
block), never as a side file nobody opens.

## Rules (keep every diagram consistent and readable)
1. **One Container/module diagram is required** — not optional. Use `flowchart LR`.
2. **Shapes carry meaning** (so the diagram is scannable without reading every label):
   | Type | Mermaid shape | classDef |
   |---|---|---|
   | Person / actor | stadium `([User])` | `:::actor` |
   | App / service / worker (a runnable container) | rectangle `["API"]` | `:::webapp` · `:::api` · `:::worker` |
   | Datastore / cache | cylinder `[("Postgres")]` | `:::datastore` · `:::cache` |
   | Queue / event bus | hexagon `{{"Bus"}}` | `:::queue` |
   | External system (3rd-party) | parallelogram `[/"Stripe"/]` | `:::external` |
3. **Every edge is labeled `mechanism: contract`** — `HTTPS`, `REST: /api/*`, `gRPC`, `SQL`,
   `cache`, `event: OrderPlaced`. **Async/eventing is dashed** (`-.->`); synchronous is solid (`-->`).
   An unlabeled arrow is a defect.
4. **Trust boundary = a `subgraph`** wrapping the in-perimeter containers. The `security-engineer`
   reads this: anything crossing the boundary is an attack surface.
5. **Size discipline:** ≤ ~10–12 boxes. Denser → split by bounded context into multiple diagrams.
   (Same readability rule the journey canvas enforces — a 50-node wall communicates nothing.)
6. **The `classDef` block is the legend** — always include it (colors below are light-theme tuned to
   match the journey canvas). Add a one-line `%%` comment naming the view.

## Copy-paste starter (a valid Container diagram — adapt the nodes/edges, keep the conventions)
```mermaid
flowchart LR
  %% C4 Container view — <system name>. Shapes = type, edges = "mechanism: contract", dashed = async.
  user([User]):::actor

  subgraph trust["Trust boundary — our cloud"]
    spa["Web App<br/>(React / TS)"]:::webapp
    api["API Service<br/>(Node)"]:::api
    worker["Worker<br/>(async jobs)"]:::worker
    db[("Postgres")]:::datastore
    cache[("Redis")]:::cache
    bus{{"Event Bus"}}:::queue
  end

  stripe[/"Stripe API"/]:::external

  user -->|"HTTPS"| spa
  spa  -->|"REST: /api/*"| api
  api  -->|"SQL"| db
  api  -->|"cache"| cache
  api  -.->|"event: OrderPlaced"| bus
  bus  -.->|"consume"| worker
  api  -->|"REST: charge"| stripe

  classDef actor     fill:#fef9c3,stroke:#a16207,color:#1c1917;
  classDef webapp    fill:#e0f2fe,stroke:#0369a1,color:#0c4a6e;
  classDef api       fill:#dbeafe,stroke:#1d4ed8,color:#1e3a8a;
  classDef worker    fill:#ede9fe,stroke:#6d28d9,color:#4c1d95;
  classDef datastore fill:#dcfce7,stroke:#15803d,color:#14532d;
  classDef cache     fill:#f0fdf4,stroke:#15803d,color:#14532d;
  classDef queue     fill:#ffedd5,stroke:#c2410c,color:#7c2d12;
  classDef external  fill:#f1f5f9,stroke:#475569,color:#0f172a;
```

## For the module-architecture boundary diagram (Stage 4)
Same language, different nouns: nodes are **modules** (use `:::api` for service-like modules,
`:::datastore` for data-owning ones, `:::external` for 3rd-party), edges are the **contracts** from
the module map (`REST`/`event`/`gRPC` + the endpoint/event name), dashed for async. Wrap any modules
inside a trust boundary in a `subgraph`. Every PRD requirement/journey step must land in exactly one
module node — so the diagram doubles as the no-orphans check.

## Why read-only (and what this is NOT)
This is deliberately a **rendered, committed diagram**, not an interactive editor. A drag-and-drop
canvas for architecture was considered and rejected: architecture is authored ~once, the load-bearing
detail (ADRs/NFRs/contracts) is prose, and a `file://` canvas doesn't render in PRs. If interactive
authoring is ever genuinely needed, the path is generalizing the journey canvas — a separate decision.
