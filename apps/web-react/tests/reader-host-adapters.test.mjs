import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function readSource(relativePath) {
  return readFile(resolve(APP_ROOT, relativePath), "utf8");
}

test("web-react Reader host wires OCR Markdown document-to-legacy fallback", async () => {
  const source = await readSource("src/features/reader/reader-host-adapters.ts");
  const loadMethod = source.match(
    /async loadMarkdownPayload\(jobId: string\) \{([\s\S]*?)\n  \},\n  submitAiChat/,
  )?.[1] || "";

  assert.match(loadMethod, /loadMarkdownPayloadWithFallback\(/);
  assert.match(loadMethod, /fetchJobMarkdownDocument\(jobId\)/);
  assert.match(loadMethod, /fetchJobMarkdown\(jobId\)/);
});

test("web-react Reader host preserves page_idx and block_id URL anchors", async () => {
  const source = await readSource("src/features/reader/reader-host-adapters.ts");
  const anchorAdapter = source.match(
    /resolveReaderAnchor: \(\) => \{([\s\S]*?)\n  \},\n  resolveReaderDocumentId/,
  )?.[1] || "";

  assert.match(anchorAdapter, /params\.get\('page_idx'\)/);
  assert.match(anchorAdapter, /params\.get\('block_id'\)/);
  assert.match(anchorAdapter, /return \{ pageIdx:.*blockId \}/s);
});

test("ReaderPage injects the route job into the package host before rendering", async () => {
  const source = await readSource("src/features/reader/components/ReaderPage.tsx");
  assert.match(source, /setReaderHostJobId\(jobId\)/);
  assert.match(source, /<ReaderAppReactPdf key=\{jobId\} \/>/);
});
