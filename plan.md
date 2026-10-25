# CodeDarpan Frontend Plan

## Scope and approach

Build the requested CodeDarpan frontend in the initialized, empty Manus website project. The archive contains the problem statement, implementation checklist, v2 frontend master prompt, explicit design/trust rules and assets, but no existing application source or backend. Therefore this deliverable is a frontend, not a replacement analysis service. Use the actual documented API contracts and routes only. Live repository or ZIP submission must report unavailable API/network/validation errors truthfully; it must never fall back to sample results. The local fixture is reachable only through the explicit **Explore sample atlas** action and must keep a visible **DEMO DATA** label throughout the workspace.

The foundation is React + TypeScript + Vite with Tailwind CSS, React Router and Cytoscape.js. Keep the product organized by pages, focused components, typed API/contracts, graph adapter, demo fixture and shared styling. The client uses documented routes for analysis creation, run status/events, graph, file source, search, health, onboarding, issues, file impact, PR impact and deletion. Use SSE where available and status polling as a fallback, without synthetic percentages or fabricated data. The UI handles graph/source/search/mode selections as one synchronized state. The sample graph and sample evidence are clearly identified as illustrative data.

Use the supplied CodeDarpan assets rather than generating replacements: preserve the glyph and contour/social SVGs, optimize the technical atlas image for the landing page, and use only small supporting images where they add meaning. The supplied 3.9 MB GLB is optional and is intentionally not added to the first frontend: the actual interactive Cytoscape atlas is the product centerpiece, while a decorative 3D layer would add payload without replacing or improving the live graph. The graph is real Cytoscape-rendered data, never a raster illustration.

## Design

- **Design movement:** the supplied “Astral Cartographer” direction: archival cartography interpreted as a refined engineering journal.
- **Core principles:** evidence before ornament; deliberate hierarchy and precision; spatial graph exploration; honest disclosure of uncertainty and sample data.
- **Color philosophy:** warm parchment for orientation and reading, ink for technical focus, muted brass for routes/selection, oxblood for caution and sage for secondary structure. Exact supplied palette: parchment `#F2EBDD`, ink `#1D1A18`, oxblood `#8F3030`, brass `#AF8C57`, sage `#7C8980`, paper `#FAF7F0`, border `#D8CCB7`, muted text `#6E6961`.
- **Layout paradigm:** compact editorial landing page feeding into a dense, three-part atlas instrument: searchable file rail, dominant dark graph field, and source/inspector rail; small screens turn the side rails into drawers/tabs.
- **Signature elements:** compass/dependency brand glyph; fine coordinate/contour lines; restrained brass relationship paths against ink.
- **Interaction philosophy:** direct manipulation with consistent focus, hover and selection feedback; connected views stay synchronized; never mask missing facts.
- **Animation:** short 120–200 ms transitions only where state changes benefit; no autoplay, constant physics/pulsing, long parallax or cursor animation; honor `prefers-reduced-motion`.
- **Typography system:** Instrument Serif (fallback Cormorant/Georgia) for editorial headlines; DM Sans (fallback Inter/system sans) for interface; IBM Plex Mono (fallback JetBrains Mono/system monospace) for paths, metrics and source.
- **Brand essence:** an evidence-led code architecture atlas for developers exploring an unfamiliar repository; precise, thoughtful, candid.
- **Brand voice:** concise, specific and calm. Examples: “The architecture is already there. Make it visible.” “A structural estimate, not a prediction of every runtime failure.”
- **Wordmark and logo:** supplied compass/dependency glyph beside the exact text wordmark `CodeDarpan`, set in editorial serif; glyph also serves as favicon.
- **Signature brand color:** oxblood `#8F3030`, used sparingly to mark attention and cycles.

## Project structure

```text
codedarpan/
├── index.html                    # document shell, default SEO and font loading
├── package.json                  # pinned package manager and build/dev scripts
├── vite.config.ts                # React/Tailwind plugin and optional API proxy
├── tsconfig.json                 # strict TypeScript settings
├── tailwind.config.js            # content scan and project tokens
├── postcss.config.js
├── app.config.ts                 # Manus project logo URL metadata
├── public/
│   ├── assets/                   # optimized supplied imagery and original SVGs
│   ├── favicon.svg               # branded site icon
│   ├── robots.txt, sitemap.xml   # indexing policy and public page map
│   └── manus-routes.json         # synchronized page route manifest
├── src/
│   ├── main.tsx, App.tsx         # app entry and route shell
│   ├── styles/                   # global tokens, responsive and component styles
│   ├── types/                    # API, graph and UI contracts
│   ├── lib/                      # API client, formatters and page metadata
│   ├── hooks/                    # analysis progress / search interactions
│   ├── data/                     # explicitly labelled demo-only fixture
│   ├── components/               # brand, intake, graph, tree, inspector, panels
│   └── pages/                    # landing, workspace, privacy, terms and 404
├── docs/                         # relevant source references and architecture notes
├── AGENTS.md                     # cross-tool project guidance and rules
├── spec.md                       # frontend scope and non-goals
├── TODO.md                       # outcome-based delivery tracking
├── ARCHITECTURE.md               # client boundaries and data flow
├── DESIGN.md                     # tokens and component design rules
└── REVIEW.md                     # review expectations for project contributors
```

## Serving and integration boundaries

Serve the Vite app on the project’s initialized Preview port. Browser requests use relative `/api/...` paths exactly as documented so a compatible backend may be attached later without frontend changes. Development proxy behavior is configurable and does not create or simulate an API. Static routes are `/`, `/workspace`, `/privacy` and `/terms`; unmatched paths render the branded 404. Do not enable database, account login, analytics, cookies or a server for this frontend-only scope. No custom domain, authorized contact address, backend retention policy or production legal jurisdiction was supplied; do not invent them. Privacy and terms pages must describe this frontend honestly and clearly mark qualified legal review and remaining owner inputs.
