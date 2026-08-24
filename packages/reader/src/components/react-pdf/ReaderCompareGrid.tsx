import type { ReactElement } from "react";
import { PdfDocumentPane } from "../../pdf/PdfDocumentPane.js";
import type { ProtectedPdfFile } from "../../pdf/useProtectedPdfFile.js";
import type { PageRowHeights } from "../../pdf/usePageRowSync.js";
import {
  READER_SCROLL_SHELL_CLASS,
  READER_SCROLL_SHELL_ID,
} from "../../pdf/reader-dom-contract.js";
import type { ReaderMetadata, ReaderRegion } from "../../shared/data/reader-regions.js";

export type ReaderCompareGridProps = {
  mode: string; // ReaderMode
  bindShell: (node: HTMLDivElement | null) => void;
  shellEl: HTMLElement | null;
  userZoom: number;
  compareMode: boolean;
  /** 阅读区全宽（shell），用于 zoom% 相对整屏计算 */
  shellWidth: number;
  /** @deprecated 保留兼容，页宽不再用半栏 */
  compareColWidth?: number;
  rowHeights?: PageRowHeights;
  mountSource: boolean;
  mountTranslated: boolean;
  showSource: boolean;
  showTranslated: boolean;
  sourceOnly: boolean;
  sourceUrl: string;
  translatedUrl: string;
  sourceFile: ProtectedPdfFile | null;
  translatedFile: ProtectedPdfFile | null;
  onMetrics: () => void;
  onNumPagesChange: (pages: number, pane: "source" | "translated") => void;
  activeRegion?: ReaderRegion | null;
  readerMetadata?: ReaderMetadata | null;
  markdownSplit?: boolean;
  assistantSplit?: boolean;
};

export function resolveReaderGridPresentation({
  mode,
  compareMode,
  showSource,
  showTranslated,
  markdownSplit,
}: Pick<ReaderCompareGridProps, "mode" | "compareMode" | "showSource" | "showTranslated"> & {
  markdownSplit: boolean;
}) {
  const splitSourceCompare = markdownSplit && mode === "compare";
  return {
    mode: splitSourceCompare ? "source" : mode,
    compareMode: compareMode && !markdownSplit,
    showSource: splitSourceCompare ? true : showSource,
    showTranslated: splitSourceCompare ? false : showTranslated,
  };
}

export function resolveReaderPageWidthBasis(shellWidth: number, sidePanelSplit: boolean): number {
  return sidePanelSplit ? shellWidth * 2 : shellWidth;
}

export function ReaderCompareGrid(props: ReaderCompareGridProps): ReactElement {
  const {
    mode,
    bindShell,
    shellEl,
    userZoom,
    compareMode,
    shellWidth,
    rowHeights,
    mountSource,
    mountTranslated,
    showSource,
    showTranslated,
    sourceOnly,
    sourceUrl,
    translatedUrl,
    sourceFile,
    translatedFile,
    onMetrics,
    onNumPagesChange,
    activeRegion,
    readerMetadata,
    markdownSplit = false,
    assistantSplit = false,
  } = props;

  const presentation = resolveReaderGridPresentation({
    mode,
    compareMode,
    showSource,
    showTranslated,
    markdownSplit,
  });
  // zoom 的产品语义一直相对完整阅读器宽度：Markdown / AI 分栏后 shell
  // 只有半屏，因此用双倍基准保持 50% 恰好铺满左栏。
  const pageWidthBasis = resolveReaderPageWidthBasis(
    shellWidth,
    markdownSplit || assistantSplit,
  );

  return (
    <div
      ref={bindShell}
      id={READER_SCROLL_SHELL_ID}
      className={READER_SCROLL_SHELL_CLASS}
      data-reader-scroll-shell="true"
    >
      <main
        className={`reader-react-grid reader-mode-${presentation.mode}`}
        data-reader-mode={markdownSplit ? "markdown-split" : assistantSplit ? "assistant-split" : mode}
      >
        {mountSource ? (
          <PdfDocumentPane
            pane="source"
            url={sourceUrl}
            preloadedFile={sourceFile}
            userZoom={userZoom}
            visible={presentation.showSource}
            scrollRoot={shellEl}
            pageWidthOverride={pageWidthBasis}
            rowHeights={presentation.compareMode ? rowHeights : undefined}
            onMetrics={onMetrics}
            emptyLabel={
              sourceOnly
                ? "源文件不可用：该文档没有可读取的源 PDF。"
                : "暂无原文 PDF"
            }
            onNumPagesChange={onNumPagesChange}
            activeRegion={activeRegion}
            readerMetadata={readerMetadata}
          />
        ) : null}
        {mountTranslated ? (
          <PdfDocumentPane
            pane="translated"
            url={translatedUrl}
            preloadedFile={translatedFile}
            userZoom={userZoom}
            visible={presentation.showTranslated}
            scrollRoot={shellEl}
            pageWidthOverride={pageWidthBasis}
            rowHeights={presentation.compareMode ? rowHeights : undefined}
            onMetrics={onMetrics}
            emptyLabel="暂无译文 PDF"
            onNumPagesChange={onNumPagesChange}
            activeRegion={activeRegion}
            readerMetadata={readerMetadata}
          />
        ) : null}
      </main>
    </div>
  );
}
