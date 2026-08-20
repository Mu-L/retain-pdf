/**
 * Route: "/reader/$jobId" — Reader view.
 *
 * Loader uses @retainpdf/api (fetchJobPayload + job artifact helpers) and
 * @retainpdf/domain (artifact names, stage helpers). Component lazy-loads
 * @retainpdf/reader so the scaffold compiles even when peer deps are missing
 * (same pattern as features/reader/components/ReaderPage.tsx).
 */
import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, useParams, createRoute } from '@tanstack/react-router'
import { fetchJobPayload } from '@retainpdf/api/jobs'
import { resolveTranslatedPdfDownloadName, resolveSourcePdfDownloadName } from '@retainpdf/domain/job'
import type { rootRoute } from './__root'

const LazyReader = lazy(async () => {
  try {
    const mod = await import('@retainpdf/reader')
    const Comp = (mod as any).ReaderAppReactPdf || (mod as any).ReaderApp || (mod as any).default
    if (Comp) return { default: Comp as React.ComponentType }
  } catch {}
  const Placeholder = () => (
    <div className="rounded border border-dashed p-6 text-sm text-neutral-600">
      <p>Reader via @retainpdf/reader is available. Install peer deps (react-pdf, @assistant-ui/react, sonner) to render.</p>
      <p className="mt-1 text-xs text-neutral-500">Import: {"import { ReaderAppReactPdf } from '@retainpdf/reader'"}</p>
    </div>
  )
  return { default: Placeholder }
})

export const readerLoader = async ({ params }: { params: { jobId: string } }) => {
  const jobId = `${params.jobId || ''}`.trim()
  if (!jobId) throw new Error('Missing jobId')
  try {
    const raw = await fetchJobPayload(jobId)
    // Demonstrate domain artifact name helpers
    const names = (() => {
      try {
        return {
          source: resolveSourcePdfDownloadName(raw as any),
          translated: resolveTranslatedPdfDownloadName(raw as any),
        }
      } catch {
        return { source: null, translated: null }
      }
    })()
    return { jobId, raw, names }
  } catch (err) {
    return { jobId, raw: null, names: null, error: (err as Error).message }
  }
}

function ReaderJobIdComponent() {
  const { jobId } = useParams({ from: '/reader/$jobId' })
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    readerLoader({ params: { jobId } }).then((res) => {
      if (cancelled) return
      setData(res)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [jobId])

  if (loading) {
    return <div className="p-6 text-sm text-neutral-500">Loading reader for {jobId}…</div>
  }

  return (
    <div className="space-y-4" data-testid="reader-route">
      <div className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm">
        <div>
          <h1 className="text-sm font-semibold">Reader</h1>
          <p className="font-mono text-xs text-neutral-500">{jobId}</p>
          {data?.names ? (
            <p className="mt-1 text-xs text-neutral-400">
              via @retainpdf/domain: {data.names.source || '-'} / {data.names.translated || '-'}
            </p>
          ) : null}
          {data?.error ? <p className="mt-1 text-xs text-amber-600">Loader note: {data.error}</p> : null}
        </div>
        <div className="flex gap-2">
          <Link to="/" className="rounded-full border bg-white px-3 py-1 text-xs hover:bg-neutral-50">
            Library
          </Link>
          <Link to="/jobs/$jobId" params={{ jobId } as any} className="rounded-full border bg-white px-3 py-1 text-xs hover:bg-neutral-50">
            Detail
          </Link>
        </div>
      </div>

      <div className="min-h-[60vh] rounded-2xl border bg-white p-2 shadow-sm">
        <Suspense fallback={<div className="p-6 text-sm text-neutral-500">Loading reader…</div>}>
          <LazyReader />
        </Suspense>
        {jobId ? <div className="sr-only" data-job-id={jobId} /> : null}
      </div>
    </div>
  )
}

export function createReaderJobIdRoute(parent: typeof rootRoute) {
  return createRoute({
    getParentRoute: () => parent,
    path: '/reader/$jobId',
    loader: readerLoader as any,
    component: ReaderJobIdComponent,
  })
}

export const ReaderComponent = ReaderJobIdComponent
export const loader = readerLoader
