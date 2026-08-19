// @retainpdf/reader — 自包含 external（不再代理 apps/web）
// 保留与 apps/web/src/pages/reader/external.ts 同样的导出面，但实现改为 adapters 注入 + 轻量 fallback
// 未注入时返回空/默认，保证 standalone 可 tsc/build，深功能需宿主 setReaderAdapters

import { getReaderAdapters } from "./adapters.js";

// —— config / mock / messaging ——
export const isMockMode = (...args: any[]): boolean => (getReaderAdapters()?.isMockMode as any)?.(...args) ?? false;
export const MOCK_DOCUMENT_SOURCE_PDF_URL = "";
export const READER_DIALOG_MESSAGES = {} as any;

// —— job / http / vendor ——
export const resolveResourceUrl = (url: string): string => (getReaderAdapters()?.resolveResourceUrl as any)?.(url) ?? url;
export const fetchProtected: typeof fetch = (...args: any[]) => (getReaderAdapters()?.fetchProtected as any)?.(...args) ?? (fetch as any)(...args);
export const resolvePdfjsVendorUrl = (): string => (getReaderAdapters()?.resolvePdfjsVendorUrl as any)?.() ?? "";
export const resolveMarkedVendorUrl = (): string => (getReaderAdapters()?.resolveMarkedVendorUrl as any)?.() ?? "";

// —— js/reader 共享 ports ——
export const defaultReaderDataPort: any = new Proxy({} as any, { get: (_t, p) => (...a: any[]) => (getReaderAdapters()?.defaultReaderDataPort as any)?.[p as string]?.(...a) });
export const defaultReaderPageConfigPort: any = new Proxy({} as any, { get: (_t, p) => (...a: any[]) => (getReaderAdapters()?.defaultReaderPageConfigPort as any)?.[p as string]?.(...a) });
export const resolveReaderAnchor = (...a: any[]) => (getReaderAdapters()?.resolveReaderAnchor as any)?.(...a) ?? null;
export const resolveReaderDocumentId = (): string => (getReaderAdapters()?.resolveReaderDocumentId as any)?.() ?? "";
export const resolveReaderJobId = (): string => (getReaderAdapters()?.resolveReaderJobId as any)?.() ?? "";
export const resolveReaderArtifactUrl = (...a: any[]) => (getReaderAdapters()?.resolveReaderArtifactUrl as any)?.(...a) ?? "";
export const resolveReaderSourcePdf = (...a: any[]) => (getReaderAdapters()?.resolveReaderSourcePdf as any)?.(...a) ?? null;
export const resolveReaderTranslatedPdfUrl = (...a: any[]) => (getReaderAdapters()?.resolveReaderTranslatedPdfUrl as any)?.(...a) ?? "";
export const READER_PROGRESS_COPY = {} as any;

// —— 下载 ——
export const READER_DOWNLOAD_ACTIONS: any = [];
export const readerDownloadDisabledReason: any = (..._a: any[]) => null;
export const resolveReaderDownloadName: any = (..._a: any[]) => "";
export const resolveReaderDownloadUrls: any = (..._a: any[]) => [];
export const trimReaderDownloadString = (s: string) => (s || "").trim();
export const downloadProtectedResource: any = (..._a: any[]) => Promise.reject(new Error("downloadProtectedResource not injected"));
export const failDownloadToast: any = (..._a: any[]) => {};

// —— markdown ——
export const resolveMarkdownAssetUrl = (...a: any[]) => (getReaderAdapters() as any)?.resolveMarkdownAssetUrl?.(...a) ?? "";
export const parseMarkdownWithMath = (...a: any[]) => (getReaderAdapters() as any)?.parseMarkdownWithMath?.(...a) ?? "";

// —— AI ——
export const createReaderAskAnswerer = (..._a: any[]) => { throw new Error("createReaderAskAnswerer not injected"); };
export const createReaderMarkdownAnswerer = (..._a: any[]) => { throw new Error("createReaderMarkdownAnswerer not injected"); };
export const hydrateProtectedImages = (...a: any[]) => (a[0] as any) ?? "";
export const injectCitationMarkers = (s: string) => s;
export const isAgenticCitation = () => false;
export const neutralizeMarkdownAnchors = (s: string) => s;
export const renderCitationFooter = () => "";
export const revokeHydratedImageUrls = () => {};
export type AiCitationLike = any;
export const armReaderAiClickShield = () => {};
export const clearReaderAiNavigationLock = () => {};
export const installReaderWindowOpenGuard = () => {};
export const isReaderAiNavigationLocked = () => false;
export const lockReaderAiNavigation = () => {};
export const shouldIgnoreReaderAiNavEvent = () => false;
export const peekFinalAnswerHtmlCache = () => null as any;
export const renderFinalAnswerHtml = (s: string) => s;
export const renderStreamingPreviewHtml = (s: string) => s;
export const sanitizeAssistantAnswer = (s: string) => s;
export const clearThreadBranchSnapshot = () => {};
export const loadThreadBranchSnapshot = () => null as any;
export const saveThreadBranchSnapshot = () => {};
export const threadBranchStorageKey = (..._a: any[]) => "" as any;
export const visiblePathFromSnapshot = (..._a: any[]) => [] as any;
export type ThreadBranchCitation = any; export type ThreadBranchItem = any; export type ThreadBranchMessage = any; export type ThreadBranchSnapshot = any;
export const appendConversationMessage = (..._a: any[]) => Promise.resolve(null) as any;
export const baseConversationTitle = (..._a: any[]) => "" as any;
export const createConversation = (..._a: any[]) => Promise.resolve(null) as any;
export const deleteConversation = (..._a: any[]) => Promise.resolve(null) as any;
export const forkConversationFromPath = (..._a: any[]) => Promise.resolve(null) as any;
export const getConversation = (..._a: any[]) => Promise.resolve(null) as any;
export const listConversations = (..._a: any[]) => Promise.resolve([]) as any;
export const messagesToBranchItems = (..._a: any[]) => [] as any;
export const nextForkConversationTitle = (..._a: any[]) => "" as any;
export const patchConversation = (..._a: any[]) => Promise.resolve(null) as any;
export type ConversationDetail = any; export type ConversationRecord = any; export type MessageRecord = any;
export const loadStoredConversationId = () => null as any;
export const saveStoredConversationId = () => {};
export const clearStoredConversationId = () => {};

// —— 服务端收藏 ——
export const API_PREFIX = "/api" as any;
export const fetchFavorites = (..._a: any[]) => Promise.resolve([]) as any;
export const createReaderServerFavoritesPort = (..._a: any[]) => ({}) as any;
export const normalizeServerFavorite = (x: any) => x as any;
export type ServerFavorite = any;

// —— 阅读器 AI 面板：模型 Key 门禁 ——
export const CREDENTIALS_CHANGED_EVENT = "credentials-changed" as any;
export const hasModelApiKey = () => false as any;
export const MISSING_MODEL_API_KEY_MESSAGE = "" as any;
