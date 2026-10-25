import { useEffect, useState, type DragEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Archive, Braces, Check, ChevronRight, CircleAlert, GitBranch, Layers3, LoaderCircle, Network, ShieldCheck, UploadCloud } from 'lucide-react';
import Brand from '../components/Brand';
import StatusNotice from '../components/StatusNotice';
import { ApiError, createGitHubAnalysis, createZipAnalysis } from '../lib/api';
import { setPageMeta } from '../lib/pageMeta';

const HERO_ART = '/manus-storage/technical-atlas-hero_ece6f518.webp';
const EMPTY_ATLAS_ART = '/manus-storage/empty-atlas_435e72d5.webp';

function validateRepositoryUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    const parts = url.pathname.split('/').filter(Boolean);
    if (url.protocol !== 'https:' || url.hostname.toLowerCase() !== 'github.com' || parts.length !== 2) {
      return 'Enter a public GitHub repository URL, such as https://github.com/owner/repository.';
    }
    const [owner, repository] = parts;
    if (!/^[A-Za-z0-9-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(repository.replace(/\.git$/i, ''))) {
      return 'Check the owner and repository name in that URL.';
    }
    return null;
  } catch {
    return 'Enter a valid https://github.com/owner/repository URL.';
  }
}

function errorTitle(error: ApiError) {
  if (error.code === 'API_UNAVAILABLE') return 'Analyzer unavailable in this build';
  if (error.status === 429) return 'Request rate limited';
  if (error.status === 413) return 'Upload exceeds the service limit';
  if (error.status === 422) return 'Repository input is unsupported or empty';
  if (error.status === 400) return 'Repository URL could not be accepted';
  return 'Analysis did not start';
}

