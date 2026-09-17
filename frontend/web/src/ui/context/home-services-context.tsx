// 主页窄口 Context（UI/平台侧）——把 app/home/home-services-context.ts 里那四个
// 「按域拆窄」的先例正式下沉到与 features 同侧（features → ui → platform），
// 让功能可以只依赖窄口而不再 import app 的上帝包，从结构上断开
// features ⇄ app/home/composition/types 的 40 文件环。
//
// 硬约束（layer-boundaries 门禁强制）：
// - 本模块只 import react 与 @/platform/*。**不得** import @/app/* 或
//   @/features/*——一旦引入就又成环（ui 只允许 ui/platform）。
// - 所有窄口类型在本模块内结构化定义，不引用 composition/types 或任何功能类型。
// - app 侧（src/app/home/home-services-context.ts）负责用 composition 的
//   HomeServices 实例映射出这些窄口值并经 HomeShellProviders 注入；未迁移的
//   15 个消费方仍走 app 的 useHomeServices 大包，行为不变。
//
// 兼容回退：窄 Context 缺席时回退到泛型 bag（HomeServicesContext，值类型是
// unknown，由 app 侧灌入 HomeServices 实例），这样只挂 HomeServicesProvider
// 孤立渲染 Shell 的旧测试仍能工作。

import { createContext, createElement, useContext } from "react";
import type { Context, ReactNode } from "react";
import type { DialogStore } from "@/platform/store/dialog-store.js";

/** 窄口只暴露 store 读侧；写入仍经 store.actions / 域 action。
 *  subscribe 只建模单参监听（各域 store 的 notify 均为单参），兼容通用 Store
 *  的双参监听与域内定制的单参订阅。 */
export type HomeReadStore<T = any> = {
  getSnapshot: () => T;
  subscribe: (listener: (snapshot: T) => void) => () => void;
};

// ── 窄口值类型（全部本地结构化定义，不引用功能/composition 类型） ──

export type HomeDialogStoreValue = HomeReadStore;
export type HomeStatusAreaStoreValue = HomeReadStore;

/** services.statusArea —— 域 bag（可见性动作，读侧走 stores.statusArea）。 */
export type HomeStatusAreaValue = {
  isVisible: () => boolean;
  setVisible: (visible: boolean) => void;
  setWorkflowSections?: (job?: unknown) => void;
};

export type HomeWorkflowDialogValue = {
  requestOpenUpload: () => void;
  requestClose: () => void;
  openUpload?: () => void;
  openFromEvent?: (event?: Event) => void;
  close?: () => void;
  isOpen?: () => boolean;
  bindEvents?: () => () => void;
  sync?: () => void;
  statePort?: unknown;
};

export type HomeSettingsHubValue = {
  dialogStore: DialogStore<{ tab?: string } | null>;
};

export type HomeBridgeValue = {
  submitForm: (event?: { preventDefault?: () => void } | null) => unknown;
};

export type HomeLibraryValue = {
  actions: any;
  viewPort: any;
  recentJobsStore: HomeReadStore;
};

export type HomeStatusCardValue = {
  store: HomeReadStore;
  cancelCurrentJob: (...args: any[]) => unknown;
};

export type HomeStatusDetailValue = {
  store: HomeReadStore;
  dialogStore: DialogStore<any>;
  controller: any;
};

export type HomeJobRuntimeValue = {
  store: HomeReadStore;
};

export type HomeBookDetailValue = {
  dialogStore: DialogStore<any>;
};

export type HomeCollectionsValue = {
  controller: any;
  reloadSignal: any;
  dialogStore: DialogStore<any>;
};

export type HomeArtifactDownloadsValue = {
  busyStore: HomeReadStore;
};

/** uploadView 读侧之外 TranslationOptionsPanel 还经 .actions 写页码范围。 */
export type HomeUploadViewStoreValue = HomeReadStore & { actions?: any };

