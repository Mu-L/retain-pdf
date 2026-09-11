var Rn = (e) => {
  throw TypeError(e);
};
var Tn = (e, t, n) => t.has(e) || Rn("Cannot " + n);
var Ve = (e, t, n) => (Tn(e, t, "read from private field"), n ? n.call(e) : t.get(e)), Mn = (e, t, n) => t.has(e) ? Rn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), xn = (e, t, n, r) => (Tn(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
import { jsxs as z, jsx as p, Fragment as en } from "react/jsx-runtime";
import { useMemo as Y, useState as L, useEffect as j, useCallback as E, useRef as A, useLayoutEffect as Le, memo as tn, forwardRef as so, useImperativeHandle as nn, createContext as rn, useContext as on, useSyncExternalStore as co, useId as an, Suspense as lo, lazy as sn } from "react";
import { getReaderAdapters as ie, requireAdapter as Se } from "./adapters.js";
import { resolveReaderDownloadName as uo, createReaderServerFavoritesPort as fo, resolveReaderDownloadUrls as mo, READER_PROGRESS_COPY as ve, trimString as nt, READER_DOWNLOAD_ACTIONS as po, disabledReason as ho } from "./runtime/state.js";
import { d as go } from "./ask-answerer-GNQdzitl.js";
import "@retainpdf/api/conversations";
import { normalizeBlockKey as En, sortByPageAndCreatedAt as bo, buildAnnotationsMarkdown as yo, groupByPageAndCreatedAt as vo } from "./runtime/content.js";
import { fetchLiveTranslationLayout as wo, LiveTranslationApiError as vt, streamLiveTranslationEvents as So, fetchLiveTranslationPage as Io } from "@retainpdf/api/live-translation";
import { toast as jt, Toaster as Po } from "sonner";
import { X as He, Radio as Ro, FileText as hr, Columns2 as gr, Languages as br, FileCode2 as yr, Sparkles as cn, GripHorizontal as To, StickyNote as xt, Sigma as Mo, Table2 as xo, Type as Eo, Image as No, Check as ko, Copy as Ao, Keyboard as Lo, Download as Co, Bookmark as zo } from "lucide-react";
import { pdfjs as _o, Page as Do, Document as Fo } from "react-pdf";
import { e as $o, m as Oo, a as jo } from "./markdown-math-Cb17EyYs.js";
const Uo = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.isMockMode) == null ? void 0 : n.call(t, ...e)) ?? !1;
}, Bo = "", Wo = Object.freeze({
  progress: "retainpdf-reader-progress"
}), ht = (e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveResourceUrl) == null ? void 0 : n.call(t, e)) ?? e;
}, Ho = (...e) => {
  var n;
  return (((n = ie()) == null ? void 0 : n.fetchProtected) ?? fetch)(...e);
}, Ut = (e = "") => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolvePdfjsVendorUrl) == null ? void 0 : n.call(t, e)) ?? "";
}, rt = new Proxy({}, { get: (e, t) => (...n) => {
  var r, a, o;
  return (o = (a = (r = ie()) == null ? void 0 : r.defaultReaderDataPort) == null ? void 0 : a[t]) == null ? void 0 : o.call(a, ...n);
} }), vr = new Proxy({}, { get: (e, t) => (...n) => {
  var r, a, o;
  return (o = (a = (r = ie()) == null ? void 0 : r.defaultReaderPageConfigPort) == null ? void 0 : a[t]) == null ? void 0 : o.call(a, ...n);
} }), Jo = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderAnchor) == null ? void 0 : n.call(t, ...e)) ?? null;
}, Ko = () => {
  var e, t;
  return ((t = (e = ie()) == null ? void 0 : e.resolveReaderDocumentId) == null ? void 0 : t.call(e)) ?? "";
}, qo = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderJobId) == null ? void 0 : n.call(t, ...e)) ?? "";
}, Vo = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderArtifactUrl) == null ? void 0 : n.call(t, ...e)) ?? "";
}, Go = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderSourcePdf) == null ? void 0 : n.call(t, ...e)) ?? null;
}, Yo = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderTranslatedPdfUrl) == null ? void 0 : n.call(t, ...e)) ?? "";
}, Zo = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderDownloadName) == null ? void 0 : n.call(t, ...e)) ?? uo(...e);
}, Xo = (...e) => {
  var t, n;
  return ((n = (t = ie()) == null ? void 0 : t.resolveReaderDownloadUrls) == null ? void 0 : n.call(t, ...e)) ?? mo(...e);
}, Qo = (...e) => Se("downloadProtectedResource")(...e), ea = (...e) => Se("failDownloadToast")(...e), wl = (e, t) => Se("resolveMarkdownAssetUrl")(e, t), Sl = (e = {}) => {
  const t = ie();
  return go({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) || "/api/v1",
    ask: t == null ? void 0 : t.askDocumentAi,
    documentByJobId: t == null ? void 0 : t.fetchDocumentByJobId,
    ...e
  });
}, ln = "/api/v1", ta = (...e) => Se("fetchDocumentByJobId")(...e), Il = (e = ln, t = {}) => {
  var n;
  return Se("fetchFavorites")(
    ((n = ie()) == null ? void 0 : n.apiPrefix) ?? e,
    t
  );
};
function Pl(e = {}) {
  const t = ie();
  return fo({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) ?? ln,
    documentByJobId: (...n) => Se("fetchDocumentByJobId")(...n),
    submitFavorite: (...n) => Se("createFavorite")(...n),
    loadFavorites: (...n) => Se("fetchFavorites")(...n),
    removeFavorite: (...n) => Se("deleteFavorite")(...n),
    ...e
  });
}
function na() {
  const [e, t] = L(
    () => {
      var n, r;
      return ((n = globalThis.location) == null ? void 0 : n.search) || ((r = globalThis.location) == null ? void 0 : r.href) || "";
    }
  );
  return j(() => {
    var i, s, c, l;
    const n = () => {
      var d, u;
      return t(((d = globalThis.location) == null ? void 0 : d.search) || ((u = globalThis.location) == null ? void 0 : u.href) || "");
    }, r = (s = (i = globalThis.history) == null ? void 0 : i.pushState) == null ? void 0 : s.bind(globalThis.history), a = (l = (c = globalThis.history) == null ? void 0 : c.replaceState) == null ? void 0 : l.bind(globalThis.history);
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
function ra() {
  const e = na(), t = Y(() => qo(vr), [e]), n = Y(() => Ko(), [e]), r = t || n ? `job:${t}|document:${n}` : `location:${e}`;
  return { locationKey: e, jobId: t, routeDocumentId: n, sessionIdentity: r };
}
function oa(e) {
  const {
    routeDocumentId: t,
    jobId: n,
    sessionIdentity: r,
    sessionIdentityRef: a,
    documentIdRef: o,
    sessionJobIdRef: i,
    switchToSourceMode: s
  } = e, [c, l] = L({
    documentId: "",
    jobId: ""
  }), [d, u] = L({
    documentId: "",
    jobId: ""
  }), f = c.documentId === t ? c.jobId : "", m = d.documentId === t ? d.jobId : "", y = n || f, [h, v] = L({
    jobId: "",
    documentId: ""
  }), b = h.jobId === y ? h.documentId : "", g = t || b, I = !!t && !y, [w, P] = L(null), N = (w == null ? void 0 : w.sessionIdentity) === r && w.documentId === g ? w : null, x = I || !!N, D = E((M) => {
    const R = `${M.documentId || ""}`.trim();
    if (!R || o.current && o.current !== R) return;
    if (!o.current && i.current)
      v({
        jobId: i.current,
        documentId: R
      });
    else if (!o.current)
      return;
    const S = `${M.revision || ""}`.trim() || `${Date.now()}`;
    P({
      documentId: R,
      revision: S,
      sessionIdentity: a.current
    }), s();
  }, []);
  j(() => {
    P((M) => M && M.sessionIdentity !== r ? null : M);
  }, [r]);
  const T = E((M) => {
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
        v((R) => R.jobId === M.jobId && R.documentId === M.documentId ? R : { jobId: M.jobId, documentId: M.documentId });
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
    sessionJobId: y,
    resolvedJobDocument: h,
    setResolvedJobDocument: v,
    jobDocumentId: b,
    documentId: g,
    sourceOnly: I,
    committedDocumentSource: w,
    setCommittedDocumentSource: P,
    activeCommittedDocumentSource: N,
    sourceViewOnly: x,
    refreshCommittedDocument: D,
    applyIdentityEvent: T
  };
}
const aa = /* @__PURE__ */ new Set(["succeeded", "failed", "cancelled", "canceled"]);
function Nn(e) {
  return `${(e == null ? void 0 : e.status) || ""}`.trim().toLowerCase();
}
function ia(e) {
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
function kn(e, t) {
  const n = `/api/v1/documents/${encodeURIComponent(e)}/source.pdf`, r = `${t || ""}`.trim();
  return ht(r ? `${n}?version=${encodeURIComponent(r)}` : n);
}
function sa(e, t = "") {
  const n = `${e || ""}`.trim(), r = `${t || ""}`.trim();
  return !!(!n || r && (n === r || n === `${r}.pdf`) || /^\d{8,14}-[0-9a-f]{4,}$/i.test(n));
}
function ca(e, t) {
  var r;
  const n = [
    e == null ? void 0 : e.title,
    e == null ? void 0 : e.display_name,
    e == null ? void 0 : e.source_file_name,
    (r = e == null ? void 0 : e.book_summary) == null ? void 0 : r.source_file_name
  ];
  for (const a of n) {
    const o = `${a || ""}`.trim();
    if (o && !sa(o, t))
      return o.replace(/\.pdf$/i, "");
  }
  return "";
}
function Bt({
  percent: e,
  text: t,
  stage: n
}) {
  var r;
  try {
    (r = window.parent) == null || r.postMessage(
      {
        type: Wo.progress,
        stage: n,
        percent: e,
        text: t
      },
      vr.messageTargetOrigin()
    );
  } catch {
  }
}
function wt(e, t, n, r = "progress") {
  e({
    loading: !0,
    percent: t,
    text: n,
    stage: r,
    failed: !1
  }), Bt({ percent: t, text: n, stage: r });
}
function la(e) {
  const {
    sessionJobId: t,
    sessionIdentity: n,
    sessionIdentityRef: r,
    sessionJobIdRef: a,
    sessionEpochRef: o,
    closingRef: i
  } = e, [s, c] = L(null), [l, d] = L(null), [u, f] = L(""), [m, y] = L(0), h = u === n ? s : null, v = u === n ? l : null, b = Nn(h), g = aa.has(b), I = E(() => {
    y((T) => T + 1);
  }, []), w = E((T) => {
    c(T.jobPayload), d(T.manifestPayload), f(T.sessionIdentity);
  }, []), P = E((T) => {
    c(null), d(null), f(T);
  }, []), N = A(""), x = A(""), D = E(async () => {
    const T = a.current;
    if (!T || N.current === T) return;
    const M = rt.loadJobPayload;
    if (typeof M != "function") return;
    const R = o.current.value;
    N.current = T;
    try {
      const S = await M(T);
      if (i.current || o.current.value !== R || a.current !== T || !S || typeof S != "object")
        return;
      const k = Nn(S);
      c(S), f(r.current), k === "succeeded" && x.current !== T && (x.current = T, y((_) => _ + 1));
    } catch {
    } finally {
      N.current === T && (N.current = "");
    }
  }, []);
  return j(() => {
    x.current = "";
  }, [n]), j(() => {
    if (!t || g || !h) return;
    const T = window.setInterval(() => {
      D();
    }, 1e3);
    return () => window.clearInterval(T);
  }, [g, D, h, t]), {
    jobPayload: s,
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
    refreshJobArtifacts: I,
    refreshJobStatus: D,
    publishPayload: w,
    clearPayload: P
  };
}
function Wt(e) {
  document.body.classList.remove(
    "reader-mode-source",
    "reader-mode-translated",
    "reader-mode-compare"
  ), document.body.classList.add(`reader-mode-${e}`);
}
function ua(e, t) {
  e(t), Wt(t);
}
function da(e) {
  const [t, n] = L(e ? "source" : "compare"), r = E((o) => {
    e && o !== "source" || (n(o), Wt(o));
  }, [e]), a = E((o) => {
    ua(n, o);
  }, []);
  return j(() => (e && document.documentElement.classList.add("reader-source-only"), Wt(t), () => {
    document.documentElement.classList.remove("reader-source-only");
  }), [e, t]), { mode: t, setMode: r, setModeState: n, switchSessionMode: a };
}
function Ee(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : null;
}
function wr(e) {
  const t = Ee(e);
  return t && "data" in t ? t.data : e;
}
function Ze(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? t : null;
}
function An(e) {
  const t = Ee(e);
  if (!t || !Array.isArray(t.bbox) || t.bbox.length !== 4) return null;
  const n = t.bbox.map(Number);
  if (!n.every(Number.isFinite)) return null;
  const r = Ze(t.page);
  if (r == null) return null;
  const [a, o, i, s] = n, c = Math.min(a, i), l = Math.min(o, s), d = Math.max(a, i), u = Math.max(o, s);
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
function fa(e) {
  const t = Ee(wr(e)), n = Array.isArray(t == null ? void 0 : t.items) ? t.items : [], r = [];
  for (const a of n) {
    const o = Ee(a), i = `${(o == null ? void 0 : o.item_id) || (o == null ? void 0 : o.itemId) || ""}`.trim(), s = An(o == null ? void 0 : o.source), c = An(o == null ? void 0 : o.translated);
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
function ma(e) {
  const t = `${e || ""}`.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return t.includes("formula") || t.includes("equation") ? "formula" : t.includes("table") ? "table" : t.includes("figure") || t.includes("image") || t.includes("chart") || t.includes("seal") ? "figure" : t.includes("text") || t.includes("title") || t.includes("paragraph") || t.includes("reference") || t.includes("caption") ? "text" : "region";
}
function un(e) {
  const t = ma(e.regionType);
  if (t !== "region") return t;
  if (e.assetIds.length || e.assetUrls.length) return "figure";
  const n = `${e.markdown || e.source.text || e.translated.text || ""}`.trim();
  return /^<table(?:\s|>)/i.test(n) || /\n\s*\|?\s*:?-{3,}/.test(n) ? "table" : /^\$\$[\s\S]+\$\$$/.test(n) || /^\\\[[\s\S]+\\\]$/.test(n) || /^\\begin\{(?:equation|align|gather|multline)\*?\}/.test(n) ? "formula" : n ? "text" : t;
}
function Sr(e) {
  const t = un(e);
  return t === "formula" || t === "table" || t === "figure";
}
function Ir(e, t) {
  return `${St(e, t).text || e.markdown || ""}`.trim();
}
function pa(e) {
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
function Ln(e) {
  const t = Ee(e);
  if (!t) return null;
  const n = [];
  for (const a of Array.isArray(t.pages) ? t.pages : []) {
    const o = Ee(a), i = Ze(o == null ? void 0 : o.page), s = Ze(o == null ? void 0 : o.width), c = Ze(o == null ? void 0 : o.height);
    i == null || s == null || c == null || n.push({ page: Math.floor(i), width: s, height: c });
  }
  if (!n.length) return null;
  const r = Ze(t.page_count ?? t.pageCount);
  return {
    pageCount: r == null ? n.length : Math.floor(r),
    pages: n
  };
}
function ha(e) {
  const t = Ee(wr(e));
  return {
    source: Ln(t == null ? void 0 : t.source),
    translated: Ln(t == null ? void 0 : t.translated)
  };
}
function gt(e, t) {
  const n = En(t);
  return n && e.find((r) => En(r.itemId) === n) || null;
}
function bt(e) {
  return `${e || ""}`.normalize("NFKC").toLocaleLowerCase().replace(/[\p{P}\p{S}\s]+/gu, "").trim();
}
function ga(e) {
  const t = `${e || ""}`.trim();
  if (!t) return [];
  const n = t.split(/\n\s*\n/g).map(bt).filter(Boolean), r = t.split(">").map(bt).filter(Boolean), a = [...n.reverse(), ...r.reverse(), bt(t)];
  return [...new Set(a)].filter((o) => o.length >= 16);
}
function ba(e, t) {
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
function ya(e, t) {
  if (!t) return null;
  const n = gt(e, t.block_id);
  if (n) return n;
  const r = ga(t.snippet);
  if (!r.length) return null;
  const a = t.page_idx != null ? Number(t.page_idx) + 1 : t.page != null ? Number(t.page) : null, o = Number.isFinite(a) && Number(a) >= 1 ? e.filter((l) => l.source.page === Math.floor(Number(a)) || l.translated.page === Math.floor(Number(a))) : e;
  let i = null, s = 0, c = !1;
  for (const l of o) {
    const d = [l.source.text, l.translated.text, l.markdown].map(bt).filter(Boolean);
    let u = 0;
    for (const f of r)
      for (const m of d)
        u = Math.max(u, ba(m, f));
    u > s ? (i = l, s = u, c = !1) : u > 0 && u === s && (c = !0);
  }
  return s > 0 && !c ? i : null;
}
function Cn(e) {
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
function va(e, t, n) {
  const r = Cn(t);
  if (!r) return null;
  const a = Number(n);
  return (Number.isFinite(a) && a >= 1 ? e.filter((i) => i.source.page === Math.floor(a)) : e).find((i) => [...i.assetUrls, ...i.assetIds].some((s) => {
    const c = Cn(s);
    return !!c && (c === r || r.endsWith(`/${c}`) || c.endsWith(`/${r}`));
  })) || null;
}
function St(e, t) {
  return t === "translated" ? e.translated : e.source;
}
function zn(e, t, n) {
  if (!e || !t) return null;
  const r = St(e, n), a = n === "translated" ? t.translated : t.source || t.translated, o = a == null ? void 0 : a.pages.find((i) => i.page === r.page);
  return o ? { itemId: e.itemId, region: e, box: r, pageSize: o } : null;
}
function Et(e, t, n) {
  if (!e || t <= 0 || n <= 0) return null;
  const { box: r, pageSize: a } = e;
  if (a.width <= 0 || a.height <= 0) return null;
  const [o, i, s, c] = r.bbox, l = r.origin === "bottom_left" ? a.height - c : i, d = r.origin === "bottom_left" ? a.height - i : c, u = Math.max(0, Math.min(t, o / a.width * t)), f = Math.max(u, Math.min(t, s / a.width * t)), m = Math.max(0, Math.min(n, l / a.height * n)), y = Math.max(m, Math.min(n, d / a.height * n));
  return f <= u || y <= m ? null : { left: u, top: m, width: f - u, height: y - m };
}
function _n(e) {
  return typeof e == "string" ? e.trim() : `${e ?? ""}`.trim();
}
function wa(e) {
  const t = (e == null ? void 0 : e.data) ?? e, n = t && typeof t == "object" ? t : {};
  return {
    activeJobId: _n(n.active_job_id),
    activeVersionId: _n(n.active_version_id)
  };
}
function Sa(e) {
  const { link: t, rejectedDocumentJobId: n, hasCommittedSource: r } = e, a = t.activeJobId && t.activeJobId !== n && !t.activeJobId.startsWith("doc:") ? t.activeJobId : "";
  return a ? { kind: "follow-active-job", jobId: a, activeVersionId: t.activeVersionId } : t.activeVersionId && !r ? { kind: "open-committed-source", documentId: "", revision: t.activeVersionId } : { kind: "open-source-url" };
}
function Ia(e) {
  const {
    payloadDocumentId: t,
    linkedActiveJobId: n,
    linkedActiveVersionId: r,
    sessionJobId: a,
    hasCommittedSource: o
  } = e;
  return t && r && n === a && !o ? { kind: "restore-committed-source", documentId: t, revision: r } : { kind: "open-job-artifacts" };
}
function Pa(e) {
  return e.status === 404 && !e.jobId && !!e.routeDocumentId && !!e.documentJobId && e.sessionJobId === e.documentJobId;
}
function Ra(e) {
  return e ? { data: e.data.slice() } : null;
}
const Ta = 2, ge = /* @__PURE__ */ new Map();
function Ht(e, t) {
  ge.delete(e), ge.set(e, t);
}
function Ma(e) {
  if (ge.size < Ta) return;
  const t = ge.keys().next().value;
  t && ge.delete(t);
}
function kt(e) {
  const t = `${e || ""}`.trim();
  if (!t || !ge.has(t)) return null;
  const n = ge.get(t);
  return Ht(t, n), n;
}
async function Pr(e, t = Ho, n = {}) {
  const r = `${e || ""}`.trim();
  if (!r)
    return null;
  if (ge.has(r)) {
    const s = ge.get(r);
    return Ht(r, s), s;
  }
  const a = await t(r, { signal: n.signal });
  if (!a.ok) {
    const s = new Error(`读取 PDF 失败 (${a.status})`);
    throw s.status = a.status, s;
  }
  const o = await a.arrayBuffer(), i = { data: new Uint8Array(o) };
  return ge.has(r) ? Ht(r, i) : (Ma(), ge.set(r, i)), i;
}
function xa(e = "", t = null) {
  const [n, r] = L(
    () => t || kt(e)
  ), [a, o] = L(
    () => !!`${e || ""}`.trim() && !t && !kt(e)
  ), [i, s] = L("");
  return j(() => {
    if (t) {
      r(t), o(!1), s("");
      return;
    }
    const c = `${e || ""}`.trim();
    if (!c) {
      r(null), o(!1), s("");
      return;
    }
    const l = kt(c);
    if (l) {
      r(l), o(!1), s("");
      return;
    }
    let d = !1;
    return o(!0), s(""), r(null), Pr(c).then((u) => {
      d || (r(u), o(!1));
    }).catch((u) => {
      d || (r(null), o(!1), s((u == null ? void 0 : u.message) || String(u)));
    }), () => {
      d = !0;
    };
  }, [e, t]), { file: n, loading: a, error: i };
}
function Ea(e) {
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
async function Jt(e) {
  const { url: t, label: n, percentStart: r, percentEnd: a, fence: o, setBoot: i } = e;
  if (!t || o.isInactive())
    return null;
  wt(i, r, n, "download");
  const s = await Pr(t, rt.fetchProtected, {
    signal: o.signal
  });
  return o.isInactive() ? null : (wt(i, a, n, "download"), s);
}
async function Na(e) {
  const { sourceFinal: t, translatedFinal: n, fence: r, setBoot: a } = e;
  wt(a, 25, "正在下载 PDF…", "download");
  const o = [];
  let i = null, s = null;
  return t && o.push(
    Jt({
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
    Jt({
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
function ka(e) {
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
    switchSessionMode: m,
    jobRefreshRevision: y,
    sessionEpochRef: h,
    closingRef: v,
    activeLoadAbortRef: b
  } = e, [g, I] = L(""), [w, P] = L(""), [N, x] = L(null), [D, T] = L(null), [M, R] = L(!1), [S, k] = L(""), [_, $] = L([]), [C, W] = L(() => ({
    source: null,
    translated: null
  })), [K, G] = L({
    loading: !0,
    percent: 4,
    text: ve.boot,
    stage: "progress",
    failed: !1
  });
  return j(() => {
    const J = new AbortController(), oe = h.current.value, te = Ea({
      sessionEpochRef: h,
      closingRef: v,
      abort: J,
      sessionEpoch: oe
    });
    if (b.current = J, v.current)
      return J.abort(), () => {
        b.current === J && (b.current = null);
      };
    function O(B, q) {
      te.markFailed(), G({
        loading: !1,
        percent: 100,
        text: B,
        stage: "failed",
        failed: !0
      }), Bt({ percent: 100, text: q, stage: "failed" });
    }
    function ne() {
      R(!0), G({
        loading: !1,
        percent: 100,
        text: ve.ready,
        stage: "ready",
        failed: !1
      }), Bt({ percent: 100, text: ve.ready, stage: "ready" });
    }
    function me() {
      return l != null && l.documentId ? kn(
        l.documentId,
        l.revision
      ) : Uo() ? Bo : ht(`/api/v1/documents/${encodeURIComponent(r)}/source.pdf`);
    }
    async function re() {
      let B = { activeJobId: "", activeVersionId: "" };
      try {
        const pe = await rt.fetchProtected(
          ht(`/api/v1/documents/${encodeURIComponent(r)}`)
        );
        if (pe != null && pe.ok) {
          const Je = await pe.json().catch(() => null);
          B = wa(Je);
        }
      } catch {
      }
      const q = Sa({
        link: B,
        rejectedDocumentJobId: o,
        hasCommittedSource: !!l
      });
      if (q.kind === "follow-active-job") {
        if (te.isInactive()) return;
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
        if (te.isInactive()) return;
        d({
          type: "committed-source",
          documentId: r,
          revision: q.revision,
          sessionIdentity: c
        }), m("source");
        return;
      }
      const ue = me();
      if (te.isInactive()) return;
      I(ue), P(""), k(""), f(c);
      const de = await Jt({
        url: ue,
        label: "正在下载原文 PDF…",
        percentStart: 30,
        percentEnd: 85,
        fence: te,
        setBoot: G
      });
      if (!te.isInactive()) {
        if (!de) {
          O("源文件不可用：该文档没有可读取的源 PDF。", "源文件下载失败");
          return;
        }
        x(de), ne();
      }
    }
    async function se() {
      const B = await rt.loadReaderPayload(t, {
        // committedSource 分支会丢弃 regions/metadata（旧页序已失效），
        // 直接跳过这两个可选请求，避免无效网络往返。
        includeOptionalArtifacts: !l
      });
      if (te.isInactive()) return;
      let q = null;
      if (n && !r) {
        try {
          q = await ta(ln, t);
        } catch {
        }
        if (te.isInactive()) return;
      }
      const ue = ia(B.jobPayload) || `${(q == null ? void 0 : q.document_id) || ""}`.trim();
      ue && !r && d({
        type: "resolved-job-document",
        jobId: t,
        documentId: ue
      });
      const de = Ia({
        payloadDocumentId: ue,
        linkedActiveJobId: `${(q == null ? void 0 : q.active_job_id) || ""}`.trim(),
        linkedActiveVersionId: `${(q == null ? void 0 : q.active_version_id) || ""}`.trim(),
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
        }), m("source");
        return;
      }
      const pe = Go(B.manifestPayload), Je = Yo(B.jobPayload, B.manifestPayload), lt = typeof pe == "string" ? pe : Vo(pe), ut = r || ue, _e = l != null && l.documentId ? kn(
        l.documentId,
        l.revision
      ) : lt || (ut ? ht(`/api/v1/documents/${encodeURIComponent(ut)}/source.pdf`) : ""), Ke = l ? "" : Je || "";
      if (I(_e || ""), P(Ke), k(ca(B.jobPayload, t)), u({
        jobPayload: B.jobPayload || null,
        manifestPayload: B.manifestPayload || null,
        sessionIdentity: c
      }), $(l ? [] : fa(B.regionsPayload)), W(l ? { source: null, translated: null } : ha(B.readerMetadata)), !_e && !Ke) {
        O(ve.failed, ve.failed);
        return;
      }
      const De = await Na({
        sourceFinal: _e || "",
        translatedFinal: Ke,
        fence: te,
        setBoot: G
      });
      if (De.status !== "inactive") {
        if (De.status === "incomplete") {
          O("PDF 下载失败，请重试", "PDF 下载失败");
          return;
        }
        x(De.sourceBytes), T(De.translatedBytes), ne();
      }
    }
    async function U() {
      R(!1), x(null), T(null), $([]), W({ source: null, translated: null }), wt(G, 8, ve.metadata, "metadata");
      try {
        if (i) {
          await re();
          return;
        }
        if (!t) {
          O(ve.failed, ve.failed);
          return;
        }
        await se();
      } catch (B) {
        if (te.isClosedOrStale() || (B == null ? void 0 : B.name) === "AbortError") return;
        te.markFailed();
        const q = Number(B == null ? void 0 : B.status);
        if (Pa({
          status: q,
          jobId: n,
          routeDocumentId: r,
          documentJobId: a,
          sessionJobId: t
        })) {
          d({ type: "missing-document-job", documentId: r, jobId: t }), d({ type: "cleared-resolved-document-job" }), m("source");
          return;
        }
        const ue = B instanceof Error ? B.message : ve.failed;
        O(ue, ue);
      }
    }
    return U(), () => {
      J.abort(), b.current === J && (b.current = null);
    };
  }, [t, r, a, o, i, s, l, y, n, c, d, u, f, m]), {
    sourceUrl: g,
    translatedUrl: w,
    sourceFile: N,
    translatedFile: D,
    assetsReady: M,
    title: S,
    regions: _,
    readerMetadata: C,
    boot: K
  };
}
function Aa() {
  const e = A(!1), t = A(null), { locationKey: n, jobId: r, routeDocumentId: a, sessionIdentity: o } = ra(), i = A({ identity: "", value: 0 });
  i.current.identity !== o && (i.current = {
    identity: o,
    value: i.current.value + 1
  }, e.current = !1);
  const s = A(o), c = A(""), l = A(""), d = A(() => {
  }), u = E(() => d.current(), []), f = oa({
    routeDocumentId: a,
    jobId: r,
    sessionIdentity: o,
    sessionIdentityRef: s,
    documentIdRef: c,
    sessionJobIdRef: l,
    switchToSourceMode: u
  }), {
    sessionJobId: m,
    documentId: y,
    sourceOnly: h,
    sourceViewOnly: v
  } = f, { mode: b, setMode: g, switchSessionMode: I } = da(v);
  d.current = () => {
    I("source");
  }, s.current = o, c.current = y, l.current = m;
  const w = la({
    sessionJobId: m,
    sessionIdentity: o,
    sessionIdentityRef: s,
    sessionJobIdRef: l,
    sessionEpochRef: i,
    closingRef: e
  }), {
    scopedJobPayload: P,
    scopedManifestPayload: N,
    jobStatus: x,
    jobTerminal: D,
    jobRefreshRevision: T,
    refreshJobArtifacts: M,
    refreshJobStatus: R
  } = w, S = ka({
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
    sessionEpochRef: i,
    closingRef: e,
    activeLoadAbortRef: t
  }), k = E(() => {
    var $;
    e.current = !0, ($ = t.current) == null || $.abort();
  }, []), _ = Y(
    () => ({
      fetchProtected: rt.fetchProtected,
      jobId: m,
      jobPayload: P,
      manifestPayload: N,
      sourceUrl: S.sourceUrl,
      translatedUrl: S.translatedUrl,
      sourceOnly: v
    }),
    [m, P, N, S.sourceUrl, S.translatedUrl, v]
  );
  return {
    jobId: m,
    jobStatus: x,
    workflow: `${(P == null ? void 0 : P.workflow) || ""}`.trim().toLowerCase(),
    jobTerminal: D,
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
    download: _,
    refreshJobArtifacts: M,
    refreshJobStatus: R,
    refreshCommittedDocument: f.refreshCommittedDocument,
    prepareClose: k
  };
}
const Rr = 0.25, Tr = 1, La = 0.05, st = 0.5, Ca = 16, za = 8;
function Qe(e) {
  return st;
}
function Nt(e) {
  return Number.isFinite(e) ? Math.min(Tr, Math.max(Rr, e)) : st;
}
function ot(e, t) {
  const n = Nt(Number(e) + t * La);
  return Math.round(n * 100) / 100;
}
function _a(e) {
  return Math.round(Nt(e) * 100);
}
function Da(e) {
  const n = (Number(e) || 0) - Ca - za;
  return Math.max(160, Math.floor(n));
}
function Fa(e, t = st) {
  const n = Nt(t);
  return Da((Number(e) || 0) * n);
}
function $a(e, t) {
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
const It = "data-reader-page", Oa = "data-reader-pane", ja = "reader-scroll-shell", Ua = "reader-react-scroll-shell", dn = "reader-react-pdf-page-slot";
function Pt(e, t) {
  const n = e != null ? `[${It}="${e}"]` : `[${It}]`;
  return t ? `${n}[${Oa}="${t}"]` : n;
}
function Ba() {
  return `.${dn}[${It}]`;
}
function Mr(e) {
  return Number(e.getAttribute(It));
}
const fn = 48;
function xr(e, t = fn) {
  return e.getBoundingClientRect().top + t;
}
function Er(e, t) {
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
  const a = Mr(n);
  if (!Number.isFinite(a) || a < 1)
    return null;
  const o = n.getBoundingClientRect(), i = o.height > 0 ? o.height : 1, s = Math.min(1, Math.max(0, (t - o.top) / i));
  return { el: n, page: a, fraction: s };
}
function At(e, t, n = fn) {
  if (!e)
    return null;
  const r = Pt(void 0, t), a = Array.from(e.querySelectorAll(r));
  if (!a.length || e.getBoundingClientRect().height <= 0)
    return null;
  const i = xr(e, n), s = Er(a, i);
  return s ? { page: s.page, fraction: s.fraction } : null;
}
function mn(e, t, n = "auto", r, a = fn) {
  if (!e || !t)
    return !1;
  const o = Math.max(1, Math.floor(Number(t.page) || 1)), i = Math.min(1, Math.max(0, Number(t.fraction) || 0));
  let s = null;
  if (r && (s = e.querySelector(Pt(o, r))), s || (s = e.querySelector(Pt(o))), !s)
    return !1;
  const c = e.getBoundingClientRect(), l = s.getBoundingClientRect();
  if (c.height <= 0 || l.height < 8 && s.offsetHeight < 8)
    return !1;
  const d = l.height > 0 ? l.height : s.offsetHeight, u = e.scrollTop + (l.top - c.top), f = Math.max(0, u + i * d - a);
  return n === "auto" ? e.scrollTop = f : e.scrollTo({ top: f, behavior: n }), !0;
}
function Wa(e, t, n = "smooth", r) {
  return mn(
    e,
    { page: t, fraction: 0 },
    n,
    r
  );
}
function Kt(e, t, n) {
  const r = (n == null ? void 0 : n.behavior) ?? "auto", a = (n == null ? void 0 : n.delaysMs) ?? [0, 32, 120, 280];
  let o = !1, i = !1;
  const s = [], c = () => {
    var d;
    if (o) return;
    mn(
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
function Ha(e, t, n) {
  return Kt(
    e,
    { page: t, fraction: 0 },
    n
  );
}
function Rt(e, t) {
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
const Ja = [
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
], Ka = [
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
function qa(e) {
  const t = e.length === 1 ? e.toLowerCase() : e;
  for (const n of Ja)
    if (n.keys.some(
      (a) => a.length === 1 ? a === t : a === e
    )) return n;
  return null;
}
function Va(e) {
  if (!(e instanceof HTMLElement))
    return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function Ga(e) {
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
  j(() => {
    if (!l)
      return;
    const d = (u) => {
      if (u.defaultPrevented || u.metaKey || u.ctrlKey || u.altKey || Va(u.target))
        return;
      const f = u.key, m = qa(f);
      if (m) {
        if (m.mode) {
          if (n && m.mode !== "source")
            return;
          u.preventDefault(), r(m.mode);
          return;
        }
        if (!(m.requiresPages && s <= 0))
          switch (u.preventDefault(), m.action) {
            case "zoom-in":
              o(ot(a, 1));
              return;
            case "zoom-out":
              o(ot(a, -1));
              return;
            case "zoom-reset":
              o(Qe());
              return;
            case "next-page":
              c(Rt(i + 1, s));
              return;
            case "prev-page":
              c(Rt(i - 1, s));
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
const Ya = 160, Za = 8, Xa = 960;
function Qa() {
  const e = A(null), [t, n] = L(null), [r, a] = L(Xa), o = E((i) => {
    e.current = i, n(i);
  }, []);
  return j(() => {
    const i = t;
    if (!i || typeof ResizeObserver > "u")
      return;
    const s = (l) => {
      !Number.isFinite(l) || l < Ya || a((d) => Math.abs(d - l) < Za ? d : l);
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
function ei(e) {
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
const Lt = { source: 0, translated: 0 };
function ti(e, t) {
  const {
    mode: n,
    sourceOnly: r,
    assetsReady: a,
    sourceUrl: o,
    translatedUrl: i,
    sourceFile: s,
    translatedFile: c
  } = e, l = `${(t == null ? void 0 : t.identityKey) || ""}\0${o}\0${i}`, d = A(l);
  d.current = l;
  const [u, f] = L(() => ({
    identity: l,
    pages: Lt
  })), [m, y] = L(() => ({ identity: l, tick: 0 })), h = u.identity === l ? u.pages : Lt, v = m.identity === l ? m.tick : 0, b = ei({
    mode: n,
    sourceOnly: r,
    assetsReady: a,
    hasSource: !!s || !!o,
    hasTranslated: !!c
  }), { primaryPane: g } = b, I = E((R, S) => {
    d.current === l && f((k) => {
      const _ = k.identity === l ? k.pages : Lt;
      return _[S] === R && k.identity === l ? k : {
        identity: l,
        pages: { ..._, [S]: R }
      };
    });
  }, [l]), w = A(null), P = E(() => {
    w.current && clearTimeout(w.current);
    const R = l;
    w.current = setTimeout(() => {
      w.current = null, d.current === R && y((S) => ({
        identity: R,
        tick: S.identity === R ? S.tick + 1 : 1
      }));
    }, 60);
  }, [l]);
  j(() => (w.current && (clearTimeout(w.current), w.current = null), f((R) => R.identity === l && R.pages.source === 0 && R.pages.translated === 0 ? R : { identity: l, pages: { source: 0, translated: 0 } }), y((R) => R.identity === l && R.tick === 0 ? R : { identity: l, tick: 0 }), () => {
    w.current && (clearTimeout(w.current), w.current = null);
  }), [l]);
  const N = Y(
    () => Math.max(h.source, h.translated),
    [h]
  ), x = g === "translated" ? h.translated : h.source || h.translated, D = t == null ? void 0 : t.userZoom, T = t == null ? void 0 : t.shellWidth, M = `${l}-${v}-${D}-${n}-${h.source}-${h.translated}-${T}`;
  return {
    ...b,
    numPagesByPane: h,
    hudNumPages: N,
    primaryNumPages: x,
    metricsTick: v,
    onNumPages: I,
    onMetrics: P,
    rowSyncRevision: M
  };
}
const ni = "retainpdf:reader:view:v1:", Dn = /* @__PURE__ */ new Set([
  "source",
  "translated",
  "markdown",
  "ai"
]), ri = /* @__PURE__ */ new Set([
  "source",
  "compare",
  "translated"
]);
function Nr() {
  try {
    return typeof globalThis.localStorage > "u" ? null : globalThis.localStorage;
  } catch {
    return null;
  }
}
function qt(e) {
  return `${e || ""}`.trim();
}
function oi({
  documentId: e,
  jobId: t
}) {
  const n = qt(e);
  if (n) return `document:${n}`;
  const r = qt(t);
  return r ? `job:${r}` : "";
}
function kr(e) {
  const t = qt(e);
  return t ? `${ni}${t}` : "";
}
function ai(e) {
  if (!e || typeof e != "object") return;
  const t = Math.floor(Number(e.page)), n = Number(e.fraction);
  if (!(!Number.isFinite(t) || t < 1 || !Number.isFinite(n)))
    return {
      page: t,
      fraction: Math.max(0, Math.min(1, n))
    };
}
function ii(e) {
  if (e === null) return null;
  if (!e || typeof e != "object") return;
  const t = `${e.left || ""}`, n = `${e.right || ""}`;
  if (!(!Dn.has(t) || !Dn.has(n) || t === n))
    return { left: t, right: n };
}
function si(e) {
  return e === null ? null : e === "markdown" || e === "ai" ? e : void 0;
}
function ci(e) {
  return ri.has(e) ? e : void 0;
}
function Ar(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (t.schema !== "retainpdf_reader_view_v1") return null;
  const n = ai(t.anchor), r = Number(t.zoom), a = ci(t.mode), o = ii(t.splitLayout), i = si(t.assistantPanel);
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
function Ie(e, t = Nr()) {
  const n = kr(e);
  if (!n || !t) return null;
  try {
    const r = t.getItem(n);
    return r ? Ar(JSON.parse(r)) : null;
  } catch {
    return null;
  }
}
function Tt(e, t, n = Nr()) {
  const r = kr(e);
  if (!r || !n) return null;
  const a = Ie(e, n), o = Ar({
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
function li(e, t, n = "") {
  const [r, a] = L(() => {
    var u;
    return ((u = Ie(n)) == null ? void 0 : u.zoom) ?? Qe();
  }), o = A(r), i = A(n);
  o.current = r;
  const s = A(1);
  j(() => {
    var f;
    if (i.current === n) return;
    i.current = n;
    const u = ((f = Ie(n)) == null ? void 0 : f.zoom) ?? Qe();
    s.current = 1, o.current = u, a(u);
  }, [e, n]);
  const c = E((u) => {
    const f = Nt(u), m = o.current;
    Math.abs(f - m) < 5e-4 || (s.current = f / (m || 1), Tt(i.current, { zoom: f }), a(f));
  }, []), l = E((u) => {
    c(ot(o.current, u));
  }, [c]), d = E((u) => {
    c(Qe());
  }, [c]);
  return Le(() => {
    const u = s.current;
    Math.abs(u - 1) < 1e-3 || (s.current = 1, $a(t == null ? void 0 : t.current, u));
  }, [r, t]), { userZoom: r, onZoomChange: c, stepZoom: l, resetZoom: d };
}
function ui(e, t = !0) {
  const [n, r] = L(null), a = E(() => {
    var s, c;
    r(null);
    const i = (s = globalThis.getSelection) == null ? void 0 : s.call(globalThis);
    (c = i == null ? void 0 : i.removeAllRanges) == null || c.call(i);
  }, []), o = e.current ?? null;
  return j(() => {
    if (!t)
      return;
    const i = () => {
      var $, C;
      const h = e.current, v = ($ = globalThis.getSelection) == null ? void 0 : $.call(globalThis);
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
      let I = b.commonAncestorContainer;
      I.nodeType === Node.TEXT_NODE && (I = I.parentElement);
      const w = (C = I == null ? void 0 : I.closest) == null ? void 0 : C.call(
        I,
        "[data-reader-page]"
      );
      if (!w || !h.contains(w)) {
        r(null);
        return;
      }
      const P = Math.max(1, Math.floor(Number(w.getAttribute("data-reader-page")) || 1)), x = w.getAttribute("data-reader-pane") === "translated" ? "translated" : "source", D = b.getClientRects(), T = D[D.length - 1] || b.getBoundingClientRect();
      if (!T || T.width === 0 && T.height === 0) {
        r(null);
        return;
      }
      const M = typeof window < "u" ? window.innerWidth : 800, R = typeof window < "u" ? window.innerHeight : 600, S = 16, k = Math.min(Math.max(S, T.left), M - S), _ = Math.min(Math.max(S, T.top), R - S);
      r({
        selectionType: "text",
        quote: g,
        page: P,
        pane: x,
        rect: {
          left: k,
          top: _,
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
function di(e) {
  const { mode: t, setMode: n, beginModeSwitch: r } = e, a = A(t), o = A(n), i = A(r);
  return a.current = t, o.current = n, i.current = r, { setModeKeepingPage: E((c) => {
    c !== a.current && (i.current(), o.current(c));
  }, []) };
}
function fi() {
  const [e, t] = L(null), n = E((i) => {
    t(i);
  }, []), r = E((i = null) => {
    t((s) => !i || s === i ? null : s);
  }, []), a = E((i) => {
    t((s) => s === i ? null : i);
  }, []), o = E(
    (i) => e === i,
    [e]
  );
  return { active: e, open: n, close: r, toggle: a, isOpen: o };
}
function mi(e, t, n = !0, r = "", a) {
  const [o, i] = L(1);
  return j(() => {
    if (!n || t <= 0) {
      i(1);
      return;
    }
    const s = e.current;
    if (!s)
      return;
    let c = !1, l = null, d = 0;
    const u = Pt(void 0, a), f = () => {
      if (c) return;
      const h = Array.from(s.querySelectorAll(u));
      if (!h.length)
        return;
      const v = xr(s), b = Er(h, v);
      b && i(b.page);
    }, m = () => {
      c || (d && cancelAnimationFrame(d), d = requestAnimationFrame(() => {
        d = 0, f();
      }));
    }, y = () => {
      if (c) return;
      if (!Array.from(s.querySelectorAll(u)).length) {
        l = setTimeout(y, 120);
        return;
      }
      f(), s.addEventListener("scroll", m, { passive: !0 });
    };
    return y(), () => {
      c = !0, l && clearTimeout(l), d && cancelAnimationFrame(d), s.removeEventListener("scroll", m);
    };
  }, [e, t, n, r, a]), o;
}
const pi = "canvas, .react-pdf__Page, .reader-react-pdf-page, .reader-react-pdf-page-placeholder", Fn = /* @__PURE__ */ new WeakMap();
function hi(e) {
  const t = Number(e.getAttribute("data-natural-height"));
  if (Number.isFinite(t) && t > 0)
    return t;
  let n = Fn.get(e);
  if ((n == null || !n.isConnected) && (n = e.querySelector(pi), Fn.set(e, n)), n) {
    const a = n.getBoundingClientRect().height;
    if (Number.isFinite(a) && a > 0)
      return a;
  }
  const r = e.getBoundingClientRect().height;
  return Number.isFinite(r) && r > 0 ? r : 0;
}
function gi(e, t) {
  if (e.size !== t.size) return !1;
  for (const [n, r] of t)
    if (e.get(n) !== r) return !1;
  return !0;
}
function bi(e) {
  const t = /* @__PURE__ */ new Map();
  e.querySelectorAll(Ba()).forEach((r) => {
    const a = Mr(r);
    if (!Number.isFinite(a) || a < 1) return;
    const o = hi(r);
    if (o <= 0) return;
    const i = t.get(a) || { height: 0, count: 0 };
    i.height = Math.max(i.height, o), i.count += 1, t.set(a, i);
  });
  const n = /* @__PURE__ */ new Map();
  return t.forEach((r, a) => {
    r.count >= 2 && r.height > 0 && n.set(a, Math.ceil(r.height));
  }), n;
}
function yi(e, t, n = "", r) {
  const [a, o] = L(() => /* @__PURE__ */ new Map()), i = A(a), s = A(r);
  return s.current = r, Le(() => {
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
      const w = bi(I);
      gi(i.current, w) || (i.current = w, o(w)), d && !u && (u = !0, (P = s.current) == null || P.call(s));
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
const vi = [0, 48, 140, 320, 560], wi = 700, Si = [80, 200, 400], Ii = 500, Pi = 50, Ri = 180, $n = [0, 48, 140, 320, 700, 1200];
function Ti(e, t) {
  var R;
  const {
    primaryPane: n,
    mode: r,
    enabled: a = !0,
    persistenceKey: o = "",
    restoreReady: i = !0
  } = t, s = A(
    ((R = Ie(o)) == null ? void 0 : R.anchor) || { page: 1, fraction: 0 }
  ), c = A(null), l = A(!1), d = A(r), u = A(null), f = A(null), m = A(null), y = A(null), h = A(o), v = A(""), b = A(n);
  b.current = n;
  const g = E(() => {
    var S;
    (S = u.current) == null || S.call(u), u.current = null, f.current != null && (clearTimeout(f.current), f.current = null);
  }, []), I = E((S = !1) => {
    y.current != null && (clearTimeout(y.current), y.current = null);
    const k = () => {
      y.current = null, Tt(h.current, {
        anchor: he(s.current)
      });
    };
    S ? k() : y.current = setTimeout(k, Ri);
  }, []), w = E((S) => {
    s.current = he(S), c.current = null, m.current != null && clearTimeout(m.current), m.current = setTimeout(() => {
      m.current = null, l.current = !1;
    }, Pi);
  }, []);
  j(() => {
    if (!a)
      return;
    let S = !1, k = null, _ = null, $ = null;
    const C = () => {
      if (S) return;
      const W = e.current;
      if (!W) {
        $ = setTimeout(C, 50);
        return;
      }
      k = W, _ = () => {
        if (l.current)
          return;
        const K = At(k, b.current);
        K && (s.current = K, I());
      }, k.addEventListener("scroll", _, { passive: !0 }), l.current || _();
    };
    return C(), () => {
      S = !0, $ != null && clearTimeout($), k && _ && k.removeEventListener("scroll", _);
    };
  }, [a, r, n, e, I]), Le(() => {
    var k;
    if (h.current === o) return;
    I(!0), g(), m.current != null && (clearTimeout(m.current), m.current = null), h.current = o, v.current = "";
    const S = (k = Ie(o)) == null ? void 0 : k.anchor;
    s.current = S ? he(S) : { page: 1, fraction: 0 }, c.current = null, l.current = !!o, d.current = r;
  }, [o, r, I, g]), j(() => {
    var k;
    if (!a || !i || !o || v.current === o) return;
    v.current = o;
    const S = he(
      ((k = Ie(o)) == null ? void 0 : k.anchor) || { page: 1, fraction: 0 }
    );
    return s.current = S, c.current = S, l.current = !0, g(), u.current = Kt(
      () => e.current,
      S,
      {
        behavior: "auto",
        pane: b.current,
        delaysMs: $n,
        onDone: () => w(S)
      }
    ), f.current = setTimeout(() => {
      f.current = null, w(S);
    }, Math.max(...$n) + 160), () => g();
  }, [a, i, o, e, w, g]), j(() => {
    if (d.current === r)
      return;
    if (d.current = r, !a) {
      l.current = !1, c.current = null, g();
      return;
    }
    const S = c.current ? he(c.current) : he(s.current);
    return l.current = !0, c.current = S, s.current = S, g(), u.current = Kt(
      () => e.current,
      S,
      {
        behavior: "auto",
        pane: n,
        // 等页宽/行高同步后再钉；同一 locked 幂等，不会越滚越远
        delaysMs: vi,
        onDone: () => w(S)
      }
    ), f.current = setTimeout(() => {
      f.current = null, w(S);
    }, wi), () => {
      g();
    };
  }, [r, a, n, e, w, g]), j(() => () => {
    g(), m.current != null && (clearTimeout(m.current), m.current = null), I(!0);
  }, [g, I]);
  const P = E(() => {
    const S = At(
      e.current,
      b.current
    );
    return he(S || s.current);
  }, [e]), N = E(() => {
    l.current = !0;
    const S = At(
      e.current,
      b.current
    ), k = he(S ?? s.current);
    return s.current = k, c.current = k, I(), k;
  }, [e, I]), x = E((S, k, _) => {
    const $ = _ || b.current, C = Rt(S, k || 1), W = { page: C, fraction: 0 };
    s.current = W, l.current = !0, c.current = W, I(), g(), Wa(e.current, C, "smooth", $), u.current = Ha(
      () => e.current,
      C,
      {
        behavior: "auto",
        pane: $,
        delaysMs: Si,
        onDone: () => w(W)
      }
    ), f.current = setTimeout(() => {
      f.current = null, w(W);
    }, Ii);
  }, [e, w, g, I]), D = E(() => he(s.current), []), T = E(() => l.current, []), M = E(() => {
    if (!l.current || !c.current)
      return;
    const S = he(c.current);
    mn(
      e.current,
      S,
      "auto",
      b.current
    );
  }, [e]);
  return {
    lockFromShell: P,
    beginModeSwitch: N,
    goToPage: x,
    getAnchor: D,
    isRestoring: T,
    repinIfRestoring: M
  };
}
function Mi(e, t) {
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
function xi(e, t, n) {
  const r = `${(n == null ? void 0 : n.jobId) || ""}`.trim(), a = `${(n == null ? void 0 : n.documentId) || ""}`.trim(), o = `j:${r}:d:${a}`;
  return t == null ? `${o}:none:${(e == null ? void 0 : e.blockId) || ""}` : `${o}:p:${t}:b:${(e == null ? void 0 : e.blockId) || ""}`;
}
const Ei = [0, 80, 200, 400, 800];
function Ni(e) {
  const { enabled: t, numPages: n, goToPage: r, resolveBlockPage: a, onAnchorApplied: o, jobId: i, documentId: s } = e, c = A(""), l = A(r);
  l.current = r;
  const d = A(a);
  d.current = a;
  const u = A(o);
  u.current = o, j(() => {
    var v;
    if (!t || !Number.isFinite(n) || n < 1)
      return;
    const f = Jo(), m = Mi(f, d.current), y = xi(f, m, { jobId: i, documentId: s });
    if (c.current === y)
      return;
    if (m == null) {
      c.current = y;
      return;
    }
    c.current = y, f && ((v = u.current) == null || v.call(u, f, m));
    const h = [];
    for (const b of Ei)
      h.push(
        setTimeout(() => {
          l.current(m);
        }, b)
      );
    return () => {
      for (const b of h) clearTimeout(b);
    };
  }, [t, n, i, s]);
}
const ft = {
  layoutByPage: /* @__PURE__ */ new Map(),
  pagesByPage: /* @__PURE__ */ new Map(),
  lastSeq: 0,
  connection: "idle",
  jobStatus: "",
  error: ""
};
function ki(e) {
  return new Map(((e == null ? void 0 : e.pages) || []).map((t) => [t.page_idx, t]));
}
function On(e, t) {
  return e.attempt !== t.attempt ? e.attempt < t.attempt ? -1 : 1 : e.generation !== t.generation ? e.generation < t.generation ? -1 : 1 : 0;
}
function Lr(e, t, n) {
  if (n.page_idx !== t.page_idx) return "retry";
  const r = On(n, t);
  if (r < 0 || r === 0 && n.page_hash !== t.page_hash) return "retry";
  if (!e) return "accept";
  const a = On(n, e);
  return a < 0 ? "ignore" : a === 0 ? n.page_hash === e.pageHash ? "ignore" : "retry" : "accept";
}
function Ai(e, t, n) {
  if (t.seq <= e.lastSeq) return e;
  const r = e.pagesByPage.get(t.page_idx), a = Lr(r, t, n);
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
const jn = [250, 500, 1e3, 2e3, 4e3], Ct = [80, 160, 320, 640, 1e3, 1500], Un = [250, 500, 1e3, 2e3, 4e3, 5e3], Li = /* @__PURE__ */ new Set(["succeeded", "failed", "cancelled", "canceled"]);
function Vt(e, t) {
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
function zt(e, t) {
  if (e instanceof vt) {
    if (e.code === "LIVE_TRANSLATION_PAGE_NOT_COMMITTED")
      return "尚未收到可显示的页面译文";
    if (e.code === "LIVE_TRANSLATION_LAYOUT_NOT_READY")
      return "正在等待 OCR 版面数据";
  }
  return `${(e == null ? void 0 : e.message) || ""}`.trim() || t;
}
async function Ci(e, t, n, r) {
  let a = null;
  for (let o = 0; ; o += 1) {
    try {
      const s = await Io(e, t.page_idx, { signal: r });
      if (Lr(n.pagesByPage.get(t.page_idx), t, s) !== "retry")
        return s;
      a = new vt(
        "Authoritative page snapshot has not reached the event generation",
        409,
        "LIVE_TRANSLATION_SNAPSHOT_UNAVAILABLE"
      );
    } catch (s) {
      if ((s == null ? void 0 : s.name) === "AbortError") throw s;
      a = s;
      const c = s instanceof vt ? s.code : "";
      if (c && ![
        "LIVE_TRANSLATION_PAGE_NOT_COMMITTED",
        "LIVE_TRANSLATION_SNAPSHOT_UNAVAILABLE"
      ].includes(c)) throw s;
    }
    const i = Ct[Math.min(o, Ct.length - 1)];
    if (await Vt(i, r), o >= Ct.length + 2) throw a;
  }
}
function zi({
  jobId: e,
  jobStatus: t,
  enabled: n
}) {
  const [r, a] = L(ft), o = A(r), i = A("");
  o.current = r;
  const s = `${e || ""}`.trim(), c = `${t || ""}`.trim().toLowerCase(), l = Li.has(c) ? c : "";
  return j(() => {
    if (!n || !s) {
      i.current = "", o.current = ft, a(ft);
      return;
    }
    const d = i.current === s;
    i.current = s;
    const u = new AbortController();
    let f = !1;
    const m = {
      ...d ? o.current : ft,
      connection: l ? "terminal" : "connecting",
      jobStatus: c,
      error: ""
    };
    o.current = m, a(m);
    const y = (b) => {
      u.signal.aborted || a((g) => {
        const I = b(g);
        return o.current = I, I;
      });
    }, h = async () => {
      let b = 0;
      for (; !u.signal.aborted; )
        try {
          const g = await wo(s, { signal: u.signal });
          f = !0, y((I) => ({
            ...I,
            layoutByPage: ki(g),
            jobStatus: c,
            error: ""
          }));
          return;
        } catch (g) {
          if ((g == null ? void 0 : g.name) === "AbortError") return;
          if (!(g instanceof vt && g.code === "LIVE_TRANSLATION_LAYOUT_NOT_READY")) {
            y((w) => ({
              ...w,
              connection: l ? "terminal" : "unavailable",
              jobStatus: c,
              error: zt(g, "实时译文暂不可用")
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
            error: zt(g, "正在等待 OCR 版面数据")
          })), await Vt(jn[Math.min(b, jn.length - 1)], u.signal).catch(() => {
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
          await So(s, {
            afterSeq: o.current.lastSeq,
            signal: u.signal,
            onEvent: async (g) => {
              if (g.seq <= o.current.lastSeq) return;
              const I = await Ci(
                s,
                g,
                o.current,
                u.signal
              );
              y((w) => {
                const P = Ai(w, g, I);
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
          y((I) => ({
            ...I,
            connection: l ? "terminal" : "reconnecting",
            jobStatus: c,
            error: zt(g, "实时译文连接已中断，正在重连")
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
        await Vt(Un[Math.min(b, Un.length - 1)], u.signal).catch(() => {
        }), b += 1;
      }
    })(), () => u.abort();
  }, [n, s, l]), r;
}
const _i = 2e3;
function Di(e) {
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
const Fi = /* @__PURE__ */ new Set(["book", "translate"]);
function Cr(e) {
  return !!(e.jobId && e.sourceUrl && Fi.has(e.workflow));
}
function $i(e) {
  return !!(Cr(e) && !(e.jobStatus === "succeeded" && e.translatedUrl));
}
function Oi() {
  const e = Aa(), t = Cr({
    jobId: e.jobId,
    sourceUrl: e.sourceUrl,
    workflow: e.workflow
  }), n = $i({
    jobId: e.jobId,
    sourceUrl: e.sourceUrl,
    translatedUrl: e.translatedUrl,
    jobStatus: e.jobStatus,
    workflow: e.workflow
  }), r = zi({
    jobId: e.jobId,
    jobStatus: e.jobStatus,
    enabled: t
  }), a = fi(), { shellRef: o, shellEl: i, shellWidth: s, bindShell: c } = Qa(), l = oi({
    documentId: e.documentId,
    jobId: e.jobId
  }), d = `${l}\0${e.jobId}\0${e.sourceUrl}\0${e.translatedUrl}`, { userZoom: u, onZoomChange: f } = li(e.mode, o, l), m = ti(
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
    beginModeSwitch: y,
    goToPage: h,
    repinIfRestoring: v
  } = Ti(o, {
    primaryPane: m.primaryPane,
    mode: e.mode,
    enabled: !e.boot.loading,
    persistenceKey: l,
    restoreReady: m.primaryNumPages > 0
  });
  j(() => {
    v();
  }, [s, v]);
  const b = yi(
    o,
    m.compareMode,
    m.rowSyncRevision,
    v
  ), g = mi(
    o,
    m.primaryNumPages,
    !e.boot.loading,
    `${e.mode}-${u}-${m.metricsTick}`,
    m.primaryPane
  ), I = E((O, ne) => {
    var re, se;
    const me = Math.max(
      Number(m.hudNumPages) || 0,
      Number(m.primaryNumPages) || 0,
      Number((re = m.numPagesByPane) == null ? void 0 : re.source) || 0,
      Number((se = m.numPagesByPane) == null ? void 0 : se.translated) || 0
    );
    h(O, me, ne);
  }, [h, m.hudNumPages, m.primaryNumPages, m.numPagesByPane]), [w, P] = L(null), N = A(null), x = E((O) => {
    N.current && clearTimeout(N.current), P(O), O && (N.current = setTimeout(() => P(null), _i));
  }, []);
  j(() => () => {
    N.current && clearTimeout(N.current);
  }, []);
  const D = E((O) => {
    const ne = gt(e.regions, O);
    return ne ? St(ne, m.primaryPane).page : null;
  }, [e.regions, m.primaryPane]), T = E((O, ne) => {
    const me = ne || m.primaryPane, re = typeof O == "object" && O ? `${O.block_id || ""}`.trim() : "", se = typeof O == "object" && O ? `${O.image_url || ""}`.trim() : "", U = typeof O == "object" && O ? O.page_idx != null ? Number(O.page_idx) + 1 : O.page != null ? Number(O.page) : null : typeof O == "number" ? O + 1 : null, B = va(e.regions, se, U) || gt(e.regions, re) || (typeof O == "object" ? ya(e.regions, O) : null);
    let q = B ? St(B, me).page : null;
    q == null && (q = Di(O)), !(q == null || q < 1) && (x(B), I(q, me));
  }, [x, I, m.primaryPane, e.regions]);
  Ni({
    enabled: !e.boot.loading && !e.boot.failed && e.assetsReady,
    numPages: m.hudNumPages || 0,
    goToPage: I,
    resolveBlockPage: D,
    jobId: e.jobId,
    documentId: e.documentId,
    onAnchorApplied: (O) => {
      x(gt(e.regions, O.blockId));
    }
  });
  const { setModeKeepingPage: M } = di({
    mode: e.mode,
    setMode: e.setMode,
    beginModeSwitch: y
  }), [R, S] = L(null), {
    selection: k,
    clearSelection: _
  } = ui(o, !e.boot.loading && !e.boot.failed), $ = E(() => {
    S(null), _();
  }, [_]), C = E((O) => {
    _(), S(O);
  }, [_]);
  j(() => {
    k && S(null);
  }, [k]), j(() => {
    const O = o.current;
    if (!O) return;
    const ne = () => S(null);
    return O.addEventListener("scroll", ne, { passive: !0 }), () => O.removeEventListener("scroll", ne);
  }, [i, o]);
  const W = k || R;
  j(() => {
    x(null), $();
  }, [d, x, $]);
  const K = !e.boot.loading && !e.boot.failed;
  Ga({
    mode: e.mode,
    sourceOnly: e.sourceOnly,
    setMode: M,
    userZoom: u,
    onZoomChange: f,
    currentPage: g,
    numPages: m.hudNumPages,
    goToPage: I,
    enabled: K
  });
  const G = Y(() => a, [a.active, a.open, a.close, a.toggle, a.isOpen]), J = Y(() => ({ bindShell: c, shellEl: i, shellWidth: s, shellRef: o }), [c, i, s, o]), oe = Y(() => ({
    sourceUrl: e.sourceUrl,
    translatedUrl: e.translatedUrl,
    sourceFile: e.sourceFile,
    translatedFile: e.translatedFile
  }), [e.sourceUrl, e.translatedUrl, e.sourceFile, e.translatedFile]), te = Y(() => ({
    session: e,
    boot: e.boot,
    sourceOnly: e.sourceOnly,
    mode: e.mode,
    userZoom: u,
    onZoomChange: f,
    shell: J,
    panes: m,
    sessionFiles: oe,
    rowHeights: b,
    goToPage: I,
    activeRegion: w,
    jumpToAnchor: T,
    setModeKeepingPage: M,
    download: e.download,
    showHud: K,
    tools: G,
    selection: W,
    clearSelection: $,
    selectRegion: C,
    documentTitle: e.title || "",
    viewStateKey: l,
    liveTranslation: r,
    liveTranslationAvailable: n
  }), [e, J, m, oe, b, I, w, T, M, K, G, W, $, C, u, f, l, r, n]);
  return Y(() => ({
    ...te,
    currentPage: g
  }), [te, g]);
}
const ji = "retainpdf:soft-reader-close";
function Ui() {
  return new URL("./index.html", window.location.href).href;
}
function Bi() {
  if (typeof window > "u" || window.self === window.top) return !1;
  try {
    return window.parent.postMessage(
      { type: ji },
      window.location.origin
    ), !0;
  } catch {
    return !1;
  }
}
function Wi(e, t, n) {
  if (n <= 1 || !e) return !1;
  try {
    const r = new URL(t), a = new URL(e, r);
    return a.origin === r.origin && !/reader\.html$/i.test(a.pathname) && !/detail\.html$/i.test(a.pathname);
  } catch {
    return !1;
  }
}
function Hi() {
  if (!(typeof window > "u") && !Bi()) {
    if (Wi(
      document.referrer,
      window.location.href,
      window.history.length
    )) {
      window.history.back();
      return;
    }
    window.location.assign(Ui());
  }
}
function Ji({ onBeforeClose: e } = {}) {
  return /* @__PURE__ */ z(
    "button",
    {
      id: "reader-close-home-btn",
      type: "button",
      className: "reader-close-home-btn",
      "aria-label": "返回主页",
      title: "返回主页",
      onClick: () => {
        e == null || e(), Hi();
      },
      children: [
        /* @__PURE__ */ p(He, { className: "reader-close-home-icon", size: 18, strokeWidth: 2.25, "aria-hidden": !0 }),
        /* @__PURE__ */ p("span", { className: "reader-close-home-label", children: "关闭" })
      ]
    }
  );
}
let Bn = !1;
function Ki() {
  if (Bn)
    return;
  const e = Ut("build/pdf.worker.mjs");
  e && (_o.GlobalWorkerOptions.workerSrc = e, Bn = !0);
}
const qi = {
  formula: "公式",
  table: "表格",
  figure: "图片",
  text: "文字",
  region: "区域"
};
function Vi({
  pane: e,
  width: t,
  height: n,
  regions: r,
  onSelect: a
}) {
  const o = r.flatMap((i) => {
    if (!Sr(i.region)) return [];
    const s = Et(i, t, n);
    return s ? [{ highlight: i, rect: s }] : [];
  });
  return o.length ? /* @__PURE__ */ p("div", { className: "reader-structure-selection-layer", "aria-label": "PDF 结构选择层", children: o.map(({ highlight: i, rect: s }) => {
    const c = i.region, l = un(c), d = qi[l];
    return /* @__PURE__ */ z(
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
          /* @__PURE__ */ p("span", { className: "reader-structure-selection-label", "aria-hidden": "true", children: d }),
          /* @__PURE__ */ p("span", { className: "sr-only", children: Ir(c, e) })
        ]
      },
      c.itemId
    );
  }) }) : null;
}
function Gi(e, t, n) {
  return e.flatMap((r) => {
    if (un(r.region) !== "text") return [];
    const a = Et(r, t, n);
    return a ? [{ itemId: r.itemId, highlight: r, rect: a }] : [];
  });
}
function Wn(e, t, n) {
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
function Yi({ target: e }) {
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
function Zi(e, t) {
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
function Xi(e, t, n, r) {
  if (!e || !t) return [];
  const a = [];
  for (const o of e.blocks) {
    const i = t.itemsById.get(o.item_id);
    if (!(i != null && i.translated_text)) continue;
    const s = Et(
      Zi(e, o),
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
const Qi = '"Source Han Serif SC", "Noto Serif CJK SC", "Songti SC", serif', es = 256, Ge = /* @__PURE__ */ new Map();
function ts(e) {
  return `${e || ""}`.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function ns(e) {
  const t = `${e || ""}`, { text: n, slots: r } = $o(t), a = ts(n), o = Oo(a, r);
  if (!r.length)
    return { fallbackHtml: o, richHtml: Promise.resolve(o), hasMath: !1 };
  let i = Ge.get(t);
  if (!i && (i = jo(a, r), Ge.set(t, i), Ge.size > es)) {
    const s = Ge.keys().next().value;
    s !== void 0 && Ge.delete(s);
  }
  return { fallbackHtml: o, richHtml: i, hasMath: !0 };
}
function _t(e) {
  return /title|heading|header|display_formula|equation/i.test(e);
}
function we(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? t : void 0;
}
function rs(e, t) {
  const n = e.typography, r = we(t) || 1, a = we(n == null ? void 0 : n.font_size_pt), o = Math.max(1, `${e.sourceText || ""}`.split(/\n+/).length), i = e.rect.height / Math.max(1.28, o * 1.18), s = _t(e.kind) ? 24 : /caption|footnote|table/i.test(e.kind) ? 9.5 : 11, c = Math.max(5.5 * r, Math.min(i, s * r)), l = we(n == null ? void 0 : n.fit_min_font_size_pt), d = we(n == null ? void 0 : n.fit_max_font_size_pt), u = Math.max(3.5, (l || 5.5) * r), f = Math.max(
    u,
    d ? d * r : a ? a * r : c
  ), m = a ? a * r : c, y = we(n == null ? void 0 : n.leading_em), h = [
    we(n == null ? void 0 : n.padding_top_pt) || 0,
    we(n == null ? void 0 : n.padding_right_pt) || 0,
    we(n == null ? void 0 : n.padding_bottom_pt) || 0,
    we(n == null ? void 0 : n.padding_left_pt) || 0
  ].map((v) => v * r);
  return {
    fontFamily: `${(n == null ? void 0 : n.font_family) || ""}`.trim() || Qi,
    fontSizePx: Math.max(u, Math.min(f, m)),
    minFontSizePx: u,
    maxFontSizePx: f,
    // Typst leading is the additional inter-line gap, unlike CSS line-height.
    lineHeight: y ? 1 + y : 1.3,
    fontWeight: (n == null ? void 0 : n.font_weight) || (_t(e.kind) ? 600 : 400),
    textAlign: (n == null ? void 0 : n.text_align) || (_t(e.kind) ? "center" : "justify"),
    padding: h,
    exact: !!a
  };
}
function os(e, t, n, r) {
  const { minFontSizePx: a, maxFontSizePx: o } = r, i = /* @__PURE__ */ new Map(), s = (u) => {
    const f = i.get(u);
    if (f !== void 0) return f;
    const { width: m, height: y } = e(u), h = m <= t + 0.5 && y <= n + 0.5;
    return i.set(u, h), h;
  };
  let c = a, l = o, d = Math.min(r.requestedFontSizePx, l);
  if (s(d)) {
    if (!r.exact) {
      c = d;
      for (let u = 0; u < 6 && l > c; u += 1) {
        const f = (c + l) / 2;
        s(f) ? (d = f, c = f) : l = f;
      }
    }
  } else {
    l = d, d = c;
    for (let u = 0; u < 8 && l > c; u += 1) {
      const f = (c + l) / 2;
      s(f) ? (d = f, c = f) : l = f;
    }
  }
  return Math.max(a, d);
}
const as = 512, Ye = /* @__PURE__ */ new Map();
let Gt = 0;
typeof document < "u" && document.fonts && (document.fonts.ready.then(() => {
  Gt += 1;
}).catch(() => {
}), typeof document.fonts.addEventListener == "function" && document.fonts.addEventListener("loadingdone", () => {
  Gt += 1;
}));
function is(e, t, n, r) {
  return [
    Gt,
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
function ss({ item: e, pageScale: t }) {
  const n = A(null), r = Y(
    () => ns(e.translatedText),
    [e.translatedText]
  ), [a, o] = L(r.fallbackHtml), i = Y(
    () => rs(e, t),
    [e, t]
  );
  j(() => {
    let u = !0;
    return o(r.fallbackHtml), r.hasMath && r.richHtml.then((f) => {
      u && o(f);
    }), () => {
      u = !1;
    };
  }, [r]), Le(() => {
    const u = n.current;
    if (!u) return;
    const [f, m, y, h] = i.padding, v = Math.max(1, e.rect.width - h - m), b = Math.max(1, e.rect.height - f - y), g = is(a, v, b, i);
    let I = Ye.get(g);
    if (I === void 0 && (I = os(
      (w) => (u.style.fontSize = `${w}px`, { width: u.scrollWidth, height: u.scrollHeight }),
      v,
      b,
      {
        minFontSizePx: i.minFontSizePx,
        maxFontSizePx: i.maxFontSizePx,
        requestedFontSizePx: i.fontSizePx,
        exact: i.exact
      }
    ), Ye.set(g, I), Ye.size > as)) {
      const w = Ye.keys().next().value;
      w !== void 0 && Ye.delete(w);
    }
    u.style.fontSize = `${I.toFixed(2)}px`;
  }, [a, e.rect.height, e.rect.width, i]);
  const [s, c, l, d] = i.padding;
  return /* @__PURE__ */ p(
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
      children: /* @__PURE__ */ p(
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
function cs({
  layoutPage: e,
  pageState: t,
  width: n,
  height: r
}) {
  const a = Y(
    () => Xi(e, t, n, r),
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
        ss,
        {
          item: o,
          pageScale: e != null && e.width ? n / e.width : 1
        },
        `${o.itemId}:${o.changedAtSeq}`
      ))
    }
  ) : null;
}
const ls = tn(cs), zr = 1.414;
function us({
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
  liveTranslationLayout: m,
  liveTranslationPage: y,
  showLiveTranslation: h = r === "source"
}) {
  const v = A(null), b = A(s ?? zr), [g, I] = L(b.current);
  j(() => {
    s != null && Math.abs(s - b.current) >= 1e-3 && (b.current = s, I(s));
  }, [s]);
  const w = A(l);
  w.current = l;
  const P = A((C) => {
    var W;
    v.current = C, (W = w.current) == null || W.call(w, C);
  }).current, N = Math.max(120, Math.floor(t * g)), x = Math.max(N, Math.ceil(o || 0)), D = Et(d, t, N), T = Y(
    () => Gi(u, t, N),
    [N, u, t]
  ), [M, R] = L(null), S = Y(
    () => T.find((C) => C.itemId === M) || null,
    [M, T]
  ), k = (C) => {
    if (C.buttons !== 0) {
      R(null);
      return;
    }
    const W = C.currentTarget.getBoundingClientRect(), K = Wn(
      T,
      C.clientX - W.left,
      C.clientY - W.top
    ), G = (K == null ? void 0 : K.itemId) || null;
    R((J) => J === G ? J : G);
  }, _ = (C) => {
    var G, J, oe;
    if (!f || (J = (G = C.target) == null ? void 0 : G.closest) != null && J.call(G, ".reader-structure-selection-target") || `${((oe = window.getSelection()) == null ? void 0 : oe.toString()) || ""}`.trim()) return;
    const W = C.currentTarget.getBoundingClientRect(), K = Wn(
      T,
      C.clientX - W.left,
      C.clientY - W.top
    );
    K && f({
      selectionType: "region",
      region: K.highlight.region,
      kind: "text",
      page: K.highlight.box.page,
      pane: r === "translated" ? "translated" : "source",
      rect: {
        left: W.left + K.rect.left,
        top: W.top + K.rect.top,
        width: K.rect.width,
        height: K.rect.height
      }
    });
  }, $ = (C) => {
    !Number.isFinite(C) || C <= 0 || Math.abs(b.current - C) < 1e-3 || (b.current = C, I(C), c == null || c(e, C));
  };
  return /* @__PURE__ */ z(
    "div",
    {
      ref: P,
      "data-reader-page": e,
      "data-reader-pane": r,
      "data-natural-height": N,
      className: dn,
      onPointerMoveCapture: k,
      onClick: _,
      onPointerLeave: () => R(null),
      style: {
        width: t,
        height: x,
        minHeight: x
      },
      children: [
        a ? /* @__PURE__ */ p(
          Do,
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
                style: { width: t, height: N }
              }
            ),
            onLoadSuccess: (C) => {
              try {
                const W = C.getViewport({ scale: 1 });
                if (W.width > 0) {
                  const K = W.height / W.width;
                  $(K);
                }
              } catch {
              }
              i == null || i();
            },
            onRenderSuccess: () => {
              i == null || i();
            }
          }
        ) : /* @__PURE__ */ p(
          "div",
          {
            className: "reader-react-pdf-page-placeholder",
            style: { width: t, height: N },
            "aria-hidden": !0
          }
        ),
        D ? /* @__PURE__ */ p(
          "div",
          {
            className: "reader-react-pdf-region-highlight",
            "data-reader-region-id": d == null ? void 0 : d.itemId,
            style: D,
            "aria-hidden": "true"
          }
        ) : null,
        a && h ? /* @__PURE__ */ p(
          ls,
          {
            layoutPage: m,
            pageState: y,
            width: t,
            height: N
          }
        ) : null,
        /* @__PURE__ */ p(Yi, { target: a ? S : null }),
        /* @__PURE__ */ p(
          Vi,
          {
            pane: r === "translated" ? "translated" : "source",
            width: t,
            height: N,
            regions: u,
            onSelect: f
          }
        )
      ]
    }
  );
}
const ds = tn(us), Dt = 5, fs = "120% 0px", ms = 120;
let Hn = 1;
const Jn = /* @__PURE__ */ new WeakMap();
function ps(e) {
  if (!e) return 0;
  const t = Jn.get(e);
  if (t) return t;
  const n = Hn;
  return Hn += 1, Jn.set(e, n), n;
}
function hs() {
  const e = typeof window < "u" && window.devicePixelRatio || 1;
  return Math.max(1, Math.min(e, 2));
}
const gs = so(
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
    onNumPagesChange: m,
    activeRegion: y = null,
    regions: h = [],
    readerMetadata: v = null,
    onSelectRegion: b,
    liveTranslation: g,
    showLiveTranslation: I = t === "source",
    liveTranslationPendingLabel: w = ""
  }, P) {
    Ki();
    const { file: N, loading: x, error: D } = xa(n, r), T = `${n}\0${ps(N)}`, M = A(T);
    M.current = T;
    const R = Y(
      () => Ra(N),
      [N, n]
    ), [S, k] = L(0), [_, $] = L(""), [C, W] = L(null), [K, G] = L(480), J = A(null), oe = A(0), te = Y(() => hs(), []), O = Y(() => ({
      cMapUrl: Ut("cmaps/"),
      cMapPacked: !0,
      standardFontDataUrl: Ut("standard_fonts/")
    }), []);
    nn(P, () => C, [C]), j(() => {
      const F = (H) => {
        !Number.isFinite(H) || H < 80 || Math.abs(H - oe.current) < 8 || (oe.current = H, G(H));
      }, Z = c && c >= 80 ? c : (s == null ? void 0 : s.clientWidth) || 0;
      if (F(Z), !s || typeof ResizeObserver > "u" || c && c >= 80) return;
      const V = new ResizeObserver((H) => {
        var Q, ee;
        const ae = ((ee = (Q = H[0]) == null ? void 0 : Q.contentRect) == null ? void 0 : ee.width) ?? s.clientWidth;
        !Number.isFinite(ae) || ae < 80 || (J.current && clearTimeout(J.current), J.current = setTimeout(() => F(ae), 80));
      });
      return V.observe(s), () => {
        V.disconnect(), J.current && clearTimeout(J.current);
      };
    }, [c, s, o]);
    const ne = Y(
      () => Fa(K, a),
      [K, a]
    ), [me, re] = L(() => /* @__PURE__ */ new Map()), [se, U] = L(() => /* @__PURE__ */ new Set()), [B, q] = L(() => /* @__PURE__ */ new Set()), ue = A(/* @__PURE__ */ new Map()), de = A(null), pe = A(/* @__PURE__ */ new Map()), Je = E((F, Z) => {
      re((V) => {
        if (V.get(F) === Z) return V;
        const H = new Map(V);
        return H.set(F, Z), H;
      });
    }, []), lt = E((F, Z) => {
      const V = ue.current, H = V.get(F);
      if (H && de.current)
        try {
          de.current.unobserve(H);
        } catch {
        }
      if (Z) {
        if (V.set(F, Z), de.current)
          try {
            de.current.observe(Z);
          } catch {
          }
      } else
        V.delete(F);
    }, []), ut = A(/* @__PURE__ */ new Map()), _e = E((F) => {
      const Z = ut.current;
      let V = Z.get(F);
      return V || (V = (H) => lt(F, H), Z.set(F, V)), V;
    }, [lt]);
    j(() => {
      if (typeof IntersectionObserver > "u") return;
      const F = pe.current, Z = new IntersectionObserver(
        (V) => {
          const H = [], ae = [];
          for (const Q of V) {
            const ee = Q.target, fe = Number(ee.getAttribute("data-reader-page"));
            Number.isFinite(fe) && (Q.isIntersecting ? H : ae).push(fe);
          }
          if ((H.length || ae.length) && U((Q) => {
            let ee = null;
            for (const fe of H)
              Q.has(fe) || (ee = ee || new Set(Q), ee.add(fe));
            for (const fe of ae)
              Q.has(fe) && (ee = ee || new Set(Q), ee.delete(fe));
            return ee || Q;
          }), H.length) {
            for (const Q of H) {
              const ee = F.get(Q);
              ee && (clearTimeout(ee), F.delete(Q));
            }
            q((Q) => {
              let ee = null;
              for (const fe of H)
                Q.has(fe) || (ee = ee || new Set(Q), ee.add(fe));
              return ee || Q;
            });
          }
          for (const Q of ae)
            F.has(Q) || F.set(Q, setTimeout(() => {
              F.delete(Q), q((ee) => {
                if (!ee.has(Q)) return ee;
                const fe = new Set(ee);
                return fe.delete(Q), fe;
              });
            }, ms));
        },
        { root: s, rootMargin: fs, threshold: 0 }
      );
      de.current = Z;
      for (const V of ue.current.values())
        try {
          Z.observe(V);
        } catch {
        }
      return () => {
        Z.disconnect(), de.current === Z && (de.current = null);
        for (const V of F.values()) clearTimeout(V);
        F.clear();
      };
    }, [s]), Le(() => {
      k(0), $(""), U(/* @__PURE__ */ new Set()), q(/* @__PURE__ */ new Set()), re(/* @__PURE__ */ new Map()), ue.current.clear();
      const F = pe.current;
      for (const Z of F.values()) clearTimeout(Z);
      F.clear(), m == null || m(0, t);
    }, [T, m, t]);
    const Ke = E(
      ({ numPages: F }) => {
        M.current === T && (k(F), $(""), m == null || m(F, t), u == null || u({ numPages: F, pane: t }));
      },
      [T, u, m, t]
    ), De = E(
      (F) => {
        if (M.current !== T) return;
        const Z = (F == null ? void 0 : F.message) || "PDF 解析失败";
        $(Z), k(0), m == null || m(0, t), f == null || f(F, t);
      },
      [T, f, m, t]
    ), qe = Y(
      () => S > 0 ? Array.from({ length: S }, (F, Z) => Z + 1) : [],
      [S]
    );
    j(() => {
      typeof IntersectionObserver < "u" || q(new Set(qe));
    }, [qe]);
    const dt = Y(
      () => zn(y, v, t),
      [y, v, t]
    ), ro = Y(() => {
      const F = /* @__PURE__ */ new Map();
      for (const Z of h) {
        const V = zn(Z, v, t);
        if (!V) continue;
        const H = F.get(V.box.page) || [];
        H.push(V), F.set(V.box.page, H);
      }
      return F;
    }, [t, v, h]), oo = Y(() => {
      if (S === 0) return /* @__PURE__ */ new Set();
      if (!(!!s && typeof IntersectionObserver < "u" && o)) return new Set(qe);
      if (se.size === 0) {
        const V = Math.min(S, Dt * 2 + 1);
        return new Set(Array.from({ length: V }, (H, ae) => ae + 1));
      }
      const Z = /* @__PURE__ */ new Set();
      for (const V of se)
        for (let H = -Dt; H <= Dt; H++) {
          const ae = V + H;
          ae >= 1 && ae <= S && Z.add(ae);
        }
      return Z;
    }, [S, qe, s, o, se]), ao = !n || !!D || !!_, io = n && (D || _) || i;
    return /* @__PURE__ */ z(
      "section",
      {
        ref: W,
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
          ao && !x ? /* @__PURE__ */ p("div", { className: "reader-empty reader-react-pdf-empty", "data-reader-pdf-empty": t, children: io }) : null,
          x ? /* @__PURE__ */ p("div", { className: "reader-empty reader-react-pdf-loading", "data-reader-pdf-loading": t, children: "正在加载 PDF…" }) : null,
          R && !D ? /* @__PURE__ */ p("div", { className: "reader-viewer-wrap reader-react-pdf-wrap", children: /* @__PURE__ */ p(
            Fo,
            {
              file: R,
              loading: null,
              error: null,
              options: O,
              onLoadSuccess: Ke,
              onLoadError: De,
              className: "reader-react-pdf-document",
              children: qe.map((F) => {
                if (oo.has(F))
                  return /* @__PURE__ */ p(
                    ds,
                    {
                      pane: t,
                      pageNumber: F,
                      width: ne,
                      devicePixelRatio: te,
                      scrollRoot: s,
                      active: B.has(F),
                      syncedMinHeight: (l == null ? void 0 : l.get(F)) || 0,
                      onMetrics: d,
                      cachedAspect: me.get(F),
                      onAspectChange: Je,
                      sentinelRef: _e(F),
                      regionHighlight: (dt == null ? void 0 : dt.box.page) === F ? dt : null,
                      regionTargets: ro.get(F),
                      onSelectRegion: b,
                      liveTranslationLayout: g == null ? void 0 : g.layoutByPage.get(F - 1),
                      liveTranslationPage: g == null ? void 0 : g.pagesByPage.get(F - 1),
                      showLiveTranslation: I
                    },
                    `${t}-${F}`
                  );
                const V = me.get(F) ?? zr, H = Math.max(120, Math.floor(ne * V)), ae = Math.max(H, Math.ceil((l == null ? void 0 : l.get(F)) || 0));
                return /* @__PURE__ */ p(
                  "div",
                  {
                    ref: _e(F),
                    "data-reader-page": F,
                    "data-reader-pane": t,
                    "data-natural-height": H,
                    className: dn,
                    style: {
                      width: ne,
                      height: ae,
                      minHeight: ae
                    },
                    children: /* @__PURE__ */ p(
                      "div",
                      {
                        className: "reader-react-pdf-page-placeholder",
                        style: { width: ne, height: H },
                        "aria-hidden": !0
                      }
                    )
                  },
                  `${t}-${F}`
                );
              })
            },
            T
          ) }) : null
        ]
      }
    );
  }
), Kn = tn(gs), _r = rn(null), Dr = rn(null);
function bs({ value: e, hud: t, children: n }) {
  return /* @__PURE__ */ p(_r.Provider, { value: e, children: /* @__PURE__ */ p(Dr.Provider, { value: t, children: n }) });
}
function ct() {
  return on(_r);
}
function ys() {
  return on(Dr);
}
function vs({
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
function ws(e, t, n = e * 2) {
  return t ? Math.min(e * 2, n) : e;
}
function Ss(e) {
  return e ? e.connection === "terminal" && e.jobStatus === "failed" ? e.pagesByPage.size > 0 ? `翻译已暂停，已保留 ${e.pagesByPage.size} 页译文` : "翻译已暂停，原始 PDF 仍可阅读" : e.connection === "terminal" && ["cancelled", "canceled"].includes(e.jobStatus) ? e.pagesByPage.size > 0 ? `翻译已取消，已保留 ${e.pagesByPage.size} 页译文` : "翻译已取消，原始 PDF 仍可阅读" : e.pagesByPage.size > 0 ? "" : e.connection === "unavailable" ? e.error || "实时译文暂不可用，原始 PDF 仍可阅读" : e.error ? e.error : e.layoutByPage.size === 0 ? "正在完成 OCR，译文将在这里逐页出现" : "版面已就绪，正在等待首个译文页面" : "";
}
function Is(e) {
  const t = ct(), {
    mode: n = "compare",
    markdownSplit: r = !1,
    assistantSplit: a = !1,
    liveTranslation: o,
    liveTranslationPair: i = !1
  } = e, s = e.compareMode ?? n === "compare", c = e.showSource ?? !0, l = e.showTranslated ?? (n === "compare" || n === "translated"), d = e.bindShell ?? (t == null ? void 0 : t.bindShell), u = e.shellEl ?? (t == null ? void 0 : t.shellEl) ?? null, f = e.userZoom ?? (t == null ? void 0 : t.userZoom) ?? st, m = e.shellWidth ?? (t == null ? void 0 : t.shellWidth) ?? 0, y = e.rowHeights ?? (t == null ? void 0 : t.rowHeights), h = e.mountSource ?? (t == null ? void 0 : t.mountSource) ?? !1, v = e.mountTranslated ?? (t == null ? void 0 : t.mountTranslated) ?? !1, b = e.sourceOnly ?? (t == null ? void 0 : t.sourceViewOnly) ?? !1, g = e.sourceUrl ?? (t == null ? void 0 : t.sourceUrl) ?? "", I = e.translatedUrl ?? (t == null ? void 0 : t.translatedUrl) ?? "", w = e.sourceFile ?? (t == null ? void 0 : t.sourceFile) ?? null, P = e.translatedFile ?? (t == null ? void 0 : t.translatedFile) ?? null, N = e.onMetrics ?? (t == null ? void 0 : t.onMetrics), x = e.onNumPagesChange ?? (t == null ? void 0 : t.onNumPagesChange), D = e.activeRegion ?? (t == null ? void 0 : t.activeRegion), T = e.regions ?? (t == null ? void 0 : t.regions) ?? [], M = e.readerMetadata ?? (t == null ? void 0 : t.readerMetadata), R = e.onSelectRegion ?? (t == null ? void 0 : t.onSelectRegion), S = vs({
    mode: n,
    compareMode: s,
    showSource: c,
    showTranslated: l,
    markdownSplit: r,
    liveTranslationPair: i
  }), k = ws(
    m,
    r || a,
    typeof document > "u" ? m * 2 : document.documentElement.clientWidth
  );
  return /* @__PURE__ */ p(
    "div",
    {
      ref: d,
      id: ja,
      className: Ua,
      "data-reader-scroll-shell": "true",
      "data-reader-region-count": T.length,
      "data-reader-structured-region-count": T.filter(Sr).length,
      "data-reader-metadata-ready": M ? "true" : "false",
      children: /* @__PURE__ */ z(
        "main",
        {
          className: `reader-react-grid reader-mode-${S.mode}`,
          "data-reader-mode": r ? "markdown-split" : a ? "assistant-split" : n,
          children: [
            h ? /* @__PURE__ */ p(
              Kn,
              {
                pane: "source",
                url: g,
                preloadedFile: w,
                userZoom: f,
                visible: S.showSource,
                scrollRoot: u,
                pageWidthOverride: k,
                rowHeights: S.compareMode ? y : void 0,
                onMetrics: N,
                emptyLabel: b ? "源文件不可用：该文档没有可读取的源 PDF。" : "暂无原文 PDF",
                onNumPagesChange: x,
                activeRegion: D,
                regions: T,
                readerMetadata: M,
                onSelectRegion: R,
                liveTranslation: i ? void 0 : o,
                showLiveTranslation: !i
              }
            ) : null,
            v || i ? /* @__PURE__ */ p(
              Kn,
              {
                pane: "translated",
                url: i ? g : I,
                preloadedFile: i ? w : P,
                userZoom: f,
                visible: S.showTranslated,
                scrollRoot: u,
                pageWidthOverride: k,
                rowHeights: S.compareMode ? y : void 0,
                onMetrics: N,
                emptyLabel: "暂无译文 PDF",
                onNumPagesChange: x,
                activeRegion: D,
                regions: T,
                readerMetadata: M,
                onSelectRegion: R,
                liveTranslation: i ? o : void 0,
                showLiveTranslation: i,
                liveTranslationPendingLabel: i ? Ss(o) : ""
              }
            ) : null
          ]
        }
      )
    }
  );
}
const Ps = [
  { id: "source", label: "源文件", Icon: hr },
  { id: "compare", label: "对照", Icon: gr },
  { id: "translated", label: "翻译文件", Icon: br }
];
function Rs(e) {
  return e.connection === "live" ? `实时译文 · ${e.pagesByPage.size} 页` : e.connection === "reconnecting" ? "实时译文 · 重连中" : e.connection === "unavailable" ? "实时译文 · 不可用" : e.connection === "terminal" ? e.jobStatus === "failed" ? "实时译文 · 已暂停" : e.jobStatus === "cancelled" || e.jobStatus === "canceled" ? "实时译文 · 已取消" : e.jobStatus === "succeeded" ? "实时译文 · 已完成" : "实时译文 · 已结束" : e.error || "实时译文 · 连接中";
}
function Ts(e) {
  return e.id === "translated" ? e.sourceOnly : e.id === "compare" ? !e.documentReady || e.sourceOnly && !e.liveTranslationAvailable : !1;
}
function Ms(e) {
  const t = ct(), {
    mode: n,
    documentReady: r,
    onModeChange: a,
    liveTranslation: o = null
  } = e, i = e.sourceOnly ?? (t == null ? void 0 : t.sourceViewOnly) ?? !1, s = o ? Rs(o.state) : "";
  return /* @__PURE__ */ z("header", { className: "reader-workspace-bar", children: [
    o ? /* @__PURE__ */ z(
      "button",
      {
        type: "button",
        className: `reader-live-translation-toggle is-${o.state.connection}${o.visible ? " is-active" : ""}`,
        "aria-pressed": o.visible,
        "aria-label": o.visible ? "隐藏实时译文" : "显示实时译文",
        title: o.state.error || s,
        onClick: o.onToggle,
        children: [
          /* @__PURE__ */ p(Ro, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 }),
          /* @__PURE__ */ p("span", { className: "reader-live-translation-toggle-label", children: s })
        ]
      }
    ) : null,
    /* @__PURE__ */ p("div", { className: "reader-workspace-tabs", role: "tablist", "aria-label": "阅读工作区", children: Ps.map(({ id: c, label: l, Icon: d }) => {
      const u = n === c, f = Ts({
        id: c,
        documentReady: r,
        sourceOnly: i,
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
const qn = [
  { id: "markdown", label: "Markdown", Icon: yr },
  { id: "ai", label: "AI 问答", Icon: cn }
];
function xs(e) {
  const t = ct(), { active: n } = e, r = e.onSelect ?? (t == null ? void 0 : t.assistant.select) ?? (() => {
  }), a = e.onClose ?? (t == null ? void 0 : t.assistant.close) ?? (() => {
  });
  return n ? /* @__PURE__ */ z("header", { className: "reader-assistant-dock-header", children: [
    /* @__PURE__ */ p("div", { className: "reader-assistant-dock-tabs", role: "tablist", "aria-label": "阅读辅助面板", children: qn.map(({ id: o, label: i, Icon: s }) => {
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
            /* @__PURE__ */ p(s, { size: 15, strokeWidth: 2.15, "aria-hidden": !0 }),
            /* @__PURE__ */ p("span", { children: i })
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
        children: /* @__PURE__ */ p(He, { size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
      }
    )
  ] }) : /* @__PURE__ */ p("nav", { className: "reader-assistant-rail", "aria-label": "阅读辅助工具", children: qn.map(({ id: o, label: i, Icon: s }) => /* @__PURE__ */ z(
    "button",
    {
      type: "button",
      className: "reader-assistant-rail-button",
      "aria-label": `打开${i}`,
      title: i,
      onClick: () => r(o),
      children: [
        /* @__PURE__ */ p(s, { size: 18, strokeWidth: 2, "aria-hidden": !0 }),
        /* @__PURE__ */ p("span", { children: i === "AI 问答" ? "AI" : "MD" })
      ]
    },
    o
  )) });
}
function Es(e, t) {
  const n = getComputedStyle(e), r = parseFloat(n.fontSize);
  return t * r;
}
function Ns(e, t) {
  const n = getComputedStyle(e.ownerDocument.documentElement), r = parseFloat(n.fontSize);
  return t * r;
}
function ks(e) {
  return e / 100 * window.innerHeight;
}
function As(e) {
  return e / 100 * window.innerWidth;
}
function Ls(e) {
  switch (typeof e) {
    case "number":
      return [e, "px"];
    case "string": {
      const t = parseFloat(e);
      return e.endsWith("%") ? [t, "%"] : e.endsWith("px") ? [t, "px"] : e.endsWith("rem") ? [t, "rem"] : e.endsWith("em") ? [t, "em"] : e.endsWith("vh") ? [t, "vh"] : e.endsWith("vw") ? [t, "vw"] : [t, "%"];
    }
  }
}
function Xe({
  groupSize: e,
  panelElement: t,
  styleProp: n
}) {
  let r;
  const [a, o] = Ls(n);
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
      r = Ns(t, a);
      break;
    }
    case "em": {
      r = Es(t, a);
      break;
    }
    case "vh": {
      r = ks(a);
      break;
    }
    case "vw": {
      r = As(a);
      break;
    }
  }
  return r;
}
function le(e) {
  return parseFloat(e.toFixed(3));
}
function We({
  group: e
}) {
  const { orientation: t, panels: n } = e;
  return n.reduce((r, a) => (r += t === "horizontal" ? a.element.offsetWidth : a.element.offsetHeight, r), 0);
}
function Yt(e) {
  const { panels: t } = e, n = We({ group: e });
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
      const d = Xe({
        groupSize: n,
        panelElement: a,
        styleProp: o.collapsedSize
      });
      i = le(d / n * 100);
    }
    let s;
    if (o.defaultSize !== void 0) {
      const d = Xe({
        groupSize: n,
        panelElement: a,
        styleProp: o.defaultSize
      });
      s = le(d / n * 100);
    }
    let c = 0;
    if (o.minSize !== void 0) {
      const d = Xe({
        groupSize: n,
        panelElement: a,
        styleProp: o.minSize
      });
      c = le(d / n * 100);
    }
    let l = 100;
    if (o.maxSize !== void 0) {
      const d = Xe({
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
function X(e, t = "Assertion error") {
  if (!e)
    throw Error(t);
}
function Zt(e, t) {
  return Array.from(t).sort(
    e === "horizontal" ? Cs : zs
  );
}
function Cs(e, t) {
  const n = e.element.offsetLeft - t.element.offsetLeft;
  return n !== 0 ? n : e.element.offsetWidth - t.element.offsetWidth;
}
function zs(e, t) {
  const n = e.element.offsetTop - t.element.offsetTop;
  return n !== 0 ? n : e.element.offsetHeight - t.element.offsetHeight;
}
function Fr(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.ELEMENT_NODE;
}
function $r(e, t) {
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
function _s({
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
    const { x: s, y: c } = $r(r, i), l = e === "horizontal" ? s : c;
    l < o && (o = l, a = i);
  }
  return X(a, "No rect found"), a;
}
let mt;
function Ds() {
  return mt === void 0 && (typeof matchMedia == "function" ? mt = !!matchMedia("(pointer:coarse)").matches : mt = !1), mt;
}
function Or(e) {
  const { element: t, orientation: n, panels: r, separators: a } = e, o = Zt(
    n,
    Array.from(t.children).filter(Fr).map((y) => ({ element: y }))
  ).map(({ element: y }) => y), i = [];
  let s = !1, c = !1, l = -1, d = -1, u = 0, f, m = [];
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
                  const N = m[0], x = _s({
                    orientation: n,
                    rects: [b, g],
                    targetRect: N.element.getBoundingClientRect()
                  });
                  I = [
                    N,
                    x === b ? P : w
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
              const N = Ds() ? e.resizeTargetMinimumSize.coarse : e.resizeTargetMinimumSize.fine;
              if (P.width < N) {
                const D = N - P.width;
                P = new DOMRect(
                  P.x - D / 2,
                  P.y,
                  P.width + D,
                  P.height
                );
              }
              if (P.height < N) {
                const D = N - P.height;
                P = new DOMRect(
                  P.x,
                  P.y - D / 2,
                  P.width,
                  P.height + D
                );
              }
              const x = y <= l || y > d;
              !s && !x && i.push({
                group: e,
                groupSize: We({ group: e }),
                panels: [f, v],
                separator: "width" in w ? void 0 : w,
                rect: P
              }), s = !1;
            }
          }
          c = !1, f = v, m = [];
        }
      } else if (h.hasAttribute("data-separator")) {
        h.ariaDisabled !== null && (s = !0);
        const v = a.find(
          (b) => b.element === h
        );
        v ? m.push(v) : (f = void 0, m = []);
      } else
        c = !0;
  }
  return i;
}
var Te;
class jr {
  constructor() {
    Mn(this, Te, {});
  }
  addListener(t, n) {
    const r = Ve(this, Te)[t];
    return r === void 0 ? Ve(this, Te)[t] = [n] : r.includes(n) || r.push(n), () => {
      this.removeListener(t, n);
    };
  }
  emit(t, n) {
    const r = Ve(this, Te)[t];
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
    xn(this, Te, {});
  }
  removeListener(t, n) {
    const r = Ve(this, Te)[t];
    if (r !== void 0) {
      const a = r.indexOf(n);
      a >= 0 && r.splice(a, 1);
    }
  }
}
Te = new WeakMap();
let Ue = {
  cursorFlags: 0,
  state: "inactive"
};
const pn = new jr();
function Ne() {
  return Ue;
}
function Fs(e) {
  return pn.addListener("change", e);
}
function $s(e) {
  const t = Ue, n = { ...Ue };
  n.cursorFlags = e, Ue = n, pn.emit("change", {
    prev: t,
    next: n
  });
}
function Be(e) {
  const t = Ue;
  Ue = e, pn.emit("change", {
    prev: t,
    next: e
  });
}
const Os = (e) => e, Ft = () => {
}, Ur = 1, Br = 2, Wr = 4, Hr = 8, Vn = 3, Gn = 12;
let pt;
function Yn() {
  return pt === void 0 && (pt = !1, typeof window < "u" && (window.navigator.userAgent.includes("Chrome") || window.navigator.userAgent.includes("Firefox")) && (pt = !0)), pt;
}
function js({
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
        if (e && Yn()) {
          const o = (e & Ur) !== 0, i = (e & Br) !== 0, s = (e & Wr) !== 0, c = (e & Hr) !== 0;
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
    return Yn() ? r > 0 && a > 0 ? "move" : r > 0 ? "ew-resize" : "ns-resize" : r > 0 && a > 0 ? "grab" : r > 0 ? "col-resize" : "row-resize";
  }
}
const Zn = /* @__PURE__ */ new WeakMap();
function hn(e) {
  if (e.defaultView === null || e.defaultView === void 0)
    return;
  let { prevStyle: t, styleSheet: n } = Zn.get(e) ?? {};
  n === void 0 && (n = new e.defaultView.CSSStyleSheet(), e.adoptedStyleSheets && (Object.isExtensible(e.adoptedStyleSheets) ? e.adoptedStyleSheets.push(n) : e.adoptedStyleSheets = [
    ...e.adoptedStyleSheets,
    n
  ]));
  const r = Ne();
  switch (r.state) {
    case "active":
    case "hover": {
      const a = js({
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
  Zn.set(e, {
    prevStyle: t,
    styleSheet: n
  });
}
let ye = /* @__PURE__ */ new Map();
const Jr = new jr();
function Us(e) {
  ye = new Map(ye), ye.delete(e);
}
function Xn(e, t) {
  for (const [n] of ye)
    if (n.id === e)
      return n;
}
function Me(e, t) {
  for (const [n, r] of ye)
    if (n.id === e)
      return r;
  if (t)
    throw Error(`Could not find data for Group with id ${e}`);
}
function Ce() {
  return ye;
}
function gn(e, t) {
  return Jr.addListener("groupChange", (n) => {
    n.group.id === e && t(n);
  });
}
function Pe(e, t, n) {
  const r = ye.get(e);
  ye = new Map(ye), ye.set(e, t), Jr.emit("groupChange", {
    group: e,
    isUserInteraction: (n == null ? void 0 : n.isUserInteraction) === !0,
    prev: r,
    next: t
  });
}
function Kr(e) {
  const t = Ne();
  let n = !1;
  switch (t.state) {
    case "active":
      Be({
        cursorFlags: 0,
        state: "inactive"
      }), t.hitRegions.length > 0 && (hn(e), n = !0, t.hitRegions.forEach((r) => {
        const a = Me(r.group.id, !0);
        Pe(r.group, a, {
          isUserInteraction: !0
        });
      }));
  }
  return n;
}
function Qn(e) {
  e.defaultPrevented || Kr(e.currentTarget);
}
function Bs(e, t, n) {
  let r, a = {
    x: 1 / 0,
    y: 1 / 0
  };
  for (const o of t) {
    const i = $r(n, o.rect);
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
function Ws(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
function Hs(e, t) {
  if (e === t) throw new Error("Cannot compare node with itself");
  const n = {
    a: nr(e),
    b: nr(t)
  };
  let r;
  for (; n.a.at(-1) === n.b.at(-1); )
    r = n.a.pop(), n.b.pop();
  X(
    r,
    "Stacking order can only be calculated for elements with a common ancestor"
  );
  const a = {
    a: tr(er(n.a)),
    b: tr(er(n.b))
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
const Js = /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;
function Ks(e) {
  const t = getComputedStyle(qr(e) ?? e).display;
  return t === "flex" || t === "inline-flex";
}
function qs(e) {
  const t = getComputedStyle(e);
  return !!(t.position === "fixed" || t.zIndex !== "auto" && (t.position !== "static" || Ks(e)) || +t.opacity < 1 || "transform" in t && t.transform !== "none" || "webkitTransform" in t && t.webkitTransform !== "none" || "mixBlendMode" in t && t.mixBlendMode !== "normal" || "filter" in t && t.filter !== "none" || "webkitFilter" in t && t.webkitFilter !== "none" || "isolation" in t && t.isolation === "isolate" || Js.test(t.willChange) || t.webkitOverflowScrolling === "touch");
}
function er(e) {
  let t = e.length;
  for (; t--; ) {
    const n = e[t];
    if (X(n, "Missing node"), qs(n)) return n;
  }
  return null;
}
function tr(e) {
  return e && Number(getComputedStyle(e).zIndex) || 0;
}
function nr(e) {
  const t = [];
  for (; e; )
    t.push(e), e = qr(e);
  return t;
}
function qr(e) {
  const { parentNode: t } = e;
  return Ws(t) ? t.host : t;
}
function Vs(e, t) {
  return e.x < t.x + t.width && e.x + e.width > t.x && e.y < t.y + t.height && e.y + e.height > t.y;
}
function Gs({
  groupElement: e,
  hitRegion: t,
  pointerEventTarget: n
}) {
  if (!Fr(n) || n.contains(e) || e.contains(n))
    return !0;
  if (Hs(n, e) > 0) {
    let r = n;
    for (; r; ) {
      if (r.contains(e))
        return !0;
      if (Vs(r.getBoundingClientRect(), t))
        return !1;
      r = r.parentElement;
    }
  }
  return !0;
}
function bn(e, t) {
  const n = [];
  return t.forEach((r, a) => {
    if (a.disabled)
      return;
    const o = Or(a), i = Bs(a.orientation, o, {
      x: e.clientX,
      y: e.clientY
    });
    i && i.distance.x <= 0 && i.distance.y <= 0 && Gs({
      groupElement: a.element,
      hitRegion: i.hitRegion.rect,
      pointerEventTarget: e.target
    }) && n.push(i.hitRegion);
  }), n;
}
function Ys(e, t) {
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
function at({
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
  X(d != null, "Invalid first pivot index"), X(u != null, "Invalid second pivot index");
  let f = 0;
  switch (o) {
    case "keyboard": {
      {
        const h = e < 0 ? u : d, v = n[h];
        X(
          v,
          `Panel constraints not found for index ${h}`
        );
        const {
          collapsedSize: b = 0,
          collapsible: g,
          minSize: I = 0
        } = v;
        if (g) {
          const w = s[h];
          if (X(
            w != null,
            `Previous layout not found for panel index ${h}`
          ), ce(w, b)) {
            const P = I - w;
            be(P, Math.abs(e)) > 0 && (e = e < 0 ? 0 - P : P);
          }
        }
      }
      {
        const h = e < 0 ? d : u, v = n[h];
        X(
          v,
          `No panel constraints found for index ${h}`
        );
        const {
          collapsedSize: b = 0,
          collapsible: g,
          minSize: I = 0
        } = v;
        if (g) {
          const w = s[h];
          if (X(
            w != null,
            `Previous layout not found for panel index ${h}`
          ), ce(w, I)) {
            const P = w - b;
            be(P, Math.abs(e)) > 0 && (e = e < 0 ? 0 - P : P);
          }
        }
      }
      break;
    }
    default: {
      const h = e < 0 ? u : d, v = n[h];
      X(
        v,
        `Panel constraints not found for index ${h}`
      );
      const b = s[h], { collapsible: g, collapsedSize: I, minSize: w } = v;
      if (g && be(b, w) < 0)
        if (e > 0) {
          const P = w - I, N = P / 2, x = b + e;
          be(x, w) < 0 && (e = be(e, N) <= 0 ? 0 : P);
        } else {
          const P = w - I, N = 100 - P / 2, x = b - e;
          be(x, w) < 0 && (e = be(100 + e, N) > 0 ? 0 : -P);
        }
      break;
    }
  }
  {
    const h = e < 0 ? 1 : -1;
    let v = e < 0 ? u : d, b = 0;
    for (; ; ) {
      const I = s[v];
      X(
        I != null,
        `Previous layout not found for panel index ${v}`
      );
      const w = Oe({
        overrideDisabledPanels: i,
        panelConstraints: n[v],
        prevSize: I,
        size: 100
      }) - I;
      if (b += w, v += h, v < 0 || v >= n.length)
        break;
    }
    const g = Math.min(Math.abs(e), Math.abs(b));
    e = e < 0 ? 0 - g : g;
  }
  {
    let h = e < 0 ? d : u;
    for (; h >= 0 && h < n.length; ) {
      const v = Math.abs(e) - Math.abs(f), b = s[h];
      X(
        b != null,
        `Previous layout not found for panel index ${h}`
      );
      const g = b - v, I = Oe({
        overrideDisabledPanels: i,
        panelConstraints: n[h],
        prevSize: b,
        size: g
      });
      if (!ce(b, I) && (f += b - I, l[h] = I, f.toFixed(3).localeCompare(Math.abs(e).toFixed(3), void 0, {
        numeric: !0
      }) >= 0))
        break;
      e < 0 ? h-- : h++;
    }
  }
  if (Ys(c, l))
    return a;
  {
    const h = e < 0 ? u : d, v = s[h];
    X(
      v != null,
      `Previous layout not found for panel index ${h}`
    );
    const b = v + f, g = Oe({
      overrideDisabledPanels: i,
      panelConstraints: n[h],
      prevSize: v,
      size: b
    });
    if (l[h] = g, !ce(g, b)) {
      let I = b - g, w = e < 0 ? u : d;
      for (; w >= 0 && w < n.length; ) {
        const P = l[w];
        X(
          P != null,
          `Previous layout not found for panel index ${w}`
        );
        const N = P + I, x = Oe({
          overrideDisabledPanels: i,
          panelConstraints: n[w],
          prevSize: P,
          size: N
        });
        if (ce(P, x) || (I -= x - P, l[w] = x), ce(I, 0))
          break;
        e > 0 ? w-- : w++;
      }
    }
  }
  const m = Object.values(l).reduce(
    (h, v) => v + h,
    0
  );
  if (!ce(m, 100, 0.1))
    return a;
  const y = Object.keys(a);
  return l.reduce((h, v, b) => (h[y[b]] = v, h), {});
}
function ke(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (t[n] === void 0 || be(e[n], t[n]) !== 0)
      return !1;
  return !0;
}
function Ae({
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
      X(c != null, `No layout data found for index ${s}`);
      const l = 100 / a * c;
      r[s] = l;
    }
  let o = 0;
  for (let s = 0; s < t.length; s++) {
    const c = n[s];
    X(c != null, `No layout data found for index ${s}`);
    const l = r[s];
    X(l != null, `No layout data found for index ${s}`);
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
      X(c != null, `No layout data found for index ${s}`);
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
function Vr({
  groupId: e,
  panelId: t
}) {
  const n = () => {
    const c = Ce();
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
  }, i = ({
    nextSize: c,
    panels: l,
    prevLayout: d,
    derivedPanelConstraints: u
  }) => {
    const f = o(), m = l.findIndex((v) => v.id === t), y = m === 0, h = m === l.length - 1;
    if (h && c < f && (y || l.slice(0, m).every((v, b) => {
      const g = u[b];
      return (g == null ? void 0 : g.collapsible) && ce(g.collapsedSize, d[g.panelId]);
    }))) {
      const v = l.slice(0, m).reduce((b, g) => b + d[g.id], 0);
      return {
        ...d,
        [t]: le(100 - v)
      };
    }
    return at({
      delta: h ? f - c : c - f,
      initialLayout: d,
      panelConstraints: u,
      pivotIndices: h ? [m - 1, m] : [m, m + 1],
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
      groupSize: m,
      layout: y,
      separatorToPanels: h
    } = n(), v = i({
      nextSize: c,
      panels: f.panels,
      prevLayout: y,
      derivedPanelConstraints: u
    }), b = Ae({
      layout: v,
      panelConstraints: u
    });
    ke(y, b) || Pe(f, {
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
      c && u !== l && (d.expandToSize = u, s(l));
    },
    expand: () => {
      const { collapsible: c, collapsedSize: l, minSize: d } = r(), { mutableValues: u } = a(), f = o();
      if (c && f === l) {
        let m = u.expandToSize ?? d;
        m === 0 && (m = 1), s(m);
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
      const { group: l } = n(), { element: d } = a(), u = We({ group: l }), f = Xe({
        groupSize: u,
        panelElement: d,
        styleProp: c
      }), m = le(f / u * 100);
      s(m);
    }
  };
}
function rr(e) {
  if (e.defaultPrevented)
    return;
  const t = Ce();
  bn(e, t).forEach((n) => {
    if (n.separator && !n.separator.disableDoubleClick) {
      const r = n.panels.find(
        (a) => a.panelConstraints.defaultSize !== void 0
      );
      if (r) {
        const a = r.panelConstraints.defaultSize, o = Vr({
          groupId: n.group.id,
          panelId: r.id
        });
        o && a !== void 0 && (o.resize(a), e.preventDefault());
      }
    }
  });
}
function yt(e) {
  const t = Ce();
  for (const [n] of t)
    if (n.separators.some(
      (r) => r.element === e
    ))
      return n;
  throw Error("Could not find parent Group for separator element");
}
function Gr({
  groupId: e
}) {
  const t = () => {
    const n = Ce();
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
      } = t(), l = Ae({
        layout: n,
        panelConstraints: a
      });
      return r ? s : (ke(s, l) || Pe(o, {
        defaultLayoutDeferred: r,
        derivedPanelConstraints: a,
        groupSize: i,
        layout: l,
        separatorToPanels: c
      }), l);
    }
  };
}
function xe(e, t) {
  const n = yt(e), r = Me(n.id, !0), a = n.separators.find(
    (d) => d.element === e
  );
  X(a, "Matching separator not found");
  const o = r.separatorToPanels.get(a);
  X(o, "Matching panels not found");
  const i = o.map((d) => n.panels.indexOf(d)), s = Gr({ groupId: n.id }).getLayout(), c = at({
    delta: t,
    initialLayout: s,
    panelConstraints: r.derivedPanelConstraints,
    pivotIndices: i,
    prevLayout: s,
    trigger: "keyboard"
  }), l = Ae({
    layout: c,
    panelConstraints: r.derivedPanelConstraints
  });
  ke(s, l) || Pe(
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
function or(e) {
  if (e.defaultPrevented)
    return;
  const t = e.currentTarget, n = yt(t);
  if (!n.disabled)
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault(), n.orientation === "vertical" && xe(t, 5);
        break;
      }
      case "ArrowLeft": {
        e.preventDefault(), n.orientation === "horizontal" && xe(t, -5);
        break;
      }
      case "ArrowRight": {
        e.preventDefault(), n.orientation === "horizontal" && xe(t, 5);
        break;
      }
      case "ArrowUp": {
        e.preventDefault(), n.orientation === "vertical" && xe(t, -5);
        break;
      }
      case "End": {
        e.preventDefault(), xe(t, 100);
        break;
      }
      case "Enter": {
        e.preventDefault();
        const r = yt(t), a = Me(r.id, !0), { derivedPanelConstraints: o, layout: i, separatorToPanels: s } = a, c = r.separators.find(
          (f) => f.element === t
        );
        X(c, "Matching separator not found");
        const l = s.get(c);
        X(l, "Matching panels not found");
        const d = l[0], u = o.find(
          (f) => f.panelId === d.id
        );
        if (X(u, "Panel metadata not found"), u.collapsible) {
          const f = i[d.id], m = u.collapsedSize === f ? r.mutableState.expandedPanelSizes[d.id] ?? u.minSize : u.collapsedSize;
          xe(t, m - f);
        }
        break;
      }
      case "F6": {
        e.preventDefault();
        const r = yt(t).separators.map(
          (i) => i.element
        ), a = Array.from(r).findIndex(
          (i) => i === e.currentTarget
        );
        X(a !== null, "Index not found");
        const o = e.shiftKey ? a > 0 ? a - 1 : r.length - 1 : a + 1 < r.length ? a + 1 : 0;
        r[o].focus({
          preventScroll: !0
        });
        break;
      }
      case "Home": {
        e.preventDefault(), xe(t, -100);
        break;
      }
    }
}
function ar(e) {
  if (e.defaultPrevented || e.pointerType === "mouse" && e.button > 0)
    return;
  const t = Ce(), n = bn(e, t), r = /* @__PURE__ */ new Map();
  let a = !1;
  n.forEach((o) => {
    o.separator && (a || (a = !0, o.separator.element.focus({
      // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#browser_compatibility
      focusVisible: !1,
      preventScroll: !0
    })));
    const i = t.get(o.group);
    i && r.set(o.group, i.layout);
  }), Be({
    cursorFlags: 0,
    hitRegions: n,
    initialLayoutMap: r,
    pointerDownAtPoint: { x: e.clientX, y: e.clientY },
    state: "active"
  }), n.length && e.preventDefault();
}
function Yr({
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
    const { group: d, groupSize: u } = l, { orientation: f, panels: m } = d, { disableCursor: y } = d.mutableState;
    let h = 0;
    o ? f === "horizontal" ? h = (t.clientX - o.x) / u * 100 : h = (t.clientY - o.y) / u * 100 : f === "horizontal" ? h = t.clientX < 0 ? -100 : 100 : h = t.clientY < 0 ? -100 : 100;
    const v = r.get(d), b = a.get(d);
    if (!v || !b)
      return;
    const {
      defaultLayoutDeferred: g,
      derivedPanelConstraints: I,
      groupSize: w,
      layout: P,
      separatorToPanels: N
    } = b;
    if (I && P && N) {
      const x = at({
        delta: h,
        initialLayout: v,
        panelConstraints: I,
        pivotIndices: l.panels.map((D) => m.indexOf(D)),
        prevLayout: P,
        trigger: "mouse-or-touch"
      });
      if (ke(x, P)) {
        if (h !== 0 && !y)
          switch (f) {
            case "horizontal": {
              s |= h < 0 ? Ur : Br;
              break;
            }
            case "vertical": {
              s |= h < 0 ? Wr : Hr;
              break;
            }
          }
      } else
        Pe(l.group, {
          defaultLayoutDeferred: g,
          derivedPanelConstraints: I,
          groupSize: w,
          layout: x,
          separatorToPanels: N
        });
    }
  });
  let c = 0;
  t.movementX === 0 ? c |= i & Vn : c |= s & Vn, t.movementY === 0 ? c |= i & Gn : c |= s & Gn, $s(c), hn(e);
}
function ir(e) {
  const t = Ce(), n = Ne();
  switch (n.state) {
    case "active":
      Yr({
        document: e.currentTarget,
        event: e,
        hitRegions: n.hitRegions,
        initialLayoutMap: n.initialLayoutMap,
        mountedGroups: t,
        prevCursorFlags: n.cursorFlags
      });
  }
}
function sr(e) {
  var r, a;
  if (e.defaultPrevented)
    return;
  const t = Ne(), n = Ce();
  switch (t.state) {
    case "active": {
      if (
        // Skip this check for "pointerleave" events, else Firefox triggers a false positive (see #514)
        e.buttons === 0
      ) {
        Be({
          cursorFlags: 0,
          state: "inactive"
        }), t.hitRegions.forEach((o) => {
          const i = Me(o.group.id, !0);
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
      Yr({
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
      const o = bn(e, n);
      o.length === 0 ? t.state !== "inactive" && Be({
        cursorFlags: 0,
        state: "inactive"
      }) : Be({
        cursorFlags: 0,
        hitRegions: o,
        state: "hover"
      }), hn(e.currentTarget);
      break;
    }
  }
}
function cr(e) {
  if (e.relatedTarget instanceof HTMLIFrameElement)
    switch (Ne().state) {
      case "hover":
        Be({
          cursorFlags: 0,
          state: "inactive"
        });
    }
}
function lr(e) {
  e.defaultPrevented || e.pointerType === "mouse" && e.button > 0 || Kr(e.currentTarget) && e.preventDefault();
}
function ur(e) {
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
function Zs(e, t, n) {
  if (!n[0])
    return;
  const r = e.panels.find((c) => c.element === t);
  if (!r || !r.onResize)
    return;
  const a = We({ group: e }), o = e.orientation === "horizontal" ? r.element.offsetWidth : r.element.offsetHeight, i = r.mutableValues.prevSize, s = {
    asPercentage: le(o / a * 100),
    inPixels: o
  };
  r.mutableValues.prevSize = s, r.onResize(s, r.id, i);
}
function Xs(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (e[n] !== t[n])
      return !1;
  return !0;
}
function Qs({
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
        const m = f / 100 * n, y = le(
          m / t * 100
        );
        s.set(u.id, y), a += y;
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
function ec(e, t) {
  const n = e.map((a) => a.id), r = Object.keys(t);
  if (n.length !== r.length)
    return !1;
  for (const a of n)
    if (!r.includes(a))
      return !1;
  return !0;
}
const Fe = /* @__PURE__ */ new Map();
function tc(e) {
  let t = !0;
  X(
    e.element.ownerDocument.defaultView,
    "Cannot register an unmounted Group"
  );
  const n = e.element.ownerDocument.defaultView.ResizeObserver, r = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), o = new n((y) => {
    for (const h of y) {
      const { borderBoxSize: v, target: b } = h;
      if (b === e.element) {
        if (t) {
          const g = We({ group: e });
          if (g === 0)
            return;
          const I = Me(e.id);
          if (!I)
            return;
          const w = Yt(e), P = I.defaultLayoutDeferred ? ur(w) : I.layout, N = Qs({
            group: e,
            nextGroupSize: g,
            prevGroupSize: I.groupSize,
            prevLayout: P
          }), x = Ae({
            layout: N,
            panelConstraints: w
          });
          if (!I.defaultLayoutDeferred && ke(I.layout, x) && Xs(
            I.derivedPanelConstraints,
            w
          ) && I.groupSize === g)
            return;
          Pe(e, {
            defaultLayoutDeferred: !1,
            derivedPanelConstraints: w,
            groupSize: g,
            layout: x,
            separatorToPanels: I.separatorToPanels
          });
        }
      } else
        Zs(e, b, v);
    }
  });
  o.observe(e.element), e.panels.forEach((y) => {
    X(
      !r.has(y.id),
      `Panel ids must be unique; id "${y.id}" was used more than once`
    ), r.add(y.id), y.onResize && o.observe(y.element);
  });
  const i = We({ group: e }), s = Yt(e), c = e.panels.map(({ id: y }) => y).join(",");
  let l = e.mutableState.defaultLayout;
  l && (ec(e.panels, l) || (l = void 0));
  const d = e.mutableState.layouts[c] ?? l ?? ur(s), u = Ae({
    layout: d,
    panelConstraints: s
  }), f = e.element.ownerDocument;
  Fe.set(
    f,
    (Fe.get(f) ?? 0) + 1
  );
  const m = /* @__PURE__ */ new Map();
  return Or(e).forEach((y) => {
    y.separator && m.set(y.separator, y.panels);
  }), Pe(e, {
    defaultLayoutDeferred: i === 0,
    derivedPanelConstraints: s,
    groupSize: i,
    layout: u,
    separatorToPanels: m
  }), e.separators.forEach((y) => {
    X(
      !a.has(y.id),
      `Separator ids must be unique; id "${y.id}" was used more than once`
    ), a.add(y.id), y.element.addEventListener("keydown", or);
  }), Fe.get(f) === 1 && (f.addEventListener("contextmenu", Qn, !0), f.addEventListener("dblclick", rr, !0), f.addEventListener("pointerdown", ar, !0), f.addEventListener("pointerleave", ir), f.addEventListener("pointermove", sr), f.addEventListener("pointerout", cr), f.addEventListener("pointerup", lr, !0)), function() {
    t = !1, Fe.set(
      f,
      Math.max(0, (Fe.get(f) ?? 0) - 1)
    ), Us(e), e.separators.forEach((y) => {
      y.element.removeEventListener("keydown", or);
    }), Fe.get(f) || (f.removeEventListener(
      "contextmenu",
      Qn,
      !0
    ), f.removeEventListener(
      "dblclick",
      rr,
      !0
    ), f.removeEventListener(
      "pointerdown",
      ar,
      !0
    ), f.removeEventListener("pointerleave", ir), f.removeEventListener("pointermove", sr), f.removeEventListener("pointerout", cr), f.removeEventListener("pointerup", lr, !0)), o.disconnect();
  };
}
function nc() {
  const [e, t] = L({}), n = E(() => t({}), []);
  return [e, n];
}
function yn(e) {
  const t = an();
  return `${e ?? t}`;
}
const ze = typeof window < "u" ? Le : j;
function et(e) {
  const t = A(e);
  return ze(() => {
    t.current = e;
  }, [e]), E(
    (...n) => {
      var r;
      return (r = t.current) == null ? void 0 : r.call(t, ...n);
    },
    [t]
  );
}
function vn(...e) {
  return et((t) => {
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
function wn(e) {
  const t = A({ ...e });
  return ze(() => {
    for (const n in e)
      t.current[n] = e[n];
  }, [e]), t.current;
}
const Zr = rn(null);
function rc(e, t) {
  const n = A({
    getLayout: () => ({}),
    setLayout: Os
  });
  nn(t, () => n.current, []), ze(() => {
    Object.assign(
      n.current,
      Gr({ groupId: e })
    );
  });
}
function Xr({
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
  ...m
}) {
  const y = A({
    onLayoutChange: {},
    onLayoutChanged: {}
  }), h = et((R) => {
    ke(y.current.onLayoutChange, R) || (y.current.onLayoutChange = R, c == null || c(R));
  }), v = et(
    (R, S) => {
      ke(y.current.onLayoutChanged, R) || (y.current.onLayoutChanged = R, l == null || l(R, { isUserInteraction: S }));
    }
  ), b = yn(s), g = A(null), [I, w] = nc(), P = A({
    lastExpandedPanelSizes: {},
    layouts: {},
    panels: [],
    resizeTargetMinimumSize: u,
    separators: []
  }), N = vn(g, o);
  rc(b, i);
  const x = et(
    (R, S) => {
      const k = Ne(), _ = Xn(R), $ = Me(R);
      if ($) {
        let C = !1;
        switch (k.state) {
          case "active": {
            C = k.hitRegions.some(
              (W) => W.group === _
            );
            break;
          }
        }
        return {
          flexGrow: $.layout[S] ?? 1,
          pointerEvents: C ? "none" : void 0
        };
      }
      if (n != null && n[S])
        return {
          flexGrow: n == null ? void 0 : n[S]
        };
    }
  ), D = wn({
    defaultLayout: n,
    disableCursor: r
  }), T = Y(
    () => ({
      get disableCursor() {
        return !!D.disableCursor;
      },
      getPanelStyles: x,
      id: b,
      orientation: d,
      registerPanel: (R) => {
        const S = P.current;
        return S.panels = Zt(d, [
          ...S.panels,
          R
        ]), w(), () => {
          S.panels = S.panels.filter(
            (k) => k !== R
          ), w();
        };
      },
      registerSeparator: (R) => {
        const S = P.current;
        return S.separators = Zt(d, [
          ...S.separators,
          R
        ]), w(), () => {
          S.separators = S.separators.filter(
            (k) => k !== R
          ), w();
        };
      },
      updatePanelProps: (R, { disabled: S }) => {
        const k = P.current.panels.find(
          (C) => C.id === R
        );
        k && (k.panelConstraints.disabled = S);
        const _ = Xn(b), $ = Me(b);
        _ && $ && Pe(_, {
          ...$,
          derivedPanelConstraints: Yt(_)
        });
      },
      updateSeparatorProps: (R, {
        disabled: S,
        disableDoubleClick: k
      }) => {
        const _ = P.current.separators.find(
          ($) => $.id === R
        );
        _ && (_.disabled = S, _.disableDoubleClick = k);
      }
    }),
    [x, b, w, d, D]
  ), M = A(null);
  return ze(() => {
    const R = g.current;
    if (R === null)
      return;
    const S = P.current;
    let k;
    if (D.defaultLayout !== void 0 && Object.keys(D.defaultLayout).length === S.panels.length) {
      k = {};
      for (const J of S.panels) {
        const oe = D.defaultLayout[J.id];
        oe !== void 0 && (k[J.id] = oe);
      }
    }
    const _ = {
      disabled: !!a,
      element: R,
      id: b,
      mutableState: {
        defaultLayout: k,
        disableCursor: !!D.disableCursor,
        expandedPanelSizes: P.current.lastExpandedPanelSizes,
        layouts: P.current.layouts
      },
      orientation: d,
      panels: S.panels,
      resizeTargetMinimumSize: S.resizeTargetMinimumSize,
      separators: S.separators
    };
    M.current = _;
    const $ = tc(_), { defaultLayoutDeferred: C, derivedPanelConstraints: W, layout: K } = Me(_.id, !0);
    !C && W.length > 0 && (h(K), v(K, !1));
    const G = gn(b, (J) => {
      const { defaultLayoutDeferred: oe, derivedPanelConstraints: te, layout: O } = J.next;
      if (oe || te.length === 0)
        return;
      const ne = _.panels.map(({ id: re }) => re).join(",");
      _.mutableState.layouts[ne] = O, te.forEach((re) => {
        if (re.collapsible) {
          const { layout: se } = J.prev ?? {};
          if (se) {
            const U = ce(
              re.collapsedSize,
              O[re.panelId]
            ), B = ce(
              re.collapsedSize,
              se[re.panelId]
            );
            U && !B && (_.mutableState.expandedPanelSizes[re.panelId] = se[re.panelId]);
          }
        }
      });
      const me = Ne().state !== "active";
      h(O), me && v(O, J.isUserInteraction);
    });
    return () => {
      M.current = null, $(), G();
    };
  }, [
    a,
    b,
    v,
    h,
    d,
    I,
    D
  ]), j(() => {
    const R = M.current;
    R && (R.mutableState.defaultLayout = n, R.mutableState.disableCursor = !!r);
  }), /* @__PURE__ */ p(Zr.Provider, { value: T, children: /* @__PURE__ */ p(
    "div",
    {
      ...m,
      className: t,
      "data-group": !0,
      "data-testid": b,
      id: b,
      ref: N,
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
Xr.displayName = "Group";
function Sn() {
  const e = on(Zr);
  return X(
    e,
    "Group Context not found; did you render a Panel or Separator outside of a Group?"
  ), e;
}
function oc(e, t) {
  const { id: n } = Sn(), r = A({
    collapse: Ft,
    expand: Ft,
    getSize: () => ({
      asPercentage: 0,
      inPixels: 0
    }),
    isCollapsed: () => !1,
    resize: Ft
  });
  nn(t, () => r.current, []), ze(() => {
    Object.assign(
      r.current,
      Vr({ groupId: n, panelId: e })
    );
  });
}
function Xt({
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
  style: m,
  ...y
}) {
  const h = !!c, v = yn(c), b = wn({
    disabled: o
  }), g = A(null), I = vn(g, i), {
    getPanelStyles: w,
    id: P,
    orientation: N,
    registerPanel: x,
    updatePanelProps: D
  } = Sn(), T = u !== null, M = et(
    (_, $, C) => {
      u == null || u(_, c, C);
    }
  );
  ze(() => {
    const _ = g.current;
    if (_ !== null) {
      const $ = {
        element: _,
        id: v,
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
          disabled: b.disabled,
          maxSize: l,
          minSize: d
        }
      };
      return x($);
    }
  }, [
    s,
    n,
    r,
    a,
    T,
    v,
    h,
    l,
    d,
    M,
    x,
    b
  ]), j(() => {
    D(v, { disabled: o });
  }, [o, v, D]), oc(v, f);
  const R = () => {
    const _ = w(P, v);
    if (_)
      return JSON.stringify(_);
  }, S = co(
    (_) => gn(P, _),
    R,
    R
  );
  let k;
  return S ? k = JSON.parse(S) : a !== void 0 ? k = {
    flexGrow: void 0,
    flexShrink: void 0,
    flexBasis: a
  } : k = { flexGrow: 1 }, /* @__PURE__ */ p(
    "div",
    {
      ...y,
      "data-disabled": o || void 0,
      "data-panel": !0,
      "data-testid": v,
      id: v,
      ref: I,
      style: {
        ...ac,
        display: "flex",
        flexBasis: 0,
        flexShrink: 1,
        overflow: "visible",
        ...k
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
            touchAction: N === "horizontal" ? "pan-y" : "pan-x"
          },
          children: e
        }
      )
    }
  );
}
Xt.displayName = "Panel";
const ac = {
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
function ic({
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
    o = Ae({
      layout: at({
        delta: l - i,
        initialLayout: e,
        panelConstraints: t,
        pivotIndices: d,
        prevLayout: e
      }),
      panelConstraints: t
    })[n], a = Ae({
      layout: at({
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
function Qr({
  children: e,
  className: t,
  disabled: n,
  disableDoubleClick: r,
  elementRef: a,
  id: o,
  style: i,
  ...s
}) {
  const c = yn(o), l = wn({
    disabled: n,
    disableDoubleClick: r
  }), [d, u] = L({}), [f, m] = L("inactive"), [y, h] = L(!1), v = A(null), b = vn(v, a), {
    disableCursor: g,
    id: I,
    orientation: w,
    registerSeparator: P,
    updateSeparatorProps: N
  } = Sn(), x = w === "horizontal" ? "vertical" : "horizontal";
  ze(() => {
    const M = v.current;
    if (M !== null) {
      const R = {
        disabled: l.disabled,
        disableDoubleClick: l.disableDoubleClick,
        element: M,
        id: c
      }, S = P(R), k = Fs(
        ($) => {
          m(
            $.next.state !== "inactive" && $.next.hitRegions.some(
              (C) => C.separator === R
            ) ? $.next.state : "inactive"
          );
        }
      ), _ = gn(
        I,
        ($) => {
          const { derivedPanelConstraints: C, layout: W, separatorToPanels: K } = $.next, G = K.get(R);
          if (G) {
            const J = G[0], oe = G.indexOf(J);
            u(
              ic({
                layout: W,
                panelConstraints: C,
                panelId: J.id,
                panelIndex: oe
              })
            );
          }
        }
      );
      return () => {
        k(), _(), S();
      };
    }
  }, [I, c, P, l]), j(() => {
    N(c, { disabled: n, disableDoubleClick: r });
  }, [n, r, c, N]);
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
        y ? T = "focus" : T = f;
    }
  return /* @__PURE__ */ p(
    "div",
    {
      ...s,
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
Qr.displayName = "Separator";
const In = "reader-document", it = "reader-assistant", eo = "retainpdf.reader.ai-split-layout.v1", sc = 30, cc = 65, lc = {
  [In]: 50,
  [it]: 50
};
function Pn(e) {
  const t = Number(e == null ? void 0 : e[it]), n = Number.isFinite(t) ? Math.min(cc, Math.max(sc, t)) : 50;
  return {
    [In]: 100 - n,
    [it]: n
  };
}
function uc() {
  try {
    const e = JSON.parse(localStorage.getItem(eo) || "null");
    return Pn(e);
  } catch {
    return lc;
  }
}
function dc(e) {
  try {
    localStorage.setItem(eo, JSON.stringify(Pn(e)));
  } catch {
  }
}
function $t(e, t) {
  const n = e == null ? void 0 : e.closest(".reader-react-root");
  if (!n) return;
  const r = Pn(t);
  n.style.setProperty(
    "--reader-ai-split-width",
    `${r[it]}vw`
  );
}
function fc() {
  const e = A(null), [t] = L(uc);
  Le(() => {
    const a = e.current;
    return $t(a, t), () => {
      var o;
      (o = a == null ? void 0 : a.closest(".reader-react-root")) == null || o.style.removeProperty("--reader-ai-split-width");
    };
  }, [t]);
  const n = E((a) => {
    $t(e.current, a);
  }, []), r = E((a, o) => {
    $t(e.current, a), o.isUserInteraction && dc(a);
  }, []);
  return /* @__PURE__ */ z(
    Xr,
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
          Xt,
          {
            id: In,
            defaultSize: "50%",
            minSize: "35%",
            maxSize: "70%"
          }
        ),
        /* @__PURE__ */ p(
          Qr,
          {
            id: "reader-ai-split-separator",
            className: "reader-ai-split-separator",
            "aria-label": "调整文档与 AI 问答宽度",
            children: /* @__PURE__ */ p("span", { "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ p(
          Xt,
          {
            id: it,
            defaultSize: "50%",
            minSize: "30%",
            maxSize: "65%"
          }
        )
      ]
    }
  );
}
const Re = 12, mc = 4;
function je(e, t, n) {
  if (typeof window > "u") return { x: e, y: t };
  const r = Math.min(n, window.innerWidth - Re * 2), a = Math.max(Re, window.innerWidth - r - Re), o = Math.min(window.innerHeight * 0.9, 860), i = Math.max(Re, window.innerHeight - o - Re);
  return {
    x: Math.min(a, Math.max(Re, e)),
    y: Math.min(i, Math.max(Re, t))
  };
}
function dr(e) {
  if (typeof window > "u") return { x: 24, y: 72 };
  const t = Math.min(e, window.innerWidth - Re * 2);
  return je(window.innerWidth - t - 20, 72, e);
}
function pc(e, t) {
  try {
    const n = localStorage.getItem(e);
    if (!n) return dr(t);
    const r = JSON.parse(n);
    if (typeof r.x == "number" && typeof r.y == "number")
      return je(r.x, r.y, t);
  } catch {
  }
  return dr(t);
}
function hc(e, t) {
  try {
    localStorage.setItem(e, JSON.stringify(t));
  } catch {
  }
}
function gc({
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
  children: m
}) {
  const y = l === "workspace", h = l === "dock-right", v = h || y, [b, g] = L(() => pc(o, c)), [I, w] = L(!1), P = A(null);
  j(() => {
    !t || v || g((T) => je(T.x, T.y, c));
  }, [v, t, c]), j(() => {
    if (!t || v) return;
    const T = () => g((M) => je(M.x, M.y, c));
    return window.addEventListener("resize", T), () => window.removeEventListener("resize", T);
  }, [v, t, c]), j(() => {
    if (!t) return;
    const T = (M) => {
      var S;
      if (M.key !== "Escape") return;
      const R = M.target;
      (S = R == null ? void 0 : R.closest) != null && S.call(R, "textarea, input, select, [contenteditable='true']") || (M.preventDefault(), u());
    };
    return window.addEventListener("keydown", T), () => window.removeEventListener("keydown", T);
  }, [t, u]);
  const N = E((T) => {
    var M, R;
    v || T.button === 0 && ((R = (M = T.target) == null ? void 0 : M.closest) != null && R.call(M, "button") || (T.currentTarget.setPointerCapture(T.pointerId), P.current = {
      pointerId: T.pointerId,
      startX: T.clientX,
      startY: T.clientY,
      originX: b.x,
      originY: b.y,
      moved: !1
    }, w(!0)));
  }, [v, b.x, b.y]), x = E((T) => {
    const M = P.current;
    if (!M || M.pointerId !== T.pointerId) return;
    const R = T.clientX - M.startX, S = T.clientY - M.startY;
    !M.moved && Math.hypot(R, S) < mc || (M.moved = !0, g(je(M.originX + R, M.originY + S, c)));
  }, [c]), D = E((T) => {
    const M = P.current;
    if (!(!M || M.pointerId !== T.pointerId)) {
      P.current = null, w(!1);
      try {
        T.currentTarget.releasePointerCapture(T.pointerId);
      } catch {
      }
      M.moved && g((R) => {
        const S = je(R.x, R.y, c);
        return hc(o, S), S;
      });
    }
  }, [o, c]);
  return t ? /* @__PURE__ */ z(
    "aside",
    {
      id: e,
      className: `reader-notes-panel reader-notes-panel--${y ? "workspace" : h ? "docked" : "float"}${v ? "" : " reader-floating-surface"}${d ? " has-panel-header" : " is-headerless"}${f ? " has-panel-toolbar" : ""}${I ? " is-dragging" : ""} ${s}`.trim(),
      style: v ? void 0 : { left: b.x, top: b.y, width: Math.min(c, typeof window < "u" ? window.innerWidth - 24 : c) },
      "aria-label": i,
      role: "dialog",
      "aria-modal": "false",
      children: [
        d ? /* @__PURE__ */ z(
          "header",
          {
            className: "reader-notes-panel-head",
            onPointerDown: N,
            onPointerMove: x,
            onPointerUp: D,
            onPointerCancel: D,
            children: [
              v ? null : /* @__PURE__ */ p("div", { className: "reader-notes-panel-drag", "aria-hidden": "true", children: /* @__PURE__ */ p(To, { size: 14, strokeWidth: 2.25 }) }),
              /* @__PURE__ */ z("div", { className: "reader-notes-panel-head-text", children: [
                /* @__PURE__ */ z("strong", { children: [
                  a,
                  n
                ] }),
                r ? /* @__PURE__ */ p("span", { children: r }) : null
              ] }),
              /* @__PURE__ */ p("button", { type: "button", className: "reader-notes-close reader-floating-close", "aria-label": `关闭${n}`, onClick: u, children: /* @__PURE__ */ p(He, { size: 14, strokeWidth: 2.5, "aria-hidden": !0 }) })
            ]
          }
        ) : null,
        f ? /* @__PURE__ */ p("div", { className: "reader-notes-panel-toolbar", children: f }) : null,
        /* @__PURE__ */ p("div", { className: "reader-notes-panel-body", children: m })
      ]
    }
  ) : null;
}
function bc({
  note: e,
  onJump: t,
  onUpdateNote: n,
  onRemove: r
}) {
  const [a, o] = L(!1), [i, s] = L(e.note);
  return j(() => {
    a || s(e.note);
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
          value: i,
          placeholder: "写点想法…",
          rows: 3,
          onChange: (c) => s(c.target.value)
        }
      ),
      /* @__PURE__ */ z("div", { className: "reader-notes-editor-actions", children: [
        /* @__PURE__ */ p(
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
function yc({
  open: e,
  groups: t,
  count: n,
  onClose: r,
  onJump: a,
  onUpdateNote: o,
  onRemove: i,
  onExport: s
}) {
  const [c, l] = L(!1);
  return /* @__PURE__ */ p(
    gc,
    {
      id: "reader-notes-panel",
      open: e,
      title: "批注",
      subtitle: "选中 PDF 文字后可添加 · 本地保存",
      titleIcon: /* @__PURE__ */ p(xt, { size: 14, strokeWidth: 2.25, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.notes-float.pos.v1",
      ariaLabel: "批注",
      onClose: r,
      toolbar: /* @__PURE__ */ z(en, { children: [
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
              await s() && (l(!0), window.setTimeout(() => l(!1), 1800));
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
          bc,
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
function vc({
  loading: e,
  failed: t,
  text: n,
  percent: r
}) {
  return !e && !t ? null : /* @__PURE__ */ z(en, { children: [
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
async function wc(e) {
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
function Sc({
  selection: e,
  onDismiss: t,
  onAskAi: n,
  onAddNote: r
}) {
  const [a, o] = L(!1), i = e ? e.selectionType === "text" ? `${e.pane}:${e.page}:${e.quote}` : `${e.region.itemId}:${e.pane}` : "";
  if (j(() => o(!1), [i]), !e)
    return null;
  const s = typeof window < "u" ? window.innerWidth : 800, c = typeof window < "u" ? window.innerHeight : 600, l = e.rect.left + e.rect.width / 2, d = 170, u = Math.min(Math.max(16 + d, l), s - 16 - d), f = e.rect.top > 72, m = f ? Math.max(12, e.rect.top - 8) : Math.min(c - 12, e.rect.top + e.rect.height + 8), y = f ? "above" : "below", h = e.pane === "translated" ? "译文" : "原文", v = e.selectionType === "text" ? "text" : e.kind, b = e.selectionType === "text" ? e.quote : Ir(e.region, e.pane), g = v === "formula" ? "公式" : v === "table" ? "表格" : v === "figure" ? "图片" : v === "text" ? "文字" : "区域", I = v === "formula" ? pa(b) : b, w = v === "formula" ? Mo : v === "table" ? xo : v === "text" ? Eo : No;
  return /* @__PURE__ */ z(
    "div",
    {
      className: `reader-sel-pop reader-sel-pop--${y} reader-sel-pop--region`,
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
                    await wc(I), o(!0), window.setTimeout(() => o(!1), 1400);
                  } catch (P) {
                    console.warn("[reader-selection] copy failed", P);
                  }
                },
                children: [
                  a ? /* @__PURE__ */ p(ko, { size: 15, strokeWidth: 2.4, "aria-hidden": !0 }) : /* @__PURE__ */ p(Ao, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
                  /* @__PURE__ */ p("span", { children: a ? "已复制" : v === "formula" ? "复制 LaTeX" : "复制" })
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
                  /* @__PURE__ */ p(xt, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
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
                  /* @__PURE__ */ p(cn, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
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
                children: /* @__PURE__ */ p(He, { size: 15, strokeWidth: 2.5, "aria-hidden": !0 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ p("span", { className: "reader-sel-pop-caret", "aria-hidden": "true" })
      ]
    }
  );
}
function Ic(e) {
  if (!(e instanceof HTMLElement)) return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function Pc() {
  const [e, t] = L(!1), n = an(), r = A(null);
  return j(() => {
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
  }, [e]), j(() => {
    const a = (o) => {
      if (o.defaultPrevented || o.metaKey || o.ctrlKey || o.altKey || Ic(o.target)) return;
      const i = o.key;
      if (i === "?" || i === "h" || i === "H" || i === "/") {
        if (i === "/" && !o.shiftKey)
          return;
        o.preventDefault(), t((s) => !s);
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
        children: /* @__PURE__ */ p(Lo, { className: "reader-react-shortcuts-icon", size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
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
          /* @__PURE__ */ p("div", { className: "reader-react-shortcuts-body", children: Ka.map((a) => /* @__PURE__ */ z("section", { className: "reader-react-shortcuts-group", children: [
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
const Rc = Object.freeze([
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
]), Tc = ["source", "sideBySide", "translated"], Mc = { source: "", translated: "", sideBySide: "" };
function xc(e) {
  if (e.sourceOnly || !e.jobId) {
    const t = nt(e.sourceUrl), n = nt(e.translatedUrl);
    return {
      source: t,
      translated: n,
      // sideBySide requires dedicated artifact; no fallback to source url
      sideBySide: ""
    };
  }
  return Xo({
    jobId: e.jobId,
    jobPayload: e.jobPayload,
    manifestPayload: e.manifestPayload
  });
}
function Ec(e) {
  const [t, n] = L(() => /* @__PURE__ */ new Set()), r = Y(
    () => e ? xc(e) : Mc,
    [e]
  ), a = Y(
    () => Tc.filter((i) => !(e != null && e.sourceOnly && i !== "source")),
    [e == null ? void 0 : e.sourceOnly]
  ), o = E(async (i) => {
    if (!e) return;
    const s = nt(r[i]);
    if (!(!s || t.has(i)))
      try {
        const c = e.jobId ? Zo(i, {
          jobId: e.jobId,
          jobPayload: e.jobPayload,
          manifestPayload: e.manifestPayload
        }) : `${e.sourceOnly ? "document" : "reader"}-${i}.pdf`;
        await Qo(
          e.fetchProtected,
          s,
          c,
          c,
          null,
          (l) => n((d) => {
            const u = new Set(d);
            return l ? u.add(i) : u.delete(i), u;
          })
        );
      } catch (c) {
        const l = c instanceof Error ? c.message : "下载失败";
        ea(l), n((d) => {
          const u = new Set(d);
          return u.delete(i), u;
        });
      }
  }, [r, t, e]);
  return { urls: r, downloadItems: a, busyActions: t, handleDownload: o };
}
function Nc(e) {
  const [t, n] = L(!1), r = E(() => n(!1), []), a = E(() => n((o) => !o), []);
  return j(() => {
    if (!t) return;
    const o = (s) => {
      const c = e.current;
      c && s.target instanceof Node && !c.contains(s.target) && n(!1);
    }, i = (s) => {
      s.key === "Escape" && (s.preventDefault(), n(!1));
    };
    return document.addEventListener("mousedown", o), window.addEventListener("keydown", i), () => {
      document.removeEventListener("mousedown", o), window.removeEventListener("keydown", i);
    };
  }, [t, e]), { open: t, setOpen: n, closeMenu: r, toggleMenu: a };
}
const to = "retainpdf.reader.fab.pos.v1", Mt = 52, $e = 12, kc = 6;
function tt(e, t) {
  if (typeof window > "u")
    return { x: e, y: t };
  const n = Math.max($e, window.innerWidth - Mt - $e), r = Math.max($e, window.innerHeight - Mt - $e);
  return {
    x: Math.min(n, Math.max($e, e)),
    y: Math.min(r, Math.max($e, t))
  };
}
function fr() {
  return typeof window > "u" ? { x: 24, y: 120 } : tt(
    window.innerWidth - Mt - 20,
    window.innerHeight - Mt - 88
  );
}
function Ac() {
  try {
    const e = localStorage.getItem(to);
    if (!e) return fr();
    const t = JSON.parse(e);
    if (typeof t.x == "number" && typeof t.y == "number")
      return tt(t.x, t.y);
  } catch {
  }
  return fr();
}
function Lc(e) {
  try {
    localStorage.setItem(to, JSON.stringify(e));
  } catch {
  }
}
function Cc(e) {
  return typeof window < "u" && e.y > window.innerHeight * 0.55;
}
function zc(e = {}) {
  const { onDragStart: t, onActivate: n } = e, [r, a] = L(() => Ac()), o = A(null);
  j(() => {
    const l = () => a((d) => tt(d.x, d.y));
    return window.addEventListener("resize", l), () => window.removeEventListener("resize", l);
  }, []);
  const i = E((l) => {
    l.button === 0 && (l.currentTarget.setPointerCapture(l.pointerId), o.current = {
      pointerId: l.pointerId,
      startX: l.clientX,
      startY: l.clientY,
      originX: r.x,
      originY: r.y,
      moved: !1
    });
  }, [r.x, r.y]), s = E((l) => {
    const d = o.current;
    if (!d || d.pointerId !== l.pointerId) return;
    const u = l.clientX - d.startX, f = l.clientY - d.startY;
    !d.moved && Math.hypot(u, f) < kc || (d.moved || (d.moved = !0, t == null || t()), a(tt(d.originX + u, d.originY + f)));
  }, [t]), c = E((l) => {
    const d = o.current;
    if (!(!d || d.pointerId !== l.pointerId)) {
      o.current = null;
      try {
        l.currentTarget.releasePointerCapture(l.pointerId);
      } catch {
      }
      if (d.moved) {
        a((u) => {
          const f = tt(u.x, u.y);
          return Lc(f), f;
        });
        return;
      }
      n == null || n();
    }
  }, [n]);
  return {
    pos: r,
    openUp: Cc(r),
    onPointerDown: i,
    onPointerMove: s,
    onPointerUp: c
  };
}
const _c = {
  source: hr,
  sideBySide: gr,
  translated: br
}, Dc = {
  source: "原文",
  sideBySide: "对照",
  translated: "译文"
};
function Fc({ onClose: e }) {
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
        children: /* @__PURE__ */ p(He, { size: 14, strokeWidth: 2.5, "aria-hidden": !0 })
      }
    )
  ] });
}
function $c({
  index: e,
  icon: t,
  title: n,
  sub: r,
  active: a,
  disabled: o,
  onClick: i
}) {
  return /* @__PURE__ */ z(
    "button",
    {
      type: "button",
      role: "menuitem",
      className: `reader-fab-row${a ? " is-active" : ""}${o ? " is-disabled" : ""}`,
      "aria-pressed": a,
      disabled: o,
      onClick: i,
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
function Oc({
  urls: e,
  items: t,
  busyActions: n,
  onDownload: r
}) {
  return /* @__PURE__ */ z("div", { className: "reader-fab-section", role: "group", "aria-label": "下载", children: [
    /* @__PURE__ */ z("div", { className: "reader-fab-section-head", children: [
      /* @__PURE__ */ p(Co, { size: 12, strokeWidth: 2.5, "aria-hidden": !0 }),
      /* @__PURE__ */ p("span", { children: "下载 PDF" })
    ] }),
    /* @__PURE__ */ p("div", { className: "reader-fab-download-grid", children: t.map((a, o) => {
      const i = po[a], s = nt(e[a]), c = n.has(a), l = !!s && !c, d = l ? "" : ho(a, e), u = _c[a];
      return /* @__PURE__ */ z(
        "button",
        {
          type: "button",
          role: "menuitem",
          id: `reader-fab-download-${a}`,
          className: `reader-fab-chip${c ? " is-busy" : ""}${l ? "" : " is-disabled"}`,
          disabled: !l,
          title: l ? `下载${i.label}` : d,
          onClick: () => void r(a),
          style: { "--fab-i": o },
          children: [
            /* @__PURE__ */ p("span", { className: "reader-fab-chip-icon", "aria-hidden": "true", children: /* @__PURE__ */ p(u, { size: 16, strokeWidth: 2 }) }),
            /* @__PURE__ */ p("span", { className: "reader-fab-chip-label", children: Dc[a] }),
            /* @__PURE__ */ p("span", { className: "reader-fab-chip-state", children: c ? "…" : l ? "↓" : "—" })
          ]
        },
        a
      );
    }) }),
    t.every((a) => !nt(e[a])) ? /* @__PURE__ */ p("p", { className: "reader-fab-empty", children: "产物尚未就绪" }) : null
  ] });
}
const jc = {
  favorites: zo,
  markdown: yr,
  ai: cn,
  notes: xt
}, Uc = Rc.filter((e) => e.id === "favorites");
function Bc(e) {
  const { activeTool: t, noteCount: n, onToggleTool: r } = e, a = ct(), o = e.sourceOnly ?? (a == null ? void 0 : a.sourceOnly) ?? !1, i = e.download ?? (a == null ? void 0 : a.download), s = A(null), c = an(), { open: l, setOpen: d, closeMenu: u, toggleMenu: f } = Nc(s), { pos: m, openUp: y, onPointerDown: h, onPointerMove: v, onPointerUp: b } = zc({
    onDragStart: u,
    onActivate: f
  }), { urls: g, downloadItems: I, busyActions: w, handleDownload: P } = Ec(i), N = E((x) => {
    r(x), d(!1);
  }, [r, d]);
  return /* @__PURE__ */ z(
    "div",
    {
      ref: s,
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
              /* @__PURE__ */ p(Fc, { onClose: u }),
              (() => {
                const x = t === "notes";
                return /* @__PURE__ */ z(
                  "button",
                  {
                    type: "button",
                    role: "menuitem",
                    className: `reader-fab-row${x ? " is-active" : ""}`,
                    "aria-pressed": x,
                    onClick: () => N("notes"),
                    style: { "--fab-i": 0 },
                    children: [
                      /* @__PURE__ */ p("span", { className: "reader-fab-row-icon", "aria-hidden": "true", children: /* @__PURE__ */ p(xt, { size: 18, strokeWidth: 2 }) }),
                      /* @__PURE__ */ z("span", { className: "reader-fab-row-copy", children: [
                        /* @__PURE__ */ p("span", { className: "reader-fab-row-title", children: "批注" }),
                        /* @__PURE__ */ p("span", { className: "reader-fab-row-sub", children: x ? "关闭悬浮窗" : "本地批注 · 导出" })
                      ] }),
                      n > 0 ? /* @__PURE__ */ p("span", { className: "reader-fab-row-badge", children: n }) : null
                    ]
                  }
                );
              })(),
              Uc.map((x, D) => {
                const T = jc[x.id], M = t === x.id, R = x.needsJob && o;
                let S = M ? x.subOpen : x.subIdle;
                return R && (S = "需打开任务阅读"), /* @__PURE__ */ p(
                  $c,
                  {
                    index: D,
                    icon: T,
                    title: x.label,
                    sub: S,
                    active: M,
                    disabled: R,
                    onClick: () => N(x.id)
                  },
                  x.id
                );
              }),
              /* @__PURE__ */ p(
                Oc,
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
            onPointerMove: v,
            onPointerUp: b,
            onPointerCancel: b,
            children: /* @__PURE__ */ p("span", { className: "reader-fab-icon", "aria-hidden": "true", children: l ? /* @__PURE__ */ p(He, { size: 20, strokeWidth: 2.5 }) : /* @__PURE__ */ z("span", { className: "reader-fab-dots", children: [
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
function Wc(e) {
  const t = ct(), n = ys(), { mode: r = "compare", modeControls: a } = e, o = e.userZoom ?? (t == null ? void 0 : t.userZoom) ?? st, i = e.onZoomChange ?? (t == null ? void 0 : t.onZoomChange) ?? (() => {
  }), s = e.currentPage ?? (n == null ? void 0 : n.currentPage) ?? 1, c = e.numPages ?? (n == null ? void 0 : n.numPages) ?? 0, l = e.onGoToPage ?? (t == null ? void 0 : t.goToPage), d = _a(o), u = o > Rr + 1e-3, f = o < Tr - 1e-3, m = Qe(), y = "50%（半屏，对照铺满）", [h, v] = L(!1), [b, g] = L(`${s}`);
  j(() => {
    h || g(`${Math.min(Math.max(s, 1), Math.max(c, 1))}`);
  }, [s, c, h]);
  const I = () => {
    if (v(!1), !l || c <= 0)
      return;
    const w = Number(`${b}`.trim());
    l(Rt(w, c));
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
                w.key === "Escape" && (w.preventDefault(), v(!1), g(`${s}`));
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
        "aria-label": c > 0 ? `跳转页码，当前第 ${s} 页，共 ${c} 页` : "页码",
        title: c > 0 ? "点击输入页码跳转" : void 0,
        disabled: !l || c <= 0,
        onClick: () => {
          !l || c <= 0 || (g(`${s}`), v(!0));
        },
        children: c > 0 ? `${Math.min(s, c)} / ${c}` : "—"
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
          onClick: () => i(ot(o, -1)),
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
          onClick: () => i(m),
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
          onClick: () => i(ot(o, 1)),
          children: "+"
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { className: "reader-react-hud-group reader-react-hud-help", "aria-label": "帮助", children: /* @__PURE__ */ p(Pc, {}) })
  ] });
}
function no(e) {
  const t = `${e.jobId || ""}`.trim(), n = `${e.documentId || ""}`.trim();
  return t ? `retainpdf.reader.notes.v1:job:${t}` : n ? `retainpdf.reader.notes.v1:doc:${n}` : "retainpdf.reader.notes.v1:anonymous";
}
function Hc() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function Jc(e) {
  return {
    pageIdx: Number(e.page) - 1,
    quoteText: e.quote,
    note: e.note,
    createdAt: e.createdAt
  };
}
function Kc(e) {
  return bo(e, (t) => t.page);
}
function qc(e) {
  return vo(e, (t) => t.page).map((t) => ({ page: t.pageIdx, items: t.items }));
}
function Vc(e, t) {
  return yo({
    title: e,
    annotations: t.map(Jc)
  });
}
function Gc(e) {
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
function mr(e) {
  if (typeof localStorage > "u")
    return [];
  try {
    return Gc(localStorage.getItem(no(e)));
  } catch {
    return [];
  }
}
function Yc(e, t) {
  if (!(typeof localStorage > "u"))
    try {
      localStorage.setItem(no(e), JSON.stringify(t));
    } catch (n) {
      console.warn("[reader-notes] persist failed", n);
    }
}
function Zc(e, t = {}) {
  const n = Y(
    () => ({
      jobId: `${e.jobId || ""}`.trim(),
      documentId: `${e.documentId || ""}`.trim()
    }),
    [e.jobId, e.documentId]
  ), [r, a] = L(() => mr(n)), o = t.onAfterAdd;
  j(() => {
    a(mr(n));
  }, [n.jobId, n.documentId]), j(() => {
    Yc(n, r);
  }, [n, r]);
  const i = E((u) => {
    const f = `${u.quote || ""}`.trim();
    if (!f)
      return null;
    const m = {
      id: Hc(),
      page: Math.max(1, Math.floor(Number(u.page) || 1)),
      pane: u.pane === "translated" ? "translated" : "source",
      quote: f,
      note: `${u.note || ""}`.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return a((y) => Kc([m, ...y])), o == null || o(), m;
  }, [o]), s = E((u, f) => {
    const m = `${f || ""}`.trim();
    a((y) => y.map((h) => h.id === u ? { ...h, note: m } : h));
  }, []), c = E((u) => {
    a((f) => f.filter((m) => m.id !== u));
  }, []), l = E(async (u = "") => {
    var m, y;
    const f = Vc(u, r);
    try {
      return await ((y = (m = navigator.clipboard) == null ? void 0 : m.writeText) == null ? void 0 : y.call(m, f)), !0;
    } catch (h) {
      return console.error("[reader-notes] copy failed", h), !1;
    }
  }, [r]), d = Y(() => qc(r), [r]);
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
const Qt = "download-toast";
function Xc({
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
function Qc(e = {}) {
  const {
    visible: t = !1,
    title: n = "下载中",
    status: r = "正在准备...",
    meta: a = "等待响应...",
    percent: o = NaN,
    tone: i = "progress"
  } = e;
  if (!t) {
    jt.dismiss(Qt);
    return;
  }
  jt.custom(
    () => /* @__PURE__ */ p(Xc, { title: n, status: r, meta: a, percent: o, tone: i }),
    { id: Qt, duration: 1 / 0 }
  );
}
function el() {
  const e = E((t) => {
    t && (t.setState = Qc, t.hide = () => jt.dismiss(Qt));
  }, []);
  return /* @__PURE__ */ z(en, { children: [
    /* @__PURE__ */ p(Po, { position: "bottom-right" }),
    /* @__PURE__ */ p("download-toast", { style: { display: "none" }, "aria-hidden": "true", ref: e })
  ] });
}
const tl = sn(() => import("./ReaderFavoritesPanel-NvJ62Zlb.js").then((e) => ({ default: e.ReaderFavoritesPanel }))), nl = sn(() => import("./ReaderMarkdownPanel-Dawku-OF.js").then((e) => ({ default: e.ReaderMarkdownPanel }))), rl = sn(() => import("./ReaderAiPanel-IZ5IQfP_.js").then((e) => ({ default: e.ReaderAiPanel })));
function Ot(e) {
  const t = A(!1);
  return e && (t.current = !0), t.current;
}
function ol(e) {
  return "workspace";
}
function al(e, t) {
  return t !== null && e === "compare" ? "source" : e;
}
function pr(e, t) {
  var n, r, a, o;
  return e === "compare" ? null : (t == null ? void 0 : t.assistantPanel) === "markdown" || (t == null ? void 0 : t.assistantPanel) === "ai" ? t.assistantPanel : ((n = t == null ? void 0 : t.splitLayout) == null ? void 0 : n.left) === "ai" || ((r = t == null ? void 0 : t.splitLayout) == null ? void 0 : r.right) === "ai" ? "ai" : ((a = t == null ? void 0 : t.splitLayout) == null ? void 0 : a.left) === "markdown" || ((o = t == null ? void 0 : t.splitLayout) == null ? void 0 : o.right) === "markdown" ? "markdown" : null;
}
function il() {
  const e = Oi(), { boot: t, panes: n, sessionFiles: r, tools: a, session: o } = e, i = e.sourceOnly || !r.translatedUrl, [s, c] = L(() => pr(e.mode, Ie(e.viewStateKey))), [l, d] = L(null), [u, f] = L(null), [m, y] = L(!0), h = A(e.viewStateKey), v = A(null), [b, g] = L(!1), I = E(() => g(!0), []), w = E(() => g((U) => !U), []), P = Zc(
    { jobId: o.jobId, documentId: o.documentId },
    { onAfterAdd: I }
  ), N = E((U) => {
    P.addFromQuote(U), e.clearSelection();
  }, [P.addFromQuote, e.clearSelection]), x = E((U) => {
    e.goToPage(U.page, U.pane === "translated" ? "translated" : "source");
  }, [e.goToPage]), D = E(
    () => P.exportMarkdown(o.title || ""),
    [P.exportMarkdown, o.title]
  );
  j(() => {
    f(null), y(!0), g(!1);
  }, [e.viewStateKey]), j(() => {
    if (!t.loading) {
      if (h.current !== e.viewStateKey) {
        h.current = e.viewStateKey;
        const U = Ie(e.viewStateKey);
        c(pr(e.mode, U)), d(null);
        return;
      }
      Tt(e.viewStateKey, { assistantPanel: s, splitLayout: null });
    }
  }, [s, t.loading, e.mode, e.viewStateKey]), j(() => {
    if (!(t.loading || t.failed)) {
      if (v.current !== e.viewStateKey) {
        v.current = e.viewStateKey;
        const U = Ie(e.viewStateKey), B = i ? "source" : U == null ? void 0 : U.mode;
        B && B !== e.mode && e.setModeKeepingPage(B);
        return;
      }
      Tt(e.viewStateKey, { mode: e.mode });
    }
  }, [t.failed, t.loading, e.mode, e.setModeKeepingPage, e.viewStateKey, i]);
  const T = s || (e.mode === "compare" ? "compare" : "reading"), M = s !== null, R = Ot(a.isOpen("favorites")), S = Ot(s === "markdown"), k = Ot(s === "ai"), _ = l || al(e.mode, s), $ = !!(e.liveTranslationAvailable && m && !M), C = $ ? "compare" : _, W = E(() => {
    a.close();
  }, [a]), K = E((U) => {
    if (U === "notes") {
      w();
      return;
    }
    a.toggle(U);
  }, [w, a]), G = E(() => {
    c(null), d(null), f(null);
  }, []), J = E((U) => {
    const B = C === "translated" ? "translated" : "source";
    e.jumpToAnchor(U, B);
  }, [e.jumpToAnchor, C]), oe = E((U) => {
    o.refreshCommittedDocument(U);
  }, [o.refreshCommittedDocument]), te = E((U) => {
    a.close(), d(null), U === "compare" && e.liveTranslationAvailable ? y(!0) : U !== "compare" && y(!1), e.setModeKeepingPage(U);
  }, [e.liveTranslationAvailable, e.setModeKeepingPage, a]), O = E((U) => {
    c(U), U !== "ai" && f(null);
  }, []), ne = E((U) => {
    const B = U.pane === "translated" && !i ? "translated" : "source";
    f(U), c("ai"), d(B), e.clearSelection();
  }, [e.clearSelection, i]), me = Y(() => ({
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
    sourceViewOnly: i,
    download: e.download,
    goToPage: e.goToPage,
    assistant: { select: O, close: G }
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
    i,
    e.download,
    e.goToPage,
    O,
    G
  ]), re = Y(() => ({
    currentPage: e.currentPage,
    numPages: n.hudNumPages
  }), [e.currentPage, n.hudNumPages]), se = [
    "reader-react-root",
    `is-workspace-${T}`,
    M ? "is-assistant-open" : "",
    $ ? "is-live-translation-pair" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(bs, { value: me, hud: re, children: /* @__PURE__ */ z("div", { className: se, "data-reader-engine": "react-pdf", "data-reader-workspace": T, children: [
    /* @__PURE__ */ p(vc, { loading: t.loading, failed: t.failed, text: t.text, percent: t.percent }),
    /* @__PURE__ */ p(Ji, { onBeforeClose: o.prepareClose }),
    /* @__PURE__ */ p(
      Ms,
      {
        mode: C,
        documentReady: !!o.jobId,
        onModeChange: te,
        liveTranslation: e.liveTranslationAvailable ? {
          visible: m,
          state: e.liveTranslation,
          onToggle: () => y((U) => !U)
        } : null
      }
    ),
    /* @__PURE__ */ p(xs, { active: s }),
    M ? /* @__PURE__ */ p(fc, {}) : null,
    e.showHud ? /* @__PURE__ */ p(Bc, { activeTool: b ? "notes" : a.active, noteCount: P.count, onToggleTool: K }) : null,
    /* @__PURE__ */ p(Is, { mode: C, compareMode: C === "compare", showSource: $ || C !== "translated", showTranslated: $ || C === "translated" || C === "compare", markdownSplit: s === "markdown", assistantSplit: M, liveTranslation: m ? e.liveTranslation : void 0, liveTranslationPair: $ }),
    e.showHud ? /* @__PURE__ */ p(
      Wc,
      {
        mode: C,
        modeControls: null
      }
    ) : null,
    /* @__PURE__ */ z(lo, { fallback: null, children: [
      R ? /* @__PURE__ */ p(tl, { open: a.isOpen("favorites"), jobId: o.jobId, documentId: o.documentId, onClose: W, onJumpPage: e.goToPage }) : null,
      S ? /* @__PURE__ */ p(nl, { open: s === "markdown", jobId: o.jobId, sourceOnly: e.sourceOnly, layout: "workspace", side: "right", onClose: G }) : null,
      k ? /* @__PURE__ */ p(rl, { open: s === "ai", jobId: o.jobId, documentId: o.documentId, layout: ol(e.mode), side: "right", selectionContext: u, onClearSelectionContext: () => f(null), onClose: G, onJumpCitation: J, onDocumentCommitted: oe }, o.documentId || o.jobId || "reader-ai-pending") : null
    ] }),
    /* @__PURE__ */ p(
      yc,
      {
        open: b,
        groups: P.groups,
        count: P.count,
        onClose: () => g(!1),
        onJump: x,
        onUpdateNote: P.updateNote,
        onRemove: P.remove,
        onExport: D
      }
    ),
    /* @__PURE__ */ p(Sc, { selection: e.selection, onDismiss: e.clearSelection, onAskAi: ne, onAddNote: N }),
    /* @__PURE__ */ p(el, {})
  ] }) });
}
function Rl() {
  return /* @__PURE__ */ p(il, {});
}
export {
  ln as A,
  Rl as R,
  il as a,
  gc as b,
  Pl as c,
  rt as d,
  Ho as e,
  Il as f,
  Ir as g,
  Sl as h,
  wl as r
};
//# sourceMappingURL=ReaderApp-D360eK74.js.map
