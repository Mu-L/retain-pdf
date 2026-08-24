/**
 * Route: "/reader/$jobId" — Reader view.
 *
 * Loader uses @retainpdf/api (fetchJobPayload + job artifact helpers) and
 * @retainpdf/domain (artifact names, stage helpers). The component consumes
 * @retainpdf/reader through the shared ReaderPage host component.
 */
import { useEffect, useState } from 'react'
import { Link, useParams, createRoute } from '@tanstack/react-router'
import { fetchJobPayload } from '@retainpdf/api/jobs'
import { resolveTranslatedPdfDownloadName, resolveSourcePdfDownloadName } from '@retainpdf/domain/job'
import { ReaderPage } from '@/features/reader'
import type { rootRoute } from './__root'

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
        <ReaderPage jobId={jobId} />
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
