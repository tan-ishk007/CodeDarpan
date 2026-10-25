# Tool and runtime disclosure

## Included in this frontend

- React, React DOM, React Router, TypeScript and Vite.
- Cytoscape.js for a live interactive graph rendered from returned graph data.
- highlight.js for escaped read-only source highlighting.
- Lucide React for interface icons.
- Tailwind CSS is configured for the project tokens; authored component styles live in `src/styles/index.css`.
- User-supplied CodeDarpan glyph, technical atlas illustration, empty-state and contributor-route images, contour artwork, progress seal and social-preview artwork. Raster imagery was resized and WebP-compressed for actual page use, then uploaded to project storage.
- Instrument Serif, DM Sans and IBM Plex Mono are loaded from Google Fonts with local system fallbacks. Font availability depends on the visitor's network.

## Not included

- No existing application source or analyzer API, repository parser, backend, database, storage pipeline, authentication or production deployment configuration was present in the archive.
- No model/LLM-generated analysis or custom generated images were used. The explicitly selected sample atlas is a local, synthetic, clearly labelled fixture.
- The supplied G01 GLB is preserved in the original source archive but not shipped/loaded by this UI. The actual dependency graph is the interactive Cytoscape view; a 3D ornament would add payload and compete with that task. The asset bible describes this GLB as optional.
- Analytics/site tracking is not installed; platform site analytics are disabled for this project. This does not assert that all platform, font-CDN, browser or content-delivery logs are disabled.
- The sitemap intentionally uses reserved `codedarpan.example` URLs until an owner supplies the real public domain. Replace these before production indexing.
- Privacy/terms copy is a review draft, not legal advice or a complete policy for an unavailable backend.
