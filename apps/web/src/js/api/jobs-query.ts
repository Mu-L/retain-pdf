import { buildApiHeaders, isMockMode } from "../config/runtime.js";
import { unwrapEnvelope } from "@retainpdf/domain/job";
import {
  getMockJobList,
  getMockJobPayload,
} from "../mock/index.js";
import { buildJobDetailEndpoint, buildJobsEndpoint } from "./http.js";

export async function fetchJobPayload(jobId, options) {
  let apiPrefix;
  let normalizedJobId = jobId;
  if (
    typeof jobId === "string" &&
    jobId.startsWith("/") &&
    typeof options === "string" &&
    options != null &&
    !options.startsWith("/")
  ) {
    console.warn("[deprecated] fetchJobPayload(apiPrefix, jobId) is deprecated, use fetchJobPayload(jobId, { apiPrefix })");
    apiPrefix = jobId;
    normalizedJobId = options;
  } else if (typeof options === "string") {
    if (options !== undefined) {
      console.warn("[deprecated] fetchJobPayload(jobId, apiPrefix) string form is deprecated, use fetchJobPayload(jobId, { apiPrefix })");
    }
    apiPrefix = options;
  } else if (options && typeof options === "object") {
    apiPrefix = options.apiPrefix;
  }
  if (isMockMode()) {
    void apiPrefix;
    return getMockJobPayload(normalizedJobId);
  }
  const resp = await fetch(buildJobDetailEndpoint(normalizedJobId, apiPrefix), {
    headers: buildApiHeaders(),
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      throw new Error("未找到该任务，请检查 job_id 是否正确。");
    }
    throw new Error(`读取任务失败，请稍后重试。(${resp.status})`);
  }
  return unwrapEnvelope(await resp.json());
}

export async function fetchJobList(
  apiPrefix,
  {
    limit = 20,
    offset = 0,
    status = "",
    workflow = "",
    provider = "",
    scope = "jobs",
    q = "",
  } = {},
) {
  if (isMockMode()) {
    void apiPrefix;
    return getMockJobList();
  }
  const params = new URLSearchParams();
  params.set("limit", `${limit}`);
  params.set("offset", `${offset}`);
  if (status) {
    params.set("status", status);
  }
  if (workflow) {
    params.set("workflow", workflow);
  }
  if (provider) {
    params.set("provider", provider);
  }
  if (`${q || ""}`.trim()) {
    params.set("q", `${q || ""}`.trim());
  }
  const resp = await fetch(`${buildJobsEndpoint(apiPrefix, scope)}?${params.toString()}`, {
    headers: buildApiHeaders(),
  });
  if (!resp.ok) {
    throw new Error(`读取最近任务失败，请稍后重试。(${resp.status})`);
  }
  return unwrapEnvelope(await resp.json());
}
