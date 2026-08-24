import type { RefObject } from "react";
import type { ReaderNotePane } from "../annotations/types.js";
export type ReaderTextSelection = {
    quote: string;
    page: number;
    pane: ReaderNotePane;
    /** 视口坐标，用于浮条定位 */
    rect: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
};
export declare function useReaderTextSelection(rootRef: RefObject<HTMLElement | null>, enabled?: boolean): {
    selection: ReaderTextSelection | null;
    clearSelection: () => void;
};
//# sourceMappingURL=use-reader-text-selection.d.ts.map