import type {
  AnalysisProgressEvent,
  AnalysisSnapshot,
  FileSourceResponse,
  GraphResponse,
  HealthResponse,
  ImpactResponse,
  IssuesResponse,
  OnboardingResponse,
  SearchResult,
} from '../types';

export class ApiError extends Error {
  readonly code: string;
  readonly stage?: string;
  readonly retryable?: boolean;
  readonly status?: number;

  constructor(message: string, options: { code?: string; stage?: string; retryable?: boolean; status?: number } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = options.code ?? 'API_ERROR';
    this.stage = options.stage;
    this.retryable = options.retryable;
    this.status = options.status;
  }
}

interface ErrorBody {
  error?: { code?: string; message?: string; stage?: string; retryable?: boolean };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      headers: {
        ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError('Could not reach the analysis API. Connect a compatible analyzer and try again.', {
      code: 'NETWORK_ERROR',
      stage: 'connecting',
      retryable: true,
    });
  }

  if (response.status === 204) return undefined as T;
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new ApiError('Not available in this build. The documented analysis API did not return JSON.', {
      code: 'API_UNAVAILABLE',
      stage: 'connecting',
      retryable: false,
      status: response.status,
    });
  }

  const body = (await response.json()) as T & ErrorBody;
  if (!response.ok) {
    const error = (body as ErrorBody).error;
    throw new ApiError(error?.message ?? `The analysis request failed with HTTP ${response.status}.`, {
      code: error?.code,
      stage: error?.stage,
      retryable: error?.retryable,
      status: response.status,
    });
  }
  return body;
}

const runPath = (runId: string) => `/api/analyses/${encodeURIComponent(runId)}`;

export function createGitHubAnalysis(repositoryUrl: string, ref?: string): Promise<{ runId: string; status: string }> {
  return request('/api/analyses', {
    method: 'POST',
    body: JSON.stringify({ repositoryUrl, ...(ref ? { ref } : {}) }),
  });
}

export function createZipAnalysis(file: File): Promise<{ runId: string; status: string }> {
  const form = new FormData();
  form.append('file', file);
  return request('/api/analyses', { method: 'POST', body: form });
}

export const getAnalysis = (runId: string) => request<AnalysisSnapshot>(runPath(runId));
export const getGraph = (runId: string, depth = 1) =>
  request<GraphResponse>(`${runPath(runId)}/graph?view=file&depth=${depth}`);
export const getFile = (runId: string, fileId: string) =>
  request<FileSourceResponse>(`${runPath(runId)}/files/${encodeURIComponent(fileId)}`);
export const getHealth = (runId: string) => request<HealthResponse>(`${runPath(runId)}/health`);
export const getOnboarding = (runId: string, role: string, issueUrl?: string) => {
  const params = new URLSearchParams({ role });
  if (issueUrl) params.set('issueUrl', issueUrl);
  return request<OnboardingResponse>(`${runPath(runId)}/onboarding?${params.toString()}`);
};
export const getIssues = (runId: string) =>
  request<IssuesResponse>(`${runPath(runId)}/issues?labels=good-first-issue,help-wanted`);
export const getImpact = (runId: string, nodeId: string, depth = 3) =>
  request<ImpactResponse>(`${runPath(runId)}/impact?nodeId=${encodeURIComponent(nodeId)}&depth=${depth}`);
export const getPrImpact = (runId: string, prUrl: string) =>
  request<ImpactResponse>(`${runPath(runId)}/pr-impact`, { method: 'POST', body: JSON.stringify({ prUrl }) });
export const deleteAnalysis = (runId: string) => request<void>(runPath(runId), { method: 'DELETE' });

export async function searchAnalysis(runId: string, query: string, kind?: string): Promise<SearchResult[]> {
  const params = new URLSearchParams({ q: query });
  if (kind) params.set('kind', kind);
  const response = await request<{ results: SearchResult[] }>(`${runPath(runId)}/search?${params.toString()}`);
  return response.results;
}

export function subscribeToEvents(runId: string, onEvent: (event: AnalysisProgressEvent) => void, onError: () => void): () => void {
  const source = new EventSource(`${runPath(runId)}/events`);
  const parse = (event: Event) => {
    const message = event as MessageEvent<string>;
    try {
      onEvent(JSON.parse(message.data) as AnalysisProgressEvent);
    } catch {
      onError();
    }
  };
  source.onmessage = parse;
  source.addEventListener('progress', parse);
  source.addEventListener('analysis', parse);
  source.onerror = () => onError();
  return () => source.close();
}
