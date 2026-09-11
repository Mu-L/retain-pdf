import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

// HomeAskComposer 拆分后的契约测试：挂载、class/DOM、交互回调与
// CustomEvent 派发保持与拆分前一致（不触碰 @ 选择器的网络加载）。

const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", {
  url: "http://localhost/",
});
for (const k of [
  "window",
  "document",
  "HTMLElement",
  "HTMLTextAreaElement",
  "Node",
  "CustomEvent",
  "Event",
  "MouseEvent",
  "navigator",
]) {
  try {
    Object.defineProperty(globalThis, k, {
      value: dom.window[k] ?? globalThis[k],
      writable: true,
      configurable: true,
    });
  } catch {
    /* 只读键忽略 */
  }
}
globalThis.window = dom.window;
globalThis.IS_REACT_ACT_ENVIRONMENT = false;

const { createRoot } = await import("react-dom/client");
const React = await import("react");
const { HomeAskComposer } = await import(
  "../../src/features/ask/ui/HomeAskComposer.tsx"
);

function wait(ms = 40) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mount(props) {
  const host = dom.window.document.createElement("div");
  dom.window.document.getElementById("root").appendChild(host);
  const root = createRoot(host);
  root.render(React.createElement(HomeAskComposer, { scopes: [], onScopesChange() {}, onSend() {}, ...props }));
  await wait();
  return { host, root };
}

function setTextareaValue(textarea, value) {
  const setter = Object.getOwnPropertyDescriptor(
    dom.window.HTMLTextAreaElement.prototype,
    "value",
  ).set;
  setter.call(textarea, value);
  textarea.setSelectionRange(value.length, value.length);
  textarea.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
}

test("HomeAskComposer：根 class 与空范围提示", async () => {
  const { host, root } = await mount({ variant: "hero" });
  const composer = host.querySelector(".home-ask-composer");
  assert.ok(composer.classList.contains("home-ask-composer-hero"));
  assert.equal(host.querySelector(".home-ask-scope-hint").textContent, "全库 · @ 文章或合集");
  assert.equal(host.querySelector(".home-ask-composer-shell").getAttribute("aria-disabled"), null);
  root.unmount();
  host.remove();
});

test("HomeAskComposer：输入后可发送并回调 trim 后的文本", async () => {
  let sent = null;
  const { host, root } = await mount({ onSend: (q) => { sent = q; } });
  const textarea = host.querySelector(".home-ask-input");
  const send = host.querySelector(".home-ask-send");
  assert.equal(send.disabled, true);

  setTextareaValue(textarea, "  帮我总结  ");
  await wait();
  assert.equal(send.disabled, false);

  send.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  await wait();
  assert.equal(sent, "帮我总结");

  root.unmount();
  host.remove();
});

test("HomeAskComposer：chips 渲染与移除回调", async () => {
  const changes = [];
  const scopes = [
    { kind: "collection", id: "c1", title: "量子化学" },
    { kind: "document", id: "d1", title: "Alpha" },
  ];
  const { host, root } = await mount({
    scopes,
    onScopesChange: (next) => changes.push(next),
  });
  assert.equal(host.querySelectorAll(".home-ask-chip").length, 2);
  assert.equal(host.querySelector(".home-ask-chip").classList.contains("is-collection"), true);

  host.querySelectorAll(".home-ask-chip-remove")[1].dispatchEvent(
    new dom.window.MouseEvent("click", { bubbles: true }),
  );
  await wait();
  assert.equal(changes.length, 1);
  assert.deepEqual(changes[0], [scopes[0]]);

  root.unmount();
  host.remove();
});

test("HomeAskComposer：isRunning 展示停止按钮", async () => {
  let stopped = 0;
  const { host, root } = await mount({ isRunning: true, onStop: () => { stopped += 1; } });
  const stop = host.querySelector(".home-ask-send-stop");
  assert.ok(stop);
  assert.equal(host.querySelector(".home-ask-scope-hint").textContent, "全库 · @ 文章或合集");
  stop.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  await wait();
  assert.equal(stopped, 1);
  root.unmount();
  host.remove();
});

test("HomeAskComposer：credentialBlocked 渲染横幅、锁定层并派发 CustomEvent", async () => {
  let events = 0;
  const onEvent = () => { events += 1; };
  dom.window.document.addEventListener("retainpdf:open-browser-credentials", onEvent);
  try {
    const { host, root } = await mount({ credentialBlocked: true, credentialMessage: "未配置" });
    assert.ok(host.querySelector(".home-ask-composer").classList.contains("is-locked"));
    assert.equal(host.querySelector(".home-ask-key-banner p").textContent, "未配置");
    assert.ok(host.querySelector(".home-ask-composer-lock"));
    assert.equal(host.querySelector(".home-ask-input").getAttribute("aria-disabled"), "true");
    assert.equal(host.querySelector(".home-ask-scope-hint").textContent, "未配置");

    host.querySelector(".home-ask-key-banner-btn").dispatchEvent(
      new dom.window.MouseEvent("click", { bubbles: true }),
    );
    await wait();
    assert.equal(events, 1);
    root.unmount();
    host.remove();
  } finally {
    dom.window.document.removeEventListener("retainpdf:open-browser-credentials", onEvent);
  }
});
