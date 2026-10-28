# CodeDarpan

CodeDarpan is a React + TypeScript frontend for exploring repository structure, code relationships, health evidence, onboarding paths, and change impact. The project is organized as a small monorepo so the user-facing app and the future analyzer service have clear boundaries.

## Repository layout

```text
codedarpan/
├── backend/                 # Reserved for the analyzer service; no server is implemented here
├── frontend/                # React + TypeScript + Vite application
│   ├── public/              # Static assets and route/SEO files
│   ├── scripts/             # Build-time prerendering
│   └── src/                 # App pages, components, API client, types and styles
├── .gitignore               # Root-level ignores for all workspace packages
├── package.json             # Workspace-level convenience scripts
├── pnpm-lock.yaml           # Shared dependency lockfile
├── pnpm-workspace.yaml      # pnpm workspace declaration
├── TODO.md                  # Product scope and outstanding work
└── plan.md                  # Project notes
```

The frontend consumes a same-origin analyzer API. The analyzer backend is intentionally not part of this repository yet; see [`backend/README.md`](backend/README.md) for the boundary and integration note. Live analysis requires a compatible service, and the UI reports service failures rather than substituting demo results. Sample data is available only through the explicit sample-atlas action.

## Requirements

- Node.js 22 or a compatible current Node.js release
- pnpm 11.25.0 (the version declared by `packageManager`)

## Setup and commands

Run these commands from the repository root:

```sh
pnpm install
pnpm dev          # Start the frontend on http://localhost:3000
pnpm typecheck    # Run TypeScript checks
pnpm test         # Run the frontend test suite
pnpm build        # Typecheck, build, and prerender the frontend
pnpm preview      # Preview the production build on port 3000
```

The optional `CODEDARPAN_PUBLIC_ORIGIN` environment variable can be set to the real public HTTPS origin during the build to generate canonical URLs and a sitemap. Leave it unset for local builds; do not use a placeholder domain.

## Backend status

`backend/` is a documented placeholder, not a runnable server. No analyzer, parser, database, authentication, or backend routes are included in this frontend-focused project. Implementing a backend is a separate scope and must follow the API contract consumed by `frontend/src/lib/api.ts` and described in `TODO.md`.
