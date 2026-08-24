/**
 * useCredentialsController — React port of
 *   apps/web/src/js/features/credentials/browser.ts (mountBrowserCredentialsFeature)
 *   + apps/web/src/pages/home/features/credentials/useCredentialsController.ts
 *
 * TanStack Query mutations for OCR / DeepSeek validation + DeepSeek balance.
 * Zustand stores for credentials persistence + view state.
 * Keeps MPA untouched; SPA consumes via hook.
 */
import { useCallback, useMemo } from 'react'
import { useMutation } from '@tanstack/react-query'
import { API_PREFIX } from '@retainpdf/api/runtime'

import { getCredentialsStore } from './credentials-store'
import { getCredentialsViewStore } from './credentials-view-store'
import {
  DEEPSEEK_LOW_BALANCE_THRESHOLD,
  deepSeekBalanceAmount,
  runDeepSeekBalanceCheck,
  runDeepSeekConnectivityCheck,
  runOcrTokenValidation,
  summarizeDeepSeekBalance,
} from './credentials-validation'
import { queryDeepSeekBalance, validateDeepSeekToken, validateOcrToken } from '../api/credentials-api'

export type UseCredentialsControllerOptions = {
  apiPrefix?: string
  defaultPaddleToken?: () => string
  defaultModelApiKey?: () => string
  defaultModelBaseUrl?: () => string
  isDesktopMode?: () => boolean
}

