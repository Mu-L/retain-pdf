/**
 * Route: "/" — Library home.
 *
 * Single source: TanStack Query owns the list fetch (useLibraryData inside
 * LibraryRoute). No route loader — a loader fetch plus the component query
 * caused two requests and double loading spinners.
 *
 * Filter state is shareable via ?q=&sort=&status= (validated below, unknown
 * sort/status fall back to defaults). useLibraryController mirrors the URL,
 * so pasted links / refresh / back render the same shelf.
 */
import { Link, createRoute } from '@tanstack/react-router'
import { LibraryRoute } from '@/features/library/components/library-route'
import { parseLibrarySearch } from '@/features/library/model/library-search-params'
import type { rootRoute } from './__root'

function IndexRouteComponent() {
  return (
    <section className="space-y-4" data-testid="library-route">
      <LibraryRoute />
    </section>
  )
}

function IndexPendingComponent() {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm" data-testid="library-loading">
      <h1 className="text-lg font-semibold">Library</h1>
      <p className="mt-2 text-sm text-neutral-500">Loading books…</p>
    </section>
  )
}

function IndexErrorComponent({ error }: { error: unknown }) {
  return (
    <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm" data-testid="library-error">
      <h1 className="text-lg font-semibold">Library failed to load</h1>
      <p className="mt-2 text-sm text-red-600">{error instanceof Error ? error.message : 'Unknown error'}</p>
      <Link to="/" className="mt-4 inline-block text-sm text-blue-600 underline">
        Retry
      </Link>
    </section>
  )
}

// Export a factory so router.tsx can create the route with correct parent without circular imports.
export function createIndexRoute(parent: typeof rootRoute) {
  return createRoute({
    getParentRoute: () => parent,
    path: '/',
    validateSearch: (search: Record<string, unknown>) => parseLibrarySearch(search),
    component: IndexRouteComponent,
    pendingComponent: IndexPendingComponent,
    errorComponent: IndexErrorComponent as any,
  })
}

// Also export component for direct use in tests or file-based mode
export const IndexComponent = IndexRouteComponent
