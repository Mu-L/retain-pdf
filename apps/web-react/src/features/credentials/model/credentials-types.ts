/**
 * Credentials types — React port of
 *   apps/web/src/js/features/credentials/state.ts
 *   apps/web/src/pages/home/features/credentials/credentials-view-store.ts
 *
 * Pure types, no DOM.
 */

export type CredentialsFields = {
  ocrProvider: string
  paddleToken: string
  modelApiKey: string
}

export type OcrValidationCache = {
  provider: string
  token: string
  status: string
}

export type CredentialsRuntime = {
  deepseekBalanceCny: number | null
  deepseekBalanceChecked: boolean
  ocrValidation: OcrValidationCache
}

export type CredentialsState = {
  credentials: CredentialsFields
  runtime: CredentialsRuntime
}

export type DeepSeekBalanceState = {
  balanceCny: number | null
  balanceChecked: boolean
}

export type ProviderValidationResult = {
  ok?: boolean
  status?: string | number
  summary?: string
  operator_hint?: string
  balance_infos?: Array<{ currency?: string; total_balance?: string }>
  is_available?: boolean
}

export type CredentialsMessage = {
  message: string
  tone: string
}

export type CredentialGateState = {
  desktopMode: boolean
  show: boolean
  uploadEnabled: boolean
  uploadReady: boolean
}

export type CredentialsViewState = {
  setupMode: boolean
  activeTab: string
  validations: Record<string, CredentialsMessage>
  deepSeek: CredentialsMessage
  deepSeekTopUpVisible: boolean
  dialogStatus: CredentialsMessage
  credentialGate: CredentialGateState
}

export const DEFAULT_OCR_PROVIDER = 'paddle'

export const OCR_PROVIDER_DEFINITIONS = [
  {
    id: 'paddle',
    label: 'PaddleOCR',
    validationMissingMessage: '请先填写 Paddle Access Token。',
    validationUnavailableMessage: '',
    supportsValidation: true,
  },
] as const

export const TRANSLATION_PROVIDER_DEFINITION = {
  id: 'deepseek',
  label: 'DeepSeek',
  validationMissingMessage: '请先填写 DeepSeek Key。',
  validationSuccessMessage: 'DeepSeek 接口连接成功。',
  validationNetworkMessage: 'DeepSeek 接口检测失败，请检查网络或浏览器跨域限制。',
} as const
