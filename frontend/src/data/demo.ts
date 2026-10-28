export type DemoNode = {
  id: string;
  name: string;
  path: string;
  kind: 'file' | 'module' | 'function' | 'symbol';
  language?: string;
  line?: number;
  loc?: number;
  complexity?: number;
  group: string;
};

export type DemoEdge = {
  id: string;
  source: string;
  target: string;
  kind: 'imports' | 'calls';
};

export const demoNodes: DemoNode[] = [
  { id: 'src/main.tsx', name: 'main.tsx', path: 'src/main.tsx', kind: 'file', language: 'TypeScript', loc: 18, complexity: 1, group: 'entry' },
  { id: 'src/App.tsx', name: 'App.tsx', path: 'src/App.tsx', kind: 'file', language: 'TypeScript', loc: 42, complexity: 3, group: 'entry' },
  { id: 'src/pages/AtlasPage.tsx', name: 'AtlasPage.tsx', path: 'src/pages/AtlasPage.tsx', kind: 'file', language: 'TypeScript', loc: 184, complexity: 9, group: 'pages' },
  { id: 'src/components/FileTree.tsx', name: 'FileTree.tsx', path: 'src/components/FileTree.tsx', kind: 'file', language: 'TypeScript', loc: 96, complexity: 6, group: 'components' },
  { id: 'src/components/AtlasGraph.tsx', name: 'AtlasGraph.tsx', path: 'src/components/AtlasGraph.tsx', kind: 'file', language: 'TypeScript', loc: 142, complexity: 7, group: 'components' },
  { id: 'src/lib/api.ts', name: 'api.ts', path: 'src/lib/api.ts', kind: 'file', language: 'TypeScript', loc: 108, complexity: 5, group: 'service' },
  { id: 'src/hooks/useAnalysis.ts', name: 'useAnalysis.ts', path: 'src/hooks/useAnalysis.ts', kind: 'file', language: 'TypeScript', loc: 76, complexity: 4, group: 'service' },
  { id: 'src/types/index.ts', name: 'index.ts', path: 'src/types/index.ts', kind: 'file', language: 'TypeScript', loc: 58, complexity: 1, group: 'foundation' },
  { id: 'src/data/normalize.ts', name: 'normalize.ts', path: 'src/data/normalize.ts', kind: 'file', language: 'TypeScript', loc: 67, complexity: 4, group: 'foundation' },
  { id: 'tests/api.test.ts', name: 'api.test.ts', path: 'tests/api.test.ts', kind: 'file', language: 'TypeScript', loc: 112, complexity: 3, group: 'tests' },
  { id: 'src/pages/HealthPage.tsx', name: 'HealthPage.tsx', path: 'src/pages/HealthPage.tsx', kind: 'file', language: 'TypeScript', loc: 121, complexity: 6, group: 'pages' },
  { id: 'src/pages/ImpactPage.tsx', name: 'ImpactPage.tsx', path: 'src/pages/ImpactPage.tsx', kind: 'file', language: 'TypeScript', loc: 148, complexity: 8, group: 'pages' },
  { id: 'src/components/ModeTabs.tsx', name: 'ModeTabs.tsx', path: 'src/components/ModeTabs.tsx', kind: 'file', language: 'TypeScript', loc: 54, complexity: 2, group: 'components' },
  { id: 'src/components/GraphToolbar.tsx', name: 'GraphToolbar.tsx', path: 'src/components/GraphToolbar.tsx', kind: 'file', language: 'TypeScript', loc: 88, complexity: 4, group: 'components' },
  { id: 'src/components/NodeCard.tsx', name: 'NodeCard.tsx', path: 'src/components/NodeCard.tsx', kind: 'file', language: 'TypeScript', loc: 63, complexity: 3, group: 'components' },
  { id: 'src/components/SourceInspector.tsx', name: 'SourceInspector.tsx', path: 'src/components/SourceInspector.tsx', kind: 'file', language: 'TypeScript', loc: 109, complexity: 5, group: 'components' },
  { id: 'src/components/StatusBadge.tsx', name: 'StatusBadge.tsx', path: 'src/components/StatusBadge.tsx', kind: 'file', language: 'TypeScript', loc: 37, complexity: 1, group: 'components' },
  { id: 'src/hooks/useGraphFocus.ts', name: 'useGraphFocus.ts', path: 'src/hooks/useGraphFocus.ts', kind: 'file', language: 'TypeScript', loc: 72, complexity: 4, group: 'service' },
  { id: 'src/hooks/useSource.ts', name: 'useSource.ts', path: 'src/hooks/useSource.ts', kind: 'file', language: 'TypeScript', loc: 58, complexity: 3, group: 'service' },
  { id: 'src/lib/graphLayout.ts', name: 'graphLayout.ts', path: 'src/lib/graphLayout.ts', kind: 'file', language: 'TypeScript', loc: 96, complexity: 5, group: 'foundation' },
  { id: 'src/lib/search.ts', name: 'search.ts', path: 'src/lib/search.ts', kind: 'file', language: 'TypeScript', loc: 83, complexity: 4, group: 'foundation' },
  { id: 'src/data/sampleGraph.ts', name: 'sampleGraph.ts', path: 'src/data/sampleGraph.ts', kind: 'file', language: 'TypeScript', loc: 135, complexity: 2, group: 'data' },
  { id: 'src/utils/paths.ts', name: 'paths.ts', path: 'src/utils/paths.ts', kind: 'file', language: 'TypeScript', loc: 46, complexity: 2, group: 'foundation' },
  { id: 'tests/graph.test.ts', name: 'graph.test.ts', path: 'tests/graph.test.ts', kind: 'file', language: 'TypeScript', loc: 97, complexity: 4, group: 'tests' },
  { id: 'tests/normalize.test.ts', name: 'normalize.test.ts', path: 'tests/normalize.test.ts', kind: 'file', language: 'TypeScript', loc: 74, complexity: 3, group: 'tests' },
];

