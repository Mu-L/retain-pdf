/**
 * Route: "/" — Library home.
 *
 * Loader uses @retainpdf/api (fetchLibraryBookList) and @retainpdf/domain
 * is used in the component for formatting/filtering parity with HomeApp.
 */
import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { createRoute } from '@tanstack/react-router'
import { fetchLibraryBookList } from '@retainpdf/api/library-books'
import { API_PREFIX } from '@retainpdf/api/runtime'
import { jobListToLibraryBooks } from '@/features/library/api/library-api-adapter'
import type { rootRoute } from './__root'

export const libraryLoader = async () => {
  // Loader demonstrates @retainpdf/api usage; fallback to empty on error so scaffold compiles offline.
  try {
    const raw = await fetchLibraryBookList(API_PREFIX, { q: '', limit: 40 })
    const items = (raw as any)?.items ?? (Array.isArray(raw) ? raw : [])
    const books = jobListToLibraryBooks(items)
    return { books, raw }
  } catch (err) {
    return { books: [], raw: null, error: (err as Error).message }
  }
}

function IndexRouteComponent() {
  const [state, setState] = useState<{ books: any[]; error?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    libraryLoader().then((res) => {
      if (cancelled) return
      setState({ books: (res as any).books ?? [], error: (res as any).error })
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold">Library</h1>
        <p className="mt-2 text-sm text-neutral-500">Loading books…</p>
      </section>
    )
  }

  const books = state?.books ?? []

  return (
    <section className="space-y-4" data-testid="library-route">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold">Library</h1>
        <p className="mt-1 text-sm text-neutral-500">
          SPA shell via TanStack Router. Loader used <code className="rounded bg-neutral-100 px-1">@retainpdf/api/fetchLibraryBookList</code>.
        </p>
        {state?.error ? <p className="mt-2 text-xs text-amber-600">Loader fallback (offline): {state.error}</p> : null}
        <p className="mt-2 text-xs text-neutral-400">{books.length} books loaded</p>
      </div>

      {books.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/60 p-8 text-center">
          <p className="text-sm text-neutral-500">No books yet — upload a PDF to get started.</p>
          <Link to="/" className="mt-3 inline-block text-sm text-blue-600 underline">
            Refresh
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {books.slice(0, 12).map((b: any) => {
            const jobId = b.id || b.job_id || b.jobId || ''
            return (
              <li key={jobId || b.title} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="text-sm font-medium">{b.title || b.filename || jobId || 'Untitled'}</div>
                <div className="mt-1 text-xs text-neutral-500">{b.status || b.stage || 'unknown'} · {jobId}</div>
                <div className="mt-3 flex gap-2">
                  <Link
                    to="/jobs/$jobId"
                    params={{ jobId: `${jobId}` } as any}
                    className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-white hover:bg-neutral-800"
                  >
                    Detail
                  </Link>
                  <Link
                    to="/reader/$jobId"
                    params={{ jobId: `${jobId}` } as any}
                    className="rounded-full border bg-white px-3 py-1 text-xs hover:bg-neutral-50"
                  >
                    Reader
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {/* Demo link to verify param routes compile even without real IDs */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="text-xs font-medium text-amber-800">Try param routes</div>
        <div className="mt-2 flex gap-2">
          <Link to="/jobs/$jobId" params={{ jobId: 'demo-job-123' } as any} className="text-xs text-blue-600 underline">
            /jobs/demo-job-123
          </Link>
          <Link to="/reader/$jobId" params={{ jobId: 'demo-job-123' } as any} className="text-xs text-blue-600 underline">
            /reader/demo-job-123
          </Link>
        </div>
      </div>
    </section>
  )
}

// Export a factory so router.tsx can create the route with correct parent without circular imports.
export function createIndexRoute(parent: typeof rootRoute) {
  return createRoute({
    getParentRoute: () => parent,
    path: '/',
    loader: libraryLoader,
    component: IndexRouteComponent,
  })
}

// Also export component/loader for direct use in tests or file-based mode
export const IndexComponent = IndexRouteComponent
export const loader = libraryLoader
