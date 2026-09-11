var kn = (e) => {
  throw TypeError(e);
};
var An = (e, t, n) => t.has(e) || kn("Cannot " + n);
var Ye = (e, t, n) => (An(e, t, "read from private field"), n ? n.call(e) : t.get(e)), Cn = (e, t, n) => t.has(e) ? kn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), Ln = (e, t, n, r) => (An(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
import { jsxs as z, jsx as p, Fragment as rn } from "react/jsx-runtime";
import { useMemo as q, useState as A, useEffect as O, useCallback as x, useRef as C, useLayoutEffect as De, memo as on, forwardRef as po, useImperativeHandle as an, createContext as sn, useContext as cn, useSyncExternalStore as ho, useId as ln, Suspense as go, lazy as un } from "react";
import { getReaderAdapters as ie, requireAdapter as Re } from "./adapters.js";
import { resolveReaderDownloadName as bo, createReaderServerFavoritesPort as yo, resolveReaderDownloadUrls as vo, READER_PROGRESS_COPY as Ie, trimString as ot, READER_DOWNLOAD_ACTIONS as wo, disabledReason as So } from "./runtime/state.js";
import { d as Io } from "./ask-answerer-GNQdzitl.js";
import "@retainpdf/api/conversations";
import { normalizeBlockKey as zn, sortByPageAndCreatedAt as Po, buildAnnotationsMarkdown as Ro, groupByPageAndCreatedAt as To } from "./runtime/content.js";
import { fetchLiveTranslationLayout as Mo, LiveTranslationApiError as It, streamLiveTranslationEvents as Eo, fetchLiveTranslationPage as xo } from "@retainpdf/api/live-translation";
import { toast as Wt, Toaster as No } from "sonner";
import { X as qe, Radio as ko, FileText as Sr, Columns2 as Ir, Languages as Pr, FileCode2 as Rr, Sparkles as dn, GripHorizontal as Ao, StickyNote as kt, Sigma as Co, Table2 as Lo, Type as zo, Image as _o, Check as Do, Copy as Fo, Keyboard as $o, Download as Oo, Bookmark as jo } from "lucide-react";
import { pdfjs as Uo, Page as Bo, Document as Wo } from "react-pdf";
import { e as Ho, m as Jo, a as Ko } from "./markdown-math-Cb17EyYs.js";
const qo = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.isMockMode) == null ? void 0 : n.call(t, ...e)) ?? !1;
}, Vo = "", Go = Object.freeze({
  progress: "retainpdf-reader-progress"
}), yt = (e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveResourceUrl) == null ? void 0 : n.call(t, e)) ?? e;
}, Yo = (...e) => {
  var n;
  return (((n = ie()) == null ? void 0 : n.fetchProtected) ?? fetch)(...e);
}, Ht = (e = "") => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolvePdfjsVendorUrl) == null ? void 0 : n.call(t, e)) ?? "";
}, at = new Proxy({}, { get: (e, t) => (...n) => {
  var r, a, o;
  return (o = (a = (r = ie()) == null ? void 0 : r.defaultReaderDataPort) == null ? void 0 : a[t]) == null ? void 0 : o.call(a, ...n);
} }), Tr = new Proxy({}, { get: (e, t) => (...n) => {
  var r, a, o;
  return (o = (a = (r = ie()) == null ? void 0 : r.defaultReaderPageConfigPort) == null ? void 0 : a[t]) == null ? void 0 : o.call(a, ...n);
} }), Zo = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderAnchor) == null ? void 0 : n.call(t, ...e)) ?? null;
}, Xo = () => {
  var e, t;
  return ((t = (e = ie()) == null ? void 0 : e.resolveReaderDocumentId) == null ? void 0 : t.call(e)) ?? "";
}, Qo = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderJobId) == null ? void 0 : n.call(t, ...e)) ?? "";
}, ea = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderArtifactUrl) == null ? void 0 : n.call(t, ...e)) ?? "";
}, ta = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderSourcePdf) == null ? void 0 : n.call(t, ...e)) ?? null;
}, na = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderTranslatedPdfUrl) == null ? void 0 : n.call(t, ...e)) ?? "";
}, ra = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderDownloadName) == null ? void 0 : n.call(t, ...e)) ?? bo(...e);
}, oa = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderDownloadUrls) == null ? void 0 : n.call(t, ...e)) ?? vo(...e);
}, aa = (...e) => Re("downloadProtectedResource")(...e), sa = (...e) => Re("failDownloadToast")(...e), El = (e, t) => Re("resolveMarkdownAssetUrl")(e, t), xl = (e = {}) => {
  const t = ie();
  return Io({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) || "/api/v1",
    ask: t == null ? void 0 : t.askDocumentAi,
    documentByJobId: t == null ? void 0 : t.fetchDocumentByJobId,
    ...e
  });
}, fn = "/api/v1", ia = (...e) => Re("fetchDocumentByJobId")(...e), Nl = (e = fn, t = {}) => {
  var n;
  return Re("fetchFavorites")(
    ((n = ie()) == null ? void 0 : n.apiPrefix) ?? e,
    t
  );
};
function kl(e = {}) {
  const t = ie();
  return yo({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) ?? fn,
    documentByJobId: (...n) => Re("fetchDocumentByJobId")(...n),
    submitFavorite: (...n) => Re("createFavorite")(...n),
    loadFavorites: (...n) => Re("fetchFavorites")(...n),
    removeFavorite: (...n) => Re("deleteFavorite")(...n),
    ...e
  });
}
function ca() {
  const [e, t] = A(
    () => {
      var n, r;
      return ((n = globalThis.location) == null ? void 0 : n.search) || ((r = globalThis.location) == null ? void 0 : r.href) || "";
    }
  );
  return O(() => {
    var s, i, c, l;
    const n = () => {
      var d, u;
      return t(((d = globalThis.location) == null ? void 0 : d.search) || ((u = globalThis.location) == null ? void 0 : u.href) || "");
    }, r = (i = (s = globalThis.history) == null ? void 0 : s.pushState) == null ? void 0 : i.bind(globalThis.history), a = (l = (c = globalThis.history) == null ? void 0 : c.replaceState) == null ? void 0 : l.bind(globalThis.history);
    let o = !1;
    if (r && a)
      try {
        const d = (u) => function(...f) {
          const m = u.apply(this, f);
          return n(), globalThis.dispatchEvent(new Event("pushstate")), globalThis.dispatchEvent(new Event("replacestate")), globalThis.dispatchEvent(new Event("locationchange")), m;
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
function la() {
  const e = ca(), t = q(() => Qo(Tr), [e]), n = q(() => Xo(), [e]), r = t || n ? `job:${t}|document:${n}` : `location:${e}`;
  return { locationKey: e, jobId: t, routeDocumentId: n, sessionIdentity: r };
}
function ua(e) {
  const {
    routeDocumentId: t,
    jobId: n,
    sessionIdentity: r,
    sessionIdentityRef: a,
    documentIdRef: o,
    sessionJobIdRef: s,
    switchToSourceMode: i
  } = e, [c, l] = A({
    documentId: "",
    jobId: ""
  }), [d, u] = A({
    documentId: "",
    jobId: ""
  }), f = c.documentId === t ? c.jobId : "", m = d.documentId === t ? d.jobId : "", v = n || f, [h, y] = A({
    jobId: "",
    documentId: ""
  }), b = h.jobId === v ? h.documentId : "", g = t || b, I = !!t && !v, [w, P] = A(null), L = (w == null ? void 0 : w.sessionIdentity) === r && w.documentId === g ? w : null, E = I || !!L, _ = x((M) => {
    const R = `${M.documentId || ""}`.trim();
    if (!R || o.current && o.current !== R) return;
    if (!o.current && s.current)
      y({
        jobId: s.current,
        documentId: R
      });
    else if (!o.current)
      return;
    const S = `${M.revision || ""}`.trim() || `${Date.now()}`;
    P({
      documentId: R,
      revision: S,
      sessionIdentity: a.current
    }), i();
  }, []);
  O(() => {
    P((M) => M && M.sessionIdentity !== r ? null : M);
  }, [r]);
  const T = x((M) => {
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
    rejectedDocumentJobId: m,
    sessionJobId: v,
    resolvedJobDocument: h,
    setResolvedJobDocument: y,
    jobDocumentId: b,
    documentId: g,
    sourceOnly: I,
    committedDocumentSource: w,
    setCommittedDocumentSource: P,
    activeCommittedDocumentSource: L,
    sourceViewOnly: E,
    refreshCommittedDocument: _,
    applyIdentityEvent: T
  };
}
const da = /* @__PURE__ */ new Set(["succeeded", "failed", "cancelled", "canceled"]);
function _n(e) {
  return `${(e == null ? void 0 : e.status) || ""}`.trim().toLowerCase();
}
function fa(e) {
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
function ma(e, t = "") {
  const n = `${e || ""}`.trim(), r = `${t || ""}`.trim();
  return !!(!n || r && (n === r || n === `${r}.pdf`) || /^\d{8,14}-[0-9a-f]{4,}$/i.test(n));
}
function pa(e, t) {
  var r;
  const n = [
    e == null ? void 0 : e.title,
    e == null ? void 0 : e.display_name,
    e == null ? void 0 : e.source_file_name,
    (r = e == null ? void 0 : e.book_summary) == null ? void 0 : r.source_file_name
  ];
  for (const a of n) {
    const o = `${a || ""}`.trim();
    if (o && !ma(o, t))
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
        type: Go.progress,
        stage: n,
        percent: e,
        text: t
      },
      Tr.messageTargetOrigin()
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
function ha(e) {
  const {
    sessionJobId: t,
    sessionIdentity: n,
    sessionIdentityRef: r,
    sessionJobIdRef: a,
    sessionEpochRef: o,
    closingRef: s
  } = e, [i, c] = A(null), [l, d] = A(null), [u, f] = A(""), [m, v] = A(0), h = u === n ? i : null, y = u === n ? l : null, b = _n(h), g = da.has(b), I = x(() => {
    v((T) => T + 1);
  }, []), w = x((T) => {
    c(T.jobPayload), d(T.manifestPayload), f(T.sessionIdentity);
  }, []), P = x((T) => {
    c(null), d(null), f(T);
  }, []), L = C(""), E = C(""), _ = x(async () => {
    const T = a.current;
    if (!T || L.current === T) return;
    const M = at.loadJobPayload;
    if (typeof M != "function") return;
    const R = o.current.value;
    L.current = T;
    try {
      const S = await M(T);
      if (s.current || o.current.value !== R || a.current !== T || !S || typeof S != "object")
        return;
      const N = _n(S);
      c(S), f(r.current), N === "succeeded" && E.current !== T && (E.current = T, v((D) => D + 1));
    } catch {
    } finally {
      L.current === T && (L.current = "");
    }
  }, []);
  return O(() => {
    E.current = "";
  }, [n]), O(() => {
    if (!t || g || !h) return;
    const T = window.setInterval(() => {
      _();
    }, 1e3);
    return () => window.clearInterval(T);
  }, [g, _, h, t]), {
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
    refreshJobArtifacts: I,
    refreshJobStatus: _,
    publishPayload: w,
    clearPayload: P
  };
}
function Kt(e) {
  document.body.classList.remove(
    "reader-mode-source",
    "reader-mode-translated",
    "reader-mode-compare"
  ), document.body.classList.add(`reader-mode-${e}`);
}
function ga(e, t) {
  e(t), Kt(t);
}
function ba(e) {
  const [t, n] = A(e ? "source" : "compare"), r = x((o) => {
    e && o !== "source" || (n(o), Kt(o));
  }, [e]), a = x((o) => {
    ga(n, o);
  }, []);
  return O(() => (e && document.documentElement.classList.add("reader-source-only"), Kt(t), () => {
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
function ya(e) {
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
function va(e) {
  const t = `${e || ""}`.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return t.includes("formula") || t.includes("equation") ? "formula" : t.includes("table") ? "table" : t.includes("figure") || t.includes("image") || t.includes("chart") || t.includes("seal") ? "figure" : t.includes("text") || t.includes("title") || t.includes("paragraph") || t.includes("reference") || t.includes("caption") ? "text" : "region";
}
function mn(e) {
  const t = va(e.regionType);
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
  return `${Rt(e, t).text || e.markdown || ""}`.trim();
}
function wa(e) {
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
function Sa(e) {
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
function Ia(e) {
  const t = `${e || ""}`.trim();
  if (!t) return [];
  const n = t.split(/\n\s*\n/g).map(wt).filter(Boolean), r = t.split(">").map(wt).filter(Boolean), a = [...n.reverse(), ...r.reverse(), wt(t)];
  return [...new Set(a)].filter((o) => o.length >= 16);
}
function Pa(e, t) {
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
function Ra(e, t) {
  if (!t) return null;
  const n = vt(e, t.block_id);
  if (n) return n;
  const r = Ia(t.snippet);
  if (!r.length) return null;
  const a = t.page_idx != null ? Number(t.page_idx) + 1 : t.page != null ? Number(t.page) : null, o = Number.isFinite(a) && Number(a) >= 1 ? e.filter((l) => l.source.page === Math.floor(Number(a)) || l.translated.page === Math.floor(Number(a))) : e;
  let s = null, i = 0, c = !1;
  for (const l of o) {
    const d = [l.source.text, l.translated.text, l.markdown].map(wt).filter(Boolean);
    let u = 0;
    for (const f of r)
      for (const m of d)
        u = Math.max(u, Pa(m, f));
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
function Ta(e, t, n) {
  const r = On(t);
  if (!r) return null;
  const a = Number(n);
  return (Number.isFinite(a) && a >= 1 ? e.filter((s) => s.source.page === Math.floor(a)) : e).find((s) => [...s.assetUrls, ...s.assetIds].some((i) => {
    const c = On(i);
    return !!c && (c === r || r.endsWith(`/${c}`) || c.endsWith(`/${r}`));
  })) || null;
}
function Rt(e, t) {
  return t === "translated" ? e.translated : e.source;
}
function jn(e, t, n) {
  if (!e || !t) return null;
  const r = Rt(e, n), a = n === "translated" ? t.translated : t.source || t.translated, o = a == null ? void 0 : a.pages.find((s) => s.page === r.page);
  return o ? { itemId: e.itemId, region: e, box: r, pageSize: o } : null;
}
function At(e, t, n) {
  if (!e || t <= 0 || n <= 0) return null;
  const { box: r, pageSize: a } = e;
  if (a.width <= 0 || a.height <= 0) return null;
  const [o, s, i, c] = r.bbox, l = r.origin === "bottom_left" ? a.height - c : s, d = r.origin === "bottom_left" ? a.height - s : c, u = Math.max(0, Math.min(t, o / a.width * t)), f = Math.max(u, Math.min(t, i / a.width * t)), m = Math.max(0, Math.min(n, l / a.height * n)), v = Math.max(m, Math.min(n, d / a.height * n));
  return f <= u || v <= m ? null : { left: u, top: m, width: f - u, height: v - m };
}
function Un(e) {
  return typeof e == "string" ? e.trim() : `${e ?? ""}`.trim();
}
function Ma(e) {
  const t = (e == null ? void 0 : e.data) ?? e, n = t && typeof t == "object" ? t : {};
  return {
    activeJobId: Un(n.active_job_id),
    activeVersionId: Un(n.active_version_id)
  };
}
function Ea(e) {
  const { link: t, rejectedDocumentJobId: n, hasCommittedSource: r } = e, a = t.activeJobId && t.activeJobId !== n && !t.activeJobId.startsWith("doc:") ? t.activeJobId : "";
  return a ? { kind: "follow-active-job", jobId: a, activeVersionId: t.activeVersionId } : t.activeVersionId && !r ? { kind: "open-committed-source", documentId: "", revision: t.activeVersionId } : { kind: "open-source-url" };
}
function xa(e) {
  const {
    payloadDocumentId: t,
    linkedActiveJobId: n,
    linkedActiveVersionId: r,
    sessionJobId: a,
    hasCommittedSource: o
  } = e;
  return t && r && n === a && !o ? { kind: "restore-committed-source", documentId: t, revision: r } : { kind: "open-job-artifacts" };
}
function Na(e) {
  return e.status === 404 && !e.jobId && !!e.routeDocumentId && !!e.documentJobId && e.sessionJobId === e.documentJobId;
}
function ka(e) {
  return e ? { data: e.data.slice() } : null;
}
const Aa = 2, be = /* @__PURE__ */ new Map();
function qt(e, t) {
  be.delete(e), be.set(e, t);
}
function Ca(e) {
  if (be.size < Aa) return;
  const t = be.keys().next().value;
  t && be.delete(t);
}
function Lt(e) {
  const t = `${e || ""}`.trim();
  if (!t || !be.has(t)) return null;
  const n = be.get(t);
  return qt(t, n), n;
}
async function Nr(e, t = Yo, n = {}) {
  const r = `${e || ""}`.trim();
  if (!r)
    return null;
  if (be.has(r)) {
    const i = be.get(r);
    return qt(r, i), i;
  }
  const a = await t(r, { signal: n.signal });
  if (!a.ok) {
    const i = new Error(`读取 PDF 失败 (${a.status})`);
    throw i.status = a.status, i;
  }
  const o = await a.arrayBuffer(), s = { data: new Uint8Array(o) };
  return be.has(r) ? qt(r, s) : (Ca(), be.set(r, s)), s;
}
function La(e = "", t = null) {
  const [n, r] = A(
    () => t || Lt(e)
  ), [a, o] = A(
    () => !!`${e || ""}`.trim() && !t && !Lt(e)
  ), [s, i] = A("");
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
function za(e) {
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
async function Vt(e) {
  const { url: t, label: n, percentStart: r, percentEnd: a, fence: o, setBoot: s } = e;
  if (!t || o.isInactive())
    return null;
  Pt(s, r, n, "download");
  const i = await Nr(t, at.fetchProtected, {
    signal: o.signal
  });
  return o.isInactive() ? null : (Pt(s, a, n, "download"), i);
}
async function _a(e) {
  const { sourceFinal: t, translatedFinal: n, fence: r, setBoot: a } = e;
  Pt(a, 25, "正在下载 PDF…", "download");
  const o = [];
  let s = null, i = null;
  return t && o.push(
    Vt({
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
    Vt({
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
function Da(e) {
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
  } = e, [g, I] = A(""), [w, P] = A(""), [L, E] = A(null), [_, T] = A(null), [M, R] = A(!1), [S, N] = A(""), [D, k] = A([]), [F, B] = A(() => ({
    source: null,
    translated: null
  })), [Z, Q] = A(
    pt
  ), [X, re] = A({
    loading: !0,
    percent: 4,
    text: Ie.boot,
    stage: "progress",
    failed: !1
  });
  return O(() => {
    const ce = new AbortController(), j = h.current.value, J = za({
      sessionEpochRef: h,
      closingRef: y,
      abort: ce,
      sessionEpoch: j
    });
    if (b.current = ce, y.current)
      return ce.abort(), () => {
        b.current === ce && (b.current = null);
      };
    function oe(V, K) {
      J.markFailed(), re({
        loading: !1,
        percent: 100,
        text: V,
        stage: "failed",
        failed: !0
      }), Jt({ percent: 100, text: K, stage: "failed" });
    }
    function ne() {
      R(!0), re({
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
      ) : qo() ? Vo : yt(`/api/v1/documents/${encodeURIComponent(r)}/source.pdf`);
    }
    async function U() {
      let V = { activeJobId: "", activeVersionId: "" };
      try {
        const he = await at.fetchProtected(
          yt(`/api/v1/documents/${encodeURIComponent(r)}`)
        );
        if (he != null && he.ok) {
          const Ve = await he.json().catch(() => null);
          V = Ma(Ve);
        }
      } catch {
      }
      const K = Ea({
        link: V,
        rejectedDocumentJobId: o,
        hasCommittedSource: !!l
      });
      if (K.kind === "follow-active-job") {
        if (J.isInactive()) return;
        d({
          type: "resolved-document-job",
          documentId: r,
          jobId: K.jobId
        }), K.activeVersionId ? (l || d({
          type: "committed-source",
          documentId: r,
          revision: K.activeVersionId,
          sessionIdentity: c
        }), m("source")) : m("compare");
        return;
      }
      if (K.kind === "open-committed-source") {
        if (J.isInactive()) return;
        d({
          type: "committed-source",
          documentId: r,
          revision: K.revision,
          sessionIdentity: c
        }), m("source");
        return;
      }
      const me = le();
      if (J.isInactive()) return;
      I(me), P(""), N(""), f(c);
      const Ee = await Vt({
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
      const V = await at.loadReaderPayload(t, {
        // committedSource 分支会丢弃 regions/metadata（旧页序已失效），
        // 直接跳过这两个可选请求，避免无效网络往返。
        includeOptionalArtifacts: !l
      });
      if (J.isInactive()) return;
      let K = null;
      if (n && !r) {
        try {
          K = await ia(fn, t);
        } catch {
        }
        if (J.isInactive()) return;
      }
      const me = fa(V.jobPayload) || `${(K == null ? void 0 : K.document_id) || ""}`.trim();
      me && !r && d({
        type: "resolved-job-document",
        jobId: t,
        documentId: me
      });
      const Ee = xa({
        payloadDocumentId: me,
        linkedActiveJobId: `${(K == null ? void 0 : K.active_job_id) || ""}`.trim(),
        linkedActiveVersionId: `${(K == null ? void 0 : K.active_version_id) || ""}`.trim(),
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
      const he = ta(V.manifestPayload), Ve = na(V.jobPayload, V.manifestPayload), ft = typeof he == "string" ? he : ea(he), mt = r || me, Ge = l != null && l.documentId ? Dn(
        l.documentId,
        l.revision
      ) : ft || (mt ? yt(`/api/v1/documents/${encodeURIComponent(mt)}/source.pdf`) : ""), we = l ? "" : Ve || "";
      if (I(Ge || ""), P(we), N(pa(V.jobPayload, t)), u({
        jobPayload: V.jobPayload || null,
        manifestPayload: V.manifestPayload || null,
        sessionIdentity: c
      }), k(l ? [] : ya(V.regionsPayload)), B(l ? { source: null, translated: null } : Sa(V.readerMetadata)), Q(l ? pt : V.readerErrors ?? pt), !Ge && !we) {
        oe(Ie.failed, Ie.failed);
        return;
      }
      const Se = await _a({
        sourceFinal: Ge || "",
        translatedFinal: we,
        fence: J,
        setBoot: re
      });
      if (Se.status !== "inactive") {
        if (Se.status === "incomplete") {
          oe("PDF 下载失败，请重试", "PDF 下载失败");
          return;
        }
        E(Se.sourceBytes), T(Se.translatedBytes), ne();
      }
    }
    async function pe() {
      R(!1), E(null), T(null), k([]), B({ source: null, translated: null }), Q(pt), Pt(re, 8, Ie.metadata, "metadata");
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
      } catch (V) {
        if (J.isClosedOrStale() || (V == null ? void 0 : V.name) === "AbortError") return;
        J.markFailed();
        const K = Number(V == null ? void 0 : V.status);
        if (Na({
          status: K,
          jobId: n,
          routeDocumentId: r,
          documentJobId: a,
          sessionJobId: t
        })) {
          d({ type: "missing-document-job", documentId: r, jobId: t }), d({ type: "cleared-resolved-document-job" }), m("source");
          return;
        }
        const me = V instanceof Error ? V.message : Ie.failed;
        oe(me, me);
      }
    }
    return pe(), () => {
      ce.abort(), b.current === ce && (b.current = null);
    };
  }, [t, r, a, o, s, i, l, v, n, c, d, u, f, m]), {
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
function Fa() {
  const e = C(!1), t = C(null), { locationKey: n, jobId: r, routeDocumentId: a, sessionIdentity: o } = la(), s = C({ identity: "", value: 0 });
  s.current.identity !== o && (s.current = {
    identity: o,
    value: s.current.value + 1
  }, e.current = !1);
  const i = C(o), c = C(""), l = C(""), d = C(() => {
  }), u = x(() => d.current(), []), f = ua({
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
  } = f, { mode: b, setMode: g, switchSessionMode: I } = ba(y);
  d.current = () => {
    I("source");
  }, i.current = o, c.current = v, l.current = m;
  const w = ha({
    sessionJobId: m,
    sessionIdentity: o,
    sessionIdentityRef: i,
    sessionJobIdRef: l,
    sessionEpochRef: s,
    closingRef: e
  }), {
    scopedJobPayload: P,
    scopedManifestPayload: L,
    jobStatus: E,
    jobTerminal: _,
    jobRefreshRevision: T,
    refreshJobArtifacts: M,
    refreshJobStatus: R
  } = w, S = Da({
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
    switchSessionMode: I,
    jobRefreshRevision: T,
    sessionEpochRef: s,
    closingRef: e,
    activeLoadAbortRef: t
  }), N = x(() => {
    var k;
    e.current = !0, (k = t.current) == null || k.abort();
  }, []), D = q(
    () => ({
      fetchProtected: at.fetchProtected,
      jobId: m,
      jobPayload: P,
      manifestPayload: L,
      sourceUrl: S.sourceUrl,
      translatedUrl: S.translatedUrl,
      sourceOnly: y
    }),
    [m, P, L, S.sourceUrl, S.translatedUrl, y]
  );
  return {
    jobId: m,
    jobStatus: E,
    workflow: `${(P == null ? void 0 : P.workflow) || ""}`.trim().toLowerCase(),
    jobTerminal: _,
    documentId: v,
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
    refreshJobStatus: R,
    refreshCommittedDocument: f.refreshCommittedDocument,
    prepareClose: N
  };
}
const $a = 160, Oa = 8, ja = 960;
function Ua() {
  const e = C(null), [t, n] = A(null), [r, a] = A(ja), o = x((s) => {
    e.current = s, n(s);
  }, []);
  return O(() => {
    const s = t;
    if (!s || typeof ResizeObserver > "u")
      return;
    const i = (l) => {
      !Number.isFinite(l) || l < $a || a((d) => Math.abs(d - l) < Oa ? d : l);
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
function Ba(e) {
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
function Wa(e, t) {
  const {
    mode: n,
    sourceOnly: r,
    assetsReady: a,
    sourceUrl: o,
    translatedUrl: s,
    sourceFile: i,
    translatedFile: c
  } = e, l = `${(t == null ? void 0 : t.identityKey) || ""}\0${o}\0${s}`, d = C(l);
  d.current = l;
  const [u, f] = A(() => ({
    identity: l,
    pages: zt
  })), [m, v] = A(() => ({ identity: l, tick: 0 })), h = u.identity === l ? u.pages : zt, y = m.identity === l ? m.tick : 0, b = Ba({
    mode: n,
    sourceOnly: r,
    assetsReady: a,
    hasSource: !!i || !!o,
    hasTranslated: !!c
  }), { primaryPane: g } = b, I = x((R, S) => {
    d.current === l && f((N) => {
      const D = N.identity === l ? N.pages : zt;
      return D[S] === R && N.identity === l ? N : {
        identity: l,
        pages: { ...D, [S]: R }
      };
    });
  }, [l]), w = C(null), P = x(() => {
    w.current && clearTimeout(w.current);
    const R = l;
    w.current = setTimeout(() => {
      w.current = null, d.current === R && v((S) => ({
        identity: R,
        tick: S.identity === R ? S.tick + 1 : 1
      }));
    }, 60);
  }, [l]);
  O(() => (w.current && (clearTimeout(w.current), w.current = null), f((R) => R.identity === l && R.pages.source === 0 && R.pages.translated === 0 ? R : { identity: l, pages: { source: 0, translated: 0 } }), v((R) => R.identity === l && R.tick === 0 ? R : { identity: l, tick: 0 }), () => {
    w.current && (clearTimeout(w.current), w.current = null);
  }), [l]);
  const L = q(
    () => Math.max(h.source, h.translated),
    [h]
  ), E = g === "translated" ? h.translated : h.source || h.translated, _ = t == null ? void 0 : t.userZoom, T = t == null ? void 0 : t.shellWidth, M = `${l}-${y}-${_}-${n}-${h.source}-${h.translated}-${T}`;
  return {
    ...b,
    numPagesByPane: h,
    hudNumPages: L,
    primaryNumPages: E,
    metricsTick: y,
    onNumPages: I,
    onMetrics: P,
    rowSyncRevision: M
  };
}
const kr = 0.25, Ar = 1, Ha = 0.05, ut = 0.5, Ja = 16, Ka = 8;
function tt(e) {
  return ut;
}
function Ct(e) {
  return Number.isFinite(e) ? Math.min(Ar, Math.max(kr, e)) : ut;
}
function st(e, t) {
  const n = Ct(Number(e) + t * Ha);
  return Math.round(n * 100) / 100;
}
function qa(e) {
  return Math.round(Ct(e) * 100);
}
function Va(e) {
  const n = (Number(e) || 0) - Ja - Ka;
  return Math.max(160, Math.floor(n));
}
function Ga(e, t = ut) {
  const n = Ct(t);
  return Va((Number(e) || 0) * n);
}
function Ya(e, t) {
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
const Za = "retainpdf:reader:view:v1:", Bn = /* @__PURE__ */ new Set([
  "source",
  "translated",
  "markdown",
  "ai"
]), Xa = /* @__PURE__ */ new Set([
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
function Gt(e) {
  return `${e || ""}`.trim();
}
function Qa({
  documentId: e,
  jobId: t
}) {
  const n = Gt(e);
  if (n) return `document:${n}`;
  const r = Gt(t);
  return r ? `job:${r}` : "";
}
function Lr(e) {
  const t = Gt(e);
  return t ? `${Za}${t}` : "";
}
function es(e) {
  if (!e || typeof e != "object") return;
  const t = Math.floor(Number(e.page)), n = Number(e.fraction);
  if (!(!Number.isFinite(t) || t < 1 || !Number.isFinite(n)))
    return {
      page: t,
      fraction: Math.max(0, Math.min(1, n))
    };
}
function ts(e) {
  if (e === null) return null;
  if (!e || typeof e != "object") return;
  const t = `${e.left || ""}`, n = `${e.right || ""}`;
  if (!(!Bn.has(t) || !Bn.has(n) || t === n))
    return { left: t, right: n };
}
function ns(e) {
  return e === null ? null : e === "markdown" || e === "ai" ? e : void 0;
}
function rs(e) {
  return Xa.has(e) ? e : void 0;
}
function zr(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (t.schema !== "retainpdf_reader_view_v1") return null;
  const n = es(t.anchor), r = Number(t.zoom), a = rs(t.mode), o = ts(t.splitLayout), s = ns(t.assistantPanel);
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
function Te(e, t = Cr()) {
  const n = Lr(e);
  if (!n || !t) return null;
  try {
    const r = t.getItem(n);
    return r ? zr(JSON.parse(r)) : null;
  } catch {
    return null;
  }
}
function Tt(e, t, n = Cr()) {
  const r = Lr(e);
  if (!r || !n) return null;
  const a = Te(e, n), o = zr({
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
function os(e, t, n = "") {
  const [r, a] = A(() => {
    var u;
    return ((u = Te(n)) == null ? void 0 : u.zoom) ?? tt();
  }), o = C(r), s = C(n);
  o.current = r;
  const i = C(1);
  O(() => {
    var f;
    if (s.current === n) return;
    s.current = n;
    const u = ((f = Te(n)) == null ? void 0 : f.zoom) ?? tt();
    i.current = 1, o.current = u, a(u);
  }, [e, n]);
  const c = x((u) => {
    const f = Ct(u), m = o.current;
    Math.abs(f - m) < 5e-4 || (i.current = f / (m || 1), Tt(s.current, { zoom: f }), a(f));
  }, []), l = x((u) => {
    c(st(o.current, u));
  }, [c]), d = x((u) => {
    c(tt());
  }, [c]);
  return De(() => {
    const u = i.current;
    Math.abs(u - 1) < 1e-3 || (i.current = 1, Ya(t == null ? void 0 : t.current, u));
  }, [r, t]), { userZoom: r, onZoomChange: c, stepZoom: l, resetZoom: d };
}
function as(e, t = !0) {
  const [n, r] = A(null), a = x(() => {
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
      const h = e.current, y = (k = globalThis.getSelection) == null ? void 0 : k.call(globalThis);
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
      let I = b.commonAncestorContainer;
      I.nodeType === Node.TEXT_NODE && (I = I.parentElement);
      const w = (F = I == null ? void 0 : I.closest) == null ? void 0 : F.call(
        I,
        "[data-reader-page]"
      );
      if (!w || !h.contains(w)) {
        r(null);
        return;
      }
      const P = Math.max(1, Math.floor(Number(w.getAttribute("data-reader-page")) || 1)), E = w.getAttribute("data-reader-pane") === "translated" ? "translated" : "source", _ = b.getClientRects(), T = _[_.length - 1] || b.getBoundingClientRect();
      if (!T || T.width === 0 && T.height === 0) {
        r(null);
        return;
      }
      const M = typeof window < "u" ? window.innerWidth : 800, R = typeof window < "u" ? window.innerHeight : 600, S = 16, N = Math.min(Math.max(S, T.left), M - S), D = Math.min(Math.max(S, T.top), R - S);
      r({
        selectionType: "text",
        quote: g,
        page: P,
        pane: E,
        rect: {
          left: N,
          top: D,
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
function ss(e) {
  const { mode: t, setMode: n, beginModeSwitch: r } = e, a = C(t), o = C(n), s = C(r);
  return a.current = t, o.current = n, s.current = r, { setModeKeepingPage: x((c) => {
    c !== a.current && (s.current(), o.current(c));
  }, []) };
}
function is() {
  const [e, t] = A(null), n = x((s) => {
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
const Mt = "data-reader-page", cs = "data-reader-pane", ls = "reader-react-scroll-shell", pn = "reader-react-pdf-page-slot";
function Et(e, t) {
  const n = e != null ? `[${Mt}="${e}"]` : `[${Mt}]`;
  return t ? `${n}[${cs}="${t}"]` : n;
}
function us() {
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
function ds(e, t, n = "smooth", r) {
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
function fs(e, t, n) {
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
function ms(e, t, n = !0, r = "", a) {
  const [o, s] = A(1);
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
      const y = Dr(i), b = Fr(h, y);
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
const ps = "canvas, .react-pdf__Page, .reader-react-pdf-page, .reader-react-pdf-page-placeholder", Wn = /* @__PURE__ */ new WeakMap();
function hs(e) {
  const t = Number(e.getAttribute("data-natural-height"));
  if (Number.isFinite(t) && t > 0)
    return t;
  let n = Wn.get(e);
  if ((n == null || !n.isConnected) && (n = e.querySelector(ps), Wn.set(e, n)), n) {
    const a = n.getBoundingClientRect().height;
    if (Number.isFinite(a) && a > 0)
      return a;
  }
  const r = e.getBoundingClientRect().height;
  return Number.isFinite(r) && r > 0 ? r : 0;
}
function gs(e, t) {
  if (e.size !== t.size) return !1;
  for (const [n, r] of t)
    if (e.get(n) !== r) return !1;
  return !0;
}
function bs(e) {
  const t = /* @__PURE__ */ new Map();
  e.querySelectorAll(us()).forEach((r) => {
    const a = _r(r);
    if (!Number.isFinite(a) || a < 1) return;
    const o = hs(r);
    if (o <= 0) return;
    const s = t.get(a) || { height: 0, count: 0 };
    s.height = Math.max(s.height, o), s.count += 1, t.set(a, s);
  });
  const n = /* @__PURE__ */ new Map();
  return t.forEach((r, a) => {
    r.count >= 2 && r.height > 0 && n.set(a, Math.ceil(r.height));
  }), n;
}
function ys(e, t, n = "", r) {
  const [a, o] = A(() => /* @__PURE__ */ new Map()), s = C(a), i = C(r);
  return i.current = r, De(() => {
    if (!t) {
      s.current.size !== 0 && (s.current = /* @__PURE__ */ new Map(), o(s.current));
      return;
    }
    let c = !1, l = 0, d = !1, u = !1;
    const f = () => {
      var P;
      if (c) return;
      const I = e.current;
      if (!I) return;
      const w = bs(I);
      gs(s.current, w) || (s.current = w, o(w)), d && !u && (u = !0, (P = i.current) == null || P.call(i));
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
const vs = [0, 48, 140, 320, 560], ws = 700, Ss = [80, 200, 400], Is = 500, Ps = 50, Rs = 180, Hn = [0, 48, 140, 320, 700, 1200];
function Ts(e, t) {
  var R;
  const {
    primaryPane: n,
    mode: r,
    enabled: a = !0,
    persistenceKey: o = "",
    restoreReady: s = !0
  } = t, i = C(
    ((R = Te(o)) == null ? void 0 : R.anchor) || { page: 1, fraction: 0 }
  ), c = C(null), l = C(!1), d = C(r), u = C(null), f = C(null), m = C(null), v = C(null), h = C(o), y = C(""), b = C(n);
  b.current = n;
  const g = x(() => {
    var S;
    (S = u.current) == null || S.call(u), u.current = null, f.current != null && (clearTimeout(f.current), f.current = null);
  }, []), I = x((S = !1) => {
    v.current != null && (clearTimeout(v.current), v.current = null);
    const N = () => {
      v.current = null, Tt(h.current, {
        anchor: ge(i.current)
      });
    };
    S ? N() : v.current = setTimeout(N, Rs);
  }, []), w = x((S) => {
    i.current = ge(S), c.current = null, m.current != null && clearTimeout(m.current), m.current = setTimeout(() => {
      m.current = null, l.current = !1;
    }, Ps);
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
        Z && (i.current = Z, I());
      }, N.addEventListener("scroll", D, { passive: !0 }), l.current || D();
    };
    return F(), () => {
      S = !0, k != null && clearTimeout(k), N && D && N.removeEventListener("scroll", D);
    };
  }, [a, r, n, e, I]), De(() => {
    var N;
    if (h.current === o) return;
    I(!0), g(), m.current != null && (clearTimeout(m.current), m.current = null), h.current = o, y.current = "";
    const S = (N = Te(o)) == null ? void 0 : N.anchor;
    i.current = S ? ge(S) : { page: 1, fraction: 0 }, c.current = null, l.current = !!o, d.current = r;
  }, [o, r, I, g]), O(() => {
    var N;
    if (!a || !s || !o || y.current === o) return;
    y.current = o;
    const S = ge(
      ((N = Te(o)) == null ? void 0 : N.anchor) || { page: 1, fraction: 0 }
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
        delaysMs: vs,
        onDone: () => w(S)
      }
    ), f.current = setTimeout(() => {
      f.current = null, w(S);
    }, ws), () => {
      g();
    };
  }, [r, a, n, e, w, g]), O(() => () => {
    g(), m.current != null && (clearTimeout(m.current), m.current = null), I(!0);
  }, [g, I]);
  const P = x(() => {
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
    return i.current = N, c.current = N, I(), N;
  }, [e, I]), E = x((S, N, D) => {
    const k = D || b.current, F = xt(S, N || 1), B = { page: F, fraction: 0 };
    i.current = B, l.current = !0, c.current = B, I(), g(), ds(e.current, F, "smooth", k), u.current = fs(
      () => e.current,
      F,
      {
        behavior: "auto",
        pane: k,
        delaysMs: Ss,
        onDone: () => w(B)
      }
    ), f.current = setTimeout(() => {
      f.current = null, w(B);
    }, Is);
  }, [e, w, g, I]), _ = x(() => ge(i.current), []), T = x(() => l.current, []), M = x(() => {
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
    lockFromShell: P,
    beginModeSwitch: L,
    goToPage: E,
    getAnchor: _,
    isRestoring: T,
    repinIfRestoring: M
  };
}
function Ms(e, t) {
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
function Es(e, t, n) {
  const r = `${(n == null ? void 0 : n.jobId) || ""}`.trim(), a = `${(n == null ? void 0 : n.documentId) || ""}`.trim(), o = `j:${r}:d:${a}`;
  return t == null ? `${o}:none:${(e == null ? void 0 : e.blockId) || ""}` : `${o}:p:${t}:b:${(e == null ? void 0 : e.blockId) || ""}`;
}
const xs = [0, 80, 200, 400, 800];
function Ns(e) {
  const { enabled: t, numPages: n, goToPage: r, resolveBlockPage: a, onAnchorApplied: o, jobId: s, documentId: i } = e, c = C(""), l = C(r);
  l.current = r;
  const d = C(a);
  d.current = a;
  const u = C(o);
  u.current = o, O(() => {
    var y;
    if (!t || !Number.isFinite(n) || n < 1)
      return;
    const f = Zo(), m = Ms(f, d.current), v = Es(f, m, { jobId: s, documentId: i });
    if (c.current === v)
      return;
    if (m == null) {
      c.current = v;
      return;
    }
    c.current = v, f && ((y = u.current) == null || y.call(u, f, m));
    const h = [];
    for (const b of xs)
      h.push(
        setTimeout(() => {
          l.current(m);
        }, b)
      );
    return () => {
      for (const b of h) clearTimeout(b);
    };
  }, [t, n, s, i]);
}
const ht = {
  layoutByPage: /* @__PURE__ */ new Map(),
  pagesByPage: /* @__PURE__ */ new Map(),
  lastSeq: 0,
  connection: "idle",
  jobStatus: "",
  error: ""
};
function ks(e) {
  return new Map(((e == null ? void 0 : e.pages) || []).map((t) => [t.page_idx, t]));
}
function Jn(e, t) {
  return e.attempt !== t.attempt ? e.attempt < t.attempt ? -1 : 1 : e.generation !== t.generation ? e.generation < t.generation ? -1 : 1 : 0;
}
function $r(e, t, n) {
  if (n.page_idx !== t.page_idx) return "retry";
  const r = Jn(n, t);
  if (r < 0 || r === 0 && n.page_hash !== t.page_hash) return "retry";
  if (!e) return "accept";
  const a = Jn(n, e);
  return a < 0 ? "ignore" : a === 0 ? n.page_hash === e.pageHash ? "ignore" : "retry" : "accept";
}
function As(e, t, n) {
  if (t.seq <= e.lastSeq) return e;
  const r = e.pagesByPage.get(t.page_idx), a = $r(r, t, n);
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
const Kn = [250, 500, 1e3, 2e3, 4e3], Dt = [80, 160, 320, 640, 1e3, 1500], qn = [250, 500, 1e3, 2e3, 4e3, 5e3], Cs = /* @__PURE__ */ new Set(["succeeded", "failed", "cancelled", "canceled"]);
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
async function Ls(e, t, n, r) {
  let a = null;
  for (let o = 0; ; o += 1) {
    try {
      const i = await xo(e, t.page_idx, { signal: r });
      if ($r(n.pagesByPage.get(t.page_idx), t, i) !== "retry")
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
function zs({
  jobId: e,
  jobStatus: t,
  enabled: n
}) {
  const [r, a] = A(ht), o = C(r), s = C("");
  o.current = r;
  const i = `${e || ""}`.trim(), c = `${t || ""}`.trim().toLowerCase(), l = Cs.has(c) ? c : "";
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
    const v = (b) => {
      u.signal.aborted || a((g) => {
        const I = b(g);
        return o.current = I, I;
      });
    }, h = async () => {
      let b = 0;
      for (; !u.signal.aborted; )
        try {
          const g = await Mo(i, { signal: u.signal });
          f = !0, v((I) => ({
            ...I,
            layoutByPage: ks(g),
            jobStatus: c,
            error: ""
          }));
          return;
        } catch (g) {
          if ((g == null ? void 0 : g.name) === "AbortError") return;
          if (!(g instanceof It && g.code === "LIVE_TRANSLATION_LAYOUT_NOT_READY")) {
            v((w) => ({
              ...w,
              connection: l ? "terminal" : "unavailable",
              jobStatus: c,
              error: Ft(g, "实时译文暂不可用")
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
            error: Ft(g, "正在等待 OCR 版面数据")
          })), await Zt(Kn[Math.min(b, Kn.length - 1)], u.signal).catch(() => {
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
          await Eo(i, {
            afterSeq: o.current.lastSeq,
            signal: u.signal,
            onEvent: async (g) => {
              if (g.seq <= o.current.lastSeq) return;
              const I = await Ls(
                i,
                g,
                o.current,
                u.signal
              );
              v((w) => {
                const P = As(w, g, I);
                return l ? {
                  ...P,
                  connection: "terminal",
                  jobStatus: c
                } : {
                  ...P,
                  jobStatus: c
                };
              }), b = 0;
            }
          });
        } catch (g) {
          if ((g == null ? void 0 : g.name) === "AbortError" || u.signal.aborted) return;
          v((I) => ({
            ...I,
            connection: l ? "terminal" : "reconnecting",
            jobStatus: c,
            error: Ft(g, "实时译文连接已中断，正在重连")
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
        await Zt(qn[Math.min(b, qn.length - 1)], u.signal).catch(() => {
        }), b += 1;
      }
    })(), () => u.abort();
  }, [n, i, l]), r;
}
const _s = 2e3;
function Ds(e) {
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
const Fs = /* @__PURE__ */ new Set(["book", "translate"]);
function Or(e) {
  return !!(e.jobId && e.sourceUrl && Fs.has(e.workflow));
}
function $s(e) {
  return !!(Or(e) && !(e.jobStatus === "succeeded" && e.translatedUrl));
}
function Os() {
  const e = Fa(), t = Or({
    jobId: e.jobId,
    sourceUrl: e.sourceUrl,
    workflow: e.workflow
  }), n = $s({
    jobId: e.jobId,
    sourceUrl: e.sourceUrl,
    translatedUrl: e.translatedUrl,
    jobStatus: e.jobStatus,
    workflow: e.workflow
  }), r = zs({
    jobId: e.jobId,
    jobStatus: e.jobStatus,
    enabled: t
  }), a = is(), { shellRef: o, shellEl: s, shellWidth: i, bindShell: c } = Ua(), l = Qa({
    documentId: e.documentId,
    jobId: e.jobId
  }), d = `${l}\0${e.jobId}\0${e.sourceUrl}\0${e.translatedUrl}`, { userZoom: u, onZoomChange: f } = os(e.mode, o, l), m = Wa(
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
  } = Ts(o, {
    primaryPane: m.primaryPane,
    mode: e.mode,
    enabled: !e.boot.loading,
    persistenceKey: l,
    restoreReady: m.primaryNumPages > 0
  });
  O(() => {
    y();
  }, [i, y]);
  const b = ys(
    o,
    m.compareMode,
    m.rowSyncRevision,
    y
  ), g = ms(
    o,
    m.primaryNumPages,
    !e.boot.loading,
    `${e.mode}-${u}-${m.metricsTick}`,
    m.primaryPane
  ), I = x((j, J) => {
    var ne, le;
    const oe = Math.max(
      Number(m.hudNumPages) || 0,
      Number(m.primaryNumPages) || 0,
      Number((ne = m.numPagesByPane) == null ? void 0 : ne.source) || 0,
      Number((le = m.numPagesByPane) == null ? void 0 : le.translated) || 0
    );
    h(j, oe, J);
  }, [h, m.hudNumPages, m.primaryNumPages, m.numPagesByPane]), [w, P] = A(null), L = C(null), E = x((j) => {
    L.current && clearTimeout(L.current), P(j), j && (L.current = setTimeout(() => P(null), _s));
  }, []);
  O(() => () => {
    L.current && clearTimeout(L.current);
  }, []);
  const _ = x((j) => {
    const J = vt(e.regions, j);
    return J ? Rt(J, m.primaryPane).page : null;
  }, [e.regions, m.primaryPane]), T = x((j, J) => {
    const oe = J || m.primaryPane, ne = typeof j == "object" && j ? `${j.block_id || ""}`.trim() : "", le = typeof j == "object" && j ? `${j.image_url || ""}`.trim() : "", U = typeof j == "object" && j ? j.page_idx != null ? Number(j.page_idx) + 1 : j.page != null ? Number(j.page) : null : typeof j == "number" ? j + 1 : null, ae = Ta(e.regions, le, U) || vt(e.regions, ne) || (typeof j == "object" ? Ra(e.regions, j) : null);
    let pe = ae ? Rt(ae, oe).page : null;
    pe == null && (pe = Ds(j)), !(pe == null || pe < 1) && (E(ae), I(pe, oe));
  }, [E, I, m.primaryPane, e.regions]);
  Ns({
    enabled: !e.boot.loading && !e.boot.failed && e.assetsReady,
    numPages: m.hudNumPages || 0,
    goToPage: I,
    resolveBlockPage: _,
    jobId: e.jobId,
    documentId: e.documentId,
    onAnchorApplied: (j) => {
      E(vt(e.regions, j.blockId));
    }
  });
  const { setModeKeepingPage: M } = ss({
    mode: e.mode,
    setMode: e.setMode,
    beginModeSwitch: v
  }), [R, S] = A(null), {
    selection: N,
    clearSelection: D
  } = as(o, !e.boot.loading && !e.boot.failed), k = x(() => {
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
  const B = N || R;
  O(() => {
    E(null), k();
  }, [d, E, k]);
  const Z = !e.boot.loading && !e.boot.failed, Q = q(() => a, [a.active, a.open, a.close, a.toggle, a.isOpen]), X = q(() => ({ bindShell: c, shellEl: s, shellWidth: i, shellRef: o }), [c, s, i, o]), re = q(() => ({
    sourceUrl: e.sourceUrl,
    translatedUrl: e.translatedUrl,
    sourceFile: e.sourceFile,
    translatedFile: e.translatedFile
  }), [e.sourceUrl, e.translatedUrl, e.sourceFile, e.translatedFile]), ce = q(() => ({
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
    goToPage: I,
    activeRegion: w,
    jumpToAnchor: T,
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
  }), [e, X, m, re, b, I, w, T, M, Z, Q, B, k, F, u, f, l, r, n]);
  return q(() => ({
    ...ce,
    currentPage: g
  }), [ce, g]);
}
const js = [
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
], Us = [
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
function Bs(e) {
  const t = e.length === 1 ? e.toLowerCase() : e;
  for (const n of js)
    if (n.keys.some(
      (a) => a.length === 1 ? a === t : a === e
    )) return n;
  return null;
}
function Ws(e) {
  if (!(e instanceof HTMLElement))
    return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function Hs(e) {
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
      if (u.defaultPrevented || u.metaKey || u.ctrlKey || u.altKey || Ws(u.target))
        return;
      const f = u.key, m = Bs(f);
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
const Js = "retainpdf:soft-reader-close";
function Ks() {
  return new URL("./index.html", window.location.href).href;
}
function qs() {
  if (typeof window > "u" || window.self === window.top) return !1;
  try {
    return window.parent.postMessage(
      { type: Js },
      window.location.origin
    ), !0;
  } catch {
    return !1;
  }
}
function Vs(e, t, n) {
  if (n <= 1 || !e) return !1;
  try {
    const r = new URL(t), a = new URL(e, r);
    return a.origin === r.origin && !/reader\.html$/i.test(a.pathname) && !/detail\.html$/i.test(a.pathname);
  } catch {
    return !1;
  }
}
function Gs() {
  if (!(typeof window > "u") && !qs()) {
    if (Vs(
      document.referrer,
      window.location.href,
      window.history.length
    )) {
      window.history.back();
      return;
    }
    window.location.assign(Ks());
  }
}
function Ys({ onBeforeClose: e } = {}) {
  return /* @__PURE__ */ z(
    "button",
    {
      id: "reader-close-home-btn",
      type: "button",
      className: "reader-close-home-btn",
      "aria-label": "返回主页",
      title: "返回主页",
      onClick: () => {
        e == null || e(), Gs();
      },
      children: [
        /* @__PURE__ */ p(qe, { className: "reader-close-home-icon", size: 18, strokeWidth: 2.25, "aria-hidden": !0 }),
        /* @__PURE__ */ p("span", { className: "reader-close-home-label", children: "关闭" })
      ]
    }
  );
}
let Vn = !1;
function Zs() {
  if (Vn)
    return;
  const e = Ht("build/pdf.worker.mjs");
  e && (Uo.GlobalWorkerOptions.workerSrc = e, Vn = !0);
}
const Xs = {
  formula: "公式",
  table: "表格",
  figure: "图片",
  text: "文字",
  region: "区域"
};
function Qs({
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
    const c = s.region, l = mn(c), d = Xs[l];
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
function ei(e, t, n) {
  return e.flatMap((r) => {
    if (mn(r.region) !== "text") return [];
    const a = At(r, t, n);
    return a ? [{ itemId: r.itemId, highlight: r, rect: a }] : [];
  });
}
function Gn(e, t, n) {
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
function ti({ target: e }) {
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
function ni(e, t) {
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
function ri(e, t, n, r) {
  if (!e || !t) return [];
  const a = [];
  for (const o of e.blocks) {
    const s = t.itemsById.get(o.item_id);
    if (!(s != null && s.translated_text)) continue;
    const i = At(
      ni(e, o),
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
const oi = '"Source Han Serif SC", "Noto Serif CJK SC", "Songti SC", serif', ai = 256, Ze = /* @__PURE__ */ new Map();
function si(e) {
  return `${e || ""}`.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function ii(e) {
  const t = `${e || ""}`, { text: n, slots: r } = Ho(t), a = si(n), o = Jo(a, r);
  if (!r.length)
    return { fallbackHtml: o, richHtml: Promise.resolve(o), hasMath: !1 };
  let s = Ze.get(t);
  if (!s && (s = Ko(a, r), Ze.set(t, s), Ze.size > ai)) {
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
function ci(e, t) {
  const n = e.typography, r = Pe(t) || 1, a = Pe(n == null ? void 0 : n.font_size_pt), o = Math.max(1, `${e.sourceText || ""}`.split(/\n+/).length), s = e.rect.height / Math.max(1.28, o * 1.18), i = $t(e.kind) ? 24 : /caption|footnote|table/i.test(e.kind) ? 9.5 : 11, c = Math.max(5.5 * r, Math.min(s, i * r)), l = Pe(n == null ? void 0 : n.fit_min_font_size_pt), d = Pe(n == null ? void 0 : n.fit_max_font_size_pt), u = Math.max(3.5, (l || 5.5) * r), f = Math.max(
    u,
    d ? d * r : a ? a * r : c
  ), m = a ? a * r : c, v = Pe(n == null ? void 0 : n.leading_em), h = [
    Pe(n == null ? void 0 : n.padding_top_pt) || 0,
    Pe(n == null ? void 0 : n.padding_right_pt) || 0,
    Pe(n == null ? void 0 : n.padding_bottom_pt) || 0,
    Pe(n == null ? void 0 : n.padding_left_pt) || 0
  ].map((y) => y * r);
  return {
    fontFamily: `${(n == null ? void 0 : n.font_family) || ""}`.trim() || oi,
    fontSizePx: Math.max(u, Math.min(f, m)),
    minFontSizePx: u,
    maxFontSizePx: f,
    // Typst leading is the additional inter-line gap, unlike CSS line-height.
    lineHeight: v ? 1 + v : 1.3,
    fontWeight: (n == null ? void 0 : n.font_weight) || ($t(e.kind) ? 600 : 400),
    textAlign: (n == null ? void 0 : n.text_align) || ($t(e.kind) ? "center" : "justify"),
    padding: h,
    exact: !!a
  };
}
function li(e, t, n, r) {
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
const ui = 512, Xe = /* @__PURE__ */ new Map();
let Xt = 0;
typeof document < "u" && document.fonts && (document.fonts.ready.then(() => {
  Xt += 1;
}).catch(() => {
}), typeof document.fonts.addEventListener == "function" && document.fonts.addEventListener("loadingdone", () => {
  Xt += 1;
}));
function di(e, t, n, r) {
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
function fi({ item: e, pageScale: t }) {
  const n = C(null), r = q(
    () => ii(e.translatedText),
    [e.translatedText]
  ), [a, o] = A(r.fallbackHtml), s = q(
    () => ci(e, t),
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
    const [f, m, v, h] = s.padding, y = Math.max(1, e.rect.width - h - m), b = Math.max(1, e.rect.height - f - v), g = di(a, y, b, s);
    let I = Xe.get(g);
    if (I === void 0 && (I = li(
      (w) => (u.style.fontSize = `${w}px`, { width: u.scrollWidth, height: u.scrollHeight }),
      y,
      b,
      {
        minFontSizePx: s.minFontSizePx,
        maxFontSizePx: s.maxFontSizePx,
        requestedFontSizePx: s.fontSizePx,
        exact: s.exact
      }
    ), Xe.set(g, I), Xe.size > ui)) {
      const w = Xe.keys().next().value;
      w !== void 0 && Xe.delete(w);
    }
    u.style.fontSize = `${I.toFixed(2)}px`;
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
function mi({
  layoutPage: e,
  pageState: t,
  width: n,
  height: r
}) {
  const a = q(
    () => ri(e, t, n, r),
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
        fi,
        {
          item: o,
          pageScale: e != null && e.width ? n / e.width : 1
        },
        `${o.itemId}:${o.changedAtSeq}`
      ))
    }
  ) : null;
}
const pi = on(mi), jr = 1.414;
function hi({
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
  const y = C(i ?? jr), [b, g] = A(y.current);
  O(() => {
    i != null && Math.abs(i - y.current) >= 1e-3 && (y.current = i, g(i));
  }, [i]);
  const I = C(l);
  I.current = l;
  const w = C((k) => {
    var F;
    (F = I.current) == null || F.call(I, k);
  }).current, P = Math.max(120, Math.floor(t * b)), L = Math.max(P, Math.ceil(o || 0)), E = At(d, t, P), _ = q(
    () => ei(u, t, P),
    [P, u, t]
  ), [T, M] = A(null), R = q(
    () => _.find((k) => k.itemId === T) || null,
    [T, _]
  ), S = (k) => {
    if (k.buttons !== 0) {
      M(null);
      return;
    }
    const F = k.currentTarget.getBoundingClientRect(), B = Gn(
      _,
      k.clientX - F.left,
      k.clientY - F.top
    ), Z = (B == null ? void 0 : B.itemId) || null;
    M((Q) => Q === Z ? Q : Z);
  }, N = (k) => {
    var Z, Q, X;
    if (!f || (Q = (Z = k.target) == null ? void 0 : Z.closest) != null && Q.call(Z, ".reader-structure-selection-target") || `${((X = window.getSelection()) == null ? void 0 : X.toString()) || ""}`.trim()) return;
    const F = k.currentTarget.getBoundingClientRect(), B = Gn(
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
    !Number.isFinite(k) || k <= 0 || Math.abs(y.current - k) < 1e-3 || (y.current = k, g(k), c == null || c(e, k));
  };
  return /* @__PURE__ */ z(
    "div",
    {
      ref: w,
      "data-reader-page": e,
      "data-reader-pane": r,
      "data-natural-height": P,
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
          Bo,
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
                style: { width: t, height: P }
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
            style: { width: t, height: P },
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
          pi,
          {
            layoutPage: m,
            pageState: v,
            width: t,
            height: P
          }
        ) : null,
        /* @__PURE__ */ p(ti, { target: a ? R : null }),
        /* @__PURE__ */ p(
          Qs,
          {
            pane: r === "translated" ? "translated" : "source",
            width: t,
            height: P,
            regions: u,
            onSelect: f
          }
        )
      ]
    }
  );
}
const gi = on(hi), Ot = 5, bi = "120% 0px", yi = 120;
let Yn = 1;
const Zn = /* @__PURE__ */ new WeakMap();
function vi(e) {
  if (!e) return 0;
  const t = Zn.get(e);
  if (t) return t;
  const n = Yn;
  return Yn += 1, Zn.set(e, n), n;
}
function wi() {
  const e = typeof window < "u" && window.devicePixelRatio || 1;
  return Math.max(1, Math.min(e, 2));
}
const Si = po(
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
    showLiveTranslation: I = t === "source",
    liveTranslationPendingLabel: w = ""
  }, P) {
    Zs();
    const { file: L, loading: E, error: _ } = La(n, r), T = `${n}\0${vi(L)}`, M = C(T);
    M.current = T;
    const R = q(
      () => ka(L),
      [L, n]
    ), [S, N] = A(0), [D, k] = A(""), [F, B] = A(null), [Z, Q] = A(480), X = C(null), re = C(0), ce = q(() => wi(), []), j = q(() => ({
      cMapUrl: Ht("cmaps/"),
      cMapPacked: !0,
      standardFontDataUrl: Ht("standard_fonts/")
    }), []);
    an(P, () => F, [F]), O(() => {
      const $ = (W) => {
        !Number.isFinite(W) || W < 80 || Math.abs(W - re.current) < 8 || (re.current = W, Q(W));
      }, G = c && c >= 80 ? c : (i == null ? void 0 : i.clientWidth) || 0;
      if ($(G), !i || typeof ResizeObserver > "u" || c && c >= 80) return;
      const H = new ResizeObserver((W) => {
        var ee, te;
        const se = ((te = (ee = W[0]) == null ? void 0 : ee.contentRect) == null ? void 0 : te.width) ?? i.clientWidth;
        !Number.isFinite(se) || se < 80 || (X.current && clearTimeout(X.current), X.current = setTimeout(() => $(se), 80));
      });
      return H.observe(i), () => {
        H.disconnect(), X.current && clearTimeout(X.current);
      };
    }, [c, i, o]);
    const J = q(
      () => Ga(Z, a),
      [Z, a]
    ), [oe, ne] = A(() => /* @__PURE__ */ new Map()), [le, U] = A(() => /* @__PURE__ */ new Set()), [ae, pe] = A(() => /* @__PURE__ */ new Set()), V = C(/* @__PURE__ */ new Map()), K = C(null), me = C(/* @__PURE__ */ new Map()), Ee = x(($, G) => {
      ne((H) => {
        if (H.get($) === G) return H;
        const W = new Map(H);
        return W.set($, G), W;
      });
    }, []), he = x(($, G) => {
      const H = V.current, W = H.get($);
      if (W && K.current)
        try {
          K.current.unobserve(W);
        } catch {
        }
      if (G) {
        if (H.set($, G), K.current)
          try {
            K.current.observe(G);
          } catch {
          }
      } else
        H.delete($);
    }, []), Ve = C(/* @__PURE__ */ new Map()), ft = x(($) => {
      const G = Ve.current;
      let H = G.get($);
      return H || (H = (W) => he($, W), G.set($, H)), H;
    }, [he]);
    O(() => {
      if (typeof IntersectionObserver > "u") return;
      const $ = me.current, G = new IntersectionObserver(
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
            }, yi));
        },
        { root: i, rootMargin: bi, threshold: 0 }
      );
      K.current = G;
      for (const H of V.current.values())
        try {
          G.observe(H);
        } catch {
        }
      return () => {
        G.disconnect(), K.current === G && (K.current = null);
        for (const H of $.values()) clearTimeout(H);
        $.clear();
      };
    }, [i]), De(() => {
      N(0), k(""), U(/* @__PURE__ */ new Set()), pe(/* @__PURE__ */ new Set()), ne(/* @__PURE__ */ new Map()), V.current.clear();
      const $ = me.current;
      for (const G of $.values()) clearTimeout(G);
      $.clear(), m == null || m(0, t);
    }, [T, m, t]);
    const mt = x(
      ({ numPages: $ }) => {
        M.current === T && (N($), k(""), m == null || m($, t), u == null || u({ numPages: $, pane: t }));
      },
      [T, u, m, t]
    ), Ge = x(
      ($) => {
        if (M.current !== T) return;
        const G = ($ == null ? void 0 : $.message) || "PDF 解析失败";
        k(G), N(0), m == null || m(0, t), f == null || f($, t);
      },
      [T, f, m, t]
    ), we = q(
      () => S > 0 ? Array.from({ length: S }, ($, G) => G + 1) : [],
      [S]
    );
    O(() => {
      typeof IntersectionObserver < "u" || pe(new Set(we));
    }, [we]);
    const Se = q(
      () => jn(v, y, t),
      [v, y, t]
    ), lo = q(() => {
      const $ = /* @__PURE__ */ new Map();
      for (const G of h) {
        const H = jn(G, y, t);
        if (!H) continue;
        const W = $.get(H.box.page) || [];
        W.push(H), $.set(H.box.page, W);
      }
      return $;
    }, [t, y, h]), uo = q(() => {
      if (S === 0) return /* @__PURE__ */ new Set();
      if (!(!!i && typeof IntersectionObserver < "u" && o)) return new Set(we);
      if (le.size === 0) {
        const H = Math.min(S, Ot * 2 + 1);
        return new Set(Array.from({ length: H }, (W, se) => se + 1));
      }
      const G = /* @__PURE__ */ new Set();
      for (const H of le)
        for (let W = -Ot; W <= Ot; W++) {
          const se = H + W;
          se >= 1 && se <= S && G.add(se);
        }
      return G;
    }, [S, we, i, o, le]), fo = !n || !!_ || !!D, mo = n && (_ || D) || s;
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
          fo && !E ? /* @__PURE__ */ p("div", { className: "reader-empty reader-react-pdf-empty", "data-reader-pdf-empty": t, children: mo }) : null,
          E ? /* @__PURE__ */ p("div", { className: "reader-empty reader-react-pdf-loading", "data-reader-pdf-loading": t, children: "正在加载 PDF…" }) : null,
          R && !_ ? /* @__PURE__ */ p("div", { className: "reader-viewer-wrap reader-react-pdf-wrap", children: /* @__PURE__ */ p(
            Wo,
            {
              file: R,
              loading: null,
              error: null,
              options: j,
              onLoadSuccess: mt,
              onLoadError: Ge,
              className: "reader-react-pdf-document",
              children: we.map(($) => {
                if (uo.has($))
                  return /* @__PURE__ */ p(
                    gi,
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
                      regionTargets: lo.get($),
                      onSelectRegion: b,
                      liveTranslationLayout: g == null ? void 0 : g.layoutByPage.get($ - 1),
                      liveTranslationPage: g == null ? void 0 : g.pagesByPage.get($ - 1),
                      showLiveTranslation: I
                    },
                    `${t}-${$}`
                  );
                const H = oe.get($) ?? jr, W = Math.max(120, Math.floor(J * H)), se = Math.max(W, Math.ceil((l == null ? void 0 : l.get($)) || 0));
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
            T
          ) }) : null
        ]
      }
    );
  }
), Xn = on(Si), Ur = sn(null), Br = sn(null);
function Ii({ value: e, hud: t, children: n }) {
  return /* @__PURE__ */ p(Ur.Provider, { value: e, children: /* @__PURE__ */ p(Br.Provider, { value: t, children: n }) });
}
function dt() {
  return cn(Ur);
}
function Pi() {
  return cn(Br);
}
function Ri({
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
function Ti(e, t, n = e * 2) {
  return t ? Math.min(e * 2, n) : e;
}
function Mi(e) {
  return e ? e.connection === "terminal" && e.jobStatus === "failed" ? e.pagesByPage.size > 0 ? `翻译已暂停，已保留 ${e.pagesByPage.size} 页译文` : "翻译已暂停，原始 PDF 仍可阅读" : e.connection === "terminal" && ["cancelled", "canceled"].includes(e.jobStatus) ? e.pagesByPage.size > 0 ? `翻译已取消，已保留 ${e.pagesByPage.size} 页译文` : "翻译已取消，原始 PDF 仍可阅读" : e.pagesByPage.size > 0 ? "" : e.connection === "unavailable" ? e.error || "实时译文暂不可用，原始 PDF 仍可阅读" : e.error ? e.error : e.layoutByPage.size === 0 ? "正在完成 OCR，译文将在这里逐页出现" : "版面已就绪，正在等待首个译文页面" : "";
}
function Ei(e) {
  const t = dt(), {
    mode: n = "compare",
    markdownSplit: r = !1,
    assistantSplit: a = !1,
    liveTranslation: o,
    liveTranslationPair: s = !1
  } = e, i = e.compareMode ?? n === "compare", c = e.showSource ?? !0, l = e.showTranslated ?? (n === "compare" || n === "translated"), d = e.bindShell ?? (t == null ? void 0 : t.bindShell), u = e.shellEl ?? (t == null ? void 0 : t.shellEl) ?? null, f = e.userZoom ?? (t == null ? void 0 : t.userZoom) ?? ut, m = e.shellWidth ?? (t == null ? void 0 : t.shellWidth) ?? 0, v = e.rowHeights ?? (t == null ? void 0 : t.rowHeights), h = e.mountSource ?? (t == null ? void 0 : t.mountSource) ?? !1, y = e.mountTranslated ?? (t == null ? void 0 : t.mountTranslated) ?? !1, b = e.sourceOnly ?? (t == null ? void 0 : t.sourceViewOnly) ?? !1, g = e.sourceUrl ?? (t == null ? void 0 : t.sourceUrl) ?? "", I = e.translatedUrl ?? (t == null ? void 0 : t.translatedUrl) ?? "", w = e.sourceFile ?? (t == null ? void 0 : t.sourceFile) ?? null, P = e.translatedFile ?? (t == null ? void 0 : t.translatedFile) ?? null, L = e.onMetrics ?? (t == null ? void 0 : t.onMetrics), E = e.onNumPagesChange ?? (t == null ? void 0 : t.onNumPagesChange), _ = e.activeRegion ?? (t == null ? void 0 : t.activeRegion), T = e.regions ?? (t == null ? void 0 : t.regions) ?? [], M = e.readerMetadata ?? (t == null ? void 0 : t.readerMetadata), R = e.onSelectRegion ?? (t == null ? void 0 : t.onSelectRegion), S = Ri({
    mode: n,
    compareMode: i,
    showSource: c,
    showTranslated: l,
    markdownSplit: r,
    liveTranslationPair: s
  }), N = Ti(
    m,
    r || a,
    typeof document > "u" ? m * 2 : document.documentElement.clientWidth
  );
  return /* @__PURE__ */ p(
    "div",
    {
      ref: d,
      className: ls,
      "data-reader-scroll-shell": "true",
      "data-reader-region-count": T.length,
      "data-reader-structured-region-count": T.filter(Er).length,
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
                rowHeights: S.compareMode ? v : void 0,
                onMetrics: L,
                emptyLabel: b ? "源文件不可用：该文档没有可读取的源 PDF。" : "暂无原文 PDF",
                onNumPagesChange: E,
                activeRegion: _,
                regions: T,
                readerMetadata: M,
                onSelectRegion: R,
                liveTranslation: s ? void 0 : o,
                showLiveTranslation: !s
              }
            ) : null,
            y || s ? /* @__PURE__ */ p(
              Xn,
              {
                pane: "translated",
                url: s ? g : I,
                preloadedFile: s ? w : P,
                userZoom: f,
                visible: S.showTranslated,
                scrollRoot: u,
                pageWidthOverride: N,
                rowHeights: S.compareMode ? v : void 0,
                onMetrics: L,
                emptyLabel: "暂无译文 PDF",
                onNumPagesChange: E,
                activeRegion: _,
                regions: T,
                readerMetadata: M,
                onSelectRegion: R,
                liveTranslation: s ? o : void 0,
                showLiveTranslation: s,
                liveTranslationPendingLabel: s ? Mi(o) : ""
              }
            ) : null
          ]
        }
      )
    }
  );
}
const xi = [
  { id: "source", label: "源文件", Icon: Sr },
  { id: "compare", label: "对照", Icon: Ir },
  { id: "translated", label: "翻译文件", Icon: Pr }
];
function Ni(e) {
  return e.connection === "live" ? `实时译文 · ${e.pagesByPage.size} 页` : e.connection === "reconnecting" ? "实时译文 · 重连中" : e.connection === "unavailable" ? "实时译文 · 不可用" : e.connection === "terminal" ? e.jobStatus === "failed" ? "实时译文 · 已暂停" : e.jobStatus === "cancelled" || e.jobStatus === "canceled" ? "实时译文 · 已取消" : e.jobStatus === "succeeded" ? "实时译文 · 已完成" : "实时译文 · 已结束" : e.error || "实时译文 · 连接中";
}
function ki(e) {
  return e.id === "translated" ? e.sourceOnly : e.id === "compare" ? !e.documentReady || e.sourceOnly && !e.liveTranslationAvailable : !1;
}
function Ai(e) {
  const t = dt(), {
    mode: n,
    documentReady: r,
    onModeChange: a,
    liveTranslation: o = null
  } = e, s = e.sourceOnly ?? (t == null ? void 0 : t.sourceViewOnly) ?? !1, i = o ? Ni(o.state) : "";
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
          /* @__PURE__ */ p(ko, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 }),
          /* @__PURE__ */ p("span", { className: "reader-live-translation-toggle-label", children: i })
        ]
      }
    ) : null,
    /* @__PURE__ */ p("div", { className: "reader-workspace-tabs", role: "tablist", "aria-label": "阅读工作区", children: xi.map(({ id: c, label: l, Icon: d }) => {
      const u = n === c, f = ki({
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
  { id: "markdown", label: "Markdown", Icon: Rr },
  { id: "ai", label: "AI 问答", Icon: dn }
];
function Ci(e) {
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
        children: /* @__PURE__ */ p(qe, { size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
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
function Li(e, t) {
  const n = getComputedStyle(e), r = parseFloat(n.fontSize);
  return t * r;
}
function zi(e, t) {
  const n = getComputedStyle(e.ownerDocument.documentElement), r = parseFloat(n.fontSize);
  return t * r;
}
function _i(e) {
  return e / 100 * window.innerHeight;
}
function Di(e) {
  return e / 100 * window.innerWidth;
}
function Fi(e) {
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
  const [a, o] = Fi(n);
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
      r = zi(t, a);
      break;
    }
    case "em": {
      r = Li(t, a);
      break;
    }
    case "vh": {
      r = _i(a);
      break;
    }
    case "vw": {
      r = Di(a);
      break;
    }
  }
  return r;
}
function de(e) {
  return parseFloat(e.toFixed(3));
}
function Ke({
  group: e
}) {
  const { orientation: t, panels: n } = e;
  return n.reduce((r, a) => (r += t === "horizontal" ? a.element.offsetWidth : a.element.offsetHeight, r), 0);
}
function Qt(e) {
  const { panels: t } = e, n = Ke({ group: e });
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
    e === "horizontal" ? $i : Oi
  );
}
function $i(e, t) {
  const n = e.element.offsetLeft - t.element.offsetLeft;
  return n !== 0 ? n : e.element.offsetWidth - t.element.offsetWidth;
}
function Oi(e, t) {
  const n = e.element.offsetTop - t.element.offsetTop;
  return n !== 0 ? n : e.element.offsetHeight - t.element.offsetHeight;
}
function Wr(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.ELEMENT_NODE;
}
function Hr(e, t) {
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
function ji({
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
    const { x: i, y: c } = Hr(r, s), l = e === "horizontal" ? i : c;
    l < o && (o = l, a = s);
  }
  return Y(a, "No rect found"), a;
}
let gt;
function Ui() {
  return gt === void 0 && (typeof matchMedia == "function" ? gt = !!matchMedia("(pointer:coarse)").matches : gt = !1), gt;
}
function Jr(e) {
  const { element: t, orientation: n, panels: r, separators: a } = e, o = en(
    n,
    Array.from(t.children).filter(Wr).map((v) => ({ element: v }))
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
            let I;
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
              ), P = n === "horizontal" ? new DOMRect(g.left, g.top, 0, g.height) : new DOMRect(g.left, g.top, g.width, 0);
              switch (m.length) {
                case 0: {
                  I = [
                    w,
                    P
                  ];
                  break;
                }
                case 1: {
                  const L = m[0], E = ji({
                    orientation: n,
                    rects: [b, g],
                    targetRect: L.element.getBoundingClientRect()
                  });
                  I = [
                    L,
                    E === b ? P : w
                  ];
                  break;
                }
                default: {
                  I = m;
                  break;
                }
              }
            } else
              m.length ? I = m : I = [
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
            for (const w of I) {
              let P = "width" in w ? w : w.element.getBoundingClientRect();
              const L = Ui() ? e.resizeTargetMinimumSize.coarse : e.resizeTargetMinimumSize.fine;
              if (P.width < L) {
                const _ = L - P.width;
                P = new DOMRect(
                  P.x - _ / 2,
                  P.y,
                  P.width + _,
                  P.height
                );
              }
              if (P.height < L) {
                const _ = L - P.height;
                P = new DOMRect(
                  P.x,
                  P.y - _ / 2,
                  P.width,
                  P.height + _
                );
              }
              const E = v <= l || v > d;
              !i && !E && s.push({
                group: e,
                groupSize: Ke({ group: e }),
                panels: [f, y],
                separator: "width" in w ? void 0 : w,
                rect: P
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
function Bi(e) {
  return bn.addListener("change", e);
}
function Wi(e) {
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
const Hi = (e) => e, jt = () => {
}, qr = 1, Vr = 2, Gr = 4, Yr = 8, er = 3, tr = 12;
let bt;
function nr() {
  return bt === void 0 && (bt = !1, typeof window < "u" && (window.navigator.userAgent.includes("Chrome") || window.navigator.userAgent.includes("Firefox")) && (bt = !0)), bt;
}
function Ji({
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
          const o = (e & qr) !== 0, s = (e & Vr) !== 0, i = (e & Gr) !== 0, c = (e & Yr) !== 0;
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
      const a = Ji({
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
const Zr = new Kr();
function Ki(e) {
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
  return Zr.addListener("groupChange", (n) => {
    n.group.id === e && t(n);
  });
}
function Me(e, t, n) {
  const r = ve.get(e);
  ve = new Map(ve), ve.set(e, t), Zr.emit("groupChange", {
    group: e,
    isUserInteraction: (n == null ? void 0 : n.isUserInteraction) === !0,
    prev: r,
    next: t
  });
}
function Xr(e) {
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
  e.defaultPrevented || Xr(e.currentTarget);
}
function qi(e, t, n) {
  let r, a = {
    x: 1 / 0,
    y: 1 / 0
  };
  for (const o of t) {
    const s = Hr(n, o.rect);
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
function Vi(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
function Gi(e, t) {
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
const Yi = /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;
function Zi(e) {
  const t = getComputedStyle(Qr(e) ?? e).display;
  return t === "flex" || t === "inline-flex";
}
function Xi(e) {
  const t = getComputedStyle(e);
  return !!(t.position === "fixed" || t.zIndex !== "auto" && (t.position !== "static" || Zi(e)) || +t.opacity < 1 || "transform" in t && t.transform !== "none" || "webkitTransform" in t && t.webkitTransform !== "none" || "mixBlendMode" in t && t.mixBlendMode !== "normal" || "filter" in t && t.filter !== "none" || "webkitFilter" in t && t.webkitFilter !== "none" || "isolation" in t && t.isolation === "isolate" || Yi.test(t.willChange) || t.webkitOverflowScrolling === "touch");
}
function sr(e) {
  let t = e.length;
  for (; t--; ) {
    const n = e[t];
    if (Y(n, "Missing node"), Xi(n)) return n;
  }
  return null;
}
function ir(e) {
  return e && Number(getComputedStyle(e).zIndex) || 0;
}
function cr(e) {
  const t = [];
  for (; e; )
    t.push(e), e = Qr(e);
  return t;
}
function Qr(e) {
  const { parentNode: t } = e;
  return Vi(t) ? t.host : t;
}
function Qi(e, t) {
  return e.x < t.x + t.width && e.x + e.width > t.x && e.y < t.y + t.height && e.y + e.height > t.y;
}
function ec({
  groupElement: e,
  hitRegion: t,
  pointerEventTarget: n
}) {
  if (!Wr(n) || n.contains(e) || e.contains(n))
    return !0;
  if (Gi(n, e) > 0) {
    let r = n;
    for (; r; ) {
      if (r.contains(e))
        return !0;
      if (Qi(r.getBoundingClientRect(), t))
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
    const o = Jr(a), s = qi(a.orientation, o, {
      x: e.clientX,
      y: e.clientY
    });
    s && s.distance.x <= 0 && s.distance.y <= 0 && ec({
      groupElement: a.element,
      hitRegion: s.hitRegion.rect,
      pointerEventTarget: e.target
    }) && n.push(s.hitRegion);
  }), n;
}
function tc(e, t) {
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
        const h = e < 0 ? u : d, y = n[h];
        Y(
          y,
          `Panel constraints not found for index ${h}`
        );
        const {
          collapsedSize: b = 0,
          collapsible: g,
          minSize: I = 0
        } = y;
        if (g) {
          const w = i[h];
          if (Y(
            w != null,
            `Previous layout not found for panel index ${h}`
          ), ue(w, b)) {
            const P = I - w;
            ye(P, Math.abs(e)) > 0 && (e = e < 0 ? 0 - P : P);
          }
        }
      }
      {
        const h = e < 0 ? d : u, y = n[h];
        Y(
          y,
          `No panel constraints found for index ${h}`
        );
        const {
          collapsedSize: b = 0,
          collapsible: g,
          minSize: I = 0
        } = y;
        if (g) {
          const w = i[h];
          if (Y(
            w != null,
            `Previous layout not found for panel index ${h}`
          ), ue(w, I)) {
            const P = w - b;
            ye(P, Math.abs(e)) > 0 && (e = e < 0 ? 0 - P : P);
          }
        }
      }
      break;
    }
    default: {
      const h = e < 0 ? u : d, y = n[h];
      Y(
        y,
        `Panel constraints not found for index ${h}`
      );
      const b = i[h], { collapsible: g, collapsedSize: I, minSize: w } = y;
      if (g && ye(b, w) < 0)
        if (e > 0) {
          const P = w - I, L = P / 2, E = b + e;
          ye(E, w) < 0 && (e = ye(e, L) <= 0 ? 0 : P);
        } else {
          const P = w - I, L = 100 - P / 2, E = b - e;
          ye(E, w) < 0 && (e = ye(100 + e, L) > 0 ? 0 : -P);
        }
      break;
    }
  }
  {
    const h = e < 0 ? 1 : -1;
    let y = e < 0 ? u : d, b = 0;
    for (; ; ) {
      const I = i[y];
      Y(
        I != null,
        `Previous layout not found for panel index ${y}`
      );
      const w = Be({
        overrideDisabledPanels: s,
        panelConstraints: n[y],
        prevSize: I,
        size: 100
      }) - I;
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
      Y(
        b != null,
        `Previous layout not found for panel index ${h}`
      );
      const g = b - y, I = Be({
        overrideDisabledPanels: s,
        panelConstraints: n[h],
        prevSize: b,
        size: g
      });
      if (!ue(b, I) && (f += b - I, l[h] = I, f.toFixed(3).localeCompare(Math.abs(e).toFixed(3), void 0, {
        numeric: !0
      }) >= 0))
        break;
      e < 0 ? h-- : h++;
    }
  }
  if (tc(c, l))
    return a;
  {
    const h = e < 0 ? u : d, y = i[h];
    Y(
      y != null,
      `Previous layout not found for panel index ${h}`
    );
    const b = y + f, g = Be({
      overrideDisabledPanels: s,
      panelConstraints: n[h],
      prevSize: y,
      size: b
    });
    if (l[h] = g, !ue(g, b)) {
      let I = b - g, w = e < 0 ? u : d;
      for (; w >= 0 && w < n.length; ) {
        const P = l[w];
        Y(
          P != null,
          `Previous layout not found for panel index ${w}`
        );
        const L = P + I, E = Be({
          overrideDisabledPanels: s,
          panelConstraints: n[w],
          prevSize: P,
          size: L
        });
        if (ue(P, E) || (I -= E - P, l[w] = E), ue(I, 0))
          break;
        e > 0 ? w-- : w++;
      }
    }
  }
  const m = Object.values(l).reduce(
    (h, y) => y + h,
    0
  );
  if (!ue(m, 100, 0.1))
    return a;
  const v = Object.keys(a);
  return l.reduce((h, y, b) => (h[v[b]] = y, h), {});
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
function eo({
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
      return (g == null ? void 0 : g.collapsible) && ue(g.collapsedSize, d[g.panelId]);
    }))) {
      const y = l.slice(0, m).reduce((b, g) => b + d[g.id], 0);
      return {
        ...d,
        [t]: de(100 - y)
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
      return c && ue(l, d);
    },
    resize: (c) => {
      const { group: l } = n(), { element: d } = a(), u = Ke({ group: l }), f = et({
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
        const a = r.panelConstraints.defaultSize, o = eo({
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
function to({
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
  const s = o.map((d) => n.panels.indexOf(d)), i = to({ groupId: n.id }).getLayout(), c = it({
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
function no({
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
      derivedPanelConstraints: I,
      groupSize: w,
      layout: P,
      separatorToPanels: L
    } = b;
    if (I && P && L) {
      const E = it({
        delta: h,
        initialLayout: y,
        panelConstraints: I,
        pivotIndices: l.panels.map((_) => m.indexOf(_)),
        prevLayout: P,
        trigger: "mouse-or-touch"
      });
      if (ze(E, P)) {
        if (h !== 0 && !v)
          switch (f) {
            case "horizontal": {
              i |= h < 0 ? qr : Vr;
              break;
            }
            case "vertical": {
              i |= h < 0 ? Gr : Yr;
              break;
            }
          }
      } else
        Me(l.group, {
          defaultLayoutDeferred: g,
          derivedPanelConstraints: I,
          groupSize: w,
          layout: E,
          separatorToPanels: L
        });
    }
  });
  let c = 0;
  t.movementX === 0 ? c |= s & er : c |= i & er, t.movementY === 0 ? c |= s & tr : c |= i & tr, Wi(c), yn(e);
}
function fr(e) {
  const t = Fe(), n = Le();
  switch (n.state) {
    case "active":
      no({
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
      no({
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
  e.defaultPrevented || e.pointerType === "mouse" && e.button > 0 || Xr(e.currentTarget) && e.preventDefault();
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
function nc(e, t, n) {
  if (!n[0])
    return;
  const r = e.panels.find((c) => c.element === t);
  if (!r || !r.onResize)
    return;
  const a = Ke({ group: e }), o = e.orientation === "horizontal" ? r.element.offsetWidth : r.element.offsetHeight, s = r.mutableValues.prevSize, i = {
    asPercentage: de(o / a * 100),
    inPixels: o
  };
  r.mutableValues.prevSize = i, r.onResize(i, r.id, s);
}
function rc(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (e[n] !== t[n])
      return !1;
  return !0;
}
function oc({
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
function ac(e, t) {
  const n = e.map((a) => a.id), r = Object.keys(t);
  if (n.length !== r.length)
    return !1;
  for (const a of n)
    if (!r.includes(a))
      return !1;
  return !0;
}
const Oe = /* @__PURE__ */ new Map();
function sc(e) {
  let t = !0;
  Y(
    e.element.ownerDocument.defaultView,
    "Cannot register an unmounted Group"
  );
  const n = e.element.ownerDocument.defaultView.ResizeObserver, r = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), o = new n((v) => {
    for (const h of v) {
      const { borderBoxSize: y, target: b } = h;
      if (b === e.element) {
        if (t) {
          const g = Ke({ group: e });
          if (g === 0)
            return;
          const I = ke(e.id);
          if (!I)
            return;
          const w = Qt(e), P = I.defaultLayoutDeferred ? gr(w) : I.layout, L = oc({
            group: e,
            nextGroupSize: g,
            prevGroupSize: I.groupSize,
            prevLayout: P
          }), E = _e({
            layout: L,
            panelConstraints: w
          });
          if (!I.defaultLayoutDeferred && ze(I.layout, E) && rc(
            I.derivedPanelConstraints,
            w
          ) && I.groupSize === g)
            return;
          Me(e, {
            defaultLayoutDeferred: !1,
            derivedPanelConstraints: w,
            groupSize: g,
            layout: E,
            separatorToPanels: I.separatorToPanels
          });
        }
      } else
        nc(e, b, y);
    }
  });
  o.observe(e.element), e.panels.forEach((v) => {
    Y(
      !r.has(v.id),
      `Panel ids must be unique; id "${v.id}" was used more than once`
    ), r.add(v.id), v.onResize && o.observe(v.element);
  });
  const s = Ke({ group: e }), i = Qt(e), c = e.panels.map(({ id: v }) => v).join(",");
  let l = e.mutableState.defaultLayout;
  l && (ac(e.panels, l) || (l = void 0));
  const d = e.mutableState.layouts[c] ?? l ?? gr(i), u = _e({
    layout: d,
    panelConstraints: i
  }), f = e.element.ownerDocument;
  Oe.set(
    f,
    (Oe.get(f) ?? 0) + 1
  );
  const m = /* @__PURE__ */ new Map();
  return Jr(e).forEach((v) => {
    v.separator && m.set(v.separator, v.panels);
  }), Me(e, {
    defaultLayoutDeferred: s === 0,
    derivedPanelConstraints: i,
    groupSize: s,
    layout: u,
    separatorToPanels: m
  }), e.separators.forEach((v) => {
    Y(
      !a.has(v.id),
      `Separator ids must be unique; id "${v.id}" was used more than once`
    ), a.add(v.id), v.element.addEventListener("keydown", ur);
  }), Oe.get(f) === 1 && (f.addEventListener("contextmenu", ar, !0), f.addEventListener("dblclick", lr, !0), f.addEventListener("pointerdown", dr, !0), f.addEventListener("pointerleave", fr), f.addEventListener("pointermove", mr), f.addEventListener("pointerout", pr), f.addEventListener("pointerup", hr, !0)), function() {
    t = !1, Oe.set(
      f,
      Math.max(0, (Oe.get(f) ?? 0) - 1)
    ), Ki(e), e.separators.forEach((v) => {
      v.element.removeEventListener("keydown", ur);
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
function ic() {
  const [e, t] = A({}), n = x(() => t({}), []);
  return [e, n];
}
function Sn(e) {
  const t = ln();
  return `${e ?? t}`;
}
const $e = typeof window < "u" ? De : O;
function nt(e) {
  const t = C(e);
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
  const t = C({ ...e });
  return $e(() => {
    for (const n in e)
      t.current[n] = e[n];
  }, [e]), t.current;
}
const ro = sn(null);
function cc(e, t) {
  const n = C({
    getLayout: () => ({}),
    setLayout: Hi
  });
  an(t, () => n.current, []), $e(() => {
    Object.assign(
      n.current,
      to({ groupId: e })
    );
  });
}
function oo({
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
  const v = C({
    onLayoutChange: {},
    onLayoutChanged: {}
  }), h = nt((R) => {
    ze(v.current.onLayoutChange, R) || (v.current.onLayoutChange = R, c == null || c(R));
  }), y = nt(
    (R, S) => {
      ze(v.current.onLayoutChanged, R) || (v.current.onLayoutChanged = R, l == null || l(R, { isUserInteraction: S }));
    }
  ), b = Sn(i), g = C(null), [I, w] = ic(), P = C({
    lastExpandedPanelSizes: {},
    layouts: {},
    panels: [],
    resizeTargetMinimumSize: u,
    separators: []
  }), L = In(g, o);
  cc(b, s);
  const E = nt(
    (R, S) => {
      const N = Le(), D = or(R), k = ke(R);
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
  }), T = q(
    () => ({
      get disableCursor() {
        return !!_.disableCursor;
      },
      getPanelStyles: E,
      id: b,
      orientation: d,
      registerPanel: (R) => {
        const S = P.current;
        return S.panels = en(d, [
          ...S.panels,
          R
        ]), w(), () => {
          S.panels = S.panels.filter(
            (N) => N !== R
          ), w();
        };
      },
      registerSeparator: (R) => {
        const S = P.current;
        return S.separators = en(d, [
          ...S.separators,
          R
        ]), w(), () => {
          S.separators = S.separators.filter(
            (N) => N !== R
          ), w();
        };
      },
      updatePanelProps: (R, { disabled: S }) => {
        const N = P.current.panels.find(
          (F) => F.id === R
        );
        N && (N.panelConstraints.disabled = S);
        const D = or(b), k = ke(b);
        D && k && Me(D, {
          ...k,
          derivedPanelConstraints: Qt(D)
        });
      },
      updateSeparatorProps: (R, {
        disabled: S,
        disableDoubleClick: N
      }) => {
        const D = P.current.separators.find(
          (k) => k.id === R
        );
        D && (D.disabled = S, D.disableDoubleClick = N);
      }
    }),
    [E, b, w, d, _]
  ), M = C(null);
  return $e(() => {
    const R = g.current;
    if (R === null)
      return;
    const S = P.current;
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
      element: R,
      id: b,
      mutableState: {
        defaultLayout: N,
        disableCursor: !!_.disableCursor,
        expandedPanelSizes: P.current.lastExpandedPanelSizes,
        layouts: P.current.layouts
      },
      orientation: d,
      panels: S.panels,
      resizeTargetMinimumSize: S.resizeTargetMinimumSize,
      separators: S.separators
    };
    M.current = D;
    const k = sc(D), { defaultLayoutDeferred: F, derivedPanelConstraints: B, layout: Z } = ke(D.id, !0);
    !F && B.length > 0 && (h(Z), y(Z, !1));
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
      h(j), oe && y(j, X.isUserInteraction);
    });
    return () => {
      M.current = null, k(), Q();
    };
  }, [
    a,
    b,
    y,
    h,
    d,
    I,
    _
  ]), O(() => {
    const R = M.current;
    R && (R.mutableState.defaultLayout = n, R.mutableState.disableCursor = !!r);
  }), /* @__PURE__ */ p(ro.Provider, { value: T, children: /* @__PURE__ */ p(
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
oo.displayName = "Group";
function Rn() {
  const e = cn(ro);
  return Y(
    e,
    "Group Context not found; did you render a Panel or Separator outside of a Group?"
  ), e;
}
function lc(e, t) {
  const { id: n } = Rn(), r = C({
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
      eo({ groupId: n, panelId: e })
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
  ...v
}) {
  const h = !!c, y = Sn(c), b = Pn({
    disabled: o
  }), g = C(null), I = In(g, s), {
    getPanelStyles: w,
    id: P,
    orientation: L,
    registerPanel: E,
    updatePanelProps: _
  } = Rn(), T = u !== null, M = nt(
    (D, k, F) => {
      u == null || u(D, c, F);
    }
  );
  $e(() => {
    const D = g.current;
    if (D !== null) {
      const k = {
        element: D,
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
      return E(k);
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
    E,
    b
  ]), O(() => {
    _(y, { disabled: o });
  }, [o, y, _]), lc(y, f);
  const R = () => {
    const D = w(P, y);
    if (D)
      return JSON.stringify(D);
  }, S = ho(
    (D) => vn(P, D),
    R,
    R
  );
  let N;
  return S ? N = JSON.parse(S) : a !== void 0 ? N = {
    flexGrow: void 0,
    flexShrink: void 0,
    flexBasis: a
  } : N = { flexGrow: 1 }, /* @__PURE__ */ p(
    "div",
    {
      ...v,
      "data-disabled": o || void 0,
      "data-panel": !0,
      "data-testid": y,
      id: y,
      ref: I,
      style: {
        ...uc,
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
const uc = {
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
function dc({
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
function ao({
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
  }), [d, u] = A({}), [f, m] = A("inactive"), [v, h] = A(!1), y = C(null), b = In(y, a), {
    disableCursor: g,
    id: I,
    orientation: w,
    registerSeparator: P,
    updateSeparatorProps: L
  } = Rn(), E = w === "horizontal" ? "vertical" : "horizontal";
  $e(() => {
    const M = y.current;
    if (M !== null) {
      const R = {
        disabled: l.disabled,
        disableDoubleClick: l.disableDoubleClick,
        element: M,
        id: c
      }, S = P(R), N = Bi(
        (k) => {
          m(
            k.next.state !== "inactive" && k.next.hitRegions.some(
              (F) => F.separator === R
            ) ? k.next.state : "inactive"
          );
        }
      ), D = vn(
        I,
        (k) => {
          const { derivedPanelConstraints: F, layout: B, separatorToPanels: Z } = k.next, Q = Z.get(R);
          if (Q) {
            const X = Q[0], re = Q.indexOf(X);
            u(
              dc({
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
  }, [I, c, P, l]), O(() => {
    L(c, { disabled: n, disableDoubleClick: r });
  }, [n, r, c, L]);
  let _;
  n && !g && (_ = "not-allowed");
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
ao.displayName = "Separator";
const Tn = 30, Mn = 65, ct = 50, fc = 100 - Mn, mc = 100 - Tn;
function pc(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(Mn, Math.max(Tn, t)) : ct;
}
function En(e) {
  return 100 - e;
}
function je(e) {
  return `${e}%`;
}
const xn = "reader-document", lt = "reader-assistant", so = "retainpdf.reader.ai-split-layout.v1", hc = {
  [xn]: En(ct),
  [lt]: ct
};
function Nn(e) {
  const t = pc(e == null ? void 0 : e[lt]);
  return {
    [xn]: En(t),
    [lt]: t
  };
}
function gc() {
  try {
    const e = JSON.parse(localStorage.getItem(so) || "null");
    return Nn(e);
  } catch {
    return hc;
  }
}
function bc(e) {
  try {
    localStorage.setItem(so, JSON.stringify(Nn(e)));
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
function yc() {
  const e = C(null), [t] = A(gc);
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
    Ut(e.current, a), o.isUserInteraction && bc(a);
  }, []);
  return /* @__PURE__ */ z(
    oo,
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
            minSize: je(fc),
            maxSize: je(mc)
          }
        ),
        /* @__PURE__ */ p(
          ao,
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
            minSize: je(Tn),
            maxSize: je(Mn)
          }
        )
      ]
    }
  );
}
const xe = 12, vc = 4;
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
function wc(e, t) {
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
function Sc(e, t) {
  try {
    localStorage.setItem(e, JSON.stringify(t));
  } catch {
  }
}
function Ic({
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
  const v = l === "workspace", h = l === "dock-right", y = h || v, [b, g] = A(() => wc(o, c)), [I, w] = A(!1), P = C(null);
  O(() => {
    !t || y || g((T) => We(T.x, T.y, c));
  }, [y, t, c]), O(() => {
    if (!t || y) return;
    const T = () => g((M) => We(M.x, M.y, c));
    return window.addEventListener("resize", T), () => window.removeEventListener("resize", T);
  }, [y, t, c]), O(() => {
    if (!t) return;
    const T = (M) => {
      var S;
      if (M.key !== "Escape") return;
      const R = M.target;
      (S = R == null ? void 0 : R.closest) != null && S.call(R, "textarea, input, select, [contenteditable='true']") || (M.preventDefault(), u());
    };
    return window.addEventListener("keydown", T), () => window.removeEventListener("keydown", T);
  }, [t, u]);
  const L = x((T) => {
    var M, R;
    y || T.button === 0 && ((R = (M = T.target) == null ? void 0 : M.closest) != null && R.call(M, "button") || (T.currentTarget.setPointerCapture(T.pointerId), P.current = {
      pointerId: T.pointerId,
      startX: T.clientX,
      startY: T.clientY,
      originX: b.x,
      originY: b.y,
      moved: !1
    }, w(!0)));
  }, [y, b.x, b.y]), E = x((T) => {
    const M = P.current;
    if (!M || M.pointerId !== T.pointerId) return;
    const R = T.clientX - M.startX, S = T.clientY - M.startY;
    !M.moved && Math.hypot(R, S) < vc || (M.moved = !0, g(We(M.originX + R, M.originY + S, c)));
  }, [c]), _ = x((T) => {
    const M = P.current;
    if (!(!M || M.pointerId !== T.pointerId)) {
      P.current = null, w(!1);
      try {
        T.currentTarget.releasePointerCapture(T.pointerId);
      } catch {
      }
      M.moved && g((R) => {
        const S = We(R.x, R.y, c);
        return Sc(o, S), S;
      });
    }
  }, [o, c]);
  return t ? /* @__PURE__ */ z(
    "aside",
    {
      id: e,
      className: `reader-notes-panel reader-notes-panel--${v ? "workspace" : h ? "docked" : "float"}${y ? "" : " reader-floating-surface"}${d ? " has-panel-header" : " is-headerless"}${f ? " has-panel-toolbar" : ""}${I ? " is-dragging" : ""} ${i}`.trim(),
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
            onPointerMove: E,
            onPointerUp: _,
            onPointerCancel: _,
            children: [
              y ? null : /* @__PURE__ */ p("div", { className: "reader-notes-panel-drag", "aria-hidden": "true", children: /* @__PURE__ */ p(Ao, { size: 14, strokeWidth: 2.25 }) }),
              /* @__PURE__ */ z("div", { className: "reader-notes-panel-head-text", children: [
                /* @__PURE__ */ z("strong", { children: [
                  a,
                  n
                ] }),
                r ? /* @__PURE__ */ p("span", { children: r }) : null
              ] }),
              /* @__PURE__ */ p("button", { type: "button", className: "reader-notes-close reader-floating-close", "aria-label": `关闭${n}`, onClick: u, children: /* @__PURE__ */ p(qe, { size: 14, strokeWidth: 2.5, "aria-hidden": !0 }) })
            ]
          }
        ) : null,
        f ? /* @__PURE__ */ p("div", { className: "reader-notes-panel-toolbar", children: f }) : null,
        /* @__PURE__ */ p("div", { className: "reader-notes-panel-body", children: m })
      ]
    }
  ) : null;
}
function Pc({
  note: e,
  onJump: t,
  onUpdateNote: n,
  onRemove: r
}) {
  const [a, o] = A(!1), [s, i] = A(e.note);
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
function Rc({
  open: e,
  groups: t,
  count: n,
  onClose: r,
  onJump: a,
  onUpdateNote: o,
  onRemove: s,
  onExport: i
}) {
  const [c, l] = A(!1);
  return /* @__PURE__ */ p(
    Ic,
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
          Pc,
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
function Tc({
  regionsFailed: e = !1,
  metadataFailed: t = !1
}) {
  const [n, r] = A(!1);
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
function Mc({
  loading: e,
  failed: t,
  text: n,
  percent: r,
  regionsError: a = !1,
  metadataError: o = !1
}) {
  return !e && !t ? /* @__PURE__ */ p(Tc, { regionsFailed: a, metadataFailed: o }) : /* @__PURE__ */ z(rn, { children: [
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
async function Ec(e) {
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
function xc({
  selection: e,
  onDismiss: t,
  onAskAi: n,
  onAddNote: r
}) {
  const [a, o] = A(!1), s = e ? e.selectionType === "text" ? `${e.pane}:${e.page}:${e.quote}` : `${e.region.itemId}:${e.pane}` : "";
  if (O(() => o(!1), [s]), !e)
    return null;
  const i = typeof window < "u" ? window.innerWidth : 800, c = typeof window < "u" ? window.innerHeight : 600, l = e.rect.left + e.rect.width / 2, d = 170, u = Math.min(Math.max(16 + d, l), i - 16 - d), f = e.rect.top > 72, m = f ? Math.max(12, e.rect.top - 8) : Math.min(c - 12, e.rect.top + e.rect.height + 8), v = f ? "above" : "below", h = e.pane === "translated" ? "译文" : "原文", y = e.selectionType === "text" ? "text" : e.kind, b = e.selectionType === "text" ? e.quote : xr(e.region, e.pane), g = y === "formula" ? "公式" : y === "table" ? "表格" : y === "figure" ? "图片" : y === "text" ? "文字" : "区域", I = y === "formula" ? wa(b) : b, w = y === "formula" ? Co : y === "table" ? Lo : y === "text" ? zo : _o;
  return /* @__PURE__ */ z(
    "div",
    {
      className: `reader-sel-pop reader-sel-pop--${v} reader-sel-pop--region`,
      style: { left: u, top: m },
      role: "toolbar",
      "aria-label": "选区操作",
      onPointerDown: (P) => {
        P.preventDefault();
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
            I ? /* @__PURE__ */ z(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--primary",
                onClick: async () => {
                  try {
                    await Ec(I), o(!0), window.setTimeout(() => o(!1), 1400);
                  } catch (P) {
                    console.warn("[reader-selection] copy failed", P);
                  }
                },
                children: [
                  a ? /* @__PURE__ */ p(Do, { size: 15, strokeWidth: 2.4, "aria-hidden": !0 }) : /* @__PURE__ */ p(Fo, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
                  /* @__PURE__ */ p("span", { children: a ? "已复制" : y === "formula" ? "复制 LaTeX" : "复制" })
                ]
              }
            ) : /* @__PURE__ */ p("span", { className: "reader-sel-pop-selection-hint", children: "已选择图片" }),
            r && I ? /* @__PURE__ */ z(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--secondary",
                onClick: () => r({ page: e.page, pane: e.pane, quote: I }),
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
                children: /* @__PURE__ */ p(qe, { size: 15, strokeWidth: 2.5, "aria-hidden": !0 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ p("span", { className: "reader-sel-pop-caret", "aria-hidden": "true" })
      ]
    }
  );
}
function Nc(e) {
  if (!(e instanceof HTMLElement)) return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function kc() {
  const [e, t] = A(!1), n = ln(), r = C(null);
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
      if (o.defaultPrevented || o.metaKey || o.ctrlKey || o.altKey || Nc(o.target)) return;
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
        children: /* @__PURE__ */ p($o, { className: "reader-react-shortcuts-icon", size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
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
          /* @__PURE__ */ p("div", { className: "reader-react-shortcuts-body", children: Us.map((a) => /* @__PURE__ */ z("section", { className: "reader-react-shortcuts-group", children: [
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
const Ac = Object.freeze([
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
]), Cc = ["source", "sideBySide", "translated"], Lc = { source: "", translated: "", sideBySide: "" };
function zc(e) {
  if (e.sourceOnly || !e.jobId) {
    const t = ot(e.sourceUrl), n = ot(e.translatedUrl);
    return {
      source: t,
      translated: n,
      // sideBySide requires dedicated artifact; no fallback to source url
      sideBySide: ""
    };
  }
  return oa({
    jobId: e.jobId,
    jobPayload: e.jobPayload,
    manifestPayload: e.manifestPayload
  });
}
function _c(e) {
  const [t, n] = A(() => /* @__PURE__ */ new Set()), r = q(
    () => e ? zc(e) : Lc,
    [e]
  ), a = q(
    () => Cc.filter((s) => !(e != null && e.sourceOnly && s !== "source")),
    [e == null ? void 0 : e.sourceOnly]
  ), o = x(async (s) => {
    if (!e) return;
    const i = ot(r[s]);
    if (!(!i || t.has(s)))
      try {
        const c = e.jobId ? ra(s, {
          jobId: e.jobId,
          jobPayload: e.jobPayload,
          manifestPayload: e.manifestPayload
        }) : `${e.sourceOnly ? "document" : "reader"}-${s}.pdf`;
        await aa(
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
        sa(l), n((d) => {
          const u = new Set(d);
          return u.delete(s), u;
        });
      }
  }, [r, t, e]);
  return { urls: r, downloadItems: a, busyActions: t, handleDownload: o };
}
function Dc(e) {
  const [t, n] = A(!1), r = x(() => n(!1), []), a = x(() => n((o) => !o), []);
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
const io = "retainpdf.reader.fab.pos.v1", Nt = 52, Ue = 12, Fc = 6;
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
function $c() {
  try {
    const e = localStorage.getItem(io);
    if (!e) return yr();
    const t = JSON.parse(e);
    if (typeof t.x == "number" && typeof t.y == "number")
      return rt(t.x, t.y);
  } catch {
  }
  return yr();
}
function Oc(e) {
  try {
    localStorage.setItem(io, JSON.stringify(e));
  } catch {
  }
}
function jc(e) {
  return typeof window < "u" && e.y > window.innerHeight * 0.55;
}
function Uc(e = {}) {
  const { onDragStart: t, onActivate: n } = e, [r, a] = A(() => $c()), o = C(null);
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
    !d.moved && Math.hypot(u, f) < Fc || (d.moved || (d.moved = !0, t == null || t()), a(rt(d.originX + u, d.originY + f)));
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
          return Oc(f), f;
        });
        return;
      }
      n == null || n();
    }
  }, [n]);
  return {
    pos: r,
    openUp: jc(r),
    onPointerDown: s,
    onPointerMove: i,
    onPointerUp: c
  };
}
const Bc = {
  source: Sr,
  sideBySide: Ir,
  translated: Pr
}, Wc = {
  source: "原文",
  sideBySide: "对照",
  translated: "译文"
};
function Hc({ onClose: e }) {
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
        children: /* @__PURE__ */ p(qe, { size: 14, strokeWidth: 2.5, "aria-hidden": !0 })
      }
    )
  ] });
}
function Jc({
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
function Kc({
  urls: e,
  items: t,
  busyActions: n,
  onDownload: r
}) {
  return /* @__PURE__ */ z("div", { className: "reader-fab-section", role: "group", "aria-label": "下载", children: [
    /* @__PURE__ */ z("div", { className: "reader-fab-section-head", children: [
      /* @__PURE__ */ p(Oo, { size: 12, strokeWidth: 2.5, "aria-hidden": !0 }),
      /* @__PURE__ */ p("span", { children: "下载 PDF" })
    ] }),
    /* @__PURE__ */ p("div", { className: "reader-fab-download-grid", children: t.map((a, o) => {
      const s = wo[a], i = ot(e[a]), c = n.has(a), l = !!i && !c, d = l ? "" : So(a, e), u = Bc[a];
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
            /* @__PURE__ */ p("span", { className: "reader-fab-chip-label", children: Wc[a] }),
            /* @__PURE__ */ p("span", { className: "reader-fab-chip-state", children: c ? "…" : l ? "↓" : "—" })
          ]
        },
        a
      );
    }) }),
    t.every((a) => !ot(e[a])) ? /* @__PURE__ */ p("p", { className: "reader-fab-empty", children: "产物尚未就绪" }) : null
  ] });
}
const qc = {
  favorites: jo,
  markdown: Rr,
  ai: dn,
  notes: kt
}, Vc = Ac.filter((e) => e.id === "favorites");
function Gc(e) {
  const { activeTool: t, noteCount: n, onToggleTool: r } = e, a = dt(), o = e.sourceOnly ?? (a == null ? void 0 : a.sourceOnly) ?? !1, s = e.download ?? (a == null ? void 0 : a.download), i = C(null), c = ln(), { open: l, setOpen: d, closeMenu: u, toggleMenu: f } = Dc(i), { pos: m, openUp: v, onPointerDown: h, onPointerMove: y, onPointerUp: b } = Uc({
    onDragStart: u,
    onActivate: f
  }), { urls: g, downloadItems: I, busyActions: w, handleDownload: P } = _c(s), L = x((E) => {
    r(E), d(!1);
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
              /* @__PURE__ */ p(Hc, { onClose: u }),
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
              Vc.map((E, _) => {
                const T = qc[E.id], M = t === E.id, R = E.needsJob && o;
                let S = M ? E.subOpen : E.subIdle;
                return R && (S = "需打开任务阅读"), /* @__PURE__ */ p(
                  Jc,
                  {
                    index: _,
                    icon: T,
                    title: E.label,
                    sub: S,
                    active: M,
                    disabled: R,
                    onClick: () => L(E.id)
                  },
                  E.id
                );
              }),
              /* @__PURE__ */ p(
                Kc,
                {
                  urls: g,
                  items: I,
                  busyActions: w,
                  onDownload: P
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
            children: /* @__PURE__ */ p("span", { className: "reader-fab-icon", "aria-hidden": "true", children: l ? /* @__PURE__ */ p(qe, { size: 20, strokeWidth: 2.5 }) : /* @__PURE__ */ z("span", { className: "reader-fab-dots", children: [
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
function Yc(e) {
  const t = dt(), n = Pi(), { mode: r = "compare", modeControls: a } = e, o = e.userZoom ?? (t == null ? void 0 : t.userZoom) ?? ut, s = e.onZoomChange ?? (t == null ? void 0 : t.onZoomChange) ?? (() => {
  }), i = e.currentPage ?? (n == null ? void 0 : n.currentPage) ?? 1, c = e.numPages ?? (n == null ? void 0 : n.numPages) ?? 0, l = e.onGoToPage ?? (t == null ? void 0 : t.goToPage), d = qa(o), u = o > kr + 1e-3, f = o < Ar - 1e-3, m = tt(), v = "50%（半屏，对照铺满）", [h, y] = A(!1), [b, g] = A(`${i}`);
  O(() => {
    h || g(`${Math.min(Math.max(i, 1), Math.max(c, 1))}`);
  }, [i, c, h]);
  const I = () => {
    if (y(!1), !l || c <= 0)
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
          w.preventDefault(), I();
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
              onBlur: I,
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
          onClick: () => s(st(o, -1)),
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
          onClick: () => s(st(o, 1)),
          children: "+"
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { className: "reader-react-hud-group reader-react-hud-help", "aria-label": "帮助", children: /* @__PURE__ */ p(kc, {}) })
  ] });
}
function co(e) {
  const t = `${e.jobId || ""}`.trim(), n = `${e.documentId || ""}`.trim();
  return t ? `retainpdf.reader.notes.v1:job:${t}` : n ? `retainpdf.reader.notes.v1:doc:${n}` : "retainpdf.reader.notes.v1:anonymous";
}
function Zc() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function Xc(e) {
  return {
    pageIdx: Number(e.page) - 1,
    quoteText: e.quote,
    note: e.note,
    createdAt: e.createdAt
  };
}
function Qc(e) {
  return Po(e, (t) => t.page);
}
function el(e) {
  return To(e, (t) => t.page).map((t) => ({ page: t.pageIdx, items: t.items }));
}
function tl(e, t) {
  return Ro({
    title: e,
    annotations: t.map(Xc)
  });
}
function nl(e) {
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
    return nl(localStorage.getItem(co(e)));
  } catch {
    return [];
  }
}
function rl(e, t) {
  if (!(typeof localStorage > "u"))
    try {
      localStorage.setItem(co(e), JSON.stringify(t));
    } catch (n) {
      console.warn("[reader-notes] persist failed", n);
    }
}
function ol(e, t = {}) {
  const n = q(
    () => ({
      jobId: `${e.jobId || ""}`.trim(),
      documentId: `${e.documentId || ""}`.trim()
    }),
    [e.jobId, e.documentId]
  ), [r, a] = A(() => vr(n)), o = t.onAfterAdd;
  O(() => {
    a(vr(n));
  }, [n.jobId, n.documentId]), O(() => {
    rl(n, r);
  }, [n, r]);
  const s = x((u) => {
    const f = `${u.quote || ""}`.trim();
    if (!f)
      return null;
    const m = {
      id: Zc(),
      page: Math.max(1, Math.floor(Number(u.page) || 1)),
      pane: u.pane === "translated" ? "translated" : "source",
      quote: f,
      note: `${u.note || ""}`.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return a((v) => Qc([m, ...v])), o == null || o(), m;
  }, [o]), i = x((u, f) => {
    const m = `${f || ""}`.trim();
    a((v) => v.map((h) => h.id === u ? { ...h, note: m } : h));
  }, []), c = x((u) => {
    a((f) => f.filter((m) => m.id !== u));
  }, []), l = x(async (u = "") => {
    var m, v;
    const f = tl(u, r);
    try {
      return await ((v = (m = navigator.clipboard) == null ? void 0 : m.writeText) == null ? void 0 : v.call(m, f)), !0;
    } catch (h) {
      return console.error("[reader-notes] copy failed", h), !1;
    }
  }, [r]), d = q(() => el(r), [r]);
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
function al({
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
function sl(e = {}) {
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
    () => /* @__PURE__ */ p(al, { title: n, status: r, meta: a, percent: o, tone: s }),
    { id: nn, duration: 1 / 0 }
  );
}
function il() {
  const e = x((t) => {
    t && (t.setState = sl, t.hide = () => Wt.dismiss(nn));
  }, []);
  return /* @__PURE__ */ z(rn, { children: [
    /* @__PURE__ */ p(No, { position: "bottom-right" }),
    /* @__PURE__ */ p("download-toast", { style: { display: "none" }, "aria-hidden": "true", ref: e })
  ] });
}
const cl = un(() => import("./ReaderFavoritesPanel-Bx7ijoDt.js").then((e) => ({ default: e.ReaderFavoritesPanel }))), ll = un(() => import("./ReaderMarkdownPanel-Uv_QHRuX.js").then((e) => ({ default: e.ReaderMarkdownPanel }))), ul = un(() => import("./ReaderAiPanel-BSsTcO9D.js").then((e) => ({ default: e.ReaderAiPanel })));
function Bt(e) {
  const t = C(!1);
  return e && (t.current = !0), t.current;
}
function dl(e) {
  return "workspace";
}
function fl(e, t) {
  return t !== null && e === "compare" ? "source" : e;
}
function wr(e, t) {
  var n, r, a, o;
  return e === "compare" ? null : (t == null ? void 0 : t.assistantPanel) === "markdown" || (t == null ? void 0 : t.assistantPanel) === "ai" ? t.assistantPanel : ((n = t == null ? void 0 : t.splitLayout) == null ? void 0 : n.left) === "ai" || ((r = t == null ? void 0 : t.splitLayout) == null ? void 0 : r.right) === "ai" ? "ai" : ((a = t == null ? void 0 : t.splitLayout) == null ? void 0 : a.left) === "markdown" || ((o = t == null ? void 0 : t.splitLayout) == null ? void 0 : o.right) === "markdown" ? "markdown" : null;
}
function ml() {
  const e = Os(), { boot: t, panes: n, sessionFiles: r, tools: a, session: o } = e, s = e.sourceOnly || !r.translatedUrl, [i, c] = A(() => wr(e.mode, Te(e.viewStateKey))), [l, d] = A(null), [u, f] = A(null), [m, v] = A(!0), h = C(e.viewStateKey), y = C(null), [b, g] = A(!1), I = x(() => g(!0), []), w = x(() => g((U) => !U), []), P = ol(
    { jobId: o.jobId, documentId: o.documentId },
    { onAfterAdd: I }
  ), L = x((U) => {
    P.addFromQuote(U), e.clearSelection();
  }, [P.addFromQuote, e.clearSelection]), E = x((U) => {
    e.goToPage(U.page, U.pane === "translated" ? "translated" : "source");
  }, [e.goToPage]), _ = x(
    () => P.exportMarkdown(o.title || ""),
    [P.exportMarkdown, o.title]
  );
  O(() => {
    f(null), v(!0), g(!1);
  }, [e.viewStateKey]), O(() => {
    if (!t.loading) {
      if (h.current !== e.viewStateKey) {
        h.current = e.viewStateKey;
        const U = Te(e.viewStateKey);
        c(wr(e.mode, U)), d(null);
        return;
      }
      Tt(e.viewStateKey, { assistantPanel: i, splitLayout: null });
    }
  }, [i, t.loading, e.mode, e.viewStateKey]), O(() => {
    if (!(t.loading || t.failed)) {
      if (y.current !== e.viewStateKey) {
        y.current = e.viewStateKey;
        const U = Te(e.viewStateKey), ae = s ? "source" : U == null ? void 0 : U.mode;
        ae && ae !== e.mode && e.setModeKeepingPage(ae);
        return;
      }
      Tt(e.viewStateKey, { mode: e.mode });
    }
  }, [t.failed, t.loading, e.mode, e.setModeKeepingPage, e.viewStateKey, s]);
  const T = i || (e.mode === "compare" ? "compare" : "reading"), M = i !== null, R = Bt(a.isOpen("favorites")), S = Bt(i === "markdown"), N = Bt(i === "ai"), D = l || fl(e.mode, i), k = !!(e.liveTranslationAvailable && m && !M), F = k ? "compare" : D;
  Hs({
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
    a.close(), d(null), U === "compare" && e.liveTranslationAvailable ? v(!0) : U !== "compare" && v(!1), e.setModeKeepingPage(U);
  }, [e.liveTranslationAvailable, e.setModeKeepingPage, a]), j = x((U) => {
    c(U), U !== "ai" && f(null);
  }, []), J = x((U) => {
    const ae = U.pane === "translated" && !s ? "translated" : "source";
    f(U), c("ai"), d(ae), e.clearSelection();
  }, [e.clearSelection, s]), oe = q(() => ({
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
  ]), ne = q(() => ({
    currentPage: e.currentPage,
    numPages: n.hudNumPages
  }), [e.currentPage, n.hudNumPages]), le = [
    "reader-react-root",
    `is-workspace-${T}`,
    M ? "is-assistant-open" : "",
    k ? "is-live-translation-pair" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(Ii, { value: oe, hud: ne, children: /* @__PURE__ */ z("div", { className: le, "data-reader-engine": "react-pdf", "data-reader-workspace": T, children: [
    /* @__PURE__ */ p(Mc, { loading: t.loading, failed: t.failed, text: t.text, percent: t.percent, regionsError: !!o.readerErrors.regions, metadataError: !!o.readerErrors.metadata }),
    /* @__PURE__ */ p(Ys, { onBeforeClose: o.prepareClose }),
    /* @__PURE__ */ p(
      Ai,
      {
        mode: F,
        documentReady: !!o.jobId,
        onModeChange: ce,
        liveTranslation: e.liveTranslationAvailable ? {
          visible: m,
          state: e.liveTranslation,
          onToggle: () => v((U) => !U)
        } : null
      }
    ),
    /* @__PURE__ */ p(Ci, { active: i }),
    M ? /* @__PURE__ */ p(yc, {}) : null,
    e.showHud ? /* @__PURE__ */ p(Gc, { activeTool: b ? "notes" : a.active, noteCount: P.count, onToggleTool: Z }) : null,
    /* @__PURE__ */ p(Ei, { mode: F, compareMode: F === "compare", showSource: k || F !== "translated", showTranslated: k || F === "translated" || F === "compare", markdownSplit: i === "markdown", assistantSplit: M, liveTranslation: m ? e.liveTranslation : void 0, liveTranslationPair: k }),
    e.showHud ? /* @__PURE__ */ p(
      Yc,
      {
        mode: F,
        modeControls: null
      }
    ) : null,
    /* @__PURE__ */ z(go, { fallback: null, children: [
      R ? /* @__PURE__ */ p(cl, { open: a.isOpen("favorites"), jobId: o.jobId, documentId: o.documentId, onClose: B, onJumpPage: e.goToPage }) : null,
      S ? /* @__PURE__ */ p(ll, { open: i === "markdown", jobId: o.jobId, sourceOnly: e.sourceOnly, layout: "workspace", side: "right", onClose: Q }) : null,
      N ? /* @__PURE__ */ p(ul, { open: i === "ai", jobId: o.jobId, documentId: o.documentId, layout: dl(e.mode), side: "right", selectionContext: u, onClearSelectionContext: () => f(null), onClose: Q, onJumpCitation: X, onDocumentCommitted: re }, o.documentId || o.jobId || "reader-ai-pending") : null
    ] }),
    /* @__PURE__ */ p(
      Rc,
      {
        open: b,
        groups: P.groups,
        count: P.count,
        onClose: () => g(!1),
        onJump: E,
        onUpdateNote: P.updateNote,
        onRemove: P.remove,
        onExport: _
      }
    ),
    /* @__PURE__ */ p(xc, { selection: e.selection, onDismiss: e.clearSelection, onAskAi: J, onAddNote: L }),
    /* @__PURE__ */ p(il, {})
  ] }) });
}
function Al() {
  return /* @__PURE__ */ p(ml, {});
}
export {
  fn as A,
  Al as R,
  ml as a,
  Ic as b,
  kl as c,
  at as d,
  Yo as e,
  Nl as f,
  xr as g,
  xl as h,
  El as r
};
//# sourceMappingURL=ReaderApp-Ds9tRSBd.js.map
