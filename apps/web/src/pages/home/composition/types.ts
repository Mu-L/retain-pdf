// composition 层公共类型。HomeServices / HomeFeatures 表面 API 不用 any；
// 深层 payload 用 unknown；store/port 复用已有模块类型。

import type {
  Store,
  CredentialsStatePort,
  HomeStatePort,
  UploadStatePort,
  TranslationWorkflowDialogStatePort,
} from "./external.js";
import type { DialogStore } from "../state/dialog-store.js";
import type { ArtifactDownloadBusyStore } from "../state/artifact-download-busy-store.js";
import type {
  DeleteCardTarget,
  DeleteDocumentsResult,
  JobSubmissionView,
  LibraryCardItem,
  LibraryJobItem,
  LibraryController,
  RecentJobsReactViewPort,
  TranslateDocumentPayload,
  UpdateDocumentPayload,
} from "../features/library/types.js";

/**
 * 通用 app-framework store。
 * 用 Store 默认参（未建模 snapshot/actions），避免把消费方推成 never/unknown。
 */
export type AppStore = Store;

// ── Read-only selector port (hide Store behind read-only selectors) ────────

/**
 * 隐藏 Store 写入能力：仅暴露读侧（配合 useStoreSnapshot）。
 * 消费方不得直接调用 store.actions；写入必须经由 domain controller / feature。
 */
export type ReadOnlyStore<T = unknown> = Pick<Store<T, any>, "getSnapshot" | "subscribe">;

/** 便利别名：只读文本/视图等简单快照 */
export type ReadOnlySelector<T> = ReadOnlyStore<T>;

// ── Features ──────────────────────────────────────────────────────────

export type WorkflowFeature = {
  applyWorkflowMode: () => void;
  buildOcrJobConfig: (pageRanges?: string) => Record<string, unknown>;
  buildTranslateJobConfig: (pageRanges?: string) => TranslateDocumentPayload | Record<string, unknown>;
  collectRunPayload: () => unknown;
  currentRenderSourceJobId: () => string;
  currentWorkflow: () => string;
  currentBudgetState: (workflow?: string) => unknown;
  developerConfigWithDefaults: () => Record<string, unknown>;
  isOcrOnly?: () => boolean;
  loadGlossaryOptions: (options?: unknown) => unknown;
  refreshSubmitControls: () => void;
  resetDeveloperDialog: () => void;
  saveDeveloperDialog: () => unknown;
  syncDeveloperDialogFromState: () => void;
  updateCredentialGate: (options?: unknown) => void;
  updateDeveloperWorkflowFormState: () => void;
  workflowNeedsCredentials: (workflow?: string) => boolean;
  workflowNeedsUpload: (workflow?: string) => boolean;
};

export type UploadFeature = {
  applyPageRanges: () => void;
  clearPageRanges: () => void;
  constrainPageRanges: (options?: { source?: unknown }) => void;
  currentPageRanges: () => string;
  handleFileSelected: () => unknown;
  normalizePageRangeValue: (start?: unknown, end?: unknown) => string;
  openPageRangeDialog: () => void;
  renderPageRangeSummary: () => void;
  resetUploadSession: () => void;
  validatePageRanges: () => boolean;
};

export type BrowserCredentialsFeature = {
  activateCredentialTab: (tabName?: string) => void;
  ensureOcrCredentialsReady: (options?: unknown) => Promise<boolean> | boolean | unknown;
  hasBrowserCredentials: () => boolean;
  hasOcrCredentials: () => boolean;
  openBrowserCredentialsDialog: (options?: unknown) => void;
  prepareCredentialsPanels: () => void;
  refreshDeepSeekBalance: (options?: unknown) => Promise<unknown> | unknown;
  setDialogStatus: (message?: string, tone?: string) => void;
  updateCredentialGate: (options?: unknown) => void;
};

export type GlossariesFeature = {
  bindEvents: () => void;
  open: () => unknown;
  reloadGlossaries: () => unknown;
  save: () => unknown;
};

