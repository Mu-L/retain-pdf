// 文档处理 Tab：OCR 与翻译是并列且状态独立的文档处理能力，
// 不再创建第二套详情弹窗或把请求逻辑塞回 BookDetailDialog。
// 视觉上两者合成一张「处理」卡：外层只做布局容器，内层两个
// data-processing-capability 区（ocr / translation）与全部 id、
// disabled 语义、回调原样保留。

import { BookTranslationWorkflowPanel } from "../panels/translate/WorkflowPanel.jsx";
import { OcrActionCard } from "../panels/processing/OcrActionCard.jsx";
import { ProcessingCapabilityHeader } from "../panels/processing/ProcessingCapabilityHeader.jsx";
import { documentJobPresentation, isDocumentJobActive } from "../use-document-jobs.js";
import { Languages } from "lucide-react";

function progressTextOf(source: any): string | null {
  const progress: any = source?.stage_snapshot?.progress || source?.progress || {};
  const current = Number(progress.current);
  const total = Number(progress.total);
  const percent = Number(progress.percent);
  const parts: string[] = [];
  if (Number.isFinite(current) && Number.isFinite(total) && total > 0) {
    parts.push(`${current}/${total}`);
  }
  const pct = Number.isFinite(percent)
    ? percent
    : Number.isFinite(current) && Number.isFinite(total) && total > 0
      ? (current / total) * 100
      : null;
  if (pct !== null && Number.isFinite(pct)) parts.push(`${Math.round(Math.max(0, Math.min(100, pct)))}%`);
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

export function BookDetailProcessingTab({ ocr, translation, loading = false, error = "" }: any) {
  return (
    <div
      className="book-detail-tab-processing"
      data-book-detail-tab="processing"
    >
      {error ? <p className="rounded-lg border border-foreground/20 bg-muted/40 px-3 py-2 text-xs text-foreground" role="alert">{error}</p> : null}
      {loading ? <p className="text-xs text-muted-foreground">正在读取文档任务…</p> : null}
      {/* 合二为一的视觉卡：只做布局，OcrActionCard 与翻译区原样透传。 */}
      <section className="book-detail-processing-card" data-processing-capability="processing" aria-label="处理">
        <p className="book-detail-processing-unified-status text-sm font-medium text-foreground" data-processing-unified-status="true">
          {unifiedHeadline(ocr, translation)}
        </p>
        <OcrActionCard {...ocr} />
      <section className="book-detail-processing-card" data-processing-capability="translation">
        <ProcessingCapabilityHeader
          icon={<Languages aria-hidden="true" />}
          title="翻译"
          description={translation.ocrReuse
            ? "复用已有 OCR，直接翻译并生成阅读产物"
            : "执行 OCR、翻译并生成阅读产物"}
          status={translation.status}
        />
        <BookTranslationWorkflowPanel {...translation} />
      </section>
      </section>
    </div>
  );
}
