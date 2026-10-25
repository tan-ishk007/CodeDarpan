import { useEffect, useState, type FormEvent } from 'react';
import { ArrowDownRight, ArrowUpRight, ExternalLink, GitBranch, LoaderCircle, ShieldAlert } from 'lucide-react';
import StatusNotice from '../StatusNotice';
import { ApiError, getHealth, getImpact, getIssues, getOnboarding, getPrImpact } from '../../lib/api';
import { DEMO_HEALTH, DEMO_IMPACT, DEMO_ISSUES, DEMO_ONBOARDING } from '../../data/demo';
import type { GraphNode, HealthResponse, ImpactItem, ImpactResponse, IssueItem, OnboardingResponse } from '../../types';

function evidenceText(value?: string | string[]) {
  return Array.isArray(value) ? value.join(' · ') : value ?? '';
}

function unavailableCopy(error: ApiError) {
  return error.code === 'API_UNAVAILABLE' ? 'Not available in this build. Connect the documented analysis endpoint to show live results.' : error.message;
}

function PanelTitle({ eyebrow, title, demo }: { eyebrow: string; title: string; demo: boolean }) {
  return <div className="mode-panel-title"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{demo && <span className="mini-demo-label">DEMO DATA</span>}</div>;
}

function ChurnComplexityHeatmap({ nodes, historyAvailable }: { nodes: GraphNode[]; historyAvailable?: boolean }) {
  const points = nodes.filter((node) => typeof node.complexity === 'number' && typeof node.churnAdded === 'number' && typeof node.churnDeleted === 'number').map((node) => ({ path: node.path, complexity: node.complexity!, churn: node.churnAdded! + node.churnDeleted! }));
  if (historyAvailable === false) return <p className="heatmap-empty">Git history unavailable. No churn value is plotted as zero.</p>;
  if (!points.length) return <p className="heatmap-empty">No returned complexity and churn pairs are available for this graph.</p>;
  const maxChurn = Math.max(1, ...points.map((point) => point.churn));
  const maxComplexity = Math.max(1, ...points.map((point) => point.complexity));
  const bins = new Array(25).fill(0) as number[];
  const assignments = points.map((point) => {
    const x = Math.min(4, Math.floor((point.churn / maxChurn) * 5));
    const y = Math.min(4, Math.floor((point.complexity / maxComplexity) * 5));
    const bin = (4 - y) * 5 + x;
    bins[bin] += 1;
    return { ...point, bin };
  });
  return (
    <figure className="heatmap-figure" aria-label={`Complexity and churn heatmap from ${points.length} returned graph nodes. Higher churn is to the right and higher complexity is at the top.`}>
      <svg viewBox="0 0 250 174" role="img" aria-label="Observed-value heatmap. Each cell label is a returned-node count.">
        <title>Complexity × churn heatmap</title>
        <desc>Five by five observed-value buckets. It uses only graph nodes that returned both complexity and added and deleted churn values.</desc>
        {bins.map((count, index) => {
          const column = index % 5;
          const row = Math.floor(index / 5);
          const fill = count === 0 ? '#F0E9DD' : count === 1 ? '#D0B889' : count < 4 ? '#A8906A' : '#8F3030';
          return <g key={index}><rect x={36 + column * 39} y={16 + row * 24} width="36" height="21" fill={fill} stroke="#D8CCB7" strokeWidth=".7" />{count > 0 && <text x={54 + column * 39} y={30 + row * 24} textAnchor="middle" fill={count > 3 ? '#FAF7F0' : '#1D1A18'} fontSize="9">{count}</text>}</g>;
        })}
        <text x="133" y="158" textAnchor="middle" fill="#6E6961" fontSize="8">CHURN / ADDED + DELETED</text>
        <text x="11" y="77" textAnchor="middle" fill="#6E6961" fontSize="8" transform="rotate(-90 11 77)">COMPLEXITY</text>
        <text x="36" y="151" fill="#6E6961" fontSize="7">0</text><text x="205" y="151" textAnchor="end" fill="#6E6961" fontSize="7">{maxChurn}</text>
        <text x="29" y="137" textAnchor="end" fill="#6E6961" fontSize="7">0</text><text x="29" y="22" textAnchor="end" fill="#6E6961" fontSize="7">{maxComplexity}</text>
      </svg>
      <figcaption>{points.length} returned entities, bucketed over this dataset's observed range. Cell labels show entity counts.</figcaption>
      <ul className="sr-only">{assignments.map((point, index) => <li key={`${point.path}-${index}`}>{point.path}: complexity {point.complexity}; added and deleted churn total {point.churn}.</li>)}</ul>
    </figure>
  );
}

