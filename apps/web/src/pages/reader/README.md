# 阅读器目录（`pages/reader`）

默认引擎：**react-pdf**（`ReaderAppReactPdf`）。  
回退：`?engine=legacy`（`ReaderApp` 内分支 + `legacy/**` + `src/js/reader` 命令式引擎）。

> **隔离声明（Agent-C / Phase1）**：`legacy/**` 明确不再迁入 `packages/reader`（`@retainpdf/reader` 仅含 react-pdf 引擎）。新功能不要进 `legacy`，样式真值保留在 `apps/web/src/styles`，构建时通过 `reader-legacy.css` 动态加载（见下文“样式真值”）。

## 三层边界

```text
┌─────────────────────────────────────────────────────────────┐
│  A. 新引擎 UI/逻辑（默认）                                    │
│     hooks/  pdf/  annotations/  components/react-pdf/         │
│     ReaderAppReactPdf.tsx                                     │
│     js 依赖 → 只经 ./external.ts                              │
└──────────────────────────┬──────────────────────────────────┘
                           │ 仅共享 ports
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  B. 共享 ports（js/reader 子集 + 少量 config/api）            │
│     data-port / config-port / resource-resolver /             │
│     pdf-document(resolve URL) / page-state(文案常量)          │
│     经 pages/reader/external.ts 出口                          │
└──────────────────────────┬──────────────────────────────────┘
                           │ legacy 可多用
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  C. 旧命令式引擎（?engine=legacy）                            │
│     pages/reader/legacy/**  +  js/reader 全部                   │
│     pdf-controller / pdf-renderer / favorites / regions…      │
│     允许直接 import js/reader（不要塞进 external 冒充共享）    │
└─────────────────────────────────────────────────────────────┘
```

| 层 | 路径 | 新功能放哪 |
|----|------|------------|
| **A 新引擎** | `hooks/`、`pdf/`、`annotations/`、`components/react-pdf/` | 批注、缩放、对照、滚动锚点 |
| **B 共享** | `external.ts` → `js/reader/{data,config,resource,…}` | 仅会话/资源/URL，不写 UI |
| **C legacy** | `legacy/**` + `js/reader/**` 主力 | **不要**加新功能 |

## 布局

```text
pages/reader/
  entry.tsx / ReaderApp.tsx / ReaderAppReactPdf.tsx
  external.ts                # 新引擎对 js/* 唯一出口
  hooks/                     # 会话、缩放、锚点、批注、控制器
  pdf/                       # Document/Page、滚动、行高
  annotations/               # 新批注 + localStorage
  components/react-pdf/      # 新引擎 UI
  legacy/                    # 旧壳 UI + boot + 抽屉 AI
    components/
    hooks/use-reader-boot.ts
    state/
    ai/
```

## 入口

| 文件 | 作用 |
|------|------|
| `entry.tsx` | 挂载 `ReaderApp` |
| `ReaderApp.tsx` | `engine=legacy` → 旧壳，否则 `ReaderAppReactPdf` |
| `hooks/use-reader-react-controller.ts` | 新引擎逻辑总装 |
| `external.ts` | 新引擎共享 js 依赖 |

## 不要

- 新功能接到 `js/reader/selection-favorites` / `favorites/*`  
- 把 `pdf-controller` 引进 `external.ts` 给新引擎用  
- 假设组件仍在扁平 `components/*`（旧 UI 已在 `legacy/components/`）

## 隔离不变量（Phase1 收敛）

