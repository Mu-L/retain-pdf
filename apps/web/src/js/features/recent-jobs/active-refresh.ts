import { isRecentJobActive } from "./card-presenter.js";
import {
  defaultRecentJobsRefreshEnvironment,
} from "./refresh-environment.js";

export const LIBRARY_ACTIVE_REFRESH_MS = 2500;

export function hasActiveRecentJobs(items = []) {
  return (Array.isArray(items) ? items : []).some(isRecentJobActive);
}

export function recentJobsEligibleForActiveRefresh(items = [], currentJobId = "") {
  const activeJobId = `${currentJobId || ""}`.trim();
  return (Array.isArray(items) ? items : [])
    .filter(isRecentJobActive)
    .filter((item) => {
      const jobId = `${item?.job_id || ""}`.trim();
      return jobId && jobId !== activeJobId;
    });
}

/**
 * 仅轮询「其它活跃任务」详情并单卡 patch。
 * 不再周期 loadRecentJobs 全量列表——那会与 soft/silent reload 叠成网格闪烁。
 * 全量对齐留给：首屏、搜索、删除/创建后、手动刷新、scheduleRefresh。
 */
export function createActiveLibraryRefreshLoop({
  getItems,
  currentJobId = () => "",
  fetchJobPayload,
  apiPrefix,
  updateFromRuntime,
  // 保留参数兼容旧调用方，周期路径不再使用
  loadRecentJobs: _loadRecentJobs,
  isRecentJobsLoading,
  environment = defaultRecentJobsRefreshEnvironment,
}: any) {
  let activeLibraryRefreshTimer = null;
  let loopGen = 0;
  let stopped = false;
  let disposed = false;

  function stop() {
    stopped = true;
    loopGen += 1;
    environment.clearTimeout(activeLibraryRefreshTimer);
    activeLibraryRefreshTimer = null;
  }

  function dispose() {
    disposed = true;
    stop();
  }

  function isStopped() {
    return stopped || disposed;
  }

  async function refreshActiveRecentJobDetails(gen) {
    if (!fetchJobPayload) {
      return;
    }
    if (gen !== loopGen || isStopped()) {
      return;
    }
    const activeItems = recentJobsEligibleForActiveRefresh(getItems(), currentJobId()).slice(0, 6);
    await Promise.allSettled(activeItems.map(async (item) => {
      if (gen !== loopGen || isStopped()) {
        return;
      }
      const jobId = `${item?.job_id || ""}`.trim();
      if (!jobId) {
        return;
      }
      const payload = await fetchJobPayload(jobId, { apiPrefix });
      if (gen !== loopGen || isStopped()) {
        return;
      }
      updateFromRuntime(payload);
    }));
  }

  function schedule({ resetTimer = true }: any = {}) {
    if (disposed) {
      return;
    }
    stopped = false;
    if (resetTimer) {
      // 新一轮调度使上一轮在途 fetch 失活（gen 校验丢弃旧写）。
      loopGen += 1;
      environment.clearTimeout(activeLibraryRefreshTimer);
      activeLibraryRefreshTimer = null;
    }
    if (activeLibraryRefreshTimer) {
      return;
    }
    if (!recentJobsEligibleForActiveRefresh(getItems(), currentJobId()).length) {
      return;
    }
    const gen = loopGen;
    activeLibraryRefreshTimer = environment.setTimeout(() => {
      activeLibraryRefreshTimer = null;
      if (gen !== loopGen || isStopped()) {
        return;
      }
      if (isRecentJobsLoading()) {
        schedule();
        return;
      }
      void refreshActiveRecentJobDetails(gen).finally(() => {
        if (gen !== loopGen || isStopped()) {
          return;
        }
        schedule();
      });
    }, LIBRARY_ACTIVE_REFRESH_MS);
  }

  return {
    dispose,
    isStopped,
    schedule,
    stop,
  };
}
