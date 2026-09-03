/**
 * Route: "/reader/$jobId" — Reader view.
 *
 * Loader uses @retainpdf/api/fetchJobPayload + @retainpdf/domain artifact
 * name helpers. Component consumes loader data via useLoaderData and renders
 * the shared ReaderPage host (which consumes @retainpdf/reader), lazily
 * code-split via React.lazy + Suspense.
 */
import { Suspense, lazy } from 'react'
import { Link, createRoute, getRouteApi } from '@tanstack/react-router'
import { fetchJobPayload } from '@retainpdf/api/jobs'
import { resolveTranslatedPdfDownloadName, resolveSourcePdfDownloadName } from '@retainpdf/domain/job'
import type { rootRoute } from './__root'

const LazyReaderPage = lazy(() => import('@/features/reader').then((m) => ({ default: m.ReaderPage })))

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

const readerJobIdRouteApi = getRouteApi('/reader/$jobId')

function ReaderJobIdComponent() {
  const { jobId } = readerJobIdRouteApi.useParams()
  // Consume loader payload (names/error surfaced below; payload itself owned by ReaderPage adapters).
  const loaderData = readerJobIdRouteApi.useLoaderData() as {
    names?: { source?: string | null; translated?: string | null } | null
    error?: string
  }

  return (
    <div className="space-y-4" data-testid="reader-route">
      <div className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm">
        <div>
          <h1 className="text-sm font-semibold">Reader</h1>
          <p className="font-mono text-xs text-neutral-500">{jobId}</p>
          {loaderData?.names ? (
            <p className="mt-1 text-xs text-neutral-400">
              via @retainpdf/domain: {loaderData.names.source || '-'} / {loaderData.names.translated || '-'}
            </p>
          ) : null}
          {loaderData?.error ? <p className="mt-1 text-xs text-amber-600">Loader note: {loaderData.error}</p> : null}
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
        <Suspense fallback={<div className="p-6 text-sm text-neutral-500">Loading reader for {jobId}…</div>}>
          <LazyReaderPage jobId={jobId} />
        </Suspense>
      </div>
    </div>
  )
}

function ReaderPendingComponent() {
  return <div className="p-6 text-sm text-neutral-500" data-testid="reader-loading">Loading reader…</div>
}

function ReaderErrorComponent({ error }: { error: unknown }) {
  return (
    <div className="space-y-4 p-6" data-testid="reader-error">
      <h1 className="text-sm font-semibold">Reader failed to load</h1>
      <p className="text-sm text-red-600">{error instanceof Error ? error.message : 'Unknown error'}</p>
      <Link to="/" className="inline-block text-sm text-blue-600 underline">
        Back to Library
      </Link>
    </div>
  )
}

export function createReaderJobIdRoute(parent: typeof rootRoute) {
  return createRoute({
    getParentRoute: () => parent,
    path: '/reader/$jobId',
    loader: readerLoader as any,
    component: ReaderJobIdComponent,
    pendingComponent: ReaderPendingComponent,
    errorComponent: ReaderErrorComponent as any,
  })
}

export const ReaderComponent = ReaderJobIdComponent
export const loader = readerLoader
