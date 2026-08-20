/**
 * Credentials validation — React port of
 *   apps/web/src/js/features/credentials/validation.ts
 *   + apps/web/src/js/features/credentials/deepseek-flow.ts (balance helpers)
 *
 * Pure. No DOM, no React.
 */
import { OCR_PROVIDER_DEFINITIONS, TRANSLATION_PROVIDER_DEFINITION, type ProviderValidationResult } from './credentials-types'

export type OcrValidationCachePayload = { provider?: string; token?: string; status?: string }

function getOcrProviderDefinition(providerId?: string) {
  const id = `${providerId || ''}`.trim().toLowerCase() || 'paddle'
  return OCR_PROVIDER_DEFINITIONS.find((p) => p.id === id) || OCR_PROVIDER_DEFINITIONS[0]
}

function asValidationResult(value: unknown): ProviderValidationResult {
  if (value && typeof value === 'object') return value as ProviderValidationResult
  return {}
}

export async function runOcrTokenValidation(opts: {
  apiPrefix?: string
  providerId?: string
  token?: string
  validateOcrToken?: (apiPrefix?: unknown, providerId?: unknown, token?: unknown) => Promise<unknown> | unknown
  setOcrValidationMessage?: (message?: string, tone?: string, providerId?: string) => void
  showResult?: boolean
  credentialsStatePort?: { resetOcrValidationCache?: () => void; setOcrValidationCache?: (p?: OcrValidationCachePayload) => void }
}): Promise<ProviderValidationResult> {
  const definition = getOcrProviderDefinition(opts.providerId)
  const normalizedToken = `${opts.token || ''}`.trim()
  const showResult = opts.showResult ?? true

  if (!normalizedToken) {
    opts.credentialsStatePort?.resetOcrValidationCache?.()
    if (showResult) opts.setOcrValidationMessage?.(definition.validationMissingMessage, 'error', definition.id)
    return { ok: false, status: 'unauthorized' }
  }
  if (!definition.supportsValidation) {
    opts.credentialsStatePort?.setOcrValidationCache?.({ provider: definition.id, token: normalizedToken, status: 'skipped' })
    if (showResult) opts.setOcrValidationMessage?.(definition.validationUnavailableMessage, '', definition.id)
    return { ok: true, status: 'skipped', summary: definition.validationUnavailableMessage }
  }
  if (showResult) opts.setOcrValidationMessage?.(`正在检测 ${definition.label} Token…`, '', definition.id)
  try {
    const result = asValidationResult(await opts.validateOcrToken?.(opts.apiPrefix, definition.id, normalizedToken))
    opts.credentialsStatePort?.setOcrValidationCache?.({ provider: definition.id, token: normalizedToken, status: `${result.status || ''}` })
    if (showResult) {
      const hint = result.operator_hint ? ` ${result.operator_hint}` : ''
      const message = result.summary || `${definition.label} Token 检测结果：${result.status || 'unknown'}`
      opts.setOcrValidationMessage?.(`${message}${hint}`.trim(), result.ok ? 'valid' : 'error', definition.id)
    }
    return result
  } catch {
    opts.credentialsStatePort?.resetOcrValidationCache?.()
    if (showResult) opts.setOcrValidationMessage?.(`${definition.label} Token 检测失败，请稍后重试。`, 'error', definition.id)
    return { ok: false, status: 'network_error', summary: `${definition.label} Token 检测失败，请稍后重试。` }
  }
}

export async function runDeepSeekConnectivityCheck(opts: {
  apiPrefix?: string
  apiKey?: string
  baseUrl?: string
  validateDeepSeekToken?: (apiPrefix?: unknown, payload?: unknown) => Promise<unknown> | unknown
  setDeepSeekValidationMessage?: (message?: string, tone?: string) => void
  showResult?: boolean
}): Promise<ProviderValidationResult> {
  const modelApiKey = `${opts.apiKey || ''}`.trim()
  const modelBaseUrl = `${opts.baseUrl || ''}`.trim()
  if (!modelApiKey) {
    if (opts.showResult ?? true) opts.setDeepSeekValidationMessage?.(TRANSLATION_PROVIDER_DEFINITION.validationMissingMessage, 'error')
    return { ok: false, status: 0 }
  }
  if (opts.showResult ?? true) opts.setDeepSeekValidationMessage?.('正在检测 DeepSeek 接口…')
  try {
    const result = asValidationResult(await opts.validateDeepSeekToken?.(opts.apiPrefix, { api_key: modelApiKey, base_url: modelBaseUrl }))
    if (opts.showResult ?? true) {
      opts.setDeepSeekValidationMessage?.(
        result.summary || (result.ok ? TRANSLATION_PROVIDER_DEFINITION.validationSuccessMessage : TRANSLATION_PROVIDER_DEFINITION.validationNetworkMessage),
        result.ok ? 'valid' : 'error',
      )
    }
    return result
  } catch {
    if (opts.showResult ?? true) opts.setDeepSeekValidationMessage?.(TRANSLATION_PROVIDER_DEFINITION.validationNetworkMessage, 'error')
    return { ok: false, status: 0 }
  }
}

export function summarizeDeepSeekBalance(result: ProviderValidationResult | null | undefined): string {
  const infos = Array.isArray(result?.balance_infos) ? result!.balance_infos! : []
  const parts = infos
    .filter((item) => item && item.currency && item.total_balance)
    .map((item) => `${item.currency} ${item.total_balance}`)
  if (parts.length > 0) return `余额 ${parts.join('，')}`
  if (result?.is_available) return '余额可用'
  return '余额不足'
}

export async function runDeepSeekBalanceCheck(opts: {
  apiPrefix?: string
  apiKey?: string
  baseUrl?: string
  queryDeepSeekBalance?: (apiPrefix?: unknown, payload?: unknown) => Promise<unknown> | unknown
}): Promise<ProviderValidationResult> {
  const modelApiKey = `${opts.apiKey || ''}`.trim()
  const modelBaseUrl = `${opts.baseUrl || ''}`.trim()
  if (!modelApiKey) return { ok: false, status: 'missing_key' }
  if (!opts.queryDeepSeekBalance) return { ok: false, status: 'unsupported' }
  try {
    return asValidationResult(await opts.queryDeepSeekBalance(opts.apiPrefix, { api_key: modelApiKey, base_url: modelBaseUrl }))
  } catch {
    return { ok: false, status: 'network_error' }
  }
}

// DeepSeek balance amount + threshold helpers (from deepseek-flow.ts)
export const DEEPSEEK_LOW_BALANCE_THRESHOLD = 2

export function deepSeekBalanceAmount(result: ProviderValidationResult | null | undefined): number {
  const infos = Array.isArray(result?.balance_infos) ? result!.balance_infos! : []
  return infos.reduce((sum, item) => {
    const raw = `${(item as any)?.total_balance ?? ''}`.replace(/[^\d.-]/g, '')
    const v = Number.parseFloat(raw)
    return Number.isFinite(v) ? sum + v : sum
  }, 0)
}

export function shouldShowTopUp(balance: ProviderValidationResult | null | undefined): boolean {
  return deepSeekBalanceAmount(balance) < DEEPSEEK_LOW_BALANCE_THRESHOLD
}
