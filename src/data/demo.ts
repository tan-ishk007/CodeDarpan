import type { AnalysisSnapshot, FileSourceResponse, GraphEdge, GraphNode, GraphResponse, HealthResponse, ImpactResponse, IssueItem, OnboardingResponse } from '../types';

export const DEMO_REPOSITORY = 'sample/atlas-compiler';
export const DEMO_SNAPSHOT: AnalysisSnapshot = {
  runId: 'demo-atlas-compiler',
  sourceType: 'fixture',
  repositoryUrl: 'https://github.com/sample/atlas-compiler',
  revision: 'demo-fixture',
  createdAt: '2026-10-01T00:00:00.000Z',
  status: 'ready',
  filesScanned: 12,
  filesSkipped: 2,
  nodesCount: 15,
  edgesCount: 18,
  parseDurationMs: 84,
  totalAnalysisDurationMs: 126,
  warnings: [{ code: 'DEMO_FIXTURE', stage: 'fixture', message: 'All values in this sample are illustrative and are not analyzer output.', severity: 'info' }],
};

export const DEMO_NODES: GraphNode[] = [
  { id: 'file:src/index.ts', kind: 'file', name: 'index.ts', path: 'src/index.ts', language: 'TypeScript', loc: 32, tokenCount: 74, complexity: 2, fanIn: 0, fanOut: 2, clusterId: 'application' },
  { id: 'file:src/parser/parseRepository.ts', kind: 'file', name: 'parseRepository.ts', path: 'src/parser/parseRepository.ts', language: 'TypeScript', loc: 118, tokenCount: 284, complexity: 9, fanIn: 1, fanOut: 3, clusterId: 'parser' },
  { id: 'file:src/parser/babelAdapter.ts', kind: 'file', name: 'babelAdapter.ts', path: 'src/parser/babelAdapter.ts', language: 'TypeScript', loc: 204, tokenCount: 492, complexity: 14, fanIn: 2, fanOut: 2, churnAdded: 18, churnDeleted: 4, riskScore: 68, clusterId: 'parser' },
  { id: 'file:src/parser/importResolver.ts', kind: 'file', name: 'importResolver.ts', path: 'src/parser/importResolver.ts', language: 'TypeScript', loc: 143, tokenCount: 330, complexity: 8, fanIn: 1, fanOut: 2, clusterId: 'parser' },
  { id: 'file:src/graph/buildGraph.ts', kind: 'file', name: 'buildGraph.ts', path: 'src/graph/buildGraph.ts', language: 'TypeScript', loc: 176, tokenCount: 418, complexity: 11, fanIn: 3, fanOut: 3, churnAdded: 25, churnDeleted: 9, riskScore: 76, clusterId: 'graph' },
  { id: 'file:src/graph/algorithms.ts', kind: 'file', name: 'algorithms.ts', path: 'src/graph/algorithms.ts', language: 'TypeScript', loc: 129, tokenCount: 302, complexity: 7, fanIn: 2, fanOut: 1, clusterId: 'graph' },
  { id: 'file:src/metrics/complexity.ts', kind: 'file', name: 'complexity.ts', path: 'src/metrics/complexity.ts', language: 'TypeScript', loc: 82, tokenCount: 192, complexity: 6, fanIn: 2, fanOut: 1, clusterId: 'metrics' },
  { id: 'file:src/metrics/risk.ts', kind: 'file', name: 'risk.ts', path: 'src/metrics/risk.ts', language: 'TypeScript', loc: 96, tokenCount: 228, complexity: 5, fanIn: 1, fanOut: 2, clusterId: 'metrics' },
  { id: 'file:src/ui/AtlasCanvas.tsx', kind: 'file', name: 'AtlasCanvas.tsx', path: 'src/ui/AtlasCanvas.tsx', language: 'TSX', loc: 160, tokenCount: 398, complexity: 8, fanIn: 2, fanOut: 2, clusterId: 'interface' },
  { id: 'file:src/ui/FileTree.tsx', kind: 'file', name: 'FileTree.tsx', path: 'src/ui/FileTree.tsx', language: 'TSX', loc: 97, tokenCount: 221, complexity: 4, fanIn: 1, fanOut: 1, clusterId: 'interface' },
  { id: 'file:src/ui/NodeInspector.tsx', kind: 'file', name: 'NodeInspector.tsx', path: 'src/ui/NodeInspector.tsx', language: 'TSX', loc: 121, tokenCount: 286, complexity: 6, fanIn: 1, fanOut: 2, clusterId: 'interface' },
  { id: 'file:src/api/analyses.ts', kind: 'file', name: 'analyses.ts', path: 'src/api/analyses.ts', language: 'TypeScript', loc: 108, tokenCount: 259, complexity: 6, fanIn: 1, fanOut: 2, clusterId: 'service' },
  { id: 'file:tests/graph.test.ts', kind: 'file', name: 'graph.test.ts', path: 'tests/graph.test.ts', language: 'TypeScript', loc: 74, tokenCount: 169, complexity: 3, fanIn: 2, fanOut: 1, clusterId: 'tests' },
  { id: 'file:README.md', kind: 'file', name: 'README.md', path: 'README.md', language: 'Markdown', loc: 46, tokenCount: 116, complexity: 1, fanIn: 0, fanOut: 1, clusterId: 'docs' },
];

