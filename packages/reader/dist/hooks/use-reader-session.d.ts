import { type ProtectedPdfFile } from "../pdf/useProtectedPdfFile.js";
import { defaultReaderDataPort } from "../external.js";
import { type ReaderMetadata, type ReaderRegion } from "../shared/data/reader-regions.js";
export type ReaderMode = "source" | "translated" | "compare";
/** 与 legacy ReaderDownloadMenu 相同的下载上下文 */
export type ReaderDownloadContext = {
    fetchProtected: typeof defaultReaderDataPort.fetchProtected;
    jobId: string;
    jobPayload: Record<string, unknown> | null;
    manifestPayload: Record<string, unknown> | null;
    /** 馆藏只读等无 job 时直接用已解析 URL */
    sourceUrl: string;
    translatedUrl: string;
    sourceOnly: boolean;
};
export type ReaderSessionState = {
    jobId: string;
    documentId: string;
    sourceOnly: boolean;
    mode: ReaderMode;
    setMode: (mode: ReaderMode) => void;
    sourceUrl: string;
    translatedUrl: string;
    /** 预下载完成的 PDF 字节；展示前已就绪 */
    sourceFile: ProtectedPdfFile | null;
    translatedFile: ProtectedPdfFile | null;
    /** 下载完成、可以挂载 Document */
    assetsReady: boolean;
    boot: {
        loading: boolean;
        percent: number;
        text: string;
        stage: string;
        failed: boolean;
    };
    title: string;
    regions: ReaderRegion[];
    readerMetadata: ReaderMetadata;
    download: ReaderDownloadContext;
};
export declare function useReaderSession(): ReaderSessionState;
//# sourceMappingURL=use-reader-session.d.ts.map