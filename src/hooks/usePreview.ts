// src/hooks/usePreview.ts
'use client'

import { useQuery } from '@tanstack/react-query'

export function usePreview(run: string) {
  return useQuery({
    queryKey: ['preview', run],
    queryFn: async () => {
      const res = await fetch(`/api/preview/${run}`)
      if (!res.ok) throw new Error('Could not load preview data')
      return res.json() as Promise<{
        slideUrls: string[],
        pptUrl: string
      }>
    },
    // options
    refetchOnWindowFocus: false,
  })
}
