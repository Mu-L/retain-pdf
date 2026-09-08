import { API_PREFIX } from "@/platform/config/api-constants.js";
import {
  fetchJobArtifactsManifest,
  fetchJobMarkdown,
  fetchJobMarkdownDocument,
} from "@/platform/api/legacy/jobs-artifacts.js";
import {
  fetchJobDiagnostics,
  fetchResumePlan,
  rerunJob,
  resumeJob,
} from "@/platform/api/legacy/jobs-actions.js";
import {
  fetchJobEvents,
} from "@/platform/api/legacy/jobs-events.js";
import { fetchJobPayload } from "@/platform/api/index.js";
import { fetchProtected } from "@/platform/api/legacy/http.js";

export function createJobDetailDataPort({
  apiPrefix = API_PREFIX,
  loadJob = fetchJobPayload,
  loadManifest = fetchJobArtifactsManifest,
  loadDiagnostics = fetchJobDiagnostics,
  loadResumePlan = fetchResumePlan,
  loadMarkdownDocument = fetchJobMarkdownDocument,
  loadMarkdown = fetchJobMarkdown,
  loadEvents = fetchJobEvents,
  rerun = rerunJob,
  resume = resumeJob,
  fetchProtectedResource = fetchProtected,
} = {}) {
  async function loadOverview(jobId) {
    const [payloadRaw, manifestPayload, diagnosticsPayload, resumePlan] = await Promise.all([
      loadJob(jobId, { apiPrefix }),
      loadManifest(jobId, apiPrefix),
      loadDiagnostics(jobId, apiPrefix).catch(() => null),
      loadResumePlan(jobId, apiPrefix).catch(() => null),
    ]);
    return {
      diagnosticsPayload,
      manifestPayload,
      payloadRaw,
      resumePlan,
    };
  }

  async function loadMarkdownPayload(jobId) {
    return await loadMarkdownDocument(jobId, apiPrefix)
      || await loadMarkdown(jobId, apiPrefix);
  }

  return Object.freeze({
    apiPrefix,
    fetchJobEvents: loadEvents,
    fetchProtected: fetchProtectedResource,
    loadMarkdownPayload,
    loadOverview,
    rerunJob: rerun,
    resumeJob: resume,
  });
}

export const defaultJobDetailDataPort = createJobDetailDataPort();
