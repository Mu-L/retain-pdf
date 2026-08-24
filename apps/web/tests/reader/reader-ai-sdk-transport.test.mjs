import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const requireFromReader = createRequire(
  new URL("../../../../packages/reader/package.json", import.meta.url),
);
const { Chat } = await import(requireFromReader.resolve("@ai-sdk/react"));

const {
  RetainPdfChatTransport,
  readerChatMessageText,
} = await import(
  "../../../../packages/reader/src/components/react-pdf/assistant/retainpdf-chat-transport.ts"
);

test("RetainPDF SSE adapter feeds AI SDK messages without changing the backend contract", async () => {
  const calls = [];
  const answerer = {
    async ensureLoaded(jobId) {
      assert.equal(jobId, "job-sdk");
    },
    async answer(options) {
      calls.push(options);
      options.onToolEvent({ tool: "search_markdown", event: "start" });
      options.onAnswerDelta("第一段", "第一段");
      options.onAnswerDelta("第一段第二段", "第二段");
      return {
        answer: "第一段第二段",
        citations: [{ ref: 1, page_idx: 2, block_id: "p003-b0001" }],
        persisted: true,
      };
    },
  };
  const chat = new Chat({
    id: "chat-sdk",
    transport: new RetainPdfChatTransport({
      jobId: "job-sdk",
      getRemoteAnswerer: () => answerer,
      getLocalAnswerer: () => null,
    }),
  });

  await chat.sendMessage(
    { id: "u-sdk", role: "user", parts: [{ type: "text", text: "核心结论？" }] },
    {
      body: {
        assistantMessageId: "a-sdk",
        parentId: "a-before",
        userMessageId: "u-sdk",
      },
    },
  );

  assert.equal(chat.status, "ready");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].question, "核心结论？");
  assert.equal(calls[0].parentId, "a-before");
  assert.equal(calls[0].assistantMessageId, "a-sdk");
  assert.equal(chat.messages.at(-1).id, "a-sdk");
  assert.equal(readerChatMessageText(chat.messages.at(-1)), "第一段第二段");
  assert.equal(chat.messages.at(-1).metadata.status, "complete");
  assert.equal(chat.messages.at(-1).metadata.citations[0].page_idx, 2);
});

test("AI SDK stop aborts the existing RetainPDF request and keeps partial text", async () => {
  let requestSignal;
  let startedResolve;
  const started = new Promise((resolve) => { startedResolve = resolve; });
  const answerer = {
    async answer(options) {
      requestSignal = options.signal;
      options.onAnswerDelta("已经生成", "已经生成");
      startedResolve();
      await new Promise((resolve, reject) => {
        options.signal.addEventListener("abort", () => {
          const error = new Error("aborted");
          error.name = "AbortError";
          reject(error);
        }, { once: true });
      });
      return { answer: "不应完成", citations: [] };
    },
  };
  const chat = new Chat({
    id: "chat-cancel",
    transport: new RetainPdfChatTransport({
      jobId: "job-cancel",
      getRemoteAnswerer: () => answerer,
    }),
  });

  const sending = chat.sendMessage({
    id: "u-cancel",
    role: "user",
    parts: [{ type: "text", text: "停止测试" }],
  }, { body: { assistantMessageId: "a-cancel" } });
  await started;
  await new Promise((resolve) => setTimeout(resolve, 10));
  await chat.stop();
  await sending;

  assert.equal(requestSignal.aborted, true);
  assert.equal(chat.status, "ready");
  assert.equal(readerChatMessageText(chat.messages.at(-1)), "已经生成");
});
