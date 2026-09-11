import { isMockMode } from "@/platform/config/runtime.js";
import { getMockJobList, getMockJobPayload } from "@/platform/mock/index.js";
import {
  fetchJobList as _fetchJobList,
  fetchJobPayload as _fetchJobPayload,
} from "@retainpdf/api/jobs";

export const fetchJobPayload = async (jobId: string, options?: { apiPrefix?: string } | string): Promise<any> => {
  let normalizedJobId = jobId;
  let apiPrefix: string | undefined;
  if (typeof jobId === "string" && jobId.startsWith("/") && typeof options === "string" && options != null && !options.startsWith("/")) {
    console.warn("[deprecated] fetchJobPayload(apiPrefix, jobId) is deprecated, use fetchJobPayload(jobId, { apiPrefix })");
    apiPrefix = jobId;
    normalizedJobId = options;
  } else if (typeof options === "string") {
    console.warn("[deprecated] fetchJobPayload(jobId, apiPrefix) string form is deprecated, use fetchJobPayload(jobId, { apiPrefix })");
    apiPrefix = options;
  } else if (options && typeof options === "object") {
    apiPrefix = (options as { apiPrefix?: string }).apiPrefix;
  }
  if (isMockMode()) { void apiPrefix; return getMockJobPayload(normalizedJobId); }
  return (_fetchJobPayload as any)(normalizedJobId, apiPrefix ? { apiPrefix } : undefined);
};

export const fetchJobList = async (apiPrefix: string, opts: any = {}): Promise<any> => {
  if (isMockMode()) {
    const { limit = 20, offset = 0, q = "" } = opts || {};
    return getMockJobList({ limit, offset, q });
  }
  return (_fetchJobList as any)(apiPrefix, opts);
};
