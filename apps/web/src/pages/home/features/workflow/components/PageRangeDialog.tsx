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

import {
  Ban,
  BookOpen,
  FileText,
  Languages,
  ScanSearch,
  X,
} from "lucide-react";
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

  const ocrOnly = Boolean((workflow as any).ocrOnly);
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
                  <h2 id="page-range-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {ocrOnly ? (
                      <ScanSearch className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
                    ) : (
                      <Languages className="h-5 w-5 shrink-0 text-sky-600" aria-hidden="true" />
                    )}
                    专业翻译
                    {ocrOnly ? (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: 0.3,
                          padding: "2px 7px",
                          borderRadius: 999,
                          background: "#fef3c7",
                          border: "1px solid #fde68a",
                          color: "#92400e",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <ScanSearch className="h-3 w-3" aria-hidden="true" />
                        仅 OCR
                      </span>
                    ) : null}
                  </h2>
                </DialogPrimitive.Title>
                <DialogPrimitive.Close asChild>
                  <button id="page-range-close-btn" type="button" className="dialog-close-btn" aria-label="关闭"><X className="h-4 w-4" /></button>
                </DialogPrimitive.Close>
              </div>
              <div className="desktop-body">
                {ocrOnly ? (
                  <div
                    id="ocr-only-dialog-hint"
                    className="ocr-only-hint"
                    role="status"
                    aria-live="polite"
                    style={{
                      background: "#fffbeb",
                      border: "1px solid #fde68a",
                      borderLeft: "3px solid #f59e0b",
                      borderRadius: 10,
                      padding: "10px 12px",
                      marginBottom: 14,
                      fontSize: 13,
                      lineHeight: "1.6",
                      color: "#92400e",
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: "#fef3c7",
                        border: "1px solid #fde68a",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      <ScanSearch className="h-4 w-4 text-amber-600" />
                    </span>
                    <span>
                      当前为<strong>仅做 OCR</strong>模式，已隐藏翻译相关配置（术语表等）。提交后只会进行 OCR 提取，不会调用翻译。
                    </span>
                  </div>
                ) : null}
                <p
                  id="page-range-limit-text"
                  className="muted"
                  style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}
                >
                  <FileText className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
                  <span>选择本次翻译使用的术语表。页码范围可直接在上传区域填写。</span>
                </p>
                {!ocrOnly ? (
                  <label className="professional-glossary-field">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <BookOpen className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
                      术语表
                    </span>
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
                ) : (
                  <div
                    className="professional-glossary-field is-disabled"
                    aria-disabled="true"
                    style={{
                      opacity: 0.75,
                      background: "var(--color-bg-subtle, #f9fafb)",
                      border: "1px dashed var(--color-border, #e5e7eb)",
                      borderRadius: 8,
                      padding: "8px 10px",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500 }}>
                      <Ban className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      术语表
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "1px 6px",
                          borderRadius: 999,
                          background: "#fef2f2",
                          border: "1px solid #fecaca",
                          color: "#991b1b",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <Ban className="h-3 w-3" aria-hidden="true" />
                        已禁用
                      </span>
                    </span>
                    <select
                      id="job-glossary-id"
                      value=""
                      disabled
                      aria-disabled="true"
                      style={{ marginTop: 6, cursor: "not-allowed" }}
                      title="OCR 模式下无需术语表"
                    >
                      <option value="">OCR 模式下已禁用</option>
                    </select>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 6,
                        fontSize: 12,
                        color: "var(--color-text-secondary, #6b7280)",
                      }}
                    >
                      <ScanSearch className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      OCR 提取不涉及翻译，无需术语表
                    </span>
                  </div>
                )}
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
