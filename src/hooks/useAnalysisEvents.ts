import { useEffect, useState } from 'react';
import { ApiError, getAnalysis, subscribeToEvents } from '../lib/api';
import type { AnalysisProgressEvent, AnalysisSnapshot } from '../types';

interface AnalysisState {
  runId: string | null;
  snapshot: AnalysisSnapshot | null;
  progress: AnalysisProgressEvent | null;
  error: ApiError | null;
  loading: boolean;
}

const emptyState = (runId: string | null): AnalysisState => ({
  runId,
  snapshot: null,
  progress: null,
  error: null,
  loading: Boolean(runId),
});

export function useAnalysisEvents(runId: string | null) {
  const [state, setState] = useState<AnalysisState>(() => emptyState(null));
  const current = state.runId === runId ? state : emptyState(runId);

  useEffect(() => {
    if (!runId) {
      setState(emptyState(null));
      return;
    }

    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let stopEvents: (() => void) | undefined;
    let failed = false;
    setState(emptyState(runId));

    const updateEvent = (progress: AnalysisProgressEvent) => {
      if (!active) return;
      setState((previous) => ({
        ...emptyState(runId),
        ...(previous.runId === runId ? previous : {}),
        progress,
        error: null,
      }));
    };

    const poll = async () => {
      if (!active || failed) return;
      try {
        const snapshot = await getAnalysis(runId);
        if (!active) return;
        setState((previous) => ({
          ...emptyState(runId),
          ...(previous.runId === runId ? previous : {}),
          snapshot,
          loading: false,
          error: null,
        }));
        if (snapshot.status === 'queued' || snapshot.status === 'running') {
          timer = setTimeout(poll, 3500);
        }
      } catch (error) {
        if (!active) return;
        failed = true;
        setState((previous) => ({
          ...emptyState(runId),
          ...(previous.runId === runId ? previous : {}),
          loading: false,
          error: error instanceof ApiError ? error : new ApiError('Could not load analysis status.'),
        }));
      }
    };

    stopEvents = subscribeToEvents(runId, updateEvent, () => {
      if (active) updateEvent({ message: 'Live updates are unavailable. Checking the documented status endpoint.' });
    });
    void poll();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      stopEvents?.();
    };
  }, [runId]);

  return current;
}
