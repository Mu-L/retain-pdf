import test from "node:test";
import assert from "node:assert/strict";

import {
  DEEPSEEK_BALANCE_CHECK_TIMEOUT_MS,
  ensureDeepSeekBudgetReady,
  ensureOcrCredentialsForSubmit,
  needsDeepSeekBudgetCheck,
  runSubmitFlow,
} from "../../src/features/ingest/domain/actions/submit-flow.js";
import { currentSubmitReadiness } from "../../src/features/ingest/domain/actions/submit-flow.js";

function createHarness(overrides = {}) {
  const calls = [];
  const errors = [];
  const deps = {
    workflow: "book",
    desktopMode: false,
    desktopConfigured: true,
    apiPrefix: "/api",
    uploadId: "upload-1",
    configPort: { isMock: () => false },
    state: { marker: "state" },
    setText: (id, text) => {
      calls.push(["setText", id]);
      errors.push({ id, text });
    },
    workflowNeedsUpload: () => true,
    workflowNeedsCredentials: () => true,
    hasBrowserCredentials: () => true,
    currentRenderSourceJobId: () => "",
    currentBudgetState: () => ({}),
    validateBeforeSubmit: () => true,
    ensureOcrCredentialsReady: () => true,
    collectRunPayload: () => ({ workflow: "book" }),
    submitJobRequest: async (_prefix, _payload) => ({ job_id: "job-new" }),
    libraryEventPort: {
      publishJobCreated: (job) => calls.push(["created", job?.job_id]),
    },
    ...overrides,
  };
  deps.calls = calls;
  deps.errors = errors;
  return deps;
}

test("facade keeps the original public surface", () => {
  assert.equal(DEEPSEEK_BALANCE_CHECK_TIMEOUT_MS, 12000);
  assert.equal(typeof runSubmitFlow, "function");
  assert.equal(typeof needsDeepSeekBudgetCheck, "function");
  assert.equal(typeof ensureDeepSeekBudgetReady, "function");
  assert.equal(typeof ensureOcrCredentialsForSubmit, "function");
  assert.equal(typeof currentSubmitReadiness, "function");
});

test("runSubmitFlow mock branch skips validation and publishes success", async () => {
  const h = createHarness({ configPort: { isMock: () => true } });
  const result = await runSubmitFlow(h);
  assert.equal(result.status, "submitted");
  assert.equal(result.mock, true);
  assert.equal(result.payload.job_id, "job-new");
  assert.deepEqual(h.calls[0], ["setText", "error-box"]);
  assert.deepEqual(h.calls[1], ["created", "job-new"]);
});

test("runSubmitFlow blocks on readiness without requesting submit", async () => {
  let requested = false;
  const h = createHarness({
    hasBrowserCredentials: () => false,
    submitJobRequest: async () => {
      requested = true;
      return {};
    },
  });
  const result = await runSubmitFlow(h);
  assert.equal(result.status, "blocked");
  assert.equal(requested, false);
  assert.equal(h.errors.at(-1).text, "请先填写当前 OCR Provider 凭证。");
});

test("runSubmitFlow returns invalid_page_ranges before any request", async () => {
  let requested = false;
  const h = createHarness({
    validateBeforeSubmit: () => false,
    submitJobRequest: async () => {
      requested = true;
      return {};
    },
  });
  const result = await runSubmitFlow(h);
  assert.equal(result.status, "invalid_page_ranges");
  assert.equal(requested, false);
});

test("runSubmitFlow returns budget_not_ready when balance blocks", async () => {
  // withTimeout 是浏览器实现（裸 window），测试环境需补上计时器宿主。
  const hadWindow = "window" in globalThis;
  globalThis.window = globalThis;
  try {
    const h = createHarness({
      currentBudgetState: () => ({ visible: true, blocking: false, balanceChecked: true }),
      refreshDeepSeekBalance: async () => ({ status: "missing_key" }),
    });
    const result = await runSubmitFlow(h);
    assert.equal(result.status, "budget_not_ready");
    assert.match(String(h.errors.at(-1).text), /DeepSeek API Key/);
  } finally {
    if (!hadWindow) {
      delete globalThis.window;
    }
  }
});

test("runSubmitFlow returns ocr_credentials_not_ready when credentials fail", async () => {
  const h = createHarness({ ensureOcrCredentialsReady: () => false });
  const result = await runSubmitFlow(h);
  assert.equal(result.status, "ocr_credentials_not_ready");
});

test("runSubmitFlow submits real payload and publishes success", async () => {
  const h = createHarness();
  const result = await runSubmitFlow(h);
  assert.equal(result.status, "submitted");
  assert.equal(result.mock, false);
  assert.deepEqual(result.payload, { job_id: "job-new" });
  assert.deepEqual(h.calls.at(-1), ["created", "job-new"]);
});

test("runSubmitFlow maps missing upload errors without diagnostics", async () => {
  let handled = 0;
  const h = createHarness({
    submitJobRequest: async () => {
      throw new Error("upload not found");
    },
    isMissingUploadError: () => true,
    handleMissingUploadError: () => {
      handled += 1;
    },
  });
  const result = await runSubmitFlow(h);
  assert.equal(result.status, "missing_upload");
  assert.equal(handled, 1);
});

test("runSubmitFlow writes an error-box diagnostic for generic failures", async () => {
  const h = createHarness({
    submitJobRequest: async () => {
      throw new Error("boom");
    },
    isMissingUploadError: () => false,
  });
  const result = await runSubmitFlow(h);
  assert.equal(result.status, "error");
  const lastText = h.errors.at(-1).text;
  assert.match(String(lastText.summary), /提交 PDF 任务失败：boom/);
  assert.match(String(lastText.diagnostic), /\/jobs/);
});

test("ensureDeepSeekBudgetReady short-circuits when budget is not visible", async () => {
  const calls = [];
  const ok = await ensureDeepSeekBudgetReady({
    workflowNeedsUpload: () => true,
    currentBudgetState: () => ({ visible: false }),
    setText: (id, text) => calls.push([id, text]),
  });
  assert.equal(ok, true);
  assert.deepEqual(calls, []);
  assert.equal(needsDeepSeekBudgetCheck({
    workflowNeedsUpload: () => true,
    currentBudgetState: () => ({ visible: false }),
  }), false);
});
