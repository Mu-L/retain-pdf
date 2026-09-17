// 组合根下发通道:单个页级 Context(总计划「状态策略」第 3 条)。
// entry.jsx 先建 composition,再经 <HomeServicesProvider> 灌给组件树;
// Shell 层(TopBar/BottomBar/home-paper-stage)只取窄口,不大包直取。
//
// 本文件现在是 app 侧**适配层**:窄 Context/hook/provider 已下沉到
// @/ui/context/home-services-context.js(平台/UI 侧,不 import app/features),
// 这样下一步迁移功能时它们可直接 features → ui 消费,不再回头 import app 的
// 上帝包(composition/types 聚合了所有功能类型,是 40 文件环的根)。
// 这里仍负责两件事,行为与拆窄前一致:
//   1) 保留 useHomeServices + HomeServicesProvider 大包,未迁移的 15 个消费方照旧;
//   2) 用 composition 的 HomeServices 实例映射出窄口聚合,经 HomeShellProviders 注入。
// HomeTabsProvider 承载 tabs 本地态(?tab= 同步在 HomeApp 维护)。

import { createElement, useContext } from "react";
import type { ReactNode } from "react";
import {
  HomeShellProviders as NarrowHomeShellProviders,
} from "@/ui/context/home-services-context.js";
import type { HomeNarrowServices } from "@/ui/context/home-services-context.js";
import type { HomeServices } from "./composition/types.js";

// 兼容旧导出:窄口 hook/provider 原样再转出,消费方 import 路径不变。
export {
  HomeTabsContext,
  HomeTabsProvider,
  useHomeTabs,
  useHomeDialogStore,
  useHomeWorkflowDialog,
  useHomeSettingsHub,
  useHomeBridge,
  useHomeLibrary,
  useHomeStatusCard,
  useHomeStatusDetail,
  useHomeJobRuntime,
  useHomeBookDetail,
  useHomeCollections,
  useHomeAppUpdate,
  useHomeGlossaries,
  useHomeCredentials,
  useHomeArtifactDownloads,
  useHomeTextStore,
  useHomeHomeStateStore,
  useHomeWorkflowViewStore,
  useHomeUploadViewStore,
  useHomeCredentialsViewStore,
  useHomeFeatures,
  useHomeWorkflowViewActions,
  useHomeUploadDomRefs,
  useHomeCredentialsStatePort,
  useHomeUploadStatePort,
} from "@/ui/context/home-services-context.js";
export type { HomeTabsValue, HomeNarrowServices } from "@/ui/context/home-services-context.js";


/** composition 的 HomeServices → 平台侧窄口聚合(同一实例按域切片,不新建对象)。 */
function toNarrowServices(services: HomeServices): HomeNarrowServices {
  return {
    dialogStore: services.stores.dialog,
    workflowDialog: services.workflowDialog,
    settingsHub: services.settingsHub,
    bridge: services.bridge,
    library: services.library,
    statusCard: services.statusCard,
    statusDetail: services.statusDetail,
    jobRuntime: services.jobRuntime,
    bookDetail: services.bookDetail,
    collections: services.collections,
    appUpdate: services.appUpdate,
    glossaries: services.glossaries,
    credentials: services.credentials,
    artifactDownloads: services.artifactDownloads,
    textStore: services.stores.text,
    homeStateStore: services.stores.homeState,
    workflowViewStore: services.stores.workflowView,
    uploadViewStore: services.stores.uploadView,
    credentialsViewStore: services.stores.credentialsView,
    features: services.features,
    workflowViewActions: services.workflowViewActions,
    uploadDomRefs: services.uploadDomRefs,
    credentialsStatePort: services.ports.credentialsStatePort,
    uploadStatePort: services.ports.uploadStatePort,
    reader: services.reader,
  };
}

/**
 * Shell 窄口注入:外层保留 HomeServicesProvider(深层 features 经 useHomeServices
 * 照旧消费),内层按域灌入全部窄 Context(供已迁移/待迁移的消费方直取)。
 */
export function HomeShellProviders({ services, children }: { services: HomeServices; children: ReactNode }) {
  // 泛型大包（HomeServicesContext）已退役：这里不再套外层 Provider，
  // 只把 composition 的 HomeServices 按域映射成窄口聚合往下灌。
  return createElement(NarrowHomeShellProviders, { services: toNarrowServices(services), children });
}
