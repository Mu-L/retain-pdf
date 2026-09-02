import { type AiCitationLike } from "../../external.js";
export type ReaderAiPanelProps = {
    open: boolean;
    jobId: string;
    onClose: () => void;
    /** page_idx 为 0 基；由阅读器 goToPage(page_idx+1) */
    onJumpCitation: (citation: AiCitationLike) => void;
    onDocumentCommitted?: (input: {
        documentId: string;
        revision: string;
    }) => void;
    layout?: "floating" | "docked";
};
export declare function ReaderAiPanel({ open, jobId, onClose, onJumpCitation, onDocumentCommitted, layout, }: ReaderAiPanelProps): import("react").JSX.Element;
//# sourceMappingURL=ReaderAiPanel.d.ts.map