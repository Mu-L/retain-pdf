/** RetainPDF API and artifact bindings for the package-owned Reader data runtime. */
import { fetchProtected as fetchApiProtected } from "@retainpdf/api/http";
import {
  fetchJobArtifactsManifest as fetchApiJobArtifactsManifest,
  fetchJobMarkdown as fetchApiJobMarkdown,
} from "@retainpdf/api/jobs-artifacts";
import { fetchJobPayload as fetchApiJobPayload } from "@retainpdf/api/jobs";
import {
  fetchReaderMetadata as fetchApiReaderMetadata,
  fetchReaderRegions as fetchApiReaderRegions,
} from "@retainpdf/api/reader";
import { fetchTranslationItem as fetchApiTranslationItem } from "@retainpdf/api/translation-debug";
import {
  findReadyManifestArtifact,
  resolveJobActions,
  resolveJobMarkdownContract,
  resolveManifestArtifactUrl,
  resolveResourceUrl,
} from "@retainpdf/domain/job";
import type { JobLike } from "@retainpdf/domain/job";
import * as readerData from "@retainpdf/reader/runtime/data";
import type {
  MarkdownRangeResult,
  MarkdownSourceDescriptor,
} from "@retainpdf/reader/runtime/data";
import {
  fetchMockProtected,
  getMockJobArtifactsManifest,
  getMockJobPayload,
  getMockJobMarkdown,
} from "@/platform/mock/index.js";
import { getMockReaderRegions } from "@/platform/mock/documents.js";
import { getMockTranslationItem } from "@/platform/mock/translation.js";
import { API_PREFIX } from "@/platform/config/api-constants.js";
import { isMockMode } from "@/platform/config/runtime.js";
import { resolvePdfjsVendorUrl } from "@/platform/runtime/vendor-url.js";
import { defaultReaderPdfDocumentConfigPort } from "./config.js";

async function fetchJobPayload(jobId: string, apiPrefix?: string): Promise<any> {
  if (isMockMode()) {
    void apiPrefix;
    return getMockJobPayload(jobId);
  }
  return fetchApiJobPayload(jobId, apiPrefix ? { apiPrefix } : undefined);
}

async function fetchJobArtifactsManifest(jobId: string, apiPrefix?: string): Promise<any> {
  if (isMockMode()) {
    void jobId;
    void apiPrefix;
    return getMockJobArtifactsManifest();
  }
  return fetchApiJobArtifactsManifest(jobId, apiPrefix);
}

async function fetchJobMarkdown(jobId: string, apiPrefix?: string): Promise<any> {
  if (isMockMode()) {
    void jobId;
    void apiPrefix;
    return getMockJobMarkdown();
  }
  return fetchApiJobMarkdown(jobId, apiPrefix);
}

// Markdown 原文来源：job detail 的 artifacts.markdown 已提供 raw_url /
// images_base_url / size_bytes，无需额外的 metadata 端点。mock 也走同一分段路径
// （把 mock 正文当成本地文件切片），保证开发/测试与生产行为一致。
async function fetchJobMarkdownSource(
  jobId: string,
  apiPrefix?: string,
): Promise<MarkdownSourceDescriptor | null> {
  if (isMockMode()) {
    void jobId;
    void apiPrefix;
    const mock = getMockJobMarkdown();
    const content = `${mock?.content || ""}`;
    if (!content) return null;
    return {
      rawUrl: `${mock?.raw_url || "mock://markdown.raw"}`,
      totalBytes: new TextEncoder().encode(content).byteLength,
      imagesBaseUrl: `${mock?.images_base_url || ""}`,
    };
  }
  const job = await fetchApiJobPayload(jobId, apiPrefix ? { apiPrefix } : undefined);
  // 后端 job detail 的完整契约由 @retainpdf/api 拥有；这里只按消费到的
  // JobLike 子集读取 markdown artifacts，故收窄而非 any。
  const contract = resolveJobMarkdownContract(job as unknown as JobLike);
  if (!contract?.rawUrl) return null;
  return {
    rawUrl: contract.rawUrl,
    totalBytes: contract.sizeBytes ?? null,
    imagesBaseUrl: contract.imagesBaseUrl || "",
  };
}

// 一次 HTTP Range 拉取；后端 ?raw=true 走 stream_file，支持 206/Content-Range/ETag。
async function fetchJobMarkdownRange(
  rawUrl: string,
  start: number,
  endInclusive: number,
  etag?: string,
  signal?: AbortSignal,
): Promise<MarkdownRangeResult> {
  if (isMockMode() && `${rawUrl || ""}`.startsWith("mock://")) {
    const bytes = new TextEncoder().encode(`${getMockJobMarkdown()?.content || ""}`);
    const slice = bytes.slice(start, Math.min(endInclusive + 1, bytes.length));
    return {
      status: 206,
      bytes: slice,
      totalBytes: bytes.length,
      rangeEnd: start + slice.length - 1,
      etag: 'W/"mock"',
    };
  }
  const headers: Record<string, string> = { Range: `bytes=${start}-${endInclusive}` };
  // If-Range 只接受强校验器；弱 ETag（W/"…"）会被服务端忽略并回整篇。
  if (etag && !etag.startsWith("W/")) headers["If-Range"] = etag;
  const resp = await fetchApiProtected(rawUrl, { headers, signal });
  const contentRange = resp.headers.get("Content-Range") || "";
  const match = contentRange.match(/bytes\s+(\d+)-(\d+)\/(\d+|\*)/i);
  const rangeEnd = match ? Number(match[2]) : null;
  const totalBytes = match && match[3] !== "*" ? Number(match[3]) : null;
  const bytes = new Uint8Array(await resp.arrayBuffer());
  return {
    status: resp.status,
    bytes,
    totalBytes,
    rangeEnd,
    etag: resp.headers.get("ETag"),
  };
}

