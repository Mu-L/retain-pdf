// 专业翻译对话框(React 版 <page-range-dialog>,对照 components/dialogs/page-range-dialog.js)。
//
// Dialog 渲染层(阶段 C 收官批,shadcn 改造):从原生 <dialog>+showModal/close
// 换成 radix-ui 的 Dialog 原语(DialogPrimitive.Root/Portal/Overlay/Content),
// 继续用现有 desktop-dialog/desktop-shell 视觉体系,不套默认皮肤。开合状态
// 仍然是 uploadView store 的 pageRangeDialogOpen 字段(铁律:不改 store,只换
// 渲染层),onOpenChange(false) 统一走 uploadViewActions.patch 回写。
//
// 背板/Esc/关闭按钮统一为纯关闭语义,不触发应用副作用。
// 术语表下拉由 workflow store 的 glossaries/selectedGlossaryId 驱动。

import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useStoreSnapshot } from "@/shared/react/use-store.js";
import { useHomeServices } from "../../../home-services-context.js";
import { useDialogReturnFocus } from "@/shared/react/use-dialog-return-focus.js";

export function PageRangeDialog() {
  const services = useHomeServices();
  const upload = useStoreSnapshot(services.stores.uploadView);
  const workflow = useStoreSnapshot(services.stores.workflowView);

  const open = Boolean(upload.pageRangeDialogOpen);
  const { onCloseAutoFocus } = useDialogReturnFocus(open);

  // Esc / 背板点击 / 关闭按钮都经这一个回调回写 store,纯关闭,不触发应用副作用。
  function handleOpenChange(nextOpen) {
    if (!nextOpen) {
      services.uploadViewActions.patch({ pageRangeDialogOpen: false });
    }
  }

  const selectedId = `${workflow.selectedGlossaryId || ""}`.trim();
  const hasSelected = !selectedId
    || workflow.glossaries.some((glossary) => glossary.glossaryId === selectedId);

  return (
    <page-range-dialog data-hydrated="1">
      <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="desktop-dialog-overlay" />
          <DialogPrimitive.Content
            id="page-range-dialog"
            className="desktop-dialog page-range-dialog professional-translate-dialog"
            onCloseAutoFocus={onCloseAutoFocus}
          >
            <div className="desktop-shell">
              <div className="desktop-head">
                <DialogPrimitive.Title asChild>
                  <h2 id="page-range-title">专业翻译</h2>
                </DialogPrimitive.Title>
                <DialogPrimitive.Close asChild>
                  <button id="page-range-close-btn" type="button" className="dialog-close-btn" aria-label="关闭"><X className="h-4 w-4" /></button>
                </DialogPrimitive.Close>
              </div>
              <div className="desktop-body">
                <p id="page-range-limit-text" className="muted">选择本次翻译使用的术语表。页码范围可直接在上传区域填写。</p>
                <label className="professional-glossary-field">
                  <span>术语表</span>
                  <select
                    id="job-glossary-id"
                    value={selectedId}
                    onChange={(event) => services.workflowViewActions.setSelectedGlossaryId(event.target.value)}
                  >
                    <option value="">不使用术语表</option>
                    {workflow.glossaries.map((glossary) => (
                      <option key={glossary.glossaryId} value={glossary.glossaryId}>
                        {glossary.name}
                        {Number.isFinite(glossary.entryCount) ? ` (${glossary.entryCount})` : ""}
                      </option>
                    ))}
                    {!hasSelected ? (
                      <option value={selectedId}>{`已删除或不可用: ${selectedId}`}</option>
                    ) : null}
                  </select>
                </label>
                <div className="actions">
                  <button
                    id="page-range-clear-btn"
                    type="button"
                    className="app-button secondary"
                    onClick={() => services.features.uploadFeature?.clearPageRanges()}
                  >
                    不使用
                  </button>
                  <button
                    id="page-range-apply-btn"
                    type="button"
                    className="app-button"
                    onClick={() => services.features.uploadFeature?.applyPageRanges()}
                  >
                    完成
                  </button>
                </div>
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </page-range-dialog>
  );
}
