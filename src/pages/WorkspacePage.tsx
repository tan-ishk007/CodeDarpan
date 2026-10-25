import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock3, GitBranch, LoaderCircle, Search, XCircle } from 'lucide-react';
import AtlasGraph from '../components/graph/AtlasGraph';
import Brand from '../components/Brand';
import StatusNotice from '../components/StatusNotice';
import FileTree from '../components/explorer/FileTree';
import NodeInspector from '../components/explorer/NodeInspector';
import { DiagnosePanel, ImpactPanel, OnboardingPanel } from '../components/intelligence/ModePanels';
import { DEMO_GRAPH, DEMO_NODES, DEMO_REPOSITORY, DEMO_SNAPSHOT, getDemoSource } from '../data/demo';
import { ApiError, getFile, getGraph, searchAnalysis } from '../lib/api';
import { setPageMeta } from '../lib/pageMeta';
import { useAnalysisEvents } from '../hooks/useAnalysisEvents';
import type { AnalysisSnapshot, FileSourceResponse, GraphResponse, SearchResult } from '../types';

type Mode = 'explore' | 'diagnose' | 'onboard' | 'impact';
type MobilePanel = 'files' | 'atlas' | 'details';
type SearchKind = '' | 'file' | 'function' | 'symbol';
const emptyGraph: GraphResponse = { nodes: [], edges: [] };
const modeOptions: Array<{ id: Mode; label: string }> = [
  { id: 'explore', label: 'Explore' },
  { id: 'diagnose', label: 'Diagnose' },
  { id: 'onboard', label: 'Onboard' },
  { id: 'impact', label: 'Plan / impact' },
];

function initialMode(value: string | null): Mode {
  if (value === 'diagnose' || value === 'onboard' || value === 'impact') return value;
  return 'explore';
}

function demoGraphAtDepth(graph: GraphResponse, centerId: string | null, depth: number): GraphResponse {
  if (!centerId || depth >= 3) return graph;
  const distance = new Map<string, number>([[centerId, 0]]);
  const queue = [centerId];
  while (queue.length) {
    const current = queue.shift()!;
    const currentDepth = distance.get(current)!;
    if (currentDepth >= depth) continue;
    for (const edge of graph.edges) {
      const neighbor = edge.sourceId === current ? edge.targetId : edge.targetId === current ? edge.sourceId : null;
      if (neighbor && !distance.has(neighbor)) { distance.set(neighbor, currentDepth + 1); queue.push(neighbor); }
    }
  }
  const nodeIds = new Set(distance.keys());
  return { ...graph, nodes: graph.nodes.filter((node) => nodeIds.has(node.id)), edges: graph.edges.filter((edge) => nodeIds.has(edge.sourceId) && nodeIds.has(edge.targetId)) };
}

function ErrorText({ error }: { error: ApiError }) {
  const title = error.code === 'API_UNAVAILABLE' ? 'Analyzer unavailable in this build' : error.status === 429 ? 'Analysis request rate limited' : 'Analysis request did not complete';
  return <StatusNotice kind="warning" title={title} message={error.message} stage={error.stage} code={error.code} status={error.status} retryable={error.retryable} />;
}

