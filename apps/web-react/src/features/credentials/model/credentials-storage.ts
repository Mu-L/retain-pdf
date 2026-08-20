/**
 * Credentials storage — React port of
 *   apps/web/src/js/config/storage.ts (normalizeBrowserStoredConfig)
 *   + apps/web/src/js/features/credentials/state.ts (normalize helpers)
 *
 * Browser localStorage persistence for OCR / DeepSeek keys.
 */
import { DEFAULT_OCR_PROVIDER, type CredentialsFields, type CredentialsRuntime, type OcrValidationCache } from './credentials-types'

export const BROWSER_CONFIG_STORAGE_KEY = 'retainpdf.browser.config.v1'

function normalizeOcrProvider(value: unknown): string {
  const v = `${value || ''}`.trim().toLowerCase()
  return v === 'paddle' ? 'paddle' : DEFAULT_OCR_PROVIDER
}

function normalizeCredentials(payload: Partial<CredentialsFields> = {}): CredentialsFields {
  return {
    ocrProvider: normalizeOcrProvider(payload.ocrProvider),
    paddleToken: typeof payload.paddleToken === 'string' ? payload.paddleToken : `${payload.paddleToken || ''}`,
    modelApiKey: typeof payload.modelApiKey === 'string' ? payload.modelApiKey : `${payload.modelApiKey || ''}`,
  }
}

function normalizeBalance(value: unknown): number | null {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function normalizeOcrValidation(payload: Partial<OcrValidationCache> = {}): OcrValidationCache {
  return {
    provider: `${payload.provider || ''}`.trim(),
    token: `${payload.token || ''}`.trim(),
    status: `${payload.status || ''}`.trim(),
  }
}

function normalizeRuntime(payload: Partial<CredentialsRuntime> & Record<string, unknown> = {}): CredentialsRuntime {
  return {
    deepseekBalanceCny: normalizeBalance((payload as any).deepseekBalanceCny),
    deepseekBalanceChecked: Boolean((payload as any).deepseekBalanceChecked),
    ocrValidation: normalizeOcrValidation((payload as any).ocrValidation as any),
  }
}

export function readBrowserStoredConfig(): Record<string, unknown> {
  if (typeof window === 'undefined' || typeof (window as any).localStorage === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(BROWSER_CONFIG_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export function writeBrowserStoredConfig(payload: Partial<CredentialsFields> = {}): void {
  if (typeof window === 'undefined' || typeof (window as any).localStorage === 'undefined') return
  try {
    window.localStorage.setItem(BROWSER_CONFIG_STORAGE_KEY, JSON.stringify(normalizeCredentials(payload)))
  } catch {
    // ignore quota
  }
}

export function normalizeBrowserStoredConfig(payload: unknown): CredentialsFields {
  if (!payload || typeof payload !== 'object') return normalizeCredentials({})
  return normalizeCredentials(payload as Partial<CredentialsFields>)
}

export function ocrTokenFromCredentials(
  credentials: Partial<CredentialsFields> = {},
  opts: { defaultPaddleToken?: () => string } = {},
): string {
  if (credentials.paddleToken) return credentials.paddleToken
  return opts.defaultPaddleToken?.() || ''
}

export function hasCompleteCredentials(
  credentials: Partial<CredentialsFields> = {},
  opts: { defaultPaddleToken?: () => string } = {},
): boolean {
  return Boolean(ocrTokenFromCredentials(credentials, opts) && credentials.modelApiKey)
}

export { normalizeCredentials, normalizeRuntime, normalizeOcrProvider, normalizeBalance, normalizeOcrValidation }
