/**
 * 「重新生成」必须发成兄弟分支，不能发成又问了一遍。
 *
 * 会话在服务端本来就是一棵树：`/ai/ask` 收 `parent_id` 和 `regenerate`，后端在
 * regenerate 时**跳过写入 user 消息**，只把新答案挂到 parent 下，并把喂给模型的历史
 * 截断到 parent（`conversation_state.py` / `ask_orchestration.py` 的 `_prepare_memory`）。
 *
 * 主页此前两个参数一个都没传（`features/ask` 里 grep `parent_id` 零命中），于是重新生成
 * 就是把同一个问题当新一轮再发一遍：对话里多一条重复提问，模型还会看见自己刚被否掉的
 * 那版答案。
 *
 * 这里从网络边界钉——打桩 fetch，断言真正发出去的请求体。中间层怎么改都不影响这条。
 */

import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { describe, it, beforeEach } from "node:test";

const dom = new JSDOM("<!doctype html><body></body>", { url: "http://localhost/index.html" });
for (const key of ["window", "document", "HTMLElement", "Node", "Event", "CustomEvent"]) {
  Object.defineProperty(globalThis, key, {
    value: dom.window[key] ?? dom.window, writable: true, configurable: true,
  });
}
globalThis.window = dom.window;
globalThis.localStorage = dom.window.localStorage;
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator, writable: true, configurable: true,
});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/** 记录每次请求的 url 和已解析的 body。 */
const requests = [];

// jsdom 不提供 Response，用 Node 自带的那个（undici）。
function sseResponse(events) {
  const body = events.map((e) => `data: ${JSON.stringify(e)}\n`).join("");
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  });
}

function jsonResponse(data) {
  return new Response(JSON.stringify({ code: 0, message: "ok", data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

Object.defineProperty(globalThis, "fetch", {
  configurable: true,
  writable: true,
  value: async (input, init = {}) => {
    const url = `${typeof input === "string" ? input : input?.url || ""}`;
    let body = null;
    try { body = init.body ? JSON.parse(`${init.body}`) : null; } catch { /* 非 JSON 请求 */ }
    requests.push({ url, body });
    if (/\/conversations(\?|$)/.test(url)) {
      return jsonResponse({ conversation_id: "conv-1", title: "t", created_at: "", updated_at: "" });
    }
    if (/ai\/ask/.test(url)) {
      return sseResponse([
        { type: "answer_delta", delta: "答", text: "答" },
        { type: "done", answer: "答案", citations: [], conversation_id: "conv-1" },
      ]);
    }
    return jsonResponse({});
  },
});

const React = await import("react");
const { act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { useHomeAskRuntime } = await import("../../src/features/ask/ui/use-home-ask-runtime.ts");

const askBodies = () => requests.filter((r) => /ai\/ask/.test(r.url)).map((r) => r.body);

function mountRuntime() {
  const host = dom.window.document.createElement("div");
  const root = createRoot(host);
  const api = {};
  function Probe() {
    const runtime = useHomeAskRuntime();
    api.current = runtime;
    return null;
  }
  act(() => { root.render(React.createElement(Probe)); });
  return {
    get messages() { return api.current.messages; },
    send: async (...args) => { await act(async () => { await api.current.send(...args); }); },
    unmount: () => act(() => root.unmount()),
  };
}

describe("重新生成发出去的请求", () => {
  beforeEach(() => {
    requests.length = 0;
    try { dom.window.localStorage.clear(); } catch { /* ignore */ }
  });

  it("普通提问把当前末端当作 parent，不声称是重新生成", async () => {
    const runtime = mountRuntime();
    await runtime.send("第一个问题");
    const [first] = askBodies();
    assert.equal(first.regenerate, undefined, "普通提问被当成了重新生成");
    // 首轮没有上一条消息，parent 留空由服务端接到 head。
    assert.equal(first.parent_id, undefined);

    await runtime.send("第二个问题");
    const second = askBodies()[1];
    assert.ok(second.parent_id, "第二轮没有带 parent_id，消息树接不起来");
    runtime.unmount();
  });

  it("重新生成带 regenerate 和那一轮提问的 parent_id", async () => {
    const runtime = mountRuntime();
    await runtime.send("问题");
    const answer = runtime.messages.find((m) => m.role === "assistant");
    const question = runtime.messages.find((m) => m.role === "user");

    await runtime.send("问题", [], { regenerateOf: answer.id });
    const body = askBodies()[1];
    assert.equal(body.regenerate, true, "没有声明 regenerate，服务端会再写一条 user 消息");
    assert.equal(body.parent_id, question.id, "parent 不是这一轮的提问，新答案会挂错地方");
    runtime.unmount();
  });

  it("重新生成不往对话里再加一条提问", async () => {
    const runtime = mountRuntime();
    await runtime.send("问题");
    const before = runtime.messages.filter((m) => m.role === "user").length;
    const answer = runtime.messages.find((m) => m.role === "assistant");

    await runtime.send("问题", [], { regenerateOf: answer.id });
    const after = runtime.messages.filter((m) => m.role === "user").length;
    assert.equal(after, before, "重新生成多出了一条重复提问");
    runtime.unmount();
  });

  it("重新生成把原答案换下来，而不是在它下面再堆一条", async () => {
    const runtime = mountRuntime();
    await runtime.send("问题");
    const answer = runtime.messages.find((m) => m.role === "assistant");

    await runtime.send("问题", [], { regenerateOf: answer.id });
    const answers = runtime.messages.filter((m) => m.role === "assistant");
    assert.equal(answers.length, 1, "同一个提问下并排堆了两条回答");
    assert.notEqual(answers[0].id, answer.id, "回答没有被换成新的那条");
    runtime.unmount();
  });

  it("新答案挂在提问底下，父链要能接着走", async () => {
    const runtime = mountRuntime();
    await runtime.send("问题");
    const question = runtime.messages.find((m) => m.role === "user");
    const answer = runtime.messages.find((m) => m.role === "assistant");

    await runtime.send("问题", [], { regenerateOf: answer.id });
    const fresh = runtime.messages.find((m) => m.role === "assistant");
    assert.equal(fresh.parentId, question.id);
    runtime.unmount();
  });

  it("重新生成一条不存在的回答，什么都不发", async () => {
    const runtime = mountRuntime();
    await runtime.send("问题");
    const before = askBodies().length;

    await runtime.send("问题", [], { regenerateOf: "不存在的消息" });
    assert.equal(askBodies().length, before, "对着不存在的回答也发了请求");
    runtime.unmount();
  });
});
