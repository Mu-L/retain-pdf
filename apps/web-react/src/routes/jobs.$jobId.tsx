/**
 * Route: "/jobs/$jobId" — Job detail.
 *
 * Loader uses @retainpdf/api/fetchJobPayload + @retainpdf/domain
 * (normalizeJobPayload, isJobTerminal, summarizeStatus).
 * Component consumes loader data via useLoaderData and renders DetailPage,
 * which owns live polling via useDetailQuery.
 */
import { Link, createRoute, getRouteApi } from '@tanstack/react-router'
import { fetchJobPayload } from '@retainpdf/api/jobs'
import { normalizeJobPayload, summarizeStatus, isJobTerminal } from '@retainpdf/domain/job'
import { DetailPage } from '@/features/detail'
import type { rootRoute } from './__root'

export const jobDetailLoader = async ({ params }: { params: { jobId: string } }) => {
  const jobId = `${params.jobId || ''}`.trim()
  if (!jobId) throw new Error('Missing jobId')
  try {
    const raw = await fetchJobPayload(jobId)
    const normalized = (() => {
      try {
        return normalizeJobPayload(raw)
      } catch {
        return raw
      }
    })()
    const summary = (() => {
      try {
        return summarizeStatus(normalized as any)
      } catch {
        return null
      }
    })()
    const terminal = (() => {
      try {
        return isJobTerminal(normalized as any)
      } catch {
        return false
      }
    })()
    return { jobId, raw, normalized, summary, terminal }
  } catch (err) {
    // Return offline fallback so route still renders (important for build-time / offline preview)
    return { jobId, raw: null, normalized: null, summary: null, terminal: false, error: (err as Error).message }
  }
}

const jobsJobIdRouteApi = getRouteApi('/jobs/$jobId')

function JobsJobIdComponent() {
  const { jobId } = jobsJobIdRouteApi.useParams()
  // Consume loader payload (prefetch parity with DetailPage's useDetailQuery).
  const loaderData = jobsJobIdRouteApi.useLoaderData() as { error?: string }
  const loaderError = (loaderData as any)?.error as string | undefined

  return (
    <div className="space-y-2" data-testid="job-detail-route">
      {loaderError ? (
        <p className="mx-auto mt-2 max-w-[960px] rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          Loader note: {loaderError}
        </p>
      ) : null}
      <DetailPage jobId={jobId} />
    </div>
  )
}

function JobsPendingComponent() {
  return (
    <main className="mx-auto max-w-[960px] p-6" data-testid="job-detail-loading">
      <h1 className="text-lg font-semibold">Task Detail</h1>
      <p className="mt-2 text-sm text-neutral-500">Loading…</p>
    </main>
  )
}

function JobsErrorComponent({ error }: { error: unknown }) {
  return (
    <main className="mx-auto max-w-[960px] p-6" data-testid="job-detail-error">
      <h1 className="text-lg font-semibold">Task Detail</h1>
      <p className="mt-2 text-sm text-red-600">{error instanceof Error ? error.message : 'Unknown error'}</p>
      <Link to="/" className="mt-4 inline-block text-sm text-blue-600 underline">
        Back to Library
      </Link>
    </main>
  )
}

export function createJobsJobIdRoute(parent: typeof rootRoute) {
  return createRoute({
    getParentRoute: () => parent,
    path: '/jobs/$jobId',
    loader: jobDetailLoader as any,
    component: JobsJobIdComponent,
    pendingComponent: JobsPendingComponent,
    errorComponent: JobsErrorComponent as any,
  })
}

export const JobDetailComponent = JobsJobIdComponent
export const loader = jobDetailLoader
