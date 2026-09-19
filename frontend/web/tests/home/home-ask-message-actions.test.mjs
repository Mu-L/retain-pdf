/**
 * 每条回答自己带复制/重新生成，操作卡片也归到触发它的那一轮。
 *
 * 阅读器那侧早就有这两个按钮，主页一个都没有：想把回答拿走只能手动划选，
 * 答歪了只能重新打一遍问题。
 *
 * 操作卡片此前是整组堆在线程最底部的。单轮看不出问题，多轮就完全读不出哪张卡
 * 对应哪次请求——这里钉的就是「卡片在它那一轮的 DOM 里」，而不是「页面上存在」。
 */

import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { describe, it, beforeEach } from "node:test";

const dom = new JSDOM("<!doctype html><body></body>", { url: "http://localhost/index.html" });
for (const key of [
  "window", "document", "DocumentFragment", "HTMLElement", "HTMLButtonElement",
  "Node", "Event", "CustomEvent", "MouseEvent", "KeyboardEvent", "MutationObserver", "NodeFilter",
]) {
  Object.defineProperty(globalThis, key, {
    value: dom.window[key] ?? dom.window, writable: true, configurable: true,
  });
}
globalThis.window = dom.window;
globalThis.localStorage = dom.window.localStorage;
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(0), 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const clipboardWrites = [];
let clipboardFails = false;
Object.defineProperty(dom.window.navigator, "clipboard", {
  value: {
    writeText: (text) => {
      if (clipboardFails) return Promise.reject(new Error("拒绝访问剪贴板"));
      clipboardWrites.push(text);
      return Promise.resolve();
    },
  },
  configurable: true,
});
// Node 自带只读的 globalThis.navigator，直接赋值会抛 TypeError。
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator, writable: true, configurable: true,
});

const React = await import("react");
const { act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { HomeAskThread } = await import("../../src/features/ask/ui/HomeAskThread.tsx");

/** 两轮对话：问 A / 答 A / 问 B / 答 B。 */
const TWO_TURNS = [
  { id: "u1", role: "user", content: "第一轮问题" },
  { id: "a1", role: "assistant", content: "第一轮回答", status: "done" },
  { id: "u2", role: "user", content: "第二轮问题" },
  { id: "a2", role: "assistant", content: "第二轮回答", status: "done" },
];

function operationEntry(operationId, requestMessageId) {
  return {
    remote: {
      operation_id: operationId,
      conversation_id: "conv-1",
      request_message_id: requestMessageId,
      document_id: "doc-1",
      intent_summary: `操作 ${operationId}`,
      status: "result_ready",
      current_attempt: 1,
      allowed_actions: [],
    },
  };
}

function render(props = {}) {
  const host = dom.window.document.createElement("div");
  dom.window.document.body.append(host);
  const root = createRoot(host);
  act(() => {
    root.render(React.createElement(HomeAskThread, { messages: TWO_TURNS, ...props }));
  });
  return {
    host,
    rerender: (next) => act(() => {
      root.render(React.createElement(HomeAskThread, { messages: TWO_TURNS, ...props, ...next }));
    }),
    unmount: () => { act(() => root.unmount()); host.remove(); },
  };
}

const textOf = (node) => `${node?.textContent || ""}`;
const buttons = (scope) => [...scope.querySelectorAll("button")];
const buttonWith = (scope, label) => buttons(scope).find((b) => textOf(b).includes(label));
const assistantTurns = (host) => [...host.querySelectorAll(".home-ask-msg-assistant")];

async function click(node) {
  await act(async () => {
    node.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
    await Promise.resolve();
  });
}

describe("主页问答的消息级操作", () => {
  beforeEach(() => { clipboardWrites.length = 0; clipboardFails = false; });

  it("复制的是这条回答，不是整个线程", async () => {
    const view = render();
    const [first] = assistantTurns(view.host);
    await click(buttonWith(first, "复制"));
    assert.deepEqual(clipboardWrites, ["第一轮回答"]);
    view.unmount();
  });

  it("复制成功后按钮给出反馈", async () => {
    const view = render();
    const [first] = assistantTurns(view.host);
    await click(buttonWith(first, "复制"));
    assert.ok(textOf(first).includes("已复制"), "复制完没有任何反馈");
    view.unmount();
  });

  it("剪贴板被拒时不假装成功，也不炸掉整条消息", async () => {
    clipboardFails = true;
    const view = render();
    const [first] = assistantTurns(view.host);
    await click(buttonWith(first, "复制"));
    assert.ok(!textOf(first).includes("已复制"), "复制失败却显示成功");
    assert.ok(textOf(first).includes("第一轮回答"), "消息被异常带崩");
    view.unmount();
  });

  it("重新生成用的是这一轮的提问，不是最后一轮的", async () => {
    const asked = [];
    const view = render({ onRegenerate: (q) => asked.push(q) });
    const [first] = assistantTurns(view.host);
    await click(buttonWith(first, "重新生成"));
    assert.deepEqual(asked, ["第一轮问题"], "重新生成串到了别的轮次");
    view.unmount();
  });

  it("失败的回答给的是「重试」", () => {
    const messages = [
      { id: "u1", role: "user", content: "会失败的问题" },
      { id: "a1", role: "assistant", content: "请求失败", status: "error" },
    ];
    const view = render({ messages, onRegenerate: () => {} });
    const [turn] = assistantTurns(view.host);
    assert.ok(buttonWith(turn, "重试"), "失败的回答没有重试入口");
    view.unmount();
  });

  it("流式期间不出操作——答案还没写完，复制和重新生成都没有意义", () => {
    const messages = [
      { id: "u1", role: "user", content: "问题" },
      { id: "a1", role: "assistant", content: "正在写…", status: "streaming" },
    ];
    const view = render({ messages, isRunning: true, onRegenerate: () => {} });
    assert.equal(view.host.querySelectorAll(".home-ask-msg-actions").length, 0);
    view.unmount();
  });

  it("还有请求在跑时不让重新生成", () => {
    const view = render({ isRunning: true, onRegenerate: () => {} });
    const [first] = assistantTurns(view.host);
    assert.ok(!buttonWith(first, "重新生成"), "跑着的时候还能再点一次重新生成");
    view.unmount();
  });
});

describe("操作卡片的归位", () => {
  it("卡片落在触发它的那一轮里", () => {
    const view = render({
      operationsByRequestMessage: { a1: [operationEntry("op-1", "a1")] },
    });
    const turns = assistantTurns(view.host);
    assert.equal(turns[0].querySelectorAll(".home-ask-msg-operation").length, 1);
    assert.equal(turns[1].querySelectorAll(".home-ask-msg-operation").length, 0,
      "卡片跑到了别的轮次");
    view.unmount();
  });

  it("两轮各有各的卡片", () => {
    const view = render({
      operationsByRequestMessage: {
        a1: [operationEntry("op-1", "a1")],
        a2: [operationEntry("op-2", "a2")],
      },
    });
    const turns = assistantTurns(view.host);
    assert.ok(textOf(turns[0]).includes("操作 op-1"));
    assert.ok(!textOf(turns[0]).includes("操作 op-2"));
    assert.ok(textOf(turns[1]).includes("操作 op-2"));
    view.unmount();
  });

  it("同一 operation_id 重复出现只渲染一张卡", () => {
    const view = render({
      operationsByRequestMessage: {
        a1: [operationEntry("op-1", "a1"), operationEntry("op-1", "a1")],
      },
    });
    assert.equal(view.host.querySelectorAll(".home-ask-msg-operation").length, 1);
    view.unmount();
  });
});
