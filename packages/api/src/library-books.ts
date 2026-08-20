// Library books API — standalone, wraps @retainpdf/schemas/library-books.v1
// No apps/web deps; browser-aware (reads window.__FRONT_RUNTIME_CONFIG__ for apiBase / X-API-Key if present).

import { stripOcrSuffix } from "./utils/strip-ocr.js";

const API_PREFIX = "/api/v1";
const API_V1_SUFFIX = "/api/v1";
const DEFAULT_FALLBACK_BASE = "http://127.0.0.1:41000";
const DEFAULT_FALLBACK_PORT = 41000;

function getRuntimeConfig(): any {
  if (typeof window !== "undefined" && (window as any).__FRONT_RUNTIME_CONFIG__) return (window as any).__FRONT_RUNTIME_CONFIG__;
  return {};
}
function isFileProtocol(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.protocol === "file:";
}
function apiBase(): string {
  const cfg = getRuntimeConfig();
  if (typeof cfg.apiBase === "string" && cfg.apiBase.trim()) {
    return cfg.apiBase.trim().replace(/\/+$/, "").replace(new RegExp(`${API_V1_SUFFIX}$`), "");
  }
  if (typeof window === "undefined") return DEFAULT_FALLBACK_BASE;
  if (!isFileProtocol() && window.location.protocol === "https:") return window.location.origin;
  const host = window.location.hostname || "127.0.0.1";
  const protocol = window.location.protocol === "https:" ? "https:" : "http:";
  return `${protocol}//${host}:${DEFAULT_FALLBACK_PORT}`;
}
function buildApiUrl(apiPrefix: string | undefined, relativePath: string): string {
  const normalizedPrefix = `${apiPrefix || ""}`.trim().replace(/^\/+/, "").replace(/\/+$/, "");
  const normalizedPath = `${relativePath || ""}`.trim().replace(/^\/+/, "");
  const segments = [apiBase(), normalizedPrefix].filter(Boolean) as string[];
  if (normalizedPath) segments.push(normalizedPath);
  return segments.join("/");
}
function buildApiEndpoint(apiPrefix: string | undefined, path: string): string {
  return buildApiUrl(apiPrefix, path);
}
function frontendApiKey(): string {
  const cfg = getRuntimeConfig();
  const fromModule = typeof cfg.xApiKey === "string" ? cfg.xApiKey.trim() : "";
  if (fromModule) return fromModule;
  if (typeof window !== "undefined") {
    const live = (window as any).__FRONT_RUNTIME_CONFIG__?.xApiKey;
    return typeof live === "string" ? live.trim() : "";
  }
  return "";
}
function buildApiHeaders(headers: Record<string, string> = {}): Record<string, string> {
  const out: Record<string, string> = { ...headers };
  const apiKey = frontendApiKey();
  if (apiKey) out["X-API-Key"] = apiKey;
  return out;
}
function unwrapEnvelope<T>(envelope: any): T {
  if (envelope && typeof envelope === "object" && "data" in envelope) return envelope.data as T;
  return envelope as T;
}

export async function fetchLibraryBookList(
  apiPrefix: string,
  { limit = 40, offset = 0, q = "", jobIds = [] as string[] } = {},
) {
  const params = new URLSearchParams();
  params.set("limit", `${limit}`);
  params.set("offset", `${offset}`);
  if (`${q || ""}`.trim()) params.set("q", `${q || ""}`.trim());
  if (Array.isArray(jobIds) && jobIds.length) {
    params.set("job_ids", jobIds.map((id) => `${id}`.trim()).filter(Boolean).join(","));
  }
  const resp = await fetch(`${buildApiEndpoint(apiPrefix, "library/books")}?${params.toString()}`, {
    headers: buildApiHeaders(),
  });
  if (!resp.ok) throw new Error(`读取图书馆失败，请稍后重试。(${resp.status})`);
  return unwrapEnvelope(await resp.json());
}

export async function deleteLibraryBook(apiPrefix: string, jobId: string, { force = false } = {}) {
  const normalizedJobId = stripOcrSuffix(`${jobId || ""}`);
  if (!normalizedJobId) throw new Error("删除失败: 缺少 job_id");
  const params = force ? "?force=true" : "";
  const resp = await fetch(
    `${buildApiEndpoint(apiPrefix, `library/books/${encodeURIComponent(normalizedJobId)}`)}${params}`,
    { method: "DELETE", headers: buildApiHeaders() },
  );
  if (!resp.ok) {
    const envelope: any = await resp.json().catch(() => null);
    const error = new Error(`${envelope?.message || "删除任务失败，请稍后重试。"}(${resp.status})`) as Error & { status?: number };
    error.status = resp.status;
    throw error;
  }
  return unwrapEnvelope(await resp.json());
}
