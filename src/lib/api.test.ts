import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, createGitHubAnalysis, createZipAnalysis, getGraph } from './api';

describe('documented analyzer API client', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('posts only the repository URL and optional ref to the documented analysis route', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ runId: 'run-1', status: 'queued' }), {
      status: 202,
      headers: { 'content-type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(createGitHubAnalysis('https://github.com/example/repo', 'main')).resolves.toEqual({ runId: 'run-1', status: 'queued' });
    expect(fetchMock).toHaveBeenCalledWith('/api/analyses', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ repositoryUrl: 'https://github.com/example/repo', ref: 'main' }),
    }));
  });

  it('sends a ZIP as the documented multipart file field', async () => {
    const archive = new File(['zip-bytes'], 'repository.zip', { type: 'application/zip' });
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ runId: 'zip-run', status: 'queued' }), {
      status: 202,
      headers: { 'content-type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(createZipAnalysis(archive)).resolves.toEqual({ runId: 'zip-run', status: 'queued' });
    const request = fetchMock.mock.calls[0][1] as RequestInit;
    expect(fetchMock).toHaveBeenCalledWith('/api/analyses', expect.objectContaining({ method: 'POST' }));
    expect((request.body as FormData).get('file')).toBe(archive);
    expect(request.headers).toEqual({});
  });

  it('passes the chosen graph depth as the documented query parameter', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ nodes: [], edges: [], groups: [] }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(getGraph('run 1', 2)).resolves.toEqual({ nodes: [], edges: [], groups: [] });
    expect(fetchMock).toHaveBeenCalledWith('/api/analyses/run%201/graph?view=file&depth=2', expect.any(Object));
  });

  it('shows a non-JSON SPA/API response as unavailable instead of inventing a result', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('<!doctype html><html></html>', {
      status: 200,
      headers: { 'content-type': 'text/html' },
    }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(createGitHubAnalysis('https://github.com/example/repo')).rejects.toMatchObject({
      name: 'ApiError',
      code: 'API_UNAVAILABLE',
      status: 200,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('identifies an empty 404 for the missing analyzer route as unavailable', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 404 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(createGitHubAnalysis('https://github.com/example/repo')).rejects.toMatchObject({
      name: 'ApiError',
      code: 'API_UNAVAILABLE',
      status: 404,
    });
  });

  it('preserves a structured rate-limit error for actionable UI feedback', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: {
      code: 'RATE_LIMITED',
      message: 'The public GitHub request was rate limited.',
      stage: 'ingest',
      retryable: true,
    } }), {
      status: 429,
      headers: { 'content-type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);

    const request = createGitHubAnalysis('https://github.com/example/repo');
    await expect(request).rejects.toBeInstanceOf(ApiError);
    await expect(request).rejects.toMatchObject({ code: 'RATE_LIMITED', status: 429, stage: 'ingest', retryable: true });
  });
});
