import { useEffect, useMemo, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { CircleHelp, Maximize2, Minus, Plus, RotateCcw } from 'lucide-react';
import GraphLegend from '../GraphLegend';
import type { EdgeKind, GraphResponse } from '../../types';

type LayoutName = 'cose' | 'breadthfirst' | 'circle';

interface AtlasGraphProps {
  graph: GraphResponse;
  selectedId: string | null;
  onSelect: (id: string) => void;
  demo?: boolean;
  depth: number;
  onDepthChange: (value: number) => void;
}

function buildElements(graph: GraphResponse): cytoscape.ElementDefinition[] {
  const clusterIds = new Set(graph.nodes.map((node) => node.clusterId).filter((value): value is string => Boolean(value)));
  const groupById = new Map((graph.groups ?? []).map((group) => [group.id, group]));
  const groups = [...clusterIds].map((id) => {
    const group = groupById.get(id);
    return { data: { id: `cluster:${id}`, label: group?.label ?? id.replaceAll('-', ' ') }, classes: 'cluster' };
  });
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  const nodes = graph.nodes.map((node) => ({
    data: {
      id: node.id,
      label: node.name,
      path: node.path,
      kind: node.kind,
      fanIn: node.fanIn,
      fanOut: node.fanOut,
      ...(node.clusterId ? { parent: `cluster:${node.clusterId}` } : {}),
    },
  }));
  const edges = graph.edges.filter((edge) => nodeIds.has(edge.sourceId) && nodeIds.has(edge.targetId)).map((edge) => ({
    data: { id: edge.id, source: edge.sourceId, target: edge.targetId, kind: edge.kind, confidence: edge.confidence },
  }));
  return [...groups, ...nodes, ...edges];
}

function layoutOptions(name: LayoutName): cytoscape.LayoutOptions {
  if (name === 'breadthfirst') return { name, directed: true, padding: 42, spacingFactor: 1.3, animate: false };
  if (name === 'circle') return { name, padding: 42, animate: false };
  return { name: 'cose', padding: 45, animate: false, randomize: true, nodeRepulsion: 7200, idealEdgeLength: 105, numIter: 450, gravity: 0.25 };
}

const edgeNames: Record<EdgeKind, string> = {
  imports: 'Imports', calls: 'Calls', contains: 'Contains', extends: 'Extends', implements: 'Implements', exports: 'Exports',
};

export default function AtlasGraph({ graph, selectedId, onSelect, demo = false, depth, onDepthChange }: AtlasGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const onSelectRef = useRef(onSelect);
  const lastSelectedRef = useRef<string | null>(null);
  const layoutRef = useRef<LayoutName>('cose');
  const kinds = useMemo(() => [...new Set(graph.edges.map((edge) => edge.kind))], [graph]);
  const [enabledKinds, setEnabledKinds] = useState<EdgeKind[]>(kinds);
  const [layout, setLayout] = useState<LayoutName>('cose');
  const [hovered, setHovered] = useState<{ name: string; path: string } | null>(null);

  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);
  useEffect(() => { layoutRef.current = layout; }, [layout]);
  useEffect(() => { setEnabledKinds(kinds); }, [kinds]);

  useEffect(() => {
    if (!containerRef.current || !graph.nodes.length) return;
    const cy = cytoscape({
      container: containerRef.current,
      elements: buildElements(graph),
      minZoom: 0.22,
      maxZoom: 2.8,
      wheelSensitivity: 0.18,
      style: [
        { selector: 'node', style: { label: 'data(label)', color: '#F2EBDD', 'font-family': 'IBM Plex Mono, monospace', 'font-size': '10px', 'text-wrap': 'ellipsis', 'text-max-width': '112px', 'text-valign': 'center', 'text-halign': 'center', 'background-color': '#718077', 'border-color': '#AF8C57', 'border-width': 1, width: 'mapData(fanOut, 0, 8, 23, 40)', height: 'mapData(fanOut, 0, 8, 23, 40)', 'overlay-opacity': 0 } },
        { selector: 'node[kind = "file"]', style: { shape: 'round-rectangle', 'background-color': '#3D4943' } },
        { selector: 'node[kind = "module"]', style: { shape: 'round-rectangle', 'background-color': '#6F6047' } },
        { selector: 'node[kind = "function"]', style: { shape: 'ellipse', 'background-color': '#425550' } },
        { selector: 'node[kind = "class"]', style: { shape: 'hexagon', 'background-color': '#615344' } },
        { selector: 'node[kind = "symbol"]', style: { shape: 'diamond', 'background-color': '#56504A' } },
        { selector: 'node.cluster', style: { label: 'data(label)', shape: 'round-rectangle', 'background-color': '#242220', 'background-opacity': 0.2, 'border-color': '#625A4E', 'border-style': 'dashed', 'border-width': 1, color: '#B9A783', 'font-size': '9px', 'font-family': 'IBM Plex Mono, monospace', 'text-valign': 'top', 'text-halign': 'left', 'text-margin-x': 8, 'text-margin-y': 7, padding: '12px', 'compound-sizing-wrt-labels': 'include', 'z-compound-depth': 'bottom' } },
        { selector: 'edge', style: { width: 1.35, 'line-color': '#AF8C57', 'target-arrow-color': '#AF8C57', 'target-arrow-shape': 'triangle', 'arrow-scale': 0.78, 'curve-style': 'bezier', opacity: 0.66, 'overlay-opacity': 0 } },
        { selector: 'edge[kind = "calls"]', style: { 'line-style': 'dashed', 'line-color': '#87948A', 'target-arrow-color': '#87948A' } },
        { selector: 'edge[kind = "contains"]', style: { 'line-style': 'dotted', width: 1, 'line-color': '#928B7F', 'target-arrow-color': '#928B7F' } },
        { selector: 'edge[kind = "exports"]', style: { 'line-style': 'dashed', 'line-color': '#A98755', 'target-arrow-color': '#A98755' } },
        { selector: 'edge[kind = "extends"], edge[kind = "implements"]', style: { 'line-style': 'dotted', 'line-color': '#7C8980', 'target-arrow-color': '#7C8980' } },
        { selector: 'edge[confidence = "possible"]', style: { 'line-style': 'dashed', opacity: 0.78 } },
        { selector: 'edge[confidence = "unresolved"]', style: { 'line-style': 'dotted', 'line-color': '#8F3030', 'target-arrow-color': '#8F3030', opacity: 0.9 } },
        { selector: '.dimmed', style: { opacity: 0.16 } },
        { selector: '.related', style: { opacity: 1, 'border-width': 1.5 } },
        { selector: 'node.selected', style: { 'background-color': '#8F3030', 'border-color': '#E6C487', 'border-width': 3, width: 43, height: 43, 'z-index': 10 } },
        { selector: 'edge.highlighted', style: { opacity: 1, width: 2.6, 'z-index': 5 } },
      ],
      layout: layoutOptions(layoutRef.current),
    });
    cyRef.current = cy;
    cy.on('tap', 'node', (event) => {
      const target = event.target;
      if (target.hasClass('cluster')) return;
      onSelectRef.current(target.id());
    });
    cy.on('mouseover', 'node', (event) => setHovered({ name: String(event.target.data('label')), path: String(event.target.data('path') ?? '') }));
    cy.on('mouseout', 'node', () => setHovered(null));
    cy.one('layoutstop', () => cy.fit(undefined, 32));

    return () => {
      cy.removeAllListeners();
      cy.destroy();
      cyRef.current = null;
    };
  }, [graph]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.edges().forEach((edge) => { edge.style('display', enabledKinds.includes(edge.data('kind') as EdgeKind) ? 'element' : 'none'); });
  }, [enabledKinds, graph]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || !selectedId) return;
    const node = cy.getElementById(selectedId);
    if (node.empty()) return;
    cy.elements().removeClass('selected related highlighted dimmed');
    const neighborhood = node.closedNeighborhood();
    neighborhood.addClass('related');
    neighborhood.edges().addClass('highlighted');
    node.addClass('selected');
    cy.elements().not(neighborhood).addClass('dimmed');
    if (lastSelectedRef.current !== selectedId) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) cy.center(node);
      else cy.animate({ center: { eles: node }, duration: 180 });
      lastSelectedRef.current = selectedId;
    }
  }, [selectedId, graph]);

  useEffect(() => {
    const cy = cyRef.current;
    if (cy) cy.layout(layoutOptions(layout)).run();
  }, [layout]);

  const fit = () => cyRef.current?.fit(undefined, 34);
  const reset = () => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.layout(layoutOptions(layout)).run();
  };
  const toggleKind = (kind: EdgeKind) => setEnabledKinds((current) => current.includes(kind) ? current.filter((item) => item !== kind) : [...current, kind]);
  const changeZoom = (amount: number) => {
    const cy = cyRef.current;
    if (cy) cy.zoom({ level: Math.max(0.22, Math.min(2.8, cy.zoom() + amount)), renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
  };

  return (
    <section className="graph-panel" aria-label="Interactive dependency atlas">
      <div className="graph-toolbar">
        <div className="graph-toolbar-title"><span className="eyebrow">DEPENDENCY ATLAS</span><strong>{demo ? 'Sample repository' : 'Returned graph'}</strong>{demo && <span className="mini-demo-label">DEMO DATA</span>}</div>
        <div className="graph-controls">
          <label className="depth-select"><span className="sr-only">Relationship depth</span><select value={depth} onChange={(event) => onDepthChange(Number(event.target.value))}><option value={1}>Depth 1</option><option value={2}>Depth 2</option><option value={3}>Depth 3</option></select></label>
          <label className="layout-select"><span className="sr-only">Graph layout</span><select value={layout} onChange={(event) => setLayout(event.target.value as LayoutName)}><option value="cose">Organic</option><option value="breadthfirst">Hierarchy</option><option value="circle">Circle</option></select></label>
          <button type="button" className="icon-button" aria-label="Zoom out" title="Zoom out" onClick={() => changeZoom(-0.15)}><Minus size={15} /></button>
          <button type="button" className="icon-button" aria-label="Zoom in" title="Zoom in" onClick={() => changeZoom(0.15)}><Plus size={15} /></button>
          <button type="button" className="icon-button" aria-label="Fit graph to view" title="Fit graph to view" onClick={fit}><Maximize2 size={15} /></button>
          <button type="button" className="icon-button" aria-label="Reset graph layout" title="Reset graph layout" onClick={reset}><RotateCcw size={15} /></button>
        </div>
      </div>
      <div className="graph-kind-controls" aria-label="Relationship filters">
        <span>RELATIONSHIPS</span>
        {kinds.map((kind) => <button key={kind} className={`filter-chip${enabledKinds.includes(kind) ? ' active' : ''}`} type="button" aria-pressed={enabledKinds.includes(kind)} onClick={() => toggleKind(kind)}>{edgeNames[kind]}</button>)}
      </div>
      <div className="atlas-stage">
        <div className="atlas-coordinates" aria-hidden="true"><span>00° 00′ N</span><span>STRUCTURE / NOT TO SCALE</span><span>000</span></div>
        <div ref={containerRef} className="cytoscape-container" role="region" aria-label="Cytoscape dependency graph. Use the file tree, search or the keyboard node list to select a node." />
        {!graph.nodes.length && <div className="graph-empty"><CircleHelp size={24} /><strong>No graph nodes returned</strong><span>Choose another repository or inspect the analysis warnings.</span></div>}
        {hovered && <div className="graph-hover-card" aria-live="polite"><strong>{hovered.name}</strong><span>{hovered.path}</span></div>}
        <div className="atlas-caption"><span>{graph.nodes.length} nodes / {graph.edges.length} relationships</span><span>Pan to move · Scroll to zoom · Select a node to inspect</span></div>
      </div>
      <div className="graph-footer">
        <GraphLegend kinds={kinds} enabled={enabledKinds} onToggle={toggleKind} />
        <span className="graph-confidence-note">Line pattern also marks relationship type and confidence.</span>
      </div>
      <div className="sr-only" aria-label="Keyboard graph node selection">{graph.nodes.map((node) => <button type="button" key={node.id} onClick={() => onSelect(node.id)}>{node.name}, {node.kind}, {node.path}</button>)}</div>
    </section>
  );
}