export type AppUpdateFeature = {
  checkForUpdates: (options?: { manual?: boolean }) => Promise<unknown> | unknown;
};

export type AppActionsFeature = {
  checkApiConnectivity: () => Promise<unknown> | unknown;
  handleOpenOutputDir: () => unknown;
  /** React SubmitEvent 与 DOM Event 均允许 */
  submitForm: (event?: { preventDefault?: () => void } | null) => unknown;
};

export type StartPollingOptions = {
  silent?: boolean;
  publishLibrary?: boolean;
  showWorkflow?: boolean;
  seedPayload?: Record<string, unknown> | null;
  recovering?: boolean;
};

export type JobRuntimeFeature = {
  cancelCurrentJob: () => unknown;
  currentJobId: () => string;
  fetchJob: (jobId?: string) => Promise<unknown> | unknown;
  retryStage: (stage: string, options?: { jobId?: string }) => unknown;
  returnToHome: () => void;
  startPolling: (jobId: string, options?: StartPollingOptions) => unknown;
  stopPolling: () => void;
};

export type RecentJobsFeature = {
  openRecentJobsDialog: () => void;
  closeRecentJobsDialog: () => void;
  loadRecentJobs: (options?: unknown) => Promise<unknown> | unknown;
  initializeLibraryView: () => void;
};

export type ArtifactDownloadsFeature = {
  bindEvents: () => void;
  handleProtectedArtifactClick: (event: Event, link?: Element) => unknown;
};

export type AppShellFeature = {
  initializeIdleView: () => void;
};

/** 装配期逐步填满的 features 注册表 */
export type HomeFeatures = {
  workflowFeature?: WorkflowFeature;
  uploadFeature?: UploadFeature;
  browserCredentialsFeature?: BrowserCredentialsFeature;
  glossariesFeature?: GlossariesFeature;
  appUpdateFeature?: AppUpdateFeature;
  appActionsFeature?: AppActionsFeature;
  jobRuntimeFeature?: JobRuntimeFeature;
  recentJobsFeature?: RecentJobsFeature;
  artifactDownloadsFeature?: ArtifactDownloadsFeature;
  appShellFeature?: AppShellFeature;
};

// ── Ports / stores ────────────────────────────────────────────────────

export type { CredentialsStatePort, HomeStatePort, UploadStatePort };
export type DialogStatePort = TranslationWorkflowDialogStatePort;

export type HomePorts = {
  credentialsStatePort: CredentialsStatePort;
  dialogStatePort: DialogStatePort;
  homeStatePort: HomeStatePort;
  uploadStatePort: UploadStatePort;
};

/**
 * 仅读 stores：消费方经 useStoreSnapshot 读取，写入走 domain actions。
 * 对比之前的 AppStore，刻意隐藏 actions，避免神对象扩散。
 */
export type HomeStores = {
  dialog: ReadOnlyStore;
  homeState: ReadOnlyStore;
  statusArea: ReadOnlyStore;
  text: ReadOnlyStore;
  uploadView: ReadOnlyStore;
  workflowView: ReadOnlyStore;
  credentialsView: ReadOnlyStore;
};

// ── Domain bags ───────────────────────────────────────────────────────

/** 事件处理函数表（viewPort.bindEvents 写入 handlersRef） */
export type HandlersBag = {
  [key: string]: ((...args: unknown[]) => unknown) | undefined | null;
};

export type CredentialsElementsRef = {
  apiKeyInput: HTMLInputElement | null;
  modelBaseUrlInput: HTMLInputElement | null;
  modelNameInput: HTMLInputElement | null;
  translationWorkersInput: HTMLInputElement | null;
  mathModeSelect: HTMLSelectElement | null;
  tokenInputs: Record<string, HTMLInputElement | null | undefined>;
};

