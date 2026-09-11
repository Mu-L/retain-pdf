// 文档任务查询 / 阶段重试 / 取消。

import type { DialogStore } from "@/platform/store/dialog-store.js";
import { API_PREFIX } from "@/platform/config/api-constants.js";
import {
  cancelJob as defaultCancelJob,
  cancelOcrJob as defaultCancelOcrJob,
  fetchDocumentByJobId as defaultFetchDocumentByJobId,
  fetchDocumentJobs as defaultFetchDocumentJobs,
  fetchJobStageActions as defaultFetchJobStageActions,
  retryJobStage as defaultRetryJobStage,
} from "@/platform/api/index.js";
import type {
  JobSubmissionView,
  LibraryCardItem,
  LibraryControllerDeps,
  TranslateDocumentPayload,
} from "../types.js";

export function createDocumentJobActions({
  bookDetailStore,
  buildTranslateConfig,
  promoteDocumentToJob,
  fetchDocumentJobs = defaultFetchDocumentJobs,
  fetchDocumentByJobId = defaultFetchDocumentByJobId,
  fetchJobStageActions = defaultFetchJobStageActions,
  retryJobStageApi = defaultRetryJobStage,
  cancelJobApi = defaultCancelJob,
  cancelOcrJobApi = defaultCancelOcrJob,
}: {
  bookDetailStore: DialogStore<LibraryCardItem | null>;
  buildTranslateConfig?: LibraryControllerDeps["buildTranslateConfig"];
  promoteDocumentToJob: (
    documentId: string,
    result: JobSubmissionView | null | undefined,
    sourceJobId?: string,
  ) => void;
  /** 可注入，便于单测；默认走平台 API 网关。 */
  fetchDocumentJobs?: typeof defaultFetchDocumentJobs;
  fetchDocumentByJobId?: typeof defaultFetchDocumentByJobId;
  fetchJobStageActions?: typeof defaultFetchJobStageActions;
  retryJobStageApi?: typeof defaultRetryJobStage;
  cancelJobApi?: typeof defaultCancelJob;
  cancelOcrJobApi?: typeof defaultCancelOcrJob;
}) {
  // 前置条件: documentId 非空;空返回 { items: [] }。
  async function getDocumentJobs(documentId?: string | null) {
    const normalizedId = `${documentId || ""}`.trim();
    if (!normalizedId) return { items: [] };
    return fetchDocumentJobs(API_PREFIX, normalizedId) as Promise<any>;
  }

  // 前置条件: jobId 为真实 id(合成 `doc:` 返回 null)。
  async function getDocumentByJobId(jobId?: string | null) {
    const normalizedId = `${jobId || ""}`.trim();
    if (!normalizedId || normalizedId.startsWith("doc:")) return null;
    return fetchDocumentByJobId(API_PREFIX, normalizedId) as Promise<LibraryCardItem | null>;
  }

  // 前置条件: jobId 为真实 id(合成 `doc:` 返回 null)。
  async function getJobStageActions(jobId?: string | null) {
    const normalizedId = `${jobId || ""}`.trim();
    if (!normalizedId || normalizedId.startsWith("doc:")) return null;
    return fetchJobStageActions(normalizedId, API_PREFIX);
  }

  // 前置条件: jobId/stage 均非空;document_id 取 overrides 回落详情 payload。
  async function retryJobStage(
    jobId?: string | null,
    stage?: string | null,
    overrides: Record<string, unknown> = {},
  ): Promise<JobSubmissionView | null> {
    const normalizedJobId = `${jobId || ""}`.trim();
    const normalizedStage = `${stage || ""}`.trim();
    if (!normalizedJobId || !normalizedStage) return null;
    const dialogState = bookDetailStore.getState();
    const base = (dialogState.payload || {}) as LibraryCardItem;
    const documentId = `${overrides.document_id || base.document_id || ""}`.trim();
    const currentTranslation = normalizedStage === "translation"
      ? ((buildTranslateConfig?.("") as TranslateDocumentPayload | undefined)?.translation || {})
      : null;
    const requestedOverrides = overrides.overrides && typeof overrides.overrides === "object"
      ? overrides.overrides as Record<string, unknown>
      : {};
    const stageOverrides = currentTranslation
      ? {
          ...requestedOverrides,
          translation: {
            ...((requestedOverrides.translation && typeof requestedOverrides.translation === "object")
              ? requestedOverrides.translation as Record<string, unknown>
              : {}),
            ...currentTranslation,
          },
        }
      : requestedOverrides;
    const result = await retryJobStageApi(normalizedJobId, API_PREFIX, normalizedStage, {
      document_id: documentId,
      title: base.title,
      display_name: base.display_name || base.title,
      cover_url: base.cover_url,
      thumbnail_url: base.thumbnail_url,
      page_count: base.page_count,
      ...overrides,
      ...(Object.keys(stageOverrides).length ? { overrides: stageOverrides } : {}),
    }) as JobSubmissionView;
    if (result && documentId) promoteDocumentToJob(documentId, result, normalizedJobId);
    return result || null;
  }

  // 取消文档下的任务。OCR 走 /ocr/jobs/:id/cancel，其余走 /jobs/:id/cancel。
  async function cancelJob(
    jobId?: string | null,
    workflow?: string | null,
  ): Promise<unknown> {
    const normalizedJobId = `${jobId || ""}`.trim();
    if (!normalizedJobId) return null;
    return `${workflow || ""}`.trim().toLowerCase() === "ocr"
      ? cancelOcrJobApi(normalizedJobId, API_PREFIX)
      : cancelJobApi(normalizedJobId, API_PREFIX);
  }

  return { getDocumentJobs, getDocumentByJobId, getJobStageActions, retryJobStage, cancelJob };
}
