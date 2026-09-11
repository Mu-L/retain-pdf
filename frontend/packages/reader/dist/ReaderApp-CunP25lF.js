var Dn = (e) => {
  throw TypeError(e);
};
var Fn = (e, t, n) => t.has(e) || Dn("Cannot " + n);
var et = (e, t, n) => (Fn(e, t, "read from private field"), n ? n.call(e) : t.get(e)), On = (e, t, n) => t.has(e) ? Dn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), $n = (e, t, n, r) => (Fn(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
import { jsxs as z, jsx as p, Fragment as ln } from "react/jsx-runtime";
import { useMemo as J, useState as k, useEffect as O, useCallback as N, useRef as A, useLayoutEffect as De, memo as un, forwardRef as Io, useImperativeHandle as dn, createContext as fn, useContext as mn, useSyncExternalStore as Po, useId as pn, Suspense as Ro, lazy as hn } from "react";
import { getReaderAdapters as fe, requireAdapter as ge } from "./adapters.js";
import { resolveReaderDownloadName as To, createReaderServerFavoritesPort as Mo, resolveReaderDownloadUrls as Eo, READER_PROGRESS_COPY as Pe, trimString as ct, READER_DOWNLOAD_ACTIONS as xo, disabledReason as No } from "./runtime/state.js";
import { d as Ao } from "./ask-answerer-GNQdzitl.js";
import "@retainpdf/api/conversations";
import { r as ko, b as Co } from "./page-config-Ct7qR5rm.js";
import { normalizeBlockKey as jn, sortByPageAndCreatedAt as Lo, buildAnnotationsMarkdown as zo, groupByPageAndCreatedAt as _o } from "./runtime/content.js";
import { fetchLiveTranslationLayout as Do, LiveTranslationApiError as Mt, streamLiveTranslationEvents as Fo, fetchLiveTranslationPage as Oo } from "@retainpdf/api/live-translation";
import { toast as Vt, Toaster as $o } from "sonner";
import { X as Ye, Radio as jo, FileText as xr, Columns2 as Nr, Languages as Ar, FileCode2 as kr, Sparkles as gn, GripHorizontal as Uo, StickyNote as Lt, Sigma as Bo, Table2 as Ho, Type as Wo, Image as Jo, Check as qo, Copy as Ko, Keyboard as Vo, Download as Go, Bookmark as Yo } from "lucide-react";
import { pdfjs as Zo, Page as Xo, Document as Qo } from "react-pdf";
import { e as ea, m as ta, a as na } from "./markdown-math-DjYQuQQe.js";
const ra = (...e) => {
  var t, n;
  return ((n = (t = fe()) == null ? void 0 : t.isMockMode) == null ? void 0 : n.call(t, ...e)) ?? !1;
}, oa = "", aa = Object.freeze({
  progress: "retainpdf-reader-progress"
}), It = (e) => {
  var t, n;
  return ((n = (t = fe()) == null ? void 0 : t.resolveResourceUrl) == null ? void 0 : n.call(t, e)) ?? e;
}, sa = (...e) => {
  var n;
  return (((n = fe()) == null ? void 0 : n.fetchProtected) ?? fetch)(...e);
}, Gt = (e = "") => {
  var t, n;
  return ((n = (t = fe()) == null ? void 0 : t.resolvePdfjsVendorUrl) == null ? void 0 : n.call(t, e)) ?? "";
}, Ae = () => ge("defaultReaderDataPort"), Un = () => ge("defaultReaderPageConfigPort"), lt = {
  get apiPrefix() {
    return Ae().apiPrefix;
  },
  fetchProtected: (...e) => Ae().fetchProtected(...e),
  loadMarkdownPayload: (e) => Ae().loadMarkdownPayload(e),
  loadMarkdownSource: (e) => Ae().loadMarkdownSource(e),
  loadMarkdownRange: (e, t, n, r, a) => Ae().loadMarkdownRange(e, t, n, r, a),
  loadJobPayload: (e) => Ae().loadJobPayload(e),
  loadReaderPayload: (e, t) => Ae().loadReaderPayload(e, t)
}, Cr = {
  messageTargetOrigin: () => Un().messageTargetOrigin(),
  readerJobId: () => Un().readerJobId()
}, ia = (...e) => {
  var t, n;
  return ((n = (t = fe()) == null ? void 0 : t.resolveReaderAnchor) == null ? void 0 : n.call(t, ...e)) ?? null;
}, ca = () => {
  var e, t;
  return ((t = (e = fe()) == null ? void 0 : e.resolveReaderDocumentId) == null ? void 0 : t.call(e)) ?? "";
}, la = (...e) => {
  var t, n;
  return ((n = (t = fe()) == null ? void 0 : t.resolveReaderJobId) == null ? void 0 : n.call(t, ...e)) ?? "";
}, ua = (...e) => {
  var t, n;
  return ((n = (t = fe()) == null ? void 0 : t.resolveReaderArtifactUrl) == null ? void 0 : n.call(t, ...e)) ?? "";
}, da = (...e) => {
  var t, n;
  return ((n = (t = fe()) == null ? void 0 : t.resolveReaderSourcePdf) == null ? void 0 : n.call(t, ...e)) ?? null;
}, fa = (...e) => {
  var t, n;
  return ((n = (t = fe()) == null ? void 0 : t.resolveReaderTranslatedPdfUrl) == null ? void 0 : n.call(t, ...e)) ?? "";
}, ma = (...e) => {
  var t, n;
  return ((n = (t = fe()) == null ? void 0 : t.resolveReaderDownloadName) == null ? void 0 : n.call(t, ...e)) ?? To(...e);
}, pa = (...e) => {
  var t, n;
  return ((n = (t = fe()) == null ? void 0 : t.resolveReaderDownloadUrls) == null ? void 0 : n.call(t, ...e)) ?? Eo(...e);
}, ha = (...e) => ge("downloadProtectedResource")(...e), ga = (...e) => ge("failDownloadToast")(...e), Wl = (e, t) => ge("resolveMarkdownAssetUrl")(e, t), Jl = (e = {}) => {
  const t = fe();
  return Ao({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) || "/api/v1",
    ask: t == null ? void 0 : t.askDocumentAi,
    documentByJobId: t == null ? void 0 : t.fetchDocumentByJobId,
    ...e
  });
}, bn = "/api/v1", ba = (...e) => ge("fetchDocumentByJobId")(...e), ql = (e = bn, t = {}) => {
  var n;
  return ge("fetchFavorites")(
    ((n = fe()) == null ? void 0 : n.apiPrefix) ?? e,
    t
  );
};
function Kl(e = {}) {
  const t = fe();
  return Mo({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) ?? bn,
    documentByJobId: (...n) => ge("fetchDocumentByJobId")(...n),
    submitFavorite: (...n) => ge("createFavorite")(...n),
    loadFavorites: (...n) => ge("fetchFavorites")(...n),
    removeFavorite: (...n) => ge("deleteFavorite")(...n),
    ...e
  });
}
function ya() {
  const e = () => {
    var r;
    return ko(
      ((r = globalThis.location) == null ? void 0 : r.search) || ""
    );
  }, [t, n] = k(e);
  return O(() => {
    var i, c, l, d;
    const r = () => n(e()), a = (c = (i = globalThis.history) == null ? void 0 : i.pushState) == null ? void 0 : c.bind(globalThis.history), o = (d = (l = globalThis.history) == null ? void 0 : l.replaceState) == null ? void 0 : d.bind(globalThis.history);
    let s = !1;
    if (a && o)
      try {
        const u = (f) => function(...m) {
          const v = f.apply(this, m);
          return r(), globalThis.dispatchEvent(new Event("pushstate")), globalThis.dispatchEvent(new Event("replacestate")), globalThis.dispatchEvent(new Event("locationchange")), v;
        };
        globalThis.history.pushState = u(a), globalThis.history.replaceState = u(o), s = !0;
      } catch {
      }
    return window.addEventListener("popstate", r), window.addEventListener("hashchange", r), window.addEventListener("pushstate", r), window.addEventListener("replacestate", r), window.addEventListener("locationchange", r), () => {
      if (window.removeEventListener("popstate", r), window.removeEventListener("hashchange", r), window.removeEventListener("pushstate", r), window.removeEventListener("replacestate", r), window.removeEventListener("locationchange", r), s && a && o)
        try {
          globalThis.history.pushState = a, globalThis.history.replaceState = o;
        } catch {
        }
    };
  }, []), t;
}
function va() {
  const e = ya(), t = J(() => la(Cr), [e]), n = J(() => ca(), [e]), r = t || n ? `job:${t}|document:${n}` : `location:${e}`;
  return { locationKey: e, jobId: t, routeDocumentId: n, sessionIdentity: r };
}
function wa(e) {
  const {
    routeDocumentId: t,
    jobId: n,
    sessionIdentity: r,
    sessionIdentityRef: a,
    documentIdRef: o,
    sessionJobIdRef: s,
    switchToSourceMode: i
  } = e, [c, l] = k({
    documentId: "",
    jobId: ""
  }), [d, u] = k({
    documentId: "",
    jobId: ""
  }), f = c.documentId === t ? c.jobId : "", m = d.documentId === t ? d.jobId : "", v = n || f, [h, y] = k({
    jobId: "",
    documentId: ""
  }), b = h.jobId === v ? h.documentId : "", g = t || b, S = !!t && !v, [w, I] = k(null), L = (w == null ? void 0 : w.sessionIdentity) === r && w.documentId === g ? w : null, x = S || !!L, D = N((M) => {
    const R = `${M.documentId || ""}`.trim();
    if (!R || o.current && o.current !== R) return;
    if (!o.current && s.current)
      y({
        jobId: s.current,
        documentId: R
      });
    else if (!o.current)
      return;
    const P = `${M.revision || ""}`.trim() || `${Date.now()}`;
    I({
      documentId: R,
      revision: P,
      sessionIdentity: a.current
    }), i();
  }, []);
  O(() => {
    I((M) => M && M.sessionIdentity !== r ? null : M);
  }, [r]);
  const T = N((M) => {
    switch (M.type) {
      case "resolved-document-job":
        l({ documentId: M.documentId, jobId: M.jobId });
        break;
      case "cleared-resolved-document-job":
        l({ documentId: "", jobId: "" });
        break;
      case "missing-document-job":
        u({ documentId: M.documentId, jobId: M.jobId });
        break;
      case "resolved-job-document":
        y((R) => R.jobId === M.jobId && R.documentId === M.documentId ? R : { jobId: M.jobId, documentId: M.documentId });
        break;
      case "committed-source":
        I({
          documentId: M.documentId,
          revision: M.revision,
          sessionIdentity: M.sessionIdentity
        });
        break;
    }
  }, []);
  return {
    resolvedDocumentJob: c,
    setResolvedDocumentJob: l,
    missingDocumentJob: d,
    setMissingDocumentJob: u,
    documentJobId: f,
    rejectedDocumentJobId: m,
    sessionJobId: v,
    resolvedJobDocument: h,
    setResolvedJobDocument: y,
    jobDocumentId: b,
    documentId: g,
    sourceOnly: S,
    committedDocumentSource: w,
    setCommittedDocumentSource: I,
    activeCommittedDocumentSource: L,
    sourceViewOnly: x,
    refreshCommittedDocument: D,
    applyIdentityEvent: T
  };
}
const Sa = /* @__PURE__ */ new Set(["succeeded", "failed", "cancelled", "canceled"]);
function Bn(e) {
  return `${(e == null ? void 0 : e.status) || ""}`.trim().toLowerCase();
}
function Ia(e) {
  var r, a, o, s;
  if (!e || typeof e != "object") return "";
  const t = e, n = [
    t.document_id,
    t.documentId,
    (r = t.document) == null ? void 0 : r.document_id,
    (a = t.book_summary) == null ? void 0 : a.document_id,
    (s = (o = t.request_payload) == null ? void 0 : o.source) == null ? void 0 : s.document_id
  ];
  for (const i of n) {
    const c = `${i || ""}`.trim();
    if (c) return c;
  }
  return "";
}
function Hn(e, t) {
  const n = `/api/v1/documents/${encodeURIComponent(e)}/source.pdf`, r = `${t || ""}`.trim();
  return It(r ? `${n}?version=${encodeURIComponent(r)}` : n);
}
function Pa(e, t = "") {
  const n = `${e || ""}`.trim(), r = `${t || ""}`.trim();
  return !!(!n || r && (n === r || n === `${r}.pdf`) || /^\d{8,14}-[0-9a-f]{4,}$/i.test(n));
}
function Ra(e, t) {
  var r;
  const n = [
    e == null ? void 0 : e.title,
    e == null ? void 0 : e.display_name,
    e == null ? void 0 : e.source_file_name,
    (r = e == null ? void 0 : e.book_summary) == null ? void 0 : r.source_file_name
  ];
  for (const a of n) {
    const o = `${a || ""}`.trim();
    if (o && !Pa(o, t))
      return o.replace(/\.pdf$/i, "");
  }
  return "";
}
function Yt({
  percent: e,
  text: t,
  stage: n
}) {
  var r;
  try {
    (r = window.parent) == null || r.postMessage(
      {
        type: aa.progress,
        stage: n,
        percent: e,
        text: t
      },
      Cr.messageTargetOrigin()
    );
  } catch {
  }
}
function Et(e, t, n, r = "progress") {
  e({
    loading: !0,
    percent: t,
    text: n,
    stage: r,
    failed: !1
  }), Yt({ percent: t, text: n, stage: r });
}
function Ta(e) {
  const {
    sessionJobId: t,
    sessionIdentity: n,
    sessionIdentityRef: r,
    sessionJobIdRef: a,
    sessionEpochRef: o,
    closingRef: s
  } = e, [i, c] = k(null), [l, d] = k(null), [u, f] = k(""), [m, v] = k(0), h = u === n ? i : null, y = u === n ? l : null, b = Bn(h), g = Sa.has(b), S = N(() => {
    v((T) => T + 1);
  }, []), w = N((T) => {
    c(T.jobPayload), d(T.manifestPayload), f(T.sessionIdentity);
  }, []), I = N((T) => {
    c(null), d(null), f(T);
  }, []), L = A(""), x = A(""), D = N(async () => {
    const T = a.current;
    if (!T || L.current === T) return;
    const M = lt.loadJobPayload;
    if (typeof M != "function") return;
    const R = o.current.value;
    L.current = T;
    try {
      const P = await M(T);
      if (s.current || o.current.value !== R || a.current !== T || !P || typeof P != "object")
        return;
      const E = Bn(P);
      c(P), f(r.current), E === "succeeded" && x.current !== T && (x.current = T, v((_) => _ + 1));
    } catch {
    } finally {
      L.current === T && (L.current = "");
    }
  }, []);
  return O(() => {
    x.current = "";
  }, [n]), O(() => {
    if (!t || g || !h) return;
    const T = window.setInterval(() => {
      D();
    }, 1e3);
    return () => window.clearInterval(T);
  }, [g, D, h, t]), {
    jobPayload: i,
    setJobPayload: c,
    manifestPayload: l,
    setManifestPayload: d,
    payloadSessionIdentity: u,
    setPayloadSessionIdentity: f,
    scopedJobPayload: h,
    scopedManifestPayload: y,
    jobStatus: b,
    jobTerminal: g,
    jobRefreshRevision: m,
    refreshJobArtifacts: S,
    refreshJobStatus: D,
    publishPayload: w,
    clearPayload: I
  };
}
function Zt(e) {
  document.body.classList.remove(
    "reader-mode-source",
    "reader-mode-translated",
    "reader-mode-compare"
  ), document.body.classList.add(`reader-mode-${e}`);
}
function Ma(e, t) {
  e(t), Zt(t);
}
function Ea(e) {
  const [t, n] = k(e ? "source" : "compare"), r = N((o) => {
    e && o !== "source" || (n(o), Zt(o));
  }, [e]), a = N((o) => {
    Ma(n, o);
  }, []);
  return O(() => (e && document.documentElement.classList.add("reader-source-only"), Zt(t), () => {
    document.documentElement.classList.remove("reader-source-only");
  }), [e, t]), { mode: t, setMode: r, setModeState: n, switchSessionMode: a };
}
function Ce(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : null;
}
function Lr(e) {
  const t = Ce(e);
  return t && "data" in t ? t.data : e;
}
function rt(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? t : null;
}
function Wn(e) {
  const t = Ce(e);
  if (!t || !Array.isArray(t.bbox) || t.bbox.length !== 4) return null;
  const n = t.bbox.map(Number);
  if (!n.every(Number.isFinite)) return null;
  const r = rt(t.page);
  if (r == null) return null;
  const [a, o, s, i] = n, c = Math.min(a, s), l = Math.min(o, i), d = Math.max(a, s), u = Math.max(o, i);
  if (d <= c || u <= l) return null;
  const f = `${t.unit || "pdf_point"}`.trim().toLowerCase();
  if (f !== "pdf_point" && f !== "pt") return null;
  const m = `${t.origin || "top_left"}`.trim().toLowerCase();
  return m !== "top_left" && m !== "bottom_left" ? null : {
    page: Math.floor(r),
    bbox: [c, l, d, u],
    unit: "pdf_point",
    origin: m,
    text: `${t.text || ""}`
  };
}
function xa(e) {
  const t = Ce(Lr(e)), n = Array.isArray(t == null ? void 0 : t.items) ? t.items : [], r = [];
  for (const a of n) {
    const o = Ce(a), s = `${(o == null ? void 0 : o.item_id) || (o == null ? void 0 : o.itemId) || ""}`.trim(), i = Wn(o == null ? void 0 : o.source), c = Wn(o == null ? void 0 : o.translated);
    !s || !i || !c || r.push({
      itemId: s,
      source: i,
      translated: c,
      markdown: `${(o == null ? void 0 : o.markdown) || ""}`,
      regionType: `${(o == null ? void 0 : o.region_type) || (o == null ? void 0 : o.regionType) || ""}`,
      status: `${(o == null ? void 0 : o.status) || ""}`,
      assetIds: (Array.isArray(o == null ? void 0 : o.asset_ids) ? o.asset_ids : []).map((l) => `${l || ""}`.trim()).filter(Boolean),
      assetUrls: (Array.isArray(o == null ? void 0 : o.asset_urls) ? o.asset_urls : []).map((l) => `${l || ""}`.trim()).filter(Boolean)
    });
  }
  return r;
}
function Na(e) {
  const t = `${e || ""}`.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return t.includes("formula") || t.includes("equation") ? "formula" : t.includes("table") ? "table" : t.includes("figure") || t.includes("image") || t.includes("chart") || t.includes("seal") ? "figure" : t.includes("text") || t.includes("title") || t.includes("paragraph") || t.includes("reference") || t.includes("caption") ? "text" : "region";
}
function yn(e) {
  const t = Na(e.regionType);
  if (t !== "region") return t;
  if (e.assetIds.length || e.assetUrls.length) return "figure";
  const n = `${e.markdown || e.source.text || e.translated.text || ""}`.trim();
  return /^<table(?:\s|>)/i.test(n) || /\n\s*\|?\s*:?-{3,}/.test(n) ? "table" : /^\$\$[\s\S]+\$\$$/.test(n) || /^\\\[[\s\S]+\\\]$/.test(n) || /^\\begin\{(?:equation|align|gather|multline)\*?\}/.test(n) ? "formula" : n ? "text" : t;
}
function zr(e) {
  const t = yn(e);
  return t === "formula" || t === "table" || t === "figure";
}
function _r(e, t) {
  return `${xt(e, t).text || e.markdown || ""}`.trim();
}
function Aa(e) {
  let t = `${e || ""}`.trim();
  if (!t) return "";
  const n = t.match(/^```(?:latex|tex|math)?\s*([\s\S]*?)\s*```$/i);
  n && (t = n[1].trim());
  const r = [
    ["$$", "$$"],
    ["\\[", "\\]"],
    ["\\(", "\\)"],
    ["$", "$"]
  ];
  for (const [a, o] of r)
    if (t.startsWith(a) && t.endsWith(o) && t.length > a.length + o.length)
      return t.slice(a.length, -o.length).trim();
  return t;
}
function Jn(e) {
  const t = Ce(e);
  if (!t) return null;
  const n = [];
  for (const a of Array.isArray(t.pages) ? t.pages : []) {
    const o = Ce(a), s = rt(o == null ? void 0 : o.page), i = rt(o == null ? void 0 : o.width), c = rt(o == null ? void 0 : o.height);
    s == null || i == null || c == null || n.push({ page: Math.floor(s), width: i, height: c });
  }
  if (!n.length) return null;
  const r = rt(t.page_count ?? t.pageCount);
  return {
    pageCount: r == null ? n.length : Math.floor(r),
    pages: n
  };
}
function ka(e) {
  const t = Ce(Lr(e));
  return {
    source: Jn(t == null ? void 0 : t.source),
    translated: Jn(t == null ? void 0 : t.translated)
  };
}
function Pt(e, t) {
  const n = jn(t);
  return n && e.find((r) => jn(r.itemId) === n) || null;
}
function Rt(e) {
  return `${e || ""}`.normalize("NFKC").toLocaleLowerCase().replace(/[\p{P}\p{S}\s]+/gu, "").trim();
}
function Ca(e) {
  const t = `${e || ""}`.trim();
  if (!t) return [];
  const n = t.split(/\n\s*\n/g).map(Rt).filter(Boolean), r = t.split(">").map(Rt).filter(Boolean), a = [...n.reverse(), ...r.reverse(), Rt(t)];
  return [...new Set(a)].filter((o) => o.length >= 16);
}
function La(e, t) {
  if (!e || !t) return 0;
  if (e.includes(t)) return 1e4 + t.length;
  const n = Math.min(72, t.length);
  if (n < 24) return 0;
  const r = Math.min(32, Math.max(0, t.length - n));
  for (let a = 0; a <= r; a += 4) {
    const o = t.slice(a, a + n);
    if (o.length >= 24 && e.includes(o))
      return o.length * 100 - a;
  }
  return 0;
}
function za(e, t) {
  if (!t) return null;
  const n = Pt(e, t.block_id);
  if (n) return n;
  const r = Ca(t.snippet);
  if (!r.length) return null;
  const a = t.page_idx != null ? Number(t.page_idx) + 1 : t.page != null ? Number(t.page) : null, o = Number.isFinite(a) && Number(a) >= 1 ? e.filter((l) => l.source.page === Math.floor(Number(a)) || l.translated.page === Math.floor(Number(a))) : e;
  let s = null, i = 0, c = !1;
  for (const l of o) {
    const d = [l.source.text, l.translated.text, l.markdown].map(Rt).filter(Boolean);
    let u = 0;
    for (const f of r)
      for (const m of d)
        u = Math.max(u, La(m, f));
    u > i ? (s = l, i = u, c = !1) : u > 0 && u === i && (c = !0);
  }
  return i > 0 && !c ? s : null;
}
function qn(e) {
  let t = `${e || ""}`.trim().replace(/\\/g, "/");
  if (!t) return "";
  try {
    t = decodeURIComponent(new URL(t, "http://retainpdf.local/").pathname);
  } catch {
    try {
      t = decodeURIComponent(t);
    } catch {
    }
  }
  const n = "/markdown/images/", r = t.toLowerCase().indexOf(n);
  return r >= 0 && (t = t.slice(r + n.length)), t.replace(/^\.?\/?(?:images\/)?/i, "").replace(/\/{2,}/g, "/");
}
function _a(e, t, n) {
  const r = qn(t);
  if (!r) return null;
  const a = Number(n);
  return (Number.isFinite(a) && a >= 1 ? e.filter((s) => s.source.page === Math.floor(a)) : e).find((s) => [...s.assetUrls, ...s.assetIds].some((i) => {
    const c = qn(i);
    return !!c && (c === r || r.endsWith(`/${c}`) || c.endsWith(`/${r}`));
  })) || null;
}
function xt(e, t) {
  return t === "translated" ? e.translated : e.source;
}
function Kn(e, t, n) {
  if (!e || !t) return null;
  const r = xt(e, n), a = n === "translated" ? t.translated : t.source || t.translated, o = a == null ? void 0 : a.pages.find((s) => s.page === r.page);
  return o ? { itemId: e.itemId, region: e, box: r, pageSize: o } : null;
}
function zt(e, t, n) {
  if (!e || t <= 0 || n <= 0) return null;
  const { box: r, pageSize: a } = e;
  if (a.width <= 0 || a.height <= 0) return null;
  const [o, s, i, c] = r.bbox, l = r.origin === "bottom_left" ? a.height - c : s, d = r.origin === "bottom_left" ? a.height - s : c, u = Math.max(0, Math.min(t, o / a.width * t)), f = Math.max(u, Math.min(t, i / a.width * t)), m = Math.max(0, Math.min(n, l / a.height * n)), v = Math.max(m, Math.min(n, d / a.height * n));
  return f <= u || v <= m ? null : { left: u, top: m, width: f - u, height: v - m };
}
function Vn(e) {
  return typeof e == "string" ? e.trim() : `${e ?? ""}`.trim();
}
function Da(e) {
  const t = (e == null ? void 0 : e.data) ?? e, n = t && typeof t == "object" ? t : {};
  return {
    activeJobId: Vn(n.active_job_id),
    activeVersionId: Vn(n.active_version_id)
  };
}
function Fa(e) {
  const { link: t, rejectedDocumentJobId: n, hasCommittedSource: r } = e, a = t.activeJobId && t.activeJobId !== n && !t.activeJobId.startsWith("doc:") ? t.activeJobId : "";
  return a ? { kind: "follow-active-job", jobId: a, activeVersionId: t.activeVersionId } : t.activeVersionId && !r ? { kind: "open-committed-source", documentId: "", revision: t.activeVersionId } : { kind: "open-source-url" };
}
function Oa(e) {
  const {
    payloadDocumentId: t,
    linkedActiveJobId: n,
    linkedActiveVersionId: r,
    sessionJobId: a,
    hasCommittedSource: o
  } = e;
  return t && r && n === a && !o ? { kind: "restore-committed-source", documentId: t, revision: r } : { kind: "open-job-artifacts" };
}
function $a(e) {
  return e.status === 404 && !e.jobId && !!e.routeDocumentId && !!e.documentJobId && e.sessionJobId === e.documentJobId;
}
function ja(e) {
  return e ? { data: e.data.slice() } : null;
}
const Ua = 2, be = /* @__PURE__ */ new Map();
function Xt(e, t) {
  be.delete(e), be.set(e, t);
}
function Ba(e) {
  if (be.size < Ua) return;
  const t = be.keys().next().value;
  t && be.delete(t);
}
function Ot(e) {
  const t = `${e || ""}`.trim();
  if (!t || !be.has(t)) return null;
  const n = be.get(t);
  return Xt(t, n), n;
}
async function Dr(e, t = sa, n = {}) {
  const r = `${e || ""}`.trim();
  if (!r)
    return null;
  if (be.has(r)) {
    const i = be.get(r);
    return Xt(r, i), i;
  }
  const a = await t(r, { signal: n.signal });
  if (!a.ok) {
    const i = new Error(`读取 PDF 失败 (${a.status})`);
    throw i.status = a.status, i;
  }
  const o = await a.arrayBuffer(), s = { data: new Uint8Array(o) };
  return be.has(r) ? Xt(r, s) : (Ba(), be.set(r, s)), s;
}
function Ha(e = "", t = null) {
  const [n, r] = k(
    () => t || Ot(e)
  ), [a, o] = k(
    () => !!`${e || ""}`.trim() && !t && !Ot(e)
  ), [s, i] = k("");
  return O(() => {
    if (t) {
      r(t), o(!1), i("");
      return;
    }
    const c = `${e || ""}`.trim();
    if (!c) {
      r(null), o(!1), i("");
      return;
    }
    const l = Ot(c);
    if (l) {
      r(l), o(!1), i("");
      return;
    }
    let d = !1;
    return o(!0), i(""), r(null), Dr(c).then((u) => {
      d || (r(u), o(!1));
    }).catch((u) => {
      d || (r(null), o(!1), i((u == null ? void 0 : u.message) || String(u)));
    }), () => {
      d = !0;
    };
  }, [e, t]), { file: n, loading: a, error: s };
}
function Wa(e) {
  const { sessionEpochRef: t, closingRef: n, abort: r, sessionEpoch: a } = e;
  let o = !1;
  const s = () => r.signal.aborted || n.current || t.current.value !== a;
  return {
    signal: r.signal,
    isClosedOrStale: s,
    isInactive: () => o || s(),
    markFailed: () => {
      o = !0;
    }
  };
}
async function Qt(e) {
  const { url: t, label: n, percentStart: r, percentEnd: a, fence: o, setBoot: s } = e;
  if (!t || o.isInactive())
    return null;
  Et(s, r, n, "download");
  const i = await Dr(t, lt.fetchProtected, {
    signal: o.signal
  });
  return o.isInactive() ? null : (Et(s, a, n, "download"), i);
}
async function Ja(e) {
  const { sourceFinal: t, translatedFinal: n, fence: r, setBoot: a } = e;
  Et(a, 25, "正在下载 PDF…", "download");
  const o = [];
  let s = null, i = null;
  return t && o.push(
    Qt({
      url: t,
      label: "正在下载原文 PDF…",
      percentStart: 30,
      percentEnd: 55,
      fence: r,
      setBoot: a
    }).then((d) => {
      s = d;
    })
  ), n && o.push(
    Qt({
      url: n,
      label: "正在下载译文 PDF…",
      percentStart: 55,
      percentEnd: 85,
      fence: r,
      setBoot: a
    }).then((d) => {
      i = d;
    })
  ), await Promise.all(o), r.isInactive() ? { status: "inactive" } : !!t && !s || !!n && !i ? { status: "incomplete" } : { status: "downloaded", sourceBytes: s, translatedBytes: i };
}
const yt = {
  regions: null,
  metadata: null
};
function qa(e) {
  const {
    sessionJobId: t,
    jobId: n,
    routeDocumentId: r,
    documentJobId: a,
    rejectedDocumentJobId: o,
    sourceOnly: s,
    locationKey: i,
    sessionIdentity: c,
    committedSource: l,
    applyIdentityEvent: d,
    publishPayload: u,
    clearPayload: f,
    switchSessionMode: m,
    jobRefreshRevision: v,
    sessionEpochRef: h,
    closingRef: y,
    activeLoadAbortRef: b
  } = e, [g, S] = k(""), [w, I] = k(""), [L, x] = k(null), [D, T] = k(null), [M, R] = k(!1), [P, E] = k(""), [_, C] = k([]), [$, B] = k(() => ({
    source: null,
    translated: null
  })), [X, Y] = k(
    yt
  ), [re, te] = k({
    loading: !0,
    percent: 4,
    text: Pe.boot,
    stage: "progress",
    failed: !1
  });
  return O(() => {
    const se = new AbortController(), U = h.current.value, q = Wa({
      sessionEpochRef: h,
      closingRef: y,
      abort: se,
      sessionEpoch: U
    });
    if (b.current = se, y.current)
      return se.abort(), () => {
        b.current === se && (b.current = null);
      };
    function oe(K, Z) {
      q.markFailed(), te({
        loading: !1,
        percent: 100,
        text: K,
        stage: "failed",
        failed: !0
      }), Yt({ percent: 100, text: Z, stage: "failed" });
    }
    function ne() {
      R(!0), te({
        loading: !1,
        percent: 100,
        text: Pe.ready,
        stage: "ready",
        failed: !1
      }), Yt({ percent: 100, text: Pe.ready, stage: "ready" });
    }
    function ue() {
      return l != null && l.documentId ? Hn(
        l.documentId,
        l.revision
      ) : ra() ? oa : It(`/api/v1/documents/${encodeURIComponent(r)}/source.pdf`);
    }
    async function pe() {
      let K = { activeJobId: "", activeVersionId: "" };
      try {
        const ye = await lt.fetchProtected(
          It(`/api/v1/documents/${encodeURIComponent(r)}`)
        );
        if (ye != null && ye.ok) {
          const $e = await ye.json().catch(() => null);
          K = Da($e);
        }
      } catch {
      }
      const Z = Fa({
        link: K,
        rejectedDocumentJobId: o,
        hasCommittedSource: !!l
      });
      if (Z.kind === "follow-active-job") {
        if (q.isInactive()) return;
        d({
          type: "resolved-document-job",
          documentId: r,
          jobId: Z.jobId
        }), Z.activeVersionId ? (l || d({
          type: "committed-source",
          documentId: r,
          revision: Z.activeVersionId,
          sessionIdentity: c
        }), m("source")) : m("compare");
        return;
      }
      if (Z.kind === "open-committed-source") {
        if (q.isInactive()) return;
        d({
          type: "committed-source",
          documentId: r,
          revision: Z.revision,
          sessionIdentity: c
        }), m("source");
        return;
      }
      const ae = ue();
      if (q.isInactive()) return;
      S(ae), I(""), E(""), f(c);
      const Ie = await Qt({
        url: ae,
        label: "正在下载原文 PDF…",
        percentStart: 30,
        percentEnd: 85,
        fence: q,
        setBoot: te
      });
      if (!q.isInactive()) {
        if (!Ie) {
          oe("源文件不可用：该文档没有可读取的源 PDF。", "源文件下载失败");
          return;
        }
        x(Ie), ne();
      }
    }
    async function j() {
      const K = await lt.loadReaderPayload(t, {
        // committedSource 分支会丢弃 regions/metadata（旧页序已失效），
        // 直接跳过这两个可选请求，避免无效网络往返。
        includeOptionalArtifacts: !l
      });
      if (q.isInactive()) return;
      let Z = null;
      if (n && !r) {
        try {
          Z = await ba(bn, t);
        } catch {
        }
        if (q.isInactive()) return;
      }
      const ae = Ia(K.jobPayload) || `${(Z == null ? void 0 : Z.document_id) || ""}`.trim();
      ae && !r && d({
        type: "resolved-job-document",
        jobId: t,
        documentId: ae
      });
      const Ie = Oa({
        payloadDocumentId: ae,
        linkedActiveJobId: `${(Z == null ? void 0 : Z.active_job_id) || ""}`.trim(),
        linkedActiveVersionId: `${(Z == null ? void 0 : Z.active_version_id) || ""}`.trim(),
        sessionJobId: t,
        hasCommittedSource: !!l
      });
      if (Ie.kind === "restore-committed-source") {
        if (q.isInactive()) return;
        d({
          type: "committed-source",
          documentId: Ie.documentId,
          revision: Ie.revision,
          sessionIdentity: c
        }), m("source");
        return;
      }
      const ye = da(K.manifestPayload), $e = fa(K.jobPayload, K.manifestPayload), Ft = typeof ye == "string" ? ye : ua(ye), Ze = r || ae, Xe = l != null && l.documentId ? Hn(
        l.documentId,
        l.revision
      ) : Ft || (Ze ? It(`/api/v1/documents/${encodeURIComponent(Ze)}/source.pdf`) : ""), Qe = l ? "" : $e || "";
      if (S(Xe || ""), I(Qe), E(Ra(K.jobPayload, t)), u({
        jobPayload: K.jobPayload || null,
        manifestPayload: K.manifestPayload || null,
        sessionIdentity: c
      }), C(l ? [] : xa(K.regionsPayload)), B(l ? { source: null, translated: null } : ka(K.readerMetadata)), Y(l ? yt : K.readerErrors ?? yt), !Xe && !Qe) {
        oe(Pe.failed, Pe.failed);
        return;
      }
      const ve = await Ja({
        sourceFinal: Xe || "",
        translatedFinal: Qe,
        fence: q,
        setBoot: te
      });
      if (ve.status !== "inactive") {
        if (ve.status === "incomplete") {
          oe("PDF 下载失败，请重试", "PDF 下载失败");
          return;
        }
        x(ve.sourceBytes), T(ve.translatedBytes), ne();
      }
    }
    async function ie() {
      R(!1), x(null), T(null), C([]), B({ source: null, translated: null }), Y(yt), Et(te, 8, Pe.metadata, "metadata");
      try {
        if (s) {
          await pe();
          return;
        }
        if (!t) {
          oe(Pe.failed, Pe.failed);
          return;
        }
        await j();
      } catch (K) {
        if (q.isClosedOrStale() || (K == null ? void 0 : K.name) === "AbortError") return;
        q.markFailed();
        const Z = Number(K == null ? void 0 : K.status);
        if ($a({
          status: Z,
          jobId: n,
          routeDocumentId: r,
          documentJobId: a,
          sessionJobId: t
        })) {
          d({ type: "missing-document-job", documentId: r, jobId: t }), d({ type: "cleared-resolved-document-job" }), m("source");
          return;
        }
        const ae = K instanceof Error ? K.message : Pe.failed;
        oe(ae, ae);
      }
    }
    return ie(), () => {
      se.abort(), b.current === se && (b.current = null);
    };
  }, [t, r, a, o, s, i, l, v, n, c, d, u, f, m]), {
    sourceUrl: g,
    translatedUrl: w,
    sourceFile: L,
    translatedFile: D,
    assetsReady: M,
    title: P,
    regions: _,
    readerMetadata: $,
    readerErrors: X,
    boot: re
  };
}
function Ka() {
  const e = A(!1), t = A(null), { locationKey: n, jobId: r, routeDocumentId: a, sessionIdentity: o } = va(), s = A({ identity: "", value: 0 });
  s.current.identity !== o && (s.current = {
    identity: o,
    value: s.current.value + 1
  }, e.current = !1);
  const i = A(o), c = A(""), l = A(""), d = A(() => {
  }), u = N(() => d.current(), []), f = wa({
    routeDocumentId: a,
    jobId: r,
    sessionIdentity: o,
    sessionIdentityRef: i,
    documentIdRef: c,
    sessionJobIdRef: l,
    switchToSourceMode: u
  }), {
    sessionJobId: m,
    documentId: v,
    sourceOnly: h,
    sourceViewOnly: y
  } = f, { mode: b, setMode: g, switchSessionMode: S } = Ea(y);
  d.current = () => {
    S("source");
  }, i.current = o, c.current = v, l.current = m;
  const w = Ta({
    sessionJobId: m,
    sessionIdentity: o,
    sessionIdentityRef: i,
    sessionJobIdRef: l,
    sessionEpochRef: s,
    closingRef: e
  }), {
    scopedJobPayload: I,
    scopedManifestPayload: L,
    jobStatus: x,
    jobTerminal: D,
    jobRefreshRevision: T,
    refreshJobArtifacts: M,
    refreshJobStatus: R
  } = w, P = qa({
    sessionJobId: m,
    jobId: r,
    routeDocumentId: a,
    documentJobId: f.documentJobId,
    rejectedDocumentJobId: f.rejectedDocumentJobId,
    sourceOnly: h,
    locationKey: n,
    sessionIdentity: o,
    committedSource: f.activeCommittedDocumentSource,
    applyIdentityEvent: f.applyIdentityEvent,
    publishPayload: w.publishPayload,
    clearPayload: w.clearPayload,
    switchSessionMode: S,
    jobRefreshRevision: T,
    sessionEpochRef: s,
    closingRef: e,
    activeLoadAbortRef: t
  }), E = N(() => {
    var C;
    e.current = !0, (C = t.current) == null || C.abort();
  }, []), _ = J(
    () => ({
      fetchProtected: lt.fetchProtected,
      jobId: m,
      jobPayload: I,
      manifestPayload: L,
      sourceUrl: P.sourceUrl,
      translatedUrl: P.translatedUrl,
      sourceOnly: y
    }),
    [m, I, L, P.sourceUrl, P.translatedUrl, y]
  );
  return {
    jobId: m,
    jobStatus: x,
    workflow: `${(I == null ? void 0 : I.workflow) || ""}`.trim().toLowerCase(),
    jobTerminal: D,
    documentId: v,
    sessionIdentity: o,
    sourceOnly: h,
    mode: b,
    setMode: g,
    sourceUrl: P.sourceUrl,
    translatedUrl: P.translatedUrl,
    sourceFile: P.sourceFile,
    translatedFile: P.translatedFile,
    assetsReady: P.assetsReady,
    boot: P.boot,
    title: P.title,
    regions: P.regions,
    readerMetadata: P.readerMetadata,
    readerErrors: P.readerErrors,
    download: _,
    refreshJobArtifacts: M,
    refreshJobStatus: R,
    refreshCommittedDocument: f.refreshCommittedDocument,
    prepareClose: E
  };
}
const Va = 160, Ga = 8, Ya = 960;
function Za() {
  const e = A(null), [t, n] = k(null), [r, a] = k(Ya), o = N((s) => {
    e.current = s, n(s);
  }, []);
  return O(() => {
    const s = t;
    if (!s || typeof ResizeObserver > "u")
      return;
    const i = (l) => {
      !Number.isFinite(l) || l < Va || a((d) => Math.abs(d - l) < Ga ? d : l);
    }, c = new ResizeObserver((l) => {
      var d, u;
      i(((u = (d = l[0]) == null ? void 0 : d.contentRect) == null ? void 0 : u.width) ?? s.clientWidth);
    });
    return c.observe(s), i(s.clientWidth), () => c.disconnect();
  }, [t]), {
    shellRef: e,
    shellEl: t,
    shellWidth: r,
    bindShell: o
  };
}
function Xa(e) {
  const { mode: t, sourceOnly: n, assetsReady: r, hasSource: a, hasTranslated: o } = e, s = r && a, i = r && o && !n, c = t === "source" || t === "compare", l = !n && (t === "translated" || t === "compare");
  return {
    mountSource: s,
    mountTranslated: i,
    showSource: c,
    showTranslated: l,
    compareMode: t === "compare" && c && l && s && i,
    primaryPane: t === "translated" ? "translated" : "source"
  };
}
const $t = { source: 0, translated: 0 };
function Qa(e, t) {
  const {
    mode: n,
    sourceOnly: r,
    assetsReady: a,
    sourceUrl: o,
    translatedUrl: s,
    sourceFile: i,
    translatedFile: c
  } = e, l = `${(t == null ? void 0 : t.identityKey) || ""}\0${o}\0${s}`, d = A(l);
  d.current = l;
  const [u, f] = k(() => ({
    identity: l,
    pages: $t
  })), [m, v] = k(() => ({ identity: l, tick: 0 })), h = u.identity === l ? u.pages : $t, y = m.identity === l ? m.tick : 0, b = Xa({
    mode: n,
    sourceOnly: r,
    assetsReady: a,
    hasSource: !!i || !!o,
    hasTranslated: !!c
  }), { primaryPane: g } = b, S = N((R, P) => {
    d.current === l && f((E) => {
      const _ = E.identity === l ? E.pages : $t;
      return _[P] === R && E.identity === l ? E : {
        identity: l,
        pages: { ..._, [P]: R }
      };
    });
  }, [l]), w = A(null), I = N(() => {
    w.current && clearTimeout(w.current);
    const R = l;
    w.current = setTimeout(() => {
      w.current = null, d.current === R && v((P) => ({
        identity: R,
        tick: P.identity === R ? P.tick + 1 : 1
      }));
    }, 60);
  }, [l]);
  O(() => (w.current && (clearTimeout(w.current), w.current = null), f((R) => R.identity === l && R.pages.source === 0 && R.pages.translated === 0 ? R : { identity: l, pages: { source: 0, translated: 0 } }), v((R) => R.identity === l && R.tick === 0 ? R : { identity: l, tick: 0 }), () => {
    w.current && (clearTimeout(w.current), w.current = null);
  }), [l]);
  const L = J(
    () => Math.max(h.source, h.translated),
    [h]
  ), x = g === "translated" ? h.translated : h.source || h.translated, D = t == null ? void 0 : t.userZoom, T = t == null ? void 0 : t.shellWidth, M = `${l}-${y}-${D}-${n}-${h.source}-${h.translated}-${T}`;
  return {
    ...b,
    numPagesByPane: h,
    hudNumPages: L,
    primaryNumPages: x,
    metricsTick: y,
    onNumPages: S,
    onMetrics: I,
    rowSyncRevision: M
  };
}
const Ke = "data-reader-page", Ve = "data-reader-pane", vn = "data-natural-height", es = "reader-react-root", ts = "reader-react-grid", ns = "reader-react-scroll-shell", rs = "reader-react-pdf-pane", Fr = "reader-react-pdf-page", Nt = "reader-react-pdf-page-placeholder", wn = "reader-react-pdf-page-slot";
function ut(e, t) {
  const n = e != null ? `[${Ke}="${e}"]` : `[${Ke}]`;
  return t ? `${n}[${Ve}="${t}"]` : n;
}
function os() {
  return `.${wn}[${Ke}]`;
}
function _t(e) {
  return Number(e.getAttribute(Ke));
}
const Or = 0.25, $r = 1, as = 0.05, ht = 0.5, ss = 16, is = 8;
function at(e) {
  return ht;
}
function Dt(e) {
  return Number.isFinite(e) ? Math.min($r, Math.max(Or, e)) : ht;
}
function dt(e, t) {
  const n = Dt(Number(e) + t * as);
  return Math.round(n * 100) / 100;
}
function cs(e) {
  return Math.round(Dt(e) * 100);
}
function ls(e) {
  const n = (Number(e) || 0) - ss - is;
  return Math.max(160, Math.floor(n));
}
function us(e, t = ht) {
  const n = Dt(t);
  return ls((Number(e) || 0) * n);
}
function ds(e, t) {
  if (!e || !Number.isFinite(t) || t <= 0 || Math.abs(t - 1) < 1e-3)
    return;
  const n = e.scrollLeft + e.clientWidth / 2, r = e.scrollTop + e.clientHeight / 2, a = Array.from(
    e.querySelectorAll(`[${Ve}]`)
  ).map((s) => ({
    pane: s,
    cx: s.scrollLeft + s.clientWidth / 2,
    hadOverflow: s.scrollWidth > s.clientWidth + 1
  })), o = () => {
    e.scrollLeft = Math.max(0, n * t - e.clientWidth / 2), e.scrollTop = Math.max(0, r * t - e.clientHeight / 2);
    for (const { pane: s, cx: i, hadOverflow: c } of a) {
      const l = Math.max(0, s.scrollWidth - s.clientWidth);
      if (l <= 0) {
        s.scrollLeft = 0;
        continue;
      }
      c ? s.scrollLeft = Math.min(
        l,
        Math.max(0, i * t - s.clientWidth / 2)
      ) : s.scrollLeft = l / 2;
    }
  };
  requestAnimationFrame(() => {
    requestAnimationFrame(o);
  });
}
const fs = "retainpdf:reader:view:v1:", Gn = /* @__PURE__ */ new Set([
  "source",
  "translated",
  "markdown",
  "ai"
]), ms = /* @__PURE__ */ new Set([
  "source",
  "compare",
  "translated"
]);
function jr() {
  try {
    return typeof globalThis.localStorage > "u" ? null : globalThis.localStorage;
  } catch {
    return null;
  }
}
function en(e) {
  return `${e || ""}`.trim();
}
function ps({
  documentId: e,
  jobId: t
}) {
  const n = en(e);
  if (n) return `document:${n}`;
  const r = en(t);
  return r ? `job:${r}` : "";
}
function Ur(e) {
  const t = en(e);
  return t ? `${fs}${t}` : "";
}
function hs(e) {
  if (!e || typeof e != "object") return;
  const t = Math.floor(Number(e.page)), n = Number(e.fraction);
  if (!(!Number.isFinite(t) || t < 1 || !Number.isFinite(n)))
    return {
      page: t,
      fraction: Math.max(0, Math.min(1, n))
    };
}
function gs(e) {
  if (e === null) return null;
  if (!e || typeof e != "object") return;
  const t = `${e.left || ""}`, n = `${e.right || ""}`;
  if (!(!Gn.has(t) || !Gn.has(n) || t === n))
    return { left: t, right: n };
}
function bs(e) {
  return e === null ? null : e === "markdown" || e === "ai" ? e : void 0;
}
function ys(e) {
  return ms.has(e) ? e : void 0;
}
function Br(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (t.schema !== "retainpdf_reader_view_v1") return null;
  const n = hs(t.anchor), r = Number(t.zoom), a = ys(t.mode), o = gs(t.splitLayout), s = bs(t.assistantPanel);
  return {
    schema: "retainpdf_reader_view_v1",
    ...n ? { anchor: n } : {},
    ...Number.isFinite(r) ? { zoom: Math.max(0.25, Math.min(1, r)) } : {},
    ...a !== void 0 ? { mode: a } : {},
    ...o !== void 0 ? { splitLayout: o } : {},
    ...s !== void 0 ? { assistantPanel: s } : {},
    updatedAt: Number.isFinite(Number(t.updatedAt)) ? Number(t.updatedAt) : 0
  };
}
function Te(e, t = jr()) {
  const n = Ur(e);
  if (!n || !t) return null;
  try {
    const r = t.getItem(n);
    return r ? Br(JSON.parse(r)) : null;
  } catch {
    return null;
  }
}
function At(e, t, n = jr()) {
  const r = Ur(e);
  if (!r || !n) return null;
  const a = Te(e, n), o = Br({
    schema: "retainpdf_reader_view_v1",
    ...a || {},
    ...t,
    updatedAt: Date.now()
  });
  if (!o) return null;
  try {
    return n.setItem(r, JSON.stringify(o)), o;
  } catch {
    return null;
  }
}
function vs(e, t, n = "") {
  const [r, a] = k(() => {
    var u;
    return ((u = Te(n)) == null ? void 0 : u.zoom) ?? at();
  }), o = A(r), s = A(n);
  o.current = r;
  const i = A(1);
  O(() => {
    var f;
    if (s.current === n) return;
    s.current = n;
    const u = ((f = Te(n)) == null ? void 0 : f.zoom) ?? at();
    i.current = 1, o.current = u, a(u);
  }, [e, n]);
  const c = N((u) => {
    const f = Dt(u), m = o.current;
    Math.abs(f - m) < 5e-4 || (i.current = f / (m || 1), At(s.current, { zoom: f }), a(f));
  }, []), l = N((u) => {
    c(dt(o.current, u));
  }, [c]), d = N((u) => {
    c(at());
  }, [c]);
  return De(() => {
    const u = i.current;
    Math.abs(u - 1) < 1e-3 || (i.current = 1, ds(t == null ? void 0 : t.current, u));
  }, [r, t]), { userZoom: r, onZoomChange: c, stepZoom: l, resetZoom: d };
}
function ws(e, t = !0) {
  const [n, r] = k(null), a = N(() => {
    var i, c;
    r(null);
    const s = (i = globalThis.getSelection) == null ? void 0 : i.call(globalThis);
    (c = s == null ? void 0 : s.removeAllRanges) == null || c.call(s);
  }, []), o = e.current ?? null;
  return O(() => {
    if (!t)
      return;
    const s = () => {
      var C, $;
      const h = e.current, y = (C = globalThis.getSelection) == null ? void 0 : C.call(globalThis);
      if (!h || !y || y.isCollapsed || !y.rangeCount) {
        r(null);
        return;
      }
      const b = y.getRangeAt(0);
      if (!h.contains(b.commonAncestorContainer)) {
        r(null);
        return;
      }
      const g = `${y.toString() || ""}`.replace(/\s+/g, " ").trim();
      if (g.length < 2) {
        r(null);
        return;
      }
      let S = b.commonAncestorContainer;
      S.nodeType === Node.TEXT_NODE && (S = S.parentElement);
      const w = ($ = S == null ? void 0 : S.closest) == null ? void 0 : $.call(
        S,
        ut()
      );
      if (!w || !h.contains(w)) {
        r(null);
        return;
      }
      const I = Math.max(1, Math.floor(_t(w) || 1)), x = w.getAttribute(Ve) === "translated" ? "translated" : "source", D = b.getClientRects(), T = D[D.length - 1] || b.getBoundingClientRect();
      if (!T || T.width === 0 && T.height === 0) {
        r(null);
        return;
      }
      const M = typeof window < "u" ? window.innerWidth : 800, R = typeof window < "u" ? window.innerHeight : 600, P = 16, E = Math.min(Math.max(P, T.left), M - P), _ = Math.min(Math.max(P, T.top), R - P);
      r({
        selectionType: "text",
        quote: g,
        page: I,
        pane: x,
        rect: {
          left: E,
          top: _,
          width: T.width,
          height: T.height
        }
      });
    }, i = () => {
      window.setTimeout(s, 0);
    }, c = () => {
      i();
    }, l = () => i(), d = () => i(), u = () => {
      i();
    }, f = (h) => {
      h.key === "Escape" && a();
    }, m = () => {
      r((h) => h && null);
    };
    document.addEventListener("mouseup", c), document.addEventListener("pointerup", l), document.addEventListener("touchend", d), document.addEventListener("selectionchange", u), document.addEventListener("keyup", f);
    const v = o ?? e.current;
    return v == null || v.addEventListener("scroll", m, { passive: !0 }), window.addEventListener("scroll", m, { passive: !0, capture: !0 }), () => {
      document.removeEventListener("mouseup", c), document.removeEventListener("pointerup", l), document.removeEventListener("touchend", d), document.removeEventListener("selectionchange", u), document.removeEventListener("keyup", f), v == null || v.removeEventListener("scroll", m), window.removeEventListener("scroll", m, !0);
    };
  }, [t, o, a]), { selection: n, clearSelection: a };
}
function Ss(e) {
  const { mode: t, setMode: n, beginModeSwitch: r } = e, a = A(t), o = A(n), s = A(r);
  return a.current = t, o.current = n, s.current = r, { setModeKeepingPage: N((c) => {
    c !== a.current && (s.current(), o.current(c));
  }, []) };
}
function Is() {
  const [e, t] = k(null), n = N((s) => {
    t(s);
  }, []), r = N((s = null) => {
    t((i) => !s || i === s ? null : i);
  }, []), a = N((s) => {
    t((i) => i === s ? null : s);
  }, []), o = N(
    (s) => e === s,
    [e]
  );
  return { active: e, open: n, close: r, toggle: a, isOpen: o };
}
const Sn = 48;
function Hr(e, t = Sn) {
  return e.getBoundingClientRect().top + t;
}
function Wr(e, t) {
  if (!e.length)
    return null;
  let n = null, r = -1 / 0;
  for (const c of e) {
    const l = c.getBoundingClientRect();
    l.height < 8 || l.width < 8 || l.top <= t + 1 && l.top >= r && (n = c, r = l.top);
  }
  if (!n && (n = e.find((l) => {
    const d = l.getBoundingClientRect();
    return d.height >= 8 && d.width >= 8;
  }) ?? e[0] ?? null, n)) {
    const l = [...e].reverse().find((d) => {
      const u = d.getBoundingClientRect();
      return u.height >= 8 && u.width >= 8;
    });
    l && l.getBoundingClientRect().bottom < t && (n = l);
  }
  if (!n)
    return null;
  const a = _t(n);
  if (!Number.isFinite(a) || a < 1)
    return null;
  const o = n.getBoundingClientRect(), s = o.height > 0 ? o.height : 1, i = Math.min(1, Math.max(0, (t - o.top) / s));
  return { el: n, page: a, fraction: i };
}
function jt(e, t, n = Sn) {
  if (!e)
    return null;
  const r = ut(void 0, t), a = Array.from(e.querySelectorAll(r));
  if (!a.length || e.getBoundingClientRect().height <= 0)
    return null;
  const s = Hr(e, n), i = Wr(a, s);
  return i ? { page: i.page, fraction: i.fraction } : null;
}
function In(e, t, n = "auto", r, a = Sn) {
  if (!e || !t)
    return !1;
  const o = Math.max(1, Math.floor(Number(t.page) || 1)), s = Math.min(1, Math.max(0, Number(t.fraction) || 0));
  let i = null;
  if (r && (i = e.querySelector(ut(o, r))), i || (i = e.querySelector(ut(o))), !i)
    return !1;
  const c = e.getBoundingClientRect(), l = i.getBoundingClientRect();
  if (c.height <= 0 || l.height < 8 && i.offsetHeight < 8)
    return !1;
  const d = l.height > 0 ? l.height : i.offsetHeight, u = e.scrollTop + (l.top - c.top), f = Math.max(0, u + s * d - a);
  return n === "auto" ? e.scrollTop = f : e.scrollTo({ top: f, behavior: n }), !0;
}
function Ps(e, t, n = "smooth", r) {
  return In(
    e,
    { page: t, fraction: 0 },
    n,
    r
  );
}
function tn(e, t, n) {
  const r = (n == null ? void 0 : n.behavior) ?? "auto", a = (n == null ? void 0 : n.delaysMs) ?? [0, 32, 120, 280];
  let o = !1, s = !1;
  const i = [], c = () => {
    var d;
    if (o) return;
    In(
      e(),
      t,
      r,
      n == null ? void 0 : n.pane
    ) && !s && (s = !0, (d = n == null ? void 0 : n.onDone) == null || d.call(n));
  };
  for (const l of a)
    l <= 0 ? requestAnimationFrame(() => {
      requestAnimationFrame(c);
    }) : i.push(setTimeout(c, l));
  return () => {
    o = !0;
    for (const l of i)
      clearTimeout(l);
  };
}
function Rs(e, t, n) {
  return tn(
    e,
    { page: t, fraction: 0 },
    n
  );
}
function kt(e, t) {
  if (!Number.isFinite(e))
    return 1;
  const n = Math.max(1, Math.floor(e));
  return !Number.isFinite(t) || t <= 0 ? n : Math.min(t, n);
}
function he(e) {
  return {
    page: Math.max(1, Math.floor(Number(e.page) || 1)),
    fraction: Math.min(1, Math.max(0, Number(e.fraction) || 0))
  };
}
function Ts(e, t, n = !0, r = "", a) {
  const [o, s] = k(1);
  return O(() => {
    if (!n || t <= 0) {
      s(1);
      return;
    }
    const i = e.current;
    if (!i)
      return;
    let c = !1, l = null, d = 0;
    const u = ut(void 0, a), f = () => {
      if (c) return;
      const h = Array.from(i.querySelectorAll(u));
      if (!h.length)
        return;
      const y = Hr(i), b = Wr(h, y);
      b && s(b.page);
    }, m = () => {
      c || (d && cancelAnimationFrame(d), d = requestAnimationFrame(() => {
        d = 0, f();
      }));
    }, v = () => {
      if (c) return;
      if (!Array.from(i.querySelectorAll(u)).length) {
        l = setTimeout(v, 120);
        return;
      }
      f(), i.addEventListener("scroll", m, { passive: !0 });
    };
    return v(), () => {
      c = !0, l && clearTimeout(l), d && cancelAnimationFrame(d), i.removeEventListener("scroll", m);
    };
  }, [e, t, n, r, a]), o;
}
const Ms = `canvas, .react-pdf__Page, .${Fr}, .${Nt}`, Yn = /* @__PURE__ */ new WeakMap();
function Es(e) {
  const t = Number(e.getAttribute(vn));
  if (Number.isFinite(t) && t > 0)
    return t;
  let n = Yn.get(e);
  if ((n == null || !n.isConnected) && (n = e.querySelector(Ms), Yn.set(e, n)), n) {
    const a = n.getBoundingClientRect().height;
    if (Number.isFinite(a) && a > 0)
      return a;
  }
  const r = e.getBoundingClientRect().height;
  return Number.isFinite(r) && r > 0 ? r : 0;
}
function xs(e, t) {
  if (e.size !== t.size) return !1;
  for (const [n, r] of t)
    if (e.get(n) !== r) return !1;
  return !0;
}
function Ns(e) {
  const t = /* @__PURE__ */ new Map();
  e.querySelectorAll(os()).forEach((r) => {
    const a = _t(r);
    if (!Number.isFinite(a) || a < 1) return;
    const o = Es(r);
    if (o <= 0) return;
    const s = t.get(a) || { height: 0, count: 0 };
    s.height = Math.max(s.height, o), s.count += 1, t.set(a, s);
  });
  const n = /* @__PURE__ */ new Map();
  return t.forEach((r, a) => {
    r.count >= 2 && r.height > 0 && n.set(a, Math.ceil(r.height));
  }), n;
}
function As(e, t, n = "", r) {
  const [a, o] = k(() => /* @__PURE__ */ new Map()), s = A(a), i = A(r);
  return i.current = r, De(() => {
    if (!t) {
      s.current.size !== 0 && (s.current = /* @__PURE__ */ new Map(), o(s.current));
      return;
    }
    let c = !1, l = 0, d = !1, u = !1;
    const f = () => {
      var I;
      if (c) return;
      const S = e.current;
      if (!S) return;
      const w = Ns(S);
      xs(s.current, w) || (s.current = w, o(w)), d && !u && (u = !0, (I = i.current) == null || I.call(i));
    }, m = () => {
      cancelAnimationFrame(l), l = requestAnimationFrame(() => {
        requestAnimationFrame(f);
      });
    };
    m();
    const v = window.setTimeout(m, 100), h = window.setTimeout(() => {
      d = !0, m();
    }, 300), y = window.setTimeout(m, 700), b = e.current;
    let g = null;
    return b && typeof ResizeObserver < "u" && (g = new ResizeObserver(() => m()), g.observe(b)), () => {
      c = !0, cancelAnimationFrame(l), window.clearTimeout(v), window.clearTimeout(h), window.clearTimeout(y), g == null || g.disconnect();
    };
  }, [e, t, n]), a;
}
const ks = [0, 48, 140, 320, 560], Cs = 700, Ls = [80, 200, 400], zs = 500, _s = 50, Ds = 180, Zn = [0, 48, 140, 320, 700, 1200];
function Fs(e, t) {
  var R;
  const {
    primaryPane: n,
    mode: r,
    enabled: a = !0,
    persistenceKey: o = "",
    restoreReady: s = !0
  } = t, i = A(
    ((R = Te(o)) == null ? void 0 : R.anchor) || { page: 1, fraction: 0 }
  ), c = A(null), l = A(!1), d = A(r), u = A(null), f = A(null), m = A(null), v = A(null), h = A(o), y = A(""), b = A(n);
  b.current = n;
  const g = N(() => {
    var P;
    (P = u.current) == null || P.call(u), u.current = null, f.current != null && (clearTimeout(f.current), f.current = null);
  }, []), S = N((P = !1) => {
    v.current != null && (clearTimeout(v.current), v.current = null);
    const E = () => {
      v.current = null, At(h.current, {
        anchor: he(i.current)
      });
    };
    P ? E() : v.current = setTimeout(E, Ds);
  }, []), w = N((P) => {
    i.current = he(P), c.current = null, m.current != null && clearTimeout(m.current), m.current = setTimeout(() => {
      m.current = null, l.current = !1;
    }, _s);
  }, []);
  O(() => {
    if (!a)
      return;
    let P = !1, E = null, _ = null, C = null;
    const $ = () => {
      if (P) return;
      const B = e.current;
      if (!B) {
        C = setTimeout($, 50);
        return;
      }
      E = B, _ = () => {
        if (l.current)
          return;
        const X = jt(E, b.current);
        X && (i.current = X, S());
      }, E.addEventListener("scroll", _, { passive: !0 }), l.current || _();
    };
    return $(), () => {
      P = !0, C != null && clearTimeout(C), E && _ && E.removeEventListener("scroll", _);
    };
  }, [a, r, n, e, S]), De(() => {
    var E;
    if (h.current === o) return;
    S(!0), g(), m.current != null && (clearTimeout(m.current), m.current = null), h.current = o, y.current = "";
    const P = (E = Te(o)) == null ? void 0 : E.anchor;
    i.current = P ? he(P) : { page: 1, fraction: 0 }, c.current = null, l.current = !!o, d.current = r;
  }, [o, r, S, g]), O(() => {
    var E;
    if (!a || !s || !o || y.current === o) return;
    y.current = o;
    const P = he(
      ((E = Te(o)) == null ? void 0 : E.anchor) || { page: 1, fraction: 0 }
    );
    return i.current = P, c.current = P, l.current = !0, g(), u.current = tn(
      () => e.current,
      P,
      {
        behavior: "auto",
        pane: b.current,
        delaysMs: Zn,
        onDone: () => w(P)
      }
    ), f.current = setTimeout(() => {
      f.current = null, w(P);
    }, Math.max(...Zn) + 160), () => g();
  }, [a, s, o, e, w, g]), O(() => {
    if (d.current === r)
      return;
    if (d.current = r, !a) {
      l.current = !1, c.current = null, g();
      return;
    }
    const P = c.current ? he(c.current) : he(i.current);
    return l.current = !0, c.current = P, i.current = P, g(), u.current = tn(
      () => e.current,
      P,
      {
        behavior: "auto",
        pane: n,
        // 等页宽/行高同步后再钉；同一 locked 幂等，不会越滚越远
        delaysMs: ks,
        onDone: () => w(P)
      }
    ), f.current = setTimeout(() => {
      f.current = null, w(P);
    }, Cs), () => {
      g();
    };
  }, [r, a, n, e, w, g]), O(() => () => {
    g(), m.current != null && (clearTimeout(m.current), m.current = null), S(!0);
  }, [g, S]);
  const I = N(() => {
    const P = jt(
      e.current,
      b.current
    );
    return he(P || i.current);
  }, [e]), L = N(() => {
    l.current = !0;
    const P = jt(
      e.current,
      b.current
    ), E = he(P ?? i.current);
    return i.current = E, c.current = E, S(), E;
  }, [e, S]), x = N((P, E, _) => {
    const C = _ || b.current, $ = kt(P, E || 1), B = { page: $, fraction: 0 };
    i.current = B, l.current = !0, c.current = B, S(), g(), Ps(e.current, $, "smooth", C), u.current = Rs(
      () => e.current,
      $,
      {
        behavior: "auto",
        pane: C,
        delaysMs: Ls,
        onDone: () => w(B)
      }
    ), f.current = setTimeout(() => {
      f.current = null, w(B);
    }, zs);
  }, [e, w, g, S]), D = N(() => he(i.current), []), T = N(() => l.current, []), M = N(() => {
    if (!l.current || !c.current)
      return;
    const P = he(c.current);
    In(
      e.current,
      P,
      "auto",
      b.current
    );
  }, [e]);
  return {
    lockFromShell: I,
    beginModeSwitch: L,
    goToPage: x,
    getAnchor: D,
    isRestoring: T,
    repinIfRestoring: M
  };
}
function Os(e, t) {
  if (!e) return null;
  if (e.blockId && t) {
    const a = t(e.blockId);
    if (a != null && Number.isFinite(a) && a >= 1)
      return Math.floor(a);
  }
  if (e.pageIdx === null || e.pageIdx === void 0) return null;
  const n = Number(e.pageIdx);
  if (!Number.isFinite(n)) return null;
  const r = Math.floor(n) + 1;
  return r >= 1 ? r : null;
}
function Jr(e, t, n) {
  const r = `${(n == null ? void 0 : n.jobId) || ""}`.trim(), a = `${(n == null ? void 0 : n.documentId) || ""}`.trim(), o = `j:${r}:d:${a}`;
  return t == null ? `${o}:none:${(e == null ? void 0 : e.blockId) || ""}` : `${o}:p:${t}:b:${(e == null ? void 0 : e.blockId) || ""}`;
}
const $s = [0, 80, 200, 400, 800], js = 120, Us = 400;
function Bs(e, t, n) {
  const { enabled: r, numPages: a, goToPage: o, resolveBlockPage: s, onAnchorApplied: i, jobId: c, documentId: l } = e, d = A(o);
  d.current = o;
  const u = A(s);
  u.current = s;
  const f = A(i);
  f.current = i;
  const m = A(n);
  m.current = n, O(() => {
    var S, w;
    if (!r || !Number.isFinite(a) || a < 1)
      return;
    const v = ia(), h = Os(v, u.current), y = Jr(v, h, { jobId: c, documentId: l });
    if (t.current === y)
      return;
    if (h == null) {
      t.current = y, (S = m.current) == null || S.call(m);
      return;
    }
    t.current = y, v && ((w = f.current) == null || w.call(f, v, h));
    const b = [];
    let g = 0;
    for (const I of $s)
      g = Math.max(g, I), b.push(
        setTimeout(() => {
          d.current(h);
        }, I)
      );
    return b.push(
      setTimeout(() => {
        var I;
        (I = m.current) == null || I.call(m);
      }, g + js)
    ), () => {
      for (const I of b) clearTimeout(I);
    };
  }, [r, a, c, l, t]);
}
function Hs(e) {
  var o;
  const t = globalThis.window;
  if (!t || typeof ((o = t.history) == null ? void 0 : o.replaceState) != "function") return;
  const n = t.location, r = `${e || ""}`, a = `${n.pathname}${r ? `?${r}` : ""}${n.hash || ""}`;
  t.history.replaceState(null, "", a);
}
function Ws(e, t, n) {
  const {
    syncEnabled: r,
    currentPage: a,
    resolveBlockPage: o,
    syncDebounceMs: s = Us,
    jobId: i,
    documentId: c,
    applyReaderSearch: l
  } = e, d = A(o);
  d.current = o;
  const u = A(l);
  u.current = l;
  const f = A(0);
  O(() => {
    if (!n || !r || !t.current || !Number.isFinite(a) || a < 1 || f.current === a) return;
    const m = setTimeout(() => {
      var b;
      const v = ((b = globalThis.location) == null ? void 0 : b.search) || "", h = Co(v, a, d.current);
      if (f.current = a, h === null) return;
      const y = `${new URLSearchParams(h).get("block_id") || ""}`.trim();
      t.current = Jr(
        { blockId: y },
        a,
        { jobId: i, documentId: c }
      ), (u.current || Hs)(h);
    }, s);
    return () => clearTimeout(m);
  }, [
    n,
    r,
    a,
    s,
    i,
    c,
    t
  ]);
}
function Js(e) {
  const t = A(""), [n, r] = k(!1), a = N(() => r(!0), []), o = {
    enabled: e.enabled,
    numPages: e.numPages,
    goToPage: e.goToPage,
    resolveBlockPage: e.resolveBlockPage,
    onAnchorApplied: e.onAnchorApplied,
    jobId: e.jobId,
    documentId: e.documentId
  };
  Bs(o, t, a), Ws(e, t, n);
}
const vt = {
  layoutByPage: /* @__PURE__ */ new Map(),
  pagesByPage: /* @__PURE__ */ new Map(),
  lastSeq: 0,
  connection: "idle",
  jobStatus: "",
  error: ""
};
function qs(e) {
  return new Map(((e == null ? void 0 : e.pages) || []).map((t) => [t.page_idx, t]));
}
function Xn(e, t) {
  return e.attempt !== t.attempt ? e.attempt < t.attempt ? -1 : 1 : e.generation !== t.generation ? e.generation < t.generation ? -1 : 1 : 0;
}
function qr(e, t, n) {
  if (n.page_idx !== t.page_idx) return "retry";
  const r = Xn(n, t);
  if (r < 0 || r === 0 && n.page_hash !== t.page_hash) return "retry";
  if (!e) return "accept";
  const a = Xn(n, e);
  return a < 0 ? "ignore" : a === 0 ? n.page_hash === e.pageHash ? "ignore" : "retry" : "accept";
}
function Ks(e, t, n) {
  if (t.seq <= e.lastSeq) return e;
  const r = e.pagesByPage.get(t.page_idx), a = qr(r, t, n);
  if (a === "retry") return e;
  if (a === "ignore")
    return { ...e, lastSeq: t.seq, connection: "live", error: "" };
  const o = new Map(n.items.map((c) => [c.item_id, c])), s = new Map((r == null ? void 0 : r.changedAtSeqById) || []);
  for (const c of t.changed_item_ids)
    o.has(c) && s.set(c, t.seq);
  const i = new Map(e.pagesByPage);
  return i.set(t.page_idx, {
    attempt: n.attempt,
    generation: n.generation,
    pageHash: n.page_hash,
    itemsById: o,
    changedAtSeqById: s,
    lastEventSeq: t.seq
  }), {
    ...e,
    pagesByPage: i,
    lastSeq: t.seq,
    connection: "live",
    error: ""
  };
}
const Qn = [250, 500, 1e3, 2e3, 4e3], Ut = [80, 160, 320, 640, 1e3, 1500], er = [250, 500, 1e3, 2e3, 4e3, 5e3], Vs = /* @__PURE__ */ new Set(["succeeded", "failed", "cancelled", "canceled"]);
function nn(e, t) {
  return new Promise((n, r) => {
    if (t.aborted) {
      r(new DOMException("Aborted", "AbortError"));
      return;
    }
    const a = () => {
      clearTimeout(o), r(new DOMException("Aborted", "AbortError"));
    }, o = setTimeout(() => {
      t.removeEventListener("abort", a), n();
    }, e);
    t.addEventListener("abort", a, { once: !0 });
  });
}
function Bt(e, t) {
  if (e instanceof Mt) {
    if (e.code === "LIVE_TRANSLATION_PAGE_NOT_COMMITTED")
      return "尚未收到可显示的页面译文";
    if (e.code === "LIVE_TRANSLATION_LAYOUT_NOT_READY")
      return "正在等待 OCR 版面数据";
  }
  return `${(e == null ? void 0 : e.message) || ""}`.trim() || t;
}
async function Gs(e, t, n, r) {
  let a = null;
  for (let o = 0; ; o += 1) {
    try {
      const i = await Oo(e, t.page_idx, { signal: r });
      if (qr(n.pagesByPage.get(t.page_idx), t, i) !== "retry")
        return i;
      a = new Mt(
        "Authoritative page snapshot has not reached the event generation",
        409,
        "LIVE_TRANSLATION_SNAPSHOT_UNAVAILABLE"
      );
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") throw i;
      a = i;
      const c = i instanceof Mt ? i.code : "";
      if (c && ![
        "LIVE_TRANSLATION_PAGE_NOT_COMMITTED",
        "LIVE_TRANSLATION_SNAPSHOT_UNAVAILABLE"
      ].includes(c)) throw i;
    }
    const s = Ut[Math.min(o, Ut.length - 1)];
    if (await nn(s, r), o >= Ut.length + 2) throw a;
  }
}
function Ys({
  jobId: e,
  jobStatus: t,
  enabled: n
}) {
  const [r, a] = k(vt), o = A(r), s = A("");
  o.current = r;
  const i = `${e || ""}`.trim(), c = `${t || ""}`.trim().toLowerCase(), l = Vs.has(c) ? c : "";
  return O(() => {
    if (!n || !i) {
      s.current = "", o.current = vt, a(vt);
      return;
    }
    const d = s.current === i;
    s.current = i;
    const u = new AbortController();
    let f = !1;
    const m = {
      ...d ? o.current : vt,
      connection: l ? "terminal" : "connecting",
      jobStatus: c,
      error: ""
    };
    o.current = m, a(m);
    const v = (b) => {
      u.signal.aborted || a((g) => {
        const S = b(g);
        return o.current = S, S;
      });
    }, h = async () => {
      let b = 0;
      for (; !u.signal.aborted; )
        try {
          const g = await Do(i, { signal: u.signal });
          f = !0, v((S) => ({
            ...S,
            layoutByPage: qs(g),
            jobStatus: c,
            error: ""
          }));
          return;
        } catch (g) {
          if ((g == null ? void 0 : g.name) === "AbortError") return;
          if (!(g instanceof Mt && g.code === "LIVE_TRANSLATION_LAYOUT_NOT_READY")) {
            v((w) => ({
              ...w,
              connection: l ? "terminal" : "unavailable",
              jobStatus: c,
              error: Bt(g, "实时译文暂不可用")
            }));
            return;
          }
          if (l) {
            v((w) => ({
              ...w,
              connection: "terminal",
              jobStatus: c,
              error: ""
            }));
            return;
          }
          v((w) => ({
            ...w,
            connection: "connecting",
            jobStatus: c,
            error: Bt(g, "正在等待 OCR 版面数据")
          })), await nn(Qn[Math.min(b, Qn.length - 1)], u.signal).catch(() => {
          }), b += 1;
        }
    };
    return (async () => {
      if (await h(), !f || u.signal.aborted) return;
      let b = 0;
      for (; !u.signal.aborted; ) {
        l || v((g) => ({
          ...g,
          connection: g.lastSeq > 0 ? "reconnecting" : "connecting",
          jobStatus: c,
          error: g.lastSeq > 0 ? g.error : ""
        }));
        try {
          await Fo(i, {
            afterSeq: o.current.lastSeq,
            signal: u.signal,
            onEvent: async (g) => {
              if (g.seq <= o.current.lastSeq) return;
              const S = await Gs(
                i,
                g,
                o.current,
                u.signal
              );
              v((w) => {
                const I = Ks(w, g, S);
                return l ? {
                  ...I,
                  connection: "terminal",
                  jobStatus: c
                } : {
                  ...I,
                  jobStatus: c
                };
              }), b = 0;
            }
          });
        } catch (g) {
          if ((g == null ? void 0 : g.name) === "AbortError" || u.signal.aborted) return;
          v((S) => ({
            ...S,
            connection: l ? "terminal" : "reconnecting",
            jobStatus: c,
            error: Bt(g, "实时译文连接已中断，正在重连")
          }));
        }
        if (u.signal.aborted) return;
        if (l) {
          v((g) => ({
            ...g,
            connection: "terminal",
            jobStatus: c
          }));
          return;
        }
        await nn(er[Math.min(b, er.length - 1)], u.signal).catch(() => {
        }), b += 1;
      }
    })(), () => u.abort();
  }, [n, i, l]), r;
}
const Zs = 2e3;
function Xs(e) {
  if (typeof e == "number") {
    const r = Number(e);
    return !Number.isFinite(r) || r < 0 ? null : Math.floor(r) + 1;
  }
  if (!e || typeof e != "object") return null;
  const t = e.page_idx;
  if (t != null && `${t}`.trim() !== "") {
    const r = Number(t);
    return !Number.isFinite(r) || r < 0 ? null : Math.floor(r) + 1;
  }
  const n = e.page;
  if (n != null && `${n}`.trim() !== "") {
    const r = Number(n);
    return !Number.isFinite(r) || r < 1 ? null : Math.floor(r);
  }
  return null;
}
const Qs = /* @__PURE__ */ new Set(["book", "translate"]);
function Kr(e) {
  return !!(e.jobId && e.sourceUrl && Qs.has(e.workflow));
}
function ei(e) {
  return !!(Kr(e) && !(e.jobStatus === "succeeded" && e.translatedUrl));
}
function ti() {
  const e = Ka(), t = Kr({
    jobId: e.jobId,
    sourceUrl: e.sourceUrl,
    workflow: e.workflow
  }), n = ei({
    jobId: e.jobId,
    sourceUrl: e.sourceUrl,
    translatedUrl: e.translatedUrl,
    jobStatus: e.jobStatus,
    workflow: e.workflow
  }), r = Ys({
    jobId: e.jobId,
    jobStatus: e.jobStatus,
    enabled: t
  }), a = Is(), { shellRef: o, shellEl: s, shellWidth: i, bindShell: c } = Za(), l = ps({
    documentId: e.documentId,
    jobId: e.jobId
  }), d = `${l}\0${e.jobId}\0${e.sourceUrl}\0${e.translatedUrl}`, { userZoom: u, onZoomChange: f } = vs(e.mode, o, l), m = Qa(
    {
      mode: e.mode,
      sourceOnly: e.sourceOnly,
      assetsReady: e.assetsReady,
      sourceUrl: e.sourceUrl,
      translatedUrl: e.translatedUrl,
      sourceFile: e.sourceFile,
      translatedFile: e.translatedFile
    },
    { userZoom: u, shellWidth: i, identityKey: d }
  ), {
    beginModeSwitch: v,
    goToPage: h,
    repinIfRestoring: y
  } = Fs(o, {
    primaryPane: m.primaryPane,
    mode: e.mode,
    enabled: !e.boot.loading,
    persistenceKey: l,
    restoreReady: m.primaryNumPages > 0
  });
  O(() => {
    y();
  }, [i, y]);
  const b = As(
    o,
    m.compareMode,
    m.rowSyncRevision,
    y
  ), g = Ts(
    o,
    m.primaryNumPages,
    !e.boot.loading,
    `${e.mode}-${u}-${m.metricsTick}`,
    m.primaryPane
  ), S = N((U, q) => {
    var ne, ue;
    const oe = Math.max(
      Number(m.hudNumPages) || 0,
      Number(m.primaryNumPages) || 0,
      Number((ne = m.numPagesByPane) == null ? void 0 : ne.source) || 0,
      Number((ue = m.numPagesByPane) == null ? void 0 : ue.translated) || 0
    );
    h(U, oe, q);
  }, [h, m.hudNumPages, m.primaryNumPages, m.numPagesByPane]), [w, I] = k(null), L = A(null), x = N((U) => {
    L.current && clearTimeout(L.current), I(U), U && (L.current = setTimeout(() => I(null), Zs));
  }, []);
  O(() => () => {
    L.current && clearTimeout(L.current);
  }, []);
  const D = N((U) => {
    const q = Pt(e.regions, U);
    return q ? xt(q, m.primaryPane).page : null;
  }, [e.regions, m.primaryPane]), T = N((U, q) => {
    const oe = q || m.primaryPane, ne = typeof U == "object" && U ? `${U.block_id || ""}`.trim() : "", ue = typeof U == "object" && U ? `${U.image_url || ""}`.trim() : "", pe = typeof U == "object" && U ? U.page_idx != null ? Number(U.page_idx) + 1 : U.page != null ? Number(U.page) : null : typeof U == "number" ? U + 1 : null, j = _a(e.regions, ue, pe) || Pt(e.regions, ne) || (typeof U == "object" ? za(e.regions, U) : null);
    let ie = j ? xt(j, oe).page : null;
    ie == null && (ie = Xs(U)), !(ie == null || ie < 1) && (x(j), S(ie, oe));
  }, [x, S, m.primaryPane, e.regions]);
  Js({
    enabled: !e.boot.loading && !e.boot.failed && e.assetsReady,
    syncEnabled: !e.boot.loading && !e.boot.failed && e.assetsReady,
    numPages: m.hudNumPages || 0,
    currentPage: g,
    goToPage: S,
    resolveBlockPage: D,
    jobId: e.jobId,
    documentId: e.documentId,
    onAnchorApplied: (U) => {
      x(Pt(e.regions, U.blockId));
    }
  });
  const { setModeKeepingPage: M } = Ss({
    mode: e.mode,
    setMode: e.setMode,
    beginModeSwitch: v
  }), [R, P] = k(null), {
    selection: E,
    clearSelection: _
  } = ws(o, !e.boot.loading && !e.boot.failed), C = N(() => {
    P(null), _();
  }, [_]), $ = N((U) => {
    _(), P(U);
  }, [_]);
  O(() => {
    E && P(null);
  }, [E]), O(() => {
    const U = o.current;
    if (!U) return;
    const q = () => P(null);
    return U.addEventListener("scroll", q, { passive: !0 }), () => U.removeEventListener("scroll", q);
  }, [s, o]);
  const B = E || R;
  O(() => {
    x(null), C();
  }, [d, x, C]);
  const X = !e.boot.loading && !e.boot.failed, Y = J(() => a, [a.active, a.open, a.close, a.toggle, a.isOpen]), re = J(() => ({ bindShell: c, shellEl: s, shellWidth: i, shellRef: o }), [c, s, i, o]), te = J(() => ({
    sourceUrl: e.sourceUrl,
    translatedUrl: e.translatedUrl,
    sourceFile: e.sourceFile,
    translatedFile: e.translatedFile
  }), [e.sourceUrl, e.translatedUrl, e.sourceFile, e.translatedFile]), se = J(() => ({
    session: e,
    boot: e.boot,
    sourceOnly: e.sourceOnly,
    mode: e.mode,
    userZoom: u,
    onZoomChange: f,
    shell: re,
    panes: m,
    sessionFiles: te,
    rowHeights: b,
    goToPage: S,
    activeRegion: w,
    jumpToAnchor: T,
    setModeKeepingPage: M,
    download: e.download,
    showHud: X,
    tools: Y,
    selection: B,
    clearSelection: C,
    selectRegion: $,
    viewStateKey: l,
    liveTranslation: r,
    liveTranslationAvailable: n
  }), [e, re, m, te, b, S, w, T, M, X, Y, B, C, $, u, f, l, r, n]);
  return J(() => ({
    ...se,
    currentPage: g
  }), [se, g]);
}
const ni = [
  { action: "mode-source", keys: ["1"], mode: "source" },
  { action: "mode-compare", keys: ["2"], mode: "compare" },
  { action: "mode-translated", keys: ["3"], mode: "translated" },
  { action: "zoom-in", keys: ["+", "="] },
  { action: "zoom-out", keys: ["-", "_"] },
  { action: "zoom-reset", keys: ["0"] },
  { action: "next-page", keys: ["j", "ArrowDown", "PageDown"], requiresPages: !0 },
  { action: "prev-page", keys: ["k", "ArrowUp", "PageUp"], requiresPages: !0 },
  { action: "first-page", keys: ["Home"], requiresPages: !0 },
  { action: "last-page", keys: ["End"], requiresPages: !0 }
], ri = [
  {
    title: "翻页",
    items: [
      { actions: ["next-page"], keys: "J · ↓ · PgDn", desc: "下一页" },
      { actions: ["prev-page"], keys: "K · ↑ · PgUp", desc: "上一页" },
      { actions: ["first-page", "last-page"], keys: "Home / End", desc: "首页 / 末页" },
      { actions: [], keys: "点底栏页码", desc: "输入页码跳转" }
    ]
  },
  {
    title: "缩放",
    items: [
      { actions: ["zoom-in", "zoom-out"], keys: "+ / −", desc: "放大 / 缩小" },
      { actions: ["zoom-reset"], keys: "0", desc: "重置为模式默认" },
      { actions: [], keys: "点百分比", desc: "重置为模式默认" }
    ]
  },
  {
    title: "模式",
    items: [
      { actions: ["mode-source"], keys: "1", desc: "源文件" },
      { actions: ["mode-compare"], keys: "2", desc: "对照" },
      { actions: ["mode-translated"], keys: "3", desc: "翻译文件" }
    ]
  }
];
function oi(e) {
  const t = e.length === 1 ? e.toLowerCase() : e;
  for (const n of ni)
    if (n.keys.some(
      (a) => a.length === 1 ? a === t : a === e
    )) return n;
  return null;
}
function ai(e) {
  if (!(e instanceof HTMLElement))
    return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function si(e) {
  const {
    mode: t,
    sourceOnly: n,
    setMode: r,
    userZoom: a,
    onZoomChange: o,
    currentPage: s,
    numPages: i,
    goToPage: c,
    enabled: l = !0
  } = e;
  O(() => {
    if (!l)
      return;
    const d = (u) => {
      if (u.defaultPrevented || u.metaKey || u.ctrlKey || u.altKey || ai(u.target))
        return;
      const f = u.key, m = oi(f);
      if (m) {
        if (m.mode) {
          if (n && m.mode !== "source")
            return;
          u.preventDefault(), r(m.mode);
          return;
        }
        if (!(m.requiresPages && i <= 0))
          switch (u.preventDefault(), m.action) {
            case "zoom-in":
              o(dt(a, 1));
              return;
            case "zoom-out":
              o(dt(a, -1));
              return;
            case "zoom-reset":
              o(at());
              return;
            case "next-page":
              c(kt(s + 1, i));
              return;
            case "prev-page":
              c(kt(s - 1, i));
              return;
            case "first-page":
              c(1);
              return;
            case "last-page":
              c(i);
              return;
          }
      }
    };
    return window.addEventListener("keydown", d), () => window.removeEventListener("keydown", d);
  }, [
    l,
    t,
    n,
    r,
    a,
    o,
    s,
    i,
    c
  ]);
}
const ii = "retainpdf:soft-reader-close";
function ci() {
  return new URL("./index.html", window.location.href).href;
}
function li() {
  if (typeof window > "u" || window.self === window.top) return !1;
  try {
    return window.parent.postMessage(
      { type: ii },
      window.location.origin
    ), !0;
  } catch {
    return !1;
  }
}
function ui(e, t, n) {
  if (n <= 1 || !e) return !1;
  try {
    const r = new URL(t), a = new URL(e, r);
    return a.origin === r.origin && !/reader\.html$/i.test(a.pathname) && !/detail\.html$/i.test(a.pathname);
  } catch {
    return !1;
  }
}
function di() {
  if (!(typeof window > "u") && !li()) {
    if (ui(
      document.referrer,
      window.location.href,
      window.history.length
    )) {
      window.history.back();
      return;
    }
    window.location.assign(ci());
  }
}
function fi({ onBeforeClose: e } = {}) {
  return /* @__PURE__ */ z(
    "button",
    {
      id: "reader-close-home-btn",
      type: "button",
      className: "reader-close-home-btn",
      "aria-label": "返回主页",
      title: "返回主页",
      onClick: () => {
        e == null || e(), di();
      },
      children: [
        /* @__PURE__ */ p(Ye, { className: "reader-close-home-icon", size: 18, strokeWidth: 2.25, "aria-hidden": !0 }),
        /* @__PURE__ */ p("span", { className: "reader-close-home-label", children: "关闭" })
      ]
    }
  );
}
let tr = !1;
function mi() {
  if (tr)
    return;
  const e = Gt("build/pdf.worker.mjs");
  e && (Zo.GlobalWorkerOptions.workerSrc = e, tr = !0);
}
const pi = {
  formula: "公式",
  table: "表格",
  figure: "图片",
  text: "文字",
  region: "区域"
};
function hi({
  pane: e,
  width: t,
  height: n,
  regions: r,
  onSelect: a
}) {
  const o = r.flatMap((s) => {
    if (!zr(s.region)) return [];
    const i = zt(s, t, n);
    return i ? [{ highlight: s, rect: i }] : [];
  });
  return o.length ? /* @__PURE__ */ p("div", { className: "reader-structure-selection-layer", "aria-label": "PDF 结构选择层", children: o.map(({ highlight: s, rect: i }) => {
    const c = s.region, l = yn(c), d = pi[l];
    return /* @__PURE__ */ z(
      "button",
      {
        type: "button",
        className: `reader-structure-selection-target is-${l}`,
        "data-reader-region-id": c.itemId,
        "data-reader-region-kind": l,
        style: i,
        "aria-label": `${d}区域，点击选择`,
        title: `${d} · 点击选择`,
        onClick: (u) => {
          u.stopPropagation();
          const f = u.currentTarget.getBoundingClientRect();
          a == null || a({
            selectionType: "region",
            region: c,
            kind: l,
            page: s.box.page,
            pane: e,
            rect: {
              left: f.left,
              top: f.top,
              width: f.width,
              height: f.height
            }
          });
        },
        children: [
          /* @__PURE__ */ p("span", { className: "reader-structure-selection-label", "aria-hidden": "true", children: d }),
          /* @__PURE__ */ p("span", { className: "sr-only", children: _r(c, e) })
        ]
      },
      c.itemId
    );
  }) }) : null;
}
function gi(e, t, n) {
  return e.flatMap((r) => {
    if (yn(r.region) !== "text") return [];
    const a = zt(r, t, n);
    return a ? [{ itemId: r.itemId, highlight: r, rect: a }] : [];
  });
}
function nr(e, t, n) {
  let r = null, a = Number.POSITIVE_INFINITY;
  for (const o of e) {
    const { rect: s } = o;
    if (t < s.left || t > s.left + s.width || n < s.top || n > s.top + s.height)
      continue;
    const i = s.width * s.height;
    i < a && (r = o, a = i);
  }
  return r;
}
function bi({ target: e }) {
  return e ? /* @__PURE__ */ p("div", { className: "reader-text-hover-layer", "aria-hidden": "true", children: /* @__PURE__ */ p(
    "div",
    {
      className: "reader-text-hover-frame",
      "data-reader-text-hover-id": e.itemId,
      style: e.rect,
      children: /* @__PURE__ */ p("span", { className: "reader-text-hover-label", children: "文字" })
    }
  ) }) : null;
}
function yi(e, t) {
  const n = e.page_idx + 1, r = {
    page: n,
    bbox: t.bbox,
    unit: "pdf_point",
    origin: "top_left",
    text: t.source_text
  }, a = {
    itemId: t.item_id,
    source: r,
    translated: r,
    markdown: t.source_text,
    regionType: t.kind,
    status: "live_translation",
    assetIds: [],
    assetUrls: []
  };
  return {
    itemId: t.item_id,
    region: a,
    box: r,
    pageSize: { page: n, width: e.width, height: e.height }
  };
}
function vi(e, t, n, r) {
  if (!e || !t) return [];
  const a = [];
  for (const o of e.blocks) {
    const s = t.itemsById.get(o.item_id);
    if (!(s != null && s.translated_text)) continue;
    const i = zt(
      yi(e, o),
      n,
      r
    );
    i && a.push({
      itemId: o.item_id,
      translatedText: s.translated_text,
      status: s.status,
      kind: o.kind,
      sourceText: o.source_text,
      typography: o.typography,
      rect: i,
      changedAtSeq: t.changedAtSeqById.get(o.item_id) || 0,
      changedNow: t.changedAtSeqById.get(o.item_id) === t.lastEventSeq
    });
  }
  return a;
}
const wi = '"Source Han Serif SC", "Noto Serif CJK SC", "Songti SC", serif', Si = 256, tt = /* @__PURE__ */ new Map();
function Ii(e) {
  return `${e || ""}`.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function Pi(e) {
  const t = `${e || ""}`, { text: n, slots: r } = ea(t, { bareLatex: !0 }), a = Ii(n), o = ta(a, r);
  if (!r.length)
    return { fallbackHtml: o, richHtml: Promise.resolve(o), hasMath: !1 };
  let s = tt.get(t);
  if (!s && (s = na(a, r), tt.set(t, s), tt.size > Si)) {
    const i = tt.keys().next().value;
    i !== void 0 && tt.delete(i);
  }
  return { fallbackHtml: o, richHtml: s, hasMath: !0 };
}
function Ht(e) {
  return /title|heading|header|display_formula|equation/i.test(e);
}
function Re(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? t : void 0;
}
function Ri(e, t) {
  const n = e.typography, r = Re(t) || 1, a = Re(n == null ? void 0 : n.font_size_pt), o = Math.max(1, `${e.sourceText || ""}`.split(/\n+/).length), s = e.rect.height / Math.max(1.28, o * 1.18), i = Ht(e.kind) ? 24 : /caption|footnote|table/i.test(e.kind) ? 9.5 : 11, c = Math.max(5.5 * r, Math.min(s, i * r)), l = Re(n == null ? void 0 : n.fit_min_font_size_pt), d = Re(n == null ? void 0 : n.fit_max_font_size_pt), u = Math.max(3.5, (l || 5.5) * r), f = Math.max(
    u,
    d ? d * r : a ? a * r : c
  ), m = a ? a * r : c, v = Re(n == null ? void 0 : n.leading_em), h = [
    Re(n == null ? void 0 : n.padding_top_pt) || 0,
    Re(n == null ? void 0 : n.padding_right_pt) || 0,
    Re(n == null ? void 0 : n.padding_bottom_pt) || 0,
    Re(n == null ? void 0 : n.padding_left_pt) || 0
  ].map((y) => y * r);
  return {
    fontFamily: `${(n == null ? void 0 : n.font_family) || ""}`.trim() || wi,
    fontSizePx: Math.max(u, Math.min(f, m)),
    minFontSizePx: u,
    maxFontSizePx: f,
    // Typst leading is the additional inter-line gap, unlike CSS line-height.
    lineHeight: v ? 1 + v : 1.3,
    fontWeight: (n == null ? void 0 : n.font_weight) || (Ht(e.kind) ? 600 : 400),
    textAlign: (n == null ? void 0 : n.text_align) || (Ht(e.kind) ? "center" : "justify"),
    padding: h,
    exact: !!a
  };
}
function Ti(e, t, n, r) {
  const { minFontSizePx: a, maxFontSizePx: o } = r, s = /* @__PURE__ */ new Map(), i = (u) => {
    const f = s.get(u);
    if (f !== void 0) return f;
    const { width: m, height: v } = e(u), h = m <= t + 0.5 && v <= n + 0.5;
    return s.set(u, h), h;
  };
  let c = a, l = o, d = Math.min(r.requestedFontSizePx, l);
  if (i(d)) {
    if (!r.exact) {
      c = d;
      for (let u = 0; u < 6 && l > c; u += 1) {
        const f = (c + l) / 2;
        i(f) ? (d = f, c = f) : l = f;
      }
    }
  } else {
    l = d, d = c;
    for (let u = 0; u < 8 && l > c; u += 1) {
      const f = (c + l) / 2;
      i(f) ? (d = f, c = f) : l = f;
    }
  }
  return Math.max(a, d);
}
const Mi = 512, nt = /* @__PURE__ */ new Map();
let rn = 0;
typeof document < "u" && document.fonts && (document.fonts.ready.then(() => {
  rn += 1;
}).catch(() => {
}), typeof document.fonts.addEventListener == "function" && document.fonts.addEventListener("loadingdone", () => {
  rn += 1;
}));
function Ei(e, t, n, r) {
  return [
    rn,
    r.fontFamily,
    r.fontWeight,
    r.lineHeight,
    r.textAlign,
    r.minFontSizePx,
    r.maxFontSizePx,
    r.fontSizePx,
    r.exact ? 1 : 0,
    t,
    n,
    e
  ].join("");
}
function xi({ item: e, pageScale: t }) {
  const n = A(null), r = J(
    () => Pi(e.translatedText),
    [e.translatedText]
  ), [a, o] = k(r.fallbackHtml), s = J(
    () => Ri(e, t),
    [e, t]
  );
  O(() => {
    let u = !0;
    return o(r.fallbackHtml), r.hasMath && r.richHtml.then((f) => {
      u && o(f);
    }), () => {
      u = !1;
    };
  }, [r]), De(() => {
    const u = n.current;
    if (!u) return;
    const [f, m, v, h] = s.padding, y = Math.max(1, e.rect.width - h - m), b = Math.max(1, e.rect.height - f - v), g = Ei(a, y, b, s);
    let S = nt.get(g);
    if (S === void 0 && (S = Ti(
      (w) => (u.style.fontSize = `${w}px`, { width: u.scrollWidth, height: u.scrollHeight }),
      y,
      b,
      {
        minFontSizePx: s.minFontSizePx,
        maxFontSizePx: s.maxFontSizePx,
        requestedFontSizePx: s.fontSizePx,
        exact: s.exact
      }
    ), nt.set(g, S), nt.size > Mi)) {
      const w = nt.keys().next().value;
      w !== void 0 && nt.delete(w);
    }
    u.style.fontSize = `${S.toFixed(2)}px`;
  }, [a, e.rect.height, e.rect.width, s]);
  const [i, c, l, d] = s.padding;
  return /* @__PURE__ */ p(
    "div",
    {
      className: `reader-live-translation-item${e.changedNow ? " is-changed" : ""}`,
      "data-live-translation-item": e.itemId,
      "data-live-translation-kind": e.kind,
      "data-live-translation-status": e.status,
      "data-live-translation-typography": s.exact ? "typst" : "fitted",
      style: {
        ...e.rect,
        padding: `${i}px ${c}px ${l}px ${d}px`
      },
      children: /* @__PURE__ */ p(
        "div",
        {
          ref: n,
          className: "reader-live-translation-content",
          style: {
            fontFamily: s.fontFamily,
            fontSize: s.fontSizePx,
            fontWeight: s.fontWeight,
            lineHeight: s.lineHeight,
            textAlign: s.textAlign
          },
          dangerouslySetInnerHTML: { __html: a }
        }
      )
    }
  );
}
function Ni({
  layoutPage: e,
  pageState: t,
  width: n,
  height: r
}) {
  const a = J(
    () => vi(e, t, n, r),
    [r, e, t, n]
  );
  return a.length ? /* @__PURE__ */ p(
    "div",
    {
      className: "reader-live-translation-overlay",
      "data-live-translation-page": e == null ? void 0 : e.page_idx,
      "data-live-translation-generation": t == null ? void 0 : t.generation,
      "aria-hidden": "true",
      children: a.map((o) => /* @__PURE__ */ p(
        xi,
        {
          item: o,
          pageScale: e != null && e.width ? n / e.width : 1
        },
        `${o.itemId}:${o.changedAtSeq}`
      ))
    }
  ) : null;
}
const Ai = un(Ni), Vr = 1.414;
function ki({
  pageNumber: e,
  width: t,
  devicePixelRatio: n,
  pane: r,
  active: a = !1,
  syncedMinHeight: o = 0,
  onMetrics: s,
  cachedAspect: i,
  onAspectChange: c,
  sentinelRef: l,
  regionHighlight: d = null,
  regionTargets: u = [],
  onSelectRegion: f,
  liveTranslationLayout: m,
  liveTranslationPage: v,
  showLiveTranslation: h = r === "source"
}) {
  const y = A(i ?? Vr), [b, g] = k(y.current);
  O(() => {
    i != null && Math.abs(i - y.current) >= 1e-3 && (y.current = i, g(i));
  }, [i]);
  const S = A(l);
  S.current = l;
  const w = A((C) => {
    var $;
    ($ = S.current) == null || $.call(S, C);
  }).current, I = Math.max(120, Math.floor(t * b)), L = Math.max(I, Math.ceil(o || 0)), x = zt(d, t, I), D = J(
    () => gi(u, t, I),
    [I, u, t]
  ), [T, M] = k(null), R = J(
    () => D.find((C) => C.itemId === T) || null,
    [T, D]
  ), P = (C) => {
    if (C.buttons !== 0) {
      M(null);
      return;
    }
    const $ = C.currentTarget.getBoundingClientRect(), B = nr(
      D,
      C.clientX - $.left,
      C.clientY - $.top
    ), X = (B == null ? void 0 : B.itemId) || null;
    M((Y) => Y === X ? Y : X);
  }, E = (C) => {
    var X, Y, re;
    if (!f || (Y = (X = C.target) == null ? void 0 : X.closest) != null && Y.call(X, ".reader-structure-selection-target") || `${((re = window.getSelection()) == null ? void 0 : re.toString()) || ""}`.trim()) return;
    const $ = C.currentTarget.getBoundingClientRect(), B = nr(
      D,
      C.clientX - $.left,
      C.clientY - $.top
    );
    B && f({
      selectionType: "region",
      region: B.highlight.region,
      kind: "text",
      page: B.highlight.box.page,
      pane: r === "translated" ? "translated" : "source",
      rect: {
        left: $.left + B.rect.left,
        top: $.top + B.rect.top,
        width: B.rect.width,
        height: B.rect.height
      }
    });
  }, _ = (C) => {
    !Number.isFinite(C) || C <= 0 || Math.abs(y.current - C) < 1e-3 || (y.current = C, g(C), c == null || c(e, C));
  };
  return /* @__PURE__ */ z(
    "div",
    {
      ref: w,
      [Ke]: e,
      [Ve]: r,
      [vn]: I,
      className: wn,
      onPointerMoveCapture: P,
      onClick: E,
      onPointerLeave: () => M(null),
      style: {
        width: t,
        height: L,
        minHeight: L
      },
      children: [
        a ? /* @__PURE__ */ p(
          Xo,
          {
            pageNumber: e,
            width: t,
            devicePixelRatio: n,
            renderTextLayer: !0,
            renderAnnotationLayer: !1,
            className: Fr,
            loading: /* @__PURE__ */ p(
              "div",
              {
                className: Nt,
                style: { width: t, height: I }
              }
            ),
            onLoadSuccess: (C) => {
              try {
                const $ = C.getViewport({ scale: 1 });
                if ($.width > 0) {
                  const B = $.height / $.width;
                  _(B);
                }
              } catch {
              }
              s == null || s();
            },
            onRenderSuccess: () => {
              s == null || s();
            }
          }
        ) : /* @__PURE__ */ p(
          "div",
          {
            className: Nt,
            style: { width: t, height: I },
            "aria-hidden": !0
          }
        ),
        x ? /* @__PURE__ */ p(
          "div",
          {
            className: "reader-react-pdf-region-highlight",
            "data-reader-region-id": d == null ? void 0 : d.itemId,
            style: x,
            "aria-hidden": "true"
          }
        ) : null,
        a && h ? /* @__PURE__ */ p(
          Ai,
          {
            layoutPage: m,
            pageState: v,
            width: t,
            height: I
          }
        ) : null,
        /* @__PURE__ */ p(bi, { target: a ? R : null }),
        /* @__PURE__ */ p(
          hi,
          {
            pane: r === "translated" ? "translated" : "source",
            width: t,
            height: I,
            regions: u,
            onSelect: f
          }
        )
      ]
    }
  );
}
const Ci = un(ki), Wt = 5, Li = "120% 0px", zi = 120;
let rr = 1;
const or = /* @__PURE__ */ new WeakMap();
function _i(e) {
  if (!e) return 0;
  const t = or.get(e);
  if (t) return t;
  const n = rr;
  return rr += 1, or.set(e, n), n;
}
function Di() {
  const e = typeof window < "u" && window.devicePixelRatio || 1;
  return Math.max(1, Math.min(e, 2));
}
const Fi = Io(
  function({
    pane: t,
    url: n = "",
    preloadedFile: r = null,
    userZoom: a = 1,
    visible: o = !0,
    emptyLabel: s = "暂无 PDF",
    scrollRoot: i = null,
    pageWidthOverride: c = null,
    rowHeights: l,
    onMetrics: d,
    onLoadSuccess: u,
    onLoadError: f,
    onNumPagesChange: m,
    activeRegion: v = null,
    regions: h = [],
    readerMetadata: y = null,
    onSelectRegion: b,
    liveTranslation: g,
    showLiveTranslation: S = t === "source",
    liveTranslationPendingLabel: w = "",
    paneAction: I
  }, L) {
    mi();
    const { file: x, loading: D, error: T } = Ha(n, r), M = `${n}\0${_i(x)}`, R = A(M);
    R.current = M;
    const P = J(
      () => ja(x),
      [x, n]
    ), [E, _] = k(0), [C, $] = k(""), [B, X] = k(null), [Y, re] = k(480), te = A(null), se = A(0), U = J(() => Di(), []), q = J(() => ({
      cMapUrl: Gt("cmaps/"),
      cMapPacked: !0,
      standardFontDataUrl: Gt("standard_fonts/")
    }), []);
    dn(L, () => B, [B]), O(() => {
      const F = (H) => {
        !Number.isFinite(H) || H < 80 || Math.abs(H - se.current) < 8 || (se.current = H, re(H));
      }, V = c && c >= 80 ? c : (i == null ? void 0 : i.clientWidth) || 0;
      if (F(V), !i || typeof ResizeObserver > "u" || c && c >= 80) return;
      const W = new ResizeObserver((H) => {
        var Q, ee;
        const ce = ((ee = (Q = H[0]) == null ? void 0 : Q.contentRect) == null ? void 0 : ee.width) ?? i.clientWidth;
        !Number.isFinite(ce) || ce < 80 || (te.current && clearTimeout(te.current), te.current = setTimeout(() => F(ce), 80));
      });
      return W.observe(i), () => {
        W.disconnect(), te.current && clearTimeout(te.current);
      };
    }, [c, i, o]);
    const oe = J(
      () => us(Y, a),
      [Y, a]
    ), [ne, ue] = k(() => /* @__PURE__ */ new Map()), [pe, j] = k(() => /* @__PURE__ */ new Set()), [ie, K] = k(() => /* @__PURE__ */ new Set()), Z = A(/* @__PURE__ */ new Map()), ae = A(null), Ie = A(/* @__PURE__ */ new Map()), ye = N((F, V) => {
      ue((W) => {
        if (W.get(F) === V) return W;
        const H = new Map(W);
        return H.set(F, V), H;
      });
    }, []), $e = N((F, V) => {
      const W = Z.current, H = W.get(F);
      if (H && ae.current)
        try {
          ae.current.unobserve(H);
        } catch {
        }
      if (V) {
        if (W.set(F, V), ae.current)
          try {
            ae.current.observe(V);
          } catch {
          }
      } else
        W.delete(F);
    }, []), Ft = A(/* @__PURE__ */ new Map()), Ze = N((F) => {
      const V = Ft.current;
      let W = V.get(F);
      return W || (W = (H) => $e(F, H), V.set(F, W)), W;
    }, [$e]);
    O(() => {
      if (typeof IntersectionObserver > "u") return;
      const F = Ie.current, V = new IntersectionObserver(
        (W) => {
          const H = [], ce = [];
          for (const Q of W) {
            const ee = Q.target, me = _t(ee);
            Number.isFinite(me) && (Q.isIntersecting ? H : ce).push(me);
          }
          if ((H.length || ce.length) && j((Q) => {
            let ee = null;
            for (const me of H)
              Q.has(me) || (ee = ee || new Set(Q), ee.add(me));
            for (const me of ce)
              Q.has(me) && (ee = ee || new Set(Q), ee.delete(me));
            return ee || Q;
          }), H.length) {
            for (const Q of H) {
              const ee = F.get(Q);
              ee && (clearTimeout(ee), F.delete(Q));
            }
            K((Q) => {
              let ee = null;
              for (const me of H)
                Q.has(me) || (ee = ee || new Set(Q), ee.add(me));
              return ee || Q;
            });
          }
          for (const Q of ce)
            F.has(Q) || F.set(Q, setTimeout(() => {
              F.delete(Q), K((ee) => {
                if (!ee.has(Q)) return ee;
                const me = new Set(ee);
                return me.delete(Q), me;
              });
            }, zi));
        },
        { root: i, rootMargin: Li, threshold: 0 }
      );
      ae.current = V;
      for (const W of Z.current.values())
        try {
          V.observe(W);
        } catch {
        }
      return () => {
        V.disconnect(), ae.current === V && (ae.current = null);
        for (const W of F.values()) clearTimeout(W);
        F.clear();
      };
    }, [i]), De(() => {
      _(0), $(""), j(/* @__PURE__ */ new Set()), K(/* @__PURE__ */ new Set()), ue(/* @__PURE__ */ new Map()), Z.current.clear();
      const F = Ie.current;
      for (const V of F.values()) clearTimeout(V);
      F.clear(), m == null || m(0, t);
    }, [M, m, t]);
    const Xe = N(
      ({ numPages: F }) => {
        R.current === M && (_(F), $(""), m == null || m(F, t), u == null || u({ numPages: F, pane: t }));
      },
      [M, u, m, t]
    ), Qe = N(
      (F) => {
        if (R.current !== M) return;
        const V = (F == null ? void 0 : F.message) || "PDF 解析失败";
        $(V), _(0), m == null || m(0, t), f == null || f(F, t);
      },
      [M, f, m, t]
    ), ve = J(
      () => E > 0 ? Array.from({ length: E }, (F, V) => V + 1) : [],
      [E]
    );
    O(() => {
      typeof IntersectionObserver < "u" || K(new Set(ve));
    }, [ve]);
    const bt = J(
      () => Kn(v, y, t),
      [v, y, t]
    ), yo = J(() => {
      const F = /* @__PURE__ */ new Map();
      for (const V of h) {
        const W = Kn(V, y, t);
        if (!W) continue;
        const H = F.get(W.box.page) || [];
        H.push(W), F.set(W.box.page, H);
      }
      return F;
    }, [t, y, h]), vo = J(() => {
      if (E === 0) return /* @__PURE__ */ new Set();
      if (!(!!i && typeof IntersectionObserver < "u" && o)) return new Set(ve);
      if (pe.size === 0) {
        const W = Math.min(E, Wt * 2 + 1);
        return new Set(Array.from({ length: W }, (H, ce) => ce + 1));
      }
      const V = /* @__PURE__ */ new Set();
      for (const W of pe)
        for (let H = -Wt; H <= Wt; H++) {
          const ce = W + H;
          ce >= 1 && ce <= E && V.add(ce);
        }
      return V;
    }, [E, ve, i, o, pe]), wo = !n || !!T || !!C, So = n && (T || C) || s;
    return /* @__PURE__ */ z(
      "section",
      {
        ref: X,
        className: `reader-panel ${rs}${o ? "" : " is-hidden"}`,
        [Ve]: t,
        "data-reader-engine": "react-pdf",
        "data-reader-visible": o ? "true" : "false",
        "data-live-translation-status": (g == null ? void 0 : g.jobStatus) || void 0,
        "aria-hidden": o ? void 0 : !0,
        "aria-label": t === "source" ? "原文 PDF" : "译文 PDF",
        children: [
          I ? /* @__PURE__ */ p("div", { className: "reader-react-pdf-pane-action", children: I }) : null,
          w ? /* @__PURE__ */ z("div", { className: "reader-live-translation-waiting", role: "status", children: [
            /* @__PURE__ */ p("span", { className: "reader-live-translation-waiting-dot", "aria-hidden": "true" }),
            /* @__PURE__ */ p("span", { children: w })
          ] }) : null,
          wo && !D ? /* @__PURE__ */ p("div", { className: "reader-empty reader-react-pdf-empty", "data-reader-pdf-empty": t, children: So }) : null,
          D ? /* @__PURE__ */ p("div", { className: "reader-empty reader-react-pdf-loading", "data-reader-pdf-loading": t, children: "正在加载 PDF…" }) : null,
          P && !T ? /* @__PURE__ */ p("div", { className: "reader-viewer-wrap reader-react-pdf-wrap", children: /* @__PURE__ */ p(
            Qo,
            {
              file: P,
              loading: null,
              error: null,
              options: q,
              onLoadSuccess: Xe,
              onLoadError: Qe,
              className: "reader-react-pdf-document",
              children: ve.map((F) => {
                if (vo.has(F))
                  return /* @__PURE__ */ p(
                    Ci,
                    {
                      pane: t,
                      pageNumber: F,
                      width: oe,
                      devicePixelRatio: U,
                      active: ie.has(F),
                      syncedMinHeight: (l == null ? void 0 : l.get(F)) || 0,
                      onMetrics: d,
                      cachedAspect: ne.get(F),
                      onAspectChange: ye,
                      sentinelRef: Ze(F),
                      regionHighlight: (bt == null ? void 0 : bt.box.page) === F ? bt : null,
                      regionTargets: yo.get(F),
                      onSelectRegion: b,
                      liveTranslationLayout: g == null ? void 0 : g.layoutByPage.get(F - 1),
                      liveTranslationPage: g == null ? void 0 : g.pagesByPage.get(F - 1),
                      showLiveTranslation: S
                    },
                    `${t}-${F}`
                  );
                const W = ne.get(F) ?? Vr, H = Math.max(120, Math.floor(oe * W)), ce = Math.max(H, Math.ceil((l == null ? void 0 : l.get(F)) || 0));
                return /* @__PURE__ */ p(
                  "div",
                  {
                    ref: Ze(F),
                    [Ke]: F,
                    [Ve]: t,
                    [vn]: H,
                    className: wn,
                    style: {
                      width: oe,
                      height: ce,
                      minHeight: ce
                    },
                    children: /* @__PURE__ */ p(
                      "div",
                      {
                        className: Nt,
                        style: { width: oe, height: H },
                        "aria-hidden": !0
                      }
                    )
                  },
                  `${t}-${F}`
                );
              })
            },
            M
          ) }) : null
        ]
      }
    );
  }
), ar = un(Fi), Gr = fn(null), Yr = fn(null);
function Oi({ value: e, hud: t, children: n }) {
  return /* @__PURE__ */ p(Gr.Provider, { value: e, children: /* @__PURE__ */ p(Yr.Provider, { value: t, children: n }) });
}
function gt() {
  return mn(Gr);
}
function $i() {
  return mn(Yr);
}
function ji({
  mode: e,
  compareMode: t,
  showSource: n,
  showTranslated: r,
  markdownSplit: a,
  overlayOnSource: o = !1
}) {
  if (o)
    return {
      mode: "source",
      compareMode: !1,
      showSource: !0,
      showTranslated: !1
    };
  const s = a && e === "compare";
  return {
    mode: s ? "source" : e,
    compareMode: t && !a,
    showSource: s ? !0 : n,
    showTranslated: s ? !1 : r
  };
}
function Ui(e, t, n = e * 2) {
  return t ? Math.min(e * 2, n) : e;
}
function Bi(e) {
  return e ? e.connection === "terminal" && e.jobStatus === "failed" ? e.pagesByPage.size > 0 ? `翻译已暂停，已保留 ${e.pagesByPage.size} 页译文` : "翻译已暂停，原始 PDF 仍可阅读" : e.connection === "terminal" && ["cancelled", "canceled"].includes(e.jobStatus) ? e.pagesByPage.size > 0 ? `翻译已取消，已保留 ${e.pagesByPage.size} 页译文` : "翻译已取消，原始 PDF 仍可阅读" : e.pagesByPage.size > 0 ? "" : e.connection === "unavailable" ? e.error || "实时译文暂不可用，原始 PDF 仍可阅读" : e.error ? e.error : e.layoutByPage.size === 0 ? "正在完成 OCR，译文将在这里逐页出现" : "版面已就绪，正在等待首个译文页面" : "";
}
function Hi(e) {
  const t = gt(), {
    markdownSplit: n = !1,
    assistantSplit: r = !1,
    liveTranslation: a,
    paneComposition: o
  } = e, s = (o == null ? void 0 : o.visibleMode) ?? e.mode ?? "compare", i = (o == null ? void 0 : o.compareMode) ?? e.compareMode ?? s === "compare", c = (o == null ? void 0 : o.showSource) ?? e.showSource ?? !0, l = (o == null ? void 0 : o.showTranslated) ?? e.showTranslated ?? (s === "compare" || s === "translated"), d = (o == null ? void 0 : o.overlayOnSource) ?? e.overlayOnSource ?? !1, u = e.bindShell ?? (t == null ? void 0 : t.bindShell), f = e.shellEl ?? (t == null ? void 0 : t.shellEl) ?? null, m = e.userZoom ?? (t == null ? void 0 : t.userZoom) ?? ht, v = e.shellWidth ?? (t == null ? void 0 : t.shellWidth) ?? 0, h = e.rowHeights ?? (t == null ? void 0 : t.rowHeights), y = e.mountSource ?? (t == null ? void 0 : t.mountSource) ?? !1, b = e.mountTranslated ?? (t == null ? void 0 : t.mountTranslated) ?? !1, g = e.sourceViewOnly ?? (t == null ? void 0 : t.sourceViewOnly) ?? !1, S = e.sourceUrl ?? (t == null ? void 0 : t.sourceUrl) ?? "", w = e.translatedUrl ?? (t == null ? void 0 : t.translatedUrl) ?? "", I = e.sourceFile ?? (t == null ? void 0 : t.sourceFile) ?? null, L = e.translatedFile ?? (t == null ? void 0 : t.translatedFile) ?? null, x = e.onMetrics ?? (t == null ? void 0 : t.onMetrics), D = e.onNumPagesChange ?? (t == null ? void 0 : t.onNumPagesChange), T = e.activeRegion ?? (t == null ? void 0 : t.activeRegion), M = e.regions ?? (t == null ? void 0 : t.regions) ?? [], R = e.readerMetadata ?? (t == null ? void 0 : t.readerMetadata), P = e.onSelectRegion ?? (t == null ? void 0 : t.onSelectRegion), E = ji({
    mode: s,
    compareMode: i,
    showSource: c,
    showTranslated: l,
    markdownSplit: n,
    overlayOnSource: d
  }), _ = Ui(
    v,
    n || r,
    typeof document > "u" ? v * 2 : document.documentElement.clientWidth
  );
  return /* @__PURE__ */ p(
    "div",
    {
      ref: u,
      className: ns,
      "data-reader-region-count": M.length,
      "data-reader-structured-region-count": M.filter(zr).length,
      "data-reader-metadata-ready": R ? "true" : "false",
      children: /* @__PURE__ */ z(
        "main",
        {
          className: `${ts} reader-mode-${E.mode}`,
          "data-reader-mode": n ? "markdown-split" : r ? "assistant-split" : s,
          children: [
            y ? /* @__PURE__ */ p(
              ar,
              {
                pane: "source",
                url: S,
                preloadedFile: I,
                userZoom: m,
                visible: E.showSource,
                scrollRoot: f,
                pageWidthOverride: _,
                rowHeights: E.compareMode ? h : void 0,
                onMetrics: x,
                emptyLabel: g ? "源文件不可用：该文档没有可读取的源 PDF。" : "暂无原文 PDF",
                onNumPagesChange: D,
                activeRegion: T,
                regions: M,
                readerMetadata: R,
                onSelectRegion: P,
                liveTranslation: d ? a : void 0,
                showLiveTranslation: d,
                liveTranslationPendingLabel: d ? Bi(a) : "",
                paneAction: e.sourcePaneAction
              }
            ) : null,
            b && !d ? /* @__PURE__ */ p(
              ar,
              {
                pane: "translated",
                url: w,
                preloadedFile: L,
                userZoom: m,
                visible: E.showTranslated,
                scrollRoot: f,
                pageWidthOverride: _,
                rowHeights: E.compareMode ? h : void 0,
                onMetrics: x,
                emptyLabel: "暂无译文 PDF",
                onNumPagesChange: D,
                activeRegion: T,
                regions: M,
                readerMetadata: R,
                onSelectRegion: P,
                liveTranslation: void 0,
                showLiveTranslation: !1
              }
            ) : null
          ]
        }
      )
    }
  );
}
const Wi = [
  { id: "source", label: "源文件", Icon: xr },
  { id: "compare", label: "对照", Icon: Nr },
  { id: "translated", label: "翻译文件", Icon: Ar }
];
function Ji(e) {
  return e.connection === "live" ? `实时译文 · ${e.pagesByPage.size} 页` : e.connection === "reconnecting" ? "实时译文 · 重连中" : e.connection === "unavailable" ? "实时译文 · 不可用" : e.connection === "terminal" ? e.jobStatus === "failed" ? "实时译文 · 已暂停" : e.jobStatus === "cancelled" || e.jobStatus === "canceled" ? "实时译文 · 已取消" : e.jobStatus === "succeeded" ? "实时译文 · 已完成" : "实时译文 · 已结束" : e.error || "实时译文 · 连接中";
}
function qi(e) {
  return e.id === "translated" ? e.sourceViewOnly : e.id === "compare" ? !e.documentReady || e.sourceViewOnly && !e.liveTranslationAvailable : !1;
}
function Ki(e) {
  const t = gt(), {
    mode: n,
    documentReady: r,
    onModeChange: a,
    liveTranslation: o = null
  } = e, s = e.sourceViewOnly ?? (t == null ? void 0 : t.sourceViewOnly) ?? !1, i = o ? Ji(o.state) : "";
  return /* @__PURE__ */ z("header", { className: "reader-workspace-bar", children: [
    o ? /* @__PURE__ */ z(
      "button",
      {
        type: "button",
        className: `reader-live-translation-toggle is-${o.state.connection}${o.visible ? " is-active" : ""}`,
        "aria-pressed": o.visible,
        "aria-label": o.visible ? "隐藏实时译文" : "显示实时译文",
        title: o.state.error || i,
        onClick: o.onToggle,
        children: [
          /* @__PURE__ */ p(jo, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 }),
          /* @__PURE__ */ p("span", { className: "reader-live-translation-toggle-label", children: i })
        ]
      }
    ) : null,
    /* @__PURE__ */ p("div", { className: "reader-workspace-tabs", role: "tablist", "aria-label": "阅读工作区", children: Wi.map(({ id: c, label: l, Icon: d }) => {
      const u = n === c, f = qi({
        id: c,
        documentReady: r,
        sourceViewOnly: s,
        liveTranslationAvailable: !!o
      });
      return /* @__PURE__ */ z(
        "button",
        {
          type: "button",
          className: `reader-workspace-tab${u ? " is-active" : ""}`,
          role: "tab",
          "aria-selected": u,
          "aria-label": l,
          title: f ? `${l} 需要文档任务` : l,
          disabled: f,
          onClick: () => a(c),
          children: [
            /* @__PURE__ */ p(d, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
            /* @__PURE__ */ p("span", { className: "reader-workspace-tab-label", children: l })
          ]
        },
        c
      );
    }) })
  ] });
}
const sr = [
  { id: "markdown", label: "Markdown", Icon: kr },
  { id: "ai", label: "AI 问答", Icon: gn }
];
function Vi(e) {
  const t = gt(), { active: n } = e, r = e.onSelect ?? (t == null ? void 0 : t.assistant.select) ?? (() => {
  }), a = e.onClose ?? (t == null ? void 0 : t.assistant.close) ?? (() => {
  });
  return n ? /* @__PURE__ */ z("header", { className: "reader-assistant-dock-header", children: [
    /* @__PURE__ */ p("div", { className: "reader-assistant-dock-tabs", role: "tablist", "aria-label": "阅读辅助面板", children: sr.map(({ id: o, label: s, Icon: i }) => {
      const c = n === o;
      return /* @__PURE__ */ z(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": c,
          className: `reader-assistant-dock-tab${c ? " is-active" : ""}`,
          onClick: () => r(o),
          children: [
            /* @__PURE__ */ p(i, { size: 15, strokeWidth: 2.15, "aria-hidden": !0 }),
            /* @__PURE__ */ p("span", { children: s })
          ]
        },
        o
      );
    }) }),
    /* @__PURE__ */ p(
      "button",
      {
        type: "button",
        className: "reader-assistant-dock-close",
        "aria-label": "关闭阅读辅助面板",
        title: "关闭辅助面板",
        onClick: a,
        children: /* @__PURE__ */ p(Ye, { size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
      }
    )
  ] }) : /* @__PURE__ */ p("nav", { className: "reader-assistant-rail", "aria-label": "阅读辅助工具", children: sr.map(({ id: o, label: s, Icon: i }) => /* @__PURE__ */ z(
    "button",
    {
      type: "button",
      className: "reader-assistant-rail-button",
      "aria-label": `打开${s}`,
      title: s,
      onClick: () => r(o),
      children: [
        /* @__PURE__ */ p(i, { size: 18, strokeWidth: 2, "aria-hidden": !0 }),
        /* @__PURE__ */ p("span", { children: s === "AI 问答" ? "AI" : "MD" })
      ]
    },
    o
  )) });
}
function Gi(e, t) {
  const n = getComputedStyle(e), r = parseFloat(n.fontSize);
  return t * r;
}
function Yi(e, t) {
  const n = getComputedStyle(e.ownerDocument.documentElement), r = parseFloat(n.fontSize);
  return t * r;
}
function Zi(e) {
  return e / 100 * window.innerHeight;
}
function Xi(e) {
  return e / 100 * window.innerWidth;
}
function Qi(e) {
  switch (typeof e) {
    case "number":
      return [e, "px"];
    case "string": {
      const t = parseFloat(e);
      return e.endsWith("%") ? [t, "%"] : e.endsWith("px") ? [t, "px"] : e.endsWith("rem") ? [t, "rem"] : e.endsWith("em") ? [t, "em"] : e.endsWith("vh") ? [t, "vh"] : e.endsWith("vw") ? [t, "vw"] : [t, "%"];
    }
  }
}
function ot({
  groupSize: e,
  panelElement: t,
  styleProp: n
}) {
  let r;
  const [a, o] = Qi(n);
  switch (o) {
    case "%": {
      r = a / 100 * e;
      break;
    }
    case "px": {
      r = a;
      break;
    }
    case "rem": {
      r = Yi(t, a);
      break;
    }
    case "em": {
      r = Gi(t, a);
      break;
    }
    case "vh": {
      r = Zi(a);
      break;
    }
    case "vw": {
      r = Xi(a);
      break;
    }
  }
  return r;
}
function de(e) {
  return parseFloat(e.toFixed(3));
}
function Ge({
  group: e
}) {
  const { orientation: t, panels: n } = e;
  return n.reduce((r, a) => (r += t === "horizontal" ? a.element.offsetWidth : a.element.offsetHeight, r), 0);
}
function on(e) {
  const { panels: t } = e, n = Ge({ group: e });
  return n === 0 ? t.map((r) => ({
    groupResizeBehavior: r.panelConstraints.groupResizeBehavior,
    collapsedSize: 0,
    collapsible: r.panelConstraints.collapsible === !0,
    defaultSize: void 0,
    disabled: r.panelConstraints.disabled,
    minSize: 0,
    maxSize: 100,
    panelId: r.id
  })) : t.map((r) => {
    const { element: a, panelConstraints: o } = r;
    let s = 0;
    if (o.collapsedSize !== void 0) {
      const d = ot({
        groupSize: n,
        panelElement: a,
        styleProp: o.collapsedSize
      });
      s = de(d / n * 100);
    }
    let i;
    if (o.defaultSize !== void 0) {
      const d = ot({
        groupSize: n,
        panelElement: a,
        styleProp: o.defaultSize
      });
      i = de(d / n * 100);
    }
    let c = 0;
    if (o.minSize !== void 0) {
      const d = ot({
        groupSize: n,
        panelElement: a,
        styleProp: o.minSize
      });
      c = de(d / n * 100);
    }
    let l = 100;
    if (o.maxSize !== void 0) {
      const d = ot({
        groupSize: n,
        panelElement: a,
        styleProp: o.maxSize
      });
      l = de(d / n * 100);
    }
    return {
      groupResizeBehavior: o.groupResizeBehavior,
      collapsedSize: s,
      collapsible: o.collapsible === !0,
      defaultSize: i,
      disabled: o.disabled,
      minSize: c,
      maxSize: l,
      panelId: r.id
    };
  });
}
function G(e, t = "Assertion error") {
  if (!e)
    throw Error(t);
}
function an(e, t) {
  return Array.from(t).sort(
    e === "horizontal" ? ec : tc
  );
}
function ec(e, t) {
  const n = e.element.offsetLeft - t.element.offsetLeft;
  return n !== 0 ? n : e.element.offsetWidth - t.element.offsetWidth;
}
function tc(e, t) {
  const n = e.element.offsetTop - t.element.offsetTop;
  return n !== 0 ? n : e.element.offsetHeight - t.element.offsetHeight;
}
function Zr(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.ELEMENT_NODE;
}
function Xr(e, t) {
  return {
    x: e.x >= t.left && e.x <= t.right ? 0 : Math.min(
      Math.abs(e.x - t.left),
      Math.abs(e.x - t.right)
    ),
    y: e.y >= t.top && e.y <= t.bottom ? 0 : Math.min(
      Math.abs(e.y - t.top),
      Math.abs(e.y - t.bottom)
    )
  };
}
function nc({
  orientation: e,
  rects: t,
  targetRect: n
}) {
  const r = {
    x: n.x + n.width / 2,
    y: n.y + n.height / 2
  };
  let a, o = Number.MAX_VALUE;
  for (const s of t) {
    const { x: i, y: c } = Xr(r, s), l = e === "horizontal" ? i : c;
    l < o && (o = l, a = s);
  }
  return G(a, "No rect found"), a;
}
let wt;
function rc() {
  return wt === void 0 && (typeof matchMedia == "function" ? wt = !!matchMedia("(pointer:coarse)").matches : wt = !1), wt;
}
function Qr(e) {
  const { element: t, orientation: n, panels: r, separators: a } = e, o = an(
    n,
    Array.from(t.children).filter(Zr).map((v) => ({ element: v }))
  ).map(({ element: v }) => v), s = [];
  let i = !1, c = !1, l = -1, d = -1, u = 0, f, m = [];
  {
    let v = -1;
    for (const h of o)
      h.hasAttribute("data-panel") && (v++, h.hasAttribute("data-disabled") || (u++, l === -1 && (l = v), d = v));
  }
  if (u > 1) {
    let v = -1;
    for (const h of o)
      if (h.hasAttribute("data-panel")) {
        v++;
        const y = r.find(
          (b) => b.element === h
        );
        if (y) {
          if (f) {
            const b = f.element.getBoundingClientRect(), g = h.getBoundingClientRect();
            let S;
            if (c) {
              const w = n === "horizontal" ? new DOMRect(
                b.right,
                b.top,
                0,
                b.height
              ) : new DOMRect(
                b.left,
                b.bottom,
                b.width,
                0
              ), I = n === "horizontal" ? new DOMRect(g.left, g.top, 0, g.height) : new DOMRect(g.left, g.top, g.width, 0);
              switch (m.length) {
                case 0: {
                  S = [
                    w,
                    I
                  ];
                  break;
                }
                case 1: {
                  const L = m[0], x = nc({
                    orientation: n,
                    rects: [b, g],
                    targetRect: L.element.getBoundingClientRect()
                  });
                  S = [
                    L,
                    x === b ? I : w
                  ];
                  break;
                }
                default: {
                  S = m;
                  break;
                }
              }
            } else
              m.length ? S = m : S = [
                n === "horizontal" ? new DOMRect(
                  b.right,
                  g.top,
                  g.left - b.right,
                  g.height
                ) : new DOMRect(
                  g.left,
                  b.bottom,
                  g.width,
                  g.top - b.bottom
                )
              ];
            for (const w of S) {
              let I = "width" in w ? w : w.element.getBoundingClientRect();
              const L = rc() ? e.resizeTargetMinimumSize.coarse : e.resizeTargetMinimumSize.fine;
              if (I.width < L) {
                const D = L - I.width;
                I = new DOMRect(
                  I.x - D / 2,
                  I.y,
                  I.width + D,
                  I.height
                );
              }
              if (I.height < L) {
                const D = L - I.height;
                I = new DOMRect(
                  I.x,
                  I.y - D / 2,
                  I.width,
                  I.height + D
                );
              }
              const x = v <= l || v > d;
              !i && !x && s.push({
                group: e,
                groupSize: Ge({ group: e }),
                panels: [f, y],
                separator: "width" in w ? void 0 : w,
                rect: I
              }), i = !1;
            }
          }
          c = !1, f = y, m = [];
        }
      } else if (h.hasAttribute("data-separator")) {
        h.ariaDisabled !== null && (i = !0);
        const y = a.find(
          (b) => b.element === h
        );
        y ? m.push(y) : (f = void 0, m = []);
      } else
        c = !0;
  }
  return s;
}
var xe;
class eo {
  constructor() {
    On(this, xe, {});
  }
  addListener(t, n) {
    const r = et(this, xe)[t];
    return r === void 0 ? et(this, xe)[t] = [n] : r.includes(n) || r.push(n), () => {
      this.removeListener(t, n);
    };
  }
  emit(t, n) {
    const r = et(this, xe)[t];
    if (r !== void 0)
      if (r.length === 1)
        r[0].call(null, n);
      else {
        let a = !1, o = null;
        const s = Array.from(r);
        for (let i = 0; i < s.length; i++) {
          const c = s[i];
          try {
            c.call(null, n);
          } catch (l) {
            o === null && (a = !0, o = l);
          }
        }
        if (a)
          throw o;
      }
  }
  removeAllListeners() {
    $n(this, xe, {});
  }
  removeListener(t, n) {
    const r = et(this, xe)[t];
    if (r !== void 0) {
      const a = r.indexOf(n);
      a >= 0 && r.splice(a, 1);
    }
  }
}
xe = new WeakMap();
let Je = {
  cursorFlags: 0,
  state: "inactive"
};
const Pn = new eo();
function Le() {
  return Je;
}
function oc(e) {
  return Pn.addListener("change", e);
}
function ac(e) {
  const t = Je, n = { ...Je };
  n.cursorFlags = e, Je = n, Pn.emit("change", {
    prev: t,
    next: n
  });
}
function qe(e) {
  const t = Je;
  Je = e, Pn.emit("change", {
    prev: t,
    next: e
  });
}
const sc = (e) => e, Jt = () => {
}, to = 1, no = 2, ro = 4, oo = 8, ir = 3, cr = 12;
let St;
function lr() {
  return St === void 0 && (St = !1, typeof window < "u" && (window.navigator.userAgent.includes("Chrome") || window.navigator.userAgent.includes("Firefox")) && (St = !0)), St;
}
function ic({
  cursorFlags: e,
  groups: t,
  state: n
}) {
  let r = 0, a = 0;
  switch (n) {
    case "active":
    case "hover":
      t.forEach((o) => {
        if (!o.mutableState.disableCursor)
          switch (o.orientation) {
            case "horizontal": {
              r++;
              break;
            }
            case "vertical": {
              a++;
              break;
            }
          }
      });
  }
  if (!(r === 0 && a === 0)) {
    switch (n) {
      case "active": {
        if (e && lr()) {
          const o = (e & to) !== 0, s = (e & no) !== 0, i = (e & ro) !== 0, c = (e & oo) !== 0;
          if (o)
            return i ? "se-resize" : c ? "ne-resize" : "e-resize";
          if (s)
            return i ? "sw-resize" : c ? "nw-resize" : "w-resize";
          if (i)
            return "s-resize";
          if (c)
            return "n-resize";
        }
        break;
      }
    }
    return lr() ? r > 0 && a > 0 ? "move" : r > 0 ? "ew-resize" : "ns-resize" : r > 0 && a > 0 ? "grab" : r > 0 ? "col-resize" : "row-resize";
  }
}
const ur = /* @__PURE__ */ new WeakMap();
function Rn(e) {
  if (e.defaultView === null || e.defaultView === void 0)
    return;
  let { prevStyle: t, styleSheet: n } = ur.get(e) ?? {};
  n === void 0 && (n = new e.defaultView.CSSStyleSheet(), e.adoptedStyleSheets && (Object.isExtensible(e.adoptedStyleSheets) ? e.adoptedStyleSheets.push(n) : e.adoptedStyleSheets = [
    ...e.adoptedStyleSheets,
    n
  ]));
  const r = Le();
  switch (r.state) {
    case "active":
    case "hover": {
      const a = ic({
        cursorFlags: r.cursorFlags,
        groups: r.hitRegions.map((s) => s.group),
        state: r.state
      }), o = `*, *:hover {cursor: ${a} !important; }`;
      if (t === o)
        return;
      t = o, a ? n.cssRules.length === 0 ? n.insertRule(o) : n.replaceSync(o) : n.cssRules.length === 1 && n.deleteRule(0);
      break;
    }
    case "inactive": {
      t = void 0, n.cssRules.length === 1 && n.deleteRule(0);
      break;
    }
  }
  ur.set(e, {
    prevStyle: t,
    styleSheet: n
  });
}
let Se = /* @__PURE__ */ new Map();
const ao = new eo();
function cc(e) {
  Se = new Map(Se), Se.delete(e);
}
function dr(e, t) {
  for (const [n] of Se)
    if (n.id === e)
      return n;
}
function Ne(e, t) {
  for (const [n, r] of Se)
    if (n.id === e)
      return r;
  if (t)
    throw Error(`Could not find data for Group with id ${e}`);
}
function Fe() {
  return Se;
}
function Tn(e, t) {
  return ao.addListener("groupChange", (n) => {
    n.group.id === e && t(n);
  });
}
function Me(e, t, n) {
  const r = Se.get(e);
  Se = new Map(Se), Se.set(e, t), ao.emit("groupChange", {
    group: e,
    isUserInteraction: (n == null ? void 0 : n.isUserInteraction) === !0,
    prev: r,
    next: t
  });
}
function so(e) {
  const t = Le();
  let n = !1;
  switch (t.state) {
    case "active":
      qe({
        cursorFlags: 0,
        state: "inactive"
      }), t.hitRegions.length > 0 && (Rn(e), n = !0, t.hitRegions.forEach((r) => {
        const a = Ne(r.group.id, !0);
        Me(r.group, a, {
          isUserInteraction: !0
        });
      }));
  }
  return n;
}
function fr(e) {
  e.defaultPrevented || so(e.currentTarget);
}
function lc(e, t, n) {
  let r, a = {
    x: 1 / 0,
    y: 1 / 0
  };
  for (const o of t) {
    const s = Xr(n, o.rect);
    switch (e) {
      case "horizontal": {
        s.x <= a.x && (r = o, a = s);
        break;
      }
      case "vertical": {
        s.y <= a.y && (r = o, a = s);
        break;
      }
    }
  }
  return r ? {
    distance: a,
    hitRegion: r
  } : void 0;
}
function uc(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
function dc(e, t) {
  if (e === t) throw new Error("Cannot compare node with itself");
  const n = {
    a: hr(e),
    b: hr(t)
  };
  let r;
  for (; n.a.at(-1) === n.b.at(-1); )
    r = n.a.pop(), n.b.pop();
  G(
    r,
    "Stacking order can only be calculated for elements with a common ancestor"
  );
  const a = {
    a: pr(mr(n.a)),
    b: pr(mr(n.b))
  };
  if (a.a === a.b) {
    const o = r.childNodes, s = {
      a: n.a.at(-1),
      b: n.b.at(-1)
    };
    let i = o.length;
    for (; i--; ) {
      const c = o[i];
      if (c === s.a) return 1;
      if (c === s.b) return -1;
    }
  }
  return Math.sign(a.a - a.b);
}
const fc = /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;
function mc(e) {
  const t = getComputedStyle(io(e) ?? e).display;
  return t === "flex" || t === "inline-flex";
}
function pc(e) {
  const t = getComputedStyle(e);
  return !!(t.position === "fixed" || t.zIndex !== "auto" && (t.position !== "static" || mc(e)) || +t.opacity < 1 || "transform" in t && t.transform !== "none" || "webkitTransform" in t && t.webkitTransform !== "none" || "mixBlendMode" in t && t.mixBlendMode !== "normal" || "filter" in t && t.filter !== "none" || "webkitFilter" in t && t.webkitFilter !== "none" || "isolation" in t && t.isolation === "isolate" || fc.test(t.willChange) || t.webkitOverflowScrolling === "touch");
}
function mr(e) {
  let t = e.length;
  for (; t--; ) {
    const n = e[t];
    if (G(n, "Missing node"), pc(n)) return n;
  }
  return null;
}
function pr(e) {
  return e && Number(getComputedStyle(e).zIndex) || 0;
}
function hr(e) {
  const t = [];
  for (; e; )
    t.push(e), e = io(e);
  return t;
}
function io(e) {
  const { parentNode: t } = e;
  return uc(t) ? t.host : t;
}
function hc(e, t) {
  return e.x < t.x + t.width && e.x + e.width > t.x && e.y < t.y + t.height && e.y + e.height > t.y;
}
function gc({
  groupElement: e,
  hitRegion: t,
  pointerEventTarget: n
}) {
  if (!Zr(n) || n.contains(e) || e.contains(n))
    return !0;
  if (dc(n, e) > 0) {
    let r = n;
    for (; r; ) {
      if (r.contains(e))
        return !0;
      if (hc(r.getBoundingClientRect(), t))
        return !1;
      r = r.parentElement;
    }
  }
  return !0;
}
function Mn(e, t) {
  const n = [];
  return t.forEach((r, a) => {
    if (a.disabled)
      return;
    const o = Qr(a), s = lc(a.orientation, o, {
      x: e.clientX,
      y: e.clientY
    });
    s && s.distance.x <= 0 && s.distance.y <= 0 && gc({
      groupElement: a.element,
      hitRegion: s.hitRegion.rect,
      pointerEventTarget: e.target
    }) && n.push(s.hitRegion);
  }), n;
}
function bc(e, t) {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n++)
    if (e[n] != t[n])
      return !1;
  return !0;
}
function le(e, t, n = 0) {
  return Math.abs(de(e) - de(t)) <= n;
}
function we(e, t) {
  return le(e, t) ? 0 : e > t ? 1 : -1;
}
function He({
  overrideDisabledPanels: e,
  panelConstraints: t,
  prevSize: n,
  size: r
}) {
  const {
    collapsedSize: a = 0,
    collapsible: o,
    disabled: s,
    maxSize: i = 100,
    minSize: c = 0
  } = t;
  if (s && !e)
    return n;
  if (we(r, c) < 0)
    if (o) {
      const l = (a + c) / 2;
      we(r, l) < 0 ? r = a : r = c;
    } else
      r = c;
  return r = Math.min(i, r), r = de(r), r;
}
function ft({
  delta: e,
  initialLayout: t,
  panelConstraints: n,
  pivotIndices: r,
  prevLayout: a,
  trigger: o
}) {
  if (le(e, 0))
    return t;
  const s = o === "imperative-api", i = Object.values(t), c = Object.values(a), l = [...i], [d, u] = r;
  G(d != null, "Invalid first pivot index"), G(u != null, "Invalid second pivot index");
  let f = 0;
  switch (o) {
    case "keyboard": {
      {
        const h = e < 0 ? u : d, y = n[h];
        G(
          y,
          `Panel constraints not found for index ${h}`
        );
        const {
          collapsedSize: b = 0,
          collapsible: g,
          minSize: S = 0
        } = y;
        if (g) {
          const w = i[h];
          if (G(
            w != null,
            `Previous layout not found for panel index ${h}`
          ), le(w, b)) {
            const I = S - w;
            we(I, Math.abs(e)) > 0 && (e = e < 0 ? 0 - I : I);
          }
        }
      }
      {
        const h = e < 0 ? d : u, y = n[h];
        G(
          y,
          `No panel constraints found for index ${h}`
        );
        const {
          collapsedSize: b = 0,
          collapsible: g,
          minSize: S = 0
        } = y;
        if (g) {
          const w = i[h];
          if (G(
            w != null,
            `Previous layout not found for panel index ${h}`
          ), le(w, S)) {
            const I = w - b;
            we(I, Math.abs(e)) > 0 && (e = e < 0 ? 0 - I : I);
          }
        }
      }
      break;
    }
    default: {
      const h = e < 0 ? u : d, y = n[h];
      G(
        y,
        `Panel constraints not found for index ${h}`
      );
      const b = i[h], { collapsible: g, collapsedSize: S, minSize: w } = y;
      if (g && we(b, w) < 0)
        if (e > 0) {
          const I = w - S, L = I / 2, x = b + e;
          we(x, w) < 0 && (e = we(e, L) <= 0 ? 0 : I);
        } else {
          const I = w - S, L = 100 - I / 2, x = b - e;
          we(x, w) < 0 && (e = we(100 + e, L) > 0 ? 0 : -I);
        }
      break;
    }
  }
  {
    const h = e < 0 ? 1 : -1;
    let y = e < 0 ? u : d, b = 0;
    for (; ; ) {
      const S = i[y];
      G(
        S != null,
        `Previous layout not found for panel index ${y}`
      );
      const w = He({
        overrideDisabledPanels: s,
        panelConstraints: n[y],
        prevSize: S,
        size: 100
      }) - S;
      if (b += w, y += h, y < 0 || y >= n.length)
        break;
    }
    const g = Math.min(Math.abs(e), Math.abs(b));
    e = e < 0 ? 0 - g : g;
  }
  {
    let h = e < 0 ? d : u;
    for (; h >= 0 && h < n.length; ) {
      const y = Math.abs(e) - Math.abs(f), b = i[h];
      G(
        b != null,
        `Previous layout not found for panel index ${h}`
      );
      const g = b - y, S = He({
        overrideDisabledPanels: s,
        panelConstraints: n[h],
        prevSize: b,
        size: g
      });
      if (!le(b, S) && (f += b - S, l[h] = S, f.toFixed(3).localeCompare(Math.abs(e).toFixed(3), void 0, {
        numeric: !0
      }) >= 0))
        break;
      e < 0 ? h-- : h++;
    }
  }
  if (bc(c, l))
    return a;
  {
    const h = e < 0 ? u : d, y = i[h];
    G(
      y != null,
      `Previous layout not found for panel index ${h}`
    );
    const b = y + f, g = He({
      overrideDisabledPanels: s,
      panelConstraints: n[h],
      prevSize: y,
      size: b
    });
    if (l[h] = g, !le(g, b)) {
      let S = b - g, w = e < 0 ? u : d;
      for (; w >= 0 && w < n.length; ) {
        const I = l[w];
        G(
          I != null,
          `Previous layout not found for panel index ${w}`
        );
        const L = I + S, x = He({
          overrideDisabledPanels: s,
          panelConstraints: n[w],
          prevSize: I,
          size: L
        });
        if (le(I, x) || (S -= x - I, l[w] = x), le(S, 0))
          break;
        e > 0 ? w-- : w++;
      }
    }
  }
  const m = Object.values(l).reduce(
    (h, y) => y + h,
    0
  );
  if (!le(m, 100, 0.1))
    return a;
  const v = Object.keys(a);
  return l.reduce((h, y, b) => (h[v[b]] = y, h), {});
}
function ze(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (t[n] === void 0 || we(e[n], t[n]) !== 0)
      return !1;
  return !0;
}
function _e({
  layout: e,
  panelConstraints: t
}) {
  const n = Object.values(e), r = [...n], a = r.reduce(
    (i, c) => i + c,
    0
  );
  if (r.length !== t.length)
    throw Error(
      `Invalid ${t.length} panel layout: ${r.map((i) => `${i}%`).join(", ")}`
    );
  if (!le(a, 100) && r.length > 0)
    for (let i = 0; i < t.length; i++) {
      const c = r[i];
      G(c != null, `No layout data found for index ${i}`);
      const l = 100 / a * c;
      r[i] = l;
    }
  let o = 0;
  for (let i = 0; i < t.length; i++) {
    const c = n[i];
    G(c != null, `No layout data found for index ${i}`);
    const l = r[i];
    G(l != null, `No layout data found for index ${i}`);
    const d = He({
      overrideDisabledPanels: !0,
      panelConstraints: t[i],
      prevSize: c,
      size: l
    });
    l != d && (o += l - d, r[i] = d);
  }
  if (!le(o, 0))
    for (let i = 0; i < t.length; i++) {
      const c = r[i];
      G(c != null, `No layout data found for index ${i}`);
      const l = c + o, d = He({
        overrideDisabledPanels: !0,
        panelConstraints: t[i],
        prevSize: c,
        size: l
      });
      if (c !== d && (o -= d - c, r[i] = d, le(o, 0)))
        break;
    }
  const s = Object.keys(e);
  return r.reduce((i, c, l) => (i[s[l]] = c, i), {});
}
function co({
  groupId: e,
  panelId: t
}) {
  const n = () => {
    const c = Fe();
    for (const [
      l,
      {
        defaultLayoutDeferred: d,
        derivedPanelConstraints: u,
        layout: f,
        groupSize: m,
        separatorToPanels: v
      }
    ] of c)
      if (l.id === e)
        return {
          defaultLayoutDeferred: d,
          derivedPanelConstraints: u,
          group: l,
          groupSize: m,
          layout: f,
          separatorToPanels: v
        };
    throw Error(`Group ${e} not found`);
  }, r = () => {
    const c = n().derivedPanelConstraints.find(
      (l) => l.panelId === t
    );
    if (c !== void 0)
      return c;
    throw Error(`Panel constraints not found for Panel ${t}`);
  }, a = () => {
    const c = n().group.panels.find((l) => l.id === t);
    if (c !== void 0)
      return c;
    throw Error(`Layout not found for Panel ${t}`);
  }, o = () => {
    const c = n().layout[t];
    if (c !== void 0)
      return c;
    throw Error(`Layout not found for Panel ${t}`);
  }, s = ({
    nextSize: c,
    panels: l,
    prevLayout: d,
    derivedPanelConstraints: u
  }) => {
    const f = o(), m = l.findIndex((y) => y.id === t), v = m === 0, h = m === l.length - 1;
    if (h && c < f && (v || l.slice(0, m).every((y, b) => {
      const g = u[b];
      return (g == null ? void 0 : g.collapsible) && le(g.collapsedSize, d[g.panelId]);
    }))) {
      const y = l.slice(0, m).reduce((b, g) => b + d[g.id], 0);
      return {
        ...d,
        [t]: de(100 - y)
      };
    }
    return ft({
      delta: h ? f - c : c - f,
      initialLayout: d,
      panelConstraints: u,
      pivotIndices: h ? [m - 1, m] : [m, m + 1],
      prevLayout: d,
      trigger: "imperative-api"
    });
  }, i = (c) => {
    const l = o();
    if (c === l)
      return;
    const {
      defaultLayoutDeferred: d,
      derivedPanelConstraints: u,
      group: f,
      groupSize: m,
      layout: v,
      separatorToPanels: h
    } = n(), y = s({
      nextSize: c,
      panels: f.panels,
      prevLayout: v,
      derivedPanelConstraints: u
    }), b = _e({
      layout: y,
      panelConstraints: u
    });
    ze(v, b) || Me(f, {
      defaultLayoutDeferred: d,
      derivedPanelConstraints: u,
      groupSize: m,
      layout: b,
      separatorToPanels: h
    });
  };
  return {
    collapse: () => {
      const { collapsible: c, collapsedSize: l } = r(), { mutableValues: d } = a(), u = o();
      c && u !== l && (d.expandToSize = u, i(l));
    },
    expand: () => {
      const { collapsible: c, collapsedSize: l, minSize: d } = r(), { mutableValues: u } = a(), f = o();
      if (c && f === l) {
        let m = u.expandToSize ?? d;
        m === 0 && (m = 1), i(m);
      }
    },
    getSize: () => {
      const { group: c } = n(), l = o(), { element: d } = a(), u = c.orientation === "horizontal" ? d.offsetWidth : d.offsetHeight;
      return {
        asPercentage: l,
        inPixels: u
      };
    },
    isCollapsed: () => {
      const { collapsible: c, collapsedSize: l } = r(), d = o();
      return c && le(l, d);
    },
    resize: (c) => {
      const { group: l } = n(), { element: d } = a(), u = Ge({ group: l }), f = ot({
        groupSize: u,
        panelElement: d,
        styleProp: c
      }), m = de(f / u * 100);
      i(m);
    }
  };
}
function gr(e) {
  if (e.defaultPrevented)
    return;
  const t = Fe();
  Mn(e, t).forEach((n) => {
    if (n.separator && !n.separator.disableDoubleClick) {
      const r = n.panels.find(
        (a) => a.panelConstraints.defaultSize !== void 0
      );
      if (r) {
        const a = r.panelConstraints.defaultSize, o = co({
          groupId: n.group.id,
          panelId: r.id
        });
        o && a !== void 0 && (o.resize(a), e.preventDefault());
      }
    }
  });
}
function Tt(e) {
  const t = Fe();
  for (const [n] of t)
    if (n.separators.some(
      (r) => r.element === e
    ))
      return n;
  throw Error("Could not find parent Group for separator element");
}
function lo({
  groupId: e
}) {
  const t = () => {
    const n = Fe();
    for (const [r, a] of n)
      if (r.id === e)
        return { group: r, ...a };
    throw Error(`Could not find Group with id "${e}"`);
  };
  return {
    getLayout() {
      const { defaultLayoutDeferred: n, layout: r } = t();
      return n ? {} : r;
    },
    setLayout(n) {
      const {
        defaultLayoutDeferred: r,
        derivedPanelConstraints: a,
        group: o,
        groupSize: s,
        layout: i,
        separatorToPanels: c
      } = t(), l = _e({
        layout: n,
        panelConstraints: a
      });
      return r ? i : (ze(i, l) || Me(o, {
        defaultLayoutDeferred: r,
        derivedPanelConstraints: a,
        groupSize: s,
        layout: l,
        separatorToPanels: c
      }), l);
    }
  };
}
function ke(e, t) {
  const n = Tt(e), r = Ne(n.id, !0), a = n.separators.find(
    (d) => d.element === e
  );
  G(a, "Matching separator not found");
  const o = r.separatorToPanels.get(a);
  G(o, "Matching panels not found");
  const s = o.map((d) => n.panels.indexOf(d)), i = lo({ groupId: n.id }).getLayout(), c = ft({
    delta: t,
    initialLayout: i,
    panelConstraints: r.derivedPanelConstraints,
    pivotIndices: s,
    prevLayout: i,
    trigger: "keyboard"
  }), l = _e({
    layout: c,
    panelConstraints: r.derivedPanelConstraints
  });
  ze(i, l) || Me(
    n,
    {
      defaultLayoutDeferred: r.defaultLayoutDeferred,
      derivedPanelConstraints: r.derivedPanelConstraints,
      groupSize: r.groupSize,
      layout: l,
      separatorToPanels: r.separatorToPanels
    },
    // Keyboard resizes (arrow keys, Home/End, Enter collapse/expand) originate
    // from a real DOM event on the separator, so they are user interactions
    // just like pointer drags. This function is only reached from
    // onDocumentKeyDown. See #716.
    { isUserInteraction: !0 }
  );
}
function br(e) {
  if (e.defaultPrevented)
    return;
  const t = e.currentTarget, n = Tt(t);
  if (!n.disabled)
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault(), n.orientation === "vertical" && ke(t, 5);
        break;
      }
      case "ArrowLeft": {
        e.preventDefault(), n.orientation === "horizontal" && ke(t, -5);
        break;
      }
      case "ArrowRight": {
        e.preventDefault(), n.orientation === "horizontal" && ke(t, 5);
        break;
      }
      case "ArrowUp": {
        e.preventDefault(), n.orientation === "vertical" && ke(t, -5);
        break;
      }
      case "End": {
        e.preventDefault(), ke(t, 100);
        break;
      }
      case "Enter": {
        e.preventDefault();
        const r = Tt(t), a = Ne(r.id, !0), { derivedPanelConstraints: o, layout: s, separatorToPanels: i } = a, c = r.separators.find(
          (f) => f.element === t
        );
        G(c, "Matching separator not found");
        const l = i.get(c);
        G(l, "Matching panels not found");
        const d = l[0], u = o.find(
          (f) => f.panelId === d.id
        );
        if (G(u, "Panel metadata not found"), u.collapsible) {
          const f = s[d.id], m = u.collapsedSize === f ? r.mutableState.expandedPanelSizes[d.id] ?? u.minSize : u.collapsedSize;
          ke(t, m - f);
        }
        break;
      }
      case "F6": {
        e.preventDefault();
        const r = Tt(t).separators.map(
          (s) => s.element
        ), a = Array.from(r).findIndex(
          (s) => s === e.currentTarget
        );
        G(a !== null, "Index not found");
        const o = e.shiftKey ? a > 0 ? a - 1 : r.length - 1 : a + 1 < r.length ? a + 1 : 0;
        r[o].focus({
          preventScroll: !0
        });
        break;
      }
      case "Home": {
        e.preventDefault(), ke(t, -100);
        break;
      }
    }
}
function yr(e) {
  if (e.defaultPrevented || e.pointerType === "mouse" && e.button > 0)
    return;
  const t = Fe(), n = Mn(e, t), r = /* @__PURE__ */ new Map();
  let a = !1;
  n.forEach((o) => {
    o.separator && (a || (a = !0, o.separator.element.focus({
      // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#browser_compatibility
      focusVisible: !1,
      preventScroll: !0
    })));
    const s = t.get(o.group);
    s && r.set(o.group, s.layout);
  }), qe({
    cursorFlags: 0,
    hitRegions: n,
    initialLayoutMap: r,
    pointerDownAtPoint: { x: e.clientX, y: e.clientY },
    state: "active"
  }), n.length && e.preventDefault();
}
function uo({
  document: e,
  event: t,
  hitRegions: n,
  initialLayoutMap: r,
  mountedGroups: a,
  pointerDownAtPoint: o,
  prevCursorFlags: s
}) {
  let i = 0;
  n.forEach((l) => {
    const { group: d, groupSize: u } = l, { orientation: f, panels: m } = d, { disableCursor: v } = d.mutableState;
    let h = 0;
    o ? f === "horizontal" ? h = (t.clientX - o.x) / u * 100 : h = (t.clientY - o.y) / u * 100 : f === "horizontal" ? h = t.clientX < 0 ? -100 : 100 : h = t.clientY < 0 ? -100 : 100;
    const y = r.get(d), b = a.get(d);
    if (!y || !b)
      return;
    const {
      defaultLayoutDeferred: g,
      derivedPanelConstraints: S,
      groupSize: w,
      layout: I,
      separatorToPanels: L
    } = b;
    if (S && I && L) {
      const x = ft({
        delta: h,
        initialLayout: y,
        panelConstraints: S,
        pivotIndices: l.panels.map((D) => m.indexOf(D)),
        prevLayout: I,
        trigger: "mouse-or-touch"
      });
      if (ze(x, I)) {
        if (h !== 0 && !v)
          switch (f) {
            case "horizontal": {
              i |= h < 0 ? to : no;
              break;
            }
            case "vertical": {
              i |= h < 0 ? ro : oo;
              break;
            }
          }
      } else
        Me(l.group, {
          defaultLayoutDeferred: g,
          derivedPanelConstraints: S,
          groupSize: w,
          layout: x,
          separatorToPanels: L
        });
    }
  });
  let c = 0;
  t.movementX === 0 ? c |= s & ir : c |= i & ir, t.movementY === 0 ? c |= s & cr : c |= i & cr, ac(c), Rn(e);
}
function vr(e) {
  const t = Fe(), n = Le();
  switch (n.state) {
    case "active":
      uo({
        document: e.currentTarget,
        event: e,
        hitRegions: n.hitRegions,
        initialLayoutMap: n.initialLayoutMap,
        mountedGroups: t,
        prevCursorFlags: n.cursorFlags
      });
  }
}
function wr(e) {
  var r, a;
  if (e.defaultPrevented)
    return;
  const t = Le(), n = Fe();
  switch (t.state) {
    case "active": {
      if (
        // Skip this check for "pointerleave" events, else Firefox triggers a false positive (see #514)
        e.buttons === 0
      ) {
        qe({
          cursorFlags: 0,
          state: "inactive"
        }), t.hitRegions.forEach((o) => {
          const s = Ne(o.group.id, !0);
          Me(o.group, s, {
            isUserInteraction: !0
          });
        });
        return;
      }
      for (const o of t.hitRegions)
        if (o.separator) {
          const { element: s } = o.separator;
          (r = s.hasPointerCapture) != null && r.call(s, e.pointerId) || ((a = s.setPointerCapture) == null || a.call(s, e.pointerId));
        }
      uo({
        document: e.currentTarget,
        event: e,
        hitRegions: t.hitRegions,
        initialLayoutMap: t.initialLayoutMap,
        mountedGroups: n,
        pointerDownAtPoint: t.pointerDownAtPoint,
        prevCursorFlags: t.cursorFlags
      });
      break;
    }
    default: {
      const o = Mn(e, n);
      o.length === 0 ? t.state !== "inactive" && qe({
        cursorFlags: 0,
        state: "inactive"
      }) : qe({
        cursorFlags: 0,
        hitRegions: o,
        state: "hover"
      }), Rn(e.currentTarget);
      break;
    }
  }
}
function Sr(e) {
  if (e.relatedTarget instanceof HTMLIFrameElement)
    switch (Le().state) {
      case "hover":
        qe({
          cursorFlags: 0,
          state: "inactive"
        });
    }
}
function Ir(e) {
  e.defaultPrevented || e.pointerType === "mouse" && e.button > 0 || so(e.currentTarget) && e.preventDefault();
}
function Pr(e) {
  let t = 0, n = 0;
  const r = {};
  for (const o of e)
    if (o.defaultSize !== void 0) {
      t++;
      const s = de(o.defaultSize);
      n += s, r[o.panelId] = s;
    } else
      r[o.panelId] = void 0;
  const a = e.length - t;
  if (a !== 0) {
    const o = de((100 - n) / a);
    for (const s of e)
      s.defaultSize === void 0 && (r[s.panelId] = o);
  }
  return r;
}
function yc(e, t, n) {
  if (!n[0])
    return;
  const r = e.panels.find((c) => c.element === t);
  if (!r || !r.onResize)
    return;
  const a = Ge({ group: e }), o = e.orientation === "horizontal" ? r.element.offsetWidth : r.element.offsetHeight, s = r.mutableValues.prevSize, i = {
    asPercentage: de(o / a * 100),
    inPixels: o
  };
  r.mutableValues.prevSize = i, r.onResize(i, r.id, s);
}
function vc(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (e[n] !== t[n])
      return !1;
  return !0;
}
function wc({
  group: e,
  nextGroupSize: t,
  prevGroupSize: n,
  prevLayout: r
}) {
  if (n <= 0 || t <= 0 || n === t)
    return r;
  let a = 0, o = 0, s = !1;
  const i = /* @__PURE__ */ new Map(), c = [];
  for (const u of e.panels) {
    const f = r[u.id] ?? 0;
    switch (u.panelConstraints.groupResizeBehavior) {
      case "preserve-pixel-size": {
        s = !0;
        const m = f / 100 * n, v = de(
          m / t * 100
        );
        i.set(u.id, v), a += v;
        break;
      }
      case "preserve-relative-size":
      default: {
        c.push(u.id), o += f;
        break;
      }
    }
  }
  if (!s || c.length === 0)
    return r;
  const l = 100 - a, d = { ...r };
  if (i.forEach((u, f) => {
    d[f] = u;
  }), o > 0)
    for (const u of c) {
      const f = r[u] ?? 0;
      d[u] = de(
        f / o * l
      );
    }
  else {
    const u = de(
      l / c.length
    );
    for (const f of c)
      d[f] = u;
  }
  return d;
}
function Sc(e, t) {
  const n = e.map((a) => a.id), r = Object.keys(t);
  if (n.length !== r.length)
    return !1;
  for (const a of n)
    if (!r.includes(a))
      return !1;
  return !0;
}
const je = /* @__PURE__ */ new Map();
function Ic(e) {
  let t = !0;
  G(
    e.element.ownerDocument.defaultView,
    "Cannot register an unmounted Group"
  );
  const n = e.element.ownerDocument.defaultView.ResizeObserver, r = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), o = new n((v) => {
    for (const h of v) {
      const { borderBoxSize: y, target: b } = h;
      if (b === e.element) {
        if (t) {
          const g = Ge({ group: e });
          if (g === 0)
            return;
          const S = Ne(e.id);
          if (!S)
            return;
          const w = on(e), I = S.defaultLayoutDeferred ? Pr(w) : S.layout, L = wc({
            group: e,
            nextGroupSize: g,
            prevGroupSize: S.groupSize,
            prevLayout: I
          }), x = _e({
            layout: L,
            panelConstraints: w
          });
          if (!S.defaultLayoutDeferred && ze(S.layout, x) && vc(
            S.derivedPanelConstraints,
            w
          ) && S.groupSize === g)
            return;
          Me(e, {
            defaultLayoutDeferred: !1,
            derivedPanelConstraints: w,
            groupSize: g,
            layout: x,
            separatorToPanels: S.separatorToPanels
          });
        }
      } else
        yc(e, b, y);
    }
  });
  o.observe(e.element), e.panels.forEach((v) => {
    G(
      !r.has(v.id),
      `Panel ids must be unique; id "${v.id}" was used more than once`
    ), r.add(v.id), v.onResize && o.observe(v.element);
  });
  const s = Ge({ group: e }), i = on(e), c = e.panels.map(({ id: v }) => v).join(",");
  let l = e.mutableState.defaultLayout;
  l && (Sc(e.panels, l) || (l = void 0));
  const d = e.mutableState.layouts[c] ?? l ?? Pr(i), u = _e({
    layout: d,
    panelConstraints: i
  }), f = e.element.ownerDocument;
  je.set(
    f,
    (je.get(f) ?? 0) + 1
  );
  const m = /* @__PURE__ */ new Map();
  return Qr(e).forEach((v) => {
    v.separator && m.set(v.separator, v.panels);
  }), Me(e, {
    defaultLayoutDeferred: s === 0,
    derivedPanelConstraints: i,
    groupSize: s,
    layout: u,
    separatorToPanels: m
  }), e.separators.forEach((v) => {
    G(
      !a.has(v.id),
      `Separator ids must be unique; id "${v.id}" was used more than once`
    ), a.add(v.id), v.element.addEventListener("keydown", br);
  }), je.get(f) === 1 && (f.addEventListener("contextmenu", fr, !0), f.addEventListener("dblclick", gr, !0), f.addEventListener("pointerdown", yr, !0), f.addEventListener("pointerleave", vr), f.addEventListener("pointermove", wr), f.addEventListener("pointerout", Sr), f.addEventListener("pointerup", Ir, !0)), function() {
    t = !1, je.set(
      f,
      Math.max(0, (je.get(f) ?? 0) - 1)
    ), cc(e), e.separators.forEach((v) => {
      v.element.removeEventListener("keydown", br);
    }), je.get(f) || (f.removeEventListener(
      "contextmenu",
      fr,
      !0
    ), f.removeEventListener(
      "dblclick",
      gr,
      !0
    ), f.removeEventListener(
      "pointerdown",
      yr,
      !0
    ), f.removeEventListener("pointerleave", vr), f.removeEventListener("pointermove", wr), f.removeEventListener("pointerout", Sr), f.removeEventListener("pointerup", Ir, !0)), o.disconnect();
  };
}
function Pc() {
  const [e, t] = k({}), n = N(() => t({}), []);
  return [e, n];
}
function En(e) {
  const t = pn();
  return `${e ?? t}`;
}
const Oe = typeof window < "u" ? De : O;
function st(e) {
  const t = A(e);
  return Oe(() => {
    t.current = e;
  }, [e]), N(
    (...n) => {
      var r;
      return (r = t.current) == null ? void 0 : r.call(t, ...n);
    },
    [t]
  );
}
function xn(...e) {
  return st((t) => {
    e.forEach((n) => {
      if (n)
        switch (typeof n) {
          case "function": {
            n(t);
            break;
          }
          case "object": {
            n.current = t;
            break;
          }
        }
    });
  });
}
function Nn(e) {
  const t = A({ ...e });
  return Oe(() => {
    for (const n in e)
      t.current[n] = e[n];
  }, [e]), t.current;
}
const fo = fn(null);
function Rc(e, t) {
  const n = A({
    getLayout: () => ({}),
    setLayout: sc
  });
  dn(t, () => n.current, []), Oe(() => {
    Object.assign(
      n.current,
      lo({ groupId: e })
    );
  });
}
function mo({
  children: e,
  className: t,
  defaultLayout: n,
  disableCursor: r,
  disabled: a,
  elementRef: o,
  groupRef: s,
  id: i,
  onLayoutChange: c,
  onLayoutChanged: l,
  orientation: d = "horizontal",
  resizeTargetMinimumSize: u = {
    coarse: 20,
    fine: 10
  },
  style: f,
  ...m
}) {
  const v = A({
    onLayoutChange: {},
    onLayoutChanged: {}
  }), h = st((R) => {
    ze(v.current.onLayoutChange, R) || (v.current.onLayoutChange = R, c == null || c(R));
  }), y = st(
    (R, P) => {
      ze(v.current.onLayoutChanged, R) || (v.current.onLayoutChanged = R, l == null || l(R, { isUserInteraction: P }));
    }
  ), b = En(i), g = A(null), [S, w] = Pc(), I = A({
    lastExpandedPanelSizes: {},
    layouts: {},
    panels: [],
    resizeTargetMinimumSize: u,
    separators: []
  }), L = xn(g, o);
  Rc(b, s);
  const x = st(
    (R, P) => {
      const E = Le(), _ = dr(R), C = Ne(R);
      if (C) {
        let $ = !1;
        switch (E.state) {
          case "active": {
            $ = E.hitRegions.some(
              (B) => B.group === _
            );
            break;
          }
        }
        return {
          flexGrow: C.layout[P] ?? 1,
          pointerEvents: $ ? "none" : void 0
        };
      }
      if (n != null && n[P])
        return {
          flexGrow: n == null ? void 0 : n[P]
        };
    }
  ), D = Nn({
    defaultLayout: n,
    disableCursor: r
  }), T = J(
    () => ({
      get disableCursor() {
        return !!D.disableCursor;
      },
      getPanelStyles: x,
      id: b,
      orientation: d,
      registerPanel: (R) => {
        const P = I.current;
        return P.panels = an(d, [
          ...P.panels,
          R
        ]), w(), () => {
          P.panels = P.panels.filter(
            (E) => E !== R
          ), w();
        };
      },
      registerSeparator: (R) => {
        const P = I.current;
        return P.separators = an(d, [
          ...P.separators,
          R
        ]), w(), () => {
          P.separators = P.separators.filter(
            (E) => E !== R
          ), w();
        };
      },
      updatePanelProps: (R, { disabled: P }) => {
        const E = I.current.panels.find(
          ($) => $.id === R
        );
        E && (E.panelConstraints.disabled = P);
        const _ = dr(b), C = Ne(b);
        _ && C && Me(_, {
          ...C,
          derivedPanelConstraints: on(_)
        });
      },
      updateSeparatorProps: (R, {
        disabled: P,
        disableDoubleClick: E
      }) => {
        const _ = I.current.separators.find(
          (C) => C.id === R
        );
        _ && (_.disabled = P, _.disableDoubleClick = E);
      }
    }),
    [x, b, w, d, D]
  ), M = A(null);
  return Oe(() => {
    const R = g.current;
    if (R === null)
      return;
    const P = I.current;
    let E;
    if (D.defaultLayout !== void 0 && Object.keys(D.defaultLayout).length === P.panels.length) {
      E = {};
      for (const re of P.panels) {
        const te = D.defaultLayout[re.id];
        te !== void 0 && (E[re.id] = te);
      }
    }
    const _ = {
      disabled: !!a,
      element: R,
      id: b,
      mutableState: {
        defaultLayout: E,
        disableCursor: !!D.disableCursor,
        expandedPanelSizes: I.current.lastExpandedPanelSizes,
        layouts: I.current.layouts
      },
      orientation: d,
      panels: P.panels,
      resizeTargetMinimumSize: P.resizeTargetMinimumSize,
      separators: P.separators
    };
    M.current = _;
    const C = Ic(_), { defaultLayoutDeferred: $, derivedPanelConstraints: B, layout: X } = Ne(_.id, !0);
    !$ && B.length > 0 && (h(X), y(X, !1));
    const Y = Tn(b, (re) => {
      const { defaultLayoutDeferred: te, derivedPanelConstraints: se, layout: U } = re.next;
      if (te || se.length === 0)
        return;
      const q = _.panels.map(({ id: ne }) => ne).join(",");
      _.mutableState.layouts[q] = U, se.forEach((ne) => {
        if (ne.collapsible) {
          const { layout: ue } = re.prev ?? {};
          if (ue) {
            const pe = le(
              ne.collapsedSize,
              U[ne.panelId]
            ), j = le(
              ne.collapsedSize,
              ue[ne.panelId]
            );
            pe && !j && (_.mutableState.expandedPanelSizes[ne.panelId] = ue[ne.panelId]);
          }
        }
      });
      const oe = Le().state !== "active";
      h(U), oe && y(U, re.isUserInteraction);
    });
    return () => {
      M.current = null, C(), Y();
    };
  }, [
    a,
    b,
    y,
    h,
    d,
    S,
    D
  ]), O(() => {
    const R = M.current;
    R && (R.mutableState.defaultLayout = n, R.mutableState.disableCursor = !!r);
  }), /* @__PURE__ */ p(fo.Provider, { value: T, children: /* @__PURE__ */ p(
    "div",
    {
      ...m,
      className: t,
      "data-group": !0,
      "data-testid": b,
      id: b,
      ref: L,
      style: {
        height: "100%",
        width: "100%",
        overflow: "hidden",
        ...f,
        display: "flex",
        flexDirection: d === "horizontal" ? "row" : "column",
        flexWrap: "nowrap",
        // Inform the browser that the library is handling touch events for this element
        // but still allow users to scroll content within panels in the non-resizing direction
        // NOTE This is not an inherited style
        // See github.com/bvaughn/react-resizable-panels/issues/662
        touchAction: d === "horizontal" ? "pan-y" : "pan-x"
      },
      children: e
    }
  ) });
}
mo.displayName = "Group";
function An() {
  const e = mn(fo);
  return G(
    e,
    "Group Context not found; did you render a Panel or Separator outside of a Group?"
  ), e;
}
function Tc(e, t) {
  const { id: n } = An(), r = A({
    collapse: Jt,
    expand: Jt,
    getSize: () => ({
      asPercentage: 0,
      inPixels: 0
    }),
    isCollapsed: () => !1,
    resize: Jt
  });
  dn(t, () => r.current, []), Oe(() => {
    Object.assign(
      r.current,
      co({ groupId: n, panelId: e })
    );
  });
}
function sn({
  children: e,
  className: t,
  collapsedSize: n = "0%",
  collapsible: r = !1,
  defaultSize: a,
  disabled: o,
  elementRef: s,
  groupResizeBehavior: i = "preserve-relative-size",
  id: c,
  maxSize: l = "100%",
  minSize: d = "0%",
  onResize: u,
  panelRef: f,
  style: m,
  ...v
}) {
  const h = !!c, y = En(c), b = Nn({
    disabled: o
  }), g = A(null), S = xn(g, s), {
    getPanelStyles: w,
    id: I,
    orientation: L,
    registerPanel: x,
    updatePanelProps: D
  } = An(), T = u !== null, M = st(
    (_, C, $) => {
      u == null || u(_, c, $);
    }
  );
  Oe(() => {
    const _ = g.current;
    if (_ !== null) {
      const C = {
        element: _,
        id: y,
        idIsStable: h,
        mutableValues: {
          expandToSize: void 0,
          prevSize: void 0
        },
        onResize: T ? M : void 0,
        panelConstraints: {
          groupResizeBehavior: i,
          collapsedSize: n,
          collapsible: r,
          defaultSize: a,
          disabled: b.disabled,
          maxSize: l,
          minSize: d
        }
      };
      return x(C);
    }
  }, [
    i,
    n,
    r,
    a,
    T,
    y,
    h,
    l,
    d,
    M,
    x,
    b
  ]), O(() => {
    D(y, { disabled: o });
  }, [o, y, D]), Tc(y, f);
  const R = () => {
    const _ = w(I, y);
    if (_)
      return JSON.stringify(_);
  }, P = Po(
    (_) => Tn(I, _),
    R,
    R
  );
  let E;
  return P ? E = JSON.parse(P) : a !== void 0 ? E = {
    flexGrow: void 0,
    flexShrink: void 0,
    flexBasis: a
  } : E = { flexGrow: 1 }, /* @__PURE__ */ p(
    "div",
    {
      ...v,
      "data-disabled": o || void 0,
      "data-panel": !0,
      "data-testid": y,
      id: y,
      ref: S,
      style: {
        ...Mc,
        display: "flex",
        flexBasis: 0,
        flexShrink: 1,
        overflow: "visible",
        ...E
      },
      children: /* @__PURE__ */ p(
        "div",
        {
          className: t,
          style: {
            maxHeight: "100%",
            maxWidth: "100%",
            flexGrow: 1,
            overflow: "auto",
            ...m,
            // Inform the browser that the library is handling touch events for this element
            // but still allow users to scroll content within panels in the non-resizing direction
            // NOTE This is not an inherited style
            // See github.com/bvaughn/react-resizable-panels/issues/662
            touchAction: L === "horizontal" ? "pan-y" : "pan-x"
          },
          children: e
        }
      )
    }
  );
}
sn.displayName = "Panel";
const Mc = {
  minHeight: 0,
  maxHeight: "100%",
  height: "auto",
  minWidth: 0,
  maxWidth: "100%",
  width: "auto",
  border: "none",
  borderWidth: 0,
  padding: 0,
  margin: 0
};
function Ec({
  layout: e,
  panelConstraints: t,
  panelId: n,
  panelIndex: r
}) {
  let a, o;
  const s = e[n], i = t.find(
    (c) => c.panelId === n
  );
  if (i) {
    const c = i.maxSize, l = i.collapsible ? i.collapsedSize : i.minSize, d = [r, r + 1];
    o = _e({
      layout: ft({
        delta: l - s,
        initialLayout: e,
        panelConstraints: t,
        pivotIndices: d,
        prevLayout: e
      }),
      panelConstraints: t
    })[n], a = _e({
      layout: ft({
        delta: c - s,
        initialLayout: e,
        panelConstraints: t,
        pivotIndices: d,
        prevLayout: e
      }),
      panelConstraints: t
    })[n];
  }
  return {
    valueControls: n,
    valueMax: a,
    valueMin: o,
    valueNow: s
  };
}
function po({
  children: e,
  className: t,
  disabled: n,
  disableDoubleClick: r,
  elementRef: a,
  id: o,
  style: s,
  ...i
}) {
  const c = En(o), l = Nn({
    disabled: n,
    disableDoubleClick: r
  }), [d, u] = k({}), [f, m] = k("inactive"), [v, h] = k(!1), y = A(null), b = xn(y, a), {
    disableCursor: g,
    id: S,
    orientation: w,
    registerSeparator: I,
    updateSeparatorProps: L
  } = An(), x = w === "horizontal" ? "vertical" : "horizontal";
  Oe(() => {
    const M = y.current;
    if (M !== null) {
      const R = {
        disabled: l.disabled,
        disableDoubleClick: l.disableDoubleClick,
        element: M,
        id: c
      }, P = I(R), E = oc(
        (C) => {
          m(
            C.next.state !== "inactive" && C.next.hitRegions.some(
              ($) => $.separator === R
            ) ? C.next.state : "inactive"
          );
        }
      ), _ = Tn(
        S,
        (C) => {
          const { derivedPanelConstraints: $, layout: B, separatorToPanels: X } = C.next, Y = X.get(R);
          if (Y) {
            const re = Y[0], te = Y.indexOf(re);
            u(
              Ec({
                layout: B,
                panelConstraints: $,
                panelId: re.id,
                panelIndex: te
              })
            );
          }
        }
      );
      return () => {
        E(), _(), P();
      };
    }
  }, [S, c, I, l]), O(() => {
    L(c, { disabled: n, disableDoubleClick: r });
  }, [n, r, c, L]);
  let D;
  n && !g && (D = "not-allowed");
  let T;
  if (n)
    T = "disabled";
  else
    switch (f) {
      case "active": {
        T = "active";
        break;
      }
      default:
        v ? T = "focus" : T = f;
    }
  return /* @__PURE__ */ p(
    "div",
    {
      ...i,
      "aria-controls": d.valueControls,
      "aria-disabled": n || void 0,
      "aria-orientation": x,
      "aria-valuemax": d.valueMax,
      "aria-valuemin": d.valueMin,
      "aria-valuenow": d.valueNow,
      children: e,
      className: t,
      "data-separator": T,
      "data-testid": c,
      id: c,
      onBlur: () => h(!1),
      onFocus: () => h(!0),
      ref: b,
      role: "separator",
      style: {
        flexBasis: "auto",
        cursor: D,
        ...s,
        flexGrow: 0,
        flexShrink: 0,
        // Inform the browser that the library is handling touch events for this element
        // See github.com/bvaughn/react-resizable-panels/issues/662
        touchAction: "none"
      },
      tabIndex: n ? void 0 : 0
    }
  );
}
po.displayName = "Separator";
const kn = 30, Cn = 65, mt = 50, xc = 100 - Cn, Nc = 100 - kn;
function Ac(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(Cn, Math.max(kn, t)) : mt;
}
function Ln(e) {
  return 100 - e;
}
function Ue(e) {
  return `${e}%`;
}
const zn = "reader-document", pt = "reader-assistant", ho = "retainpdf.reader.ai-split-layout.v1", kc = {
  [zn]: Ln(mt),
  [pt]: mt
};
function _n(e) {
  const t = Ac(e == null ? void 0 : e[pt]);
  return {
    [zn]: Ln(t),
    [pt]: t
  };
}
function Cc() {
  try {
    const e = JSON.parse(localStorage.getItem(ho) || "null");
    return _n(e);
  } catch {
    return kc;
  }
}
function Lc(e) {
  try {
    localStorage.setItem(ho, JSON.stringify(_n(e)));
  } catch {
  }
}
function qt(e, t) {
  const n = e == null ? void 0 : e.closest(".reader-react-root");
  if (!n) return;
  const r = _n(t);
  n.style.setProperty(
    "--reader-ai-split-width",
    `${r[pt]}vw`
  );
}
function zc() {
  const e = A(null), [t] = k(Cc);
  De(() => {
    const a = e.current;
    return qt(a, t), () => {
      var o;
      (o = a == null ? void 0 : a.closest(".reader-react-root")) == null || o.style.removeProperty("--reader-ai-split-width");
    };
  }, [t]);
  const n = N((a) => {
    qt(e.current, a);
  }, []), r = N((a, o) => {
    qt(e.current, a), o.isUserInteraction && Lc(a);
  }, []);
  return /* @__PURE__ */ z(
    mo,
    {
      id: "reader-ai-split",
      className: "reader-ai-split-resizer",
      elementRef: e,
      orientation: "horizontal",
      defaultLayout: t,
      onLayoutChange: n,
      onLayoutChanged: r,
      resizeTargetMinimumSize: { fine: 12, coarse: 28 },
      children: [
        /* @__PURE__ */ p(
          sn,
          {
            id: zn,
            defaultSize: Ue(Ln(mt)),
            minSize: Ue(xc),
            maxSize: Ue(Nc)
          }
        ),
        /* @__PURE__ */ p(
          po,
          {
            id: "reader-ai-split-separator",
            className: "reader-ai-split-separator",
            "aria-label": "调整文档与 AI 问答宽度",
            children: /* @__PURE__ */ p("span", { "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ p(
          sn,
          {
            id: pt,
            defaultSize: Ue(mt),
            minSize: Ue(kn),
            maxSize: Ue(Cn)
          }
        )
      ]
    }
  );
}
const Ee = 12, _c = 4;
function We(e, t, n) {
  if (typeof window > "u") return { x: e, y: t };
  const r = Math.min(n, window.innerWidth - Ee * 2), a = Math.max(Ee, window.innerWidth - r - Ee), o = Math.min(window.innerHeight * 0.9, 860), s = Math.max(Ee, window.innerHeight - o - Ee);
  return {
    x: Math.min(a, Math.max(Ee, e)),
    y: Math.min(s, Math.max(Ee, t))
  };
}
function Rr(e) {
  if (typeof window > "u") return { x: 24, y: 72 };
  const t = Math.min(e, window.innerWidth - Ee * 2);
  return We(window.innerWidth - t - 20, 72, e);
}
function Dc(e, t) {
  try {
    const n = localStorage.getItem(e);
    if (!n) return Rr(t);
    const r = JSON.parse(n);
    if (typeof r.x == "number" && typeof r.y == "number")
      return We(r.x, r.y, t);
  } catch {
  }
  return Rr(t);
}
function Fc(e, t) {
  try {
    localStorage.setItem(e, JSON.stringify(t));
  } catch {
  }
}
function Oc({
  id: e,
  open: t,
  title: n,
  subtitle: r = "拖动标题可移动",
  titleIcon: a,
  storageKey: o,
  ariaLabel: s,
  className: i = "",
  width: c = 360,
  placement: l = "floating",
  showHeader: d = !0,
  onClose: u,
  toolbar: f,
  children: m
}) {
  const v = l === "workspace", h = l === "dock-right", y = h || v, [b, g] = k(() => Dc(o, c)), [S, w] = k(!1), I = A(null);
  O(() => {
    !t || y || g((T) => We(T.x, T.y, c));
  }, [y, t, c]), O(() => {
    if (!t || y) return;
    const T = () => g((M) => We(M.x, M.y, c));
    return window.addEventListener("resize", T), () => window.removeEventListener("resize", T);
  }, [y, t, c]), O(() => {
    if (!t) return;
    const T = (M) => {
      var P;
      if (M.key !== "Escape") return;
      const R = M.target;
      (P = R == null ? void 0 : R.closest) != null && P.call(R, "textarea, input, select, [contenteditable='true']") || (M.preventDefault(), u());
    };
    return window.addEventListener("keydown", T), () => window.removeEventListener("keydown", T);
  }, [t, u]);
  const L = N((T) => {
    var M, R;
    y || T.button === 0 && ((R = (M = T.target) == null ? void 0 : M.closest) != null && R.call(M, "button") || (T.currentTarget.setPointerCapture(T.pointerId), I.current = {
      pointerId: T.pointerId,
      startX: T.clientX,
      startY: T.clientY,
      originX: b.x,
      originY: b.y,
      moved: !1
    }, w(!0)));
  }, [y, b.x, b.y]), x = N((T) => {
    const M = I.current;
    if (!M || M.pointerId !== T.pointerId) return;
    const R = T.clientX - M.startX, P = T.clientY - M.startY;
    !M.moved && Math.hypot(R, P) < _c || (M.moved = !0, g(We(M.originX + R, M.originY + P, c)));
  }, [c]), D = N((T) => {
    const M = I.current;
    if (!(!M || M.pointerId !== T.pointerId)) {
      I.current = null, w(!1);
      try {
        T.currentTarget.releasePointerCapture(T.pointerId);
      } catch {
      }
      M.moved && g((R) => {
        const P = We(R.x, R.y, c);
        return Fc(o, P), P;
      });
    }
  }, [o, c]);
  return t ? /* @__PURE__ */ z(
    "aside",
    {
      id: e,
      className: `reader-notes-panel reader-notes-panel--${v ? "workspace" : h ? "docked" : "float"}${y ? "" : " reader-floating-surface"}${d ? " has-panel-header" : " is-headerless"}${f ? " has-panel-toolbar" : ""}${S ? " is-dragging" : ""} ${i}`.trim(),
      style: y ? void 0 : { left: b.x, top: b.y, width: Math.min(c, typeof window < "u" ? window.innerWidth - 24 : c) },
      "aria-label": s,
      role: "dialog",
      "aria-modal": "false",
      children: [
        d ? /* @__PURE__ */ z(
          "header",
          {
            className: "reader-notes-panel-head",
            onPointerDown: L,
            onPointerMove: x,
            onPointerUp: D,
            onPointerCancel: D,
            children: [
              y ? null : /* @__PURE__ */ p("div", { className: "reader-notes-panel-drag", "aria-hidden": "true", children: /* @__PURE__ */ p(Uo, { size: 14, strokeWidth: 2.25 }) }),
              /* @__PURE__ */ z("div", { className: "reader-notes-panel-head-text", children: [
                /* @__PURE__ */ z("strong", { children: [
                  a,
                  n
                ] }),
                r ? /* @__PURE__ */ p("span", { children: r }) : null
              ] }),
              /* @__PURE__ */ p("button", { type: "button", className: "reader-notes-close reader-floating-close", "aria-label": `关闭${n}`, onClick: u, children: /* @__PURE__ */ p(Ye, { size: 14, strokeWidth: 2.5, "aria-hidden": !0 }) })
            ]
          }
        ) : null,
        f ? /* @__PURE__ */ p("div", { className: "reader-notes-panel-toolbar", children: f }) : null,
        /* @__PURE__ */ p("div", { className: "reader-notes-panel-body", children: m })
      ]
    }
  ) : null;
}
function $c({
  note: e,
  onJump: t,
  onUpdateNote: n,
  onRemove: r
}) {
  const [a, o] = k(!1), [s, i] = k(e.note);
  return O(() => {
    a || i(e.note);
  }, [e.note, a]), /* @__PURE__ */ z("article", { className: "reader-notes-item", children: [
    /* @__PURE__ */ z("div", { className: "reader-notes-item-top", children: [
      /* @__PURE__ */ p("span", { className: "reader-notes-kind", children: e.pane === "translated" ? "译文" : "原文" }),
      /* @__PURE__ */ z("div", { className: "reader-notes-item-actions", children: [
        /* @__PURE__ */ p("button", { type: "button", className: "reader-notes-link", onClick: () => t(e), children: "定位" }),
        /* @__PURE__ */ p("button", { type: "button", className: "reader-notes-danger", onClick: () => r(e.id), children: "删除" })
      ] })
    ] }),
    /* @__PURE__ */ p("p", { className: "reader-notes-quote", children: e.quote }),
    a ? /* @__PURE__ */ z("div", { className: "reader-notes-editor", children: [
      /* @__PURE__ */ p(
        "textarea",
        {
          className: "reader-notes-textarea",
          value: s,
          placeholder: "写点想法…",
          rows: 3,
          onChange: (c) => i(c.target.value)
        }
      ),
      /* @__PURE__ */ z("div", { className: "reader-notes-editor-actions", children: [
        /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            className: "reader-notes-primary",
            onClick: () => {
              n(e.id, s), o(!1);
            },
            children: "保存"
          }
        ),
        /* @__PURE__ */ p("button", { type: "button", className: "reader-notes-link", onClick: () => o(!1), children: "取消" })
      ] })
    ] }) : e.note ? /* @__PURE__ */ p(
      "button",
      {
        type: "button",
        className: "reader-notes-note",
        onClick: () => o(!0),
        title: "点击编辑",
        children: e.note
      }
    ) : /* @__PURE__ */ p("button", { type: "button", className: "reader-notes-add-note", onClick: () => o(!0), children: "添加笔记" })
  ] });
}
function jc({
  open: e,
  groups: t,
  count: n,
  onClose: r,
  onJump: a,
  onUpdateNote: o,
  onRemove: s,
  onExport: i
}) {
  const [c, l] = k(!1);
  return /* @__PURE__ */ p(
    Oc,
    {
      id: "reader-notes-panel",
      open: e,
      title: "批注",
      subtitle: "选中 PDF 文字后可添加 · 本地保存",
      titleIcon: /* @__PURE__ */ p(Lt, { size: 14, strokeWidth: 2.25, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.notes-float.pos.v1",
      ariaLabel: "批注",
      onClose: r,
      toolbar: /* @__PURE__ */ z(ln, { children: [
        /* @__PURE__ */ z("span", { className: "reader-notes-count", children: [
          n,
          " 条"
        ] }),
        /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            className: "reader-notes-export",
            disabled: c || n === 0,
            onClick: async () => {
              await i() && (l(!0), window.setTimeout(() => l(!1), 1800));
            },
            children: c ? "已复制" : "导出 Markdown"
          }
        )
      ] }),
      children: n === 0 ? /* @__PURE__ */ p("p", { className: "reader-notes-empty", children: "暂无批注。在 PDF 上拖选文字，点「添加批注」。" }) : t.map((d) => /* @__PURE__ */ z("section", { className: "reader-notes-group", children: [
        /* @__PURE__ */ z("h3", { className: "reader-notes-group-title", children: [
          "第 ",
          d.page,
          " 页"
        ] }),
        d.items.map((u) => /* @__PURE__ */ p(
          $c,
          {
            note: u,
            onJump: a,
            onUpdateNote: o,
            onRemove: s
          },
          u.id
        ))
      ] }, d.page))
    }
  );
}
function Uc({
  regionsFailed: e = !1,
  metadataFailed: t = !1
}) {
  const [n, r] = k(!1);
  if (O(() => {
    !e && !t && r(!1);
  }, [e, t]), n || !e && !t)
    return null;
  const a = [
    e ? "译文区域" : "",
    t ? "阅读元数据" : ""
  ].filter(Boolean);
  return /* @__PURE__ */ z("div", { className: "reader-error-notice", role: "status", "data-reader-error-notice": "true", children: [
    /* @__PURE__ */ z("span", { className: "reader-error-notice-text", children: [
      a.join("、"),
      "加载失败，正文仍可正常阅读。"
    ] }),
    /* @__PURE__ */ p(
      "button",
      {
        type: "button",
        className: "reader-error-notice-dismiss",
        "aria-label": "关闭提示",
        onClick: () => r(!0),
        children: "×"
      }
    )
  ] });
}
function Bc({
  loading: e,
  failed: t,
  text: n,
  percent: r,
  regionsError: a = !1,
  metadataError: o = !1
}) {
  return !e && !t ? /* @__PURE__ */ p(Uc, { regionsFailed: a, metadataFailed: o }) : /* @__PURE__ */ z(ln, { children: [
    e ? /* @__PURE__ */ p("div", { className: "reader-boot-loading", "data-reader-boot-loading": "true", children: /* @__PURE__ */ z("div", { className: "reader-boot-loading-card", children: [
      /* @__PURE__ */ p("div", { className: "reader-boot-loading-text", children: n }),
      /* @__PURE__ */ p("div", { className: "reader-boot-loading-track", children: /* @__PURE__ */ p(
        "span",
        {
          className: "reader-boot-loading-bar",
          style: { width: `${Math.max(0, Math.min(100, r))}%` }
        }
      ) })
    ] }) }) : null,
    t ? /* @__PURE__ */ p("div", { className: "reader-react-error", role: "alert", children: n }) : null
  ] });
}
async function Hc(e) {
  var a;
  const t = `${e || ""}`;
  if (!t) throw new Error("empty selection");
  try {
    if ((a = navigator.clipboard) != null && a.writeText) {
      await navigator.clipboard.writeText(t);
      return;
    }
  } catch {
  }
  const n = document.createElement("textarea");
  n.value = t, n.setAttribute("readonly", ""), n.style.position = "fixed", n.style.opacity = "0", document.body.appendChild(n), n.select();
  const r = document.execCommand("copy");
  if (n.remove(), !r) throw new Error("copy failed");
}
function Wc({
  selection: e,
  onDismiss: t,
  onAskAi: n,
  onAddNote: r
}) {
  const [a, o] = k(!1), s = e ? e.selectionType === "text" ? `${e.pane}:${e.page}:${e.quote}` : `${e.region.itemId}:${e.pane}` : "";
  if (O(() => o(!1), [s]), !e)
    return null;
  const i = typeof window < "u" ? window.innerWidth : 800, c = typeof window < "u" ? window.innerHeight : 600, l = e.rect.left + e.rect.width / 2, d = 170, u = Math.min(Math.max(16 + d, l), i - 16 - d), f = e.rect.top > 72, m = f ? Math.max(12, e.rect.top - 8) : Math.min(c - 12, e.rect.top + e.rect.height + 8), v = f ? "above" : "below", h = e.pane === "translated" ? "译文" : "原文", y = e.selectionType === "text" ? "text" : e.kind, b = e.selectionType === "text" ? e.quote : _r(e.region, e.pane), g = y === "formula" ? "公式" : y === "table" ? "表格" : y === "figure" ? "图片" : y === "text" ? "文字" : "区域", S = y === "formula" ? Aa(b) : b, w = y === "formula" ? Bo : y === "table" ? Ho : y === "text" ? Wo : Jo;
  return /* @__PURE__ */ z(
    "div",
    {
      className: `reader-sel-pop reader-sel-pop--${v} reader-sel-pop--region`,
      style: { left: u, top: m },
      role: "toolbar",
      "aria-label": "选区操作",
      onPointerDown: (I) => {
        I.preventDefault();
      },
      children: [
        /* @__PURE__ */ z("div", { className: "reader-sel-pop-card reader-floating-surface", children: [
          /* @__PURE__ */ z("div", { className: "reader-sel-pop-context", children: [
            /* @__PURE__ */ p(w, { size: 15, strokeWidth: 2.1, "aria-hidden": !0 }),
            /* @__PURE__ */ p("span", { children: g }),
            /* @__PURE__ */ p("span", { className: "reader-sel-pop-context-divider", "aria-hidden": !0, children: "·" }),
            /* @__PURE__ */ p("span", { children: h }),
            /* @__PURE__ */ p("span", { className: "reader-sel-pop-context-divider", "aria-hidden": !0, children: "·" }),
            /* @__PURE__ */ z("span", { children: [
              e.page,
              " 页"
            ] })
          ] }),
          /* @__PURE__ */ z("div", { className: "reader-sel-pop-actions", children: [
            S ? /* @__PURE__ */ z(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--primary",
                onClick: async () => {
                  try {
                    await Hc(S), o(!0), window.setTimeout(() => o(!1), 1400);
                  } catch (I) {
                    console.warn("[reader-selection] copy failed", I);
                  }
                },
                children: [
                  a ? /* @__PURE__ */ p(qo, { size: 15, strokeWidth: 2.4, "aria-hidden": !0 }) : /* @__PURE__ */ p(Ko, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
                  /* @__PURE__ */ p("span", { children: a ? "已复制" : y === "formula" ? "复制 LaTeX" : "复制" })
                ]
              }
            ) : /* @__PURE__ */ p("span", { className: "reader-sel-pop-selection-hint", children: "已选择图片" }),
            r && S ? /* @__PURE__ */ z(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--secondary",
                onClick: () => r({ page: e.page, pane: e.pane, quote: S }),
                children: [
                  /* @__PURE__ */ p(Lt, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
                  /* @__PURE__ */ p("span", { children: "添加批注" })
                ]
              }
            ) : null,
            n ? /* @__PURE__ */ z(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--secondary",
                onClick: () => n(e),
                children: [
                  /* @__PURE__ */ p(gn, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
                  /* @__PURE__ */ p("span", { children: "问 AI" })
                ]
              }
            ) : null,
            /* @__PURE__ */ p(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--ghost",
                onClick: t,
                "aria-label": "取消选区",
                title: "取消",
                children: /* @__PURE__ */ p(Ye, { size: 15, strokeWidth: 2.5, "aria-hidden": !0 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ p("span", { className: "reader-sel-pop-caret", "aria-hidden": "true" })
      ]
    }
  );
}
function Jc(e) {
  if (!(e instanceof HTMLElement)) return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function qc() {
  const [e, t] = k(!1), n = pn(), r = A(null);
  return O(() => {
    if (!e) return;
    const a = (s) => {
      const i = r.current;
      i && s.target instanceof Node && !i.contains(s.target) && t(!1);
    }, o = (s) => {
      s.key === "Escape" && (s.preventDefault(), t(!1));
    };
    return document.addEventListener("mousedown", a), window.addEventListener("keydown", o), () => {
      document.removeEventListener("mousedown", a), window.removeEventListener("keydown", o);
    };
  }, [e]), O(() => {
    const a = (o) => {
      if (o.defaultPrevented || o.metaKey || o.ctrlKey || o.altKey || Jc(o.target)) return;
      const s = o.key;
      if (s === "?" || s === "h" || s === "H" || s === "/") {
        if (s === "/" && !o.shiftKey)
          return;
        o.preventDefault(), t((i) => !i);
      }
    };
    return window.addEventListener("keydown", a), () => window.removeEventListener("keydown", a);
  }, []), /* @__PURE__ */ z("div", { className: "reader-react-shortcuts", ref: r, "data-reader-shortcuts": "", children: [
    /* @__PURE__ */ p(
      "button",
      {
        type: "button",
        className: `reader-react-hud-btn reader-react-shortcuts-btn${e ? " is-active" : ""}`,
        "aria-label": "快捷键说明",
        "aria-expanded": e,
        "aria-controls": n,
        title: "快捷键（H 或 ?）",
        onClick: () => t((a) => !a),
        children: /* @__PURE__ */ p(Vo, { className: "reader-react-shortcuts-icon", size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
      }
    ),
    e ? /* @__PURE__ */ z(
      "div",
      {
        id: n,
        className: "reader-react-shortcuts-panel reader-floating-surface",
        role: "dialog",
        "aria-label": "阅读器快捷键",
        children: [
          /* @__PURE__ */ z("div", { className: "reader-react-shortcuts-head", children: [
            /* @__PURE__ */ p("strong", { children: "快捷键" }),
            /* @__PURE__ */ p(
              "button",
              {
                type: "button",
                className: "reader-react-shortcuts-close reader-floating-close",
                "aria-label": "关闭",
                onClick: () => t(!1),
                children: "×"
              }
            )
          ] }),
          /* @__PURE__ */ p("div", { className: "reader-react-shortcuts-body", children: ri.map((a) => /* @__PURE__ */ z("section", { className: "reader-react-shortcuts-group", children: [
            /* @__PURE__ */ p("h3", { children: a.title }),
            /* @__PURE__ */ p("ul", { children: a.items.map((o) => /* @__PURE__ */ z("li", { children: [
              /* @__PURE__ */ p("kbd", { children: o.keys }),
              /* @__PURE__ */ p("span", { children: o.desc })
            ] }, `${a.title}-${o.keys}`)) })
          ] }, a.title)) }),
          /* @__PURE__ */ p("p", { className: "reader-react-shortcuts-foot", children: "在输入框内不会触发快捷键" })
        ]
      }
    ) : null
  ] });
}
const Kc = Object.freeze([
  {
    id: "favorites",
    label: "摘录",
    subIdle: "本书云端收藏",
    subOpen: "关闭悬浮窗",
    needsJob: !1
  },
  {
    id: "markdown",
    label: "Markdown",
    subIdle: "识别 / 译文文本",
    subOpen: "关闭悬浮窗",
    needsJob: !0
  },
  {
    id: "ai",
    label: "AI 问答",
    subIdle: "基于文档提问",
    subOpen: "关闭悬浮窗",
    needsJob: !0
  }
]), Vc = ["source", "sideBySide", "translated"], Gc = { source: "", translated: "", sideBySide: "" };
function Yc(e) {
  if (e.sourceOnly || !e.jobId) {
    const t = ct(e.sourceUrl), n = ct(e.translatedUrl);
    return {
      source: t,
      translated: n,
      // sideBySide requires dedicated artifact; no fallback to source url
      sideBySide: ""
    };
  }
  return pa({
    jobId: e.jobId,
    jobPayload: e.jobPayload,
    manifestPayload: e.manifestPayload
  });
}
function Zc(e) {
  const [t, n] = k(() => /* @__PURE__ */ new Set()), r = J(
    () => e ? Yc(e) : Gc,
    [e]
  ), a = J(
    () => Vc.filter((s) => !(e != null && e.sourceOnly && s !== "source")),
    [e == null ? void 0 : e.sourceOnly]
  ), o = N(async (s) => {
    if (!e) return;
    const i = ct(r[s]);
    if (!(!i || t.has(s)))
      try {
        const c = e.jobId ? ma(s, {
          jobId: e.jobId,
          jobPayload: e.jobPayload,
          manifestPayload: e.manifestPayload
        }) : `${e.sourceOnly ? "document" : "reader"}-${s}.pdf`;
        await ha(
          e.fetchProtected,
          i,
          c,
          c,
          null,
          (l) => n((d) => {
            const u = new Set(d);
            return l ? u.add(s) : u.delete(s), u;
          })
        );
      } catch (c) {
        const l = c instanceof Error ? c.message : "下载失败";
        ga(l), n((d) => {
          const u = new Set(d);
          return u.delete(s), u;
        });
      }
  }, [r, t, e]);
  return { urls: r, downloadItems: a, busyActions: t, handleDownload: o };
}
function Xc(e) {
  const [t, n] = k(!1), r = N(() => n(!1), []), a = N(() => n((o) => !o), []);
  return O(() => {
    if (!t) return;
    const o = (i) => {
      const c = e.current;
      c && i.target instanceof Node && !c.contains(i.target) && n(!1);
    }, s = (i) => {
      i.key === "Escape" && (i.preventDefault(), n(!1));
    };
    return document.addEventListener("mousedown", o), window.addEventListener("keydown", s), () => {
      document.removeEventListener("mousedown", o), window.removeEventListener("keydown", s);
    };
  }, [t, e]), { open: t, setOpen: n, closeMenu: r, toggleMenu: a };
}
const go = "retainpdf.reader.fab.pos.v1", Ct = 52, Be = 12, Qc = 6;
function it(e, t) {
  if (typeof window > "u")
    return { x: e, y: t };
  const n = Math.max(Be, window.innerWidth - Ct - Be), r = Math.max(Be, window.innerHeight - Ct - Be);
  return {
    x: Math.min(n, Math.max(Be, e)),
    y: Math.min(r, Math.max(Be, t))
  };
}
function Tr() {
  return typeof window > "u" ? { x: 24, y: 120 } : it(
    window.innerWidth - Ct - 20,
    window.innerHeight - Ct - 88
  );
}
function el() {
  try {
    const e = localStorage.getItem(go);
    if (!e) return Tr();
    const t = JSON.parse(e);
    if (typeof t.x == "number" && typeof t.y == "number")
      return it(t.x, t.y);
  } catch {
  }
  return Tr();
}
function tl(e) {
  try {
    localStorage.setItem(go, JSON.stringify(e));
  } catch {
  }
}
function nl(e) {
  return typeof window < "u" && e.y > window.innerHeight * 0.55;
}
function rl(e = {}) {
  const { onDragStart: t, onActivate: n } = e, [r, a] = k(() => el()), o = A(null);
  O(() => {
    const l = () => a((d) => it(d.x, d.y));
    return window.addEventListener("resize", l), () => window.removeEventListener("resize", l);
  }, []);
  const s = N((l) => {
    l.button === 0 && (l.currentTarget.setPointerCapture(l.pointerId), o.current = {
      pointerId: l.pointerId,
      startX: l.clientX,
      startY: l.clientY,
      originX: r.x,
      originY: r.y,
      moved: !1
    });
  }, [r.x, r.y]), i = N((l) => {
    const d = o.current;
    if (!d || d.pointerId !== l.pointerId) return;
    const u = l.clientX - d.startX, f = l.clientY - d.startY;
    !d.moved && Math.hypot(u, f) < Qc || (d.moved || (d.moved = !0, t == null || t()), a(it(d.originX + u, d.originY + f)));
  }, [t]), c = N((l) => {
    const d = o.current;
    if (!(!d || d.pointerId !== l.pointerId)) {
      o.current = null;
      try {
        l.currentTarget.releasePointerCapture(l.pointerId);
      } catch {
      }
      if (d.moved) {
        a((u) => {
          const f = it(u.x, u.y);
          return tl(f), f;
        });
        return;
      }
      n == null || n();
    }
  }, [n]);
  return {
    pos: r,
    openUp: nl(r),
    onPointerDown: s,
    onPointerMove: i,
    onPointerUp: c
  };
}
const ol = {
  source: xr,
  sideBySide: Nr,
  translated: Ar
}, al = {
  source: "原文",
  sideBySide: "对照",
  translated: "译文"
};
function sl({ onClose: e }) {
  return /* @__PURE__ */ z("header", { className: "reader-fab-menu-head", children: [
    /* @__PURE__ */ z("div", { className: "reader-fab-menu-head-text", children: [
      /* @__PURE__ */ p("strong", { children: "工具" }),
      /* @__PURE__ */ p("span", { children: "拖动圆钮可移动" })
    ] }),
    /* @__PURE__ */ p(
      "button",
      {
        type: "button",
        className: "reader-fab-menu-close reader-floating-close",
        "aria-label": "关闭菜单",
        onClick: e,
        children: /* @__PURE__ */ p(Ye, { size: 14, strokeWidth: 2.5, "aria-hidden": !0 })
      }
    )
  ] });
}
function il({
  index: e,
  icon: t,
  title: n,
  sub: r,
  active: a,
  disabled: o,
  onClick: s
}) {
  return /* @__PURE__ */ z(
    "button",
    {
      type: "button",
      role: "menuitem",
      className: `reader-fab-row${a ? " is-active" : ""}${o ? " is-disabled" : ""}`,
      "aria-pressed": a,
      disabled: o,
      onClick: s,
      style: { "--fab-i": e + 1 },
      children: [
        /* @__PURE__ */ p("span", { className: "reader-fab-row-icon", "aria-hidden": "true", children: /* @__PURE__ */ p(t, { size: 18, strokeWidth: 2 }) }),
        /* @__PURE__ */ z("span", { className: "reader-fab-row-copy", children: [
          /* @__PURE__ */ p("span", { className: "reader-fab-row-title", children: n }),
          /* @__PURE__ */ p("span", { className: "reader-fab-row-sub", children: r })
        ] })
      ]
    }
  );
}
function cl({
  urls: e,
  items: t,
  busyActions: n,
  onDownload: r
}) {
  return /* @__PURE__ */ z("div", { className: "reader-fab-section", role: "group", "aria-label": "下载", children: [
    /* @__PURE__ */ z("div", { className: "reader-fab-section-head", children: [
      /* @__PURE__ */ p(Go, { size: 12, strokeWidth: 2.5, "aria-hidden": !0 }),
      /* @__PURE__ */ p("span", { children: "下载 PDF" })
    ] }),
    /* @__PURE__ */ p("div", { className: "reader-fab-download-grid", children: t.map((a, o) => {
      const s = xo[a], i = ct(e[a]), c = n.has(a), l = !!i && !c, d = l ? "" : No(a, e), u = ol[a];
      return /* @__PURE__ */ z(
        "button",
        {
          type: "button",
          role: "menuitem",
          id: `reader-fab-download-${a}`,
          className: `reader-fab-chip${c ? " is-busy" : ""}${l ? "" : " is-disabled"}`,
          disabled: !l,
          title: l ? `下载${s.label}` : d,
          onClick: () => void r(a),
          style: { "--fab-i": o },
          children: [
            /* @__PURE__ */ p("span", { className: "reader-fab-chip-icon", "aria-hidden": "true", children: /* @__PURE__ */ p(u, { size: 16, strokeWidth: 2 }) }),
            /* @__PURE__ */ p("span", { className: "reader-fab-chip-label", children: al[a] }),
            /* @__PURE__ */ p("span", { className: "reader-fab-chip-state", children: c ? "…" : l ? "↓" : "—" })
          ]
        },
        a
      );
    }) }),
    t.every((a) => !ct(e[a])) ? /* @__PURE__ */ p("p", { className: "reader-fab-empty", children: "产物尚未就绪" }) : null
  ] });
}
const ll = {
  favorites: Yo,
  markdown: kr,
  ai: gn,
  notes: Lt
}, ul = Kc.filter((e) => e.id === "favorites");
function dl(e) {
  const { activeTool: t, noteCount: n, onToggleTool: r } = e, a = gt(), o = e.sourceOnly ?? (a == null ? void 0 : a.sourceOnly) ?? !1, s = e.download ?? (a == null ? void 0 : a.download), i = A(null), c = pn(), { open: l, setOpen: d, closeMenu: u, toggleMenu: f } = Xc(i), { pos: m, openUp: v, onPointerDown: h, onPointerMove: y, onPointerUp: b } = rl({
    onDragStart: u,
    onActivate: f
  }), { urls: g, downloadItems: S, busyActions: w, handleDownload: I } = Zc(s), L = N((x) => {
    r(x), d(!1);
  }, [r, d]);
  return /* @__PURE__ */ z(
    "div",
    {
      ref: i,
      className: `reader-fab${l ? " is-open" : ""}${v ? " is-open-up" : ""}`,
      style: { left: m.x, top: m.y },
      "data-reader-fab": "",
      children: [
        l ? /* @__PURE__ */ z(
          "div",
          {
            id: c,
            className: "reader-fab-menu reader-floating-surface",
            role: "menu",
            "aria-label": "阅读工具",
            children: [
              /* @__PURE__ */ p(sl, { onClose: u }),
              (() => {
                const x = t === "notes";
                return /* @__PURE__ */ z(
                  "button",
                  {
                    type: "button",
                    role: "menuitem",
                    className: `reader-fab-row${x ? " is-active" : ""}`,
                    "aria-pressed": x,
                    onClick: () => L("notes"),
                    style: { "--fab-i": 0 },
                    children: [
                      /* @__PURE__ */ p("span", { className: "reader-fab-row-icon", "aria-hidden": "true", children: /* @__PURE__ */ p(Lt, { size: 18, strokeWidth: 2 }) }),
                      /* @__PURE__ */ z("span", { className: "reader-fab-row-copy", children: [
                        /* @__PURE__ */ p("span", { className: "reader-fab-row-title", children: "批注" }),
                        /* @__PURE__ */ p("span", { className: "reader-fab-row-sub", children: x ? "关闭悬浮窗" : "本地批注 · 导出" })
                      ] }),
                      n > 0 ? /* @__PURE__ */ p("span", { className: "reader-fab-row-badge", children: n }) : null
                    ]
                  }
                );
              })(),
              ul.map((x, D) => {
                const T = ll[x.id], M = t === x.id, R = x.needsJob && o;
                let P = M ? x.subOpen : x.subIdle;
                return R && (P = "需打开任务阅读"), /* @__PURE__ */ p(
                  il,
                  {
                    index: D,
                    icon: T,
                    title: x.label,
                    sub: P,
                    active: M,
                    disabled: R,
                    onClick: () => L(x.id)
                  },
                  x.id
                );
              }),
              /* @__PURE__ */ p(
                cl,
                {
                  urls: g,
                  items: S,
                  busyActions: w,
                  onDownload: I
                }
              )
            ]
          }
        ) : null,
        /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            className: `reader-fab-trigger${l ? " is-open" : ""}${t ? " has-active-tool" : ""}`,
            "aria-label": l ? "收起工具菜单" : "打开工具菜单",
            "aria-expanded": l,
            "aria-controls": l ? c : void 0,
            "aria-haspopup": "menu",
            onPointerDown: h,
            onPointerMove: y,
            onPointerUp: b,
            onPointerCancel: b,
            children: /* @__PURE__ */ p("span", { className: "reader-fab-icon", "aria-hidden": "true", children: l ? /* @__PURE__ */ p(Ye, { size: 20, strokeWidth: 2.5 }) : /* @__PURE__ */ z("span", { className: "reader-fab-dots", children: [
              /* @__PURE__ */ p("i", {}),
              /* @__PURE__ */ p("i", {}),
              /* @__PURE__ */ p("i", {})
            ] }) })
          }
        )
      ]
    }
  );
}
function fl(e) {
  const t = gt(), n = $i(), { mode: r = "compare", modeControls: a } = e, o = e.userZoom ?? (t == null ? void 0 : t.userZoom) ?? ht, s = e.onZoomChange ?? (t == null ? void 0 : t.onZoomChange) ?? (() => {
  }), i = e.currentPage ?? (n == null ? void 0 : n.currentPage) ?? 1, c = e.numPages ?? (n == null ? void 0 : n.numPages) ?? 0, l = e.onGoToPage ?? (t == null ? void 0 : t.goToPage), d = cs(o), u = o > Or + 1e-3, f = o < $r - 1e-3, m = at(), v = "50%（半屏，对照铺满）", [h, y] = k(!1), [b, g] = k(`${i}`);
  O(() => {
    h || g(`${Math.min(Math.max(i, 1), Math.max(c, 1))}`);
  }, [i, c, h]);
  const S = () => {
    if (y(!1), !l || c <= 0)
      return;
    const w = Number(`${b}`.trim());
    l(kt(w, c));
  };
  return /* @__PURE__ */ z("div", { className: "reader-react-hud", "data-reader-hud": "true", children: [
    a ? /* @__PURE__ */ p("div", { className: "reader-react-hud-group reader-react-hud-modes", children: a }) : null,
    /* @__PURE__ */ p("div", { className: "reader-react-hud-group", "aria-label": "页码", children: h ? /* @__PURE__ */ z(
      "form",
      {
        className: "reader-react-hud-page-form",
        onSubmit: (w) => {
          w.preventDefault(), S();
        },
        children: [
          /* @__PURE__ */ p(
            "input",
            {
              className: "reader-react-hud-page-input",
              type: "text",
              inputMode: "numeric",
              pattern: "[0-9]*",
              "aria-label": "跳转到页码",
              value: b,
              autoFocus: !0,
              onChange: (w) => g(w.target.value.replace(/[^\d]/g, "")),
              onBlur: S,
              onKeyDown: (w) => {
                w.key === "Escape" && (w.preventDefault(), y(!1), g(`${i}`));
              }
            }
          ),
          /* @__PURE__ */ z("span", { className: "reader-react-hud-page-suffix", children: [
            "/ ",
            c || "—"
          ] })
        ]
      }
    ) : /* @__PURE__ */ p(
      "button",
      {
        type: "button",
        className: "reader-react-hud-page reader-react-hud-page-btn",
        "aria-label": c > 0 ? `跳转页码，当前第 ${i} 页，共 ${c} 页` : "页码",
        title: c > 0 ? "点击输入页码跳转" : void 0,
        disabled: !l || c <= 0,
        onClick: () => {
          !l || c <= 0 || (g(`${i}`), y(!0));
        },
        children: c > 0 ? `${Math.min(i, c)} / ${c}` : "—"
      }
    ) }),
    /* @__PURE__ */ z("div", { className: "reader-react-hud-group", "aria-label": "缩放", children: [
      /* @__PURE__ */ p(
        "button",
        {
          type: "button",
          className: "reader-react-hud-btn",
          "aria-label": "缩小",
          disabled: !u,
          onClick: () => s(dt(o, -1)),
          children: "−"
        }
      ),
      /* @__PURE__ */ z(
        "button",
        {
          type: "button",
          className: "reader-react-hud-btn reader-react-hud-zoom-label",
          "aria-label": `重置为${v}`,
          title: v,
          onClick: () => s(m),
          children: [
            d,
            "%"
          ]
        }
      ),
      /* @__PURE__ */ p(
        "button",
        {
          type: "button",
          className: "reader-react-hud-btn",
          "aria-label": "放大",
          disabled: !f,
          onClick: () => s(dt(o, 1)),
          children: "+"
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { className: "reader-react-hud-group reader-react-hud-help", "aria-label": "帮助", children: /* @__PURE__ */ p(qc, {}) })
  ] });
}
function bo(e) {
  const t = `${e.jobId || ""}`.trim(), n = `${e.documentId || ""}`.trim();
  return t ? `retainpdf.reader.notes.v1:job:${t}` : n ? `retainpdf.reader.notes.v1:doc:${n}` : "retainpdf.reader.notes.v1:anonymous";
}
function ml() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function pl(e) {
  return {
    pageIdx: Number(e.page) - 1,
    quoteText: e.quote,
    note: e.note,
    createdAt: e.createdAt
  };
}
function hl(e) {
  return Lo(e, (t) => t.page);
}
function gl(e) {
  return _o(e, (t) => t.page).map((t) => ({ page: t.pageIdx, items: t.items }));
}
function bl(e, t) {
  return zo({
    title: e,
    annotations: t.map(pl)
  });
}
function yl(e) {
  if (!e)
    return [];
  try {
    const t = JSON.parse(e);
    return Array.isArray(t) ? t.map((n) => ({
      id: `${(n == null ? void 0 : n.id) || ""}`.trim(),
      page: Math.max(1, Math.floor(Number(n == null ? void 0 : n.page) || 1)),
      pane: (n == null ? void 0 : n.pane) === "translated" ? "translated" : "source",
      quote: `${(n == null ? void 0 : n.quote) || ""}`.trim(),
      note: `${(n == null ? void 0 : n.note) || ""}`.trim(),
      createdAt: `${(n == null ? void 0 : n.createdAt) || ""}`.trim() || (/* @__PURE__ */ new Date()).toISOString()
    })).filter((n) => n.id && n.quote) : [];
  } catch {
    return [];
  }
}
function Mr(e) {
  if (typeof localStorage > "u")
    return [];
  try {
    return yl(localStorage.getItem(bo(e)));
  } catch {
    return [];
  }
}
function vl(e, t) {
  if (!(typeof localStorage > "u"))
    try {
      localStorage.setItem(bo(e), JSON.stringify(t));
    } catch (n) {
      console.warn("[reader-notes] persist failed", n);
    }
}
function wl(e, t = {}) {
  const n = J(
    () => ({
      jobId: `${e.jobId || ""}`.trim(),
      documentId: `${e.documentId || ""}`.trim()
    }),
    [e.jobId, e.documentId]
  ), [r, a] = k(() => Mr(n)), o = t.onAfterAdd;
  O(() => {
    a(Mr(n));
  }, [n.jobId, n.documentId]), O(() => {
    vl(n, r);
  }, [n, r]);
  const s = N((u) => {
    const f = `${u.quote || ""}`.trim();
    if (!f)
      return null;
    const m = {
      id: ml(),
      page: Math.max(1, Math.floor(Number(u.page) || 1)),
      pane: u.pane === "translated" ? "translated" : "source",
      quote: f,
      note: `${u.note || ""}`.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return a((v) => hl([m, ...v])), o == null || o(), m;
  }, [o]), i = N((u, f) => {
    const m = `${f || ""}`.trim();
    a((v) => v.map((h) => h.id === u ? { ...h, note: m } : h));
  }, []), c = N((u) => {
    a((f) => f.filter((m) => m.id !== u));
  }, []), l = N(async (u = "") => {
    var m, v;
    const f = bl(u, r);
    try {
      return await ((v = (m = navigator.clipboard) == null ? void 0 : m.writeText) == null ? void 0 : v.call(m, f)), !0;
    } catch (h) {
      return console.error("[reader-notes] copy failed", h), !1;
    }
  }, [r]), d = J(() => gl(r), [r]);
  return {
    notes: r,
    groups: d,
    addFromQuote: s,
    updateNote: i,
    remove: c,
    exportMarkdown: l,
    count: r.length
  };
}
const cn = "download-toast";
function Sl({
  title: e = "下载中",
  status: t = "正在准备...",
  meta: n = "等待响应...",
  percent: r = NaN,
  tone: a = "progress"
}) {
  const o = Number.isFinite(r) ? Math.max(4, Math.min(100, Number(r) || 0)) : 18;
  return /* @__PURE__ */ z("div", { className: "download-toast-card reader-floating-surface", "data-tone": a, "aria-live": "polite", children: [
    /* @__PURE__ */ z("div", { className: "download-toast-head", children: [
      /* @__PURE__ */ p("div", { id: "download-toast-title", className: "download-toast-title", children: e }),
      /* @__PURE__ */ p("div", { id: "download-toast-status", className: "download-toast-status", children: t })
    ] }),
    /* @__PURE__ */ p("div", { className: "download-toast-track", children: /* @__PURE__ */ p("span", { id: "download-toast-bar", className: "download-toast-bar", style: { width: `${o}%` } }) }),
    /* @__PURE__ */ p("div", { id: "download-toast-meta", className: "download-toast-meta", children: n })
  ] });
}
function Il(e = {}) {
  const {
    visible: t = !1,
    title: n = "下载中",
    status: r = "正在准备...",
    meta: a = "等待响应...",
    percent: o = NaN,
    tone: s = "progress"
  } = e;
  if (!t) {
    Vt.dismiss(cn);
    return;
  }
  Vt.custom(
    () => /* @__PURE__ */ p(Sl, { title: n, status: r, meta: a, percent: o, tone: s }),
    { id: cn, duration: 1 / 0 }
  );
}
function Pl() {
  const e = N((t) => {
    t && (t.setState = Il, t.hide = () => Vt.dismiss(cn));
  }, []);
  return /* @__PURE__ */ z(ln, { children: [
    /* @__PURE__ */ p($o, { position: "bottom-right" }),
    /* @__PURE__ */ p("download-toast", { style: { display: "none" }, "aria-hidden": "true", ref: e })
  ] });
}
const Rl = hn(() => import("./ReaderFavoritesPanel-rWnWHbl5.js").then((e) => ({ default: e.ReaderFavoritesPanel }))), Tl = hn(() => import("./ReaderMarkdownPanel-DTBB5sBi.js").then((e) => ({ default: e.ReaderMarkdownPanel }))), Ml = hn(() => import("./ReaderAiPanel-D4QIaHcv.js").then((e) => ({ default: e.ReaderAiPanel })));
function Kt(e) {
  const t = A(!1);
  return e && (t.current = !0), t.current;
}
function El(e) {
  return "workspace";
}
function xl(e) {
  const t = e.sourceOnly || !e.translatedUrl, n = !!(e.overlayContentAvailable && e.liveTranslationVisible && !e.assistantOpen), a = e.assistantPdfPane || (e.assistantOpen && e.mode === "compare" ? "source" : e.mode);
  return {
    kind: n ? "live-overlay" : a === "compare" ? "final-compare" : a === "translated" ? "translated-only" : "source-only",
    visibleMode: a,
    compareMode: !n && a === "compare",
    showSource: n || a !== "translated",
    showTranslated: !n && (a === "translated" || a === "compare"),
    overlayOnSource: n,
    sourceOnly: e.sourceOnly,
    sourceViewOnly: t
  };
}
function Er(e, t) {
  var n, r, a, o;
  return e === "compare" ? null : (t == null ? void 0 : t.assistantPanel) === "markdown" || (t == null ? void 0 : t.assistantPanel) === "ai" ? t.assistantPanel : ((n = t == null ? void 0 : t.splitLayout) == null ? void 0 : n.left) === "ai" || ((r = t == null ? void 0 : t.splitLayout) == null ? void 0 : r.right) === "ai" ? "ai" : ((a = t == null ? void 0 : t.splitLayout) == null ? void 0 : a.left) === "markdown" || ((o = t == null ? void 0 : t.splitLayout) == null ? void 0 : o.right) === "markdown" ? "markdown" : null;
}
function Nl() {
  const e = ti(), { boot: t, panes: n, sessionFiles: r, tools: a, session: o } = e, [s, i] = k(() => Er(e.mode, Te(e.viewStateKey))), [c, l] = k(null), [d, u] = k(null), [f, m] = k(!1), v = A(e.viewStateKey), h = A(null), y = s !== null, b = e.liveTranslationAvailable || e.liveTranslation.pagesByPage.size > 0, g = xl({
    mode: e.mode,
    sourceOnly: e.sourceOnly,
    translatedUrl: r.translatedUrl,
    overlayContentAvailable: b,
    liveTranslationVisible: f,
    assistantOpen: y,
    assistantPdfPane: c
  }), S = g.sourceViewOnly, w = g.visibleMode, [I, L] = k(!1), x = N(() => L(!0), []), D = N(() => L((j) => !j), []), T = wl(
    { jobId: o.jobId, documentId: o.documentId },
    { onAfterAdd: x }
  ), M = N((j) => {
    T.addFromQuote(j), e.clearSelection();
  }, [T.addFromQuote, e.clearSelection]), R = N((j) => {
    e.goToPage(j.page, j.pane === "translated" ? "translated" : "source");
  }, [e.goToPage]), P = N(
    () => T.exportMarkdown(o.title || ""),
    [T.exportMarkdown, o.title]
  );
  O(() => {
    u(null), m(!0), L(!1);
  }, [e.viewStateKey]), O(() => {
    e.session.jobTerminal && m(!1);
  }, [e.session.jobTerminal]), O(() => {
    if (!t.loading) {
      if (v.current !== e.viewStateKey) {
        v.current = e.viewStateKey;
        const j = Te(e.viewStateKey);
        i(Er(e.mode, j)), l(null);
        return;
      }
      At(e.viewStateKey, { assistantPanel: s, splitLayout: null });
    }
  }, [s, t.loading, e.mode, e.viewStateKey]), O(() => {
    if (!(t.loading || t.failed)) {
      if (h.current !== e.viewStateKey) {
        h.current = e.viewStateKey;
        const j = Te(e.viewStateKey), ie = S ? "source" : j == null ? void 0 : j.mode;
        ie && ie !== e.mode && e.setModeKeepingPage(ie);
        return;
      }
      At(e.viewStateKey, { mode: e.mode });
    }
  }, [t.failed, t.loading, e.mode, e.setModeKeepingPage, e.viewStateKey, S]);
  const E = s || (e.mode === "compare" ? "compare" : "reading"), _ = Kt(a.isOpen("favorites")), C = Kt(s === "markdown"), $ = Kt(s === "ai");
  si({
    mode: w,
    sourceOnly: e.sourceOnly,
    setMode: e.setModeKeepingPage,
    userZoom: e.userZoom,
    onZoomChange: e.onZoomChange,
    currentPage: e.currentPage,
    numPages: n.hudNumPages,
    goToPage: e.goToPage,
    enabled: e.showHud
  });
  const B = N(() => {
    a.close();
  }, [a]), X = N((j) => {
    if (j === "notes") {
      D();
      return;
    }
    a.toggle(j);
  }, [D, a]), Y = N(() => {
    i(null), l(null), u(null);
  }, []), re = N((j) => {
    const ie = w === "translated" ? "translated" : "source";
    e.jumpToAnchor(j, ie);
  }, [e.jumpToAnchor, w]), te = N((j) => {
    o.refreshCommittedDocument(j);
  }, [o.refreshCommittedDocument]), se = N((j) => {
    a.close(), l(null), j === "compare" && b ? m(!0) : j !== "compare" && m(!1), e.setModeKeepingPage(j);
  }, [b, e.setModeKeepingPage, a]), U = J(() => !b || !g.showSource ? null : /* @__PURE__ */ p(
    "button",
    {
      type: "button",
      className: `reader-live-translation-toggle${f ? " is-active" : ""}`,
      onClick: () => m((j) => !j),
      "aria-pressed": f,
      title: f ? "隐藏实时译文" : "在原文 PDF 上叠加实时译文",
      children: "译文"
    }
  ), [b, g.showSource, f]), q = N((j) => {
    i(j), j !== "ai" && u(null);
  }, []), oe = N((j) => {
    const ie = j.pane === "translated" && !S ? "translated" : "source";
    u(j), i("ai"), l(ie), e.clearSelection();
  }, [e.clearSelection, S]), ne = J(() => ({
    bindShell: e.shell.bindShell,
    shellEl: e.shell.shellEl,
    shellWidth: e.shell.shellWidth,
    userZoom: e.userZoom,
    onZoomChange: e.onZoomChange,
    rowHeights: e.rowHeights,
    mountSource: e.panes.mountSource,
    mountTranslated: e.panes.mountTranslated,
    onMetrics: e.panes.onMetrics,
    onNumPagesChange: e.panes.onNumPages,
    sourceUrl: e.sessionFiles.sourceUrl,
    translatedUrl: e.sessionFiles.translatedUrl,
    sourceFile: e.sessionFiles.sourceFile,
    translatedFile: e.sessionFiles.translatedFile,
    regions: o.regions,
    readerMetadata: o.readerMetadata,
    activeRegion: e.activeRegion,
    onSelectRegion: e.selectRegion,
    sourceOnly: e.sourceOnly,
    sourceViewOnly: S,
    download: e.download,
    goToPage: e.goToPage,
    assistant: { select: q, close: Y }
  }), [
    e.shell,
    e.userZoom,
    e.onZoomChange,
    e.rowHeights,
    e.panes,
    e.sessionFiles,
    o.regions,
    o.readerMetadata,
    e.activeRegion,
    e.selectRegion,
    e.sourceOnly,
    S,
    e.download,
    e.goToPage,
    q,
    Y
  ]), ue = J(() => ({
    currentPage: e.currentPage,
    numPages: n.hudNumPages
  }), [e.currentPage, n.hudNumPages]), pe = [
    es,
    `is-workspace-${E}`,
    y ? "is-assistant-open" : "",
    g.overlayOnSource ? "is-live-translation-overlay" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(Oi, { value: ne, hud: ue, children: /* @__PURE__ */ z("div", { className: pe, "data-reader-engine": "react-pdf", "data-reader-workspace": E, children: [
    /* @__PURE__ */ p(Bc, { loading: t.loading, failed: t.failed, text: t.text, percent: t.percent, regionsError: !!o.readerErrors.regions, metadataError: !!o.readerErrors.metadata }),
    /* @__PURE__ */ p(fi, { onBeforeClose: o.prepareClose }),
    /* @__PURE__ */ p(
      Ki,
      {
        mode: w,
        documentReady: !!o.jobId,
        sourceViewOnly: S,
        onModeChange: se,
        liveTranslation: b ? {
          visible: f,
          state: e.liveTranslation,
          onToggle: () => m((j) => !j)
        } : null
      }
    ),
    /* @__PURE__ */ p(Vi, { active: s }),
    y ? /* @__PURE__ */ p(zc, {}) : null,
    e.showHud ? /* @__PURE__ */ p(dl, { activeTool: I ? "notes" : a.active, noteCount: T.count, onToggleTool: X }) : null,
    /* @__PURE__ */ p(Hi, { paneComposition: g, markdownSplit: s === "markdown", assistantSplit: y, liveTranslation: e.liveTranslation, sourcePaneAction: U }),
    e.showHud ? /* @__PURE__ */ p(
      fl,
      {
        mode: w,
        modeControls: null
      }
    ) : null,
    /* @__PURE__ */ z(Ro, { fallback: null, children: [
      _ ? /* @__PURE__ */ p(Rl, { open: a.isOpen("favorites"), jobId: o.jobId, documentId: o.documentId, onClose: B, onJumpPage: e.goToPage }) : null,
      C ? /* @__PURE__ */ p(Tl, { open: s === "markdown", jobId: o.jobId, sourceOnly: e.sourceOnly, layout: "workspace", side: "right", onClose: Y }) : null,
      $ ? /* @__PURE__ */ p(Ml, { open: s === "ai", jobId: o.jobId, documentId: o.documentId, sessionIdentity: o.sessionIdentity, layout: El(e.mode), side: "right", selectionContext: d, onClearSelectionContext: () => u(null), onClose: Y, onJumpCitation: re, onDocumentCommitted: te }, o.documentId || o.jobId || "reader-ai-pending") : null
    ] }),
    /* @__PURE__ */ p(
      jc,
      {
        open: I,
        groups: T.groups,
        count: T.count,
        onClose: () => L(!1),
        onJump: R,
        onUpdateNote: T.updateNote,
        onRemove: T.remove,
        onExport: P
      }
    ),
    /* @__PURE__ */ p(Wc, { selection: e.selection, onDismiss: e.clearSelection, onAskAi: oe, onAddNote: M }),
    /* @__PURE__ */ p(Pl, {})
  ] }) });
}
function Vl() {
  return /* @__PURE__ */ p(Nl, {});
}
export {
  bn as A,
  Vl as R,
  Nl as a,
  Oc as b,
  Kl as c,
  lt as d,
  sa as e,
  ql as f,
  _r as g,
  Jl as h,
  Wl as r
};
//# sourceMappingURL=ReaderApp-CunP25lF.js.map
