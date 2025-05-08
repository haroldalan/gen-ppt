'use client';
import { useQuery } from '@tanstack/react-query';

export interface FrontendStatus {
  state: 'planning' | 'generating' | 'filling' | 'preview' | 'done' | 'error';
  progress: number;      // 0.0 – 1.0
  message: string;
}

const INITIAL_STATUS: FrontendStatus = {
  state: 'planning',
  progress: 0,
  message: 'Starting…',
};

export function useStatusPoll(runId: string) {
  return useQuery<FrontendStatus>({
    queryKey: ['status', runId],
    queryFn: async () => {
      const res = await fetch(`/api/status/${runId}`, { cache: 'no-store' });

      // 404: not written yet => return initial in-progress status
      if (res.status === 404) {
        return INITIAL_STATUS;
      }

      // any other non-OK: treat as real error
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Status fetch failed: ${res.status} ${text}`);
      }

      // OK: parse and return the real status JSON
      return res.json();
    },
    refetchInterval: 5000,
    retry: false,  // don't retry 404/initial—React-Query will refetch on its own
  });
}
