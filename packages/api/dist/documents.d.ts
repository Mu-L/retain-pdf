export type DocumentRecord = Record<string, any>;
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
export declare function translateDocument(apiPrefix: string, documentId: string, payload?: Record<string, unknown>): Promise<any>;
