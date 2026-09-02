import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  JobRetryStage,
  JobStageActionsView,
  JobStageRetryActionView,
} from "../../../composition/external/api.js";
import type { DocumentJobSummary } from "../types.js";
import { isDocumentJobActive } from "./use-document-jobs.js";

const stageActionsCache = new Map<string, JobStageActionsView>();

function jobIdOf(job?: DocumentJobSummary | null) {
  const id = `${job?.job_id || job?.id || ""}`.trim();
  return id.startsWith("doc:") ? "" : id;
}

export function useBookDetailStageActions({
  open,
  job,
  actions,
  onJobSubmitted,
  refreshKey = "",
}: {
  open: boolean;
  job?: DocumentJobSummary | null;
  actions: {
    getJobStageActions?: (jobId: string) => Promise<unknown>;
    retryJobStage?: (
      jobId: string,
      stage: JobRetryStage,
      payload?: Record<string, unknown>,
    ) => Promise<any>;
  };
  onJobSubmitted?: (job: Partial<DocumentJobSummary>) => unknown;
  /** OCR/document authority changed while the translation job stayed the same. */
  refreshKey?: string;
}) {
  const jobId = jobIdOf(job);
  const [view, setView] = useState<JobStageActionsView | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingStage, setPendingStage] = useState<JobRetryStage | "">("");
  const [error, setError] = useState("");
  const [resolvedJobId, setResolvedJobId] = useState("");
  const requestRef = useRef(0);
  const active = isDocumentJobActive(job);
  const eligible = Boolean(open && jobId && !active && actions.getJobStageActions);

  const refresh = useCallback(async () => {
    if (!eligible || !actions.getJobStageActions) {
      setView(null);
      setLoading(false);
      return null;
    }
    const request = ++requestRef.current;
    setLoading(true);
    try {
      const result = await actions.getJobStageActions(jobId) as JobStageActionsView | null;
      if (request === requestRef.current) {
        const next = result && Array.isArray(result.stages) ? result : null;
        if (next) stageActionsCache.set(jobId, next);
        setView(next);
        setResolvedJobId(jobId);
        setError("");
      }
      return result;
    } catch (cause) {
      if (request === requestRef.current) {
        setView(null);
        setResolvedJobId(jobId);
        setError(`${(cause as Error)?.message || cause || "读取重新处理能力失败"}`);
      }
      return null;
    } finally {
      if (request === requestRef.current) setLoading(false);
    }
  }, [actions, eligible, jobId]);

  useEffect(() => {
    setView(stageActionsCache.get(jobId) || null);
    setError("");
    setPendingStage("");
    void refresh();
    return () => {
      requestRef.current += 1;
    };
  }, [refresh, refreshKey]);

  const currentView = view?.job_id === jobId ? view : stageActionsCache.get(jobId) || null;
  const stageActions = useMemo(() => {
    const supported = new Set(["translation", "render"]);
    return (currentView?.stages || []).filter(
      (action): action is JobStageRetryActionView => supported.has(`${action?.stage || ""}`),
    );
  }, [currentView]);
  const effectiveLoading = eligible && !currentView && resolvedJobId !== jobId
    ? true
    : loading;

  const retry = useCallback(async (
    stage: JobRetryStage,
    { acceptDuplicateRisk = false } = {},
  ) => {
    const descriptor = stageActions.find((action) => action.stage === stage);
    if (!descriptor?.can_retry || !actions.retryJobStage || pendingStage) return null;
    setPendingStage(stage);
    setError("");
    try {
      const result = await actions.retryJobStage(jobId, stage, {
        ...(descriptor.action?.body || {}),
        ...(acceptDuplicateRisk
          ? { ambiguous_request_policy: "accept_duplicate_risk" }
          : {}),
        document_id: `${job?.document_id || ""}`.trim(),
      });
      if (result) {
        onJobSubmitted?.({
          ...result,
          document_id: result.document_id || job?.document_id,
          workflow: result.workflow || (stage === "render" ? "render" : "book"),
        });
      }
      return result;
    } catch (cause) {
      setError(`${(cause as Error)?.message || cause || "重新处理失败"}`);
      throw cause;
    } finally {
      setPendingStage("");
    }
  }, [actions, job, jobId, onJobSubmitted, pendingStage, stageActions]);

  return {
    stageActions,
    loading: effectiveLoading,
    pendingStage,
    error,
    retry,
    refresh,
  };
}
