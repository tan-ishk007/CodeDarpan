export type NodeKind = 'file' | 'module' | 'class' | 'function' | 'symbol';
export type EdgeKind = 'imports' | 'calls' | 'contains' | 'extends' | 'implements' | 'exports';
export type Confidence = 'resolved' | 'possible' | 'unresolved';
export type AnalysisStatus = 'queued' | 'running' | 'ready' | 'failed' | 'cancelled';

export interface GraphNode {
  id: string;
  kind: NodeKind;
  name: string;
  path: string;
  language: string;
  startLine?: number;
  endLine?: number;
  loc: number;
  tokenCount?: number;
  complexity?: number;
  fanIn: number;
  fanOut: number;
  churnAdded?: number | null;
  churnDeleted?: number | null;
  riskScore?: number;
  clusterId?: string;
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  kind: EdgeKind;
  confidence: Confidence;
  sourcePath: string;
  startLine?: number;
  endLine?: number;
  resolutionNote?: string;
}

export interface AnalysisWarning {
  code: string;
  stage: string;
  path?: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export interface AnalysisSnapshot {
  runId: string;
  sourceType: 'github' | 'zip' | 'fixture';
  repositoryUrl?: string;
  revision?: string;
  createdAt: string;
  status: AnalysisStatus;
  filesScanned: number;
  filesSkipped: number;
  nodesCount: number;
  edgesCount: number;
  parseDurationMs?: number;
  totalAnalysisDurationMs?: number;
  warnings: AnalysisWarning[];
}

export interface GraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
  groups?: Array<{ id: string; label?: string; nodeIds?: string[] }>;
}

export interface AnalysisProgressEvent {
  stage?: string;
  progress?: number;
  status?: AnalysisStatus | string;
  message?: string;
}

export interface SearchResult {
  nodeId: string;
  name: string;
  path: string;
  line?: number;
  kind: NodeKind;
  score?: number;
}

export interface FileRelation {
  id?: string;
  nodeId?: string;
  name?: string;
  path?: string;
  kind?: NodeKind | EdgeKind;
  confidence?: Confidence;
  resolutionNote?: string;
}

export interface FileSourceResponse {
  file?: Partial<GraphNode> & { parseStatus?: string };
  source?: string;
  imports?: Array<FileRelation | string>;
  dependents?: Array<FileRelation | string>;
}

export interface HealthFactor {
  name: string;
  score?: number;
  value?: number | string;
  weight?: number;
  confidence?: number | string;
  definition?: string;
  evidence?: string | string[];
  available?: boolean;
}

export interface Finding {
  id?: string;
  nodeId?: string;
  path?: string;
  kind?: string;
  title?: string;
  severity?: string;
  score?: number;
  confidence?: number | string;
  evidence?: string | string[];
  message?: string;
}

export interface HealthResponse {
  score?: number;
  confidence?: number | string;
  factors?: HealthFactor[];
  findings?: Finding[];
  historyAvailable?: boolean;
}

export interface OnboardingStep {
  order: number;
  nodeId: string;
  reason: string;
  evidence?: string | string[];
}

export interface OnboardingResponse {
  steps: OnboardingStep[];
}

export interface IssueItem {
  number: number;
  title: string;
  url: string;
  labels: string[];
  candidateFiles: string[];
  evidence: string | string[];
}

export interface IssuesResponse {
  issues: IssueItem[];
}

export interface ImpactItem {
  nodeId?: string;
  path?: string;
  name?: string;
  kind?: string;
  evidence?: string | string[];
}

export interface ImpactResponse {
  direct?: ImpactItem[];
  transitive?: ImpactItem[];
  relatedTests?: ImpactItem[];
  unresolved?: ImpactItem[];
  caveat?: string;
  pr?: { url?: string; title?: string; number?: number };
  changedFiles?: ImpactItem[];
  mappedNodes?: ImpactItem[];
}
