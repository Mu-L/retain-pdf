/**
 * Root route — defines the SPA shell root for TanStack Router.
 *
 * This file is the code-based equivalent of file-based `src/routes/__root.tsx`.
 * It re-exports the `rootRoute` so `src/router.tsx` can assemble the tree.
 */
import { createRootRoute } from '@tanstack/react-router'
import { RootLayout } from '@/components/layout/RootLayout'

export const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => (
    <main className="mx-auto max-w-[960px] p-6">
      <h1 className="text-lg font-semibold">Not found</h1>
      <p className="mt-2 text-sm text-neutral-500">The page you requested does not exist.</p>
      <a href="/" className="mt-4 inline-block text-sm text-blue-600 underline">
        Back to Library
      </a>
    </main>
  ),
})
