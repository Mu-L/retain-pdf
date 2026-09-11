// 文档进度 Tab：一张「进度」卡，内含 OCR / 翻译两个卡内分段。
// 所有 id、disabled 语义、onX 回调原样透传；数字只读传入的 ocr/translation。

import { BookTranslationWorkflowPanel } from "../panels/translate/WorkflowPanel.jsx";
import { ProcessingPipelineRail } from "../panels/processing/ProcessingPipelineRail.jsx";
import { ProcessingJobSummary } from "../panels/processing/ProcessingJobSummary.jsx";
import { btn } from "../panels/ui.jsx";
import { documentJobPresentation, isDocumentJobActive } from "../use-document-jobs.js";
import { countFromProgress, percentFromProgress } from "../../domain/progress-value.js";
import { Languages, LoaderCircle, Square } from "lucide-react";

function progressOf(source: any): { current?: number; total?: number; percent: number | null } {
  const progress: any = source?.stage_snapshot?.progress || source?.progress || {};
  const percent = percentFromProgress(progress);
  const count = countFromProgress(progress);
  return count ? { current: count.current, total: count.total, percent } : { percent };
}

function progressTextOf(source: any): string | null {
  const { current, total, percent } = progressOf(source);
  const parts: string[] = [];
  if (current !== undefined && total !== undefined) parts.push(`${current}/${total}`);
  if (percent !== null) parts.push(`${Math.round(percent)}%`);
  return parts.length ? parts.join(" · ") : null;
}

/** 顶部一行状态：只读传入的真实任务数据，不编假数；OCR 活跃优先，否则跟翻译。 */
function unifiedHeadline(ocr: any, translation: any): string {
  if (ocr && isDocumentJobActive(ocr.job)) {
    const presentation = documentJobPresentation(ocr.job, "OCR 处理中");
    const progress = progressTextOf(ocr.job);
    return progress ? `OCR 处理中 · ${progress}` : `${presentation.label || "OCR 处理中"}`;
  }
  if (translation?.isActive) {
    const progress = progressTextOf(translation.item);
    return progress ? `翻译中 · ${progress}` : "翻译中";
  }
  return `${translation?.status?.label || "未翻译"}`;
}

/** 统一进度条：OCR 活跃跟 OCR，否则跟翻译；无真实数字时不渲染。 */
function unifiedPercentOf(ocr: any, translation: any): number | null {
  if (ocr && isDocumentJobActive(ocr.job)) return progressOf(ocr.job).percent;
  return progressOf(translation?.item).percent;
}

function ScanIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14" aria-hidden="true">
      <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 12h8M8 15h6" />
    </svg>
  );
}

