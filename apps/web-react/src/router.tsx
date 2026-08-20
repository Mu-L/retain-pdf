/**
 * TanStack Router — code-based route tree.
 *
 * Paths required by Phase 3:
 *   "/"               — library home (loader: @retainpdf/api/fetchLibraryBookList)
 *   "/jobs/$jobId"    — job detail  (loader: @retainpdf/api/fetchJobPayload + @retainpdf/domain)
 *   "/reader/$jobId"  — reader      (loader: @retainpdf/api + @retainpdf/domain, lazy @retainpdf/reader)
 *
 * RootLayout replaces HomeApp.tsx:51 composition:
 *   tabs (activeLibraryTab useState) → <Link> navigation
 *   AppTopBar / AppBottomBar / home-paper-stage → persistent shell + <Outlet />
 *
 * Enabled by default via VITE_USE_SPA !== 'false' (see src/app-flags.ts).
 * Legacy App.tsx kept as opt-out fallback (VITE_USE_SPA=false); archived at src/_archived/App.legacy.tsx.
 */
import { createRouter } from '@tanstack/react-router'
import { rootRoute } from '@/routes/__root'
import { createIndexRoute } from '@/routes/index'
import { createJobsJobIdRoute } from '@/routes/jobs.$jobId'
import { createReaderJobIdRoute } from '@/routes/reader.$jobId'

const indexRoute = createIndexRoute(rootRoute)
const jobsJobIdRoute = createJobsJobIdRoute(rootRoute)
const readerJobIdRoute = createReaderJobIdRoute(rootRoute)

const routeTree = rootRoute.addChildren([indexRoute, jobsJobIdRoute, readerJobIdRoute])

// @ts-ignore — TanStack Router requires strictNullChecks, but project keeps strict:false for domain parity; cast to any is safe at runtime
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
} as any)

// Register router for TanStack Router's type inference
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
