import { type ReactNode } from "react";
import type { ReaderPaneModel } from "../../hooks/use-reader-pane-model.js";
import type { ReaderDownloadContext } from "../../hooks/use-reader-session.js";
import type { ReaderMetadata, ReaderRegion, ReaderRegionSelection } from "../../shared/data/reader-regions.js";
import type { ProtectedPdfFile } from "../../pdf/useProtectedPdfFile.js";
import type { PageRowHeights } from "../../pdf/usePageRowSync.js";
import type { ReaderAssistantPanel } from "./ReaderAssistantDock.js";
export type ReaderContextValue = {
    bindShell: (node: HTMLDivElement | null) => void;
    shellEl: HTMLElement | null;
    shellWidth: number;
    userZoom: number;
    onZoomChange: (zoom: number) => void;
    rowHeights: PageRowHeights;
    mountSource: boolean;
    mountTranslated: boolean;
    onMetrics: () => void;
    onNumPagesChange: ReaderPaneModel["onNumPages"];
    sourceUrl: string;
    translatedUrl: string;
    sourceFile: ProtectedPdfFile | null;
    translatedFile: ProtectedPdfFile | null;
    regions: ReaderRegion[];
    readerMetadata: ReaderMetadata | null;
    activeRegion: ReaderRegion | null;
    onSelectRegion: (selection: ReaderRegionSelection) => void;
    /** controller 原生 sourceOnly（FAB 工具禁用判断） */
    sourceOnly: boolean;
    /** sourceOnly 或缺少译文产物；外壳按此禁对照/译文（grid、workspace tabs） */
    sourceViewOnly: boolean;
    download: ReaderDownloadContext;
    goToPage: (page: number, pane?: "source" | "translated") => void;
    assistant: {
        select: (panel: ReaderAssistantPanel) => void;
        close: () => void;
    };
};
export type ReaderHudContextValue = {
    currentPage: number;
    numPages: number;
};
export type ReaderProviderProps = {
    value: ReaderContextValue;
    hud: ReaderHudContextValue;
    children: ReactNode;
};
export declare function ReaderProvider({ value, hud, children }: ReaderProviderProps): ReactNode;
/** 无 Provider 时返回 null（组件/单测可继续用显式 props）。 */
export declare function useReaderContext(): ReaderContextValue | null;
/** 无 Provider 时返回 null（HUD 单测可继续用显式 props）。 */
export declare function useReaderHudContext(): ReaderHudContextValue | null;
//# sourceMappingURL=reader-context.d.ts.map