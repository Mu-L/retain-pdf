var gn = (e) => {
  throw TypeError(e);
};
var bn = (e, t, n) => t.has(e) || gn("Cannot " + n);
var Ve = (e, t, n) => (bn(e, t, "read from private field"), n ? n.call(e) : t.get(e)), yn = (e, t, n) => t.has(e) ? gn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), vn = (e, t, n, r) => (bn(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
import { jsxs as D, jsx as b, Fragment as Jt } from "react/jsx-runtime";
import { useMemo as Y, useState as L, useEffect as O, useCallback as C, useRef as z, useLayoutEffect as Ae, memo as qt, forwardRef as Gr, useImperativeHandle as Kt, useSyncExternalStore as Xr, useId as Vt, createContext as Zr, useContext as Qr, Suspense as eo, lazy as Yt } from "react";
import { X as Ue, Radio as to, FileText as sr, Columns2 as cr, Languages as lr, FileCode2 as ur, Sparkles as Gt, GripHorizontal as no, StickyNote as Xt, Sigma as ro, Table2 as oo, Type as ao, Image as io, Check as so, Copy as co, Keyboard as lo, Bookmark as uo, Download as fo } from "lucide-react";
import { getReaderAdapters as oe, requireAdapter as ve } from "./adapters.js";
import { resolveReaderDownloadName as po, resolveReaderDownloadUrls as mo, createReaderServerFavoritesPort as ho, READER_PROGRESS_COPY as be, trimString as Xe, READER_DOWNLOAD_ACTIONS as go, disabledReason as bo } from "./runtime/state.js";
import { d as yo } from "./ask-answerer-GNQdzitl.js";
import "@retainpdf/api/conversations";
import { n as wn } from "./block-key-BTxcG28S.js";
import { fetchLiveTranslationLayout as vo, LiveTranslationApiError as pt, streamLiveTranslationEvents as wo, fetchLiveTranslationPage as So } from "@retainpdf/api/live-translation";
import { toast as Lt, Toaster as Io } from "sonner";
import { pdfjs as xo, Page as Ro, Document as Mo } from "react-pdf";
import { e as Po, m as To, a as Eo } from "./markdown-math-Cb17EyYs.js";
const No = (...e) => {
  var t, n;
  return ((n = (t = oe()) == null ? void 0 : t.isMockMode) == null ? void 0 : n.call(t, ...e)) ?? !1;
}, ko = "", Ao = Object.freeze({
  progress: "retainpdf-reader-progress"
}), lt = (e) => {
  var t, n;
  return ((n = (t = oe()) == null ? void 0 : t.resolveResourceUrl) == null ? void 0 : n.call(t, e)) ?? e;
}, Lo = (...e) => {
  var t, n;
  return ((n = (t = oe()) == null ? void 0 : t.fetchProtected) == null ? void 0 : n.call(t, ...e)) ?? fetch(...e);
}, Ct = (e = "") => {
  var t, n;
  return ((n = (t = oe()) == null ? void 0 : t.resolvePdfjsVendorUrl) == null ? void 0 : n.call(t, e)) ?? "";
}, tt = new Proxy({}, { get: (e, t) => (...n) => {
  var r, a, o;
  return (o = (a = (r = oe()) == null ? void 0 : r.defaultReaderDataPort) == null ? void 0 : a[t]) == null ? void 0 : o.call(a, ...n);
} }), dr = new Proxy({}, { get: (e, t) => (...n) => {
  var r, a, o;
  return (o = (a = (r = oe()) == null ? void 0 : r.defaultReaderPageConfigPort) == null ? void 0 : a[t]) == null ? void 0 : o.call(a, ...n);
} }), Co = (...e) => {
  var t, n;
  return ((n = (t = oe()) == null ? void 0 : t.resolveReaderAnchor) == null ? void 0 : n.call(t, ...e)) ?? null;
}, zo = () => {
  var e, t;
  return ((t = (e = oe()) == null ? void 0 : e.resolveReaderDocumentId) == null ? void 0 : t.call(e)) ?? "";
}, Do = (...e) => {
  var t, n;
  return ((n = (t = oe()) == null ? void 0 : t.resolveReaderJobId) == null ? void 0 : n.call(t, ...e)) ?? "";
}, _o = (...e) => {
  var t, n;
  return ((n = (t = oe()) == null ? void 0 : t.resolveReaderArtifactUrl) == null ? void 0 : n.call(t, ...e)) ?? "";
}, $o = (...e) => {
  var t, n;
  return ((n = (t = oe()) == null ? void 0 : t.resolveReaderSourcePdf) == null ? void 0 : n.call(t, ...e)) ?? null;
}, Fo = (...e) => {
  var t, n;
  return ((n = (t = oe()) == null ? void 0 : t.resolveReaderTranslatedPdfUrl) == null ? void 0 : n.call(t, ...e)) ?? "";
}, Oo = (...e) => {
  var t, n;
  return ((n = (t = oe()) == null ? void 0 : t.resolveReaderDownloadName) == null ? void 0 : n.call(t, ...e)) ?? po(...e);
}, jo = (...e) => {
  var t, n;
  return ((n = (t = oe()) == null ? void 0 : t.resolveReaderDownloadUrls) == null ? void 0 : n.call(t, ...e)) ?? mo(...e);
}, Uo = (...e) => ve("downloadProtectedResource")(...e), Bo = (...e) => ve("failDownloadToast")(...e), Bc = (e, t) => ve("resolveMarkdownAssetUrl")(e, t), Wc = (e = {}) => {
  const t = oe();
  return yo({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) || "/api/v1",
    ask: t == null ? void 0 : t.askDocumentAi,
    documentByJobId: t == null ? void 0 : t.fetchDocumentByJobId,
    ...e
  });
}, Zt = "/api/v1", Wo = (...e) => ve("fetchDocumentByJobId")(...e), Hc = (e = Zt, t = {}) => {
  var n;
  return ve("fetchFavorites")(
    ((n = oe()) == null ? void 0 : n.apiPrefix) ?? e,
    t
  );
};
function Jc(e = {}) {
  const t = oe();
  return ho({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) ?? Zt,
    documentByJobId: (...n) => ve("fetchDocumentByJobId")(...n),
    submitFavorite: (...n) => ve("createFavorite")(...n),
    loadFavorites: (...n) => ve("fetchFavorites")(...n),
    removeFavorite: (...n) => ve("deleteFavorite")(...n),
    ...e
  });
}
function Ho() {
  const [e, t] = L(
    () => {
      var n, r;
      return ((n = globalThis.location) == null ? void 0 : n.search) || ((r = globalThis.location) == null ? void 0 : r.href) || "";
    }
  );
  return O(() => {
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
function Jo() {
  const e = Ho(), t = Y(() => Do(dr), [e]), n = Y(() => zo(), [e]), r = t || n ? `job:${t}|document:${n}` : `location:${e}`;
  return { locationKey: e, jobId: t, routeDocumentId: n, sessionIdentity: r };
}
function qo(e) {
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
  }), f = c.documentId === t ? c.jobId : "", p = d.documentId === t ? d.jobId : "", h = n || f, [y, S] = L({
    jobId: "",
    documentId: ""
  }), g = y.jobId === h ? y.documentId : "", v = t || g, x = !!t && !h, [w, m] = L(null), T = (w == null ? void 0 : w.sessionIdentity) === r && w.documentId === v ? w : null, R = x || !!T, N = C((E) => {
    const P = `${E.documentId || ""}`.trim();
    if (!P || o.current && o.current !== P) return;
    if (!o.current && i.current)
      S({
        jobId: i.current,
        documentId: P
      });
    else if (!o.current)
      return;
    const I = `${E.revision || ""}`.trim() || `${Date.now()}`;
    m({
      documentId: P,
      revision: I,
      sessionIdentity: a.current
    }), s();
  }, []);
  O(() => {
    m((E) => E && E.sessionIdentity !== r ? null : E);
  }, [r]);
  const M = C((E) => {
    switch (E.type) {
      case "resolved-document-job":
        l({ documentId: E.documentId, jobId: E.jobId });
        break;
      case "cleared-resolved-document-job":
        l({ documentId: "", jobId: "" });
        break;
      case "missing-document-job":
        u({ documentId: E.documentId, jobId: E.jobId });
        break;
      case "resolved-job-document":
        S((P) => P.jobId === E.jobId && P.documentId === E.documentId ? P : { jobId: E.jobId, documentId: E.documentId });
        break;
      case "committed-source":
        m({
          documentId: E.documentId,
          revision: E.revision,
          sessionIdentity: E.sessionIdentity
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
    sessionJobId: h,
    resolvedJobDocument: y,
    setResolvedJobDocument: S,
    jobDocumentId: g,
    documentId: v,
    sourceOnly: x,
    committedDocumentSource: w,
    setCommittedDocumentSource: m,
    activeCommittedDocumentSource: T,
    sourceViewOnly: R,
    refreshCommittedDocument: N,
    applyIdentityEvent: M
  };
}
const Ko = /* @__PURE__ */ new Set(["succeeded", "failed", "cancelled", "canceled"]);
function Sn(e) {
  return `${(e == null ? void 0 : e.status) || ""}`.trim().toLowerCase();
}
function Vo(e) {
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
function In(e, t) {
  const n = `/api/v1/documents/${encodeURIComponent(e)}/source.pdf`, r = `${t || ""}`.trim();
  return lt(r ? `${n}?version=${encodeURIComponent(r)}` : n);
}
function Yo(e, t = "") {
  const n = `${e || ""}`.trim(), r = `${t || ""}`.trim();
  return !!(!n || r && (n === r || n === `${r}.pdf`) || /^\d{8,14}-[0-9a-f]{4,}$/i.test(n));
}
function Go(e, t) {
  var r;
  const n = [
    e == null ? void 0 : e.title,
    e == null ? void 0 : e.display_name,
    e == null ? void 0 : e.source_file_name,
    (r = e == null ? void 0 : e.book_summary) == null ? void 0 : r.source_file_name
  ];
  for (const a of n) {
    const o = `${a || ""}`.trim();
    if (o && !Yo(o, t))
      return o.replace(/\.pdf$/i, "");
  }
  return "";
}
function zt({
  percent: e,
  text: t,
  stage: n
}) {
  var r;
  try {
    (r = window.parent) == null || r.postMessage(
      {
        type: Ao.progress,
        stage: n,
        percent: e,
        text: t
      },
      dr.messageTargetOrigin()
    );
  } catch {
  }
}
function mt(e, t, n, r = "progress") {
  e({
    loading: !0,
    percent: t,
    text: n,
    stage: r,
    failed: !1
  }), zt({ percent: t, text: n, stage: r });
}
function Xo(e) {
  const {
    sessionJobId: t,
    sessionIdentity: n,
    sessionIdentityRef: r,
    sessionJobIdRef: a,
    sessionEpochRef: o,
    closingRef: i
  } = e, [s, c] = L(null), [l, d] = L(null), [u, f] = L(""), [p, h] = L(0), y = u === n ? s : null, S = u === n ? l : null, g = Sn(y), v = Ko.has(g), x = C(() => {
    h((M) => M + 1);
  }, []), w = C((M) => {
    c(M.jobPayload), d(M.manifestPayload), f(M.sessionIdentity);
  }, []), m = C((M) => {
    c(null), d(null), f(M);
  }, []), T = z(""), R = z(""), N = C(async () => {
    const M = a.current;
    if (!M || T.current === M) return;
    const E = tt.loadJobPayload;
    if (typeof E != "function") return;
    const P = o.current.value;
    T.current = M;
    try {
      const I = await E(M);
      if (i.current || o.current.value !== P || a.current !== M || !I || typeof I != "object")
        return;
      const k = Sn(I);
      c(I), f(r.current), k === "succeeded" && R.current !== M && (R.current = M, h((_) => _ + 1));
    } catch {
    } finally {
      T.current === M && (T.current = "");
    }
  }, []);
  return O(() => {
    R.current = "";
  }, [n]), O(() => {
    if (!t || v || !y) return;
    const M = window.setInterval(() => {
      N();
    }, 1e3);
    return () => window.clearInterval(M);
  }, [v, N, y, t]), {
    jobPayload: s,
    setJobPayload: c,
    manifestPayload: l,
    setManifestPayload: d,
    payloadSessionIdentity: u,
    setPayloadSessionIdentity: f,
    scopedJobPayload: y,
    scopedManifestPayload: S,
    jobStatus: g,
    jobTerminal: v,
    jobRefreshRevision: p,
    refreshJobArtifacts: x,
    refreshJobStatus: N,
    publishPayload: w,
    clearPayload: m
  };
}
function Dt(e) {
  document.body.classList.remove(
    "reader-mode-source",
    "reader-mode-translated",
    "reader-mode-compare"
  ), document.body.classList.add(`reader-mode-${e}`);
}
function Zo(e, t) {
  e(t), Dt(t);
}
function Qo(e) {
  const [t, n] = L(e ? "source" : "compare"), r = C((o) => {
    e && o !== "source" || (n(o), Dt(o));
  }, [e]), a = C((o) => {
    Zo(n, o);
  }, []);
  return O(() => (e && document.documentElement.classList.add("reader-source-only"), Dt(t), () => {
    document.documentElement.classList.remove("reader-source-only");
  }), [e, t]), { mode: t, setMode: r, setModeState: n, switchSessionMode: a };
}
function Te(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : null;
}
function fr(e) {
  const t = Te(e);
  return t && "data" in t ? t.data : e;
}
function Ye(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? t : null;
}
function xn(e) {
  const t = Te(e);
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
function ea(e) {
  const t = Te(fr(e)), n = Array.isArray(t == null ? void 0 : t.items) ? t.items : [], r = [];
  for (const a of n) {
    const o = Te(a), i = `${(o == null ? void 0 : o.item_id) || (o == null ? void 0 : o.itemId) || ""}`.trim(), s = xn(o == null ? void 0 : o.source), c = xn(o == null ? void 0 : o.translated);
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
function ta(e) {
  const t = `${e || ""}`.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return t.includes("formula") || t.includes("equation") ? "formula" : t.includes("table") ? "table" : t.includes("figure") || t.includes("image") || t.includes("chart") || t.includes("seal") ? "figure" : t.includes("text") || t.includes("title") || t.includes("paragraph") || t.includes("reference") || t.includes("caption") ? "text" : "region";
}
function Qt(e) {
  const t = ta(e.regionType);
  if (t !== "region") return t;
  if (e.assetIds.length || e.assetUrls.length) return "figure";
  const n = `${e.markdown || e.source.text || e.translated.text || ""}`.trim();
  return /^<table(?:\s|>)/i.test(n) || /\n\s*\|?\s*:?-{3,}/.test(n) ? "table" : /^\$\$[\s\S]+\$\$$/.test(n) || /^\\\[[\s\S]+\\\]$/.test(n) || /^\\begin\{(?:equation|align|gather|multline)\*?\}/.test(n) ? "formula" : n ? "text" : t;
}
function pr(e) {
  const t = Qt(e);
  return t === "formula" || t === "table" || t === "figure";
}
function mr(e, t) {
  return `${ht(e, t).text || e.markdown || ""}`.trim();
}
function na(e) {
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
function Rn(e) {
  const t = Te(e);
  if (!t) return null;
  const n = [];
  for (const a of Array.isArray(t.pages) ? t.pages : []) {
    const o = Te(a), i = Ye(o == null ? void 0 : o.page), s = Ye(o == null ? void 0 : o.width), c = Ye(o == null ? void 0 : o.height);
    i == null || s == null || c == null || n.push({ page: Math.floor(i), width: s, height: c });
  }
  if (!n.length) return null;
  const r = Ye(t.page_count ?? t.pageCount);
  return {
    pageCount: r == null ? n.length : Math.floor(r),
    pages: n
  };
}
function ra(e) {
  const t = Te(fr(e));
  return {
    source: Rn(t == null ? void 0 : t.source),
    translated: Rn(t == null ? void 0 : t.translated)
  };
}
function ut(e, t) {
  const n = wn(t);
  return n && e.find((r) => wn(r.itemId) === n) || null;
}
function dt(e) {
  return `${e || ""}`.normalize("NFKC").toLocaleLowerCase().replace(/[\p{P}\p{S}\s]+/gu, "").trim();
}
function oa(e) {
  const t = `${e || ""}`.trim();
  if (!t) return [];
  const n = t.split(/\n\s*\n/g).map(dt).filter(Boolean), r = t.split(">").map(dt).filter(Boolean), a = [...n.reverse(), ...r.reverse(), dt(t)];
  return [...new Set(a)].filter((o) => o.length >= 16);
}
function aa(e, t) {
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
function ia(e, t) {
  if (!t) return null;
  const n = ut(e, t.block_id);
  if (n) return n;
  const r = oa(t.snippet);
  if (!r.length) return null;
  const a = t.page_idx != null ? Number(t.page_idx) + 1 : t.page != null ? Number(t.page) : null, o = Number.isFinite(a) && Number(a) >= 1 ? e.filter((l) => l.source.page === Math.floor(Number(a)) || l.translated.page === Math.floor(Number(a))) : e;
  let i = null, s = 0, c = !1;
  for (const l of o) {
    const d = [l.source.text, l.translated.text, l.markdown].map(dt).filter(Boolean);
    let u = 0;
    for (const f of r)
      for (const p of d)
        u = Math.max(u, aa(p, f));
    u > s ? (i = l, s = u, c = !1) : u > 0 && u === s && (c = !0);
  }
  return s > 0 && !c ? i : null;
}
function Mn(e) {
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
function sa(e, t, n) {
  const r = Mn(t);
  if (!r) return null;
  const a = Number(n);
  return (Number.isFinite(a) && a >= 1 ? e.filter((i) => i.source.page === Math.floor(a)) : e).find((i) => [...i.assetUrls, ...i.assetIds].some((s) => {
    const c = Mn(s);
    return !!c && (c === r || r.endsWith(`/${c}`) || c.endsWith(`/${r}`));
  })) || null;
}
function ht(e, t) {
  return t === "translated" ? e.translated : e.source;
}
function Pn(e, t, n) {
  if (!e || !t) return null;
  const r = ht(e, n), a = n === "translated" ? t.translated : t.source || t.translated, o = a == null ? void 0 : a.pages.find((i) => i.page === r.page);
  return o ? { itemId: e.itemId, region: e, box: r, pageSize: o } : null;
}
function St(e, t, n) {
  if (!e || t <= 0 || n <= 0) return null;
  const { box: r, pageSize: a } = e;
  if (a.width <= 0 || a.height <= 0) return null;
  const [o, i, s, c] = r.bbox, l = r.origin === "bottom_left" ? a.height - c : i, d = r.origin === "bottom_left" ? a.height - i : c, u = Math.max(0, Math.min(t, o / a.width * t)), f = Math.max(u, Math.min(t, s / a.width * t)), p = Math.max(0, Math.min(n, l / a.height * n)), h = Math.max(p, Math.min(n, d / a.height * n));
  return f <= u || h <= p ? null : { left: u, top: p, width: f - u, height: h - p };
}
function Tn(e) {
  return typeof e == "string" ? e.trim() : `${e ?? ""}`.trim();
}
function ca(e) {
  const t = (e == null ? void 0 : e.data) ?? e, n = t && typeof t == "object" ? t : {};
  return {
    activeJobId: Tn(n.active_job_id),
    activeVersionId: Tn(n.active_version_id)
  };
}
function la(e) {
  const { link: t, rejectedDocumentJobId: n, hasCommittedSource: r } = e, a = t.activeJobId && t.activeJobId !== n && !t.activeJobId.startsWith("doc:") ? t.activeJobId : "";
  return a ? { kind: "follow-active-job", jobId: a, activeVersionId: t.activeVersionId } : t.activeVersionId && !r ? { kind: "open-committed-source", documentId: "", revision: t.activeVersionId } : { kind: "open-source-url" };
}
function ua(e) {
  const {
    payloadDocumentId: t,
    linkedActiveJobId: n,
    linkedActiveVersionId: r,
    sessionJobId: a,
    hasCommittedSource: o
  } = e;
  return t && r && n === a && !o ? { kind: "restore-committed-source", documentId: t, revision: r } : { kind: "open-job-artifacts" };
}
function da(e) {
  return e.status === 404 && !e.jobId && !!e.routeDocumentId && !!e.documentJobId && e.sessionJobId === e.documentJobId;
}
function fa(e) {
  return e ? { data: e.data.slice() } : null;
}
const pa = 2, de = /* @__PURE__ */ new Map();
function _t(e, t) {
  de.delete(e), de.set(e, t);
}
function ma(e) {
  if (de.size < pa) return;
  const t = de.keys().next().value;
  t && de.delete(t);
}
function xt(e) {
  const t = `${e || ""}`.trim();
  if (!t || !de.has(t)) return null;
  const n = de.get(t);
  return _t(t, n), n;
}
async function hr(e, t = Lo, n = {}) {
  const r = `${e || ""}`.trim();
  if (!r)
    return null;
  if (de.has(r)) {
    const s = de.get(r);
    return _t(r, s), s;
  }
  const a = await t(r, { signal: n.signal });
  if (!a.ok) {
    const s = new Error(`读取 PDF 失败 (${a.status})`);
    throw s.status = a.status, s;
  }
  const o = await a.arrayBuffer(), i = { data: new Uint8Array(o) };
  return de.has(r) ? _t(r, i) : (ma(), de.set(r, i)), i;
}
function ha(e = "", t = null) {
  const [n, r] = L(
    () => t || xt(e)
  ), [a, o] = L(
    () => !!`${e || ""}`.trim() && !t && !xt(e)
  ), [i, s] = L("");
  return O(() => {
    if (t) {
      r(t), o(!1), s("");
      return;
    }
    const c = `${e || ""}`.trim();
    if (!c) {
      r(null), o(!1), s("");
      return;
    }
    const l = xt(c);
    if (l) {
      r(l), o(!1), s("");
      return;
    }
    let d = !1;
    return o(!0), s(""), r(null), hr(c).then((u) => {
      d || (r(u), o(!1));
    }).catch((u) => {
      d || (r(null), o(!1), s((u == null ? void 0 : u.message) || String(u)));
    }), () => {
      d = !0;
    };
  }, [e, t]), { file: n, loading: a, error: i };
}
function ga(e) {
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
async function $t(e) {
  const { url: t, label: n, percentStart: r, percentEnd: a, fence: o, setBoot: i } = e;
  if (!t || o.isInactive())
    return null;
  mt(i, r, n, "download");
  const s = await hr(t, tt.fetchProtected, {
    signal: o.signal
  });
  return o.isInactive() ? null : (mt(i, a, n, "download"), s);
}
async function ba(e) {
  const { sourceFinal: t, translatedFinal: n, fence: r, setBoot: a } = e;
  mt(a, 25, "正在下载 PDF…", "download");
  const o = [];
  let i = null, s = null;
  return t && o.push(
    $t({
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
    $t({
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
function ya(e) {
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
    jobRefreshRevision: h,
    sessionEpochRef: y,
    closingRef: S,
    activeLoadAbortRef: g
  } = e, [v, x] = L(""), [w, m] = L(""), [T, R] = L(null), [N, M] = L(null), [E, P] = L(!1), [I, k] = L(""), [_, $] = L([]), [H, F] = L(() => ({
    source: null,
    translated: null
  })), [U, B] = L({
    loading: !0,
    percent: 4,
    text: be.boot,
    stage: "progress",
    failed: !1
  });
  return O(() => {
    const W = new AbortController(), Z = y.current.value, G = ga({
      sessionEpochRef: y,
      closingRef: S,
      abort: W,
      sessionEpoch: Z
    });
    if (g.current = W, S.current)
      return W.abort(), () => {
        g.current === W && (g.current = null);
      };
    function re(q, J) {
      G.markFailed(), B({
        loading: !1,
        percent: 100,
        text: q,
        stage: "failed",
        failed: !0
      }), zt({ percent: 100, text: J, stage: "failed" });
    }
    function A() {
      P(!0), B({
        loading: !1,
        percent: 100,
        text: be.ready,
        stage: "ready",
        failed: !1
      }), zt({ percent: 100, text: be.ready, stage: "ready" });
    }
    function ee() {
      return l != null && l.documentId ? In(
        l.documentId,
        l.revision
      ) : No() ? ko : lt(`/api/v1/documents/${encodeURIComponent(r)}/source.pdf`);
    }
    async function te() {
      let q = { activeJobId: "", activeVersionId: "" };
      try {
        const fe = await tt.fetchProtected(
          lt(`/api/v1/documents/${encodeURIComponent(r)}`)
        );
        if (fe != null && fe.ok) {
          const We = await fe.json().catch(() => null);
          q = ca(We);
        }
      } catch {
      }
      const J = la({
        link: q,
        rejectedDocumentJobId: o,
        hasCommittedSource: !!l
      });
      if (J.kind === "follow-active-job") {
        if (G.isInactive()) return;
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
        if (G.isInactive()) return;
        d({
          type: "committed-source",
          documentId: r,
          revision: J.revision,
          sessionIdentity: c
        }), p("source");
        return;
      }
      const ne = ee();
      if (G.isInactive()) return;
      x(ne), m(""), k(""), f(c);
      const he = await $t({
        url: ne,
        label: "正在下载原文 PDF…",
        percentStart: 30,
        percentEnd: 85,
        fence: G,
        setBoot: B
      });
      if (!G.isInactive()) {
        if (!he) {
          re("源文件不可用：该文档没有可读取的源 PDF。", "源文件下载失败");
          return;
        }
        R(he), A();
      }
    }
    async function ce() {
      const q = await tt.loadReaderPayload(t, {
        // committedSource 分支会丢弃 regions/metadata（旧页序已失效），
        // 直接跳过这两个可选请求，避免无效网络往返。
        includeOptionalArtifacts: !l
      });
      if (G.isInactive()) return;
      let J = null;
      if (n && !r) {
        try {
          J = await Wo(Zt, t);
        } catch {
        }
        if (G.isInactive()) return;
      }
      const ne = Vo(q.jobPayload) || `${(J == null ? void 0 : J.document_id) || ""}`.trim();
      ne && !r && d({
        type: "resolved-job-document",
        jobId: t,
        documentId: ne
      });
      const he = ua({
        payloadDocumentId: ne,
        linkedActiveJobId: `${(J == null ? void 0 : J.active_job_id) || ""}`.trim(),
        linkedActiveVersionId: `${(J == null ? void 0 : J.active_version_id) || ""}`.trim(),
        sessionJobId: t,
        hasCommittedSource: !!l
      });
      if (he.kind === "restore-committed-source") {
        if (G.isInactive()) return;
        d({
          type: "committed-source",
          documentId: he.documentId,
          revision: he.revision,
          sessionIdentity: c
        }), p("source");
        return;
      }
      const fe = $o(q.manifestPayload), We = Fo(q.jobPayload, q.manifestPayload), He = typeof fe == "string" ? fe : _o(fe), Me = r || ne, Je = l != null && l.documentId ? In(
        l.documentId,
        l.revision
      ) : He || (Me ? lt(`/api/v1/documents/${encodeURIComponent(Me)}/source.pdf`) : ""), qe = l ? "" : We || "";
      if (x(Je || ""), m(qe), k(Go(q.jobPayload, t)), u({
        jobPayload: q.jobPayload || null,
        manifestPayload: q.manifestPayload || null,
        sessionIdentity: c
      }), $(l ? [] : ea(q.regionsPayload)), F(l ? { source: null, translated: null } : ra(q.readerMetadata)), !Je && !qe) {
        re(be.failed, be.failed);
        return;
      }
      const ze = await ba({
        sourceFinal: Je || "",
        translatedFinal: qe,
        fence: G,
        setBoot: B
      });
      if (ze.status !== "inactive") {
        if (ze.status === "incomplete") {
          re("PDF 下载失败，请重试", "PDF 下载失败");
          return;
        }
        R(ze.sourceBytes), M(ze.translatedBytes), A();
      }
    }
    async function le() {
      P(!1), R(null), M(null), $([]), F({ source: null, translated: null }), mt(B, 8, be.metadata, "metadata");
      try {
        if (i) {
          await te();
          return;
        }
        if (!t) {
          re(be.failed, be.failed);
          return;
        }
        await ce();
      } catch (q) {
        if (G.isClosedOrStale() || (q == null ? void 0 : q.name) === "AbortError") return;
        G.markFailed();
        const J = Number(q == null ? void 0 : q.status);
        if (da({
          status: J,
          jobId: n,
          routeDocumentId: r,
          documentJobId: a,
          sessionJobId: t
        })) {
          d({ type: "missing-document-job", documentId: r, jobId: t }), d({ type: "cleared-resolved-document-job" }), p("source");
          return;
        }
        const ne = q instanceof Error ? q.message : be.failed;
        re(ne, ne);
      }
    }
    return le(), () => {
      W.abort(), g.current === W && (g.current = null);
    };
  }, [t, r, a, o, i, s, l, h, n, c, d, u, f, p]), {
    sourceUrl: v,
    translatedUrl: w,
    sourceFile: T,
    translatedFile: N,
    assetsReady: E,
    title: I,
    regions: _,
    readerMetadata: H,
    boot: U
  };
}
function va() {
  const e = z(!1), t = z(null), { locationKey: n, jobId: r, routeDocumentId: a, sessionIdentity: o } = Jo(), i = z({ identity: "", value: 0 });
  i.current.identity !== o && (i.current = {
    identity: o,
    value: i.current.value + 1
  }, e.current = !1);
  const s = z(o), c = z(""), l = z(""), d = z(() => {
  }), u = C(() => d.current(), []), f = qo({
    routeDocumentId: a,
    jobId: r,
    sessionIdentity: o,
    sessionIdentityRef: s,
    documentIdRef: c,
    sessionJobIdRef: l,
    switchToSourceMode: u
  }), {
    sessionJobId: p,
    documentId: h,
    sourceOnly: y,
    sourceViewOnly: S
  } = f, { mode: g, setMode: v, switchSessionMode: x } = Qo(S);
  d.current = () => {
    x("source");
  }, s.current = o, c.current = h, l.current = p;
  const w = Xo({
    sessionJobId: p,
    sessionIdentity: o,
    sessionIdentityRef: s,
    sessionJobIdRef: l,
    sessionEpochRef: i,
    closingRef: e
  }), {
    scopedJobPayload: m,
    scopedManifestPayload: T,
    jobStatus: R,
    jobTerminal: N,
    jobRefreshRevision: M,
    refreshJobArtifacts: E,
    refreshJobStatus: P
  } = w, I = ya({
    sessionJobId: p,
    jobId: r,
    routeDocumentId: a,
    documentJobId: f.documentJobId,
    rejectedDocumentJobId: f.rejectedDocumentJobId,
    sourceOnly: y,
    locationKey: n,
    sessionIdentity: o,
    committedSource: f.activeCommittedDocumentSource,
    applyIdentityEvent: f.applyIdentityEvent,
    publishPayload: w.publishPayload,
    clearPayload: w.clearPayload,
    switchSessionMode: x,
    jobRefreshRevision: M,
    sessionEpochRef: i,
    closingRef: e,
    activeLoadAbortRef: t
  }), k = C(() => {
    var $;
    e.current = !0, ($ = t.current) == null || $.abort();
  }, []), _ = Y(
    () => ({
      fetchProtected: tt.fetchProtected,
      jobId: p,
      jobPayload: m,
      manifestPayload: T,
      sourceUrl: I.sourceUrl,
      translatedUrl: I.translatedUrl,
      sourceOnly: S
    }),
    [p, m, T, I.sourceUrl, I.translatedUrl, S]
  );
  return {
    jobId: p,
    jobStatus: R,
    workflow: `${(m == null ? void 0 : m.workflow) || ""}`.trim().toLowerCase(),
    jobTerminal: N,
    documentId: h,
    sourceOnly: y,
    mode: g,
    setMode: v,
    sourceUrl: I.sourceUrl,
    translatedUrl: I.translatedUrl,
    sourceFile: I.sourceFile,
    translatedFile: I.translatedFile,
    assetsReady: I.assetsReady,
    boot: I.boot,
    title: I.title,
    regions: I.regions,
    readerMetadata: I.readerMetadata,
    download: _,
    refreshJobArtifacts: E,
    refreshJobStatus: P,
    refreshCommittedDocument: f.refreshCommittedDocument,
    prepareClose: k
  };
}
const gr = 0.25, br = 1, wa = 0.05, en = 0.5, Sa = 16, Ia = 8;
function Ze(e) {
  return en;
}
function It(e) {
  return Number.isFinite(e) ? Math.min(br, Math.max(gr, e)) : en;
}
function nt(e, t) {
  const n = It(Number(e) + t * wa);
  return Math.round(n * 100) / 100;
}
function xa(e) {
  return Math.round(It(e) * 100);
}
function Ra(e) {
  const t = Number(e) || 0;
  return Math.max(160, Math.floor((t - 1) / 2));
}
function Ma(e) {
  const n = (Number(e) || 0) - Sa - Ia;
  return Math.max(160, Math.floor(n));
}
function Pa(e, t = en) {
  const n = It(t);
  return Ma((Number(e) || 0) * n);
}
function Ta(e, t) {
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
const gt = "data-reader-page", Ea = "data-reader-pane", Na = "reader-scroll-shell", ka = "reader-react-scroll-shell", tn = "reader-react-pdf-page-slot";
function bt(e, t) {
  const n = e != null ? `[${gt}="${e}"]` : `[${gt}]`;
  return t ? `${n}[${Ea}="${t}"]` : n;
}
function Aa() {
  return `.${tn}[${gt}]`;
}
function yr(e) {
  return Number(e.getAttribute(gt));
}
const nn = 48;
function vr(e, t = nn) {
  return e.getBoundingClientRect().top + t;
}
function wr(e, t) {
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
  const a = yr(n);
  if (!Number.isFinite(a) || a < 1)
    return null;
  const o = n.getBoundingClientRect(), i = o.height > 0 ? o.height : 1, s = Math.min(1, Math.max(0, (t - o.top) / i));
  return { el: n, page: a, fraction: s };
}
function Rt(e, t, n = nn) {
  if (!e)
    return null;
  const r = bt(void 0, t), a = Array.from(e.querySelectorAll(r));
  if (!a.length || e.getBoundingClientRect().height <= 0)
    return null;
  const i = vr(e, n), s = wr(a, i);
  return s ? { page: s.page, fraction: s.fraction } : null;
}
function rn(e, t, n = "auto", r, a = nn) {
  if (!e || !t)
    return !1;
  const o = Math.max(1, Math.floor(Number(t.page) || 1)), i = Math.min(1, Math.max(0, Number(t.fraction) || 0));
  let s = null;
  if (r && (s = e.querySelector(bt(o, r))), s || (s = e.querySelector(bt(o))), !s)
    return !1;
  const c = e.getBoundingClientRect(), l = s.getBoundingClientRect();
  if (c.height <= 0 || l.height < 8 && s.offsetHeight < 8)
    return !1;
  const d = l.height > 0 ? l.height : s.offsetHeight, u = e.scrollTop + (l.top - c.top), f = Math.max(0, u + i * d - a);
  return n === "auto" ? e.scrollTop = f : e.scrollTo({ top: f, behavior: n }), !0;
}
function La(e, t, n = "smooth", r) {
  return rn(
    e,
    { page: t, fraction: 0 },
    n,
    r
  );
}
function Ft(e, t, n) {
  const r = (n == null ? void 0 : n.behavior) ?? "auto", a = (n == null ? void 0 : n.delaysMs) ?? [0, 32, 120, 280];
  let o = !1, i = !1;
  const s = [], c = () => {
    var d;
    if (o) return;
    rn(
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
function Ca(e, t, n) {
  return Ft(
    e,
    { page: t, fraction: 0 },
    n
  );
}
function yt(e, t) {
  if (!Number.isFinite(e))
    return 1;
  const n = Math.max(1, Math.floor(e));
  return !Number.isFinite(t) || t <= 0 ? n : Math.min(t, n);
}
function ue(e) {
  return {
    page: Math.max(1, Math.floor(Number(e.page) || 1)),
    fraction: Math.min(1, Math.max(0, Number(e.fraction) || 0))
  };
}
function za(e) {
  if (!(e instanceof HTMLElement))
    return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function Da(e, t) {
  return e === "1" ? "source" : t ? null : e === "2" ? "compare" : e === "3" ? "translated" : null;
}
function _a(e) {
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
  O(() => {
    if (!l)
      return;
    const d = (u) => {
      if (u.defaultPrevented || u.metaKey || u.ctrlKey || u.altKey || za(u.target))
        return;
      const f = u.key, p = f.length === 1 ? f.toLowerCase() : f, h = Da(p, n);
      if (h) {
        u.preventDefault(), r(h);
        return;
      }
      if (f === "+" || f === "=") {
        u.preventDefault(), o(nt(a, 1));
        return;
      }
      if (f === "-" || f === "_") {
        u.preventDefault(), o(nt(a, -1));
        return;
      }
      if (p === "0") {
        u.preventDefault(), o(Ze());
        return;
      }
      if (!(s <= 0)) {
        if (p === "j" || f === "ArrowDown" || f === "PageDown") {
          u.preventDefault(), c(yt(i + 1, s));
          return;
        }
        if (p === "k" || f === "ArrowUp" || f === "PageUp") {
          u.preventDefault(), c(yt(i - 1, s));
          return;
        }
        if (f === "Home") {
          u.preventDefault(), c(1);
          return;
        }
        f === "End" && (u.preventDefault(), c(s));
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
const $a = 160, Fa = 8, Oa = 960;
function ja(e) {
  const t = z(null), [n, r] = L(null), [a, o] = L(Oa), i = z(e == null ? void 0 : e.onWidthChange);
  i.current = e == null ? void 0 : e.onWidthChange;
  const s = C((l) => {
    t.current = l, r(l);
  }, []);
  O(() => {
    const l = n;
    if (!l || typeof ResizeObserver > "u")
      return;
    const d = (f) => {
      !Number.isFinite(f) || f < $a || o((p) => Math.abs(p - f) < Fa ? p : f);
    }, u = new ResizeObserver((f) => {
      var p, h;
      d(((h = (p = f[0]) == null ? void 0 : p.contentRect) == null ? void 0 : h.width) ?? l.clientWidth);
    });
    return u.observe(l), d(l.clientWidth), () => u.disconnect();
  }, [n]), O(() => {
    var l;
    (l = i.current) == null || l.call(i, a);
  }, [a]);
  const c = Ra(a);
  return {
    shellRef: t,
    shellEl: n,
    shellWidth: a,
    compareColWidth: c,
    bindShell: s
  };
}
function Ua(e) {
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
function Ba(e, t) {
  const {
    mode: n,
    sourceOnly: r,
    assetsReady: a,
    sourceUrl: o,
    translatedUrl: i,
    sourceFile: s,
    translatedFile: c
  } = e, l = `${(t == null ? void 0 : t.identityKey) || ""}\0${o}\0${i}`, d = z(l);
  d.current = l;
  const [u, f] = L(() => ({
    identity: l,
    pages: { source: 0, translated: 0 }
  })), [p, h] = L(() => ({ identity: l, tick: 0 })), y = u.identity === l ? u.pages : { source: 0, translated: 0 }, S = p.identity === l ? p.tick : 0, g = Ua({
    mode: n,
    sourceOnly: r,
    assetsReady: a,
    hasSource: !!s || !!o,
    hasTranslated: !!c
  }), { primaryPane: v } = g, x = C((P, I) => {
    d.current === l && f((k) => {
      const _ = k.identity === l ? k.pages : { source: 0, translated: 0 };
      return _[I] === P && k.identity === l ? k : {
        identity: l,
        pages: { ..._, [I]: P }
      };
    });
  }, [l]), w = z(null), m = C(() => {
    w.current && clearTimeout(w.current);
    const P = l;
    w.current = setTimeout(() => {
      w.current = null, d.current === P && h((I) => ({
        identity: P,
        tick: I.identity === P ? I.tick + 1 : 1
      }));
    }, 60);
  }, [l]);
  O(() => (w.current && (clearTimeout(w.current), w.current = null), f((P) => P.identity === l && P.pages.source === 0 && P.pages.translated === 0 ? P : { identity: l, pages: { source: 0, translated: 0 } }), h((P) => P.identity === l && P.tick === 0 ? P : { identity: l, tick: 0 }), () => {
    w.current && (clearTimeout(w.current), w.current = null);
  }), [l]);
  const T = Y(
    () => Math.max(y.source, y.translated),
    [y]
  ), R = v === "translated" ? y.translated : y.source || y.translated, N = t == null ? void 0 : t.userZoom, M = t == null ? void 0 : t.shellWidth, E = `${l}-${S}-${N}-${n}-${y.source}-${y.translated}-${M}`;
  return {
    ...g,
    numPagesByPane: y,
    hudNumPages: T,
    primaryNumPages: R,
    metricsTick: S,
    onNumPages: x,
    onMetrics: m,
    rowSyncRevision: E
  };
}
const Wa = "retainpdf:reader:view:v1:", En = /* @__PURE__ */ new Set([
  "source",
  "translated",
  "markdown",
  "ai"
]);
function Sr() {
  try {
    return typeof globalThis.localStorage > "u" ? null : globalThis.localStorage;
  } catch {
    return null;
  }
}
function Ot(e) {
  return `${e || ""}`.trim();
}
function Ha({
  documentId: e,
  jobId: t
}) {
  const n = Ot(e);
  if (n) return `document:${n}`;
  const r = Ot(t);
  return r ? `job:${r}` : "";
}
function Ir(e) {
  const t = Ot(e);
  return t ? `${Wa}${t}` : "";
}
function Ja(e) {
  if (!e || typeof e != "object") return;
  const t = Math.floor(Number(e.page)), n = Number(e.fraction);
  if (!(!Number.isFinite(t) || t < 1 || !Number.isFinite(n)))
    return {
      page: t,
      fraction: Math.max(0, Math.min(1, n))
    };
}
function qa(e) {
  if (e === null) return null;
  if (!e || typeof e != "object") return;
  const t = `${e.left || ""}`, n = `${e.right || ""}`;
  if (!(!En.has(t) || !En.has(n) || t === n))
    return { left: t, right: n };
}
function Ka(e) {
  return e === null ? null : e === "markdown" || e === "ai" ? e : void 0;
}
function xr(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (t.schema !== "retainpdf_reader_view_v1") return null;
  const n = Ja(t.anchor), r = Number(t.zoom), a = qa(t.splitLayout), o = Ka(t.assistantPanel);
  return {
    schema: "retainpdf_reader_view_v1",
    ...n ? { anchor: n } : {},
    ...Number.isFinite(r) ? { zoom: Math.max(0.25, Math.min(1, r)) } : {},
    ...a !== void 0 ? { splitLayout: a } : {},
    ...o !== void 0 ? { assistantPanel: o } : {},
    updatedAt: Number.isFinite(Number(t.updatedAt)) ? Number(t.updatedAt) : 0
  };
}
function xe(e, t = Sr()) {
  const n = Ir(e);
  if (!n || !t) return null;
  try {
    const r = t.getItem(n);
    return r ? xr(JSON.parse(r)) : null;
  } catch {
    return null;
  }
}
function on(e, t, n = Sr()) {
  const r = Ir(e);
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
function Va(e, t, n = "") {
  const [r, a] = L(() => {
    var u;
    return ((u = xe(n)) == null ? void 0 : u.zoom) ?? Ze();
  }), o = z(r), i = z(n);
  o.current = r;
  const s = z(1);
  O(() => {
    var f;
    if (i.current === n) return;
    i.current = n;
    const u = ((f = xe(n)) == null ? void 0 : f.zoom) ?? Ze();
    s.current = 1, o.current = u, a(u);
  }, [e, n]);
  const c = C((u) => {
    const f = It(u), p = o.current;
    Math.abs(f - p) < 5e-4 || (s.current = f / (p || 1), on(i.current, { zoom: f }), a(f));
  }, []), l = C((u) => {
    c(nt(o.current, u));
  }, [c]), d = C((u) => {
    c(Ze());
  }, [c]);
  return Ae(() => {
    const u = s.current;
    Math.abs(u - 1) < 1e-3 || (s.current = 1, Ta(t == null ? void 0 : t.current, u));
  }, [r, t]), { userZoom: r, onZoomChange: c, stepZoom: l, resetZoom: d };
}
function Ya(e, t = !0) {
  const [n, r] = L(null), a = C(() => {
    var s, c;
    r(null);
    const i = (s = globalThis.getSelection) == null ? void 0 : s.call(globalThis);
    (c = i == null ? void 0 : i.removeAllRanges) == null || c.call(i);
  }, []), o = e.current ?? null;
  return O(() => {
    if (!t)
      return;
    const i = () => {
      var $, H;
      const y = e.current, S = ($ = globalThis.getSelection) == null ? void 0 : $.call(globalThis);
      if (!y || !S || S.isCollapsed || !S.rangeCount) {
        r(null);
        return;
      }
      const g = S.getRangeAt(0);
      if (!y.contains(g.commonAncestorContainer)) {
        r(null);
        return;
      }
      const v = `${S.toString() || ""}`.replace(/\s+/g, " ").trim();
      if (v.length < 2) {
        r(null);
        return;
      }
      let x = g.commonAncestorContainer;
      x.nodeType === Node.TEXT_NODE && (x = x.parentElement);
      const w = (H = x == null ? void 0 : x.closest) == null ? void 0 : H.call(
        x,
        "[data-reader-page]"
      );
      if (!w || !y.contains(w)) {
        r(null);
        return;
      }
      const m = Math.max(1, Math.floor(Number(w.getAttribute("data-reader-page")) || 1)), R = w.getAttribute("data-reader-pane") === "translated" ? "translated" : "source", N = g.getClientRects(), M = N[N.length - 1] || g.getBoundingClientRect();
      if (!M || M.width === 0 && M.height === 0) {
        r(null);
        return;
      }
      const E = typeof window < "u" ? window.innerWidth : 800, P = typeof window < "u" ? window.innerHeight : 600, I = 16, k = Math.min(Math.max(I, M.left), E - I), _ = Math.min(Math.max(I, M.top), P - I);
      r({
        selectionType: "text",
        quote: v,
        page: m,
        pane: R,
        rect: {
          left: k,
          top: _,
          width: M.width,
          height: M.height
        }
      });
    }, s = () => {
      window.setTimeout(i, 0);
    }, c = () => {
      s();
    }, l = () => s(), d = () => s(), u = () => {
      s();
    }, f = (y) => {
      y.key === "Escape" && a();
    }, p = () => {
      r((y) => y && null);
    };
    document.addEventListener("mouseup", c), document.addEventListener("pointerup", l), document.addEventListener("touchend", d), document.addEventListener("selectionchange", u), document.addEventListener("keyup", f);
    const h = o ?? e.current;
    return h == null || h.addEventListener("scroll", p, { passive: !0 }), window.addEventListener("scroll", p, { passive: !0, capture: !0 }), () => {
      document.removeEventListener("mouseup", c), document.removeEventListener("pointerup", l), document.removeEventListener("touchend", d), document.removeEventListener("selectionchange", u), document.removeEventListener("keyup", f), h == null || h.removeEventListener("scroll", p), window.removeEventListener("scroll", p, !0);
    };
  }, [t, o, a]), { selection: n, clearSelection: a };
}
function Ga(e) {
  const { mode: t, setMode: n, beginModeSwitch: r } = e, a = z(t), o = z(n), i = z(r);
  return a.current = t, o.current = n, i.current = r, { setModeKeepingPage: C((c) => {
    c !== a.current && (i.current(), o.current(c));
  }, []) };
}
function Xa() {
  const [e, t] = L(null), n = C((i) => {
    t(i);
  }, []), r = C((i = null) => {
    t((s) => !i || s === i ? null : s);
  }, []), a = C((i) => {
    t((s) => s === i ? null : i);
  }, []), o = C(
    (i) => e === i,
    [e]
  );
  return { active: e, open: n, close: r, toggle: a, isOpen: o };
}
function Za(e, t, n = !0, r = "", a) {
  const [o, i] = L(1);
  return O(() => {
    if (!n || t <= 0) {
      i(1);
      return;
    }
    const s = e.current;
    if (!s)
      return;
    let c = !1, l = null, d = 0;
    const u = bt(void 0, a), f = () => {
      if (c) return;
      const y = Array.from(s.querySelectorAll(u));
      if (!y.length)
        return;
      const S = vr(s), g = wr(y, S);
      g && i(g.page);
    }, p = () => {
      c || (d && cancelAnimationFrame(d), d = requestAnimationFrame(() => {
        d = 0, f();
      }));
    }, h = () => {
      if (c) return;
      if (!Array.from(s.querySelectorAll(u)).length) {
        l = setTimeout(h, 120);
        return;
      }
      f(), s.addEventListener("scroll", p, { passive: !0 });
    };
    return h(), () => {
      c = !0, l && clearTimeout(l), d && cancelAnimationFrame(d), s.removeEventListener("scroll", p);
    };
  }, [e, t, n, r, a]), o;
}
function Qa(e) {
  const t = e.querySelector(
    "canvas, .react-pdf__Page, .reader-react-pdf-page, .reader-react-pdf-page-placeholder"
  );
  if (t) {
    const a = t.getBoundingClientRect().height;
    if (Number.isFinite(a) && a > 0)
      return a;
  }
  const n = Number(e.getAttribute("data-natural-height"));
  if (Number.isFinite(n) && n > 0)
    return n;
  const r = e.getBoundingClientRect().height;
  return Number.isFinite(r) && r > 0 ? r : 0;
}
function ei(e, t) {
  if (e.size !== t.size) return !1;
  for (const [n, r] of t)
    if (e.get(n) !== r) return !1;
  return !0;
}
function ti(e, t, n = "", r) {
  const [a, o] = L(() => /* @__PURE__ */ new Map()), i = z(r);
  return i.current = r, Ae(() => {
    if (!t) {
      o((v) => v.size === 0 ? v : /* @__PURE__ */ new Map());
      return;
    }
    let s = !1, c = 0, l = !1, d = !1;
    const u = () => {
      var m;
      if (s) return;
      const v = e.current;
      if (!v) return;
      const x = /* @__PURE__ */ new Map();
      v.querySelectorAll(Aa()).forEach((T) => {
        const R = yr(T);
        if (!Number.isFinite(R) || R < 1) return;
        const N = Qa(T);
        if (N <= 0) return;
        const M = x.get(R) || { height: 0, count: 0 };
        M.height = Math.max(M.height, N), M.count += 1, x.set(R, M);
      });
      const w = /* @__PURE__ */ new Map();
      x.forEach((T, R) => {
        T.count >= 2 && T.height > 0 && w.set(R, Math.ceil(T.height));
      }), o((T) => ei(T, w) ? T : w), l && !d && (d = !0, (m = i.current) == null || m.call(i));
    }, f = () => {
      cancelAnimationFrame(c), c = requestAnimationFrame(() => {
        requestAnimationFrame(u);
      });
    };
    f();
    const p = window.setTimeout(f, 100), h = window.setTimeout(() => {
      l = !0, f();
    }, 300), y = window.setTimeout(f, 700), S = e.current;
    let g = null;
    return S && typeof ResizeObserver < "u" && (g = new ResizeObserver(() => f()), g.observe(S)), () => {
      s = !0, cancelAnimationFrame(c), window.clearTimeout(p), window.clearTimeout(h), window.clearTimeout(y), g == null || g.disconnect();
    };
  }, [e, t, n]), a;
}
const ni = [0, 48, 140, 320, 560], ri = 700, oi = [80, 200, 400], ai = 500, ii = 50, si = 180, Nn = [0, 48, 140, 320, 700, 1200];
function ci(e, t) {
  var P;
  const {
    primaryPane: n,
    mode: r,
    enabled: a = !0,
    persistenceKey: o = "",
    restoreReady: i = !0
  } = t, s = z(
    ((P = xe(o)) == null ? void 0 : P.anchor) || { page: 1, fraction: 0 }
  ), c = z(null), l = z(!1), d = z(r), u = z(null), f = z(null), p = z(null), h = z(null), y = z(o), S = z(""), g = z(n);
  g.current = n;
  const v = C(() => {
    var I;
    (I = u.current) == null || I.call(u), u.current = null, f.current != null && (clearTimeout(f.current), f.current = null);
  }, []), x = C((I = !1) => {
    h.current != null && (clearTimeout(h.current), h.current = null);
    const k = () => {
      h.current = null, on(y.current, {
        anchor: ue(s.current)
      });
    };
    I ? k() : h.current = setTimeout(k, si);
  }, []), w = C((I) => {
    s.current = ue(I), c.current = null, p.current != null && clearTimeout(p.current), p.current = setTimeout(() => {
      p.current = null, l.current = !1;
    }, ii);
  }, []);
  O(() => {
    if (!a)
      return;
    let I = !1, k = null, _ = null, $ = null;
    const H = () => {
      if (I) return;
      const F = e.current;
      if (!F) {
        $ = setTimeout(H, 50);
        return;
      }
      k = F, _ = () => {
        if (l.current)
          return;
        const U = Rt(k, g.current);
        U && (s.current = U, x());
      }, k.addEventListener("scroll", _, { passive: !0 }), l.current || _();
    };
    return H(), () => {
      I = !0, $ != null && clearTimeout($), k && _ && k.removeEventListener("scroll", _);
    };
  }, [a, r, n, e, x]), Ae(() => {
    var k;
    if (y.current === o) return;
    x(!0), v(), p.current != null && (clearTimeout(p.current), p.current = null), y.current = o, S.current = "";
    const I = (k = xe(o)) == null ? void 0 : k.anchor;
    s.current = I ? ue(I) : { page: 1, fraction: 0 }, c.current = null, l.current = !!o, d.current = r;
  }, [o, r, x, v]), O(() => {
    var k;
    if (!a || !i || !o || S.current === o) return;
    S.current = o;
    const I = ue(
      ((k = xe(o)) == null ? void 0 : k.anchor) || { page: 1, fraction: 0 }
    );
    return s.current = I, c.current = I, l.current = !0, v(), u.current = Ft(
      () => e.current,
      I,
      {
        behavior: "auto",
        pane: g.current,
        delaysMs: Nn,
        onDone: () => w(I)
      }
    ), f.current = setTimeout(() => {
      f.current = null, w(I);
    }, Math.max(...Nn) + 160), () => v();
  }, [a, i, o, e, w, v]), O(() => {
    if (d.current === r)
      return;
    if (d.current = r, !a) {
      l.current = !1, c.current = null, v();
      return;
    }
    const I = c.current ? ue(c.current) : ue(s.current);
    return l.current = !0, c.current = I, s.current = I, v(), u.current = Ft(
      () => e.current,
      I,
      {
        behavior: "auto",
        pane: n,
        // 等页宽/行高同步后再钉；同一 locked 幂等，不会越滚越远
        delaysMs: ni,
        onDone: () => w(I)
      }
    ), f.current = setTimeout(() => {
      f.current = null, w(I);
    }, ri), () => {
      v();
    };
  }, [r, a, n, e, w, v]), O(() => () => {
    v(), p.current != null && (clearTimeout(p.current), p.current = null), x(!0);
  }, [v, x]);
  const m = C(() => {
    const I = Rt(
      e.current,
      g.current
    );
    return ue(I || s.current);
  }, [e]), T = C(() => {
    l.current = !0;
    const I = Rt(
      e.current,
      g.current
    ), k = ue(I ?? s.current);
    return s.current = k, c.current = k, x(), k;
  }, [e, x]), R = C((I, k, _) => {
    const $ = _ || g.current, H = yt(I, k || 1), F = { page: H, fraction: 0 };
    s.current = F, l.current = !0, c.current = F, x(), v(), La(e.current, H, "smooth", $), u.current = Ca(
      () => e.current,
      H,
      {
        behavior: "auto",
        pane: $,
        delaysMs: oi,
        onDone: () => w(F)
      }
    ), f.current = setTimeout(() => {
      f.current = null, w(F);
    }, ai);
  }, [e, w, v, x]), N = C(() => ue(s.current), []), M = C(() => l.current, []), E = C(() => {
    if (!l.current || !c.current)
      return;
    const I = ue(c.current);
    rn(
      e.current,
      I,
      "auto",
      g.current
    );
  }, [e]);
  return {
    lockFromShell: m,
    beginModeSwitch: T,
    goToPage: R,
    getAnchor: N,
    isRestoring: M,
    repinIfRestoring: E
  };
}
function li(e, t) {
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
function ui(e, t, n) {
  const r = `${(n == null ? void 0 : n.jobId) || ""}`.trim(), a = `${(n == null ? void 0 : n.documentId) || ""}`.trim(), o = `j:${r}:d:${a}`;
  return t == null ? `${o}:none:${(e == null ? void 0 : e.blockId) || ""}` : `${o}:p:${t}:b:${(e == null ? void 0 : e.blockId) || ""}`;
}
const di = [0, 80, 200, 400, 800];
function fi(e) {
  const { enabled: t, numPages: n, goToPage: r, resolveBlockPage: a, onAnchorApplied: o, jobId: i, documentId: s } = e, c = z(""), l = z(r);
  l.current = r;
  const d = z(a);
  d.current = a;
  const u = z(o);
  u.current = o, O(() => {
    var S;
    if (!t || !Number.isFinite(n) || n < 1)
      return;
    const f = Co(), p = li(f, d.current), h = ui(f, p, { jobId: i, documentId: s });
    if (c.current === h)
      return;
    if (p == null) {
      c.current = h;
      return;
    }
    c.current = h, f && ((S = u.current) == null || S.call(u, f, p));
    const y = [];
    for (const g of di)
      y.push(
        setTimeout(() => {
          l.current(p);
        }, g)
      );
    return () => {
      for (const g of y) clearTimeout(g);
    };
  }, [t, n, i, s]);
}
const it = {
  layoutByPage: /* @__PURE__ */ new Map(),
  pagesByPage: /* @__PURE__ */ new Map(),
  lastSeq: 0,
  connection: "idle",
  jobStatus: "",
  error: ""
};
function pi(e) {
  return new Map(((e == null ? void 0 : e.pages) || []).map((t) => [t.page_idx, t]));
}
function kn(e, t) {
  return e.attempt !== t.attempt ? e.attempt < t.attempt ? -1 : 1 : e.generation !== t.generation ? e.generation < t.generation ? -1 : 1 : 0;
}
function Rr(e, t, n) {
  if (n.page_idx !== t.page_idx) return "retry";
  const r = kn(n, t);
  if (r < 0 || r === 0 && n.page_hash !== t.page_hash) return "retry";
  if (!e) return "accept";
  const a = kn(n, e);
  return a < 0 ? "ignore" : a === 0 ? n.page_hash === e.pageHash ? "ignore" : "retry" : "accept";
}
function mi(e, t, n) {
  if (t.seq <= e.lastSeq) return e;
  const r = e.pagesByPage.get(t.page_idx), a = Rr(r, t, n);
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
const An = [250, 500, 1e3, 2e3, 4e3], Mt = [80, 160, 320, 640, 1e3, 1500], Ln = [250, 500, 1e3, 2e3, 4e3, 5e3], hi = /* @__PURE__ */ new Set(["succeeded", "failed", "cancelled", "canceled"]);
function jt(e, t) {
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
function Pt(e, t) {
  if (e instanceof pt) {
    if (e.code === "LIVE_TRANSLATION_PAGE_NOT_COMMITTED")
      return "尚未收到可显示的页面译文";
    if (e.code === "LIVE_TRANSLATION_LAYOUT_NOT_READY")
      return "正在等待 OCR 版面数据";
  }
  return `${(e == null ? void 0 : e.message) || ""}`.trim() || t;
}
async function gi(e, t, n, r) {
  let a = null;
  for (let o = 0; ; o += 1) {
    try {
      const s = await So(e, t.page_idx, { signal: r });
      if (Rr(n.pagesByPage.get(t.page_idx), t, s) !== "retry")
        return s;
      a = new pt(
        "Authoritative page snapshot has not reached the event generation",
        409,
        "LIVE_TRANSLATION_SNAPSHOT_UNAVAILABLE"
      );
    } catch (s) {
      if ((s == null ? void 0 : s.name) === "AbortError") throw s;
      a = s;
      const c = s instanceof pt ? s.code : "";
      if (c && ![
        "LIVE_TRANSLATION_PAGE_NOT_COMMITTED",
        "LIVE_TRANSLATION_SNAPSHOT_UNAVAILABLE"
      ].includes(c)) throw s;
    }
    const i = Mt[Math.min(o, Mt.length - 1)];
    if (await jt(i, r), o >= Mt.length + 2) throw a;
  }
}
function bi({
  jobId: e,
  jobStatus: t,
  enabled: n
}) {
  const [r, a] = L(it), o = z(r), i = z("");
  o.current = r;
  const s = `${e || ""}`.trim(), c = `${t || ""}`.trim().toLowerCase(), l = hi.has(c) ? c : "";
  return O(() => {
    if (!n || !s) {
      i.current = "", o.current = it, a(it);
      return;
    }
    const d = i.current === s;
    i.current = s;
    const u = new AbortController();
    let f = !1;
    const p = {
      ...d ? o.current : it,
      connection: l ? "terminal" : "connecting",
      jobStatus: c,
      error: ""
    };
    o.current = p, a(p);
    const h = (g) => {
      u.signal.aborted || a((v) => {
        const x = g(v);
        return o.current = x, x;
      });
    }, y = async () => {
      let g = 0;
      for (; !u.signal.aborted; )
        try {
          const v = await vo(s, { signal: u.signal });
          f = !0, h((x) => ({
            ...x,
            layoutByPage: pi(v),
            jobStatus: c,
            error: ""
          }));
          return;
        } catch (v) {
          if ((v == null ? void 0 : v.name) === "AbortError") return;
          if (!(v instanceof pt && v.code === "LIVE_TRANSLATION_LAYOUT_NOT_READY")) {
            h((w) => ({
              ...w,
              connection: l ? "terminal" : "unavailable",
              jobStatus: c,
              error: Pt(v, "实时译文暂不可用")
            }));
            return;
          }
          if (l) {
            h((w) => ({
              ...w,
              connection: "terminal",
              jobStatus: c,
              error: ""
            }));
            return;
          }
          h((w) => ({
            ...w,
            connection: "connecting",
            jobStatus: c,
            error: Pt(v, "正在等待 OCR 版面数据")
          })), await jt(An[Math.min(g, An.length - 1)], u.signal).catch(() => {
          }), g += 1;
        }
    };
    return (async () => {
      if (await y(), !f || u.signal.aborted) return;
      let g = 0;
      for (; !u.signal.aborted; ) {
        l || h((v) => ({
          ...v,
          connection: v.lastSeq > 0 ? "reconnecting" : "connecting",
          jobStatus: c,
          error: v.lastSeq > 0 ? v.error : ""
        }));
        try {
          await wo(s, {
            afterSeq: o.current.lastSeq,
            signal: u.signal,
            onEvent: async (v) => {
              if (v.seq <= o.current.lastSeq) return;
              const x = await gi(
                s,
                v,
                o.current,
                u.signal
              );
              h((w) => {
                const m = mi(w, v, x);
                return l ? {
                  ...m,
                  connection: "terminal",
                  jobStatus: c
                } : {
                  ...m,
                  jobStatus: c
                };
              }), g = 0;
            }
          });
        } catch (v) {
          if ((v == null ? void 0 : v.name) === "AbortError" || u.signal.aborted) return;
          h((x) => ({
            ...x,
            connection: l ? "terminal" : "reconnecting",
            jobStatus: c,
            error: Pt(v, "实时译文连接已中断，正在重连")
          }));
        }
        if (u.signal.aborted) return;
        if (l) {
          h((v) => ({
            ...v,
            connection: "terminal",
            jobStatus: c
          }));
          return;
        }
        await jt(Ln[Math.min(g, Ln.length - 1)], u.signal).catch(() => {
        }), g += 1;
      }
    })(), () => u.abort();
  }, [n, s, l]), r;
}
const yi = 2e3;
function vi(e) {
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
const wi = /* @__PURE__ */ new Set(["book", "translate"]);
function Mr(e) {
  return !!(e.jobId && e.sourceUrl && wi.has(e.workflow));
}
function Si(e) {
  return !!(Mr(e) && !(e.jobStatus === "succeeded" && e.translatedUrl));
}
function Ii() {
  const e = va(), t = Mr({
    jobId: e.jobId,
    sourceUrl: e.sourceUrl,
    workflow: e.workflow
  }), n = Si({
    jobId: e.jobId,
    sourceUrl: e.sourceUrl,
    translatedUrl: e.translatedUrl,
    jobStatus: e.jobStatus,
    workflow: e.workflow
  }), r = bi({
    jobId: e.jobId,
    jobStatus: e.jobStatus,
    enabled: t
  }), a = Xa(), { shellRef: o, shellEl: i, shellWidth: s, compareColWidth: c, bindShell: l } = ja(), d = Ha({
    documentId: e.documentId,
    jobId: e.jobId
  }), u = `${d}\0${e.jobId}\0${e.sourceUrl}\0${e.translatedUrl}`, { userZoom: f, onZoomChange: p } = Va(e.mode, o, d), h = Ba(
    {
      mode: e.mode,
      sourceOnly: e.sourceOnly,
      assetsReady: e.assetsReady,
      sourceUrl: e.sourceUrl,
      translatedUrl: e.translatedUrl,
      sourceFile: e.sourceFile,
      translatedFile: e.translatedFile
    },
    { userZoom: f, shellWidth: s, identityKey: u }
  ), {
    beginModeSwitch: y,
    goToPage: S,
    repinIfRestoring: g
  } = ci(o, {
    primaryPane: h.primaryPane,
    mode: e.mode,
    enabled: !e.boot.loading,
    persistenceKey: d,
    restoreReady: h.primaryNumPages > 0
  });
  O(() => {
    g();
  }, [s, g]);
  const v = ti(
    o,
    h.compareMode,
    h.rowSyncRevision,
    g
  ), x = Za(
    o,
    h.primaryNumPages,
    !e.boot.loading,
    `${e.mode}-${f}-${h.metricsTick}`,
    h.primaryPane
  ), w = C((A, ee) => {
    var ce, le;
    const te = Math.max(
      Number(h.hudNumPages) || 0,
      Number(h.primaryNumPages) || 0,
      Number((ce = h.numPagesByPane) == null ? void 0 : ce.source) || 0,
      Number((le = h.numPagesByPane) == null ? void 0 : le.translated) || 0
    );
    S(A, te, ee);
  }, [S, h.hudNumPages, h.primaryNumPages, h.numPagesByPane]), [m, T] = L(null), R = z(null), N = C((A) => {
    R.current && clearTimeout(R.current), T(A), A && (R.current = setTimeout(() => T(null), yi));
  }, []);
  O(() => () => {
    R.current && clearTimeout(R.current);
  }, []);
  const M = C((A) => {
    const ee = ut(e.regions, A);
    return ee ? ht(ee, h.primaryPane).page : null;
  }, [e.regions, h.primaryPane]), E = C((A, ee) => {
    const te = ee || h.primaryPane, ce = typeof A == "object" && A ? `${A.block_id || ""}`.trim() : "", le = typeof A == "object" && A ? `${A.image_url || ""}`.trim() : "", q = typeof A == "object" && A ? A.page_idx != null ? Number(A.page_idx) + 1 : A.page != null ? Number(A.page) : null : typeof A == "number" ? A + 1 : null, J = sa(e.regions, le, q) || ut(e.regions, ce) || (typeof A == "object" ? ia(e.regions, A) : null);
    let ne = J ? ht(J, te).page : null;
    ne == null && (ne = vi(A)), !(ne == null || ne < 1) && (N(J), w(ne, te));
  }, [N, w, h.primaryPane, e.regions]);
  fi({
    enabled: !e.boot.loading && !e.boot.failed && e.assetsReady,
    numPages: h.hudNumPages || 0,
    goToPage: w,
    resolveBlockPage: M,
    jobId: e.jobId,
    documentId: e.documentId,
    onAnchorApplied: (A) => {
      N(ut(e.regions, A.blockId));
    }
  });
  const { setModeKeepingPage: P } = Ga({
    mode: e.mode,
    setMode: e.setMode,
    beginModeSwitch: y
  }), [I, k] = L(null), {
    selection: _,
    clearSelection: $
  } = Ya(o, !e.boot.loading && !e.boot.failed), H = C(() => {
    k(null), $();
  }, [$]), F = C((A) => {
    $(), k(A);
  }, [$]);
  O(() => {
    _ && k(null);
  }, [_]), O(() => {
    const A = o.current;
    if (!A) return;
    const ee = () => k(null);
    return A.addEventListener("scroll", ee, { passive: !0 }), () => A.removeEventListener("scroll", ee);
  }, [i, o]);
  const U = _ || I;
  O(() => {
    N(null), H();
  }, [u, N, H]);
  const B = !e.boot.loading && !e.boot.failed;
  _a({
    mode: e.mode,
    sourceOnly: e.sourceOnly,
    setMode: P,
    userZoom: f,
    onZoomChange: p,
    currentPage: x,
    numPages: h.hudNumPages,
    goToPage: w,
    enabled: B
  });
  const W = Y(() => a, [a.active, a.open, a.close, a.toggle, a.isOpen]), Z = Y(() => ({ bindShell: l, shellEl: i, shellWidth: s, compareColWidth: c, shellRef: o }), [l, i, s, c, o]), G = Y(() => ({
    sourceUrl: e.sourceUrl,
    translatedUrl: e.translatedUrl,
    sourceFile: e.sourceFile,
    translatedFile: e.translatedFile
  }), [e.sourceUrl, e.translatedUrl, e.sourceFile, e.translatedFile]), re = Y(() => ({
    session: e,
    boot: e.boot,
    sourceOnly: e.sourceOnly,
    mode: e.mode,
    userZoom: f,
    onZoomChange: p,
    shell: Z,
    panes: h,
    sessionFiles: G,
    rowHeights: v,
    goToPage: w,
    activeRegion: m,
    jumpToAnchor: E,
    setModeKeepingPage: P,
    download: e.download,
    showHud: B,
    tools: W,
    selection: U,
    clearSelection: H,
    selectRegion: F,
    documentTitle: e.title || "",
    viewStateKey: d,
    liveTranslation: r,
    liveTranslationAvailable: n
  }), [e, Z, h, G, v, w, m, E, P, B, W, U, H, F, f, p, d, r, n]);
  return Y(() => ({
    ...re,
    currentPage: x
  }), [re, x]);
}
const xi = "retainpdf:soft-reader-close";
function Ri() {
  return new URL("./index.html", window.location.href).href;
}
function Mi() {
  if (typeof window > "u" || window.self === window.top) return !1;
  try {
    return window.parent.postMessage(
      { type: xi },
      window.location.origin
    ), !0;
  } catch {
    return !1;
  }
}
function Pi(e, t, n) {
  if (n <= 1 || !e) return !1;
  try {
    const r = new URL(t), a = new URL(e, r);
    return a.origin === r.origin && !/reader\.html$/i.test(a.pathname) && !/detail\.html$/i.test(a.pathname);
  } catch {
    return !1;
  }
}
function Ti() {
  if (!(typeof window > "u") && !Mi()) {
    if (Pi(
      document.referrer,
      window.location.href,
      window.history.length
    )) {
      window.history.back();
      return;
    }
    window.location.assign(Ri());
  }
}
function Ei({ onBeforeClose: e } = {}) {
  return /* @__PURE__ */ D(
    "button",
    {
      id: "reader-close-home-btn",
      type: "button",
      className: "reader-close-home-btn",
      "aria-label": "返回主页",
      title: "返回主页",
      onClick: () => {
        e == null || e(), Ti();
      },
      children: [
        /* @__PURE__ */ b(Ue, { className: "reader-close-home-icon", size: 18, strokeWidth: 2.25, "aria-hidden": !0 }),
        /* @__PURE__ */ b("span", { className: "reader-close-home-label", children: "关闭" })
      ]
    }
  );
}
let Cn = !1;
function Ni() {
  if (Cn)
    return;
  const e = Ct("build/pdf.worker.mjs");
  e && (xo.GlobalWorkerOptions.workerSrc = e, Cn = !0);
}
const ki = {
  formula: "公式",
  table: "表格",
  figure: "图片",
  text: "文字",
  region: "区域"
};
function Ai({
  pane: e,
  width: t,
  height: n,
  regions: r,
  onSelect: a
}) {
  const o = r.flatMap((i) => {
    if (!pr(i.region)) return [];
    const s = St(i, t, n);
    return s ? [{ highlight: i, rect: s }] : [];
  });
  return o.length ? /* @__PURE__ */ b("div", { className: "reader-structure-selection-layer", "aria-label": "PDF 结构选择层", children: o.map(({ highlight: i, rect: s }) => {
    const c = i.region, l = Qt(c), d = ki[l];
    return /* @__PURE__ */ D(
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
          /* @__PURE__ */ b("span", { className: "reader-structure-selection-label", "aria-hidden": "true", children: d }),
          /* @__PURE__ */ b("span", { className: "sr-only", children: mr(c, e) })
        ]
      },
      c.itemId
    );
  }) }) : null;
}
function Li(e, t, n) {
  return e.flatMap((r) => {
    if (Qt(r.region) !== "text") return [];
    const a = St(r, t, n);
    return a ? [{ itemId: r.itemId, highlight: r, rect: a }] : [];
  });
}
function zn(e, t, n) {
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
function Ci({ target: e }) {
  return e ? /* @__PURE__ */ b("div", { className: "reader-text-hover-layer", "aria-hidden": "true", children: /* @__PURE__ */ b(
    "div",
    {
      className: "reader-text-hover-frame",
      "data-reader-text-hover-id": e.itemId,
      style: e.rect,
      children: /* @__PURE__ */ b("span", { className: "reader-text-hover-label", children: "文字" })
    }
  ) }) : null;
}
function zi(e, t) {
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
function Di(e, t, n, r) {
  if (!e || !t) return [];
  const a = [];
  for (const o of e.blocks) {
    const i = t.itemsById.get(o.item_id);
    if (!(i != null && i.translated_text)) continue;
    const s = St(
      zi(e, o),
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
const _i = '"Source Han Serif SC", "Noto Serif CJK SC", "Songti SC", serif', Dn = /* @__PURE__ */ new Map();
function $i(e) {
  return `${e || ""}`.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function Fi(e) {
  const t = `${e || ""}`, { text: n, slots: r } = Po(t), a = $i(n), o = To(a, r);
  if (!r.length)
    return { fallbackHtml: o, richHtml: Promise.resolve(o), hasMath: !1 };
  let i = Dn.get(t);
  return i || (i = Eo(a, r), Dn.set(t, i)), { fallbackHtml: o, richHtml: i, hasMath: !0 };
}
function Tt(e) {
  return /title|heading|header|display_formula|equation/i.test(e);
}
function ye(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? t : void 0;
}
function Oi(e, t) {
  const n = e.typography, r = ye(t) || 1, a = ye(n == null ? void 0 : n.font_size_pt), o = Math.max(1, `${e.sourceText || ""}`.split(/\n+/).length), i = e.rect.height / Math.max(1.28, o * 1.18), s = Tt(e.kind) ? 24 : /caption|footnote|table/i.test(e.kind) ? 9.5 : 11, c = Math.max(5.5 * r, Math.min(i, s * r)), l = ye(n == null ? void 0 : n.fit_min_font_size_pt), d = ye(n == null ? void 0 : n.fit_max_font_size_pt), u = Math.max(3.5, (l || 5.5) * r), f = Math.max(
    u,
    d ? d * r : a ? a * r : c
  ), p = a ? a * r : c, h = ye(n == null ? void 0 : n.leading_em), y = [
    ye(n == null ? void 0 : n.padding_top_pt) || 0,
    ye(n == null ? void 0 : n.padding_right_pt) || 0,
    ye(n == null ? void 0 : n.padding_bottom_pt) || 0,
    ye(n == null ? void 0 : n.padding_left_pt) || 0
  ].map((S) => S * r);
  return {
    fontFamily: `${(n == null ? void 0 : n.font_family) || ""}`.trim() || _i,
    fontSizePx: Math.max(u, Math.min(f, p)),
    minFontSizePx: u,
    maxFontSizePx: f,
    // Typst leading is the additional inter-line gap, unlike CSS line-height.
    lineHeight: h ? 1 + h : 1.3,
    fontWeight: (n == null ? void 0 : n.font_weight) || (Tt(e.kind) ? 600 : 400),
    textAlign: (n == null ? void 0 : n.text_align) || (Tt(e.kind) ? "center" : "justify"),
    padding: y,
    exact: !!a
  };
}
function ji({ item: e, pageScale: t }) {
  const n = z(null), r = Y(
    () => Fi(e.translatedText),
    [e.translatedText]
  ), [a, o] = L(r.fallbackHtml), i = Y(
    () => Oi(e, t),
    [e, t]
  );
  O(() => {
    let u = !0;
    return o(r.fallbackHtml), r.hasMath && r.richHtml.then((f) => {
      u && o(f);
    }), () => {
      u = !1;
    };
  }, [r]), Ae(() => {
    const u = n.current;
    if (!u) return;
    const [f, p, h, y] = i.padding, S = Math.max(1, e.rect.width - y - p), g = Math.max(1, e.rect.height - f - h);
    let v = i.minFontSizePx, x = i.maxFontSizePx, w = Math.min(i.fontSizePx, x);
    const m = (T) => (u.style.fontSize = `${T}px`, u.scrollWidth <= S + 0.5 && u.scrollHeight <= g + 0.5);
    if (m(w)) {
      if (!i.exact) {
        v = w;
        for (let T = 0; T < 6; T += 1) {
          const R = (v + x) / 2;
          m(R) ? (w = R, v = R) : x = R;
        }
      }
    } else {
      x = w, w = v;
      for (let T = 0; T < 8; T += 1) {
        const R = (v + x) / 2;
        m(R) ? (w = R, v = R) : x = R;
      }
    }
    u.style.fontSize = `${Math.max(i.minFontSizePx, w).toFixed(2)}px`;
  }, [a, e.rect.height, e.rect.width, i]);
  const [s, c, l, d] = i.padding;
  return /* @__PURE__ */ b(
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
      children: /* @__PURE__ */ b(
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
function Ui({
  layoutPage: e,
  pageState: t,
  width: n,
  height: r
}) {
  const a = Y(
    () => Di(e, t, n, r),
    [r, e, t, n]
  );
  return a.length ? /* @__PURE__ */ b(
    "div",
    {
      className: "reader-live-translation-overlay",
      "data-live-translation-page": e == null ? void 0 : e.page_idx,
      "data-live-translation-generation": t == null ? void 0 : t.generation,
      "aria-hidden": "true",
      children: a.map((o) => /* @__PURE__ */ b(
        ji,
        {
          item: o,
          pageScale: e != null && e.width ? n / e.width : 1
        },
        `${o.itemId}:${o.changedAtSeq}`
      ))
    }
  ) : null;
}
const Bi = qt(Ui), Pr = 1.414, Wi = "120% 0px", vt = /* @__PURE__ */ new Map();
function Hi(e, t, n) {
  let r = vt.get(e);
  if (!r) {
    const a = /* @__PURE__ */ new Map();
    r = { observer: new IntersectionObserver(
      (i) => {
        for (const s of i) {
          const c = a.get(s.target);
          c && c(s.isIntersecting);
        }
      },
      { root: e, rootMargin: Wi, threshold: 0 }
    ), elements: a }, vt.set(e, r);
  }
  return r.elements.set(n, t), r.observer.observe(n), r;
}
function Ji(e, t) {
  const n = vt.get(e);
  n && (n.observer.unobserve(t), n.elements.delete(t), n.elements.size === 0 && (n.observer.disconnect(), vt.delete(e)));
}
function qi({
  pageNumber: e,
  width: t,
  devicePixelRatio: n,
  scrollRoot: r,
  pane: a,
  syncedMinHeight: o = 0,
  onMetrics: i,
  cachedAspect: s,
  onAspectChange: c,
  sentinelRef: l,
  regionHighlight: d = null,
  regionTargets: u = [],
  onSelectRegion: f,
  liveTranslationLayout: p,
  liveTranslationPage: h,
  showLiveTranslation: y = a === "source"
}) {
  const S = z(null), [g, v] = L(!1), [x, w] = L(s ?? Pr);
  O(() => {
    s != null && Math.abs(s - x) >= 1e-3 && w(s);
  }, [s]);
  const m = z(l);
  m.current = l;
  const T = z((F) => {
    var U;
    S.current = F, (U = m.current) == null || U.call(m, F);
  }).current;
  O(() => {
    const F = S.current;
    if (!F) return;
    if (typeof IntersectionObserver > "u") {
      v(!0);
      return;
    }
    let U = null;
    return Hi(r, (W) => {
      W ? (U && (clearTimeout(U), U = null), v(!0)) : (U && clearTimeout(U), U = setTimeout(() => {
        v(!1);
      }, 120));
    }, F), () => {
      U && clearTimeout(U), Ji(r, F);
    };
  }, [r, e]);
  const R = Math.max(120, Math.floor(t * x)), N = Math.max(R, Math.ceil(o || 0)), M = St(d, t, R), E = Y(
    () => Li(u, t, R),
    [R, u, t]
  ), [P, I] = L(null), k = Y(
    () => E.find((F) => F.itemId === P) || null,
    [P, E]
  ), _ = (F) => {
    if (F.buttons !== 0) {
      I(null);
      return;
    }
    const U = F.currentTarget.getBoundingClientRect(), B = zn(
      E,
      F.clientX - U.left,
      F.clientY - U.top
    ), W = (B == null ? void 0 : B.itemId) || null;
    I((Z) => Z === W ? Z : W);
  }, $ = (F) => {
    var W, Z, G;
    if (!f || (Z = (W = F.target) == null ? void 0 : W.closest) != null && Z.call(W, ".reader-structure-selection-target") || `${((G = window.getSelection()) == null ? void 0 : G.toString()) || ""}`.trim()) return;
    const U = F.currentTarget.getBoundingClientRect(), B = zn(
      E,
      F.clientX - U.left,
      F.clientY - U.top
    );
    B && f({
      selectionType: "region",
      region: B.highlight.region,
      kind: "text",
      page: B.highlight.box.page,
      pane: a === "translated" ? "translated" : "source",
      rect: {
        left: U.left + B.rect.left,
        top: U.top + B.rect.top,
        width: B.rect.width,
        height: B.rect.height
      }
    });
  }, H = (F) => {
    w((U) => {
      if (Math.abs(U - F) < 1e-3) return U;
      const B = () => c == null ? void 0 : c(e, F);
      return typeof queueMicrotask < "u" ? queueMicrotask(B) : setTimeout(B, 0), F;
    });
  };
  return /* @__PURE__ */ D(
    "div",
    {
      ref: T,
      "data-reader-page": e,
      "data-reader-pane": a,
      "data-natural-height": R,
      className: tn,
      onPointerMoveCapture: _,
      onClick: $,
      onPointerLeave: () => I(null),
      style: {
        width: t,
        height: N,
        minHeight: N
      },
      children: [
        g ? /* @__PURE__ */ b(
          Ro,
          {
            pageNumber: e,
            width: t,
            devicePixelRatio: n,
            renderTextLayer: !0,
            renderAnnotationLayer: !1,
            className: "reader-react-pdf-page",
            loading: /* @__PURE__ */ b(
              "div",
              {
                className: "reader-react-pdf-page-placeholder",
                style: { width: t, height: R }
              }
            ),
            onLoadSuccess: (F) => {
              try {
                const U = F.getViewport({ scale: 1 });
                if (U.width > 0) {
                  const B = U.height / U.width;
                  H(B);
                }
              } catch {
              }
              i == null || i();
            },
            onRenderSuccess: () => {
              i == null || i();
            }
          }
        ) : /* @__PURE__ */ b(
          "div",
          {
            className: "reader-react-pdf-page-placeholder",
            style: { width: t, height: R },
            "aria-hidden": !0
          }
        ),
        M ? /* @__PURE__ */ b(
          "div",
          {
            className: "reader-react-pdf-region-highlight",
            "data-reader-region-id": d == null ? void 0 : d.itemId,
            style: M,
            "aria-hidden": "true"
          }
        ) : null,
        g && y ? /* @__PURE__ */ b(
          Bi,
          {
            layoutPage: p,
            pageState: h,
            width: t,
            height: R
          }
        ) : null,
        /* @__PURE__ */ b(Ci, { target: g ? k : null }),
        /* @__PURE__ */ b(
          Ai,
          {
            pane: a === "translated" ? "translated" : "source",
            width: t,
            height: R,
            regions: u,
            onSelect: f
          }
        )
      ]
    }
  );
}
const Ki = qt(qi), Et = 5;
let _n = 1;
const $n = /* @__PURE__ */ new WeakMap();
function Vi(e) {
  if (!e) return 0;
  const t = $n.get(e);
  if (t) return t;
  const n = _n;
  return _n += 1, $n.set(e, n), n;
}
function Yi() {
  const e = typeof window < "u" && window.devicePixelRatio || 1;
  return Math.max(1, Math.min(e, 2));
}
const Gi = Gr(
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
    activeRegion: h = null,
    regions: y = [],
    readerMetadata: S = null,
    onSelectRegion: g,
    liveTranslation: v,
    showLiveTranslation: x = t === "source",
    liveTranslationPendingLabel: w = ""
  }, m) {
    Ni();
    const { file: T, loading: R, error: N } = ha(n, r), M = `${n}\0${Vi(T)}`, E = z(M);
    E.current = M;
    const P = Y(
      () => fa(T),
      [T, n]
    ), [I, k] = L(0), [_, $] = L(""), [H, F] = L(null), [U, B] = L(480), W = z(null), Z = z(0), G = Y(() => Yi(), []), re = Y(() => ({
      cMapUrl: Ct("cmaps/"),
      cMapPacked: !0,
      standardFontDataUrl: Ct("standard_fonts/")
    }), []);
    Kt(m, () => H, [H]), O(() => {
      const j = (K) => {
        !Number.isFinite(K) || K < 80 || Math.abs(K - Z.current) < 8 || (Z.current = K, B(K));
      }, Q = c && c >= 80 ? c : (s == null ? void 0 : s.clientWidth) || 0;
      if (j(Q), !s || typeof ResizeObserver > "u" || c && c >= 80) return;
      const X = new ResizeObserver((K) => {
        var ge, at;
        const ae = ((at = (ge = K[0]) == null ? void 0 : ge.contentRect) == null ? void 0 : at.width) ?? s.clientWidth;
        !Number.isFinite(ae) || ae < 80 || (W.current && clearTimeout(W.current), W.current = setTimeout(() => j(ae), 80));
      });
      return X.observe(s), () => {
        X.disconnect(), W.current && clearTimeout(W.current);
      };
    }, [c, s, o]);
    const A = Y(
      () => Pa(U, a),
      [U, a]
    ), [ee, te] = L(() => /* @__PURE__ */ new Map()), [ce, le] = L(() => /* @__PURE__ */ new Set()), q = z(/* @__PURE__ */ new Map()), J = z(null), ne = C((j, Q) => {
      te((X) => {
        if (X.get(j) === Q) return X;
        const K = new Map(X);
        return K.set(j, Q), K;
      });
    }, []), he = C((j, Q) => {
      const X = q.current, K = X.get(j);
      if (K && J.current)
        try {
          J.current.unobserve(K);
        } catch {
        }
      if (Q) {
        if (X.set(j, Q), J.current)
          try {
            J.current.observe(Q);
          } catch {
          }
      } else
        X.delete(j);
    }, []);
    O(() => {
      if (!s || typeof IntersectionObserver > "u") return;
      const j = new IntersectionObserver(
        (Q) => {
          le((X) => {
            const K = new Set(X);
            let ae = !1;
            for (const ge of Q) {
              const at = ge.target, Ke = Number(at.getAttribute("data-reader-page"));
              Number.isFinite(Ke) && (ge.isIntersecting ? K.has(Ke) || (K.add(Ke), ae = !0) : K.has(Ke) && (K.delete(Ke), ae = !0));
            }
            return ae ? K : X;
          });
        },
        { root: s, rootMargin: "0px", threshold: 0 }
      );
      J.current = j;
      for (const Q of q.current.values())
        try {
          j.observe(Q);
        } catch {
        }
      return () => {
        j.disconnect(), J.current === j && (J.current = null);
      };
    }, [s]), Ae(() => {
      k(0), $(""), le(/* @__PURE__ */ new Set()), te(/* @__PURE__ */ new Map()), q.current.clear(), p == null || p(0, t);
    }, [M, p, t]);
    const fe = C(
      ({ numPages: j }) => {
        E.current === M && (k(j), $(""), p == null || p(j, t), u == null || u({ numPages: j, pane: t }));
      },
      [M, u, p, t]
    ), We = C(
      (j) => {
        if (E.current !== M) return;
        const Q = (j == null ? void 0 : j.message) || "PDF 解析失败";
        $(Q), k(0), p == null || p(0, t), f == null || f(j, t);
      },
      [M, f, p, t]
    ), He = Y(
      () => I > 0 ? Array.from({ length: I }, (j, Q) => Q + 1) : [],
      [I]
    ), Me = Y(
      () => Pn(h, S, t),
      [h, S, t]
    ), Je = Y(() => {
      const j = /* @__PURE__ */ new Map();
      for (const Q of y) {
        const X = Pn(Q, S, t);
        if (!X) continue;
        const K = j.get(X.box.page) || [];
        K.push(X), j.set(X.box.page, K);
      }
      return j;
    }, [t, S, y]), qe = Y(() => {
      if (I === 0) return /* @__PURE__ */ new Set();
      if (!(!!s && typeof IntersectionObserver < "u" && o)) return new Set(He);
      if (ce.size === 0) {
        const X = Math.min(I, Et * 2 + 1);
        return new Set(Array.from({ length: X }, (K, ae) => ae + 1));
      }
      const Q = /* @__PURE__ */ new Set();
      for (const X of ce)
        for (let K = -Et; K <= Et; K++) {
          const ae = X + K;
          ae >= 1 && ae <= I && Q.add(ae);
        }
      return Q;
    }, [I, He, s, o, ce]), ze = !n || !!N || !!_, Yr = n && (N || _) || i;
    return /* @__PURE__ */ D(
      "section",
      {
        ref: F,
        className: `reader-panel reader-react-pdf-pane${o ? "" : " is-hidden"}`,
        "data-reader-pane": t,
        "data-reader-engine": "react-pdf",
        "data-reader-visible": o ? "true" : "false",
        "data-live-translation-status": (v == null ? void 0 : v.jobStatus) || void 0,
        "aria-hidden": o ? void 0 : !0,
        "aria-label": t === "source" ? "原文 PDF" : "译文 PDF",
        children: [
          w ? /* @__PURE__ */ D("div", { className: "reader-live-translation-waiting", role: "status", children: [
            /* @__PURE__ */ b("span", { className: "reader-live-translation-waiting-dot", "aria-hidden": "true" }),
            /* @__PURE__ */ b("span", { children: w })
          ] }) : null,
          ze && !R ? /* @__PURE__ */ b("div", { className: "reader-empty reader-react-pdf-empty", "data-reader-pdf-empty": t, children: Yr }) : null,
          R ? /* @__PURE__ */ b("div", { className: "reader-empty reader-react-pdf-loading", "data-reader-pdf-loading": t, children: "正在加载 PDF…" }) : null,
          P && !N ? /* @__PURE__ */ b("div", { className: "reader-viewer-wrap reader-react-pdf-wrap", children: /* @__PURE__ */ b(
            Mo,
            {
              file: P,
              loading: null,
              error: null,
              options: re,
              onLoadSuccess: fe,
              onLoadError: We,
              className: "reader-react-pdf-document",
              children: He.map((j) => {
                if (qe.has(j))
                  return /* @__PURE__ */ b(
                    Ki,
                    {
                      pane: t,
                      pageNumber: j,
                      width: A,
                      devicePixelRatio: G,
                      scrollRoot: s,
                      syncedMinHeight: (l == null ? void 0 : l.get(j)) || 0,
                      onMetrics: d,
                      cachedAspect: ee.get(j),
                      onAspectChange: ne,
                      sentinelRef: (ge) => he(j, ge),
                      regionHighlight: (Me == null ? void 0 : Me.box.page) === j ? Me : null,
                      regionTargets: Je.get(j),
                      onSelectRegion: g,
                      liveTranslationLayout: v == null ? void 0 : v.layoutByPage.get(j - 1),
                      liveTranslationPage: v == null ? void 0 : v.pagesByPage.get(j - 1),
                      showLiveTranslation: x
                    },
                    `${t}-${j}`
                  );
                const X = ee.get(j) ?? Pr, K = Math.max(120, Math.floor(A * X)), ae = Math.max(K, Math.ceil((l == null ? void 0 : l.get(j)) || 0));
                return /* @__PURE__ */ b(
                  "div",
                  {
                    ref: (ge) => he(j, ge),
                    "data-reader-page": j,
                    "data-reader-pane": t,
                    "data-natural-height": K,
                    className: tn,
                    style: {
                      width: A,
                      height: ae,
                      minHeight: ae
                    },
                    children: /* @__PURE__ */ b(
                      "div",
                      {
                        className: "reader-react-pdf-page-placeholder",
                        style: { width: A, height: K },
                        "aria-hidden": !0
                      }
                    )
                  },
                  `${t}-${j}`
                );
              })
            },
            M
          ) }) : null
        ]
      }
    );
  }
), Fn = qt(Gi);
function Xi({
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
function Zi(e, t, n = e * 2) {
  return t ? Math.min(e * 2, n) : e;
}
function Qi(e) {
  return e ? e.connection === "terminal" && e.jobStatus === "failed" ? e.pagesByPage.size > 0 ? `翻译已暂停，已保留 ${e.pagesByPage.size} 页译文` : "翻译已暂停，原始 PDF 仍可阅读" : e.connection === "terminal" && ["cancelled", "canceled"].includes(e.jobStatus) ? e.pagesByPage.size > 0 ? `翻译已取消，已保留 ${e.pagesByPage.size} 页译文` : "翻译已取消，原始 PDF 仍可阅读" : e.pagesByPage.size > 0 ? "" : e.connection === "unavailable" ? e.error || "实时译文暂不可用，原始 PDF 仍可阅读" : e.error ? e.error : e.layoutByPage.size === 0 ? "正在完成 OCR，译文将在这里逐页出现" : "版面已就绪，正在等待首个译文页面" : "";
}
function es(e) {
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
    translatedUrl: h,
    sourceFile: y,
    translatedFile: S,
    onMetrics: g,
    onNumPagesChange: v,
    activeRegion: x,
    regions: w = [],
    readerMetadata: m,
    onSelectRegion: T,
    markdownSplit: R = !1,
    assistantSplit: N = !1,
    reversePanes: M = !1,
    liveTranslation: E,
    liveTranslationPair: P = !1
  } = e, I = Xi({
    mode: t,
    compareMode: o,
    showSource: d,
    showTranslated: u,
    markdownSplit: R,
    liveTranslationPair: P
  }), k = Zi(
    i,
    R || N,
    typeof document > "u" ? i * 2 : document.documentElement.clientWidth
  );
  return /* @__PURE__ */ b(
    "div",
    {
      ref: n,
      id: Na,
      className: ka,
      "data-reader-scroll-shell": "true",
      "data-reader-region-count": w.length,
      "data-reader-structured-region-count": w.filter(pr).length,
      "data-reader-metadata-ready": m ? "true" : "false",
      children: /* @__PURE__ */ D(
        "main",
        {
          className: `reader-react-grid reader-mode-${I.mode}${M ? " is-reversed" : ""}`,
          "data-reader-mode": R ? "markdown-split" : N ? "assistant-split" : t,
          children: [
            c ? /* @__PURE__ */ b(
              Fn,
              {
                pane: "source",
                url: p,
                preloadedFile: y,
                userZoom: a,
                visible: I.showSource,
                scrollRoot: r,
                pageWidthOverride: k,
                rowHeights: I.compareMode ? s : void 0,
                onMetrics: g,
                emptyLabel: f ? "源文件不可用：该文档没有可读取的源 PDF。" : "暂无原文 PDF",
                onNumPagesChange: v,
                activeRegion: x,
                regions: w,
                readerMetadata: m,
                onSelectRegion: T,
                liveTranslation: P ? void 0 : E,
                showLiveTranslation: !P
              }
            ) : null,
            l || P ? /* @__PURE__ */ b(
              Fn,
              {
                pane: "translated",
                url: P ? p : h,
                preloadedFile: P ? y : S,
                userZoom: a,
                visible: I.showTranslated,
                scrollRoot: r,
                pageWidthOverride: k,
                rowHeights: I.compareMode ? s : void 0,
                onMetrics: g,
                emptyLabel: "暂无译文 PDF",
                onNumPagesChange: v,
                activeRegion: x,
                regions: w,
                readerMetadata: m,
                onSelectRegion: T,
                liveTranslation: P ? E : void 0,
                showLiveTranslation: P,
                liveTranslationPendingLabel: P ? Qi(E) : ""
              }
            ) : null
          ]
        }
      )
    }
  );
}
const ts = [
  { id: "source", label: "源文件", Icon: sr },
  { id: "compare", label: "对照", Icon: cr },
  { id: "translated", label: "翻译文件", Icon: lr }
];
function ns(e) {
  return e.connection === "live" ? `实时译文 · ${e.pagesByPage.size} 页` : e.connection === "reconnecting" ? "实时译文 · 重连中" : e.connection === "unavailable" ? "实时译文 · 不可用" : e.connection === "terminal" ? e.jobStatus === "failed" ? "实时译文 · 已暂停" : e.jobStatus === "cancelled" || e.jobStatus === "canceled" ? "实时译文 · 已取消" : e.jobStatus === "succeeded" ? "实时译文 · 已完成" : "实时译文 · 已结束" : e.error || "实时译文 · 连接中";
}
function rs(e) {
  return e.id === "translated" ? e.sourceOnly : e.id === "compare" ? !e.documentReady || e.sourceOnly && !e.liveTranslationAvailable : !1;
}
function os({
  mode: e,
  documentReady: t,
  sourceOnly: n = !1,
  onModeChange: r,
  liveTranslation: a = null
}) {
  const o = a ? ns(a.state) : "";
  return /* @__PURE__ */ D("header", { className: "reader-workspace-bar", children: [
    a ? /* @__PURE__ */ D(
      "button",
      {
        type: "button",
        className: `reader-live-translation-toggle is-${a.state.connection}${a.visible ? " is-active" : ""}`,
        "aria-pressed": a.visible,
        "aria-label": a.visible ? "隐藏实时译文" : "显示实时译文",
        title: a.state.error || o,
        onClick: a.onToggle,
        children: [
          /* @__PURE__ */ b(to, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 }),
          /* @__PURE__ */ b("span", { className: "reader-live-translation-toggle-label", children: o })
        ]
      }
    ) : null,
    /* @__PURE__ */ b("div", { className: "reader-workspace-tabs", role: "tablist", "aria-label": "阅读工作区", children: ts.map(({ id: i, label: s, Icon: c }) => {
      const l = e === i, d = rs({
        id: i,
        documentReady: t,
        sourceOnly: n,
        liveTranslationAvailable: !!a
      });
      return /* @__PURE__ */ D(
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
            /* @__PURE__ */ b(c, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
            /* @__PURE__ */ b("span", { className: "reader-workspace-tab-label", children: s })
          ]
        },
        i
      );
    }) })
  ] });
}
const On = [
  { id: "markdown", label: "Markdown", Icon: ur },
  { id: "ai", label: "AI 问答", Icon: Gt }
];
function as({
  active: e,
  onSelect: t,
  onClose: n
}) {
  return e ? /* @__PURE__ */ D("header", { className: "reader-assistant-dock-header", children: [
    /* @__PURE__ */ b("div", { className: "reader-assistant-dock-tabs", role: "tablist", "aria-label": "阅读辅助面板", children: On.map(({ id: r, label: a, Icon: o }) => {
      const i = e === r;
      return /* @__PURE__ */ D(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": i,
          className: `reader-assistant-dock-tab${i ? " is-active" : ""}`,
          onClick: () => t(r),
          children: [
            /* @__PURE__ */ b(o, { size: 15, strokeWidth: 2.15, "aria-hidden": !0 }),
            /* @__PURE__ */ b("span", { children: a })
          ]
        },
        r
      );
    }) }),
    /* @__PURE__ */ b(
      "button",
      {
        type: "button",
        className: "reader-assistant-dock-close",
        "aria-label": "关闭阅读辅助面板",
        title: "关闭辅助面板",
        onClick: n,
        children: /* @__PURE__ */ b(Ue, { size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
      }
    )
  ] }) : /* @__PURE__ */ b("nav", { className: "reader-assistant-rail", "aria-label": "阅读辅助工具", children: On.map(({ id: r, label: a, Icon: o }) => /* @__PURE__ */ D(
    "button",
    {
      type: "button",
      className: "reader-assistant-rail-button",
      "aria-label": `打开${a}`,
      title: a,
      onClick: () => t(r),
      children: [
        /* @__PURE__ */ b(o, { size: 18, strokeWidth: 2, "aria-hidden": !0 }),
        /* @__PURE__ */ b("span", { children: a === "AI 问答" ? "AI" : "MD" })
      ]
    },
    r
  )) });
}
function is(e, t) {
  const n = getComputedStyle(e), r = parseFloat(n.fontSize);
  return t * r;
}
function ss(e, t) {
  const n = getComputedStyle(e.ownerDocument.documentElement), r = parseFloat(n.fontSize);
  return t * r;
}
function cs(e) {
  return e / 100 * window.innerHeight;
}
function ls(e) {
  return e / 100 * window.innerWidth;
}
function us(e) {
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
  const [a, o] = us(n);
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
      r = ss(t, a);
      break;
    }
    case "em": {
      r = is(t, a);
      break;
    }
    case "vh": {
      r = cs(a);
      break;
    }
    case "vw": {
      r = ls(a);
      break;
    }
  }
  return r;
}
function se(e) {
  return parseFloat(e.toFixed(3));
}
function Be({
  group: e
}) {
  const { orientation: t, panels: n } = e;
  return n.reduce((r, a) => (r += t === "horizontal" ? a.element.offsetWidth : a.element.offsetHeight, r), 0);
}
function Ut(e) {
  const { panels: t } = e, n = Be({ group: e });
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
      i = se(d / n * 100);
    }
    let s;
    if (o.defaultSize !== void 0) {
      const d = Ge({
        groupSize: n,
        panelElement: a,
        styleProp: o.defaultSize
      });
      s = se(d / n * 100);
    }
    let c = 0;
    if (o.minSize !== void 0) {
      const d = Ge({
        groupSize: n,
        panelElement: a,
        styleProp: o.minSize
      });
      c = se(d / n * 100);
    }
    let l = 100;
    if (o.maxSize !== void 0) {
      const d = Ge({
        groupSize: n,
        panelElement: a,
        styleProp: o.maxSize
      });
      l = se(d / n * 100);
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
function V(e, t = "Assertion error") {
  if (!e)
    throw Error(t);
}
function Bt(e, t) {
  return Array.from(t).sort(
    e === "horizontal" ? ds : fs
  );
}
function ds(e, t) {
  const n = e.element.offsetLeft - t.element.offsetLeft;
  return n !== 0 ? n : e.element.offsetWidth - t.element.offsetWidth;
}
function fs(e, t) {
  const n = e.element.offsetTop - t.element.offsetTop;
  return n !== 0 ? n : e.element.offsetHeight - t.element.offsetHeight;
}
function Tr(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.ELEMENT_NODE;
}
function Er(e, t) {
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
function ps({
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
    const { x: s, y: c } = Er(r, i), l = e === "horizontal" ? s : c;
    l < o && (o = l, a = i);
  }
  return V(a, "No rect found"), a;
}
let st;
function ms() {
  return st === void 0 && (typeof matchMedia == "function" ? st = !!matchMedia("(pointer:coarse)").matches : st = !1), st;
}
function Nr(e) {
  const { element: t, orientation: n, panels: r, separators: a } = e, o = Bt(
    n,
    Array.from(t.children).filter(Tr).map((h) => ({ element: h }))
  ).map(({ element: h }) => h), i = [];
  let s = !1, c = !1, l = -1, d = -1, u = 0, f, p = [];
  {
    let h = -1;
    for (const y of o)
      y.hasAttribute("data-panel") && (h++, y.hasAttribute("data-disabled") || (u++, l === -1 && (l = h), d = h));
  }
  if (u > 1) {
    let h = -1;
    for (const y of o)
      if (y.hasAttribute("data-panel")) {
        h++;
        const S = r.find(
          (g) => g.element === y
        );
        if (S) {
          if (f) {
            const g = f.element.getBoundingClientRect(), v = y.getBoundingClientRect();
            let x;
            if (c) {
              const w = n === "horizontal" ? new DOMRect(
                g.right,
                g.top,
                0,
                g.height
              ) : new DOMRect(
                g.left,
                g.bottom,
                g.width,
                0
              ), m = n === "horizontal" ? new DOMRect(v.left, v.top, 0, v.height) : new DOMRect(v.left, v.top, v.width, 0);
              switch (p.length) {
                case 0: {
                  x = [
                    w,
                    m
                  ];
                  break;
                }
                case 1: {
                  const T = p[0], R = ps({
                    orientation: n,
                    rects: [g, v],
                    targetRect: T.element.getBoundingClientRect()
                  });
                  x = [
                    T,
                    R === g ? m : w
                  ];
                  break;
                }
                default: {
                  x = p;
                  break;
                }
              }
            } else
              p.length ? x = p : x = [
                n === "horizontal" ? new DOMRect(
                  g.right,
                  v.top,
                  v.left - g.right,
                  v.height
                ) : new DOMRect(
                  v.left,
                  g.bottom,
                  v.width,
                  v.top - g.bottom
                )
              ];
            for (const w of x) {
              let m = "width" in w ? w : w.element.getBoundingClientRect();
              const T = ms() ? e.resizeTargetMinimumSize.coarse : e.resizeTargetMinimumSize.fine;
              if (m.width < T) {
                const N = T - m.width;
                m = new DOMRect(
                  m.x - N / 2,
                  m.y,
                  m.width + N,
                  m.height
                );
              }
              if (m.height < T) {
                const N = T - m.height;
                m = new DOMRect(
                  m.x,
                  m.y - N / 2,
                  m.width,
                  m.height + N
                );
              }
              const R = h <= l || h > d;
              !s && !R && i.push({
                group: e,
                groupSize: Be({ group: e }),
                panels: [f, S],
                separator: "width" in w ? void 0 : w,
                rect: m
              }), s = !1;
            }
          }
          c = !1, f = S, p = [];
        }
      } else if (y.hasAttribute("data-separator")) {
        y.ariaDisabled !== null && (s = !0);
        const S = a.find(
          (g) => g.element === y
        );
        S ? p.push(S) : (f = void 0, p = []);
      } else
        c = !0;
  }
  return i;
}
var Ie;
class kr {
  constructor() {
    yn(this, Ie, {});
  }
  addListener(t, n) {
    const r = Ve(this, Ie)[t];
    return r === void 0 ? Ve(this, Ie)[t] = [n] : r.includes(n) || r.push(n), () => {
      this.removeListener(t, n);
    };
  }
  emit(t, n) {
    const r = Ve(this, Ie)[t];
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
    vn(this, Ie, {});
  }
  removeListener(t, n) {
    const r = Ve(this, Ie)[t];
    if (r !== void 0) {
      const a = r.indexOf(n);
      a >= 0 && r.splice(a, 1);
    }
  }
}
Ie = new WeakMap();
let Oe = {
  cursorFlags: 0,
  state: "inactive"
};
const an = new kr();
function Ee() {
  return Oe;
}
function hs(e) {
  return an.addListener("change", e);
}
function gs(e) {
  const t = Oe, n = { ...Oe };
  n.cursorFlags = e, Oe = n, an.emit("change", {
    prev: t,
    next: n
  });
}
function je(e) {
  const t = Oe;
  Oe = e, an.emit("change", {
    prev: t,
    next: e
  });
}
const bs = (e) => e, Nt = () => {
}, Ar = 1, Lr = 2, Cr = 4, zr = 8, jn = 3, Un = 12;
let ct;
function Bn() {
  return ct === void 0 && (ct = !1, typeof window < "u" && (window.navigator.userAgent.includes("Chrome") || window.navigator.userAgent.includes("Firefox")) && (ct = !0)), ct;
}
function ys({
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
        if (e && Bn()) {
          const o = (e & Ar) !== 0, i = (e & Lr) !== 0, s = (e & Cr) !== 0, c = (e & zr) !== 0;
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
    return Bn() ? r > 0 && a > 0 ? "move" : r > 0 ? "ew-resize" : "ns-resize" : r > 0 && a > 0 ? "grab" : r > 0 ? "col-resize" : "row-resize";
  }
}
const Wn = /* @__PURE__ */ new WeakMap();
function sn(e) {
  if (e.defaultView === null || e.defaultView === void 0)
    return;
  let { prevStyle: t, styleSheet: n } = Wn.get(e) ?? {};
  n === void 0 && (n = new e.defaultView.CSSStyleSheet(), e.adoptedStyleSheets && (Object.isExtensible(e.adoptedStyleSheets) ? e.adoptedStyleSheets.push(n) : e.adoptedStyleSheets = [
    ...e.adoptedStyleSheets,
    n
  ]));
  const r = Ee();
  switch (r.state) {
    case "active":
    case "hover": {
      const a = ys({
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
  Wn.set(e, {
    prevStyle: t,
    styleSheet: n
  });
}
let me = /* @__PURE__ */ new Map();
const Dr = new kr();
function vs(e) {
  me = new Map(me), me.delete(e);
}
function Hn(e, t) {
  for (const [n] of me)
    if (n.id === e)
      return n;
}
function Re(e, t) {
  for (const [n, r] of me)
    if (n.id === e)
      return r;
  if (t)
    throw Error(`Could not find data for Group with id ${e}`);
}
function Le() {
  return me;
}
function cn(e, t) {
  return Dr.addListener("groupChange", (n) => {
    n.group.id === e && t(n);
  });
}
function we(e, t, n) {
  const r = me.get(e);
  me = new Map(me), me.set(e, t), Dr.emit("groupChange", {
    group: e,
    isUserInteraction: (n == null ? void 0 : n.isUserInteraction) === !0,
    prev: r,
    next: t
  });
}
function _r(e) {
  const t = Ee();
  let n = !1;
  switch (t.state) {
    case "active":
      je({
        cursorFlags: 0,
        state: "inactive"
      }), t.hitRegions.length > 0 && (sn(e), n = !0, t.hitRegions.forEach((r) => {
        const a = Re(r.group.id, !0);
        we(r.group, a, {
          isUserInteraction: !0
        });
      }));
  }
  return n;
}
function Jn(e) {
  e.defaultPrevented || _r(e.currentTarget);
}
function ws(e, t, n) {
  let r, a = {
    x: 1 / 0,
    y: 1 / 0
  };
  for (const o of t) {
    const i = Er(n, o.rect);
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
function Ss(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
function Is(e, t) {
  if (e === t) throw new Error("Cannot compare node with itself");
  const n = {
    a: Vn(e),
    b: Vn(t)
  };
  let r;
  for (; n.a.at(-1) === n.b.at(-1); )
    r = n.a.pop(), n.b.pop();
  V(
    r,
    "Stacking order can only be calculated for elements with a common ancestor"
  );
  const a = {
    a: Kn(qn(n.a)),
    b: Kn(qn(n.b))
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
const xs = /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;
function Rs(e) {
  const t = getComputedStyle($r(e) ?? e).display;
  return t === "flex" || t === "inline-flex";
}
function Ms(e) {
  const t = getComputedStyle(e);
  return !!(t.position === "fixed" || t.zIndex !== "auto" && (t.position !== "static" || Rs(e)) || +t.opacity < 1 || "transform" in t && t.transform !== "none" || "webkitTransform" in t && t.webkitTransform !== "none" || "mixBlendMode" in t && t.mixBlendMode !== "normal" || "filter" in t && t.filter !== "none" || "webkitFilter" in t && t.webkitFilter !== "none" || "isolation" in t && t.isolation === "isolate" || xs.test(t.willChange) || t.webkitOverflowScrolling === "touch");
}
function qn(e) {
  let t = e.length;
  for (; t--; ) {
    const n = e[t];
    if (V(n, "Missing node"), Ms(n)) return n;
  }
  return null;
}
function Kn(e) {
  return e && Number(getComputedStyle(e).zIndex) || 0;
}
function Vn(e) {
  const t = [];
  for (; e; )
    t.push(e), e = $r(e);
  return t;
}
function $r(e) {
  const { parentNode: t } = e;
  return Ss(t) ? t.host : t;
}
function Ps(e, t) {
  return e.x < t.x + t.width && e.x + e.width > t.x && e.y < t.y + t.height && e.y + e.height > t.y;
}
function Ts({
  groupElement: e,
  hitRegion: t,
  pointerEventTarget: n
}) {
  if (!Tr(n) || n.contains(e) || e.contains(n))
    return !0;
  if (Is(n, e) > 0) {
    let r = n;
    for (; r; ) {
      if (r.contains(e))
        return !0;
      if (Ps(r.getBoundingClientRect(), t))
        return !1;
      r = r.parentElement;
    }
  }
  return !0;
}
function ln(e, t) {
  const n = [];
  return t.forEach((r, a) => {
    if (a.disabled)
      return;
    const o = Nr(a), i = ws(a.orientation, o, {
      x: e.clientX,
      y: e.clientY
    });
    i && i.distance.x <= 0 && i.distance.y <= 0 && Ts({
      groupElement: a.element,
      hitRegion: i.hitRegion.rect,
      pointerEventTarget: e.target
    }) && n.push(i.hitRegion);
  }), n;
}
function Es(e, t) {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n++)
    if (e[n] != t[n])
      return !1;
  return !0;
}
function ie(e, t, n = 0) {
  return Math.abs(se(e) - se(t)) <= n;
}
function pe(e, t) {
  return ie(e, t) ? 0 : e > t ? 1 : -1;
}
function $e({
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
  if (pe(r, c) < 0)
    if (o) {
      const l = (a + c) / 2;
      pe(r, l) < 0 ? r = a : r = c;
    } else
      r = c;
  return r = Math.min(s, r), r = se(r), r;
}
function rt({
  delta: e,
  initialLayout: t,
  panelConstraints: n,
  pivotIndices: r,
  prevLayout: a,
  trigger: o
}) {
  if (ie(e, 0))
    return t;
  const i = o === "imperative-api", s = Object.values(t), c = Object.values(a), l = [...s], [d, u] = r;
  V(d != null, "Invalid first pivot index"), V(u != null, "Invalid second pivot index");
  let f = 0;
  switch (o) {
    case "keyboard": {
      {
        const y = e < 0 ? u : d, S = n[y];
        V(
          S,
          `Panel constraints not found for index ${y}`
        );
        const {
          collapsedSize: g = 0,
          collapsible: v,
          minSize: x = 0
        } = S;
        if (v) {
          const w = s[y];
          if (V(
            w != null,
            `Previous layout not found for panel index ${y}`
          ), ie(w, g)) {
            const m = x - w;
            pe(m, Math.abs(e)) > 0 && (e = e < 0 ? 0 - m : m);
          }
        }
      }
      {
        const y = e < 0 ? d : u, S = n[y];
        V(
          S,
          `No panel constraints found for index ${y}`
        );
        const {
          collapsedSize: g = 0,
          collapsible: v,
          minSize: x = 0
        } = S;
        if (v) {
          const w = s[y];
          if (V(
            w != null,
            `Previous layout not found for panel index ${y}`
          ), ie(w, x)) {
            const m = w - g;
            pe(m, Math.abs(e)) > 0 && (e = e < 0 ? 0 - m : m);
          }
        }
      }
      break;
    }
    default: {
      const y = e < 0 ? u : d, S = n[y];
      V(
        S,
        `Panel constraints not found for index ${y}`
      );
      const g = s[y], { collapsible: v, collapsedSize: x, minSize: w } = S;
      if (v && pe(g, w) < 0)
        if (e > 0) {
          const m = w - x, T = m / 2, R = g + e;
          pe(R, w) < 0 && (e = pe(e, T) <= 0 ? 0 : m);
        } else {
          const m = w - x, T = 100 - m / 2, R = g - e;
          pe(R, w) < 0 && (e = pe(100 + e, T) > 0 ? 0 : -m);
        }
      break;
    }
  }
  {
    const y = e < 0 ? 1 : -1;
    let S = e < 0 ? u : d, g = 0;
    for (; ; ) {
      const x = s[S];
      V(
        x != null,
        `Previous layout not found for panel index ${S}`
      );
      const w = $e({
        overrideDisabledPanels: i,
        panelConstraints: n[S],
        prevSize: x,
        size: 100
      }) - x;
      if (g += w, S += y, S < 0 || S >= n.length)
        break;
    }
    const v = Math.min(Math.abs(e), Math.abs(g));
    e = e < 0 ? 0 - v : v;
  }
  {
    let y = e < 0 ? d : u;
    for (; y >= 0 && y < n.length; ) {
      const S = Math.abs(e) - Math.abs(f), g = s[y];
      V(
        g != null,
        `Previous layout not found for panel index ${y}`
      );
      const v = g - S, x = $e({
        overrideDisabledPanels: i,
        panelConstraints: n[y],
        prevSize: g,
        size: v
      });
      if (!ie(g, x) && (f += g - x, l[y] = x, f.toFixed(3).localeCompare(Math.abs(e).toFixed(3), void 0, {
        numeric: !0
      }) >= 0))
        break;
      e < 0 ? y-- : y++;
    }
  }
  if (Es(c, l))
    return a;
  {
    const y = e < 0 ? u : d, S = s[y];
    V(
      S != null,
      `Previous layout not found for panel index ${y}`
    );
    const g = S + f, v = $e({
      overrideDisabledPanels: i,
      panelConstraints: n[y],
      prevSize: S,
      size: g
    });
    if (l[y] = v, !ie(v, g)) {
      let x = g - v, w = e < 0 ? u : d;
      for (; w >= 0 && w < n.length; ) {
        const m = l[w];
        V(
          m != null,
          `Previous layout not found for panel index ${w}`
        );
        const T = m + x, R = $e({
          overrideDisabledPanels: i,
          panelConstraints: n[w],
          prevSize: m,
          size: T
        });
        if (ie(m, R) || (x -= R - m, l[w] = R), ie(x, 0))
          break;
        e > 0 ? w-- : w++;
      }
    }
  }
  const p = Object.values(l).reduce(
    (y, S) => S + y,
    0
  );
  if (!ie(p, 100, 0.1))
    return a;
  const h = Object.keys(a);
  return l.reduce((y, S, g) => (y[h[g]] = S, y), {});
}
function Ne(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (t[n] === void 0 || pe(e[n], t[n]) !== 0)
      return !1;
  return !0;
}
function ke({
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
  if (!ie(a, 100) && r.length > 0)
    for (let s = 0; s < t.length; s++) {
      const c = r[s];
      V(c != null, `No layout data found for index ${s}`);
      const l = 100 / a * c;
      r[s] = l;
    }
  let o = 0;
  for (let s = 0; s < t.length; s++) {
    const c = n[s];
    V(c != null, `No layout data found for index ${s}`);
    const l = r[s];
    V(l != null, `No layout data found for index ${s}`);
    const d = $e({
      overrideDisabledPanels: !0,
      panelConstraints: t[s],
      prevSize: c,
      size: l
    });
    l != d && (o += l - d, r[s] = d);
  }
  if (!ie(o, 0))
    for (let s = 0; s < t.length; s++) {
      const c = r[s];
      V(c != null, `No layout data found for index ${s}`);
      const l = c + o, d = $e({
        overrideDisabledPanels: !0,
        panelConstraints: t[s],
        prevSize: c,
        size: l
      });
      if (c !== d && (o -= d - c, r[s] = d, ie(o, 0)))
        break;
    }
  const i = Object.keys(e);
  return r.reduce((s, c, l) => (s[i[l]] = c, s), {});
}
function Fr({
  groupId: e,
  panelId: t
}) {
  const n = () => {
    const c = Le();
    for (const [
      l,
      {
        defaultLayoutDeferred: d,
        derivedPanelConstraints: u,
        layout: f,
        groupSize: p,
        separatorToPanels: h
      }
    ] of c)
      if (l.id === e)
        return {
          defaultLayoutDeferred: d,
          derivedPanelConstraints: u,
          group: l,
          groupSize: p,
          layout: f,
          separatorToPanels: h
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
    const f = o(), p = l.findIndex((S) => S.id === t), h = p === 0, y = p === l.length - 1;
    if (y && c < f && (h || l.slice(0, p).every((S, g) => {
      const v = u[g];
      return (v == null ? void 0 : v.collapsible) && ie(v.collapsedSize, d[v.panelId]);
    }))) {
      const S = l.slice(0, p).reduce((g, v) => g + d[v.id], 0);
      return {
        ...d,
        [t]: se(100 - S)
      };
    }
    return rt({
      delta: y ? f - c : c - f,
      initialLayout: d,
      panelConstraints: u,
      pivotIndices: y ? [p - 1, p] : [p, p + 1],
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
      layout: h,
      separatorToPanels: y
    } = n(), S = i({
      nextSize: c,
      panels: f.panels,
      prevLayout: h,
      derivedPanelConstraints: u
    }), g = ke({
      layout: S,
      panelConstraints: u
    });
    Ne(h, g) || we(f, {
      defaultLayoutDeferred: d,
      derivedPanelConstraints: u,
      groupSize: p,
      layout: g,
      separatorToPanels: y
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
      return c && ie(l, d);
    },
    resize: (c) => {
      const { group: l } = n(), { element: d } = a(), u = Be({ group: l }), f = Ge({
        groupSize: u,
        panelElement: d,
        styleProp: c
      }), p = se(f / u * 100);
      s(p);
    }
  };
}
function Yn(e) {
  if (e.defaultPrevented)
    return;
  const t = Le();
  ln(e, t).forEach((n) => {
    if (n.separator && !n.separator.disableDoubleClick) {
      const r = n.panels.find(
        (a) => a.panelConstraints.defaultSize !== void 0
      );
      if (r) {
        const a = r.panelConstraints.defaultSize, o = Fr({
          groupId: n.group.id,
          panelId: r.id
        });
        o && a !== void 0 && (o.resize(a), e.preventDefault());
      }
    }
  });
}
function ft(e) {
  const t = Le();
  for (const [n] of t)
    if (n.separators.some(
      (r) => r.element === e
    ))
      return n;
  throw Error("Could not find parent Group for separator element");
}
function Or({
  groupId: e
}) {
  const t = () => {
    const n = Le();
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
      } = t(), l = ke({
        layout: n,
        panelConstraints: a
      });
      return r ? s : (Ne(s, l) || we(o, {
        defaultLayoutDeferred: r,
        derivedPanelConstraints: a,
        groupSize: i,
        layout: l,
        separatorToPanels: c
      }), l);
    }
  };
}
function Pe(e, t) {
  const n = ft(e), r = Re(n.id, !0), a = n.separators.find(
    (d) => d.element === e
  );
  V(a, "Matching separator not found");
  const o = r.separatorToPanels.get(a);
  V(o, "Matching panels not found");
  const i = o.map((d) => n.panels.indexOf(d)), s = Or({ groupId: n.id }).getLayout(), c = rt({
    delta: t,
    initialLayout: s,
    panelConstraints: r.derivedPanelConstraints,
    pivotIndices: i,
    prevLayout: s,
    trigger: "keyboard"
  }), l = ke({
    layout: c,
    panelConstraints: r.derivedPanelConstraints
  });
  Ne(s, l) || we(
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
function Gn(e) {
  if (e.defaultPrevented)
    return;
  const t = e.currentTarget, n = ft(t);
  if (!n.disabled)
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault(), n.orientation === "vertical" && Pe(t, 5);
        break;
      }
      case "ArrowLeft": {
        e.preventDefault(), n.orientation === "horizontal" && Pe(t, -5);
        break;
      }
      case "ArrowRight": {
        e.preventDefault(), n.orientation === "horizontal" && Pe(t, 5);
        break;
      }
      case "ArrowUp": {
        e.preventDefault(), n.orientation === "vertical" && Pe(t, -5);
        break;
      }
      case "End": {
        e.preventDefault(), Pe(t, 100);
        break;
      }
      case "Enter": {
        e.preventDefault();
        const r = ft(t), a = Re(r.id, !0), { derivedPanelConstraints: o, layout: i, separatorToPanels: s } = a, c = r.separators.find(
          (f) => f.element === t
        );
        V(c, "Matching separator not found");
        const l = s.get(c);
        V(l, "Matching panels not found");
        const d = l[0], u = o.find(
          (f) => f.panelId === d.id
        );
        if (V(u, "Panel metadata not found"), u.collapsible) {
          const f = i[d.id], p = u.collapsedSize === f ? r.mutableState.expandedPanelSizes[d.id] ?? u.minSize : u.collapsedSize;
          Pe(t, p - f);
        }
        break;
      }
      case "F6": {
        e.preventDefault();
        const r = ft(t).separators.map(
          (i) => i.element
        ), a = Array.from(r).findIndex(
          (i) => i === e.currentTarget
        );
        V(a !== null, "Index not found");
        const o = e.shiftKey ? a > 0 ? a - 1 : r.length - 1 : a + 1 < r.length ? a + 1 : 0;
        r[o].focus({
          preventScroll: !0
        });
        break;
      }
      case "Home": {
        e.preventDefault(), Pe(t, -100);
        break;
      }
    }
}
function Xn(e) {
  if (e.defaultPrevented || e.pointerType === "mouse" && e.button > 0)
    return;
  const t = Le(), n = ln(e, t), r = /* @__PURE__ */ new Map();
  let a = !1;
  n.forEach((o) => {
    o.separator && (a || (a = !0, o.separator.element.focus({
      // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#browser_compatibility
      focusVisible: !1,
      preventScroll: !0
    })));
    const i = t.get(o.group);
    i && r.set(o.group, i.layout);
  }), je({
    cursorFlags: 0,
    hitRegions: n,
    initialLayoutMap: r,
    pointerDownAtPoint: { x: e.clientX, y: e.clientY },
    state: "active"
  }), n.length && e.preventDefault();
}
function jr({
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
    const { group: d, groupSize: u } = l, { orientation: f, panels: p } = d, { disableCursor: h } = d.mutableState;
    let y = 0;
    o ? f === "horizontal" ? y = (t.clientX - o.x) / u * 100 : y = (t.clientY - o.y) / u * 100 : f === "horizontal" ? y = t.clientX < 0 ? -100 : 100 : y = t.clientY < 0 ? -100 : 100;
    const S = r.get(d), g = a.get(d);
    if (!S || !g)
      return;
    const {
      defaultLayoutDeferred: v,
      derivedPanelConstraints: x,
      groupSize: w,
      layout: m,
      separatorToPanels: T
    } = g;
    if (x && m && T) {
      const R = rt({
        delta: y,
        initialLayout: S,
        panelConstraints: x,
        pivotIndices: l.panels.map((N) => p.indexOf(N)),
        prevLayout: m,
        trigger: "mouse-or-touch"
      });
      if (Ne(R, m)) {
        if (y !== 0 && !h)
          switch (f) {
            case "horizontal": {
              s |= y < 0 ? Ar : Lr;
              break;
            }
            case "vertical": {
              s |= y < 0 ? Cr : zr;
              break;
            }
          }
      } else
        we(l.group, {
          defaultLayoutDeferred: v,
          derivedPanelConstraints: x,
          groupSize: w,
          layout: R,
          separatorToPanels: T
        });
    }
  });
  let c = 0;
  t.movementX === 0 ? c |= i & jn : c |= s & jn, t.movementY === 0 ? c |= i & Un : c |= s & Un, gs(c), sn(e);
}
function Zn(e) {
  const t = Le(), n = Ee();
  switch (n.state) {
    case "active":
      jr({
        document: e.currentTarget,
        event: e,
        hitRegions: n.hitRegions,
        initialLayoutMap: n.initialLayoutMap,
        mountedGroups: t,
        prevCursorFlags: n.cursorFlags
      });
  }
}
function Qn(e) {
  var r, a;
  if (e.defaultPrevented)
    return;
  const t = Ee(), n = Le();
  switch (t.state) {
    case "active": {
      if (
        // Skip this check for "pointerleave" events, else Firefox triggers a false positive (see #514)
        e.buttons === 0
      ) {
        je({
          cursorFlags: 0,
          state: "inactive"
        }), t.hitRegions.forEach((o) => {
          const i = Re(o.group.id, !0);
          we(o.group, i, {
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
      jr({
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
      const o = ln(e, n);
      o.length === 0 ? t.state !== "inactive" && je({
        cursorFlags: 0,
        state: "inactive"
      }) : je({
        cursorFlags: 0,
        hitRegions: o,
        state: "hover"
      }), sn(e.currentTarget);
      break;
    }
  }
}
function er(e) {
  if (e.relatedTarget instanceof HTMLIFrameElement)
    switch (Ee().state) {
      case "hover":
        je({
          cursorFlags: 0,
          state: "inactive"
        });
    }
}
function tr(e) {
  e.defaultPrevented || e.pointerType === "mouse" && e.button > 0 || _r(e.currentTarget) && e.preventDefault();
}
function nr(e) {
  let t = 0, n = 0;
  const r = {};
  for (const o of e)
    if (o.defaultSize !== void 0) {
      t++;
      const i = se(o.defaultSize);
      n += i, r[o.panelId] = i;
    } else
      r[o.panelId] = void 0;
  const a = e.length - t;
  if (a !== 0) {
    const o = se((100 - n) / a);
    for (const i of e)
      i.defaultSize === void 0 && (r[i.panelId] = o);
  }
  return r;
}
function Ns(e, t, n) {
  if (!n[0])
    return;
  const r = e.panels.find((c) => c.element === t);
  if (!r || !r.onResize)
    return;
  const a = Be({ group: e }), o = e.orientation === "horizontal" ? r.element.offsetWidth : r.element.offsetHeight, i = r.mutableValues.prevSize, s = {
    asPercentage: se(o / a * 100),
    inPixels: o
  };
  r.mutableValues.prevSize = s, r.onResize(s, r.id, i);
}
function ks(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (e[n] !== t[n])
      return !1;
  return !0;
}
function As({
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
        const p = f / 100 * n, h = se(
          p / t * 100
        );
        s.set(u.id, h), a += h;
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
      d[u] = se(
        f / o * l
      );
    }
  else {
    const u = se(
      l / c.length
    );
    for (const f of c)
      d[f] = u;
  }
  return d;
}
function Ls(e, t) {
  const n = e.map((a) => a.id), r = Object.keys(t);
  if (n.length !== r.length)
    return !1;
  for (const a of n)
    if (!r.includes(a))
      return !1;
  return !0;
}
const De = /* @__PURE__ */ new Map();
function Cs(e) {
  let t = !0;
  V(
    e.element.ownerDocument.defaultView,
    "Cannot register an unmounted Group"
  );
  const n = e.element.ownerDocument.defaultView.ResizeObserver, r = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), o = new n((h) => {
    for (const y of h) {
      const { borderBoxSize: S, target: g } = y;
      if (g === e.element) {
        if (t) {
          const v = Be({ group: e });
          if (v === 0)
            return;
          const x = Re(e.id);
          if (!x)
            return;
          const w = Ut(e), m = x.defaultLayoutDeferred ? nr(w) : x.layout, T = As({
            group: e,
            nextGroupSize: v,
            prevGroupSize: x.groupSize,
            prevLayout: m
          }), R = ke({
            layout: T,
            panelConstraints: w
          });
          if (!x.defaultLayoutDeferred && Ne(x.layout, R) && ks(
            x.derivedPanelConstraints,
            w
          ) && x.groupSize === v)
            return;
          we(e, {
            defaultLayoutDeferred: !1,
            derivedPanelConstraints: w,
            groupSize: v,
            layout: R,
            separatorToPanels: x.separatorToPanels
          });
        }
      } else
        Ns(e, g, S);
    }
  });
  o.observe(e.element), e.panels.forEach((h) => {
    V(
      !r.has(h.id),
      `Panel ids must be unique; id "${h.id}" was used more than once`
    ), r.add(h.id), h.onResize && o.observe(h.element);
  });
  const i = Be({ group: e }), s = Ut(e), c = e.panels.map(({ id: h }) => h).join(",");
  let l = e.mutableState.defaultLayout;
  l && (Ls(e.panels, l) || (l = void 0));
  const d = e.mutableState.layouts[c] ?? l ?? nr(s), u = ke({
    layout: d,
    panelConstraints: s
  }), f = e.element.ownerDocument;
  De.set(
    f,
    (De.get(f) ?? 0) + 1
  );
  const p = /* @__PURE__ */ new Map();
  return Nr(e).forEach((h) => {
    h.separator && p.set(h.separator, h.panels);
  }), we(e, {
    defaultLayoutDeferred: i === 0,
    derivedPanelConstraints: s,
    groupSize: i,
    layout: u,
    separatorToPanels: p
  }), e.separators.forEach((h) => {
    V(
      !a.has(h.id),
      `Separator ids must be unique; id "${h.id}" was used more than once`
    ), a.add(h.id), h.element.addEventListener("keydown", Gn);
  }), De.get(f) === 1 && (f.addEventListener("contextmenu", Jn, !0), f.addEventListener("dblclick", Yn, !0), f.addEventListener("pointerdown", Xn, !0), f.addEventListener("pointerleave", Zn), f.addEventListener("pointermove", Qn), f.addEventListener("pointerout", er), f.addEventListener("pointerup", tr, !0)), function() {
    t = !1, De.set(
      f,
      Math.max(0, (De.get(f) ?? 0) - 1)
    ), vs(e), e.separators.forEach((h) => {
      h.element.removeEventListener("keydown", Gn);
    }), De.get(f) || (f.removeEventListener(
      "contextmenu",
      Jn,
      !0
    ), f.removeEventListener(
      "dblclick",
      Yn,
      !0
    ), f.removeEventListener(
      "pointerdown",
      Xn,
      !0
    ), f.removeEventListener("pointerleave", Zn), f.removeEventListener("pointermove", Qn), f.removeEventListener("pointerout", er), f.removeEventListener("pointerup", tr, !0)), o.disconnect();
  };
}
function zs() {
  const [e, t] = L({}), n = C(() => t({}), []);
  return [e, n];
}
function un(e) {
  const t = Vt();
  return `${e ?? t}`;
}
const Ce = typeof window < "u" ? Ae : O;
function Qe(e) {
  const t = z(e);
  return Ce(() => {
    t.current = e;
  }, [e]), C(
    (...n) => {
      var r;
      return (r = t.current) == null ? void 0 : r.call(t, ...n);
    },
    [t]
  );
}
function dn(...e) {
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
function fn(e) {
  const t = z({ ...e });
  return Ce(() => {
    for (const n in e)
      t.current[n] = e[n];
  }, [e]), t.current;
}
const Ur = Zr(null);
function Ds(e, t) {
  const n = z({
    getLayout: () => ({}),
    setLayout: bs
  });
  Kt(t, () => n.current, []), Ce(() => {
    Object.assign(
      n.current,
      Or({ groupId: e })
    );
  });
}
function Br({
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
  const h = z({
    onLayoutChange: {},
    onLayoutChanged: {}
  }), y = Qe((P) => {
    Ne(h.current.onLayoutChange, P) || (h.current.onLayoutChange = P, c == null || c(P));
  }), S = Qe(
    (P, I) => {
      Ne(h.current.onLayoutChanged, P) || (h.current.onLayoutChanged = P, l == null || l(P, { isUserInteraction: I }));
    }
  ), g = un(s), v = z(null), [x, w] = zs(), m = z({
    lastExpandedPanelSizes: {},
    layouts: {},
    panels: [],
    resizeTargetMinimumSize: u,
    separators: []
  }), T = dn(v, o);
  Ds(g, i);
  const R = Qe(
    (P, I) => {
      const k = Ee(), _ = Hn(P), $ = Re(P);
      if ($) {
        let H = !1;
        switch (k.state) {
          case "active": {
            H = k.hitRegions.some(
              (F) => F.group === _
            );
            break;
          }
        }
        return {
          flexGrow: $.layout[I] ?? 1,
          pointerEvents: H ? "none" : void 0
        };
      }
      if (n != null && n[I])
        return {
          flexGrow: n == null ? void 0 : n[I]
        };
    }
  ), N = fn({
    defaultLayout: n,
    disableCursor: r
  }), M = Y(
    () => ({
      get disableCursor() {
        return !!N.disableCursor;
      },
      getPanelStyles: R,
      id: g,
      orientation: d,
      registerPanel: (P) => {
        const I = m.current;
        return I.panels = Bt(d, [
          ...I.panels,
          P
        ]), w(), () => {
          I.panels = I.panels.filter(
            (k) => k !== P
          ), w();
        };
      },
      registerSeparator: (P) => {
        const I = m.current;
        return I.separators = Bt(d, [
          ...I.separators,
          P
        ]), w(), () => {
          I.separators = I.separators.filter(
            (k) => k !== P
          ), w();
        };
      },
      updatePanelProps: (P, { disabled: I }) => {
        const k = m.current.panels.find(
          (H) => H.id === P
        );
        k && (k.panelConstraints.disabled = I);
        const _ = Hn(g), $ = Re(g);
        _ && $ && we(_, {
          ...$,
          derivedPanelConstraints: Ut(_)
        });
      },
      updateSeparatorProps: (P, {
        disabled: I,
        disableDoubleClick: k
      }) => {
        const _ = m.current.separators.find(
          ($) => $.id === P
        );
        _ && (_.disabled = I, _.disableDoubleClick = k);
      }
    }),
    [R, g, w, d, N]
  ), E = z(null);
  return Ce(() => {
    const P = v.current;
    if (P === null)
      return;
    const I = m.current;
    let k;
    if (N.defaultLayout !== void 0 && Object.keys(N.defaultLayout).length === I.panels.length) {
      k = {};
      for (const W of I.panels) {
        const Z = N.defaultLayout[W.id];
        Z !== void 0 && (k[W.id] = Z);
      }
    }
    const _ = {
      disabled: !!a,
      element: P,
      id: g,
      mutableState: {
        defaultLayout: k,
        disableCursor: !!N.disableCursor,
        expandedPanelSizes: m.current.lastExpandedPanelSizes,
        layouts: m.current.layouts
      },
      orientation: d,
      panels: I.panels,
      resizeTargetMinimumSize: I.resizeTargetMinimumSize,
      separators: I.separators
    };
    E.current = _;
    const $ = Cs(_), { defaultLayoutDeferred: H, derivedPanelConstraints: F, layout: U } = Re(_.id, !0);
    !H && F.length > 0 && (y(U), S(U, !1));
    const B = cn(g, (W) => {
      const { defaultLayoutDeferred: Z, derivedPanelConstraints: G, layout: re } = W.next;
      if (Z || G.length === 0)
        return;
      const A = _.panels.map(({ id: te }) => te).join(",");
      _.mutableState.layouts[A] = re, G.forEach((te) => {
        if (te.collapsible) {
          const { layout: ce } = W.prev ?? {};
          if (ce) {
            const le = ie(
              te.collapsedSize,
              re[te.panelId]
            ), q = ie(
              te.collapsedSize,
              ce[te.panelId]
            );
            le && !q && (_.mutableState.expandedPanelSizes[te.panelId] = ce[te.panelId]);
          }
        }
      });
      const ee = Ee().state !== "active";
      y(re), ee && S(re, W.isUserInteraction);
    });
    return () => {
      E.current = null, $(), B();
    };
  }, [
    a,
    g,
    S,
    y,
    d,
    x,
    N
  ]), O(() => {
    const P = E.current;
    P && (P.mutableState.defaultLayout = n, P.mutableState.disableCursor = !!r);
  }), /* @__PURE__ */ b(Ur.Provider, { value: M, children: /* @__PURE__ */ b(
    "div",
    {
      ...p,
      className: t,
      "data-group": !0,
      "data-testid": g,
      id: g,
      ref: T,
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
Br.displayName = "Group";
function pn() {
  const e = Qr(Ur);
  return V(
    e,
    "Group Context not found; did you render a Panel or Separator outside of a Group?"
  ), e;
}
function _s(e, t) {
  const { id: n } = pn(), r = z({
    collapse: Nt,
    expand: Nt,
    getSize: () => ({
      asPercentage: 0,
      inPixels: 0
    }),
    isCollapsed: () => !1,
    resize: Nt
  });
  Kt(t, () => r.current, []), Ce(() => {
    Object.assign(
      r.current,
      Fr({ groupId: n, panelId: e })
    );
  });
}
function Wt({
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
  ...h
}) {
  const y = !!c, S = un(c), g = fn({
    disabled: o
  }), v = z(null), x = dn(v, i), {
    getPanelStyles: w,
    id: m,
    orientation: T,
    registerPanel: R,
    updatePanelProps: N
  } = pn(), M = u !== null, E = Qe(
    (_, $, H) => {
      u == null || u(_, c, H);
    }
  );
  Ce(() => {
    const _ = v.current;
    if (_ !== null) {
      const $ = {
        element: _,
        id: S,
        idIsStable: y,
        mutableValues: {
          expandToSize: void 0,
          prevSize: void 0
        },
        onResize: M ? E : void 0,
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
      return R($);
    }
  }, [
    s,
    n,
    r,
    a,
    M,
    S,
    y,
    l,
    d,
    E,
    R,
    g
  ]), O(() => {
    N(S, { disabled: o });
  }, [o, S, N]), _s(S, f);
  const P = () => {
    const _ = w(m, S);
    if (_)
      return JSON.stringify(_);
  }, I = Xr(
    (_) => cn(m, _),
    P,
    P
  );
  let k;
  return I ? k = JSON.parse(I) : a !== void 0 ? k = {
    flexGrow: void 0,
    flexShrink: void 0,
    flexBasis: a
  } : k = { flexGrow: 1 }, /* @__PURE__ */ b(
    "div",
    {
      ...h,
      "data-disabled": o || void 0,
      "data-panel": !0,
      "data-testid": S,
      id: S,
      ref: x,
      style: {
        ...$s,
        display: "flex",
        flexBasis: 0,
        flexShrink: 1,
        overflow: "visible",
        ...k
      },
      children: /* @__PURE__ */ b(
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
            touchAction: T === "horizontal" ? "pan-y" : "pan-x"
          },
          children: e
        }
      )
    }
  );
}
Wt.displayName = "Panel";
const $s = {
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
function Fs({
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
    o = ke({
      layout: rt({
        delta: l - i,
        initialLayout: e,
        panelConstraints: t,
        pivotIndices: d,
        prevLayout: e
      }),
      panelConstraints: t
    })[n], a = ke({
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
function Wr({
  children: e,
  className: t,
  disabled: n,
  disableDoubleClick: r,
  elementRef: a,
  id: o,
  style: i,
  ...s
}) {
  const c = un(o), l = fn({
    disabled: n,
    disableDoubleClick: r
  }), [d, u] = L({}), [f, p] = L("inactive"), [h, y] = L(!1), S = z(null), g = dn(S, a), {
    disableCursor: v,
    id: x,
    orientation: w,
    registerSeparator: m,
    updateSeparatorProps: T
  } = pn(), R = w === "horizontal" ? "vertical" : "horizontal";
  Ce(() => {
    const E = S.current;
    if (E !== null) {
      const P = {
        disabled: l.disabled,
        disableDoubleClick: l.disableDoubleClick,
        element: E,
        id: c
      }, I = m(P), k = hs(
        ($) => {
          p(
            $.next.state !== "inactive" && $.next.hitRegions.some(
              (H) => H.separator === P
            ) ? $.next.state : "inactive"
          );
        }
      ), _ = cn(
        x,
        ($) => {
          const { derivedPanelConstraints: H, layout: F, separatorToPanels: U } = $.next, B = U.get(P);
          if (B) {
            const W = B[0], Z = B.indexOf(W);
            u(
              Fs({
                layout: F,
                panelConstraints: H,
                panelId: W.id,
                panelIndex: Z
              })
            );
          }
        }
      );
      return () => {
        k(), _(), I();
      };
    }
  }, [x, c, m, l]), O(() => {
    T(c, { disabled: n, disableDoubleClick: r });
  }, [n, r, c, T]);
  let N;
  n && !v && (N = "not-allowed");
  let M;
  if (n)
    M = "disabled";
  else
    switch (f) {
      case "active": {
        M = "active";
        break;
      }
      default:
        h ? M = "focus" : M = f;
    }
  return /* @__PURE__ */ b(
    "div",
    {
      ...s,
      "aria-controls": d.valueControls,
      "aria-disabled": n || void 0,
      "aria-orientation": R,
      "aria-valuemax": d.valueMax,
      "aria-valuemin": d.valueMin,
      "aria-valuenow": d.valueNow,
      children: e,
      className: t,
      "data-separator": M,
      "data-testid": c,
      id: c,
      onBlur: () => y(!1),
      onFocus: () => y(!0),
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
Wr.displayName = "Separator";
const mn = "reader-document", ot = "reader-assistant", Hr = "retainpdf.reader.ai-split-layout.v1", Os = 30, js = 65, Us = {
  [mn]: 50,
  [ot]: 50
};
function hn(e) {
  const t = Number(e == null ? void 0 : e[ot]), n = Number.isFinite(t) ? Math.min(js, Math.max(Os, t)) : 50;
  return {
    [mn]: 100 - n,
    [ot]: n
  };
}
function Bs() {
  try {
    const e = JSON.parse(localStorage.getItem(Hr) || "null");
    return hn(e);
  } catch {
    return Us;
  }
}
function Ws(e) {
  try {
    localStorage.setItem(Hr, JSON.stringify(hn(e)));
  } catch {
  }
}
function kt(e, t) {
  const n = e == null ? void 0 : e.closest(".reader-react-root");
  if (!n) return;
  const r = hn(t);
  n.style.setProperty(
    "--reader-ai-split-width",
    `${r[ot]}vw`
  );
}
function Hs() {
  const e = z(null), [t] = L(Bs);
  Ae(() => {
    const a = e.current;
    return kt(a, t), () => {
      var o;
      (o = a == null ? void 0 : a.closest(".reader-react-root")) == null || o.style.removeProperty("--reader-ai-split-width");
    };
  }, [t]);
  const n = C((a) => {
    kt(e.current, a);
  }, []), r = C((a, o) => {
    kt(e.current, a), o.isUserInteraction && Ws(a);
  }, []);
  return /* @__PURE__ */ D(
    Br,
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
        /* @__PURE__ */ b(
          Wt,
          {
            id: mn,
            defaultSize: "50%",
            minSize: "35%",
            maxSize: "70%"
          }
        ),
        /* @__PURE__ */ b(
          Wr,
          {
            id: "reader-ai-split-separator",
            className: "reader-ai-split-separator",
            "aria-label": "调整文档与 AI 问答宽度",
            children: /* @__PURE__ */ b("span", { "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ b(
          Wt,
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
const Se = 12, Js = 4;
function Fe(e, t, n) {
  if (typeof window > "u") return { x: e, y: t };
  const r = Math.min(n, window.innerWidth - Se * 2), a = Math.max(Se, window.innerWidth - r - Se), o = Math.min(window.innerHeight * 0.9, 860), i = Math.max(Se, window.innerHeight - o - Se);
  return {
    x: Math.min(a, Math.max(Se, e)),
    y: Math.min(i, Math.max(Se, t))
  };
}
function rr(e) {
  if (typeof window > "u") return { x: 24, y: 72 };
  const t = Math.min(e, window.innerWidth - Se * 2);
  return Fe(window.innerWidth - t - 20, 72, e);
}
function qs(e, t) {
  try {
    const n = localStorage.getItem(e);
    if (!n) return rr(t);
    const r = JSON.parse(n);
    if (typeof r.x == "number" && typeof r.y == "number")
      return Fe(r.x, r.y, t);
  } catch {
  }
  return rr(t);
}
function Ks(e, t) {
  try {
    localStorage.setItem(e, JSON.stringify(t));
  } catch {
  }
}
function Vs({
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
  const h = l === "workspace", y = l === "dock-right", S = y || h, [g, v] = L(() => qs(o, c)), [x, w] = L(!1), m = z(null);
  O(() => {
    !t || S || v((M) => Fe(M.x, M.y, c));
  }, [S, t, c]), O(() => {
    if (!t || S) return;
    const M = () => v((E) => Fe(E.x, E.y, c));
    return window.addEventListener("resize", M), () => window.removeEventListener("resize", M);
  }, [S, t, c]), O(() => {
    if (!t) return;
    const M = (E) => {
      var I;
      if (E.key !== "Escape") return;
      const P = E.target;
      (I = P == null ? void 0 : P.closest) != null && I.call(P, "textarea, input, select, [contenteditable='true']") || (E.preventDefault(), u());
    };
    return window.addEventListener("keydown", M), () => window.removeEventListener("keydown", M);
  }, [t, u]);
  const T = C((M) => {
    var E, P;
    S || M.button === 0 && ((P = (E = M.target) == null ? void 0 : E.closest) != null && P.call(E, "button") || (M.currentTarget.setPointerCapture(M.pointerId), m.current = {
      pointerId: M.pointerId,
      startX: M.clientX,
      startY: M.clientY,
      originX: g.x,
      originY: g.y,
      moved: !1
    }, w(!0)));
  }, [S, g.x, g.y]), R = C((M) => {
    const E = m.current;
    if (!E || E.pointerId !== M.pointerId) return;
    const P = M.clientX - E.startX, I = M.clientY - E.startY;
    !E.moved && Math.hypot(P, I) < Js || (E.moved = !0, v(Fe(E.originX + P, E.originY + I, c)));
  }, [c]), N = C((M) => {
    const E = m.current;
    if (!(!E || E.pointerId !== M.pointerId)) {
      m.current = null, w(!1);
      try {
        M.currentTarget.releasePointerCapture(M.pointerId);
      } catch {
      }
      E.moved && v((P) => {
        const I = Fe(P.x, P.y, c);
        return Ks(o, I), I;
      });
    }
  }, [o, c]);
  return t ? /* @__PURE__ */ D(
    "aside",
    {
      id: e,
      className: `reader-notes-panel reader-notes-panel--${h ? "workspace" : y ? "docked" : "float"}${S ? "" : " reader-floating-surface"}${d ? " has-panel-header" : " is-headerless"}${f ? " has-panel-toolbar" : ""}${x ? " is-dragging" : ""} ${s}`.trim(),
      style: S ? void 0 : { left: g.x, top: g.y, width: Math.min(c, typeof window < "u" ? window.innerWidth - 24 : c) },
      "aria-label": i,
      role: "dialog",
      "aria-modal": "false",
      children: [
        d ? /* @__PURE__ */ D(
          "header",
          {
            className: "reader-notes-panel-head",
            onPointerDown: T,
            onPointerMove: R,
            onPointerUp: N,
            onPointerCancel: N,
            children: [
              S ? null : /* @__PURE__ */ b("div", { className: "reader-notes-panel-drag", "aria-hidden": "true", children: /* @__PURE__ */ b(no, { size: 14, strokeWidth: 2.25 }) }),
              /* @__PURE__ */ D("div", { className: "reader-notes-panel-head-text", children: [
                /* @__PURE__ */ D("strong", { children: [
                  a,
                  n
                ] }),
                r ? /* @__PURE__ */ b("span", { children: r }) : null
              ] }),
              /* @__PURE__ */ b("button", { type: "button", className: "reader-notes-close reader-floating-close", "aria-label": `关闭${n}`, onClick: u, children: /* @__PURE__ */ b(Ue, { size: 14, strokeWidth: 2.5, "aria-hidden": !0 }) })
            ]
          }
        ) : null,
        f ? /* @__PURE__ */ b("div", { className: "reader-notes-panel-toolbar", children: f }) : null,
        /* @__PURE__ */ b("div", { className: "reader-notes-panel-body", children: p })
      ]
    }
  ) : null;
}
function Ys({
  note: e,
  onJump: t,
  onUpdateNote: n,
  onRemove: r
}) {
  const [a, o] = L(!1), [i, s] = L(e.note);
  return O(() => {
    a || s(e.note);
  }, [e.note, a]), /* @__PURE__ */ D("article", { className: "reader-notes-item", children: [
    /* @__PURE__ */ D("div", { className: "reader-notes-item-top", children: [
      /* @__PURE__ */ b("span", { className: "reader-notes-kind", children: e.pane === "translated" ? "译文" : "原文" }),
      /* @__PURE__ */ D("div", { className: "reader-notes-item-actions", children: [
        /* @__PURE__ */ b("button", { type: "button", className: "reader-notes-link", onClick: () => t(e), children: "定位" }),
        /* @__PURE__ */ b("button", { type: "button", className: "reader-notes-danger", onClick: () => r(e.id), children: "删除" })
      ] })
    ] }),
    /* @__PURE__ */ b("p", { className: "reader-notes-quote", children: e.quote }),
    a ? /* @__PURE__ */ D("div", { className: "reader-notes-editor", children: [
      /* @__PURE__ */ b(
        "textarea",
        {
          className: "reader-notes-textarea",
          value: i,
          placeholder: "写点想法…",
          rows: 3,
          onChange: (c) => s(c.target.value)
        }
      ),
      /* @__PURE__ */ D("div", { className: "reader-notes-editor-actions", children: [
        /* @__PURE__ */ b(
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
        /* @__PURE__ */ b("button", { type: "button", className: "reader-notes-link", onClick: () => o(!1), children: "取消" })
      ] })
    ] }) : e.note ? /* @__PURE__ */ b(
      "button",
      {
        type: "button",
        className: "reader-notes-note",
        onClick: () => o(!0),
        title: "点击编辑",
        children: e.note
      }
    ) : /* @__PURE__ */ b("button", { type: "button", className: "reader-notes-add-note", onClick: () => o(!0), children: "添加笔记" })
  ] });
}
function Gs({
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
  return /* @__PURE__ */ b(
    Vs,
    {
      id: "reader-notes-panel",
      open: e,
      title: "批注",
      subtitle: "选中 PDF 文字后可添加 · 本地保存",
      titleIcon: /* @__PURE__ */ b(Xt, { size: 14, strokeWidth: 2.25, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.notes-float.pos.v1",
      ariaLabel: "批注",
      onClose: r,
      toolbar: /* @__PURE__ */ D(Jt, { children: [
        /* @__PURE__ */ D("span", { className: "reader-notes-count", children: [
          n,
          " 条"
        ] }),
        /* @__PURE__ */ b(
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
      children: n === 0 ? /* @__PURE__ */ b("p", { className: "reader-notes-empty", children: "暂无批注。在 PDF 上拖选文字，点「添加批注」。" }) : t.map((d) => /* @__PURE__ */ D("section", { className: "reader-notes-group", children: [
        /* @__PURE__ */ D("h3", { className: "reader-notes-group-title", children: [
          "第 ",
          d.page,
          " 页"
        ] }),
        d.items.map((u) => /* @__PURE__ */ b(
          Ys,
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
function Xs({
  loading: e,
  failed: t,
  text: n,
  percent: r
}) {
  return !e && !t ? null : /* @__PURE__ */ D(Jt, { children: [
    e ? /* @__PURE__ */ b("div", { className: "reader-boot-loading", "data-reader-boot-loading": "true", children: /* @__PURE__ */ D("div", { className: "reader-boot-loading-card", children: [
      /* @__PURE__ */ b("div", { className: "reader-boot-loading-text", children: n }),
      /* @__PURE__ */ b("div", { className: "reader-boot-loading-track", children: /* @__PURE__ */ b(
        "span",
        {
          className: "reader-boot-loading-bar",
          style: { width: `${Math.max(0, Math.min(100, r))}%` }
        }
      ) })
    ] }) }) : null,
    t ? /* @__PURE__ */ b("div", { className: "reader-react-error", role: "alert", children: n }) : null
  ] });
}
async function Zs(e) {
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
function Qs({
  selection: e,
  onDismiss: t,
  onAskAi: n,
  onAddNote: r
}) {
  const [a, o] = L(!1), i = e ? e.selectionType === "text" ? `${e.pane}:${e.page}:${e.quote}` : `${e.region.itemId}:${e.pane}` : "";
  if (O(() => o(!1), [i]), !e)
    return null;
  const s = typeof window < "u" ? window.innerWidth : 800, c = typeof window < "u" ? window.innerHeight : 600, l = e.rect.left + e.rect.width / 2, d = 170, u = Math.min(Math.max(16 + d, l), s - 16 - d), f = e.rect.top > 72, p = f ? Math.max(12, e.rect.top - 8) : Math.min(c - 12, e.rect.top + e.rect.height + 8), h = f ? "above" : "below", y = e.pane === "translated" ? "译文" : "原文", S = e.selectionType === "text" ? "text" : e.kind, g = e.selectionType === "text" ? e.quote : mr(e.region, e.pane), v = S === "formula" ? "公式" : S === "table" ? "表格" : S === "figure" ? "图片" : S === "text" ? "文字" : "区域", x = S === "formula" ? na(g) : g, w = S === "formula" ? ro : S === "table" ? oo : S === "text" ? ao : io;
  return /* @__PURE__ */ D(
    "div",
    {
      className: `reader-sel-pop reader-sel-pop--${h} reader-sel-pop--region`,
      style: { left: u, top: p },
      role: "toolbar",
      "aria-label": "选区操作",
      onPointerDown: (m) => {
        m.preventDefault();
      },
      children: [
        /* @__PURE__ */ D("div", { className: "reader-sel-pop-card reader-floating-surface", children: [
          /* @__PURE__ */ D("div", { className: "reader-sel-pop-context", children: [
            /* @__PURE__ */ b(w, { size: 15, strokeWidth: 2.1, "aria-hidden": !0 }),
            /* @__PURE__ */ b("span", { children: v }),
            /* @__PURE__ */ b("span", { className: "reader-sel-pop-context-divider", "aria-hidden": !0, children: "·" }),
            /* @__PURE__ */ b("span", { children: y }),
            /* @__PURE__ */ b("span", { className: "reader-sel-pop-context-divider", "aria-hidden": !0, children: "·" }),
            /* @__PURE__ */ D("span", { children: [
              e.page,
              " 页"
            ] })
          ] }),
          /* @__PURE__ */ D("div", { className: "reader-sel-pop-actions", children: [
            x ? /* @__PURE__ */ D(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--primary",
                onClick: async () => {
                  try {
                    await Zs(x), o(!0), window.setTimeout(() => o(!1), 1400);
                  } catch (m) {
                    console.warn("[reader-selection] copy failed", m);
                  }
                },
                children: [
                  a ? /* @__PURE__ */ b(so, { size: 15, strokeWidth: 2.4, "aria-hidden": !0 }) : /* @__PURE__ */ b(co, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
                  /* @__PURE__ */ b("span", { children: a ? "已复制" : S === "formula" ? "复制 LaTeX" : "复制" })
                ]
              }
            ) : /* @__PURE__ */ b("span", { className: "reader-sel-pop-selection-hint", children: "已选择图片" }),
            r && x ? /* @__PURE__ */ D(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--secondary",
                onClick: () => r({ page: e.page, pane: e.pane, quote: x }),
                children: [
                  /* @__PURE__ */ b(Xt, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
                  /* @__PURE__ */ b("span", { children: "添加批注" })
                ]
              }
            ) : null,
            n ? /* @__PURE__ */ D(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--secondary",
                onClick: () => n(e),
                children: [
                  /* @__PURE__ */ b(Gt, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
                  /* @__PURE__ */ b("span", { children: "问 AI" })
                ]
              }
            ) : null,
            /* @__PURE__ */ b(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--ghost",
                onClick: t,
                "aria-label": "取消选区",
                title: "取消",
                children: /* @__PURE__ */ b(Ue, { size: 15, strokeWidth: 2.5, "aria-hidden": !0 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ b("span", { className: "reader-sel-pop-caret", "aria-hidden": "true" })
      ]
    }
  );
}
const ec = [
  {
    title: "翻页",
    items: [
      { keys: "J · ↓ · PgDn", desc: "下一页" },
      { keys: "K · ↑ · PgUp", desc: "上一页" },
      { keys: "Home / End", desc: "首页 / 末页" },
      { keys: "点底栏页码", desc: "输入页码跳转" }
    ]
  },
  {
    title: "缩放",
    items: [
      { keys: "+ / −", desc: "放大 / 缩小" },
      { keys: "0", desc: "重置为模式默认" },
      { keys: "点百分比", desc: "重置为模式默认" }
    ]
  },
  {
    title: "模式",
    items: [
      { keys: "1", desc: "源文件" },
      { keys: "2", desc: "对照" },
      { keys: "3", desc: "翻译文件" }
    ]
  }
];
function tc(e) {
  if (!(e instanceof HTMLElement)) return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function nc() {
  const [e, t] = L(!1), n = Vt(), r = z(null);
  return O(() => {
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
  }, [e]), O(() => {
    const a = (o) => {
      if (o.defaultPrevented || o.metaKey || o.ctrlKey || o.altKey || tc(o.target)) return;
      const i = o.key;
      if (i === "?" || i === "h" || i === "H" || i === "/") {
        if (i === "/" && !o.shiftKey)
          return;
        o.preventDefault(), t((s) => !s);
      }
    };
    return window.addEventListener("keydown", a), () => window.removeEventListener("keydown", a);
  }, []), /* @__PURE__ */ D("div", { className: "reader-react-shortcuts", ref: r, "data-reader-shortcuts": "", children: [
    /* @__PURE__ */ b(
      "button",
      {
        type: "button",
        className: `reader-react-hud-btn reader-react-shortcuts-btn${e ? " is-active" : ""}`,
        "aria-label": "快捷键说明",
        "aria-expanded": e,
        "aria-controls": n,
        title: "快捷键（H 或 ?）",
        onClick: () => t((a) => !a),
        children: /* @__PURE__ */ b(lo, { className: "reader-react-shortcuts-icon", size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
      }
    ),
    e ? /* @__PURE__ */ D(
      "div",
      {
        id: n,
        className: "reader-react-shortcuts-panel reader-floating-surface",
        role: "dialog",
        "aria-label": "阅读器快捷键",
        children: [
          /* @__PURE__ */ D("div", { className: "reader-react-shortcuts-head", children: [
            /* @__PURE__ */ b("strong", { children: "快捷键" }),
            /* @__PURE__ */ b(
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
          /* @__PURE__ */ b("div", { className: "reader-react-shortcuts-body", children: ec.map((a) => /* @__PURE__ */ D("section", { className: "reader-react-shortcuts-group", children: [
            /* @__PURE__ */ b("h3", { children: a.title }),
            /* @__PURE__ */ b("ul", { children: a.items.map((o) => /* @__PURE__ */ D("li", { children: [
              /* @__PURE__ */ b("kbd", { children: o.keys }),
              /* @__PURE__ */ b("span", { children: o.desc })
            ] }, `${a.title}-${o.keys}`)) })
          ] }, a.title)) }),
          /* @__PURE__ */ b("p", { className: "reader-react-shortcuts-foot", children: "在输入框内不会触发快捷键" })
        ]
      }
    ) : null
  ] });
}
const rc = Object.freeze([
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
]), oc = {
  favorites: uo,
  markdown: ur,
  ai: Gt
}, Jr = "retainpdf.reader.fab.pos.v1", wt = 52, _e = 12, ac = 6, ic = ["source", "sideBySide", "translated"], sc = {
  source: sr,
  sideBySide: cr,
  translated: lr
}, cc = {
  source: "原文",
  sideBySide: "对照",
  translated: "译文"
}, lc = rc.filter((e) => e.id === "favorites");
function et(e, t) {
  const n = Math.max(_e, window.innerWidth - wt - _e), r = Math.max(_e, window.innerHeight - wt - _e);
  return {
    x: Math.min(n, Math.max(_e, e)),
    y: Math.min(r, Math.max(_e, t))
  };
}
function or() {
  return typeof window > "u" ? { x: 24, y: 120 } : et(
    window.innerWidth - wt - 20,
    window.innerHeight - wt - 88
  );
}
function uc() {
  try {
    const e = localStorage.getItem(Jr);
    if (!e) return or();
    const t = JSON.parse(e);
    if (typeof t.x == "number" && typeof t.y == "number")
      return et(t.x, t.y);
  } catch {
  }
  return or();
}
function dc(e) {
  try {
    localStorage.setItem(Jr, JSON.stringify(e));
  } catch {
  }
}
function fc(e) {
  if (e.sourceOnly || !e.jobId) {
    const t = Xe(e.sourceUrl), n = Xe(e.translatedUrl);
    return {
      source: t,
      translated: n,
      // sideBySide requires dedicated artifact; no fallback to source url
      sideBySide: ""
    };
  }
  return jo({
    jobId: e.jobId,
    jobPayload: e.jobPayload,
    manifestPayload: e.manifestPayload
  });
}
function pc({
  activeTool: e,
  sourceOnly: t,
  onToggleTool: n,
  download: r
}) {
  const [a, o] = L(() => uc()), [i, s] = L(!1), [c, l] = L(() => /* @__PURE__ */ new Set()), d = z(null), u = z(null), f = Vt(), p = Y(() => fc(r), [r]);
  O(() => {
    const m = () => o((T) => et(T.x, T.y));
    return window.addEventListener("resize", m), () => window.removeEventListener("resize", m);
  }, []), O(() => {
    if (!i) return;
    const m = (R) => {
      const N = d.current;
      N && R.target instanceof Node && !N.contains(R.target) && s(!1);
    }, T = (R) => {
      R.key === "Escape" && (R.preventDefault(), s(!1));
    };
    return document.addEventListener("mousedown", m), window.addEventListener("keydown", T), () => {
      document.removeEventListener("mousedown", m), window.removeEventListener("keydown", T);
    };
  }, [i]);
  const h = C((m) => {
    n(m), s(!1);
  }, [n]), y = C(
    async (m) => {
      const T = Xe(p[m]);
      if (!(!T || c.has(m)))
        try {
          const R = r.jobId ? Oo(m, {
            jobId: r.jobId,
            jobPayload: r.jobPayload,
            manifestPayload: r.manifestPayload
          }) : `${r.sourceOnly ? "document" : "reader"}-${m}.pdf`;
          await Uo(
            r.fetchProtected,
            T,
            R,
            R,
            null,
            (N) => l((M) => {
              const E = new Set(M);
              return N ? E.add(m) : E.delete(m), E;
            })
          );
        } catch (R) {
          const N = R instanceof Error ? R.message : "下载失败";
          Bo(N), l((M) => {
            const E = new Set(M);
            return E.delete(m), E;
          });
        }
    },
    [p, c, r]
  ), S = (m) => {
    m.button === 0 && (m.currentTarget.setPointerCapture(m.pointerId), u.current = {
      pointerId: m.pointerId,
      startX: m.clientX,
      startY: m.clientY,
      originX: a.x,
      originY: a.y,
      moved: !1
    });
  }, g = (m) => {
    const T = u.current;
    if (!T || T.pointerId !== m.pointerId) return;
    const R = m.clientX - T.startX, N = m.clientY - T.startY;
    !T.moved && Math.hypot(R, N) < ac || (T.moved = !0, i && s(!1), o(et(T.originX + R, T.originY + N)));
  }, v = (m) => {
    const T = u.current;
    if (!(!T || T.pointerId !== m.pointerId)) {
      u.current = null;
      try {
        m.currentTarget.releasePointerCapture(m.pointerId);
      } catch {
      }
      if (T.moved) {
        o((R) => {
          const N = et(R.x, R.y);
          return dc(N), N;
        });
        return;
      }
      s((R) => !R);
    }
  }, x = typeof window < "u" && a.y > window.innerHeight * 0.55, w = ic.filter((m) => !(r.sourceOnly && m !== "source"));
  return /* @__PURE__ */ D(
    "div",
    {
      ref: d,
      className: `reader-fab${i ? " is-open" : ""}${x ? " is-open-up" : ""}`,
      style: { left: a.x, top: a.y },
      "data-reader-fab": "",
      children: [
        i ? /* @__PURE__ */ D(
          "div",
          {
            id: f,
            className: "reader-fab-menu reader-floating-surface",
            role: "menu",
            "aria-label": "阅读工具",
            children: [
              /* @__PURE__ */ D("header", { className: "reader-fab-menu-head", children: [
                /* @__PURE__ */ D("div", { className: "reader-fab-menu-head-text", children: [
                  /* @__PURE__ */ b("strong", { children: "工具" }),
                  /* @__PURE__ */ b("span", { children: "拖动圆钮可移动" })
                ] }),
                /* @__PURE__ */ b(
                  "button",
                  {
                    type: "button",
                    className: "reader-fab-menu-close reader-floating-close",
                    "aria-label": "关闭菜单",
                    onClick: () => s(!1),
                    children: /* @__PURE__ */ b(Ue, { size: 14, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                )
              ] }),
              lc.map((m, T) => {
                const R = oc[m.id], N = e === m.id, M = m.needsJob && t;
                let E = N ? m.subOpen : m.subIdle;
                return M && (E = "需打开任务阅读"), /* @__PURE__ */ D(
                  "button",
                  {
                    type: "button",
                    role: "menuitem",
                    className: `reader-fab-row${N ? " is-active" : ""}${M ? " is-disabled" : ""}`,
                    "aria-pressed": N,
                    disabled: M,
                    onClick: () => h(m.id),
                    style: { "--fab-i": T },
                    children: [
                      /* @__PURE__ */ b("span", { className: "reader-fab-row-icon", "aria-hidden": "true", children: /* @__PURE__ */ b(R, { size: 18, strokeWidth: 2 }) }),
                      /* @__PURE__ */ D("span", { className: "reader-fab-row-copy", children: [
                        /* @__PURE__ */ b("span", { className: "reader-fab-row-title", children: m.label }),
                        /* @__PURE__ */ b("span", { className: "reader-fab-row-sub", children: E })
                      ] })
                    ]
                  },
                  m.id
                );
              }),
              /* @__PURE__ */ D("div", { className: "reader-fab-section", role: "group", "aria-label": "下载", children: [
                /* @__PURE__ */ D("div", { className: "reader-fab-section-head", children: [
                  /* @__PURE__ */ b(fo, { size: 12, strokeWidth: 2.5, "aria-hidden": !0 }),
                  /* @__PURE__ */ b("span", { children: "下载 PDF" })
                ] }),
                /* @__PURE__ */ b("div", { className: "reader-fab-download-grid", children: w.map((m, T) => {
                  const R = go[m], N = Xe(p[m]), M = c.has(m), E = !!N && !M, P = E ? "" : bo(m, p), I = sc[m];
                  return /* @__PURE__ */ D(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      id: `reader-fab-download-${m}`,
                      className: `reader-fab-chip${M ? " is-busy" : ""}${E ? "" : " is-disabled"}`,
                      disabled: !E,
                      title: E ? `下载${R.label}` : P,
                      onClick: () => void y(m),
                      style: { "--fab-i": T },
                      children: [
                        /* @__PURE__ */ b("span", { className: "reader-fab-chip-icon", "aria-hidden": "true", children: /* @__PURE__ */ b(I, { size: 16, strokeWidth: 2 }) }),
                        /* @__PURE__ */ b("span", { className: "reader-fab-chip-label", children: cc[m] }),
                        /* @__PURE__ */ b("span", { className: "reader-fab-chip-state", children: M ? "…" : E ? "↓" : "—" })
                      ]
                    },
                    m
                  );
                }) }),
                w.every((m) => !Xe(p[m])) ? /* @__PURE__ */ b("p", { className: "reader-fab-empty", children: "产物尚未就绪" }) : null
              ] })
            ]
          }
        ) : null,
        /* @__PURE__ */ b(
          "button",
          {
            type: "button",
            className: `reader-fab-trigger${i ? " is-open" : ""}${e ? " has-active-tool" : ""}`,
            "aria-label": i ? "收起工具菜单" : "打开工具菜单",
            "aria-expanded": i,
            "aria-controls": i ? f : void 0,
            "aria-haspopup": "menu",
            onPointerDown: S,
            onPointerMove: g,
            onPointerUp: v,
            onPointerCancel: v,
            children: /* @__PURE__ */ b("span", { className: "reader-fab-icon", "aria-hidden": "true", children: i ? /* @__PURE__ */ b(Ue, { size: 20, strokeWidth: 2.5 }) : /* @__PURE__ */ D("span", { className: "reader-fab-dots", children: [
              /* @__PURE__ */ b("i", {}),
              /* @__PURE__ */ b("i", {}),
              /* @__PURE__ */ b("i", {})
            ] }) })
          }
        )
      ]
    }
  );
}
function mc({
  userZoom: e,
  onZoomChange: t,
  currentPage: n,
  numPages: r,
  onGoToPage: a,
  mode: o = "compare",
  modeControls: i
}) {
  const s = xa(e), c = e > gr + 1e-3, l = e < br - 1e-3, d = Ze(), u = "50%（半屏，对照铺满）", [f, p] = L(!1), [h, y] = L(`${n}`);
  O(() => {
    f || y(`${Math.min(Math.max(n, 1), Math.max(r, 1))}`);
  }, [n, r, f]);
  const S = () => {
    if (p(!1), !a || r <= 0)
      return;
    const g = Number(`${h}`.trim());
    a(yt(g, r));
  };
  return /* @__PURE__ */ D("div", { className: "reader-react-hud", "data-reader-hud": "true", children: [
    i ? /* @__PURE__ */ b("div", { className: "reader-react-hud-group reader-react-hud-modes", children: i }) : null,
    /* @__PURE__ */ b("div", { className: "reader-react-hud-group", "aria-label": "页码", children: f ? /* @__PURE__ */ D(
      "form",
      {
        className: "reader-react-hud-page-form",
        onSubmit: (g) => {
          g.preventDefault(), S();
        },
        children: [
          /* @__PURE__ */ b(
            "input",
            {
              className: "reader-react-hud-page-input",
              type: "text",
              inputMode: "numeric",
              pattern: "[0-9]*",
              "aria-label": "跳转到页码",
              value: h,
              autoFocus: !0,
              onChange: (g) => y(g.target.value.replace(/[^\d]/g, "")),
              onBlur: S,
              onKeyDown: (g) => {
                g.key === "Escape" && (g.preventDefault(), p(!1), y(`${n}`));
              }
            }
          ),
          /* @__PURE__ */ D("span", { className: "reader-react-hud-page-suffix", children: [
            "/ ",
            r || "—"
          ] })
        ]
      }
    ) : /* @__PURE__ */ b(
      "button",
      {
        type: "button",
        className: "reader-react-hud-page reader-react-hud-page-btn",
        "aria-label": r > 0 ? `跳转页码，当前第 ${n} 页，共 ${r} 页` : "页码",
        title: r > 0 ? "点击输入页码跳转" : void 0,
        disabled: !a || r <= 0,
        onClick: () => {
          !a || r <= 0 || (y(`${n}`), p(!0));
        },
        children: r > 0 ? `${Math.min(n, r)} / ${r}` : "—"
      }
    ) }),
    /* @__PURE__ */ D("div", { className: "reader-react-hud-group", "aria-label": "缩放", children: [
      /* @__PURE__ */ b(
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
      /* @__PURE__ */ D(
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
      /* @__PURE__ */ b(
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
    /* @__PURE__ */ b("div", { className: "reader-react-hud-group reader-react-hud-help", "aria-label": "帮助", children: /* @__PURE__ */ b(nc, {}) })
  ] });
}
function qr(e) {
  const t = `${e.jobId || ""}`.trim(), n = `${e.documentId || ""}`.trim();
  return t ? `retainpdf.reader.notes.v1:job:${t}` : n ? `retainpdf.reader.notes.v1:doc:${n}` : "retainpdf.reader.notes.v1:anonymous";
}
function hc() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function Kr(e) {
  return [...e].sort((t, n) => t.page !== n.page ? t.page - n.page : `${t.createdAt}`.localeCompare(`${n.createdAt}`));
}
function Vr(e) {
  const t = [];
  for (const n of Kr(e)) {
    const r = t[t.length - 1];
    r && r.page === n.page ? r.items.push(n) : t.push({ page: n.page, items: [n] });
  }
  return t;
}
function gc(e, t) {
  const n = e ? `# ${e} · 批注` : "# 批注", r = Vr(t);
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
function bc(e) {
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
function ar(e) {
  if (typeof localStorage > "u")
    return [];
  try {
    return bc(localStorage.getItem(qr(e)));
  } catch {
    return [];
  }
}
function yc(e, t) {
  if (!(typeof localStorage > "u"))
    try {
      localStorage.setItem(qr(e), JSON.stringify(t));
    } catch (n) {
      console.warn("[reader-notes] persist failed", n);
    }
}
function vc(e, t = {}) {
  const n = Y(
    () => ({
      jobId: `${e.jobId || ""}`.trim(),
      documentId: `${e.documentId || ""}`.trim()
    }),
    [e.jobId, e.documentId]
  ), [r, a] = L(() => ar(n)), o = t.onAfterAdd;
  O(() => {
    a(ar(n));
  }, [n.jobId, n.documentId]), O(() => {
    yc(n, r);
  }, [n, r]);
  const i = C((u) => {
    const f = `${u.quote || ""}`.trim();
    if (!f)
      return null;
    const p = {
      id: hc(),
      page: Math.max(1, Math.floor(Number(u.page) || 1)),
      pane: u.pane === "translated" ? "translated" : "source",
      quote: f,
      note: `${u.note || ""}`.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return a((h) => Kr([p, ...h])), o == null || o(), p;
  }, [o]), s = C((u, f) => {
    const p = `${f || ""}`.trim();
    a((h) => h.map((y) => y.id === u ? { ...y, note: p } : y));
  }, []), c = C((u) => {
    a((f) => f.filter((p) => p.id !== u));
  }, []), l = C(async (u = "") => {
    var p, h;
    const f = gc(u, r);
    try {
      return await ((h = (p = navigator.clipboard) == null ? void 0 : p.writeText) == null ? void 0 : h.call(p, f)), !0;
    } catch (y) {
      return console.error("[reader-notes] copy failed", y), !1;
    }
  }, [r]), d = Y(() => Vr(r), [r]);
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
const Ht = "download-toast";
function wc({
  title: e = "下载中",
  status: t = "正在准备...",
  meta: n = "等待响应...",
  percent: r = NaN,
  tone: a = "progress"
}) {
  const o = Number.isFinite(r) ? Math.max(4, Math.min(100, Number(r) || 0)) : 18;
  return /* @__PURE__ */ D("div", { className: "download-toast-card reader-floating-surface", "data-tone": a, "aria-live": "polite", children: [
    /* @__PURE__ */ D("div", { className: "download-toast-head", children: [
      /* @__PURE__ */ b("div", { id: "download-toast-title", className: "download-toast-title", children: e }),
      /* @__PURE__ */ b("div", { id: "download-toast-status", className: "download-toast-status", children: t })
    ] }),
    /* @__PURE__ */ b("div", { className: "download-toast-track", children: /* @__PURE__ */ b("span", { id: "download-toast-bar", className: "download-toast-bar", style: { width: `${o}%` } }) }),
    /* @__PURE__ */ b("div", { id: "download-toast-meta", className: "download-toast-meta", children: n })
  ] });
}
function Sc(e = {}) {
  const {
    visible: t = !1,
    title: n = "下载中",
    status: r = "正在准备...",
    meta: a = "等待响应...",
    percent: o = NaN,
    tone: i = "progress"
  } = e;
  if (!t) {
    Lt.dismiss(Ht);
    return;
  }
  Lt.custom(
    () => /* @__PURE__ */ b(wc, { title: n, status: r, meta: a, percent: o, tone: i }),
    { id: Ht, duration: 1 / 0 }
  );
}
function Ic() {
  const e = C((t) => {
    t && (t.setState = Sc, t.hide = () => Lt.dismiss(Ht));
  }, []);
  return /* @__PURE__ */ D(Jt, { children: [
    /* @__PURE__ */ b(Io, { position: "bottom-right" }),
    /* @__PURE__ */ b("download-toast", { style: { display: "none" }, "aria-hidden": "true", ref: e })
  ] });
}
const xc = Yt(() => import("./ReaderFavoritesPanel-DJVH5Afy.js").then((e) => ({ default: e.ReaderFavoritesPanel }))), Rc = Yt(() => import("./ReaderMarkdownPanel-t-9JdtJD.js").then((e) => ({ default: e.ReaderMarkdownPanel }))), Mc = Yt(() => import("./ReaderAiPanel-CeMNeMh2.js").then((e) => ({ default: e.ReaderAiPanel })));
function At(e) {
  const t = z(!1);
  return e && (t.current = !0), t.current;
}
function Pc(e) {
  return "workspace";
}
function Tc(e, t) {
  return t !== null && e === "compare" ? "source" : e;
}
function ir(e, t) {
  var n, r, a, o;
  return e === "compare" ? null : (t == null ? void 0 : t.assistantPanel) === "markdown" || (t == null ? void 0 : t.assistantPanel) === "ai" ? t.assistantPanel : ((n = t == null ? void 0 : t.splitLayout) == null ? void 0 : n.left) === "ai" || ((r = t == null ? void 0 : t.splitLayout) == null ? void 0 : r.right) === "ai" ? "ai" : ((a = t == null ? void 0 : t.splitLayout) == null ? void 0 : a.left) === "markdown" || ((o = t == null ? void 0 : t.splitLayout) == null ? void 0 : o.right) === "markdown" ? "markdown" : null;
}
function Ec() {
  const e = Ii(), { boot: t, panes: n, shell: r, sessionFiles: a, tools: o, session: i } = e, s = e.sourceOnly || !a.translatedUrl, [c, l] = L(() => ir(e.mode, xe(e.viewStateKey))), [d, u] = L(null), [f, p] = L(null), [h, y] = L(!0), S = z(e.viewStateKey), [g, v] = L(!1), x = C(() => v(!0), []), w = vc(
    { jobId: i.jobId, documentId: i.documentId },
    { onAfterAdd: x }
  ), m = C((A) => {
    w.addFromQuote(A), e.clearSelection();
  }, [w.addFromQuote, e.clearSelection]), T = C((A) => {
    e.goToPage(A.page, A.pane === "translated" ? "translated" : "source");
  }, [e.goToPage]), R = C(
    () => w.exportMarkdown(i.title || ""),
    [w.exportMarkdown, i.title]
  );
  O(() => {
    p(null), y(!0), v(!1);
  }, [e.viewStateKey]), O(() => {
    if (!t.loading) {
      if (S.current !== e.viewStateKey) {
        S.current = e.viewStateKey;
        const A = xe(e.viewStateKey);
        l(ir(e.mode, A)), u(null);
        return;
      }
      on(e.viewStateKey, { assistantPanel: c, splitLayout: null });
    }
  }, [c, t.loading, e.mode, e.viewStateKey]);
  const N = c || (e.mode === "compare" ? "compare" : "reading"), M = c !== null, E = At(o.isOpen("favorites")), P = At(c === "markdown"), I = At(c === "ai"), k = d || Tc(e.mode, c), _ = !!(e.liveTranslationAvailable && h && !M), $ = _ ? "compare" : k, H = C(() => {
    o.close();
  }, [o]), F = C(() => {
    l(null), u(null), p(null);
  }, []), U = C((A) => {
    const ee = $ === "translated" ? "translated" : "source";
    e.jumpToAnchor(A, ee);
  }, [e.jumpToAnchor, $]), B = C((A) => {
    i.refreshCommittedDocument(A);
  }, [i.refreshCommittedDocument]), W = C((A) => {
    o.close(), u(null), A === "compare" && e.liveTranslationAvailable ? y(!0) : A !== "compare" && y(!1), e.setModeKeepingPage(A);
  }, [e.liveTranslationAvailable, e.setModeKeepingPage, o]), Z = C((A) => {
    l(A), A !== "ai" && p(null);
  }, []), G = C((A) => {
    const ee = A.pane === "translated" && !s ? "translated" : "source";
    p(A), l("ai"), u(ee), e.clearSelection();
  }, [e.clearSelection, s]), re = [
    "reader-react-root",
    `is-workspace-${N}`,
    M ? "is-assistant-open" : "",
    _ ? "is-live-translation-pair" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ D("div", { className: re, "data-reader-engine": "react-pdf", "data-reader-workspace": N, children: [
    /* @__PURE__ */ b(Xs, { loading: t.loading, failed: t.failed, text: t.text, percent: t.percent }),
    /* @__PURE__ */ b(Ei, { onBeforeClose: i.prepareClose }),
    /* @__PURE__ */ b(
      os,
      {
        mode: $,
        documentReady: !!i.jobId,
        sourceOnly: s,
        onModeChange: W,
        liveTranslation: e.liveTranslationAvailable ? {
          visible: h,
          state: e.liveTranslation,
          onToggle: () => y((A) => !A)
        } : null
      }
    ),
    /* @__PURE__ */ b(as, { active: c, onSelect: Z, onClose: F }),
    M ? /* @__PURE__ */ b(Hs, {}) : null,
    e.showHud ? /* @__PURE__ */ b(pc, { activeTool: o.active, sourceOnly: e.sourceOnly, onToggleTool: o.toggle, download: e.download }) : null,
    e.showHud ? /* @__PURE__ */ b(
      "div",
      {
        className: "reader-assistant-rail",
        style: { left: 12, right: "auto" },
        role: "group",
        "aria-label": "批注",
        children: /* @__PURE__ */ D(
          "button",
          {
            type: "button",
            className: `reader-assistant-rail-button${g ? " is-active" : ""}`,
            "aria-pressed": g,
            "aria-label": "打开批注",
            title: "批注",
            onClick: () => v((A) => !A),
            children: [
              /* @__PURE__ */ b(Xt, { size: 16, strokeWidth: 2.2, "aria-hidden": !0 }),
              /* @__PURE__ */ D("span", { children: [
                "批注",
                w.count > 0 ? ` ${w.count}` : ""
              ] })
            ]
          }
        )
      }
    ) : null,
    /* @__PURE__ */ b(es, { mode: $, bindShell: r.bindShell, shellEl: r.shellEl, userZoom: e.userZoom, compareMode: $ === "compare", shellWidth: r.shellWidth, compareColWidth: r.compareColWidth, rowHeights: e.rowHeights, mountSource: n.mountSource, mountTranslated: n.mountTranslated, showSource: _ || $ !== "translated", showTranslated: _ || $ === "translated" || $ === "compare", sourceOnly: s, sourceUrl: a.sourceUrl, translatedUrl: a.translatedUrl, sourceFile: a.sourceFile, translatedFile: a.translatedFile, activeRegion: e.activeRegion, regions: i.regions, readerMetadata: i.readerMetadata, onSelectRegion: e.selectRegion, markdownSplit: c === "markdown", assistantSplit: M, onMetrics: n.onMetrics, onNumPagesChange: n.onNumPages, liveTranslation: h ? e.liveTranslation : void 0, liveTranslationPair: _ }),
    e.showHud ? /* @__PURE__ */ b(
      mc,
      {
        userZoom: e.userZoom,
        onZoomChange: e.onZoomChange,
        currentPage: e.currentPage,
        numPages: n.hudNumPages,
        mode: $,
        onGoToPage: e.goToPage,
        modeControls: null
      }
    ) : null,
    /* @__PURE__ */ D(eo, { fallback: null, children: [
      E ? /* @__PURE__ */ b(xc, { open: o.isOpen("favorites"), jobId: i.jobId, documentId: i.documentId, onClose: H, onJumpPage: e.goToPage }) : null,
      P ? /* @__PURE__ */ b(Rc, { open: c === "markdown", jobId: i.jobId, sourceOnly: e.sourceOnly, layout: "workspace", side: "right", onClose: F }) : null,
      I ? /* @__PURE__ */ b(Mc, { open: c === "ai", jobId: i.jobId, documentId: i.documentId, layout: Pc(e.mode), side: "right", selectionContext: f, onClearSelectionContext: () => p(null), onClose: F, onJumpCitation: U, onDocumentCommitted: B }, i.documentId || i.jobId || "reader-ai-pending") : null
    ] }),
    /* @__PURE__ */ b(
      Gs,
      {
        open: g,
        groups: w.groups,
        count: w.count,
        onClose: () => v(!1),
        onJump: T,
        onUpdateNote: w.updateNote,
        onRemove: w.remove,
        onExport: R
      }
    ),
    /* @__PURE__ */ b(Qs, { selection: e.selection, onDismiss: e.clearSelection, onAskAi: G, onAddNote: m }),
    /* @__PURE__ */ b(Ic, {})
  ] });
}
function qc() {
  return /* @__PURE__ */ b(Ec, {});
}
export {
  Zt as A,
  qc as R,
  Ec as a,
  Vs as b,
  Jc as c,
  tt as d,
  Lo as e,
  Hc as f,
  mr as g,
  Wc as h,
  Bc as r
};
//# sourceMappingURL=ReaderApp-D8gLVCsS.js.map
