// Library books API — standalone, wraps @retainpdf/schemas/library-books.v1
// No apps/web deps; apiPrefix/buildApiHeaders injected or default to /api/v1

const API_PREFIX = "/api/v1";

function buildApiEndpoint(apiPrefix: string, path: string) {
  const prefix = `${apiPrefix || API_PREFIX}`.replace(/\/+$/, "");
  const rel = `${path || ""}`.replace(/^\/+/, "");
  return `${prefix}/${rel}`;
}

function buildApiHeaders(headers: Record<string, string> = {}) {
  return { "Content-Type": "application/json", ...headers };
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
  const normalizedJobId = `${jobId || ""}`.trim().replace(/-ocr$/, "");
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
