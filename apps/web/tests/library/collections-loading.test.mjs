import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import React from "react";
import { createRoot } from "react-dom/client";

import { HomeServicesProvider } from "../../src/pages/home/home-services-context.js";
import { CollectionsView } from "../../src/pages/home/features/library/categories/CollectionsView.js";

function installDom() {
  const dom = new JSDOM("<!doctype html><html><body><div id=\"root\"></div></body></html>", {
    url: "http://localhost/index.html",
  });
  for (const key of ["window", "document", "HTMLElement", "Node", "MutationObserver"]) {
    Object.defineProperty(globalThis, key, {
      value: dom.window[key] ?? dom.window,
      configurable: true,
      writable: true,
    });
  }
  globalThis.requestAnimationFrame = (callback) => setTimeout(() => callback(0), 0);
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
  globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  return dom;
}

function versionSignal(version = 1) {
  const snapshot = Object.freeze({ version });
  return {
    getSnapshot: () => snapshot,
    subscribe: () => () => {},
    actions: { bump() {} },
  };
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

async function waitFor(predicate, message) {
  const deadline = Date.now() + 2000;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  assert.fail(message);
}

function renderCollections(dom, listCollections) {
  const services = {
    collections: {
      controller: {
        listCollections,
        fetchFolderBooks: async () => [],
      },
      dialogStore: { open() {} },
      // Reproduce the bug: this view mounts after a previous collection edit,
      // so the shared version is already non-zero although this instance has
      // never completed its initial request.
      reloadSignal: versionSignal(3),
    },
    library: {
      actions: {
        openJobReader() {},
        openSourceReader() {},
        selectJob() {},
        openBookDetail() {},
      },
    },
  };
  const root = createRoot(dom.window.document.getElementById("root"));
  root.render(
    React.createElement(
      HomeServicesProvider,
      { value: services },
      React.createElement(CollectionsView),
    ),
  );
  return root;
}

test("合集首次挂载时即使刷新版本非零，也会在请求完成后退出 loading", async () => {
  const dom = installDom();
  const request = deferred();
  const root = renderCollections(dom, () => request.promise);

  await waitFor(
    () => dom.window.document.body.textContent.includes("正在加载合集…"),
    "未进入合集首屏 loading",
  );
  request.resolve({ collections: [] });
  await waitFor(
    () => !dom.window.document.body.textContent.includes("正在加载合集…"),
    "合集请求完成后仍停留在 loading",
  );
  assert.ok(dom.window.document.getElementById("categories-empty"));
  root.unmount();
});

test("合集首次请求失败也会退出 loading 并显示错误", async () => {
  const dom = installDom();
  const request = deferred();
  const root = renderCollections(dom, () => request.promise);

  await waitFor(
    () => dom.window.document.body.textContent.includes("正在加载合集…"),
    "未进入合集首屏 loading",
  );
  request.reject(new Error("合集服务暂不可用"));
  await waitFor(
    () => dom.window.document.body.textContent.includes("合集服务暂不可用"),
    "请求失败后没有显示合集错误",
  );
  assert.doesNotMatch(dom.window.document.body.textContent, /正在加载合集/);
  root.unmount();
});
