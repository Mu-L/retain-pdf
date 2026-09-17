// initialize / dispose：A9 壳生命周期唯一收口（事件绑定 + idle 视图 + startup 路由）。
//
// 启动顺序（见 entry.tsx / shell-boot.ts）：
//   1. composition：建 state/view → createBridge（窄回调桥）→ 各域挂 features →
//      workflowDialog.bindEvents（先于 recent-jobs，见 create-home-composition 注释）→
//      createRuntimeFeatures（job-runtime / recent-jobs / artifacts 一次挂齐）→ createLifecycle。
//      特性在 createRuntimeFeatures 已挂好；workflow 对话框事件在 composition
//      里先于 recent-jobs 绑定（见 composition.js 注释）。
//   2. bridge：随 composition 建好（无独立启动步），被 initializeIdleView 经端口消费。
//   3. initialize()：bindDocumentEvents（retryStage / returnHome）→
//      applyStartupRoute（reader/job_id/活动任务 → startPolling 恢复）→
//      initializeIdleView（经 bridge 落 idle store，可重复调）。
//   4. createRoot().render（mountShellPage：bootTheme → 找根 → 挂载，不开 StrictMode）。
//
// 销毁顺序（initialize 的逆序）：
//   disposeWorkflowDialogEvents → disposeDocumentEvents（解绑 retryStage / returnHome）→
//   jobRuntimeFeature.stopPolling()。事件生产者/消费者对照见 js/contracts/app-contract.ts。

import { APP_EVENTS } from "@/platform/contracts/app-contract.js";
import { requestedReaderJobIdFromLocation } from "@/features/reader/domain.js";
import { normalizeJobPayload, summarizeStatus } from "@retainpdf/domain/job";
import { readActiveJobId } from "@/features/jobs/index.js";
import { isMockMode } from "@/platform/config/runtime.js";
import { resetStatusDetailRuntimeView } from "@/features/job-detail/index.js";
import { parseDetailJobId } from "@/platform/navigation/pages.js";

import type { HomeBridge, HomeFeatures } from "./types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasRecordDetail(event: Event): event is CustomEvent<Record<string, unknown>> {
  return "detail" in event && isRecord(event.detail);
}

type CreateLifecycleArgs = {
  features: HomeFeatures;
  bridge: HomeBridge;
  documentRef: Document;
  disposeWorkflowDialogEvents?: (() => void) | null;
};