export type CredentialsViewBag = {
  store: ReadOnlyStore;
  handlersRef: { current: HandlersBag | null };
  tokenInputRef: (providerId: string) => (node: HTMLInputElement | null) => void;
  elementsRef: CredentialsElementsRef;
  elementsPort?: unknown;
  viewPort?: unknown;
};

export type HomeCredentials = {
  feature: BrowserCredentialsFeature | undefined;
  view: CredentialsViewBag;
  dialogStore: DialogStore;
};

export type HomeSettingsHub = {
  dialogStore: DialogStore<{ tab?: string } | null>;
};

export type GlossariesViewBag = {
  store: ReadOnlyStore;
  handlersRef: { current: HandlersBag | null };
  viewPort?: unknown;
};

export type HomeGlossaries = {
  feature: GlossariesFeature | undefined;
  view: GlossariesViewBag;
  dialogStore: DialogStore;
};

export type AppUpdateViewBag = {
  store: ReadOnlyStore;
  viewPort?: unknown;
  handlersRef: { current: HandlersBag | null };
};

export type HomeAppUpdate = {
  feature: AppUpdateFeature | undefined;
  view: AppUpdateViewBag;
  handlersRef: AppUpdateViewBag["handlersRef"];
};

export type RecentJobActions = {
  selectJob: (jobId: string) => unknown;
  deleteJob: (jobId: string) => Promise<unknown> | unknown;
  openJobReader: (jobId: string, documentId?: string) => unknown;
  recoverActiveJob: (items?: unknown[]) => unknown;
};

export type LibraryActions = RecentJobActions & {
  openSourceReader: LibraryController["openSourceReader"];
  translateDocument: LibraryController["translateDocument"];
  ocrDocument: LibraryController["ocrDocument"];
  getDocumentJobs: LibraryController["getDocumentJobs"];
  getDocumentByJobId: LibraryController["getDocumentByJobId"];
  getJobStageActions: LibraryController["getJobStageActions"];
  retryJobStage: LibraryController["retryJobStage"];
  deleteDocument: LibraryController["deleteDocument"];
  /** 选择集可能是 unknown[]（view state），参数放宽 */
  deleteDocuments: (
    documentIds?: Array<string | null | undefined | unknown>,
  ) => Promise<DeleteDocumentsResult>;
  deleteCard: LibraryController["deleteCard"];
  openBookDetail: LibraryController["openBookDetail"];
  updateDocument: LibraryController["updateDocument"];
  storeOnly: LibraryController["storeOnly"];
  attachJobProgress: LibraryController["attachJobProgress"];
};

export type HomeLibrary = {
  viewPort: RecentJobsReactViewPort;
  recentJobsStore: ReadOnlyStore<{ items: LibraryCardItem[]; [key: string]: unknown }>;
  actions: LibraryActions;
};

export type HomeBookDetail = {
  dialogStore: DialogStore<LibraryCardItem | null>;
};

/** 分类/合集控制器（createCollectionsController 返回面） */
export type CollectionRecord = {
  collection_id?: string;
  name?: string;
  document_count?: number;
  parent_id?: string | null;
  sort_order?: number;
};

export type CollectionDocumentRecord = {
  document_id?: string;
  title?: string;
  [key: string]: unknown;
};

export type CollectionsListResult = {
  collections?: CollectionRecord[];
};

export type CollectionsController = {
  listCollections: () => Promise<CollectionsListResult>;
  createCollection: (payload?: { name?: string; parentId?: string }) => Promise<CollectionRecord>;
  patchCollection: (
    collectionId: string,
    payload?: { name?: string; sort_order?: number },
  ) => Promise<CollectionRecord>;
  deleteCollection: (collectionId: string) => Promise<unknown>;
  addDocuments: (
    collectionId: string,
    documentIds: Array<string | null | undefined | unknown>,
  ) => Promise<unknown>;
  removeDocument: (collectionId: string, documentId: string) => Promise<unknown>;
  listAllDocuments: () => Promise<CollectionDocumentRecord[]>;
  listCollectionDocumentIds: (collectionId: string) => Promise<string[]>;
  fetchFolderBooks: (collectionId: string) => Promise<LibraryCardItem[]>;
};

