'use client';
import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import { uploadRequest } from '@/lib/upload-request';
import { useState } from 'react';

export function useGenerate() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function start(prompt: string, template: string) {
    setIsGenerating(true);
    setError(null);

    try {
      const runId = uuid();
      console.log('▶ run', runId);

      /* 1️⃣  presign */
      const presRes = await fetch('/api/presign', {
        method: 'POST',
        body: JSON.stringify({ run_id: runId }),
      });
      console.log('  presign', presRes.status);
      if (!presRes.ok) throw new Error('presign failed');
      const { putUrl } = await presRes.json();

      /* 2️⃣  upload */
      await uploadRequest(putUrl, { topic: prompt, template });
      console.log('  upload OK');

      /* 3️⃣  trigger pipeline (via our own API) */
      const trigRes = await fetch('/api/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ run_id: runId }),
      });
      console.log('  trigger', trigRes.status);
      if (!trigRes.ok) throw new Error('trigger failed');

      /* 4️⃣  navigate to progress screen */
      router.push(`/generate?run=${runId}&template=${template}`);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start generation'));
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }

  return {
    start,
    isGenerating,
    error,
  };
}
