import { type AiCitationLike } from "../../../external.js";
import type { ReaderAskStoreMessage } from "./reader-ask-tree.js";
export type ReaderAssistantSurfaceProps = {
    jobId: string;
    messages: readonly ReaderAskStoreMessage[];
    citationsByMessageId: Record<string, AiCitationLike[]>;
    progressByMessageId: Record<string, string>;
    streamingAssistantId: string;
    isRunning: boolean;
    missingLlmKey: boolean;
    branchBusy: boolean;
    onJumpCitation?: (citation: AiCitationLike) => void;
    onBranchFromAnswer?: (assistantMessageId: string) => void | Promise<boolean | void>;
};
export declare function ReaderAssistantSurface({ jobId, messages, citationsByMessageId, progressByMessageId, streamingAssistantId, isRunning, missingLlmKey, branchBusy, onJumpCitation, onBranchFromAnswer, }: ReaderAssistantSurfaceProps): import("react").JSX.Element;
//# sourceMappingURL=ReaderAssistantSurface.d.ts.map