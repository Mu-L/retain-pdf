/**
 * Feature flag for SPA shell cutover (Phase 3) — SPA is now default.
 * - Default `true`: TanStack Router tree (`src/router.tsx` + `src/routes/*`) via `RootLayout`.
 * - Opt-out: `VITE_USE_SPA=false` restores legacy `App.tsx` (manual hash/path routing + HomeApp composition).
 *
 * Legacy App is archived at `src/_archived/App.legacy.tsx` (copy of pre-cutover App.tsx)
 * and kept as fallback in `src/App.tsx` until rollback window closes.
 * @see apps/web/src/pages/home/HomeApp.tsx:51 — original composition replaced by RootLayout
 */
export const USE_SPA = (import.meta.env as Record<string, string | undefined>).VITE_USE_SPA !== 'false'

/** Helper for vite preview / e2e to assert which shell is active */
export const SPA_SHELL_VERSION = USE_SPA ? 'tanstack-router' : 'legacy-homeapp'
