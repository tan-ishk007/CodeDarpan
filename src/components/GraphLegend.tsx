import type { EdgeKind } from '../types';

const labels: Record<EdgeKind, string> = {
  imports: 'imports',
  calls: 'calls',
  contains: 'contains',
  extends: 'extends',
  implements: 'implements',
  exports: 'exports',
};

interface GraphLegendProps {
  kinds: EdgeKind[];
  enabled: EdgeKind[];
  onToggle?: (kind: EdgeKind) => void;
}

export default function GraphLegend({ kinds, enabled, onToggle }: GraphLegendProps) {
  if (!kinds.length) return <div className="legend-empty">No relationships returned.</div>;
  return (
    <div className="graph-legend" aria-label="Relationship legend">
      {kinds.map((kind) => (
        <button key={kind} type="button" className={`legend-key legend-${kind}${enabled.includes(kind) ? ' is-active' : ''}`} aria-pressed={enabled.includes(kind)} onClick={() => onToggle?.(kind)}>
          <span className={`legend-line legend-line-${kind}`} aria-hidden="true" />
          <span>{labels[kind]}</span>
        </button>
      ))}
      {kinds.includes('imports') && <span className="legend-direction">source → dependency</span>}
      {kinds.includes('calls') && <span className="legend-direction">caller → callee</span>}
      <span className="legend-confidence" aria-label="Possible confidence, dashed line"><span className="legend-confidence-line legend-possible-line" aria-hidden="true" /> possible</span>
      <span className="legend-confidence" aria-label="Unresolved relationship, dotted oxblood line"><span className="legend-confidence-line legend-unresolved-line" aria-hidden="true" /> unresolved</span>
    </div>
  );
}
