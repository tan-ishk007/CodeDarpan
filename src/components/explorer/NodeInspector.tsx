import { useMemo } from 'react';
import { ArrowDownLeft, ArrowUpRight, Box, Braces, CircleAlert, CircleHelp, FileCode2, FileText, FolderTree, GitBranch, LoaderCircle } from 'lucide-react';
import { highlightSource } from '../../lib/codeHighlight';
import type { FileRelation, FileSourceResponse, GraphNode, NodeKind } from '../../types';

const relationText = (relation: FileRelation | string): string => {
  if (typeof relation === 'string') return relation;
  return relation.path ?? relation.name ?? relation.nodeId ?? relation.id ?? 'Relationship';
};

const relationId = (relation: FileRelation | string): string | undefined => {
  if (typeof relation === 'string') return undefined;
  return relation.nodeId ?? relation.id;
};

interface NodeInspectorProps {
  node: GraphNode | null;
  source?: FileSourceResponse | null;
  loading?: boolean;
  error?: string;
  demo?: boolean;
  searchFocus?: { name: string; kind: string; path: string; line?: number; exactNode: boolean } | null;
  onSelectNode: (nodeId: string) => void;
}

export default function NodeInspector({ node, source, loading = false, error, demo = false, searchFocus, onSelectNode }: NodeInspectorProps) {
  const sourceText = source?.source;
  const highlighted = useMemo(() => sourceText !== undefined ? highlightSource(sourceText, node?.language) : '', [sourceText, node?.language]);
  const lines = typeof sourceText === 'string' && sourceText.length > 0 ? highlighted.split('\n') : [];
  const file = source?.file;
  const tokenCount = file?.tokenCount ?? node?.tokenCount;
  const complexity = file?.complexity ?? node?.complexity;
  const fanIn = file?.fanIn ?? node?.fanIn;
  const fanOut = file?.fanOut ?? node?.fanOut;
  const riskScore = file?.riskScore ?? node?.riskScore;
  const loc = file?.loc ?? node?.loc;
  const imports = source?.imports ?? [];
  const dependents = source?.dependents ?? [];

  if (!node) {
    return <aside className="inspector-panel panel-surface" aria-label="Source inspector"><div className="panel-heading"><div><span className="eyebrow">SOURCE INSPECTOR</span><h2>Selection</h2></div></div><div className="inspector-empty"><FileText size={25} /><p>Select a file or node to inspect its returned source and relationships.</p></div></aside>;
  }

  const entityIcons: Record<NodeKind, typeof FileCode2> = { file: FileCode2, module: FolderTree, class: Box, function: Braces, symbol: CircleHelp };
  const EntityIcon = entityIcons[node.kind];

  return (
    <aside className="inspector-panel panel-surface" aria-label="Source inspector">
      <div className="panel-heading">
        <div><span className="eyebrow">SOURCE INSPECTOR</span><h2>Selected entity</h2></div>
        {demo && <span className="mini-demo-label">DEMO DATA</span>}
      </div>
      <div className="entity-summary">
        <div className="entity-icon"><EntityIcon size={17} aria-hidden="true" /></div>
        <div className="entity-heading"><strong>{node.name}</strong><span className="mono-text">{node.path}</span></div>
      </div>
      <div className="entity-tags"><span>{node.kind}</span><span>{node.language || 'Language unavailable'}</span>{typeof node.startLine === 'number' && <span>lines {node.startLine}{typeof node.endLine === 'number' ? `-${node.endLine}` : ''}</span>}</div>
      <div className="metric-strip">
        <div><span>LOC</span><strong className={typeof loc === 'number' ? undefined : 'value-not-returned'}>{typeof loc === 'number' ? loc : 'Not returned'}</strong></div>
        <div><span>TOKENS</span><strong className={typeof tokenCount === 'number' ? undefined : 'value-not-returned'}>{typeof tokenCount === 'number' ? tokenCount : 'Not returned'}</strong></div>
        <div><span>COMPLEXITY</span><strong className={typeof complexity === 'number' ? undefined : 'value-not-returned'}>{typeof complexity === 'number' ? complexity : 'Not returned'}</strong></div>
        <div><span>FAN IN</span><strong className={typeof fanIn === 'number' ? undefined : 'value-not-returned'}>{typeof fanIn === 'number' ? fanIn : 'Not returned'}</strong></div>
        <div><span>FAN OUT</span><strong className={typeof fanOut === 'number' ? undefined : 'value-not-returned'}>{typeof fanOut === 'number' ? fanOut : 'Not returned'}</strong></div>
        <div><span>RISK</span><strong className={typeof riskScore === 'number' ? undefined : 'value-not-returned'}>{typeof riskScore === 'number' ? riskScore : 'Not returned'}</strong></div>
      </div>
      <p className="metric-method">{demo ? 'Illustrative fixture values, not analyzer output.' : 'Metrics are shown only when returned by the analysis API. Token-count method is not specified by the available contract.'}</p>
      {loading && <div className="inline-loading"><LoaderCircle size={15} className="spin" /> Loading source from the analysis API…</div>}
      {error && <div className="inline-state error-state"><CircleAlert size={15} />{error}</div>}
      {searchFocus && <p className="source-search-note" role="status">{searchFocus.exactNode ? `Search selected ${searchFocus.kind}: ${searchFocus.name}${typeof searchFocus.line === 'number' ? ` at returned line ${searchFocus.line}` : ''}.` : `Search returned ${searchFocus.kind} ${searchFocus.name}${typeof searchFocus.line === 'number' ? ` at line ${searchFocus.line}` : ''} in ${searchFocus.path}. The containing file is selected because this file-level graph has no separate ${searchFocus.kind} node.`}</p>}
      <section className="source-section" aria-label="Read-only source">
        <div className="source-heading"><div><Braces size={15} /><span>Source</span></div><span>{typeof sourceText === 'string' ? `${lines.length} lines returned` : 'Unavailable'}</span></div>
        {typeof sourceText === 'string' && sourceText.length > 0 ? (
          <pre className="source-code" tabIndex={0} aria-label={`Read-only source for ${node.path}`}><code>{lines.map((line, index) => { const lineNumber = (node.startLine ?? 1) + index; const isMatch = typeof searchFocus?.line === 'number' && lineNumber === searchFocus.line; return <span className={`code-line${isMatch ? ' is-search-match' : ''}`} key={index}><span className="line-number" aria-hidden="true">{lineNumber}</span><span className="line-source" dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }} />{isMatch && <span className="sr-only">Search match</span>}</span>; })}</code></pre>
        ) : !loading && <div className="source-placeholder"><FileText size={20} /><p>{demo ? 'This demo file has no additional illustrative snippet.' : typeof sourceText === 'string' ? 'The analyzer returned an empty source body for this entity.' : 'Source is not available from this analysis. No local code is substituted.'}</p></div>}
      </section>
      {file?.parseStatus && <p className="parse-status">Parser status: {file.parseStatus}</p>}
      <RelationList title="Imports / outgoing" icon="out" rows={imports} onSelectNode={onSelectNode} />
      <RelationList title="Dependents / incoming" icon="in" rows={dependents} onSelectNode={onSelectNode} />
      <p className="edge-direction-note"><GitBranch size={13} /> Imports point from importer to dependency.</p>
    </aside>
  );
}

function RelationList({ title, icon, rows, onSelectNode }: { title: string; icon: 'in' | 'out'; rows: Array<FileRelation | string>; onSelectNode: (id: string) => void }) {
  const Icon = icon === 'in' ? ArrowDownLeft : ArrowUpRight;
  return (
    <section className="relation-section">
      <div className="relation-heading"><Icon size={14} /><span>{title}</span><span className="relation-count">{rows.length}</span></div>
      {rows.length ? <ul>{rows.map((relation, index) => {
        const id = relationId(relation);
        return <li key={`${relationText(relation)}-${index}`}>{id ? <button type="button" onClick={() => onSelectNode(id)}>{relationText(relation)}</button> : <span>{relationText(relation)}</span>}</li>;
      })}</ul> : <p className="muted-copy">{icon === 'out' ? 'No returned imports.' : 'No returned dependents.'}</p>}
    </section>
  );
}
