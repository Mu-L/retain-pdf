import { r as F, l as T, h as S } from "../markdown-payload-kK3ewW_I.js";
import { d as O } from "../pdf-document-config-DOSsufI-.js";
const Z = "/api/v1", g = 250;
function y(t, e) {
  return t().then(
    (s) => ({ value: s, error: null }),
    (s) => ({ value: e, error: s })
  );
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
function P() {
  return Promise.resolve({ answer: "" });
}
function x() {
  return Promise.resolve({ items: [] });
}
function b() {
  return Promise.resolve(null);
}
function j() {
  return Promise.resolve(null);
}
function tt(t, e) {
  return typeof globalThis.fetch == "function" ? globalThis.fetch(t, e) : Promise.reject(new Error(`fetchProtected not injected for ${t}`));
}
function et({
  apiPrefix: t = Z,
  loadJob: e = Q,
  loadManifest: s = Y,
  loadMarkdown: r = I,
  loadMarkdownDocument: u = V,
  loadMarkdownSource: l = null,
  fetchMarkdownRange: o = null,
  loadAiChat: i = P,
  loadRegions: p = x,
  loadMetadata: k = b,
  loadTranslationItem: h = j,
  fetchProtectedResource: v = tt
} = {}) {
  const _ = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map();
  function U(n) {
    const a = w.get(n);
    if (a && Date.now() - a.at < g)
      return Promise.resolve(a.value);
    const f = _.get(n);
    if (f) return f;
    let c;
    try {
      c = Promise.resolve(e(n, t)).then((d) => {
        const M = Date.now();
        w.set(n, { at: M, value: d });
        for (const [D, E] of w)
          M - E.at >= g && w.delete(D);
        return d;
      }).finally(() => {
        _.get(n) === c && _.delete(n);
      });
    } catch (d) {
      c = Promise.reject(d);
    }
    return _.set(n, c), c;
  }
  async function H(n, a = {}) {
    const f = a.includeOptionalArtifacts !== !1, c = U(n), d = s(n, t).catch((m) => {
      if (Number(m == null ? void 0 : m.status) === 404) return { items: [] };
      throw m;
    });
    if (!f) {
      const [m, X] = await Promise.all([c, d]);
      return {
        jobPayload: m,
        manifestPayload: X,
        readerMetadata: null,
        regionsPayload: { items: [] },
        readerErrors: { regions: null, metadata: null }
      };
    }
    const [M, D, E, $] = await Promise.all([
      c,
      d,
      y(() => p(n, t), { items: [] }),
      y(() => k(n, t), null)
    ]);
    return {
      jobPayload: M,
      manifestPayload: D,
      readerMetadata: $.value,
      regionsPayload: E.value,
      readerErrors: {
        regions: E.error,
        metadata: $.error
      }
    };
  }
  function N(n) {
    return U(n);
  }
  function W(n, a) {
    return h(n, a, t);
  }
  async function z(n) {
    const a = await T(
      () => u(n, t),
      () => r(n, t)
    );
    if (S(a)) return a;
    try {
      const f = await U(n), c = F(f, n);
      if (!c) return a;
      const d = await T(
        () => u(c, t),
        () => r(c, t)
      );
      return S(d) ? d : a;
    } catch {
      return a;
    }
  }
  async function G(n) {
    if (typeof l != "function") return null;
    let a = await l(n, t).catch(() => null);
    if (a != null && a.rawUrl) return a;
    try {
      const f = await U(n), c = F(f, n);
      return c ? (a = await l(c, t).catch(() => null), a != null && a.rawUrl ? a : null) : a;
    } catch {
      return a;
    }
  }
  function K(n, a, f, c, d) {
    return typeof o != "function" ? Promise.reject(new Error("fetchMarkdownRange not injected")) : o(n, a, f, c, d);
  }
  function q(n, a) {
    return i(n, a, t);
  }
  return Object.freeze({
    apiPrefix: t,
    fetchProtected: v,
    fetchRegionTranslationItem: W,
    loadMarkdownPayload: z,
    loadMarkdownSource: G,
    loadMarkdownRange: K,
    loadJobPayload: N,
    loadReaderPayload: H,
    submitAiChat: q
  });
}
const ft = et();
function B(t) {
  return `${t ?? ""}`.trim();
}
function L(t = "") {
  return `${t ?? ""}`.trim() ? `${t}`.trim() : "";
}
const rt = 512 * 1024;
let R = null;
function J(t = L) {
  return {
    moduleUrl: t("build/pdf.mjs"),
    workerUrl: t("build/pdf.worker.mjs"),
    cmapUrl: t("cmaps/"),
    standardFontDataUrl: t("standard_fonts/")
  };
}
async function nt({ resolvePdfjsVendorUrl: t = L } = {}) {
  const { moduleUrl: e, workerUrl: s } = J(t);
  if (!e)
    throw new Error("resolvePdfjsVendorUrl not injected");
  return R || (R = import(e).then((r) => (r.GlobalWorkerOptions.workerSrc = s, r)).catch((r) => {
    throw R = null, r;
  })), R;
}
function at(t, { resolveResourceUrl: e = B } = {}) {
  return e((t == null ? void 0 : t.resource_url) || (t == null ? void 0 : t.resource_path) || "");
}
function ut({
  url: t,
  configPort: e = O,
  resolvePdfjsVendorUrl: s = L
} = {}) {
  var l;
  if (!t)
    return null;
  const { cmapUrl: r, standardFontDataUrl: u } = J(s);
  return {
    url: t,
    httpHeaders: ((l = e == null ? void 0 : e.apiHeaders) == null ? void 0 : l.call(e)) ?? {},
    withCredentials: !1,
    disableRange: !1,
    disableStream: !1,
    rangeChunkSize: rt,
    cMapUrl: r,
    cMapPacked: !0,
    standardFontDataUrl: u
  };
}
async function it({
  itemOrUrl: t,
  configPort: e = O,
  fetchProtected: s = null,
  resolveResourceUrl: r = B,
  resolvePdfjsVendorUrl: u = L
} = {}) {
  const l = typeof t == "string" ? t : at(t, { resolveResourceUrl: r });
  if (!l)
    return null;
  const o = await nt({ resolvePdfjsVendorUrl: u }), { cmapUrl: i, standardFontDataUrl: p } = J(u);
  if (l.startsWith("mock://") && typeof s == "function") {
    const k = await s(l), h = new Uint8Array(await k.arrayBuffer());
    return o.getDocument({
      data: h,
      cMapUrl: i,
      cMapPacked: !0,
      standardFontDataUrl: p
    }).promise;
  }
  return o.getDocument(ut({ url: l, configPort: e, resolvePdfjsVendorUrl: u })).promise;
}
function pt() {
  R = null;
}
function A(t) {
  return `${t ?? ""}`.trim();
}
function C(t, e) {
  return (Array.isArray(t == null ? void 0 : t.items) ? t.items : []).find((r) => (r == null ? void 0 : r.artifact_key) === e && (r == null ? void 0 : r.ready)) || null;
}
function st(t, e, { resolveResourceUrl: s = A, findReadyManifestArtifact: r = C } = {}) {
  const u = r(t, e), l = `${(u == null ? void 0 : u.resource_url) || (u == null ? void 0 : u.resource_path) || ""}`.trim();
  return l ? s(l) : "";
}
function lt(t, { resolveResourceUrl: e = A } = {}) {
  return e((t == null ? void 0 : t.resource_url) || (t == null ? void 0 : t.resource_path) || "");
}
function ot(t) {
  var l, o, i, p;
  if (!t) return null;
  const e = (t == null ? void 0 : t.actions) || {}, s = (t == null ? void 0 : t.artifacts) || {}, r = !!(((l = e.download_pdf) == null ? void 0 : l.enabled) ?? ((o = s.pdf) == null ? void 0 : o.ready) ?? (t == null ? void 0 : t.pdf_ready) ?? (t == null ? void 0 : t.output_pdf_ready)), u = `${((i = e.download_pdf) == null ? void 0 : i.url) || ((p = s.pdf) == null ? void 0 : p.url) || (t == null ? void 0 : t.pdf_url) || ""}`.trim();
  return { pdfEnabled: r, pdf: u ? A(u) : "" };
}
function wt(t) {
  var e;
  return ((e = t == null ? void 0 : t.readerJobId) == null ? void 0 : e.call(t)) || "";
}
function mt(t, {
  findReadyManifestArtifact: e = C,
  resolveManifestArtifactUrl: s = (r, u) => st(r, u, { findReadyManifestArtifact: e })
} = {}) {
  const r = s(t, "source_pdf");
  return r || e(t, "source_pdf");
}
function ht(t, e, {
  resolveJobActions: s = ot,
  findReadyManifestArtifact: r = C,
  resolveReaderArtifactUrl: u = lt,
  resolveResourceUrl: l = A
} = {}) {
  const o = t ? s(t) : null;
  if (o != null && o.pdfEnabled && (o != null && o.pdf))
    return o.pdf;
  const i = ["pdf", "translated_pdf", "result_pdf"];
  for (const h of i) {
    const v = r(e, h), w = u(v, { resolveResourceUrl: l }) || u(v);
    if (w)
      return w;
  }
  const p = `${(t == null ? void 0 : t.workflow) || (t == null ? void 0 : t.job_type) || ""}`.trim().toLowerCase();
  return ((o == null ? void 0 : o.pdfEnabled) || `${(t == null ? void 0 : t.status) || ""}`.trim().toLowerCase() === "succeeded" && p !== "ocr") && (t != null && t.job_id) ? l(`/api/v1/jobs/${encodeURIComponent(t.job_id)}/pdf`) : "";
}
export {
  pt as __resetPdfjsForTests,
  ut as buildPdfDocumentOptions,
  et as createReaderDataPort,
  ft as defaultReaderDataPort,
  it as loadPdfDocument,
  at as resolveReaderArtifactUrl,
  wt as resolveReaderJobId,
  mt as resolveReaderSourcePdf,
  ht as resolveReaderTranslatedPdfUrl
};
//# sourceMappingURL=data.js.map
