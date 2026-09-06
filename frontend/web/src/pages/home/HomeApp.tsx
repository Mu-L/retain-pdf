// home 页 React 编排根。
//
// 结构对照 partials/main-content.html + dialogs.html 逐区块镜像;顶部只留
// 品牌 + 图书馆/分类分栏(AppTopBar.jsx,去掉白卡背景);添加/搜索/设置 三样
// 收进底部一条居中浮动栏(AppBottomBar.jsx,取代早期分离的 AppBottomActions +
// LibrarySearchDock 两个浮岛)。
// 其余区块(library-view 网格、status 卡、credentials/glossaries/status-detail 等)
// 已陆续接上;ReaderDialog 仅导航到 reader.html(无 UI)。
// 占位自定义元素标签(<recent-jobs-dialog> 等)在新世界不注册定义,惰性无副作用。
//
// Shell 收口:HomeApp 只做 providers 嵌套(HomeShellProviders + HomeTabsProvider),
// HomeShell 承载 tabs 本地态 + AppTopBar/BottomBar + home-paper-stage。
// tabs 切页只改本地 state + URL ?tab=(replaceState,不导航、不碰 store)。

import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import {
  HomeShellProviders,
  HomeTabsProvider,
  useHomeStatusAreaStore,
  useHomeTabs,
} from "./home-services-context.js";
import type { HomeServices } from "./composition/types.js";
import { AppTopBar } from "./features/app-shell/AppTopBar.jsx";
import { AppBottomBar } from "./features/app-shell/AppBottomBar.jsx";
import { MockModeBanner } from "./features/app-shell/MockModeBanner.jsx";
import { TranslationWorkflowDialog } from "./features/workflow/TranslationWorkflowDialog.jsx";
import {
  RecentJobsLibrary,
  CollectionsView,
  FavoritesView,
  BookDetailDialog,
} from "./features/library/index.js";
import { HiddenCredentialInputs } from "./features/credentials/HiddenCredentialInputs.jsx";
import { StatusCard } from "./features/status/StatusCard.jsx";
import { CredentialsWorkbench } from "./features/credentials/CredentialsWorkbench.jsx";
import { AppUpdateBanner } from "./features/app-update/AppUpdateBanner.jsx";
import { useStoreSnapshot } from "@/shared/react/use-store.js";
// CategoriesView 为历史别名（同 CollectionsView），保留在 library/index 兼容导出
import { HomeAskView } from "./features/home-ask/HomeAskView.js";
import { CredentialsDialog } from "./features/credentials/CredentialsDialog.jsx";
import { GlossariesDialog } from "./features/glossaries/GlossariesDialog.jsx";
import { SettingsHubDialog } from "./features/settings/SettingsHubDialog.jsx";
import { StatusDetailDialog } from "./features/status-detail/StatusDetailDialog.jsx";
import { ReaderDialog } from "./features/reader/ReaderDialog.jsx";
import { SoftReaderHost } from "./features/reader/SoftReaderHost.jsx";
import { CollectionManageDialog } from "./features/collections/CollectionManageDialog.jsx";
import { DownloadToastHost } from "@/shared/react/DownloadToastHost.jsx";
import {
  readInitialLibraryTabFromReturn,
  useHomeReturnRestore,
} from "./features/library/page/useHomeReturnRestore.js";
// library-search-island 自定义元素的唯一注册点。旧世界由 src/js/components/index.js
// 兜底 side-effect import 注册;该文件随 cutover 删除后,注册链路断了会导致下方
// JSX 里的 <library-search-island> 标签渲染成惰性空标签(数据契约上仍在,但搜索
// 功能静默失效——只有真实浏览器渲染能看出来,jsdom 不会报错)。这里经 composition/external
// 显式接管注册，避免 pages 层直连 src/js（门禁：home features/pages → external）。
import "./composition/external/islands.js";

const HOME_TABS = ["library", "categories", "favorites", "ask"] as const;
type HomeTab = (typeof HOME_TABS)[number];

function isHomeTab(tab: string): tab is HomeTab {
  return (HOME_TABS as readonly string[]).includes(tab);
}

// 初始 tab:显式 ?tab= 深链优先(可分享/刷新保持),否则沿用阅读器返回恢复,
// 兜底图书馆。非法值一律回图书馆,不抛错。
function readInitialHomeTab(): string {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("tab") ?? "";
    if (isHomeTab(fromUrl)) return fromUrl;
  } catch {
    // 非浏览器/jsdom 无 location 时忽略,走返回恢复
  }
  const fromReturn = readInitialLibraryTabFromReturn();
  return isHomeTab(fromReturn) ? fromReturn : "library";
}

