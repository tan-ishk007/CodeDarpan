# CodeDarpan Frontend TODO

All in-scope frontend outcomes are implemented. External service, domain and legal-review dependencies are listed after the acceptance clauses.

## Landing, identity and repository intake

- [x] Build `/` with the CodeDarpan symbol and wordmark; restrained Explore, How it works and Open workspace navigation; headline “The architecture is already there. Make it visible.”; tagline “Understand the code behind the code.”; concise substantiated copy; GitHub URL and optional ref fields; Analyze repository action; validated ZIP upload/drop zone with feedback and clear errors; the explicit “Explore sample atlas” action; technical atlas artwork; Explore/Diagnose/Plan/Onboard capabilities; Ingest → Parse → Resolve → Explore flow; and compact footer. Do not show invented counts, testimonials, benchmark claims or unsupported AI marketing.
- [x] GitHub URL/ref and ZIP submissions use only the documented `POST /api/analyses` contract. Show truthful validating, upload, queued/running/stage, ready, cancelled, failed, rate-limit, invalid-input and network/API-unavailable states; expose server stage/message when returned; do not invent progress percentages or switch to a fixture after a live failure.

## Explore atlas and source inspection

- [x] Build `/workspace` with repository/revision/status, actual returned summary values, global file/function/symbol search, Explore/Diagnose/Onboard/Impact mode tabs, file tree, real Cytoscape graph, relationship legend/filters, layout, depth, fit/reset and selected-entity inspector/source. Graph nodes/edges must come from normalized API data or the explicitly invoked demo fixture, not a graph image.
- [x] Keep tree, graph, search, source, dependencies and mode-panel navigation synchronized. Support pan, zoom, select, hover details, fit-to-view, one stable layout, filters, empty/loading/error/partial/large-graph states, and search result centering plus relationship highlighting. Import edges point importer → dependency; call edges point caller → callee; impact follows reverse relationships. Distinguish edge kinds by line style and legend, not color alone.
- [x] Show only actual returned source and facts: repository-relative path, entity kind/language, source range, line numbers, token count and its counting convention if supplied, LOC/complexity only when supported, imports/dependents, confidence, parser warnings and unsupported/missing-source states. Never fabricate live code or metrics.
- [x] The sample atlas is opened only by the explicit “Explore sample atlas” action and shows a persistent “DEMO DATA” label. No failure, missing route or empty response may silently substitute demo content.

## Diagnose, Onboard and Impact

- [x] Diagnose uses actual backend health/findings only: score/confidence/factors only when returned; transparent factor definitions where available; cycle and hotspot evidence; actual churn × complexity data; and clear partial/unavailable states. ZIP runs without history say “Git history unavailable” (or the exact backend wording), never zero churn.
- [x] Onboard renders only backend-returned ordered contributor steps with evidence-based reasons and clickable file/module links; public issues appear only when available with title, labels, URL, candidate files and evidence. Issue failure/no relevant issue is stated clearly and repository exploration remains available.
- [x] Impact supports selected-file impact and public PR URLs only through documented routes; show changed files, direct/transitive dependents, related tests, unresolved relationships and returned caveats/uncertainty. Clicks focus the graph/source. Clearly state malformed/private/unavailable/different-repository/rate-limited limitations. Describe results as structural blast-radius estimates, not predictions of every runtime failure.

## Accessibility, responsive shell, trust and legal pages

- [x] Use the supplied exact palette and cartographic visual identity, optimize supplied imagery for actual rendered dimensions, preserve SVG quality, use informative alt text and keep decorative art out of data views. Avoid purple/neon, generic SaaS cards, fake metrics/reviews/code, AI badges, emoji icons, pill buttons, em dashes and excessive motion.
- [x] Provide keyboard-accessible tabs, inputs, file upload, graph controls and menus; visible focus, readable contrast, ARIA labels, reduced-motion behavior and relationship/severity/confidence cues that do not rely on color alone. At narrow widths, use panel drawers/tabs instead of compressed columns; avoid clipped controls or text.
- [x] Include unique title/description per page, Open Graph image, favicon, robots.txt, sitemap.xml, branded 404, privacy policy and terms page. Legal pages must be accurate to this frontend, flag qualified professional review and disclose unresolved backend/data-retention/jurisdiction details; do not invent a contact address, analytics ID, domain or testimonials. Do not add a decorative cookie banner or unneeded analytics.
- [x] Include relevant onboarding and product docs (`AGENTS.md`, `spec.md`, `plan.md`, `TODO.md`, `ARCHITECTURE.md`, `DESIGN.md`, `REVIEW.md`) and state which exist for which purpose. Keep docs consistent with the actual frontend and its unavailable backend boundary.

## Build and delivery

- [x] Configure project language diagnostics, serve a complete `GET /manus-routes.json` manifest for `/`, `/workspace`, `/privacy`, and `/terms`, and build the complete frontend in a maintainable folder structure. Verify readiness, production build/typecheck, route-manifest JSON and the implemented user flows; report exactly what ran and what remains unavailable.

## Completion evidence and remaining dependencies

- TypeScript check passed with `pnpm typecheck`.
- Six analyzer API client contract tests passed with `pnpm test`, including GitHub payload, ZIP multipart field, graph depth, non-JSON response, missing-route 404 and structured rate-limit error.
- Production build passed with `pnpm build`.
- Local HTTP smoke checks returned 200 for the landing/workspace/legal/custom-404 routes, route manifest and bundled image/icon assets. The complete `manus-routes.json` response was inspected. All six exact uploaded image-storage paths used by the UI returned 200 through Preview.
- The source/read-only compliance review was completed. Full browser click-through/screenshot testing was not run.
- The archive did not contain an analyzer backend. Live GitHub/ZIP analysis and backend-dependent insight routes remain unavailable until a compatible service implements the documented `/api` contracts. The interface reports these failures and does not substitute sample data.
- Replace the reserved `.example` sitemap/robots host after the owner chooses a production domain. Operator/contact, jurisdiction and backend retention/processing details still require owner input; privacy and terms drafts require qualified legal review.
- The optional supplied 3D GLB is intentionally deferred. The real 2D Cytoscape graph is the product centerpiece and the supplied asset bible treats 3D as optional.