/** createStore 返回的 actions 经 BoundStoreActions 后难精确建模；消费面只认 bump */
export type CollectionsReloadSignal = {
  getSnapshot: () => { version: number };
  subscribe: (listener: (snapshot: { version: number }, meta?: unknown) => void) => () => void;
  actions: {
    bump: (...args: unknown[]) => unknown;
  };
};

export type HomeCollections = {
  controller: CollectionsController;
  dialogStore: DialogStore<CollectionRecord | null>;
  reloadSignal: CollectionsReloadSignal;
};

export type HomeArtifactDownloads = {
  busyStore: ArtifactDownloadBusyStore;
};

export type HomeStatusCard = {
  store: ReadOnlyStore<{ snapshot: unknown; cancelDisabled: boolean }>;
  cancelCurrentJob: () => unknown;
};

/** 1 秒 job runtime 轮询写入的 canonical 当前任务状态。 */
export type HomeJobRuntime = {
  store: ReadOnlyStore<{
    jobId?: string;
    snapshot?: LibraryJobItem | null;
    startedAt?: string;
    finishedAt?: string;
  }>;
};

export type StatusDetailStoreActions = {
  resetOverview: () => unknown;
  resetTranslation: () => unknown;
  setOverview?: (overview: unknown) => unknown;
  setTranslation?: (translation: unknown) => unknown;
  setRerunPending?: (pending: boolean) => unknown;
};

export type StatusDetailStore = ReadOnlyStore & {
  actions: StatusDetailStoreActions;
  getSnapshot: () => unknown;
  subscribe: (listener: (snapshot: unknown, meta?: unknown) => void) => () => void;
};

export type StatusDetailDialogStore = DialogStore<{ activeTab?: string } | null>;

export type StatusDetailController = {
  activateDetailTab: (name?: string) => void;
  openStatusDetailDialog: (tabName?: string) => void;
  buildDetailPageUrl: (jobId: string) => string;
  ensureOverviewData: () => Promise<unknown> | unknown;
  ensureTranslationData: () => Promise<unknown> | unknown;
  applyTranslationFilter: (...args: unknown[]) => unknown;
  changeTranslationPage: (...args: unknown[]) => unknown;
  selectTranslationItem: (...args: unknown[]) => unknown;
  replayCurrentItem: (...args: unknown[]) => unknown;
  rerunCurrentJob: () => Promise<unknown> | unknown;
  syncRerunAction: (statusText?: string) => unknown;
};

export type HomeStatusDetail = {
  store: StatusDetailStore;
  dialogStore: StatusDetailDialogStore;
  controller: StatusDetailController;
};

/** 主页阅读入口：跳转独立 reader.html（不再维护 dialogStore / iframe）。 */
export type HomeReader = {
  openReader: (jobId: string, anchor?: unknown, documentId?: string) => unknown;
};

export type StatusAreaBag = {
  store: ReadOnlyStore;
  isVisible: () => boolean;
  setVisible: (visible: boolean) => void;
  setWorkflowSections: (job?: unknown) => void;
  statusAreaPort?: unknown;
};

export type UploadDomRefs = {
  fileInput: HTMLInputElement | null;
};

export type UploadViewActions = {
  patch: (payload: Record<string, unknown>) => unknown;
};

export type WorkflowViewActions = {
  setSelectedGlossaryId: (id: string) => unknown;
  setOcrOnly: (value: boolean) => unknown;
  isOcrOnly: () => boolean;
};

export type WorkflowDialogRuntime = {
  bindEvents: () => () => void;
  close: () => void;
  isOpen: () => boolean;
  openFromEvent: (event?: Event) => void;
  openUpload: () => void;
  requestClose: () => void;
  requestOpenUpload: () => void;
  statePort?: DialogStatePort;
  sync?: () => void;
};

