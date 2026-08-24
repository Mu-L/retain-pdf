import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><body><div id='root'></div></body>", {
  url: "http://localhost/reader.html",
  pretendToBeVisual: true,
});
for (const key of [
  "window",
  "document",
  "location",
  "HTMLElement",
  "Element",
  "Node",
  "Event",
  "MouseEvent",
  "requestAnimationFrame",
  "cancelAnimationFrame",
]) {
  Object.defineProperty(globalThis, key, {
    value: dom.window[key],
    writable: true,
    configurable: true,
  });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = false;

const React = await import("react");
const { createRoot } = await import("react-dom/client");
const { setReaderAdapters } = await import("../../../../packages/reader/src/adapters.ts");
const { AiMarkdownAnswer } = await import("../../../../packages/reader/src/ai.ts");

async function waitFor(predicate, description) {
  const deadline = Date.now() + 2500;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  assert.fail(`等待超时：${description}`);
}

test("current AI Markdown component fetches only current-job images through the protected adapter", async () => {
  const calls = [];
  setReaderAdapters({
    resolveResourceUrl: (url) => url,
    fetchProtected: async (url) => {
      calls.push(url);
      return new Response(new Blob(["png"], { type: "image/png" }), { status: 200 });
    },
    credentialsPort: { getCredentials: () => ({ modelApiKey: "test" }) },
  });
  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(React.createElement(AiMarkdownAnswer, {
    content: "**流式回答尚未闭合\n\n![chart](images/page-3/imgs/chart%20a.png)",
    streaming: true,
    jobId: "job-1",
  }));
  await waitFor(() => Boolean(container.querySelector(".markstream-react")), "streaming Markstream render");
  assert.match(container.textContent, /流式回答尚未闭合/);
  assert.match(container.textContent, /图片：chart/);
  assert.equal(calls.length, 0);

  root.render(React.createElement(AiMarkdownAnswer, {
    content: [
      "## 结论 [1]",
      "公式 $E=mc^2$。",
      "行内分式 $$F_i=-\\frac{\\partial E}{\\partial R_i}$$ 不应使用展示模式。",
      "```ts\nconst answer = 42\n```",
      "![chart](/api/v1/jobs/job-1/markdown/images/page-3/imgs/chart%20a.png)",
      "![tracker](https://tracker.invalid/pixel.png)",
      '<img src="https://tracker.invalid/raw.png" onerror="alert(1)">',
    ].join("\n\n"),
    jobId: "job-1",
    citations: [{ ref: 1, block_id: "md-0001", job_id: "job-1" }],
  }));

  await waitFor(
    () => (container.querySelector("img")?.getAttribute("src") || "").startsWith("blob:"),
    "protected image hydration",
  );
  assert.deepEqual(calls, [
    "/api/v1/jobs/job-1/markdown/images/page-3/imgs/chart%20a.png",
  ]);
  assert.equal(container.querySelectorAll("img").length, 1);
  assert.match(container.querySelector("img").getAttribute("src") || "", /^blob:/);
  assert.match(container.textContent, /图片不可用：tracker/);
  assert.match(container.textContent, /<img src="https:\/\/tracker\.invalid\/raw\.png"/);
  assert.equal(container.querySelectorAll("img").length, 1);
  assert.equal(container.querySelector("pre code")?.textContent, "const answer = 42");
  await waitFor(() => Boolean(container.querySelector(".katex")), "KaTeX formula render");
  await waitFor(() => Boolean(container.querySelector(".math-inline .mfrac")), "KaTeX inline fraction render");
  assert.equal(
    container.querySelector(".math-inline .katex-display"),
    null,
    "paragraph 内的 $$ 公式必须使用紧凑的行内排版",
  );
  assert.ok(container.querySelector(".markstream-react"));
  assert.equal(
    container.querySelector("[data-markdown-renderer]")?.getAttribute("data-markdown-renderer"),
    "markstream-react",
    "AI 答案必须通过正式 Markstream renderer，不能静默回退到旧 Markdown HTML 链",
  );

  root.unmount();
  setReaderAdapters(null);
  dom.window.close();
});
