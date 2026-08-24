import { fetchProtected } from "../external.js";
export type ProtectedPdfFile = {
    data: Uint8Array;
};
export type ProtectedPdfState = {
    file: ProtectedPdfFile | null;
    loading: boolean;
    error: string;
};
export declare function getCachedProtectedPdf(url: string): ProtectedPdfFile | null;
export declare function setCachedProtectedPdf(url: string, file: ProtectedPdfFile): void;
export declare function loadProtectedPdfFile(url: string, fetchResource?: typeof fetchProtected, options?: {
    signal?: AbortSignal;
}): Promise<ProtectedPdfFile | null>;
/** 并行下载多份 PDF，全部完成才 resolve；onItem 用于进度文案 */
export declare function loadProtectedPdfFiles(urls: string[], { fetchResource, onItem, }?: {
    fetchResource?: typeof fetchProtected;
    onItem?: (info: {
        index: number;
        total: number;
        url: string;
    }) => void;
}): Promise<(ProtectedPdfFile | null)[]>;
export declare function useProtectedPdfFile(url?: string, 
/** 会话已预下载时直接注入，跳过二次请求 */
preloaded?: ProtectedPdfFile | null): ProtectedPdfState;
//# sourceMappingURL=useProtectedPdfFile.d.ts.map