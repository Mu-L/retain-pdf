export declare class AiAskError extends Error {
    status: number;
    constructor(message: string, status?: number);
}
export declare function readAiAskStream(body: ReadableStream<Uint8Array>, { onToolEvent, onAnswerDelta, onCompress }?: {
    onAnswerDelta?: (full: string, chunk: string) => void;
    onCompress?: (e: any) => void;
    onToolEvent?: (e: any) => void;
}): Promise<any>;
export declare function askLibraryAi({ question, documentId, jobId, conversationId, parentId, regenerate, userMessageId, assistantMessageId, onToolEvent, onAnswerDelta, onCompress, signal, apiPrefix, fetchImpl, llmApiKey, llmBaseUrl, llmModel, }?: {
    question?: string;
    documentId?: string;
    jobId?: string;
    conversationId?: string;
    parentId?: string;
    regenerate?: boolean;
    userMessageId?: string;
    assistantMessageId?: string;
    onToolEvent?: ((e: any) => void) | null;
    onAnswerDelta?: ((full: string, chunk: string) => void) | null;
    onCompress?: ((e: any) => void) | null;
    signal?: AbortSignal | null;
    apiPrefix?: string;
    fetchImpl?: typeof fetch;
    llmApiKey?: string;
    llmBaseUrl?: string;
    llmModel?: string;
}): Promise<any>;
