import { type RefObject } from "react";
import { type ReaderToolsApi } from "./use-reader-tools.js";
import type { PageRowHeights } from "../pdf/usePageRowSync.js";
import type { ReaderMode, ReaderSessionState } from "./use-reader-session.js";
import type { ProtectedPdfFile } from "../pdf/useProtectedPdfFile.js";
import type { ReaderPaneModel } from "./use-reader-pane-model.js";
import type { ReaderAnnotationsApi } from "./use-reader-annotations.js";
import type { ReaderTextSelection } from "./use-reader-text-selection.js";
import type { ReaderNote } from "../annotations/types.js";
import { type ReaderRegion } from "../shared/data/reader-regions.js";
export type ReaderAnchorTarget = number | {
    page_idx?: number;
    page?: number;
    block_id?: string;
};
export type ReaderReactController = {
    session: ReaderSessionState;
    boot: ReaderSessionState["boot"];
    sourceOnly: boolean;
    mode: ReaderMode;
    userZoom: number;
    onZoomChange: (zoom: number) => void;
    shell: {
        bindShell: (node: HTMLDivElement | null) => void;
        shellEl: HTMLElement | null;
        shellWidth: number;
        compareColWidth: number;
        shellRef: RefObject<HTMLDivElement | null>;
    };
    panes: ReaderPaneModel;
    sessionFiles: {
        sourceUrl: string;
        translatedUrl: string;
        sourceFile: ProtectedPdfFile | null;
        translatedFile: ProtectedPdfFile | null;
    };
    rowHeights: PageRowHeights;
    currentPage: number;
    goToPage: (page: number) => void;
    activeRegion: ReaderRegion | null;
    jumpToAnchor: (target: ReaderAnchorTarget) => void;
    setModeKeepingPage: (next: ReaderMode) => void;
    showHud: boolean;
    tools: ReaderToolsApi;
    notes: ReaderAnnotationsApi;
    selection: ReaderTextSelection | null;
    clearSelection: () => void;
    addNoteFromSelection: (selection: ReaderTextSelection) => void;
    jumpToNote: (note: ReaderNote) => void;
    documentTitle: string;
    download: ReaderSessionState["download"];
};
export declare function useReaderReactController(): ReaderReactController;
//# sourceMappingURL=use-reader-react-controller.d.ts.map