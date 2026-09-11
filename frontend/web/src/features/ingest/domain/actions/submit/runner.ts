import type { RunSubmitFlowOptions } from "./contracts.js";
import { currentSubmitReadiness, handleSubmitReadinessBlock } from "./readiness.js";
import { ensureDeepSeekBudgetReady } from "./budget.js";
import { ensureOcrCredentialsForSubmit } from "./credentials.js";
import { publishSubmitSuccess } from "./progress.js";
import { reportSubmitError } from "./errors.js";

export async function runSubmitFlow({
  workflow,
  desktopMode,
  configPort,
  state,
  apiPrefix,
  uploadId,
  desktopConfigured,
  openSetupDialog,
  openBrowserCredentialsDialog,
  setText,
  submitJobRequest,
  workflowNeedsUpload,
  workflowNeedsCredentials,
  currentRenderSourceJobId,
  currentBudgetState,
  collectRunPayload,
  validateBeforeSubmit,
  ensureOcrCredentialsReady,
  hasBrowserCredentials,
  refreshDeepSeekBalance,
  syncCurrentJobSnapshot,
  renderJob,
  startJobPolling,
  libraryEventPort,
  isMissingUploadError,
  handleMissingUploadError,
  documentRef,
  windowRef,
  now,
}: RunSubmitFlowOptions = {}) {
  // ---- 分支[MOCK]:不做表单校验/组参/预算/凭证,成功→ publishSubmitSuccess→
  // submitted;失败(抛错)→ 上抛由调用方处理,不落 error-box,不关框。 ----
  if (configPort?.isMock?.()) {
    setText("error-box", "-");
    const payload = await submitJobRequest(apiPrefix, { workflow, source: {}, mock: true });
    publishSubmitSuccess({
      payload,
      state,
      renderJob,
      syncCurrentJobSnapshot,
      startJobPolling,
      libraryEventPort,
      documentRef,
      windowRef,
      now,
    });
    return { status: "submitted", payload, mock: true };
  }

  // ---- 分支[真机]:表单校验→组参→提交→接进度→关框 ----
  // [1] 表单校验(readiness):成功→ 下一步;失败→ blocked + error-box/弹框,不发请求。
  const readiness = currentSubmitReadiness({
    workflow,
    configPort,
    desktopMode,
    desktopConfigured,
    uploadId,
    currentRenderSourceJobId,
    hasBrowserCredentials,
    workflowNeedsUpload,
    workflowNeedsCredentials,
    currentBudgetState,
  });
  if (!readiness.ready) {
    handleSubmitReadinessBlock({
      readiness,
      openSetupDialog,
      openBrowserCredentialsDialog,
      currentBudgetState,
      setText,
    });
    return { status: "blocked", readiness };
  }
  // [2] 页码校验:成功→ 下一步;失败→ invalid_page_ranges,不发请求。
  if (!validateBeforeSubmit?.()) {
    return { status: "invalid_page_ranges" };
  }
  // [3] 预算/余额:成功→ 下一步;失败→ budget_not_ready + error-box,不发请求。
  if (!(await ensureDeepSeekBudgetReady({
    workflow,
    workflowNeedsUpload,
    currentBudgetState,
    refreshDeepSeekBalance,
    setText,
  }))) {
    return { status: "budget_not_ready" };
  }
  // [4] OCR 凭证:成功→ 下一步;失败→ ocr_credentials_not_ready + error-box/弹框,不发请求。
  if (!(await ensureOcrCredentialsForSubmit({
    workflow,
    desktopMode,
    workflowNeedsCredentials,
    ensureOcrCredentialsReady,
    openBrowserCredentialsDialog,
    setText,
  }))) {
    return { status: "ocr_credentials_not_ready" };
  }

  setText("error-box", "-");

  // [5] 组参+提交:成功→ publishSubmitSuccess(接进度→关框)→ submitted;
  // 失败(missing_upload)→ missing_upload 回上传态;其余→ error + error-box 诊断,不关框。
  try {
    const runPayload = collectRunPayload?.();
    const payload = await submitJobRequest(apiPrefix, runPayload);
    publishSubmitSuccess({
      payload,
      state,
      renderJob,
      syncCurrentJobSnapshot,
      startJobPolling,
      libraryEventPort,
      documentRef,
      windowRef,
      now,
    });
    return { status: "submitted", payload, mock: false };
  } catch (err) {
    if (isMissingUploadError?.(err)) {
      handleMissingUploadError?.();
      return { status: "missing_upload", error: err };
    }
    reportSubmitError({
      err,
      workflow,
      apiPrefix,
      uploadId,
      currentRenderSourceJobId,
      collectRunPayload,
      setText,
    });
    return { status: "error", error: err };
  }
}
