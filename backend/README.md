# Backend boundary

This directory reserves a clear home for a future CodeDarpan analyzer service. **There is no backend implementation in this project.** The current product is intentionally a frontend-only application; creating an analyzer, parser, database, authentication layer, or undocumented endpoints is outside the existing project scope.

The frontend expects a compatible same-origin API. Its endpoint requests and response validation live in [`../frontend/src/lib/api.ts`](../frontend/src/lib/api.ts); the required user-visible behavior and external prerequisites are documented in [`../TODO.md`](../TODO.md).

When a backend is separately approved and implemented, add its source, dependencies, configuration, and run instructions here without moving frontend concerns into this directory. Until then, live API failures should remain visible in the frontend, and the sample atlas must only be opened through its explicit demo action.
