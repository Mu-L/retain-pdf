// 共享 job 帮助：跨 status/library/detail 均可 import，不产生 feature 间耦合。
// 原先 isPollingBootstrapPlaceholder 在 features/status/merge-snapshot-with-fallback.ts，
// library/detail 需跨域 import；迁至 shared 以断开 status → library 依赖。

export type PollingPlaceholderItem = {
  status?: string;
  stage_detail?: string;
  detail?: string;
  [key: string]: unknown;
};

/** 书架 live 行是否为 startPolling 首帧占位（Dialog 层与 snapshot 层共用） */
export function isPollingBootstrapPlaceholder(item: PollingPlaceholderItem = {}): boolean {
  const status = `${item.status || ""}`.trim();
  const detail = `${item.stage_detail || item.detail || ""}`;
  return status === "queued" && detail.includes("正在读取任务状态");
}
