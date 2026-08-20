/**
 * RootLayout — SPA shell that replaces HomeApp.tsx:51 composition.
 *
 * HomeApp (MPA, apps/web) composed:
 *   - AppTopBar (activeLibraryTab, onTabChange)
 *   - MockModeBanner
 *   - home-paper-stage with conditional tabs (library / collections / favorites / ask)
 *   - AppBottomBar (showSearch, hidden batchMode)
 *   - <library-search-island>
 *   - dialogs (CredentialsDialog, GlossariesDialog, TranslationWorkflowDialog, etc.)
 *   - DownloadToastHost, SoftReaderHost, CollectionManageDialog, BookDetailDialog
 *
 * RootLayout instead renders:
 *   - Persistent app shell (top bar + bottom bar)
 *   - <Outlet /> where TanStack Router injects the matched page
 *     (/, /jobs/$jobId, /reader/$jobId)
 *
 * Tabs are now real routes (Link), not local useState. Content that was
 * conditionally mounted is now separate route components with their own loaders.
 */
import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Library', activeOptions: { exact: true } },
  { to: '/jobs/$jobId', label: 'Detail', disabled: true }, // placeholder, navigated via row click
  { to: '/reader/$jobId', label: 'Reader', disabled: true },
] as const

export function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <div id="app-shell" className="page app-shell min-h-screen bg-[#f5f5f7]" data-home-spa="tanstack-router">
      {/* Top bar — replaces HomeApp's AppTopBar + activeLibraryTab state */}
      <header className="sticky top-0 z-30 border-b border-neutral-200/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-950">
            <span className="grid size-8 place-items-center rounded-2xl bg-neutral-950 text-white">
              <BookOpen className="size-3.5" />
            </span>
            <span>RetainPDF</span>
            <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium tracking-wide text-amber-800">SPA</span>
          </Link>

          <nav aria-label="Primary" className="flex items-center gap-1">
            <Link
              to="/"
              className="rounded-full px-3 py-1.5 text-sm font-medium transition data-[status=active]:bg-neutral-950 data-[status=active]:text-white hover:bg-neutral-100"
            >
              Library
            </Link>
            <span className="hidden items-center gap-1 sm:flex">
              <span className="text-neutral-300">/</span>
              <span className="rounded-full px-3 py-1.5 text-xs text-neutral-500">/jobs/$jobId</span>
              <span className="text-neutral-300">/</span>
              <span className="rounded-full px-3 py-1.5 text-xs text-neutral-500">/reader/$jobId</span>
            </span>
          </nav>

          <div className="hidden text-xs text-neutral-500 sm:block" data-testid="spa-pathname">
            {pathname}
          </div>
        </div>
      </header>

      {/* Paper stage — replaces HomeApp's .home-paper-stage conditional rendering */}
      <div className="home-paper-stage mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
        <Outlet />
      </div>

      {/* Bottom bar — replaces HomeApp's AppBottomBar (showSearch / hidden=batchMode) */}
      <footer className="pointer-events-none fixed inset-x-0 bottom-4 z-20 flex justify-center px-4">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2 py-2 shadow-lg">
          <Link
            to="/"
            className="rounded-full bg-neutral-950 px-4 py-1.5 text-xs font-medium text-white hover:bg-neutral-800"
          >
            + Add PDF
          </Link>
          <span className="h-4 w-px bg-neutral-200" aria-hidden />
          <span className="px-2 text-xs text-neutral-500">Search via Library</span>
        </div>
      </footer>

      {/* Dialog hosts preserved as siblings (ported from HomeApp dialogs.html block) */}
      <div id="spa-dialog-host" aria-hidden />
    </div>
  )
}

// Re-export for __root.tsx convenience
export default RootLayout
