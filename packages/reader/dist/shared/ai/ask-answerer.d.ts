export declare function buildScopedQuestion({ question, scope, context, resolveQuote }?: {
    question?: string;
    scope?: string;
    context?: any;
    resolveQuote?: ((ctx: any) => any) | null;
}): string;
export declare function createReaderAskAnswerer({ jobId, apiPrefix, ask, documentByJobId, resolveQuote, llmConfig, }?: {
    jobId?: string;
    apiPrefix?: string;
    ask?: (opts: any) => Promise<any>;
    documentByJobId?: (apiPrefix: string, jobId: string) => Promise<any>;
    resolveQuote?: ((ctx: any) => any) | null;
    llmConfig?: (() => any) | any;
}): any;
//# sourceMappingURL=ask-answerer.d.ts.map