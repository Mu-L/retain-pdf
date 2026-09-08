// composition/external/features — feature controllers / ports barrel
// pages/home/features 不得直接 import ../../../js/features/*；统一从本文件拿。

// home / upload / workflow
export { createHomeStatePort } from "../../state/home-store.js";
export { HOME_LOADING_STATES } from "@/platform/contracts/home-view-contract.js";
export type { HomeStatePort } from "@/platform/contracts/home-view-contract.js";
// ingest（上传 + 工作流 + 提交 + 弹窗）已迁至 src/features/ingest，
// 调用方直接从该功能的出口导入，不再经本网关转发。

// credentials 已迁至 src/features/credentials，调用方直接从该功能的 index.ts
// 导入，不再经本网关转发。
// glossaries 已迁至 src/features/glossaries，调用方直接从该功能的 index.ts
// 导入，不再经本网关转发。

// app-update 已迁至 src/features/app-update，调用方直接从该功能的 index.ts
// 导入，不再经本网关转发。


// job-runtime
export { mountJobRuntimeFeature } from "@/features/jobs/index.js";
export {
  currentJobStoreFor,
  currentJobId as currentJobIdFor,
  syncCurrentJobSnapshot,
  currentJobFinishedAt,
  createCurrentJobStatePort,
} from "@/features/jobs/index.js";
export {
  secondaryResourceStoreFor,
  createSecondaryResourceStatePort,
} from "@/features/jobs/index.js";
export { createJobRenderContextPort } from "@/features/jobs/index.js";
export { readActiveJobId } from "@/features/jobs/index.js";

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

// artifact-downloads
// artifacts 已迁至 src/features/artifacts，调用方直接从该功能的 index.ts
// 导入，不再经本网关转发。
// app-shell 的 idle 视图与 config port 已落 composition/idle-view.ts（同层，
// 不再是「外部依赖」），唯一消费方 create-lifecycle.ts 直接从那里取。

// reader 已迁至 src/features/reader，调用方直接从该功能的出口导入，
// 不再经本网关转发。

// status-detail (domain helpers used by pages/home/features/status-detail)
export { copyText } from "@/platform/utils/clipboard.js";
export { defaultStatusDetailConfigPort } from "@/features/job-detail/index.js";
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
} from "@/features/job-detail/index.js";
export { createStatusDetailOverviewCoordinator } from "@/features/job-detail/index.js";
export {
  buildFailureRecoveryModel,
  createFailureRecoveryController,
  queueFullTitle,
  retryCountdownSeconds,
} from "@/features/job-detail/index.js";
export type {
  FailureRecoveryAction,
  FailureRecoveryKind,
  FailureRecoveryModel,
} from "@/features/job-detail/index.js";
export {
  rerunCurrentJob,
  syncRerunAction,
} from "@/features/job-detail/index.js";
export { createStatusDetailTranslationDataPort } from "@/features/job-detail/index.js";
export { createStatusDetailTranslationTabCoordinator } from "@/features/job-detail/index.js";
export { createTranslationState } from "@/features/job-detail/index.js";
