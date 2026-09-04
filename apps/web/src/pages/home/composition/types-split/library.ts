// types-split/library.ts — 文库域。
import type { DialogStore } from "../../state/dialog-store.js";
import type {
  DeleteCardTarget,
  DeleteDocumentsResult,
  JobSubmissionView,
  LibraryCardItem,
  LibraryController,
  RecentJobsReactViewPort,
  TranslateDocumentPayload,
  UpdateDocumentPayload,
} from "../../features/library/types.js";
import type { ReadOnlyStore } from "./common.js";

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
  /** 统一提交入口（按 workflow 分流到 ocr/translate） */
  submitDocument: (documentId?: string | null, payload?: unknown) => Promise<unknown>;
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

// re-export library helpers used by consumers of HomeServices actions
export type {
  DeleteCardTarget,
  DeleteDocumentsResult,
  JobSubmissionView,
  LibraryCardItem,
  TranslateDocumentPayload,
  UpdateDocumentPayload,
};
