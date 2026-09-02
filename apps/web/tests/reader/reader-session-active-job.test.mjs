import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/reader.html?document_id=doc-ocr",
  pretendToBeVisual: true,
});
for (const key of ["window", "document", "history", "location", "HTMLElement", "Event", "Node"]) {
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
const { useReaderSession } = await import("../../../../packages/reader/src/hooks/use-reader-session.ts");

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitFor(predicate, description) {
  const deadline = Date.now() + 2000;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await wait(10);
  }
  assert.fail(`等待超时：${description}`);
}

test("document active_job becomes the effective reader job and keeps the document source PDF", async () => {
  const calls = [];
  const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
  setReaderAdapters({
    isMockMode: () => false,
    resolveResourceUrl: (url) => url,
    resolveReaderJobId: () => "",
    resolveReaderDocumentId: () => "doc-ocr",
    resolveReaderSourcePdf: () => "",
    resolveReaderTranslatedPdfUrl: () => "",
    resolveReaderArtifactUrl: () => "",
    defaultReaderPageConfigPort: {
      messageTargetOrigin: () => "*",
    },
    defaultReaderDataPort: {
      fetchProtected: async (url) => {
        calls.push(url);
        if (url === "/api/v1/documents/doc-ocr") {
          return {
            ok: true,
            json: async () => ({ data: { active_job_id: "job-ocr" } }),
          };
        }
        assert.equal(url, "/api/v1/documents/doc-ocr/source.pdf");
        return {
          ok: true,
          arrayBuffer: async () => pdfBytes.buffer.slice(0),
        };
      },
      loadReaderPayload: async (jobId) => {
        calls.push(`payload:${jobId}`);
        return {
          jobPayload: { title: "OCR document" },
          manifestPayload: {},
        };
      },
    },
  });

  const sessions = [];
  function HookHost() {
    const session = useReaderSession();
    React.useEffect(() => {
      sessions.push(session);
    }, [session]);
    return null;
  }

  const host = dom.window.document.createElement("div");
  dom.window.document.body.appendChild(host);
  const root = createRoot(host);
  root.render(React.createElement(HookHost));

  await waitFor(
    () => sessions.some((session) => session.assetsReady && session.jobId === "job-ocr"),
    "active job session ready",
  );

  const session = sessions.at(-1);
  assert.equal(session.jobId, "job-ocr");
  assert.equal(session.documentId, "doc-ocr");
  assert.equal(session.sourceOnly, false, "真实 active job 不应继续被标记为纯源文档");
  assert.equal(session.sourceUrl, "/api/v1/documents/doc-ocr/source.pdf");
  assert.equal(session.download.jobId, "job-ocr");
  assert.equal(session.download.sourceOnly, false);
  assert.ok(session.sourceFile, "OCR-only 没有 PDF artifact 时仍应加载馆藏源 PDF");
  assert.deepEqual(calls, [
    "/api/v1/documents/doc-ocr",
    "payload:job-ocr",
    "/api/v1/documents/doc-ocr/source.pdf",
  ]);

  root.unmount();
  host.remove();
  setReaderAdapters(null);
});

test("committed Agent operation reloads the authoritative document source instead of the immutable job artifact", async () => {
  const calls = [];
  const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
  setReaderAdapters({
    isMockMode: () => false,
    resolveResourceUrl: (url) => url,
    resolveReaderJobId: () => "job-agent",
    resolveReaderDocumentId: () => "",
    resolveReaderSourcePdf: () => "/api/v1/jobs/job-agent/artifacts/source_pdf",
    resolveReaderTranslatedPdfUrl: () => "/api/v1/jobs/job-agent/pdf",
    resolveReaderArtifactUrl: () => "",
    defaultReaderPageConfigPort: {
      messageTargetOrigin: () => "*",
    },
    defaultReaderDataPort: {
      fetchProtected: async (url) => {
        calls.push(url);
        return {
          ok: true,
          arrayBuffer: async () => pdfBytes.buffer.slice(0),
        };
      },
      loadReaderPayload: async (jobId) => ({
        jobPayload: { job_id: jobId, title: "Agent document" },
        manifestPayload: {},
        regionsPayload: [{ block_id: "old-region" }],
        readerMetadata: { source: { page_count: 1 } },
      }),
    },
  });

  const sessions = [];
  function HookHost() {
    const session = useReaderSession();
    React.useEffect(() => {
      sessions.push(session);
    }, [session]);
    return null;
  }

  const host = dom.window.document.createElement("div");
  dom.window.document.body.appendChild(host);
  const root = createRoot(host);
  root.render(React.createElement(HookHost));

  await waitFor(
    () => sessions.some((session) => session.assetsReady && !session.sourceOnly),
    "immutable job artifacts ready",
  );
  const before = sessions.at(-1);
  assert.equal(before.sourceUrl, "/api/v1/jobs/job-agent/artifacts/source_pdf");
  assert.equal(before.translatedUrl, "/api/v1/jobs/job-agent/pdf");

  before.refreshCommittedDocument({ documentId: "doc-agent", revision: "version-2" });
  await waitFor(
    () => sessions.some((session) => session.assetsReady
      && session.sourceUrl === "/api/v1/documents/doc-agent/source.pdf?version=version-2"),
    "committed document source ready",
  );

  const after = sessions.at(-1);
  assert.equal(after.sourceOnly, false, "保留真实 job 后 Markdown/AI 仍应可用");
  assert.equal(after.jobId, "job-agent");
  assert.equal(after.download.sourceOnly, true, "下载和视图仍只使用新的文档源版本");
  assert.equal(after.mode, "source");
  assert.equal(after.translatedUrl, "", "旧 job 的译文不能继续与新源版本并排显示");
  assert.deepEqual(after.regions, [], "旧页序的区域坐标应失效");
  assert.equal(after.readerMetadata.source, null, "旧页序的 reader metadata 应失效");
  assert.ok(calls.includes("/api/v1/documents/doc-agent/source.pdf?version=version-2"));

  root.unmount();
  host.remove();
  setReaderAdapters(null);
});

