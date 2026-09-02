// 左栏：封面 + 文档身份 + 对照/原版主操作 + 阅读状态。
// 元信息摘要（页数/大小/入库/合集）已迁到右栏简介 Tab 的信息网格
// （BookDetailOverviewTab）——左栏纯粹化，右栏不再空旷。

import { btn, IconCompare, IconEye } from "./ui.jsx";
import { BookCardProcessingOverlay } from "../../display/BookCardProcessingOverlay.jsx";
import { BookOpen, CircleCheckBig, FileText, UserRound } from "lucide-react";
import type { ReactNode } from "react";

const READING_STATE = {
  unread: { label: "未读", filled: 0, Icon: BookOpen },
  reading: { label: "在读", filled: 1, Icon: BookOpen },
  done: { label: "读完", filled: 3, Icon: CircleCheckBig },
};

/**
 * @param {object} props
 * @param {string} props.coverUrl
 * @param {string} [props.title]
 * @param {string[]} [props.authors]
 * @param {string|number} [props.year]
 * @param {number} [props.pageCount]
 * @param {string} [props.readingStatus]
 * @param {boolean} props.readerAvailable
 * @param {string} [props.readerActionLabel] 真实 job 的主阅读动作文案
 * @param {string} props.documentId
 * @param {string|boolean} props.busy
 * @param {boolean} [props.processing] 翻译/重试进行中：封面中央 loading
 * @param {() => void} props.onCompare
 * @param {() => void} props.onReadSource
 * @param {ReactNode} [props.quickDownloadsSlot]
 */
export function CoverActionsPanel({
  coverUrl,
  title = "",
  authors = [],
  year,
  pageCount = 0,
  readingStatus = "unread",
  readerAvailable,
  readerActionLabel = "对照阅读",
  documentId,
  busy,
  processing = false,
  onCompare,
  onReadSource,
  quickDownloadsSlot,
}) {
  const compareReading = readerActionLabel === "对照阅读";
  const readingState = READING_STATE[readingStatus] || READING_STATE.unread;
  const ReadingStateIcon = readingState.Icon;
  const authorText = authors.length ? authors.join("、") : "未知作者";

  return (
    <div className="book-detail-cover-actions sticky top-0 space-y-4">
      <div
        className="book-detail-cover-preview relative mx-auto flex aspect-[3/4] w-full max-w-none items-center justify-center overflow-hidden rounded-[16px] border border-border/60 bg-gradient-to-br from-muted/80 to-muted/30 bg-cover bg-center shadow-[0_16px_36px_color-mix(in_srgb,var(--shadow-color)_16%,transparent)] sm:mx-0"
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
      <div className="book-detail-cover-identity">
        <h3 title={title}>{title || "未命名文档"}</h3>
        <p title={`${authorText}${year ? ` · ${year}` : ""}`}>
          <UserRound aria-hidden="true" />
          <span>{authorText}{year ? ` · ${year}` : ""}</span>
        </p>
      </div>
      <div className="book-detail-cover-buttons flex flex-col gap-2.5 pt-1">
        {readerAvailable ? (
          <button
            id={compareReading ? "book-detail-compare-btn" : "book-detail-ocr-btn"}
            className={btn("default", "w-full gap-1.5 py-2.5 text-sm")}
            disabled={Boolean(busy)}
            onClick={onCompare}
            aria-label={readerActionLabel}
          >
            {compareReading
              ? <IconCompare className="mr-0.5 h-4 w-4" />
              : <IconEye className="mr-0.5 h-4 w-4" />}
            {readerActionLabel}
          </button>
        ) : null}
        <button
          id="book-detail-read-source-btn"
          className={btn(
            readerAvailable ? "outline" : "default",
            `w-full gap-1.5 py-2.5 text-sm${readerAvailable ? " bg-paper" : ""}`,
          )}
          disabled={Boolean(busy) || !documentId}
          onClick={onReadSource}
        >
          <IconEye className="mr-0.5 h-4 w-4" />
          查看原版
        </button>
      </div>
      {quickDownloadsSlot}
      <section
        className="book-detail-left-reading-card"
        data-reading-status={readingStatus}
        aria-label={`阅读状态：${readingState.label}`}
      >
        <div className="book-detail-left-reading-head">
          <span><ReadingStateIcon aria-hidden="true" />阅读状态</span>
          <strong>{readingState.label}</strong>
        </div>
        <div className="book-detail-left-reading-track" aria-hidden="true">
          {[1, 2, 3].map((step) => (
            <span key={step} className={step <= readingState.filled ? "is-filled" : ""} />
          ))}
        </div>
        <p><FileText aria-hidden="true" />{pageCount ? `共 ${pageCount} 页` : "页数读取中"}</p>
      </section>
    </div>
  );
}
