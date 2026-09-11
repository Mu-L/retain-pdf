import { r as L, l as D, h as E } from "../markdown-payload-kK3ewW_I.js";
import { d as C } from "../pdf-document-config-DOSsufI-.js";
const I = "/api/v1";
function W() {
  return Promise.resolve(null);
}
function z() {
  return Promise.resolve({ items: [] });
}
function B() {
  return Promise.resolve(null);
}
function G() {
  return Promise.resolve(null);
}
function K() {
  return Promise.resolve({ answer: "" });
}
function N() {
  return Promise.resolve({ items: [] });
}
function O() {
  return Promise.resolve(null);
}
function X() {
  return Promise.resolve(null);
}
function Z(t, r) {
  return typeof globalThis.fetch == "function" ? globalThis.fetch(t, r) : Promise.reject(new Error(`fetchProtected not injected for ${t}`));
}
function q({
  apiPrefix: t = I,
  loadJob: r = W,
  loadManifest: l = z,
  loadMarkdown: e = B,
  loadMarkdownDocument: u = G,
  loadMarkdownSource: s = null,
  fetchMarkdownRange: c = null,
  loadAiChat: f = K,
  loadRegions: o = N,
  loadMetadata: h = O,
  loadTranslationItem: p = X,
  fetchProtectedResource: _ = Z
} = {}) {
  async function A(a) {
    const [n, i, d, R] = await Promise.all([
      r(a, t),
      // During OCR the immutable artifact manifest does not exist yet. That is
      // a normal in-progress state: the Reader can still load the document's
      // source PDF and reserve the right pane for live translation.
      l(a, t).catch(() => ({ items: [] })),
      o(a, t).catch(() => ({ items: [] })),
      h(a, t).catch(() => null)
    ]);
    return {
      jobPayload: n,
      manifestPayload: i,
      readerMetadata: R,
      regionsPayload: d
    };
  }
  function m(a) {
    return r(a, t);
  }
  function F(a, n) {
    return p(a, n, t);
  }
  async function T(a) {
    const n = await D(
      () => u(a, t),
      () => e(a, t)
    );
    if (E(n)) return n;
    try {
      const i = await r(a, t), d = L(i, a);
      if (!d) return n;
      const R = await D(
        () => u(d, t),
        () => e(d, t)
      );
      return E(R) ? R : n;
    } catch {
      return n;
    }
  }
  async function J(a) {
    if (typeof s != "function") return null;
    let n = await s(a, t).catch(() => null);
    if (n != null && n.rawUrl) return n;
    try {
      const i = await r(a, t), d = L(i, a);
      return d ? (n = await s(d, t).catch(() => null), n != null && n.rawUrl ? n : null) : n;
    } catch {
      return n;
    }
  }
  function S(a, n, i, d) {
    return typeof c != "function" ? Promise.reject(new Error("fetchMarkdownRange not injected")) : c(a, n, i, d);
  }
  function H(a, n) {
    return f(a, n, t);
  }
  return Object.freeze({
    apiPrefix: t,
    fetchProtected: _,
    fetchRegionTranslationItem: F,
    loadMarkdownPayload: T,
    loadMarkdownSource: J,
    loadMarkdownRange: S,
    loadJobPayload: m,
    loadReaderPayload: A,
    submitAiChat: H
  });
}
const tt = q();
function $(t) {
  return `${t ?? ""}`.trim();
}
function k(t = "") {
  return `${t ?? ""}`.trim() ? `${t}`.trim() : "";
}
const Q = 512 * 1024;
let w = null;
function v(t = k) {
  return {
    moduleUrl: t("build/pdf.mjs"),
    workerUrl: t("build/pdf.worker.mjs"),
    cmapUrl: t("cmaps/"),
    standardFontDataUrl: t("standard_fonts/")
  };
}
async function Y({ resolvePdfjsVendorUrl: t = k } = {}) {
  const { moduleUrl: r, workerUrl: l } = v(t);
  if (!r)
    throw new Error("resolvePdfjsVendorUrl not injected");
  return w || (w = import(r).then((e) => (e.GlobalWorkerOptions.workerSrc = l, e)).catch((e) => {
    throw w = null, e;
  })), w;
}
function g(t, { resolveResourceUrl: r = $ } = {}) {
  return r((t == null ? void 0 : t.resource_url) || (t == null ? void 0 : t.resource_path) || "");
}
function y({
  url: t,
  configPort: r = C,
  resolvePdfjsVendorUrl: l = k
} = {}) {
  var s;
  if (!t)
    return null;
  const { cmapUrl: e, standardFontDataUrl: u } = v(l);
  return {
    url: t,
    httpHeaders: ((s = r == null ? void 0 : r.apiHeaders) == null ? void 0 : s.call(r)) ?? {},
    withCredentials: !1,
    disableRange: !1,
    disableStream: !1,
    rangeChunkSize: Q,
    cMapUrl: e,
    cMapPacked: !0,
    standardFontDataUrl: u
  };
}
async function rt({
  itemOrUrl: t,
  configPort: r = C,
  fetchProtected: l = null,
  resolveResourceUrl: e = $,
  resolvePdfjsVendorUrl: u = k
} = {}) {
  const s = typeof t == "string" ? t : g(t, { resolveResourceUrl: e });
  if (!s)
    return null;
  const c = await Y({ resolvePdfjsVendorUrl: u }), { cmapUrl: f, standardFontDataUrl: o } = v(u);
  if (s.startsWith("mock://") && typeof l == "function") {
    const h = await l(s), p = new Uint8Array(await h.arrayBuffer());
    return c.getDocument({
      data: p,
      cMapUrl: f,
      cMapPacked: !0,
      standardFontDataUrl: o
    }).promise;
  }
  return c.getDocument(y({ url: s, configPort: r, resolvePdfjsVendorUrl: u })).promise;
}
function et() {
  w = null;
}
function U(t) {
  return `${t ?? ""}`.trim();
}
function M(t, r) {
  return (Array.isArray(t == null ? void 0 : t.items) ? t.items : []).find((e) => (e == null ? void 0 : e.artifact_key) === r && (e == null ? void 0 : e.ready)) || null;
}
function V(t, r, { resolveResourceUrl: l = U, findReadyManifestArtifact: e = M } = {}) {
  const u = e(t, r), s = `${(u == null ? void 0 : u.resource_url) || (u == null ? void 0 : u.resource_path) || ""}`.trim();
  return s ? l(s) : "";
}
function x(t, { resolveResourceUrl: r = U } = {}) {
  return r((t == null ? void 0 : t.resource_url) || (t == null ? void 0 : t.resource_path) || "");
}
function P(t) {
  var s, c, f, o;
  if (!t) return null;
  const r = (t == null ? void 0 : t.actions) || {}, l = (t == null ? void 0 : t.artifacts) || {}, e = !!(((s = r.download_pdf) == null ? void 0 : s.enabled) ?? ((c = l.pdf) == null ? void 0 : c.ready) ?? (t == null ? void 0 : t.pdf_ready) ?? (t == null ? void 0 : t.output_pdf_ready)), u = `${((f = r.download_pdf) == null ? void 0 : f.url) || ((o = l.pdf) == null ? void 0 : o.url) || (t == null ? void 0 : t.pdf_url) || ""}`.trim();
  return { pdfEnabled: e, pdf: u ? U(u) : "" };
}
function nt(t) {
  var r;
  return ((r = t == null ? void 0 : t.readerJobId) == null ? void 0 : r.call(t)) || "";
}
function ut(t, {
  findReadyManifestArtifact: r = M,
  resolveManifestArtifactUrl: l = (e, u) => V(e, u, { findReadyManifestArtifact: r })
} = {}) {
  const e = l(t, "source_pdf");
  return e || r(t, "source_pdf");
}
function at(t, r, {
  resolveJobActions: l = P,
  findReadyManifestArtifact: e = M,
  resolveReaderArtifactUrl: u = x,
  resolveResourceUrl: s = U
} = {}) {
  const c = t ? l(t) : null;
  if (c != null && c.pdfEnabled && (c != null && c.pdf))
    return c.pdf;
  const f = ["pdf", "translated_pdf", "result_pdf"];
  for (const p of f) {
    const _ = e(r, p), m = u(_, { resolveResourceUrl: s }) || u(_);
    if (m)
      return m;
  }
  const o = `${(t == null ? void 0 : t.workflow) || (t == null ? void 0 : t.job_type) || ""}`.trim().toLowerCase();
  return ((c == null ? void 0 : c.pdfEnabled) || `${(t == null ? void 0 : t.status) || ""}`.trim().toLowerCase() === "succeeded" && o !== "ocr") && (t != null && t.job_id) ? s(`/api/v1/jobs/${encodeURIComponent(t.job_id)}/pdf`) : "";
}
export {
  et as __resetPdfjsForTests,
  y as buildPdfDocumentOptions,
  q as createReaderDataPort,
  tt as defaultReaderDataPort,
  rt as loadPdfDocument,
  g as resolveReaderArtifactUrl,
  nt as resolveReaderJobId,
  ut as resolveReaderSourcePdf,
  at as resolveReaderTranslatedPdfUrl
};
//# sourceMappingURL=data.js.map
