// 左栏：封面 + 对照/原版主操作。
// 元信息摘要（页数/大小/入库/合集）已迁到右栏简介 Tab 的信息网格
// （BookDetailOverviewTab）——左栏纯粹化，右栏不再空旷。

import { btn, IconCompare, IconEye } from "./ui.jsx";
import { BookCardProcessingOverlay } from "../../display/BookCardProcessingOverlay.jsx";

/**
 * @param {object} props
 * @param {string} props.coverUrl
 * @param {boolean} props.readerAvailable
 * @param {string} props.documentId
 * @param {string|boolean} props.busy
 * @param {boolean} [props.processing] 翻译/重试进行中：封面中央 loading
 * @param {() => void} props.onCompare
 * @param {() => void} props.onReadSource
 */
export function CoverActionsPanel({
  coverUrl,
  readerAvailable,
  documentId,
  busy,
  processing = false,
  onCompare,
  onReadSource,
}) {
  return (
    <div className="sticky top-0 space-y-4">
      <div
        className="relative mx-auto flex aspect-[3/4] w-full max-w-none items-center justify-center overflow-hidden rounded-[16px] border border-border/60 bg-gradient-to-br from-muted/80 to-muted/30 bg-cover bg-center shadow-[0_16px_36px_color-mix(in_srgb,var(--shadow-color)_16%,transparent)] sm:mx-0"
        style={coverUrl ? { backgroundImage: `url("${coverUrl}")` } : undefined}
        data-cover-processing={processing ? "true" : "false"}
      >
        {coverUrl ? null : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-paper/80 shadow-sm">
              <IconEye className="h-6 w-6" />
            </span>
            <span className="text-xs tracking-wide">无封面</span>
          </div>
        )}
        {processing ? <BookCardProcessingOverlay /> : null}
      </div>
      <div className="flex flex-col gap-2.5 pt-1">
        {readerAvailable ? (
          <button
            id="book-detail-compare-btn"
            className={btn("default", "w-full gap-1.5 py-2.5 text-sm")}
            disabled={Boolean(busy)}
            onClick={onCompare}
          >
            <IconCompare className="mr-0.5 h-4 w-4" />
            对照阅读
          </button>
        ) : null}
        <button
          id="book-detail-read-source-btn"
          className={btn(readerAvailable ? "outline" : "default", "w-full gap-1.5 py-2.5 text-sm bg-paper")}
          disabled={Boolean(busy) || !documentId}
          onClick={onReadSource}
        >
          <IconEye className="mr-0.5 h-4 w-4" />
          查看原版
        </button>
      </div>
    </div>
  );
}
