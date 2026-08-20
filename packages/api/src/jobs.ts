// Jobs API — standalone, wraps job-status.v1
// No apps/web deps; browser-aware (reads window.__FRONT_RUNTIME_CONFIG__ for apiBase / X-API-Key if present).

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
function buildJobsEndpoint(apiPrefix: string | undefined, scope = "jobs"): string {
  return buildApiUrl(apiPrefix, scope === "ocr" ? "ocr/jobs" : "jobs");
}
function buildJobDetailEndpoint(jobId: string, apiPrefix: string | undefined): string {
  return `${buildJobsEndpoint(apiPrefix, "jobs")}/${encodeURIComponent(jobId)}`;
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

// Support both (jobId, apiPrefix) [web order] and (apiPrefix, jobId) [api package doc order] via runtime detection.
function normalizeJobPayloadArgs(a: string, b?: string): { jobId: string; apiPrefix: string | undefined } {
  if (a != null && typeof a === "string" && a.startsWith("/") && b != null && typeof b === "string" && !b.startsWith("/")) {
    return { apiPrefix: a, jobId: b };
  }
  return { jobId: a, apiPrefix: b };
}

export async function fetchJobPayload(jobId: string, apiPrefix?: string): Promise<any>;
export async function fetchJobPayload(apiPrefix: string, jobId: string): Promise<any>;
export async function fetchJobPayload(a: string, b?: string): Promise<any> {
  const { jobId, apiPrefix } = normalizeJobPayloadArgs(a, b);
  const normalizedJobId = `${jobId || ""}`.trim();
  if (!normalizedJobId) throw new Error("读取任务失败: 缺少 job_id");
  const resp = await fetch(buildJobDetailEndpoint(normalizedJobId, apiPrefix), { headers: buildApiHeaders() });
  if (!resp.ok) {
    if (resp.status === 404) throw new Error("未找到该任务，请检查 job_id 是否正确。");
    throw new Error(`读取任务失败，请稍后重试。(${resp.status})`);
  }
  return unwrapEnvelope(await resp.json());
}

export async function fetchJobList(
  apiPrefix: string = API_PREFIX,
  {
    limit = 20,
    offset = 0,
    status = "",
    workflow = "",
    provider = "",
    scope = "jobs",
    q = "",
  }: {
    limit?: number;
    offset?: number;
    status?: string;
    workflow?: string;
    provider?: string;
    scope?: string;
    q?: string;
  } = {},
): Promise<any> {
  const params = new URLSearchParams();
  params.set("limit", `${limit}`);
  params.set("offset", `${offset}`);
  if (status) params.set("status", status);
  if (workflow) params.set("workflow", workflow);
  if (provider) params.set("provider", provider);
  if (`${q || ""}`.trim()) params.set("q", `${q || ""}`.trim());
  const endpoint = buildJobsEndpoint(apiPrefix, scope);
  const resp = await fetch(`${endpoint}?${params.toString()}`, { headers: buildApiHeaders() });
  if (!resp.ok) throw new Error(`读取最近任务失败，请稍后重试。(${resp.status})`);
  return unwrapEnvelope(await resp.json());
}
