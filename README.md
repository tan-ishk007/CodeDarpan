# CodeDarpan

CodeDarpan is a React + TypeScript application with a Node.js/Express analyzer for public GitHub repositories and ZIP uploads. It parses JavaScript, JSX, TypeScript and TSX with Babel and accepts common Python, Go, Rust, Java, C/C++, Ruby and PHP source files with explicit heuristic-parser caveats, resolves static relative imports, and serves a normalized dependency graph, source, search results, structural health evidence, onboarding suggestions and impact estimates.

## Repository layout

```text
codedarpan/
├── backend/                 # Express API, Babel parsing and analysis routes
├── frontend/                # React + TypeScript + Vite application
├── package.json             # Workspace scripts
├── pnpm-lock.yaml           # Shared dependency lockfile
└── pnpm-workspace.yaml      # Frontend and backend workspace declaration
```

## Requirements and local setup

Use Node.js 22+ and pnpm 11.25.0. From the repository root:

```sh
pnpm install
pnpm dev          # API on :3001 and frontend on :3000; Vite proxies /api
pnpm typecheck
pnpm test
pnpm build
```

The API can be started alone with `pnpm --filter @codedarpan/backend dev`. Set `PORT` to change its port. Production requires a same-origin reverse proxy to route `/api` to the API and other paths to the built frontend. Set `CODEDARPAN_PUBLIC_ORIGIN` to the actual HTTPS origin only when building for a public deployment.

`GET /api/health` returns the analyzer process health as JSON. The homepage, workspace, privacy and terms pages check this endpoint for their shared analyzer API status; a successful health check confirms API reachability, not that a particular repository submission or external GitHub request will succeed.

When `CODEDARPAN_REQUIRE_AUTH=true`, users must sign in at `/account` before creating or opening analyses. Authentication failures are separate from analyzer health and should not be interpreted as an API outage.

## Analysis conventions

Imports are directed from importer to dependency. The graph includes file and declared function nodes. Function calls use Babel lexical bindings, local declaration identity, and matching imported/exported function symbols to avoid linking ambiguous same-name functions; dynamic/member/dependency-package calls and unresolved imports remain omitted, so it is not a complete runtime call graph. File token count is a lexical approximation rather than a model tokenizer. Complexity is a cyclomatic estimate, convention `1 + if/loops/catch/ternary/non-default switch cases/logical operators`. The graph's confidence and caveats are static-analysis evidence, not runtime predictions.

ZIP constraints and limitations are described in [`backend/README.md`](backend/README.md). Analysis snapshots persist in SQLite for seven days by default; configure `CODEDARPAN_DB_PATH` and `CODEDARPAN_RETENTION_DAYS`. GitHub health computes bounded churn over up to five recent first-parent commits; ZIP and unavailable history stay unknown, not zero. Public GitHub issue lookup, tailored onboarding, function-level static call edges, and PR changed-file impact are implemented with documented limitations and structural estimates. Account sessions and per-user analysis isolation are available; self-service signup currently has no email verification/password reset. Private GitHub repositories are unsupported. Operators must define deployment retention and privacy controls.

## Deployment and performance checks

The single-origin container configuration is in [`Dockerfile`](Dockerfile), [`compose.yaml`](compose.yaml), and [`backend/DEPLOYMENT.md`](backend/DEPLOYMENT.md). Local gateway/API smoke tests passed in this environment. A Docker image build was not verified because no Docker/Podman daemon is installed here. The isolated Cytoscape harness is [`frontend/scripts/graph-benchmark.html`](frontend/scripts/graph-benchmark.html). A single headless Chrome run rendered 600 nodes/3,000 edges in about 960 ms; action timing is available, but this environment could not produce a credible sustained FPS/paint-complete measure. Do not treat one render sample as a deployment performance guarantee.

## Tools and external services

The application uses React, React DOM, React Router, Vite, TypeScript, Cytoscape.js, highlight.js, lucide-react, Express, Babel parser/traverse/types, Multer, yauzl, and uuid. GitHub public REST API and codeload are used for public repository metadata, snapshots and PR file lists. No AI model is used. Review package manifests and licenses before distribution.

The UI includes a demo atlas explicitly labeled as sample data; live-analysis errors do not fall back to demo content. Privacy/terms pages are drafts and need operator details and legal review before public deployment.

## AST traversal and graph-rendering notes

The ingestion pipeline is staged: ZIP/GitHub intake first applies path, size, dependency-folder and symlink safeguards; Babel parses each accepted JavaScript-family file with error recovery; a second pass resolves relative import candidates; a final pass resolves safe lexical call bindings and builds the normalized graph. Every node keeps repository-relative source identity so graph selection, source inspection, search, onboarding links and impact analysis use the same identifier.

Import resolution is bounded to relative paths and a small ordered extension/index candidate list. This keeps analysis deterministic and avoids pretending that package exports, aliases, dynamic imports or runtime dispatch are known. Call edges are emitted only when a unique local or imported exported function can be matched. Cycles use a linear-time strongly connected component traversal over the resolved import graph. Reverse dependency impact uses bounded breadth-first traversal, while churn requests are limited to five first-parent commits and 300 paths to protect GitHub rate limits.

The browser receives normalized nodes and edges, filters invalid edge endpoints, and uses Cytoscape's single graph instance with a stable breadth-first layout. Search and evidence actions focus existing nodes rather than rebuilding the graph. The Diagnose view includes a relative churn × complexity heatmap only when the analyzer returns numeric pairs; its intensity is normalized to the observed response and is explicitly not a risk prediction. The benchmark harness measures intake, analysis and graph delivery separately from browser paint/frame rate.

## Scope disclosure

The AST-grade parser scope is JavaScript, JSX, TypeScript and TSX; common Python, Go, Rust, Java, C/C++, Ruby and PHP source files are also ingested with explicit heuristic-parser warnings. Repositories with these languages remain explorable through the heuristic adapter; the returned warning distinguishes that evidence from Babel AST-grade metrics. Extending the scope should add a language-specific parser adapter and fixtures without weakening the evidence/caveat contract.

### Multi-language intake contract

CodeDarpan now accepts common source extensions across JavaScript/TypeScript, Python, Go, Rust, Java, C/C++, Ruby and PHP. JavaScript-family files use Babel AST traversal for declarations, imports, calls, complexity and parser diagnostics. Other languages receive deterministic source-file, import, function and branch extraction with a visible heuristic-parser warning. This makes mixed-language repositories explorable without overstating AST certainty; language-specific AST adapters can be added behind the same normalized graph contract.
