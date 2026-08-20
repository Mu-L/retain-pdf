/**
 * Route: "/jobs/$jobId" — Job detail.
 *
 * Loader uses @retainpdf/api (fetchJobPayload) + @retainpdf/domain
 * (normalizeJobPayload, isJobTerminal, summarizeStatus).
 * Component mirrors DetailPage UI but via router params.
 */
import { useEffect, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { createRoute } from '@tanstack/react-router'
import { fetchJobPayload } from '@retainpdf/api/jobs'
import { normalizeJobPayload, summarizeStatus, isJobTerminal } from '@retainpdf/domain/job'
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

function JobsJobIdComponent() {
  const { jobId } = useParams({ from: '/jobs/$jobId' })
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    jobDetailLoader({ params: { jobId } })
      .then((res: any) => {
        if (cancelled) return
        if (res?.error && !res.raw) {
          // soft error — still show page with message
          setData(res)
        } else {
          setData(res)
        }
        setLoading(false)
      })
      .catch((e) => {
        if (cancelled) return
        setError((e as Error).message)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [jobId])

  if (loading) {
    return (
      <main className="mx-auto max-w-[960px] p-6" data-testid="job-detail-loading">
        <h1 className="text-lg font-semibold">Task Detail</h1>
        <p className="mt-2 text-sm text-neutral-500">Loading {jobId}…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-[960px] p-6">
        <h1 className="text-lg font-semibold">Task Detail</h1>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <Link to="/" className="mt-4 inline-block text-sm text-blue-600 underline">
          Back to Library
        </Link>
      </main>
    )
  }

  const raw = data?.raw ?? data?.normalized ?? {}
  const summary = data?.summary
  const terminal = data?.terminal

  return (
    <main className="mx-auto max-w-[960px] space-y-4 p-2" data-testid="job-detail-route">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Task Detail</h1>
        <div className="flex gap-2">
          <Link to="/" className="rounded-full border bg-white px-3 py-1 text-xs hover:bg-neutral-50">
            Library
          </Link>
          <Link to="/reader/$jobId" params={{ jobId } as any} className="rounded-full bg-neutral-950 px-3 py-1 text-xs text-white hover:bg-neutral-800">
            Open Reader
          </Link>
        </div>
      </div>

      {data?.error ? <p className="rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">Loader note: {data.error}</p> : null}

      <section className="grid gap-4">
        <div className="rounded border bg-white p-4">
          <div className="text-xs text-neutral-500">Job ID</div>
          <div className="font-mono text-sm">{raw?.job_id || raw?.jobId || jobId}</div>
        </div>
        <div className="rounded border bg-white p-4">
          <div className="text-xs text-neutral-500">Status</div>
          <div className="text-sm">{raw?.status || raw?.stage || (summary as any)?.status || '-'}</div>
          <div className="mt-1 text-xs text-neutral-400">Terminal: {String(terminal)} · via @retainpdf/domain/isJobTerminal</div>
        </div>
        <div className="rounded border bg-white p-4">
          <div className="text-xs text-neutral-500">Stage</div>
          <div className="text-sm">{raw?.stage || raw?.display_stage || (summary as any)?.stage || '-'}</div>
        </div>
        {raw?.artifacts ? (
          <div className="rounded border bg-white p-4">
            <div className="text-xs text-neutral-500">Artifacts</div>
            <pre className="mt-1 overflow-auto text-xs">{JSON.stringify(raw.artifacts, null, 2)}</pre>
          </div>
        ) : null}
        <details className="rounded border bg-white p-4">
          <summary className="cursor-pointer text-sm">Raw data (normalizeJobPayload + summarizeStatus attempted)</summary>
          <pre className="mt-2 overflow-auto text-xs">{JSON.stringify({ raw: data?.raw, normalized: data?.normalized, summary }, null, 2)}</pre>
        </details>
      </section>
    </main>
  )
}

export function createJobsJobIdRoute(parent: typeof rootRoute) {
  return createRoute({
    getParentRoute: () => parent,
    path: '/jobs/$jobId',
    loader: jobDetailLoader as any,
    component: JobsJobIdComponent,
  })
}

export const JobDetailComponent = JobsJobIdComponent
export const loader = jobDetailLoader
