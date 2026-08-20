// Jobs API — standalone, wraps job-status.v1
// No apps/web deps

const API_PREFIX = "/api/v1";

function buildJobsEndpoint(apiPrefix: string, jobId?: string) {
  const prefix = `${apiPrefix || API_PREFIX}`.replace(/\/+$/, "");
  return jobId ? `${prefix}/jobs/${encodeURIComponent(jobId)}` : `${prefix}/jobs`;
}

function buildApiHeaders(headers: Record<string, string> = {}) {
  return { "Content-Type": "application/json", ...headers };
}

function unwrapEnvelope<T>(envelope: any): T {
  if (envelope && typeof envelope === "object" && "data" in envelope) return envelope.data as T;
  return envelope as T;
}

export async function fetchJobPayload(apiPrefix: string, jobId: string) {
  const resp = await fetch(buildJobsEndpoint(apiPrefix, jobId), { headers: buildApiHeaders() });
  if (!resp.ok) throw new Error(`读取任务失败 (${resp.status})`);
  return unwrapEnvelope(await resp.json());
}

export async function fetchJobList(apiPrefix: string, { limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams({ limit: `${limit}`, offset: `${offset}` });
  const resp = await fetch(`${buildJobsEndpoint(apiPrefix)}?${params.toString()}`, { headers: buildApiHeaders() });
  if (!resp.ok) throw new Error(`读取任务列表失败 (${resp.status})`);
  return unwrapEnvelope(await resp.json());
}
