/**
 * Credentials API — thin wrappers over @retainpdf/api providers.
 * Keeps apps/web MPA untouched; web-react uses TanStack mutations.
 */
import { API_PREFIX } from '@retainpdf/api/internal/runtime'
import { queryDeepSeekBalance as apiQueryDeepSeekBalance, validateDeepSeekToken as apiValidateDeepSeekToken, validatePaddleToken as apiValidatePaddleToken } from '@retainpdf/api/providers'

export async function validateOcrToken(
  apiPrefix: string = API_PREFIX,
  providerId: string,
  token: string,
) {
  const trimmed = `${token || ''}`.trim()
  if (!trimmed) throw new Error('缺少 Token')
  const id = `${providerId || ''}`.trim().toLowerCase()
  if (id === 'paddle') {
    // providers/paddle/validate-token expects { token } or { paddle_token } — be permissive
    return apiValidatePaddleToken(apiPrefix, { token: trimmed, paddle_token: trimmed })
  }
  // generic fallback: hit same endpoint with provider hint
  return apiValidatePaddleToken(apiPrefix, { token: trimmed, provider: id })
}

export async function validateDeepSeekToken(
  apiPrefix: string = API_PREFIX,
  payload: { api_key?: string; base_url?: string } | Record<string, unknown>,
) {
  return apiValidateDeepSeekToken(apiPrefix, payload)
}

export async function queryDeepSeekBalance(
  apiPrefix: string = API_PREFIX,
  payload: { api_key?: string; base_url?: string } | Record<string, unknown>,
) {
  return apiQueryDeepSeekBalance(apiPrefix, payload)
}
