import { normalizeBlockKey } from "../utils/block-key.js";
import type { ReaderPaneId } from "../../pdf/reader-dom-contract.js";

export type ReaderRegionBox = {
  page: number;
  bbox: [number, number, number, number];
  unit: "pdf_point";
  origin: "top_left" | "bottom_left";
  text: string;
};

export type ReaderRegion = {
  itemId: string;
  source: ReaderRegionBox;
  translated: ReaderRegionBox;
  markdown: string;
  regionType: string;
  status: string;
};

export type ReaderPageMetadata = {
  page: number;
  width: number;
  height: number;
};

export type ReaderDocumentMetadata = {
  pageCount: number;
  pages: ReaderPageMetadata[];
};

export type ReaderMetadata = {
  source: ReaderDocumentMetadata | null;
  translated: ReaderDocumentMetadata | null;
};

export type ReaderRegionHighlight = {
  itemId: string;
  box: ReaderRegionBox;
  pageSize: ReaderPageMetadata;
};

export type ReaderRegionRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function asObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function unwrapData(value: unknown): unknown {
  const object = asObject(value);
  return object && "data" in object ? object.data : value;
}

function finitePositive(value: unknown): number | null {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function normalizeBox(value: unknown): ReaderRegionBox | null {
  const object = asObject(value);
  if (!object || !Array.isArray(object.bbox) || object.bbox.length !== 4) return null;
  const values = object.bbox.map(Number);
  if (!values.every(Number.isFinite)) return null;
  const page = finitePositive(object.page);
  if (page == null) return null;
  const [rawX0, rawY0, rawX1, rawY1] = values;
  const x0 = Math.min(rawX0, rawX1);
  const y0 = Math.min(rawY0, rawY1);
  const x1 = Math.max(rawX0, rawX1);
  const y1 = Math.max(rawY0, rawY1);
  if (x1 <= x0 || y1 <= y0) return null;
  const unit = `${object.unit || "pdf_point"}`.trim().toLowerCase();
  if (unit !== "pdf_point" && unit !== "pt") return null;
  const origin = `${object.origin || "top_left"}`.trim().toLowerCase();
  if (origin !== "top_left" && origin !== "bottom_left") return null;
  return {
    page: Math.floor(page),
    bbox: [x0, y0, x1, y1],
    unit: "pdf_point",
    origin,
    text: `${object.text || ""}`,
  };
}

export function normalizeReaderRegions(payload: unknown): ReaderRegion[] {
  const object = asObject(unwrapData(payload));
  const items = Array.isArray(object?.items) ? object.items : [];
  const regions: ReaderRegion[] = [];
  for (const raw of items) {
    const item = asObject(raw);
    const itemId = `${item?.item_id || item?.itemId || ""}`.trim();
    const source = normalizeBox(item?.source);
    const translated = normalizeBox(item?.translated);
    if (!itemId || !source || !translated) continue;
    regions.push({
      itemId,
      source,
      translated,
      markdown: `${item?.markdown || ""}`,
      regionType: `${item?.region_type || item?.regionType || ""}`,
      status: `${item?.status || ""}`,
    });
  }
  return regions;
}

function normalizeDocumentMetadata(value: unknown): ReaderDocumentMetadata | null {
  const object = asObject(value);
  if (!object) return null;
  const pages: ReaderPageMetadata[] = [];
  for (const raw of Array.isArray(object.pages) ? object.pages : []) {
    const page = asObject(raw);
    const pageNumber = finitePositive(page?.page);
    const width = finitePositive(page?.width);
    const height = finitePositive(page?.height);
    if (pageNumber == null || width == null || height == null) continue;
    pages.push({ page: Math.floor(pageNumber), width, height });
  }
  if (!pages.length) return null;
  const rawCount = finitePositive(object.page_count ?? object.pageCount);
  return {
    pageCount: rawCount == null ? pages.length : Math.floor(rawCount),
    pages,
  };
}

export function normalizeReaderMetadata(payload: unknown): ReaderMetadata {
  const object = asObject(unwrapData(payload));
  return {
    source: normalizeDocumentMetadata(object?.source),
    translated: normalizeDocumentMetadata(object?.translated),
  };
}

export function findReaderRegion(
  regions: readonly ReaderRegion[],
  blockId: string | null | undefined,
): ReaderRegion | null {
  const key = normalizeBlockKey(blockId);
  if (!key) return null;
  return regions.find((region) => normalizeBlockKey(region.itemId) === key) || null;
}

export function regionBoxForPane(
  region: ReaderRegion,
  pane: ReaderPaneId,
): ReaderRegionBox {
  return pane === "translated" ? region.translated : region.source;
}

export function resolveReaderRegionHighlight(
  region: ReaderRegion | null | undefined,
  metadata: ReaderMetadata | null | undefined,
  pane: ReaderPaneId,
): ReaderRegionHighlight | null {
  if (!region || !metadata) return null;
  const box = regionBoxForPane(region, pane);
  const documentMetadata = pane === "translated" ? metadata.translated : metadata.source;
  const pageSize = documentMetadata?.pages.find((page) => page.page === box.page);
  return pageSize ? { itemId: region.itemId, box, pageSize } : null;
}

export function projectReaderRegion(
  highlight: ReaderRegionHighlight | null | undefined,
  renderedWidth: number,
  renderedHeight: number,
): ReaderRegionRect | null {
  if (!highlight || renderedWidth <= 0 || renderedHeight <= 0) return null;
  const { box, pageSize } = highlight;
  if (pageSize.width <= 0 || pageSize.height <= 0) return null;
  const [x0, rawY0, x1, rawY1] = box.bbox;
  const y0 = box.origin === "bottom_left" ? pageSize.height - rawY1 : rawY0;
  const y1 = box.origin === "bottom_left" ? pageSize.height - rawY0 : rawY1;
  const left = Math.max(0, Math.min(renderedWidth, x0 / pageSize.width * renderedWidth));
  const right = Math.max(left, Math.min(renderedWidth, x1 / pageSize.width * renderedWidth));
  const top = Math.max(0, Math.min(renderedHeight, y0 / pageSize.height * renderedHeight));
  const bottom = Math.max(top, Math.min(renderedHeight, y1 / pageSize.height * renderedHeight));
  if (right <= left || bottom <= top) return null;
  return { left, top, width: right - left, height: bottom - top };
}