export function createLifecycle({
  features,
  bridge,
  documentRef,
  disposeWorkflowDialogEvents,
}: CreateLifecycleArgs) {
  let disposeDocumentEvents: (() => void) | null = null;
  let started = false;

  function initializeIdleView() {
    initializeIdleAppView({
      configPort: defaultAppShellConfigPort,
      jobPresentationPort: { normalizeJobPayload, summarizeStatus },
      setText: bridge.setText,
      setWorkflowSections: bridge.setWorkflowSections,
      setLinearProgress: bridge.setLinearProgress,
      updateActionButtons: bridge.updateActionButtons,
      renderPageRangeSummary: bridge.renderPageRangeSummary,
      resetUploadProgress: bridge.resetUploadProgress,
      resetUploadedFile: bridge.resetUploadedFile,
      applyWorkflowMode: bridge.applyWorkflowMode,
      updateJobWarning: bridge.updateJobWarning,
      resetEventsList: bridge.resetEventsList,
      activateDetailTab: bridge.activateDetailTab,
    });
  }

  function bindDocumentEvents() {
    const onRetryStage = (event: Event) => {
      const detail = hasRecordDetail(event) ? event.detail : {};
      const stage = `${detail.stage || ""}`.trim();
      const jobId = `${detail.jobId || detail.job_id || ""}`.trim();
      if (stage) features.jobRuntimeFeature.retryStage(stage, jobId ? { jobId } : {});
    };
    const onReturnHome = () => features.jobRuntimeFeature.returnToHome();
    documentRef.addEventListener(APP_EVENTS.retryStage, onRetryStage);
    documentRef.addEventListener(APP_EVENTS.returnHome, onReturnHome);
    return () => {
      documentRef.removeEventListener(APP_EVENTS.retryStage, onRetryStage);
      documentRef.removeEventListener(APP_EVENTS.returnHome, onReturnHome);
    };
  }

  function applyStartupRoute() {
    const fromReader = requestedReaderJobIdFromLocation();
    const fromQuery = parseDetailJobId();
    const fromActiveSession = readActiveJobId();
    const jobId = fromReader || fromQuery || fromActiveSession;
    if (!jobId) return;
    // 普通首页刷新没有 job_id 查询参数。此时必须从持久化的活动任务恢复
    // currentJobStore，否则后台仍在执行，详情页却会表现成“任务断开”。
    features.jobRuntimeFeature.startPolling(jobId, fromActiveSession && !fromReader && !fromQuery
      ? { silent: true, showWorkflow: false, publishLibrary: false, recovering: true }
      : undefined);
  }

  function initialize() {
    if (!started) {
      disposeDocumentEvents = bindDocumentEvents();
      started = true;
      applyStartupRoute();
    }
    initializeIdleView();
  }

  function dispose() {
    disposeWorkflowDialogEvents?.();
    disposeDocumentEvents?.();
    disposeDocumentEvents = null;
    features.recentJobsFeature?.disposeFeatureEvents?.();
    const disposeArtifactDownloads = (features.artifactDownloadsFeature as { disposeEvents?: unknown } | undefined)?.disposeEvents;
    if (typeof disposeArtifactDownloads === "function") {
      (disposeArtifactDownloads as () => void)();
    }
    features.jobRuntimeFeature?.stopPolling?.();
    started = false;
  }

  return {
    initialize,
    dispose,
  };
}

// ── idle 首帧：把主页外壳（进度条 / 摘要 / 上传区 / 工作流）打回空态。 ──
//
// 原在 src/js/features/app-shell/idle-reset.ts + config-port.ts，后拆到 idle-view.ts；
// 现并入本文件与 initialize/dispose 同住（idle 视图是壳生命周期的一环）。
//   - createAppShellConfigPort 存在的唯一目的就是把 isMock 喂给
//     initializeIdleAppView（mock 模式下才清 error-box），没有第二个消费方。
//   - 状态详情弹窗那半（resetStatusDetailRuntimeView）留在 features/job-detail，
//     这里跨功能经它的出口 @/features/job-detail/index.js 取。

export function createAppShellConfigPort({
  isMock = isMockMode,
}: any = {}) {
  return {
    isMock,
  };
}

export const defaultAppShellConfigPort = createAppShellConfigPort();

export function initializeIdleAppView({
  configPort,
  jobPresentationPort = {},
  setText,
  setWorkflowSections,
  setLinearProgress,
  updateActionButtons,
  renderPageRangeSummary,
  resetUploadProgress,
  resetUploadedFile,
  applyWorkflowMode,
  updateJobWarning,
  resetEventsList,
  activateDetailTab,
}: any) {
  const normalizeJobPayload = jobPresentationPort.normalizeJobPayload || ((payload) => payload);
  const summarizeStatus = jobPresentationPort.summarizeStatus || ((status) => status);

  updateActionButtons(normalizeJobPayload({}));
  setWorkflowSections(null);
  setLinearProgress("job-progress-bar", "job-progress-text", NaN, NaN, "-");
  setText("job-summary", summarizeStatus("idle"));
  setText("job-stage-detail", "-");
  setText("query-job-duration", "-");
  resetStatusDetailRuntimeView({ setText, resetEventsList, activateDetailTab });
  if (configPort?.isMock?.()) {
    setText("error-box", "-");
  }
  renderPageRangeSummary();
  resetUploadProgress();
  resetUploadedFile();
  applyWorkflowMode();
  updateJobWarning("idle");
}
