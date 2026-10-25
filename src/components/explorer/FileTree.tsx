import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, FileCode2, FolderClosed, FolderOpen, Search } from 'lucide-react';
import type { GraphNode } from '../../types';

interface TreeItem {
  name: string;
  path: string;
  file?: GraphNode;
  children: TreeItem[];
}

function buildTree(nodes: GraphNode[]): TreeItem[] {
  const unique = new Map<string, GraphNode>();
  const preferred = nodes.filter((node) => node.kind === 'file' || node.kind === 'module');
  for (const node of preferred.length ? preferred : nodes) {
    if (!unique.has(node.path)) unique.set(node.path, node);
  }

  const roots: TreeItem[] = [];
  const lookup = new Map<string, TreeItem>();
  [...unique.values()].sort((a, b) => a.path.localeCompare(b.path)).forEach((file) => {
    const parts = file.path.split('/').filter(Boolean);
    let level = roots;
    let partialPath = '';
    parts.forEach((part, index) => {
      partialPath = partialPath ? `${partialPath}/${part}` : part;
      let item = lookup.get(partialPath);
      if (!item) {
        item = { name: part, path: partialPath, children: [] };
        lookup.set(partialPath, item);
        level.push(item);
      }
      if (index === parts.length - 1) item.file = file;
      level = item.children;
    });
  });
  return roots;
}

interface FileTreeProps {
  nodes: GraphNode[];
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
  demo?: boolean;
}

export default function FileTree({ nodes, selectedId, onSelect, demo = false }: FileTreeProps) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(['src', 'src/parser', 'src/graph', 'src/ui', 'src/metrics', 'tests']));
  const searchRef = useRef<HTMLInputElement>(null);
  const tree = useMemo(() => buildTree(nodes), [nodes]);
  const matches = (item: TreeItem): boolean => {
    if (!query.trim()) return true;
    return item.path.toLowerCase().includes(query.trim().toLowerCase()) || item.children.some(matches);
  };
  const toggle = (path: string) => setExpanded((current) => {
    const next = new Set(current);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    return next;
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      const editing = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      if (event.key === '/' && !editing) { event.preventDefault(); searchRef.current?.focus(); }
      if (event.key === 'Escape' && document.activeElement === searchRef.current) setQuery('');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const renderItems = (items: TreeItem[], depth = 0) => items.filter(matches).map((item) => {
    const isFolder = item.children.length > 0;
    const open = expanded.has(item.path);
    return (
      <li key={item.path}>
        {isFolder ? (
          <button className="tree-row tree-folder" type="button" style={{ paddingLeft: `${10 + depth * 13}px` }} aria-expanded={open} onClick={() => toggle(item.path)}>
            {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            {open ? <FolderOpen size={14} /> : <FolderClosed size={14} />}
            <span>{item.name}</span>
          </button>
        ) : item.file ? (
          <button
            className={`tree-row tree-file${selectedId === item.file.id ? ' is-selected' : ''}`}
            type="button"
            style={{ paddingLeft: `${22 + depth * 13}px` }}
            aria-current={selectedId === item.file.id ? 'true' : undefined}
            onClick={() => onSelect(item.file!.id)}
          >
            <FileCode2 size={14} aria-hidden="true" />
            <span>{item.name}</span>
            <small>{item.file.language}</small>
          </button>
        ) : (
          <button className="tree-row tree-folder" type="button" style={{ paddingLeft: `${10 + depth * 13}px` }} onClick={() => toggle(item.path)}>
            {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            {open ? <FolderOpen size={14} /> : <FolderClosed size={14} />}
            <span>{item.name}</span>
          </button>
        )}
        {isFolder && open && <ul className="tree-children">{renderItems(item.children, depth + 1)}</ul>}
      </li>
    );
  });

  return (
    <aside className="tree-panel panel-surface" aria-label="Repository file tree">
      <div className="panel-heading">
        <div><span className="eyebrow">REPOSITORY INDEX</span><h2>Files</h2></div>
        <span className="panel-count">{nodes.filter((node) => node.kind === 'file' || node.kind === 'module').length || nodes.length}</span>
      </div>
      {demo && <span className="mini-demo-label">DEMO DATA</span>}
      <label className="tree-search">
        <Search size={14} aria-hidden="true" />
        <span className="sr-only">Filter repository paths</span>
        <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter paths" />
        <kbd>/</kbd>
      </label>
      {nodes.length ? <ul className="file-tree-list">{renderItems(tree)}</ul> : <p className="tree-empty">File paths are not available for this analysis.</p>}
      <div className="tree-footer"><span>INDEXED PATHS</span><span>{nodes.length.toString().padStart(2, '0')}</span></div>
    </aside>
  );
}