export const demoEdges: DemoEdge[] = [
  { id: 'e1', source: 'src/main.tsx', target: 'src/App.tsx', kind: 'imports' },
  { id: 'e2', source: 'src/App.tsx', target: 'src/pages/AtlasPage.tsx', kind: 'imports' },
  { id: 'e3', source: 'src/pages/AtlasPage.tsx', target: 'src/components/FileTree.tsx', kind: 'imports' },
  { id: 'e4', source: 'src/pages/AtlasPage.tsx', target: 'src/components/AtlasGraph.tsx', kind: 'imports' },
  { id: 'e5', source: 'src/pages/AtlasPage.tsx', target: 'src/hooks/useAnalysis.ts', kind: 'imports' },
  { id: 'e6', source: 'src/pages/AtlasPage.tsx', target: 'src/lib/api.ts', kind: 'imports' },
  { id: 'e7', source: 'src/components/FileTree.tsx', target: 'src/types/index.ts', kind: 'imports' },
  { id: 'e8', source: 'src/components/AtlasGraph.tsx', target: 'src/types/index.ts', kind: 'imports' },
  { id: 'e9', source: 'src/hooks/useAnalysis.ts', target: 'src/lib/api.ts', kind: 'imports' },
  { id: 'e10', source: 'src/lib/api.ts', target: 'src/types/index.ts', kind: 'imports' },
  { id: 'e11', source: 'src/data/normalize.ts', target: 'src/types/index.ts', kind: 'imports' },
  { id: 'e12', source: 'src/pages/AtlasPage.tsx', target: 'src/data/normalize.ts', kind: 'calls' },
  { id: 'e13', source: 'src/lib/api.ts', target: 'src/data/normalize.ts', kind: 'calls' },
  { id: 'e14', source: 'tests/api.test.ts', target: 'src/lib/api.ts', kind: 'imports' },
  { id: 'e15', source: 'src/App.tsx', target: 'src/pages/HealthPage.tsx', kind: 'imports' },
  { id: 'e16', source: 'src/App.tsx', target: 'src/pages/ImpactPage.tsx', kind: 'imports' },
  { id: 'e17', source: 'src/App.tsx', target: 'src/components/ModeTabs.tsx', kind: 'imports' },
  { id: 'e18', source: 'src/components/ModeTabs.tsx', target: 'src/types/index.ts', kind: 'imports' },
  { id: 'e19', source: 'src/pages/AtlasPage.tsx', target: 'src/components/GraphToolbar.tsx', kind: 'imports' },
  { id: 'e20', source: 'src/pages/AtlasPage.tsx', target: 'src/components/SourceInspector.tsx', kind: 'imports' },
  { id: 'e21', source: 'src/components/AtlasGraph.tsx', target: 'src/components/NodeCard.tsx', kind: 'imports' },
  { id: 'e22', source: 'src/components/AtlasGraph.tsx', target: 'src/hooks/useGraphFocus.ts', kind: 'imports' },
  { id: 'e23', source: 'src/components/AtlasGraph.tsx', target: 'src/lib/graphLayout.ts', kind: 'imports' },
  { id: 'e24', source: 'src/components/GraphToolbar.tsx', target: 'src/lib/search.ts', kind: 'imports' },
  { id: 'e25', source: 'src/components/GraphToolbar.tsx', target: 'src/components/StatusBadge.tsx', kind: 'imports' },
  { id: 'e26', source: 'src/components/SourceInspector.tsx', target: 'src/hooks/useSource.ts', kind: 'imports' },
  { id: 'e27', source: 'src/hooks/useSource.ts', target: 'src/lib/api.ts', kind: 'calls' },
  { id: 'e28', source: 'src/hooks/useGraphFocus.ts', target: 'src/lib/graphLayout.ts', kind: 'calls' },
  { id: 'e29', source: 'src/pages/HealthPage.tsx', target: 'src/components/StatusBadge.tsx', kind: 'imports' },
  { id: 'e30', source: 'src/pages/HealthPage.tsx', target: 'src/lib/api.ts', kind: 'calls' },
  { id: 'e31', source: 'src/pages/ImpactPage.tsx', target: 'src/lib/graphLayout.ts', kind: 'imports' },
  { id: 'e32', source: 'src/pages/ImpactPage.tsx', target: 'src/lib/api.ts', kind: 'calls' },
  { id: 'e33', source: 'src/data/sampleGraph.ts', target: 'src/types/index.ts', kind: 'imports' },
  { id: 'e34', source: 'src/data/sampleGraph.ts', target: 'src/data/normalize.ts', kind: 'calls' },
  { id: 'e35', source: 'src/lib/graphLayout.ts', target: 'src/utils/paths.ts', kind: 'imports' },
  { id: 'e36', source: 'src/lib/search.ts', target: 'src/utils/paths.ts', kind: 'imports' },
  { id: 'e37', source: 'tests/graph.test.ts', target: 'src/lib/graphLayout.ts', kind: 'imports' },
  { id: 'e38', source: 'tests/graph.test.ts', target: 'src/hooks/useGraphFocus.ts', kind: 'calls' },
  { id: 'e39', source: 'tests/normalize.test.ts', target: 'src/data/normalize.ts', kind: 'imports' },
  { id: 'e40', source: 'tests/normalize.test.ts', target: 'src/types/index.ts', kind: 'imports' },
  { id: 'e41', source: 'tests/api.test.ts', target: 'src/hooks/useSource.ts', kind: 'imports' },
  { id: 'e42', source: 'src/pages/AtlasPage.tsx', target: 'src/data/sampleGraph.ts', kind: 'imports' },
];

