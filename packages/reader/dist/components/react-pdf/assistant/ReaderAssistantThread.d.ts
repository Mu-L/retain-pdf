import { type AiCitationLike } from "../../../external.js";
import type { ReaderAskStoreMessage } from "./reader-ask-tree.js";
export type ReaderAssistantThreadProps = {
    jobId?: string;
    messages?: readonly ReaderAskStoreMessage[];
    citationsByMessageId?: Record<string, AiCitationLike[]>;
    progressByMessageId?: Record<string, string>;
    contentByMessageId?: Record<string, string>;
    streamingAssistantId?: string;
    isRunning?: boolean;
    onSubmit: (question: string) => void | Promise<void>;
    onRetry: (assistantMessageId: string) => void | Promise<void>;
    onCancel: () => void | Promise<void>;
    onJumpCitation?: (citation: AiCitationLike) => void;
    onBranchFromAnswer?: (assistantMessageId: string) => void | Promise<boolean | void>;
    branchBusy?: boolean;
};
export declare function ReaderAssistantThread({ jobId, messages, citationsByMessageId, progressByMessageId, contentByMessageId, streamingAssistantId, isRunning, onSubmit, onRetry, onCancel, onJumpCitation, onBranchFromAnswer, branchBusy, }: ReaderAssistantThreadProps): import("react").JSX.Element;
//# sourceMappingURL=ReaderAssistantThread.d.ts.map