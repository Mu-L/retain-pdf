// 共享真值（原 frontend/web/src/js/reader/data-port.ts），已抽离为纯函数 + 可注入依赖
// 不直接 import frontend/web 的 api/http，改为参数注入，默认用 window/fetch 或空实现

import {
  hasMarkdownContent,
  loadMarkdownPayloadWithFallback,
  resolveLinkedMarkdownJobId,
} from "./markdown-payload.js";

const DEFAULT_API_PREFIX = "/api/v1";

function defaultLoadJob(): Promise<unknown> {
  return Promise.resolve(null);
}
function defaultLoadManifest(): Promise<unknown> {
  return Promise.resolve({ items: [] } as unknown);
}
function defaultLoadMarkdown(): Promise<unknown> {
  return Promise.resolve(null);
}
function defaultLoadMarkdownDocument(): Promise<unknown> {
  return Promise.resolve(null);
}
function defaultLoadAiChat(): Promise<unknown> {
  return Promise.resolve({ answer: "" } as unknown);
}
function defaultLoadRegions(): Promise<unknown> {
  return Promise.resolve({ items: [] } as unknown);
}
function defaultLoadMetadata(): Promise<unknown> {
  return Promise.resolve(null);
}
function defaultLoadTranslationItem(): Promise<unknown> {
  return Promise.resolve(null);
}
function defaultFetchProtected(input: any, init?: RequestInit): Promise<Response> {
  if (typeof globalThis.fetch === "function") {
    return (globalThis.fetch as any)(input, init);
  }
  return Promise.reject(new Error(`fetchProtected not injected for ${input}`));
}

/** Markdown 原文的来源描述（来自 job detail artifacts.markdown）。 */
export type MarkdownSourceDescriptor = {
  rawUrl: string;
  totalBytes: number | null;
  imagesBaseUrl: string;
  etag?: string | null;
};

/** 一次 HTTP Range 拉取的结果（后端 ?raw=true 支持 206/Range）。 */
export type MarkdownRangeResult = {
  status: number;
  bytes: Uint8Array;
  totalBytes: number | null;
  /** Content-Range 的结束字节（含），供下一段 cursor = rangeEnd + 1 */
  rangeEnd: number | null;
  etag: string | null;
};