export type StatusDetailHolder = {
  store: StatusDetailStore | null;
  dialogStore: StatusDetailDialogStore | null;
};

// ── Narrow per-domain ports (god-object split) ────────────────────────

/** Status 分域窄端口：仅 store 读侧 + 取消任务 */
export type StatusCardPort = HomeStatusCard;
/** Library 分域窄端口 */
export type LibraryPort = HomeLibrary;
/** Upload 分域窄端口：仅 DOM refs + actions + 只读 store */
export type UploadPort = {
  domRefs: UploadDomRefs;
  viewActions: UploadViewActions;
  store: ReadOnlyStore;
};
/** Text 分域窄端口 */
export type TextPort = {
  store: ReadOnlyStore;
  textOf: (snapshot: unknown, id: string, fallback?: unknown) => unknown;
};
/** Workflow 分域窄端口 */
export type WorkflowPort = {
  viewActions: WorkflowViewActions;
  dialog: WorkflowDialogRuntime;
  store: ReadOnlyStore;
};

// ── Bridge / Services ─────────────────────────────────────────────────

/** @deprecated god-object 兼容别名，请改用按域的 Port 类型 */
export type HomeBridge = {
  setText: (id: string, value?: string) => void;
  setWorkflowSections: (job?: unknown) => void;
  updateJobWarning: (status: unknown) => void;
  resetUploadProgress: () => void;
  resetUploadedFile: () => void;
  applyWorkflowMode: () => void;
  renderPageRangeSummary: () => void;
  setSubmitBusy: (busy: boolean) => void;
  setLinearProgress: () => void;
  updateActionButtons: () => void;
  resetEventsList: () => void;
  activateDetailTab: (name?: string) => void;
  submitForm: (event?: { preventDefault?: () => void } | null) => unknown;
};

/** Composition 核心：生命周期 + ports + 只读 stores */
export type HomeCoreServices = {
  bridge: HomeBridge;
  dispose: () => void;
  features: HomeFeatures;
  initialize: () => void;
  ports: HomePorts;
  stores: HomeStores;
};

/** 各域聚合（按域拆分的神对象替代） */
export type HomeDomainServices = {
  statusArea: StatusAreaBag;
  credentials: HomeCredentials;
  settingsHub: HomeSettingsHub;
  glossaries: HomeGlossaries;
  appUpdate: HomeAppUpdate;
  library: LibraryPort;
  bookDetail: HomeBookDetail;
  collections: HomeCollections;
  artifactDownloads: HomeArtifactDownloads;
  jobRuntime: HomeJobRuntime;
  statusCard: StatusCardPort;
  statusDetail: HomeStatusDetail;
  reader: HomeReader;
};

/** 窄端口别名（显式暴露，供消费者按需取用，避免直达 stores/feature） */
export type HomeNarrowPorts = {
  statusCardPort: StatusCardPort;
  libraryPort: LibraryPort;
  uploadPort: UploadPort;
  textPort: TextPort;
  workflowPort: WorkflowPort;
};

/** HomeServices = Core + Domains + 窄端口 + 视图帮助 */
export type HomeServices = HomeCoreServices &
  HomeDomainServices & {
    /** 窄端口显式别名（与域字段指向同一对象，便于按域解耦消费） */
    statusCardPort: StatusCardPort;
    libraryPort: LibraryPort;
    uploadPort: UploadPort;
    textPort: TextPort;
    workflowPort: WorkflowPort;
    /** text-store 的 selector 帮助函数（配合 useStoreSnapshot） */
    textOf: (snapshot: unknown, id: string, fallback?: unknown) => unknown;
    uploadDomRefs: UploadDomRefs;
    uploadViewActions: UploadViewActions;
    workflowViewActions: WorkflowViewActions;
    workflowDialog: WorkflowDialogRuntime;
  };

