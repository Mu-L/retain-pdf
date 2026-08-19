// @retainpdf/reader — 自包含 reader 入口（bootTheme + createRoot + ReaderApp）
// 从 apps/web/src/pages/reader/entry.tsx 复制并改为不依赖 apps/web，
// 供独立包直接作为启动脚本（vite lib / esbuild 直接指向亦可）。
// apps/web 薄包装会 re-export 此真值以保持 MPA 构建兼容。

import { createRoot } from "react-dom/client";
import { bootTheme } from "./shared/theme/theme.js";
import {
  clearReaderAiNavigationLock,
  installReaderWindowOpenGuard,
} from "./external.js";
import { ReaderApp } from "./ReaderApp.jsx";

bootTheme();
// 仅 AI 会话切换锁定期拦截误触；并清掉可能残留的全屏指针遮罩
clearReaderAiNavigationLock();
installReaderWindowOpenGuard();

// 渲染前同步 body class:CSS 的 :has()/body-class 驱动规则(reader-page.css)依赖它们。
function syncReaderBodyClasses(body = document.body) {
  body.classList.add("reader-body", "reader-mode-compare");
  if (globalThis.window && window.self !== window.top) {
    body.classList.add("reader-embedded");
  }
}

function purgeLegacyMarkup(body = document.body) {
  Array.from(body.children).forEach((element) => {
    if (element.tagName !== "SCRIPT" && element.id !== "reader-root") {
      element.remove();
    }
  });
}

function resolveReaderRoot(body = document.body) {
  let host = document.getElementById("reader-root");
  if (!host) {
    host = document.createElement("div");
    host.id = "reader-root";
    body.appendChild(host);
  }
  return host;
}

function resolveReaderEngine(search = globalThis.location?.search || "") {
  const engine = new URLSearchParams(search).get("engine")?.trim().toLowerCase() || "";
  if (engine === "legacy" || engine === "classic") {
    return "legacy";
  }
  return "react-pdf";
}

/**
 * Legacy 抽屉/选区/AI 样式已拆到 dist/css/reader-legacy.css。
 * 默认 react-pdf 不加载；仅 ?engine=legacy 时注入。
 */
function ensureLegacyReaderCss() {
  if (typeof document === "undefined") {
    return;
  }
  if (document.querySelector('link[data-reader-legacy-css]')) {
    return;
  }
  const main = document.querySelector(
    'link[rel="stylesheet"][href*="reader.css"]',
  ) as HTMLLinkElement | null;
  let href = "./dist/css/reader-legacy.css";
  if (main?.getAttribute("href")) {
    href = main
      .getAttribute("href")!
      .replace(/reader\.css(\?v=[^"']*)?$/i, "reader-legacy.css");
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.readerLegacyCss = "1";
  document.head.appendChild(link);
}

// 导出供测试/宿主复用
export {
  syncReaderBodyClasses,
  purgeLegacyMarkup,
  resolveReaderRoot,
  resolveReaderEngine,
  ensureLegacyReaderCss,
};

syncReaderBodyClasses();
purgeLegacyMarkup();
if (resolveReaderEngine() === "legacy") {
  ensureLegacyReaderCss();
}
createRoot(resolveReaderRoot()).render(<ReaderApp />);
