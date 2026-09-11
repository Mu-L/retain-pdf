export type ReaderMarkdownPanelProps = {
    open: boolean;
    jobId: string;
    sourceOnly: boolean;
    layout?: "floating" | "docked" | "workspace";
    side?: "left" | "right";
    onClose: () => void;
};
export declare function isProtectedMarkdownAssetUrl(value: string, baseUrl?: string): boolean;
export type MarkdownOutlineItem = {
    id: string;
    level: number;
    text: string;
};
export declare function buildMarkdownOutline(container: ParentNode, used?: Map<string, number>): MarkdownOutlineItem[];
export declare function clearMarkdownSearchHighlights(container: ParentNode): void;
export declare function findMarkdownSearchTargets(container: ParentNode, query: string): HTMLElement[];
type MarkdownImageProgress = {
    failed: number;
    loaded: number;
    total: number;
};
type ProtectedMarkdownImageLoaderOptions = {
    fetchImage: (url: string, init?: RequestInit) => Promise<Response>;
    onObjectUrl: (url: string) => void;
    onProgress?: (progress: MarkdownImageProgress) => void;
    protectedBaseUrl?: string;
    root?: Element | null;
    /** 外部取消信号：卸载/重来时中止在途的受保护图片请求。 */
    signal?: AbortSignal;
};
/**
 * Direct public images rely on native lazy loading. Protected images cannot set src until
 * their authenticated blob has been fetched, so observe them against the reader scrollport.
 */
export declare function startMarkdownImageLoading(images: HTMLImageElement[], options: ProtectedMarkdownImageLoaderOptions): () => void;
export declare function ReaderMarkdownPanel({ open, jobId, sourceOnly, layout, side, onClose, }: ReaderMarkdownPanelProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=ReaderMarkdownPanel.d.ts.map