var kn = (e) => {
  throw TypeError(e);
};
var An = (e, t, n) => t.has(e) || kn("Cannot " + n);
var Ye = (e, t, n) => (An(e, t, "read from private field"), n ? n.call(e) : t.get(e)), Cn = (e, t, n) => t.has(e) ? kn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), Ln = (e, t, n, r) => (An(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
import { jsxs as z, jsx as p, Fragment as rn } from "react/jsx-runtime";
import { useMemo as K, useState as C, useEffect as O, useCallback as x, useRef as A, useLayoutEffect as De, memo as on, forwardRef as ho, useImperativeHandle as an, createContext as sn, useContext as cn, useSyncExternalStore as go, useId as ln, Suspense as bo, lazy as un } from "react";
import { getReaderAdapters as ie, requireAdapter as Te } from "./adapters.js";
import { resolveReaderDownloadName as yo, createReaderServerFavoritesPort as vo, resolveReaderDownloadUrls as wo, READER_PROGRESS_COPY as Ie, trimString as ot, READER_DOWNLOAD_ACTIONS as So, disabledReason as Io } from "./runtime/state.js";
import { d as Po } from "./ask-answerer-GNQdzitl.js";
import "@retainpdf/api/conversations";
import { r as To, b as Ro } from "./page-config-Ct7qR5rm.js";
import { normalizeBlockKey as zn, sortByPageAndCreatedAt as Mo, buildAnnotationsMarkdown as Eo, groupByPageAndCreatedAt as xo } from "./runtime/content.js";
import { fetchLiveTranslationLayout as No, LiveTranslationApiError as It, streamLiveTranslationEvents as ko, fetchLiveTranslationPage as Ao } from "@retainpdf/api/live-translation";
import { toast as Wt, Toaster as Co } from "sonner";
import { X as Ke, Radio as Lo, FileText as Sr, Columns2 as Ir, Languages as Pr, FileCode2 as Tr, Sparkles as dn, GripHorizontal as zo, StickyNote as kt, Sigma as _o, Table2 as Do, Type as Fo, Image as $o, Check as Oo, Copy as jo, Keyboard as Uo, Download as Bo, Bookmark as Wo } from "lucide-react";
import { pdfjs as Ho, Page as Jo, Document as qo } from "react-pdf";
import { e as Ko, m as Go, a as Vo } from "./markdown-math-Cb17EyYs.js";
const Yo = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.isMockMode) == null ? void 0 : n.call(t, ...e)) ?? !1;
}, Zo = "", Xo = Object.freeze({
  progress: "retainpdf-reader-progress"
}), yt = (e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveResourceUrl) == null ? void 0 : n.call(t, e)) ?? e;
}, Qo = (...e) => {
  var n;
  return (((n = ie()) == null ? void 0 : n.fetchProtected) ?? fetch)(...e);
}, Ht = (e = "") => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolvePdfjsVendorUrl) == null ? void 0 : n.call(t, e)) ?? "";
}, at = new Proxy({}, { get: (e, t) => (...n) => {
  var r, a, o;
  return (o = (a = (r = ie()) == null ? void 0 : r.defaultReaderDataPort) == null ? void 0 : a[t]) == null ? void 0 : o.call(a, ...n);
} }), Rr = new Proxy({}, { get: (e, t) => (...n) => {
  var r, a, o;
  return (o = (a = (r = ie()) == null ? void 0 : r.defaultReaderPageConfigPort) == null ? void 0 : a[t]) == null ? void 0 : o.call(a, ...n);
} }), ea = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderAnchor) == null ? void 0 : n.call(t, ...e)) ?? null;
}, ta = () => {
  var e, t;
  return ((t = (e = ie()) == null ? void 0 : e.resolveReaderDocumentId) == null ? void 0 : t.call(e)) ?? "";
}, na = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderJobId) == null ? void 0 : n.call(t, ...e)) ?? "";
}, ra = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderArtifactUrl) == null ? void 0 : n.call(t, ...e)) ?? "";
}, oa = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderSourcePdf) == null ? void 0 : n.call(t, ...e)) ?? null;
}, aa = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderTranslatedPdfUrl) == null ? void 0 : n.call(t, ...e)) ?? "";
}, sa = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderDownloadName) == null ? void 0 : n.call(t, ...e)) ?? yo(...e);
}, ia = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderDownloadUrls) == null ? void 0 : n.call(t, ...e)) ?? wo(...e);
}, ca = (...e) => Te("downloadProtectedResource")(...e), la = (...e) => Te("failDownloadToast")(...e), _l = (e, t) => Te("resolveMarkdownAssetUrl")(e, t), Dl = (e = {}) => {
  const t = ie();
  return Po({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) || "/api/v1",
    ask: t == null ? void 0 : t.askDocumentAi,
    documentByJobId: t == null ? void 0 : t.fetchDocumentByJobId,
    ...e
  });
}, fn = "/api/v1", ua = (...e) => Te("fetchDocumentByJobId")(...e), Fl = (e = fn, t = {}) => {
  var n;
  return Te("fetchFavorites")(
    ((n = ie()) == null ? void 0 : n.apiPrefix) ?? e,
    t
  );
};
function $l(e = {}) {
  const t = ie();
  return vo({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) ?? fn,
    documentByJobId: (...n) => Te("fetchDocumentByJobId")(...n),
    submitFavorite: (...n) => Te("createFavorite")(...n),
    loadFavorites: (...n) => Te("fetchFavorites")(...n),
    removeFavorite: (...n) => Te("deleteFavorite")(...n),
    ...e
  });
}
function da() {
  const e = () => {
    var r;
    return To(
      ((r = globalThis.location) == null ? void 0 : r.search) || ""
    );
  }, [t, n] = C(e);
  return O(() => {
    var i, c, l, d;
    const r = () => n(e()), a = (c = (i = globalThis.history) == null ? void 0 : i.pushState) == null ? void 0 : c.bind(globalThis.history), o = (d = (l = globalThis.history) == null ? void 0 : l.replaceState) == null ? void 0 : d.bind(globalThis.history);
    let s = !1;
    if (a && o)
      try {
        const u = (f) => function(...m) {
          const y = f.apply(this, m);
          return r(), globalThis.dispatchEvent(new Event("pushstate")), globalThis.dispatchEvent(new Event("replacestate")), globalThis.dispatchEvent(new Event("locationchange")), y;
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
function fa() {
  const e = da(), t = K(() => na(Rr), [e]), n = K(() => ta(), [e]), r = t || n ? `job:${t}|document:${n}` : `location:${e}`;
  return { locationKey: e, jobId: t, routeDocumentId: n, sessionIdentity: r };
}
function ma(e) {
  const {
    routeDocumentId: t,
    jobId: n,
    sessionIdentity: r,
    sessionIdentityRef: a,
    documentIdRef: o,
    sessionJobIdRef: s,
    switchToSourceMode: i
  } = e, [c, l] = C({
    documentId: "",
    jobId: ""
  }), [d, u] = C({
    documentId: "",
    jobId: ""
  }), f = c.documentId === t ? c.jobId : "", m = d.documentId === t ? d.jobId : "", y = n || f, [h, v] = C({
    jobId: "",
    documentId: ""
  }), b = h.jobId === y ? h.documentId : "", g = t || b, P = !!t && !y, [w, I] = C(null), L = (w == null ? void 0 : w.sessionIdentity) === r && w.documentId === g ? w : null, E = P || !!L, _ = x((M) => {
    const T = `${M.documentId || ""}`.trim();
    if (!T || o.current && o.current !== T) return;
    if (!o.current && s.current)
      v({
        jobId: s.current,
        documentId: T
      });
    else if (!o.current)
      return;
    const S = `${M.revision || ""}`.trim() || `${Date.now()}`;
    I({
      documentId: T,
      revision: S,
      sessionIdentity: a.current
    }), i();
  }, []);
  O(() => {
    I((M) => M && M.sessionIdentity !== r ? null : M);
  }, [r]);
  const R = x((M) => {
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
        v((T) => T.jobId === M.jobId && T.documentId === M.documentId ? T : { jobId: M.jobId, documentId: M.documentId });
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
    sessionJobId: y,
    resolvedJobDocument: h,
    setResolvedJobDocument: v,
    jobDocumentId: b,
    documentId: g,
    sourceOnly: P,
    committedDocumentSource: w,
    setCommittedDocumentSource: I,
    activeCommittedDocumentSource: L,
    sourceViewOnly: E,
    refreshCommittedDocument: _,
    applyIdentityEvent: R
  };
}
const pa = /* @__PURE__ */ new Set(["succeeded", "failed", "cancelled", "canceled"]);
function _n(e) {
  return `${(e == null ? void 0 : e.status) || ""}`.trim().toLowerCase();
}
function ha(e) {
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
function Dn(e, t) {
  const n = `/api/v1/documents/${encodeURIComponent(e)}/source.pdf`, r = `${t || ""}`.trim();
  return yt(r ? `${n}?version=${encodeURIComponent(r)}` : n);
}
function ga(e, t = "") {
  const n = `${e || ""}`.trim(), r = `${t || ""}`.trim();
  return !!(!n || r && (n === r || n === `${r}.pdf`) || /^\d{8,14}-[0-9a-f]{4,}$/i.test(n));
}
function ba(e, t) {
  var r;
  const n = [
    e == null ? void 0 : e.title,
    e == null ? void 0 : e.display_name,
    e == null ? void 0 : e.source_file_name,
    (r = e == null ? void 0 : e.book_summary) == null ? void 0 : r.source_file_name
  ];
  for (const a of n) {
    const o = `${a || ""}`.trim();
    if (o && !ga(o, t))
      return o.replace(/\.pdf$/i, "");
  }
  return "";
}
function Jt({
  percent: e,
  text: t,
  stage: n
}) {
  var r;
  try {
    (r = window.parent) == null || r.postMessage(
      {
        type: Xo.progress,
        stage: n,
        percent: e,
        text: t
      },
      Rr.messageTargetOrigin()
    );
  } catch {
  }
}
function Pt(e, t, n, r = "progress") {
  e({
    loading: !0,
    percent: t,
    text: n,
    stage: r,
    failed: !1
  }), Jt({ percent: t, text: n, stage: r });
}
function ya(e) {
  const {
    sessionJobId: t,
    sessionIdentity: n,
    sessionIdentityRef: r,
    sessionJobIdRef: a,
    sessionEpochRef: o,
    closingRef: s
  } = e, [i, c] = C(null), [l, d] = C(null), [u, f] = C(""), [m, y] = C(0), h = u === n ? i : null, v = u === n ? l : null, b = _n(h), g = pa.has(b), P = x(() => {
    y((R) => R + 1);
  }, []), w = x((R) => {
    c(R.jobPayload), d(R.manifestPayload), f(R.sessionIdentity);
  }, []), I = x((R) => {
    c(null), d(null), f(R);
  }, []), L = A(""), E = A(""), _ = x(async () => {
    const R = a.current;
    if (!R || L.current === R) return;
    const M = at.loadJobPayload;
    if (typeof M != "function") return;
    const T = o.current.value;
    L.current = R;
    try {
      const S = await M(R);
      if (s.current || o.current.value !== T || a.current !== R || !S || typeof S != "object")
        return;
      const N = _n(S);
      c(S), f(r.current), N === "succeeded" && E.current !== R && (E.current = R, y((D) => D + 1));
    } catch {
    } finally {
      L.current === R && (L.current = "");
    }
  }, []);
  return O(() => {
    E.current = "";
  }, [n]), O(() => {
    if (!t || g || !h) return;
    const R = window.setInterval(() => {
      _();
    }, 1e3);
    return () => window.clearInterval(R);
  }, [g, _, h, t]), {
    jobPayload: i,
    setJobPayload: c,
    manifestPayload: l,
    setManifestPayload: d,
    payloadSessionIdentity: u,
    setPayloadSessionIdentity: f,
    scopedJobPayload: h,
    scopedManifestPayload: v,
    jobStatus: b,
    jobTerminal: g,
    jobRefreshRevision: m,
    refreshJobArtifacts: P,
    refreshJobStatus: _,
    publishPayload: w,
    clearPayload: I
  };
}
function qt(e) {
  document.body.classList.remove(
    "reader-mode-source",
    "reader-mode-translated",
    "reader-mode-compare"
  ), document.body.classList.add(`reader-mode-${e}`);
}
function va(e, t) {
  e(t), qt(t);
}
function wa(e) {
  const [t, n] = C(e ? "source" : "compare"), r = x((o) => {
    e && o !== "source" || (n(o), qt(o));
  }, [e]), a = x((o) => {
    va(n, o);
  }, []);
  return O(() => (e && document.documentElement.classList.add("reader-source-only"), qt(t), () => {
    document.documentElement.classList.remove("reader-source-only");
  }), [e, t]), { mode: t, setMode: r, setModeState: n, switchSessionMode: a };
}
function Ce(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : null;
}
function Mr(e) {
  const t = Ce(e);
  return t && "data" in t ? t.data : e;
}
function Qe(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? t : null;
}
function Fn(e) {
  const t = Ce(e);
  if (!t || !Array.isArray(t.bbox) || t.bbox.length !== 4) return null;
  const n = t.bbox.map(Number);
  if (!n.every(Number.isFinite)) return null;
  const r = Qe(t.page);
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
function Sa(e) {
  const t = Ce(Mr(e)), n = Array.isArray(t == null ? void 0 : t.items) ? t.items : [], r = [];
  for (const a of n) {
    const o = Ce(a), s = `${(o == null ? void 0 : o.item_id) || (o == null ? void 0 : o.itemId) || ""}`.trim(), i = Fn(o == null ? void 0 : o.source), c = Fn(o == null ? void 0 : o.translated);
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
function Ia(e) {
  const t = `${e || ""}`.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return t.includes("formula") || t.includes("equation") ? "formula" : t.includes("table") ? "table" : t.includes("figure") || t.includes("image") || t.includes("chart") || t.includes("seal") ? "figure" : t.includes("text") || t.includes("title") || t.includes("paragraph") || t.includes("reference") || t.includes("caption") ? "text" : "region";
}
function mn(e) {
  const t = Ia(e.regionType);
  if (t !== "region") return t;
  if (e.assetIds.length || e.assetUrls.length) return "figure";
  const n = `${e.markdown || e.source.text || e.translated.text || ""}`.trim();
  return /^<table(?:\s|>)/i.test(n) || /\n\s*\|?\s*:?-{3,}/.test(n) ? "table" : /^\$\$[\s\S]+\$\$$/.test(n) || /^\\\[[\s\S]+\\\]$/.test(n) || /^\\begin\{(?:equation|align|gather|multline)\*?\}/.test(n) ? "formula" : n ? "text" : t;
}
function Er(e) {
  const t = mn(e);
  return t === "formula" || t === "table" || t === "figure";
}
function xr(e, t) {
  return `${Tt(e, t).text || e.markdown || ""}`.trim();
}
function Pa(e) {
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
function $n(e) {
  const t = Ce(e);
  if (!t) return null;
  const n = [];
  for (const a of Array.isArray(t.pages) ? t.pages : []) {
    const o = Ce(a), s = Qe(o == null ? void 0 : o.page), i = Qe(o == null ? void 0 : o.width), c = Qe(o == null ? void 0 : o.height);
    s == null || i == null || c == null || n.push({ page: Math.floor(s), width: i, height: c });
  }
  if (!n.length) return null;
  const r = Qe(t.page_count ?? t.pageCount);
  return {
    pageCount: r == null ? n.length : Math.floor(r),
    pages: n
  };
}
function Ta(e) {
  const t = Ce(Mr(e));
  return {
    source: $n(t == null ? void 0 : t.source),
    translated: $n(t == null ? void 0 : t.translated)
  };
}
function vt(e, t) {
  const n = zn(t);
  return n && e.find((r) => zn(r.itemId) === n) || null;
}
function wt(e) {
  return `${e || ""}`.normalize("NFKC").toLocaleLowerCase().replace(/[\p{P}\p{S}\s]+/gu, "").trim();
}
function Ra(e) {
  const t = `${e || ""}`.trim();
  if (!t) return [];
  const n = t.split(/\n\s*\n/g).map(wt).filter(Boolean), r = t.split(">").map(wt).filter(Boolean), a = [...n.reverse(), ...r.reverse(), wt(t)];
  return [...new Set(a)].filter((o) => o.length >= 16);
}
function Ma(e, t) {
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
function Ea(e, t) {
  if (!t) return null;
  const n = vt(e, t.block_id);
  if (n) return n;
  const r = Ra(t.snippet);
  if (!r.length) return null;
  const a = t.page_idx != null ? Number(t.page_idx) + 1 : t.page != null ? Number(t.page) : null, o = Number.isFinite(a) && Number(a) >= 1 ? e.filter((l) => l.source.page === Math.floor(Number(a)) || l.translated.page === Math.floor(Number(a))) : e;
  let s = null, i = 0, c = !1;
  for (const l of o) {
    const d = [l.source.text, l.translated.text, l.markdown].map(wt).filter(Boolean);
    let u = 0;
    for (const f of r)
      for (const m of d)
        u = Math.max(u, Ma(m, f));
    u > i ? (s = l, i = u, c = !1) : u > 0 && u === i && (c = !0);
  }
  return i > 0 && !c ? s : null;
}
function On(e) {
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
function xa(e, t, n) {
  const r = On(t);
  if (!r) return null;
  const a = Number(n);
  return (Number.isFinite(a) && a >= 1 ? e.filter((s) => s.source.page === Math.floor(a)) : e).find((s) => [...s.assetUrls, ...s.assetIds].some((i) => {
    const c = On(i);
    return !!c && (c === r || r.endsWith(`/${c}`) || c.endsWith(`/${r}`));
  })) || null;
}
function Tt(e, t) {
  return t === "translated" ? e.translated : e.source;
}
function jn(e, t, n) {
  if (!e || !t) return null;
  const r = Tt(e, n), a = n === "translated" ? t.translated : t.source || t.translated, o = a == null ? void 0 : a.pages.find((s) => s.page === r.page);
  return o ? { itemId: e.itemId, region: e, box: r, pageSize: o } : null;
}
function At(e, t, n) {
  if (!e || t <= 0 || n <= 0) return null;
  const { box: r, pageSize: a } = e;
  if (a.width <= 0 || a.height <= 0) return null;
  const [o, s, i, c] = r.bbox, l = r.origin === "bottom_left" ? a.height - c : s, d = r.origin === "bottom_left" ? a.height - s : c, u = Math.max(0, Math.min(t, o / a.width * t)), f = Math.max(u, Math.min(t, i / a.width * t)), m = Math.max(0, Math.min(n, l / a.height * n)), y = Math.max(m, Math.min(n, d / a.height * n));
  return f <= u || y <= m ? null : { left: u, top: m, width: f - u, height: y - m };
}
function Un(e) {
  return typeof e == "string" ? e.trim() : `${e ?? ""}`.trim();
}
function Na(e) {
  const t = (e == null ? void 0 : e.data) ?? e, n = t && typeof t == "object" ? t : {};
  return {
    activeJobId: Un(n.active_job_id),
    activeVersionId: Un(n.active_version_id)
  };
}
function ka(e) {
  const { link: t, rejectedDocumentJobId: n, hasCommittedSource: r } = e, a = t.activeJobId && t.activeJobId !== n && !t.activeJobId.startsWith("doc:") ? t.activeJobId : "";
  return a ? { kind: "follow-active-job", jobId: a, activeVersionId: t.activeVersionId } : t.activeVersionId && !r ? { kind: "open-committed-source", documentId: "", revision: t.activeVersionId } : { kind: "open-source-url" };
}
function Aa(e) {
  const {
    payloadDocumentId: t,
    linkedActiveJobId: n,
    linkedActiveVersionId: r,
    sessionJobId: a,
    hasCommittedSource: o
  } = e;
  return t && r && n === a && !o ? { kind: "restore-committed-source", documentId: t, revision: r } : { kind: "open-job-artifacts" };
}
function Ca(e) {
  return e.status === 404 && !e.jobId && !!e.routeDocumentId && !!e.documentJobId && e.sessionJobId === e.documentJobId;
}
function La(e) {
  return e ? { data: e.data.slice() } : null;
}
const za = 2, be = /* @__PURE__ */ new Map();
function Kt(e, t) {
  be.delete(e), be.set(e, t);
}
function _a(e) {
  if (be.size < za) return;
  const t = be.keys().next().value;
  t && be.delete(t);
}
function Lt(e) {
  const t = `${e || ""}`.trim();
  if (!t || !be.has(t)) return null;
  const n = be.get(t);
  return Kt(t, n), n;
}
async function Nr(e, t = Qo, n = {}) {
  const r = `${e || ""}`.trim();
  if (!r)
    return null;
  if (be.has(r)) {
    const i = be.get(r);
    return Kt(r, i), i;
  }
  const a = await t(r, { signal: n.signal });
  if (!a.ok) {
    const i = new Error(`读取 PDF 失败 (${a.status})`);
    throw i.status = a.status, i;
  }
  const o = await a.arrayBuffer(), s = { data: new Uint8Array(o) };
  return be.has(r) ? Kt(r, s) : (_a(), be.set(r, s)), s;
}
function Da(e = "", t = null) {
  const [n, r] = C(
    () => t || Lt(e)
  ), [a, o] = C(
    () => !!`${e || ""}`.trim() && !t && !Lt(e)
  ), [s, i] = C("");
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
    const l = Lt(c);
    if (l) {
      r(l), o(!1), i("");
      return;
    }
    let d = !1;
    return o(!0), i(""), r(null), Nr(c).then((u) => {
      d || (r(u), o(!1));
    }).catch((u) => {
      d || (r(null), o(!1), i((u == null ? void 0 : u.message) || String(u)));
    }), () => {
      d = !0;
    };
  }, [e, t]), { file: n, loading: a, error: s };
}
function Fa(e) {
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
async function Gt(e) {
  const { url: t, label: n, percentStart: r, percentEnd: a, fence: o, setBoot: s } = e;
  if (!t || o.isInactive())
    return null;
  Pt(s, r, n, "download");
  const i = await Nr(t, at.fetchProtected, {
    signal: o.signal
  });
  return o.isInactive() ? null : (Pt(s, a, n, "download"), i);
}
async function $a(e) {
  const { sourceFinal: t, translatedFinal: n, fence: r, setBoot: a } = e;
  Pt(a, 25, "正在下载 PDF…", "download");
  const o = [];
  let s = null, i = null;
  return t && o.push(
    Gt({
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
    Gt({
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
const pt = {
  regions: null,
  metadata: null
};
function Oa(e) {
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
    jobRefreshRevision: y,
    sessionEpochRef: h,
    closingRef: v,
    activeLoadAbortRef: b
  } = e, [g, P] = C(""), [w, I] = C(""), [L, E] = C(null), [_, R] = C(null), [M, T] = C(!1), [S, N] = C(""), [D, k] = C([]), [F, B] = C(() => ({
    source: null,
    translated: null
  })), [Z, Q] = C(
    pt
  ), [X, re] = C({
    loading: !0,
    percent: 4,
    text: Ie.boot,
    stage: "progress",
    failed: !1
  });
  return O(() => {
    const ce = new AbortController(), j = h.current.value, J = Fa({
      sessionEpochRef: h,
      closingRef: v,
      abort: ce,
      sessionEpoch: j
    });
    if (b.current = ce, v.current)
      return ce.abort(), () => {
        b.current === ce && (b.current = null);
      };
    function oe(G, q) {
      J.markFailed(), re({
        loading: !1,
        percent: 100,
        text: G,
        stage: "failed",
        failed: !0
      }), Jt({ percent: 100, text: q, stage: "failed" });
    }
    function ne() {
      T(!0), re({
        loading: !1,
        percent: 100,
        text: Ie.ready,
        stage: "ready",
        failed: !1
      }), Jt({ percent: 100, text: Ie.ready, stage: "ready" });
    }
    function le() {
      return l != null && l.documentId ? Dn(
        l.documentId,
        l.revision
      ) : Yo() ? Zo : yt(`/api/v1/documents/${encodeURIComponent(r)}/source.pdf`);
    }
    async function U() {
      let G = { activeJobId: "", activeVersionId: "" };
      try {
        const he = await at.fetchProtected(
          yt(`/api/v1/documents/${encodeURIComponent(r)}`)
        );
        if (he != null && he.ok) {
          const Ge = await he.json().catch(() => null);
          G = Na(Ge);
        }
      } catch {
      }
      const q = ka({
        link: G,
        rejectedDocumentJobId: o,
        hasCommittedSource: !!l
      });
      if (q.kind === "follow-active-job") {
        if (J.isInactive()) return;
        d({
          type: "resolved-document-job",
          documentId: r,
          jobId: q.jobId
        }), q.activeVersionId ? (l || d({
          type: "committed-source",
          documentId: r,
          revision: q.activeVersionId,
          sessionIdentity: c
        }), m("source")) : m("compare");
        return;
      }
      if (q.kind === "open-committed-source") {
        if (J.isInactive()) return;
        d({
          type: "committed-source",
          documentId: r,
          revision: q.revision,
          sessionIdentity: c
        }), m("source");
        return;
      }
      const me = le();
      if (J.isInactive()) return;
      P(me), I(""), N(""), f(c);
      const Ee = await Gt({
        url: me,
        label: "正在下载原文 PDF…",
        percentStart: 30,
        percentEnd: 85,
        fence: J,
        setBoot: re
      });
      if (!J.isInactive()) {
        if (!Ee) {
          oe("源文件不可用：该文档没有可读取的源 PDF。", "源文件下载失败");
          return;
        }
        E(Ee), ne();
      }
    }
    async function ae() {
      const G = await at.loadReaderPayload(t, {
        // committedSource 分支会丢弃 regions/metadata（旧页序已失效），
        // 直接跳过这两个可选请求，避免无效网络往返。
        includeOptionalArtifacts: !l
      });
      if (J.isInactive()) return;
      let q = null;
      if (n && !r) {
        try {
          q = await ua(fn, t);
        } catch {
        }
        if (J.isInactive()) return;
      }
      const me = ha(G.jobPayload) || `${(q == null ? void 0 : q.document_id) || ""}`.trim();
      me && !r && d({
        type: "resolved-job-document",
        jobId: t,
        documentId: me
      });
      const Ee = Aa({
        payloadDocumentId: me,
        linkedActiveJobId: `${(q == null ? void 0 : q.active_job_id) || ""}`.trim(),
        linkedActiveVersionId: `${(q == null ? void 0 : q.active_version_id) || ""}`.trim(),
        sessionJobId: t,
        hasCommittedSource: !!l
      });
      if (Ee.kind === "restore-committed-source") {
        if (J.isInactive()) return;
        d({
          type: "committed-source",
          documentId: Ee.documentId,
          revision: Ee.revision,
          sessionIdentity: c
        }), m("source");
        return;
      }
      const he = oa(G.manifestPayload), Ge = aa(G.jobPayload, G.manifestPayload), ft = typeof he == "string" ? he : ra(he), mt = r || me, Ve = l != null && l.documentId ? Dn(
        l.documentId,
        l.revision
      ) : ft || (mt ? yt(`/api/v1/documents/${encodeURIComponent(mt)}/source.pdf`) : ""), we = l ? "" : Ge || "";
      if (P(Ve || ""), I(we), N(ba(G.jobPayload, t)), u({
        jobPayload: G.jobPayload || null,
        manifestPayload: G.manifestPayload || null,
        sessionIdentity: c
      }), k(l ? [] : Sa(G.regionsPayload)), B(l ? { source: null, translated: null } : Ta(G.readerMetadata)), Q(l ? pt : G.readerErrors ?? pt), !Ve && !we) {
        oe(Ie.failed, Ie.failed);
        return;
      }
      const Se = await $a({
        sourceFinal: Ve || "",
        translatedFinal: we,
        fence: J,
        setBoot: re
      });
      if (Se.status !== "inactive") {
        if (Se.status === "incomplete") {
          oe("PDF 下载失败，请重试", "PDF 下载失败");
          return;
        }
        E(Se.sourceBytes), R(Se.translatedBytes), ne();
      }
    }
    async function pe() {
      T(!1), E(null), R(null), k([]), B({ source: null, translated: null }), Q(pt), Pt(re, 8, Ie.metadata, "metadata");
      try {
        if (s) {
          await U();
          return;
        }
        if (!t) {
          oe(Ie.failed, Ie.failed);
          return;
        }
        await ae();
      } catch (G) {
        if (J.isClosedOrStale() || (G == null ? void 0 : G.name) === "AbortError") return;
        J.markFailed();
        const q = Number(G == null ? void 0 : G.status);
        if (Ca({
          status: q,
          jobId: n,
          routeDocumentId: r,
          documentJobId: a,
          sessionJobId: t
        })) {
          d({ type: "missing-document-job", documentId: r, jobId: t }), d({ type: "cleared-resolved-document-job" }), m("source");
          return;
        }
        const me = G instanceof Error ? G.message : Ie.failed;
        oe(me, me);
      }
    }
    return pe(), () => {
      ce.abort(), b.current === ce && (b.current = null);
    };
  }, [t, r, a, o, s, i, l, y, n, c, d, u, f, m]), {
    sourceUrl: g,
    translatedUrl: w,
    sourceFile: L,
    translatedFile: _,
    assetsReady: M,
    title: S,
    regions: D,
    readerMetadata: F,
    readerErrors: Z,
    boot: X
  };
}
function ja() {
  const e = A(!1), t = A(null), { locationKey: n, jobId: r, routeDocumentId: a, sessionIdentity: o } = fa(), s = A({ identity: "", value: 0 });
  s.current.identity !== o && (s.current = {
    identity: o,
    value: s.current.value + 1
  }, e.current = !1);
  const i = A(o), c = A(""), l = A(""), d = A(() => {
  }), u = x(() => d.current(), []), f = ma({
    routeDocumentId: a,
    jobId: r,
    sessionIdentity: o,
    sessionIdentityRef: i,
    documentIdRef: c,
    sessionJobIdRef: l,
    switchToSourceMode: u
  }), {
    sessionJobId: m,
    documentId: y,
    sourceOnly: h,
    sourceViewOnly: v
  } = f, { mode: b, setMode: g, switchSessionMode: P } = wa(v);
  d.current = () => {
    P("source");
  }, i.current = o, c.current = y, l.current = m;
  const w = ya({
    sessionJobId: m,
    sessionIdentity: o,
    sessionIdentityRef: i,
    sessionJobIdRef: l,
    sessionEpochRef: s,
    closingRef: e
  }), {
    scopedJobPayload: I,
    scopedManifestPayload: L,
    jobStatus: E,
    jobTerminal: _,
    jobRefreshRevision: R,
    refreshJobArtifacts: M,
    refreshJobStatus: T
  } = w, S = Oa({
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
    switchSessionMode: P,
    jobRefreshRevision: R,
    sessionEpochRef: s,
    closingRef: e,
    activeLoadAbortRef: t
  }), N = x(() => {
    var k;
    e.current = !0, (k = t.current) == null || k.abort();
  }, []), D = K(
    () => ({
      fetchProtected: at.fetchProtected,
      jobId: m,
      jobPayload: I,
      manifestPayload: L,
      sourceUrl: S.sourceUrl,
      translatedUrl: S.translatedUrl,
      sourceOnly: v
    }),
    [m, I, L, S.sourceUrl, S.translatedUrl, v]
  );
  return {
    jobId: m,
    jobStatus: E,
    workflow: `${(I == null ? void 0 : I.workflow) || ""}`.trim().toLowerCase(),
    jobTerminal: _,
    documentId: y,
    sourceOnly: h,
    mode: b,
    setMode: g,
    sourceUrl: S.sourceUrl,
    translatedUrl: S.translatedUrl,
    sourceFile: S.sourceFile,
    translatedFile: S.translatedFile,
    assetsReady: S.assetsReady,
    boot: S.boot,
    title: S.title,
    regions: S.regions,
    readerMetadata: S.readerMetadata,
    readerErrors: S.readerErrors,
    download: D,
    refreshJobArtifacts: M,
    refreshJobStatus: T,
    refreshCommittedDocument: f.refreshCommittedDocument,
    prepareClose: N
  };
}
const Ua = 160, Ba = 8, Wa = 960;
function Ha() {
  const e = A(null), [t, n] = C(null), [r, a] = C(Wa), o = x((s) => {
    e.current = s, n(s);
  }, []);
  return O(() => {
    const s = t;
    if (!s || typeof ResizeObserver > "u")
      return;
    const i = (l) => {
      !Number.isFinite(l) || l < Ua || a((d) => Math.abs(d - l) < Ba ? d : l);
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
function Ja(e) {
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
const zt = { source: 0, translated: 0 };
function qa(e, t) {
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
  const [u, f] = C(() => ({
    identity: l,
    pages: zt
  })), [m, y] = C(() => ({ identity: l, tick: 0 })), h = u.identity === l ? u.pages : zt, v = m.identity === l ? m.tick : 0, b = Ja({
    mode: n,
    sourceOnly: r,
    assetsReady: a,
    hasSource: !!i || !!o,
    hasTranslated: !!c
  }), { primaryPane: g } = b, P = x((T, S) => {
    d.current === l && f((N) => {
      const D = N.identity === l ? N.pages : zt;
      return D[S] === T && N.identity === l ? N : {
        identity: l,
        pages: { ...D, [S]: T }
      };
    });
  }, [l]), w = A(null), I = x(() => {
    w.current && clearTimeout(w.current);
    const T = l;
    w.current = setTimeout(() => {
      w.current = null, d.current === T && y((S) => ({
        identity: T,
        tick: S.identity === T ? S.tick + 1 : 1
      }));
    }, 60);
  }, [l]);
  O(() => (w.current && (clearTimeout(w.current), w.current = null), f((T) => T.identity === l && T.pages.source === 0 && T.pages.translated === 0 ? T : { identity: l, pages: { source: 0, translated: 0 } }), y((T) => T.identity === l && T.tick === 0 ? T : { identity: l, tick: 0 }), () => {
    w.current && (clearTimeout(w.current), w.current = null);
  }), [l]);
  const L = K(
    () => Math.max(h.source, h.translated),
    [h]
  ), E = g === "translated" ? h.translated : h.source || h.translated, _ = t == null ? void 0 : t.userZoom, R = t == null ? void 0 : t.shellWidth, M = `${l}-${v}-${_}-${n}-${h.source}-${h.translated}-${R}`;
  return {
    ...b,
    numPagesByPane: h,
    hudNumPages: L,
    primaryNumPages: E,
    metricsTick: v,
    onNumPages: P,
    onMetrics: I,
    rowSyncRevision: M
  };
}
const kr = 0.25, Ar = 1, Ka = 0.05, ut = 0.5, Ga = 16, Va = 8;
function tt(e) {
  return ut;
}
function Ct(e) {
  return Number.isFinite(e) ? Math.min(Ar, Math.max(kr, e)) : ut;
}
function st(e, t) {
  const n = Ct(Number(e) + t * Ka);
  return Math.round(n * 100) / 100;
}
function Ya(e) {
  return Math.round(Ct(e) * 100);
}
function Za(e) {
  const n = (Number(e) || 0) - Ga - Va;
  return Math.max(160, Math.floor(n));
}
function Xa(e, t = ut) {
  const n = Ct(t);
  return Za((Number(e) || 0) * n);
}
function Qa(e, t) {
  if (!e || !Number.isFinite(t) || t <= 0 || Math.abs(t - 1) < 1e-3)
    return;
  const n = e.scrollLeft + e.clientWidth / 2, r = e.scrollTop + e.clientHeight / 2, a = Array.from(
    e.querySelectorAll("[data-reader-pane]")
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
const es = "retainpdf:reader:view:v1:", Bn = /* @__PURE__ */ new Set([
  "source",
  "translated",
  "markdown",
  "ai"
]), ts = /* @__PURE__ */ new Set([
  "source",
  "compare",
  "translated"
]);
function Cr() {
  try {
    return typeof globalThis.localStorage > "u" ? null : globalThis.localStorage;
  } catch {
    return null;
  }
}
function Vt(e) {
  return `${e || ""}`.trim();
}
function ns({
  documentId: e,
  jobId: t
}) {
  const n = Vt(e);
  if (n) return `document:${n}`;
  const r = Vt(t);
  return r ? `job:${r}` : "";
}
function Lr(e) {
  const t = Vt(e);
  return t ? `${es}${t}` : "";
}
function rs(e) {
  if (!e || typeof e != "object") return;
  const t = Math.floor(Number(e.page)), n = Number(e.fraction);
  if (!(!Number.isFinite(t) || t < 1 || !Number.isFinite(n)))
    return {
      page: t,
      fraction: Math.max(0, Math.min(1, n))
    };
}
function os(e) {
  if (e === null) return null;
  if (!e || typeof e != "object") return;
  const t = `${e.left || ""}`, n = `${e.right || ""}`;
  if (!(!Bn.has(t) || !Bn.has(n) || t === n))
    return { left: t, right: n };
}
function as(e) {
  return e === null ? null : e === "markdown" || e === "ai" ? e : void 0;
}
function ss(e) {
  return ts.has(e) ? e : void 0;
}
function zr(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (t.schema !== "retainpdf_reader_view_v1") return null;
  const n = rs(t.anchor), r = Number(t.zoom), a = ss(t.mode), o = os(t.splitLayout), s = as(t.assistantPanel);
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
function Re(e, t = Cr()) {
  const n = Lr(e);
  if (!n || !t) return null;
  try {
    const r = t.getItem(n);
    return r ? zr(JSON.parse(r)) : null;
  } catch {
    return null;
  }
}
function Rt(e, t, n = Cr()) {
  const r = Lr(e);
  if (!r || !n) return null;
  const a = Re(e, n), o = zr({
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
function is(e, t, n = "") {
  const [r, a] = C(() => {
    var u;
    return ((u = Re(n)) == null ? void 0 : u.zoom) ?? tt();
  }), o = A(r), s = A(n);
  o.current = r;
  const i = A(1);
  O(() => {
    var f;
    if (s.current === n) return;
    s.current = n;
    const u = ((f = Re(n)) == null ? void 0 : f.zoom) ?? tt();
    i.current = 1, o.current = u, a(u);
  }, [e, n]);
  const c = x((u) => {
    const f = Ct(u), m = o.current;
    Math.abs(f - m) < 5e-4 || (i.current = f / (m || 1), Rt(s.current, { zoom: f }), a(f));
  }, []), l = x((u) => {
    c(st(o.current, u));
  }, [c]), d = x((u) => {
    c(tt());
  }, [c]);
  return De(() => {
    const u = i.current;
    Math.abs(u - 1) < 1e-3 || (i.current = 1, Qa(t == null ? void 0 : t.current, u));
  }, [r, t]), { userZoom: r, onZoomChange: c, stepZoom: l, resetZoom: d };
}
function cs(e, t = !0) {
  const [n, r] = C(null), a = x(() => {
    var i, c;
    r(null);
    const s = (i = globalThis.getSelection) == null ? void 0 : i.call(globalThis);
    (c = s == null ? void 0 : s.removeAllRanges) == null || c.call(s);
  }, []), o = e.current ?? null;
  return O(() => {
    if (!t)
      return;
    const s = () => {
      var k, F;
      const h = e.current, v = (k = globalThis.getSelection) == null ? void 0 : k.call(globalThis);
      if (!h || !v || v.isCollapsed || !v.rangeCount) {
        r(null);
        return;
      }
      const b = v.getRangeAt(0);
      if (!h.contains(b.commonAncestorContainer)) {
        r(null);
        return;
      }
      const g = `${v.toString() || ""}`.replace(/\s+/g, " ").trim();
      if (g.length < 2) {
        r(null);
        return;
      }
      let P = b.commonAncestorContainer;
      P.nodeType === Node.TEXT_NODE && (P = P.parentElement);
      const w = (F = P == null ? void 0 : P.closest) == null ? void 0 : F.call(
        P,
        "[data-reader-page]"
      );
      if (!w || !h.contains(w)) {
        r(null);
        return;
      }
      const I = Math.max(1, Math.floor(Number(w.getAttribute("data-reader-page")) || 1)), E = w.getAttribute("data-reader-pane") === "translated" ? "translated" : "source", _ = b.getClientRects(), R = _[_.length - 1] || b.getBoundingClientRect();
      if (!R || R.width === 0 && R.height === 0) {
        r(null);
        return;
      }
      const M = typeof window < "u" ? window.innerWidth : 800, T = typeof window < "u" ? window.innerHeight : 600, S = 16, N = Math.min(Math.max(S, R.left), M - S), D = Math.min(Math.max(S, R.top), T - S);
      r({
        selectionType: "text",
        quote: g,
        page: I,
        pane: E,
        rect: {
          left: N,
          top: D,
          width: R.width,
          height: R.height
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
    const y = o ?? e.current;
    return y == null || y.addEventListener("scroll", m, { passive: !0 }), window.addEventListener("scroll", m, { passive: !0, capture: !0 }), () => {
      document.removeEventListener("mouseup", c), document.removeEventListener("pointerup", l), document.removeEventListener("touchend", d), document.removeEventListener("selectionchange", u), document.removeEventListener("keyup", f), y == null || y.removeEventListener("scroll", m), window.removeEventListener("scroll", m, !0);
    };
  }, [t, o, a]), { selection: n, clearSelection: a };
}
function ls(e) {
  const { mode: t, setMode: n, beginModeSwitch: r } = e, a = A(t), o = A(n), s = A(r);
  return a.current = t, o.current = n, s.current = r, { setModeKeepingPage: x((c) => {
    c !== a.current && (s.current(), o.current(c));
  }, []) };
}
function us() {
  const [e, t] = C(null), n = x((s) => {
    t(s);
  }, []), r = x((s = null) => {
    t((i) => !s || i === s ? null : i);
  }, []), a = x((s) => {
    t((i) => i === s ? null : s);
  }, []), o = x(
    (s) => e === s,
    [e]
  );
  return { active: e, open: n, close: r, toggle: a, isOpen: o };
}
const Mt = "data-reader-page", ds = "data-reader-pane", fs = "reader-react-scroll-shell", pn = "reader-react-pdf-page-slot";
function Et(e, t) {
  const n = e != null ? `[${Mt}="${e}"]` : `[${Mt}]`;
  return t ? `${n}[${ds}="${t}"]` : n;
}
function ms() {
  return `.${pn}[${Mt}]`;
}
function _r(e) {
  return Number(e.getAttribute(Mt));
}
const hn = 48;
function Dr(e, t = hn) {
  return e.getBoundingClientRect().top + t;
}
function Fr(e, t) {
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
  const a = _r(n);
  if (!Number.isFinite(a) || a < 1)
    return null;
  const o = n.getBoundingClientRect(), s = o.height > 0 ? o.height : 1, i = Math.min(1, Math.max(0, (t - o.top) / s));
  return { el: n, page: a, fraction: i };
}
function _t(e, t, n = hn) {
  if (!e)
    return null;
  const r = Et(void 0, t), a = Array.from(e.querySelectorAll(r));
  if (!a.length || e.getBoundingClientRect().height <= 0)
    return null;
  const s = Dr(e, n), i = Fr(a, s);
  return i ? { page: i.page, fraction: i.fraction } : null;
}
function gn(e, t, n = "auto", r, a = hn) {
  if (!e || !t)
    return !1;
  const o = Math.max(1, Math.floor(Number(t.page) || 1)), s = Math.min(1, Math.max(0, Number(t.fraction) || 0));
  let i = null;
  if (r && (i = e.querySelector(Et(o, r))), i || (i = e.querySelector(Et(o))), !i)
    return !1;
  const c = e.getBoundingClientRect(), l = i.getBoundingClientRect();
  if (c.height <= 0 || l.height < 8 && i.offsetHeight < 8)
    return !1;
  const d = l.height > 0 ? l.height : i.offsetHeight, u = e.scrollTop + (l.top - c.top), f = Math.max(0, u + s * d - a);
  return n === "auto" ? e.scrollTop = f : e.scrollTo({ top: f, behavior: n }), !0;
}
function ps(e, t, n = "smooth", r) {
  return gn(
    e,
    { page: t, fraction: 0 },
    n,
    r
  );
}
function Yt(e, t, n) {
  const r = (n == null ? void 0 : n.behavior) ?? "auto", a = (n == null ? void 0 : n.delaysMs) ?? [0, 32, 120, 280];
  let o = !1, s = !1;
  const i = [], c = () => {
    var d;
    if (o) return;
    gn(
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
function hs(e, t, n) {
  return Yt(
    e,
    { page: t, fraction: 0 },
    n
  );
}
function xt(e, t) {
  if (!Number.isFinite(e))
    return 1;
  const n = Math.max(1, Math.floor(e));
  return !Number.isFinite(t) || t <= 0 ? n : Math.min(t, n);
}
function ge(e) {
  return {
    page: Math.max(1, Math.floor(Number(e.page) || 1)),
    fraction: Math.min(1, Math.max(0, Number(e.fraction) || 0))
  };
}
function gs(e, t, n = !0, r = "", a) {
  const [o, s] = C(1);
  return O(() => {
    if (!n || t <= 0) {
      s(1);
      return;
    }
    const i = e.current;
    if (!i)
      return;
    let c = !1, l = null, d = 0;
    const u = Et(void 0, a), f = () => {
      if (c) return;
      const h = Array.from(i.querySelectorAll(u));
      if (!h.length)
        return;
      const v = Dr(i), b = Fr(h, v);
      b && s(b.page);
    }, m = () => {
      c || (d && cancelAnimationFrame(d), d = requestAnimationFrame(() => {
        d = 0, f();
      }));
    }, y = () => {
      if (c) return;
      if (!Array.from(i.querySelectorAll(u)).length) {
        l = setTimeout(y, 120);
        return;
      }
      f(), i.addEventListener("scroll", m, { passive: !0 });
    };
    return y(), () => {
      c = !0, l && clearTimeout(l), d && cancelAnimationFrame(d), i.removeEventListener("scroll", m);
    };
  }, [e, t, n, r, a]), o;
}
const bs = "canvas, .react-pdf__Page, .reader-react-pdf-page, .reader-react-pdf-page-placeholder", Wn = /* @__PURE__ */ new WeakMap();
function ys(e) {
  const t = Number(e.getAttribute("data-natural-height"));
  if (Number.isFinite(t) && t > 0)
    return t;
  let n = Wn.get(e);
  if ((n == null || !n.isConnected) && (n = e.querySelector(bs), Wn.set(e, n)), n) {
    const a = n.getBoundingClientRect().height;
    if (Number.isFinite(a) && a > 0)
      return a;
  }
  const r = e.getBoundingClientRect().height;
  return Number.isFinite(r) && r > 0 ? r : 0;
}
function vs(e, t) {
  if (e.size !== t.size) return !1;
  for (const [n, r] of t)
    if (e.get(n) !== r) return !1;
  return !0;
}
function ws(e) {
  const t = /* @__PURE__ */ new Map();
  e.querySelectorAll(ms()).forEach((r) => {
    const a = _r(r);
    if (!Number.isFinite(a) || a < 1) return;
    const o = ys(r);
    if (o <= 0) return;
    const s = t.get(a) || { height: 0, count: 0 };
    s.height = Math.max(s.height, o), s.count += 1, t.set(a, s);
  });
  const n = /* @__PURE__ */ new Map();
  return t.forEach((r, a) => {
    r.count >= 2 && r.height > 0 && n.set(a, Math.ceil(r.height));
  }), n;
}
function Ss(e, t, n = "", r) {
  const [a, o] = C(() => /* @__PURE__ */ new Map()), s = A(a), i = A(r);
  return i.current = r, De(() => {
    if (!t) {
      s.current.size !== 0 && (s.current = /* @__PURE__ */ new Map(), o(s.current));
      return;
    }
    let c = !1, l = 0, d = !1, u = !1;
    const f = () => {
      var I;
      if (c) return;
      const P = e.current;
      if (!P) return;
      const w = ws(P);
      vs(s.current, w) || (s.current = w, o(w)), d && !u && (u = !0, (I = i.current) == null || I.call(i));
    }, m = () => {
      cancelAnimationFrame(l), l = requestAnimationFrame(() => {
        requestAnimationFrame(f);
      });
    };
    m();
    const y = window.setTimeout(m, 100), h = window.setTimeout(() => {
      d = !0, m();
    }, 300), v = window.setTimeout(m, 700), b = e.current;
    let g = null;
    return b && typeof ResizeObserver < "u" && (g = new ResizeObserver(() => m()), g.observe(b)), () => {
      c = !0, cancelAnimationFrame(l), window.clearTimeout(y), window.clearTimeout(h), window.clearTimeout(v), g == null || g.disconnect();
    };
  }, [e, t, n]), a;
}
const Is = [0, 48, 140, 320, 560], Ps = 700, Ts = [80, 200, 400], Rs = 500, Ms = 50, Es = 180, Hn = [0, 48, 140, 320, 700, 1200];
function xs(e, t) {
  var T;
  const {
    primaryPane: n,
    mode: r,
    enabled: a = !0,
    persistenceKey: o = "",
    restoreReady: s = !0
  } = t, i = A(
    ((T = Re(o)) == null ? void 0 : T.anchor) || { page: 1, fraction: 0 }
  ), c = A(null), l = A(!1), d = A(r), u = A(null), f = A(null), m = A(null), y = A(null), h = A(o), v = A(""), b = A(n);
  b.current = n;
  const g = x(() => {
    var S;
    (S = u.current) == null || S.call(u), u.current = null, f.current != null && (clearTimeout(f.current), f.current = null);
  }, []), P = x((S = !1) => {
    y.current != null && (clearTimeout(y.current), y.current = null);
    const N = () => {
      y.current = null, Rt(h.current, {
        anchor: ge(i.current)
      });
    };
    S ? N() : y.current = setTimeout(N, Es);
  }, []), w = x((S) => {
    i.current = ge(S), c.current = null, m.current != null && clearTimeout(m.current), m.current = setTimeout(() => {
      m.current = null, l.current = !1;
    }, Ms);
  }, []);
  O(() => {
    if (!a)
      return;
    let S = !1, N = null, D = null, k = null;
    const F = () => {
      if (S) return;
      const B = e.current;
      if (!B) {
        k = setTimeout(F, 50);
        return;
      }
      N = B, D = () => {
        if (l.current)
          return;
        const Z = _t(N, b.current);
        Z && (i.current = Z, P());
      }, N.addEventListener("scroll", D, { passive: !0 }), l.current || D();
    };
    return F(), () => {
      S = !0, k != null && clearTimeout(k), N && D && N.removeEventListener("scroll", D);
    };
  }, [a, r, n, e, P]), De(() => {
    var N;
    if (h.current === o) return;
    P(!0), g(), m.current != null && (clearTimeout(m.current), m.current = null), h.current = o, v.current = "";
    const S = (N = Re(o)) == null ? void 0 : N.anchor;
    i.current = S ? ge(S) : { page: 1, fraction: 0 }, c.current = null, l.current = !!o, d.current = r;
  }, [o, r, P, g]), O(() => {
    var N;
    if (!a || !s || !o || v.current === o) return;
    v.current = o;
    const S = ge(
      ((N = Re(o)) == null ? void 0 : N.anchor) || { page: 1, fraction: 0 }
    );
    return i.current = S, c.current = S, l.current = !0, g(), u.current = Yt(
      () => e.current,
      S,
      {
        behavior: "auto",
        pane: b.current,
        delaysMs: Hn,
        onDone: () => w(S)
      }
    ), f.current = setTimeout(() => {
      f.current = null, w(S);
    }, Math.max(...Hn) + 160), () => g();
  }, [a, s, o, e, w, g]), O(() => {
    if (d.current === r)
      return;
    if (d.current = r, !a) {
      l.current = !1, c.current = null, g();
      return;
    }
    const S = c.current ? ge(c.current) : ge(i.current);
    return l.current = !0, c.current = S, i.current = S, g(), u.current = Yt(
      () => e.current,
      S,
      {
        behavior: "auto",
        pane: n,
        // 等页宽/行高同步后再钉；同一 locked 幂等，不会越滚越远
        delaysMs: Is,
        onDone: () => w(S)
      }
    ), f.current = setTimeout(() => {
      f.current = null, w(S);
    }, Ps), () => {
      g();
    };
  }, [r, a, n, e, w, g]), O(() => () => {
    g(), m.current != null && (clearTimeout(m.current), m.current = null), P(!0);
  }, [g, P]);
  const I = x(() => {
    const S = _t(
      e.current,
      b.current
    );
    return ge(S || i.current);
  }, [e]), L = x(() => {
    l.current = !0;
    const S = _t(
      e.current,
      b.current
    ), N = ge(S ?? i.current);
    return i.current = N, c.current = N, P(), N;
  }, [e, P]), E = x((S, N, D) => {
    const k = D || b.current, F = xt(S, N || 1), B = { page: F, fraction: 0 };
    i.current = B, l.current = !0, c.current = B, P(), g(), ps(e.current, F, "smooth", k), u.current = hs(
      () => e.current,
      F,
      {
        behavior: "auto",
        pane: k,
        delaysMs: Ts,
        onDone: () => w(B)
      }
    ), f.current = setTimeout(() => {
      f.current = null, w(B);
    }, Rs);
  }, [e, w, g, P]), _ = x(() => ge(i.current), []), R = x(() => l.current, []), M = x(() => {
    if (!l.current || !c.current)
      return;
    const S = ge(c.current);
    gn(
      e.current,
      S,
      "auto",
      b.current
    );
  }, [e]);
  return {
    lockFromShell: I,
    beginModeSwitch: L,
    goToPage: E,
    getAnchor: _,
    isRestoring: R,
    repinIfRestoring: M
  };
}
function Ns(e, t) {
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
function $r(e, t, n) {
  const r = `${(n == null ? void 0 : n.jobId) || ""}`.trim(), a = `${(n == null ? void 0 : n.documentId) || ""}`.trim(), o = `j:${r}:d:${a}`;
  return t == null ? `${o}:none:${(e == null ? void 0 : e.blockId) || ""}` : `${o}:p:${t}:b:${(e == null ? void 0 : e.blockId) || ""}`;
}
const ks = [0, 80, 200, 400, 800], As = 120, Cs = 400;
function Ls(e, t, n) {
  const { enabled: r, numPages: a, goToPage: o, resolveBlockPage: s, onAnchorApplied: i, jobId: c, documentId: l } = e, d = A(o);
  d.current = o;
  const u = A(s);
  u.current = s;
  const f = A(i);
  f.current = i;
  const m = A(n);
  m.current = n, O(() => {
    var P, w;
    if (!r || !Number.isFinite(a) || a < 1)
      return;
    const y = ea(), h = Ns(y, u.current), v = $r(y, h, { jobId: c, documentId: l });
    if (t.current === v)
      return;
    if (h == null) {
      t.current = v, (P = m.current) == null || P.call(m);
      return;
    }
    t.current = v, y && ((w = f.current) == null || w.call(f, y, h));
    const b = [];
    let g = 0;
    for (const I of ks)
      g = Math.max(g, I), b.push(
        setTimeout(() => {
          d.current(h);
        }, I)
      );
    return b.push(
      setTimeout(() => {
        var I;
        (I = m.current) == null || I.call(m);
      }, g + As)
    ), () => {
      for (const I of b) clearTimeout(I);
    };
  }, [r, a, c, l, t]);
}
function zs(e) {
  var o;
  const t = globalThis.window;
  if (!t || typeof ((o = t.history) == null ? void 0 : o.replaceState) != "function") return;
  const n = t.location, r = `${e || ""}`, a = `${n.pathname}${r ? `?${r}` : ""}${n.hash || ""}`;
  t.history.replaceState(null, "", a);
}
function _s(e, t, n) {
  const {
    syncEnabled: r,
    currentPage: a,
    resolveBlockPage: o,
    syncDebounceMs: s = Cs,
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
      const y = ((b = globalThis.location) == null ? void 0 : b.search) || "", h = Ro(y, a, d.current);
      if (f.current = a, h === null) return;
      const v = `${new URLSearchParams(h).get("block_id") || ""}`.trim();
      t.current = $r(
        { blockId: v },
        a,
        { jobId: i, documentId: c }
      ), (u.current || zs)(h);
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
function Ds(e) {
  const t = A(""), [n, r] = C(!1), a = x(() => r(!0), []), o = {
    enabled: e.enabled,
    numPages: e.numPages,
    goToPage: e.goToPage,
    resolveBlockPage: e.resolveBlockPage,
    onAnchorApplied: e.onAnchorApplied,
    jobId: e.jobId,
    documentId: e.documentId
  };
  Ls(o, t, a), _s(e, t, n);
}
const ht = {
  layoutByPage: /* @__PURE__ */ new Map(),
  pagesByPage: /* @__PURE__ */ new Map(),
  lastSeq: 0,
  connection: "idle",
  jobStatus: "",
  error: ""
};
function Fs(e) {
  return new Map(((e == null ? void 0 : e.pages) || []).map((t) => [t.page_idx, t]));
}
function Jn(e, t) {
  return e.attempt !== t.attempt ? e.attempt < t.attempt ? -1 : 1 : e.generation !== t.generation ? e.generation < t.generation ? -1 : 1 : 0;
}
function Or(e, t, n) {
  if (n.page_idx !== t.page_idx) return "retry";
  const r = Jn(n, t);
  if (r < 0 || r === 0 && n.page_hash !== t.page_hash) return "retry";
  if (!e) return "accept";
  const a = Jn(n, e);
  return a < 0 ? "ignore" : a === 0 ? n.page_hash === e.pageHash ? "ignore" : "retry" : "accept";
}
function $s(e, t, n) {
  if (t.seq <= e.lastSeq) return e;
  const r = e.pagesByPage.get(t.page_idx), a = Or(r, t, n);
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
const qn = [250, 500, 1e3, 2e3, 4e3], Dt = [80, 160, 320, 640, 1e3, 1500], Kn = [250, 500, 1e3, 2e3, 4e3, 5e3], Os = /* @__PURE__ */ new Set(["succeeded", "failed", "cancelled", "canceled"]);
function Zt(e, t) {
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
function Ft(e, t) {
  if (e instanceof It) {
    if (e.code === "LIVE_TRANSLATION_PAGE_NOT_COMMITTED")
      return "尚未收到可显示的页面译文";
    if (e.code === "LIVE_TRANSLATION_LAYOUT_NOT_READY")
      return "正在等待 OCR 版面数据";
  }
  return `${(e == null ? void 0 : e.message) || ""}`.trim() || t;
}
async function js(e, t, n, r) {
  let a = null;
  for (let o = 0; ; o += 1) {
    try {
      const i = await Ao(e, t.page_idx, { signal: r });
      if (Or(n.pagesByPage.get(t.page_idx), t, i) !== "retry")
        return i;
      a = new It(
        "Authoritative page snapshot has not reached the event generation",
        409,
        "LIVE_TRANSLATION_SNAPSHOT_UNAVAILABLE"
      );
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") throw i;
      a = i;
      const c = i instanceof It ? i.code : "";
      if (c && ![
        "LIVE_TRANSLATION_PAGE_NOT_COMMITTED",
        "LIVE_TRANSLATION_SNAPSHOT_UNAVAILABLE"
      ].includes(c)) throw i;
    }
    const s = Dt[Math.min(o, Dt.length - 1)];
    if (await Zt(s, r), o >= Dt.length + 2) throw a;
  }
}
function Us({
  jobId: e,
  jobStatus: t,
  enabled: n
}) {
  const [r, a] = C(ht), o = A(r), s = A("");
  o.current = r;
  const i = `${e || ""}`.trim(), c = `${t || ""}`.trim().toLowerCase(), l = Os.has(c) ? c : "";
  return O(() => {
    if (!n || !i) {
      s.current = "", o.current = ht, a(ht);
      return;
    }
    const d = s.current === i;
    s.current = i;
    const u = new AbortController();
    let f = !1;
    const m = {
      ...d ? o.current : ht,
      connection: l ? "terminal" : "connecting",
      jobStatus: c,
      error: ""
    };
    o.current = m, a(m);
    const y = (b) => {
      u.signal.aborted || a((g) => {
        const P = b(g);
        return o.current = P, P;
      });
    }, h = async () => {
      let b = 0;
      for (; !u.signal.aborted; )
        try {
          const g = await No(i, { signal: u.signal });
          f = !0, y((P) => ({
            ...P,
            layoutByPage: Fs(g),
            jobStatus: c,
            error: ""
          }));
          return;
        } catch (g) {
          if ((g == null ? void 0 : g.name) === "AbortError") return;
          if (!(g instanceof It && g.code === "LIVE_TRANSLATION_LAYOUT_NOT_READY")) {
            y((w) => ({
              ...w,
              connection: l ? "terminal" : "unavailable",
              jobStatus: c,
              error: Ft(g, "实时译文暂不可用")
            }));
            return;
          }
          if (l) {
            y((w) => ({
              ...w,
              connection: "terminal",
              jobStatus: c,
              error: ""
            }));
            return;
          }
          y((w) => ({
            ...w,
            connection: "connecting",
            jobStatus: c,
            error: Ft(g, "正在等待 OCR 版面数据")
          })), await Zt(qn[Math.min(b, qn.length - 1)], u.signal).catch(() => {
          }), b += 1;
        }
    };
    return (async () => {
      if (await h(), !f || u.signal.aborted) return;
      let b = 0;
      for (; !u.signal.aborted; ) {
        l || y((g) => ({
          ...g,
          connection: g.lastSeq > 0 ? "reconnecting" : "connecting",
          jobStatus: c,
          error: g.lastSeq > 0 ? g.error : ""
        }));
        try {
          await ko(i, {
            afterSeq: o.current.lastSeq,
            signal: u.signal,
            onEvent: async (g) => {
              if (g.seq <= o.current.lastSeq) return;
              const P = await js(
                i,
                g,
                o.current,
                u.signal
              );
              y((w) => {
                const I = $s(w, g, P);
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
          y((P) => ({
            ...P,
            connection: l ? "terminal" : "reconnecting",
            jobStatus: c,
            error: Ft(g, "实时译文连接已中断，正在重连")
          }));
        }
        if (u.signal.aborted) return;
        if (l) {
          y((g) => ({
            ...g,
            connection: "terminal",
            jobStatus: c
          }));
          return;
        }
        await Zt(Kn[Math.min(b, Kn.length - 1)], u.signal).catch(() => {
        }), b += 1;
      }
    })(), () => u.abort();
  }, [n, i, l]), r;
}
const Bs = 2e3;
function Ws(e) {
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
const Hs = /* @__PURE__ */ new Set(["book", "translate"]);
function jr(e) {
  return !!(e.jobId && e.sourceUrl && Hs.has(e.workflow));
}
function Js(e) {
  return !!(jr(e) && !(e.jobStatus === "succeeded" && e.translatedUrl));
}
function qs() {
  const e = ja(), t = jr({
    jobId: e.jobId,
    sourceUrl: e.sourceUrl,
    workflow: e.workflow
  }), n = Js({
    jobId: e.jobId,
    sourceUrl: e.sourceUrl,
    translatedUrl: e.translatedUrl,
    jobStatus: e.jobStatus,
    workflow: e.workflow
  }), r = Us({
    jobId: e.jobId,
    jobStatus: e.jobStatus,
    enabled: t
  }), a = us(), { shellRef: o, shellEl: s, shellWidth: i, bindShell: c } = Ha(), l = ns({
    documentId: e.documentId,
    jobId: e.jobId
  }), d = `${l}\0${e.jobId}\0${e.sourceUrl}\0${e.translatedUrl}`, { userZoom: u, onZoomChange: f } = is(e.mode, o, l), m = qa(
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
    beginModeSwitch: y,
    goToPage: h,
    repinIfRestoring: v
  } = xs(o, {
    primaryPane: m.primaryPane,
    mode: e.mode,
    enabled: !e.boot.loading,
    persistenceKey: l,
    restoreReady: m.primaryNumPages > 0
  });
  O(() => {
    v();
  }, [i, v]);
  const b = Ss(
    o,
    m.compareMode,
    m.rowSyncRevision,
    v
  ), g = gs(
    o,
    m.primaryNumPages,
    !e.boot.loading,
    `${e.mode}-${u}-${m.metricsTick}`,
    m.primaryPane
  ), P = x((j, J) => {
    var ne, le;
    const oe = Math.max(
      Number(m.hudNumPages) || 0,
      Number(m.primaryNumPages) || 0,
      Number((ne = m.numPagesByPane) == null ? void 0 : ne.source) || 0,
      Number((le = m.numPagesByPane) == null ? void 0 : le.translated) || 0
    );
    h(j, oe, J);
  }, [h, m.hudNumPages, m.primaryNumPages, m.numPagesByPane]), [w, I] = C(null), L = A(null), E = x((j) => {
    L.current && clearTimeout(L.current), I(j), j && (L.current = setTimeout(() => I(null), Bs));
  }, []);
  O(() => () => {
    L.current && clearTimeout(L.current);
  }, []);
  const _ = x((j) => {
    const J = vt(e.regions, j);
    return J ? Tt(J, m.primaryPane).page : null;
  }, [e.regions, m.primaryPane]), R = x((j, J) => {
    const oe = J || m.primaryPane, ne = typeof j == "object" && j ? `${j.block_id || ""}`.trim() : "", le = typeof j == "object" && j ? `${j.image_url || ""}`.trim() : "", U = typeof j == "object" && j ? j.page_idx != null ? Number(j.page_idx) + 1 : j.page != null ? Number(j.page) : null : typeof j == "number" ? j + 1 : null, ae = xa(e.regions, le, U) || vt(e.regions, ne) || (typeof j == "object" ? Ea(e.regions, j) : null);
    let pe = ae ? Tt(ae, oe).page : null;
    pe == null && (pe = Ws(j)), !(pe == null || pe < 1) && (E(ae), P(pe, oe));
  }, [E, P, m.primaryPane, e.regions]);
  Ds({
    enabled: !e.boot.loading && !e.boot.failed && e.assetsReady,
    syncEnabled: !e.boot.loading && !e.boot.failed && e.assetsReady,
    numPages: m.hudNumPages || 0,
    currentPage: g,
    goToPage: P,
    resolveBlockPage: _,
    jobId: e.jobId,
    documentId: e.documentId,
    onAnchorApplied: (j) => {
      E(vt(e.regions, j.blockId));
    }
  });
  const { setModeKeepingPage: M } = ls({
    mode: e.mode,
    setMode: e.setMode,
    beginModeSwitch: y
  }), [T, S] = C(null), {
    selection: N,
    clearSelection: D
  } = cs(o, !e.boot.loading && !e.boot.failed), k = x(() => {
    S(null), D();
  }, [D]), F = x((j) => {
    D(), S(j);
  }, [D]);
  O(() => {
    N && S(null);
  }, [N]), O(() => {
    const j = o.current;
    if (!j) return;
    const J = () => S(null);
    return j.addEventListener("scroll", J, { passive: !0 }), () => j.removeEventListener("scroll", J);
  }, [s, o]);
  const B = N || T;
  O(() => {
    E(null), k();
  }, [d, E, k]);
  const Z = !e.boot.loading && !e.boot.failed, Q = K(() => a, [a.active, a.open, a.close, a.toggle, a.isOpen]), X = K(() => ({ bindShell: c, shellEl: s, shellWidth: i, shellRef: o }), [c, s, i, o]), re = K(() => ({
    sourceUrl: e.sourceUrl,
    translatedUrl: e.translatedUrl,
    sourceFile: e.sourceFile,
    translatedFile: e.translatedFile
  }), [e.sourceUrl, e.translatedUrl, e.sourceFile, e.translatedFile]), ce = K(() => ({
    session: e,
    boot: e.boot,
    sourceOnly: e.sourceOnly,
    mode: e.mode,
    userZoom: u,
    onZoomChange: f,
    shell: X,
    panes: m,
    sessionFiles: re,
    rowHeights: b,
    goToPage: P,
    activeRegion: w,
    jumpToAnchor: R,
    setModeKeepingPage: M,
    download: e.download,
    showHud: Z,
    tools: Q,
    selection: B,
    clearSelection: k,
    selectRegion: F,
    documentTitle: e.title || "",
    viewStateKey: l,
    liveTranslation: r,
    liveTranslationAvailable: n
  }), [e, X, m, re, b, P, w, R, M, Z, Q, B, k, F, u, f, l, r, n]);
  return K(() => ({
    ...ce,
    currentPage: g
  }), [ce, g]);
}
const Ks = [
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
], Gs = [
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
function Vs(e) {
  const t = e.length === 1 ? e.toLowerCase() : e;
  for (const n of Ks)
    if (n.keys.some(
      (a) => a.length === 1 ? a === t : a === e
    )) return n;
  return null;
}
function Ys(e) {
  if (!(e instanceof HTMLElement))
    return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function Zs(e) {
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
      if (u.defaultPrevented || u.metaKey || u.ctrlKey || u.altKey || Ys(u.target))
        return;
      const f = u.key, m = Vs(f);
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
              o(st(a, 1));
              return;
            case "zoom-out":
              o(st(a, -1));
              return;
            case "zoom-reset":
              o(tt());
              return;
            case "next-page":
              c(xt(s + 1, i));
              return;
            case "prev-page":
              c(xt(s - 1, i));
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
const Xs = "retainpdf:soft-reader-close";
function Qs() {
  return new URL("./index.html", window.location.href).href;
}
function ei() {
  if (typeof window > "u" || window.self === window.top) return !1;
  try {
    return window.parent.postMessage(
      { type: Xs },
      window.location.origin
    ), !0;
  } catch {
    return !1;
  }
}
function ti(e, t, n) {
  if (n <= 1 || !e) return !1;
  try {
    const r = new URL(t), a = new URL(e, r);
    return a.origin === r.origin && !/reader\.html$/i.test(a.pathname) && !/detail\.html$/i.test(a.pathname);
  } catch {
    return !1;
  }
}
function ni() {
  if (!(typeof window > "u") && !ei()) {
    if (ti(
      document.referrer,
      window.location.href,
      window.history.length
    )) {
      window.history.back();
      return;
    }
    window.location.assign(Qs());
  }
}
function ri({ onBeforeClose: e } = {}) {
  return /* @__PURE__ */ z(
    "button",
    {
      id: "reader-close-home-btn",
      type: "button",
      className: "reader-close-home-btn",
      "aria-label": "返回主页",
      title: "返回主页",
      onClick: () => {
        e == null || e(), ni();
      },
      children: [
        /* @__PURE__ */ p(Ke, { className: "reader-close-home-icon", size: 18, strokeWidth: 2.25, "aria-hidden": !0 }),
        /* @__PURE__ */ p("span", { className: "reader-close-home-label", children: "关闭" })
      ]
    }
  );
}
let Gn = !1;
function oi() {
  if (Gn)
    return;
  const e = Ht("build/pdf.worker.mjs");
  e && (Ho.GlobalWorkerOptions.workerSrc = e, Gn = !0);
}
const ai = {
  formula: "公式",
  table: "表格",
  figure: "图片",
  text: "文字",
  region: "区域"
};
function si({
  pane: e,
  width: t,
  height: n,
  regions: r,
  onSelect: a
}) {
  const o = r.flatMap((s) => {
    if (!Er(s.region)) return [];
    const i = At(s, t, n);
    return i ? [{ highlight: s, rect: i }] : [];
  });
  return o.length ? /* @__PURE__ */ p("div", { className: "reader-structure-selection-layer", "aria-label": "PDF 结构选择层", children: o.map(({ highlight: s, rect: i }) => {
    const c = s.region, l = mn(c), d = ai[l];
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
          /* @__PURE__ */ p("span", { className: "sr-only", children: xr(c, e) })
        ]
      },
      c.itemId
    );
  }) }) : null;
}
function ii(e, t, n) {
  return e.flatMap((r) => {
    if (mn(r.region) !== "text") return [];
    const a = At(r, t, n);
    return a ? [{ itemId: r.itemId, highlight: r, rect: a }] : [];
  });
}
function Vn(e, t, n) {
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
function ci({ target: e }) {
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
function li(e, t) {
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
function ui(e, t, n, r) {
  if (!e || !t) return [];
  const a = [];
  for (const o of e.blocks) {
    const s = t.itemsById.get(o.item_id);
    if (!(s != null && s.translated_text)) continue;
    const i = At(
      li(e, o),
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
const di = '"Source Han Serif SC", "Noto Serif CJK SC", "Songti SC", serif', fi = 256, Ze = /* @__PURE__ */ new Map();
function mi(e) {
  return `${e || ""}`.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function pi(e) {
  const t = `${e || ""}`, { text: n, slots: r } = Ko(t), a = mi(n), o = Go(a, r);
  if (!r.length)
    return { fallbackHtml: o, richHtml: Promise.resolve(o), hasMath: !1 };
  let s = Ze.get(t);
  if (!s && (s = Vo(a, r), Ze.set(t, s), Ze.size > fi)) {
    const i = Ze.keys().next().value;
    i !== void 0 && Ze.delete(i);
  }
  return { fallbackHtml: o, richHtml: s, hasMath: !0 };
}
function $t(e) {
  return /title|heading|header|display_formula|equation/i.test(e);
}
function Pe(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? t : void 0;
}
function hi(e, t) {
  const n = e.typography, r = Pe(t) || 1, a = Pe(n == null ? void 0 : n.font_size_pt), o = Math.max(1, `${e.sourceText || ""}`.split(/\n+/).length), s = e.rect.height / Math.max(1.28, o * 1.18), i = $t(e.kind) ? 24 : /caption|footnote|table/i.test(e.kind) ? 9.5 : 11, c = Math.max(5.5 * r, Math.min(s, i * r)), l = Pe(n == null ? void 0 : n.fit_min_font_size_pt), d = Pe(n == null ? void 0 : n.fit_max_font_size_pt), u = Math.max(3.5, (l || 5.5) * r), f = Math.max(
    u,
    d ? d * r : a ? a * r : c
  ), m = a ? a * r : c, y = Pe(n == null ? void 0 : n.leading_em), h = [
    Pe(n == null ? void 0 : n.padding_top_pt) || 0,
    Pe(n == null ? void 0 : n.padding_right_pt) || 0,
    Pe(n == null ? void 0 : n.padding_bottom_pt) || 0,
    Pe(n == null ? void 0 : n.padding_left_pt) || 0
  ].map((v) => v * r);
  return {
    fontFamily: `${(n == null ? void 0 : n.font_family) || ""}`.trim() || di,
    fontSizePx: Math.max(u, Math.min(f, m)),
    minFontSizePx: u,
    maxFontSizePx: f,
    // Typst leading is the additional inter-line gap, unlike CSS line-height.
    lineHeight: y ? 1 + y : 1.3,
    fontWeight: (n == null ? void 0 : n.font_weight) || ($t(e.kind) ? 600 : 400),
    textAlign: (n == null ? void 0 : n.text_align) || ($t(e.kind) ? "center" : "justify"),
    padding: h,
    exact: !!a
  };
}
function gi(e, t, n, r) {
  const { minFontSizePx: a, maxFontSizePx: o } = r, s = /* @__PURE__ */ new Map(), i = (u) => {
    const f = s.get(u);
    if (f !== void 0) return f;
    const { width: m, height: y } = e(u), h = m <= t + 0.5 && y <= n + 0.5;
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
const bi = 512, Xe = /* @__PURE__ */ new Map();
let Xt = 0;
typeof document < "u" && document.fonts && (document.fonts.ready.then(() => {
  Xt += 1;
}).catch(() => {
}), typeof document.fonts.addEventListener == "function" && document.fonts.addEventListener("loadingdone", () => {
  Xt += 1;
}));
function yi(e, t, n, r) {
  return [
    Xt,
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
function vi({ item: e, pageScale: t }) {
  const n = A(null), r = K(
    () => pi(e.translatedText),
    [e.translatedText]
  ), [a, o] = C(r.fallbackHtml), s = K(
    () => hi(e, t),
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
    const [f, m, y, h] = s.padding, v = Math.max(1, e.rect.width - h - m), b = Math.max(1, e.rect.height - f - y), g = yi(a, v, b, s);
    let P = Xe.get(g);
    if (P === void 0 && (P = gi(
      (w) => (u.style.fontSize = `${w}px`, { width: u.scrollWidth, height: u.scrollHeight }),
      v,
      b,
      {
        minFontSizePx: s.minFontSizePx,
        maxFontSizePx: s.maxFontSizePx,
        requestedFontSizePx: s.fontSizePx,
        exact: s.exact
      }
    ), Xe.set(g, P), Xe.size > bi)) {
      const w = Xe.keys().next().value;
      w !== void 0 && Xe.delete(w);
    }
    u.style.fontSize = `${P.toFixed(2)}px`;
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
function wi({
  layoutPage: e,
  pageState: t,
  width: n,
  height: r
}) {
  const a = K(
    () => ui(e, t, n, r),
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
        vi,
        {
          item: o,
          pageScale: e != null && e.width ? n / e.width : 1
        },
        `${o.itemId}:${o.changedAtSeq}`
      ))
    }
  ) : null;
}
const Si = on(wi), Ur = 1.414;
function Ii({
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
  liveTranslationPage: y,
  showLiveTranslation: h = r === "source"
}) {
  const v = A(i ?? Ur), [b, g] = C(v.current);
  O(() => {
    i != null && Math.abs(i - v.current) >= 1e-3 && (v.current = i, g(i));
  }, [i]);
  const P = A(l);
  P.current = l;
  const w = A((k) => {
    var F;
    (F = P.current) == null || F.call(P, k);
  }).current, I = Math.max(120, Math.floor(t * b)), L = Math.max(I, Math.ceil(o || 0)), E = At(d, t, I), _ = K(
    () => ii(u, t, I),
    [I, u, t]
  ), [R, M] = C(null), T = K(
    () => _.find((k) => k.itemId === R) || null,
    [R, _]
  ), S = (k) => {
    if (k.buttons !== 0) {
      M(null);
      return;
    }
    const F = k.currentTarget.getBoundingClientRect(), B = Vn(
      _,
      k.clientX - F.left,
      k.clientY - F.top
    ), Z = (B == null ? void 0 : B.itemId) || null;
    M((Q) => Q === Z ? Q : Z);
  }, N = (k) => {
    var Z, Q, X;
    if (!f || (Q = (Z = k.target) == null ? void 0 : Z.closest) != null && Q.call(Z, ".reader-structure-selection-target") || `${((X = window.getSelection()) == null ? void 0 : X.toString()) || ""}`.trim()) return;
    const F = k.currentTarget.getBoundingClientRect(), B = Vn(
      _,
      k.clientX - F.left,
      k.clientY - F.top
    );
    B && f({
      selectionType: "region",
      region: B.highlight.region,
      kind: "text",
      page: B.highlight.box.page,
      pane: r === "translated" ? "translated" : "source",
      rect: {
        left: F.left + B.rect.left,
        top: F.top + B.rect.top,
        width: B.rect.width,
        height: B.rect.height
      }
    });
  }, D = (k) => {
    !Number.isFinite(k) || k <= 0 || Math.abs(v.current - k) < 1e-3 || (v.current = k, g(k), c == null || c(e, k));
  };
  return /* @__PURE__ */ z(
    "div",
    {
      ref: w,
      "data-reader-page": e,
      "data-reader-pane": r,
      "data-natural-height": I,
      className: pn,
      onPointerMoveCapture: S,
      onClick: N,
      onPointerLeave: () => M(null),
      style: {
        width: t,
        height: L,
        minHeight: L
      },
      children: [
        a ? /* @__PURE__ */ p(
          Jo,
          {
            pageNumber: e,
            width: t,
            devicePixelRatio: n,
            renderTextLayer: !0,
            renderAnnotationLayer: !1,
            className: "reader-react-pdf-page",
            loading: /* @__PURE__ */ p(
              "div",
              {
                className: "reader-react-pdf-page-placeholder",
                style: { width: t, height: I }
              }
            ),
            onLoadSuccess: (k) => {
              try {
                const F = k.getViewport({ scale: 1 });
                if (F.width > 0) {
                  const B = F.height / F.width;
                  D(B);
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
            className: "reader-react-pdf-page-placeholder",
            style: { width: t, height: I },
            "aria-hidden": !0
          }
        ),
        E ? /* @__PURE__ */ p(
          "div",
          {
            className: "reader-react-pdf-region-highlight",
            "data-reader-region-id": d == null ? void 0 : d.itemId,
            style: E,
            "aria-hidden": "true"
          }
        ) : null,
        a && h ? /* @__PURE__ */ p(
          Si,
          {
            layoutPage: m,
            pageState: y,
            width: t,
            height: I
          }
        ) : null,
        /* @__PURE__ */ p(ci, { target: a ? T : null }),
        /* @__PURE__ */ p(
          si,
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
const Pi = on(Ii), Ot = 5, Ti = "120% 0px", Ri = 120;
let Yn = 1;
const Zn = /* @__PURE__ */ new WeakMap();
function Mi(e) {
  if (!e) return 0;
  const t = Zn.get(e);
  if (t) return t;
  const n = Yn;
  return Yn += 1, Zn.set(e, n), n;
}
function Ei() {
  const e = typeof window < "u" && window.devicePixelRatio || 1;
  return Math.max(1, Math.min(e, 2));
}
const xi = ho(
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
    activeRegion: y = null,
    regions: h = [],
    readerMetadata: v = null,
    onSelectRegion: b,
    liveTranslation: g,
    showLiveTranslation: P = t === "source",
    liveTranslationPendingLabel: w = ""
  }, I) {
    oi();
    const { file: L, loading: E, error: _ } = Da(n, r), R = `${n}\0${Mi(L)}`, M = A(R);
    M.current = R;
    const T = K(
      () => La(L),
      [L, n]
    ), [S, N] = C(0), [D, k] = C(""), [F, B] = C(null), [Z, Q] = C(480), X = A(null), re = A(0), ce = K(() => Ei(), []), j = K(() => ({
      cMapUrl: Ht("cmaps/"),
      cMapPacked: !0,
      standardFontDataUrl: Ht("standard_fonts/")
    }), []);
    an(I, () => F, [F]), O(() => {
      const $ = (W) => {
        !Number.isFinite(W) || W < 80 || Math.abs(W - re.current) < 8 || (re.current = W, Q(W));
      }, V = c && c >= 80 ? c : (i == null ? void 0 : i.clientWidth) || 0;
      if ($(V), !i || typeof ResizeObserver > "u" || c && c >= 80) return;
      const H = new ResizeObserver((W) => {
        var ee, te;
        const se = ((te = (ee = W[0]) == null ? void 0 : ee.contentRect) == null ? void 0 : te.width) ?? i.clientWidth;
        !Number.isFinite(se) || se < 80 || (X.current && clearTimeout(X.current), X.current = setTimeout(() => $(se), 80));
      });
      return H.observe(i), () => {
        H.disconnect(), X.current && clearTimeout(X.current);
      };
    }, [c, i, o]);
    const J = K(
      () => Xa(Z, a),
      [Z, a]
    ), [oe, ne] = C(() => /* @__PURE__ */ new Map()), [le, U] = C(() => /* @__PURE__ */ new Set()), [ae, pe] = C(() => /* @__PURE__ */ new Set()), G = A(/* @__PURE__ */ new Map()), q = A(null), me = A(/* @__PURE__ */ new Map()), Ee = x(($, V) => {
      ne((H) => {
        if (H.get($) === V) return H;
        const W = new Map(H);
        return W.set($, V), W;
      });
    }, []), he = x(($, V) => {
      const H = G.current, W = H.get($);
      if (W && q.current)
        try {
          q.current.unobserve(W);
        } catch {
        }
      if (V) {
        if (H.set($, V), q.current)
          try {
            q.current.observe(V);
          } catch {
          }
      } else
        H.delete($);
    }, []), Ge = A(/* @__PURE__ */ new Map()), ft = x(($) => {
      const V = Ge.current;
      let H = V.get($);
      return H || (H = (W) => he($, W), V.set($, H)), H;
    }, [he]);
    O(() => {
      if (typeof IntersectionObserver > "u") return;
      const $ = me.current, V = new IntersectionObserver(
        (H) => {
          const W = [], se = [];
          for (const ee of H) {
            const te = ee.target, fe = Number(te.getAttribute("data-reader-page"));
            Number.isFinite(fe) && (ee.isIntersecting ? W : se).push(fe);
          }
          if ((W.length || se.length) && U((ee) => {
            let te = null;
            for (const fe of W)
              ee.has(fe) || (te = te || new Set(ee), te.add(fe));
            for (const fe of se)
              ee.has(fe) && (te = te || new Set(ee), te.delete(fe));
            return te || ee;
          }), W.length) {
            for (const ee of W) {
              const te = $.get(ee);
              te && (clearTimeout(te), $.delete(ee));
            }
            pe((ee) => {
              let te = null;
              for (const fe of W)
                ee.has(fe) || (te = te || new Set(ee), te.add(fe));
              return te || ee;
            });
          }
          for (const ee of se)
            $.has(ee) || $.set(ee, setTimeout(() => {
              $.delete(ee), pe((te) => {
                if (!te.has(ee)) return te;
                const fe = new Set(te);
                return fe.delete(ee), fe;
              });
            }, Ri));
        },
        { root: i, rootMargin: Ti, threshold: 0 }
      );
      q.current = V;
      for (const H of G.current.values())
        try {
          V.observe(H);
        } catch {
        }
      return () => {
        V.disconnect(), q.current === V && (q.current = null);
        for (const H of $.values()) clearTimeout(H);
        $.clear();
      };
    }, [i]), De(() => {
      N(0), k(""), U(/* @__PURE__ */ new Set()), pe(/* @__PURE__ */ new Set()), ne(/* @__PURE__ */ new Map()), G.current.clear();
      const $ = me.current;
      for (const V of $.values()) clearTimeout(V);
      $.clear(), m == null || m(0, t);
    }, [R, m, t]);
    const mt = x(
      ({ numPages: $ }) => {
        M.current === R && (N($), k(""), m == null || m($, t), u == null || u({ numPages: $, pane: t }));
      },
      [R, u, m, t]
    ), Ve = x(
      ($) => {
        if (M.current !== R) return;
        const V = ($ == null ? void 0 : $.message) || "PDF 解析失败";
        k(V), N(0), m == null || m(0, t), f == null || f($, t);
      },
      [R, f, m, t]
    ), we = K(
      () => S > 0 ? Array.from({ length: S }, ($, V) => V + 1) : [],
      [S]
    );
    O(() => {
      typeof IntersectionObserver < "u" || pe(new Set(we));
    }, [we]);
    const Se = K(
      () => jn(y, v, t),
      [y, v, t]
    ), uo = K(() => {
      const $ = /* @__PURE__ */ new Map();
      for (const V of h) {
        const H = jn(V, v, t);
        if (!H) continue;
        const W = $.get(H.box.page) || [];
        W.push(H), $.set(H.box.page, W);
      }
      return $;
    }, [t, v, h]), fo = K(() => {
      if (S === 0) return /* @__PURE__ */ new Set();
      if (!(!!i && typeof IntersectionObserver < "u" && o)) return new Set(we);
      if (le.size === 0) {
        const H = Math.min(S, Ot * 2 + 1);
        return new Set(Array.from({ length: H }, (W, se) => se + 1));
      }
      const V = /* @__PURE__ */ new Set();
      for (const H of le)
        for (let W = -Ot; W <= Ot; W++) {
          const se = H + W;
          se >= 1 && se <= S && V.add(se);
        }
      return V;
    }, [S, we, i, o, le]), mo = !n || !!_ || !!D, po = n && (_ || D) || s;
    return /* @__PURE__ */ z(
      "section",
      {
        ref: B,
        className: `reader-panel reader-react-pdf-pane${o ? "" : " is-hidden"}`,
        "data-reader-pane": t,
        "data-reader-engine": "react-pdf",
        "data-reader-visible": o ? "true" : "false",
        "data-live-translation-status": (g == null ? void 0 : g.jobStatus) || void 0,
        "aria-hidden": o ? void 0 : !0,
        "aria-label": t === "source" ? "原文 PDF" : "译文 PDF",
        children: [
          w ? /* @__PURE__ */ z("div", { className: "reader-live-translation-waiting", role: "status", children: [
            /* @__PURE__ */ p("span", { className: "reader-live-translation-waiting-dot", "aria-hidden": "true" }),
            /* @__PURE__ */ p("span", { children: w })
          ] }) : null,
          mo && !E ? /* @__PURE__ */ p("div", { className: "reader-empty reader-react-pdf-empty", "data-reader-pdf-empty": t, children: po }) : null,
          E ? /* @__PURE__ */ p("div", { className: "reader-empty reader-react-pdf-loading", "data-reader-pdf-loading": t, children: "正在加载 PDF…" }) : null,
          T && !_ ? /* @__PURE__ */ p("div", { className: "reader-viewer-wrap reader-react-pdf-wrap", children: /* @__PURE__ */ p(
            qo,
            {
              file: T,
              loading: null,
              error: null,
              options: j,
              onLoadSuccess: mt,
              onLoadError: Ve,
              className: "reader-react-pdf-document",
              children: we.map(($) => {
                if (fo.has($))
                  return /* @__PURE__ */ p(
                    Pi,
                    {
                      pane: t,
                      pageNumber: $,
                      width: J,
                      devicePixelRatio: ce,
                      active: ae.has($),
                      syncedMinHeight: (l == null ? void 0 : l.get($)) || 0,
                      onMetrics: d,
                      cachedAspect: oe.get($),
                      onAspectChange: Ee,
                      sentinelRef: ft($),
                      regionHighlight: (Se == null ? void 0 : Se.box.page) === $ ? Se : null,
                      regionTargets: uo.get($),
                      onSelectRegion: b,
                      liveTranslationLayout: g == null ? void 0 : g.layoutByPage.get($ - 1),
                      liveTranslationPage: g == null ? void 0 : g.pagesByPage.get($ - 1),
                      showLiveTranslation: P
                    },
                    `${t}-${$}`
                  );
                const H = oe.get($) ?? Ur, W = Math.max(120, Math.floor(J * H)), se = Math.max(W, Math.ceil((l == null ? void 0 : l.get($)) || 0));
                return /* @__PURE__ */ p(
                  "div",
                  {
                    ref: ft($),
                    "data-reader-page": $,
                    "data-reader-pane": t,
                    "data-natural-height": W,
                    className: pn,
                    style: {
                      width: J,
                      height: se,
                      minHeight: se
                    },
                    children: /* @__PURE__ */ p(
                      "div",
                      {
                        className: "reader-react-pdf-page-placeholder",
                        style: { width: J, height: W },
                        "aria-hidden": !0
                      }
                    )
                  },
                  `${t}-${$}`
                );
              })
            },
            R
          ) }) : null
        ]
      }
    );
  }
), Xn = on(xi), Br = sn(null), Wr = sn(null);
function Ni({ value: e, hud: t, children: n }) {
  return /* @__PURE__ */ p(Br.Provider, { value: e, children: /* @__PURE__ */ p(Wr.Provider, { value: t, children: n }) });
}
function dt() {
  return cn(Br);
}
function ki() {
  return cn(Wr);
}
function Ai({
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
  const s = a && e === "compare";
  return {
    mode: s ? "source" : e,
    compareMode: t && !a,
    showSource: s ? !0 : n,
    showTranslated: s ? !1 : r
  };
}
function Ci(e, t, n = e * 2) {
  return t ? Math.min(e * 2, n) : e;
}
function Li(e) {
  return e ? e.connection === "terminal" && e.jobStatus === "failed" ? e.pagesByPage.size > 0 ? `翻译已暂停，已保留 ${e.pagesByPage.size} 页译文` : "翻译已暂停，原始 PDF 仍可阅读" : e.connection === "terminal" && ["cancelled", "canceled"].includes(e.jobStatus) ? e.pagesByPage.size > 0 ? `翻译已取消，已保留 ${e.pagesByPage.size} 页译文` : "翻译已取消，原始 PDF 仍可阅读" : e.pagesByPage.size > 0 ? "" : e.connection === "unavailable" ? e.error || "实时译文暂不可用，原始 PDF 仍可阅读" : e.error ? e.error : e.layoutByPage.size === 0 ? "正在完成 OCR，译文将在这里逐页出现" : "版面已就绪，正在等待首个译文页面" : "";
}
function zi(e) {
  const t = dt(), {
    mode: n = "compare",
    markdownSplit: r = !1,
    assistantSplit: a = !1,
    liveTranslation: o,
    liveTranslationPair: s = !1
  } = e, i = e.compareMode ?? n === "compare", c = e.showSource ?? !0, l = e.showTranslated ?? (n === "compare" || n === "translated"), d = e.bindShell ?? (t == null ? void 0 : t.bindShell), u = e.shellEl ?? (t == null ? void 0 : t.shellEl) ?? null, f = e.userZoom ?? (t == null ? void 0 : t.userZoom) ?? ut, m = e.shellWidth ?? (t == null ? void 0 : t.shellWidth) ?? 0, y = e.rowHeights ?? (t == null ? void 0 : t.rowHeights), h = e.mountSource ?? (t == null ? void 0 : t.mountSource) ?? !1, v = e.mountTranslated ?? (t == null ? void 0 : t.mountTranslated) ?? !1, b = e.sourceOnly ?? (t == null ? void 0 : t.sourceViewOnly) ?? !1, g = e.sourceUrl ?? (t == null ? void 0 : t.sourceUrl) ?? "", P = e.translatedUrl ?? (t == null ? void 0 : t.translatedUrl) ?? "", w = e.sourceFile ?? (t == null ? void 0 : t.sourceFile) ?? null, I = e.translatedFile ?? (t == null ? void 0 : t.translatedFile) ?? null, L = e.onMetrics ?? (t == null ? void 0 : t.onMetrics), E = e.onNumPagesChange ?? (t == null ? void 0 : t.onNumPagesChange), _ = e.activeRegion ?? (t == null ? void 0 : t.activeRegion), R = e.regions ?? (t == null ? void 0 : t.regions) ?? [], M = e.readerMetadata ?? (t == null ? void 0 : t.readerMetadata), T = e.onSelectRegion ?? (t == null ? void 0 : t.onSelectRegion), S = Ai({
    mode: n,
    compareMode: i,
    showSource: c,
    showTranslated: l,
    markdownSplit: r,
    liveTranslationPair: s
  }), N = Ci(
    m,
    r || a,
    typeof document > "u" ? m * 2 : document.documentElement.clientWidth
  );
  return /* @__PURE__ */ p(
    "div",
    {
      ref: d,
      className: fs,
      "data-reader-scroll-shell": "true",
      "data-reader-region-count": R.length,
      "data-reader-structured-region-count": R.filter(Er).length,
      "data-reader-metadata-ready": M ? "true" : "false",
      children: /* @__PURE__ */ z(
        "main",
        {
          className: `reader-react-grid reader-mode-${S.mode}`,
          "data-reader-mode": r ? "markdown-split" : a ? "assistant-split" : n,
          children: [
            h ? /* @__PURE__ */ p(
              Xn,
              {
                pane: "source",
                url: g,
                preloadedFile: w,
                userZoom: f,
                visible: S.showSource,
                scrollRoot: u,
                pageWidthOverride: N,
                rowHeights: S.compareMode ? y : void 0,
                onMetrics: L,
                emptyLabel: b ? "源文件不可用：该文档没有可读取的源 PDF。" : "暂无原文 PDF",
                onNumPagesChange: E,
                activeRegion: _,
                regions: R,
                readerMetadata: M,
                onSelectRegion: T,
                liveTranslation: s ? void 0 : o,
                showLiveTranslation: !s
              }
            ) : null,
            v || s ? /* @__PURE__ */ p(
              Xn,
              {
                pane: "translated",
                url: s ? g : P,
                preloadedFile: s ? w : I,
                userZoom: f,
                visible: S.showTranslated,
                scrollRoot: u,
                pageWidthOverride: N,
                rowHeights: S.compareMode ? y : void 0,
                onMetrics: L,
                emptyLabel: "暂无译文 PDF",
                onNumPagesChange: E,
                activeRegion: _,
                regions: R,
                readerMetadata: M,
                onSelectRegion: T,
                liveTranslation: s ? o : void 0,
                showLiveTranslation: s,
                liveTranslationPendingLabel: s ? Li(o) : ""
              }
            ) : null
          ]
        }
      )
    }
  );
}
const _i = [
  { id: "source", label: "源文件", Icon: Sr },
  { id: "compare", label: "对照", Icon: Ir },
  { id: "translated", label: "翻译文件", Icon: Pr }
];
function Di(e) {
  return e.connection === "live" ? `实时译文 · ${e.pagesByPage.size} 页` : e.connection === "reconnecting" ? "实时译文 · 重连中" : e.connection === "unavailable" ? "实时译文 · 不可用" : e.connection === "terminal" ? e.jobStatus === "failed" ? "实时译文 · 已暂停" : e.jobStatus === "cancelled" || e.jobStatus === "canceled" ? "实时译文 · 已取消" : e.jobStatus === "succeeded" ? "实时译文 · 已完成" : "实时译文 · 已结束" : e.error || "实时译文 · 连接中";
}
function Fi(e) {
  return e.id === "translated" ? e.sourceOnly : e.id === "compare" ? !e.documentReady || e.sourceOnly && !e.liveTranslationAvailable : !1;
}
function $i(e) {
  const t = dt(), {
    mode: n,
    documentReady: r,
    onModeChange: a,
    liveTranslation: o = null
  } = e, s = e.sourceOnly ?? (t == null ? void 0 : t.sourceViewOnly) ?? !1, i = o ? Di(o.state) : "";
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
          /* @__PURE__ */ p(Lo, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 }),
          /* @__PURE__ */ p("span", { className: "reader-live-translation-toggle-label", children: i })
        ]
      }
    ) : null,
    /* @__PURE__ */ p("div", { className: "reader-workspace-tabs", role: "tablist", "aria-label": "阅读工作区", children: _i.map(({ id: c, label: l, Icon: d }) => {
      const u = n === c, f = Fi({
        id: c,
        documentReady: r,
        sourceOnly: s,
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
const Qn = [
  { id: "markdown", label: "Markdown", Icon: Tr },
  { id: "ai", label: "AI 问答", Icon: dn }
];
function Oi(e) {
  const t = dt(), { active: n } = e, r = e.onSelect ?? (t == null ? void 0 : t.assistant.select) ?? (() => {
  }), a = e.onClose ?? (t == null ? void 0 : t.assistant.close) ?? (() => {
  });
  return n ? /* @__PURE__ */ z("header", { className: "reader-assistant-dock-header", children: [
    /* @__PURE__ */ p("div", { className: "reader-assistant-dock-tabs", role: "tablist", "aria-label": "阅读辅助面板", children: Qn.map(({ id: o, label: s, Icon: i }) => {
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
        children: /* @__PURE__ */ p(Ke, { size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
      }
    )
  ] }) : /* @__PURE__ */ p("nav", { className: "reader-assistant-rail", "aria-label": "阅读辅助工具", children: Qn.map(({ id: o, label: s, Icon: i }) => /* @__PURE__ */ z(
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
function ji(e, t) {
  const n = getComputedStyle(e), r = parseFloat(n.fontSize);
  return t * r;
}
function Ui(e, t) {
  const n = getComputedStyle(e.ownerDocument.documentElement), r = parseFloat(n.fontSize);
  return t * r;
}
function Bi(e) {
  return e / 100 * window.innerHeight;
}
function Wi(e) {
  return e / 100 * window.innerWidth;
}
function Hi(e) {
  switch (typeof e) {
    case "number":
      return [e, "px"];
    case "string": {
      const t = parseFloat(e);
      return e.endsWith("%") ? [t, "%"] : e.endsWith("px") ? [t, "px"] : e.endsWith("rem") ? [t, "rem"] : e.endsWith("em") ? [t, "em"] : e.endsWith("vh") ? [t, "vh"] : e.endsWith("vw") ? [t, "vw"] : [t, "%"];
    }
  }
}
function et({
  groupSize: e,
  panelElement: t,
  styleProp: n
}) {
  let r;
  const [a, o] = Hi(n);
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
      r = Ui(t, a);
      break;
    }
    case "em": {
      r = ji(t, a);
      break;
    }
    case "vh": {
      r = Bi(a);
      break;
    }
    case "vw": {
      r = Wi(a);
      break;
    }
  }
  return r;
}
function de(e) {
  return parseFloat(e.toFixed(3));
}
function qe({
  group: e
}) {
  const { orientation: t, panels: n } = e;
  return n.reduce((r, a) => (r += t === "horizontal" ? a.element.offsetWidth : a.element.offsetHeight, r), 0);
}
function Qt(e) {
  const { panels: t } = e, n = qe({ group: e });
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
      const d = et({
        groupSize: n,
        panelElement: a,
        styleProp: o.collapsedSize
      });
      s = de(d / n * 100);
    }
    let i;
    if (o.defaultSize !== void 0) {
      const d = et({
        groupSize: n,
        panelElement: a,
        styleProp: o.defaultSize
      });
      i = de(d / n * 100);
    }
    let c = 0;
    if (o.minSize !== void 0) {
      const d = et({
        groupSize: n,
        panelElement: a,
        styleProp: o.minSize
      });
      c = de(d / n * 100);
    }
    let l = 100;
    if (o.maxSize !== void 0) {
      const d = et({
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
function Y(e, t = "Assertion error") {
  if (!e)
    throw Error(t);
}
function en(e, t) {
  return Array.from(t).sort(
    e === "horizontal" ? Ji : qi
  );
}
function Ji(e, t) {
  const n = e.element.offsetLeft - t.element.offsetLeft;
  return n !== 0 ? n : e.element.offsetWidth - t.element.offsetWidth;
}
function qi(e, t) {
  const n = e.element.offsetTop - t.element.offsetTop;
  return n !== 0 ? n : e.element.offsetHeight - t.element.offsetHeight;
}
function Hr(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.ELEMENT_NODE;
}
function Jr(e, t) {
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
function Ki({
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
    const { x: i, y: c } = Jr(r, s), l = e === "horizontal" ? i : c;
    l < o && (o = l, a = s);
  }
  return Y(a, "No rect found"), a;
}
let gt;
function Gi() {
  return gt === void 0 && (typeof matchMedia == "function" ? gt = !!matchMedia("(pointer:coarse)").matches : gt = !1), gt;
}
function qr(e) {
  const { element: t, orientation: n, panels: r, separators: a } = e, o = en(
    n,
    Array.from(t.children).filter(Hr).map((y) => ({ element: y }))
  ).map(({ element: y }) => y), s = [];
  let i = !1, c = !1, l = -1, d = -1, u = 0, f, m = [];
  {
    let y = -1;
    for (const h of o)
      h.hasAttribute("data-panel") && (y++, h.hasAttribute("data-disabled") || (u++, l === -1 && (l = y), d = y));
  }
  if (u > 1) {
    let y = -1;
    for (const h of o)
      if (h.hasAttribute("data-panel")) {
        y++;
        const v = r.find(
          (b) => b.element === h
        );
        if (v) {
          if (f) {
            const b = f.element.getBoundingClientRect(), g = h.getBoundingClientRect();
            let P;
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
                  P = [
                    w,
                    I
                  ];
                  break;
                }
                case 1: {
                  const L = m[0], E = Ki({
                    orientation: n,
                    rects: [b, g],
                    targetRect: L.element.getBoundingClientRect()
                  });
                  P = [
                    L,
                    E === b ? I : w
                  ];
                  break;
                }
                default: {
                  P = m;
                  break;
                }
              }
            } else
              m.length ? P = m : P = [
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
            for (const w of P) {
              let I = "width" in w ? w : w.element.getBoundingClientRect();
              const L = Gi() ? e.resizeTargetMinimumSize.coarse : e.resizeTargetMinimumSize.fine;
              if (I.width < L) {
                const _ = L - I.width;
                I = new DOMRect(
                  I.x - _ / 2,
                  I.y,
                  I.width + _,
                  I.height
                );
              }
              if (I.height < L) {
                const _ = L - I.height;
                I = new DOMRect(
                  I.x,
                  I.y - _ / 2,
                  I.width,
                  I.height + _
                );
              }
              const E = y <= l || y > d;
              !i && !E && s.push({
                group: e,
                groupSize: qe({ group: e }),
                panels: [f, v],
                separator: "width" in w ? void 0 : w,
                rect: I
              }), i = !1;
            }
          }
          c = !1, f = v, m = [];
        }
      } else if (h.hasAttribute("data-separator")) {
        h.ariaDisabled !== null && (i = !0);
        const v = a.find(
          (b) => b.element === h
        );
        v ? m.push(v) : (f = void 0, m = []);
      } else
        c = !0;
  }
  return s;
}
var Ne;
class Kr {
  constructor() {
    Cn(this, Ne, {});
  }
  addListener(t, n) {
    const r = Ye(this, Ne)[t];
    return r === void 0 ? Ye(this, Ne)[t] = [n] : r.includes(n) || r.push(n), () => {
      this.removeListener(t, n);
    };
  }
  emit(t, n) {
    const r = Ye(this, Ne)[t];
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
    Ln(this, Ne, {});
  }
  removeListener(t, n) {
    const r = Ye(this, Ne)[t];
    if (r !== void 0) {
      const a = r.indexOf(n);
      a >= 0 && r.splice(a, 1);
    }
  }
}
Ne = new WeakMap();
let He = {
  cursorFlags: 0,
  state: "inactive"
};
const bn = new Kr();
function Le() {
  return He;
}
function Vi(e) {
  return bn.addListener("change", e);
}
function Yi(e) {
  const t = He, n = { ...He };
  n.cursorFlags = e, He = n, bn.emit("change", {
    prev: t,
    next: n
  });
}
function Je(e) {
  const t = He;
  He = e, bn.emit("change", {
    prev: t,
    next: e
  });
}
const Zi = (e) => e, jt = () => {
}, Gr = 1, Vr = 2, Yr = 4, Zr = 8, er = 3, tr = 12;
let bt;
function nr() {
  return bt === void 0 && (bt = !1, typeof window < "u" && (window.navigator.userAgent.includes("Chrome") || window.navigator.userAgent.includes("Firefox")) && (bt = !0)), bt;
}
function Xi({
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
        if (e && nr()) {
          const o = (e & Gr) !== 0, s = (e & Vr) !== 0, i = (e & Yr) !== 0, c = (e & Zr) !== 0;
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
    return nr() ? r > 0 && a > 0 ? "move" : r > 0 ? "ew-resize" : "ns-resize" : r > 0 && a > 0 ? "grab" : r > 0 ? "col-resize" : "row-resize";
  }
}
const rr = /* @__PURE__ */ new WeakMap();
function yn(e) {
  if (e.defaultView === null || e.defaultView === void 0)
    return;
  let { prevStyle: t, styleSheet: n } = rr.get(e) ?? {};
  n === void 0 && (n = new e.defaultView.CSSStyleSheet(), e.adoptedStyleSheets && (Object.isExtensible(e.adoptedStyleSheets) ? e.adoptedStyleSheets.push(n) : e.adoptedStyleSheets = [
    ...e.adoptedStyleSheets,
    n
  ]));
  const r = Le();
  switch (r.state) {
    case "active":
    case "hover": {
      const a = Xi({
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
  rr.set(e, {
    prevStyle: t,
    styleSheet: n
  });
}
let ve = /* @__PURE__ */ new Map();
const Xr = new Kr();
function Qi(e) {
  ve = new Map(ve), ve.delete(e);
}
function or(e, t) {
  for (const [n] of ve)
    if (n.id === e)
      return n;
}
function ke(e, t) {
  for (const [n, r] of ve)
    if (n.id === e)
      return r;
  if (t)
    throw Error(`Could not find data for Group with id ${e}`);
}
function Fe() {
  return ve;
}
function vn(e, t) {
  return Xr.addListener("groupChange", (n) => {
    n.group.id === e && t(n);
  });
}
function Me(e, t, n) {
  const r = ve.get(e);
  ve = new Map(ve), ve.set(e, t), Xr.emit("groupChange", {
    group: e,
    isUserInteraction: (n == null ? void 0 : n.isUserInteraction) === !0,
    prev: r,
    next: t
  });
}
function Qr(e) {
  const t = Le();
  let n = !1;
  switch (t.state) {
    case "active":
      Je({
        cursorFlags: 0,
        state: "inactive"
      }), t.hitRegions.length > 0 && (yn(e), n = !0, t.hitRegions.forEach((r) => {
        const a = ke(r.group.id, !0);
        Me(r.group, a, {
          isUserInteraction: !0
        });
      }));
  }
  return n;
}
function ar(e) {
  e.defaultPrevented || Qr(e.currentTarget);
}
function ec(e, t, n) {
  let r, a = {
    x: 1 / 0,
    y: 1 / 0
  };
  for (const o of t) {
    const s = Jr(n, o.rect);
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
function tc(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
function nc(e, t) {
  if (e === t) throw new Error("Cannot compare node with itself");
  const n = {
    a: cr(e),
    b: cr(t)
  };
  let r;
  for (; n.a.at(-1) === n.b.at(-1); )
    r = n.a.pop(), n.b.pop();
  Y(
    r,
    "Stacking order can only be calculated for elements with a common ancestor"
  );
  const a = {
    a: ir(sr(n.a)),
    b: ir(sr(n.b))
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
const rc = /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;
function oc(e) {
  const t = getComputedStyle(eo(e) ?? e).display;
  return t === "flex" || t === "inline-flex";
}
function ac(e) {
  const t = getComputedStyle(e);
  return !!(t.position === "fixed" || t.zIndex !== "auto" && (t.position !== "static" || oc(e)) || +t.opacity < 1 || "transform" in t && t.transform !== "none" || "webkitTransform" in t && t.webkitTransform !== "none" || "mixBlendMode" in t && t.mixBlendMode !== "normal" || "filter" in t && t.filter !== "none" || "webkitFilter" in t && t.webkitFilter !== "none" || "isolation" in t && t.isolation === "isolate" || rc.test(t.willChange) || t.webkitOverflowScrolling === "touch");
}
function sr(e) {
  let t = e.length;
  for (; t--; ) {
    const n = e[t];
    if (Y(n, "Missing node"), ac(n)) return n;
  }
  return null;
}
function ir(e) {
  return e && Number(getComputedStyle(e).zIndex) || 0;
}
function cr(e) {
  const t = [];
  for (; e; )
    t.push(e), e = eo(e);
  return t;
}
function eo(e) {
  const { parentNode: t } = e;
  return tc(t) ? t.host : t;
}
function sc(e, t) {
  return e.x < t.x + t.width && e.x + e.width > t.x && e.y < t.y + t.height && e.y + e.height > t.y;
}
function ic({
  groupElement: e,
  hitRegion: t,
  pointerEventTarget: n
}) {
  if (!Hr(n) || n.contains(e) || e.contains(n))
    return !0;
  if (nc(n, e) > 0) {
    let r = n;
    for (; r; ) {
      if (r.contains(e))
        return !0;
      if (sc(r.getBoundingClientRect(), t))
        return !1;
      r = r.parentElement;
    }
  }
  return !0;
}
function wn(e, t) {
  const n = [];
  return t.forEach((r, a) => {
    if (a.disabled)
      return;
    const o = qr(a), s = ec(a.orientation, o, {
      x: e.clientX,
      y: e.clientY
    });
    s && s.distance.x <= 0 && s.distance.y <= 0 && ic({
      groupElement: a.element,
      hitRegion: s.hitRegion.rect,
      pointerEventTarget: e.target
    }) && n.push(s.hitRegion);
  }), n;
}
function cc(e, t) {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n++)
    if (e[n] != t[n])
      return !1;
  return !0;
}
function ue(e, t, n = 0) {
  return Math.abs(de(e) - de(t)) <= n;
}
function ye(e, t) {
  return ue(e, t) ? 0 : e > t ? 1 : -1;
}
function Be({
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
  if (ye(r, c) < 0)
    if (o) {
      const l = (a + c) / 2;
      ye(r, l) < 0 ? r = a : r = c;
    } else
      r = c;
  return r = Math.min(i, r), r = de(r), r;
}
function it({
  delta: e,
  initialLayout: t,
  panelConstraints: n,
  pivotIndices: r,
  prevLayout: a,
  trigger: o
}) {
  if (ue(e, 0))
    return t;
  const s = o === "imperative-api", i = Object.values(t), c = Object.values(a), l = [...i], [d, u] = r;
  Y(d != null, "Invalid first pivot index"), Y(u != null, "Invalid second pivot index");
  let f = 0;
  switch (o) {
    case "keyboard": {
      {
        const h = e < 0 ? u : d, v = n[h];
        Y(
          v,
          `Panel constraints not found for index ${h}`
        );
        const {
          collapsedSize: b = 0,
          collapsible: g,
          minSize: P = 0
        } = v;
        if (g) {
          const w = i[h];
          if (Y(
            w != null,
            `Previous layout not found for panel index ${h}`
          ), ue(w, b)) {
            const I = P - w;
            ye(I, Math.abs(e)) > 0 && (e = e < 0 ? 0 - I : I);
          }
        }
      }
      {
        const h = e < 0 ? d : u, v = n[h];
        Y(
          v,
          `No panel constraints found for index ${h}`
        );
        const {
          collapsedSize: b = 0,
          collapsible: g,
          minSize: P = 0
        } = v;
        if (g) {
          const w = i[h];
          if (Y(
            w != null,
            `Previous layout not found for panel index ${h}`
          ), ue(w, P)) {
            const I = w - b;
            ye(I, Math.abs(e)) > 0 && (e = e < 0 ? 0 - I : I);
          }
        }
      }
      break;
    }
    default: {
      const h = e < 0 ? u : d, v = n[h];
      Y(
        v,
        `Panel constraints not found for index ${h}`
      );
      const b = i[h], { collapsible: g, collapsedSize: P, minSize: w } = v;
      if (g && ye(b, w) < 0)
        if (e > 0) {
          const I = w - P, L = I / 2, E = b + e;
          ye(E, w) < 0 && (e = ye(e, L) <= 0 ? 0 : I);
        } else {
          const I = w - P, L = 100 - I / 2, E = b - e;
          ye(E, w) < 0 && (e = ye(100 + e, L) > 0 ? 0 : -I);
        }
      break;
    }
  }
  {
    const h = e < 0 ? 1 : -1;
    let v = e < 0 ? u : d, b = 0;
    for (; ; ) {
      const P = i[v];
      Y(
        P != null,
        `Previous layout not found for panel index ${v}`
      );
      const w = Be({
        overrideDisabledPanels: s,
        panelConstraints: n[v],
        prevSize: P,
        size: 100
      }) - P;
      if (b += w, v += h, v < 0 || v >= n.length)
        break;
    }
    const g = Math.min(Math.abs(e), Math.abs(b));
    e = e < 0 ? 0 - g : g;
  }
  {
    let h = e < 0 ? d : u;
    for (; h >= 0 && h < n.length; ) {
      const v = Math.abs(e) - Math.abs(f), b = i[h];
      Y(
        b != null,
        `Previous layout not found for panel index ${h}`
      );
      const g = b - v, P = Be({
        overrideDisabledPanels: s,
        panelConstraints: n[h],
        prevSize: b,
        size: g
      });
      if (!ue(b, P) && (f += b - P, l[h] = P, f.toFixed(3).localeCompare(Math.abs(e).toFixed(3), void 0, {
        numeric: !0
      }) >= 0))
        break;
      e < 0 ? h-- : h++;
    }
  }
  if (cc(c, l))
    return a;
  {
    const h = e < 0 ? u : d, v = i[h];
    Y(
      v != null,
      `Previous layout not found for panel index ${h}`
    );
    const b = v + f, g = Be({
      overrideDisabledPanels: s,
      panelConstraints: n[h],
      prevSize: v,
      size: b
    });
    if (l[h] = g, !ue(g, b)) {
      let P = b - g, w = e < 0 ? u : d;
      for (; w >= 0 && w < n.length; ) {
        const I = l[w];
        Y(
          I != null,
          `Previous layout not found for panel index ${w}`
        );
        const L = I + P, E = Be({
          overrideDisabledPanels: s,
          panelConstraints: n[w],
          prevSize: I,
          size: L
        });
        if (ue(I, E) || (P -= E - I, l[w] = E), ue(P, 0))
          break;
        e > 0 ? w-- : w++;
      }
    }
  }
  const m = Object.values(l).reduce(
    (h, v) => v + h,
    0
  );
  if (!ue(m, 100, 0.1))
    return a;
  const y = Object.keys(a);
  return l.reduce((h, v, b) => (h[y[b]] = v, h), {});
}
function ze(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (t[n] === void 0 || ye(e[n], t[n]) !== 0)
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
  if (!ue(a, 100) && r.length > 0)
    for (let i = 0; i < t.length; i++) {
      const c = r[i];
      Y(c != null, `No layout data found for index ${i}`);
      const l = 100 / a * c;
      r[i] = l;
    }
  let o = 0;
  for (let i = 0; i < t.length; i++) {
    const c = n[i];
    Y(c != null, `No layout data found for index ${i}`);
    const l = r[i];
    Y(l != null, `No layout data found for index ${i}`);
    const d = Be({
      overrideDisabledPanels: !0,
      panelConstraints: t[i],
      prevSize: c,
      size: l
    });
    l != d && (o += l - d, r[i] = d);
  }
  if (!ue(o, 0))
    for (let i = 0; i < t.length; i++) {
      const c = r[i];
      Y(c != null, `No layout data found for index ${i}`);
      const l = c + o, d = Be({
        overrideDisabledPanels: !0,
        panelConstraints: t[i],
        prevSize: c,
        size: l
      });
      if (c !== d && (o -= d - c, r[i] = d, ue(o, 0)))
        break;
    }
  const s = Object.keys(e);
  return r.reduce((i, c, l) => (i[s[l]] = c, i), {});
}
function to({
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
        separatorToPanels: y
      }
    ] of c)
      if (l.id === e)
        return {
          defaultLayoutDeferred: d,
          derivedPanelConstraints: u,
          group: l,
          groupSize: m,
          layout: f,
          separatorToPanels: y
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
    const f = o(), m = l.findIndex((v) => v.id === t), y = m === 0, h = m === l.length - 1;
    if (h && c < f && (y || l.slice(0, m).every((v, b) => {
      const g = u[b];
      return (g == null ? void 0 : g.collapsible) && ue(g.collapsedSize, d[g.panelId]);
    }))) {
      const v = l.slice(0, m).reduce((b, g) => b + d[g.id], 0);
      return {
        ...d,
        [t]: de(100 - v)
      };
    }
    return it({
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
      layout: y,
      separatorToPanels: h
    } = n(), v = s({
      nextSize: c,
      panels: f.panels,
      prevLayout: y,
      derivedPanelConstraints: u
    }), b = _e({
      layout: v,
      panelConstraints: u
    });
    ze(y, b) || Me(f, {
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
      return c && ue(l, d);
    },
    resize: (c) => {
      const { group: l } = n(), { element: d } = a(), u = qe({ group: l }), f = et({
        groupSize: u,
        panelElement: d,
        styleProp: c
      }), m = de(f / u * 100);
      i(m);
    }
  };
}
function lr(e) {
  if (e.defaultPrevented)
    return;
  const t = Fe();
  wn(e, t).forEach((n) => {
    if (n.separator && !n.separator.disableDoubleClick) {
      const r = n.panels.find(
        (a) => a.panelConstraints.defaultSize !== void 0
      );
      if (r) {
        const a = r.panelConstraints.defaultSize, o = to({
          groupId: n.group.id,
          panelId: r.id
        });
        o && a !== void 0 && (o.resize(a), e.preventDefault());
      }
    }
  });
}
function St(e) {
  const t = Fe();
  for (const [n] of t)
    if (n.separators.some(
      (r) => r.element === e
    ))
      return n;
  throw Error("Could not find parent Group for separator element");
}
function no({
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
function Ae(e, t) {
  const n = St(e), r = ke(n.id, !0), a = n.separators.find(
    (d) => d.element === e
  );
  Y(a, "Matching separator not found");
  const o = r.separatorToPanels.get(a);
  Y(o, "Matching panels not found");
  const s = o.map((d) => n.panels.indexOf(d)), i = no({ groupId: n.id }).getLayout(), c = it({
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
function ur(e) {
  if (e.defaultPrevented)
    return;
  const t = e.currentTarget, n = St(t);
  if (!n.disabled)
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault(), n.orientation === "vertical" && Ae(t, 5);
        break;
      }
      case "ArrowLeft": {
        e.preventDefault(), n.orientation === "horizontal" && Ae(t, -5);
        break;
      }
      case "ArrowRight": {
        e.preventDefault(), n.orientation === "horizontal" && Ae(t, 5);
        break;
      }
      case "ArrowUp": {
        e.preventDefault(), n.orientation === "vertical" && Ae(t, -5);
        break;
      }
      case "End": {
        e.preventDefault(), Ae(t, 100);
        break;
      }
      case "Enter": {
        e.preventDefault();
        const r = St(t), a = ke(r.id, !0), { derivedPanelConstraints: o, layout: s, separatorToPanels: i } = a, c = r.separators.find(
          (f) => f.element === t
        );
        Y(c, "Matching separator not found");
        const l = i.get(c);
        Y(l, "Matching panels not found");
        const d = l[0], u = o.find(
          (f) => f.panelId === d.id
        );
        if (Y(u, "Panel metadata not found"), u.collapsible) {
          const f = s[d.id], m = u.collapsedSize === f ? r.mutableState.expandedPanelSizes[d.id] ?? u.minSize : u.collapsedSize;
          Ae(t, m - f);
        }
        break;
      }
      case "F6": {
        e.preventDefault();
        const r = St(t).separators.map(
          (s) => s.element
        ), a = Array.from(r).findIndex(
          (s) => s === e.currentTarget
        );
        Y(a !== null, "Index not found");
        const o = e.shiftKey ? a > 0 ? a - 1 : r.length - 1 : a + 1 < r.length ? a + 1 : 0;
        r[o].focus({
          preventScroll: !0
        });
        break;
      }
      case "Home": {
        e.preventDefault(), Ae(t, -100);
        break;
      }
    }
}
function dr(e) {
  if (e.defaultPrevented || e.pointerType === "mouse" && e.button > 0)
    return;
  const t = Fe(), n = wn(e, t), r = /* @__PURE__ */ new Map();
  let a = !1;
  n.forEach((o) => {
    o.separator && (a || (a = !0, o.separator.element.focus({
      // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#browser_compatibility
      focusVisible: !1,
      preventScroll: !0
    })));
    const s = t.get(o.group);
    s && r.set(o.group, s.layout);
  }), Je({
    cursorFlags: 0,
    hitRegions: n,
    initialLayoutMap: r,
    pointerDownAtPoint: { x: e.clientX, y: e.clientY },
    state: "active"
  }), n.length && e.preventDefault();
}
function ro({
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
    const { group: d, groupSize: u } = l, { orientation: f, panels: m } = d, { disableCursor: y } = d.mutableState;
    let h = 0;
    o ? f === "horizontal" ? h = (t.clientX - o.x) / u * 100 : h = (t.clientY - o.y) / u * 100 : f === "horizontal" ? h = t.clientX < 0 ? -100 : 100 : h = t.clientY < 0 ? -100 : 100;
    const v = r.get(d), b = a.get(d);
    if (!v || !b)
      return;
    const {
      defaultLayoutDeferred: g,
      derivedPanelConstraints: P,
      groupSize: w,
      layout: I,
      separatorToPanels: L
    } = b;
    if (P && I && L) {
      const E = it({
        delta: h,
        initialLayout: v,
        panelConstraints: P,
        pivotIndices: l.panels.map((_) => m.indexOf(_)),
        prevLayout: I,
        trigger: "mouse-or-touch"
      });
      if (ze(E, I)) {
        if (h !== 0 && !y)
          switch (f) {
            case "horizontal": {
              i |= h < 0 ? Gr : Vr;
              break;
            }
            case "vertical": {
              i |= h < 0 ? Yr : Zr;
              break;
            }
          }
      } else
        Me(l.group, {
          defaultLayoutDeferred: g,
          derivedPanelConstraints: P,
          groupSize: w,
          layout: E,
          separatorToPanels: L
        });
    }
  });
  let c = 0;
  t.movementX === 0 ? c |= s & er : c |= i & er, t.movementY === 0 ? c |= s & tr : c |= i & tr, Yi(c), yn(e);
}
function fr(e) {
  const t = Fe(), n = Le();
  switch (n.state) {
    case "active":
      ro({
        document: e.currentTarget,
        event: e,
        hitRegions: n.hitRegions,
        initialLayoutMap: n.initialLayoutMap,
        mountedGroups: t,
        prevCursorFlags: n.cursorFlags
      });
  }
}
function mr(e) {
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
        Je({
          cursorFlags: 0,
          state: "inactive"
        }), t.hitRegions.forEach((o) => {
          const s = ke(o.group.id, !0);
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
      ro({
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
      const o = wn(e, n);
      o.length === 0 ? t.state !== "inactive" && Je({
        cursorFlags: 0,
        state: "inactive"
      }) : Je({
        cursorFlags: 0,
        hitRegions: o,
        state: "hover"
      }), yn(e.currentTarget);
      break;
    }
  }
}
function pr(e) {
  if (e.relatedTarget instanceof HTMLIFrameElement)
    switch (Le().state) {
      case "hover":
        Je({
          cursorFlags: 0,
          state: "inactive"
        });
    }
}
function hr(e) {
  e.defaultPrevented || e.pointerType === "mouse" && e.button > 0 || Qr(e.currentTarget) && e.preventDefault();
}
function gr(e) {
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
function lc(e, t, n) {
  if (!n[0])
    return;
  const r = e.panels.find((c) => c.element === t);
  if (!r || !r.onResize)
    return;
  const a = qe({ group: e }), o = e.orientation === "horizontal" ? r.element.offsetWidth : r.element.offsetHeight, s = r.mutableValues.prevSize, i = {
    asPercentage: de(o / a * 100),
    inPixels: o
  };
  r.mutableValues.prevSize = i, r.onResize(i, r.id, s);
}
function uc(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (e[n] !== t[n])
      return !1;
  return !0;
}
function dc({
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
        const m = f / 100 * n, y = de(
          m / t * 100
        );
        i.set(u.id, y), a += y;
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
function fc(e, t) {
  const n = e.map((a) => a.id), r = Object.keys(t);
  if (n.length !== r.length)
    return !1;
  for (const a of n)
    if (!r.includes(a))
      return !1;
  return !0;
}
const Oe = /* @__PURE__ */ new Map();
function mc(e) {
  let t = !0;
  Y(
    e.element.ownerDocument.defaultView,
    "Cannot register an unmounted Group"
  );
  const n = e.element.ownerDocument.defaultView.ResizeObserver, r = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), o = new n((y) => {
    for (const h of y) {
      const { borderBoxSize: v, target: b } = h;
      if (b === e.element) {
        if (t) {
          const g = qe({ group: e });
          if (g === 0)
            return;
          const P = ke(e.id);
          if (!P)
            return;
          const w = Qt(e), I = P.defaultLayoutDeferred ? gr(w) : P.layout, L = dc({
            group: e,
            nextGroupSize: g,
            prevGroupSize: P.groupSize,
            prevLayout: I
          }), E = _e({
            layout: L,
            panelConstraints: w
          });
          if (!P.defaultLayoutDeferred && ze(P.layout, E) && uc(
            P.derivedPanelConstraints,
            w
          ) && P.groupSize === g)
            return;
          Me(e, {
            defaultLayoutDeferred: !1,
            derivedPanelConstraints: w,
            groupSize: g,
            layout: E,
            separatorToPanels: P.separatorToPanels
          });
        }
      } else
        lc(e, b, v);
    }
  });
  o.observe(e.element), e.panels.forEach((y) => {
    Y(
      !r.has(y.id),
      `Panel ids must be unique; id "${y.id}" was used more than once`
    ), r.add(y.id), y.onResize && o.observe(y.element);
  });
  const s = qe({ group: e }), i = Qt(e), c = e.panels.map(({ id: y }) => y).join(",");
  let l = e.mutableState.defaultLayout;
  l && (fc(e.panels, l) || (l = void 0));
  const d = e.mutableState.layouts[c] ?? l ?? gr(i), u = _e({
    layout: d,
    panelConstraints: i
  }), f = e.element.ownerDocument;
  Oe.set(
    f,
    (Oe.get(f) ?? 0) + 1
  );
  const m = /* @__PURE__ */ new Map();
  return qr(e).forEach((y) => {
    y.separator && m.set(y.separator, y.panels);
  }), Me(e, {
    defaultLayoutDeferred: s === 0,
    derivedPanelConstraints: i,
    groupSize: s,
    layout: u,
    separatorToPanels: m
  }), e.separators.forEach((y) => {
    Y(
      !a.has(y.id),
      `Separator ids must be unique; id "${y.id}" was used more than once`
    ), a.add(y.id), y.element.addEventListener("keydown", ur);
  }), Oe.get(f) === 1 && (f.addEventListener("contextmenu", ar, !0), f.addEventListener("dblclick", lr, !0), f.addEventListener("pointerdown", dr, !0), f.addEventListener("pointerleave", fr), f.addEventListener("pointermove", mr), f.addEventListener("pointerout", pr), f.addEventListener("pointerup", hr, !0)), function() {
    t = !1, Oe.set(
      f,
      Math.max(0, (Oe.get(f) ?? 0) - 1)
    ), Qi(e), e.separators.forEach((y) => {
      y.element.removeEventListener("keydown", ur);
    }), Oe.get(f) || (f.removeEventListener(
      "contextmenu",
      ar,
      !0
    ), f.removeEventListener(
      "dblclick",
      lr,
      !0
    ), f.removeEventListener(
      "pointerdown",
      dr,
      !0
    ), f.removeEventListener("pointerleave", fr), f.removeEventListener("pointermove", mr), f.removeEventListener("pointerout", pr), f.removeEventListener("pointerup", hr, !0)), o.disconnect();
  };
}
function pc() {
  const [e, t] = C({}), n = x(() => t({}), []);
  return [e, n];
}
function Sn(e) {
  const t = ln();
  return `${e ?? t}`;
}
const $e = typeof window < "u" ? De : O;
function nt(e) {
  const t = A(e);
  return $e(() => {
    t.current = e;
  }, [e]), x(
    (...n) => {
      var r;
      return (r = t.current) == null ? void 0 : r.call(t, ...n);
    },
    [t]
  );
}
function In(...e) {
  return nt((t) => {
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
function Pn(e) {
  const t = A({ ...e });
  return $e(() => {
    for (const n in e)
      t.current[n] = e[n];
  }, [e]), t.current;
}
const oo = sn(null);
function hc(e, t) {
  const n = A({
    getLayout: () => ({}),
    setLayout: Zi
  });
  an(t, () => n.current, []), $e(() => {
    Object.assign(
      n.current,
      no({ groupId: e })
    );
  });
}
function ao({
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
  const y = A({
    onLayoutChange: {},
    onLayoutChanged: {}
  }), h = nt((T) => {
    ze(y.current.onLayoutChange, T) || (y.current.onLayoutChange = T, c == null || c(T));
  }), v = nt(
    (T, S) => {
      ze(y.current.onLayoutChanged, T) || (y.current.onLayoutChanged = T, l == null || l(T, { isUserInteraction: S }));
    }
  ), b = Sn(i), g = A(null), [P, w] = pc(), I = A({
    lastExpandedPanelSizes: {},
    layouts: {},
    panels: [],
    resizeTargetMinimumSize: u,
    separators: []
  }), L = In(g, o);
  hc(b, s);
  const E = nt(
    (T, S) => {
      const N = Le(), D = or(T), k = ke(T);
      if (k) {
        let F = !1;
        switch (N.state) {
          case "active": {
            F = N.hitRegions.some(
              (B) => B.group === D
            );
            break;
          }
        }
        return {
          flexGrow: k.layout[S] ?? 1,
          pointerEvents: F ? "none" : void 0
        };
      }
      if (n != null && n[S])
        return {
          flexGrow: n == null ? void 0 : n[S]
        };
    }
  ), _ = Pn({
    defaultLayout: n,
    disableCursor: r
  }), R = K(
    () => ({
      get disableCursor() {
        return !!_.disableCursor;
      },
      getPanelStyles: E,
      id: b,
      orientation: d,
      registerPanel: (T) => {
        const S = I.current;
        return S.panels = en(d, [
          ...S.panels,
          T
        ]), w(), () => {
          S.panels = S.panels.filter(
            (N) => N !== T
          ), w();
        };
      },
      registerSeparator: (T) => {
        const S = I.current;
        return S.separators = en(d, [
          ...S.separators,
          T
        ]), w(), () => {
          S.separators = S.separators.filter(
            (N) => N !== T
          ), w();
        };
      },
      updatePanelProps: (T, { disabled: S }) => {
        const N = I.current.panels.find(
          (F) => F.id === T
        );
        N && (N.panelConstraints.disabled = S);
        const D = or(b), k = ke(b);
        D && k && Me(D, {
          ...k,
          derivedPanelConstraints: Qt(D)
        });
      },
      updateSeparatorProps: (T, {
        disabled: S,
        disableDoubleClick: N
      }) => {
        const D = I.current.separators.find(
          (k) => k.id === T
        );
        D && (D.disabled = S, D.disableDoubleClick = N);
      }
    }),
    [E, b, w, d, _]
  ), M = A(null);
  return $e(() => {
    const T = g.current;
    if (T === null)
      return;
    const S = I.current;
    let N;
    if (_.defaultLayout !== void 0 && Object.keys(_.defaultLayout).length === S.panels.length) {
      N = {};
      for (const X of S.panels) {
        const re = _.defaultLayout[X.id];
        re !== void 0 && (N[X.id] = re);
      }
    }
    const D = {
      disabled: !!a,
      element: T,
      id: b,
      mutableState: {
        defaultLayout: N,
        disableCursor: !!_.disableCursor,
        expandedPanelSizes: I.current.lastExpandedPanelSizes,
        layouts: I.current.layouts
      },
      orientation: d,
      panels: S.panels,
      resizeTargetMinimumSize: S.resizeTargetMinimumSize,
      separators: S.separators
    };
    M.current = D;
    const k = mc(D), { defaultLayoutDeferred: F, derivedPanelConstraints: B, layout: Z } = ke(D.id, !0);
    !F && B.length > 0 && (h(Z), v(Z, !1));
    const Q = vn(b, (X) => {
      const { defaultLayoutDeferred: re, derivedPanelConstraints: ce, layout: j } = X.next;
      if (re || ce.length === 0)
        return;
      const J = D.panels.map(({ id: ne }) => ne).join(",");
      D.mutableState.layouts[J] = j, ce.forEach((ne) => {
        if (ne.collapsible) {
          const { layout: le } = X.prev ?? {};
          if (le) {
            const U = ue(
              ne.collapsedSize,
              j[ne.panelId]
            ), ae = ue(
              ne.collapsedSize,
              le[ne.panelId]
            );
            U && !ae && (D.mutableState.expandedPanelSizes[ne.panelId] = le[ne.panelId]);
          }
        }
      });
      const oe = Le().state !== "active";
      h(j), oe && v(j, X.isUserInteraction);
    });
    return () => {
      M.current = null, k(), Q();
    };
  }, [
    a,
    b,
    v,
    h,
    d,
    P,
    _
  ]), O(() => {
    const T = M.current;
    T && (T.mutableState.defaultLayout = n, T.mutableState.disableCursor = !!r);
  }), /* @__PURE__ */ p(oo.Provider, { value: R, children: /* @__PURE__ */ p(
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
ao.displayName = "Group";
function Tn() {
  const e = cn(oo);
  return Y(
    e,
    "Group Context not found; did you render a Panel or Separator outside of a Group?"
  ), e;
}
function gc(e, t) {
  const { id: n } = Tn(), r = A({
    collapse: jt,
    expand: jt,
    getSize: () => ({
      asPercentage: 0,
      inPixels: 0
    }),
    isCollapsed: () => !1,
    resize: jt
  });
  an(t, () => r.current, []), $e(() => {
    Object.assign(
      r.current,
      to({ groupId: n, panelId: e })
    );
  });
}
function tn({
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
  ...y
}) {
  const h = !!c, v = Sn(c), b = Pn({
    disabled: o
  }), g = A(null), P = In(g, s), {
    getPanelStyles: w,
    id: I,
    orientation: L,
    registerPanel: E,
    updatePanelProps: _
  } = Tn(), R = u !== null, M = nt(
    (D, k, F) => {
      u == null || u(D, c, F);
    }
  );
  $e(() => {
    const D = g.current;
    if (D !== null) {
      const k = {
        element: D,
        id: v,
        idIsStable: h,
        mutableValues: {
          expandToSize: void 0,
          prevSize: void 0
        },
        onResize: R ? M : void 0,
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
      return E(k);
    }
  }, [
    i,
    n,
    r,
    a,
    R,
    v,
    h,
    l,
    d,
    M,
    E,
    b
  ]), O(() => {
    _(v, { disabled: o });
  }, [o, v, _]), gc(v, f);
  const T = () => {
    const D = w(I, v);
    if (D)
      return JSON.stringify(D);
  }, S = go(
    (D) => vn(I, D),
    T,
    T
  );
  let N;
  return S ? N = JSON.parse(S) : a !== void 0 ? N = {
    flexGrow: void 0,
    flexShrink: void 0,
    flexBasis: a
  } : N = { flexGrow: 1 }, /* @__PURE__ */ p(
    "div",
    {
      ...y,
      "data-disabled": o || void 0,
      "data-panel": !0,
      "data-testid": v,
      id: v,
      ref: P,
      style: {
        ...bc,
        display: "flex",
        flexBasis: 0,
        flexShrink: 1,
        overflow: "visible",
        ...N
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
tn.displayName = "Panel";
const bc = {
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
function yc({
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
      layout: it({
        delta: l - s,
        initialLayout: e,
        panelConstraints: t,
        pivotIndices: d,
        prevLayout: e
      }),
      panelConstraints: t
    })[n], a = _e({
      layout: it({
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
function so({
  children: e,
  className: t,
  disabled: n,
  disableDoubleClick: r,
  elementRef: a,
  id: o,
  style: s,
  ...i
}) {
  const c = Sn(o), l = Pn({
    disabled: n,
    disableDoubleClick: r
  }), [d, u] = C({}), [f, m] = C("inactive"), [y, h] = C(!1), v = A(null), b = In(v, a), {
    disableCursor: g,
    id: P,
    orientation: w,
    registerSeparator: I,
    updateSeparatorProps: L
  } = Tn(), E = w === "horizontal" ? "vertical" : "horizontal";
  $e(() => {
    const M = v.current;
    if (M !== null) {
      const T = {
        disabled: l.disabled,
        disableDoubleClick: l.disableDoubleClick,
        element: M,
        id: c
      }, S = I(T), N = Vi(
        (k) => {
          m(
            k.next.state !== "inactive" && k.next.hitRegions.some(
              (F) => F.separator === T
            ) ? k.next.state : "inactive"
          );
        }
      ), D = vn(
        P,
        (k) => {
          const { derivedPanelConstraints: F, layout: B, separatorToPanels: Z } = k.next, Q = Z.get(T);
          if (Q) {
            const X = Q[0], re = Q.indexOf(X);
            u(
              yc({
                layout: B,
                panelConstraints: F,
                panelId: X.id,
                panelIndex: re
              })
            );
          }
        }
      );
      return () => {
        N(), D(), S();
      };
    }
  }, [P, c, I, l]), O(() => {
    L(c, { disabled: n, disableDoubleClick: r });
  }, [n, r, c, L]);
  let _;
  n && !g && (_ = "not-allowed");
  let R;
  if (n)
    R = "disabled";
  else
    switch (f) {
      case "active": {
        R = "active";
        break;
      }
      default:
        y ? R = "focus" : R = f;
    }
  return /* @__PURE__ */ p(
    "div",
    {
      ...i,
      "aria-controls": d.valueControls,
      "aria-disabled": n || void 0,
      "aria-orientation": E,
      "aria-valuemax": d.valueMax,
      "aria-valuemin": d.valueMin,
      "aria-valuenow": d.valueNow,
      children: e,
      className: t,
      "data-separator": R,
      "data-testid": c,
      id: c,
      onBlur: () => h(!1),
      onFocus: () => h(!0),
      ref: b,
      role: "separator",
      style: {
        flexBasis: "auto",
        cursor: _,
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
so.displayName = "Separator";
const Rn = 30, Mn = 65, ct = 50, vc = 100 - Mn, wc = 100 - Rn;
function Sc(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(Mn, Math.max(Rn, t)) : ct;
}
function En(e) {
  return 100 - e;
}
function je(e) {
  return `${e}%`;
}
const xn = "reader-document", lt = "reader-assistant", io = "retainpdf.reader.ai-split-layout.v1", Ic = {
  [xn]: En(ct),
  [lt]: ct
};
function Nn(e) {
  const t = Sc(e == null ? void 0 : e[lt]);
  return {
    [xn]: En(t),
    [lt]: t
  };
}
function Pc() {
  try {
    const e = JSON.parse(localStorage.getItem(io) || "null");
    return Nn(e);
  } catch {
    return Ic;
  }
}
function Tc(e) {
  try {
    localStorage.setItem(io, JSON.stringify(Nn(e)));
  } catch {
  }
}
function Ut(e, t) {
  const n = e == null ? void 0 : e.closest(".reader-react-root");
  if (!n) return;
  const r = Nn(t);
  n.style.setProperty(
    "--reader-ai-split-width",
    `${r[lt]}vw`
  );
}
function Rc() {
  const e = A(null), [t] = C(Pc);
  De(() => {
    const a = e.current;
    return Ut(a, t), () => {
      var o;
      (o = a == null ? void 0 : a.closest(".reader-react-root")) == null || o.style.removeProperty("--reader-ai-split-width");
    };
  }, [t]);
  const n = x((a) => {
    Ut(e.current, a);
  }, []), r = x((a, o) => {
    Ut(e.current, a), o.isUserInteraction && Tc(a);
  }, []);
  return /* @__PURE__ */ z(
    ao,
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
          tn,
          {
            id: xn,
            defaultSize: je(En(ct)),
            minSize: je(vc),
            maxSize: je(wc)
          }
        ),
        /* @__PURE__ */ p(
          so,
          {
            id: "reader-ai-split-separator",
            className: "reader-ai-split-separator",
            "aria-label": "调整文档与 AI 问答宽度",
            children: /* @__PURE__ */ p("span", { "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ p(
          tn,
          {
            id: lt,
            defaultSize: je(ct),
            minSize: je(Rn),
            maxSize: je(Mn)
          }
        )
      ]
    }
  );
}
const xe = 12, Mc = 4;
function We(e, t, n) {
  if (typeof window > "u") return { x: e, y: t };
  const r = Math.min(n, window.innerWidth - xe * 2), a = Math.max(xe, window.innerWidth - r - xe), o = Math.min(window.innerHeight * 0.9, 860), s = Math.max(xe, window.innerHeight - o - xe);
  return {
    x: Math.min(a, Math.max(xe, e)),
    y: Math.min(s, Math.max(xe, t))
  };
}
function br(e) {
  if (typeof window > "u") return { x: 24, y: 72 };
  const t = Math.min(e, window.innerWidth - xe * 2);
  return We(window.innerWidth - t - 20, 72, e);
}
function Ec(e, t) {
  try {
    const n = localStorage.getItem(e);
    if (!n) return br(t);
    const r = JSON.parse(n);
    if (typeof r.x == "number" && typeof r.y == "number")
      return We(r.x, r.y, t);
  } catch {
  }
  return br(t);
}
function xc(e, t) {
  try {
    localStorage.setItem(e, JSON.stringify(t));
  } catch {
  }
}
function Nc({
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
  const y = l === "workspace", h = l === "dock-right", v = h || y, [b, g] = C(() => Ec(o, c)), [P, w] = C(!1), I = A(null);
  O(() => {
    !t || v || g((R) => We(R.x, R.y, c));
  }, [v, t, c]), O(() => {
    if (!t || v) return;
    const R = () => g((M) => We(M.x, M.y, c));
    return window.addEventListener("resize", R), () => window.removeEventListener("resize", R);
  }, [v, t, c]), O(() => {
    if (!t) return;
    const R = (M) => {
      var S;
      if (M.key !== "Escape") return;
      const T = M.target;
      (S = T == null ? void 0 : T.closest) != null && S.call(T, "textarea, input, select, [contenteditable='true']") || (M.preventDefault(), u());
    };
    return window.addEventListener("keydown", R), () => window.removeEventListener("keydown", R);
  }, [t, u]);
  const L = x((R) => {
    var M, T;
    v || R.button === 0 && ((T = (M = R.target) == null ? void 0 : M.closest) != null && T.call(M, "button") || (R.currentTarget.setPointerCapture(R.pointerId), I.current = {
      pointerId: R.pointerId,
      startX: R.clientX,
      startY: R.clientY,
      originX: b.x,
      originY: b.y,
      moved: !1
    }, w(!0)));
  }, [v, b.x, b.y]), E = x((R) => {
    const M = I.current;
    if (!M || M.pointerId !== R.pointerId) return;
    const T = R.clientX - M.startX, S = R.clientY - M.startY;
    !M.moved && Math.hypot(T, S) < Mc || (M.moved = !0, g(We(M.originX + T, M.originY + S, c)));
  }, [c]), _ = x((R) => {
    const M = I.current;
    if (!(!M || M.pointerId !== R.pointerId)) {
      I.current = null, w(!1);
      try {
        R.currentTarget.releasePointerCapture(R.pointerId);
      } catch {
      }
      M.moved && g((T) => {
        const S = We(T.x, T.y, c);
        return xc(o, S), S;
      });
    }
  }, [o, c]);
  return t ? /* @__PURE__ */ z(
    "aside",
    {
      id: e,
      className: `reader-notes-panel reader-notes-panel--${y ? "workspace" : h ? "docked" : "float"}${v ? "" : " reader-floating-surface"}${d ? " has-panel-header" : " is-headerless"}${f ? " has-panel-toolbar" : ""}${P ? " is-dragging" : ""} ${i}`.trim(),
      style: v ? void 0 : { left: b.x, top: b.y, width: Math.min(c, typeof window < "u" ? window.innerWidth - 24 : c) },
      "aria-label": s,
      role: "dialog",
      "aria-modal": "false",
      children: [
        d ? /* @__PURE__ */ z(
          "header",
          {
            className: "reader-notes-panel-head",
            onPointerDown: L,
            onPointerMove: E,
            onPointerUp: _,
            onPointerCancel: _,
            children: [
              v ? null : /* @__PURE__ */ p("div", { className: "reader-notes-panel-drag", "aria-hidden": "true", children: /* @__PURE__ */ p(zo, { size: 14, strokeWidth: 2.25 }) }),
              /* @__PURE__ */ z("div", { className: "reader-notes-panel-head-text", children: [
                /* @__PURE__ */ z("strong", { children: [
                  a,
                  n
                ] }),
                r ? /* @__PURE__ */ p("span", { children: r }) : null
              ] }),
              /* @__PURE__ */ p("button", { type: "button", className: "reader-notes-close reader-floating-close", "aria-label": `关闭${n}`, onClick: u, children: /* @__PURE__ */ p(Ke, { size: 14, strokeWidth: 2.5, "aria-hidden": !0 }) })
            ]
          }
        ) : null,
        f ? /* @__PURE__ */ p("div", { className: "reader-notes-panel-toolbar", children: f }) : null,
        /* @__PURE__ */ p("div", { className: "reader-notes-panel-body", children: m })
      ]
    }
  ) : null;
}
function kc({
  note: e,
  onJump: t,
  onUpdateNote: n,
  onRemove: r
}) {
  const [a, o] = C(!1), [s, i] = C(e.note);
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
function Ac({
  open: e,
  groups: t,
  count: n,
  onClose: r,
  onJump: a,
  onUpdateNote: o,
  onRemove: s,
  onExport: i
}) {
  const [c, l] = C(!1);
  return /* @__PURE__ */ p(
    Nc,
    {
      id: "reader-notes-panel",
      open: e,
      title: "批注",
      subtitle: "选中 PDF 文字后可添加 · 本地保存",
      titleIcon: /* @__PURE__ */ p(kt, { size: 14, strokeWidth: 2.25, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.notes-float.pos.v1",
      ariaLabel: "批注",
      onClose: r,
      toolbar: /* @__PURE__ */ z(rn, { children: [
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
          kc,
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
function Cc({
  regionsFailed: e = !1,
  metadataFailed: t = !1
}) {
  const [n, r] = C(!1);
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
function Lc({
  loading: e,
  failed: t,
  text: n,
  percent: r,
  regionsError: a = !1,
  metadataError: o = !1
}) {
  return !e && !t ? /* @__PURE__ */ p(Cc, { regionsFailed: a, metadataFailed: o }) : /* @__PURE__ */ z(rn, { children: [
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
async function zc(e) {
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
function _c({
  selection: e,
  onDismiss: t,
  onAskAi: n,
  onAddNote: r
}) {
  const [a, o] = C(!1), s = e ? e.selectionType === "text" ? `${e.pane}:${e.page}:${e.quote}` : `${e.region.itemId}:${e.pane}` : "";
  if (O(() => o(!1), [s]), !e)
    return null;
  const i = typeof window < "u" ? window.innerWidth : 800, c = typeof window < "u" ? window.innerHeight : 600, l = e.rect.left + e.rect.width / 2, d = 170, u = Math.min(Math.max(16 + d, l), i - 16 - d), f = e.rect.top > 72, m = f ? Math.max(12, e.rect.top - 8) : Math.min(c - 12, e.rect.top + e.rect.height + 8), y = f ? "above" : "below", h = e.pane === "translated" ? "译文" : "原文", v = e.selectionType === "text" ? "text" : e.kind, b = e.selectionType === "text" ? e.quote : xr(e.region, e.pane), g = v === "formula" ? "公式" : v === "table" ? "表格" : v === "figure" ? "图片" : v === "text" ? "文字" : "区域", P = v === "formula" ? Pa(b) : b, w = v === "formula" ? _o : v === "table" ? Do : v === "text" ? Fo : $o;
  return /* @__PURE__ */ z(
    "div",
    {
      className: `reader-sel-pop reader-sel-pop--${y} reader-sel-pop--region`,
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
            P ? /* @__PURE__ */ z(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--primary",
                onClick: async () => {
                  try {
                    await zc(P), o(!0), window.setTimeout(() => o(!1), 1400);
                  } catch (I) {
                    console.warn("[reader-selection] copy failed", I);
                  }
                },
                children: [
                  a ? /* @__PURE__ */ p(Oo, { size: 15, strokeWidth: 2.4, "aria-hidden": !0 }) : /* @__PURE__ */ p(jo, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
                  /* @__PURE__ */ p("span", { children: a ? "已复制" : v === "formula" ? "复制 LaTeX" : "复制" })
                ]
              }
            ) : /* @__PURE__ */ p("span", { className: "reader-sel-pop-selection-hint", children: "已选择图片" }),
            r && P ? /* @__PURE__ */ z(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--secondary",
                onClick: () => r({ page: e.page, pane: e.pane, quote: P }),
                children: [
                  /* @__PURE__ */ p(kt, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
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
                  /* @__PURE__ */ p(dn, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
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
                children: /* @__PURE__ */ p(Ke, { size: 15, strokeWidth: 2.5, "aria-hidden": !0 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ p("span", { className: "reader-sel-pop-caret", "aria-hidden": "true" })
      ]
    }
  );
}
function Dc(e) {
  if (!(e instanceof HTMLElement)) return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function Fc() {
  const [e, t] = C(!1), n = ln(), r = A(null);
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
      if (o.defaultPrevented || o.metaKey || o.ctrlKey || o.altKey || Dc(o.target)) return;
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
        children: /* @__PURE__ */ p(Uo, { className: "reader-react-shortcuts-icon", size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
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
          /* @__PURE__ */ p("div", { className: "reader-react-shortcuts-body", children: Gs.map((a) => /* @__PURE__ */ z("section", { className: "reader-react-shortcuts-group", children: [
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
const $c = Object.freeze([
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
]), Oc = ["source", "sideBySide", "translated"], jc = { source: "", translated: "", sideBySide: "" };
function Uc(e) {
  if (e.sourceOnly || !e.jobId) {
    const t = ot(e.sourceUrl), n = ot(e.translatedUrl);
    return {
      source: t,
      translated: n,
      // sideBySide requires dedicated artifact; no fallback to source url
      sideBySide: ""
    };
  }
  return ia({
    jobId: e.jobId,
    jobPayload: e.jobPayload,
    manifestPayload: e.manifestPayload
  });
}
function Bc(e) {
  const [t, n] = C(() => /* @__PURE__ */ new Set()), r = K(
    () => e ? Uc(e) : jc,
    [e]
  ), a = K(
    () => Oc.filter((s) => !(e != null && e.sourceOnly && s !== "source")),
    [e == null ? void 0 : e.sourceOnly]
  ), o = x(async (s) => {
    if (!e) return;
    const i = ot(r[s]);
    if (!(!i || t.has(s)))
      try {
        const c = e.jobId ? sa(s, {
          jobId: e.jobId,
          jobPayload: e.jobPayload,
          manifestPayload: e.manifestPayload
        }) : `${e.sourceOnly ? "document" : "reader"}-${s}.pdf`;
        await ca(
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
        la(l), n((d) => {
          const u = new Set(d);
          return u.delete(s), u;
        });
      }
  }, [r, t, e]);
  return { urls: r, downloadItems: a, busyActions: t, handleDownload: o };
}
function Wc(e) {
  const [t, n] = C(!1), r = x(() => n(!1), []), a = x(() => n((o) => !o), []);
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
const co = "retainpdf.reader.fab.pos.v1", Nt = 52, Ue = 12, Hc = 6;
function rt(e, t) {
  if (typeof window > "u")
    return { x: e, y: t };
  const n = Math.max(Ue, window.innerWidth - Nt - Ue), r = Math.max(Ue, window.innerHeight - Nt - Ue);
  return {
    x: Math.min(n, Math.max(Ue, e)),
    y: Math.min(r, Math.max(Ue, t))
  };
}
function yr() {
  return typeof window > "u" ? { x: 24, y: 120 } : rt(
    window.innerWidth - Nt - 20,
    window.innerHeight - Nt - 88
  );
}
function Jc() {
  try {
    const e = localStorage.getItem(co);
    if (!e) return yr();
    const t = JSON.parse(e);
    if (typeof t.x == "number" && typeof t.y == "number")
      return rt(t.x, t.y);
  } catch {
  }
  return yr();
}
function qc(e) {
  try {
    localStorage.setItem(co, JSON.stringify(e));
  } catch {
  }
}
function Kc(e) {
  return typeof window < "u" && e.y > window.innerHeight * 0.55;
}
function Gc(e = {}) {
  const { onDragStart: t, onActivate: n } = e, [r, a] = C(() => Jc()), o = A(null);
  O(() => {
    const l = () => a((d) => rt(d.x, d.y));
    return window.addEventListener("resize", l), () => window.removeEventListener("resize", l);
  }, []);
  const s = x((l) => {
    l.button === 0 && (l.currentTarget.setPointerCapture(l.pointerId), o.current = {
      pointerId: l.pointerId,
      startX: l.clientX,
      startY: l.clientY,
      originX: r.x,
      originY: r.y,
      moved: !1
    });
  }, [r.x, r.y]), i = x((l) => {
    const d = o.current;
    if (!d || d.pointerId !== l.pointerId) return;
    const u = l.clientX - d.startX, f = l.clientY - d.startY;
    !d.moved && Math.hypot(u, f) < Hc || (d.moved || (d.moved = !0, t == null || t()), a(rt(d.originX + u, d.originY + f)));
  }, [t]), c = x((l) => {
    const d = o.current;
    if (!(!d || d.pointerId !== l.pointerId)) {
      o.current = null;
      try {
        l.currentTarget.releasePointerCapture(l.pointerId);
      } catch {
      }
      if (d.moved) {
        a((u) => {
          const f = rt(u.x, u.y);
          return qc(f), f;
        });
        return;
      }
      n == null || n();
    }
  }, [n]);
  return {
    pos: r,
    openUp: Kc(r),
    onPointerDown: s,
    onPointerMove: i,
    onPointerUp: c
  };
}
const Vc = {
  source: Sr,
  sideBySide: Ir,
  translated: Pr
}, Yc = {
  source: "原文",
  sideBySide: "对照",
  translated: "译文"
};
function Zc({ onClose: e }) {
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
        children: /* @__PURE__ */ p(Ke, { size: 14, strokeWidth: 2.5, "aria-hidden": !0 })
      }
    )
  ] });
}
function Xc({
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
function Qc({
  urls: e,
  items: t,
  busyActions: n,
  onDownload: r
}) {
  return /* @__PURE__ */ z("div", { className: "reader-fab-section", role: "group", "aria-label": "下载", children: [
    /* @__PURE__ */ z("div", { className: "reader-fab-section-head", children: [
      /* @__PURE__ */ p(Bo, { size: 12, strokeWidth: 2.5, "aria-hidden": !0 }),
      /* @__PURE__ */ p("span", { children: "下载 PDF" })
    ] }),
    /* @__PURE__ */ p("div", { className: "reader-fab-download-grid", children: t.map((a, o) => {
      const s = So[a], i = ot(e[a]), c = n.has(a), l = !!i && !c, d = l ? "" : Io(a, e), u = Vc[a];
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
            /* @__PURE__ */ p("span", { className: "reader-fab-chip-label", children: Yc[a] }),
            /* @__PURE__ */ p("span", { className: "reader-fab-chip-state", children: c ? "…" : l ? "↓" : "—" })
          ]
        },
        a
      );
    }) }),
    t.every((a) => !ot(e[a])) ? /* @__PURE__ */ p("p", { className: "reader-fab-empty", children: "产物尚未就绪" }) : null
  ] });
}
const el = {
  favorites: Wo,
  markdown: Tr,
  ai: dn,
  notes: kt
}, tl = $c.filter((e) => e.id === "favorites");
function nl(e) {
  const { activeTool: t, noteCount: n, onToggleTool: r } = e, a = dt(), o = e.sourceOnly ?? (a == null ? void 0 : a.sourceOnly) ?? !1, s = e.download ?? (a == null ? void 0 : a.download), i = A(null), c = ln(), { open: l, setOpen: d, closeMenu: u, toggleMenu: f } = Wc(i), { pos: m, openUp: y, onPointerDown: h, onPointerMove: v, onPointerUp: b } = Gc({
    onDragStart: u,
    onActivate: f
  }), { urls: g, downloadItems: P, busyActions: w, handleDownload: I } = Bc(s), L = x((E) => {
    r(E), d(!1);
  }, [r, d]);
  return /* @__PURE__ */ z(
    "div",
    {
      ref: i,
      className: `reader-fab${l ? " is-open" : ""}${y ? " is-open-up" : ""}`,
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
              /* @__PURE__ */ p(Zc, { onClose: u }),
              (() => {
                const E = t === "notes";
                return /* @__PURE__ */ z(
                  "button",
                  {
                    type: "button",
                    role: "menuitem",
                    className: `reader-fab-row${E ? " is-active" : ""}`,
                    "aria-pressed": E,
                    onClick: () => L("notes"),
                    style: { "--fab-i": 0 },
                    children: [
                      /* @__PURE__ */ p("span", { className: "reader-fab-row-icon", "aria-hidden": "true", children: /* @__PURE__ */ p(kt, { size: 18, strokeWidth: 2 }) }),
                      /* @__PURE__ */ z("span", { className: "reader-fab-row-copy", children: [
                        /* @__PURE__ */ p("span", { className: "reader-fab-row-title", children: "批注" }),
                        /* @__PURE__ */ p("span", { className: "reader-fab-row-sub", children: E ? "关闭悬浮窗" : "本地批注 · 导出" })
                      ] }),
                      n > 0 ? /* @__PURE__ */ p("span", { className: "reader-fab-row-badge", children: n }) : null
                    ]
                  }
                );
              })(),
              tl.map((E, _) => {
                const R = el[E.id], M = t === E.id, T = E.needsJob && o;
                let S = M ? E.subOpen : E.subIdle;
                return T && (S = "需打开任务阅读"), /* @__PURE__ */ p(
                  Xc,
                  {
                    index: _,
                    icon: R,
                    title: E.label,
                    sub: S,
                    active: M,
                    disabled: T,
                    onClick: () => L(E.id)
                  },
                  E.id
                );
              }),
              /* @__PURE__ */ p(
                Qc,
                {
                  urls: g,
                  items: P,
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
            onPointerMove: v,
            onPointerUp: b,
            onPointerCancel: b,
            children: /* @__PURE__ */ p("span", { className: "reader-fab-icon", "aria-hidden": "true", children: l ? /* @__PURE__ */ p(Ke, { size: 20, strokeWidth: 2.5 }) : /* @__PURE__ */ z("span", { className: "reader-fab-dots", children: [
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
function rl(e) {
  const t = dt(), n = ki(), { mode: r = "compare", modeControls: a } = e, o = e.userZoom ?? (t == null ? void 0 : t.userZoom) ?? ut, s = e.onZoomChange ?? (t == null ? void 0 : t.onZoomChange) ?? (() => {
  }), i = e.currentPage ?? (n == null ? void 0 : n.currentPage) ?? 1, c = e.numPages ?? (n == null ? void 0 : n.numPages) ?? 0, l = e.onGoToPage ?? (t == null ? void 0 : t.goToPage), d = Ya(o), u = o > kr + 1e-3, f = o < Ar - 1e-3, m = tt(), y = "50%（半屏，对照铺满）", [h, v] = C(!1), [b, g] = C(`${i}`);
  O(() => {
    h || g(`${Math.min(Math.max(i, 1), Math.max(c, 1))}`);
  }, [i, c, h]);
  const P = () => {
    if (v(!1), !l || c <= 0)
      return;
    const w = Number(`${b}`.trim());
    l(xt(w, c));
  };
  return /* @__PURE__ */ z("div", { className: "reader-react-hud", "data-reader-hud": "true", children: [
    a ? /* @__PURE__ */ p("div", { className: "reader-react-hud-group reader-react-hud-modes", children: a }) : null,
    /* @__PURE__ */ p("div", { className: "reader-react-hud-group", "aria-label": "页码", children: h ? /* @__PURE__ */ z(
      "form",
      {
        className: "reader-react-hud-page-form",
        onSubmit: (w) => {
          w.preventDefault(), P();
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
              onBlur: P,
              onKeyDown: (w) => {
                w.key === "Escape" && (w.preventDefault(), v(!1), g(`${i}`));
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
          !l || c <= 0 || (g(`${i}`), v(!0));
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
          onClick: () => s(st(o, -1)),
          children: "−"
        }
      ),
      /* @__PURE__ */ z(
        "button",
        {
          type: "button",
          className: "reader-react-hud-btn reader-react-hud-zoom-label",
          "aria-label": `重置为${y}`,
          title: y,
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
          onClick: () => s(st(o, 1)),
          children: "+"
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { className: "reader-react-hud-group reader-react-hud-help", "aria-label": "帮助", children: /* @__PURE__ */ p(Fc, {}) })
  ] });
}
function lo(e) {
  const t = `${e.jobId || ""}`.trim(), n = `${e.documentId || ""}`.trim();
  return t ? `retainpdf.reader.notes.v1:job:${t}` : n ? `retainpdf.reader.notes.v1:doc:${n}` : "retainpdf.reader.notes.v1:anonymous";
}
function ol() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function al(e) {
  return {
    pageIdx: Number(e.page) - 1,
    quoteText: e.quote,
    note: e.note,
    createdAt: e.createdAt
  };
}
function sl(e) {
  return Mo(e, (t) => t.page);
}
function il(e) {
  return xo(e, (t) => t.page).map((t) => ({ page: t.pageIdx, items: t.items }));
}
function cl(e, t) {
  return Eo({
    title: e,
    annotations: t.map(al)
  });
}
function ll(e) {
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
function vr(e) {
  if (typeof localStorage > "u")
    return [];
  try {
    return ll(localStorage.getItem(lo(e)));
  } catch {
    return [];
  }
}
function ul(e, t) {
  if (!(typeof localStorage > "u"))
    try {
      localStorage.setItem(lo(e), JSON.stringify(t));
    } catch (n) {
      console.warn("[reader-notes] persist failed", n);
    }
}
function dl(e, t = {}) {
  const n = K(
    () => ({
      jobId: `${e.jobId || ""}`.trim(),
      documentId: `${e.documentId || ""}`.trim()
    }),
    [e.jobId, e.documentId]
  ), [r, a] = C(() => vr(n)), o = t.onAfterAdd;
  O(() => {
    a(vr(n));
  }, [n.jobId, n.documentId]), O(() => {
    ul(n, r);
  }, [n, r]);
  const s = x((u) => {
    const f = `${u.quote || ""}`.trim();
    if (!f)
      return null;
    const m = {
      id: ol(),
      page: Math.max(1, Math.floor(Number(u.page) || 1)),
      pane: u.pane === "translated" ? "translated" : "source",
      quote: f,
      note: `${u.note || ""}`.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return a((y) => sl([m, ...y])), o == null || o(), m;
  }, [o]), i = x((u, f) => {
    const m = `${f || ""}`.trim();
    a((y) => y.map((h) => h.id === u ? { ...h, note: m } : h));
  }, []), c = x((u) => {
    a((f) => f.filter((m) => m.id !== u));
  }, []), l = x(async (u = "") => {
    var m, y;
    const f = cl(u, r);
    try {
      return await ((y = (m = navigator.clipboard) == null ? void 0 : m.writeText) == null ? void 0 : y.call(m, f)), !0;
    } catch (h) {
      return console.error("[reader-notes] copy failed", h), !1;
    }
  }, [r]), d = K(() => il(r), [r]);
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
const nn = "download-toast";
function fl({
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
function ml(e = {}) {
  const {
    visible: t = !1,
    title: n = "下载中",
    status: r = "正在准备...",
    meta: a = "等待响应...",
    percent: o = NaN,
    tone: s = "progress"
  } = e;
  if (!t) {
    Wt.dismiss(nn);
    return;
  }
  Wt.custom(
    () => /* @__PURE__ */ p(fl, { title: n, status: r, meta: a, percent: o, tone: s }),
    { id: nn, duration: 1 / 0 }
  );
}
function pl() {
  const e = x((t) => {
    t && (t.setState = ml, t.hide = () => Wt.dismiss(nn));
  }, []);
  return /* @__PURE__ */ z(rn, { children: [
    /* @__PURE__ */ p(Co, { position: "bottom-right" }),
    /* @__PURE__ */ p("download-toast", { style: { display: "none" }, "aria-hidden": "true", ref: e })
  ] });
}
const hl = un(() => import("./ReaderFavoritesPanel-BswDGfPU.js").then((e) => ({ default: e.ReaderFavoritesPanel }))), gl = un(() => import("./ReaderMarkdownPanel-Cp6HXq-h.js").then((e) => ({ default: e.ReaderMarkdownPanel }))), bl = un(() => import("./ReaderAiPanel-zWt9EqTm.js").then((e) => ({ default: e.ReaderAiPanel })));
function Bt(e) {
  const t = A(!1);
  return e && (t.current = !0), t.current;
}
function yl(e) {
  return "workspace";
}
function vl(e, t) {
  return t !== null && e === "compare" ? "source" : e;
}
function wr(e, t) {
  var n, r, a, o;
  return e === "compare" ? null : (t == null ? void 0 : t.assistantPanel) === "markdown" || (t == null ? void 0 : t.assistantPanel) === "ai" ? t.assistantPanel : ((n = t == null ? void 0 : t.splitLayout) == null ? void 0 : n.left) === "ai" || ((r = t == null ? void 0 : t.splitLayout) == null ? void 0 : r.right) === "ai" ? "ai" : ((a = t == null ? void 0 : t.splitLayout) == null ? void 0 : a.left) === "markdown" || ((o = t == null ? void 0 : t.splitLayout) == null ? void 0 : o.right) === "markdown" ? "markdown" : null;
}
function wl() {
  const e = qs(), { boot: t, panes: n, sessionFiles: r, tools: a, session: o } = e, s = e.sourceOnly || !r.translatedUrl, [i, c] = C(() => wr(e.mode, Re(e.viewStateKey))), [l, d] = C(null), [u, f] = C(null), [m, y] = C(!0), h = A(e.viewStateKey), v = A(null), [b, g] = C(!1), P = x(() => g(!0), []), w = x(() => g((U) => !U), []), I = dl(
    { jobId: o.jobId, documentId: o.documentId },
    { onAfterAdd: P }
  ), L = x((U) => {
    I.addFromQuote(U), e.clearSelection();
  }, [I.addFromQuote, e.clearSelection]), E = x((U) => {
    e.goToPage(U.page, U.pane === "translated" ? "translated" : "source");
  }, [e.goToPage]), _ = x(
    () => I.exportMarkdown(o.title || ""),
    [I.exportMarkdown, o.title]
  );
  O(() => {
    f(null), y(!0), g(!1);
  }, [e.viewStateKey]), O(() => {
    if (!t.loading) {
      if (h.current !== e.viewStateKey) {
        h.current = e.viewStateKey;
        const U = Re(e.viewStateKey);
        c(wr(e.mode, U)), d(null);
        return;
      }
      Rt(e.viewStateKey, { assistantPanel: i, splitLayout: null });
    }
  }, [i, t.loading, e.mode, e.viewStateKey]), O(() => {
    if (!(t.loading || t.failed)) {
      if (v.current !== e.viewStateKey) {
        v.current = e.viewStateKey;
        const U = Re(e.viewStateKey), ae = s ? "source" : U == null ? void 0 : U.mode;
        ae && ae !== e.mode && e.setModeKeepingPage(ae);
        return;
      }
      Rt(e.viewStateKey, { mode: e.mode });
    }
  }, [t.failed, t.loading, e.mode, e.setModeKeepingPage, e.viewStateKey, s]);
  const R = i || (e.mode === "compare" ? "compare" : "reading"), M = i !== null, T = Bt(a.isOpen("favorites")), S = Bt(i === "markdown"), N = Bt(i === "ai"), D = l || vl(e.mode, i), k = !!(e.liveTranslationAvailable && m && !M), F = k ? "compare" : D;
  Zs({
    mode: F,
    sourceOnly: e.sourceOnly,
    setMode: e.setModeKeepingPage,
    userZoom: e.userZoom,
    onZoomChange: e.onZoomChange,
    currentPage: e.currentPage,
    numPages: n.hudNumPages,
    goToPage: e.goToPage,
    enabled: e.showHud
  });
  const B = x(() => {
    a.close();
  }, [a]), Z = x((U) => {
    if (U === "notes") {
      w();
      return;
    }
    a.toggle(U);
  }, [w, a]), Q = x(() => {
    c(null), d(null), f(null);
  }, []), X = x((U) => {
    const ae = F === "translated" ? "translated" : "source";
    e.jumpToAnchor(U, ae);
  }, [e.jumpToAnchor, F]), re = x((U) => {
    o.refreshCommittedDocument(U);
  }, [o.refreshCommittedDocument]), ce = x((U) => {
    a.close(), d(null), U === "compare" && e.liveTranslationAvailable ? y(!0) : U !== "compare" && y(!1), e.setModeKeepingPage(U);
  }, [e.liveTranslationAvailable, e.setModeKeepingPage, a]), j = x((U) => {
    c(U), U !== "ai" && f(null);
  }, []), J = x((U) => {
    const ae = U.pane === "translated" && !s ? "translated" : "source";
    f(U), c("ai"), d(ae), e.clearSelection();
  }, [e.clearSelection, s]), oe = K(() => ({
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
    sourceViewOnly: s,
    download: e.download,
    goToPage: e.goToPage,
    assistant: { select: j, close: Q }
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
    s,
    e.download,
    e.goToPage,
    j,
    Q
  ]), ne = K(() => ({
    currentPage: e.currentPage,
    numPages: n.hudNumPages
  }), [e.currentPage, n.hudNumPages]), le = [
    "reader-react-root",
    `is-workspace-${R}`,
    M ? "is-assistant-open" : "",
    k ? "is-live-translation-pair" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(Ni, { value: oe, hud: ne, children: /* @__PURE__ */ z("div", { className: le, "data-reader-engine": "react-pdf", "data-reader-workspace": R, children: [
    /* @__PURE__ */ p(Lc, { loading: t.loading, failed: t.failed, text: t.text, percent: t.percent, regionsError: !!o.readerErrors.regions, metadataError: !!o.readerErrors.metadata }),
    /* @__PURE__ */ p(ri, { onBeforeClose: o.prepareClose }),
    /* @__PURE__ */ p(
      $i,
      {
        mode: F,
        documentReady: !!o.jobId,
        onModeChange: ce,
        liveTranslation: e.liveTranslationAvailable ? {
          visible: m,
          state: e.liveTranslation,
          onToggle: () => y((U) => !U)
        } : null
      }
    ),
    /* @__PURE__ */ p(Oi, { active: i }),
    M ? /* @__PURE__ */ p(Rc, {}) : null,
    e.showHud ? /* @__PURE__ */ p(nl, { activeTool: b ? "notes" : a.active, noteCount: I.count, onToggleTool: Z }) : null,
    /* @__PURE__ */ p(zi, { mode: F, compareMode: F === "compare", showSource: k || F !== "translated", showTranslated: k || F === "translated" || F === "compare", markdownSplit: i === "markdown", assistantSplit: M, liveTranslation: m ? e.liveTranslation : void 0, liveTranslationPair: k }),
    e.showHud ? /* @__PURE__ */ p(
      rl,
      {
        mode: F,
        modeControls: null
      }
    ) : null,
    /* @__PURE__ */ z(bo, { fallback: null, children: [
      T ? /* @__PURE__ */ p(hl, { open: a.isOpen("favorites"), jobId: o.jobId, documentId: o.documentId, onClose: B, onJumpPage: e.goToPage }) : null,
      S ? /* @__PURE__ */ p(gl, { open: i === "markdown", jobId: o.jobId, sourceOnly: e.sourceOnly, layout: "workspace", side: "right", onClose: Q }) : null,
      N ? /* @__PURE__ */ p(bl, { open: i === "ai", jobId: o.jobId, documentId: o.documentId, layout: yl(e.mode), side: "right", selectionContext: u, onClearSelectionContext: () => f(null), onClose: Q, onJumpCitation: X, onDocumentCommitted: re }, o.documentId || o.jobId || "reader-ai-pending") : null
    ] }),
    /* @__PURE__ */ p(
      Ac,
      {
        open: b,
        groups: I.groups,
        count: I.count,
        onClose: () => g(!1),
        onJump: E,
        onUpdateNote: I.updateNote,
        onRemove: I.remove,
        onExport: _
      }
    ),
    /* @__PURE__ */ p(_c, { selection: e.selection, onDismiss: e.clearSelection, onAskAi: J, onAddNote: L }),
    /* @__PURE__ */ p(pl, {})
  ] }) });
}
function Ol() {
  return /* @__PURE__ */ p(wl, {});
}
export {
  fn as A,
  Ol as R,
  wl as a,
  Nc as b,
  $l as c,
  at as d,
  Qo as e,
  Fl as f,
  xr as g,
  Dl as h,
  _l as r
};
//# sourceMappingURL=ReaderApp-DkbEbl1d.js.map