test("explicit job snapshot keeps comparison even when its document has an active Agent version", async () => {
  const calls = [];
  let documentLookupCount = 0;
  const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
  setReaderAdapters({
    apiPrefix: "/api/v1",
    isMockMode: () => false,
    resolveResourceUrl: (url) => url,
    resolveReaderJobId: () => "job-from-library",
    resolveReaderDocumentId: () => "",
    resolveReaderSourcePdf: () => "/api/v1/jobs/job-from-library/artifacts/source_pdf",
    resolveReaderTranslatedPdfUrl: () => "/api/v1/jobs/job-from-library/pdf",
    resolveReaderArtifactUrl: () => "",
    fetchDocumentByJobId: async () => {
      documentLookupCount += 1;
      return {
        document_id: "doc-from-library",
        active_version_id: "active-version-7",
      };
    },
    defaultReaderPageConfigPort: {
      messageTargetOrigin: () => "*",
    },
    defaultReaderDataPort: {
      fetchProtected: async (url) => {
        calls.push(url);
        return {
          ok: true,
          arrayBuffer: async () => pdfBytes.buffer.slice(0),
        };
      },
      loadReaderPayload: async (jobId) => ({
        jobPayload: { job_id: jobId, title: "Committed document" },
        manifestPayload: {},
      }),
    },
  });

  const sessions = [];
  function HookHost() {
    const session = useReaderSession();
    React.useEffect(() => {
      sessions.push(session);
    }, [session]);
    return null;
  }

  const host = dom.window.document.createElement("div");
  dom.window.document.body.appendChild(host);
  const root = createRoot(host);
  root.render(React.createElement(HookHost));

  await waitFor(
    () => sessions.some((session) => session.assetsReady
      && session.sourceUrl === "/api/v1/jobs/job-from-library/artifacts/source_pdf"
      && session.translatedUrl === "/api/v1/jobs/job-from-library/pdf"),
    "immutable job comparison loaded",
  );

  const session = sessions.at(-1);
  assert.equal(session.sourceOnly, false);
  assert.equal(session.jobId, "job-from-library");
  assert.equal(session.download.sourceOnly, false);
  assert.equal(session.mode, "compare");
  assert.equal(session.sourceUrl, "/api/v1/jobs/job-from-library/artifacts/source_pdf");
  assert.equal(session.translatedUrl, "/api/v1/jobs/job-from-library/pdf");
  assert.ok(calls.includes("/api/v1/jobs/job-from-library/artifacts/source_pdf"));
  assert.ok(calls.includes("/api/v1/jobs/job-from-library/pdf"));
  assert.equal(documentLookupCount, 0, "显式 job 快照不应被文档活动版本覆盖");

  root.unmount();
  host.remove();
  setReaderAdapters(null);
});

test("prepareClose aborts the active PDF request and suppresses its late failure UI", async () => {
  let requestSignal = null;
  let rejectPdfRequest = null;
  setReaderAdapters({
    isMockMode: () => false,
    resolveResourceUrl: (url) => url,
    resolveReaderJobId: () => "job-closing",
    resolveReaderDocumentId: () => "",
    resolveReaderSourcePdf: () => "/api/v1/jobs/job-closing/artifacts/source_pdf",
    resolveReaderTranslatedPdfUrl: () => "",
    resolveReaderArtifactUrl: () => "",
    defaultReaderPageConfigPort: {
      messageTargetOrigin: () => "*",
    },
    defaultReaderDataPort: {
      fetchProtected: async (_url, init = {}) => new Promise((_resolve, reject) => {
        requestSignal = init.signal;
        rejectPdfRequest = reject;
        init.signal?.addEventListener("abort", () => {
          reject(new Error("late close failure"));
        }, { once: true });
      }),
      loadReaderPayload: async (jobId) => ({
        jobPayload: { job_id: jobId, title: "Closing document" },
        manifestPayload: {},
      }),
    },
  });

  const sessions = [];
  function HookHost() {
    const session = useReaderSession();
    React.useEffect(() => {
      sessions.push(session);
    }, [session]);
    return null;
  }

  const host = dom.window.document.createElement("div");
  dom.window.document.body.appendChild(host);
  const root = createRoot(host);
  root.render(React.createElement(HookHost));

  await waitFor(() => Boolean(requestSignal) && sessions.length > 0, "PDF request started");
  sessions.at(-1).prepareClose();
  assert.equal(requestSignal.aborted, true, "关闭动作必须立即中止 PDF 请求");
  assert.equal(typeof rejectPdfRequest, "function");

  await wait(30);
  assert.equal(sessions.at(-1).boot.failed, false, "关闭后的迟到失败不能渲染错误提示");

  root.unmount();
  host.remove();
  setReaderAdapters(null);
});
