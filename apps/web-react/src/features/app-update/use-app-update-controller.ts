/**
 * useAppUpdateController — React hook that wires store + GitHub release + cache.
 * Mirrors apps/web/src/js/features/app-update/controller.ts (mountAppUpdateFeature)
 * but as a hook with manual refresh + auto-check after 1.2s when cache stale.
 */
import { useCallback, useEffect, useRef } from 'react'
import { getAppUpdateStore } from './app-update-store'
import { fetchLatestGithubRelease, normalizeReleaseInfo } from './github-release'
import { defaultUpdateCachePort } from './update-cache'

export type UseAppUpdateControllerOptions = {
  enabled?: boolean
  fetchLatestRelease?: typeof fetchLatestGithubRelease
  normalizeRelease?: typeof normalizeReleaseInfo
  cachePort?: typeof defaultUpdateCachePort
  autoCheckDelayMs?: number
}

export function useAppUpdateController(options: UseAppUpdateControllerOptions = {}) {
  const {
    enabled = true,
    fetchLatestRelease = fetchLatestGithubRelease,
    normalizeRelease = normalizeReleaseInfo,
    cachePort = defaultUpdateCachePort,
    autoCheckDelayMs = 1200,
  } = options

  const store = getAppUpdateStore()

  // Keep a ref so onCheck callback stays stable across renders
  const fetcherRef = useRef(fetchLatestRelease)
  fetcherRef.current = fetchLatestRelease
  const normalizerRef = useRef(normalizeRelease)
  normalizerRef.current = normalizeRelease
  const cachePortRef = useRef(cachePort)
  cachePortRef.current = cachePort

  const applyUpdateInfo = useCallback((info: any) => {
    if (!info) {
      store.getState().setReady()
      return
    }
    if (info.hasUpdate) store.getState().setAvailable(info)
    else store.getState().setLatest(info)
  }, [store])

  const checkForUpdates = useCallback(async ({ manual = false } = {}) => {
    if (!enabled) return false
    if (manual) store.getState().setChecking()
    try {
      const release = await fetcherRef.current()
      const info = normalizerRef.current(release)
      cachePortRef.current.write(info)
      applyUpdateInfo(info)
    } catch (error) {
      if (manual) store.getState().setError(error as any)
    }
    return true
  }, [enabled, store, applyUpdateInfo])

  // Initial boot: load cache, apply, then auto-check if stale
  useEffect(() => {
    if (!enabled) {
      store.getState().setReady()
      return
    }
    const cached = cachePortRef.current.read()
    applyUpdateInfo(cached.info)
    if (cached.fresh) return
    const timer = window.setTimeout(() => {
      void checkForUpdates({ manual: false })
    }, autoCheckDelayMs)
    return () => window.clearTimeout(timer)
  }, [enabled, store, applyUpdateInfo, checkForUpdates, autoCheckDelayMs])

  const onCheck = useCallback(() => {
    void checkForUpdates({ manual: true })
  }, [checkForUpdates])

  return { checkForUpdates, onCheck }
}
