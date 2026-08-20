// 详情封面/可读性派生：下沉 BookDetailDialog:56-66 的 coverProcessing 双源计算。
// 入参 item/statusCardState（可选 isActive 透传），出 coverProcessing/readerAvailable/canTranslate + isActive/status。

import { useMemo } from "react";
import { isLibraryCardProcessing } from "../display/library-card-badge.js";
import {
  isLibraryOnlyItem,
  isRecentJobActive,
  recentJobStageLabel,
  recentJobStatusLabel,
} from "../../../composition/external.js";

function statusOf(item: any) {
  if (isLibraryOnlyItem(item)) return { label: "未翻译", tone: "muted" };
  if (isRecentJobActive(item)) return { label: recentJobStageLabel(item), tone: "active" };
  const status = `${item.status || ""}`.trim();
  if (status === "succeeded") return { label: "已完成", tone: "done" };
  if (status === "failed") return { label: "失败", tone: "failed" };
  return { label: recentJobStatusLabel(status), tone: "muted" };
}

export type UseBookDetailCoverOptions = {
  item?: any;
  statusCardState?: any;
  /** 可选透传：若调用方已算好 isActive 则复用，否则内部重算 */
  isActive?: boolean;
};

export function useBookDetailCover({
  item = {},
  statusCardState = null,
  isActive: isActiveProp,
}: UseBookDetailCoverOptions) {
  return useMemo(() => {
    const snapshot = statusCardState?.snapshot ?? statusCardState ?? {};
    const cardStatus = `${snapshot?.status ?? statusCardState?.status ?? ""}`.trim().toLowerCase();
    const cardJobId = `${snapshot?.jobId ?? snapshot?.job_id ?? statusCardState?.jobId ?? ""}`.trim();

    const status = statusOf(item);
    const libraryOnly = isLibraryOnlyItem(item);
    const readerAvailable =
      `${item.status || ""}`.trim() === "succeeded" &&
      !["running", "queued", "pending"].includes(cardStatus);
    const canTranslate = Boolean(libraryOnly) || `${item.status || ""}`.trim() === "failed";
    const isActive =
      typeof isActiveProp === "boolean"
        ? isActiveProp
        : isRecentJobActive(item) || ["running", "queued", "pending"].includes(cardStatus);
    // 封面转圈：书架 live 行 + statusCard 正在跑（重试后 payload 可能仍是旧 succeeded）
    const coverProcessing =
      isActive ||
      isLibraryCardProcessing(item) ||
      (Boolean(cardJobId) && ["running", "queued", "pending"].includes(cardStatus));

    return {
      status,
      libraryOnly,
      cardStatus,
      cardJobId,
      readerAvailable,
      canTranslate,
      isActive,
      coverProcessing,
    };
  }, [item, statusCardState, isActiveProp]);
}