function SummaryItem({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return <div className="summary-item"><span>{label}</span><strong className={value === 'Not returned' ? 'value-not-returned' : undefined}>{value}</strong>{detail && <small>{detail}</small>}</div>;
}

function EmptyWorkspace({ onDemo }: { onDemo: () => void }) {
  return <div className="workspace-empty"><div className="empty-atlas-frame"><img src="/manus-storage/empty-atlas_435e72d5.webp" alt="An unfinished atlas route links a few repository file markers." /></div><span className="eyebrow">ATLAS / AWAITING SOURCE</span><h2>No repository in view.</h2><p>Start with a public GitHub URL or a ZIP archive, or open the labeled sample to explore the interface.</p><div className="empty-actions"><Link className="button-primary" to="/">Add a repository <ArrowLeft size={15} /></Link><button className="button-secondary" type="button" onClick={onDemo}>Explore sample atlas <GitBranch size={15} /></button></div></div>;
}

export default function WorkspacePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const demo = params.get('demo') === '1';
  const runId = demo ? null : params.get('runId');
  const [mode, setMode] = useState<Mode>(() => initialMode(params.get('mode')));
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('atlas');
  const [liveGraph, setLiveGraph] = useState<GraphResponse | null>(null);
  const [graphRunId, setGraphRunId] = useState<string | null>(null);
  const [graphError, setGraphError] = useState<ApiError | null>(null);
  const [graphLoading, setGraphLoading] = useState(Boolean(runId));
  const [depth, setDepth] = useState(() => params.get('demo') === '1' ? 3 : 1);
  const [selectedId, setSelectedId] = useState<string | null>(demo ? 'file:src/graph/buildGraph.ts' : null);
  const [searchFocus, setSearchFocus] = useState<{ fileNodeId: string; name: string; kind: string; path: string; line?: number; exactNode: boolean } | null>(null);
  const [source, setSource] = useState<FileSourceResponse | null>(demo ? getDemoSource('file:src/graph/buildGraph.ts') : null);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [sourceError, setSourceError] = useState('');
  const [query, setQuery] = useState('');
  const [searchKind, setSearchKind] = useState<SearchKind>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchError, setSearchError] = useState('');
  const [localSearchMessage, setLocalSearchMessage] = useState('');
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [snapshotState, setSnapshotState] = useState<AnalysisSnapshot | null>(demo ? DEMO_SNAPSHOT : null);
  const { snapshot: statusSnapshot, progress, error: statusError, loading: statusLoading } = useAnalysisEvents(runId);
  const snapshot = demo ? DEMO_SNAPSHOT : snapshotState?.runId === runId ? snapshotState : null;

  useEffect(() => { setMode(initialMode(params.get('mode'))); }, [params]);

  useEffect(() => {
    setPageMeta(demo ? 'Sample Atlas | CodeDarpan' : 'Repository Atlas | CodeDarpan', demo ? 'Explore the clearly labelled CodeDarpan demo dependency atlas.' : 'Explore returned repository graph data and source in CodeDarpan.');
  }, [demo]);

  useEffect(() => {
    if (demo) {
      setLiveGraph(DEMO_GRAPH); setGraphRunId(null); setSnapshotState(DEMO_SNAPSHOT); setGraphError(null); setGraphLoading(false);
      return;
    }
    if (!runId || statusSnapshot?.runId !== runId || statusSnapshot.status !== 'ready') {
      setLiveGraph(null); setGraphRunId(null); setGraphLoading(Boolean(runId && statusLoading));
      return;
    }
    let active = true;
    setGraphLoading(true); setGraphError(null); setGraphRunId(null); setLiveGraph(null);
    void getGraph(runId, depth).then((response) => { if (active) { setLiveGraph(response); setGraphRunId(runId); } }).catch((reason) => { if (active) setGraphError(reason instanceof ApiError ? reason : new ApiError('The returned graph could not be loaded.')); }).finally(() => { if (active) setGraphLoading(false); });
    return () => { active = false; };
  }, [runId, demo, statusSnapshot?.runId, statusSnapshot?.status, statusLoading, depth]);

  useEffect(() => {
    if (demo) { setSnapshotState(DEMO_SNAPSHOT); return; }
    setSnapshotState(statusSnapshot?.runId === runId ? statusSnapshot : null);
  }, [demo, runId, statusSnapshot]);

  const graph = useMemo(() => demo ? demoGraphAtDepth(DEMO_GRAPH, selectedId, depth) : graphRunId === runId ? liveGraph ?? emptyGraph : emptyGraph, [demo, liveGraph, graphRunId, runId, selectedId, depth]);
  const activeSelectedId = graph.nodes.some((node) => node.id === selectedId) ? selectedId : null;
  const selectedNode = useMemo(() => graph.nodes.find((node) => node.id === activeSelectedId) ?? null, [graph, activeSelectedId]);
  const repositoryLabel = demo ? DEMO_REPOSITORY : snapshot?.repositoryUrl?.split('/').filter(Boolean).slice(-2).join('/') || 'Repository analysis';

  const selectNode = useCallback((nodeId: string) => {
    setSelectedId(nodeId);
    setSearchFocus(null);
    setMode('explore');
    setMobilePanel(window.matchMedia('(max-width: 900px)').matches ? 'details' : 'atlas');
  }, []);
  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
    if (window.matchMedia('(max-width: 900px)').matches) setMobilePanel('details');
  };

  useEffect(() => {
    if (demo) {
      if (selectedId) setSource(getDemoSource(selectedId));
      return;
    }
    if (!runId || !selectedNode || snapshot?.status !== 'ready') { setSource(null); setSourceError(''); setSourceLoading(false); return; }
    let active = true;
    setSourceLoading(true); setSourceError('');
    void getFile(runId, selectedNode.id).then((response) => { if (active) setSource(response); }).catch((reason) => { if (active) { setSource(null); setSourceError(reason instanceof ApiError ? reason.message : 'Source is unavailable in this analysis.'); } }).finally(() => { if (active) setSourceLoading(false); });
    return () => { active = false; };
  }, [runId, selectedId, selectedNode, demo, snapshot?.status]);

  useEffect(() => {
    if (graph.nodes.length && (!selectedId || !graph.nodes.some((node) => node.id === selectedId))) setSelectedId(graph.nodes[0].id);
  }, [graph, selectedId]);

  useEffect(() => {
    setResults([]); setSearchError(''); setLocalSearchMessage('');
    const trimmed = query.trim();
    if (!trimmed) { setSearching(false); return; }
    if (demo) {
      const found = DEMO_NODES.filter((node) => (!searchKind || node.kind === searchKind) && `${node.name} ${node.path} ${node.kind}`.toLowerCase().includes(trimmed.toLowerCase())).map((node) => ({ nodeId: node.id, name: node.name, path: node.path, kind: node.kind }));
      setResults(found); setSearching(false); return;
    }
    if (!runId || snapshot?.status !== 'ready') { setSearching(false); return; }
    let active = true;
    setSearching(true);
    const timer = setTimeout(() => {
      void searchAnalysis(runId, trimmed, searchKind || undefined).then((matches) => { if (active) setResults(matches); }).catch((reason) => { if (active) { setSearchError(reason instanceof ApiError ? reason.message : 'Search could not be completed.'); setResults([]); } }).finally(() => { if (active) setSearching(false); });
    }, 260);
    return () => { active = false; clearTimeout(timer); };
  }, [query, searchKind, runId, demo, snapshot?.status]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); searchRef.current?.focus(); }
      if (event.key === 'Escape' && document.activeElement === searchRef.current) { setQuery(''); setResults([]); setSearchError(''); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const chooseSearchResult = (result: SearchResult) => {
    const exact = graph.nodes.find((node) => node.id === result.nodeId);
    const file = exact ?? graph.nodes.find((node) => node.path === result.path && (node.kind === 'file' || node.kind === 'module'));
    setQuery(''); setResults([]); setSearchError('');
    if (file) {
      const exactNode = file.id === result.nodeId;
      selectNode(file.id);
      setSearchFocus({ fileNodeId: file.id, name: result.name, kind: result.kind, path: result.path, ...(typeof result.line === 'number' ? { line: result.line } : {}), exactNode });
      setLocalSearchMessage('');
    }
    else setLocalSearchMessage(`Found ${result.path}, but this file-level graph does not include its matching entity. The result was not substituted.`);
  };

  const runStatus = demo ? 'ready' : progress?.status ?? snapshot?.status ?? (runId ? 'queued' : 'waiting');
  const stageName = demo ? 'fixture' : progress?.stage ?? (snapshot?.status === 'ready' ? 'ready' : snapshot?.status ?? 'queued');
  const warningCount = snapshot?.warnings?.length;
  const modePanelFocus = (nodeId: string) => {
    const node = graph.nodes.find((item) => item.id === nodeId);
    if (node) { selectNode(nodeId); setMobilePanel('details'); }
    else setLocalSearchMessage('This returned item is not present in the loaded file-level graph.');
  };
  const searchReady = demo || snapshot?.status === 'ready';
  const noSearchResults = Boolean(query.trim() && searchReady && !searching && !searchError && !results.length && !localSearchMessage);
  const showSearchPopover = Boolean(results.length || searchError || localSearchMessage || noSearchResults);

  return (
    <main className={`workspace-page${demo ? ' is-demo' : ''}`}>
      {demo && <div className="demo-banner"><span className="demo-banner-mark">D</span><strong>DEMO DATA</strong><span>Illustrative fixture values. Not a repository analysis.</span><Link to="/">Return to intake</Link></div>}
      <header className="workspace-header">
        <div className="workspace-brand"><Brand compact /><span className="header-divider" /><div className="repo-label"><strong>{repositoryLabel}</strong><small>{snapshot?.revision ? `REV ${snapshot.revision}` : demo ? 'SAMPLE FIXTURE' : 'REVISION NOT RETURNED'}</small></div></div>
        <div className="workspace-header-center">
          <div className="global-search"><Search size={15} aria-hidden="true" /><input ref={searchRef} aria-label="Search files, functions and symbols" value={query} onChange={(event) => { setQuery(event.target.value); setLocalSearchMessage(''); }} placeholder="Search files, functions, symbols…" aria-expanded={showSearchPopover} aria-controls={showSearchPopover ? 'search-results' : undefined} /><select aria-label="Search entity type" value={searchKind} onChange={(event) => setSearchKind(event.target.value as SearchKind)}><option value="">All</option><option value="file">Files</option><option value="function">Functions</option><option value="symbol">Symbols</option></select><kbd>Ctrl / ⌘ K</kbd>{searching && <LoaderCircle size={14} className="spin" />}</div>
          {showSearchPopover && <div className="search-results-popover" id="search-results" role="region" aria-label="Repository search results" aria-live="polite">{searchError ? <p className="search-message" role="alert">{searchError}</p> : localSearchMessage ? <p className="search-message">{localSearchMessage}</p> : noSearchResults ? <p className="search-message">No matching results were returned for this query.</p> : results.map((result) => <button type="button" key={result.nodeId} onClick={() => chooseSearchResult(result)}><span className="search-result-kind">{result.kind}</span><strong>{result.name}</strong><small>{result.path}{result.line ? ` · line ${result.line}` : ''}</small></button>)}</div>}
        </div>
        <div className="workspace-status" role="status" aria-live="polite" aria-atomic="true"><span className={`status-dot status-${runStatus}`} aria-hidden="true" /><span>{runStatus}</span><small>{stageName}</small>{progress?.message && <span className="sr-only">{progress.message}</span>}</div>
        <Link className="workspace-home-link" to="/"><ArrowLeft size={14} /> Intake</Link>
      </header>
      <nav className="workspace-mode-tabs" aria-label="Analysis modes" role="tablist">
        {modeOptions.map((option, index) => <button id={`mode-tab-${option.id}`} type="button" role="tab" key={option.id} aria-controls="mode-panel" tabIndex={mode === option.id ? 0 : -1} aria-selected={mode === option.id} className={mode === option.id ? 'active' : ''} onKeyDown={(event) => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); const delta = event.key === 'ArrowRight' ? 1 : -1; const next = (index + delta + modeOptions.length) % modeOptions.length; const nextMode = modeOptions[next].id; changeMode(nextMode); requestAnimationFrame(() => document.getElementById(`mode-tab-${nextMode}`)?.focus()); } }} onClick={() => changeMode(option.id)}><span className="mode-index">0{index + 1}</span>{option.label}</button>)}
      </nav>
      <section className="summary-strip" aria-label="Analysis summary">
        <SummaryItem label="FILES SCANNED" value={snapshot ? snapshot.filesScanned : 'Not returned'} />
        <SummaryItem label="GRAPH NODES" value={snapshot ? snapshot.nodesCount : 'Not returned'} detail={snapshot ? 'API snapshot' : 'Analysis summary unavailable'} />
        <SummaryItem label="RELATIONSHIPS" value={snapshot ? snapshot.edgesCount : 'Not returned'} />
        <SummaryItem label="WARNINGS" value={typeof warningCount === 'number' ? warningCount : 'Not returned'} />
        <SummaryItem label="PARSE TIME" value={typeof snapshot?.parseDurationMs === 'number' ? `${snapshot.parseDurationMs} ms` : 'Not returned'} />
        <div className="summary-source"><span>ANALYSIS ID</span><strong>{demo ? 'demo-fixture' : runId ?? 'Not started'}</strong></div>
      </section>
      {(statusError || graphError) && <div className="workspace-error"><ErrorText error={statusError ?? graphError!} /></div>}
      {localSearchMessage && <div className="workspace-error"><StatusNotice kind="info" title="Search result outside current graph" message={localSearchMessage} /></div>}
      {!demo && runId && snapshot?.status === 'failed' && <div className="workspace-error"><StatusNotice kind="error" title="Analysis failed" message={progress?.message ?? 'The analysis service reported a failed state.'} stage={progress?.stage ?? 'failed'} /></div>}
      {!demo && runId && snapshot?.status === 'cancelled' && <div className="workspace-error"><StatusNotice kind="warning" title="Analysis cancelled" message={progress?.message ?? 'The analysis service reported that this run was cancelled.'} stage={progress?.stage ?? 'cancelled'} /></div>}
      {!demo && runId && (statusLoading || (snapshot?.status === 'queued' || snapshot?.status === 'running')) && <div className="workspace-progress"><img src="/manus-storage/progress-seal_c51e5dbf.svg" alt="" /><div><strong>{progress?.message ?? 'Analysis in progress'}</strong><span>{progress?.stage ?? snapshot?.status ?? 'Waiting for returned status'} · No synthetic percentage is shown.</span></div><LoaderCircle size={16} className="spin" /></div>}
      {snapshot?.warnings?.length ? <details className="warning-list"><summary><AlertTriangle size={14} /> {snapshot.warnings.length} returned analysis warning{snapshot.warnings.length === 1 ? '' : 's'}</summary><ul>{snapshot.warnings.map((warning, index) => <li key={`${warning.code}-${index}`}><strong>{warning.code}</strong><span>{warning.message}</span>{warning.path && <code>{warning.path}</code>}</li>)}</ul></details> : null}

      {!demo && !runId ? (
        <EmptyWorkspace onDemo={() => navigate('/workspace?demo=1')} />
      ) : (
        <>
          <div className="mobile-panel-tabs" role="group" aria-label="Workspace panel view">
            <button type="button" aria-pressed={mobilePanel === 'files'} onClick={() => setMobilePanel('files')}>Files</button>
            <button type="button" aria-pressed={mobilePanel === 'atlas'} onClick={() => setMobilePanel('atlas')}>Atlas</button>
            <button type="button" aria-pressed={mobilePanel === 'details'} onClick={() => setMobilePanel('details')}>Details</button>
          </div>
          <div className="workspace-grid">
            <div className={`workspace-left${mobilePanel === 'files' ? ' mobile-visible' : ''}`}><FileTree nodes={graph.nodes} selectedId={activeSelectedId} onSelect={selectNode} demo={demo} /></div>
            <div className={`workspace-center${mobilePanel === 'atlas' ? ' mobile-visible' : ''}`}>
              {graphLoading && <div className="graph-loading"><LoaderCircle size={18} className="spin" /><span>{snapshot?.status === 'queued' || snapshot?.status === 'running' ? 'Waiting for analysis to return a graph…' : statusLoading ? 'Checking the returned analysis status…' : 'Loading graph returned by the analyzer…'}</span></div>}
              {!graphLoading && graph.nodes.length > 0 && <AtlasGraph graph={graph} selectedId={activeSelectedId} onSelect={selectNode} demo={demo} depth={depth} onDepthChange={setDepth} />}
              {!graphLoading && graph.nodes.length === 0 && <div className="graph-unavailable"><img src="/manus-storage/empty-atlas_435e72d5.webp" alt="" /><strong>{snapshot?.status === 'ready' ? 'No graph nodes returned' : 'Graph not yet available'}</strong><span>{snapshot?.status === 'ready' ? 'The service returned an empty graph. No sample nodes have been inserted.' : 'Graph appears after the analysis API returns ready status and graph data.'}</span></div>}
            </div>
            <div id="mode-panel" role="tabpanel" tabIndex={0} aria-labelledby={`mode-tab-${mode}`} className={`workspace-right${mobilePanel === 'details' ? ' mobile-visible' : ''}`}>
              {mode === 'explore' ? <NodeInspector node={selectedNode} source={source} loading={sourceLoading} error={sourceError} demo={demo} searchFocus={searchFocus?.fileNodeId === selectedNode?.id ? searchFocus : null} onSelectNode={selectNode} /> : null}
              {mode === 'diagnose' ? <DiagnosePanel runId={runId} demo={demo} nodes={graph.nodes} onFocus={modePanelFocus} /> : null}
              {mode === 'onboard' ? <OnboardingPanel runId={runId} demo={demo} onFocus={modePanelFocus} /> : null}
              {mode === 'impact' ? <ImpactPanel runId={runId} selectedId={activeSelectedId} repositoryUrl={snapshot?.repositoryUrl} demo={demo} onFocus={modePanelFocus} /> : null}
            </div>
          </div>
        </>
      )}
      <footer className="workspace-footer"><span><Clock3 size={13} /> {snapshot?.createdAt ? `Created ${new Date(snapshot.createdAt).toLocaleString()}` : 'No analysis time returned'}</span><span><CheckCircle2 size={13} /> Data source: {demo ? 'explicit local fixture' : runId ? 'analysis API response only' : 'none'}</span><span><XCircle size={13} /> Health score is not inferred from the graph.</span></footer>
    </main>
  );
}
