import test, { before } from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let flow;
let readerSelectors;

async function bundle(entry) {
  const result = await build({
    absWorkingDir: APP_ROOT,
    bundle: true,
    define: { "import.meta.env": "{}" },
    entryPoints: [entry],
    format: "esm",
    platform: "node",
    sourcemap: "inline",
    write: false,
  });
  const src = result.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(src).toString("base64")}`);
}

before(async () => {
  flow = await bundle("src/features/library/model/library-shelf-flow.ts");
  readerSelectors = await bundle("src/features/library/components/book-reader-dialog/book-reader-selectors.ts");
});

// select/open/download/delete 四回调可测：action keys齐全
test("shelf flow exposes select/open/download/delete action keys", () => {
  for (const key of ["selectBook", "openReader", "downloadPdf", "downloadArtifact", "deleteBook"]) {
    assert.ok(flow.SHELF_FLOW_ACTION_KEYS.includes(key), `missing action ${key}`);
  }
  assert.equal(flow.SHELF_READER_ROUTE_TO, "/reader/$jobId");
});

// onSelectBook弹详情：空id不弹，非空可弹
test("select guards empty book id (detailOpen precondition)", () => {
  assert.equal(flow.canOpenDetail(""), false);
  assert.equal(flow.canOpenDetail("   "), false);
  assert.equal(flow.canOpenDetail("job-1"), true);
});

// onOpenReader进/reader/$jobId：Router params + href，不用window.open
test("openReader resolves /reader/$jobId route target", () => {
  assert.deepEqual(flow.readerRouteParams("job-1"), { jobId: "job-1" });
  assert.equal(flow.readerRouteHref("job-1"), "/reader/job-1");
  assert.equal(flow.readerRouteHref("a/b c"), "/reader/a%2Fb%20c");
  assert.equal(flow.readerRouteParams("  "), null);
  assert.equal(flow.readerRouteHref(""), null);
  // 预览弹窗的Link与controller同源，不重复实现路由
  assert.equal(readerSelectors.fullReaderRouteTo(), "/reader/$jobId");
  assert.equal(readerSelectors.fullReaderRouteHref("job-1"), flow.readerRouteHref("job-1"));
});

// downloadPdf真调library-api-client：优先ready产物，否则回退jobs下载
test("downloadPdf prefers ready artifact, falls back to jobs download", () => {
  const book = {
    id: "job-1",
    title: "Demo",
    detail: {
      artifacts: [
        { key: "pdf", state: "ready", downloadUrl: "/api/v1/jobs/job-1/artifacts/output_pdf", fileName: "out.pdf" },
      ],
    },
  };
  const hit = flow.resolvePdfDownloadTarget(book, "job-1");
  assert.equal(hit.url, "/api/v1/jobs/job-1/artifacts/output_pdf");
  assert.equal(hit.fileName, "Demo.pdf");
  assert.equal(hit.fromArtifact, true);

  const fallback = flow.resolvePdfDownloadTarget({ id: "job-2", title: "", detail: { artifacts: [] } }, "job-2");
  assert.equal(fallback.url, "jobs/job-2/download");
  assert.equal(fallback.fromArtifact, false);

  assert.equal(flow.resolvePdfDownloadTarget(null, ""), null);
});

// downloadArtifact：不可下载返回null，上层toast而不白屏
test("downloadArtifact returns null when not downloadable", () => {
  const book = {
    id: "job-1",
    detail: {
      artifacts: [
        { key: "pdf", state: "ready", downloadUrl: "/api/v1/jobs/job-1/pdf", fileName: "a.pdf" },
        { key: "md", state: "processing", downloadUrl: "/api/v1/jobs/job-1/md" },
      ],
    },
  };
  assert.deepEqual(flow.resolveArtifactDownloadTarget(book, "pdf"), {
    url: "/api/v1/jobs/job-1/pdf",
    fileName: "a.pdf",
  });
  assert.equal(flow.resolveArtifactDownloadTarget(book, "md"), null);
  assert.equal(flow.resolveArtifactDownloadTarget(book, "missing"), null);
  assert.equal(flow.resolveArtifactDownloadTarget(null, "pdf"), null);
  // 无fileName时回退 bookId-key
  const noName = flow.resolveArtifactDownloadTarget(
    { id: "job-9", detail: { artifacts: [{ key: "bundle", state: "ready", downloadUrl: "/u/b" }] } },
    "bundle",
  );
  assert.equal(noName.fileName, "job-9-bundle");
});

// deleteBook带确认：confirm=false取消，throw也不删
test("delete confirm wrapper respects user cancel", () => {
  assert.equal(flow.confirmShelfDelete(() => true, "确定删除这本书吗？"), true);
  assert.equal(flow.confirmShelfDelete(() => false, "确定删除这本书吗？"), false);
  assert.equal(
    flow.confirmShelfDelete(() => { throw new Error("x"); }, "msg"),
    false,
  );
  assert.equal(flow.confirmShelfDelete(undefined, "msg"), true);
});

// 全链任一步失败给toast不白屏：失败文案永不为空
test("shelf failures always produce non-empty toast text", () => {
  assert.ok(flow.friendlyShelfError(new Error("boom"), "下载 PDF 失败").length > 0);
  assert.equal(flow.friendlyShelfError("", "下载 PDF 失败"), "下载 PDF 失败");
  assert.equal(flow.friendlyShelfError(null, "删除失败"), "删除失败");
  assert.ok(flow.friendlyShelfError(undefined, "").length > 0);
});

// 全链串联：select -> open -> download -> delete 每步都有确定性输出
test("full shelf chain has deterministic output per step", () => {
  const bookId = "job-chain-1";
  assert.equal(flow.canOpenDetail(bookId), true); // 点卡弹详情
  assert.deepEqual(flow.readerRouteParams(bookId), { jobId: bookId }); // 点看对照进reader路由
  const book = {
    id: bookId,
    title: "Chain",
    detail: { artifacts: [{ key: "pdf", state: "ready", downloadUrl: "/api/v1/jobs/job-chain-1/pdf" }] },
  };
  assert.ok(flow.resolvePdfDownloadTarget(book, bookId)?.url.includes("job-chain-1")); // 能下载PDF
  assert.ok(flow.resolveArtifactDownloadTarget(book, "pdf")?.url.includes("job-chain-1")); // 能下载产物
  assert.equal(flow.confirmShelfDelete(() => true, "确定删除这本书吗？"), true); // 能删除（含确认）
});
