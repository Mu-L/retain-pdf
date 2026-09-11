import { r as F, l as C, h as S } from "../markdown-payload-kK3ewW_I.js";
import { d as O } from "../pdf-document-config-DOSsufI-.js";
const G = "/api/v1", T = 250;
function y(e, t) {
  return e().then(
    (s) => ({ value: s, error: null }),
    (s) => ({ value: t, error: s })
  );
}
function K() {
  return Promise.resolve(null);
}
function q() {
  return Promise.resolve({ items: [] });
}
function X() {
  return Promise.resolve(null);
}
function Z() {
  return Promise.resolve(null);
}
function Q() {
  return Promise.resolve({ items: [] });
}
function Y() {
  return Promise.resolve(null);
}
function V(e, t) {
  return typeof globalThis.fetch == "function" ? globalThis.fetch(e, t) : Promise.reject(new Error(`fetchProtected not injected for ${e}`));
}
function I({
  apiPrefix: e = G,
  loadJob: t = K,
  loadManifest: s = q,
  loadMarkdown: r = X,
  loadMarkdownDocument: u = Z,
  loadMarkdownSource: l = null,
  fetchMarkdownRange: c = null,
  loadRegions: i = Q,
  loadMetadata: p = Y,
  fetchProtectedResource: k = V
} = {}) {
  const w = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
  function h(n) {
    const a = m.get(n);
    if (a && Date.now() - a.at < T)
      return Promise.resolve(a.value);
    const f = w.get(n);
    if (f) return f;
    let o;
    try {
      o = Promise.resolve(t(n, e)).then((d) => {
        const v = Date.now();
        m.set(n, { at: v, value: d });
        for (const [L, M] of m)
          v - M.at >= T && m.delete(L);
        return d;
      }).finally(() => {
        w.get(n) === o && w.delete(n);
      });
    } catch (d) {
      o = Promise.reject(d);
    }
    return w.set(n, o), o;
  }
  async function U(n, a = {}) {
    const f = a.includeOptionalArtifacts !== !1, o = h(n), d = s(n, e).catch((_) => {
      if (Number(_ == null ? void 0 : _.status) === 404) return { items: [] };
      throw _;
    });
    if (!f) {
      const [_, z] = await Promise.all([o, d]);
      return {
        jobPayload: _,
        manifestPayload: z,
        readerMetadata: null,
        regionsPayload: { items: [] },
        readerErrors: { regions: null, metadata: null }
      };
    }
    const [v, L, M, $] = await Promise.all([
      o,
      d,
      y(() => i(n, e), { items: [] }),
      y(() => p(n, e), null)
    ]);
    return {
      jobPayload: v,
      manifestPayload: L,
      readerMetadata: $.value,
      regionsPayload: M.value,
      readerErrors: {
        regions: M.error,
        metadata: $.error
      }
    };
  }
  function B(n) {
    return h(n);
  }
  async function H(n) {
    const a = await C(
      () => u(n, e),
      () => r(n, e)
    );
    if (S(a)) return a;
    try {
      const f = await h(n), o = F(f, n);
      if (!o) return a;
      const d = await C(
        () => u(o, e),
        () => r(o, e)
      );
      return S(d) ? d : a;
    } catch {
      return a;
    }
  }
  async function N(n) {
    if (typeof l != "function") return null;
    let a = await l(n, e).catch(() => null);
    if (a != null && a.rawUrl) return a;
    try {
      const f = await h(n), o = F(f, n);
      return o ? (a = await l(o, e).catch(() => null), a != null && a.rawUrl ? a : null) : a;
    } catch {
      return a;
    }
  }
  function W(n, a, f, o, d) {
    return typeof c != "function" ? Promise.reject(new Error("fetchMarkdownRange not injected")) : c(n, a, f, o, d);
  }
  return Object.freeze({
    apiPrefix: e,
    fetchProtected: k,
    loadMarkdownPayload: H,
    loadMarkdownSource: N,
    loadMarkdownRange: W,
    loadJobPayload: B,
    loadReaderPayload: U
  });
}
const ue = I();
function g(e) {
  return `${e ?? ""}`.trim();
}
function E(e = "") {
  return `${e ?? ""}`.trim() ? `${e}`.trim() : "";
}
const P = 512 * 1024;
let R = null;
function A(e = E) {
  return {
    moduleUrl: e("build/pdf.mjs"),
    workerUrl: e("build/pdf.worker.mjs"),
    cmapUrl: e("cmaps/"),
    standardFontDataUrl: e("standard_fonts/")
  };
}
async function x({ resolvePdfjsVendorUrl: e = E } = {}) {
  const { moduleUrl: t, workerUrl: s } = A(e);
  if (!t)
    throw new Error("resolvePdfjsVendorUrl not injected");
  return R || (R = import(t).then((r) => (r.GlobalWorkerOptions.workerSrc = s, r)).catch((r) => {
    throw R = null, r;
  })), R;
}
function b(e, { resolveResourceUrl: t = g } = {}) {
  return t((e == null ? void 0 : e.resource_url) || (e == null ? void 0 : e.resource_path) || "");
}
function j({
  url: e,
  configPort: t = O,
  resolvePdfjsVendorUrl: s = E
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
    rangeChunkSize: P,
    cMapUrl: r,
    cMapPacked: !0,
    standardFontDataUrl: u
  };
}
async function se({
  itemOrUrl: e,
  configPort: t = O,
  fetchProtected: s = null,
  resolveResourceUrl: r = g,
  resolvePdfjsVendorUrl: u = E
} = {}) {
  const l = typeof e == "string" ? e : b(e, { resolveResourceUrl: r });
  if (!l)
    return null;
  const c = await x({ resolvePdfjsVendorUrl: u }), { cmapUrl: i, standardFontDataUrl: p } = A(u);
  if (l.startsWith("mock://") && typeof s == "function") {
    const k = await s(l), w = new Uint8Array(await k.arrayBuffer());
    return c.getDocument({
      data: w,
      cMapUrl: i,
      cMapPacked: !0,
      standardFontDataUrl: p
    }).promise;
  }
  return c.getDocument(j({ url: l, configPort: t, resolvePdfjsVendorUrl: u })).promise;
}
function le() {
  R = null;
}
function D(e) {
  return `${e ?? ""}`.trim();
}
function J(e, t) {
  return (Array.isArray(e == null ? void 0 : e.items) ? e.items : []).find((r) => (r == null ? void 0 : r.artifact_key) === t && (r == null ? void 0 : r.ready)) || null;
}
function ee(e, t, { resolveResourceUrl: s = D, findReadyManifestArtifact: r = J } = {}) {
  const u = r(e, t), l = `${(u == null ? void 0 : u.resource_url) || (u == null ? void 0 : u.resource_path) || ""}`.trim();
  return l ? s(l) : "";
}
function te(e, { resolveResourceUrl: t = D } = {}) {
  return t((e == null ? void 0 : e.resource_url) || (e == null ? void 0 : e.resource_path) || "");
}
function re(e) {
  var l, c, i, p;
  if (!e) return null;
  const t = (e == null ? void 0 : e.actions) || {}, s = (e == null ? void 0 : e.artifacts) || {}, r = !!(((l = t.download_pdf) == null ? void 0 : l.enabled) ?? ((c = s.pdf) == null ? void 0 : c.ready) ?? (e == null ? void 0 : e.pdf_ready) ?? (e == null ? void 0 : e.output_pdf_ready)), u = `${((i = t.download_pdf) == null ? void 0 : i.url) || ((p = s.pdf) == null ? void 0 : p.url) || (e == null ? void 0 : e.pdf_url) || ""}`.trim();
  return { pdfEnabled: r, pdf: u ? D(u) : "" };
}
function ce(e) {
  var t;
  return ((t = e == null ? void 0 : e.readerJobId) == null ? void 0 : t.call(e)) || "";
}
function oe(e, {
  findReadyManifestArtifact: t = J,
  resolveManifestArtifactUrl: s = (r, u) => ee(r, u, { findReadyManifestArtifact: t })
} = {}) {
  const r = s(e, "source_pdf");
  return r || t(e, "source_pdf");
}
function de(e, t, {
  resolveJobActions: s = re,
  findReadyManifestArtifact: r = J,
  resolveReaderArtifactUrl: u = te,
  resolveResourceUrl: l = D
} = {}) {
  const c = e ? s(e) : null;
  if (c != null && c.pdfEnabled && (c != null && c.pdf))
    return c.pdf;
  const i = ["pdf", "translated_pdf", "result_pdf"];
  for (const w of i) {
    const m = r(t, w), U = u(m, { resolveResourceUrl: l }) || u(m);
    if (U)
      return U;
  }
  const p = `${(e == null ? void 0 : e.workflow) || (e == null ? void 0 : e.job_type) || ""}`.trim().toLowerCase();
  return ((c == null ? void 0 : c.pdfEnabled) || `${(e == null ? void 0 : e.status) || ""}`.trim().toLowerCase() === "succeeded" && p !== "ocr") && (e != null && e.job_id) ? l(`/api/v1/jobs/${encodeURIComponent(e.job_id)}/pdf`) : "";
}
export {
  le as __resetPdfjsForTests,
  j as buildPdfDocumentOptions,
  I as createReaderDataPort,
  ue as defaultReaderDataPort,
  se as loadPdfDocument,
  b as resolveReaderArtifactUrl,
  ce as resolveReaderJobId,
  oe as resolveReaderSourcePdf,
  de as resolveReaderTranslatedPdfUrl
};
//# sourceMappingURL=data.js.map
