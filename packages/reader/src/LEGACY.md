# Legacy 隔离说明（`packages/reader` 不含 `?engine=legacy`）

> 本文件为 **Agent-C / Phase1** 的隔离决策记录。`apps/web/src/pages/reader/legacy/**` 明确不迁入 `@retainpdf/reader`。

## 决策

| 项 | 结论 |
|----|------|
| **包定位** | `@retainpdf/reader` 仅含 **react-pdf** 引擎（`hooks/pdf/annotations/components/react-pdf/tools/shared`） |
| **legacy 去向** | `apps/web/src/pages/reader/legacy/**` 保留在 `apps/web`，服务 `?engine=legacy|classic` 回退链路；新功能不要进 `legacy` |
| **js/reader** | 全部保留在 `apps/web/src/js/reader`，新引擎仅复用 5 个共享 ports（`data-port/config-port/resource-resolver/pdf-document/page-state` 等），经 `src/adapters.ts` 注入；命令式主力（`pdf-controller/pdf-renderer/selection-favorites/region-*` 等）仅 legacy 消费 |
| **样式** | `apps/web/src/styles/entries/reader-legacy.css` 保留在 `apps/web`，不迁入本包；默认不加载，仅 `entry.tsx#ensureLegacyReaderCss` 在 `?engine=legacy` 时注入 `dist/css/reader-legacy.css` |

## 为什么不迁

1. **网络可见性**：`legacy` 是供旧书签/探针回退的兼容面，需与 `pdf-controller` 等命令式链路原子存在；迁入独立包会把已冻结的 pdf.js 管线、收藏/区域/旧 AI 抽屉全部带入发布物。
2. **样式耦合**：`reader-legacy.css` 依赖 `layout-legacy/chrome-legacy/side-drawer/favorites/selection/ai/markdown-legacy/region-popover` 等 10+ 旧样式，与三栏骨架强绑定；单包 Tailwind 扫描在 `apps/web` 按页拆包更可控。
3. **下线路径清晰**：保留在 `apps/web` 时，`ReaderApp.tsx` 的 `resolveReaderEngine()` 分支与 `entry.tsx` 的 CSS 注入是唯一开关；`?engine=legacy` 下线即删 `legacy/**` + `js/reader` 命令式部分 + `reader-legacy.css`，不碰包内真值。

## 唯一的例外：`src/legacy/ai/answer-view.ts`

```
packages/reader/src/legacy/ai/answer-view.ts
  → export * from "apps/web/src/pages/reader/legacy/ai/answer-view.js"
```

- **内容**：纯函数 `describeToolEvent`（工具事件文案）与少量类型；无组件、无副作用、无 `js/reader` 依赖。
- **为何保留代理**：`components/react-pdf/assistant/use-reader-ask-runtime.ts`（新引擎 AI 浮窗）与 `legacy/ai/use-reader-ai-chat.ts`（旧抽屉）共享同一套 `TOOL_EVENT_LABELS` 语义；抽到 `shared` 前暂以薄代理复用，避免文案分叉。
- **迁移计划**：后续将 `describeToolEvent` 下沉到 `src/shared/ai/tool-labels.ts` 或 `src/adapters` 侧，届时删除 `src/legacy/**` 整个目录；过渡期内 `rg "from.*legacy" packages/reader/src` 应仅此一条命中。
- **验证**：`rg -n "legacy" packages/reader/src` 仅此文件；`rg -n "from.*js/reader" packages/reader/src` 零命中。

## 未迁移清单（有意保留在 apps/web）

> 17 个 `legacy/**` 文件中，仅 `legacy/ai/answer-view.ts` 以薄代理形式在包内复用；其余 16 个及 `js/reader` 全量、`reader-legacy.css` 有意不迁。

| 路径 | 职责 | 备注 |
|------|------|------|
| `legacy/components/{ReaderTopbar,ReaderTopbarActions,ReaderLeftNav,ReaderColumnChrome,ReaderScrollShell,PdfPane,ReaderPageHud,ReaderSideDrawers,ReaderAiChat,ReaderBootLoading,ReaderDownloadMenu,index}.tsx` | 旧壳 UI | 被 `ReaderAppLegacy` 独占 |
| `legacy/hooks/use-reader-boot.ts` | 旧引擎总装 | 聚合 16+ `js/reader` 模块 |
| `legacy/state/{drawer-store,use-drawer-active}.ts` | 抽屉状态 | 已被 `hooks/use-reader-tools` 取代 |
| `legacy/ai/use-reader-ai-chat.ts` | 旧 AI 抽屉 hook | 已被 `use-reader-ask-runtime` 取代 |
| `apps/web/src/js/reader/**` | 命令式 pdf.js 管线 | 新引擎仅复用 5 ports，其余 legacy 独占 |
| `apps/web/src/styles/entries/reader-legacy.css` + `reader/*-legacy.css` + `annotations.css` 等 | legacy 样式 | 动态加载，不入包 |

## 校验

```bash
# 1) 包内无 legacy 组件
rg -n "from.*legacy|import.*legacy" packages/reader/src --glob '*.{ts,tsx}' 
# → 仅 src/legacy/ai/answer-view.ts 与 src/components/react-pdf/assistant/use-reader-ask-runtime.ts:11

# 2) 包内零直连 js/reader
rg -n "from.*js/reader" packages/reader/src --glob '*.{ts,tsx}'
# → 无命中（全部经 adapters/external）

# 3) 宿主侧 legacy 仅两处入口
rg -n "legacy" apps/web/src/pages/reader --glob '*.{ts,tsx}' | grep -v "describeToolEvent"
# → ReaderApp.tsx:4-18（ReaderAppLegacy 分支） + entry.tsx:51-90（CSS 注入）

# 4) ?engine=legacy 仍可工作
ls apps/web/src/pages/reader/legacy/**/* apps/web/src/styles/entries/reader-legacy.css
# → 17 + 1 文件均存在，未删除；ReaderApp.tsx:22-55 分支与 entry.tsx:88-90 注入保持原样
```

相关：`apps/web/src/pages/reader/README.md#隔离不变量` · `apps/web/src/pages/reader/README.md#依赖审计` · `apps/web/src/js/reader/README.md` · `packages/reader/README.md#样式真值`
