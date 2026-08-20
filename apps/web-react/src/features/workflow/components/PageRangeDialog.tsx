/**
 * PageRangeDialog — React port of
 *   apps/web/src/pages/home/features/workflow/components/PageRangeDialog.tsx
 *
 * Dialog for professional translation options (glossary selection + page-range apply).
 * Uses local Dialog ui primitive; state from Zustand stores (upload + workflow).
 * Pure close semantics — no app side-effects beyond store writes.
 */
import { useStore } from 'zustand'
import { Dialog } from '@/components/ui/dialog'
import { getUploadStore } from '../model/upload-store'
import { getWorkflowStore } from '../model/workflow-store'
import { useUploadController } from '../model/useUploadController'

export function PageRangeDialog() {
  const uploadStore = getUploadStore()
  const workflowStore = getWorkflowStore()
  const upload = useStore(uploadStore)
  const workflow = useStore(workflowStore)
  const controller = useUploadController({ store: uploadStore })

  const open = Boolean(upload.pageRangeDialogOpen)
  const selectedId = `${workflow.selectedGlossaryId || ''}`.trim()
  const hasSelected = !selectedId || workflow.glossaries.some((g) => g.glossaryId === selectedId)

  return (
    <Dialog
      open={open}
      title="专业翻译"
      closeLabel="关闭"
      backdropCloseLabel="关闭专业翻译设置"
      contentClassName="desktop-body"
      onClose={() => uploadStore.getState().closePageRangeDialog()}
    >
      <div id="page-range-dialog" className="desktop-dialog page-range-dialog professional-translate-dialog">
        <p id="page-range-limit-text" className="muted">
          选择本次翻译使用的术语表。页码范围可直接在上传区域填写。
        </p>
        <label className="professional-glossary-field">
          <span>术语表</span>
          <select
            id="job-glossary-id"
            value={selectedId}
            onChange={(event) => workflowStore.getState().setSelectedGlossaryId(event.target.value)}
          >
            <option value="">不使用术语表</option>
            {workflow.glossaries.map((glossary) => (
              <option key={glossary.glossaryId} value={glossary.glossaryId}>
                {glossary.name}
                {Number.isFinite(glossary.entryCount as number) ? ` (${glossary.entryCount})` : ''}
              </option>
            ))}
            {!hasSelected ? <option value={selectedId}>{`已删除或不可用: ${selectedId}`}</option> : null}
          </select>
        </label>
        <div className="actions flex justify-end gap-2 pt-4">
          <button id="page-range-clear-btn" type="button" className="app-button secondary" onClick={() => controller.clearPageRanges()}>
            不使用
          </button>
          <button id="page-range-apply-btn" type="button" className="app-button" onClick={() => controller.applyPageRanges()}>
            完成
          </button>
        </div>
      </div>
    </Dialog>
  )
}
