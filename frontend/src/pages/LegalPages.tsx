import type { ReactNode } from 'react';
import { AnalyzerHealthStatus } from '../components/AnalyzerHealthStatus';

function LegalLayout({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main className="legal-page">
      <header className="legal-page__header">
        <a className="legal-page__brand" href="/" aria-label="CodeDarpan home">
          CodeDarpan
        </a>
        <p className="legal-page__eyebrow">{eyebrow}</p>
        <h1 className="legal-page__title">{title}</h1>
        <p className="legal-page__intro">{intro}</p>
        <p className="legal-page__notice" role="note">
          Last updated October 28, 2026. The deployment owner must keep this notice aligned with its actual hosting, retention, and contact settings.
        </p>
      </header>
      <div className="legal-page__content">{children}</div>
      <aside className="legal-page__service-status" aria-label="Analyzer service availability">
        <span>Analyzer API status</span>
        <AnalyzerHealthStatus />
      </aside>
      <nav className="legal-page__related" aria-label="Legal pages">
        <a href="/">Home</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
      </nav>
    </main>
  );
}

export function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="CodeDarpan · Privacy"
      title="Privacy notice"
      intro="This notice describes the information the CodeDarpan application is designed to process, what its current source code stores, and the deployment details that remain the responsibility of the service operator."
    >
      <section className="legal-page__section" aria-labelledby="privacy-data">
        <h2 id="privacy-data">Information processed</h2>
        <p>
          For a live analysis, the service receives the public GitHub repository URL and optional branch, tag, or commit, or the ZIP archive you submit. It fetches or reads supported source files and derives file and symbol records, dependency relationships, search results, code metrics, and analysis summaries. The parser reads source; it does not execute submitted code. The separately selected sample atlas is illustrative data and is not derived from your repository.
        </p>
        <p>
          If you create an account, the service stores your email address and a salted password hash. If Google sign-in is configured, it uses the verified email identity returned through Google OAuth. Session tokens are placed in an HttpOnly cookie. The API also stores the account identifier, repository/ref, analysis metadata, source contents, and derived results needed to reopen an analysis.
        </p>
      </section>

      <section className="legal-page__section" aria-labelledby="privacy-storage">
        <h2 id="privacy-storage">Processing and storage</h2>
        <p>
          Repository retrieval and analysis run on the CodeDarpan backend. GitHub URLs are resolved through GitHub's API and archive service. ZIP contents are checked for unsafe paths, supported file extensions, file-count limits, and expanded-size limits before parsing. Analysis records, including source contents, are serialized into a SQLite database on the backend. Account records are stored in that database as well.
        </p>
        <p>
          The backend's default analysis retention is seven days, configurable with <code>CODEDARPAN_RETENTION_DAYS</code>. In the current implementation, expired records are purged when the API process starts; there is no self-service delete control or guaranteed immediate deletion endpoint. The deployment may override the default. Hosting-provider logs, backups, database location, and provider retention settings are controlled outside this source code and are not specified here.
        </p>
      </section>

      <section className="legal-page__section" aria-labelledby="privacy-access">
        <h2 id="privacy-access">Access and third parties</h2>
        <p>
          Analysis access can be restricted to the signed-in account when <code>CODEDARPAN_REQUIRE_AUTH</code> is enabled. The current public deployment requires sign-in for analysis submissions; its unauthenticated analysis endpoint returns HTTP 401. The public health endpoint reports API reachability and does not expose repository source. Google and GitHub are contacted only for the corresponding sign-in or repository features; provider-side handling is governed by those providers' own terms and privacy policies.
        </p>
        <p>
          The source code does not configure a separate analytics product. This does not rule out hosting-platform operational logs. The project does not identify the deployment owner's legal name, privacy contact, hosting region, or backup policy; the operator must publish those details for the deployment they run.
        </p>
      </section>

      <section className="legal-page__section" aria-labelledby="privacy-controls">
        <h2 id="privacy-controls">Your choices and safe use</h2>
        <p>
          Submit only repositories and archives you have permission to share with the service, and avoid including secrets, credentials, or other sensitive material. Public GitHub access is supported; private repository authorization is not. Because analysis source is stored with its result until retention cleanup, do not treat a submission as confidential. There is no self-service account or analysis deletion flow in this version; contact the service operator through the contact channel published by the deployment owner for data requests.
        </p>
        <p>
          The sample atlas contains fixed illustrative data. It is not a live analysis, and it does not contain source submitted by another user.
        </p>
      </section>

      <section className="legal-page__section" aria-labelledby="privacy-operator">
        <h2 id="privacy-operator">Service operator</h2>
        <p>
          The project source does not provide a verified legal entity name, postal address, or privacy email. The organization or person publishing a deployment must add its identity and a working privacy contact before accepting repository submissions. This notice describes software behavior; it is not legal advice. See the <a href="/terms">Terms of use</a> or return to <a href="/">CodeDarpan home</a>.
        </p>
      </section>
    </LegalLayout>
  );
}

