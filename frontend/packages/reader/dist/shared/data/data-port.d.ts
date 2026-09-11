/** Markdown 原文的来源描述（来自 job detail artifacts.markdown）。 */
export type MarkdownSourceDescriptor = {
    rawUrl: string;
    totalBytes: number | null;
    imagesBaseUrl: string;
    etag?: string | null;
};
/** 一次 HTTP Range 拉取的结果（后端 ?raw=true 支持 206/Range）。 */
export type MarkdownRangeResult = {
    status: number;
    bytes: Uint8Array;
    totalBytes: number | null;
    /** Content-Range 的结束字节（含），供下一段 cursor = rangeEnd + 1 */
    rangeEnd: number | null;
    etag: string | null;
};
export declare function createReaderDataPort({ apiPrefix, loadJob, loadManifest, loadMarkdown, loadMarkdownDocument, loadMarkdownSource, fetchMarkdownRange, loadAiChat, loadRegions, loadMetadata, loadTranslationItem, fetchProtectedResource, }?: {
    apiPrefix?: string;
    loadJob?: (jobId: string, apiPrefix: string) => Promise<unknown>;
    loadManifest?: (jobId: string, apiPrefix: string) => Promise<unknown>;
    loadMarkdown?: (jobId: string, apiPrefix: string) => Promise<unknown>;
    loadMarkdownDocument?: (jobId: string, apiPrefix: string) => Promise<unknown>;
    loadMarkdownSource?: ((jobId: string, apiPrefix: string) => Promise<MarkdownSourceDescriptor | null>) | null;
    fetchMarkdownRange?: ((rawUrl: string, start: number, endInclusive: number, etag?: string, signal?: AbortSignal) => Promise<MarkdownRangeResult>) | null;
    loadAiChat?: (jobId: string, payload: unknown, apiPrefix: string) => Promise<unknown>;
    loadRegions?: (jobId: string, apiPrefix: string) => Promise<unknown>;
    loadMetadata?: (jobId: string, apiPrefix: string) => Promise<unknown>;
    loadTranslationItem?: (jobId: string, itemId: string, apiPrefix: string) => Promise<unknown>;
    fetchProtectedResource?: typeof fetch;
}): Readonly<{
    apiPrefix: string;
    fetchProtected: typeof fetch;
    fetchRegionTranslationItem: (jobId: string, itemId: string) => Promise<unknown>;
    loadMarkdownPayload: (jobId: string) => Promise<any>;
    loadMarkdownSource: (jobId: string) => Promise<MarkdownSourceDescriptor | null>;
    loadMarkdownRange: (rawUrl: string, start: number, endInclusive: number, etag?: string, signal?: AbortSignal) => Promise<MarkdownRangeResult>;
    loadJobPayload: (jobId: string) => Promise<unknown>;
    loadReaderPayload: (jobId: string, options?: {
        includeOptionalArtifacts?: boolean;
    }) => Promise<{
        jobPayload: unknown;
        manifestPayload: unknown;
        readerMetadata: any;
        regionsPayload: {
            items: any[];
        };
        readerErrors: {
            regions: unknown;
            metadata: unknown;
        };
    }>;
    submitAiChat: (jobId: string, payload: unknown) => Promise<unknown>;
}>;
export declare const defaultReaderDataPort: Readonly<{
    apiPrefix: string;
    fetchProtected: typeof fetch;
    fetchRegionTranslationItem: (jobId: string, itemId: string) => Promise<unknown>;
    loadMarkdownPayload: (jobId: string) => Promise<any>;
    loadMarkdownSource: (jobId: string) => Promise<MarkdownSourceDescriptor | null>;
    loadMarkdownRange: (rawUrl: string, start: number, endInclusive: number, etag?: string, signal?: AbortSignal) => Promise<MarkdownRangeResult>;
    loadJobPayload: (jobId: string) => Promise<unknown>;
    loadReaderPayload: (jobId: string, options?: {
        includeOptionalArtifacts?: boolean;
    }) => Promise<{
        jobPayload: unknown;
        manifestPayload: unknown;
        readerMetadata: any;
        regionsPayload: {
            items: any[];
        };
        readerErrors: {
            regions: unknown;
            metadata: unknown;
        };
    }>;
    submitAiChat: (jobId: string, payload: unknown) => Promise<unknown>;
}>;
//# sourceMappingURL=data-port.d.ts.map