export function BookDetailProcessingTab({ ocr, translation, loading = false, error = "" }: any) {
  const ocrJob = ocr?.job ?? null;
  const ocrActive = isDocumentJobActive(ocrJob);
  const ocrStatus = documentJobPresentation(ocrJob, "尚未执行");
  const ocrStatusLabel = ocrStatus.tone === "active"
    ? "处理中"
    : ocrStatus.tone === "done"
      ? "已完成"
      : ocrStatus.tone === "failed"
        ? "失败"
        : "未执行";
  const ocrShowDetail = ocrActive || ocrStatus.tone === "failed";
  const ocrConfigurable = !ocrActive && !ocr?.pending;
  const unifiedPercent = unifiedPercentOf(ocr, translation);

  const translationItem = translation?.item || {};
  const translationJobId = `${translationItem.job_id || translationItem.active_job_id || ""}`.trim();
  const hasTranslationJob = Boolean(translationJobId) && !translationJobId.startsWith("doc:");
  const translationDescription = translation.ocrReuse
    ? "复用已有 OCR，直接翻译并生成阅读产物"
    : "执行 OCR、翻译并生成阅读产物";
  // 翻译运行中不允许再单独发起 OCR：派生出的 OCR 状态此时是 succeeded，
  // 会让按钮显示成可点的「重新 OCR」，点下去会并发一个竞争任务。
  const translationActive = Boolean(translation?.isActive);
  const ocrBlockedByTranslation = translationActive && !ocrActive;
  // 只有真实的 OCR 任务才可取消：从翻译任务派生的合成 OCR(ocr_status_derived)
  // job_id 其实指向翻译任务，取消它会打错接口。
  const ocrJobId = `${ocrJob?.job_id || ocrJob?.id || ""}`.trim();
  const ocrJobIsReal = Boolean(ocrJobId) && !ocrJob?.ocr_status_derived && !ocrJobId.startsWith("doc:");
  const ocrCancelable = ocrActive && ocrJobIsReal && !translationActive;
  // OCR 动作与「翻译整本」同排，避免出现两行能力按钮。
  const ocrAction = (
    <>
      <button
        id="book-detail-start-ocr-btn"
        type="button"
        className={btn("outline")}
        disabled={Boolean(ocr?.pending) || ocrActive || ocrBlockedByTranslation || Boolean(translation?.busy)}
        title={ocrBlockedByTranslation ? "翻译进行中，暂不能单独执行 OCR" : undefined}
        onClick={ocr?.onOcr}
      >
        <ScanIcon />
        <span className="ml-1.5">{ocr?.pending ? "提交中…" : ocrActive ? "OCR 处理中" : ocrJob ? "重新 OCR" : "开始 OCR"}</span>
      </button>
      {ocrCancelable ? (
        <button
          id="book-detail-cancel-ocr-btn"
          type="button"
          className={btn("outline")}
          disabled={Boolean(ocr?.cancelling)}
          onClick={() => ocr?.onCancel?.(ocrJobId)}
        >
          {ocr?.cancelling ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> : <Square className="size-3.5" aria-hidden="true" />}
          <span className="ml-1.5">{ocr?.cancelling ? "取消中…" : "取消任务"}</span>
        </button>
      ) : null}
    </>
  );

  return (
    <div
      className="book-detail-tab-processing"
      data-book-detail-tab="processing"
    >
      {error ? <p className="rounded-lg border border-foreground/20 bg-muted/40 px-3 py-2 text-xs text-foreground" role="alert">{error}</p> : null}
      {loading ? <p className="text-xs text-muted-foreground">正在读取文档任务…</p> : null}
      {/* 全卡唯一 .book-detail-processing-card：OCR / 翻译收敛成同一条流水线。 */}
      <section className="book-detail-processing-card" data-processing-capability="processing" aria-label="处理">
        <header className="book-detail-processing-head">
          <span className="book-detail-processing-head-icon" aria-hidden="true">
            <Languages />
          </span>
          <div className="book-detail-processing-head-copy">
            <h3>处理</h3>
            <p className="book-detail-processing-unified-status" data-processing-unified-status="true">
              {unifiedHeadline(ocr, translation)}
            </p>
          </div>
        </header>

        {unifiedPercent !== null ? (
          <div className="book-detail-processing-progress overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <div className="h-full rounded-full bg-foreground transition-[width]" style={{ width: `${unifiedPercent}%` }} />
          </div>
        ) : null}

        {/* 唯一轨道：OCR 是流水线第一站，不再是与翻译并列的能力标题。 */}
        <ProcessingPipelineRail
          item={translationItem}
          hasTranslationJob={hasTranslationJob}
          ocrStatus={{ ...ocrStatus, label: ocrStatusLabel }}
          translationStatus={translation.status}
          translationDescription={translationDescription}
        />

        {/* OCR 细化：只保留当前阶段的进度/错误；动作已并入翻译行动行。 */}
        <div className="book-detail-processing-segment" data-processing-region="ocr">
          {ocrShowDetail ? (
            <ProcessingJobSummary
              job={ocrJob}
              idleText="尚未执行 OCR"
              id="book-detail-ocr-progress"
              labels={{ active: "OCR 处理中", done: "OCR 完成", failed: "OCR 失败" }}
              subject="OCR"
            />
          ) : (
            <span id="book-detail-ocr-progress" className="sr-only" data-job-status={ocrJob?.status || "idle"} aria-hidden="true" />
          )}
          {ocr?.error ? <p className="rounded-md border border-foreground/20 bg-muted/40 px-3 py-2 text-xs text-foreground" role="alert">{ocr.error}</p> : null}
          {ocrConfigurable ? (
            <div className="book-detail-ocr-range">
              <label className="book-detail-ocr-range-toggle">
                <input
                  type="checkbox"
                  checked={Boolean(ocr?.rangeOn)}
                  onChange={(event) => ocr?.onRangeOnChange?.(event.target.checked)}
                />
                OCR 指定页码
              </label>
              {ocr?.rangeOn ? (
                <div className="book-detail-ocr-range-inputs">
                  <input
                    aria-label="OCR 起始页"
                    type="number"
                    min="1"
                    value={ocr?.startPage ?? ""}
                    onChange={(event) => ocr?.onStartPageChange?.(event.target.value)}
                    className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm"
                  />
                  <span className="text-xs text-muted-foreground">–</span>
                  <input
                    aria-label="OCR 结束页"
                    type="number"
                    min="1"
                    value={ocr?.endPage ?? ""}
                    onChange={(event) => ocr?.onEndPageChange?.(event.target.value)}
                    className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm"
                  />
                  <span className="text-[11px] text-muted-foreground">/ {ocr?.pageCount || "?"} 页</span>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* 翻译细化：状态卡/阶段动作/选项/发起表单由 WorkflowPanel 承载（轨道已展示阶段）。
            唯一的行动行：OCR 按钮与「翻译整本 / 继续翻译」同排。 */}
        <div className="book-detail-processing-segment" data-processing-region="translation">
          <BookTranslationWorkflowPanel
            {...translation}
            ocrActionSlot={ocrAction}
          />
        </div>
      </section>
    </div>
  );
}