export default function HomePage() {
  const navigate = useNavigate();
  const [inputMode, setInputMode] = useState<'github' | 'zip'>('github');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [ref, setRef] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [busyAction, setBusyAction] = useState<'github' | 'zip' | null>(null);
  const busy = busyAction !== null;
  const [error, setError] = useState<ApiError | null>(null);
  const [localError, setLocalError] = useState('');

  useEffect(() => setPageMeta('CodeDarpan | Understand the code behind the code', 'Explore repository structure with an evidence-backed, interactive dependency atlas.'), []);

  const acceptFile = (candidate?: File) => {
    setLocalError('');
    setError(null);
    if (!candidate) return;
    if (!candidate.name.toLowerCase().endsWith('.zip')) {
      setFile(null);
      setLocalError('Choose a .zip archive. The analysis service applies the authoritative size and safety limits.');
      return;
    }
    setFile(candidate);
  };

  const startGitHub = async () => {
    setLocalError('');
    setError(null);
    const validationError = validateRepositoryUrl(repositoryUrl);
    if (validationError) { setLocalError(validationError); return; }
    setBusyAction('github');
    try {
      const result = await createGitHubAnalysis(repositoryUrl.trim(), ref.trim() || undefined);
      navigate(`/workspace?runId=${encodeURIComponent(result.runId)}`);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason : new ApiError('The analysis request did not complete.'));
    } finally {
      setBusyAction(null);
    }
  };

  const startZip = async () => {
    setLocalError('');
    setError(null);
    if (!file) { setLocalError('Choose a ZIP archive before starting analysis.'); return; }
    setBusyAction('zip');
    try {
      const result = await createZipAnalysis(file);
      navigate(`/workspace?runId=${encodeURIComponent(result.runId)}`);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason : new ApiError('The ZIP analysis request did not complete.'));
    } finally {
      setBusyAction(null);
    }
  };

  const submitGitHub = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); void startGitHub(); };
  const submitZip = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); void startZip(); };
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (busy) { setDragging(false); return; }
    setDragging(false);
    acceptFile(event.dataTransfer.files[0]);
  };

  return (
    <main className="landing-page">
      <header className="site-header">
        <Brand tagline />
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#capabilities">Explore</a>
          <a href="#how-it-works">How it works</a>
          <a className="nav-workspace" href="/workspace">Open workspace <ArrowUpRight size={14} aria-hidden="true" /></a>
        </nav>
      </header>

      <section className="landing-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow hero-overline"><span className="eyebrow-rule" /> REPOSITORY INTELLIGENCE / 01</div>
          <h1 id="hero-title">The architecture is already there. <em>Make it visible.</em></h1>
          <p className="hero-tagline">Understand the code behind the code.</p>
          <p className="hero-description">Trace how a repository fits together. Explore dependencies, inspect source and follow the relationships that shape a codebase.</p>
          <section className="intake-card" aria-label="Analyze a repository">
            <div className="intake-heading"><span className="eyebrow">START WITH A REPOSITORY</span><span className="intake-note"><ShieldCheck size={13} /> Public repositories and ZIP archives</span></div>
            <div className="intake-tabs" role="group" aria-label="Repository source type">
              <button type="button" disabled={busy} aria-pressed={inputMode === 'github'} aria-controls="github-intake" className={inputMode === 'github' ? 'selected' : ''} onClick={() => { setInputMode('github'); setError(null); setLocalError(''); }}><GitBranch size={15} /> GitHub URL</button>
              <button type="button" disabled={busy} aria-pressed={inputMode === 'zip'} aria-controls="zip-intake" className={inputMode === 'zip' ? 'selected' : ''} onClick={() => { setInputMode('zip'); setError(null); setLocalError(''); }}><Archive size={15} /> ZIP archive</button>
            </div>
            {inputMode === 'github' ? (
              <form id="github-intake" className="intake-form" onSubmit={submitGitHub}>
                <label className="field-label" htmlFor="repository-url">Repository URL</label>
                <div className="url-input-wrap"><GitBranch size={16} aria-hidden="true" /><input id="repository-url" type="url" autoComplete="url" placeholder="https://github.com/owner/repository" value={repositoryUrl} onChange={(event) => { setRepositoryUrl(event.target.value); setLocalError(''); }} required aria-describedby="ref-help" /></div>
                <div className="ref-row"><label className="field-label" htmlFor="repository-ref">Ref <span>(optional)</span></label><input id="repository-ref" type="text" placeholder="main, tag or commit" value={ref} onChange={(event) => setRef(event.target.value)} /><span id="ref-help">Leave blank to use the repository default.</span></div>
                <button className="button-primary analyze-button" type="submit" disabled={busy}>{busy ? <><LoaderCircle size={16} className="spin" /> Connecting to analyzer…</> : <>Analyze repository <ArrowRight size={16} /></>}</button>
              </form>
            ) : (
              <form id="zip-intake" className="intake-form" onSubmit={submitZip}>
                <label className={`drop-zone${dragging ? ' is-dragging' : ''}${file ? ' has-file' : ''}`} aria-disabled={busy} onDragOver={(event) => { if (busy) return; event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}>
                  <input type="file" accept=".zip,application/zip" disabled={busy} onChange={(event) => acceptFile(event.target.files?.[0])} aria-label="Choose repository ZIP archive" />
                  <span className="upload-mark">{file ? <Check size={20} /> : <UploadCloud size={20} />}</span>
                  <strong>{file ? file.name : 'Drop a repository ZIP here'}</strong>
                  <span>{file ? 'Selected for upload to the analysis service' : 'or browse your files · ZIP format'}</span>
                  <span className="drop-browse">{file ? 'Choose a different file' : 'Browse archive'}</span>
                </label>
                <button className="button-primary analyze-button" type="submit" disabled={busy}>{busy ? <><LoaderCircle size={16} className="spin" /> {busyAction === 'zip' ? 'Uploading ZIP to analyzer…' : 'Connecting to analyzer…'}</> : <>Analyze ZIP <ArrowRight size={16} /></>}</button>
              </form>
            )}
            {localError && <div className="form-error" role="alert"><CircleAlert size={15} />{localError}</div>}
            {error && <StatusNotice kind="error" title={errorTitle(error)} message={error.status === 429 ? `${error.message} Wait before retrying.` : error.message} stage={error.stage} code={error.code} status={error.status} retryable={error.retryable} onRetry={() => inputMode === 'github' ? void startGitHub() : void startZip()} />}
            <button type="button" className="sample-link" onClick={() => navigate('/workspace?demo=1')}>Explore sample atlas <ArrowUpRight size={14} /></button>
            <p className="intake-disclosure">Live analysis requires a compatible analyzer API. Sample content is illustrative and labelled as demo data.</p>
          </section>
        </div>
        <figure className="hero-art-wrap">
          <img className="hero-art" src={HERO_ART} alt="A technically structured dependency atlas showing grouped modules, directed routes and a small circular relationship." fetchPriority="high" />
          <figcaption><span>DEPENDENCY SYSTEM / FIG. 01</span><span>STRUCTURE IS EVIDENCE</span></figcaption>
          <div className="hero-coordinate hero-coordinate-top" aria-hidden="true">41° 24′ 12.2″ N</div>
          <div className="hero-coordinate hero-coordinate-bottom" aria-hidden="true">REPOSITORY / REVISION / GRAPH</div>
        </figure>
      </section>

      <section className="capability-row" id="capabilities" aria-label="CodeDarpan capabilities">
        <article><span className="capability-icon"><Network size={17} /></span><span><strong>Explore</strong><small>Follow the dependency graph</small></span></article>
        <article><span className="capability-icon"><CircleAlert size={17} /></span><span><strong>Diagnose</strong><small>Inspect returned health evidence</small></span></article>
        <article><span className="capability-icon"><GitBranch size={17} /></span><span><strong>Plan</strong><small>Trace structural change impact</small></span></article>
        <article><span className="capability-icon"><Layers3 size={17} /></span><span><strong>Onboard</strong><small>Follow a reasoned file path</small></span></article>
      </section>

      <section className="how-section" id="how-it-works" aria-labelledby="how-title">
        <div className="how-heading"><div><span className="eyebrow">FROM SOURCE TO STRUCTURE</span><h2 id="how-title">A map, built from the code.</h2></div><p>Read the relationships. Check the source. Keep every conclusion tied to evidence.</p></div>
        <div className="flow-line" role="list" aria-label="Ingest, parse, resolve and explore flow">
          <div role="listitem"><span className="flow-number">01</span><span className="flow-icon"><Archive size={18} /></span><strong>Ingest</strong><small>Repository or ZIP</small></div>
          <ChevronRight className="flow-arrow" size={18} aria-hidden="true" />
          <div role="listitem"><span className="flow-number">02</span><span className="flow-icon"><Braces size={18} /></span><strong>Parse</strong><small>Syntax and declarations</small></div>
          <ChevronRight className="flow-arrow" size={18} aria-hidden="true" />
          <div role="listitem"><span className="flow-number">03</span><span className="flow-icon"><GitBranch size={18} /></span><strong>Resolve</strong><small>Typed relationships</small></div>
          <ChevronRight className="flow-arrow" size={18} aria-hidden="true" />
          <div role="listitem"><span className="flow-number">04</span><span className="flow-icon"><Network size={18} /></span><strong>Explore</strong><small>Graph and source</small></div>
        </div>
      </section>

      <section className="honesty-strip"><img src={EMPTY_ATLAS_ART} alt="" loading="lazy" /><div><span className="eyebrow">CLEAR BY DESIGN</span><p>Live analysis appears only when the documented analyzer API returns it. A separate sample atlas is available for exploring the interface.</p></div><a href="/workspace?demo=1">Open the sample <ArrowRight size={15} /></a></section>

      <footer className="site-footer"><Brand compact /><span>Understand the code behind the code.</span><nav aria-label="Legal pages"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav><small>Frontend demo. Backend analysis is not included in this build.</small></footer>
    </main>
  );
}
