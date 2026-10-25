import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, FileText, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Brand from '../components/Brand';
import { setPageMeta } from '../lib/pageMeta';

function LegalLayout({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="legal-page">
      <header className="site-header"><Brand tagline /><Link className="legal-back-link" to="/"><ArrowLeft size={15} /> Back to CodeDarpan</Link></header>
      <article className="legal-document"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p className="legal-intro">{description}</p><div className="legal-review-note"><ShieldCheck size={17} /><span>Draft for review. A qualified legal professional must review this page before public service use.</span></div>{children}</article>
      <footer className="site-footer"><Brand compact /><span>Understand the code behind the code.</span><nav aria-label="Legal pages"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></nav><small>Contact information and production domain have not been provided.</small></footer>
    </main>
  );
}

export function PrivacyPage() {
  useEffect(() => setPageMeta('Privacy | CodeDarpan', 'Privacy information for the CodeDarpan frontend and its repository-analysis integration.'), []);
  return (
    <LegalLayout eyebrow="PROJECT INFORMATION / PRIVACY" title="Privacy, plainly stated." description="This page describes the current frontend build. It is not a complete policy for a future analysis service.">
      <section><h2>What this frontend does</h2><p>The current CodeDarpan project is a browser interface. The uploaded project archive did not include an analyzer backend or an existing application repository. In this build, submitting a GitHub URL or ZIP requires the documented `/api/analyses` service. If that service is unavailable, the interface reports the problem and does not silently display sample results.</p></section>
      <section><h2>Repository and ZIP data</h2><p>This frontend cannot determine how a future backend receives, processes, retains or deletes repository contents. Before enabling a backend, the operator must document what is sent, the analysis location, retention period, deletion process, service providers, access controls and any applicable transfers. Do not connect a service until those details are verified and this notice is updated.</p></section>
      <section><h2>Sample atlas</h2><p>The sample atlas is an illustrative fixture contained in the frontend. It is marked “DEMO DATA” and is not a result for a repository you submit.</p></section>
      <section><h2>Cookies and analytics</h2><p>This frontend does not implement account login, application-authored analytics or a cookie-consent banner. Project site analytics injection has been disabled. Other platform or content-delivery network analytics may remain; this page does not claim that all tracking is disabled.</p></section>
      <section><h2>Owner details and unresolved items</h2><p>No operator name, authorized contact address, jurisdiction or backend retention policy was provided. These details must be supplied and verified before production. No contact address is invented here.</p></section>
      <section><h2>Review status</h2><p>This draft needs review by a qualified privacy professional for the actual operator, service architecture and jurisdictions before publication.</p></section>
    </LegalLayout>
  );
}

export function TermsPage() {
  useEffect(() => setPageMeta('Terms | CodeDarpan', 'Terms draft for the CodeDarpan frontend and structural analysis interface.'), []);
  return (
    <LegalLayout eyebrow="PROJECT INFORMATION / TERMS" title="A map, not a guarantee." description="These terms are a product-information draft for the current frontend, not legal advice or a complete service agreement.">
      <section><h2>Current availability</h2><p>The frontend is an interface for repository exploration. A compatible analysis backend is not included in this build. Live analysis, GitHub issue discovery, history metrics, onboarding recommendations and pull-request impact are available only when the documented backend endpoints return supported data.</p></section>
      <section><h2>Structural estimates</h2><p>Static relationships and impact paths can be incomplete when code uses dynamic dispatch, unsupported syntax or unresolved dependencies. A structural blast-radius estimate is not a prediction of every runtime failure. Review source, tests and operational context before making engineering decisions.</p></section>
      <section><h2>Repository and ZIP content</h2><p>Only submit source material you are authorized to provide. The eventual backend operator must disclose its processing and retention practices before accepting repository content. This frontend does not execute uploaded repository code.</p></section>
      <section><h2>Sample atlas</h2><p>The sample atlas is illustrative interface data, marked “DEMO DATA”. It is not analyzer output and must not be relied on as an assessment of another repository.</p></section>
      <section><h2>Operator and governing terms</h2><p>The operator identity, contact address, jurisdiction, availability commitments and service terms have not been supplied. These items require owner input and qualified legal review before a production launch.</p></section>
    </LegalLayout>
  );
}

export function NotFoundPage() {
  useEffect(() => setPageMeta('Page not found | CodeDarpan', 'This CodeDarpan route could not be found. Return to the repository atlas landing page.'), []);
  return (
    <main className="not-found-page"><header className="site-header"><Brand tagline /><Link className="legal-back-link" to="/"><ArrowLeft size={15} /> Back to CodeDarpan</Link></header><section className="not-found-content"><span className="not-found-symbol"><FileText size={24} /></span><span className="eyebrow">404 / UNCHARTED PATH</span><h1>This route is not on the map.</h1><p>The address may have changed or the page may not exist.</p><Link to="/" className="button-primary">Return to the atlas <ArrowRight size={16} /></Link></section></main>
  );
}
