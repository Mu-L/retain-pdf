import { API_PREFIX } from "@retainpdf/api/runtime";
import { fetchDocumentList } from "@retainpdf/api/documents";
import { listCollections } from "@retainpdf/api/collections";
import type { HomeAskCollectionScope, HomeAskDocScope, HomeAskScope } from "./types.ts";
import { scopeKey } from "./types.ts";

export function documentToScope(
  doc: Record<string, unknown>,
): HomeAskDocScope {
  const d = doc as unknown as {
    title?: string;
    source_filename?: string;
    document_id?: string;
    active_job_id?: string;
  };
  const title = `${d.title || d.source_filename || d.document_id || "未命名"}`.trim();
  const jobId = `${(d as unknown as { active_job_id?: string }).active_job_id || ""}`.trim();
  return {
    kind: "document",
    id: `${d.document_id || ""}`.trim(),
    title,
    job_id: jobId || undefined,
    source_filename: `${d.source_filename || ""}`.trim() || undefined,
  };
}

/** @deprecated */
export function documentToRef(doc: Record<string, unknown>): HomeAskDocScope {
  return documentToScope(doc);
}

export async function loadDocumentPickerOptions(limit = 80): Promise<HomeAskDocScope[]> {
  const res = await fetchDocumentList(API_PREFIX, { limit, offset: 0 });
  const docs = Array.isArray((res as { documents?: unknown[] })?.documents)
    ? (res as { documents: Record<string, unknown>[] }).documents
    : [];
  return docs.map((d) => documentToScope(d)).filter((d) => d.id);
}

export async function loadCollectionPickerOptions(): Promise<HomeAskCollectionScope[]> {
  const res = (await listCollections(API_PREFIX)) as {
    collections?: Array<{ collection_id?: string; name?: string; document_count?: number }>;
  };
  const list = Array.isArray(res?.collections) ? res.collections : [];
  return list
    .map((c) => ({
      kind: "collection" as const,
      id: `${c.collection_id || ""}`.trim(),
      title: `${c.name || c.collection_id || "未命名合集"}`.trim(),
      document_count: Number(c.document_count) || 0,
    }))
    .filter((c) => c.id);
}

export async function loadPickerOptions(docLimit = 100): Promise<HomeAskScope[]> {
  const [docs, cols] = await Promise.all([
    loadDocumentPickerOptions(docLimit).catch(() => [] as HomeAskDocScope[]),
    loadCollectionPickerOptions().catch(() => [] as HomeAskCollectionScope[]),
  ]);
  return [...cols, ...docs];
}

export function filterDocumentOptions(
  options: HomeAskScope[],
  query = "",
  excludeKeys: string[] = [],
): HomeAskScope[] {
  const q = `${query || ""}`.trim().toLowerCase();
  const excluded = new Set(excludeKeys.map((k) => k.trim()).filter(Boolean));
  return options
    .filter((opt) => !excluded.has(scopeKey(opt)))
    .filter((opt) => {
      if (!q) return true;
      if (opt.kind === "collection") {
        const hay = `合集 ${opt.title} ${opt.id}`.toLowerCase();
        return hay.includes(q);
      }
      const hay = `${opt.title} ${opt.source_filename || ""} ${opt.id}`.toLowerCase();
      return hay.includes(q);
    })
    .slice(0, 16);
}

export async function resolveCollectionDocuments(
  collectionId: string,
  limit = 80,
): Promise<HomeAskDocScope[]> {
  const id = `${collectionId || ""}`.trim();
  if (!id) return [];
  const res = await fetchDocumentList(API_PREFIX, { limit, offset: 0, collectionId: id });
  const docs = Array.isArray((res as { documents?: unknown[] })?.documents)
    ? (res as { documents: Record<string, unknown>[] }).documents
    : [];
  return docs.map((d) => documentToScope(d)).filter((d) => d.id);
}

export function parseAtQuery(
  text: string,
  caret: number,
): { start: number; query: string } | null {
  const head = `${text || ""}`.slice(0, Math.max(0, caret));
  const match = head.match(/(^|[\s\u3000])@([^\s@]*)$/);
  if (!match) return null;
  const atIndex = head.lastIndexOf("@");
  if (atIndex < 0) return null;
  return { start: atIndex, query: match[2] || "" };
}
