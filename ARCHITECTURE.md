# Architecture

## System boundary

This project is a static React client in a managed Vite project. The archive did not include a source application or analyzer service. No server, database, parser, login, file-processing worker or analytics system is implemented here. In Preview, `/api/...` calls go to the same origin. `VITE_API_PROXY_TARGET` may be set by an authorized deployment operator to point the Vite development proxy at an existing compatible analyzer. It is not a new route or service.

## Route map

- `/`: editorial landing, GitHub and ZIP intake, explicit demo entry.
- `/workspace`: analysis shell; accepts `?runId=<returned-id>`, `?demo=1`, and optional `&mode=diagnose|onboard|impact`.
- `/privacy`: current-build privacy draft and unresolved integration details.
- `/terms`: current-build terms draft and structural-analysis limitations.
- Other paths: branded 404.

`public/manus-routes.json` mirrors the four page routes only.

## Client modules

- `src/lib/api.ts`: typed requests, structured error parsing, network/API unavailable behavior and SSE client for documented routes.
- `src/hooks/useAnalysisEvents.ts`: event subscription plus polling fallback for the documented analysis status resource.
- `src/types/index.ts`: repository-analysis response contracts used by the interface.
- `src/data/demo.ts`: isolated illustrative fixture reached only through the explicit demo action.
- `src/components/graph/AtlasGraph.tsx`: Cytoscape elements/layout/style, selection and edge filtering.
- `src/components/explorer/`: returned file paths and source inspection.
- `src/components/intelligence/ModePanels.tsx`: health, onboarding, issue and impact views.
- `src/pages/`: route-level landing, workspace and legal content.

## Data flow

1. The landing validates a public GitHub URL or ZIP suffix for basic input usability and sends the documented `POST /api/analyses` request. The backend remains authoritative for repository access, ZIP safety, size limits and analysis validation.
2. A returned run ID opens `/workspace?runId=...`. The client requests status and subscribes to progress events; status polling continues as an SSE fallback. No percentage is synthesized.
3. Only a `ready` snapshot triggers the documented file-level graph request. Selecting a returned entity loads its documented file record/source. Search, tree, graph, source links and returned mode findings share selection state.
4. Diagnose, Onboard, Issues and Impact request their documented endpoints only when the associated workspace mode is opened. A missing/unsupported route is surfaced as unavailable.
5. `?demo=1` uses local fixture nodes, code excerpts, metrics and findings. The persistent banner and panel-level markers distinguish every fixture value from analyzer output.

## API source of truth

See `docs/api-contract.md`, transcribed from the supplied checklist. This frontend intentionally does not infer undocumented payload shapes or invoke endpoints outside that contract. It has not been tested against a live backend because none was included.
