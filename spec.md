# CodeDarpan Frontend Scope

## Product

**CodeDarpan** turns a public GitHub repository URL or uploaded ZIP into an evidence-backed interactive dependency atlas so developers can explore files, modules and functions, inspect matching source, search and focus relationships, understand architectural health evidence, follow onboarding paths and estimate structural impact from public pull requests. Tagline: **“Understand the code behind the code.”**

## Required frontend

- Landing page with supplied identity and technical atlas artwork; precise GitHub URL and optional ref fields; validated ZIP upload/drop zone; honest errors; explicit “Explore sample atlas” action; capability navigation; Ingest → Parse → Resolve → Explore flow; and compact footer.
- Workspace with repository/revision/status and returned summary; global search; Explore, Diagnose, Onboard and Plan/impact modes; file tree; actual Cytoscape graph; directed typed edges; selection-synchronized source inspector; line numbers, syntax highlighting and only returned metrics/relationships.
- Diagnose, issue discovery, onboarding routes, file impact and public pull-request impact must be grounded in the documented API responses. Show unavailable/partial/history limitations without inventing scores, churn, source, progress or outcomes.
- Only the explicit sample action may open the local fixture. Keep “DEMO DATA” visible and explain that its numbers and evidence are illustrative. Never fall back to the fixture after an API/network/validation failure.
- Privacy/terms drafts, 404, route manifest, accurate page metadata, favicon, Open Graph artwork, robots and sitemap with unresolved domain stated.
- Accessible controls and focus, sufficient contrast, line-style/non-color graph cues, reduced motion and mobile panel tabs.

## Explicit implementation boundary

The supplied archive contains product/problem documents, checklist, style guide and visual assets, but no existing application source or implemented analyzer backend. This deliverable implements the frontend only. It uses the documented `/api` contracts and can integrate with a compatible service, but it does not create routes, parser behavior, storage, authentication, analysis results or any server-side data. A live endpoint returning an unsupported shape must produce an honest error or unavailable state, not a fabricated response.

## Non-goals

Do not implement a parser or backend, a database, accounts, analytics, cookies, billing, private-repository access or a fake demonstration of live repository data. Do not use a static graph/dashboard image as the graph. Do not add the optional GLB unless it can be loaded on demand without slowing the actual atlas.

## Decisions requiring owner input before production

- Public custom domain and final canonical sitemap URLs.
- Operator identity and authorized privacy/terms contact address.
- Backend deployment, access and security boundary.
- Repository/ZIP retention, deletion, processing location and third-party processors.
- Legal jurisdiction and qualified review of privacy/terms.
- Whether the production deployment should install analytics or consent tooling.
