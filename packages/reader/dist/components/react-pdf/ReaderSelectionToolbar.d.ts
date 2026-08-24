import type { ReaderTextSelection } from "../../hooks/use-reader-text-selection.js";
export type ReaderSelectionToolbarProps = {
    selection: ReaderTextSelection | null;
    onAddNote: (selection: ReaderTextSelection) => void;
    onDismiss: () => void;
};
export declare function ReaderSelectionToolbar({ selection, onAddNote, onDismiss, }: ReaderSelectionToolbarProps): import("react").JSX.Element;
//# sourceMappingURL=ReaderSelectionToolbar.d.ts.map