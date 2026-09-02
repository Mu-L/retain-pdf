// 书籍详情「翻译」Tab 的工作流主面板。
//
// 从 TranslationWorkflowDialog 的内容区迁移而来：
//   - 弹窗里：#status-section + StatusCardMain（#job-status-card）
//   - 本 Tab：#book-detail-status-section + StatusCardEmbedded（#book-detail-job-status-card）
//
// 书已在馆：不需要 WorkflowPanel 上传表单；发起翻译用 BookTranslateLaunchForm。
// 进度主场永远在本面板，绝不打开 #translation-workflow-dialog。

import { BookTranslateProgressPanel } from "./TranslateProgress.jsx";
import { BookTranslateLaunchForm } from "./TranslateForm.jsx";
import { TranslationProcessOverview } from "./TranslationProcessOverview.jsx";
import { TranslationStageActions } from "./TranslationStageActions.jsx";
import type { LibraryCardItem } from "../../../types.js";
import type { JobRetryStage, JobStageRetryActionView } from "../../../../../composition/external/api.js";

export type BookTranslationWorkflowPanelProps = {
  item?: LibraryCardItem;
  status: { label: string; tone: string };
  canTranslate: boolean;
  readerAvailable?: boolean;
  isActive?: boolean;
  tabActive?: boolean;
  dialogOpen?: boolean;
  rangeOn: boolean;
  startPage: string | number;
  endPage: string | number;
  pageCount?: number;
  busy?: string;
  error?: string;
  stageActions?: JobStageRetryActionView[];
  stageActionsLoading?: boolean;
  stageActionPending?: JobRetryStage | "";
  stageActionError?: string;
  ocrReuse?: { jobId: string } | null;
  onRangeOnChange: (value: boolean) => void;
  onStartPageChange: (value: string) => void;
  onEndPageChange: (value: string) => void;
  onTranslate: () => void;
  onRetryStage: (
    stage: JobRetryStage,
    options?: { acceptDuplicateRisk?: boolean },
  ) => Promise<unknown>;
};

/**
 * 对应旧弹窗 translation-workflow-shell 中的 status + 动作区，
 * 布局适配详情右栏 Tab。
 */
export function BookTranslationWorkflowPanel({
  item = {},
  status,
  canTranslate,
  readerAvailable = false,
  isActive = false,
  tabActive = true,
  dialogOpen = true,
  rangeOn,
  startPage,
  endPage,
  pageCount,
  busy = "",
  error = "",
  stageActions = [],
  stageActionsLoading = false,
  stageActionPending = "",
  stageActionError = "",
  ocrReuse = null,
  onRangeOnChange,
  onStartPageChange,
  onEndPageChange,
  onTranslate,
  onRetryStage,
}: BookTranslationWorkflowPanelProps) {
  const jobId = `${item.job_id || item.active_job_id || ""}`.trim();
  const hasRealJob = Boolean(jobId) && !jobId.startsWith("doc:");
  const showCompactProcess = hasRealJob && !isActive;

  return (
    <div
      className="book-translation-workflow space-y-3"
      data-book-translation-workflow="true"
    >
      {showCompactProcess ? <TranslationProcessOverview item={item} /> : null}

      {isActive || status.tone === "failed" ? (
        <section
          id="book-detail-status-section"
          className="book-translation-status-panel"
          aria-label="任务进度"
        >
          <BookTranslateProgressPanel
            item={item}
            active={tabActive}
            dialogOpen={dialogOpen}
          />
        </section>
      ) : null}

      <BookTranslateLaunchForm
        canTranslate={canTranslate}
        readerAvailable={readerAvailable}
        isActive={isActive}
        statusTone={status.tone}
        rangeOn={rangeOn}
        startPage={startPage}
        endPage={endPage}
        pageCount={pageCount}
        busy={busy}
        error={error}
        ocrReuse={ocrReuse}
        onRangeOnChange={onRangeOnChange}
        onStartPageChange={onStartPageChange}
        onEndPageChange={onEndPageChange}
        onTranslate={onTranslate}
      />

      {hasRealJob && !isActive ? (
        <TranslationStageActions
          actions={stageActions}
          loading={stageActionsLoading}
          pendingStage={stageActionPending}
          error={stageActionError}
          onRetry={onRetryStage}
        />
      ) : null}
    </div>
  );
}
