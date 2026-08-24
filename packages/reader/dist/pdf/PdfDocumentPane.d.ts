import { type ProtectedPdfFile } from "./useProtectedPdfFile.js";
import type { PageRowHeights } from "./usePageRowSync.js";
import { type ReaderPaneId } from "./reader-dom-contract.js";
import { type ReaderMetadata, type ReaderRegion } from "../shared/data/reader-regions.js";
export type PdfDocumentPaneProps = {
    pane: ReaderPaneId;
    url?: string;
    preloadedFile?: ProtectedPdfFile | null;
    userZoom?: number;
    visible?: boolean;
    emptyLabel?: string;
    scrollRoot?: HTMLElement | null;
    /**
     * 阅读区全宽（shell clientWidth）。
     * 页绘制宽 = pageWidthFromShell(此值, userZoom)，不随单栏/半栏变化。
     */
    pageWidthOverride?: number | null;
    /** 对照行高同步 */
    rowHeights?: PageRowHeights;
    onMetrics?: () => void;
    onLoadSuccess?: (info: {
        numPages: number;
        pane: ReaderPaneId;
    }) => void;
    onLoadError?: (error: Error, pane: ReaderPaneId) => void;
    onNumPagesChange?: (numPages: number, pane: ReaderPaneId) => void;
    activeRegion?: ReaderRegion | null;
    readerMetadata?: ReaderMetadata | null;
};
export declare const PdfDocumentPane: import("react").NamedExoticComponent<PdfDocumentPaneProps & import("react").RefAttributes<HTMLElement>>;
//# sourceMappingURL=PdfDocumentPane.d.ts.map