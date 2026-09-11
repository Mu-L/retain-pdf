// OCR 重试 / Trace 复制：包装 failure-recovery 控制器，补上弹窗关闭、
// 全局提示与轮询启动等副作用。

import type { StatusDetailStore } from "../status-detail-store.js";
import type { StatusDetailDialogStore } from "../status-detail-dialog-store.js";
import {
  createFailureRecoveryController,
} from "./failure-recovery.js";
import type {
  StatusDetailControllerDeps,
} from "./controller-types.js";

export function createStatusDetailFailureRecoveryActions({
  retryJobStage,
  apiPrefix,
  copyText,
  store,
  dialogStore,
  startPolling,
  setText,
  getCurrentJobId,
}: {
  retryJobStage?: StatusDetailControllerDeps["retryJobStage"];
  apiPrefix?: string;
  copyText?: StatusDetailControllerDeps["copyText"];
  store: StatusDetailStore;
  dialogStore: StatusDetailDialogStore;
  startPolling?: (jobId: string) => void;
  setText?: (id: string, message: string) => void;
  getCurrentJobId: () => string;
}) {
  const failureRecoveryActions = createFailureRecoveryController({
    retryStage: retryJobStage
      ? (jobId, stage, payload) => retryJobStage(jobId, apiPrefix, stage, payload)
      : undefined,
    copyTrace: copyText,
  });

  async function retryOcrNow(options: { acceptDuplicateRisk?: boolean } = {}) {
    const jobId = getCurrentJobId();
    const model = store.getSnapshot().overview.failureRecovery;
    const payload = await failureRecoveryActions.retryOcrNow(jobId, model, options) as Record<string, unknown>;
    const nextJobId = `${payload?.job_id || payload?.id || ""}`.trim();
    if (!nextJobId) throw new Error("OCR 重试已提交，但响应中没有 job_id。");
    dialogStore.close();
    setText?.("error-box", `已创建 OCR 恢复任务 ${nextJobId}，开始轮询。`);
    startPolling?.(nextJobId);
    return payload;
  }

  async function copyFailureTraceId() {
    return failureRecoveryActions.copyTraceId(store.getSnapshot().overview.failureRecovery);
  }

  return { retryOcrNow, copyFailureTraceId };
}