export function DiagnosePanel({ runId, demo, nodes, onFocus }: { runId: string | null; demo: boolean; nodes: GraphNode[]; onFocus: (nodeId: string) => void }) {
  const [data, setData] = useState<HealthResponse | null>(demo ? DEMO_HEALTH : null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(!demo && Boolean(runId));

  useEffect(() => {
    if (demo) { setData(DEMO_HEALTH); setError(null); setLoading(false); return; }
    if (!runId) { setData(null); setError(null); setLoading(false); return; }
    let active = true;
    setLoading(true); setError(null); setData(null);
    void getHealth(runId).then((result) => { if (active) setData(result); }).catch((reason) => { if (active) setError(reason instanceof ApiError ? reason : new ApiError('Health findings could not be loaded.')); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [runId, demo]);

  return (
    <div className="mode-panel-content">
      <PanelTitle eyebrow="MODE / DIAGNOSE" title="Structural health" demo={demo} />
      {loading && <p className="inline-loading"><LoaderCircle size={15} className="spin" /> Loading health evidence…</p>}
      {error && <StatusNotice kind="warning" title="Health endpoint unavailable" message={unavailableCopy(error)} stage={error.stage} />}
      {!loading && !error && !data && <StatusNotice title="No health result returned" message="A health score is shown only when the analyzer provides it." />}
      {data && (
        <>
          <div className="health-score-block"><span className="eyebrow">RETURNED HEALTH SCORE</span><strong className={typeof data.score === 'number' ? undefined : 'value-not-returned'}>{typeof data.score === 'number' ? data.score : 'Not returned'}</strong><span>{data.confidence !== undefined ? `Confidence: ${String(data.confidence)}` : 'Score confidence not returned'}</span></div>
          {data.historyAvailable === false && <div className="history-unavailable"><ShieldAlert size={16} /><span>Git history unavailable. Churn is not treated as zero.</span></div>}
          <section className="mode-section"><div className="section-rule-heading"><span>COMPLEXITY × CHURN HEATMAP</span><span>RETURNED VALUES</span></div><ChurnComplexityHeatmap nodes={nodes} historyAvailable={data.historyAvailable} /></section>
          <section className="mode-section"><div className="section-rule-heading"><span>FACTORS</span><span>{data.factors?.length ?? 0}</span></div>
            {data.factors?.length ? data.factors.map((factor, index) => <div className="factor-row" key={`${factor.name}-${index}`}><div className="factor-top"><strong>{factor.name}</strong><span>{factor.available === false ? 'Unavailable' : factor.score ?? factor.value ?? 'Value not returned'}</span></div>{factor.definition && <p>{factor.definition}</p>}{factor.evidence && <small>{evidenceText(factor.evidence)}</small>}</div>) : <p className="muted-copy">No factor breakdown was returned.</p>}
          </section>
          <section className="mode-section"><div className="section-rule-heading"><span>FINDINGS / EVIDENCE</span><span>{data.findings?.length ?? 0}</span></div>
            {data.findings?.length ? data.findings.map((finding, index) => <button type="button" className="finding-row" key={finding.id ?? `${finding.title}-${index}`} onClick={() => finding.nodeId && onFocus(finding.nodeId)} disabled={!finding.nodeId}><span className="finding-marker" aria-hidden="true" /><span className="finding-body"><strong>{finding.title ?? finding.kind ?? 'Finding'}</strong><small>{finding.path ?? finding.message ?? finding.kind ?? 'Evidence returned by the analyzer'}</small>{finding.evidence && <small>{evidenceText(finding.evidence)}</small>}</span><span className="finding-severity">{finding.severity ?? finding.confidence ?? 'reported'}</span></button>) : <p className="muted-copy">No findings were returned.</p>}
          </section>
          <section className="mode-section"><div className="section-rule-heading"><span>RETURNED RISK SCORES</span><span>{nodes.filter((node) => typeof node.riskScore === 'number').length}</span></div>
            {nodes.filter((node) => typeof node.riskScore === 'number').sort((a, b) => (b.riskScore ?? 0) - (a.riskScore ?? 0)).slice(0, 5).map((node) => <button type="button" className="hotspot-row" key={node.id} onClick={() => onFocus(node.id)}><span>{node.path}</span><strong>{node.riskScore}</strong></button>)}
            {!nodes.some((node) => typeof node.riskScore === 'number') && <p className="muted-copy">No node risk scores were returned.</p>}
          </section>
          {demo && <p className="demo-disclaimer">Sample score and evidence are illustrative fixture values, not a repository assessment.</p>}
        </>
      )}
    </div>
  );
}

export function OnboardingPanel({ runId, demo, onFocus }: { runId: string | null; demo: boolean; onFocus: (nodeId: string) => void }) {
  const [role, setRole] = useState('backend');
  const [issueUrl, setIssueUrl] = useState('');
  const [appliedIssueUrl, setAppliedIssueUrl] = useState('');
  const [data, setData] = useState<OnboardingResponse | null>(demo ? DEMO_ONBOARDING : null);
  const [issues, setIssues] = useState<IssueItem[]>(demo ? DEMO_ISSUES : []);
  const [loading, setLoading] = useState(!demo && Boolean(runId));
  const [error, setError] = useState<ApiError | null>(null);
  const [issueError, setIssueError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (demo) { setData(DEMO_ONBOARDING); setIssues(DEMO_ISSUES); setError(null); setIssueError(null); setLoading(false); return; }
    if (!runId) { setData(null); setIssues([]); setError(null); setIssueError(null); setLoading(false); return; }
    let active = true;
    setLoading(true); setError(null); setIssueError(null); setData(null); setIssues([]);
    void getOnboarding(runId, role, appliedIssueUrl || undefined).then((result) => { if (active) setData(result); }).catch((reason) => { if (active) setError(reason instanceof ApiError ? reason : new ApiError('Contributor path could not be loaded.')); }).finally(() => { if (active) setLoading(false); });
    void getIssues(runId).then((result) => { if (active) setIssues(result.issues ?? []); }).catch((reason) => { if (active) setIssueError(reason instanceof ApiError ? reason : new ApiError('Issue lookup failed.')); });
    return () => { active = false; };
  }, [runId, role, appliedIssueUrl, demo]);

  const applyIssueContext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAppliedIssueUrl(issueUrl.trim());
  };

  return (
    <div className="mode-panel-content">
      <PanelTitle eyebrow="MODE / ONBOARD" title="A path into the code" demo={demo} />
      <label className="field-label role-select-label" htmlFor="contributor-role">Contributor focus</label>
      <select id="contributor-role" className="field-select" value={role} onChange={(event) => setRole(event.target.value)}><option value="backend">Backend</option><option value="frontend">Frontend</option><option value="tests">Tests</option><option value="general">General</option></select>
      <form className="onboarding-issue-form" onSubmit={applyIssueContext}><label className="field-label" htmlFor="onboarding-issue-url">Optional public issue URL</label><input id="onboarding-issue-url" type="url" value={issueUrl} disabled={demo} onChange={(event) => setIssueUrl(event.target.value)} placeholder={demo ? 'Unavailable in the local fixture' : 'https://github.com/owner/repository/issues/123'} /><button type="submit" className="text-button" disabled={demo || !issueUrl.trim()}>Use issue context</button></form>
      {loading && <p className="inline-loading"><LoaderCircle size={15} className="spin" /> Requesting the ordered file path…</p>}
      {error && <StatusNotice kind="warning" title="Contributor path unavailable" message={unavailableCopy(error)} stage={error.stage} />}
      {!loading && !error && data && (
        <section className="mode-section onboarding-route"><div className="section-rule-heading"><span>ORDERED FILE PATH</span><span>{data.steps.length}</span></div>
          {data.steps.length ? data.steps.map((step) => <button type="button" className="onboarding-step" key={`${step.order}-${step.nodeId}`} onClick={() => onFocus(step.nodeId)}><span className="step-index">{String(step.order).padStart(2, '0')}</span><span className="step-copy"><strong>{step.nodeId}</strong><span>{step.reason}</span>{step.evidence && <small>{evidenceText(step.evidence)}</small>}</span><ArrowDownRight size={15} aria-hidden="true" /></button>) : <p className="muted-copy">No contributor steps were returned for this repository.</p>}
        </section>
      )}
      <section className="mode-section"><div className="section-rule-heading"><span>GOOD FIRST ISSUES</span><span>{issues.length}</span></div>
        {issueError && <StatusNotice kind="warning" title="Issue lookup failed" message={unavailableCopy(issueError)} />}
        {issues.map((issue) => <article className="issue-row" key={issue.number}><a href={issue.url} target="_blank" rel="noreferrer"><strong>#{issue.number} {issue.title}</strong><ExternalLink size={13} /></a><div className="issue-labels">{issue.labels.map((label) => <span key={label}>{label}</span>)}</div><p>Candidate files: {issue.candidateFiles.join(', ') || 'Not returned'}</p><small>{evidenceText(issue.evidence)}</small></article>)}
        {!issues.length && !issueError && <p className="muted-copy">No relevant public issues were returned. Repository exploration remains available.</p>}
      </section>
      {demo && <p className="demo-disclaimer">Path and issue association are illustrative sample data.</p>}
    </div>
  );
}

function impactItems(items?: ImpactItem[]) { return items ?? []; }

function ImpactList({ title, rows, onFocus }: { title: string; rows: ImpactItem[]; onFocus: (nodeId: string) => void }) {
  return <section className="mode-section"><div className="section-rule-heading"><span>{title}</span><span>{rows.length}</span></div>{rows.length ? rows.map((row, index) => <button type="button" className="impact-row" key={`${row.nodeId ?? row.path ?? row.name}-${index}`} onClick={() => row.nodeId && onFocus(row.nodeId)} disabled={!row.nodeId}><GitBranch size={14} /><span><strong>{row.path ?? row.name ?? row.nodeId ?? 'Returned dependency'}</strong>{row.evidence && <small>{evidenceText(row.evidence)}</small>}</span>{row.nodeId && <ArrowUpRight size={13} />}</button>) : <p className="muted-copy">No items returned.</p>}</section>;
}

export function ImpactPanel({ runId, selectedId, repositoryUrl, demo, onFocus }: { runId: string | null; selectedId: string | null; repositoryUrl?: string; demo: boolean; onFocus: (nodeId: string) => void }) {
  const [impact, setImpact] = useState<ImpactResponse | null>(demo ? DEMO_IMPACT : null);
  const [loading, setLoading] = useState(!demo && Boolean(runId && selectedId));
  const [error, setError] = useState<ApiError | null>(null);
  const [prUrl, setPrUrl] = useState('');
  const [prImpact, setPrImpact] = useState<ImpactResponse | null>(null);
  const [prError, setPrError] = useState<ApiError | null>(null);
  const [prLoading, setPrLoading] = useState(false);
  const [demoPrOpen, setDemoPrOpen] = useState(false);

  useEffect(() => {
    if (demo) { setImpact(DEMO_IMPACT); setError(null); setLoading(false); return; }
    if (!runId || !selectedId) { setImpact(null); setError(null); setLoading(false); return; }
    let active = true;
    setLoading(true); setError(null); setImpact(null);
    void getImpact(runId, selectedId, 3).then((result) => { if (active) setImpact(result); }).catch((reason) => { if (active) setError(reason instanceof ApiError ? reason : new ApiError('Selected-file impact could not be loaded.')); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [runId, selectedId, demo]);

  const submitPr = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPrError(null); setPrImpact(null);
    if (!runId) { setPrError(new ApiError('A live analysis run is required for PR impact.')); return; }
    try {
      const parsed = new URL(prUrl.trim());
      const pathParts = parsed.pathname.split('/').filter(Boolean);
      if (parsed.protocol !== 'https:' || parsed.hostname.toLowerCase() !== 'github.com' || pathParts.length !== 4 || pathParts[2] !== 'pull' || !/^\d+$/.test(pathParts[3])) throw new Error('Use a public GitHub pull-request URL in the form github.com/owner/repository/pull/number.');
      if (repositoryUrl) {
        const analyzed = new URL(repositoryUrl).pathname.split('/').filter(Boolean).slice(0, 2).map((part) => part.replace(/\.git$/i, '').toLowerCase()).join('/');
        const pullRequestRepo = pathParts.slice(0, 2).map((part) => part.replace(/\.git$/i, '').toLowerCase()).join('/');
        if (analyzed && analyzed !== pullRequestRepo) throw new Error('This pull request belongs to a different repository than the selected analysis.');
      }
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Enter a valid public GitHub pull-request URL.';
      setPrError(new ApiError(message, { code: message.includes('different repository') ? 'DIFFERENT_REPOSITORY' : 'INVALID_PR_URL' }));
      return;
    }
    setPrLoading(true);
    try { setPrImpact(await getPrImpact(runId, prUrl.trim())); }
    catch (reason) { setPrError(reason instanceof ApiError ? reason : new ApiError('Pull-request impact could not be loaded.')); }
    finally { setPrLoading(false); }
  };

  return (
    <div className="mode-panel-content">
      <PanelTitle eyebrow="MODE / PLAN" title="Change impact" demo={demo} />
      <p className="panel-explainer">A structural blast-radius estimate from returned graph relationships, not a prediction of every runtime failure.</p>
      {!selectedId && !demo && <StatusNotice title="Choose a file first" message="Select a file in the tree or atlas to request file-level impact." />}
      {loading && <p className="inline-loading"><LoaderCircle size={15} className="spin" /> Loading returned impact paths…</p>}
      {error && <StatusNotice kind="warning" title="File impact unavailable" message={unavailableCopy(error)} stage={error.stage} />}
      {impact && !loading && <><ImpactList title="DIRECT DEPENDENTS" rows={impactItems(impact.direct)} onFocus={onFocus} /><ImpactList title="TRANSITIVE DEPENDENTS" rows={impactItems(impact.transitive)} onFocus={onFocus} /><ImpactList title="RELATED TESTS" rows={impactItems(impact.relatedTests)} onFocus={onFocus} /><ImpactList title="UNRESOLVED RELATIONSHIPS" rows={impactItems(impact.unresolved)} onFocus={onFocus} />{impact.caveat && <p className="impact-caveat">{impact.caveat}</p>}</>}
      <section className="mode-section pr-impact-section"><div className="section-rule-heading"><span>PUBLIC PULL REQUEST</span></div>
        {demo ? <><p className="muted-copy">This sample includes a labeled fixture scenario. It does not analyze an entered pull request.</p><button type="button" className="button-secondary" onClick={() => setDemoPrOpen((open) => !open)}>{demoPrOpen ? 'Hide sample PR impact' : 'Open sample PR impact'} <ArrowUpRight size={14} /></button>{demoPrOpen && <div className="demo-pr-result"><span className="mini-demo-label">DEMO DATA</span><strong>Sample PR #24 · parser boundary changes</strong><p>Changed file: `src/parser/babelAdapter.ts`</p><p>Illustrative direct and transitive relationships appear in the sample graph.</p></div>}</> : <form className="pr-form" onSubmit={submitPr}><label className="field-label" htmlFor="pr-url">Pull-request URL</label><input id="pr-url" type="url" value={prUrl} onChange={(event) => setPrUrl(event.target.value)} placeholder="https://github.com/owner/repository/pull/123" required /><button className="button-secondary" type="submit" disabled={prLoading}>{prLoading ? <LoaderCircle size={14} className="spin" /> : <GitBranch size={14} />} Analyze public PR</button>{prError && <StatusNotice kind="warning" title={prError.status === 429 ? 'Pull-request lookup rate limited' : prError.status === 404 || prError.status === 403 ? 'Pull request is private or unavailable' : 'Pull-request analysis unavailable'} message={unavailableCopy(prError)} stage={prError.stage} code={prError.code} status={prError.status} />}{prImpact && <>{prImpact.pr && <p className="muted-copy">Returned pull request: {prImpact.pr.title ?? prImpact.pr.url ?? `#${prImpact.pr.number ?? ''}`}</p>}<ImpactList title="CHANGED FILES" rows={impactItems(prImpact.changedFiles)} onFocus={onFocus} /><ImpactList title="MAPPED NODES" rows={impactItems(prImpact.mappedNodes)} onFocus={onFocus} /><ImpactList title="DIRECT IMPACT" rows={impactItems(prImpact.direct)} onFocus={onFocus} /><ImpactList title="TRANSITIVE IMPACT" rows={impactItems(prImpact.transitive)} onFocus={onFocus} /><ImpactList title="RELATED TESTS" rows={impactItems(prImpact.relatedTests)} onFocus={onFocus} /><ImpactList title="UNRESOLVED RELATIONSHIPS" rows={impactItems(prImpact.unresolved)} onFocus={onFocus} />{prImpact.caveat && <p className="impact-caveat">{prImpact.caveat}</p>}</>}</form>}
      </section>
      {demo && <p className="demo-disclaimer">All displayed impact paths are illustrative fixture values.</p>}
    </div>
  );
}
