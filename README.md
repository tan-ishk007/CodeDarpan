# CodeDarpan

**Understand the code behind the code.**

CodeDarpan is a frontend for an evidence-backed repository dependency atlas. The current project contains the interface only. No analyzer API or existing application repository was included with the supplied archive, so GitHub/ZIP analysis needs a compatible backend at the documented `/api` routes. Live failures are shown honestly; the local interactive sample is opened only by **Explore sample atlas** and is labelled **DEMO DATA**.

## Run locally

```sh
pnpm install
pnpm dev
```

Build the frontend with `pnpm build` and run TypeScript checking with `pnpm typecheck`.

## Product scope and constraints

See `spec.md`, `plan.md`, `TODO.md`, `ARCHITECTURE.md`, `DESIGN.md`, and `AGENTS.md`. The original problem statement, v2 frontend master prompt, full implementation checklist and `Rules.txt` are preserved in `docs/reference/`. API route contracts are documented there; this frontend does not implement a parser, persistence or backend. Privacy and terms pages are frontend drafts and need qualified professional review before production use. No custom domain, contact address or backend retention policy was supplied.

## Tool disclosure

See `docs/tool-disclosure.md` for runtime libraries and the boundary between implemented frontend UI and unavailable backend functions. The interface does not use AI-generated images, AI model explanations, analytics trackers or cookie-based login. Platform site analytics are disabled for this project; this does not assert that all platform/CDN analytics are disabled.