export type HomeWorkflowViewActionsValue = {
  setSelectedGlossaryId: (id: string) => unknown;
  setOcrOnly: (value: boolean) => unknown;
  isOcrOnly: () => boolean;
};

export type HomeUploadDomRefsValue = {
  fileInput: HTMLInputElement | null;
};

export type HomeFeaturesValue = {
  workflowFeature?: any;
  uploadFeature?: any;
  browserCredentialsFeature?: any;
  glossariesFeature?: any;
  appUpdateFeature?: any;
  appActionsFeature?: any;
  jobRuntimeFeature?: any;
  recentJobsFeature?: any;
  artifactDownloadsFeature?: any;
  appShellFeature?: any;
};

export type HomeCredentialsStatePortValue = {
  store: HomeReadStore;
};

export type HomeUploadStatePortValue = {
  getSnapshot?: () => { documentId?: string } | unknown;
};

/** 主页阅读入口（跳独立 reader.html）。 */
export type HomeReaderValue = {
  openReader: (jobId: string, anchor?: unknown, documentId?: string) => unknown;
};

/** app 侧映射出的窄口聚合；HomeShellProviders 按此一次灌入全部窄 Context。 */
export type HomeNarrowServices = {
  dialogStore: HomeDialogStoreValue;
  statusAreaStore: HomeStatusAreaStoreValue;
  statusArea: HomeStatusAreaValue;
  workflowDialog: HomeWorkflowDialogValue;
  settingsHub: HomeSettingsHubValue;
  bridge: HomeBridgeValue;
  library: HomeLibraryValue;
  statusCard: HomeStatusCardValue;
  statusDetail: HomeStatusDetailValue;
  jobRuntime: HomeJobRuntimeValue;
  bookDetail: HomeBookDetailValue;
  collections: HomeCollectionsValue;
  artifactDownloads: HomeArtifactDownloadsValue;
  textStore: HomeReadStore;
  homeStateStore: HomeReadStore;
  workflowViewStore: HomeReadStore;
  uploadViewStore: HomeUploadViewStoreValue;
  credentialsViewStore: HomeReadStore;
  features: HomeFeaturesValue;
  workflowViewActions: HomeWorkflowViewActionsValue;
  uploadDomRefs: HomeUploadDomRefsValue;
  credentialsStatePort: HomeCredentialsStatePortValue;
  uploadStatePort: HomeUploadStatePortValue;
  reader: HomeReaderValue;
};

// ── 泛型 bag + 窄 Context ──

export const HomeServicesContext = createContext<unknown>(null);
export const HomeServicesProvider = HomeServicesContext.Provider;

export const HomeDialogStoreContext = createContext<HomeDialogStoreValue | null>(null);
export const HomeStatusAreaStoreContext = createContext<HomeStatusAreaStoreValue | null>(null);
export const HomeStatusAreaContext = createContext<HomeStatusAreaValue | null>(null);
export const HomeWorkflowDialogContext = createContext<HomeWorkflowDialogValue | null>(null);
export const HomeSettingsHubContext = createContext<HomeSettingsHubValue | null>(null);
export const HomeBridgeContext = createContext<HomeBridgeValue | null>(null);
export const HomeLibraryContext = createContext<HomeLibraryValue | null>(null);
export const HomeStatusCardContext = createContext<HomeStatusCardValue | null>(null);
export const HomeStatusDetailContext = createContext<HomeStatusDetailValue | null>(null);
export const HomeJobRuntimeContext = createContext<HomeJobRuntimeValue | null>(null);
export const HomeBookDetailContext = createContext<HomeBookDetailValue | null>(null);
export const HomeCollectionsContext = createContext<HomeCollectionsValue | null>(null);
export const HomeArtifactDownloadsContext = createContext<HomeArtifactDownloadsValue | null>(null);
export const HomeTextStoreContext = createContext<HomeReadStore | null>(null);
export const HomeHomeStateStoreContext = createContext<HomeReadStore | null>(null);
export const HomeWorkflowViewStoreContext = createContext<HomeReadStore | null>(null);
export const HomeUploadViewStoreContext = createContext<HomeUploadViewStoreValue | null>(null);
export const HomeCredentialsViewStoreContext = createContext<HomeReadStore | null>(null);
export const HomeFeaturesContext = createContext<HomeFeaturesValue | null>(null);
export const HomeWorkflowViewActionsContext = createContext<HomeWorkflowViewActionsValue | null>(null);
export const HomeUploadDomRefsContext = createContext<HomeUploadDomRefsValue | null>(null);
export const HomeCredentialsStatePortContext = createContext<HomeCredentialsStatePortValue | null>(null);
export const HomeUploadStatePortContext = createContext<HomeUploadStatePortValue | null>(null);
export const HomeReaderContext = createContext<HomeReaderValue | null>(null);