export const demoSources: Record<string, { summary: string; code: string; startLine: number; imports: string[]; dependents: string[]; confidence: number }> = {
  'src/main.tsx': {
    summary: 'Application entry point. It mounts the router and global style layer.',
    startLine: 1,
    imports: ['src/App.tsx'],
    dependents: [],
    confidence: 0.98,
    code: `import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App';\nimport './styles/index.css';\n\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>,\n);`,
  },
  'src/pages/AtlasPage.tsx': {
    summary: 'Coordinates the atlas view and keeps selected files, graph focus and inspector content in sync.',
    startLine: 1,
    imports: ['src/components/FileTree.tsx', 'src/components/AtlasGraph.tsx', 'src/hooks/useAnalysis.ts'],
    dependents: ['src/App.tsx'],
    confidence: 0.93,
    code: `import { useMemo, useState } from 'react';\nimport { FileTree } from '../components/FileTree';\nimport { AtlasGraph } from '../components/AtlasGraph';\nimport { useAnalysis } from '../hooks/useAnalysis';\n\nexport function AtlasPage() {\n  const analysis = useAnalysis();\n  const [selectedPath, setSelectedPath] = useState('src/main.tsx');\n  const visibleFiles = useMemo(() =>\n    analysis.files.filter((file) => file.path.includes(selectedPath)),\n    [analysis.files, selectedPath],\n  );\n\n  return (\n    <section aria-label="Repository atlas">\n      <FileTree files={analysis.files} onSelect={setSelectedPath} />\n      <AtlasGraph nodes={visibleFiles} selectedPath={selectedPath} />\n    </section>\n  );\n}`,
  },
  'src/lib/api.ts': {
    summary: 'A small same-origin client. Responses remain untrusted until their shape is checked.',
    startLine: 1,
    imports: ['src/types/index.ts'],
    dependents: ['src/pages/AtlasPage.tsx', 'src/hooks/useAnalysis.ts', 'tests/api.test.ts'],
    confidence: 0.96,
    code: `export async function requestJson<T>(path: string): Promise<T> {\n  const response = await fetch(path, {\n    headers: { Accept: 'application/json' },\n  });\n\n  const contentType = response.headers.get('content-type') ?? '';\n  if (!contentType.includes('application/json')) {\n    throw new Error('The analyzer did not return JSON.');\n  }\n\n  const payload = await response.json();\n  if (!response.ok) throw toApiError(response.status, payload);\n  return payload as T;\n}`,
  },
};


