import test, { before } from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let adapter;

before(async () => {
  global.window = {
    __FRONT_RUNTIME_CONFIG__: {
      apiBase: "https://api.example.test/api/v1",
    },
    location: {
      protocol: "https:",
      hostname: "app.example.test",
      origin: "https://app.example.test",
    },
  };

  const result = await build({
    absWorkingDir: APP_ROOT,
    bundle: true,
    define: {
      "import.meta.env": "{}",
    },
    entryPoints: ["src/features/library/api/library-api-adapter.ts"],
    format: "esm",
    platform: "node",
    sourcemap: "inline",
    write: false,
  });

  const bundledSource = result.outputFiles[0].text;
  adapter = await import(`data:text/javascript;base64,${Buffer.from(bundledSource).toString("base64")}`);
});

function listView() {
  return {
    items: [{
      id: "book-list",
      job_id: "book-list",
      title: "List title",
      display_name: "List display name",
      authors: "List author",
      source_file_name: "list.pdf",
      page_count: 42,
      status: "running",
      stage: "rendering",
      stage_detail: "Rendering 3/4",
      progress: { current: 3, total: 4, percent: 75, unit: "page" },
      cover_url: "/api/v1/jobs/book-list/cover",
      thumbnail_url: "/api/v1/jobs/book-list/thumbnail",
      output_pdf_ready: true,
      markdown_ready: false,
      bundle_ready: true,
      created_at: "2026-08-20T01:00:00Z",
      updated_at: "2026-08-21T02:00:00Z",
    }],
  };
}

function detailView(overrides = {}) {
  return {
    id: "book-detail",
    job_id: "book-detail",
    title: "Refreshed title",
    authors: "Refreshed author",
    source_file_name: "detail.pdf",
    page_count: 64,
    source_language: "en",
    target_language: "zh",
    file_size_bytes: 2048,
    status: "succeeded",
    stage: "done",
    progress: { current: 64, total: 64, percent: 100, unit: "page" },
    cover_url: "/api/v1/jobs/book-detail/cover",
    thumbnail_url: "/api/v1/jobs/book-detail/thumbnail",
    artifacts: [
      {
        key: "output_pdf",
        label: "Translated PDF",
        ready: true,
        kind: "pdf",
        file_name: "translated.pdf",
        size_bytes: 1024,
        download_url: "/api/v1/jobs/book-detail/artifacts/output_pdf",
      },
      {
        key: "markdown",
        label: "Markdown",
        ready: true,
        kind: "markdown",
        file_name: "book.md",
        size_bytes: 256,
        download_url: "/api/v1/jobs/book-detail/artifacts/markdown",
      },
    ],
    ...overrides,
  };
}

function previousBook() {
  return {
    id: "book-detail",
    title: "Previous title",
    authors: "Previous author",
    pages: 12,
    status: "processing",
    updatedAt: "previous updated",
    progressLabel: "previous progress",
    coverTone: "medium",
    coverUrl: "previous cover",
    thumbnailUrl: "previous thumbnail",
    detail: {
      sourceLanguage: "previous source",
      targetLanguage: "previous target",
      workflow: "book",
      ocrProvider: "previous ocr",
      translationEngine: "previous translator",
      fileSize: "previous size",
      createdAt: "previous created",
      description: "previous description",
      tags: ["previous-tag"],
      artifacts: [],
    },
    snapshot: {
      activeStage: "translate",
      selectedStage: "translate",
      elapsedText: "处理中",
      pdfReady: false,
      readerReady: false,
      stageProgress: {},
    },
  };
}

test("list DTO maps thumbnail, artifacts, and readiness", () => {
  const [book] = adapter.jobListToLibraryBooks(listView().items);

  assert.equal(book.thumbnailUrl, "https://api.example.test/api/v1/jobs/book-list/thumbnail");
  assert.deepEqual(
    book.detail.artifacts.map(({ key, state }) => ({ key, state })),
    [
      { key: "pdf", state: "ready" },
      { key: "markdown", state: "processing" },
      { key: "bundle", state: "ready" },
    ],
  );
  assert.equal(book.snapshot.pdfReady, true);
  assert.equal(book.snapshot.readerReady, false);
});

test("detail refresh preserves previous UI-only fields and maps artifact readiness", () => {
  const book = adapter.jobDetailToLibraryBook(detailView(), previousBook());

  assert.equal(book.detail.workflow, "book");
  assert.equal(book.detail.createdAt, "previous created");
  assert.equal(book.updatedAt, "previous updated");
  assert.equal(book.thumbnailUrl, "https://api.example.test/api/v1/jobs/book-detail/thumbnail");
  assert.deepEqual(book.detail.artifacts[0], {
    key: "output_pdf",
    label: "Translated PDF",
    state: "ready",
    detail: "translated.pdf",
    kind: "pdf",
    fileName: "translated.pdf",
    sizeBytes: 1024,
    downloadUrl: "/api/v1/jobs/book-detail/artifacts/output_pdf",
  });
  assert.equal(book.snapshot.pdfReady, true);
  assert.equal(book.snapshot.readerReady, true);
});

test("detail refresh without previous state does not invent removed wire fields", () => {
  const book = adapter.jobDetailToLibraryBook(detailView({ artifacts: [] }));

  assert.equal(book.detail.workflow, "");
  assert.equal(book.detail.createdAt, "");
  assert.equal(book.updatedAt, "");
  assert.deepEqual(book.detail.artifacts, []);
});
