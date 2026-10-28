# Benchmark and verification report

**Date:** October 28, 2026. These are implementation checks on one sandbox, not a performance certification. No claim is made that all repositories parse in under five seconds or that 500+ node graphs render at 60 FPS.

## Environment

Tests and the local analyzer ran on Node.js v22.23.4, pnpm 11.25.0, Linux 6.18.38+ x86_64, an Intel Xeon processor reported at 2.50 GHz, and approximately 21.5 GB of visible memory. Measurements were single runs; no warm-up, repeated-run distribution, container-equivalent profile, or peak-RSS sampling was collected.

## Automated verification

The final handoff build passed `pnpm typecheck`, `pnpm test`, and `pnpm build`. The backend suite passed 25 tests; the frontend suite passed 32 tests. The tests cover health JSON, API response schemas, ZIP path traversal and limits, imports and function-call edges, source retrieval, metrics, account isolation, rate limiting, SQLite restoration, and UI API-client behavior. The final Vite production build completed in 6.18 seconds; the test-suite-reported durations were 2.59 seconds for backend tests and 0.43 seconds for frontend tests. These timings measure this test/build run, not repository analysis performance.

## End-to-end ingestion test

The locally built backend was run with isolated `/tmp` SQLite storage and authentication disabled specifically for this controlled test. The exact same pinned public Express commit was analyzed through both supported input routes: GitHub URL and a ZIP downloaded from that commit.

| Input | Repository/revision | Compressed ZIP | Files | Graph nodes | Edges | Analysis `durationMs` | POST wall time | Source inspection |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| GitHub URL | `expressjs/express`, `1c6f1b0fe4000977b9a7b4f34097e4d527dd9824` (`master`) | N/A | 142 | 362 | 40 | 830 ms | 2.20 s | HTTP 200, non-empty source |
| ZIP upload | Same pinned commit | 237,452 bytes | 142 | 362 | 40 | 562 ms | 0.63 s | HTTP 200, non-empty source |

The API `durationMs` starts after GitHub download or ZIP decompression, so it does not measure complete ingest time. POST wall time includes network/archive transfer and the request path, but the numbers above are single local tests and should not be generalized. The output contained no parser warnings for this JavaScript-only repository.

## Deployed service check and limitation

On October 28, 2026, `https://codedarpan-trial.onrender.com/api/health` returned HTTP 200 with `status: ok`. A safe authorization probe of the protected analysis route returned HTTP 401 with “Authentication required.” The public deployment therefore requires a signed-in account, which was not available for a live repository submission test. Local authenticated and anonymous behavior is covered by backend integration tests; deployment-specific authenticated ingestion remains to be verified by its operator.

## Performance targets not yet measured

| Target | Status | Required measurement |
| --- | --- | --- |
| Parse a representative repository in under five seconds | One 142-file sample parsed in under one second after download/decompression; general target not established | Repeat across representative repositories and languages; record commit, compressed/expanded bytes, accepted/skipped files, end-to-end wall time, parse-only time, and peak RSS on deployment-equivalent hardware. |
| Render and interact with 500+ nodes at 60 FPS | Not measured | Use a fixture with at least 500 nodes and representative edges; record browser/OS/GPU, first layout time, frame-time distribution during scripted pan/zoom/select, and memory. |
| Worst-case ZIP size/file-count processing | Not measured to configured limits | Exercise 25 MiB compressed, 5,000 files, 100 MiB expanded, 2 MiB per file, and malformed archives while sampling peak memory and request time. |

Do not extrapolate the 25-node illustrative sample or this one-repository ingestion test to the performance targets. Keep raw results and machine details with any future claims.
