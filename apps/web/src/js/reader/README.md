# `src/js/reader` — 薄包装已清零，仅保留 `ai/*` 待抽 + `download-runtime-bridge`

> **Phase 1 收官**：`data-port` / `config-port` / `resource-resolver` / `pdf-document` / `page-state` / `downloads/resolve` / `markdown-math` / `server-favorites-port` / `types` / `annotations/view-model` 10 个薄包装已全部删除，新引擎经 `pages/reader/external.ts` 直连 `src/shared/*`（与 `packages/reader/src/shared/*` 真值），不再经本目录中转。

命令式 pdf.js 管线（`pdf-controller` / `pdf-renderer` / mode / favorites / regions…）已随 legacy 一并删除。本目录现仅保留待抽的 AI 追问管线。

## 分层（与 `pages/reader/README` 对齐）

| 用途 | 模块 | 谁 import |
|------|------|-----------|
| **已抽至 `src/shared`（直连）** | `shared/data/*`、`shared/state/*`、`shared/content/*`、`shared/types`、`shared/config` | 新引擎经 `pages/reader/external.ts` 直连 `shared` |
| **待抽 AI** | `ai/ask-answerer`、`ai/chat-history-store`、`ai/answer-enhance`、`ai/render-answer-html`、`ai/ui-interaction-lock`… | `pages/reader/external.ts` 仍经 `js/reader/ai/*`（下一步抽至 `shared/ai`） |
| **架构桥接** | `download-runtime-bridge.ts` | `shared/state/downloads/resolve.ts` 间接注入 `bootstrap/reader-dialog-runtime-port`，避免 `shared` 直连 `bootstrap` 触发门禁 |

## 已删除

| 文件 | 说明 |
|------|------|
| `ai/remote-answerer.ts` | 旧 `/reader/ai/chat` payload 应答器；现网 `ask-answerer` |
| `data-port.ts` / `pdf-document.ts` / `resource-resolver.ts` / `page-state.ts` / `server-favorites-port.ts` / `types.ts` / `markdown-math.ts` | 薄包装 → `src/shared/*` 直连（`packages/reader/src/shared/*` 真值） |
| `config-port.ts` | 拆分为 `shared/config/page-config.ts` + `shared/config/pdf-document-config.ts` |
| `downloads/resolve.ts` / `annotations/view-model.ts` | 薄包装 → `shared/state/downloads` / `shared/content/annotations` |

## 不要

- 不要在这里加新 UI（批注 / 缩放 / 对照 → `pages/reader` 非 legacy）  
- 不要批量删除 favorites / pdf-*（legacy 仍依赖内部图）  
- 不要假设 `pages/reader/components/*` 扁平存在（已迁 `legacy/components/`）

## 主路径

```text
默认: pages/reader/ReaderAppReactPdf + hooks/ + pdf/ + annotations/ + components/react-pdf/
      js 依赖 → pages/reader/external.ts → src/shared/*（直连，不再经 js/reader 中转）
回退: pages/reader/legacy/* 已删除，仅保留 ai/* 待抽
地图: src/FEATURES.md
```
