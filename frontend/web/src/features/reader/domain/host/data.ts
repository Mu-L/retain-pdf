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
import * as readerData from "@retainpdf/reader/runtime/data";
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
async function fetchJobMarkdownSource(jobId: string, apiPrefix?: string): Promise<any> {
  if (isMockMode()) {
    void jobId;
    void apiPrefix;
    const mock = getMockJobMarkdown() as any;
    const content = `${mock?.content || ""}`;
    if (!content) return null;
    return {
      rawUrl: `${mock?.raw_url || "mock://markdown.raw"}`,
      totalBytes: new TextEncoder().encode(content).byteLength,
      imagesBaseUrl: `${mock?.images_base_url || ""}`,
    };
  }
  const job = await fetchApiJobPayload(jobId, apiPrefix ? { apiPrefix } : undefined);
  const contract = resolveJobMarkdownContract(job as any);
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
): Promise<any> {
  if (isMockMode() && `${rawUrl || ""}`.startsWith("mock://")) {
    const bytes = new TextEncoder().encode(`${(getMockJobMarkdown() as any)?.content || ""}`);
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

export const createReaderDataPort = (options: any = {}) =>
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

export const resolveReaderArtifactUrl = (item: any, options: any = {}) =>
  readerData.resolveReaderArtifactUrl(item, { resolveResourceUrl, ...options });
export const buildPdfDocumentOptions = (options: any = {}) =>
  readerData.buildPdfDocumentOptions({
    configPort: defaultReaderPdfDocumentConfigPort,
    resolvePdfjsVendorUrl,
    ...options,
  });
export const loadPdfDocument = (options: any = {}) =>
  readerData.loadPdfDocument({
    configPort: defaultReaderPdfDocumentConfigPort,
    resolveResourceUrl,
    resolvePdfjsVendorUrl,
    ...options,
  });
export const __resetPdfjsForTests = readerData.__resetPdfjsForTests;

export const resolveReaderJobId = readerData.resolveReaderJobId;
export const resolveReaderSourcePdf = (manifestPayload: any, options: any = {}) =>
  readerData.resolveReaderSourcePdf(manifestPayload, {
    findReadyManifestArtifact,
    resolveManifestArtifactUrl: (payload: any, key: string) =>
      resolveManifestArtifactUrl(payload, key),
    ...options,
  });
export const resolveReaderTranslatedPdfUrl = (
  jobPayload: any,
  manifestPayload: any,
  options: any = {},
) => readerData.resolveReaderTranslatedPdfUrl(jobPayload, manifestPayload, {
  resolveJobActions,
  findReadyManifestArtifact,
  resolveReaderArtifactUrl,
  resolveResourceUrl,
  ...options,
});
