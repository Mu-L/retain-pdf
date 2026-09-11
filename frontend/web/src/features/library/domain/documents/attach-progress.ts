// 静默接入任务进度（书籍详情处理 Tab → bd-job-status-inner）。

import type { LibraryControllerDeps } from "../types.js";

/**
 * 静默接入任务进度：
 * - silent startPolling：只写 statusCardStore，不抬工作流区、不广播 create
 * - 绝不 dispatch openTranslationWorkflow（进度主场在详情，不在弹窗）
 * - 强制 hide 主状态区，避免 #status-section / 主 StatusCard 抢戏
 * 前置条件：jobId 为非空、非 `doc:` 合成 id。
 */
export function createAttachJobProgress({
  hideStatusArea,
  startPolling,
}: Pick<LibraryControllerDeps, "hideStatusArea" | "startPolling">) {
  return function attachJobProgress(
    jobId?: string | null,
    options: { recovering?: boolean } = {},
  ): void {
    const id = `${jobId || ""}`.trim();
    if (!id || id.startsWith("doc:")) {
      return;
    }
    hideStatusArea?.();
    startPolling?.(id, {
      silent: true,
      showWorkflow: false,
      publishLibrary: false,
      recovering: Boolean(options.recovering),
    });
    hideStatusArea?.();
  };
}
