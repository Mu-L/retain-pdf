// composition/external/features — feature controllers / ports barrel
// pages/home/features 不得直接 import ../../../js/features/*；统一从本文件拿。

// home / upload / workflow
export { createHomeStatePort, HOME_LOADING_STATES } from "../../../../js/features/home/state.js";
export type { HomeStatePort } from "../../../../js/features/home/state.js";
// ingest（上传 + 工作流 + 提交 + 弹窗）已迁至 src/features/ingest，
// 调用方直接从该功能的出口导入，不再经本网关转发。

// credentials 已迁至 src/features/credentials，调用方直接从该功能的 index.ts
// 导入，不再经本网关转发。
// glossaries 已迁至 src/features/glossaries，调用方直接从该功能的 index.ts
// 导入，不再经本网关转发。

// app-update 已迁至 src/features/app-update，调用方直接从该功能的 index.ts
// 导入，不再经本网关转发。


// job-runtime
export { mountJobRuntimeFeature } from "../../../../js/features/job-runtime/controller.js";
export {
  currentJobStoreFor,
  currentJobId as currentJobIdFor,
  syncCurrentJobSnapshot,
  currentJobFinishedAt,
  createCurrentJobStatePort,
} from "../../../../js/features/job-runtime/current-job-state.js";
export {
  secondaryResourceStoreFor,
  createSecondaryResourceStatePort,
} from "../../../../js/features/job-runtime/secondary-resource-cache.js";
export { createJobRenderContextPort } from "../../../../js/features/job-runtime/render-context.js";
export { readActiveJobId } from "../../../../js/features/job-runtime/active-job-storage.js";

// recent-jobs / documents-library
export { mountRecentJobsFeature } from "@/features/library/index.js";
export { createRecentJobsStatePort } from "@/features/library/index.js";
export { createRecentJobActions } from "@/features/library/index.js";
export { createRecentJobsRuntimePort } from "@/features/library/index.js";
export { createRecentJobsReaderPort } from "@/features/library/index.js";
export { createRecentJobsNavigationPort } from "@/features/library/index.js";
export { createRecentJobsLibraryRefreshPort } from "@/features/library/index.js";
export { createDocumentAutoNaming } from "@/features/library/index.js";
export {
  isRecentJobActive,
  recentJobProgressPercent,
  recentJobRawImageUrls,
  recentJobStageLabel,
  recentJobStatusLabel,
  recentJobTitle,
  stageKeyForRecentJobLabel,
} from "@/features/library/index.js";
export { loadFirstRecentJobImage } from "@/features/library/index.js";
export { buildRecentJobsSummaryViewModel } from "@/features/library/index.js";
export { libraryCardIdentity } from "@/features/library/index.js";
export { createDocumentLibraryResource } from "@/features/library/index.js";
export { isLibraryOnlyItem } from "@/features/library/index.js";
export { shapeDocumentsWithBooks } from "@/features/library/index.js";

// artifact-downloads / app-shell
// artifacts 已迁至 src/features/artifacts，调用方直接从该功能的 index.ts
// 导入，不再经本网关转发。
export { initializeIdleAppView } from "../../../../js/features/app-shell/idle-reset.js";
export { defaultAppShellConfigPort } from "../../../../js/features/app-shell/config-port.js";

// reader 已迁至 src/features/reader，调用方直接从该功能的出口导入，
// 不再经本网关转发。

// status-detail (domain helpers used by pages/home/features/status-detail)
export { copyText } from "../../../../js/utils/clipboard.js";
export { defaultStatusDetailConfigPort } from "../../../../js/features/status-detail/config-port.js";
export {
  boolLabel,
  degradationReasonOf,
  diagnosticsOf,
  errorTypesOf,
  fallbackToOf,
  finalStatusClass,
  finalStatusLabel,
  finalStatusOf,
  normalizeRoutePath,
  pageNumberOf,
  previewText,
  routePathOf,
  stringifyPretty,
  summarizeTranslationFilter,
} from "../../../../js/features/status-detail/formatters.js";
export { createStatusDetailOverviewCoordinator } from "../../../../js/features/status-detail/overview-coordinator.js";
export {
  buildFailureRecoveryModel,
  createFailureRecoveryController,
  queueFullTitle,
  retryCountdownSeconds,
} from "../../../../js/features/status-detail/failure-recovery.js";
export type {
  FailureRecoveryAction,
  FailureRecoveryKind,
  FailureRecoveryModel,
} from "../../../../js/features/status-detail/failure-recovery.js";
export {
  rerunCurrentJob,
  syncRerunAction,
} from "../../../../js/features/status-detail/resume-actions.js";
export { createStatusDetailTranslationDataPort } from "../../../../js/features/status-detail/translation-data-port.js";
export { createStatusDetailTranslationTabCoordinator } from "../../../../js/features/status-detail/translation-tab-coordinator.js";
export { createTranslationState } from "../../../../js/features/status-detail/translation-state.js";
