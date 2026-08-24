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
