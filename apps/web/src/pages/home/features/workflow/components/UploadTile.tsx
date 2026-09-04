// 上传工作流容器。
//
// 本文件只负责把 home services/store 映射为视图 props 与业务回调；上传卡、
// 凭据/预算提示、处理方式选择均为无 services 依赖的展示组件。这样视觉调整
// 不再直接碰 composition、DOM ref 或提交端口。

import { useCallback, type MouseEvent as ReactMouseEvent } from "react";

import { useStoreSnapshot } from "@/shared/react/use-store.js";
import { APP_EVENTS } from "../../../composition/external.js";
import { useHomeServices } from "../../../home-services-context.js";
import type { UploadViewStore } from "../stores/upload-store.js";
import { TranslationOptionsPanel } from "./PageRangeDialog.jsx";
import { ProcessingChoicePanel } from "./upload/ProcessingChoicePanel.jsx";
import { UploadDropzone } from "./upload/UploadDropzone.jsx";
import {
  CredentialGateNotice,
  TranslationBudgetNote,
  UploadBudgetSlot,
} from "./upload/UploadWorkflowNotices.jsx";

export function HeroUpload() {
  const services = useHomeServices();
  const upload = useStoreSnapshot(services.stores.uploadView);
  const workflow = useStoreSnapshot(services.stores.workflowView);
  const credentialsView = useStoreSnapshot(services.stores.credentialsView);

  const fileInputRef = useCallback((node: HTMLInputElement | null) => {
    services.uploadDomRefs.fileInput = node;
  }, [services]);

  function handleTileClick(event: ReactMouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest("button") || target.closest("a") || target.closest("input")) return;

    const input = services.uploadDomRefs.fileInput;
    if (input && !input.disabled) input.click();
  }

  function toggleTranslationOptions() {
    if (upload.pageRangeDialogOpen) {
      (services.stores.uploadView as unknown as UploadViewStore).actions.closePageRangeDialog();
      return;
    }
    services.features.uploadFeature?.openPageRangeDialog();
  }

  return (
    <div className="upload-workflow">
      <UploadDropzone
        upload={upload}
        uploadedPageCount={Number(upload.pageRangeMax || upload.pageRangeEnd || 0)}
        fileInputRef={fileInputRef}
        onFileInputClick={() => {
          if (services.uploadDomRefs.fileInput) services.uploadDomRefs.fileInput.value = "";
        }}
        onFileChange={() => void services.features.uploadFeature?.handleFileSelected()}
        onTileClick={handleTileClick}
        budgetSlot={(
          <UploadBudgetSlot>
            <TranslationBudgetNote budget={workflow.budget} />
          </UploadBudgetSlot>
        )}
      />

      <CredentialGateNotice
        visible={Boolean((credentialsView as any)?.credentialGate?.show)}
        onOpenSettings={() => document.dispatchEvent(new CustomEvent(APP_EVENTS.openBrowserCredentials))}
      />

      <ProcessingChoicePanel
        visible={upload.actionSlotVisible}
        uploadReady={upload.ready}
        submitBusy={workflow.submitBusy}
        submitDisabled={workflow.submitDisabled}
        submitLabel={workflow.submitLabel}
        ocrOnly={workflow.ocrOnly}
        pageRangeButtonVisible={workflow.pageRangeButtonVisible}
        pageRangeOpen={upload.pageRangeDialogOpen}
        onToggleTranslationOptions={toggleTranslationOptions}
        onStoreOnly={() => services.library.actions.storeOnly?.()}
        translationOptionsSlot={<TranslationOptionsPanel />}
      />
    </div>
  );
}

// 保留既有导出名，外部 feature 无需感知组件拆分。
export const UploadTile = HeroUpload;
