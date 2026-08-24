import test from "node:test";
import assert from "node:assert/strict";
import { resolveReaderAnchor } from "../../../../packages/reader/src/shared/config/page-config.ts";
import { buildReaderPageUrl } from "@retainpdf/domain/job";
import { pageNumberFromUrlAnchor } from "../../../../packages/reader/src/hooks/use-url-anchor-jump.ts";
import {
  findReaderRegion,
  normalizeReaderMetadata,
  normalizeReaderRegions,
  projectReaderRegion,
  resolveReaderRegionHighlight,
} from "../../../../packages/reader/src/shared/data/reader-regions.ts";

test("resolveReaderAnchor 解析 page_idx/block_id,两者皆缺返回 null", () => {
  assert.deepEqual(resolveReaderAnchor({ search: "?job_id=j&page_idx=3&block_id=b-9" }), {
    pageIdx: 3,
    blockId: "b-9",
  });
  assert.deepEqual(resolveReaderAnchor({ search: "?page_idx=0" }), { pageIdx: 0, blockId: "" });
  assert.deepEqual(resolveReaderAnchor({ search: "?block_id=b-1" }), { pageIdx: null, blockId: "b-1" });
  assert.equal(resolveReaderAnchor({ search: "?job_id=j" }), null);
  assert.equal(resolveReaderAnchor({ search: "?page_idx=abc" }), null);
});

test("buildReaderPageUrl 透传锚点参数,page_idx=0 不丢失", () => {
  const url = new URL(buildReaderPageUrl("job-1", { pageIdx: 0, blockId: "b-intro-3" }));
  assert.equal(url.searchParams.get("job_id"), "job-1");
  assert.equal(url.searchParams.get("page_idx"), "0");
  assert.equal(url.searchParams.get("block_id"), "b-intro-3");
  const plain = new URL(buildReaderPageUrl("job-1"));
  assert.equal(plain.searchParams.get("page_idx"), null);
  assert.equal(plain.searchParams.get("block_id"), null);
});

test("pageNumberFromUrlAnchor: 0 基 page_idx → 1 基页码", () => {
  assert.equal(pageNumberFromUrlAnchor({ pageIdx: 0, blockId: "" }), 1);
  assert.equal(pageNumberFromUrlAnchor({ pageIdx: 3, blockId: "b-9" }), 4);
  assert.equal(pageNumberFromUrlAnchor({ pageIdx: null, blockId: "b-1" }), null);
  assert.equal(pageNumberFromUrlAnchor(null), null);
  assert.equal(pageNumberFromUrlAnchor({ pageIdx: -1, blockId: "" }), null);
  assert.equal(
    pageNumberFromUrlAnchor({ pageIdx: 8, blockId: "p001-b0002" }, () => 3),
    3,
  );
  assert.equal(
    pageNumberFromUrlAnchor({ pageIdx: 8, blockId: "missing" }, () => null),
    9,
  );
});

test("reader regions: API envelope、补零 block_id 与 source/translated 坐标统一", () => {
  const regions = normalizeReaderRegions({
    data: {
      items: [{
        item_id: "p001-b002",
        source: {
          page: 1,
          bbox: [10, 20, 110, 70],
          unit: "pdf_point",
          origin: "top_left",
          text: "source",
        },
        translated: {
          page: 2,
          bbox: [20, 30, 220, 90],
          unit: "pdf_point",
          origin: "top_left",
          text: "translated",
        },
        region_type: "text",
        status: "translated",
      }],
    },
  });
  assert.equal(regions.length, 1);
  assert.equal(findReaderRegion(regions, "p001-b0002")?.itemId, "p001-b002");
  assert.equal(findReaderRegion(regions, "missing"), null);

  const metadata = normalizeReaderMetadata({
    source: { page_count: 1, pages: [{ page: 1, width: 200, height: 100 }] },
    translated: { page_count: 2, pages: [{ page: 2, width: 400, height: 200 }] },
  });
  const source = resolveReaderRegionHighlight(regions[0], metadata, "source");
  const translated = resolveReaderRegionHighlight(regions[0], metadata, "translated");
  const sourceRect = projectReaderRegion(source, 400, 200);
  const translatedRect = projectReaderRegion(translated, 800, 400);
  assert.ok(sourceRect && translatedRect);
  assert.ok(Math.abs(sourceRect.left - 20) < 1e-9);
  assert.ok(Math.abs(sourceRect.top - 40) < 1e-9);
  assert.ok(Math.abs(sourceRect.width - 200) < 1e-9);
  assert.ok(Math.abs(sourceRect.height - 100) < 1e-9);
  assert.ok(Math.abs(translatedRect.left - 40) < 1e-9);
  assert.ok(Math.abs(translatedRect.top - 60) < 1e-9);
  assert.ok(Math.abs(translatedRect.width - 400) < 1e-9);
  assert.ok(Math.abs(translatedRect.height - 120) < 1e-9);
});

