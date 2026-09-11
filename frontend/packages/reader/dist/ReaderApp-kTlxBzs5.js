var bn = (e) => {
  throw TypeError(e);
};
var yn = (e, t, n) => t.has(e) || bn("Cannot " + n);
var qe = (e, t, n) => (yn(e, t, "read from private field"), n ? n.call(e) : t.get(e)), vn = (e, t, n) => t.has(e) ? bn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), wn = (e, t, n, r) => (yn(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
import { jsxs as C, jsx as m, Fragment as Vt } from "react/jsx-runtime";
import { useMemo as Z, useState as z, useEffect as F, useCallback as A, useRef as L, useLayoutEffect as Ce, memo as Yt, forwardRef as eo, useImperativeHandle as Gt, useSyncExternalStore as to, useId as Xt, createContext as no, useContext as ro, Suspense as oo, lazy as Zt } from "react";
import { getReaderAdapters as ie, requireAdapter as Re } from "./adapters.js";
import { resolveReaderDownloadName as ao, resolveReaderDownloadUrls as io, createReaderServerFavoritesPort as so, READER_PROGRESS_COPY as Se, trimString as Xe, READER_DOWNLOAD_ACTIONS as co, disabledReason as lo } from "./runtime/state.js";
import { d as uo } from "./ask-answerer-GNQdzitl.js";
import "@retainpdf/api/conversations";
import { n as Sn } from "./block-key-BTxcG28S.js";
import { fetchLiveTranslationLayout as fo, LiveTranslationApiError as mt, streamLiveTranslationEvents as po, fetchLiveTranslationPage as mo } from "@retainpdf/api/live-translation";
import { toast as _t, Toaster as ho } from "sonner";
import { X as We, Radio as go, FileText as cr, Columns2 as lr, Languages as ur, FileCode2 as dr, Sparkles as Qt, GripHorizontal as bo, StickyNote as It, Sigma as yo, Table2 as vo, Type as wo, Image as So, Check as Io, Copy as Ro, Keyboard as xo, Bookmark as Po, Download as To } from "lucide-react";
import { pdfjs as Mo, Page as Eo, Document as No } from "react-pdf";
import { e as ko, m as Ao, a as Lo } from "./markdown-math-Cb17EyYs.js";
const zo = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.isMockMode) == null ? void 0 : n.call(t, ...e)) ?? !1;
}, Co = "", _o = Object.freeze({
  progress: "retainpdf-reader-progress"
}), ut = (e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveResourceUrl) == null ? void 0 : n.call(t, e)) ?? e;
}, Do = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.fetchProtected) == null ? void 0 : n.call(t, ...e)) ?? fetch(...e);
}, Dt = (e = "") => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolvePdfjsVendorUrl) == null ? void 0 : n.call(t, e)) ?? "";
}, tt = new Proxy({}, { get: (e, t) => (...n) => {
  var r, a, o;
  return (o = (a = (r = ie()) == null ? void 0 : r.defaultReaderDataPort) == null ? void 0 : a[t]) == null ? void 0 : o.call(a, ...n);
} }), fr = new Proxy({}, { get: (e, t) => (...n) => {
  var r, a, o;
  return (o = (a = (r = ie()) == null ? void 0 : r.defaultReaderPageConfigPort) == null ? void 0 : a[t]) == null ? void 0 : o.call(a, ...n);
} }), $o = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderAnchor) == null ? void 0 : n.call(t, ...e)) ?? null;
}, Fo = () => {
  var e, t;
  return ((t = (e = ie()) == null ? void 0 : e.resolveReaderDocumentId) == null ? void 0 : t.call(e)) ?? "";
}, Oo = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderJobId) == null ? void 0 : n.call(t, ...e)) ?? "";
}, jo = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderArtifactUrl) == null ? void 0 : n.call(t, ...e)) ?? "";
}, Bo = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderSourcePdf) == null ? void 0 : n.call(t, ...e)) ?? null;
}, Uo = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderTranslatedPdfUrl) == null ? void 0 : n.call(t, ...e)) ?? "";
}, Wo = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderDownloadName) == null ? void 0 : n.call(t, ...e)) ?? ao(...e);
}, Ho = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderDownloadUrls) == null ? void 0 : n.call(t, ...e)) ?? io(...e);
}, Jo = (...e) => Re("downloadProtectedResource")(...e), Ko = (...e) => Re("failDownloadToast")(...e), Gc = (e, t) => Re("resolveMarkdownAssetUrl")(e, t), Xc = (e = {}) => {
  const t = ie();
  return uo({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) || "/api/v1",
    ask: t == null ? void 0 : t.askDocumentAi,
    documentByJobId: t == null ? void 0 : t.fetchDocumentByJobId,
    ...e
  });
}, en = "/api/v1", qo = (...e) => Re("fetchDocumentByJobId")(...e), Zc = (e = en, t = {}) => {
  var n;
  return Re("fetchFavorites")(
    ((n = ie()) == null ? void 0 : n.apiPrefix) ?? e,
    t
  );
};
function Qc(e = {}) {
  const t = ie();
  return so({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) ?? en,
    documentByJobId: (...n) => Re("fetchDocumentByJobId")(...n),
    submitFavorite: (...n) => Re("createFavorite")(...n),
    loadFavorites: (...n) => Re("fetchFavorites")(...n),
    removeFavorite: (...n) => Re("deleteFavorite")(...n),
    ...e
  });
}
function Vo() {
  const [e, t] = z(
    () => {
      var n, r;
      return ((n = globalThis.location) == null ? void 0 : n.search) || ((r = globalThis.location) == null ? void 0 : r.href) || "";
    }
  );
  return F(() => {
    var i, s, c, l;
    const n = () => {
      var d, u;
      return t(((d = globalThis.location) == null ? void 0 : d.search) || ((u = globalThis.location) == null ? void 0 : u.href) || "");
    }, r = (s = (i = globalThis.history) == null ? void 0 : i.pushState) == null ? void 0 : s.bind(globalThis.history), a = (l = (c = globalThis.history) == null ? void 0 : c.replaceState) == null ? void 0 : l.bind(globalThis.history);
    let o = !1;
    if (r && a)
      try {
        const d = (u) => function(...f) {
          const p = u.apply(this, f);
          return n(), globalThis.dispatchEvent(new Event("pushstate")), globalThis.dispatchEvent(new Event("replacestate")), globalThis.dispatchEvent(new Event("locationchange")), p;
        };
        globalThis.history.pushState = d(r), globalThis.history.replaceState = d(a), o = !0;
      } catch {
      }
    return window.addEventListener("popstate", n), window.addEventListener("hashchange", n), window.addEventListener("pushstate", n), window.addEventListener("replacestate", n), window.addEventListener("locationchange", n), () => {
      if (window.removeEventListener("popstate", n), window.removeEventListener("hashchange", n), window.removeEventListener("pushstate", n), window.removeEventListener("replacestate", n), window.removeEventListener("locationchange", n), o && r && a)
        try {
          globalThis.history.pushState = r, globalThis.history.replaceState = a;
        } catch {
        }
    };
  }, []), e;
}
function Yo() {
  const e = Vo(), t = Z(() => Oo(fr), [e]), n = Z(() => Fo(), [e]), r = t || n ? `job:${t}|document:${n}` : `location:${e}`;
  return { locationKey: e, jobId: t, routeDocumentId: n, sessionIdentity: r };
}
function Go(e) {
  const {
    routeDocumentId: t,
    jobId: n,
    sessionIdentity: r,
    sessionIdentityRef: a,
    documentIdRef: o,
    sessionJobIdRef: i,
    switchToSourceMode: s
  } = e, [c, l] = z({
    documentId: "",
    jobId: ""
  }), [d, u] = z({
    documentId: "",
    jobId: ""
  }), f = c.documentId === t ? c.jobId : "", p = d.documentId === t ? d.jobId : "", v = n || f, [h, w] = z({
    jobId: "",
    documentId: ""
  }), g = h.jobId === v ? h.documentId : "", b = t || g, I = !!t && !v, [S, P] = z(null), y = (S == null ? void 0 : S.sessionIdentity) === r && S.documentId === b ? S : null, E = I || !!y, N = A((M) => {
    const x = `${M.documentId || ""}`.trim();
    if (!x || o.current && o.current !== x) return;
    if (!o.current && i.current)
      w({
        jobId: i.current,
        documentId: x
      });
    else if (!o.current)
      return;
    const R = `${M.revision || ""}`.trim() || `${Date.now()}`;
    P({
      documentId: x,
      revision: R,
      sessionIdentity: a.current
    }), s();
  }, []);
  F(() => {
    P((M) => M && M.sessionIdentity !== r ? null : M);
  }, [r]);
  const T = A((M) => {
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
        w((x) => x.jobId === M.jobId && x.documentId === M.documentId ? x : { jobId: M.jobId, documentId: M.documentId });
        break;
      case "committed-source":
        P({
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
    rejectedDocumentJobId: p,
    sessionJobId: v,
    resolvedJobDocument: h,
    setResolvedJobDocument: w,
    jobDocumentId: g,
    documentId: b,
    sourceOnly: I,
    committedDocumentSource: S,
    setCommittedDocumentSource: P,
    activeCommittedDocumentSource: y,
    sourceViewOnly: E,
    refreshCommittedDocument: N,
    applyIdentityEvent: T
  };
}
const Xo = /* @__PURE__ */ new Set(["succeeded", "failed", "cancelled", "canceled"]);
function In(e) {
  return `${(e == null ? void 0 : e.status) || ""}`.trim().toLowerCase();
}
function Zo(e) {
  var r, a, o, i;
  if (!e || typeof e != "object") return "";
  const t = e, n = [
    t.document_id,
    t.documentId,
    (r = t.document) == null ? void 0 : r.document_id,
    (a = t.book_summary) == null ? void 0 : a.document_id,
    (i = (o = t.request_payload) == null ? void 0 : o.source) == null ? void 0 : i.document_id
  ];
  for (const s of n) {
    const c = `${s || ""}`.trim();
    if (c) return c;
  }
  return "";
}
function Rn(e, t) {
  const n = `/api/v1/documents/${encodeURIComponent(e)}/source.pdf`, r = `${t || ""}`.trim();
  return ut(r ? `${n}?version=${encodeURIComponent(r)}` : n);
}
function Qo(e, t = "") {
  const n = `${e || ""}`.trim(), r = `${t || ""}`.trim();
  return !!(!n || r && (n === r || n === `${r}.pdf`) || /^\d{8,14}-[0-9a-f]{4,}$/i.test(n));
}
function ea(e, t) {
  var r;
  const n = [
    e == null ? void 0 : e.title,
    e == null ? void 0 : e.display_name,
    e == null ? void 0 : e.source_file_name,
    (r = e == null ? void 0 : e.book_summary) == null ? void 0 : r.source_file_name
  ];
  for (const a of n) {
    const o = `${a || ""}`.trim();
    if (o && !Qo(o, t))
      return o.replace(/\.pdf$/i, "");
  }
  return "";
}
function $t({
  percent: e,
  text: t,
  stage: n
}) {
  var r;
  try {
    (r = window.parent) == null || r.postMessage(
      {
        type: _o.progress,
        stage: n,
        percent: e,
        text: t
      },
      fr.messageTargetOrigin()
    );
  } catch {
  }
}
function ht(e, t, n, r = "progress") {
  e({
    loading: !0,
    percent: t,
    text: n,
    stage: r,
    failed: !1
  }), $t({ percent: t, text: n, stage: r });
}
function ta(e) {
  const {
    sessionJobId: t,
    sessionIdentity: n,
    sessionIdentityRef: r,
    sessionJobIdRef: a,
    sessionEpochRef: o,
    closingRef: i
  } = e, [s, c] = z(null), [l, d] = z(null), [u, f] = z(""), [p, v] = z(0), h = u === n ? s : null, w = u === n ? l : null, g = In(h), b = Xo.has(g), I = A(() => {
    v((T) => T + 1);
  }, []), S = A((T) => {
    c(T.jobPayload), d(T.manifestPayload), f(T.sessionIdentity);
  }, []), P = A((T) => {
    c(null), d(null), f(T);
  }, []), y = L(""), E = L(""), N = A(async () => {
    const T = a.current;
    if (!T || y.current === T) return;
    const M = tt.loadJobPayload;
    if (typeof M != "function") return;
    const x = o.current.value;
    y.current = T;
    try {
      const R = await M(T);
      if (i.current || o.current.value !== x || a.current !== T || !R || typeof R != "object")
        return;
      const k = In(R);
      c(R), f(r.current), k === "succeeded" && E.current !== T && (E.current = T, v((D) => D + 1));
    } catch {
    } finally {
      y.current === T && (y.current = "");
    }
  }, []);
  return F(() => {
    E.current = "";
  }, [n]), F(() => {
    if (!t || b || !h) return;
    const T = window.setInterval(() => {
      N();
    }, 1e3);
    return () => window.clearInterval(T);
  }, [b, N, h, t]), {
    jobPayload: s,
    setJobPayload: c,
    manifestPayload: l,
    setManifestPayload: d,
    payloadSessionIdentity: u,
    setPayloadSessionIdentity: f,
    scopedJobPayload: h,
    scopedManifestPayload: w,
    jobStatus: g,
    jobTerminal: b,
    jobRefreshRevision: p,
    refreshJobArtifacts: I,
    refreshJobStatus: N,
    publishPayload: S,
    clearPayload: P
  };
}
function Ft(e) {
  document.body.classList.remove(
    "reader-mode-source",
    "reader-mode-translated",
    "reader-mode-compare"
  ), document.body.classList.add(`reader-mode-${e}`);
}
function na(e, t) {
  e(t), Ft(t);
}
function ra(e) {
  const [t, n] = z(e ? "source" : "compare"), r = A((o) => {
    e && o !== "source" || (n(o), Ft(o));
  }, [e]), a = A((o) => {
    na(n, o);
  }, []);
  return F(() => (e && document.documentElement.classList.add("reader-source-only"), Ft(t), () => {
    document.documentElement.classList.remove("reader-source-only");
  }), [e, t]), { mode: t, setMode: r, setModeState: n, switchSessionMode: a };
}
function ke(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : null;
}
function pr(e) {
  const t = ke(e);
  return t && "data" in t ? t.data : e;
}
function Ye(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? t : null;
}
function xn(e) {
  const t = ke(e);
  if (!t || !Array.isArray(t.bbox) || t.bbox.length !== 4) return null;
  const n = t.bbox.map(Number);
  if (!n.every(Number.isFinite)) return null;
  const r = Ye(t.page);
  if (r == null) return null;
  const [a, o, i, s] = n, c = Math.min(a, i), l = Math.min(o, s), d = Math.max(a, i), u = Math.max(o, s);
  if (d <= c || u <= l) return null;
  const f = `${t.unit || "pdf_point"}`.trim().toLowerCase();
  if (f !== "pdf_point" && f !== "pt") return null;
  const p = `${t.origin || "top_left"}`.trim().toLowerCase();
  return p !== "top_left" && p !== "bottom_left" ? null : {
    page: Math.floor(r),
    bbox: [c, l, d, u],
    unit: "pdf_point",
    origin: p,
    text: `${t.text || ""}`
  };
}
function oa(e) {
  const t = ke(pr(e)), n = Array.isArray(t == null ? void 0 : t.items) ? t.items : [], r = [];
  for (const a of n) {
    const o = ke(a), i = `${(o == null ? void 0 : o.item_id) || (o == null ? void 0 : o.itemId) || ""}`.trim(), s = xn(o == null ? void 0 : o.source), c = xn(o == null ? void 0 : o.translated);
    !i || !s || !c || r.push({
      itemId: i,
      source: s,
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
function aa(e) {
  const t = `${e || ""}`.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return t.includes("formula") || t.includes("equation") ? "formula" : t.includes("table") ? "table" : t.includes("figure") || t.includes("image") || t.includes("chart") || t.includes("seal") ? "figure" : t.includes("text") || t.includes("title") || t.includes("paragraph") || t.includes("reference") || t.includes("caption") ? "text" : "region";
}
function tn(e) {
  const t = aa(e.regionType);
  if (t !== "region") return t;
  if (e.assetIds.length || e.assetUrls.length) return "figure";
  const n = `${e.markdown || e.source.text || e.translated.text || ""}`.trim();
  return /^<table(?:\s|>)/i.test(n) || /\n\s*\|?\s*:?-{3,}/.test(n) ? "table" : /^\$\$[\s\S]+\$\$$/.test(n) || /^\\\[[\s\S]+\\\]$/.test(n) || /^\\begin\{(?:equation|align|gather|multline)\*?\}/.test(n) ? "formula" : n ? "text" : t;
}
function mr(e) {
  const t = tn(e);
  return t === "formula" || t === "table" || t === "figure";
}
function hr(e, t) {
  return `${gt(e, t).text || e.markdown || ""}`.trim();
}
function ia(e) {
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
function Pn(e) {
  const t = ke(e);
  if (!t) return null;
  const n = [];
  for (const a of Array.isArray(t.pages) ? t.pages : []) {
    const o = ke(a), i = Ye(o == null ? void 0 : o.page), s = Ye(o == null ? void 0 : o.width), c = Ye(o == null ? void 0 : o.height);
    i == null || s == null || c == null || n.push({ page: Math.floor(i), width: s, height: c });
  }
  if (!n.length) return null;
  const r = Ye(t.page_count ?? t.pageCount);
  return {
    pageCount: r == null ? n.length : Math.floor(r),
    pages: n
  };
}
function sa(e) {
  const t = ke(pr(e));
  return {
    source: Pn(t == null ? void 0 : t.source),
    translated: Pn(t == null ? void 0 : t.translated)
  };
}
function dt(e, t) {
  const n = Sn(t);
  return n && e.find((r) => Sn(r.itemId) === n) || null;
}
function ft(e) {
  return `${e || ""}`.normalize("NFKC").toLocaleLowerCase().replace(/[\p{P}\p{S}\s]+/gu, "").trim();
}
function ca(e) {
  const t = `${e || ""}`.trim();
  if (!t) return [];
  const n = t.split(/\n\s*\n/g).map(ft).filter(Boolean), r = t.split(">").map(ft).filter(Boolean), a = [...n.reverse(), ...r.reverse(), ft(t)];
  return [...new Set(a)].filter((o) => o.length >= 16);
}
function la(e, t) {
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
function ua(e, t) {
  if (!t) return null;
  const n = dt(e, t.block_id);
  if (n) return n;
  const r = ca(t.snippet);
  if (!r.length) return null;
  const a = t.page_idx != null ? Number(t.page_idx) + 1 : t.page != null ? Number(t.page) : null, o = Number.isFinite(a) && Number(a) >= 1 ? e.filter((l) => l.source.page === Math.floor(Number(a)) || l.translated.page === Math.floor(Number(a))) : e;
  let i = null, s = 0, c = !1;
  for (const l of o) {
    const d = [l.source.text, l.translated.text, l.markdown].map(ft).filter(Boolean);
    let u = 0;
    for (const f of r)
      for (const p of d)
        u = Math.max(u, la(p, f));
    u > s ? (i = l, s = u, c = !1) : u > 0 && u === s && (c = !0);
  }
  return s > 0 && !c ? i : null;
}
function Tn(e) {
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
function da(e, t, n) {
  const r = Tn(t);
  if (!r) return null;
  const a = Number(n);
  return (Number.isFinite(a) && a >= 1 ? e.filter((i) => i.source.page === Math.floor(a)) : e).find((i) => [...i.assetUrls, ...i.assetIds].some((s) => {
    const c = Tn(s);
    return !!c && (c === r || r.endsWith(`/${c}`) || c.endsWith(`/${r}`));
  })) || null;
}
function gt(e, t) {
  return t === "translated" ? e.translated : e.source;
}
function Mn(e, t, n) {
  if (!e || !t) return null;
  const r = gt(e, n), a = n === "translated" ? t.translated : t.source || t.translated, o = a == null ? void 0 : a.pages.find((i) => i.page === r.page);
  return o ? { itemId: e.itemId, region: e, box: r, pageSize: o } : null;
}
function Rt(e, t, n) {
  if (!e || t <= 0 || n <= 0) return null;
  const { box: r, pageSize: a } = e;
  if (a.width <= 0 || a.height <= 0) return null;
  const [o, i, s, c] = r.bbox, l = r.origin === "bottom_left" ? a.height - c : i, d = r.origin === "bottom_left" ? a.height - i : c, u = Math.max(0, Math.min(t, o / a.width * t)), f = Math.max(u, Math.min(t, s / a.width * t)), p = Math.max(0, Math.min(n, l / a.height * n)), v = Math.max(p, Math.min(n, d / a.height * n));
  return f <= u || v <= p ? null : { left: u, top: p, width: f - u, height: v - p };
}
function En(e) {
  return typeof e == "string" ? e.trim() : `${e ?? ""}`.trim();
}
function fa(e) {
  const t = (e == null ? void 0 : e.data) ?? e, n = t && typeof t == "object" ? t : {};
  return {
    activeJobId: En(n.active_job_id),
    activeVersionId: En(n.active_version_id)
  };
}
function pa(e) {
  const { link: t, rejectedDocumentJobId: n, hasCommittedSource: r } = e, a = t.activeJobId && t.activeJobId !== n && !t.activeJobId.startsWith("doc:") ? t.activeJobId : "";
  return a ? { kind: "follow-active-job", jobId: a, activeVersionId: t.activeVersionId } : t.activeVersionId && !r ? { kind: "open-committed-source", documentId: "", revision: t.activeVersionId } : { kind: "open-source-url" };
}
function ma(e) {
  const {
    payloadDocumentId: t,
    linkedActiveJobId: n,
    linkedActiveVersionId: r,
    sessionJobId: a,
    hasCommittedSource: o
  } = e;
  return t && r && n === a && !o ? { kind: "restore-committed-source", documentId: t, revision: r } : { kind: "open-job-artifacts" };
}
function ha(e) {
  return e.status === 404 && !e.jobId && !!e.routeDocumentId && !!e.documentJobId && e.sessionJobId === e.documentJobId;
}
function ga(e) {
  return e ? { data: e.data.slice() } : null;
}
const ba = 2, ge = /* @__PURE__ */ new Map();
function Ot(e, t) {
  ge.delete(e), ge.set(e, t);
}
function ya(e) {
  if (ge.size < ba) return;
  const t = ge.keys().next().value;
  t && ge.delete(t);
}
function Pt(e) {
  const t = `${e || ""}`.trim();
  if (!t || !ge.has(t)) return null;
  const n = ge.get(t);
  return Ot(t, n), n;
}
async function gr(e, t = Do, n = {}) {
  const r = `${e || ""}`.trim();
  if (!r)
    return null;
  if (ge.has(r)) {
    const s = ge.get(r);
    return Ot(r, s), s;
  }
  const a = await t(r, { signal: n.signal });
  if (!a.ok) {
    const s = new Error(`读取 PDF 失败 (${a.status})`);
    throw s.status = a.status, s;
  }
  const o = await a.arrayBuffer(), i = { data: new Uint8Array(o) };
  return ge.has(r) ? Ot(r, i) : (ya(), ge.set(r, i)), i;
}
function va(e = "", t = null) {
  const [n, r] = z(
    () => t || Pt(e)
  ), [a, o] = z(
    () => !!`${e || ""}`.trim() && !t && !Pt(e)
  ), [i, s] = z("");
  return F(() => {
    if (t) {
      r(t), o(!1), s("");
      return;
    }
    const c = `${e || ""}`.trim();
    if (!c) {
      r(null), o(!1), s("");
      return;
    }
    const l = Pt(c);
    if (l) {
      r(l), o(!1), s("");
      return;
    }
    let d = !1;
    return o(!0), s(""), r(null), gr(c).then((u) => {
      d || (r(u), o(!1));
    }).catch((u) => {
      d || (r(null), o(!1), s((u == null ? void 0 : u.message) || String(u)));
    }), () => {
      d = !0;
    };
  }, [e, t]), { file: n, loading: a, error: i };
}
function wa(e) {
  const { sessionEpochRef: t, closingRef: n, abort: r, sessionEpoch: a } = e;
  let o = !1;
  const i = () => r.signal.aborted || n.current || t.current.value !== a;
  return {
    signal: r.signal,
    isClosedOrStale: i,
    isInactive: () => o || i(),
    markFailed: () => {
      o = !0;
    }
  };
}
async function jt(e) {
  const { url: t, label: n, percentStart: r, percentEnd: a, fence: o, setBoot: i } = e;
  if (!t || o.isInactive())
    return null;
  ht(i, r, n, "download");
  const s = await gr(t, tt.fetchProtected, {
    signal: o.signal
  });
  return o.isInactive() ? null : (ht(i, a, n, "download"), s);
}
async function Sa(e) {
  const { sourceFinal: t, translatedFinal: n, fence: r, setBoot: a } = e;
  ht(a, 25, "正在下载 PDF…", "download");
  const o = [];
  let i = null, s = null;
  return t && o.push(
    jt({
      url: t,
      label: "正在下载原文 PDF…",
      percentStart: 30,
      percentEnd: 55,
      fence: r,
      setBoot: a
    }).then((d) => {
      i = d;
    })
  ), n && o.push(
    jt({
      url: n,
      label: "正在下载译文 PDF…",
      percentStart: 55,
      percentEnd: 85,
      fence: r,
      setBoot: a
    }).then((d) => {
      s = d;
    })
  ), await Promise.all(o), r.isInactive() ? { status: "inactive" } : !!t && !i || !!n && !s ? { status: "incomplete" } : { status: "downloaded", sourceBytes: i, translatedBytes: s };
}
function Ia(e) {
  const {
    sessionJobId: t,
    jobId: n,
    routeDocumentId: r,
    documentJobId: a,
    rejectedDocumentJobId: o,
    sourceOnly: i,
    locationKey: s,
    sessionIdentity: c,
    committedSource: l,
    applyIdentityEvent: d,
    publishPayload: u,
    clearPayload: f,
    switchSessionMode: p,
    jobRefreshRevision: v,
    sessionEpochRef: h,
    closingRef: w,
    activeLoadAbortRef: g
  } = e, [b, I] = z(""), [S, P] = z(""), [y, E] = z(null), [N, T] = z(null), [M, x] = z(!1), [R, k] = z(""), [D, O] = z([]), [_, B] = z(() => ({
    source: null,
    translated: null
  })), [H, X] = z({
    loading: !0,
    percent: 4,
    text: Se.boot,
    stage: "progress",
    failed: !1
  });
  return F(() => {
    const W = new AbortController(), oe = h.current.value, te = wa({
      sessionEpochRef: h,
      closingRef: w,
      abort: W,
      sessionEpoch: oe
    });
    if (g.current = W, w.current)
      return W.abort(), () => {
        g.current === W && (g.current = null);
      };
    function j(q, J) {
      te.markFailed(), X({
        loading: !1,
        percent: 100,
        text: q,
        stage: "failed",
        failed: !0
      }), $t({ percent: 100, text: J, stage: "failed" });
    }
    function ne() {
      x(!0), X({
        loading: !1,
        percent: 100,
        text: Se.ready,
        stage: "ready",
        failed: !1
      }), $t({ percent: 100, text: Se.ready, stage: "ready" });
    }
    function pe() {
      return l != null && l.documentId ? Rn(
        l.documentId,
        l.revision
      ) : zo() ? Co : ut(`/api/v1/documents/${encodeURIComponent(r)}/source.pdf`);
    }
    async function re() {
      let q = { activeJobId: "", activeVersionId: "" };
      try {
        const me = await tt.fetchProtected(
          ut(`/api/v1/documents/${encodeURIComponent(r)}`)
        );
        if (me != null && me.ok) {
          const Je = await me.json().catch(() => null);
          q = fa(Je);
        }
      } catch {
      }
      const J = pa({
        link: q,
        rejectedDocumentJobId: o,
        hasCommittedSource: !!l
      });
      if (J.kind === "follow-active-job") {
        if (te.isInactive()) return;
        d({
          type: "resolved-document-job",
          documentId: r,
          jobId: J.jobId
        }), J.activeVersionId ? (l || d({
          type: "committed-source",
          documentId: r,
          revision: J.activeVersionId,
          sessionIdentity: c
        }), p("source")) : p("compare");
        return;
      }
      if (J.kind === "open-committed-source") {
        if (te.isInactive()) return;
        d({
          type: "committed-source",
          documentId: r,
          revision: J.revision,
          sessionIdentity: c
        }), p("source");
        return;
      }
      const ue = pe();
      if (te.isInactive()) return;
      I(ue), P(""), k(""), f(c);
      const de = await jt({
        url: ue,
        label: "正在下载原文 PDF…",
        percentStart: 30,
        percentEnd: 85,
        fence: te,
        setBoot: X
      });
      if (!te.isInactive()) {
        if (!de) {
          j("源文件不可用：该文档没有可读取的源 PDF。", "源文件下载失败");
          return;
        }
        E(de), ne();
      }
    }
    async function U() {
      const q = await tt.loadReaderPayload(t, {
        // committedSource 分支会丢弃 regions/metadata（旧页序已失效），
        // 直接跳过这两个可选请求，避免无效网络往返。
        includeOptionalArtifacts: !l
      });
      if (te.isInactive()) return;
      let J = null;
      if (n && !r) {
        try {
          J = await qo(en, t);
        } catch {
        }
        if (te.isInactive()) return;
      }
      const ue = Zo(q.jobPayload) || `${(J == null ? void 0 : J.document_id) || ""}`.trim();
      ue && !r && d({
        type: "resolved-job-document",
        jobId: t,
        documentId: ue
      });
      const de = ma({
        payloadDocumentId: ue,
        linkedActiveJobId: `${(J == null ? void 0 : J.active_job_id) || ""}`.trim(),
        linkedActiveVersionId: `${(J == null ? void 0 : J.active_version_id) || ""}`.trim(),
        sessionJobId: t,
        hasCommittedSource: !!l
      });
      if (de.kind === "restore-committed-source") {
        if (te.isInactive()) return;
        d({
          type: "committed-source",
          documentId: de.documentId,
          revision: de.revision,
          sessionIdentity: c
        }), p("source");
        return;
      }
      const me = Bo(q.manifestPayload), Je = Uo(q.jobPayload, q.manifestPayload), at = typeof me == "string" ? me : jo(me), it = r || ue, Ke = l != null && l.documentId ? Rn(
        l.documentId,
        l.revision
      ) : at || (it ? ut(`/api/v1/documents/${encodeURIComponent(it)}/source.pdf`) : ""), ve = l ? "" : Je || "";
      if (I(Ke || ""), P(ve), k(ea(q.jobPayload, t)), u({
        jobPayload: q.jobPayload || null,
        manifestPayload: q.manifestPayload || null,
        sessionIdentity: c
      }), O(l ? [] : oa(q.regionsPayload)), B(l ? { source: null, translated: null } : sa(q.readerMetadata)), !Ke && !ve) {
        j(Se.failed, Se.failed);
        return;
      }
      const we = await Sa({
        sourceFinal: Ke || "",
        translatedFinal: ve,
        fence: te,
        setBoot: X
      });
      if (we.status !== "inactive") {
        if (we.status === "incomplete") {
          j("PDF 下载失败，请重试", "PDF 下载失败");
          return;
        }
        E(we.sourceBytes), T(we.translatedBytes), ne();
      }
    }
    async function se() {
      x(!1), E(null), T(null), O([]), B({ source: null, translated: null }), ht(X, 8, Se.metadata, "metadata");
      try {
        if (i) {
          await re();
          return;
        }
        if (!t) {
          j(Se.failed, Se.failed);
          return;
        }
        await U();
      } catch (q) {
        if (te.isClosedOrStale() || (q == null ? void 0 : q.name) === "AbortError") return;
        te.markFailed();
        const J = Number(q == null ? void 0 : q.status);
        if (ha({
          status: J,
          jobId: n,
          routeDocumentId: r,
          documentJobId: a,
          sessionJobId: t
        })) {
          d({ type: "missing-document-job", documentId: r, jobId: t }), d({ type: "cleared-resolved-document-job" }), p("source");
          return;
        }
        const ue = q instanceof Error ? q.message : Se.failed;
        j(ue, ue);
      }
    }
    return se(), () => {
      W.abort(), g.current === W && (g.current = null);
    };
  }, [t, r, a, o, i, s, l, v, n, c, d, u, f, p]), {
    sourceUrl: b,
    translatedUrl: S,
    sourceFile: y,
    translatedFile: N,
    assetsReady: M,
    title: R,
    regions: D,
    readerMetadata: _,
    boot: H
  };
}
function Ra() {
  const e = L(!1), t = L(null), { locationKey: n, jobId: r, routeDocumentId: a, sessionIdentity: o } = Yo(), i = L({ identity: "", value: 0 });
  i.current.identity !== o && (i.current = {
    identity: o,
    value: i.current.value + 1
  }, e.current = !1);
  const s = L(o), c = L(""), l = L(""), d = L(() => {
  }), u = A(() => d.current(), []), f = Go({
    routeDocumentId: a,
    jobId: r,
    sessionIdentity: o,
    sessionIdentityRef: s,
    documentIdRef: c,
    sessionJobIdRef: l,
    switchToSourceMode: u
  }), {
    sessionJobId: p,
    documentId: v,
    sourceOnly: h,
    sourceViewOnly: w
  } = f, { mode: g, setMode: b, switchSessionMode: I } = ra(w);
  d.current = () => {
    I("source");
  }, s.current = o, c.current = v, l.current = p;
  const S = ta({
    sessionJobId: p,
    sessionIdentity: o,
    sessionIdentityRef: s,
    sessionJobIdRef: l,
    sessionEpochRef: i,
    closingRef: e
  }), {
    scopedJobPayload: P,
    scopedManifestPayload: y,
    jobStatus: E,
    jobTerminal: N,
    jobRefreshRevision: T,
    refreshJobArtifacts: M,
    refreshJobStatus: x
  } = S, R = Ia({
    sessionJobId: p,
    jobId: r,
    routeDocumentId: a,
    documentJobId: f.documentJobId,
    rejectedDocumentJobId: f.rejectedDocumentJobId,
    sourceOnly: h,
    locationKey: n,
    sessionIdentity: o,
    committedSource: f.activeCommittedDocumentSource,
    applyIdentityEvent: f.applyIdentityEvent,
    publishPayload: S.publishPayload,
    clearPayload: S.clearPayload,
    switchSessionMode: I,
    jobRefreshRevision: T,
    sessionEpochRef: i,
    closingRef: e,
    activeLoadAbortRef: t
  }), k = A(() => {
    var O;
    e.current = !0, (O = t.current) == null || O.abort();
  }, []), D = Z(
    () => ({
      fetchProtected: tt.fetchProtected,
      jobId: p,
      jobPayload: P,
      manifestPayload: y,
      sourceUrl: R.sourceUrl,
      translatedUrl: R.translatedUrl,
      sourceOnly: w
    }),
    [p, P, y, R.sourceUrl, R.translatedUrl, w]
  );
  return {
    jobId: p,
    jobStatus: E,
    workflow: `${(P == null ? void 0 : P.workflow) || ""}`.trim().toLowerCase(),
    jobTerminal: N,
    documentId: v,
    sourceOnly: h,
    mode: g,
    setMode: b,
    sourceUrl: R.sourceUrl,
    translatedUrl: R.translatedUrl,
    sourceFile: R.sourceFile,
    translatedFile: R.translatedFile,
    assetsReady: R.assetsReady,
    boot: R.boot,
    title: R.title,
    regions: R.regions,
    readerMetadata: R.readerMetadata,
    download: D,
    refreshJobArtifacts: M,
    refreshJobStatus: x,
    refreshCommittedDocument: f.refreshCommittedDocument,
    prepareClose: k
  };
}
const br = 0.25, yr = 1, xa = 0.05, nn = 0.5, Pa = 16, Ta = 8;
function Ze(e) {
  return nn;
}
function xt(e) {
  return Number.isFinite(e) ? Math.min(yr, Math.max(br, e)) : nn;
}
function nt(e, t) {
  const n = xt(Number(e) + t * xa);
  return Math.round(n * 100) / 100;
}
function Ma(e) {
  return Math.round(xt(e) * 100);
}
function Ea(e) {
  const n = (Number(e) || 0) - Pa - Ta;
  return Math.max(160, Math.floor(n));
}
function Na(e, t = nn) {
  const n = xt(t);
  return Ea((Number(e) || 0) * n);
}
function ka(e, t) {
  if (!e || !Number.isFinite(t) || t <= 0 || Math.abs(t - 1) < 1e-3)
    return;
  const n = e.scrollLeft + e.clientWidth / 2, r = e.scrollTop + e.clientHeight / 2, a = Array.from(
    e.querySelectorAll("[data-reader-pane]")
  ).map((i) => ({
    pane: i,
    cx: i.scrollLeft + i.clientWidth / 2,
    hadOverflow: i.scrollWidth > i.clientWidth + 1
  })), o = () => {
    e.scrollLeft = Math.max(0, n * t - e.clientWidth / 2), e.scrollTop = Math.max(0, r * t - e.clientHeight / 2);
    for (const { pane: i, cx: s, hadOverflow: c } of a) {
      const l = Math.max(0, i.scrollWidth - i.clientWidth);
      if (l <= 0) {
        i.scrollLeft = 0;
        continue;
      }
      c ? i.scrollLeft = Math.min(
        l,
        Math.max(0, s * t - i.clientWidth / 2)
      ) : i.scrollLeft = l / 2;
    }
  };
  requestAnimationFrame(() => {
    requestAnimationFrame(o);
  });
}
const bt = "data-reader-page", Aa = "data-reader-pane", La = "reader-scroll-shell", za = "reader-react-scroll-shell", rn = "reader-react-pdf-page-slot";
function yt(e, t) {
  const n = e != null ? `[${bt}="${e}"]` : `[${bt}]`;
  return t ? `${n}[${Aa}="${t}"]` : n;
}
function Ca() {
  return `.${rn}[${bt}]`;
}
function vr(e) {
  return Number(e.getAttribute(bt));
}
const on = 48;
function wr(e, t = on) {
  return e.getBoundingClientRect().top + t;
}
function Sr(e, t) {
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
  const a = vr(n);
  if (!Number.isFinite(a) || a < 1)
    return null;
  const o = n.getBoundingClientRect(), i = o.height > 0 ? o.height : 1, s = Math.min(1, Math.max(0, (t - o.top) / i));
  return { el: n, page: a, fraction: s };
}
function Tt(e, t, n = on) {
  if (!e)
    return null;
  const r = yt(void 0, t), a = Array.from(e.querySelectorAll(r));
  if (!a.length || e.getBoundingClientRect().height <= 0)
    return null;
  const i = wr(e, n), s = Sr(a, i);
  return s ? { page: s.page, fraction: s.fraction } : null;
}
function an(e, t, n = "auto", r, a = on) {
  if (!e || !t)
    return !1;
  const o = Math.max(1, Math.floor(Number(t.page) || 1)), i = Math.min(1, Math.max(0, Number(t.fraction) || 0));
  let s = null;
  if (r && (s = e.querySelector(yt(o, r))), s || (s = e.querySelector(yt(o))), !s)
    return !1;
  const c = e.getBoundingClientRect(), l = s.getBoundingClientRect();
  if (c.height <= 0 || l.height < 8 && s.offsetHeight < 8)
    return !1;
  const d = l.height > 0 ? l.height : s.offsetHeight, u = e.scrollTop + (l.top - c.top), f = Math.max(0, u + i * d - a);
  return n === "auto" ? e.scrollTop = f : e.scrollTo({ top: f, behavior: n }), !0;
}
function _a(e, t, n = "smooth", r) {
  return an(
    e,
    { page: t, fraction: 0 },
    n,
    r
  );
}
function Bt(e, t, n) {
  const r = (n == null ? void 0 : n.behavior) ?? "auto", a = (n == null ? void 0 : n.delaysMs) ?? [0, 32, 120, 280];
  let o = !1, i = !1;
  const s = [], c = () => {
    var d;
    if (o) return;
    an(
      e(),
      t,
      r,
      n == null ? void 0 : n.pane
    ) && !i && (i = !0, (d = n == null ? void 0 : n.onDone) == null || d.call(n));
  };
  for (const l of a)
    l <= 0 ? requestAnimationFrame(() => {
      requestAnimationFrame(c);
    }) : s.push(setTimeout(c, l));
  return () => {
    o = !0;
    for (const l of s)
      clearTimeout(l);
  };
}
function Da(e, t, n) {
  return Bt(
    e,
    { page: t, fraction: 0 },
    n
  );
}
function vt(e, t) {
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
const $a = [
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
], Fa = [
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
function Oa(e) {
  const t = e.length === 1 ? e.toLowerCase() : e;
  for (const n of $a)
    if (n.keys.some(
      (a) => a.length === 1 ? a === t : a === e
    )) return n;
  return null;
}
function ja(e) {
  if (!(e instanceof HTMLElement))
    return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function Ba(e) {
  const {
    mode: t,
    sourceOnly: n,
    setMode: r,
    userZoom: a,
    onZoomChange: o,
    currentPage: i,
    numPages: s,
    goToPage: c,
    enabled: l = !0
  } = e;
  F(() => {
    if (!l)
      return;
    const d = (u) => {
      if (u.defaultPrevented || u.metaKey || u.ctrlKey || u.altKey || ja(u.target))
        return;
      const f = u.key, p = Oa(f);
      if (p) {
        if (p.mode) {
          if (n && p.mode !== "source")
            return;
          u.preventDefault(), r(p.mode);
          return;
        }
        if (!(p.requiresPages && s <= 0))
          switch (u.preventDefault(), p.action) {
            case "zoom-in":
              o(nt(a, 1));
              return;
            case "zoom-out":
              o(nt(a, -1));
              return;
            case "zoom-reset":
              o(Ze());
              return;
            case "next-page":
              c(vt(i + 1, s));
              return;
            case "prev-page":
              c(vt(i - 1, s));
              return;
            case "first-page":
              c(1);
              return;
            case "last-page":
              c(s);
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
    i,
    s,
    c
  ]);
}
const Ua = 160, Wa = 8, Ha = 960;
function Ja() {
  const e = L(null), [t, n] = z(null), [r, a] = z(Ha), o = A((i) => {
    e.current = i, n(i);
  }, []);
  return F(() => {
    const i = t;
    if (!i || typeof ResizeObserver > "u")
      return;
    const s = (l) => {
      !Number.isFinite(l) || l < Ua || a((d) => Math.abs(d - l) < Wa ? d : l);
    }, c = new ResizeObserver((l) => {
      var d, u;
      s(((u = (d = l[0]) == null ? void 0 : d.contentRect) == null ? void 0 : u.width) ?? i.clientWidth);
    });
    return c.observe(i), s(i.clientWidth), () => c.disconnect();
  }, [t]), {
    shellRef: e,
    shellEl: t,
    shellWidth: r,
    bindShell: o
  };
}
function Ka(e) {
  const { mode: t, sourceOnly: n, assetsReady: r, hasSource: a, hasTranslated: o } = e, i = r && a, s = r && o && !n, c = t === "source" || t === "compare", l = !n && (t === "translated" || t === "compare");
  return {
    mountSource: i,
    mountTranslated: s,
    showSource: c,
    showTranslated: l,
    compareMode: t === "compare" && c && l && i && s,
    primaryPane: t === "translated" ? "translated" : "source"
  };
}
const Mt = { source: 0, translated: 0 };
function qa(e, t) {
  const {
    mode: n,
    sourceOnly: r,
    assetsReady: a,
    sourceUrl: o,
    translatedUrl: i,
    sourceFile: s,
    translatedFile: c
  } = e, l = `${(t == null ? void 0 : t.identityKey) || ""}\0${o}\0${i}`, d = L(l);
  d.current = l;
  const [u, f] = z(() => ({
    identity: l,
    pages: Mt
  })), [p, v] = z(() => ({ identity: l, tick: 0 })), h = u.identity === l ? u.pages : Mt, w = p.identity === l ? p.tick : 0, g = Ka({
    mode: n,
    sourceOnly: r,
    assetsReady: a,
    hasSource: !!s || !!o,
    hasTranslated: !!c
  }), { primaryPane: b } = g, I = A((x, R) => {
    d.current === l && f((k) => {
      const D = k.identity === l ? k.pages : Mt;
      return D[R] === x && k.identity === l ? k : {
        identity: l,
        pages: { ...D, [R]: x }
      };
    });
  }, [l]), S = L(null), P = A(() => {
    S.current && clearTimeout(S.current);
    const x = l;
    S.current = setTimeout(() => {
      S.current = null, d.current === x && v((R) => ({
        identity: x,
        tick: R.identity === x ? R.tick + 1 : 1
      }));
    }, 60);
  }, [l]);
  F(() => (S.current && (clearTimeout(S.current), S.current = null), f((x) => x.identity === l && x.pages.source === 0 && x.pages.translated === 0 ? x : { identity: l, pages: { source: 0, translated: 0 } }), v((x) => x.identity === l && x.tick === 0 ? x : { identity: l, tick: 0 }), () => {
    S.current && (clearTimeout(S.current), S.current = null);
  }), [l]);
  const y = Z(
    () => Math.max(h.source, h.translated),
    [h]
  ), E = b === "translated" ? h.translated : h.source || h.translated, N = t == null ? void 0 : t.userZoom, T = t == null ? void 0 : t.shellWidth, M = `${l}-${w}-${N}-${n}-${h.source}-${h.translated}-${T}`;
  return {
    ...g,
    numPagesByPane: h,
    hudNumPages: y,
    primaryNumPages: E,
    metricsTick: w,
    onNumPages: I,
    onMetrics: P,
    rowSyncRevision: M
  };
}
const Va = "retainpdf:reader:view:v1:", Nn = /* @__PURE__ */ new Set([
  "source",
  "translated",
  "markdown",
  "ai"
]), Ya = /* @__PURE__ */ new Set([
  "source",
  "compare",
  "translated"
]);
function Ir() {
  try {
    return typeof globalThis.localStorage > "u" ? null : globalThis.localStorage;
  } catch {
    return null;
  }
}
function Ut(e) {
  return `${e || ""}`.trim();
}
function Ga({
  documentId: e,
  jobId: t
}) {
  const n = Ut(e);
  if (n) return `document:${n}`;
  const r = Ut(t);
  return r ? `job:${r}` : "";
}
function Rr(e) {
  const t = Ut(e);
  return t ? `${Va}${t}` : "";
}
function Xa(e) {
  if (!e || typeof e != "object") return;
  const t = Math.floor(Number(e.page)), n = Number(e.fraction);
  if (!(!Number.isFinite(t) || t < 1 || !Number.isFinite(n)))
    return {
      page: t,
      fraction: Math.max(0, Math.min(1, n))
    };
}
function Za(e) {
  if (e === null) return null;
  if (!e || typeof e != "object") return;
  const t = `${e.left || ""}`, n = `${e.right || ""}`;
  if (!(!Nn.has(t) || !Nn.has(n) || t === n))
    return { left: t, right: n };
}
function Qa(e) {
  return e === null ? null : e === "markdown" || e === "ai" ? e : void 0;
}
function ei(e) {
  return Ya.has(e) ? e : void 0;
}
function xr(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (t.schema !== "retainpdf_reader_view_v1") return null;
  const n = Xa(t.anchor), r = Number(t.zoom), a = ei(t.mode), o = Za(t.splitLayout), i = Qa(t.assistantPanel);
  return {
    schema: "retainpdf_reader_view_v1",
    ...n ? { anchor: n } : {},
    ...Number.isFinite(r) ? { zoom: Math.max(0.25, Math.min(1, r)) } : {},
    ...a !== void 0 ? { mode: a } : {},
    ...o !== void 0 ? { splitLayout: o } : {},
    ...i !== void 0 ? { assistantPanel: i } : {},
    updatedAt: Number.isFinite(Number(t.updatedAt)) ? Number(t.updatedAt) : 0
  };
}
function xe(e, t = Ir()) {
  const n = Rr(e);
  if (!n || !t) return null;
  try {
    const r = t.getItem(n);
    return r ? xr(JSON.parse(r)) : null;
  } catch {
    return null;
  }
}
function wt(e, t, n = Ir()) {
  const r = Rr(e);
  if (!r || !n) return null;
  const a = xe(e, n), o = xr({
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
function ti(e, t, n = "") {
  const [r, a] = z(() => {
    var u;
    return ((u = xe(n)) == null ? void 0 : u.zoom) ?? Ze();
  }), o = L(r), i = L(n);
  o.current = r;
  const s = L(1);
  F(() => {
    var f;
    if (i.current === n) return;
    i.current = n;
    const u = ((f = xe(n)) == null ? void 0 : f.zoom) ?? Ze();
    s.current = 1, o.current = u, a(u);
  }, [e, n]);
  const c = A((u) => {
    const f = xt(u), p = o.current;
    Math.abs(f - p) < 5e-4 || (s.current = f / (p || 1), wt(i.current, { zoom: f }), a(f));
  }, []), l = A((u) => {
    c(nt(o.current, u));
  }, [c]), d = A((u) => {
    c(Ze());
  }, [c]);
  return Ce(() => {
    const u = s.current;
    Math.abs(u - 1) < 1e-3 || (s.current = 1, ka(t == null ? void 0 : t.current, u));
  }, [r, t]), { userZoom: r, onZoomChange: c, stepZoom: l, resetZoom: d };
}
function ni(e, t = !0) {
  const [n, r] = z(null), a = A(() => {
    var s, c;
    r(null);
    const i = (s = globalThis.getSelection) == null ? void 0 : s.call(globalThis);
    (c = i == null ? void 0 : i.removeAllRanges) == null || c.call(i);
  }, []), o = e.current ?? null;
  return F(() => {
    if (!t)
      return;
    const i = () => {
      var O, _;
      const h = e.current, w = (O = globalThis.getSelection) == null ? void 0 : O.call(globalThis);
      if (!h || !w || w.isCollapsed || !w.rangeCount) {
        r(null);
        return;
      }
      const g = w.getRangeAt(0);
      if (!h.contains(g.commonAncestorContainer)) {
        r(null);
        return;
      }
      const b = `${w.toString() || ""}`.replace(/\s+/g, " ").trim();
      if (b.length < 2) {
        r(null);
        return;
      }
      let I = g.commonAncestorContainer;
      I.nodeType === Node.TEXT_NODE && (I = I.parentElement);
      const S = (_ = I == null ? void 0 : I.closest) == null ? void 0 : _.call(
        I,
        "[data-reader-page]"
      );
      if (!S || !h.contains(S)) {
        r(null);
        return;
      }
      const P = Math.max(1, Math.floor(Number(S.getAttribute("data-reader-page")) || 1)), E = S.getAttribute("data-reader-pane") === "translated" ? "translated" : "source", N = g.getClientRects(), T = N[N.length - 1] || g.getBoundingClientRect();
      if (!T || T.width === 0 && T.height === 0) {
        r(null);
        return;
      }
      const M = typeof window < "u" ? window.innerWidth : 800, x = typeof window < "u" ? window.innerHeight : 600, R = 16, k = Math.min(Math.max(R, T.left), M - R), D = Math.min(Math.max(R, T.top), x - R);
      r({
        selectionType: "text",
        quote: b,
        page: P,
        pane: E,
        rect: {
          left: k,
          top: D,
          width: T.width,
          height: T.height
        }
      });
    }, s = () => {
      window.setTimeout(i, 0);
    }, c = () => {
      s();
    }, l = () => s(), d = () => s(), u = () => {
      s();
    }, f = (h) => {
      h.key === "Escape" && a();
    }, p = () => {
      r((h) => h && null);
    };
    document.addEventListener("mouseup", c), document.addEventListener("pointerup", l), document.addEventListener("touchend", d), document.addEventListener("selectionchange", u), document.addEventListener("keyup", f);
    const v = o ?? e.current;
    return v == null || v.addEventListener("scroll", p, { passive: !0 }), window.addEventListener("scroll", p, { passive: !0, capture: !0 }), () => {
      document.removeEventListener("mouseup", c), document.removeEventListener("pointerup", l), document.removeEventListener("touchend", d), document.removeEventListener("selectionchange", u), document.removeEventListener("keyup", f), v == null || v.removeEventListener("scroll", p), window.removeEventListener("scroll", p, !0);
    };
  }, [t, o, a]), { selection: n, clearSelection: a };
}
function ri(e) {
  const { mode: t, setMode: n, beginModeSwitch: r } = e, a = L(t), o = L(n), i = L(r);
  return a.current = t, o.current = n, i.current = r, { setModeKeepingPage: A((c) => {
    c !== a.current && (i.current(), o.current(c));
  }, []) };
}
function oi() {
  const [e, t] = z(null), n = A((i) => {
    t(i);
  }, []), r = A((i = null) => {
    t((s) => !i || s === i ? null : s);
  }, []), a = A((i) => {
    t((s) => s === i ? null : i);
  }, []), o = A(
    (i) => e === i,
    [e]
  );
  return { active: e, open: n, close: r, toggle: a, isOpen: o };
}
function ai(e, t, n = !0, r = "", a) {
  const [o, i] = z(1);
  return F(() => {
    if (!n || t <= 0) {
      i(1);
      return;
    }
    const s = e.current;
    if (!s)
      return;
    let c = !1, l = null, d = 0;
    const u = yt(void 0, a), f = () => {
      if (c) return;
      const h = Array.from(s.querySelectorAll(u));
      if (!h.length)
        return;
      const w = wr(s), g = Sr(h, w);
      g && i(g.page);
    }, p = () => {
      c || (d && cancelAnimationFrame(d), d = requestAnimationFrame(() => {
        d = 0, f();
      }));
    }, v = () => {
      if (c) return;
      if (!Array.from(s.querySelectorAll(u)).length) {
        l = setTimeout(v, 120);
        return;
      }
      f(), s.addEventListener("scroll", p, { passive: !0 });
    };
    return v(), () => {
      c = !0, l && clearTimeout(l), d && cancelAnimationFrame(d), s.removeEventListener("scroll", p);
    };
  }, [e, t, n, r, a]), o;
}
const ii = "canvas, .react-pdf__Page, .reader-react-pdf-page, .reader-react-pdf-page-placeholder", kn = /* @__PURE__ */ new WeakMap();
function si(e) {
  const t = Number(e.getAttribute("data-natural-height"));
  if (Number.isFinite(t) && t > 0)
    return t;
  let n = kn.get(e);
  if ((n == null || !n.isConnected) && (n = e.querySelector(ii), kn.set(e, n)), n) {
    const a = n.getBoundingClientRect().height;
    if (Number.isFinite(a) && a > 0)
      return a;
  }
  const r = e.getBoundingClientRect().height;
  return Number.isFinite(r) && r > 0 ? r : 0;
}
function ci(e, t) {
  if (e.size !== t.size) return !1;
  for (const [n, r] of t)
    if (e.get(n) !== r) return !1;
  return !0;
}
function li(e) {
  const t = /* @__PURE__ */ new Map();
  e.querySelectorAll(Ca()).forEach((r) => {
    const a = vr(r);
    if (!Number.isFinite(a) || a < 1) return;
    const o = si(r);
    if (o <= 0) return;
    const i = t.get(a) || { height: 0, count: 0 };
    i.height = Math.max(i.height, o), i.count += 1, t.set(a, i);
  });
  const n = /* @__PURE__ */ new Map();
  return t.forEach((r, a) => {
    r.count >= 2 && r.height > 0 && n.set(a, Math.ceil(r.height));
  }), n;
}
function ui(e, t, n = "", r) {
  const [a, o] = z(() => /* @__PURE__ */ new Map()), i = L(a), s = L(r);
  return s.current = r, Ce(() => {
    if (!t) {
      i.current.size !== 0 && (i.current = /* @__PURE__ */ new Map(), o(i.current));
      return;
    }
    let c = !1, l = 0, d = !1, u = !1;
    const f = () => {
      var P;
      if (c) return;
      const I = e.current;
      if (!I) return;
      const S = li(I);
      ci(i.current, S) || (i.current = S, o(S)), d && !u && (u = !0, (P = s.current) == null || P.call(s));
    }, p = () => {
      cancelAnimationFrame(l), l = requestAnimationFrame(() => {
        requestAnimationFrame(f);
      });
    };
    p();
    const v = window.setTimeout(p, 100), h = window.setTimeout(() => {
      d = !0, p();
    }, 300), w = window.setTimeout(p, 700), g = e.current;
    let b = null;
    return g && typeof ResizeObserver < "u" && (b = new ResizeObserver(() => p()), b.observe(g)), () => {
      c = !0, cancelAnimationFrame(l), window.clearTimeout(v), window.clearTimeout(h), window.clearTimeout(w), b == null || b.disconnect();
    };
  }, [e, t, n]), a;
}
const di = [0, 48, 140, 320, 560], fi = 700, pi = [80, 200, 400], mi = 500, hi = 50, gi = 180, An = [0, 48, 140, 320, 700, 1200];
function bi(e, t) {
  var x;
  const {
    primaryPane: n,
    mode: r,
    enabled: a = !0,
    persistenceKey: o = "",
    restoreReady: i = !0
  } = t, s = L(
    ((x = xe(o)) == null ? void 0 : x.anchor) || { page: 1, fraction: 0 }
  ), c = L(null), l = L(!1), d = L(r), u = L(null), f = L(null), p = L(null), v = L(null), h = L(o), w = L(""), g = L(n);
  g.current = n;
  const b = A(() => {
    var R;
    (R = u.current) == null || R.call(u), u.current = null, f.current != null && (clearTimeout(f.current), f.current = null);
  }, []), I = A((R = !1) => {
    v.current != null && (clearTimeout(v.current), v.current = null);
    const k = () => {
      v.current = null, wt(h.current, {
        anchor: he(s.current)
      });
    };
    R ? k() : v.current = setTimeout(k, gi);
  }, []), S = A((R) => {
    s.current = he(R), c.current = null, p.current != null && clearTimeout(p.current), p.current = setTimeout(() => {
      p.current = null, l.current = !1;
    }, hi);
  }, []);
  F(() => {
    if (!a)
      return;
    let R = !1, k = null, D = null, O = null;
    const _ = () => {
      if (R) return;
      const B = e.current;
      if (!B) {
        O = setTimeout(_, 50);
        return;
      }
      k = B, D = () => {
        if (l.current)
          return;
        const H = Tt(k, g.current);
        H && (s.current = H, I());
      }, k.addEventListener("scroll", D, { passive: !0 }), l.current || D();
    };
    return _(), () => {
      R = !0, O != null && clearTimeout(O), k && D && k.removeEventListener("scroll", D);
    };
  }, [a, r, n, e, I]), Ce(() => {
    var k;
    if (h.current === o) return;
    I(!0), b(), p.current != null && (clearTimeout(p.current), p.current = null), h.current = o, w.current = "";
    const R = (k = xe(o)) == null ? void 0 : k.anchor;
    s.current = R ? he(R) : { page: 1, fraction: 0 }, c.current = null, l.current = !!o, d.current = r;
  }, [o, r, I, b]), F(() => {
    var k;
    if (!a || !i || !o || w.current === o) return;
    w.current = o;
    const R = he(
      ((k = xe(o)) == null ? void 0 : k.anchor) || { page: 1, fraction: 0 }
    );
    return s.current = R, c.current = R, l.current = !0, b(), u.current = Bt(
      () => e.current,
      R,
      {
        behavior: "auto",
        pane: g.current,
        delaysMs: An,
        onDone: () => S(R)
      }
    ), f.current = setTimeout(() => {
      f.current = null, S(R);
    }, Math.max(...An) + 160), () => b();
  }, [a, i, o, e, S, b]), F(() => {
    if (d.current === r)
      return;
    if (d.current = r, !a) {
      l.current = !1, c.current = null, b();
      return;
    }
    const R = c.current ? he(c.current) : he(s.current);
    return l.current = !0, c.current = R, s.current = R, b(), u.current = Bt(
      () => e.current,
      R,
      {
        behavior: "auto",
        pane: n,
        // 等页宽/行高同步后再钉；同一 locked 幂等，不会越滚越远
        delaysMs: di,
        onDone: () => S(R)
      }
    ), f.current = setTimeout(() => {
      f.current = null, S(R);
    }, fi), () => {
      b();
    };
  }, [r, a, n, e, S, b]), F(() => () => {
    b(), p.current != null && (clearTimeout(p.current), p.current = null), I(!0);
  }, [b, I]);
  const P = A(() => {
    const R = Tt(
      e.current,
      g.current
    );
    return he(R || s.current);
  }, [e]), y = A(() => {
    l.current = !0;
    const R = Tt(
      e.current,
      g.current
    ), k = he(R ?? s.current);
    return s.current = k, c.current = k, I(), k;
  }, [e, I]), E = A((R, k, D) => {
    const O = D || g.current, _ = vt(R, k || 1), B = { page: _, fraction: 0 };
    s.current = B, l.current = !0, c.current = B, I(), b(), _a(e.current, _, "smooth", O), u.current = Da(
      () => e.current,
      _,
      {
        behavior: "auto",
        pane: O,
        delaysMs: pi,
        onDone: () => S(B)
      }
    ), f.current = setTimeout(() => {
      f.current = null, S(B);
    }, mi);
  }, [e, S, b, I]), N = A(() => he(s.current), []), T = A(() => l.current, []), M = A(() => {
    if (!l.current || !c.current)
      return;
    const R = he(c.current);
    an(
      e.current,
      R,
      "auto",
      g.current
    );
  }, [e]);
  return {
    lockFromShell: P,
    beginModeSwitch: y,
    goToPage: E,
    getAnchor: N,
    isRestoring: T,
    repinIfRestoring: M
  };
}
function yi(e, t) {
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
function vi(e, t, n) {
  const r = `${(n == null ? void 0 : n.jobId) || ""}`.trim(), a = `${(n == null ? void 0 : n.documentId) || ""}`.trim(), o = `j:${r}:d:${a}`;
  return t == null ? `${o}:none:${(e == null ? void 0 : e.blockId) || ""}` : `${o}:p:${t}:b:${(e == null ? void 0 : e.blockId) || ""}`;
}
const wi = [0, 80, 200, 400, 800];
function Si(e) {
  const { enabled: t, numPages: n, goToPage: r, resolveBlockPage: a, onAnchorApplied: o, jobId: i, documentId: s } = e, c = L(""), l = L(r);
  l.current = r;
  const d = L(a);
  d.current = a;
  const u = L(o);
  u.current = o, F(() => {
    var w;
    if (!t || !Number.isFinite(n) || n < 1)
      return;
    const f = $o(), p = yi(f, d.current), v = vi(f, p, { jobId: i, documentId: s });
    if (c.current === v)
      return;
    if (p == null) {
      c.current = v;
      return;
    }
    c.current = v, f && ((w = u.current) == null || w.call(u, f, p));
    const h = [];
    for (const g of wi)
      h.push(
        setTimeout(() => {
          l.current(p);
        }, g)
      );
    return () => {
      for (const g of h) clearTimeout(g);
    };
  }, [t, n, i, s]);
}
const st = {
  layoutByPage: /* @__PURE__ */ new Map(),
  pagesByPage: /* @__PURE__ */ new Map(),
  lastSeq: 0,
  connection: "idle",
  jobStatus: "",
  error: ""
};
function Ii(e) {
  return new Map(((e == null ? void 0 : e.pages) || []).map((t) => [t.page_idx, t]));
}
function Ln(e, t) {
  return e.attempt !== t.attempt ? e.attempt < t.attempt ? -1 : 1 : e.generation !== t.generation ? e.generation < t.generation ? -1 : 1 : 0;
}
function Pr(e, t, n) {
  if (n.page_idx !== t.page_idx) return "retry";
  const r = Ln(n, t);
  if (r < 0 || r === 0 && n.page_hash !== t.page_hash) return "retry";
  if (!e) return "accept";
  const a = Ln(n, e);
  return a < 0 ? "ignore" : a === 0 ? n.page_hash === e.pageHash ? "ignore" : "retry" : "accept";
}
function Ri(e, t, n) {
  if (t.seq <= e.lastSeq) return e;
  const r = e.pagesByPage.get(t.page_idx), a = Pr(r, t, n);
  if (a === "retry") return e;
  if (a === "ignore")
    return { ...e, lastSeq: t.seq, connection: "live", error: "" };
  const o = new Map(n.items.map((c) => [c.item_id, c])), i = new Map((r == null ? void 0 : r.changedAtSeqById) || []);
  for (const c of t.changed_item_ids)
    o.has(c) && i.set(c, t.seq);
  const s = new Map(e.pagesByPage);
  return s.set(t.page_idx, {
    attempt: n.attempt,
    generation: n.generation,
    pageHash: n.page_hash,
    itemsById: o,
    changedAtSeqById: i,
    lastEventSeq: t.seq
  }), {
    ...e,
    pagesByPage: s,
    lastSeq: t.seq,
    connection: "live",
    error: ""
  };
}
const zn = [250, 500, 1e3, 2e3, 4e3], Et = [80, 160, 320, 640, 1e3, 1500], Cn = [250, 500, 1e3, 2e3, 4e3, 5e3], xi = /* @__PURE__ */ new Set(["succeeded", "failed", "cancelled", "canceled"]);
function Wt(e, t) {
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
function Nt(e, t) {
  if (e instanceof mt) {
    if (e.code === "LIVE_TRANSLATION_PAGE_NOT_COMMITTED")
      return "尚未收到可显示的页面译文";
    if (e.code === "LIVE_TRANSLATION_LAYOUT_NOT_READY")
      return "正在等待 OCR 版面数据";
  }
  return `${(e == null ? void 0 : e.message) || ""}`.trim() || t;
}
async function Pi(e, t, n, r) {
  let a = null;
  for (let o = 0; ; o += 1) {
    try {
      const s = await mo(e, t.page_idx, { signal: r });
      if (Pr(n.pagesByPage.get(t.page_idx), t, s) !== "retry")
        return s;
      a = new mt(
        "Authoritative page snapshot has not reached the event generation",
        409,
        "LIVE_TRANSLATION_SNAPSHOT_UNAVAILABLE"
      );
    } catch (s) {
      if ((s == null ? void 0 : s.name) === "AbortError") throw s;
      a = s;
      const c = s instanceof mt ? s.code : "";
      if (c && ![
        "LIVE_TRANSLATION_PAGE_NOT_COMMITTED",
        "LIVE_TRANSLATION_SNAPSHOT_UNAVAILABLE"
      ].includes(c)) throw s;
    }
    const i = Et[Math.min(o, Et.length - 1)];
    if (await Wt(i, r), o >= Et.length + 2) throw a;
  }
}
function Ti({
  jobId: e,
  jobStatus: t,
  enabled: n
}) {
  const [r, a] = z(st), o = L(r), i = L("");
  o.current = r;
  const s = `${e || ""}`.trim(), c = `${t || ""}`.trim().toLowerCase(), l = xi.has(c) ? c : "";
  return F(() => {
    if (!n || !s) {
      i.current = "", o.current = st, a(st);
      return;
    }
    const d = i.current === s;
    i.current = s;
    const u = new AbortController();
    let f = !1;
    const p = {
      ...d ? o.current : st,
      connection: l ? "terminal" : "connecting",
      jobStatus: c,
      error: ""
    };
    o.current = p, a(p);
    const v = (g) => {
      u.signal.aborted || a((b) => {
        const I = g(b);
        return o.current = I, I;
      });
    }, h = async () => {
      let g = 0;
      for (; !u.signal.aborted; )
        try {
          const b = await fo(s, { signal: u.signal });
          f = !0, v((I) => ({
            ...I,
            layoutByPage: Ii(b),
            jobStatus: c,
            error: ""
          }));
          return;
        } catch (b) {
          if ((b == null ? void 0 : b.name) === "AbortError") return;
          if (!(b instanceof mt && b.code === "LIVE_TRANSLATION_LAYOUT_NOT_READY")) {
            v((S) => ({
              ...S,
              connection: l ? "terminal" : "unavailable",
              jobStatus: c,
              error: Nt(b, "实时译文暂不可用")
            }));
            return;
          }
          if (l) {
            v((S) => ({
              ...S,
              connection: "terminal",
              jobStatus: c,
              error: ""
            }));
            return;
          }
          v((S) => ({
            ...S,
            connection: "connecting",
            jobStatus: c,
            error: Nt(b, "正在等待 OCR 版面数据")
          })), await Wt(zn[Math.min(g, zn.length - 1)], u.signal).catch(() => {
          }), g += 1;
        }
    };
    return (async () => {
      if (await h(), !f || u.signal.aborted) return;
      let g = 0;
      for (; !u.signal.aborted; ) {
        l || v((b) => ({
          ...b,
          connection: b.lastSeq > 0 ? "reconnecting" : "connecting",
          jobStatus: c,
          error: b.lastSeq > 0 ? b.error : ""
        }));
        try {
          await po(s, {
            afterSeq: o.current.lastSeq,
            signal: u.signal,
            onEvent: async (b) => {
              if (b.seq <= o.current.lastSeq) return;
              const I = await Pi(
                s,
                b,
                o.current,
                u.signal
              );
              v((S) => {
                const P = Ri(S, b, I);
                return l ? {
                  ...P,
                  connection: "terminal",
                  jobStatus: c
                } : {
                  ...P,
                  jobStatus: c
                };
              }), g = 0;
            }
          });
        } catch (b) {
          if ((b == null ? void 0 : b.name) === "AbortError" || u.signal.aborted) return;
          v((I) => ({
            ...I,
            connection: l ? "terminal" : "reconnecting",
            jobStatus: c,
            error: Nt(b, "实时译文连接已中断，正在重连")
          }));
        }
        if (u.signal.aborted) return;
        if (l) {
          v((b) => ({
            ...b,
            connection: "terminal",
            jobStatus: c
          }));
          return;
        }
        await Wt(Cn[Math.min(g, Cn.length - 1)], u.signal).catch(() => {
        }), g += 1;
      }
    })(), () => u.abort();
  }, [n, s, l]), r;
}
const Mi = 2e3;
function Ei(e) {
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
const Ni = /* @__PURE__ */ new Set(["book", "translate"]);
function Tr(e) {
  return !!(e.jobId && e.sourceUrl && Ni.has(e.workflow));
}
function ki(e) {
  return !!(Tr(e) && !(e.jobStatus === "succeeded" && e.translatedUrl));
}
function Ai() {
  const e = Ra(), t = Tr({
    jobId: e.jobId,
    sourceUrl: e.sourceUrl,
    workflow: e.workflow
  }), n = ki({
    jobId: e.jobId,
    sourceUrl: e.sourceUrl,
    translatedUrl: e.translatedUrl,
    jobStatus: e.jobStatus,
    workflow: e.workflow
  }), r = Ti({
    jobId: e.jobId,
    jobStatus: e.jobStatus,
    enabled: t
  }), a = oi(), { shellRef: o, shellEl: i, shellWidth: s, bindShell: c } = Ja(), l = Ga({
    documentId: e.documentId,
    jobId: e.jobId
  }), d = `${l}\0${e.jobId}\0${e.sourceUrl}\0${e.translatedUrl}`, { userZoom: u, onZoomChange: f } = ti(e.mode, o, l), p = qa(
    {
      mode: e.mode,
      sourceOnly: e.sourceOnly,
      assetsReady: e.assetsReady,
      sourceUrl: e.sourceUrl,
      translatedUrl: e.translatedUrl,
      sourceFile: e.sourceFile,
      translatedFile: e.translatedFile
    },
    { userZoom: u, shellWidth: s, identityKey: d }
  ), {
    beginModeSwitch: v,
    goToPage: h,
    repinIfRestoring: w
  } = bi(o, {
    primaryPane: p.primaryPane,
    mode: e.mode,
    enabled: !e.boot.loading,
    persistenceKey: l,
    restoreReady: p.primaryNumPages > 0
  });
  F(() => {
    w();
  }, [s, w]);
  const g = ui(
    o,
    p.compareMode,
    p.rowSyncRevision,
    w
  ), b = ai(
    o,
    p.primaryNumPages,
    !e.boot.loading,
    `${e.mode}-${u}-${p.metricsTick}`,
    p.primaryPane
  ), I = A((j, ne) => {
    var re, U;
    const pe = Math.max(
      Number(p.hudNumPages) || 0,
      Number(p.primaryNumPages) || 0,
      Number((re = p.numPagesByPane) == null ? void 0 : re.source) || 0,
      Number((U = p.numPagesByPane) == null ? void 0 : U.translated) || 0
    );
    h(j, pe, ne);
  }, [h, p.hudNumPages, p.primaryNumPages, p.numPagesByPane]), [S, P] = z(null), y = L(null), E = A((j) => {
    y.current && clearTimeout(y.current), P(j), j && (y.current = setTimeout(() => P(null), Mi));
  }, []);
  F(() => () => {
    y.current && clearTimeout(y.current);
  }, []);
  const N = A((j) => {
    const ne = dt(e.regions, j);
    return ne ? gt(ne, p.primaryPane).page : null;
  }, [e.regions, p.primaryPane]), T = A((j, ne) => {
    const pe = ne || p.primaryPane, re = typeof j == "object" && j ? `${j.block_id || ""}`.trim() : "", U = typeof j == "object" && j ? `${j.image_url || ""}`.trim() : "", se = typeof j == "object" && j ? j.page_idx != null ? Number(j.page_idx) + 1 : j.page != null ? Number(j.page) : null : typeof j == "number" ? j + 1 : null, q = da(e.regions, U, se) || dt(e.regions, re) || (typeof j == "object" ? ua(e.regions, j) : null);
    let J = q ? gt(q, pe).page : null;
    J == null && (J = Ei(j)), !(J == null || J < 1) && (E(q), I(J, pe));
  }, [E, I, p.primaryPane, e.regions]);
  Si({
    enabled: !e.boot.loading && !e.boot.failed && e.assetsReady,
    numPages: p.hudNumPages || 0,
    goToPage: I,
    resolveBlockPage: N,
    jobId: e.jobId,
    documentId: e.documentId,
    onAnchorApplied: (j) => {
      E(dt(e.regions, j.blockId));
    }
  });
  const { setModeKeepingPage: M } = ri({
    mode: e.mode,
    setMode: e.setMode,
    beginModeSwitch: v
  }), [x, R] = z(null), {
    selection: k,
    clearSelection: D
  } = ni(o, !e.boot.loading && !e.boot.failed), O = A(() => {
    R(null), D();
  }, [D]), _ = A((j) => {
    D(), R(j);
  }, [D]);
  F(() => {
    k && R(null);
  }, [k]), F(() => {
    const j = o.current;
    if (!j) return;
    const ne = () => R(null);
    return j.addEventListener("scroll", ne, { passive: !0 }), () => j.removeEventListener("scroll", ne);
  }, [i, o]);
  const B = k || x;
  F(() => {
    E(null), O();
  }, [d, E, O]);
  const H = !e.boot.loading && !e.boot.failed;
  Ba({
    mode: e.mode,
    sourceOnly: e.sourceOnly,
    setMode: M,
    userZoom: u,
    onZoomChange: f,
    currentPage: b,
    numPages: p.hudNumPages,
    goToPage: I,
    enabled: H
  });
  const X = Z(() => a, [a.active, a.open, a.close, a.toggle, a.isOpen]), W = Z(() => ({ bindShell: c, shellEl: i, shellWidth: s, shellRef: o }), [c, i, s, o]), oe = Z(() => ({
    sourceUrl: e.sourceUrl,
    translatedUrl: e.translatedUrl,
    sourceFile: e.sourceFile,
    translatedFile: e.translatedFile
  }), [e.sourceUrl, e.translatedUrl, e.sourceFile, e.translatedFile]), te = Z(() => ({
    session: e,
    boot: e.boot,
    sourceOnly: e.sourceOnly,
    mode: e.mode,
    userZoom: u,
    onZoomChange: f,
    shell: W,
    panes: p,
    sessionFiles: oe,
    rowHeights: g,
    goToPage: I,
    activeRegion: S,
    jumpToAnchor: T,
    setModeKeepingPage: M,
    download: e.download,
    showHud: H,
    tools: X,
    selection: B,
    clearSelection: O,
    selectRegion: _,
    documentTitle: e.title || "",
    viewStateKey: l,
    liveTranslation: r,
    liveTranslationAvailable: n
  }), [e, W, p, oe, g, I, S, T, M, H, X, B, O, _, u, f, l, r, n]);
  return Z(() => ({
    ...te,
    currentPage: b
  }), [te, b]);
}
const Li = "retainpdf:soft-reader-close";
function zi() {
  return new URL("./index.html", window.location.href).href;
}
function Ci() {
  if (typeof window > "u" || window.self === window.top) return !1;
  try {
    return window.parent.postMessage(
      { type: Li },
      window.location.origin
    ), !0;
  } catch {
    return !1;
  }
}
function _i(e, t, n) {
  if (n <= 1 || !e) return !1;
  try {
    const r = new URL(t), a = new URL(e, r);
    return a.origin === r.origin && !/reader\.html$/i.test(a.pathname) && !/detail\.html$/i.test(a.pathname);
  } catch {
    return !1;
  }
}
function Di() {
  if (!(typeof window > "u") && !Ci()) {
    if (_i(
      document.referrer,
      window.location.href,
      window.history.length
    )) {
      window.history.back();
      return;
    }
    window.location.assign(zi());
  }
}
function $i({ onBeforeClose: e } = {}) {
  return /* @__PURE__ */ C(
    "button",
    {
      id: "reader-close-home-btn",
      type: "button",
      className: "reader-close-home-btn",
      "aria-label": "返回主页",
      title: "返回主页",
      onClick: () => {
        e == null || e(), Di();
      },
      children: [
        /* @__PURE__ */ m(We, { className: "reader-close-home-icon", size: 18, strokeWidth: 2.25, "aria-hidden": !0 }),
        /* @__PURE__ */ m("span", { className: "reader-close-home-label", children: "关闭" })
      ]
    }
  );
}
let _n = !1;
function Fi() {
  if (_n)
    return;
  const e = Dt("build/pdf.worker.mjs");
  e && (Mo.GlobalWorkerOptions.workerSrc = e, _n = !0);
}
const Oi = {
  formula: "公式",
  table: "表格",
  figure: "图片",
  text: "文字",
  region: "区域"
};
function ji({
  pane: e,
  width: t,
  height: n,
  regions: r,
  onSelect: a
}) {
  const o = r.flatMap((i) => {
    if (!mr(i.region)) return [];
    const s = Rt(i, t, n);
    return s ? [{ highlight: i, rect: s }] : [];
  });
  return o.length ? /* @__PURE__ */ m("div", { className: "reader-structure-selection-layer", "aria-label": "PDF 结构选择层", children: o.map(({ highlight: i, rect: s }) => {
    const c = i.region, l = tn(c), d = Oi[l];
    return /* @__PURE__ */ C(
      "button",
      {
        type: "button",
        className: `reader-structure-selection-target is-${l}`,
        "data-reader-region-id": c.itemId,
        "data-reader-region-kind": l,
        style: s,
        "aria-label": `${d}区域，点击选择`,
        title: `${d} · 点击选择`,
        onClick: (u) => {
          u.stopPropagation();
          const f = u.currentTarget.getBoundingClientRect();
          a == null || a({
            selectionType: "region",
            region: c,
            kind: l,
            page: i.box.page,
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
          /* @__PURE__ */ m("span", { className: "reader-structure-selection-label", "aria-hidden": "true", children: d }),
          /* @__PURE__ */ m("span", { className: "sr-only", children: hr(c, e) })
        ]
      },
      c.itemId
    );
  }) }) : null;
}
function Bi(e, t, n) {
  return e.flatMap((r) => {
    if (tn(r.region) !== "text") return [];
    const a = Rt(r, t, n);
    return a ? [{ itemId: r.itemId, highlight: r, rect: a }] : [];
  });
}
function Dn(e, t, n) {
  let r = null, a = Number.POSITIVE_INFINITY;
  for (const o of e) {
    const { rect: i } = o;
    if (t < i.left || t > i.left + i.width || n < i.top || n > i.top + i.height)
      continue;
    const s = i.width * i.height;
    s < a && (r = o, a = s);
  }
  return r;
}
function Ui({ target: e }) {
  return e ? /* @__PURE__ */ m("div", { className: "reader-text-hover-layer", "aria-hidden": "true", children: /* @__PURE__ */ m(
    "div",
    {
      className: "reader-text-hover-frame",
      "data-reader-text-hover-id": e.itemId,
      style: e.rect,
      children: /* @__PURE__ */ m("span", { className: "reader-text-hover-label", children: "文字" })
    }
  ) }) : null;
}
function Wi(e, t) {
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
function Hi(e, t, n, r) {
  if (!e || !t) return [];
  const a = [];
  for (const o of e.blocks) {
    const i = t.itemsById.get(o.item_id);
    if (!(i != null && i.translated_text)) continue;
    const s = Rt(
      Wi(e, o),
      n,
      r
    );
    s && a.push({
      itemId: o.item_id,
      translatedText: i.translated_text,
      status: i.status,
      kind: o.kind,
      sourceText: o.source_text,
      typography: o.typography,
      rect: s,
      changedAtSeq: t.changedAtSeqById.get(o.item_id) || 0,
      changedNow: t.changedAtSeqById.get(o.item_id) === t.lastEventSeq
    });
  }
  return a;
}
const Ji = '"Source Han Serif SC", "Noto Serif CJK SC", "Songti SC", serif', Ki = 256, Ve = /* @__PURE__ */ new Map();
function qi(e) {
  return `${e || ""}`.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function Vi(e) {
  const t = `${e || ""}`, { text: n, slots: r } = ko(t), a = qi(n), o = Ao(a, r);
  if (!r.length)
    return { fallbackHtml: o, richHtml: Promise.resolve(o), hasMath: !1 };
  let i = Ve.get(t);
  if (!i && (i = Lo(a, r), Ve.set(t, i), Ve.size > Ki)) {
    const s = Ve.keys().next().value;
    s !== void 0 && Ve.delete(s);
  }
  return { fallbackHtml: o, richHtml: i, hasMath: !0 };
}
function kt(e) {
  return /title|heading|header|display_formula|equation/i.test(e);
}
function Ie(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? t : void 0;
}
function Yi(e, t) {
  const n = e.typography, r = Ie(t) || 1, a = Ie(n == null ? void 0 : n.font_size_pt), o = Math.max(1, `${e.sourceText || ""}`.split(/\n+/).length), i = e.rect.height / Math.max(1.28, o * 1.18), s = kt(e.kind) ? 24 : /caption|footnote|table/i.test(e.kind) ? 9.5 : 11, c = Math.max(5.5 * r, Math.min(i, s * r)), l = Ie(n == null ? void 0 : n.fit_min_font_size_pt), d = Ie(n == null ? void 0 : n.fit_max_font_size_pt), u = Math.max(3.5, (l || 5.5) * r), f = Math.max(
    u,
    d ? d * r : a ? a * r : c
  ), p = a ? a * r : c, v = Ie(n == null ? void 0 : n.leading_em), h = [
    Ie(n == null ? void 0 : n.padding_top_pt) || 0,
    Ie(n == null ? void 0 : n.padding_right_pt) || 0,
    Ie(n == null ? void 0 : n.padding_bottom_pt) || 0,
    Ie(n == null ? void 0 : n.padding_left_pt) || 0
  ].map((w) => w * r);
  return {
    fontFamily: `${(n == null ? void 0 : n.font_family) || ""}`.trim() || Ji,
    fontSizePx: Math.max(u, Math.min(f, p)),
    minFontSizePx: u,
    maxFontSizePx: f,
    // Typst leading is the additional inter-line gap, unlike CSS line-height.
    lineHeight: v ? 1 + v : 1.3,
    fontWeight: (n == null ? void 0 : n.font_weight) || (kt(e.kind) ? 600 : 400),
    textAlign: (n == null ? void 0 : n.text_align) || (kt(e.kind) ? "center" : "justify"),
    padding: h,
    exact: !!a
  };
}
function Gi({ item: e, pageScale: t }) {
  const n = L(null), r = Z(
    () => Vi(e.translatedText),
    [e.translatedText]
  ), [a, o] = z(r.fallbackHtml), i = Z(
    () => Yi(e, t),
    [e, t]
  );
  F(() => {
    let u = !0;
    return o(r.fallbackHtml), r.hasMath && r.richHtml.then((f) => {
      u && o(f);
    }), () => {
      u = !1;
    };
  }, [r]), Ce(() => {
    const u = n.current;
    if (!u) return;
    const [f, p, v, h] = i.padding, w = Math.max(1, e.rect.width - h - p), g = Math.max(1, e.rect.height - f - v);
    let b = i.minFontSizePx, I = i.maxFontSizePx, S = Math.min(i.fontSizePx, I);
    const P = (y) => (u.style.fontSize = `${y}px`, u.scrollWidth <= w + 0.5 && u.scrollHeight <= g + 0.5);
    if (P(S)) {
      if (!i.exact) {
        b = S;
        for (let y = 0; y < 6; y += 1) {
          const E = (b + I) / 2;
          P(E) ? (S = E, b = E) : I = E;
        }
      }
    } else {
      I = S, S = b;
      for (let y = 0; y < 8; y += 1) {
        const E = (b + I) / 2;
        P(E) ? (S = E, b = E) : I = E;
      }
    }
    u.style.fontSize = `${Math.max(i.minFontSizePx, S).toFixed(2)}px`;
  }, [a, e.rect.height, e.rect.width, i]);
  const [s, c, l, d] = i.padding;
  return /* @__PURE__ */ m(
    "div",
    {
      className: `reader-live-translation-item${e.changedNow ? " is-changed" : ""}`,
      "data-live-translation-item": e.itemId,
      "data-live-translation-kind": e.kind,
      "data-live-translation-status": e.status,
      "data-live-translation-typography": i.exact ? "typst" : "fitted",
      style: {
        ...e.rect,
        padding: `${s}px ${c}px ${l}px ${d}px`
      },
      children: /* @__PURE__ */ m(
        "div",
        {
          ref: n,
          className: "reader-live-translation-content",
          style: {
            fontFamily: i.fontFamily,
            fontSize: i.fontSizePx,
            fontWeight: i.fontWeight,
            lineHeight: i.lineHeight,
            textAlign: i.textAlign
          },
          dangerouslySetInnerHTML: { __html: a }
        }
      )
    }
  );
}
function Xi({
  layoutPage: e,
  pageState: t,
  width: n,
  height: r
}) {
  const a = Z(
    () => Hi(e, t, n, r),
    [r, e, t, n]
  );
  return a.length ? /* @__PURE__ */ m(
    "div",
    {
      className: "reader-live-translation-overlay",
      "data-live-translation-page": e == null ? void 0 : e.page_idx,
      "data-live-translation-generation": t == null ? void 0 : t.generation,
      "aria-hidden": "true",
      children: a.map((o) => /* @__PURE__ */ m(
        Gi,
        {
          item: o,
          pageScale: e != null && e.width ? n / e.width : 1
        },
        `${o.itemId}:${o.changedAtSeq}`
      ))
    }
  ) : null;
}
const Zi = Yt(Xi), Mr = 1.414;
function Qi({
  pageNumber: e,
  width: t,
  devicePixelRatio: n,
  pane: r,
  active: a = !1,
  syncedMinHeight: o = 0,
  onMetrics: i,
  cachedAspect: s,
  onAspectChange: c,
  sentinelRef: l,
  regionHighlight: d = null,
  regionTargets: u = [],
  onSelectRegion: f,
  liveTranslationLayout: p,
  liveTranslationPage: v,
  showLiveTranslation: h = r === "source"
}) {
  const w = L(null), g = L(s ?? Mr), [b, I] = z(g.current);
  F(() => {
    s != null && Math.abs(s - g.current) >= 1e-3 && (g.current = s, I(s));
  }, [s]);
  const S = L(l);
  S.current = l;
  const P = L((_) => {
    var B;
    w.current = _, (B = S.current) == null || B.call(S, _);
  }).current, y = Math.max(120, Math.floor(t * b)), E = Math.max(y, Math.ceil(o || 0)), N = Rt(d, t, y), T = Z(
    () => Bi(u, t, y),
    [y, u, t]
  ), [M, x] = z(null), R = Z(
    () => T.find((_) => _.itemId === M) || null,
    [M, T]
  ), k = (_) => {
    if (_.buttons !== 0) {
      x(null);
      return;
    }
    const B = _.currentTarget.getBoundingClientRect(), H = Dn(
      T,
      _.clientX - B.left,
      _.clientY - B.top
    ), X = (H == null ? void 0 : H.itemId) || null;
    x((W) => W === X ? W : X);
  }, D = (_) => {
    var X, W, oe;
    if (!f || (W = (X = _.target) == null ? void 0 : X.closest) != null && W.call(X, ".reader-structure-selection-target") || `${((oe = window.getSelection()) == null ? void 0 : oe.toString()) || ""}`.trim()) return;
    const B = _.currentTarget.getBoundingClientRect(), H = Dn(
      T,
      _.clientX - B.left,
      _.clientY - B.top
    );
    H && f({
      selectionType: "region",
      region: H.highlight.region,
      kind: "text",
      page: H.highlight.box.page,
      pane: r === "translated" ? "translated" : "source",
      rect: {
        left: B.left + H.rect.left,
        top: B.top + H.rect.top,
        width: H.rect.width,
        height: H.rect.height
      }
    });
  }, O = (_) => {
    !Number.isFinite(_) || _ <= 0 || Math.abs(g.current - _) < 1e-3 || (g.current = _, I(_), c == null || c(e, _));
  };
  return /* @__PURE__ */ C(
    "div",
    {
      ref: P,
      "data-reader-page": e,
      "data-reader-pane": r,
      "data-natural-height": y,
      className: rn,
      onPointerMoveCapture: k,
      onClick: D,
      onPointerLeave: () => x(null),
      style: {
        width: t,
        height: E,
        minHeight: E
      },
      children: [
        a ? /* @__PURE__ */ m(
          Eo,
          {
            pageNumber: e,
            width: t,
            devicePixelRatio: n,
            renderTextLayer: !0,
            renderAnnotationLayer: !1,
            className: "reader-react-pdf-page",
            loading: /* @__PURE__ */ m(
              "div",
              {
                className: "reader-react-pdf-page-placeholder",
                style: { width: t, height: y }
              }
            ),
            onLoadSuccess: (_) => {
              try {
                const B = _.getViewport({ scale: 1 });
                if (B.width > 0) {
                  const H = B.height / B.width;
                  O(H);
                }
              } catch {
              }
              i == null || i();
            },
            onRenderSuccess: () => {
              i == null || i();
            }
          }
        ) : /* @__PURE__ */ m(
          "div",
          {
            className: "reader-react-pdf-page-placeholder",
            style: { width: t, height: y },
            "aria-hidden": !0
          }
        ),
        N ? /* @__PURE__ */ m(
          "div",
          {
            className: "reader-react-pdf-region-highlight",
            "data-reader-region-id": d == null ? void 0 : d.itemId,
            style: N,
            "aria-hidden": "true"
          }
        ) : null,
        a && h ? /* @__PURE__ */ m(
          Zi,
          {
            layoutPage: p,
            pageState: v,
            width: t,
            height: y
          }
        ) : null,
        /* @__PURE__ */ m(Ui, { target: a ? R : null }),
        /* @__PURE__ */ m(
          ji,
          {
            pane: r === "translated" ? "translated" : "source",
            width: t,
            height: y,
            regions: u,
            onSelect: f
          }
        )
      ]
    }
  );
}
const es = Yt(Qi), At = 5, ts = "120% 0px", ns = 120;
let $n = 1;
const Fn = /* @__PURE__ */ new WeakMap();
function rs(e) {
  if (!e) return 0;
  const t = Fn.get(e);
  if (t) return t;
  const n = $n;
  return $n += 1, Fn.set(e, n), n;
}
function os() {
  const e = typeof window < "u" && window.devicePixelRatio || 1;
  return Math.max(1, Math.min(e, 2));
}
const as = eo(
  function({
    pane: t,
    url: n = "",
    preloadedFile: r = null,
    userZoom: a = 1,
    visible: o = !0,
    emptyLabel: i = "暂无 PDF",
    scrollRoot: s = null,
    pageWidthOverride: c = null,
    rowHeights: l,
    onMetrics: d,
    onLoadSuccess: u,
    onLoadError: f,
    onNumPagesChange: p,
    activeRegion: v = null,
    regions: h = [],
    readerMetadata: w = null,
    onSelectRegion: g,
    liveTranslation: b,
    showLiveTranslation: I = t === "source",
    liveTranslationPendingLabel: S = ""
  }, P) {
    Fi();
    const { file: y, loading: E, error: N } = va(n, r), T = `${n}\0${rs(y)}`, M = L(T);
    M.current = T;
    const x = Z(
      () => ga(y),
      [y, n]
    ), [R, k] = z(0), [D, O] = z(""), [_, B] = z(null), [H, X] = z(480), W = L(null), oe = L(0), te = Z(() => os(), []), j = Z(() => ({
      cMapUrl: Dt("cmaps/"),
      cMapPacked: !0,
      standardFontDataUrl: Dt("standard_fonts/")
    }), []);
    Gt(P, () => _, [_]), F(() => {
      const $ = (K) => {
        !Number.isFinite(K) || K < 80 || Math.abs(K - oe.current) < 8 || (oe.current = K, X(K));
      }, Q = c && c >= 80 ? c : (s == null ? void 0 : s.clientWidth) || 0;
      if ($(Q), !s || typeof ResizeObserver > "u" || c && c >= 80) return;
      const G = new ResizeObserver((K) => {
        var V, ee;
        const ae = ((ee = (V = K[0]) == null ? void 0 : V.contentRect) == null ? void 0 : ee.width) ?? s.clientWidth;
        !Number.isFinite(ae) || ae < 80 || (W.current && clearTimeout(W.current), W.current = setTimeout(() => $(ae), 80));
      });
      return G.observe(s), () => {
        G.disconnect(), W.current && clearTimeout(W.current);
      };
    }, [c, s, o]);
    const ne = Z(
      () => Na(H, a),
      [H, a]
    ), [pe, re] = z(() => /* @__PURE__ */ new Map()), [U, se] = z(() => /* @__PURE__ */ new Set()), [q, J] = z(() => /* @__PURE__ */ new Set()), ue = L(/* @__PURE__ */ new Map()), de = L(null), me = L(/* @__PURE__ */ new Map()), Je = A(($, Q) => {
      re((G) => {
        if (G.get($) === Q) return G;
        const K = new Map(G);
        return K.set($, Q), K;
      });
    }, []), at = A(($, Q) => {
      const G = ue.current, K = G.get($);
      if (K && de.current)
        try {
          de.current.unobserve(K);
        } catch {
        }
      if (Q) {
        if (G.set($, Q), de.current)
          try {
            de.current.observe(Q);
          } catch {
          }
      } else
        G.delete($);
    }, []);
    F(() => {
      if (typeof IntersectionObserver > "u") return;
      const $ = me.current, Q = new IntersectionObserver(
        (G) => {
          const K = [], ae = [];
          for (const V of G) {
            const ee = V.target, fe = Number(ee.getAttribute("data-reader-page"));
            Number.isFinite(fe) && (V.isIntersecting ? K : ae).push(fe);
          }
          if ((K.length || ae.length) && se((V) => {
            let ee = null;
            for (const fe of K)
              V.has(fe) || (ee = ee || new Set(V), ee.add(fe));
            for (const fe of ae)
              V.has(fe) && (ee = ee || new Set(V), ee.delete(fe));
            return ee || V;
          }), K.length) {
            for (const V of K) {
              const ee = $.get(V);
              ee && (clearTimeout(ee), $.delete(V));
            }
            J((V) => {
              let ee = null;
              for (const fe of K)
                V.has(fe) || (ee = ee || new Set(V), ee.add(fe));
              return ee || V;
            });
          }
          for (const V of ae)
            $.has(V) || $.set(V, setTimeout(() => {
              $.delete(V), J((ee) => {
                if (!ee.has(V)) return ee;
                const fe = new Set(ee);
                return fe.delete(V), fe;
              });
            }, ns));
        },
        { root: s, rootMargin: ts, threshold: 0 }
      );
      de.current = Q;
      for (const G of ue.current.values())
        try {
          Q.observe(G);
        } catch {
        }
      return () => {
        Q.disconnect(), de.current === Q && (de.current = null);
        for (const G of $.values()) clearTimeout(G);
        $.clear();
      };
    }, [s]), Ce(() => {
      k(0), O(""), se(/* @__PURE__ */ new Set()), J(/* @__PURE__ */ new Set()), re(/* @__PURE__ */ new Map()), ue.current.clear();
      const $ = me.current;
      for (const Q of $.values()) clearTimeout(Q);
      $.clear(), p == null || p(0, t);
    }, [T, p, t]);
    const it = A(
      ({ numPages: $ }) => {
        M.current === T && (k($), O(""), p == null || p($, t), u == null || u({ numPages: $, pane: t }));
      },
      [T, u, p, t]
    ), Ke = A(
      ($) => {
        if (M.current !== T) return;
        const Q = ($ == null ? void 0 : $.message) || "PDF 解析失败";
        O(Q), k(0), p == null || p(0, t), f == null || f($, t);
      },
      [T, f, p, t]
    ), ve = Z(
      () => R > 0 ? Array.from({ length: R }, ($, Q) => Q + 1) : [],
      [R]
    );
    F(() => {
      typeof IntersectionObserver < "u" || J(new Set(ve));
    }, [ve]);
    const we = Z(
      () => Mn(v, w, t),
      [v, w, t]
    ), Gr = Z(() => {
      const $ = /* @__PURE__ */ new Map();
      for (const Q of h) {
        const G = Mn(Q, w, t);
        if (!G) continue;
        const K = $.get(G.box.page) || [];
        K.push(G), $.set(G.box.page, K);
      }
      return $;
    }, [t, w, h]), Xr = Z(() => {
      if (R === 0) return /* @__PURE__ */ new Set();
      if (!(!!s && typeof IntersectionObserver < "u" && o)) return new Set(ve);
      if (U.size === 0) {
        const G = Math.min(R, At * 2 + 1);
        return new Set(Array.from({ length: G }, (K, ae) => ae + 1));
      }
      const Q = /* @__PURE__ */ new Set();
      for (const G of U)
        for (let K = -At; K <= At; K++) {
          const ae = G + K;
          ae >= 1 && ae <= R && Q.add(ae);
        }
      return Q;
    }, [R, ve, s, o, U]), Zr = !n || !!N || !!D, Qr = n && (N || D) || i;
    return /* @__PURE__ */ C(
      "section",
      {
        ref: B,
        className: `reader-panel reader-react-pdf-pane${o ? "" : " is-hidden"}`,
        "data-reader-pane": t,
        "data-reader-engine": "react-pdf",
        "data-reader-visible": o ? "true" : "false",
        "data-live-translation-status": (b == null ? void 0 : b.jobStatus) || void 0,
        "aria-hidden": o ? void 0 : !0,
        "aria-label": t === "source" ? "原文 PDF" : "译文 PDF",
        children: [
          S ? /* @__PURE__ */ C("div", { className: "reader-live-translation-waiting", role: "status", children: [
            /* @__PURE__ */ m("span", { className: "reader-live-translation-waiting-dot", "aria-hidden": "true" }),
            /* @__PURE__ */ m("span", { children: S })
          ] }) : null,
          Zr && !E ? /* @__PURE__ */ m("div", { className: "reader-empty reader-react-pdf-empty", "data-reader-pdf-empty": t, children: Qr }) : null,
          E ? /* @__PURE__ */ m("div", { className: "reader-empty reader-react-pdf-loading", "data-reader-pdf-loading": t, children: "正在加载 PDF…" }) : null,
          x && !N ? /* @__PURE__ */ m("div", { className: "reader-viewer-wrap reader-react-pdf-wrap", children: /* @__PURE__ */ m(
            No,
            {
              file: x,
              loading: null,
              error: null,
              options: j,
              onLoadSuccess: it,
              onLoadError: Ke,
              className: "reader-react-pdf-document",
              children: ve.map(($) => {
                if (Xr.has($))
                  return /* @__PURE__ */ m(
                    es,
                    {
                      pane: t,
                      pageNumber: $,
                      width: ne,
                      devicePixelRatio: te,
                      scrollRoot: s,
                      active: q.has($),
                      syncedMinHeight: (l == null ? void 0 : l.get($)) || 0,
                      onMetrics: d,
                      cachedAspect: pe.get($),
                      onAspectChange: Je,
                      sentinelRef: (V) => at($, V),
                      regionHighlight: (we == null ? void 0 : we.box.page) === $ ? we : null,
                      regionTargets: Gr.get($),
                      onSelectRegion: g,
                      liveTranslationLayout: b == null ? void 0 : b.layoutByPage.get($ - 1),
                      liveTranslationPage: b == null ? void 0 : b.pagesByPage.get($ - 1),
                      showLiveTranslation: I
                    },
                    `${t}-${$}`
                  );
                const G = pe.get($) ?? Mr, K = Math.max(120, Math.floor(ne * G)), ae = Math.max(K, Math.ceil((l == null ? void 0 : l.get($)) || 0));
                return /* @__PURE__ */ m(
                  "div",
                  {
                    ref: (V) => at($, V),
                    "data-reader-page": $,
                    "data-reader-pane": t,
                    "data-natural-height": K,
                    className: rn,
                    style: {
                      width: ne,
                      height: ae,
                      minHeight: ae
                    },
                    children: /* @__PURE__ */ m(
                      "div",
                      {
                        className: "reader-react-pdf-page-placeholder",
                        style: { width: ne, height: K },
                        "aria-hidden": !0
                      }
                    )
                  },
                  `${t}-${$}`
                );
              })
            },
            T
          ) }) : null
        ]
      }
    );
  }
), On = Yt(as);
function is({
  mode: e,
  compareMode: t,
  showSource: n,
  showTranslated: r,
  markdownSplit: a,
  liveTranslationPair: o = !1
}) {
  if (o)
    return {
      mode: "compare",
      compareMode: !0,
      showSource: !0,
      showTranslated: !0
    };
  const i = a && e === "compare";
  return {
    mode: i ? "source" : e,
    compareMode: t && !a,
    showSource: i ? !0 : n,
    showTranslated: i ? !1 : r
  };
}
function ss(e, t, n = e * 2) {
  return t ? Math.min(e * 2, n) : e;
}
function cs(e) {
  return e ? e.connection === "terminal" && e.jobStatus === "failed" ? e.pagesByPage.size > 0 ? `翻译已暂停，已保留 ${e.pagesByPage.size} 页译文` : "翻译已暂停，原始 PDF 仍可阅读" : e.connection === "terminal" && ["cancelled", "canceled"].includes(e.jobStatus) ? e.pagesByPage.size > 0 ? `翻译已取消，已保留 ${e.pagesByPage.size} 页译文` : "翻译已取消，原始 PDF 仍可阅读" : e.pagesByPage.size > 0 ? "" : e.connection === "unavailable" ? e.error || "实时译文暂不可用，原始 PDF 仍可阅读" : e.error ? e.error : e.layoutByPage.size === 0 ? "正在完成 OCR，译文将在这里逐页出现" : "版面已就绪，正在等待首个译文页面" : "";
}
function ls(e) {
  const {
    mode: t,
    bindShell: n,
    shellEl: r,
    userZoom: a,
    compareMode: o,
    shellWidth: i,
    rowHeights: s,
    mountSource: c,
    mountTranslated: l,
    showSource: d,
    showTranslated: u,
    sourceOnly: f,
    sourceUrl: p,
    translatedUrl: v,
    sourceFile: h,
    translatedFile: w,
    onMetrics: g,
    onNumPagesChange: b,
    activeRegion: I,
    regions: S = [],
    readerMetadata: P,
    onSelectRegion: y,
    markdownSplit: E = !1,
    assistantSplit: N = !1,
    liveTranslation: T,
    liveTranslationPair: M = !1
  } = e, x = is({
    mode: t,
    compareMode: o,
    showSource: d,
    showTranslated: u,
    markdownSplit: E,
    liveTranslationPair: M
  }), R = ss(
    i,
    E || N,
    typeof document > "u" ? i * 2 : document.documentElement.clientWidth
  );
  return /* @__PURE__ */ m(
    "div",
    {
      ref: n,
      id: La,
      className: za,
      "data-reader-scroll-shell": "true",
      "data-reader-region-count": S.length,
      "data-reader-structured-region-count": S.filter(mr).length,
      "data-reader-metadata-ready": P ? "true" : "false",
      children: /* @__PURE__ */ C(
        "main",
        {
          className: `reader-react-grid reader-mode-${x.mode}`,
          "data-reader-mode": E ? "markdown-split" : N ? "assistant-split" : t,
          children: [
            c ? /* @__PURE__ */ m(
              On,
              {
                pane: "source",
                url: p,
                preloadedFile: h,
                userZoom: a,
                visible: x.showSource,
                scrollRoot: r,
                pageWidthOverride: R,
                rowHeights: x.compareMode ? s : void 0,
                onMetrics: g,
                emptyLabel: f ? "源文件不可用：该文档没有可读取的源 PDF。" : "暂无原文 PDF",
                onNumPagesChange: b,
                activeRegion: I,
                regions: S,
                readerMetadata: P,
                onSelectRegion: y,
                liveTranslation: M ? void 0 : T,
                showLiveTranslation: !M
              }
            ) : null,
            l || M ? /* @__PURE__ */ m(
              On,
              {
                pane: "translated",
                url: M ? p : v,
                preloadedFile: M ? h : w,
                userZoom: a,
                visible: x.showTranslated,
                scrollRoot: r,
                pageWidthOverride: R,
                rowHeights: x.compareMode ? s : void 0,
                onMetrics: g,
                emptyLabel: "暂无译文 PDF",
                onNumPagesChange: b,
                activeRegion: I,
                regions: S,
                readerMetadata: P,
                onSelectRegion: y,
                liveTranslation: M ? T : void 0,
                showLiveTranslation: M,
                liveTranslationPendingLabel: M ? cs(T) : ""
              }
            ) : null
          ]
        }
      )
    }
  );
}
const us = [
  { id: "source", label: "源文件", Icon: cr },
  { id: "compare", label: "对照", Icon: lr },
  { id: "translated", label: "翻译文件", Icon: ur }
];
function ds(e) {
  return e.connection === "live" ? `实时译文 · ${e.pagesByPage.size} 页` : e.connection === "reconnecting" ? "实时译文 · 重连中" : e.connection === "unavailable" ? "实时译文 · 不可用" : e.connection === "terminal" ? e.jobStatus === "failed" ? "实时译文 · 已暂停" : e.jobStatus === "cancelled" || e.jobStatus === "canceled" ? "实时译文 · 已取消" : e.jobStatus === "succeeded" ? "实时译文 · 已完成" : "实时译文 · 已结束" : e.error || "实时译文 · 连接中";
}
function fs(e) {
  return e.id === "translated" ? e.sourceOnly : e.id === "compare" ? !e.documentReady || e.sourceOnly && !e.liveTranslationAvailable : !1;
}
function ps({
  mode: e,
  documentReady: t,
  sourceOnly: n = !1,
  onModeChange: r,
  liveTranslation: a = null
}) {
  const o = a ? ds(a.state) : "";
  return /* @__PURE__ */ C("header", { className: "reader-workspace-bar", children: [
    a ? /* @__PURE__ */ C(
      "button",
      {
        type: "button",
        className: `reader-live-translation-toggle is-${a.state.connection}${a.visible ? " is-active" : ""}`,
        "aria-pressed": a.visible,
        "aria-label": a.visible ? "隐藏实时译文" : "显示实时译文",
        title: a.state.error || o,
        onClick: a.onToggle,
        children: [
          /* @__PURE__ */ m(go, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 }),
          /* @__PURE__ */ m("span", { className: "reader-live-translation-toggle-label", children: o })
        ]
      }
    ) : null,
    /* @__PURE__ */ m("div", { className: "reader-workspace-tabs", role: "tablist", "aria-label": "阅读工作区", children: us.map(({ id: i, label: s, Icon: c }) => {
      const l = e === i, d = fs({
        id: i,
        documentReady: t,
        sourceOnly: n,
        liveTranslationAvailable: !!a
      });
      return /* @__PURE__ */ C(
        "button",
        {
          type: "button",
          className: `reader-workspace-tab${l ? " is-active" : ""}`,
          role: "tab",
          "aria-selected": l,
          "aria-label": s,
          title: d ? `${s} 需要文档任务` : s,
          disabled: d,
          onClick: () => r(i),
          children: [
            /* @__PURE__ */ m(c, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
            /* @__PURE__ */ m("span", { className: "reader-workspace-tab-label", children: s })
          ]
        },
        i
      );
    }) })
  ] });
}
const jn = [
  { id: "markdown", label: "Markdown", Icon: dr },
  { id: "ai", label: "AI 问答", Icon: Qt }
];
function ms({
  active: e,
  onSelect: t,
  onClose: n
}) {
  return e ? /* @__PURE__ */ C("header", { className: "reader-assistant-dock-header", children: [
    /* @__PURE__ */ m("div", { className: "reader-assistant-dock-tabs", role: "tablist", "aria-label": "阅读辅助面板", children: jn.map(({ id: r, label: a, Icon: o }) => {
      const i = e === r;
      return /* @__PURE__ */ C(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": i,
          className: `reader-assistant-dock-tab${i ? " is-active" : ""}`,
          onClick: () => t(r),
          children: [
            /* @__PURE__ */ m(o, { size: 15, strokeWidth: 2.15, "aria-hidden": !0 }),
            /* @__PURE__ */ m("span", { children: a })
          ]
        },
        r
      );
    }) }),
    /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: "reader-assistant-dock-close",
        "aria-label": "关闭阅读辅助面板",
        title: "关闭辅助面板",
        onClick: n,
        children: /* @__PURE__ */ m(We, { size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
      }
    )
  ] }) : /* @__PURE__ */ m("nav", { className: "reader-assistant-rail", "aria-label": "阅读辅助工具", children: jn.map(({ id: r, label: a, Icon: o }) => /* @__PURE__ */ C(
    "button",
    {
      type: "button",
      className: "reader-assistant-rail-button",
      "aria-label": `打开${a}`,
      title: a,
      onClick: () => t(r),
      children: [
        /* @__PURE__ */ m(o, { size: 18, strokeWidth: 2, "aria-hidden": !0 }),
        /* @__PURE__ */ m("span", { children: a === "AI 问答" ? "AI" : "MD" })
      ]
    },
    r
  )) });
}
function hs(e, t) {
  const n = getComputedStyle(e), r = parseFloat(n.fontSize);
  return t * r;
}
function gs(e, t) {
  const n = getComputedStyle(e.ownerDocument.documentElement), r = parseFloat(n.fontSize);
  return t * r;
}
function bs(e) {
  return e / 100 * window.innerHeight;
}
function ys(e) {
  return e / 100 * window.innerWidth;
}
function vs(e) {
  switch (typeof e) {
    case "number":
      return [e, "px"];
    case "string": {
      const t = parseFloat(e);
      return e.endsWith("%") ? [t, "%"] : e.endsWith("px") ? [t, "px"] : e.endsWith("rem") ? [t, "rem"] : e.endsWith("em") ? [t, "em"] : e.endsWith("vh") ? [t, "vh"] : e.endsWith("vw") ? [t, "vw"] : [t, "%"];
    }
  }
}
function Ge({
  groupSize: e,
  panelElement: t,
  styleProp: n
}) {
  let r;
  const [a, o] = vs(n);
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
      r = gs(t, a);
      break;
    }
    case "em": {
      r = hs(t, a);
      break;
    }
    case "vh": {
      r = bs(a);
      break;
    }
    case "vw": {
      r = ys(a);
      break;
    }
  }
  return r;
}
function le(e) {
  return parseFloat(e.toFixed(3));
}
function He({
  group: e
}) {
  const { orientation: t, panels: n } = e;
  return n.reduce((r, a) => (r += t === "horizontal" ? a.element.offsetWidth : a.element.offsetHeight, r), 0);
}
function Ht(e) {
  const { panels: t } = e, n = He({ group: e });
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
    let i = 0;
    if (o.collapsedSize !== void 0) {
      const d = Ge({
        groupSize: n,
        panelElement: a,
        styleProp: o.collapsedSize
      });
      i = le(d / n * 100);
    }
    let s;
    if (o.defaultSize !== void 0) {
      const d = Ge({
        groupSize: n,
        panelElement: a,
        styleProp: o.defaultSize
      });
      s = le(d / n * 100);
    }
    let c = 0;
    if (o.minSize !== void 0) {
      const d = Ge({
        groupSize: n,
        panelElement: a,
        styleProp: o.minSize
      });
      c = le(d / n * 100);
    }
    let l = 100;
    if (o.maxSize !== void 0) {
      const d = Ge({
        groupSize: n,
        panelElement: a,
        styleProp: o.maxSize
      });
      l = le(d / n * 100);
    }
    return {
      groupResizeBehavior: o.groupResizeBehavior,
      collapsedSize: i,
      collapsible: o.collapsible === !0,
      defaultSize: s,
      disabled: o.disabled,
      minSize: c,
      maxSize: l,
      panelId: r.id
    };
  });
}
function Y(e, t = "Assertion error") {
  if (!e)
    throw Error(t);
}
function Jt(e, t) {
  return Array.from(t).sort(
    e === "horizontal" ? ws : Ss
  );
}
function ws(e, t) {
  const n = e.element.offsetLeft - t.element.offsetLeft;
  return n !== 0 ? n : e.element.offsetWidth - t.element.offsetWidth;
}
function Ss(e, t) {
  const n = e.element.offsetTop - t.element.offsetTop;
  return n !== 0 ? n : e.element.offsetHeight - t.element.offsetHeight;
}
function Er(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.ELEMENT_NODE;
}
function Nr(e, t) {
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
function Is({
  orientation: e,
  rects: t,
  targetRect: n
}) {
  const r = {
    x: n.x + n.width / 2,
    y: n.y + n.height / 2
  };
  let a, o = Number.MAX_VALUE;
  for (const i of t) {
    const { x: s, y: c } = Nr(r, i), l = e === "horizontal" ? s : c;
    l < o && (o = l, a = i);
  }
  return Y(a, "No rect found"), a;
}
let ct;
function Rs() {
  return ct === void 0 && (typeof matchMedia == "function" ? ct = !!matchMedia("(pointer:coarse)").matches : ct = !1), ct;
}
function kr(e) {
  const { element: t, orientation: n, panels: r, separators: a } = e, o = Jt(
    n,
    Array.from(t.children).filter(Er).map((v) => ({ element: v }))
  ).map(({ element: v }) => v), i = [];
  let s = !1, c = !1, l = -1, d = -1, u = 0, f, p = [];
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
        const w = r.find(
          (g) => g.element === h
        );
        if (w) {
          if (f) {
            const g = f.element.getBoundingClientRect(), b = h.getBoundingClientRect();
            let I;
            if (c) {
              const S = n === "horizontal" ? new DOMRect(
                g.right,
                g.top,
                0,
                g.height
              ) : new DOMRect(
                g.left,
                g.bottom,
                g.width,
                0
              ), P = n === "horizontal" ? new DOMRect(b.left, b.top, 0, b.height) : new DOMRect(b.left, b.top, b.width, 0);
              switch (p.length) {
                case 0: {
                  I = [
                    S,
                    P
                  ];
                  break;
                }
                case 1: {
                  const y = p[0], E = Is({
                    orientation: n,
                    rects: [g, b],
                    targetRect: y.element.getBoundingClientRect()
                  });
                  I = [
                    y,
                    E === g ? P : S
                  ];
                  break;
                }
                default: {
                  I = p;
                  break;
                }
              }
            } else
              p.length ? I = p : I = [
                n === "horizontal" ? new DOMRect(
                  g.right,
                  b.top,
                  b.left - g.right,
                  b.height
                ) : new DOMRect(
                  b.left,
                  g.bottom,
                  b.width,
                  b.top - g.bottom
                )
              ];
            for (const S of I) {
              let P = "width" in S ? S : S.element.getBoundingClientRect();
              const y = Rs() ? e.resizeTargetMinimumSize.coarse : e.resizeTargetMinimumSize.fine;
              if (P.width < y) {
                const N = y - P.width;
                P = new DOMRect(
                  P.x - N / 2,
                  P.y,
                  P.width + N,
                  P.height
                );
              }
              if (P.height < y) {
                const N = y - P.height;
                P = new DOMRect(
                  P.x,
                  P.y - N / 2,
                  P.width,
                  P.height + N
                );
              }
              const E = v <= l || v > d;
              !s && !E && i.push({
                group: e,
                groupSize: He({ group: e }),
                panels: [f, w],
                separator: "width" in S ? void 0 : S,
                rect: P
              }), s = !1;
            }
          }
          c = !1, f = w, p = [];
        }
      } else if (h.hasAttribute("data-separator")) {
        h.ariaDisabled !== null && (s = !0);
        const w = a.find(
          (g) => g.element === h
        );
        w ? p.push(w) : (f = void 0, p = []);
      } else
        c = !0;
  }
  return i;
}
var Me;
class Ar {
  constructor() {
    vn(this, Me, {});
  }
  addListener(t, n) {
    const r = qe(this, Me)[t];
    return r === void 0 ? qe(this, Me)[t] = [n] : r.includes(n) || r.push(n), () => {
      this.removeListener(t, n);
    };
  }
  emit(t, n) {
    const r = qe(this, Me)[t];
    if (r !== void 0)
      if (r.length === 1)
        r[0].call(null, n);
      else {
        let a = !1, o = null;
        const i = Array.from(r);
        for (let s = 0; s < i.length; s++) {
          const c = i[s];
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
    wn(this, Me, {});
  }
  removeListener(t, n) {
    const r = qe(this, Me)[t];
    if (r !== void 0) {
      const a = r.indexOf(n);
      a >= 0 && r.splice(a, 1);
    }
  }
}
Me = new WeakMap();
let Be = {
  cursorFlags: 0,
  state: "inactive"
};
const sn = new Ar();
function Ae() {
  return Be;
}
function xs(e) {
  return sn.addListener("change", e);
}
function Ps(e) {
  const t = Be, n = { ...Be };
  n.cursorFlags = e, Be = n, sn.emit("change", {
    prev: t,
    next: n
  });
}
function Ue(e) {
  const t = Be;
  Be = e, sn.emit("change", {
    prev: t,
    next: e
  });
}
const Ts = (e) => e, Lt = () => {
}, Lr = 1, zr = 2, Cr = 4, _r = 8, Bn = 3, Un = 12;
let lt;
function Wn() {
  return lt === void 0 && (lt = !1, typeof window < "u" && (window.navigator.userAgent.includes("Chrome") || window.navigator.userAgent.includes("Firefox")) && (lt = !0)), lt;
}
function Ms({
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
        if (e && Wn()) {
          const o = (e & Lr) !== 0, i = (e & zr) !== 0, s = (e & Cr) !== 0, c = (e & _r) !== 0;
          if (o)
            return s ? "se-resize" : c ? "ne-resize" : "e-resize";
          if (i)
            return s ? "sw-resize" : c ? "nw-resize" : "w-resize";
          if (s)
            return "s-resize";
          if (c)
            return "n-resize";
        }
        break;
      }
    }
    return Wn() ? r > 0 && a > 0 ? "move" : r > 0 ? "ew-resize" : "ns-resize" : r > 0 && a > 0 ? "grab" : r > 0 ? "col-resize" : "row-resize";
  }
}
const Hn = /* @__PURE__ */ new WeakMap();
function cn(e) {
  if (e.defaultView === null || e.defaultView === void 0)
    return;
  let { prevStyle: t, styleSheet: n } = Hn.get(e) ?? {};
  n === void 0 && (n = new e.defaultView.CSSStyleSheet(), e.adoptedStyleSheets && (Object.isExtensible(e.adoptedStyleSheets) ? e.adoptedStyleSheets.push(n) : e.adoptedStyleSheets = [
    ...e.adoptedStyleSheets,
    n
  ]));
  const r = Ae();
  switch (r.state) {
    case "active":
    case "hover": {
      const a = Ms({
        cursorFlags: r.cursorFlags,
        groups: r.hitRegions.map((i) => i.group),
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
  Hn.set(e, {
    prevStyle: t,
    styleSheet: n
  });
}
let ye = /* @__PURE__ */ new Map();
const Dr = new Ar();
function Es(e) {
  ye = new Map(ye), ye.delete(e);
}
function Jn(e, t) {
  for (const [n] of ye)
    if (n.id === e)
      return n;
}
function Ee(e, t) {
  for (const [n, r] of ye)
    if (n.id === e)
      return r;
  if (t)
    throw Error(`Could not find data for Group with id ${e}`);
}
function _e() {
  return ye;
}
function ln(e, t) {
  return Dr.addListener("groupChange", (n) => {
    n.group.id === e && t(n);
  });
}
function Pe(e, t, n) {
  const r = ye.get(e);
  ye = new Map(ye), ye.set(e, t), Dr.emit("groupChange", {
    group: e,
    isUserInteraction: (n == null ? void 0 : n.isUserInteraction) === !0,
    prev: r,
    next: t
  });
}
function $r(e) {
  const t = Ae();
  let n = !1;
  switch (t.state) {
    case "active":
      Ue({
        cursorFlags: 0,
        state: "inactive"
      }), t.hitRegions.length > 0 && (cn(e), n = !0, t.hitRegions.forEach((r) => {
        const a = Ee(r.group.id, !0);
        Pe(r.group, a, {
          isUserInteraction: !0
        });
      }));
  }
  return n;
}
function Kn(e) {
  e.defaultPrevented || $r(e.currentTarget);
}
function Ns(e, t, n) {
  let r, a = {
    x: 1 / 0,
    y: 1 / 0
  };
  for (const o of t) {
    const i = Nr(n, o.rect);
    switch (e) {
      case "horizontal": {
        i.x <= a.x && (r = o, a = i);
        break;
      }
      case "vertical": {
        i.y <= a.y && (r = o, a = i);
        break;
      }
    }
  }
  return r ? {
    distance: a,
    hitRegion: r
  } : void 0;
}
function ks(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
function As(e, t) {
  if (e === t) throw new Error("Cannot compare node with itself");
  const n = {
    a: Yn(e),
    b: Yn(t)
  };
  let r;
  for (; n.a.at(-1) === n.b.at(-1); )
    r = n.a.pop(), n.b.pop();
  Y(
    r,
    "Stacking order can only be calculated for elements with a common ancestor"
  );
  const a = {
    a: Vn(qn(n.a)),
    b: Vn(qn(n.b))
  };
  if (a.a === a.b) {
    const o = r.childNodes, i = {
      a: n.a.at(-1),
      b: n.b.at(-1)
    };
    let s = o.length;
    for (; s--; ) {
      const c = o[s];
      if (c === i.a) return 1;
      if (c === i.b) return -1;
    }
  }
  return Math.sign(a.a - a.b);
}
const Ls = /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;
function zs(e) {
  const t = getComputedStyle(Fr(e) ?? e).display;
  return t === "flex" || t === "inline-flex";
}
function Cs(e) {
  const t = getComputedStyle(e);
  return !!(t.position === "fixed" || t.zIndex !== "auto" && (t.position !== "static" || zs(e)) || +t.opacity < 1 || "transform" in t && t.transform !== "none" || "webkitTransform" in t && t.webkitTransform !== "none" || "mixBlendMode" in t && t.mixBlendMode !== "normal" || "filter" in t && t.filter !== "none" || "webkitFilter" in t && t.webkitFilter !== "none" || "isolation" in t && t.isolation === "isolate" || Ls.test(t.willChange) || t.webkitOverflowScrolling === "touch");
}
function qn(e) {
  let t = e.length;
  for (; t--; ) {
    const n = e[t];
    if (Y(n, "Missing node"), Cs(n)) return n;
  }
  return null;
}
function Vn(e) {
  return e && Number(getComputedStyle(e).zIndex) || 0;
}
function Yn(e) {
  const t = [];
  for (; e; )
    t.push(e), e = Fr(e);
  return t;
}
function Fr(e) {
  const { parentNode: t } = e;
  return ks(t) ? t.host : t;
}
function _s(e, t) {
  return e.x < t.x + t.width && e.x + e.width > t.x && e.y < t.y + t.height && e.y + e.height > t.y;
}
function Ds({
  groupElement: e,
  hitRegion: t,
  pointerEventTarget: n
}) {
  if (!Er(n) || n.contains(e) || e.contains(n))
    return !0;
  if (As(n, e) > 0) {
    let r = n;
    for (; r; ) {
      if (r.contains(e))
        return !0;
      if (_s(r.getBoundingClientRect(), t))
        return !1;
      r = r.parentElement;
    }
  }
  return !0;
}
function un(e, t) {
  const n = [];
  return t.forEach((r, a) => {
    if (a.disabled)
      return;
    const o = kr(a), i = Ns(a.orientation, o, {
      x: e.clientX,
      y: e.clientY
    });
    i && i.distance.x <= 0 && i.distance.y <= 0 && Ds({
      groupElement: a.element,
      hitRegion: i.hitRegion.rect,
      pointerEventTarget: e.target
    }) && n.push(i.hitRegion);
  }), n;
}
function $s(e, t) {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n++)
    if (e[n] != t[n])
      return !1;
  return !0;
}
function ce(e, t, n = 0) {
  return Math.abs(le(e) - le(t)) <= n;
}
function be(e, t) {
  return ce(e, t) ? 0 : e > t ? 1 : -1;
}
function Oe({
  overrideDisabledPanels: e,
  panelConstraints: t,
  prevSize: n,
  size: r
}) {
  const {
    collapsedSize: a = 0,
    collapsible: o,
    disabled: i,
    maxSize: s = 100,
    minSize: c = 0
  } = t;
  if (i && !e)
    return n;
  if (be(r, c) < 0)
    if (o) {
      const l = (a + c) / 2;
      be(r, l) < 0 ? r = a : r = c;
    } else
      r = c;
  return r = Math.min(s, r), r = le(r), r;
}
function rt({
  delta: e,
  initialLayout: t,
  panelConstraints: n,
  pivotIndices: r,
  prevLayout: a,
  trigger: o
}) {
  if (ce(e, 0))
    return t;
  const i = o === "imperative-api", s = Object.values(t), c = Object.values(a), l = [...s], [d, u] = r;
  Y(d != null, "Invalid first pivot index"), Y(u != null, "Invalid second pivot index");
  let f = 0;
  switch (o) {
    case "keyboard": {
      {
        const h = e < 0 ? u : d, w = n[h];
        Y(
          w,
          `Panel constraints not found for index ${h}`
        );
        const {
          collapsedSize: g = 0,
          collapsible: b,
          minSize: I = 0
        } = w;
        if (b) {
          const S = s[h];
          if (Y(
            S != null,
            `Previous layout not found for panel index ${h}`
          ), ce(S, g)) {
            const P = I - S;
            be(P, Math.abs(e)) > 0 && (e = e < 0 ? 0 - P : P);
          }
        }
      }
      {
        const h = e < 0 ? d : u, w = n[h];
        Y(
          w,
          `No panel constraints found for index ${h}`
        );
        const {
          collapsedSize: g = 0,
          collapsible: b,
          minSize: I = 0
        } = w;
        if (b) {
          const S = s[h];
          if (Y(
            S != null,
            `Previous layout not found for panel index ${h}`
          ), ce(S, I)) {
            const P = S - g;
            be(P, Math.abs(e)) > 0 && (e = e < 0 ? 0 - P : P);
          }
        }
      }
      break;
    }
    default: {
      const h = e < 0 ? u : d, w = n[h];
      Y(
        w,
        `Panel constraints not found for index ${h}`
      );
      const g = s[h], { collapsible: b, collapsedSize: I, minSize: S } = w;
      if (b && be(g, S) < 0)
        if (e > 0) {
          const P = S - I, y = P / 2, E = g + e;
          be(E, S) < 0 && (e = be(e, y) <= 0 ? 0 : P);
        } else {
          const P = S - I, y = 100 - P / 2, E = g - e;
          be(E, S) < 0 && (e = be(100 + e, y) > 0 ? 0 : -P);
        }
      break;
    }
  }
  {
    const h = e < 0 ? 1 : -1;
    let w = e < 0 ? u : d, g = 0;
    for (; ; ) {
      const I = s[w];
      Y(
        I != null,
        `Previous layout not found for panel index ${w}`
      );
      const S = Oe({
        overrideDisabledPanels: i,
        panelConstraints: n[w],
        prevSize: I,
        size: 100
      }) - I;
      if (g += S, w += h, w < 0 || w >= n.length)
        break;
    }
    const b = Math.min(Math.abs(e), Math.abs(g));
    e = e < 0 ? 0 - b : b;
  }
  {
    let h = e < 0 ? d : u;
    for (; h >= 0 && h < n.length; ) {
      const w = Math.abs(e) - Math.abs(f), g = s[h];
      Y(
        g != null,
        `Previous layout not found for panel index ${h}`
      );
      const b = g - w, I = Oe({
        overrideDisabledPanels: i,
        panelConstraints: n[h],
        prevSize: g,
        size: b
      });
      if (!ce(g, I) && (f += g - I, l[h] = I, f.toFixed(3).localeCompare(Math.abs(e).toFixed(3), void 0, {
        numeric: !0
      }) >= 0))
        break;
      e < 0 ? h-- : h++;
    }
  }
  if ($s(c, l))
    return a;
  {
    const h = e < 0 ? u : d, w = s[h];
    Y(
      w != null,
      `Previous layout not found for panel index ${h}`
    );
    const g = w + f, b = Oe({
      overrideDisabledPanels: i,
      panelConstraints: n[h],
      prevSize: w,
      size: g
    });
    if (l[h] = b, !ce(b, g)) {
      let I = g - b, S = e < 0 ? u : d;
      for (; S >= 0 && S < n.length; ) {
        const P = l[S];
        Y(
          P != null,
          `Previous layout not found for panel index ${S}`
        );
        const y = P + I, E = Oe({
          overrideDisabledPanels: i,
          panelConstraints: n[S],
          prevSize: P,
          size: y
        });
        if (ce(P, E) || (I -= E - P, l[S] = E), ce(I, 0))
          break;
        e > 0 ? S-- : S++;
      }
    }
  }
  const p = Object.values(l).reduce(
    (h, w) => w + h,
    0
  );
  if (!ce(p, 100, 0.1))
    return a;
  const v = Object.keys(a);
  return l.reduce((h, w, g) => (h[v[g]] = w, h), {});
}
function Le(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (t[n] === void 0 || be(e[n], t[n]) !== 0)
      return !1;
  return !0;
}
function ze({
  layout: e,
  panelConstraints: t
}) {
  const n = Object.values(e), r = [...n], a = r.reduce(
    (s, c) => s + c,
    0
  );
  if (r.length !== t.length)
    throw Error(
      `Invalid ${t.length} panel layout: ${r.map((s) => `${s}%`).join(", ")}`
    );
  if (!ce(a, 100) && r.length > 0)
    for (let s = 0; s < t.length; s++) {
      const c = r[s];
      Y(c != null, `No layout data found for index ${s}`);
      const l = 100 / a * c;
      r[s] = l;
    }
  let o = 0;
  for (let s = 0; s < t.length; s++) {
    const c = n[s];
    Y(c != null, `No layout data found for index ${s}`);
    const l = r[s];
    Y(l != null, `No layout data found for index ${s}`);
    const d = Oe({
      overrideDisabledPanels: !0,
      panelConstraints: t[s],
      prevSize: c,
      size: l
    });
    l != d && (o += l - d, r[s] = d);
  }
  if (!ce(o, 0))
    for (let s = 0; s < t.length; s++) {
      const c = r[s];
      Y(c != null, `No layout data found for index ${s}`);
      const l = c + o, d = Oe({
        overrideDisabledPanels: !0,
        panelConstraints: t[s],
        prevSize: c,
        size: l
      });
      if (c !== d && (o -= d - c, r[s] = d, ce(o, 0)))
        break;
    }
  const i = Object.keys(e);
  return r.reduce((s, c, l) => (s[i[l]] = c, s), {});
}
function Or({
  groupId: e,
  panelId: t
}) {
  const n = () => {
    const c = _e();
    for (const [
      l,
      {
        defaultLayoutDeferred: d,
        derivedPanelConstraints: u,
        layout: f,
        groupSize: p,
        separatorToPanels: v
      }
    ] of c)
      if (l.id === e)
        return {
          defaultLayoutDeferred: d,
          derivedPanelConstraints: u,
          group: l,
          groupSize: p,
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
  }, i = ({
    nextSize: c,
    panels: l,
    prevLayout: d,
    derivedPanelConstraints: u
  }) => {
    const f = o(), p = l.findIndex((w) => w.id === t), v = p === 0, h = p === l.length - 1;
    if (h && c < f && (v || l.slice(0, p).every((w, g) => {
      const b = u[g];
      return (b == null ? void 0 : b.collapsible) && ce(b.collapsedSize, d[b.panelId]);
    }))) {
      const w = l.slice(0, p).reduce((g, b) => g + d[b.id], 0);
      return {
        ...d,
        [t]: le(100 - w)
      };
    }
    return rt({
      delta: h ? f - c : c - f,
      initialLayout: d,
      panelConstraints: u,
      pivotIndices: h ? [p - 1, p] : [p, p + 1],
      prevLayout: d,
      trigger: "imperative-api"
    });
  }, s = (c) => {
    const l = o();
    if (c === l)
      return;
    const {
      defaultLayoutDeferred: d,
      derivedPanelConstraints: u,
      group: f,
      groupSize: p,
      layout: v,
      separatorToPanels: h
    } = n(), w = i({
      nextSize: c,
      panels: f.panels,
      prevLayout: v,
      derivedPanelConstraints: u
    }), g = ze({
      layout: w,
      panelConstraints: u
    });
    Le(v, g) || Pe(f, {
      defaultLayoutDeferred: d,
      derivedPanelConstraints: u,
      groupSize: p,
      layout: g,
      separatorToPanels: h
    });
  };
  return {
    collapse: () => {
      const { collapsible: c, collapsedSize: l } = r(), { mutableValues: d } = a(), u = o();
      c && u !== l && (d.expandToSize = u, s(l));
    },
    expand: () => {
      const { collapsible: c, collapsedSize: l, minSize: d } = r(), { mutableValues: u } = a(), f = o();
      if (c && f === l) {
        let p = u.expandToSize ?? d;
        p === 0 && (p = 1), s(p);
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
      return c && ce(l, d);
    },
    resize: (c) => {
      const { group: l } = n(), { element: d } = a(), u = He({ group: l }), f = Ge({
        groupSize: u,
        panelElement: d,
        styleProp: c
      }), p = le(f / u * 100);
      s(p);
    }
  };
}
function Gn(e) {
  if (e.defaultPrevented)
    return;
  const t = _e();
  un(e, t).forEach((n) => {
    if (n.separator && !n.separator.disableDoubleClick) {
      const r = n.panels.find(
        (a) => a.panelConstraints.defaultSize !== void 0
      );
      if (r) {
        const a = r.panelConstraints.defaultSize, o = Or({
          groupId: n.group.id,
          panelId: r.id
        });
        o && a !== void 0 && (o.resize(a), e.preventDefault());
      }
    }
  });
}
function pt(e) {
  const t = _e();
  for (const [n] of t)
    if (n.separators.some(
      (r) => r.element === e
    ))
      return n;
  throw Error("Could not find parent Group for separator element");
}
function jr({
  groupId: e
}) {
  const t = () => {
    const n = _e();
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
        groupSize: i,
        layout: s,
        separatorToPanels: c
      } = t(), l = ze({
        layout: n,
        panelConstraints: a
      });
      return r ? s : (Le(s, l) || Pe(o, {
        defaultLayoutDeferred: r,
        derivedPanelConstraints: a,
        groupSize: i,
        layout: l,
        separatorToPanels: c
      }), l);
    }
  };
}
function Ne(e, t) {
  const n = pt(e), r = Ee(n.id, !0), a = n.separators.find(
    (d) => d.element === e
  );
  Y(a, "Matching separator not found");
  const o = r.separatorToPanels.get(a);
  Y(o, "Matching panels not found");
  const i = o.map((d) => n.panels.indexOf(d)), s = jr({ groupId: n.id }).getLayout(), c = rt({
    delta: t,
    initialLayout: s,
    panelConstraints: r.derivedPanelConstraints,
    pivotIndices: i,
    prevLayout: s,
    trigger: "keyboard"
  }), l = ze({
    layout: c,
    panelConstraints: r.derivedPanelConstraints
  });
  Le(s, l) || Pe(
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
function Xn(e) {
  if (e.defaultPrevented)
    return;
  const t = e.currentTarget, n = pt(t);
  if (!n.disabled)
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault(), n.orientation === "vertical" && Ne(t, 5);
        break;
      }
      case "ArrowLeft": {
        e.preventDefault(), n.orientation === "horizontal" && Ne(t, -5);
        break;
      }
      case "ArrowRight": {
        e.preventDefault(), n.orientation === "horizontal" && Ne(t, 5);
        break;
      }
      case "ArrowUp": {
        e.preventDefault(), n.orientation === "vertical" && Ne(t, -5);
        break;
      }
      case "End": {
        e.preventDefault(), Ne(t, 100);
        break;
      }
      case "Enter": {
        e.preventDefault();
        const r = pt(t), a = Ee(r.id, !0), { derivedPanelConstraints: o, layout: i, separatorToPanels: s } = a, c = r.separators.find(
          (f) => f.element === t
        );
        Y(c, "Matching separator not found");
        const l = s.get(c);
        Y(l, "Matching panels not found");
        const d = l[0], u = o.find(
          (f) => f.panelId === d.id
        );
        if (Y(u, "Panel metadata not found"), u.collapsible) {
          const f = i[d.id], p = u.collapsedSize === f ? r.mutableState.expandedPanelSizes[d.id] ?? u.minSize : u.collapsedSize;
          Ne(t, p - f);
        }
        break;
      }
      case "F6": {
        e.preventDefault();
        const r = pt(t).separators.map(
          (i) => i.element
        ), a = Array.from(r).findIndex(
          (i) => i === e.currentTarget
        );
        Y(a !== null, "Index not found");
        const o = e.shiftKey ? a > 0 ? a - 1 : r.length - 1 : a + 1 < r.length ? a + 1 : 0;
        r[o].focus({
          preventScroll: !0
        });
        break;
      }
      case "Home": {
        e.preventDefault(), Ne(t, -100);
        break;
      }
    }
}
function Zn(e) {
  if (e.defaultPrevented || e.pointerType === "mouse" && e.button > 0)
    return;
  const t = _e(), n = un(e, t), r = /* @__PURE__ */ new Map();
  let a = !1;
  n.forEach((o) => {
    o.separator && (a || (a = !0, o.separator.element.focus({
      // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#browser_compatibility
      focusVisible: !1,
      preventScroll: !0
    })));
    const i = t.get(o.group);
    i && r.set(o.group, i.layout);
  }), Ue({
    cursorFlags: 0,
    hitRegions: n,
    initialLayoutMap: r,
    pointerDownAtPoint: { x: e.clientX, y: e.clientY },
    state: "active"
  }), n.length && e.preventDefault();
}
function Br({
  document: e,
  event: t,
  hitRegions: n,
  initialLayoutMap: r,
  mountedGroups: a,
  pointerDownAtPoint: o,
  prevCursorFlags: i
}) {
  let s = 0;
  n.forEach((l) => {
    const { group: d, groupSize: u } = l, { orientation: f, panels: p } = d, { disableCursor: v } = d.mutableState;
    let h = 0;
    o ? f === "horizontal" ? h = (t.clientX - o.x) / u * 100 : h = (t.clientY - o.y) / u * 100 : f === "horizontal" ? h = t.clientX < 0 ? -100 : 100 : h = t.clientY < 0 ? -100 : 100;
    const w = r.get(d), g = a.get(d);
    if (!w || !g)
      return;
    const {
      defaultLayoutDeferred: b,
      derivedPanelConstraints: I,
      groupSize: S,
      layout: P,
      separatorToPanels: y
    } = g;
    if (I && P && y) {
      const E = rt({
        delta: h,
        initialLayout: w,
        panelConstraints: I,
        pivotIndices: l.panels.map((N) => p.indexOf(N)),
        prevLayout: P,
        trigger: "mouse-or-touch"
      });
      if (Le(E, P)) {
        if (h !== 0 && !v)
          switch (f) {
            case "horizontal": {
              s |= h < 0 ? Lr : zr;
              break;
            }
            case "vertical": {
              s |= h < 0 ? Cr : _r;
              break;
            }
          }
      } else
        Pe(l.group, {
          defaultLayoutDeferred: b,
          derivedPanelConstraints: I,
          groupSize: S,
          layout: E,
          separatorToPanels: y
        });
    }
  });
  let c = 0;
  t.movementX === 0 ? c |= i & Bn : c |= s & Bn, t.movementY === 0 ? c |= i & Un : c |= s & Un, Ps(c), cn(e);
}
function Qn(e) {
  const t = _e(), n = Ae();
  switch (n.state) {
    case "active":
      Br({
        document: e.currentTarget,
        event: e,
        hitRegions: n.hitRegions,
        initialLayoutMap: n.initialLayoutMap,
        mountedGroups: t,
        prevCursorFlags: n.cursorFlags
      });
  }
}
function er(e) {
  var r, a;
  if (e.defaultPrevented)
    return;
  const t = Ae(), n = _e();
  switch (t.state) {
    case "active": {
      if (
        // Skip this check for "pointerleave" events, else Firefox triggers a false positive (see #514)
        e.buttons === 0
      ) {
        Ue({
          cursorFlags: 0,
          state: "inactive"
        }), t.hitRegions.forEach((o) => {
          const i = Ee(o.group.id, !0);
          Pe(o.group, i, {
            isUserInteraction: !0
          });
        });
        return;
      }
      for (const o of t.hitRegions)
        if (o.separator) {
          const { element: i } = o.separator;
          (r = i.hasPointerCapture) != null && r.call(i, e.pointerId) || ((a = i.setPointerCapture) == null || a.call(i, e.pointerId));
        }
      Br({
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
      const o = un(e, n);
      o.length === 0 ? t.state !== "inactive" && Ue({
        cursorFlags: 0,
        state: "inactive"
      }) : Ue({
        cursorFlags: 0,
        hitRegions: o,
        state: "hover"
      }), cn(e.currentTarget);
      break;
    }
  }
}
function tr(e) {
  if (e.relatedTarget instanceof HTMLIFrameElement)
    switch (Ae().state) {
      case "hover":
        Ue({
          cursorFlags: 0,
          state: "inactive"
        });
    }
}
function nr(e) {
  e.defaultPrevented || e.pointerType === "mouse" && e.button > 0 || $r(e.currentTarget) && e.preventDefault();
}
function rr(e) {
  let t = 0, n = 0;
  const r = {};
  for (const o of e)
    if (o.defaultSize !== void 0) {
      t++;
      const i = le(o.defaultSize);
      n += i, r[o.panelId] = i;
    } else
      r[o.panelId] = void 0;
  const a = e.length - t;
  if (a !== 0) {
    const o = le((100 - n) / a);
    for (const i of e)
      i.defaultSize === void 0 && (r[i.panelId] = o);
  }
  return r;
}
function Fs(e, t, n) {
  if (!n[0])
    return;
  const r = e.panels.find((c) => c.element === t);
  if (!r || !r.onResize)
    return;
  const a = He({ group: e }), o = e.orientation === "horizontal" ? r.element.offsetWidth : r.element.offsetHeight, i = r.mutableValues.prevSize, s = {
    asPercentage: le(o / a * 100),
    inPixels: o
  };
  r.mutableValues.prevSize = s, r.onResize(s, r.id, i);
}
function Os(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (e[n] !== t[n])
      return !1;
  return !0;
}
function js({
  group: e,
  nextGroupSize: t,
  prevGroupSize: n,
  prevLayout: r
}) {
  if (n <= 0 || t <= 0 || n === t)
    return r;
  let a = 0, o = 0, i = !1;
  const s = /* @__PURE__ */ new Map(), c = [];
  for (const u of e.panels) {
    const f = r[u.id] ?? 0;
    switch (u.panelConstraints.groupResizeBehavior) {
      case "preserve-pixel-size": {
        i = !0;
        const p = f / 100 * n, v = le(
          p / t * 100
        );
        s.set(u.id, v), a += v;
        break;
      }
      case "preserve-relative-size":
      default: {
        c.push(u.id), o += f;
        break;
      }
    }
  }
  if (!i || c.length === 0)
    return r;
  const l = 100 - a, d = { ...r };
  if (s.forEach((u, f) => {
    d[f] = u;
  }), o > 0)
    for (const u of c) {
      const f = r[u] ?? 0;
      d[u] = le(
        f / o * l
      );
    }
  else {
    const u = le(
      l / c.length
    );
    for (const f of c)
      d[f] = u;
  }
  return d;
}
function Bs(e, t) {
  const n = e.map((a) => a.id), r = Object.keys(t);
  if (n.length !== r.length)
    return !1;
  for (const a of n)
    if (!r.includes(a))
      return !1;
  return !0;
}
const $e = /* @__PURE__ */ new Map();
function Us(e) {
  let t = !0;
  Y(
    e.element.ownerDocument.defaultView,
    "Cannot register an unmounted Group"
  );
  const n = e.element.ownerDocument.defaultView.ResizeObserver, r = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), o = new n((v) => {
    for (const h of v) {
      const { borderBoxSize: w, target: g } = h;
      if (g === e.element) {
        if (t) {
          const b = He({ group: e });
          if (b === 0)
            return;
          const I = Ee(e.id);
          if (!I)
            return;
          const S = Ht(e), P = I.defaultLayoutDeferred ? rr(S) : I.layout, y = js({
            group: e,
            nextGroupSize: b,
            prevGroupSize: I.groupSize,
            prevLayout: P
          }), E = ze({
            layout: y,
            panelConstraints: S
          });
          if (!I.defaultLayoutDeferred && Le(I.layout, E) && Os(
            I.derivedPanelConstraints,
            S
          ) && I.groupSize === b)
            return;
          Pe(e, {
            defaultLayoutDeferred: !1,
            derivedPanelConstraints: S,
            groupSize: b,
            layout: E,
            separatorToPanels: I.separatorToPanels
          });
        }
      } else
        Fs(e, g, w);
    }
  });
  o.observe(e.element), e.panels.forEach((v) => {
    Y(
      !r.has(v.id),
      `Panel ids must be unique; id "${v.id}" was used more than once`
    ), r.add(v.id), v.onResize && o.observe(v.element);
  });
  const i = He({ group: e }), s = Ht(e), c = e.panels.map(({ id: v }) => v).join(",");
  let l = e.mutableState.defaultLayout;
  l && (Bs(e.panels, l) || (l = void 0));
  const d = e.mutableState.layouts[c] ?? l ?? rr(s), u = ze({
    layout: d,
    panelConstraints: s
  }), f = e.element.ownerDocument;
  $e.set(
    f,
    ($e.get(f) ?? 0) + 1
  );
  const p = /* @__PURE__ */ new Map();
  return kr(e).forEach((v) => {
    v.separator && p.set(v.separator, v.panels);
  }), Pe(e, {
    defaultLayoutDeferred: i === 0,
    derivedPanelConstraints: s,
    groupSize: i,
    layout: u,
    separatorToPanels: p
  }), e.separators.forEach((v) => {
    Y(
      !a.has(v.id),
      `Separator ids must be unique; id "${v.id}" was used more than once`
    ), a.add(v.id), v.element.addEventListener("keydown", Xn);
  }), $e.get(f) === 1 && (f.addEventListener("contextmenu", Kn, !0), f.addEventListener("dblclick", Gn, !0), f.addEventListener("pointerdown", Zn, !0), f.addEventListener("pointerleave", Qn), f.addEventListener("pointermove", er), f.addEventListener("pointerout", tr), f.addEventListener("pointerup", nr, !0)), function() {
    t = !1, $e.set(
      f,
      Math.max(0, ($e.get(f) ?? 0) - 1)
    ), Es(e), e.separators.forEach((v) => {
      v.element.removeEventListener("keydown", Xn);
    }), $e.get(f) || (f.removeEventListener(
      "contextmenu",
      Kn,
      !0
    ), f.removeEventListener(
      "dblclick",
      Gn,
      !0
    ), f.removeEventListener(
      "pointerdown",
      Zn,
      !0
    ), f.removeEventListener("pointerleave", Qn), f.removeEventListener("pointermove", er), f.removeEventListener("pointerout", tr), f.removeEventListener("pointerup", nr, !0)), o.disconnect();
  };
}
function Ws() {
  const [e, t] = z({}), n = A(() => t({}), []);
  return [e, n];
}
function dn(e) {
  const t = Xt();
  return `${e ?? t}`;
}
const De = typeof window < "u" ? Ce : F;
function Qe(e) {
  const t = L(e);
  return De(() => {
    t.current = e;
  }, [e]), A(
    (...n) => {
      var r;
      return (r = t.current) == null ? void 0 : r.call(t, ...n);
    },
    [t]
  );
}
function fn(...e) {
  return Qe((t) => {
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
function pn(e) {
  const t = L({ ...e });
  return De(() => {
    for (const n in e)
      t.current[n] = e[n];
  }, [e]), t.current;
}
const Ur = no(null);
function Hs(e, t) {
  const n = L({
    getLayout: () => ({}),
    setLayout: Ts
  });
  Gt(t, () => n.current, []), De(() => {
    Object.assign(
      n.current,
      jr({ groupId: e })
    );
  });
}
function Wr({
  children: e,
  className: t,
  defaultLayout: n,
  disableCursor: r,
  disabled: a,
  elementRef: o,
  groupRef: i,
  id: s,
  onLayoutChange: c,
  onLayoutChanged: l,
  orientation: d = "horizontal",
  resizeTargetMinimumSize: u = {
    coarse: 20,
    fine: 10
  },
  style: f,
  ...p
}) {
  const v = L({
    onLayoutChange: {},
    onLayoutChanged: {}
  }), h = Qe((x) => {
    Le(v.current.onLayoutChange, x) || (v.current.onLayoutChange = x, c == null || c(x));
  }), w = Qe(
    (x, R) => {
      Le(v.current.onLayoutChanged, x) || (v.current.onLayoutChanged = x, l == null || l(x, { isUserInteraction: R }));
    }
  ), g = dn(s), b = L(null), [I, S] = Ws(), P = L({
    lastExpandedPanelSizes: {},
    layouts: {},
    panels: [],
    resizeTargetMinimumSize: u,
    separators: []
  }), y = fn(b, o);
  Hs(g, i);
  const E = Qe(
    (x, R) => {
      const k = Ae(), D = Jn(x), O = Ee(x);
      if (O) {
        let _ = !1;
        switch (k.state) {
          case "active": {
            _ = k.hitRegions.some(
              (B) => B.group === D
            );
            break;
          }
        }
        return {
          flexGrow: O.layout[R] ?? 1,
          pointerEvents: _ ? "none" : void 0
        };
      }
      if (n != null && n[R])
        return {
          flexGrow: n == null ? void 0 : n[R]
        };
    }
  ), N = pn({
    defaultLayout: n,
    disableCursor: r
  }), T = Z(
    () => ({
      get disableCursor() {
        return !!N.disableCursor;
      },
      getPanelStyles: E,
      id: g,
      orientation: d,
      registerPanel: (x) => {
        const R = P.current;
        return R.panels = Jt(d, [
          ...R.panels,
          x
        ]), S(), () => {
          R.panels = R.panels.filter(
            (k) => k !== x
          ), S();
        };
      },
      registerSeparator: (x) => {
        const R = P.current;
        return R.separators = Jt(d, [
          ...R.separators,
          x
        ]), S(), () => {
          R.separators = R.separators.filter(
            (k) => k !== x
          ), S();
        };
      },
      updatePanelProps: (x, { disabled: R }) => {
        const k = P.current.panels.find(
          (_) => _.id === x
        );
        k && (k.panelConstraints.disabled = R);
        const D = Jn(g), O = Ee(g);
        D && O && Pe(D, {
          ...O,
          derivedPanelConstraints: Ht(D)
        });
      },
      updateSeparatorProps: (x, {
        disabled: R,
        disableDoubleClick: k
      }) => {
        const D = P.current.separators.find(
          (O) => O.id === x
        );
        D && (D.disabled = R, D.disableDoubleClick = k);
      }
    }),
    [E, g, S, d, N]
  ), M = L(null);
  return De(() => {
    const x = b.current;
    if (x === null)
      return;
    const R = P.current;
    let k;
    if (N.defaultLayout !== void 0 && Object.keys(N.defaultLayout).length === R.panels.length) {
      k = {};
      for (const W of R.panels) {
        const oe = N.defaultLayout[W.id];
        oe !== void 0 && (k[W.id] = oe);
      }
    }
    const D = {
      disabled: !!a,
      element: x,
      id: g,
      mutableState: {
        defaultLayout: k,
        disableCursor: !!N.disableCursor,
        expandedPanelSizes: P.current.lastExpandedPanelSizes,
        layouts: P.current.layouts
      },
      orientation: d,
      panels: R.panels,
      resizeTargetMinimumSize: R.resizeTargetMinimumSize,
      separators: R.separators
    };
    M.current = D;
    const O = Us(D), { defaultLayoutDeferred: _, derivedPanelConstraints: B, layout: H } = Ee(D.id, !0);
    !_ && B.length > 0 && (h(H), w(H, !1));
    const X = ln(g, (W) => {
      const { defaultLayoutDeferred: oe, derivedPanelConstraints: te, layout: j } = W.next;
      if (oe || te.length === 0)
        return;
      const ne = D.panels.map(({ id: re }) => re).join(",");
      D.mutableState.layouts[ne] = j, te.forEach((re) => {
        if (re.collapsible) {
          const { layout: U } = W.prev ?? {};
          if (U) {
            const se = ce(
              re.collapsedSize,
              j[re.panelId]
            ), q = ce(
              re.collapsedSize,
              U[re.panelId]
            );
            se && !q && (D.mutableState.expandedPanelSizes[re.panelId] = U[re.panelId]);
          }
        }
      });
      const pe = Ae().state !== "active";
      h(j), pe && w(j, W.isUserInteraction);
    });
    return () => {
      M.current = null, O(), X();
    };
  }, [
    a,
    g,
    w,
    h,
    d,
    I,
    N
  ]), F(() => {
    const x = M.current;
    x && (x.mutableState.defaultLayout = n, x.mutableState.disableCursor = !!r);
  }), /* @__PURE__ */ m(Ur.Provider, { value: T, children: /* @__PURE__ */ m(
    "div",
    {
      ...p,
      className: t,
      "data-group": !0,
      "data-testid": g,
      id: g,
      ref: y,
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
Wr.displayName = "Group";
function mn() {
  const e = ro(Ur);
  return Y(
    e,
    "Group Context not found; did you render a Panel or Separator outside of a Group?"
  ), e;
}
function Js(e, t) {
  const { id: n } = mn(), r = L({
    collapse: Lt,
    expand: Lt,
    getSize: () => ({
      asPercentage: 0,
      inPixels: 0
    }),
    isCollapsed: () => !1,
    resize: Lt
  });
  Gt(t, () => r.current, []), De(() => {
    Object.assign(
      r.current,
      Or({ groupId: n, panelId: e })
    );
  });
}
function Kt({
  children: e,
  className: t,
  collapsedSize: n = "0%",
  collapsible: r = !1,
  defaultSize: a,
  disabled: o,
  elementRef: i,
  groupResizeBehavior: s = "preserve-relative-size",
  id: c,
  maxSize: l = "100%",
  minSize: d = "0%",
  onResize: u,
  panelRef: f,
  style: p,
  ...v
}) {
  const h = !!c, w = dn(c), g = pn({
    disabled: o
  }), b = L(null), I = fn(b, i), {
    getPanelStyles: S,
    id: P,
    orientation: y,
    registerPanel: E,
    updatePanelProps: N
  } = mn(), T = u !== null, M = Qe(
    (D, O, _) => {
      u == null || u(D, c, _);
    }
  );
  De(() => {
    const D = b.current;
    if (D !== null) {
      const O = {
        element: D,
        id: w,
        idIsStable: h,
        mutableValues: {
          expandToSize: void 0,
          prevSize: void 0
        },
        onResize: T ? M : void 0,
        panelConstraints: {
          groupResizeBehavior: s,
          collapsedSize: n,
          collapsible: r,
          defaultSize: a,
          disabled: g.disabled,
          maxSize: l,
          minSize: d
        }
      };
      return E(O);
    }
  }, [
    s,
    n,
    r,
    a,
    T,
    w,
    h,
    l,
    d,
    M,
    E,
    g
  ]), F(() => {
    N(w, { disabled: o });
  }, [o, w, N]), Js(w, f);
  const x = () => {
    const D = S(P, w);
    if (D)
      return JSON.stringify(D);
  }, R = to(
    (D) => ln(P, D),
    x,
    x
  );
  let k;
  return R ? k = JSON.parse(R) : a !== void 0 ? k = {
    flexGrow: void 0,
    flexShrink: void 0,
    flexBasis: a
  } : k = { flexGrow: 1 }, /* @__PURE__ */ m(
    "div",
    {
      ...v,
      "data-disabled": o || void 0,
      "data-panel": !0,
      "data-testid": w,
      id: w,
      ref: I,
      style: {
        ...Ks,
        display: "flex",
        flexBasis: 0,
        flexShrink: 1,
        overflow: "visible",
        ...k
      },
      children: /* @__PURE__ */ m(
        "div",
        {
          className: t,
          style: {
            maxHeight: "100%",
            maxWidth: "100%",
            flexGrow: 1,
            overflow: "auto",
            ...p,
            // Inform the browser that the library is handling touch events for this element
            // but still allow users to scroll content within panels in the non-resizing direction
            // NOTE This is not an inherited style
            // See github.com/bvaughn/react-resizable-panels/issues/662
            touchAction: y === "horizontal" ? "pan-y" : "pan-x"
          },
          children: e
        }
      )
    }
  );
}
Kt.displayName = "Panel";
const Ks = {
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
function qs({
  layout: e,
  panelConstraints: t,
  panelId: n,
  panelIndex: r
}) {
  let a, o;
  const i = e[n], s = t.find(
    (c) => c.panelId === n
  );
  if (s) {
    const c = s.maxSize, l = s.collapsible ? s.collapsedSize : s.minSize, d = [r, r + 1];
    o = ze({
      layout: rt({
        delta: l - i,
        initialLayout: e,
        panelConstraints: t,
        pivotIndices: d,
        prevLayout: e
      }),
      panelConstraints: t
    })[n], a = ze({
      layout: rt({
        delta: c - i,
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
    valueNow: i
  };
}
function Hr({
  children: e,
  className: t,
  disabled: n,
  disableDoubleClick: r,
  elementRef: a,
  id: o,
  style: i,
  ...s
}) {
  const c = dn(o), l = pn({
    disabled: n,
    disableDoubleClick: r
  }), [d, u] = z({}), [f, p] = z("inactive"), [v, h] = z(!1), w = L(null), g = fn(w, a), {
    disableCursor: b,
    id: I,
    orientation: S,
    registerSeparator: P,
    updateSeparatorProps: y
  } = mn(), E = S === "horizontal" ? "vertical" : "horizontal";
  De(() => {
    const M = w.current;
    if (M !== null) {
      const x = {
        disabled: l.disabled,
        disableDoubleClick: l.disableDoubleClick,
        element: M,
        id: c
      }, R = P(x), k = xs(
        (O) => {
          p(
            O.next.state !== "inactive" && O.next.hitRegions.some(
              (_) => _.separator === x
            ) ? O.next.state : "inactive"
          );
        }
      ), D = ln(
        I,
        (O) => {
          const { derivedPanelConstraints: _, layout: B, separatorToPanels: H } = O.next, X = H.get(x);
          if (X) {
            const W = X[0], oe = X.indexOf(W);
            u(
              qs({
                layout: B,
                panelConstraints: _,
                panelId: W.id,
                panelIndex: oe
              })
            );
          }
        }
      );
      return () => {
        k(), D(), R();
      };
    }
  }, [I, c, P, l]), F(() => {
    y(c, { disabled: n, disableDoubleClick: r });
  }, [n, r, c, y]);
  let N;
  n && !b && (N = "not-allowed");
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
  return /* @__PURE__ */ m(
    "div",
    {
      ...s,
      "aria-controls": d.valueControls,
      "aria-disabled": n || void 0,
      "aria-orientation": E,
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
      ref: g,
      role: "separator",
      style: {
        flexBasis: "auto",
        cursor: N,
        ...i,
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
Hr.displayName = "Separator";
const hn = "reader-document", ot = "reader-assistant", Jr = "retainpdf.reader.ai-split-layout.v1", Vs = 30, Ys = 65, Gs = {
  [hn]: 50,
  [ot]: 50
};
function gn(e) {
  const t = Number(e == null ? void 0 : e[ot]), n = Number.isFinite(t) ? Math.min(Ys, Math.max(Vs, t)) : 50;
  return {
    [hn]: 100 - n,
    [ot]: n
  };
}
function Xs() {
  try {
    const e = JSON.parse(localStorage.getItem(Jr) || "null");
    return gn(e);
  } catch {
    return Gs;
  }
}
function Zs(e) {
  try {
    localStorage.setItem(Jr, JSON.stringify(gn(e)));
  } catch {
  }
}
function zt(e, t) {
  const n = e == null ? void 0 : e.closest(".reader-react-root");
  if (!n) return;
  const r = gn(t);
  n.style.setProperty(
    "--reader-ai-split-width",
    `${r[ot]}vw`
  );
}
function Qs() {
  const e = L(null), [t] = z(Xs);
  Ce(() => {
    const a = e.current;
    return zt(a, t), () => {
      var o;
      (o = a == null ? void 0 : a.closest(".reader-react-root")) == null || o.style.removeProperty("--reader-ai-split-width");
    };
  }, [t]);
  const n = A((a) => {
    zt(e.current, a);
  }, []), r = A((a, o) => {
    zt(e.current, a), o.isUserInteraction && Zs(a);
  }, []);
  return /* @__PURE__ */ C(
    Wr,
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
        /* @__PURE__ */ m(
          Kt,
          {
            id: hn,
            defaultSize: "50%",
            minSize: "35%",
            maxSize: "70%"
          }
        ),
        /* @__PURE__ */ m(
          Hr,
          {
            id: "reader-ai-split-separator",
            className: "reader-ai-split-separator",
            "aria-label": "调整文档与 AI 问答宽度",
            children: /* @__PURE__ */ m("span", { "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ m(
          Kt,
          {
            id: ot,
            defaultSize: "50%",
            minSize: "30%",
            maxSize: "65%"
          }
        )
      ]
    }
  );
}
const Te = 12, ec = 4;
function je(e, t, n) {
  if (typeof window > "u") return { x: e, y: t };
  const r = Math.min(n, window.innerWidth - Te * 2), a = Math.max(Te, window.innerWidth - r - Te), o = Math.min(window.innerHeight * 0.9, 860), i = Math.max(Te, window.innerHeight - o - Te);
  return {
    x: Math.min(a, Math.max(Te, e)),
    y: Math.min(i, Math.max(Te, t))
  };
}
function or(e) {
  if (typeof window > "u") return { x: 24, y: 72 };
  const t = Math.min(e, window.innerWidth - Te * 2);
  return je(window.innerWidth - t - 20, 72, e);
}
function tc(e, t) {
  try {
    const n = localStorage.getItem(e);
    if (!n) return or(t);
    const r = JSON.parse(n);
    if (typeof r.x == "number" && typeof r.y == "number")
      return je(r.x, r.y, t);
  } catch {
  }
  return or(t);
}
function nc(e, t) {
  try {
    localStorage.setItem(e, JSON.stringify(t));
  } catch {
  }
}
function rc({
  id: e,
  open: t,
  title: n,
  subtitle: r = "拖动标题可移动",
  titleIcon: a,
  storageKey: o,
  ariaLabel: i,
  className: s = "",
  width: c = 360,
  placement: l = "floating",
  showHeader: d = !0,
  onClose: u,
  toolbar: f,
  children: p
}) {
  const v = l === "workspace", h = l === "dock-right", w = h || v, [g, b] = z(() => tc(o, c)), [I, S] = z(!1), P = L(null);
  F(() => {
    !t || w || b((T) => je(T.x, T.y, c));
  }, [w, t, c]), F(() => {
    if (!t || w) return;
    const T = () => b((M) => je(M.x, M.y, c));
    return window.addEventListener("resize", T), () => window.removeEventListener("resize", T);
  }, [w, t, c]), F(() => {
    if (!t) return;
    const T = (M) => {
      var R;
      if (M.key !== "Escape") return;
      const x = M.target;
      (R = x == null ? void 0 : x.closest) != null && R.call(x, "textarea, input, select, [contenteditable='true']") || (M.preventDefault(), u());
    };
    return window.addEventListener("keydown", T), () => window.removeEventListener("keydown", T);
  }, [t, u]);
  const y = A((T) => {
    var M, x;
    w || T.button === 0 && ((x = (M = T.target) == null ? void 0 : M.closest) != null && x.call(M, "button") || (T.currentTarget.setPointerCapture(T.pointerId), P.current = {
      pointerId: T.pointerId,
      startX: T.clientX,
      startY: T.clientY,
      originX: g.x,
      originY: g.y,
      moved: !1
    }, S(!0)));
  }, [w, g.x, g.y]), E = A((T) => {
    const M = P.current;
    if (!M || M.pointerId !== T.pointerId) return;
    const x = T.clientX - M.startX, R = T.clientY - M.startY;
    !M.moved && Math.hypot(x, R) < ec || (M.moved = !0, b(je(M.originX + x, M.originY + R, c)));
  }, [c]), N = A((T) => {
    const M = P.current;
    if (!(!M || M.pointerId !== T.pointerId)) {
      P.current = null, S(!1);
      try {
        T.currentTarget.releasePointerCapture(T.pointerId);
      } catch {
      }
      M.moved && b((x) => {
        const R = je(x.x, x.y, c);
        return nc(o, R), R;
      });
    }
  }, [o, c]);
  return t ? /* @__PURE__ */ C(
    "aside",
    {
      id: e,
      className: `reader-notes-panel reader-notes-panel--${v ? "workspace" : h ? "docked" : "float"}${w ? "" : " reader-floating-surface"}${d ? " has-panel-header" : " is-headerless"}${f ? " has-panel-toolbar" : ""}${I ? " is-dragging" : ""} ${s}`.trim(),
      style: w ? void 0 : { left: g.x, top: g.y, width: Math.min(c, typeof window < "u" ? window.innerWidth - 24 : c) },
      "aria-label": i,
      role: "dialog",
      "aria-modal": "false",
      children: [
        d ? /* @__PURE__ */ C(
          "header",
          {
            className: "reader-notes-panel-head",
            onPointerDown: y,
            onPointerMove: E,
            onPointerUp: N,
            onPointerCancel: N,
            children: [
              w ? null : /* @__PURE__ */ m("div", { className: "reader-notes-panel-drag", "aria-hidden": "true", children: /* @__PURE__ */ m(bo, { size: 14, strokeWidth: 2.25 }) }),
              /* @__PURE__ */ C("div", { className: "reader-notes-panel-head-text", children: [
                /* @__PURE__ */ C("strong", { children: [
                  a,
                  n
                ] }),
                r ? /* @__PURE__ */ m("span", { children: r }) : null
              ] }),
              /* @__PURE__ */ m("button", { type: "button", className: "reader-notes-close reader-floating-close", "aria-label": `关闭${n}`, onClick: u, children: /* @__PURE__ */ m(We, { size: 14, strokeWidth: 2.5, "aria-hidden": !0 }) })
            ]
          }
        ) : null,
        f ? /* @__PURE__ */ m("div", { className: "reader-notes-panel-toolbar", children: f }) : null,
        /* @__PURE__ */ m("div", { className: "reader-notes-panel-body", children: p })
      ]
    }
  ) : null;
}
function oc({
  note: e,
  onJump: t,
  onUpdateNote: n,
  onRemove: r
}) {
  const [a, o] = z(!1), [i, s] = z(e.note);
  return F(() => {
    a || s(e.note);
  }, [e.note, a]), /* @__PURE__ */ C("article", { className: "reader-notes-item", children: [
    /* @__PURE__ */ C("div", { className: "reader-notes-item-top", children: [
      /* @__PURE__ */ m("span", { className: "reader-notes-kind", children: e.pane === "translated" ? "译文" : "原文" }),
      /* @__PURE__ */ C("div", { className: "reader-notes-item-actions", children: [
        /* @__PURE__ */ m("button", { type: "button", className: "reader-notes-link", onClick: () => t(e), children: "定位" }),
        /* @__PURE__ */ m("button", { type: "button", className: "reader-notes-danger", onClick: () => r(e.id), children: "删除" })
      ] })
    ] }),
    /* @__PURE__ */ m("p", { className: "reader-notes-quote", children: e.quote }),
    a ? /* @__PURE__ */ C("div", { className: "reader-notes-editor", children: [
      /* @__PURE__ */ m(
        "textarea",
        {
          className: "reader-notes-textarea",
          value: i,
          placeholder: "写点想法…",
          rows: 3,
          onChange: (c) => s(c.target.value)
        }
      ),
      /* @__PURE__ */ C("div", { className: "reader-notes-editor-actions", children: [
        /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            className: "reader-notes-primary",
            onClick: () => {
              n(e.id, i), o(!1);
            },
            children: "保存"
          }
        ),
        /* @__PURE__ */ m("button", { type: "button", className: "reader-notes-link", onClick: () => o(!1), children: "取消" })
      ] })
    ] }) : e.note ? /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: "reader-notes-note",
        onClick: () => o(!0),
        title: "点击编辑",
        children: e.note
      }
    ) : /* @__PURE__ */ m("button", { type: "button", className: "reader-notes-add-note", onClick: () => o(!0), children: "添加笔记" })
  ] });
}
function ac({
  open: e,
  groups: t,
  count: n,
  onClose: r,
  onJump: a,
  onUpdateNote: o,
  onRemove: i,
  onExport: s
}) {
  const [c, l] = z(!1);
  return /* @__PURE__ */ m(
    rc,
    {
      id: "reader-notes-panel",
      open: e,
      title: "批注",
      subtitle: "选中 PDF 文字后可添加 · 本地保存",
      titleIcon: /* @__PURE__ */ m(It, { size: 14, strokeWidth: 2.25, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.notes-float.pos.v1",
      ariaLabel: "批注",
      onClose: r,
      toolbar: /* @__PURE__ */ C(Vt, { children: [
        /* @__PURE__ */ C("span", { className: "reader-notes-count", children: [
          n,
          " 条"
        ] }),
        /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            className: "reader-notes-export",
            disabled: c || n === 0,
            onClick: async () => {
              await s() && (l(!0), window.setTimeout(() => l(!1), 1800));
            },
            children: c ? "已复制" : "导出 Markdown"
          }
        )
      ] }),
      children: n === 0 ? /* @__PURE__ */ m("p", { className: "reader-notes-empty", children: "暂无批注。在 PDF 上拖选文字，点「添加批注」。" }) : t.map((d) => /* @__PURE__ */ C("section", { className: "reader-notes-group", children: [
        /* @__PURE__ */ C("h3", { className: "reader-notes-group-title", children: [
          "第 ",
          d.page,
          " 页"
        ] }),
        d.items.map((u) => /* @__PURE__ */ m(
          oc,
          {
            note: u,
            onJump: a,
            onUpdateNote: o,
            onRemove: i
          },
          u.id
        ))
      ] }, d.page))
    }
  );
}
function ic({
  loading: e,
  failed: t,
  text: n,
  percent: r
}) {
  return !e && !t ? null : /* @__PURE__ */ C(Vt, { children: [
    e ? /* @__PURE__ */ m("div", { className: "reader-boot-loading", "data-reader-boot-loading": "true", children: /* @__PURE__ */ C("div", { className: "reader-boot-loading-card", children: [
      /* @__PURE__ */ m("div", { className: "reader-boot-loading-text", children: n }),
      /* @__PURE__ */ m("div", { className: "reader-boot-loading-track", children: /* @__PURE__ */ m(
        "span",
        {
          className: "reader-boot-loading-bar",
          style: { width: `${Math.max(0, Math.min(100, r))}%` }
        }
      ) })
    ] }) }) : null,
    t ? /* @__PURE__ */ m("div", { className: "reader-react-error", role: "alert", children: n }) : null
  ] });
}
async function sc(e) {
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
function cc({
  selection: e,
  onDismiss: t,
  onAskAi: n,
  onAddNote: r
}) {
  const [a, o] = z(!1), i = e ? e.selectionType === "text" ? `${e.pane}:${e.page}:${e.quote}` : `${e.region.itemId}:${e.pane}` : "";
  if (F(() => o(!1), [i]), !e)
    return null;
  const s = typeof window < "u" ? window.innerWidth : 800, c = typeof window < "u" ? window.innerHeight : 600, l = e.rect.left + e.rect.width / 2, d = 170, u = Math.min(Math.max(16 + d, l), s - 16 - d), f = e.rect.top > 72, p = f ? Math.max(12, e.rect.top - 8) : Math.min(c - 12, e.rect.top + e.rect.height + 8), v = f ? "above" : "below", h = e.pane === "translated" ? "译文" : "原文", w = e.selectionType === "text" ? "text" : e.kind, g = e.selectionType === "text" ? e.quote : hr(e.region, e.pane), b = w === "formula" ? "公式" : w === "table" ? "表格" : w === "figure" ? "图片" : w === "text" ? "文字" : "区域", I = w === "formula" ? ia(g) : g, S = w === "formula" ? yo : w === "table" ? vo : w === "text" ? wo : So;
  return /* @__PURE__ */ C(
    "div",
    {
      className: `reader-sel-pop reader-sel-pop--${v} reader-sel-pop--region`,
      style: { left: u, top: p },
      role: "toolbar",
      "aria-label": "选区操作",
      onPointerDown: (P) => {
        P.preventDefault();
      },
      children: [
        /* @__PURE__ */ C("div", { className: "reader-sel-pop-card reader-floating-surface", children: [
          /* @__PURE__ */ C("div", { className: "reader-sel-pop-context", children: [
            /* @__PURE__ */ m(S, { size: 15, strokeWidth: 2.1, "aria-hidden": !0 }),
            /* @__PURE__ */ m("span", { children: b }),
            /* @__PURE__ */ m("span", { className: "reader-sel-pop-context-divider", "aria-hidden": !0, children: "·" }),
            /* @__PURE__ */ m("span", { children: h }),
            /* @__PURE__ */ m("span", { className: "reader-sel-pop-context-divider", "aria-hidden": !0, children: "·" }),
            /* @__PURE__ */ C("span", { children: [
              e.page,
              " 页"
            ] })
          ] }),
          /* @__PURE__ */ C("div", { className: "reader-sel-pop-actions", children: [
            I ? /* @__PURE__ */ C(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--primary",
                onClick: async () => {
                  try {
                    await sc(I), o(!0), window.setTimeout(() => o(!1), 1400);
                  } catch (P) {
                    console.warn("[reader-selection] copy failed", P);
                  }
                },
                children: [
                  a ? /* @__PURE__ */ m(Io, { size: 15, strokeWidth: 2.4, "aria-hidden": !0 }) : /* @__PURE__ */ m(Ro, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
                  /* @__PURE__ */ m("span", { children: a ? "已复制" : w === "formula" ? "复制 LaTeX" : "复制" })
                ]
              }
            ) : /* @__PURE__ */ m("span", { className: "reader-sel-pop-selection-hint", children: "已选择图片" }),
            r && I ? /* @__PURE__ */ C(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--secondary",
                onClick: () => r({ page: e.page, pane: e.pane, quote: I }),
                children: [
                  /* @__PURE__ */ m(It, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
                  /* @__PURE__ */ m("span", { children: "添加批注" })
                ]
              }
            ) : null,
            n ? /* @__PURE__ */ C(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--secondary",
                onClick: () => n(e),
                children: [
                  /* @__PURE__ */ m(Qt, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
                  /* @__PURE__ */ m("span", { children: "问 AI" })
                ]
              }
            ) : null,
            /* @__PURE__ */ m(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--ghost",
                onClick: t,
                "aria-label": "取消选区",
                title: "取消",
                children: /* @__PURE__ */ m(We, { size: 15, strokeWidth: 2.5, "aria-hidden": !0 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ m("span", { className: "reader-sel-pop-caret", "aria-hidden": "true" })
      ]
    }
  );
}
function lc(e) {
  if (!(e instanceof HTMLElement)) return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function uc() {
  const [e, t] = z(!1), n = Xt(), r = L(null);
  return F(() => {
    if (!e) return;
    const a = (i) => {
      const s = r.current;
      s && i.target instanceof Node && !s.contains(i.target) && t(!1);
    }, o = (i) => {
      i.key === "Escape" && (i.preventDefault(), t(!1));
    };
    return document.addEventListener("mousedown", a), window.addEventListener("keydown", o), () => {
      document.removeEventListener("mousedown", a), window.removeEventListener("keydown", o);
    };
  }, [e]), F(() => {
    const a = (o) => {
      if (o.defaultPrevented || o.metaKey || o.ctrlKey || o.altKey || lc(o.target)) return;
      const i = o.key;
      if (i === "?" || i === "h" || i === "H" || i === "/") {
        if (i === "/" && !o.shiftKey)
          return;
        o.preventDefault(), t((s) => !s);
      }
    };
    return window.addEventListener("keydown", a), () => window.removeEventListener("keydown", a);
  }, []), /* @__PURE__ */ C("div", { className: "reader-react-shortcuts", ref: r, "data-reader-shortcuts": "", children: [
    /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: `reader-react-hud-btn reader-react-shortcuts-btn${e ? " is-active" : ""}`,
        "aria-label": "快捷键说明",
        "aria-expanded": e,
        "aria-controls": n,
        title: "快捷键（H 或 ?）",
        onClick: () => t((a) => !a),
        children: /* @__PURE__ */ m(xo, { className: "reader-react-shortcuts-icon", size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
      }
    ),
    e ? /* @__PURE__ */ C(
      "div",
      {
        id: n,
        className: "reader-react-shortcuts-panel reader-floating-surface",
        role: "dialog",
        "aria-label": "阅读器快捷键",
        children: [
          /* @__PURE__ */ C("div", { className: "reader-react-shortcuts-head", children: [
            /* @__PURE__ */ m("strong", { children: "快捷键" }),
            /* @__PURE__ */ m(
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
          /* @__PURE__ */ m("div", { className: "reader-react-shortcuts-body", children: Fa.map((a) => /* @__PURE__ */ C("section", { className: "reader-react-shortcuts-group", children: [
            /* @__PURE__ */ m("h3", { children: a.title }),
            /* @__PURE__ */ m("ul", { children: a.items.map((o) => /* @__PURE__ */ C("li", { children: [
              /* @__PURE__ */ m("kbd", { children: o.keys }),
              /* @__PURE__ */ m("span", { children: o.desc })
            ] }, `${a.title}-${o.keys}`)) })
          ] }, a.title)) }),
          /* @__PURE__ */ m("p", { className: "reader-react-shortcuts-foot", children: "在输入框内不会触发快捷键" })
        ]
      }
    ) : null
  ] });
}
const dc = Object.freeze([
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
]), fc = {
  favorites: Po,
  markdown: dr,
  ai: Qt,
  notes: It
}, Kr = "retainpdf.reader.fab.pos.v1", St = 52, Fe = 12, pc = 6, mc = ["source", "sideBySide", "translated"], hc = {
  source: cr,
  sideBySide: lr,
  translated: ur
}, gc = {
  source: "原文",
  sideBySide: "对照",
  translated: "译文"
}, bc = dc.filter((e) => e.id === "favorites");
function et(e, t) {
  const n = Math.max(Fe, window.innerWidth - St - Fe), r = Math.max(Fe, window.innerHeight - St - Fe);
  return {
    x: Math.min(n, Math.max(Fe, e)),
    y: Math.min(r, Math.max(Fe, t))
  };
}
function ar() {
  return typeof window > "u" ? { x: 24, y: 120 } : et(
    window.innerWidth - St - 20,
    window.innerHeight - St - 88
  );
}
function yc() {
  try {
    const e = localStorage.getItem(Kr);
    if (!e) return ar();
    const t = JSON.parse(e);
    if (typeof t.x == "number" && typeof t.y == "number")
      return et(t.x, t.y);
  } catch {
  }
  return ar();
}
function vc(e) {
  try {
    localStorage.setItem(Kr, JSON.stringify(e));
  } catch {
  }
}
function wc(e) {
  if (e.sourceOnly || !e.jobId) {
    const t = Xe(e.sourceUrl), n = Xe(e.translatedUrl);
    return {
      source: t,
      translated: n,
      // sideBySide requires dedicated artifact; no fallback to source url
      sideBySide: ""
    };
  }
  return Ho({
    jobId: e.jobId,
    jobPayload: e.jobPayload,
    manifestPayload: e.manifestPayload
  });
}
function Sc({
  activeTool: e,
  noteCount: t,
  sourceOnly: n,
  onToggleTool: r,
  download: a
}) {
  const [o, i] = z(() => yc()), [s, c] = z(!1), [l, d] = z(() => /* @__PURE__ */ new Set()), u = L(null), f = L(null), p = Xt(), v = Z(() => wc(a), [a]);
  F(() => {
    const y = () => i((E) => et(E.x, E.y));
    return window.addEventListener("resize", y), () => window.removeEventListener("resize", y);
  }, []), F(() => {
    if (!s) return;
    const y = (N) => {
      const T = u.current;
      T && N.target instanceof Node && !T.contains(N.target) && c(!1);
    }, E = (N) => {
      N.key === "Escape" && (N.preventDefault(), c(!1));
    };
    return document.addEventListener("mousedown", y), window.addEventListener("keydown", E), () => {
      document.removeEventListener("mousedown", y), window.removeEventListener("keydown", E);
    };
  }, [s]);
  const h = A((y) => {
    r(y), c(!1);
  }, [r]), w = A(
    async (y) => {
      const E = Xe(v[y]);
      if (!(!E || l.has(y)))
        try {
          const N = a.jobId ? Wo(y, {
            jobId: a.jobId,
            jobPayload: a.jobPayload,
            manifestPayload: a.manifestPayload
          }) : `${a.sourceOnly ? "document" : "reader"}-${y}.pdf`;
          await Jo(
            a.fetchProtected,
            E,
            N,
            N,
            null,
            (T) => d((M) => {
              const x = new Set(M);
              return T ? x.add(y) : x.delete(y), x;
            })
          );
        } catch (N) {
          const T = N instanceof Error ? N.message : "下载失败";
          Ko(T), d((M) => {
            const x = new Set(M);
            return x.delete(y), x;
          });
        }
    },
    [v, l, a]
  ), g = (y) => {
    y.button === 0 && (y.currentTarget.setPointerCapture(y.pointerId), f.current = {
      pointerId: y.pointerId,
      startX: y.clientX,
      startY: y.clientY,
      originX: o.x,
      originY: o.y,
      moved: !1
    });
  }, b = (y) => {
    const E = f.current;
    if (!E || E.pointerId !== y.pointerId) return;
    const N = y.clientX - E.startX, T = y.clientY - E.startY;
    !E.moved && Math.hypot(N, T) < pc || (E.moved = !0, s && c(!1), i(et(E.originX + N, E.originY + T)));
  }, I = (y) => {
    const E = f.current;
    if (!(!E || E.pointerId !== y.pointerId)) {
      f.current = null;
      try {
        y.currentTarget.releasePointerCapture(y.pointerId);
      } catch {
      }
      if (E.moved) {
        i((N) => {
          const T = et(N.x, N.y);
          return vc(T), T;
        });
        return;
      }
      c((N) => !N);
    }
  }, S = typeof window < "u" && o.y > window.innerHeight * 0.55, P = mc.filter((y) => !(a.sourceOnly && y !== "source"));
  return /* @__PURE__ */ C(
    "div",
    {
      ref: u,
      className: `reader-fab${s ? " is-open" : ""}${S ? " is-open-up" : ""}`,
      style: { left: o.x, top: o.y },
      "data-reader-fab": "",
      children: [
        s ? /* @__PURE__ */ C(
          "div",
          {
            id: p,
            className: "reader-fab-menu reader-floating-surface",
            role: "menu",
            "aria-label": "阅读工具",
            children: [
              /* @__PURE__ */ C("header", { className: "reader-fab-menu-head", children: [
                /* @__PURE__ */ C("div", { className: "reader-fab-menu-head-text", children: [
                  /* @__PURE__ */ m("strong", { children: "工具" }),
                  /* @__PURE__ */ m("span", { children: "拖动圆钮可移动" })
                ] }),
                /* @__PURE__ */ m(
                  "button",
                  {
                    type: "button",
                    className: "reader-fab-menu-close reader-floating-close",
                    "aria-label": "关闭菜单",
                    onClick: () => c(!1),
                    children: /* @__PURE__ */ m(We, { size: 14, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                )
              ] }),
              (() => {
                const y = e === "notes";
                return /* @__PURE__ */ C(
                  "button",
                  {
                    type: "button",
                    role: "menuitem",
                    className: `reader-fab-row${y ? " is-active" : ""}`,
                    "aria-pressed": y,
                    onClick: () => h("notes"),
                    style: { "--fab-i": 0 },
                    children: [
                      /* @__PURE__ */ m("span", { className: "reader-fab-row-icon", "aria-hidden": "true", children: /* @__PURE__ */ m(It, { size: 18, strokeWidth: 2 }) }),
                      /* @__PURE__ */ C("span", { className: "reader-fab-row-copy", children: [
                        /* @__PURE__ */ m("span", { className: "reader-fab-row-title", children: "批注" }),
                        /* @__PURE__ */ m("span", { className: "reader-fab-row-sub", children: y ? "关闭悬浮窗" : "本地批注 · 导出" })
                      ] }),
                      t > 0 ? /* @__PURE__ */ m("span", { className: "reader-fab-row-badge", children: t }) : null
                    ]
                  }
                );
              })(),
              bc.map((y, E) => {
                const N = fc[y.id], T = e === y.id, M = y.needsJob && n;
                let x = T ? y.subOpen : y.subIdle;
                return M && (x = "需打开任务阅读"), /* @__PURE__ */ C(
                  "button",
                  {
                    type: "button",
                    role: "menuitem",
                    className: `reader-fab-row${T ? " is-active" : ""}${M ? " is-disabled" : ""}`,
                    "aria-pressed": T,
                    disabled: M,
                    onClick: () => h(y.id),
                    style: { "--fab-i": E + 1 },
                    children: [
                      /* @__PURE__ */ m("span", { className: "reader-fab-row-icon", "aria-hidden": "true", children: /* @__PURE__ */ m(N, { size: 18, strokeWidth: 2 }) }),
                      /* @__PURE__ */ C("span", { className: "reader-fab-row-copy", children: [
                        /* @__PURE__ */ m("span", { className: "reader-fab-row-title", children: y.label }),
                        /* @__PURE__ */ m("span", { className: "reader-fab-row-sub", children: x })
                      ] })
                    ]
                  },
                  y.id
                );
              }),
              /* @__PURE__ */ C("div", { className: "reader-fab-section", role: "group", "aria-label": "下载", children: [
                /* @__PURE__ */ C("div", { className: "reader-fab-section-head", children: [
                  /* @__PURE__ */ m(To, { size: 12, strokeWidth: 2.5, "aria-hidden": !0 }),
                  /* @__PURE__ */ m("span", { children: "下载 PDF" })
                ] }),
                /* @__PURE__ */ m("div", { className: "reader-fab-download-grid", children: P.map((y, E) => {
                  const N = co[y], T = Xe(v[y]), M = l.has(y), x = !!T && !M, R = x ? "" : lo(y, v), k = hc[y];
                  return /* @__PURE__ */ C(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      id: `reader-fab-download-${y}`,
                      className: `reader-fab-chip${M ? " is-busy" : ""}${x ? "" : " is-disabled"}`,
                      disabled: !x,
                      title: x ? `下载${N.label}` : R,
                      onClick: () => void w(y),
                      style: { "--fab-i": E },
                      children: [
                        /* @__PURE__ */ m("span", { className: "reader-fab-chip-icon", "aria-hidden": "true", children: /* @__PURE__ */ m(k, { size: 16, strokeWidth: 2 }) }),
                        /* @__PURE__ */ m("span", { className: "reader-fab-chip-label", children: gc[y] }),
                        /* @__PURE__ */ m("span", { className: "reader-fab-chip-state", children: M ? "…" : x ? "↓" : "—" })
                      ]
                    },
                    y
                  );
                }) }),
                P.every((y) => !Xe(v[y])) ? /* @__PURE__ */ m("p", { className: "reader-fab-empty", children: "产物尚未就绪" }) : null
              ] })
            ]
          }
        ) : null,
        /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            className: `reader-fab-trigger${s ? " is-open" : ""}${e ? " has-active-tool" : ""}`,
            "aria-label": s ? "收起工具菜单" : "打开工具菜单",
            "aria-expanded": s,
            "aria-controls": s ? p : void 0,
            "aria-haspopup": "menu",
            onPointerDown: g,
            onPointerMove: b,
            onPointerUp: I,
            onPointerCancel: I,
            children: /* @__PURE__ */ m("span", { className: "reader-fab-icon", "aria-hidden": "true", children: s ? /* @__PURE__ */ m(We, { size: 20, strokeWidth: 2.5 }) : /* @__PURE__ */ C("span", { className: "reader-fab-dots", children: [
              /* @__PURE__ */ m("i", {}),
              /* @__PURE__ */ m("i", {}),
              /* @__PURE__ */ m("i", {})
            ] }) })
          }
        )
      ]
    }
  );
}
function Ic({
  userZoom: e,
  onZoomChange: t,
  currentPage: n,
  numPages: r,
  onGoToPage: a,
  mode: o = "compare",
  modeControls: i
}) {
  const s = Ma(e), c = e > br + 1e-3, l = e < yr - 1e-3, d = Ze(), u = "50%（半屏，对照铺满）", [f, p] = z(!1), [v, h] = z(`${n}`);
  F(() => {
    f || h(`${Math.min(Math.max(n, 1), Math.max(r, 1))}`);
  }, [n, r, f]);
  const w = () => {
    if (p(!1), !a || r <= 0)
      return;
    const g = Number(`${v}`.trim());
    a(vt(g, r));
  };
  return /* @__PURE__ */ C("div", { className: "reader-react-hud", "data-reader-hud": "true", children: [
    i ? /* @__PURE__ */ m("div", { className: "reader-react-hud-group reader-react-hud-modes", children: i }) : null,
    /* @__PURE__ */ m("div", { className: "reader-react-hud-group", "aria-label": "页码", children: f ? /* @__PURE__ */ C(
      "form",
      {
        className: "reader-react-hud-page-form",
        onSubmit: (g) => {
          g.preventDefault(), w();
        },
        children: [
          /* @__PURE__ */ m(
            "input",
            {
              className: "reader-react-hud-page-input",
              type: "text",
              inputMode: "numeric",
              pattern: "[0-9]*",
              "aria-label": "跳转到页码",
              value: v,
              autoFocus: !0,
              onChange: (g) => h(g.target.value.replace(/[^\d]/g, "")),
              onBlur: w,
              onKeyDown: (g) => {
                g.key === "Escape" && (g.preventDefault(), p(!1), h(`${n}`));
              }
            }
          ),
          /* @__PURE__ */ C("span", { className: "reader-react-hud-page-suffix", children: [
            "/ ",
            r || "—"
          ] })
        ]
      }
    ) : /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: "reader-react-hud-page reader-react-hud-page-btn",
        "aria-label": r > 0 ? `跳转页码，当前第 ${n} 页，共 ${r} 页` : "页码",
        title: r > 0 ? "点击输入页码跳转" : void 0,
        disabled: !a || r <= 0,
        onClick: () => {
          !a || r <= 0 || (h(`${n}`), p(!0));
        },
        children: r > 0 ? `${Math.min(n, r)} / ${r}` : "—"
      }
    ) }),
    /* @__PURE__ */ C("div", { className: "reader-react-hud-group", "aria-label": "缩放", children: [
      /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: "reader-react-hud-btn",
          "aria-label": "缩小",
          disabled: !c,
          onClick: () => t(nt(e, -1)),
          children: "−"
        }
      ),
      /* @__PURE__ */ C(
        "button",
        {
          type: "button",
          className: "reader-react-hud-btn reader-react-hud-zoom-label",
          "aria-label": `重置为${u}`,
          title: u,
          onClick: () => t(d),
          children: [
            s,
            "%"
          ]
        }
      ),
      /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: "reader-react-hud-btn",
          "aria-label": "放大",
          disabled: !l,
          onClick: () => t(nt(e, 1)),
          children: "+"
        }
      )
    ] }),
    /* @__PURE__ */ m("div", { className: "reader-react-hud-group reader-react-hud-help", "aria-label": "帮助", children: /* @__PURE__ */ m(uc, {}) })
  ] });
}
function qr(e) {
  const t = `${e.jobId || ""}`.trim(), n = `${e.documentId || ""}`.trim();
  return t ? `retainpdf.reader.notes.v1:job:${t}` : n ? `retainpdf.reader.notes.v1:doc:${n}` : "retainpdf.reader.notes.v1:anonymous";
}
function Rc() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function Vr(e) {
  return [...e].sort((t, n) => t.page !== n.page ? t.page - n.page : `${t.createdAt}`.localeCompare(`${n.createdAt}`));
}
function Yr(e) {
  const t = [];
  for (const n of Vr(e)) {
    const r = t[t.length - 1];
    r && r.page === n.page ? r.items.push(n) : t.push({ page: n.page, items: [n] });
  }
  return t;
}
function xc(e, t) {
  const n = e ? `# ${e} · 批注` : "# 批注", r = Yr(t);
  if (!r.length)
    return `${n}

（暂无批注）
`;
  const a = [n, ""];
  for (const o of r) {
    a.push(`## 第 ${o.page} 页`, "");
    for (const i of o.items) {
      for (const s of i.quote.split(`
`))
        a.push(`> ${s}`);
      i.note && a.push("", `笔记：${i.note}`), a.push("");
    }
  }
  return a.join(`
`);
}
function Pc(e) {
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
function ir(e) {
  if (typeof localStorage > "u")
    return [];
  try {
    return Pc(localStorage.getItem(qr(e)));
  } catch {
    return [];
  }
}
function Tc(e, t) {
  if (!(typeof localStorage > "u"))
    try {
      localStorage.setItem(qr(e), JSON.stringify(t));
    } catch (n) {
      console.warn("[reader-notes] persist failed", n);
    }
}
function Mc(e, t = {}) {
  const n = Z(
    () => ({
      jobId: `${e.jobId || ""}`.trim(),
      documentId: `${e.documentId || ""}`.trim()
    }),
    [e.jobId, e.documentId]
  ), [r, a] = z(() => ir(n)), o = t.onAfterAdd;
  F(() => {
    a(ir(n));
  }, [n.jobId, n.documentId]), F(() => {
    Tc(n, r);
  }, [n, r]);
  const i = A((u) => {
    const f = `${u.quote || ""}`.trim();
    if (!f)
      return null;
    const p = {
      id: Rc(),
      page: Math.max(1, Math.floor(Number(u.page) || 1)),
      pane: u.pane === "translated" ? "translated" : "source",
      quote: f,
      note: `${u.note || ""}`.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return a((v) => Vr([p, ...v])), o == null || o(), p;
  }, [o]), s = A((u, f) => {
    const p = `${f || ""}`.trim();
    a((v) => v.map((h) => h.id === u ? { ...h, note: p } : h));
  }, []), c = A((u) => {
    a((f) => f.filter((p) => p.id !== u));
  }, []), l = A(async (u = "") => {
    var p, v;
    const f = xc(u, r);
    try {
      return await ((v = (p = navigator.clipboard) == null ? void 0 : p.writeText) == null ? void 0 : v.call(p, f)), !0;
    } catch (h) {
      return console.error("[reader-notes] copy failed", h), !1;
    }
  }, [r]), d = Z(() => Yr(r), [r]);
  return {
    notes: r,
    groups: d,
    addFromQuote: i,
    updateNote: s,
    remove: c,
    exportMarkdown: l,
    count: r.length
  };
}
const qt = "download-toast";
function Ec({
  title: e = "下载中",
  status: t = "正在准备...",
  meta: n = "等待响应...",
  percent: r = NaN,
  tone: a = "progress"
}) {
  const o = Number.isFinite(r) ? Math.max(4, Math.min(100, Number(r) || 0)) : 18;
  return /* @__PURE__ */ C("div", { className: "download-toast-card reader-floating-surface", "data-tone": a, "aria-live": "polite", children: [
    /* @__PURE__ */ C("div", { className: "download-toast-head", children: [
      /* @__PURE__ */ m("div", { id: "download-toast-title", className: "download-toast-title", children: e }),
      /* @__PURE__ */ m("div", { id: "download-toast-status", className: "download-toast-status", children: t })
    ] }),
    /* @__PURE__ */ m("div", { className: "download-toast-track", children: /* @__PURE__ */ m("span", { id: "download-toast-bar", className: "download-toast-bar", style: { width: `${o}%` } }) }),
    /* @__PURE__ */ m("div", { id: "download-toast-meta", className: "download-toast-meta", children: n })
  ] });
}
function Nc(e = {}) {
  const {
    visible: t = !1,
    title: n = "下载中",
    status: r = "正在准备...",
    meta: a = "等待响应...",
    percent: o = NaN,
    tone: i = "progress"
  } = e;
  if (!t) {
    _t.dismiss(qt);
    return;
  }
  _t.custom(
    () => /* @__PURE__ */ m(Ec, { title: n, status: r, meta: a, percent: o, tone: i }),
    { id: qt, duration: 1 / 0 }
  );
}
function kc() {
  const e = A((t) => {
    t && (t.setState = Nc, t.hide = () => _t.dismiss(qt));
  }, []);
  return /* @__PURE__ */ C(Vt, { children: [
    /* @__PURE__ */ m(ho, { position: "bottom-right" }),
    /* @__PURE__ */ m("download-toast", { style: { display: "none" }, "aria-hidden": "true", ref: e })
  ] });
}
const Ac = Zt(() => import("./ReaderFavoritesPanel-Cb0UdAJ2.js").then((e) => ({ default: e.ReaderFavoritesPanel }))), Lc = Zt(() => import("./ReaderMarkdownPanel-B1_XohC5.js").then((e) => ({ default: e.ReaderMarkdownPanel }))), zc = Zt(() => import("./ReaderAiPanel-BcijpPhf.js").then((e) => ({ default: e.ReaderAiPanel })));
function Ct(e) {
  const t = L(!1);
  return e && (t.current = !0), t.current;
}
function Cc(e) {
  return "workspace";
}
function _c(e, t) {
  return t !== null && e === "compare" ? "source" : e;
}
function sr(e, t) {
  var n, r, a, o;
  return e === "compare" ? null : (t == null ? void 0 : t.assistantPanel) === "markdown" || (t == null ? void 0 : t.assistantPanel) === "ai" ? t.assistantPanel : ((n = t == null ? void 0 : t.splitLayout) == null ? void 0 : n.left) === "ai" || ((r = t == null ? void 0 : t.splitLayout) == null ? void 0 : r.right) === "ai" ? "ai" : ((a = t == null ? void 0 : t.splitLayout) == null ? void 0 : a.left) === "markdown" || ((o = t == null ? void 0 : t.splitLayout) == null ? void 0 : o.right) === "markdown" ? "markdown" : null;
}
function Dc() {
  const e = Ai(), { boot: t, panes: n, shell: r, sessionFiles: a, tools: o, session: i } = e, s = e.sourceOnly || !a.translatedUrl, [c, l] = z(() => sr(e.mode, xe(e.viewStateKey))), [d, u] = z(null), [f, p] = z(null), [v, h] = z(!0), w = L(e.viewStateKey), g = L(null), [b, I] = z(!1), S = A(() => I(!0), []), P = A(() => I((U) => !U), []), y = Mc(
    { jobId: i.jobId, documentId: i.documentId },
    { onAfterAdd: S }
  ), E = A((U) => {
    y.addFromQuote(U), e.clearSelection();
  }, [y.addFromQuote, e.clearSelection]), N = A((U) => {
    e.goToPage(U.page, U.pane === "translated" ? "translated" : "source");
  }, [e.goToPage]), T = A(
    () => y.exportMarkdown(i.title || ""),
    [y.exportMarkdown, i.title]
  );
  F(() => {
    p(null), h(!0), I(!1);
  }, [e.viewStateKey]), F(() => {
    if (!t.loading) {
      if (w.current !== e.viewStateKey) {
        w.current = e.viewStateKey;
        const U = xe(e.viewStateKey);
        l(sr(e.mode, U)), u(null);
        return;
      }
      wt(e.viewStateKey, { assistantPanel: c, splitLayout: null });
    }
  }, [c, t.loading, e.mode, e.viewStateKey]), F(() => {
    if (!(t.loading || t.failed)) {
      if (g.current !== e.viewStateKey) {
        g.current = e.viewStateKey;
        const U = xe(e.viewStateKey), se = s ? "source" : U == null ? void 0 : U.mode;
        se && se !== e.mode && e.setModeKeepingPage(se);
        return;
      }
      wt(e.viewStateKey, { mode: e.mode });
    }
  }, [t.failed, t.loading, e.mode, e.setModeKeepingPage, e.viewStateKey, s]);
  const M = c || (e.mode === "compare" ? "compare" : "reading"), x = c !== null, R = Ct(o.isOpen("favorites")), k = Ct(c === "markdown"), D = Ct(c === "ai"), O = d || _c(e.mode, c), _ = !!(e.liveTranslationAvailable && v && !x), B = _ ? "compare" : O, H = A(() => {
    o.close();
  }, [o]), X = A((U) => {
    if (U === "notes") {
      P();
      return;
    }
    o.toggle(U);
  }, [P, o]), W = A(() => {
    l(null), u(null), p(null);
  }, []), oe = A((U) => {
    const se = B === "translated" ? "translated" : "source";
    e.jumpToAnchor(U, se);
  }, [e.jumpToAnchor, B]), te = A((U) => {
    i.refreshCommittedDocument(U);
  }, [i.refreshCommittedDocument]), j = A((U) => {
    o.close(), u(null), U === "compare" && e.liveTranslationAvailable ? h(!0) : U !== "compare" && h(!1), e.setModeKeepingPage(U);
  }, [e.liveTranslationAvailable, e.setModeKeepingPage, o]), ne = A((U) => {
    l(U), U !== "ai" && p(null);
  }, []), pe = A((U) => {
    const se = U.pane === "translated" && !s ? "translated" : "source";
    p(U), l("ai"), u(se), e.clearSelection();
  }, [e.clearSelection, s]), re = [
    "reader-react-root",
    `is-workspace-${M}`,
    x ? "is-assistant-open" : "",
    _ ? "is-live-translation-pair" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ C("div", { className: re, "data-reader-engine": "react-pdf", "data-reader-workspace": M, children: [
    /* @__PURE__ */ m(ic, { loading: t.loading, failed: t.failed, text: t.text, percent: t.percent }),
    /* @__PURE__ */ m($i, { onBeforeClose: i.prepareClose }),
    /* @__PURE__ */ m(
      ps,
      {
        mode: B,
        documentReady: !!i.jobId,
        sourceOnly: s,
        onModeChange: j,
        liveTranslation: e.liveTranslationAvailable ? {
          visible: v,
          state: e.liveTranslation,
          onToggle: () => h((U) => !U)
        } : null
      }
    ),
    /* @__PURE__ */ m(ms, { active: c, onSelect: ne, onClose: W }),
    x ? /* @__PURE__ */ m(Qs, {}) : null,
    e.showHud ? /* @__PURE__ */ m(Sc, { activeTool: b ? "notes" : o.active, noteCount: y.count, sourceOnly: e.sourceOnly, onToggleTool: X, download: e.download }) : null,
    /* @__PURE__ */ m(ls, { mode: B, bindShell: r.bindShell, shellEl: r.shellEl, userZoom: e.userZoom, compareMode: B === "compare", shellWidth: r.shellWidth, rowHeights: e.rowHeights, mountSource: n.mountSource, mountTranslated: n.mountTranslated, showSource: _ || B !== "translated", showTranslated: _ || B === "translated" || B === "compare", sourceOnly: s, sourceUrl: a.sourceUrl, translatedUrl: a.translatedUrl, sourceFile: a.sourceFile, translatedFile: a.translatedFile, activeRegion: e.activeRegion, regions: i.regions, readerMetadata: i.readerMetadata, onSelectRegion: e.selectRegion, markdownSplit: c === "markdown", assistantSplit: x, onMetrics: n.onMetrics, onNumPagesChange: n.onNumPages, liveTranslation: v ? e.liveTranslation : void 0, liveTranslationPair: _ }),
    e.showHud ? /* @__PURE__ */ m(
      Ic,
      {
        userZoom: e.userZoom,
        onZoomChange: e.onZoomChange,
        currentPage: e.currentPage,
        numPages: n.hudNumPages,
        mode: B,
        onGoToPage: e.goToPage,
        modeControls: null
      }
    ) : null,
    /* @__PURE__ */ C(oo, { fallback: null, children: [
      R ? /* @__PURE__ */ m(Ac, { open: o.isOpen("favorites"), jobId: i.jobId, documentId: i.documentId, onClose: H, onJumpPage: e.goToPage }) : null,
      k ? /* @__PURE__ */ m(Lc, { open: c === "markdown", jobId: i.jobId, sourceOnly: e.sourceOnly, layout: "workspace", side: "right", onClose: W }) : null,
      D ? /* @__PURE__ */ m(zc, { open: c === "ai", jobId: i.jobId, documentId: i.documentId, layout: Cc(e.mode), side: "right", selectionContext: f, onClearSelectionContext: () => p(null), onClose: W, onJumpCitation: oe, onDocumentCommitted: te }, i.documentId || i.jobId || "reader-ai-pending") : null
    ] }),
    /* @__PURE__ */ m(
      ac,
      {
        open: b,
        groups: y.groups,
        count: y.count,
        onClose: () => I(!1),
        onJump: N,
        onUpdateNote: y.updateNote,
        onRemove: y.remove,
        onExport: T
      }
    ),
    /* @__PURE__ */ m(cc, { selection: e.selection, onDismiss: e.clearSelection, onAskAi: pe, onAddNote: E }),
    /* @__PURE__ */ m(kc, {})
  ] });
}
function el() {
  return /* @__PURE__ */ m(Dc, {});
}
export {
  en as A,
  el as R,
  Dc as a,
  rc as b,
  Qc as c,
  tt as d,
  Do as e,
  Zc as f,
  hr as g,
  Xc as h,
  Gc as r
};
//# sourceMappingURL=ReaderApp-kTlxBzs5.js.map
