// 文档处理 Tab。OCR 与翻译是并列且状态独立的文档处理能力，
// 不再创建第二套详情弹窗或把请求逻辑塞回 BookDetailDialog。

import { BookTranslationWorkflowPanel } from "../panels/translate/WorkflowPanel.jsx";
import { OcrActionCard } from "../panels/processing/OcrActionCard.jsx";
import { ProcessingCapabilityHeader } from "../panels/processing/ProcessingCapabilityHeader.jsx";
import { Languages } from "lucide-react";

export function BookDetailProcessingTab({ ocr, translation, loading = false, error = "" }: any) {
  return (
    <div
      className="book-detail-tab-processing"
      data-book-detail-tab="processing"
    >
      {error ? <p className="rounded-lg border border-foreground/20 bg-muted/40 px-3 py-2 text-xs text-foreground" role="alert">{error}</p> : null}
      {loading ? <p className="text-xs text-muted-foreground">正在读取文档任务…</p> : null}
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
    </div>
  );
}