// tabs 切页的唯一写出口:只动 URL search,不导航、不碰 store。
function writeHomeTabToSearch(tab: string) {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState(null, "", url);
  } catch {
    // jsdom/旧环境缺 history 时静默忽略——本地 state 照常切换
  }
}

// tabs 本地态拥有者:state + ?tab= 同步,经 HomeTabsProvider 下发给 Shell。
function HomeTabsRoot({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(readInitialHomeTab);
  const onTabChange = useCallback((tab: string) => {
    if (!isHomeTab(tab)) return;
    setActiveTab(tab);
    writeHomeTabToSearch(tab);
  }, []);
  return <HomeTabsProvider value={{ activeTab, onTabChange }}>{children}</HomeTabsProvider>;
}

function HomeShell() {
  // tabs 来自窄口,不再由 Shell 自持 useState(状态上移到 HomeTabsRoot)。
  const { activeTab } = useHomeTabs();
  const isLibraryTab = activeTab === "library";
  // 历史契约 key "categories" == 领域 collections（见 LibraryTopTabs/COLLECTIONS_TAB_KEY 映射）
  const isCategoriesTab = activeTab === "categories";
  const isCollectionsTab = isCategoriesTab; // 统一别名，领域语义用 collections
  const isFavoritesTab = activeTab === "favorites";
  const isAskTab = activeTab === "ask";
  // #31 批量选择工具栏和底部栏都固定在底部居中,批量模式期间底部栏用 CSS
  // 隐藏(不卸载——搜索 input 卸载会让 library-search-island 的引用失效)让位
  // 给批量工具栏,两者不同时可见。
  const [batchModeActive, setBatchModeActive] = useState(false);

  // 合集/收藏/AI tab：视图挂载即可尝试恢复 panel 滚动（图书馆由 RecentJobsLibrary 在有列表后恢复）
  useHomeReturnRestore(isCategoriesTab || isFavoritesTab || isAskTab);

  // Decoupled composition: HomeShell 只取 statusArea 窄口(读侧),跨域 slot
  // 照旧由 props 下发,不再 useHomeServices 大包直取 services.stores。
  const statusAreaStore = useHomeStatusAreaStore();
  const statusAreaSnap = useStoreSnapshot(statusAreaStore);

  return (
    <>
      <main id="app-shell" className="page app-shell" data-home-spa="">
        <AppTopBar />
        <MockModeBanner />
        {/* 纸心舞台：材质/比例层级（非传统符号拼贴）；侧栏筛选暂不做 */}
        <div className="home-paper-stage">
          {isLibraryTab ? (
            <>
              <RecentJobsLibrary {...({ onBatchModeChange: setBatchModeActive } as any)} />
              <AppBottomBar showSearch hidden={batchModeActive} />
              <library-search-island></library-search-island>
            </>
          ) : isCollectionsTab ? (
            <>
              <CollectionsView />
              <AppBottomBar showSearch={false} />
            </>
          ) : isFavoritesTab ? (
            <>
              <FavoritesView />
              <AppBottomBar showSearch={false} />
            </>
          ) : isAskTab ? (
            // AI 对话不挂底部「上传 / 设置」浮栏，避免压住输入区
            <HomeAskView />
          ) : null}
        </div>
        <button id="open-query-btn" type="button" className="secondary hidden" aria-hidden="true">最近任务</button>
        {/* 3b 占位:最近任务对话框 */}
        <recent-jobs-dialog></recent-jobs-dialog>
        <SettingsHubDialog
          credentialsWorkbenchSlot={<CredentialsWorkbench />}
          appUpdateBannerSlot={<AppUpdateBanner />}
        />
        <TranslationWorkflowDialog
          hiddenInputsSlot={<HiddenCredentialInputs />}
          statusCardSlot={
            <StatusCard
              visible={Boolean(statusAreaSnap.visible)}
              showResultActions
              showHiddenContract
              rootId="job-status-card"
            />
          }
        />
      </main>
      {/* dialogs.html 区块:credentials 域已 React 化,其余占位(3b) */}
      <CredentialsDialog />
      <GlossariesDialog />
      <developer-auth-dialog></developer-auth-dialog>
      <developer-settings-dialog></developer-settings-dialog>
      <StatusDetailDialog />
      <ReaderDialog />
      {/* 软打开阅读器：全屏层，主页不卸载（关 × 不刷新） */}
      <SoftReaderHost />
      <CollectionManageDialog />
      <BookDetailDialog />
      <DownloadToastHost />
    </>
  );
}

export function HomeApp({ services }: { services: HomeServices }) {
  return (
    <HomeShellProviders services={services}>
      <HomeTabsRoot>
        <HomeShell />
      </HomeTabsRoot>
    </HomeShellProviders>
  );
}