export function TermsPage() {
  return (
    <LegalLayout
      eyebrow="CodeDarpan · Terms"
      title="Terms of use"
      intro="Use CodeDarpan only with repositories and archives you are authorized to submit. Its atlas is a static, evidence-based aid—not a guarantee of software behavior."
    >
      <section className="legal-page__section" aria-labelledby="terms-use">
        <h2 id="terms-use">Permitted submissions</h2>
        <p>
          You may submit a public GitHub repository URL and optional ref, or a ZIP archive, only if you have the right to provide its contents for processing. Do not submit credentials, secrets, personal information, malware, or material you are not authorized to share. Private GitHub repository access is not supported. On the current public deployment, you must sign in or create an account before starting an analysis.
        </p>
        <p>
          ZIP uploads are limited by the backend to 25 MiB compressed, up to 5,000 supported source files, 100 MiB total expanded source, and 2 MiB per file. Unsupported files are skipped or reported. These limits may change with a later release.
        </p>
      </section>

      <section className="legal-page__section" aria-labelledby="terms-function">
        <h2 id="terms-function">What the service does</h2>
        <p>
          The analyzer resolves supported public GitHub archives or reads submitted ZIPs, parses eligible source files, and returns a graph, source context, search results, token and complexity estimates, and structural evidence. JavaScript, JSX, TypeScript, and TSX use a Babel AST pipeline. Other supported languages use heuristic parsers and may have incomplete results. Submitted code is parsed, not executed.
        </p>
        <p>
          Live analyses are stored in the backend database with source content for the configured retention period (seven days by default; cleanup runs when the API process starts). The operator's deployment configuration controls authentication and retention. See the <a href="/privacy">Privacy notice</a> for details and limitations.
        </p>
      </section>

      <section className="legal-page__section" aria-labelledby="terms-limits">
        <h2 id="terms-limits">Analysis limitations</h2>
        <p>
          Static relationships may miss dynamic imports, runtime dispatch, aliases, generated code, package export maps, and other behavior. Token counts and complexity are calculated estimates; heuristic language results are explicitly less precise. Churn depends on Git history and is unavailable for ZIP uploads. Onboarding suggestions, cycle findings, health indicators, and change-impact results are structural evidence, not predictions or guarantees of runtime failures, security, or fitness for a particular purpose.
        </p>
        <p>
          You remain responsible for reviewing source and analysis outputs before relying on them. Keep a backup of submitted work and do not use the service as the sole basis for a security, deployment, legal, or business decision.
        </p>
      </section>

      <section className="legal-page__section" aria-labelledby="terms-accounts">
        <h2 id="terms-accounts">Accounts and availability</h2>
        <p>
          Keep account credentials private and notify the service operator if you believe an account is being misused. Account signup currently has no email-verification or password-reset flow. The service may be unavailable or unable to analyze a repository because of network, provider, parser, or resource limits. Failed or unsupported analyses should be reported rather than replaced with sample results.
        </p>
      </section>

      <section className="legal-page__section" aria-labelledby="terms-operator">
        <h2 id="terms-operator">Operator and legal review</h2>
        <p>
          The project source does not identify the person or organization operating a specific deployment, its contact details, or governing jurisdiction. The deployment owner is responsible for publishing those details and obtaining jurisdiction-appropriate legal review before treating this page as a binding agreement. This page is plain-language product information, not legal advice. Return to <a href="/">CodeDarpan home</a> or read the <a href="/privacy">Privacy notice</a>.
        </p>
      </section>
    </LegalLayout>
  );
}

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <p className="not-found-page__eyebrow">CodeDarpan</p>
      <h1 className="not-found-page__title">Page not found</h1>
      <p className="not-found-page__message">
        This address does not match a page in CodeDarpan.
      </p>
      <a className="not-found-page__home-link" href="/">
        Return to CodeDarpan home
      </a>
    </main>
  );
}