async function fetchReaderRegions(jobId: string, apiPrefix?: string): Promise<any> {
  if (isMockMode()) {
    void jobId;
    void apiPrefix;
    return getMockReaderRegions();
  }
  return fetchApiReaderRegions(jobId, apiPrefix);
}

async function fetchReaderMetadata(jobId: string, apiPrefix?: string): Promise<any> {
  if (isMockMode()) {
    void jobId;
    void apiPrefix;
    return null;
  }
  return fetchApiReaderMetadata(jobId, apiPrefix);
}

async function fetchTranslationItem(jobId: string, itemId: string, apiPrefix?: string): Promise<any> {
  if (isMockMode()) {
    void apiPrefix;
    return getMockTranslationItem(jobId, itemId);
  }
  return fetchApiTranslationItem(jobId, itemId, apiPrefix);
}

export async function fetchProtected(url: string, options: RequestInit = {}): Promise<Response> {
  if (isMockMode() && `${url || ""}`.startsWith("mock://")) {
    return fetchMockProtected(url);
  }
  return fetchApiProtected(url, options);
}

// 入口参数类型取自 reader 包公开签名，避免 any 掩盖适配契约。
type ReaderDataPortOptions = NonNullable<
  Parameters<typeof readerData.createReaderDataPort>[0]
>;
type ReaderSourcePdfOptions = NonNullable<
  Parameters<typeof readerData.resolveReaderSourcePdf>[1]
>;
type ReaderTranslatedPdfOptions = NonNullable<
  Parameters<typeof readerData.resolveReaderTranslatedPdfUrl>[2]
>;
type ReaderArtifactUrlOptions = NonNullable<
  Parameters<typeof readerData.resolveReaderArtifactUrl>[1]
>;
type BuildPdfDocumentOptions = NonNullable<
  Parameters<typeof readerData.buildPdfDocumentOptions>[0]
>;
type LoadPdfDocumentOptions = NonNullable<
  Parameters<typeof readerData.loadPdfDocument>[0]
>;

export const createReaderDataPort = (options: ReaderDataPortOptions = {}) =>
  readerData.createReaderDataPort({
    apiPrefix: API_PREFIX,
    loadJob: fetchJobPayload,
    loadManifest: fetchJobArtifactsManifest,
    loadMarkdown: fetchJobMarkdown,
    loadMarkdownSource: fetchJobMarkdownSource,
    fetchMarkdownRange: fetchJobMarkdownRange,
    loadRegions: fetchReaderRegions,
    loadMetadata: fetchReaderMetadata,
    loadTranslationItem: fetchTranslationItem,
    fetchProtectedResource: fetchProtected,
    ...options,
  });
export const defaultReaderDataPort = createReaderDataPort();

export const resolveReaderArtifactUrl = (
  item: Parameters<typeof readerData.resolveReaderArtifactUrl>[0],
  options: ReaderArtifactUrlOptions = {},
) => readerData.resolveReaderArtifactUrl(item, { resolveResourceUrl, ...options });
export const buildPdfDocumentOptions = (options: BuildPdfDocumentOptions = {}) =>
  readerData.buildPdfDocumentOptions({
    configPort: defaultReaderPdfDocumentConfigPort,
    resolvePdfjsVendorUrl,
    ...options,
  });
export const loadPdfDocument = (options: LoadPdfDocumentOptions = {}) =>
  readerData.loadPdfDocument({
    configPort: defaultReaderPdfDocumentConfigPort,
    resolveResourceUrl,
    resolvePdfjsVendorUrl,
    ...options,
  });
export const __resetPdfjsForTests = readerData.__resetPdfjsForTests;

export const resolveReaderJobId = readerData.resolveReaderJobId;
export const resolveReaderSourcePdf = (
  manifestPayload: Parameters<typeof readerData.resolveReaderSourcePdf>[0],
  options: ReaderSourcePdfOptions = {},
) =>
  readerData.resolveReaderSourcePdf(manifestPayload, {
    findReadyManifestArtifact,
    resolveManifestArtifactUrl: (payload, key) =>
      resolveManifestArtifactUrl(payload, key),
    ...options,
  });
export const resolveReaderTranslatedPdfUrl = (
  jobPayload: Parameters<typeof readerData.resolveReaderTranslatedPdfUrl>[0],
  manifestPayload: Parameters<typeof readerData.resolveReaderTranslatedPdfUrl>[1],
  options: ReaderTranslatedPdfOptions = {},
) => readerData.resolveReaderTranslatedPdfUrl(jobPayload, manifestPayload, {
  resolveJobActions,
  findReadyManifestArtifact,
  resolveReaderArtifactUrl,
  resolveResourceUrl,
  ...options,
});