// ── 窄 hook 工厂：窄 Context 缺失时回退到 app 灌入的 HomeServices 大包 ──

function createNarrowHook<T>(
  context: Context<T | null>,
  pick: (bag: any) => T,
  name: string,
): () => T {
  return function useNarrow(): T {
    const narrow = useContext(context);
    const bag = useContext(HomeServicesContext);
    if (narrow) return narrow;
    if (!bag) {
      throw new Error(`${name} 必须在 <HomeShellProviders> 内使用`);
    }
    return pick(bag);
  };
}

export const useHomeDialogStore = createNarrowHook(
  HomeDialogStoreContext,
  (s) => s.stores.dialog,
  "useHomeDialogStore",
);
export const useHomeStatusAreaStore = createNarrowHook(
  HomeStatusAreaStoreContext,
  (s) => s.stores.statusArea,
  "useHomeStatusAreaStore",
);
export const useHomeStatusArea = createNarrowHook(
  HomeStatusAreaContext,
  (s) => s.statusArea,
  "useHomeStatusArea",
);
export const useHomeWorkflowDialog = createNarrowHook(
  HomeWorkflowDialogContext,
  (s) => s.workflowDialog,
  "useHomeWorkflowDialog",
);
export const useHomeSettingsHub = createNarrowHook(
  HomeSettingsHubContext,
  (s) => s.settingsHub,
  "useHomeSettingsHub",
);
export const useHomeBridge = createNarrowHook(
  HomeBridgeContext,
  (s) => s.bridge,
  "useHomeBridge",
);
export const useHomeLibrary = createNarrowHook(
  HomeLibraryContext,
  (s) => s.library,
  "useHomeLibrary",
);
export const useHomeStatusCard = createNarrowHook(
  HomeStatusCardContext,
  (s) => s.statusCard,
  "useHomeStatusCard",
);
export const useHomeStatusDetail = createNarrowHook(
  HomeStatusDetailContext,
  (s) => s.statusDetail,
  "useHomeStatusDetail",
);
export const useHomeJobRuntime = createNarrowHook(
  HomeJobRuntimeContext,
  (s) => s.jobRuntime,
  "useHomeJobRuntime",
);
export const useHomeBookDetail = createNarrowHook(
  HomeBookDetailContext,
  (s) => s.bookDetail,
  "useHomeBookDetail",
);
export const useHomeCollections = createNarrowHook(
  HomeCollectionsContext,
  (s) => s.collections,
  "useHomeCollections",
);
export const useHomeArtifactDownloads = createNarrowHook(
  HomeArtifactDownloadsContext,
  (s) => s.artifactDownloads,
  "useHomeArtifactDownloads",
);
export const useHomeTextStore = createNarrowHook(
  HomeTextStoreContext,
  (s) => s.stores.text,
  "useHomeTextStore",
);
export const useHomeHomeStateStore = createNarrowHook(
  HomeHomeStateStoreContext,
  (s) => s.stores.homeState,
  "useHomeHomeStateStore",
);
export const useHomeWorkflowViewStore = createNarrowHook(
  HomeWorkflowViewStoreContext,
  (s) => s.stores.workflowView,
  "useHomeWorkflowViewStore",
);
export const useHomeUploadViewStore = createNarrowHook(
  HomeUploadViewStoreContext,
  (s) => s.stores.uploadView,
  "useHomeUploadViewStore",
);
export const useHomeCredentialsViewStore = createNarrowHook(
  HomeCredentialsViewStoreContext,
  (s) => s.stores.credentialsView,
  "useHomeCredentialsViewStore",
);
export const useHomeFeatures = createNarrowHook(
  HomeFeaturesContext,
  (s) => s.features,
  "useHomeFeatures",
);
export const useHomeWorkflowViewActions = createNarrowHook(
  HomeWorkflowViewActionsContext,
  (s) => s.workflowViewActions,
  "useHomeWorkflowViewActions",
);
export const useHomeUploadDomRefs = createNarrowHook(
  HomeUploadDomRefsContext,
  (s) => s.uploadDomRefs,
  "useHomeUploadDomRefs",
);
export const useHomeCredentialsStatePort = createNarrowHook(
  HomeCredentialsStatePortContext,
  (s) => s.ports.credentialsStatePort,
  "useHomeCredentialsStatePort",
);
export const useHomeUploadStatePort = createNarrowHook(
  HomeUploadStatePortContext,
  (s) => s.ports.uploadStatePort,
  "useHomeUploadStatePort",
);
export const useHomeReader = createNarrowHook(
  HomeReaderContext,
  (s) => s.reader,
  "useHomeReader",
);