| 不变量 | 说明 | 校验 |
|--------|------|------|
| **legacy 不迁入 packages** | `legacy/**`（11 组件 + `hooks/use-reader-boot` + `state/*` + `ai/*`，计 17 文件）保留在 `apps/web`，不进入 `packages/reader` | `packages/reader/src` 仅含 `legacy/ai/answer-view.ts` 一个薄代理（见 `packages/reader/src/LEGACY.md`），无 `components/state/hooks` |
| **packages/reader 仅 react-pdf** | 独立包只含 `hooks/pdf/annotations/components/react-pdf/tools/shared` 真值；`entry.tsx` / `ReaderApp` 分支留在 `apps/web` | `rg "from.*legacy" packages/reader --glob '*.ts*'` 仅一条 `describeToolEvent` 桥接（有意保留） |
| **样式真值不迁移** | `reader.css` 与 `reader-legacy.css` 均保留在 `apps/web/src/styles`，不迁入 `packages/reader` | `packages/reader/styles.css` 为分发占位；真值见 `apps/web/src/styles/README.md` |
| **legacy 动态 CSS** | 默认 react-pdf 不加载 legacy 样式；仅 `?engine=legacy|classic` 时由 `entry.tsx#ensureLegacyReaderCss` 注入 `dist/css/reader-legacy.css` | `entry.tsx:62-90` + `styles/entries/reader-legacy.css:1-36` |

## 依赖审计（2026-08-20）

**`legacy/**` 外部引用**（`rg "legacy" apps/web/src/pages/reader`）：

- `ReaderApp.tsx:4-18` — 全部 10 个 legacy 组件/hook/store 仅在此文件的 `ReaderAppLegacy` 分支内 import。
- `entry.tsx:51-90` — 仅 `resolveReaderEngine()==“legacy”` 时注入 `reader-legacy.css`；无其他运行时依赖。
- `components/react-pdf/assistant/use-reader-ask-runtime.ts:11` — `import { describeToolEvent } from "../../../legacy/ai/answer-view.js"`（唯一跨层引用；语义为工具事件文案，packages/reader 已通过 `src/legacy/ai/answer-view.ts` 薄代理复用，见 `packages/reader/src/LEGACY.md` 的例外说明）。

**`js/reader` 依赖分层**：

- 新引擎（`hooks/pdf/annotations/components/react-pdf`）仅经 `external.ts` 触达共享子集：`data-port/config-port/resource-resolver/pdf-document/page-state/downloads/markdown-math/ai/*`（`external.ts:24-129`）。
- legacy 直连全部命令式引擎：`pdf-controller/pdf-renderer/viewer-mount-flow/selection-favorites/region-* /chrome/mode/column-resizer…`（`legacy/hooks/use-reader-boot.ts:20-64` 单点聚合 16+ 模块；`legacy/ai/use-reader-ai-chat.ts` 直连 `ai/chat-history-store`）。
- `packages/reader` 零直连 `apps/web/src/js/*`，仅经 `src/adapters.ts` / `src/external.ts` 代理（ Formally `src/js/reader` 保留在 `apps/web`，不迁入 packages）。

> 审计命令：`rg -n "from.*legacy|from.*js/reader" apps/web/src/pages/reader --glob '*.{ts,tsx}'` + `rg -n "legacy" packages/reader/src`。未发现除上述外的非预期引用。

## 样式真值（保留在 apps/web）

| 入口 | 产物 | 加载时机 | 备注 |
|------|------|----------|------|
| `src/styles/entries/reader.css` | `dist/css/reader.css` | `reader.html` 常驻 | tokens/base/layout/chrome/content/react-pdf/fab… 不含 legacy |
| `src/styles/entries/reader-legacy.css` | `dist/css/reader-legacy.css` | `entry.tsx#ensureLegacyReaderCss` 仅 `?engine=legacy` 注入 | `@source` 扫描 `legacy/**` + `js/reader/**` + `islands/reader-annotations`；追加 `layout-legacy/chrome-legacy/annotations/side-drawer/favorites/selection/ai/markdown/region-popover` |

**为何不迁入 `packages/reader`**：① legacy 样式与三栏/抽屉/选区强耦合，迁移会把 dead CSS 带进独立包；② `reader.css` 与主站 `home.css/detail.css` 共享 `tokens/base/ambient`，保留在 `apps/web` 便于单一 Tailwind 扫描与按页拆包；③ `packages/reader/dist/retain-reader.css` 当前为分发占位，真值仍在 `apps/web`，切仓库时再抽离。