export function useCredentialsController(options: UseCredentialsControllerOptions = {}) {
  const {
    apiPrefix = API_PREFIX,
    defaultPaddleToken = () => '',
    defaultModelApiKey = () => '',
    defaultModelBaseUrl = () => '',
    isDesktopMode = () => false,
  } = options

  const credentialsStore = useMemo(() => getCredentialsStore(), [])
  const viewStore = useMemo(() => getCredentialsViewStore(), [])

  // Keep reactive snapshots for consumers (hook re-renders on store changes via subscribe in components)
  // Controller exposes imperative API; components use store selectors directly if needed.

  const ocrValidationMutation = useMutation({
    mutationFn: async ({ providerId, token }: { providerId: string; token: string }) => {
      const view = viewStore.getState()
      // Provide a port-like object for validation's hasValidOcrValidationCache mirroring
      const port = {
        resetOcrValidationCache: () => credentialsStore.getState().resetOcrValidationCache(),
        setOcrValidationCache: (p: any) => credentialsStore.getState().setOcrValidationCache(p),
      }
      return runOcrTokenValidation({
        apiPrefix,
        providerId,
        token,
        validateOcrToken: (prefix: unknown, pid: unknown, t: unknown) => validateOcrToken(prefix as string, pid as string, t as string),
        setOcrValidationMessage: (msg, tone, pid) => viewStore.getState().setOcrValidationMessage(msg, tone, pid),
        showResult: true,
        credentialsStatePort: port as any,
      })
    },
  })

  const deepSeekValidationMutation = useMutation({
    mutationFn: async ({ apiKey, baseUrl, silent }: { apiKey: string; baseUrl?: string; silent?: boolean }) => {
      const silentFlag = Boolean(silent)
      const view = viewStore.getState()
      if (!silentFlag) view.setDeepSeekValidationMessage('正在检测 DeepSeek 和余额…', '')
      credentialsStore.getState().resetDeepSeekBalance()
      // 1) connectivity
      const conn = await runDeepSeekConnectivityCheck({
        apiPrefix,
        apiKey,
        baseUrl,
        validateDeepSeekToken: (prefix: unknown, payload: unknown) => validateDeepSeekToken(prefix as string, payload as any),
        setDeepSeekValidationMessage: silentFlag ? undefined : (msg, tone) => viewStore.getState().setDeepSeekValidationMessage(msg, tone),
        showResult: false,
      })
      if (!conn.ok) {
        if (!silentFlag) {
          const summary = (conn as any).summary || 'DeepSeek 接口检测失败，请检查网络或浏览器跨域限制。'
          viewStore.getState().setDeepSeekValidationMessage(summary, 'error')
        }
        viewStore.getState().setDeepSeekTopUpVisible(false)
        return conn
      }
      // 2) balance
      const balance = await runDeepSeekBalanceCheck({
        apiPrefix,
        apiKey,
        baseUrl,
        queryDeepSeekBalance: (prefix: unknown, payload: unknown) => queryDeepSeekBalance(prefix as string, payload as any),
      })
      if ((balance as any).status === 'unsupported_provider') {
        if (!silentFlag) viewStore.getState().setDeepSeekValidationMessage('DeepSeek 可用', 'valid')
        return balance
      }
      if ((balance as any).status === 'network_error') {
        if (!silentFlag) viewStore.getState().setDeepSeekValidationMessage('DeepSeek 可用，余额查询失败', 'valid')
        return balance
      }
      const summary = summarizeDeepSeekBalance(balance as any)
      const amount = deepSeekBalanceAmount(balance as any)
      credentialsStore.getState().setDeepSeekBalance(amount, true)
      const shouldTopUp = amount < DEEPSEEK_LOW_BALANCE_THRESHOLD
      viewStore.getState().setDeepSeekTopUpVisible(shouldTopUp)
      viewStore.getState().setDeepSeekValidationMessage(
        `DeepSeek 可用，${summary}${shouldTopUp ? '，余额低于 2 元' : ''}`,
        (balance as any).is_available ? 'valid' : 'error',
      )
      return balance
    },
  })

  // Imperative parity with browser.ts: hasBrowserCredentials, ensureOcrCredentialsReady, updateCredentialGate
  const hasBrowserCredentials = useCallback(() => {
    return Boolean(credentialsStore.getState().hasComplete({ defaultPaddleToken }))
  }, [credentialsStore, defaultPaddleToken])

  const ensureOcrCredentialsReady = useCallback(
    async (opts: { onMissingToken?: () => void; onInvalidToken?: (result: unknown) => void } = {}) => {
      const creds = credentialsStore.getState().getCredentials()
      const provider = `${(creds as any).ocrProvider || 'paddle'}`.trim().toLowerCase() || 'paddle'
      const tokenFromCreds = `${(creds as any).paddleToken || ''}`.trim() || defaultPaddleToken() || ''

      if (!tokenFromCreds) {
        opts.onMissingToken?.()
        viewStore.getState().setOcrValidationMessage('请先填写 Paddle Access Token。', 'error', provider)
        return false
      }

      const hasCached = credentialsStore.getState().hasValidOcrValidationCache({ provider, token: tokenFromCreds })
      if (hasCached) return true

      const showResult = !isDesktopMode()
      const result = await ocrValidationMutation.mutateAsync({ providerId: provider, token: tokenFromCreds }).catch(() => null as any)

      // runOcrTokenValidation already wrote view messages; interpret result
      if (result && (result as any).ok) return true
      // For skipped (no validation support) treat as ok
      if (result && (result as any).status === 'skipped') return true
      // otherwise invalid
      if (showResult) {
        // already messaged
      }
      opts.onInvalidToken?.(result)
      return false
    },
    [credentialsStore, viewStore, defaultPaddleToken, isDesktopMode, ocrValidationMutation],
  )

  const updateCredentialGate = useCallback(
    (opts: { workflowNeedsCredentials?: () => boolean; workflowNeedsUpload?: () => boolean; uploadReady?: boolean } = {}) => {
      const uploadEnabled = Boolean(opts.workflowNeedsUpload?.())
      const uploadReady = Boolean(opts.uploadReady)
      const desktopMode = Boolean(isDesktopMode())
      if (desktopMode) {
        viewStore.getState().setCredentialGate({ desktopMode: true, show: false, uploadEnabled, uploadReady })
        return true
      }
      const show = Boolean(opts.workflowNeedsCredentials?.()) && !hasBrowserCredentials()
      viewStore.getState().setCredentialGate({ desktopMode: false, show, uploadEnabled, uploadReady })
      return true
    },
    [viewStore, isDesktopMode, hasBrowserCredentials],
  )

  const refreshDeepSeekBalance = useCallback(
    async (opts: { silent?: boolean } = {}) => {
      const creds = credentialsStore.getState().getCredentials()
      const apiKey = `${(creds as any).modelApiKey || ''}`.trim() || defaultModelApiKey() || ''
      const baseUrl = defaultModelBaseUrl() || ''
      return deepSeekValidationMutation.mutateAsync({ apiKey, baseUrl, silent: opts.silent ?? true })
    },
    [credentialsStore, defaultModelApiKey, defaultModelBaseUrl, deepSeekValidationMutation],
  )

  const handleBrowserOcrValidate = useCallback(
    async (providerId?: string, token?: string) => {
      const creds = credentialsStore.getState().getCredentials()
      const p = `${providerId || (creds as any).ocrProvider || 'paddle'}`.trim()
      const t = `${token ?? (creds as any).paddleToken ?? ''}`.trim() || defaultPaddleToken() || ''
      return ocrValidationMutation.mutateAsync({ providerId: p, token: t })
    },
    [credentialsStore, defaultPaddleToken, ocrValidationMutation],
  )

  const handleBrowserDeepSeekValidate = useCallback(
    async (apiKey?: string, baseUrl?: string) => {
      const creds = credentialsStore.getState().getCredentials()
      const k = `${apiKey ?? (creds as any).modelApiKey ?? ''}`.trim() || defaultModelApiKey() || ''
      const b = `${baseUrl ?? ''}`.trim() || defaultModelBaseUrl() || ''
      return deepSeekValidationMutation.mutateAsync({ apiKey: k, baseUrl: b, silent: false })
    },
    [credentialsStore, defaultModelApiKey, defaultModelBaseUrl, deepSeekValidationMutation],
  )

  const handleBrowserCredentialSave = useCallback(
    async (next: Partial<{ ocrProvider: string; paddleToken: string; modelApiKey: string }>) => {
      const existing = credentialsStore.getState().getCredentials()
      const ocrProvider = `${next.ocrProvider || (existing as any).ocrProvider || 'paddle'}`.trim() || 'paddle'
      const paddleToken = `${next.paddleToken || ''}`.trim() || `${(existing as any).paddleToken || ''}`.trim()
      const modelApiKey = `${next.modelApiKey || ''}`.trim() || `${(existing as any).modelApiKey || ''}`.trim()

      if (!paddleToken || !modelApiKey) {
        if (!paddleToken) viewStore.getState().setOcrValidationMessage('请先填写 Paddle Access Token。', 'error', ocrProvider)
        if (!modelApiKey) viewStore.getState().setDeepSeekValidationMessage('请先填写 DeepSeek Key。', 'error')
        viewStore.getState().setDialogStatus({ message: '请填写 OCR Token 与模型 API Key 后再保存', tone: 'error' })
        throw new Error('请填写 OCR Token 与模型 API Key 后再保存')
      }

      const toSave = { ocrProvider, paddleToken, modelApiKey }
      credentialsStore.getState().setCredentials(toSave)
      // also ensure localStorage
      credentialsStore.getState().persist()
      viewStore.getState().setDialogStatus({ message: '已保存', tone: 'valid' })
      return toSave
    },
    [credentialsStore, viewStore],
  )

  return {
    // stores
    credentialsStore,
    viewStore,
    // parity surface with mountBrowserCredentialsFeature
    hasBrowserCredentials,
    ensureOcrCredentialsReady,
    updateCredentialGate,
    refreshDeepSeekBalance,
    handleBrowserOcrValidate,
    handleBrowserDeepSeekValidate,
    handleBrowserCredentialSave,
    // TanStack mutations for UI to subscribe
    ocrValidationMutation,
    deepSeekValidationMutation,
    // helpers
    getCredentials: () => credentialsStore.getState().getCredentials(),
    getRuntime: () => credentialsStore.getState().getRuntime(),
  }
}
