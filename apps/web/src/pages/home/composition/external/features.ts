// composition/external/features — feature controllers / ports barrel
// pages/home/features 不得直接 import ../../../js/features/*；统一从本文件拿。

// home / upload / workflow
export { createHomeStatePort, HOME_LOADING_STATES } from "../../../../js/features/home/state.js";
export type { HomeStatePort } from "../../../../js/features/home/state.js";
export { createUploadStatePort } from "../../../../js/features/upload/state.js";
export type { UploadStatePort } from "../../../../js/features/upload/state.js";
export { mountUploadFeature } from "../../../../js/features/upload/controller.js";
export { countPdfPages } from "../../../../js/features/upload/pdf-page-count.js";
export { collectUploadFormData } from "../../../../js/features/upload/form-data.js";
export { mountWorkflowFeature } from "../../../../js/features/workflow/controller.js";
export { defaultWorkflowConfigPort } from "../../../../js/features/workflow/config-port.js";

// credentials / glossaries
export type { CredentialsStatePort } from "../../../../js/features/credentials/state.js";
export { defaultCredentialsStatePort } from "../../../../js/features/credentials/default-state-port.js";
export { readHiddenCredentialDomInputs } from "../../../../js/features/credentials/hidden-input-dom-port.js";
export { createCredentialRuntimeEnvPort } from "../../../../js/features/credentials/runtime-env-port.js";
export { mountBrowserCredentialsFeature } from "../../../../js/features/credentials/browser.js";
export { mountGlossariesFeature } from "../../../../js/features/glossaries/controller.js";

// app-update
export { mountAppUpdateFeature } from "../../../../js/features/app-update/controller.js";
export {
  fetchLatestGithubRelease,
  normalizeReleaseInfo,
} from "../../../../js/features/app-update/github-release.js";
export { defaultUpdateCachePort } from "../../../../js/features/app-update/state.js";
export { APP_VERSION } from "../../../../js/features/app-update/current-version.js";

// translation workflow dialog
export {
  TRANSLATION_WORKFLOW_DIALOG,
  TRANSLATION_WORKFLOW_MODES,
} from "../../../../js/features/translation-workflow-dialog/contract.js";
export { createTranslationWorkflowDialogStatePort } from "../../../../js/features/translation-workflow-dialog/state.js";
export type { TranslationWorkflowDialogStatePort } from "../../../../js/features/translation-workflow-dialog/state.js";
export { createTranslationWorkflowStatusAreaPort } from "../../../../js/features/translation-workflow-dialog/status-area-port.js";

// app-actions / job-runtime
export { mountAppActionsFeature } from "../../../../js/features/app-actions/controller.js";
export { defaultAppActionsConfigPort } from "../../../../js/features/app-actions/config-port.js";
export { createAppActionsRuntimeEnvPort } from "../../../../js/features/app-actions/runtime-env-port.js";
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
export { mountRecentJobsFeature } from "../../../../js/features/recent-jobs/controller.js";
export { createRecentJobsStatePort } from "../../../../js/features/recent-jobs/state.js";
export { createRecentJobActions } from "../../../../js/features/recent-jobs/actions.js";
export { createRecentJobsRuntimePort } from "../../../../js/features/recent-jobs/job-runtime-port.js";
export { createRecentJobsReaderPort } from "../../../../js/features/recent-jobs/reader-port.js";
export { createRecentJobsNavigationPort } from "../../../../js/features/recent-jobs/navigation-port.js";
export { createRecentJobsLibraryRefreshPort } from "../../../../js/features/recent-jobs/library-refresh-port.js";
export {
  isRecentJobActive,
  recentJobProgressPercent,
  recentJobRawImageUrls,
  recentJobStageLabel,
  recentJobStatusLabel,
  recentJobTitle,
  stageKeyForRecentJobLabel,
} from "../../../../js/features/recent-jobs/card-presenter.js";
export { loadFirstRecentJobImage } from "../../../../js/features/recent-jobs/image-loader.js";
export { buildRecentJobsSummaryViewModel } from "../../../../js/features/recent-jobs/summary-view-model.js";
export { libraryCardIdentity } from "../../../../js/features/recent-jobs/library-card-identity.js";
export { createDocumentLibraryResource } from "../../../../js/features/documents-library/document-library-resource.js";
export { isLibraryOnlyItem } from "../../../../js/features/documents-library/document-card-item.js";
export { shapeDocumentsWithBooks } from "../../../../js/features/documents-library/shape-documents-with-books.js";

// artifact-downloads / app-shell
export { mountArtifactDownloadsFeature } from "../../../../js/features/artifact-downloads/controller.js";
export { createArtifactDownloadsRuntimePort } from "../../../../js/features/artifact-downloads/runtime-port.js";
export { initializeIdleAppView } from "../../../../js/features/app-shell/idle-reset.js";
export { defaultAppShellConfigPort } from "../../../../js/features/app-shell/config-port.js";

// reader-dialog
export {
  READER_DIALOG_COPY,
  READER_DIALOG_IDS,
  READER_DIALOG_MESSAGES,
  READER_FRAME_PLACEHOLDER,
} from "../../../../js/features/reader-dialog/contract.js";
export {
  buildReaderDocumentPageUrl,
  buildReaderPageUrl,
  buildReaderRouteUrl,
  requestedReaderJobIdFromLocation,
} from "../../../../js/features/reader-dialog/routing.js";

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
