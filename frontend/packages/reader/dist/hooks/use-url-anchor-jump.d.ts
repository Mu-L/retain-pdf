export type UrlReaderAnchor = {
    pageIdx: number | null;
    blockId: string;
};
/** page_idx (0-based) → 阅读器页码 (1-based)；无效返回 null */
export declare function pageNumberFromUrlAnchor(anchor: UrlReaderAnchor | null | undefined, resolveBlockPage?: (blockId: string) => number | null): number | null;
/**
 * 去重键：混入会话身份（jobId/documentId），跨文档同 anchor 不再互相吞跳。
 * 同会话同 anchor 保持稳定，仍只跳一次。
 */
export declare function buildUrlAnchorAppliedKey(anchor: UrlReaderAnchor | null | undefined, page: number | null, session?: {
    jobId?: string | null;
    documentId?: string | null;
}): string;
/**
 * 在 enabled 且 numPages 可用时，按 URL 锚点跳一次（每会话一次）。
 */
export declare function useUrlAnchorJump(options: {
    /** boot 完成、可滚动 */
    enabled: boolean;
    numPages: number;
    goToPage: (page: number) => void;
    resolveBlockPage?: (blockId: string) => number | null;
    onAnchorApplied?: (anchor: UrlReaderAnchor, page: number) => void;
    /** 会话身份：跨文档同 anchor 不跳的根因，缺席时退化为旧全局去重 */
    jobId?: string | null;
    documentId?: string | null;
}): void;
//# sourceMappingURL=use-url-anchor-jump.d.ts.map