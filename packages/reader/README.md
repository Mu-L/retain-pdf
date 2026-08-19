# @retainpdf/reader

RetainPDF 阅读器独立包（**仅 react-pdf 引擎**），从 `apps/web/src/pages/reader` 抽取。

## 定位
- **单真值仍在 `apps/web/src/pages/reader`**（Phase4 薄壳，不搬文件夹）
- 本包通过 `re-export` 代理真实实现，验证 `workspace:*` 可独立 `vite build` 与 `npm publish`
- 样式真值：`reader/*` 已迁至 `packages/reader/styles/*`（`entry.css` 为真值，`apps/web/src/styles/entries/reader.css` 为代理），`reader-legacy` 仍在 `apps/web`（见“样式真值”）
- **不含 legacy**：`apps/web/src/pages/reader/legacy/**`（`?engine=legacy` 旧引擎）明确不迁入本包，见 `src/LEGACY.md`

## 契约
- 新包不对 `apps/web/src/js/*` 直连，仅经 `src/adapters.ts` 注入
- 宿主（RetainPDF）需在 `apps/web/src/pages/reader/adapters/retainpdf.ts` 中将旧 `external.ts` 的 20+ 符号（`resolveResourceUrl/fetchProtected/data-port` 等）适配为 `ReaderAdapters`
- `external.ts` 保留为 RetainPDF 适配层，未来逐步退化为 `adapters` 的实现
- `legacy/**` 与 `js/reader` 命令式主力**不**经 `adapters` 暴露（见 `src/LEGACY.md`）

## 构建
```bash
npm --prefix packages/reader run build   # -> dist/retain-reader.js
npm --prefix apps/web run build:js       # 仍产 dist/reader.bundle.js，经本包代理可复用
```

## 样式真值（已迁入本包 `styles/`，`apps/web` 保留代理）

| 入口 | 产物 | 说明 |
|------|------|------|
| `packages/reader/styles/entry.css` → `apps/web/src/styles/entries/reader.css`（代理） | `apps/web/dist/css/reader.css` | 默认 react-pdf 样式（`layout/chrome/content/react-pdf/fab…` 真值在 `packages/reader/styles/*`，共享 `tokens/base` 仍在 `apps/web/src/styles/*`），`reader.html` 常驻；`apps/web` 代理为 `@import "../../../../../packages/reader/styles/entry.css"`（含 `@import "tailwindcss"` 薄包装） |
| `apps/web/src/styles/entries/reader-legacy.css` | `apps/web/dist/css/reader-legacy.css` | **legacy 附加包**，仅 `?engine=legacy|classic` 时由 `apps/web/src/pages/reader/entry.tsx#ensureLegacyReaderCss` 动态注入；扫描 `legacy/**` + `js/reader/**` + `islands/reader-annotations`（**未迁入**，仍在 `apps/web/src/styles/reader/*-legacy.css`） |

- **已迁**：`apps/web/src/styles/reader/*.css`（26 个，含 `layout/chrome/content/react-pdf/fab*` 等）已复制至 `packages/reader/styles/`，`apps/web/src/styles/entries/reader.css` 已退化为 `@import` 代理（见 `packages/reader/styles/README.md`）；修改请改 `packages/reader/styles/*`，验证 `npm --prefix apps/web run build:css` 仍产 `dist/css/reader.css`（经代理链解析到本包真值）。
- **未迁**：`reader-legacy.css` 及其 `*-legacy`/`ai`/`annotations` 等 legacy 样式仍在 `apps/web`（与三栏/抽屉/旧 AI 强耦合，避免 dead CSS）；`tokens/base/ambient` 等共享仍在 `apps/web/src/styles/*`，由本包 `entry.css` 以 `../../../apps/web/...` 引用。详见 `packages/reader/styles/README.md` 与 `apps/web/src/pages/reader/README.md#样式真值`。

## 隔离不变量

| 不变量 | 说明 |
|--------|------|
| **仅 react-pdf** | 本包 `src/{hooks,pdf,annotations,components/react-pdf,tools,shared}` 为新引擎真值；`legacy/components|state|hooks/ai` 不在包内 |
| **唯一 legacy 代理** | 仅 `src/legacy/ai/answer-view.ts` 一个薄代理（`export * from apps/web/.../legacy/ai/answer-view.js`），供 `components/react-pdf/assistant/use-reader-ask-runtime.ts` 复用 `describeToolEvent`；详见 `src/LEGACY.md` 的例外说明 |
| **零直连 js/reader** | `rg "from.*js/reader" packages/reader/src` 无命中；全部经 `adapters.ts`/`external.ts` 注入 |

## 路线
1. 薄壳验证（本 PR）
2. 逐批迁移 `hooks/pdf/annotations/components/react-pdf` 入 `packages/reader/src` 并补 `adapters` 注入（已完成：见 `src/{hooks,pdf,annotations,components}`）
3. `apps/web/src/pages/reader` 退化为 `entry.tsx + adapters/retainpdf.ts` 薄适配层（`ReaderApp.tsx` 的 legacy 分支保留，直至 `?engine=legacy` 下线）
4. 独立仓库时 `git subtree split -P packages/reader -b publish`

## 相关文档

- 隔离决策：`src/LEGACY.md`
- 宿主侧地图：`apps/web/src/pages/reader/README.md`（含未迁移清单与依赖审计）
- 旧引擎：`apps/web/src/js/reader/README.md`
- 样式：`apps/web/src/styles/README.md`
