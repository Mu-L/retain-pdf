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
  onOpenLiveReader?: (jobId: string) => void;
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
  onOpenLiveReader,
  onRetryStage,
}: BookTranslationWorkflowPanelProps) {
  const jobId = `${item.job_id || item.active_job_id || ""}`.trim();
  const hasRealJob = Boolean(jobId) && !jobId.startsWith("doc:");
  const showCompactProcess = hasRealJob && !isActive;
  // 提交中（busy==="translate"）或阶段重试待定：job 回执尚未落袋，
  // 状态区先行占位，进度一到即在区内展开，不闪现、不另弹工作流窗。
  const submitting = busy === "translate" || Boolean(stageActionPending);
  const showStatus = isActive || status.tone === "failed" || submitting;
  // 次级重试动作：进度区下方右对齐（TranslationStageActions 内部 justify-end），
  // 黑主按钮只留进度区内的「查看实时译文」，此处两颗均为 btn("outline")。
  const stageActionsNode =
    hasRealJob && !isActive ? (
      <TranslationStageActions
        actions={stageActions}
        loading={stageActionsLoading}
        pendingStage={stageActionPending}
        error={stageActionError}
        onRetry={onRetryStage}
      />
    ) : null;

  return (
    <div
      className="book-translation-workflow space-y-3"
      data-book-translation-workflow="true"
    >
      {/* 取消任务只降视觉为文字链：作用域样式覆盖，不动 StatusCardEmbedded 事件/回调/disabled。 */}
      <style>{`#book-detail-status-section .bd-job-status-btn-cancel{border-color:transparent;background:transparent;box-shadow:none;padding-left:4px;padding-right:4px;text-decoration:underline;text-underline-offset:2px}#book-detail-status-section .bd-job-status-btn-cancel:hover:not(:disabled){background:transparent;color:inherit}#book-detail-status-section .bd-job-status-btn-primary{background:transparent;color:var(--ink)}`}</style>
      {/* 阶段路标直接复用紧凑过程条（OCR→翻译→渲染→完成），不重写。 */}
      {showCompactProcess ? <TranslationProcessOverview item={item} /> : null}

      {showStatus ? (
        <section
          id="book-detail-status-section"
          className="book-translation-status-panel"
          aria-label="任务进度"
        >
          <BookTranslateProgressPanel
            item={item}
            active={tabActive}
            dialogOpen={dialogOpen}
            onOpenLiveReader={isActive ? onOpenLiveReader : undefined}
          />
          {stageActionsNode}
        </section>
      ) : (
        stageActionsNode
      )}

      {/* 以下只动布局：发起表单收进默认收起的「选项」折叠，提交/重试 props 与回调原样透传。 */}
      {canTranslate ? (
        <details className="book-translate-options rounded-lg border border-border/70 bg-background px-3 py-2">
          <summary className="cursor-pointer select-none text-xs font-medium text-foreground">
            选项（页码 / OCR 复用 / 高级）
          </summary>
          <div className="pt-2">
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
          </div>
        </details>
      ) : (
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
      )}
      {isActive ? (
        <p className="text-[11px] text-muted-foreground">实时译文随 OCR 逐页可见，无需等待全部完成。</p>
      ) : null}
    </div>
  );
}
