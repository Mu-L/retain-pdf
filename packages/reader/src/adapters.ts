// packages/reader 对宿主环境的唯一契约（取代 apps/web/src/pages/reader/external.ts）
export type ReaderMode = "source" | "translated" | "compare";
export type ReaderDocumentSource = {
  sourceUrl: string;
  translatedUrl?: string | null;
  sourceFile?: unknown | null;
  translatedFile?: unknown | null;
  title?: string;
};
// 扩展：将 external 的 20+ 符号收敛为可注入能力，逐步替换直接 import
export type ReaderSessionAdapters = {
  resolveSession?: () => { jobId?: string; documentId?: string; sourceOnly?: boolean; mode?: ReaderMode };
  resolveDocument?: () => Promise<ReaderDocumentSource> | ReaderDocumentSource;
  fetchPdf?: (url: string, init?: RequestInit) => Promise<Response>;
  favoritesPort?: unknown;
  aiAnswerer?: unknown;
  markdownLoader?: (jobId: string) => Promise<string>;
  // 细粒度：保留旧 external 的关键能力以便渐进迁移
  isMockMode?: () => boolean;
  resolveResourceUrl?: (url: string) => string;
  fetchProtected?: typeof fetch;
  resolvePdfjsVendorUrl?: () => string;
  resolveMarkedVendorUrl?: () => string;
  defaultReaderDataPort?: unknown;
  defaultReaderPageConfigPort?: unknown;
  resolveReaderAnchor?: (...args: any[]) => any;
  resolveReaderDocumentId?: () => string;
  resolveReaderJobId?: () => string;
  resolveReaderArtifactUrl?: (...args: any[]) => string;
  resolveReaderSourcePdf?: (...args: any[]) => any;
  resolveReaderTranslatedPdfUrl?: (...args: any[]) => string;
};
export type ReaderAdapters = ReaderSessionAdapters;
export const DEFAULT_READER_ADAPTERS: Partial<ReaderAdapters> = {};
// 全局注入注册（monorepo 内由 apps/web 在启动时 set）
let _adapters: ReaderAdapters | null = null;
export function setReaderAdapters(a: ReaderAdapters | null) { _adapters = a; }
export function getReaderAdapters(): ReaderAdapters | null { return _adapters; }
export function requireAdapter<T extends keyof ReaderAdapters>(key: T): NonNullable<ReaderAdapters[T]> {
  const v = _adapters?.[key];
  if (v == null) throw new Error(`Reader adapter missing: ${String(key)} (call setReaderAdapters)`);
  return v as NonNullable<ReaderAdapters[T]>;
}
