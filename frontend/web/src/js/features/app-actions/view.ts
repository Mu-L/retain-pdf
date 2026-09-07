import { $ } from "../../dom/query.js";

export interface ResetMissingUploadStateOptions {
  uploadStatePort?: {
    reset?: (options?: { includePageRange?: boolean }) => void;
  };
  resetUploadedFile?: () => void;
  setText?: (id: string, text: string) => void;
}

export function setSubmitBusy(busy) {
  // 注：submitBusyChanged 事件已删（0 消费者）；busy 状态走 DOM 直写。
  const button = $("submit-btn") as HTMLButtonElement | null;
  if (button) {
    button.disabled = !!busy;
    button.dataset.busy = busy ? "1" : "0";
  }
}

export function resetMissingUploadState({
  uploadStatePort,
  resetUploadedFile,
  setText,
}: ResetMissingUploadStateOptions = {}) {
  uploadStatePort?.reset?.({ includePageRange: false });
  resetUploadedFile?.();
  setText("error-box", "当前上传文件已失效，请重新上传 PDF 后再提交。");
}
