# CodeDarpan contributor instructions

Read `spec.md`, `plan.md`, `TODO.md`, `ARCHITECTURE.md`, `DESIGN.md`, `REVIEW.md` and `docs/reference/Rules.txt` before changing product scope or trust-sensitive behavior. The supplied source checklist and Visual Asset Bible are preserved in `docs/reference/`.

## Product truth and data handling

- This repository contains a frontend only. The analyzer service is not included. Use only documented `/api` routes and response contracts. Do not create fake live API results or infer a missing backend response.
- Live submissions, search and mode panels must show actual endpoint/network errors. Never silently open demo data after a failure, unsupported response or empty result.
- The sample fixture is available only via the explicit “Explore sample atlas” entry point. Keep a persistent “DEMO DATA” marker in every sample workspace panel and describe its evidence as illustrative.
- Never display invented statistics, scores, code, contributors, issues, retention guarantees, testimonials or contact details as live facts. Missing backend values stay unavailable. Git-history absence must not become zero churn.
- A structural impact estimate is not a prediction of all runtime failures.

## Style and copy

Use the supplied Astral Cartographer visual direction and exact palette in `DESIGN.md`. Preserve CodeDarpan's supplied glyph, contour artwork and source images. Use a real SVG icon set. Keep copy concrete and calm. Avoid purple/neon, generic SaaS cards, fake metrics/reviews, AI badges, emoji icons, pill buttons, em dashes and excessive motion. Respect `prefers-reduced-motion`; keep meaningful image alt text and decorative-image `alt=""`.

## Technical boundaries

- React + TypeScript + Vite, Tailwind CSS, React Router, Cytoscape.js and the pinned pnpm toolchain in `package.json`.
- Keep API contracts in `src/types`, endpoint calls in `src/lib/api.ts`, sample values in `src/data/demo.ts`, and visual/interaction components under `src/components`.
- Keep URLs to `/api` relative and use only the endpoints documented in `docs/api-contract.md`. Do not guess a new server route or use environment credentials in browser code.
- Use `/manus-storage/<key>` paths as returned by the managed asset upload tool. Do not replace or rewrite them.
- Update `public/manus-routes.json` whenever a page route changes. It lists page routes only, never APIs/assets/404.
- Do not add database, authentication, server, user tracking or cookie logic unless the owner explicitly changes scope and the relevant product/privacy decisions are resolved.

## Legal and launch requirements

Privacy and terms pages are review drafts, not legal guarantees. Keep the unknown backend retention policy, operator contact, jurisdiction and custom domain visible in project documentation; do not invent these values. Do not add analytics or a decorative cookie banner. Replace the reserved `.example` sitemap host only after the actual production domain is supplied. A qualified professional must review legal text before public launch.

## Commands

- `pnpm install`
- `pnpm dev`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
