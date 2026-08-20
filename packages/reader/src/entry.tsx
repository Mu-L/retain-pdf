// @retainpdf/reader — 自包含 reader 入口（仅 react-pdf，legacy 已删除）
import { createRoot } from "react-dom/client";
import { bootTheme } from "./shared/theme/theme.js";
import {
  clearReaderAiNavigationLock,
  installReaderWindowOpenGuard,
} from "./external.js";
import { ReaderApp } from "./ReaderApp.jsx";

bootTheme();
clearReaderAiNavigationLock();
installReaderWindowOpenGuard();

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

export { syncReaderBodyClasses, purgeLegacyMarkup, resolveReaderRoot };

syncReaderBodyClasses();
purgeLegacyMarkup();
createRoot(resolveReaderRoot()).render(<ReaderApp />);
