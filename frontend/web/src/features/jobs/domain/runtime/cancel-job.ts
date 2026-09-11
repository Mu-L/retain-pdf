/**
 * 取消当前任务：按 workflow 路由到 OCR / 通用取消接口，
 * 请求期间锁取消按钮，失败解锁，成功保持锁定直到权威状态变为 canceled。
 */
export function createCancelCurrentJob({
  currentJobPort,
  shellViewPort,
  setText,
  cancelJob,
  cancelOcrJob,
  apiPrefix,
  fetchJob,
}: any) {
  return async function cancelCurrentJob() {
    const jobId = currentJobPort.jobId();
    if (!jobId) {
      setText("error-box", "当前没有可取消的任务");
      return;
    }
    shellViewPort.setCancelDisabled(true);
    try {
      const snapshot = currentJobPort.snapshot?.() || {};
      const job = snapshot?.job && typeof snapshot.job === "object" ? snapshot.job : snapshot;
      const raw = job?.raw_response && typeof job.raw_response === "object" ? job.raw_response : job;
      const workflow = `${snapshot?.workflow || job?.workflow || raw?.workflow || ""}`.trim();
      const cancel = workflow === "ocr" ? cancelOcrJob : cancelJob;
      if (typeof cancel !== "function") {
        throw new Error("任务取消接口未注入");
      }
      await cancel(jobId, apiPrefix);
      await fetchJob(jobId);
    } catch (err) {
      // 请求失败时允许用户重试；成功时保持锁定，直到权威状态变为 canceled。
      shellViewPort.setCancelDisabled(false);
      setText("error-box", err.message);
    }
  };
}
