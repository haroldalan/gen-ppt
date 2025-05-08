// File: src/app/generate/page.tsx
import ProgressScreen from '@/components/ProgressScreen'
import { notFound }         from 'next/navigation'

export default async function GeneratePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const { run, template } = await searchParams

  if (!run || !template) {
    return notFound()
  }

  return <ProgressScreen run={run} template={template} />
}
