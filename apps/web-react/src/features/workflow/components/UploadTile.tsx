/**
 * UploadTile — React-idiomatic port of
 *   apps/web/src/pages/home/features/workflow/components/UploadTile.tsx
 *
 * View layer for upload: file picker, inline page range, budget note, actions.
 * Subscribes to Zustand upload + workflow stores (no legacy createStore coupling).
 * Uses useUploadController for constrain / handleFileSelected wiring.
 * Keeps apps/web untouched — React-only tile.
 */
import { useCallback } from 'react'
import { useStore } from 'zustand'
import { getUploadStore } from '../model/upload-store'
import { getWorkflowStore } from '../model/workflow-store'
import { useUploadController } from '../model/useUploadController'

function CredentialGate({ visible }: { visible: boolean }) {
  if (!visible) return null
  function handleGateAction(event: React.MouseEvent) {
    event.preventDefault()
    // Parity with apps/web credential gate — dispatch browser credentials event
    document.dispatchEvent(new CustomEvent('retain:openBrowserCredentials'))
  }
  return (
    <div id="credential-gate" className="credential-gate">
      <div className="credential-gate-panel" aria-live="polite">
        <span className="credential-gate-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="5" y="11" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy={16} r={1.2} fill="currentColor" />
          </svg>
        </span>
        <strong id="credential-gate-title">请先完成 API 设置</strong>
        <em id="credential-gate-help">在设置 → API 设置中填写 OCR Token 和 DeepSeek Key 后即可上传 PDF。</em>
        <button id="credential-gate-action" type="button" className="credential-gate-action" onClick={handleGateAction}>
          打开设置
        </button>
      </div>
    </div>
  )
}

function InlinePageRange({
  upload,
  onConstrain,
  onPatchStart,
  onPatchEnd,
}: {
  upload: ReturnType<typeof getUploadStore> extends { getState: () => infer S } ? S : never
  onConstrain: (source: 'start' | 'end') => void
  onPatchStart: (v: string) => void
  onPatchEnd: (v: string) => void
}) {
  const maxAttr = upload.pageRangeMax > 0 ? { max: `${upload.pageRangeMax}` } : {}

  return (
    <div
      id="inline-page-range"
      className={`inline-page-range${upload.inlinePageRangeVisible ? '' : ' hidden'}`}
      aria-label="翻译页码范围"
    >
      <label>
        <span>起始页</span>
        <input
          id="page-range-start"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          autoComplete="off"
          placeholder="1"
          {...maxAttr}
          value={upload.pageRangeStart}
          onChange={(e) => {
            onPatchStart(e.target.value)
            onConstrain('start')
          }}
        />
      </label>
      <label>
        <span>结束页</span>
        <input
          id="page-range-end"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          autoComplete="off"
          placeholder="总页数"
          {...maxAttr}
          value={upload.pageRangeEnd}
          onChange={(e) => {
            onPatchEnd(e.target.value)
            onConstrain('end')
          }}
        />
      </label>
    </div>
  )
}

function TranslationBudgetNote({ budget }: { budget: { visible: boolean; tone: string; message: string; blocking: boolean; topUpUrl: string } }) {
  const classes = ['translation-budget-note', budget.visible ? '' : 'hidden', budget.tone === 'error' ? 'is-error' : '', budget.tone === 'valid' ? 'is-valid' : '']
    .filter(Boolean)
    .join(' ')
  return (
    <div id="translation-budget-note" className={classes} aria-live="polite">
      {budget.visible ? budget.message : null}
      {budget.visible && budget.blocking ? (
        <>
          {' · '}
          <a href={budget.topUpUrl} target="_blank" rel="noopener noreferrer">
            去充值
          </a>
        </>
      ) : null}
    </div>
  )
}

export type UploadTileProps = {
  onStoreOnly?: () => void
  onSubmit?: () => void
}