export const DEMO_EDGES: GraphEdge[] = [
  ['file:src/index.ts', 'file:src/parser/parseRepository.ts', 'imports'],
  ['file:src/index.ts', 'file:src/ui/AtlasCanvas.tsx', 'imports'],
  ['file:src/parser/parseRepository.ts', 'file:src/parser/babelAdapter.ts', 'imports'],
  ['file:src/parser/parseRepository.ts', 'file:src/parser/importResolver.ts', 'imports'],
  ['file:src/parser/parseRepository.ts', 'file:src/graph/buildGraph.ts', 'calls'],
  ['file:src/parser/babelAdapter.ts', 'file:src/graph/buildGraph.ts', 'imports'],
  ['file:src/parser/importResolver.ts', 'file:src/graph/algorithms.ts', 'calls'],
  ['file:src/graph/buildGraph.ts', 'file:src/graph/algorithms.ts', 'imports'],
  ['file:src/graph/algorithms.ts', 'file:src/metrics/complexity.ts', 'calls'],
  ['file:src/metrics/complexity.ts', 'file:src/metrics/risk.ts', 'imports'],
  ['file:src/metrics/risk.ts', 'file:src/graph/buildGraph.ts', 'possible'],
  ['file:src/ui/AtlasCanvas.tsx', 'file:src/ui/FileTree.tsx', 'imports'],
  ['file:src/ui/AtlasCanvas.tsx', 'file:src/ui/NodeInspector.tsx', 'imports'],
  ['file:src/ui/FileTree.tsx', 'file:src/api/analyses.ts', 'calls'],
  ['file:src/ui/NodeInspector.tsx', 'file:src/api/analyses.ts', 'calls'],
  ['file:src/api/analyses.ts', 'file:src/graph/buildGraph.ts', 'imports'],
  ['file:tests/graph.test.ts', 'file:src/graph/algorithms.ts', 'imports'],
  ['file:README.md', 'file:src/index.ts', 'contains'],
].map(([sourceId, targetId, kind], index) => ({
  id: `demo-edge-${index + 1}`,
  sourceId,
  targetId,
  kind: kind === 'possible' ? 'imports' : (kind as GraphEdge['kind']),
  confidence: kind === 'possible' ? 'possible' : 'resolved',
  sourcePath: sourceId.replace('file:', ''),
}));

export const DEMO_GRAPH: GraphResponse = { nodes: DEMO_NODES, edges: DEMO_EDGES };

const sources: Record<string, string> = {
  'file:src/graph/buildGraph.ts': `import { fanIn, fanOut } from './algorithms';\nimport type { GraphEdge, GraphNode } from '../contracts';\n\nexport function buildGraph(nodes: GraphNode[], edges: GraphEdge[]) {\n  const unique = new Map<string, GraphEdge>();\n\n  for (const edge of edges) {\n    const key = [edge.sourceId, edge.targetId, edge.kind].join(':');\n    if (!unique.has(key)) unique.set(key, edge);\n  }\n\n  return {\n    nodes: nodes.map((node) => ({ ...node, fanIn: fanIn(node.id, edges), fanOut: fanOut(node.id, edges) })),\n    edges: [...unique.values()],\n  };\n}\n`,
  'file:src/parser/babelAdapter.ts': `import { parse } from '@babel/parser';\n\nexport function readModule(source: string, filename: string) {\n  return parse(source, {\n    sourceType: 'unambiguous',\n    sourceFilename: filename,\n    plugins: ['typescript', 'jsx'],\n    errorRecovery: true,\n  });\n}\n`,
  'file:src/graph/algorithms.ts': `export function fanIn(nodeId: string, edges: Array<{ targetId: string }>) {\n  return edges.filter((edge) => edge.targetId === nodeId).length;\n}\n\nexport function fanOut(nodeId: string, edges: Array<{ sourceId: string }>) {\n  return edges.filter((edge) => edge.sourceId === nodeId).length;\n}\n`,
  'file:src/ui/AtlasCanvas.tsx': `export function AtlasCanvas() {\n  const graph = useGraphSnapshot();\n  const selection = useSelectedNode();\n\n  return (\n    <GraphSurface\n      nodes={graph.nodes}\n      edges={graph.edges}\n      selectedId={selection.id}\n    />\n  );\n}\n`,
  'file:src/parser/parseRepository.ts': `export async function parseRepository(files: SourceFile[]) {\n  const facts = [];\n  const warnings = [];\n\n  for (const file of files) {\n    try {\n      facts.push(parseSource(file));\n    } catch (error) {\n      warnings.push({ path: file.path, message: String(error) });\n    }\n  }\n\n  return { facts, warnings };\n}\n`,
};

