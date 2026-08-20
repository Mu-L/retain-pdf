// composition/external/job — job helpers / job-status / stage-history barrel

// —— job helpers ——
export {
  buildJobWarningViewModel,
  buildWorkflowSectionsViewModel,
} from "../../../../js/job/workflow-visibility-view-model.js";
export { normalizeJobPayload } from "../../../../js/job/normalize.js";
export { summarizeStatus } from "../../../../js/job/diagnostics.js";
export { isJobTerminal, isTerminalStatus } from "../../../../js/job/core.js";
export {
  resolveSourcePdfDownloadName,
  resolveTranslatedPdfDownloadName,
} from "../../../../js/job/artifacts.js";
export { resolveJobActions } from "../../../../js/job/actions.js";
export { buildElapsedViewModel } from "../../../../js/job/elapsed-view-model.js";
export {
  resolveStageHistory,
  resolveStageHistoryDuration,
  stageHistoryDisplay,
} from "../../../../js/job/stage-history.js";
export type { JobLike, JobPayload } from "../../../../js/job/types.js";

// —— job-status ——
export { adaptJobStageSnapshot } from "../../../../js/job-status/job-stage-contract-adapter.js";
export { normalizedStageEventRecord } from "../../../../js/job-status/job-stage-event-record.js";
export { buildJobStatusSummaryViewModel } from "../../../../js/job-status/job-status-summary-view-model.js";
export { buildSelectedStageDisplay } from "../../../../js/job-status/selected-stage-display-view-model.js";
export {
  STATUS_STAGE_FLOW,
  STATUS_STAGE_LABELS,
  isSelectableStatusStage,
  resolveSelectedStatusStage,
  statusStageIndex,
  statusStageLabel,
} from "../../../../js/job-status/stage-flow-model.js";
export {
  buildProgressOptions,
  shouldAnimateRenderPageProgress,
} from "../../../../js/job-status/status-card-progress-view-model.js";
export { buildRuntimeStatusCardSnapshot } from "../../../../js/job-status/status-card-runtime-source.js";
export { buildSubstageViewModel } from "../../../../js/job-status/substage-view-model.js";
export type { EventsPayload } from "../../../../js/job-status/types.js";

// —— status-detail (non-feature path) ——
export { buildStatusDetailSnapshot } from "../../../../js/status-detail/snapshot.js";
export {
  formatEventTimestamp,
  formatRuntimeDuration,
} from "../../../../js/status-detail/utils.js";
