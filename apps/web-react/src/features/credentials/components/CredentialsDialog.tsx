/**
 * CredentialsDialog — thin UI shell driven by useCredentialsController + Zustand stores.
 * Parity with apps/web/src/pages/home/features/credentials/CredentialsDialog.tsx
 * but without hidden-input DOM bridge — state is localStorage-backed Zustand.
 */
import { useEffect, useState } from 'react'
import { getCredentialsStore } from '../model/credentials-store'
import { getCredentialsViewStore } from '../model/credentials-view-store'
import { useCredentialsController } from '../model/use-credentials-controller'

export function CredentialsDialog({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const controller = useCredentialsController()
  const viewStore = getCredentialsViewStore()
  const credStore = getCredentialsStore()
  const [paddleToken, setPaddleToken] = useState(() => credStore.getState().credentials.paddleToken)
  const [modelApiKey, setModelApiKey] = useState(() => credStore.getState().credentials.modelApiKey)

  useEffect(() => {
    const unsub = credStore.subscribe((s) => {
      setPaddleToken(s.credentials.paddleToken)
      setModelApiKey(s.credentials.modelApiKey)
    })
    return () => unsub()
  }, [credStore])

  const validations = viewStore((s) => s.validations)
  const deepSeek = viewStore((s) => s.deepSeek)
  const dialogStatus = viewStore((s) => s.dialogStatus)

  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" className="credentials-dialog">
      <h2>凭据设置</h2>
      <label>
        Paddle Token
        <input value={paddleToken} onChange={(e) => setPaddleToken(e.target.value)} placeholder="Paddle Access Token" />
      </label>
      {validations.paddle && <p data-tone={validations.paddle.tone}>{validations.paddle.message}</p>}
      <label>
        DeepSeek Key
        <input value={modelApiKey} onChange={(e) => setModelApiKey(e.target.value)} placeholder="DeepSeek API Key" />
      </label>
      {deepSeek.message && <p data-tone={deepSeek.tone}>{deepSeek.message}</p>}
      {dialogStatus.message && <p data-tone={dialogStatus.tone}>{dialogStatus.message}</p>}
      <button
        onClick={async () => {
          await controller.handleBrowserOcrValidate('paddle', paddleToken).catch(() => {})
        }}
        disabled={controller.ocrValidationMutation.isPending}
      >
        检测 Paddle
      </button>
      <button
        onClick={async () => {
          await controller.handleBrowserDeepSeekValidate(modelApiKey).catch(() => {})
        }}
        disabled={controller.deepSeekValidationMutation.isPending}
      >
        检测 DeepSeek
      </button>
      <button
        onClick={async () => {
          await controller.handleBrowserCredentialSave({ paddleToken, modelApiKey, ocrProvider: 'paddle' })
          onClose?.()
        }}
      >
        保存
      </button>
      <button onClick={onClose}>关闭</button>
    </div>
  )
}