test("reader regions: bottom_left 可转换，非 PDF 坐标与坏 bbox 被拒绝", () => {
  const regions = normalizeReaderRegions({ items: [{
    item_id: "p1-b1",
    source: { page: 1, bbox: [10, 20, 30, 40], unit: "pt", origin: "bottom_left" },
    translated: { page: 1, bbox: [10, 20, 30, 40], unit: "pdf_point", origin: "top_left" },
  }, {
    item_id: "bad-unit",
    source: { page: 1, bbox: [0, 0, 10, 10], unit: "px", origin: "top_left" },
    translated: { page: 1, bbox: [0, 0, 10, 10], unit: "pdf_point", origin: "top_left" },
  }, {
    item_id: "bad-box",
    source: { page: 1, bbox: [0, 0, 0, 10], unit: "pdf_point", origin: "top_left" },
    translated: { page: 1, bbox: [0, 0, 10, 10], unit: "pdf_point", origin: "top_left" },
  }] });
  assert.equal(regions.length, 1);
  const metadata = normalizeReaderMetadata({
    source: { pages: [{ page: 1, width: 100, height: 100 }] },
    translated: null,
  });
  const highlight = resolveReaderRegionHighlight(regions[0], metadata, "source");
  assert.deepEqual(projectReaderRegion(highlight, 100, 100), {
    left: 10,
    top: 60,
    width: 20,
    height: 20,
  });
});

test("OCR-only block_id URL anchor resolves to the source page and bbox highlight", () => {
  const regions = normalizeReaderRegions({
    data: {
      items: [{
        item_id: "p002-b007",
        source: {
          page: 2,
          bbox: [72, 144, 288, 216],
          unit: "pdf_point",
          origin: "top_left",
          text: "OCR source block",
        },
        // OCR-only reader projection intentionally mirrors source geometry here.
        translated: {
          page: 2,
          bbox: [72, 144, 288, 216],
          unit: "pdf_point",
          origin: "top_left",
          text: "",
        },
        markdown: "OCR source block",
        region_type: "text",
        status: "source_only",
      }],
    },
  });
  const anchor = resolveReaderAnchor({
    search: "?job_id=job-ocr&page_idx=0&block_id=p002-b0007",
  });
  const page = pageNumberFromUrlAnchor(
    anchor,
    (blockId) => findReaderRegion(regions, blockId)?.source.page ?? null,
  );
  assert.equal(page, 2, "block geometry must win over a stale page_idx fallback");

  const metadata = normalizeReaderMetadata({
    source: { page_count: 2, pages: [{ page: 2, width: 720, height: 960 }] },
    translated: null,
  });
  const region = findReaderRegion(regions, anchor?.blockId);
  const highlight = resolveReaderRegionHighlight(region, metadata, "source");
  assert.deepEqual(projectReaderRegion(highlight, 360, 480), {
    left: 36,
    top: 72,
    width: 108,
    height: 36,
  });
  assert.equal(highlight?.itemId, "p002-b007");
  assert.equal(resolveReaderRegionHighlight(region, metadata, "translated"), null);
});