export const demoEvidence = {
  diagnose: {
    score: 72,
    confidence: 0.84,
    historyAvailable: false,
    factors: [
      { name: 'Dependency concentration', evidence: 'Several sample UI modules connect through one service client.' },
      { name: 'History', evidence: 'Git history is intentionally unavailable in this fixture.' },
    ],
    findings: [
      { title: 'Review the shared request boundary', file: 'src/lib/api.ts', evidence: 'Illustrative sample finding; not a live repository assessment.' },
    ],
  },
  onboard: {
    role: 'Contributor',
    steps: [
      { order: 1, title: 'Start at the application entry point', files: ['src/main.tsx'], reason: 'See how the UI is mounted before following route behavior.' },
      { order: 2, title: 'Trace the atlas page composition', files: ['src/pages/AtlasPage.tsx', 'src/components/FileTree.tsx'], reason: 'Follow the file-tree and graph selection path.' },
      { order: 3, title: 'Inspect the request boundary', files: ['src/lib/api.ts'], reason: 'See where same-origin analyzer calls would be handled.' },
    ],
  },
  issues: {
    issues: [
      { title: 'Illustrative: document returned graph node fields', labels: ['help-wanted'], files: ['src/types/index.ts'] },
      { title: 'Illustrative: add keyboard focus to graph selection', labels: ['good-first-issue'], files: ['src/components/AtlasGraph.tsx'] },
    ],
  },
  impact: {
    selected: 'src/components/AtlasGraph.tsx',
    direct: ['src/pages/AtlasPage.tsx'],
    transitive: ['src/App.tsx'],
    relatedTests: ['tests/api.test.ts'],
    unresolved: [],
    caveat: 'Illustrative structural blast-radius estimate only; not a prediction of runtime failures.',
  },
} satisfies Record<'diagnose' | 'onboard' | 'issues' | 'impact', Record<string, unknown>>;