export function UploadTile({ onStoreOnly, onSubmit }: UploadTileProps = {}) {
  const uploadStore = getUploadStore()
  const workflowStore = getWorkflowStore()
  const upload = useStore(uploadStore)
  const workflow = useStore(workflowStore)
  const controller = useUploadController({ store: uploadStore })

  const fileInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      controller.fileInputRef.current = node
    },
    [controller],
  )

  function handleTileClick(event: React.MouseEvent) {
    const target = event.target as HTMLElement
    if (target.closest('button') || target.closest('a') || target.closest('input')) return
    const fileInput = controller.fileInputRef.current
    if (!fileInput || fileInput.disabled) return
    fileInput.click()
  }

  const tileClasses = ['upload-tile', 'upload-tile-hero', upload.tileLocked ? 'is-locked' : '', upload.ready ? 'is-ready' : '', upload.uploading ? 'is-uploading' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <div className={tileClasses} onClick={handleTileClick}>
        <input
          id="file"
          name="file"
          type="file"
          accept="application/pdf,.pdf"
          ref={fileInputRef}
          disabled={!upload.tileEnabled}
          onClick={() => {
            if (controller.fileInputRef.current) controller.fileInputRef.current.value = ''
          }}
          onChange={() => void controller.handleFileSelected()}
        />
        <span id="upload-fill" className="upload-fill" aria-hidden="true" style={{ width: `${upload.progressPercent}%` }} />
        <CredentialGate visible={upload.credentialGateVisible} />
        <span id="upload-glyph" className={`upload-glyph${upload.tileEnabled ? '' : ' hidden'}`} aria-hidden="true">
          <span className="upload-glyph-h" />
          <span className="upload-glyph-v" />
        </span>
        <strong id="file-label" className={upload.labelVisible ? '' : 'hidden'} title={upload.labelTitle}>
          {upload.label}
        </strong>
        <em id="upload-help" className={upload.helpVisible ? '' : 'hidden'}>
          {upload.help}
        </em>
        <div className={`upload-meta upload-meta-inline${upload.tileEnabled ? '' : ' hidden'}`}>
          <span>单个 PDF</span>
          <span>最大 50MB</span>
          <span>最多 999 页</span>
        </div>
        <div id="upload-status" className={`upload-status${upload.statusVisible ? '' : ' hidden'}`}>
          {upload.status}
        </div>
        <div id="upload-progress-panel" className={`upload-progress-panel${upload.progressVisible ? '' : ' hidden'}`} aria-live="polite">
          <span id="upload-progress-text">{upload.progressText}</span>
        </div>
        <InlinePageRange
          upload={upload as any}
          onPatchStart={(v) => uploadStore.getState().writePageRanges({ start: v, end: upload.pageRangeEnd })}
          onPatchEnd={(v) => uploadStore.getState().writePageRanges({ start: upload.pageRangeStart, end: v })}
          onConstrain={(source) => controller.constrainPageRanges({ source })}
        />
        <TranslationBudgetNote budget={workflow.budget} />
      </div>

      <div id="upload-ready-hint" className={`upload-ready-hint${upload.ready ? '' : ' hidden'}`} aria-live="polite">
        文件已就绪：可<strong>直接翻译</strong>，或<strong>仅收藏</strong>到书架稍后再翻。
      </div>

      <div id="upload-action-slot" className={`upload-action-slot${upload.actionSlotVisible ? '' : ' hidden'}`}>
        <div className="upload-action-group">
          <button
            id="page-range-btn"
            type="button"
            className={`page-range-mini secondary${workflow.pageRangeButtonVisible ? '' : ' hidden'}`}
            aria-label="专业翻译设置"
            title="页码范围等专业选项"
            onClick={() => controller.openPageRangeDialog()}
          >
            选项
          </button>
          <button
            id="store-only-btn"
            type="button"
            className={`secondary${upload.ready ? '' : ' hidden'}`}
            disabled={!upload.ready || workflow.submitBusy}
            title="只加入书架，不开始翻译"
            onClick={() => onStoreOnly?.()}
          >
            仅收藏
          </button>
          <button
            id="submit-btn"
            type="submit"
            disabled={workflow.submitDisabled || workflow.submitBusy}
            {...(workflow.submitBusy ? { 'data-busy': '1' } : {})}
            title="上传完成后立即发起翻译任务"
            onClick={(e) => {
              // Support both form-submit and direct click
              if (onSubmit) {
                e.preventDefault()
                onSubmit()
              }
            }}
          >
            {workflow.submitBusy ? '提交中…' : workflow.submitLabel || '直接翻译'}
          </button>
        </div>
      </div>
    </>
  )
}

// Alias required by task spec
export const HeroUpload = UploadTile
