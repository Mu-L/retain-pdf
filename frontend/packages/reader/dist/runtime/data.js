import { r as F, l as C, h as T } from "../markdown-payload-kK3ewW_I.js";
import { d as O } from "../pdf-document-config-DOSsufI-.js";
const K = "/api/v1", S = 250;
function y(e, t) {
  return e().then(
    (s) => ({ value: s, error: null }),
    (s) => ({ value: t, error: s })
  );
}
function q() {
  return Promise.resolve(null);
}
function X() {
  return Promise.resolve({ items: [] });
}
function Z() {
  return Promise.resolve(null);
}
function Q() {
  return Promise.resolve(null);
}
function Y() {
  return Promise.resolve({ items: [] });
}
function I() {
  return Promise.resolve(null);
}
function V() {
  return Promise.resolve(null);
}
function P(e, t) {
  return typeof globalThis.fetch == "function" ? globalThis.fetch(e, t) : Promise.reject(new Error(`fetchProtected not injected for ${e}`));
}
function x({
  apiPrefix: e = K,
  loadJob: t = q,
  loadManifest: s = X,
  loadMarkdown: r = Z,
  loadMarkdownDocument: u = Q,
  loadMarkdownSource: l = null,
  fetchMarkdownRange: o = null,
  loadRegions: i = Y,
  loadMetadata: p = I,
  loadTranslationItem: D = V,
  fetchProtectedResource: h = P
} = {}) {
  const w = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map();
  function m(n) {
    const a = R.get(n);
    if (a && Date.now() - a.at < S)
      return Promise.resolve(a.value);
    const f = w.get(n);
    if (f) return f;
    let c;
    try {
      c = Promise.resolve(t(n, e)).then((d) => {
        const U = Date.now();
        R.set(n, { at: U, value: d });
        for (const [L, v] of R)
          U - v.at >= S && R.delete(L);
        return d;
      }).finally(() => {
        w.get(n) === c && w.delete(n);
      });
    } catch (d) {
      c = Promise.reject(d);
    }
    return w.set(n, c), c;
  }
  async function B(n, a = {}) {
    const f = a.includeOptionalArtifacts !== !1, c = m(n), d = s(n, e).catch((_) => {
      if (Number(_ == null ? void 0 : _.status) === 404) return { items: [] };
      throw _;
    });
    if (!f) {
      const [_, G] = await Promise.all([c, d]);
      return {
        jobPayload: _,
        manifestPayload: G,
        readerMetadata: null,
        regionsPayload: { items: [] },
        readerErrors: { regions: null, metadata: null }
      };
    }
    const [U, L, v, $] = await Promise.all([
      c,
      d,
      y(() => i(n, e), { items: [] }),
      y(() => p(n, e), null)
    ]);
    return {
      jobPayload: U,
      manifestPayload: L,
      readerMetadata: $.value,
      regionsPayload: v.value,
      readerErrors: {
        regions: v.error,
        metadata: $.error
      }
    };
  }
  function H(n) {
    return m(n);
  }
  async function N(n) {
    const a = await C(
      () => u(n, e),
      () => r(n, e)
    );
    if (T(a)) return a;
    try {
      const f = await m(n), c = F(f, n);
      if (!c) return a;
      const d = await C(
        () => u(c, e),
        () => r(c, e)
      );
      return T(d) ? d : a;
    } catch {
      return a;
    }
  }
  async function W(n) {
    if (typeof l != "function") return null;
    let a = await l(n, e).catch(() => null);
    if (a != null && a.rawUrl) return a;
    try {
      const f = await m(n), c = F(f, n);
      return c ? (a = await l(c, e).catch(() => null), a != null && a.rawUrl ? a : null) : a;
    } catch {
      return a;
    }
  }
  function z(n, a, f, c, d) {
    return typeof o != "function" ? Promise.reject(new Error("fetchMarkdownRange not injected")) : o(n, a, f, c, d);
  }
  return Object.freeze({
    apiPrefix: e,
    fetchProtected: h,
    loadMarkdownPayload: N,
    loadMarkdownSource: W,
    loadMarkdownRange: z,
    loadJobPayload: H,
    loadReaderPayload: B
  });
}
const le = x();
function g(e) {
  return `${e ?? ""}`.trim();
}
function M(e = "") {
  return `${e ?? ""}`.trim() ? `${e}`.trim() : "";
}
const b = 512 * 1024;
let k = null;
function A(e = M) {
  return {
    moduleUrl: e("build/pdf.mjs"),
    workerUrl: e("build/pdf.worker.mjs"),
    cmapUrl: e("cmaps/"),
    standardFontDataUrl: e("standard_fonts/")
  };
}
async function j({ resolvePdfjsVendorUrl: e = M } = {}) {
  const { moduleUrl: t, workerUrl: s } = A(e);
  if (!t)
    throw new Error("resolvePdfjsVendorUrl not injected");
  return k || (k = import(t).then((r) => (r.GlobalWorkerOptions.workerSrc = s, r)).catch((r) => {
    throw k = null, r;
  })), k;
}
function ee(e, { resolveResourceUrl: t = g } = {}) {
  return t((e == null ? void 0 : e.resource_url) || (e == null ? void 0 : e.resource_path) || "");
}
function te({
  url: e,
  configPort: t = O,
  resolvePdfjsVendorUrl: s = M
} = {}) {
  var l;
  if (!e)
    return null;
  const { cmapUrl: r, standardFontDataUrl: u } = A(s);
  return {
    url: e,
    httpHeaders: ((l = t == null ? void 0 : t.apiHeaders) == null ? void 0 : l.call(t)) ?? {},
    withCredentials: !1,
    disableRange: !1,
    disableStream: !1,
    rangeChunkSize: b,
    cMapUrl: r,
    cMapPacked: !0,
    standardFontDataUrl: u
  };
}
async function oe({
  itemOrUrl: e,
  configPort: t = O,
  fetchProtected: s = null,
  resolveResourceUrl: r = g,
  resolvePdfjsVendorUrl: u = M
} = {}) {
  const l = typeof e == "string" ? e : ee(e, { resolveResourceUrl: r });
  if (!l)
    return null;
  const o = await j({ resolvePdfjsVendorUrl: u }), { cmapUrl: i, standardFontDataUrl: p } = A(u);
  if (l.startsWith("mock://") && typeof s == "function") {
    const D = await s(l), h = new Uint8Array(await D.arrayBuffer());
    return o.getDocument({
      data: h,
      cMapUrl: i,
      cMapPacked: !0,
      standardFontDataUrl: p
    }).promise;
  }
  return o.getDocument(te({ url: l, configPort: t, resolvePdfjsVendorUrl: u })).promise;
}
function ce() {
  k = null;
}
function E(e) {
  return `${e ?? ""}`.trim();
}
function J(e, t) {
  return (Array.isArray(e == null ? void 0 : e.items) ? e.items : []).find((r) => (r == null ? void 0 : r.artifact_key) === t && (r == null ? void 0 : r.ready)) || null;
}
function re(e, t, { resolveResourceUrl: s = E, findReadyManifestArtifact: r = J } = {}) {
  const u = r(e, t), l = `${(u == null ? void 0 : u.resource_url) || (u == null ? void 0 : u.resource_path) || ""}`.trim();
  return l ? s(l) : "";
}
function ne(e, { resolveResourceUrl: t = E } = {}) {
  return t((e == null ? void 0 : e.resource_url) || (e == null ? void 0 : e.resource_path) || "");
}
function ae(e) {
  var l, o, i, p;
  if (!e) return null;
  const t = (e == null ? void 0 : e.actions) || {}, s = (e == null ? void 0 : e.artifacts) || {}, r = !!(((l = t.download_pdf) == null ? void 0 : l.enabled) ?? ((o = s.pdf) == null ? void 0 : o.ready) ?? (e == null ? void 0 : e.pdf_ready) ?? (e == null ? void 0 : e.output_pdf_ready)), u = `${((i = t.download_pdf) == null ? void 0 : i.url) || ((p = s.pdf) == null ? void 0 : p.url) || (e == null ? void 0 : e.pdf_url) || ""}`.trim();
  return { pdfEnabled: r, pdf: u ? E(u) : "" };
}
function de(e) {
  var t;
  return ((t = e == null ? void 0 : e.readerJobId) == null ? void 0 : t.call(e)) || "";
}
function fe(e, {
  findReadyManifestArtifact: t = J,
  resolveManifestArtifactUrl: s = (r, u) => re(r, u, { findReadyManifestArtifact: t })
} = {}) {
  const r = s(e, "source_pdf");
  return r || t(e, "source_pdf");
}
function ie(e, t, {
  resolveJobActions: s = ae,
  findReadyManifestArtifact: r = J,
  resolveReaderArtifactUrl: u = ne,
  resolveResourceUrl: l = E
} = {}) {
  const o = e ? s(e) : null;
  if (o != null && o.pdfEnabled && (o != null && o.pdf))
    return o.pdf;
  const i = ["pdf", "translated_pdf", "result_pdf"];
  for (const h of i) {
    const w = r(t, h), m = u(w, { resolveResourceUrl: l }) || u(w);
    if (m)
      return m;
  }
  const p = `${(e == null ? void 0 : e.workflow) || (e == null ? void 0 : e.job_type) || ""}`.trim().toLowerCase();
  return ((o == null ? void 0 : o.pdfEnabled) || `${(e == null ? void 0 : e.status) || ""}`.trim().toLowerCase() === "succeeded" && p !== "ocr") && (e != null && e.job_id) ? l(`/api/v1/jobs/${encodeURIComponent(e.job_id)}/pdf`) : "";
}
export {
  ce as __resetPdfjsForTests,
  te as buildPdfDocumentOptions,
  x as createReaderDataPort,
  le as defaultReaderDataPort,
  oe as loadPdfDocument,
  ee as resolveReaderArtifactUrl,
  de as resolveReaderJobId,
  fe as resolveReaderSourcePdf,
  ie as resolveReaderTranslatedPdfUrl
};
//# sourceMappingURL=data.js.map
