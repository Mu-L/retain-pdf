/**
 * TranslationWorkflowDialog — React-idiomatic port of
 *   apps/web/src/pages/home/features/workflow/TranslationWorkflowDialog.tsx
 *
 * Workflow dialog with upload vs status modes.
 * React hooks replace bespoke createStore dialogStatePort wiring.
 * Uses Zustand dialog store (local) + workflow/upload stores for parity.
 * Keeps apps/web dialog contract but exposes idiomatic React props.
 */
import { useEffect } from 'react'
import { create } from 'zustand'
import { useStore } from 'zustand'
import { Dialog } from '@/components/ui/dialog'
import { getUploadStore } from '../model/upload-store'
import { getWorkflowStore } from '../model/workflow-store'
import { UploadTile } from './UploadTile'
import { PageRangeDialog } from './PageRangeDialog'

// Local dialog mode store (mirrors translation-workflow-dialog/state.ts dialogStatePort)
type WorkflowDialogMode = 'upload' | 'status'
type WorkflowDialogState = {
  open: boolean
  mode: WorkflowDialogMode
  openUpload: () => void
  openStatus: () => void
  close: () => void
  setMode: (mode: WorkflowDialogMode) => void
}

export const useWorkflowDialogStore = create<WorkflowDialogState>((set) => ({
  open: false,
  mode: 'upload',
  openUpload: () => set({ open: true, mode: 'upload' }),
  openStatus: () => set({ open: true, mode: 'status' }),
  close: () => set({ open: false }),
  setMode: (mode) => set({ mode }),
}))

export type TranslationWorkflowDialogProps = {
  statusCardSlot?: React.ReactNode | null
  hiddenInputsSlot?: React.ReactNode | null
  open?: boolean
  mode?: WorkflowDialogMode
  onClose?: () => void
}

export function TranslationWorkflowDialog({
  statusCardSlot = null,
  hiddenInputsSlot = null,
  open: controlledOpen,
  mode: controlledMode,
  onClose,
}: TranslationWorkflowDialogProps = {}) {
  const dialogState = useStore(useWorkflowDialogStore)
  const uploadStore = getUploadStore()
  const upload = useStore(uploadStore)
  void upload // keep snapshot parity (used for PageRange side-effects)

  const open = controlledOpen ?? dialogState.open
  const mode = controlledMode ?? dialogState.mode
  const statusMode = mode === 'status'

  // <html> level hook parity with apps/web (rootOpen class)
  useEffect(() => {
    const root = document.documentElement
    const cls = 'translation-workflow-open'
    root.classList.toggle(cls, open)
    return () => root.classList.remove(cls)
  }, [open])

  function handleClose() {
    if (onClose) onClose()
    else useWorkflowDialogStore.getState().close()
    // Parity: reset upload session on close is handled by caller if needed
    // Do not force reset here — keep hook pure.
    document.dispatchEvent(new CustomEvent('retain:closeTranslationWorkflow'))
  }

  function handleOpenUpload() {
    useWorkflowDialogStore.getState().openUpload()
    document.dispatchEvent(new CustomEvent('retain:openTranslationWorkflow', { detail: { mode: 'upload' } }))
  }
  void handleOpenUpload

  return (
    <>
      <Dialog
        open={open}
        title={statusMode ? '任务进度' : '翻译 PDF'}
        closeLabel="关闭"
        backdropCloseLabel="关闭翻译工作流对话框"
        onClose={handleClose}
      >
        <div className="translation-workflow-head-copy sr-only">
          <p id="translation-workflow-desc">选择 PDF 后，可直接翻译或仅收藏到书架。</p>
        </div>
        <section className="translation-workflow-card">
          <div id="job-warning" className={`job-warning${useStore(getWorkflowStore()).jobWarningVisible ? '' : ' hidden'}`}>
            检测到上一个任务仍在处理中。建议先等待当前任务结束，再提交新的 PDF。
          </div>
          <form
            id="job-form"
            className="form"
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              document.dispatchEvent(new CustomEvent('retain:submitWorkflow'))
            }}
          >
            {hiddenInputsSlot}
            <UploadTile
              onStoreOnly={() => document.dispatchEvent(new CustomEvent('retain:closeTranslationWorkflow'))}
              onSubmit={() => document.dispatchEvent(new CustomEvent('retain:submitWorkflow'))}
            />
            <div id="error-box" className="error-box" aria-live="polite" />
          </form>
          <section id="status-section" className={`translation-status-panel${statusCardSlot ? '' : ' hidden'}`} aria-label="任务进度">
            {statusCardSlot}
          </section>
        </section>
      </Dialog>
      <PageRangeDialog />
    </>
  )
}

// Convenience hook that mirrors apps/web translation-workflow-dialog-runtime
export function useTranslationWorkflowDialog() {
  const store = useWorkflowDialogStore
  return {
    open: store.getState().open,
    mode: store.getState().mode,
    openUpload: () => {
      // Reset upload session parity
      getUploadStore().getState().reset()
      store.getState().openUpload()
    },
    openFromEvent: (event: { detail?: { mode?: string } } = {}) => {
      const mode = (event as any)?.detail?.mode
      if (!mode || mode === 'upload') {
        getUploadStore().getState().reset()
        store.getState().openUpload()
      } else {
        store.getState().setMode(mode === 'status' ? 'status' : 'upload')
        if (!store.getState().open) store.setState({ open: true })
      }
    },
    close: () => store.getState().close(),
    requestOpenUpload: () => document.dispatchEvent(new CustomEvent('retain:openTranslationWorkflow', { detail: { mode: 'upload' } })),
    requestClose: () => document.dispatchEvent(new CustomEvent('retain:closeTranslationWorkflow')),
  }
}