export function createReaderDataPort({
  apiPrefix = DEFAULT_API_PREFIX,
  loadJob = defaultLoadJob,
  loadManifest = defaultLoadManifest,
  loadMarkdown = defaultLoadMarkdown,
  loadMarkdownDocument = defaultLoadMarkdownDocument,
  loadMarkdownSource = null,
  fetchMarkdownRange = null,
  loadAiChat = defaultLoadAiChat,
  loadRegions = defaultLoadRegions,
  loadMetadata = defaultLoadMetadata,
  loadTranslationItem = defaultLoadTranslationItem,
  fetchProtectedResource = defaultFetchProtected,
}: {
  apiPrefix?: string;
  loadJob?: (jobId: string, apiPrefix: string) => Promise<unknown>;
  loadManifest?: (jobId: string, apiPrefix: string) => Promise<unknown>;
  loadMarkdown?: (jobId: string, apiPrefix: string) => Promise<unknown>;
  loadMarkdownDocument?: (jobId: string, apiPrefix: string) => Promise<unknown>;
  loadMarkdownSource?: ((jobId: string, apiPrefix: string) => Promise<MarkdownSourceDescriptor | null>) | null;
  fetchMarkdownRange?: ((rawUrl: string, start: number, endInclusive: number, etag?: string) => Promise<MarkdownRangeResult>) | null;
  loadAiChat?: (jobId: string, payload: unknown, apiPrefix: string) => Promise<unknown>;
  loadRegions?: (jobId: string, apiPrefix: string) => Promise<unknown>;
  loadMetadata?: (jobId: string, apiPrefix: string) => Promise<unknown>;
  loadTranslationItem?: (jobId: string, itemId: string, apiPrefix: string) => Promise<unknown>;
  fetchProtectedResource?: typeof fetch;
} = {}) {
  async function loadReaderPayload(jobId: string) {
    const [jobPayload, manifestPayload, regionsPayload, readerMetadata] = await Promise.all([
      loadJob(jobId, apiPrefix),
      // During OCR the immutable artifact manifest does not exist yet. That is
      // a normal in-progress state: the Reader can still load the document's
      // source PDF and reserve the right pane for live translation.
      loadManifest(jobId, apiPrefix).catch(() => ({ items: [] })),
      (loadRegions as any)(jobId, apiPrefix).catch(() => ({ items: [] })),
      (loadMetadata as any)(jobId, apiPrefix).catch(() => null),
    ]);
    return {
      jobPayload,
      manifestPayload,
      readerMetadata,
      regionsPayload,
    };
  }

  function loadJobPayload(jobId: string) {
    return loadJob(jobId, apiPrefix);
  }

  function fetchRegionTranslationItem(jobId: string, itemId: string) {
    return loadTranslationItem(jobId, itemId, apiPrefix);
  }

  async function loadMarkdownPayload(jobId: string) {
    const currentPayload = await loadMarkdownPayloadWithFallback(
      () => loadMarkdownDocument(jobId, apiPrefix),
      () => loadMarkdown(jobId, apiPrefix),
    );
    if (hasMarkdownContent(currentPayload)) return currentPayload;

    // OCR-reuse translation jobs do not copy the source Markdown into their
    // own job root. Follow the public source_artifact_job_id and load the
    // canonical Markdown from the OCR job instead.
    try {
      const jobPayload = await loadJob(jobId, apiPrefix);
      const linkedJobId = resolveLinkedMarkdownJobId(jobPayload, jobId);
      if (!linkedJobId) return currentPayload;
      const linkedPayload = await loadMarkdownPayloadWithFallback(
        () => loadMarkdownDocument(linkedJobId, apiPrefix),
        () => loadMarkdown(linkedJobId, apiPrefix),
      );
      return hasMarkdownContent(linkedPayload) ? linkedPayload : currentPayload;
    } catch {
      return currentPayload;
    }
  }

  // Range 分段读原文：优先真实后端（job detail 已给 raw_url/images_base_url/
  // size_bytes），无端口（mock/旧宿主）时返回 null，panel 回退整篇加载。
  async function resolveMarkdownSource(jobId: string): Promise<MarkdownSourceDescriptor | null> {
    if (typeof loadMarkdownSource !== "function") return null;
    let source = await loadMarkdownSource(jobId, apiPrefix).catch(() => null);
    if (source?.rawUrl) return source;
    // OCR-reuse translation job：Markdown 归属 source OCR job。
    try {
      const jobPayload = await loadJob(jobId, apiPrefix);
      const linkedJobId = resolveLinkedMarkdownJobId(jobPayload, jobId);
      if (!linkedJobId) return source;
      source = await loadMarkdownSource(linkedJobId, apiPrefix).catch(() => null);
      return source?.rawUrl ? source : null;
    } catch {
      return source;
    }
  }

  function loadMarkdownRange(rawUrl: string, start: number, endInclusive: number, etag?: string) {
    if (typeof fetchMarkdownRange !== "function") {
      return Promise.reject(new Error("fetchMarkdownRange not injected"));
    }
    return fetchMarkdownRange(rawUrl, start, endInclusive, etag);
  }

  function submitAiChat(jobId: string, payload: unknown) {
    return loadAiChat(jobId, payload, apiPrefix);
  }

  return Object.freeze({
    apiPrefix,
    fetchProtected: fetchProtectedResource,
    fetchRegionTranslationItem,
    loadMarkdownPayload,
    loadMarkdownSource: resolveMarkdownSource,
    loadMarkdownRange,
    loadJobPayload,
    loadReaderPayload,
    submitAiChat,
  });
}

export const defaultReaderDataPort = createReaderDataPort();
