# Analyzer API contract reference

This list mirrors the routes named in the supplied final checklist. The analyzer backend was not included; these are integration targets, not implemented server handlers. Keep requests same-origin and relative. Do not add new routes without an updated source-of-truth contract.

| Method | Route | Frontend use |
|---|---|---|
| `POST` | `/api/analyses` | JSON `{ repositoryUrl, ref? }` for GitHub; multipart form field `file` for ZIP. The response returns a `runId` and initial status. |
| `GET` | `/api/analyses/:runId` | Poll the documented analysis snapshot, including status, repository/revision, file/node/edge counts, duration and warnings. |
| `GET` | `/api/analyses/:runId/events` | Server-sent events with returned `stage`, `progress`, `status` and `message` values. No progress percentage is invented. |
| `GET` | `/api/analyses/:runId/graph?view=file&depth=1` | Obtain file-level `{nodes, edges, groups}` for the atlas at the selected level/depth. The source example documents depth `1`; valid upper bounds are not specified, so selector values must stay configurable and API validation remains authoritative. |
| `GET` | `/api/analyses/:runId/files/:fileId` | Load the selected returned file record/source and its imported/dependent relationships. |
| `GET` | `/api/analyses/:runId/search?q=...&kind=...` | Search returned files/functions/symbols; successful payload is `{results: [{nodeId, name, path, line, kind, score}]}`. |
| `GET` | `/api/analyses/:runId/health` | Request `{score, confidence, factors, findings, historyAvailable}` for returned health evidence/heatmap data. |
| `GET` | `/api/analyses/:runId/onboarding?role=...&issueUrl=...` | Request ordered contributor path for a selected role and optional issue context. |
| `GET` | `/api/analyses/:runId/issues?labels=good-first-issue,help-wanted` | Discover relevant public issues when supported. |
| `GET` | `/api/analyses/:runId/impact?nodeId=...&depth=3` | Request selected-file impact. Results remain structural estimates. |
| `POST` | `/api/analyses/:runId/pr-impact` | JSON `{prUrl}` for public pull-request impact. Success returns `{pr, changedFiles, mappedNodes, direct, transitive, relatedTests, unresolved, caveat}`. |
| `DELETE` | `/api/analyses/:runId` | Delete an analysis resource when a future UI explicitly offers that action; the current UI does not infer cancellation from deletion. |

## Contract limits

The checklist documents route names and selected request values, but not every detailed response field for graph/source/health/onboarding/impact. The UI therefore renders only values in the typed contract when present, and reports missing/unsupported API responses instead of fabricating content. ZIP size and safety validation remain backend responsibilities; the browser checks the `.zip` suffix for usability only. GitHub access, authentication, rate limits, path safety, retention and deletion policy need backend verification.
