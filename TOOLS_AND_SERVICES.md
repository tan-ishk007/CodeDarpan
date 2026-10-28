# Tools and external-service disclosure

This project is a source-code analysis and visualization application. It does not use a generative AI model to invent repository relationships or findings.

## Main implementation tools

- **React, TypeScript, and Vite** power the web interface and production build.
- **Cytoscape.js** renders the interactive dependency graph; the UI adds graph filtering, node selection, source inspection, and neighborhood focus.
- **Express and Node.js** provide the same-origin analysis API.
- **@babel/parser and @babel/traverse** parse JavaScript, JSX, TypeScript, and TSX for imports, symbols, call sites, and cyclomatic-complexity signals.
- The backend includes **heuristic language adapters** for Python, Go, Rust, Java, C/C++, Ruby, and PHP. These are not language-specific AST parsers; their results include explicit caveats.
- **yauzl** reads ZIP archives without extracting entries to disk. The server validates archive paths and applies upload, file-count, expanded-size, and per-file limits.
- **SQLite / better-sqlite3** persists accounts and analysis records, including source content, subject to configured retention.
- **Vitest** is used for automated backend and frontend tests; **pnpm** manages the workspace.

## External services

- **GitHub REST API and codeload.github.com** are used to look up and download public repositories, resolve revisions, retrieve Git history when available, and fetch public issue or pull-request context where requested. Private repository access is not supported.
- **Google OAuth** is optional and works only when server-side OAuth credentials and callback settings are configured. Google is not required for email/password account registration.
- The production deployment is hosted by the deployment operator. The project source does not define the hosting region, platform-log retention, backup policy, or the operator's legal identity/contact; those settings must be disclosed by the operator.

## Processing and security scope

Submitted source is parsed, not executed. Repository content and derived analysis can be stored in the backend SQLite database. The default retention is seven days, with expired-row cleanup performed when the API process starts. See [Privacy](frontend/src/pages/LegalPages.tsx) and the project [README](README.md) for current limits and setup. Package versions and licenses are declared in the package manifests and lockfile and should be reviewed before redistribution.
