import { l as E } from "../markdown-payload-BLt0pYzy.js";
import { d as v } from "../pdf-document-config-DOSsufI-.js";
const $ = "/api/v1";
function C() {
  return Promise.resolve(null);
}
function F() {
  return Promise.resolve({ items: [] });
}
function T() {
  return Promise.resolve(null);
}
function S() {
  return Promise.resolve(null);
}
function I() {
  return Promise.resolve({ answer: "" });
}
function J() {
  return Promise.resolve({ items: [] });
}
function H() {
  return Promise.resolve(null);
}
function W() {
  return Promise.resolve(null);
}
function z(r, e) {
  return typeof globalThis.fetch == "function" ? globalThis.fetch(r, e) : Promise.reject(new Error(`fetchProtected not injected for ${r}`));
}
function B({
  apiPrefix: r = $,
  loadJob: e = C,
  loadManifest: u = F,
  loadMarkdown: t = T,
  loadMarkdownDocument: n = S,
  loadAiChat: s = I,
  loadRegions: a = J,
  loadMetadata: l = H,
  loadTranslationItem: d = W,
  fetchProtectedResource: p = z
} = {}) {
  async function f(c) {
    const [o, D, M, L] = await Promise.all([
      e(c, r),
      u(c, r),
      a(c, r).catch(() => ({ items: [] })),
      l(c, r).catch(() => null)
    ]);
    return {
      jobPayload: o,
      manifestPayload: D,
      readerMetadata: L,
      regionsPayload: M
    };
  }
  function w(c, o) {
    return d(c, o, r);
  }
  async function k(c) {
    return E(
      () => n(c, r),
      () => t(c, r)
    );
  }
  function _(c, o) {
    return s(c, o, r);
  }
  return Object.freeze({
    apiPrefix: r,
    fetchProtected: p,
    fetchRegionTranslationItem: w,
    loadMarkdownPayload: k,
    loadReaderPayload: f,
    submitAiChat: _
  });
}
const V = B();
function A(r) {
  return `${r ?? ""}`.trim();
}
function m(r = "") {
  return `${r ?? ""}`.trim() ? `${r}`.trim() : "";
}
const G = 512 * 1024;
let i = null;
function h(r = m) {
  return {
    moduleUrl: r("build/pdf.mjs"),
    workerUrl: r("build/pdf.worker.mjs"),
    cmapUrl: r("cmaps/"),
    standardFontDataUrl: r("standard_fonts/")
  };
}
async function K({ resolvePdfjsVendorUrl: r = m } = {}) {
  const { moduleUrl: e, workerUrl: u } = h(r);
  if (!e)
    throw new Error("resolvePdfjsVendorUrl not injected");
  return i || (i = import(e).then((t) => (t.GlobalWorkerOptions.workerSrc = u, t)).catch((t) => {
    throw i = null, t;
  })), i;
}
function N(r, { resolveResourceUrl: e = A } = {}) {
  return e((r == null ? void 0 : r.resource_url) || (r == null ? void 0 : r.resource_path) || "");
}
function O({
  url: r,
  configPort: e = v,
  resolvePdfjsVendorUrl: u = m
} = {}) {
  var s;
  if (!r)
    return null;
  const { cmapUrl: t, standardFontDataUrl: n } = h(u);
  return {
    url: r,
    httpHeaders: ((s = e == null ? void 0 : e.apiHeaders) == null ? void 0 : s.call(e)) ?? {},
    withCredentials: !1,
    disableRange: !1,
    disableStream: !1,
    rangeChunkSize: G,
    cMapUrl: t,
    cMapPacked: !0,
    standardFontDataUrl: n
  };
}
async function g({
  itemOrUrl: r,
  configPort: e = v,
  fetchProtected: u = null,
  resolveResourceUrl: t = A,
  resolvePdfjsVendorUrl: n = m
} = {}) {
  const s = typeof r == "string" ? r : N(r, { resolveResourceUrl: t });
  if (!s)
    return null;
  const a = await K({ resolvePdfjsVendorUrl: n }), { cmapUrl: l, standardFontDataUrl: d } = h(n);
  if (s.startsWith("mock://") && typeof u == "function") {
    const p = await u(s), f = new Uint8Array(await p.arrayBuffer());
    return a.getDocument({
      data: f,
      cMapUrl: l,
      cMapPacked: !0,
      standardFontDataUrl: d
    }).promise;
  }
  return a.getDocument(O({ url: s, configPort: e, resolvePdfjsVendorUrl: n })).promise;
}
function x() {
  i = null;
}
function R(r) {
  return `${r ?? ""}`.trim();
}
function U(r, e) {
  return (Array.isArray(r == null ? void 0 : r.items) ? r.items : []).find((t) => (t == null ? void 0 : t.artifact_key) === e && (t == null ? void 0 : t.ready)) || null;
}
function X(r, e, { resolveResourceUrl: u = R, findReadyManifestArtifact: t = U } = {}) {
  const n = t(r, e), s = `${(n == null ? void 0 : n.resource_url) || (n == null ? void 0 : n.resource_path) || ""}`.trim();
  return s ? u(s) : "";
}
function Z(r, { resolveResourceUrl: e = R } = {}) {
  return e((r == null ? void 0 : r.resource_url) || (r == null ? void 0 : r.resource_path) || "");
}
function q(r) {
  var s, a, l, d;
  if (!r) return null;
  const e = (r == null ? void 0 : r.actions) || {}, u = (r == null ? void 0 : r.artifacts) || {}, t = !!(((s = e.download_pdf) == null ? void 0 : s.enabled) ?? ((a = u.pdf) == null ? void 0 : a.ready) ?? (r == null ? void 0 : r.pdf_ready) ?? (r == null ? void 0 : r.output_pdf_ready)), n = `${((l = e.download_pdf) == null ? void 0 : l.url) || ((d = u.pdf) == null ? void 0 : d.url) || (r == null ? void 0 : r.pdf_url) || ""}`.trim();
  return { pdfEnabled: t, pdf: n ? R(n) : "" };
}
function y(r) {
  var e;
  return ((e = r == null ? void 0 : r.readerJobId) == null ? void 0 : e.call(r)) || "";
}
function P(r, {
  findReadyManifestArtifact: e = U,
  resolveManifestArtifactUrl: u = (t, n) => X(t, n, { findReadyManifestArtifact: e })
} = {}) {
  const t = u(r, "source_pdf");
  return t || e(r, "source_pdf");
}
function b(r, e, {
  resolveJobActions: u = q,
  findReadyManifestArtifact: t = U,
  resolveReaderArtifactUrl: n = Z,
  resolveResourceUrl: s = R
} = {}) {
  const a = r ? u(r) : null;
  if (a != null && a.pdfEnabled && (a != null && a.pdf))
    return a.pdf;
  const l = ["pdf", "translated_pdf", "result_pdf"];
  for (const f of l) {
    const w = t(e, f), _ = n(w, { resolveResourceUrl: s }) || n(w);
    if (_)
      return _;
  }
  const d = `${(r == null ? void 0 : r.workflow) || (r == null ? void 0 : r.job_type) || ""}`.trim().toLowerCase();
  return ((a == null ? void 0 : a.pdfEnabled) || `${(r == null ? void 0 : r.status) || ""}`.trim().toLowerCase() === "succeeded" && d !== "ocr") && (r != null && r.job_id) ? s(`/api/v1/jobs/${encodeURIComponent(r.job_id)}/pdf`) : "";
}
export {
  x as __resetPdfjsForTests,
  O as buildPdfDocumentOptions,
  B as createReaderDataPort,
  V as defaultReaderDataPort,
  g as loadPdfDocument,
  N as resolveReaderArtifactUrl,
  y as resolveReaderJobId,
  P as resolveReaderSourcePdf,
  b as resolveReaderTranslatedPdfUrl
};
//# sourceMappingURL=data.js.map
