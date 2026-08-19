# @retainpdf/reader

RetainPDF 阅读器独立包（react-pdf 引擎），从 `apps/web/src/pages/reader` 抽取。

## 定位
- **单真值仍在 `apps/web/src/pages/reader`**（Phase4 薄壳，不搬文件夹）
- 本包通过 `re-export` 代理真实实现，验证 `workspace:*` 可独立 `vite build` 与 `npm publish`
- 样式真值仍在 `apps/web/src/styles/reader/*`，本包 `styles.css` 为分发占位

## 契约
- 新包不对 `apps/web/src/js/*` 直连，仅经 `src/adapters.ts` 注入
- 宿主（RetainPDF）需在 `apps/web/src/pages/reader/adapter-retainpdf.ts`（待建）中将旧 `external.ts` 的 20+ 符号（`resolveResourceUrl/fetchProtected/data-port` 等）适配为 `ReaderAdapters`
- `external.ts` 保留为 RetainPDF 适配层，未来逐步退化为 `adapters` 的实现

## 构建
```bash
npm --prefix packages/reader run build   # -> dist/retain-reader.js
npm --prefix apps/web run build:js       # 仍产 dist/reader.bundle.js，经本包代理可复用
```

## 路线
1. 薄壳验证（本 PR）
2. 逐批迁移 `hooks/pdf/annotations/components/react-pdf` 入 `packages/reader/src` 并补 `adapters` 注入
3. `apps/web/src/pages/reader` 退化为 `entry.tsx + adapter-retainpdf.ts` 薄适配层
4. 独立仓库时 `git subtree split -P packages/reader -b publish`
