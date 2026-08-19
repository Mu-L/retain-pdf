# 阅读器样式真值 — packages/reader/styles

> **真值已迁**：`apps/web/src/styles/reader/*` → `packages/reader/styles/*`，`apps/web/src/styles/entries/reader.css` → `packages/reader/styles/entry.css`。
> `apps/web/src/styles/entries/reader.css` 仅保留代理 `@import "../../../../../packages/reader/styles/entry.css"`（薄包装），编辑请改本目录。

## 结构

```
packages/reader/styles/
├── entry.css                # 入口（原 apps/web/src/styles/entries/reader.css，@import/ @source 已重算为相对路径）
├── layout.css               # 布局共享（body/panel/viewer-wrap，三栏等见 layout-legacy.css）
├── chrome.css               # 顶栏 tabs/boot/关闭回主页
├── content.css              # 内容区
├── react-pdf.css            # react-pdf 引擎
├── fab.css / fab-menu.css / fab-downloads.css
├── selection-pop.css / selection.css
├── notes-float.css / float-markdown.css / float-ai*.css / hud.css / markdown.css
├── ai.css / annotations.css / favorites.css / side-drawer.css / region-popover.css # legacy 共用/仅 legacy 包引用
├── chrome-legacy.css / layout-legacy.css / markdown-legacy.css # legacy-only（仅 reader-legacy.css 引用）
└── README.md
```

- 26 个 `reader/*.css` 已全量复制（`ai/annotations/chrome-legacy/layout-legacy/markdown-legacy/favorites/selection/side-drawer/region-popover` 等 legacy 文件亦在列，保持与 `apps/web/src/styles/reader/` 一致，便于 `reader-legacy.css` 仍可按需引用；默认 `entry.css` 仅引 react-pdf 路径，未引入 legacy）。
- `reader.utilities.css` 仍在 `apps/web/src/styles/reader.utilities.css`（共享工具类，未迁入本包；`entry.css` 以 `../../../apps/web/src/styles/reader.utilities.css` 引用）。
- `entry.css` 保留原 `@import` / `@source` / `@layer` 结构，路径已调整：
  - 共享依赖（`tokens/shadcn-theme/base/ambient-surface/download-toast/dialog-shell/tailwind-theme/reader.utilities`）→ `../../../apps/web/src/styles/...`
  - 阅读器分片（`layout/chrome/content/react-pdf/fab*…`）→ `./*.css`（本地真值）
  - `@source`（`reader.html` / `src/pages/reader` / `shared/components/lib/js/**`）→ `../../../apps/web/...`，并新增 `@source "../src/**/*.{js,jsx,ts,tsx}"` 扫描本包源码。

## 代理关系

- **真值**：`packages/reader/styles/entry.css`（及同目录下各 `*.css`）
- **代理**：`apps/web/src/styles/entries/reader.css` → `@import "../../../../../packages/reader/styles/entry.css"`
  - 相对路径为 `apps/web/src/styles/entries` → `packages/reader/styles/entry.css` 的 `../../../../../packages/...`（5 级 `../` 到仓库根）。
  - 任务描述中的 `../../../packages/...` 为示意，实际按仓库根计算需 5 级，已在代理文件中纠正并可构建验证。
- `apps/web/src/styles/reader/*.css` 仍保留在原位（未删除），但视为**只读镜像**；后续改动以本目录为准，可定期 `diff` 同步或删除原目录（待全量验证后）。

## 构建验证

```bash
npm --prefix apps/web run build:css
# → apps/web/dist/css/reader.css (≈200KB)，apps/web/dist/css/reader-legacy.css 同步产出
# 代理链：entries/reader.css → packages/reader/styles/entry.css → ./layout.css 等（本地）+ ../../../apps/web/src/styles/*（共享）
```

- `apps/web/scripts/build-css.mjs` 仍以 `src/styles/entries/reader.css` 为 `tailwindcss -i` 入口，经代理链解析到本包真值，验证改样式后 `dist/css/reader.css` 内容更新（含新样式）。
- `reader-legacy.css` 仍独立打包（`src/styles/entries/reader-legacy.css` → `dist/css/reader-legacy.css`），未迁入本包；其 `@import "../reader/layout-legacy.css"` 等仍指向 `apps/web/src/styles/reader/*`（与本包镜像一致）。

## 不动范围

- 未动 `apps/web/src/pages/reader/entry.tsx` / `ReaderApp*` / `legacy/**`（仅样式）。
- 未改 `apps/web/src/styles/entries/reader-legacy.css` 入口与 `apps/web/scripts/build-css.mjs`。

## 后续清理（可选）

- 确认 `npm --prefix apps/web run build:css` 与视觉回归通过后，可删除 `apps/web/src/styles/reader/` 原文件，仅保留代理；或保留双写并以本包为真值定期同步。