export function getDemoSource(nodeId: string): FileSourceResponse {
  const node = DEMO_NODES.find((item) => item.id === nodeId);
  return { file: node, source: sources[nodeId] ?? `// Illustrative sample source for ${node?.path ?? 'this file'}\nexport {};\n`, imports: [], dependents: [] };
}

export const DEMO_HEALTH: HealthResponse = {
  score: 72,
  confidence: 'illustrative',
  historyAvailable: true,
  factors: [
    { name: 'Dependency balance', score: 74, weight: 0.35, definition: 'Sample fan-in and fan-out balance', evidence: 'Illustrative fixture value' },
    { name: 'Complexity', score: 68, weight: 0.35, definition: 'Sample branch complexity', evidence: 'Illustrative fixture value' },
    { name: 'Change activity', score: 76, weight: 0.3, definition: 'Sample churn signal', evidence: 'Illustrative fixture value' },
  ],
  findings: [
    { id: 'demo-finding-1', nodeId: 'file:src/graph/buildGraph.ts', path: 'src/graph/buildGraph.ts', kind: 'coupling', title: 'Dense graph boundary', severity: 'review', confidence: 'illustrative', evidence: 'Sample fan-in 3 and fan-out 3' },
    { id: 'demo-finding-2', nodeId: 'file:src/metrics/risk.ts', path: 'src/metrics/risk.ts', kind: 'cycle', title: 'Possible relationship cycle', severity: 'watch', confidence: 'illustrative', evidence: 'One possible edge is included in this fixture' },
  ],
};

export const DEMO_ONBOARDING: OnboardingResponse = {
  steps: [
    { order: 1, nodeId: 'file:README.md', reason: 'Start with the repository overview.', evidence: 'Illustrative fixture path' },
    { order: 2, nodeId: 'file:src/index.ts', reason: 'Follow the declared entry point into the application.', evidence: 'Illustrative fixture path' },
    { order: 3, nodeId: 'file:src/parser/parseRepository.ts', reason: 'Read the parsing pipeline before its adapters.', evidence: 'Illustrative fixture path' },
    { order: 4, nodeId: 'file:src/graph/buildGraph.ts', reason: 'Inspect how normalized relationships are assembled.', evidence: 'Illustrative fixture path' },
    { order: 5, nodeId: 'file:tests/graph.test.ts', reason: 'Review the graph fixture expectations.', evidence: 'Illustrative fixture path' },
  ],
};

export const DEMO_ISSUES: IssueItem[] = [
  { number: 18, title: 'Document resolver confidence states', url: 'https://github.com/sample/atlas-compiler/issues/18', labels: ['good first issue', 'documentation'], candidateFiles: ['src/parser/importResolver.ts'], evidence: 'Illustrative sample issue-to-file association' },
];

export const DEMO_IMPACT: ImpactResponse = {
  direct: [{ nodeId: 'file:src/parser/parseRepository.ts', path: 'src/parser/parseRepository.ts' }, { nodeId: 'file:tests/graph.test.ts', path: 'tests/graph.test.ts' }],
  transitive: [{ nodeId: 'file:src/ui/AtlasCanvas.tsx', path: 'src/ui/AtlasCanvas.tsx' }, { nodeId: 'file:src/api/analyses.ts', path: 'src/api/analyses.ts' }],
  relatedTests: [{ nodeId: 'file:tests/graph.test.ts', path: 'tests/graph.test.ts' }],
  unresolved: [],
  caveat: 'Illustrative sample only. This is not a prediction of runtime failures.',
};
