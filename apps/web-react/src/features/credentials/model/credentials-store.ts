/**
 * Credentials store — Zustand port of
 *   apps/web/src/js/features/credentials/state.ts (createCredentialsStore + createCredentialsStatePort)
 *   + persistence via credentials-storage.ts
 *
 * Single Zustand store holds credentials + runtime + view integration.
 * Mirrors apps/web MPA behavior: localStorage persistence, validation cache, balance.
 */
import { create } from 'zustand'
import {
  type CredentialsFields,
  type CredentialsRuntime,
  type CredentialsState,
  type DeepSeekBalanceState,
  type OcrValidationCache,
} from './credentials-types'
import {
  hasCompleteCredentials,
  normalizeCredentials,
  normalizeRuntime,
  ocrTokenFromCredentials,
  readBrowserStoredConfig,
  writeBrowserStoredConfig,
} from './credentials-storage'

type CredentialsStoreState = CredentialsState & {
  // Actions
  setCredentials: (payload?: Partial<CredentialsFields>) => CredentialsFields
  patchCredentials: (payload?: Partial<CredentialsFields>) => CredentialsFields
  setDeepSeekBalance: (balanceCny: unknown, checked?: boolean) => DeepSeekBalanceState
  resetDeepSeekBalance: () => DeepSeekBalanceState
  setOcrValidationCache: (payload?: Partial<OcrValidationCache>) => OcrValidationCache
  resetOcrValidationCache: () => OcrValidationCache
  // Selectors
  getCredentials: () => CredentialsFields
  getRuntime: () => CredentialsRuntime
  getDeepSeekBalanceState: () => DeepSeekBalanceState
  getOcrToken: (opts?: { defaultPaddleToken?: () => string }) => string
  hasComplete: (opts?: { defaultPaddleToken?: () => string }) => boolean
  hasValidOcrValidationCache: (opts?: { provider?: string; token?: string; statuses?: string[] }) => boolean
  persist: () => void
  hydrate: () => CredentialsFields
}

function resolveInitialCredentials(initial: Partial<CredentialsState> & Partial<CredentialsFields> = {}): CredentialsFields {
  const nested = (initial as Partial<CredentialsState>).credentials
  return normalizeCredentials((nested || initial) as Partial<CredentialsFields>)
}

function resolveInitialRuntime(initial: Partial<CredentialsState> & Partial<CredentialsRuntime> = {}): CredentialsRuntime {
  const nested = (initial as Partial<CredentialsState>).runtime
  return normalizeRuntime((nested || initial) as any)
}

export function createCredentialsStore(initialState: Partial<CredentialsState> & Partial<CredentialsFields> = {}) {
  const bootFromStorage = readBrowserStoredConfig()
  const initialCredentials = resolveInitialCredentials(
    Object.keys(initialState).length ? (initialState as any) : (bootFromStorage as any),
  )
  const initialRuntime = resolveInitialRuntime(initialState as any)

  return create<CredentialsStoreState>((set, get) => ({
    credentials: initialCredentials,
    runtime: initialRuntime,

    setCredentials(payload = {}) {
      const next = normalizeCredentials(payload)
      set((s) => ({ ...s, credentials: next }))
      writeBrowserStoredConfig(next)
      return next
    },

    patchCredentials(payload = {}) {
      const next = normalizeCredentials({ ...get().credentials, ...payload })
      set((s) => ({ ...s, credentials: next }))
      writeBrowserStoredConfig(next)
      return next
    },

    setDeepSeekBalance(balanceCny, checked = true) {
      const value = Number(balanceCny)
      const normalized = Number.isFinite(value) ? value : null
      set((s) => ({ ...s, runtime: { ...s.runtime, deepseekBalanceCny: normalized, deepseekBalanceChecked: Boolean(checked) } }))
      return get().getDeepSeekBalanceState()
    },

    resetDeepSeekBalance() {
      set((s) => ({ ...s, runtime: { ...s.runtime, deepseekBalanceCny: null, deepseekBalanceChecked: false } }))
      return get().getDeepSeekBalanceState()
    },

    setOcrValidationCache(payload = {}) {
      const next: OcrValidationCache = {
        provider: `${payload.provider || ''}`.trim(),
        token: `${payload.token || ''}`.trim(),
        status: `${payload.status || ''}`.trim(),
      }
      set((s) => ({ ...s, runtime: { ...s.runtime, ocrValidation: next } }))
      return next
    },

    resetOcrValidationCache() {
      const next: OcrValidationCache = { provider: '', token: '', status: '' }
      set((s) => ({ ...s, runtime: { ...s.runtime, ocrValidation: next } }))
      return next
    },

    getCredentials() {
      return get().credentials
    },

    getRuntime() {
      return get().runtime
    },

    getDeepSeekBalanceState() {
      const r = get().runtime
      return { balanceCny: r.deepseekBalanceCny, balanceChecked: Boolean(r.deepseekBalanceChecked) }
    },

    getOcrToken(opts = {}) {
      return ocrTokenFromCredentials(get().credentials, opts)
    },

    hasComplete(opts = {}) {
      return hasCompleteCredentials(get().credentials, opts)
    },

    hasValidOcrValidationCache({ provider = '', token = '', statuses = ['valid', 'skipped'] } = {}) {
      const v = get().runtime.ocrValidation
      return v.provider === `${provider || ''}`.trim() && v.token === `${token || ''}`.trim() && statuses.includes(v.status)
    },

    persist() {
      writeBrowserStoredConfig(get().credentials)
    },

    hydrate() {
      const cfg = readBrowserStoredConfig()
      const next = normalizeCredentials(cfg as Partial<CredentialsFields>)
      set((s) => ({ ...s, credentials: next }))
      return next
    },
  }))
}

let defaultCredentialsStore: ReturnType<typeof createCredentialsStore> | null = null

export function getCredentialsStore(): ReturnType<typeof createCredentialsStore> {
  if (!defaultCredentialsStore) defaultCredentialsStore = createCredentialsStore()
  return defaultCredentialsStore
}

export type CredentialsStore = ReturnType<typeof createCredentialsStore>
