import { cn } from "@/lib/utils";
import type { DocumentJobSummary } from "../../../types.js";
import { documentJobPresentation } from "../../use-document-jobs.js";

function progressOf(job?: DocumentJobSummary | null) {
  const progress: any = job?.stage_snapshot?.progress || job?.progress || {};
  const percent = Number(progress.percent);
  if (Number.isFinite(percent)) return Math.max(0, Math.min(100, percent));
  const current = Number(progress.current);
  const total = Number(progress.total);
  return Number.isFinite(current) && Number.isFinite(total) && total > 0
    ? Math.max(0, Math.min(100, (current / total) * 100))
    : null;
}

export function ProcessingJobSummary({
  job,
  idleText,
  id,
  labels,
}: {
  job?: DocumentJobSummary | null;
  idleText: string;
  id?: string;
  labels?: Partial<Record<"idle" | "active" | "done" | "failed", string>>;
}) {
  const state = documentJobPresentation(job, idleText);
  const stateLabel = labels?.[state.tone as "idle" | "active" | "done" | "failed"] || state.label;
  const snapshot: any = job?.stage_snapshot || {};
  const detail = `${snapshot.stage_detail || job?.stage_detail || ""}`.trim();
  const percent = progressOf(job);
  return (
    <div
      id={id}
      className="book-detail-processing-summary"
      data-job-id={job?.job_id || ""}
      data-job-status={job?.status || "idle"}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={cn(job && "book-detail-status", "text-xs font-medium text-foreground")}>
          {stateLabel}
        </span>
        {job?.job_id ? (
          <span className="max-w-44 truncate font-mono text-[10px] text-muted-foreground">
            {job.job_id}
          </span>
        ) : null}
      </div>
      {detail ? <p className="mt-1.5 text-xs text-muted-foreground">{detail}</p> : null}
      {percent !== null ? (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-foreground transition-[width]" style={{ width: `${percent}%` }} />
        </div>
      ) : null}
    </div>
  );
}
