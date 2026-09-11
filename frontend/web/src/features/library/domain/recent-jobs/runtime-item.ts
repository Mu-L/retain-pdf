// recent-jobs 卡片运行时合并的装配/出口根。
// stage/snapshot 归一化拆到 runtime-stage-snapshot.ts，单卡合并规则拆到
// library-job-item-merge.ts；本文件保留对外的建卡 / 列表合并入口并转出全部类型。

import { sameLibraryCard } from "./library-card-identity.js";
import { firstNonEmpty } from "./runtime-value-helpers.js";
import { mergeLibraryJobItem } from "./library-job-item-merge.js";
import type {
  LibraryJobItem,
  RuntimeItemOptions,
} from "./runtime-item-types.js";

export type {
  LibraryJobItem,
  RuntimeItemOptions,
  RuntimeStatus,
  StageAdapterPort,
  StageProgress,
  StageSnapshot,
} from "./runtime-item-types.js";
export { buildRecentJobRuntimeSnapshot } from "./runtime-stage-snapshot.js";
export { mergeLibraryJobItem } from "./library-job-item-merge.js";

export function createLibraryJobItemFromRuntime(
  job: LibraryJobItem = {},
  { stageAdapterPort = {} }: RuntimeItemOptions = {},
): LibraryJobItem | null {
  // 前置：缺 job_id 建不出卡 -> null 早返；否则 queued 骨架打底再 merge（[I1] 裸提交即转圈）。
  const jobId = firstNonEmpty(job.job_id);
  if (!jobId) {
    return null;
  }
  return mergeLibraryJobItem({
    id: jobId,
    job_id: jobId,
    title: jobId,
    display_name: jobId,
    source_file_name: "",
    page_count: null,
    status: "queued",
    stage: "queued",
    stage_detail: "任务已提交",
    progress: {},
    created_at: job.created_at || new Date().toISOString(),
    updated_at: job.updated_at || new Date().toISOString(),
  }, job, { stageAdapterPort });
}

export function mergeRuntimePatches(
  items: LibraryJobItem[] | null | undefined,
  patches: Map<string, LibraryJobItem>,
  { stageAdapterPort = {} }: RuntimeItemOptions = {},
): LibraryJobItem[] {
  // 前置：items 可空按 []；patches 为空直接返回原序浅拷贝（早返，不改行为）。
  const list = Array.isArray(items) ? items : [];
  const patchList = patches ? Array.from(patches.values()) : [];
  if (patchList.length === 0) {
    return [...list];
  }
  return list.map((item) => {
    const patch = patchList.find((candidate) => sameLibraryCard(candidate, item)) || null;
    // 早返：无命中补丁 -> 原样返回（终态/运行态都不动）。
    if (!patch) {
      return item;
    }
    // 命中：用 patch 的 job_id 覆盖（重试后书架仍是原位原书）// [I3]
    return mergeLibraryJobItem(item, {
      ...patch,
      job_id: firstNonEmpty(patch.job_id, item.job_id),
      active_job_id: firstNonEmpty(patch.active_job_id, patch.job_id, item.active_job_id),
      library_only: false,
    }, { stageAdapterPort });
  });
}
