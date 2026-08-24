import { type MouseEvent as ReactMouseEvent } from "react";
export type RetainMarkstreamProps = {
    content: string;
    final: boolean;
    indexKey: string;
    jobId: string;
    onClickCapture?: (event: ReactMouseEvent<HTMLDivElement>) => void;
};
export declare function RetainMarkstream({ content, final, indexKey, jobId, onClickCapture, }: RetainMarkstreamProps): import("react").JSX.Element;
//# sourceMappingURL=RetainMarkstream.d.ts.map