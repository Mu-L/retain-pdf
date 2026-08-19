// packages/reader 对宿主环境的唯一契约（取代 apps/web/src/pages/reader/external.ts）
//
// 新包不直接 import apps/web/src/js/*。宿主（RetainPDF 或其他产品）通过 adapters 注入：
// - 资源定位（sourceUrl/translatedUrl）
// - 网络/鉴权
// - 收藏/AI 等可选能力
// 旧 external.ts 保留为 RetainPDF 适配层（thin wrapper）→ adapters 的实现。

export type ReaderMode = "source" | "translated" | "compare";

export type ReaderDocumentSource = {
  sourceUrl: string;
  translatedUrl?: string | null;
  sourceFile?: unknown | null;
  translatedFile?: unknown | null;
  title?: string;
};

export type ReaderSessionAdapters = {
  // 会话：由宿主解析 job/document/anchor
  resolveSession?: () => {
    jobId?: string;
    documentId?: string;
    sourceOnly?: boolean;
    mode?: ReaderMode;
  };
  // 资源：宿主提供已解析的 PDF URL（取代 resolveResourceUrl/resolveReader*Url）
  resolveDocument?: () => Promise<ReaderDocumentSource> | ReaderDocumentSource;
  // 网络：受保护下载的 fetcher（取代 fetchProtected/downloadProtectedResource）
  fetchPdf?: (url: string, init?: RequestInit) => Promise<Response>;
  // 可选能力：收藏、AI、Markdown 等按需注入，未注入则对应面板自动隐藏
  favoritesPort?: unknown;
  aiAnswerer?: unknown;
  markdownLoader?: (jobId: string) => Promise<string>;
};

export type ReaderAdapters = ReaderSessionAdapters;

// 兼容旧 external 的最小子集，供 apps/web 适配层复用
export const DEFAULT_READER_ADAPTERS: Partial<ReaderAdapters> = {};
