// composition/external/job — job helpers / job-status / stage-history barrel

// —— job helpers ——
export {
  buildJobWarningViewModel,
  buildWorkflowSectionsViewModel,
} from "@retainpdf/domain/job";
export { normalizeJobPayload } from "@retainpdf/domain/job";
export { summarizeStatus } from "@retainpdf/domain/job";
export { isJobTerminal, isTerminalStatus } from "@retainpdf/domain/job";
export {
  resolveSourcePdfDownloadName,
  resolveTranslatedPdfDownloadName,
} from "@retainpdf/domain/job";
export { resolveJobActions } from "@retainpdf/domain/job";
export { buildElapsedViewModel } from "@retainpdf/domain/job";
export {
  resolveStageHistory,
  resolveStageHistoryDuration,
  stageHistoryDisplay,
} from "@retainpdf/domain/job";
export type { JobLike, JobPayload } from "@retainpdf/domain/job";

// —— job-status（正式 domain package 入口）——
export {
  adaptJobStageSnapshot,
  normalizedStageEventRecord,
  buildJobStatusSummaryViewModel,
  buildSelectedStageDisplay,
  STATUS_STAGE_FLOW,
  STATUS_STAGE_LABELS,
  isSelectableStatusStage,
  resolveSelectedStatusStage,
  statusStageIndex,
  statusStageLabel,
  buildProgressOptions,
  shouldAnimateRenderPageProgress,
  buildRuntimeStatusCardSnapshot,
  buildSubstageViewModel,
} from "@retainpdf/domain/job-status";
export type { EventsPayload } from "@retainpdf/domain/job-status";

// —— status-detail (non-feature path) ——
export { buildStatusDetailSnapshot } from "../../../../js/status-detail/snapshot.js";
export {
  formatEventTimestamp,
  formatRuntimeDuration,
} from "../../../../js/status-detail/utils.js";
