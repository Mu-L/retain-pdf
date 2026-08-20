/**
 * Credentials view store — Zustand port of
 *   apps/web/src/pages/home/features/credentials/credentials-view-store.ts
 */
import { create } from 'zustand'
import type { CredentialsViewState, CredentialGateState, CredentialsMessage } from './credentials-types'

type Actions = {
  setSetupMode: (setupMode?: boolean) => void
  setActiveTab: (tabName?: string) => void
  setValidation: (payload?: { providerId?: string; message?: string; tone?: string }) => void
  setDeepSeek: (payload?: { message?: string; tone?: string }) => void
  setDeepSeekTopUpVisible: (visible?: boolean) => void
  setDialogStatus: (payload?: { message?: string; tone?: string }) => void
  setCredentialGate: (payload?: Partial<CredentialGateState>) => void
  // viewPort shims
  activateTab: (tabName?: string) => void
  setOcrValidationMessage: (message?: string, tone?: string, providerId?: string) => void
  setDeepSeekValidationMessage: (message?: string, tone?: string) => void
  setDialogMode: (opts?: { setupMode?: boolean; activateCredentialTab?: (tab: string) => void }) => void
  updateCredentialGate: (payload?: Partial<CredentialGateState>) => boolean
}

export type CredentialsViewStore = ReturnType<typeof createCredentialsViewStore>

export function createCredentialsViewStore() {
  return create<CredentialsViewState & Actions>((set) => ({
    setupMode: false,
    activeTab: 'api',
    validations: {},
    deepSeek: { message: '', tone: '' },
    deepSeekTopUpVisible: false,
    dialogStatus: { message: '', tone: '' },
    credentialGate: { desktopMode: false, show: false, uploadEnabled: true, uploadReady: false },

    setSetupMode: (setupMode = false) => set((s) => ({ ...s, setupMode: Boolean(setupMode) })),
    setActiveTab: (tabName = 'api') => set((s) => ({ ...s, activeTab: `${tabName || 'api'}`.trim() || 'api' })),
    setValidation: ({ providerId = '', message = '', tone = '' } = {}) => {
      const id = `${providerId || ''}`.trim()
      if (!id) return
      set((s) => ({ ...s, validations: { ...s.validations, [id]: { message, tone } as CredentialsMessage } }))
    },
    setDeepSeek: ({ message = '', tone = '' } = {}) => set((s) => ({ ...s, deepSeek: { message, tone } as CredentialsMessage })),
    setDeepSeekTopUpVisible: (visible = false) => set((s) => ({ ...s, deepSeekTopUpVisible: Boolean(visible) })),
    setDialogStatus: ({ message = '', tone = '' } = {}) => set((s) => ({ ...s, dialogStatus: { message, tone } as CredentialsMessage })),
    setCredentialGate: (payload = {}) => set((s) => ({ ...s, credentialGate: { ...s.credentialGate, ...payload } })),

    // shims that mirror viewPort from MPA (used by browser.ts controller — kept for parity)
    activateTab: (tabName = 'api') => set((s) => ({ ...s, activeTab: `${tabName || 'api'}`.trim() || 'api' })),
    setOcrValidationMessage: (message = '', tone = '', providerId = '') => {
      const id = `${providerId || ''}`.trim()
      if (!id) return
      set((s) => ({ ...s, validations: { ...s.validations, [id]: { message, tone } } }))
    },
    setDeepSeekValidationMessage: (message = '', tone = '') => set((s) => ({ ...s, deepSeek: { message, tone } })),
    setDialogMode: ({ setupMode = false, activateCredentialTab } = {}) => {
      set((s) => ({ ...s, setupMode: Boolean(setupMode) }))
      if (setupMode) activateCredentialTab?.('api')
    },
    updateCredentialGate: (payload = {}) => {
      set((s) => ({ ...s, credentialGate: { ...s.credentialGate, ...payload } }))
      return true
    },
  }))
}

let defaultCredentialsViewStore: CredentialsViewStore | null = null
export function getCredentialsViewStore(): CredentialsViewStore {
  if (!defaultCredentialsViewStore) defaultCredentialsViewStore = createCredentialsViewStore()
  return defaultCredentialsViewStore
}
