// pages/detail 对 src/js/* 的唯一出口。
// DetailApp / components 禁止直接 import ../../js/**；缺符号只改本文件。

// —— job ——
export { normalizeJobPayload, isJobTerminal } from "@retainpdf/domain/job";
export {
  formatEventTimestamp,
  formatRuntimeDuration,
  stageHistoryDisplay,
} from "@retainpdf/domain/job";

// —— job-detail ——
export { getJobIdFromQuery } from "@/features/job-detail/index.js";
export { defaultJobDetailConfigPort } from "@/features/job-detail/index.js";
export { defaultJobDetailDataPort } from "@/features/job-detail/index.js";
export { defaultJobDetailResumePort } from "@/features/job-detail/index.js";
export { bindRerunButton } from "@/features/job-detail/index.js";
export { renderJobDetailOverview } from "@/features/job-detail/index.js";
export { loadAndRenderMarkdownFlow } from "@/features/job-detail/index.js";
export {
  createJobDetailPageState,
  revokeJobDetailMarkdownImageUrls,
} from "@/features/job-detail/index.js";
export {
  buildJobDetailEventViewModel,
} from "@retainpdf/domain/job-status";

// —— downloads ——
export {
  fileNameFromDisposition,
  prepareDownloadTarget,
  saveResponseDownload,
} from "../../js/utils/downloads.js";
export {
  completeDownloadToast,
  failDownloadToast,
  showDownloadPreparing,
  updateDownloadProgress,
} from "../../js/utils/download-feedback.js";