// ── 一次灌入所有窄 Context（app 侧映射 HomeServices → HomeNarrowServices） ──

export function HomeShellProviders({ services, children }: { services: HomeNarrowServices; children: ReactNode }) {
  const providers: Array<[Context<any>, any]> = [
    [HomeDialogStoreContext, services.dialogStore],
    [HomeStatusAreaStoreContext, services.statusAreaStore],
    [HomeStatusAreaContext, services.statusArea],
    [HomeWorkflowDialogContext, services.workflowDialog],
    [HomeSettingsHubContext, services.settingsHub],
    [HomeBridgeContext, services.bridge],
    [HomeLibraryContext, services.library],
    [HomeStatusCardContext, services.statusCard],
    [HomeStatusDetailContext, services.statusDetail],
    [HomeJobRuntimeContext, services.jobRuntime],
    [HomeBookDetailContext, services.bookDetail],
    [HomeCollectionsContext, services.collections],
    [HomeArtifactDownloadsContext, services.artifactDownloads],
    [HomeTextStoreContext, services.textStore],
    [HomeHomeStateStoreContext, services.homeStateStore],
    [HomeWorkflowViewStoreContext, services.workflowViewStore],
    [HomeUploadViewStoreContext, services.uploadViewStore],
    [HomeCredentialsViewStoreContext, services.credentialsViewStore],
    [HomeFeaturesContext, services.features],
    [HomeWorkflowViewActionsContext, services.workflowViewActions],
    [HomeUploadDomRefsContext, services.uploadDomRefs],
    [HomeCredentialsStatePortContext, services.credentialsStatePort],
    [HomeUploadStatePortContext, services.uploadStatePort],
    [HomeReaderContext, services.reader],
  ];
  return providers.reduceRight<ReactNode>(
    (acc, [context, value]) => createElement(context.Provider, { value }, acc),
    children,
  );
}

// ── Tabs 本地态 Context（tabs 切页只改本地 state + URL ?tab=，不碰 store） ──

export type HomeTabsValue = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export const HomeTabsContext = createContext<HomeTabsValue | null>(null);
export const HomeTabsProvider = HomeTabsContext.Provider;

export function useHomeTabs(): HomeTabsValue {
  const tabs = useContext(HomeTabsContext);
  if (!tabs) {
    throw new Error("useHomeTabs 必须在 <HomeTabsProvider> 内使用(HomeApp 维护 tabs 本地态)");
  }
  return tabs;
}
