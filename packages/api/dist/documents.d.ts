export type DocumentRecord = Record<string, any>;
export type DocumentJobSummary = Record<string, any> & {
    job_id?: string;
    workflow?: string;
    status?: string;
    ocr_reused?: boolean;
    source_artifact_job_id?: string | null;
    stages?: DocumentJobStages;
};
export type DocumentJobStageState = "reused" | "queued" | "pending" | "in_progress" | "completed" | "failed" | "skipped";
export type DocumentJobStages = {
    ocr?: {
        state?: DocumentJobStageState;
        [key: string]: unknown;
    };
    translation?: {
        state?: DocumentJobStageState;
        [key: string]: unknown;
    };
    render?: {
        state?: DocumentJobStageState;
        [key: string]: unknown;
    };
    [key: string]: unknown;
};
export type DocumentJobSubmissionView = {
    job_id: string;
    workflow: string;
    status: string;
    ocr_reused: boolean;
    source_artifact_job_id?: string | null;
    stages?: DocumentJobStages;
    [key: string]: unknown;
};
export type DocumentJobsView = {
    items: DocumentJobSummary[];
    invocation_summary?: Record<string, unknown>;
    total?: number;
    limit?: number;
    offset?: number;
    has_more?: boolean;
};
export type DocumentJobsQuery = {
    limit?: number;
    offset?: number;
};
export interface DocumentRequestError extends Error {
    status?: number;
    errorCode?: string;
    reason?: string;
    canFallbackToOcr?: boolean;
}
export declare function fetchDocumentList(apiPrefix: string, { limit, offset, readingStatus, tag, collectionId }?: {
    limit?: number;
    offset?: number;
    readingStatus?: string;
    tag?: string;
    collectionId?: string;
}): Promise<any>;
export declare function fetchDocumentByJobId(apiPrefix: string, jobId: string): Promise<DocumentRecord | null>;
export declare function fetchDocument(apiPrefix: string, documentId: string): Promise<DocumentRecord>;
export declare function patchDocument(apiPrefix: string, documentId: string, payload?: Record<string, unknown>): Promise<DocumentRecord>;
export declare function deleteDocument(apiPrefix: string, documentId: string, { force }?: {
    force?: boolean;
}): Promise<any>;
export declare function translateDocument(apiPrefix: string, documentId: string, payload?: Record<string, unknown>): Promise<DocumentJobSubmissionView>;
export declare function ocrDocument(apiPrefix: string, documentId: string, payload?: Record<string, unknown>): Promise<any>;
export declare function fetchDocumentJobs(apiPrefix: string, documentId: string, { limit, offset }?: DocumentJobsQuery): Promise<DocumentJobsView>;