/** buildHomeServices 的 views 入参 */
export type HomeServicesViews = {
  textStore: {
    store: AppStore;
    textOf: HomeServices["textOf"];
    setText?: (id: string, value?: string) => void;
  };
  uploadView: {
    store: AppStore;
    domRefs: UploadDomRefs;
    patch: (payload: Record<string, unknown>) => unknown;
  };
  workflowView: {
    store: AppStore;
    setSelectedGlossaryId: (id: string) => unknown;
    setOcrOnly: (value: boolean) => unknown;
    isOcrOnly: () => boolean;
  };
  statusArea: StatusAreaBag;
  workflowDialog: WorkflowDialogRuntime;
};

/** buildHomeServices 的 domains 入参 */
export type HomeServicesDomains = {
  credentials: {
    browserCredentialsFeature: BrowserCredentialsFeature;
    credentialsView: CredentialsViewBag;
    credentialsDialogStore: DialogStore;
    settingsHubDialogStore: DialogStore;
  };
  glossaries: {
    glossariesFeature: GlossariesFeature;
    glossariesView: GlossariesViewBag;
    glossariesDialogStore: DialogStore;
    appUpdateFeature: AppUpdateFeature;
    appUpdateView: AppUpdateViewBag;
  };
  appUpdate: {
    appUpdateFeature: AppUpdateFeature;
    appUpdateView: AppUpdateViewBag;
  };
  status: {
    currentJobStore: AppStore;
    statusCardStore: AppStore;
    statusCardController?: { cancelCurrentJob: () => unknown };
    statusDetailStore: StatusDetailStore;
    statusDetailDialogStore: StatusDetailDialogStore;
    statusDetailController: StatusDetailController;
    artifactDownloadBusyStore: ArtifactDownloadBusyStore;
  };
  library: {
    recentJobsViewPort: RecentJobsReactViewPort;
    recentJobsStatePort: any;
    recentJobActions: RecentJobActions;
    libraryController: LibraryController;
    bookDetailStore: DialogStore<LibraryCardItem | null>;
    collectionsController: CollectionsController;
    collectionManageDialogStore: DialogStore<CollectionRecord | null>;
    collectionsReloadSignal: CollectionsReloadSignal;
    recentJobsReaderPort: { openReader: HomeReader["openReader"] };
  };
};

export type AsyncFn = (...args: unknown[]) => Promise<unknown>;

export type CreateHomeCompositionOptions = {
  documentRef?: Document;
  fetchGlossaries?: AsyncFn;
  submitUploadRequest?: AsyncFn;
  loadPersistedDeveloperConfig?: () => Record<string, unknown>;
  loadPersistedBrowserConfig?: () => Partial<ReturnType<CredentialsStatePort["getCredentials"]>>;
  validateOcrToken?: AsyncFn | null;
  validateDeepSeekToken?: AsyncFn;
  queryDeepSeekBalance?: AsyncFn;
  listCredentials?: AsyncFn;
  createCredential?: AsyncFn;
  updateCredential?: AsyncFn;
  checkApiConnectivity?: AsyncFn | null;
  saveDesktopConfig?: AsyncFn | null;
  initialDesktopMode?: boolean;
  fetchGlossary?: AsyncFn;
  createGlossary?: AsyncFn;
  updateGlossary?: AsyncFn;
  deleteGlossary?: AsyncFn;
  exportGlossaryCsv?: AsyncFn;
  parseGlossaryCsv?: AsyncFn;
  fetchLatestRelease?: AsyncFn;
  appUpdateCachePort?: {
    read: () => { info?: unknown; fresh?: boolean };
    write?: (info: unknown) => void;
  };
  appUpdateAutoCheckEnabled?: boolean;
};

// re-export library helpers used by consumers of HomeServices actions
export type {
  DeleteCardTarget,
  DeleteDocumentsResult,
  JobSubmissionView,
  LibraryCardItem,
  TranslateDocumentPayload,
  UpdateDocumentPayload,
};