`entry.tsx` 的 `href` 推导：`reader.css?v=hash` → `reader-legacy.css`（同目录、去 hash，防止错绑），并以 `data-reader-legacy-css` 去重。

## 未迁移清单（有意保留在 apps/web）

> “剩余 16 文件”指 `legacy/**` 17 文件中除 `legacy/ai/answer-view.ts`（已在 `packages/reader/src/legacy/ai/answer-view.ts` 薄代理）的其余 16 个；`js/reader` 全部与 `reader-legacy.css` 亦有意不迁。

| 文件 | 行数/职责 | 不迁原因 |
|------|-----------|----------|
| `legacy/components/ReaderTopbar.tsx` | 旧顶栏壳 | legacy 独占 UI，后续随 `?engine=legacy` 一并下线 |
| `legacy/components/ReaderTopbarActions.tsx` | 顶栏工具按钮 | 同上；新引擎由 `components/react-pdf/ReaderToolsBar` 接管 |
| `legacy/components/ReaderLeftNav.tsx` | 左侧导航 | 旧三栏导航，新引擎无此栏 |
| `legacy/components/ReaderColumnChrome.tsx` | 三栏 chrome | 强依赖 `layout-legacy.css` |
| `legacy/components/ReaderScrollShell.tsx` | 滚动容器 | 命令式 `pdf-controller` 挂载点 |
| `legacy/components/PdfPane.tsx` | pdf.js 宿主 | 依赖 `pdf-renderer/viewer-mount-flow` |
| `legacy/components/ReaderPageHud.tsx` | 底栏 HUD | legacy 页码条 |
| `legacy/components/ReaderSideDrawers.tsx` | 4 抽屉（收藏/批注/Markdown/AI） | 新引擎由 `ReaderFavoritesPanel/NotesFloat/FloatMarkdown/FloatAI` 重做 |
| `legacy/components/ReaderAiChat.tsx` | 旧 AI 抽屉容器 | 已被 `assistant/ReaderAssistantThread` 取代 |
| `legacy/components/ReaderBootLoading.tsx` | 启动 loading | 旧 boot 流程 |
| `legacy/components/ReaderDownloadMenu.tsx` | 下载菜单 | 旧下载面，新引擎在 `ReaderFab` |
| `legacy/components/index.ts` | 旧组件 re-export | 仅 `ReaderAppLegacy` 消费 |
| `legacy/hooks/use-reader-boot.ts` | 旧引擎总装（~700 行） | 聚合 16+ `js/reader` 模块，不可复用 |
| `legacy/state/drawer-store.ts` | 抽屉 store | 已被 `hooks/use-reader-tools` 取代 |
| `legacy/state/use-drawer-active.ts` | 抽屉 active hook | 同上 |
| `legacy/ai/use-reader-ai-chat.ts` | 旧 AI chat hook | 已被 `use-reader-ask-runtime` 取代 |
| `apps/web/src/js/reader/**`（30+ 文件） | 命令式引擎主力 | 全部服务 `?engine=legacy`，新引擎仅复用 5 个 ports（经 `adapters` 注入） |
| `src/styles/entries/reader-legacy.css` + `src/styles/reader/*-legacy.css` | legacy 样式 | 按“样式真值”保留，不入 packages |

验证 `?engine=legacy` 仍可工作：`apps/web/src/pages/reader/legacy/**/*` 均未删除，仅文档隔离；`ReaderApp.tsx:22-55` 的 `resolveReaderEngine()==“legacy”? <ReaderAppLegacy/> : <ReaderAppReactPdf/>` 分支与 `entry.tsx:88-90` 的 CSS 注入保持原样。回归时打开 `reader.html?engine=legacy`（或 `?engine=classic`）应仍加载三栏+命令式 pdf.js，默认路径不受影响。

全站地图：`src/FEATURES.md` · 旧引擎细节：`src/js/reader/README.md` · 独立包：`packages/reader/README.md` · 代理例外：`packages/reader/src/LEGACY.md`
