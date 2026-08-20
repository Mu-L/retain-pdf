/**
 * Feature flag for SPA shell cutover (Phase 3).
 * - `VITE_USE_SPA=true` enables new TanStack Router tree (`src/router.tsx` + `src/routes/*`).
 * - Default `false` keeps legacy `App.tsx` (manual hash/path routing + HomeApp composition).
 *
 * Keep old HomeApp behind this flag until router parity is verified.
 * @see apps/web/src/pages/home/HomeApp.tsx:51 — original composition replaced by RootLayout
 */
export const USE_SPA = (import.meta.env as Record<string, string | undefined>).VITE_USE_SPA === 'true'

/** Helper for vite preview / e2e to assert which shell is active */
export const SPA_SHELL_VERSION = USE_SPA ? 'tanstack-router' : 'legacy-homeapp'
