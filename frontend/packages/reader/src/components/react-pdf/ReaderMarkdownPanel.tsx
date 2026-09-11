// Markdown 悬浮预览：任务识别/译文 Markdown 产物

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { ChevronDown, ChevronUp, FileCode2, ListTree, Search } from "lucide-react";
import {
  defaultReaderDataPort,
  fetchProtected,
  resolveMarkdownAssetUrl,
} from "../../external.js";
import {
  extractMarkdownMath,
  materializeMarkdownMathFallbackHtml,
  materializeMarkdownMathHtml,
} from "../../shared/content/markdown-math.js";
import { normalizeMarkdownPayload } from "../../shared/data/markdown-payload.js";
import { takeCompleteMarkdownChunk } from "../../shared/content/markdown-windowing.js";
import { ReaderFloatShell } from "./ReaderFloatShell.js";

export type ReaderMarkdownPanelProps = {
  open: boolean;
  jobId: string;
  sourceOnly: boolean;
  layout?: "floating" | "docked" | "workspace";
  side?: "left" | "right";
  onClose: () => void;
};

let markedModulePromise: Promise<typeof import("marked")> | null = null;

function loadMarked() {
  if (!markedModulePromise) {
    markedModulePromise = import("marked").catch((err) => {
      markedModulePromise = null;
      throw err;
    });
  }
  return markedModulePromise;
}

function sanitizeRenderedMarkdown(container: ParentNode) {
  container
    .querySelectorAll("script, iframe, object, embed, style, link, meta, base, form, input, button, textarea, select")
    .forEach((node) => node.remove());
  container.querySelectorAll("*").forEach((node) => {
    for (const attribute of [...(node as Element).attributes]) {
      if (/^on/i.test(attribute.name)) {
        (node as Element).removeAttribute(attribute.name);
      }
    }
  });
  container.querySelectorAll("a[href]").forEach((anchor) => {
    const el = anchor as HTMLAnchorElement;
    if (/^\s*javascript:/i.test(el.getAttribute("href") || "")) {
      el.removeAttribute("href");
    }
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });
}

function mountRenderedMarkdown(
  container: HTMLElement,
  html: string,
  imagesBaseUrl: string,
): HTMLImageElement[] {
  const template = container.ownerDocument.createElement("template");
  template.innerHTML = html;
  sanitizeRenderedMarkdown(template.content);
  template.content.querySelectorAll("img[src]").forEach((img) => {
    const raw = img.getAttribute("src") || "";
    const resolved = resolveMarkdownAssetUrl(imagesBaseUrl, raw) || raw;
    img.setAttribute("data-reader-md-src", resolved);
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
    img.removeAttribute("src");
  });
  container.replaceChildren(template.content);
  container.classList.remove("hidden");
  return [...container.querySelectorAll<HTMLImageElement>("img[data-reader-md-src]")];
}

export function isProtectedMarkdownAssetUrl(value: string, baseUrl = "http://localhost/"): boolean {
  if (/^mock:\/\//i.test(value)) return true;
  try {
    // API payloads normally expose a root-relative images_base_url. A relative URL
    // cannot itself be used as URL's base, so anchor both values to the document
    // origin before deciding whether the image needs the credentialed fetch path.
    const documentBase = globalThis.location?.href || "http://localhost/";
    const trustedBase = new URL(baseUrl, documentBase);
    const url = new URL(value, trustedBase);
    if (!/\/api\/v1\/jobs\/[^/]+\/markdown\/images\//.test(url.pathname)) return false;
    if (!/^[a-z][a-z\d+.-]*:/i.test(value)) return true;
    const isLoopback = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(url.hostname);
    return url.origin === trustedBase.origin || isLoopback;
  } catch {
    return false;
  }
}

export type MarkdownOutlineItem = {
  id: string;
  level: number;
  text: string;
};

function markdownHeadingSlug(text: string): string {
  return text
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "section";
}

export function buildMarkdownOutline(
  container: ParentNode,
  used: Map<string, number> = new Map(),
): MarkdownOutlineItem[] {
  return [...container.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6")]
    .flatMap((heading) => {
      const text = (heading.textContent || "").replace(/\s+/g, " ").trim();
      if (!text) return [];
      const base = markdownHeadingSlug(text);
      const occurrence = (used.get(base) || 0) + 1;
      used.set(base, occurrence);
      const id = occurrence === 1 ? `reader-md-${base}` : `reader-md-${base}-${occurrence}`;
      heading.id = id;
      return [{ id, level: Number(heading.tagName.slice(1)), text }];
    });
}

const MARKDOWN_SEARCH_SELECTOR = "h1, h2, h3, h4, h5, h6, p, li, td, th, blockquote, pre";

export function clearMarkdownSearchHighlights(container: ParentNode): void {
  container
    .querySelectorAll(".reader-markdown-search-hit, .reader-markdown-search-hit-active")
    .forEach((element) => {
      element.classList.remove("reader-markdown-search-hit", "reader-markdown-search-hit-active");
    });
}

export function findMarkdownSearchTargets(container: ParentNode, query: string): HTMLElement[] {
  clearMarkdownSearchHighlights(container);
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return [];
  const candidates = [...container.querySelectorAll<HTMLElement>(MARKDOWN_SEARCH_SELECTOR)];
  const matches = candidates.filter((element) => {
    if ([...element.children].some((child) => child.matches(MARKDOWN_SEARCH_SELECTOR))) return false;
    return (element.textContent || "").toLocaleLowerCase().includes(needle);
  });
  matches.forEach((element) => element.classList.add("reader-markdown-search-hit"));
  return matches;
}

type MarkdownImageProgress = {
  failed: number;
  loaded: number;
  total: number;
};

type ProtectedMarkdownImageLoaderOptions = {
  fetchImage: (url: string, init?: RequestInit) => Promise<Response>;
  onObjectUrl: (url: string) => void;
  onProgress?: (progress: MarkdownImageProgress) => void;
  protectedBaseUrl?: string;
  root?: Element | null;
  /** 外部取消信号：卸载/重来时中止在途的受保护图片请求。 */
  signal?: AbortSignal;
};

/**
 * Direct public images rely on native lazy loading. Protected images cannot set src until
 * their authenticated blob has been fetched, so observe them against the reader scrollport.
 */
export function startMarkdownImageLoading(
  images: HTMLImageElement[],
  options: ProtectedMarkdownImageLoaderOptions,
): () => void {
  let stopped = false;
  let active = 0;
  let loaded = 0;
  let failed = 0;
  const queue: HTMLImageElement[] = [];
  const protectedImages: HTMLImageElement[] = [];
  const queued = new Set<HTMLImageElement>();

  const replaceWithFailure = (img: HTMLImageElement, label: string) => {
    const fallback = img.ownerDocument.createElement("span");
    fallback.className = "reader-markdown-image-missing";
    fallback.textContent = label;
    fallback.title = img.getAttribute("data-reader-md-src") || "";
    img.replaceWith(fallback);
  };

  for (const img of images) {
    const src = img.getAttribute("data-reader-md-src") || "";
    const documentBaseUrl = img.ownerDocument.baseURI || "http://localhost/";
    if (isProtectedMarkdownAssetUrl(src, options.protectedBaseUrl || documentBaseUrl)) {
      protectedImages.push(img);
    } else if (isSafeDirectImageUrl(src, documentBaseUrl)) {
      img.src = src;
    } else {
      replaceWithFailure(img, "[图片地址不可用]");
    }
  }

  const report = () => options.onProgress?.({ failed, loaded, total: protectedImages.length });
  const pump = () => {
    if (stopped) return;
    while (active < 4 && queue.length > 0) {
      const img = queue.shift();
      if (!img?.isConnected) continue;
      active += 1;
      const src = img.getAttribute("data-reader-md-src") || "";
      void options.fetchImage(src, options.signal ? { signal: options.signal } : undefined)
        .then(async (response) => {
          if (!response?.ok) throw new Error(`HTTP ${response?.status || 0}`);
          const objectUrl = URL.createObjectURL(await response.blob());
          if (stopped || !img.isConnected) {
            try { URL.revokeObjectURL(objectUrl); } catch { /* ignore */ }
            return;
          }
          options.onObjectUrl(objectUrl);
          img.src = objectUrl;
          loaded += 1;
        })
        .catch(() => {
          if (stopped || !img.isConnected) return;
          failed += 1;
          replaceWithFailure(img, "[图片暂不可用]");
        })
        .finally(() => {
          active -= 1;
          if (!stopped) {
            report();
            pump();
          }
        });
    }
  };
  const enqueue = (img: HTMLImageElement) => {
    if (stopped || queued.has(img)) return;
    queued.add(img);
    queue.push(img);
    pump();
  };

  const Observer = globalThis.IntersectionObserver;
  let observer: IntersectionObserver | null = null;
  if (Observer && protectedImages.length > 0) {
    observer = new Observer((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target as HTMLImageElement;
        observer?.unobserve(img);
        enqueue(img);
      });
    }, { root: options.root || null, rootMargin: "600px 0px" });
    protectedImages.forEach((img) => observer?.observe(img));
  } else {
    protectedImages.forEach(enqueue);
  }
  report();

  return () => {
    stopped = true;
    queue.length = 0;
    observer?.disconnect();
  };
}

function isSafeDirectImageUrl(value: string, baseUrl: string): boolean {
  if (/^data:image\//i.test(value) || /^blob:/i.test(value)) return true;
  try {
    const url = new URL(value, baseUrl);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function ReaderMarkdownPanel({
  open,
  jobId,
  sourceOnly,
  layout = "floating",
  side = "right",
  onClose,
}: ReaderMarkdownPanelProps) {
  const contentRef = useRef<HTMLElement | null>(null);
  const [status, setStatus] = useState("尚未加载");
  const objectUrlsRef = useRef<string[]>([]);
  const imageLoaderCleanupRef = useRef<(() => void) | null>(null);
  const searchMatchesRef = useRef<HTMLElement[]>([]);
  const searchQueryRef = useRef("");
  // 递增式渲染：目录 id 去重表、每块图片加载清理、滚动续渲染的监听清理。
  const outlineUsedRef = useRef<Map<string, number>>(new Map());
  const chunkImageCleanupsRef = useRef<Array<() => void>>([]);
  const resumeCleanupRef = useRef<(() => void) | null>(null);
  // 搜索/跳转需要整篇：置真后分段渲染器不再因视口暂停，直到全部渲染完。
  const renderAllRef = useRef(false);
  // 目录是否覆盖整篇（未覆盖时 UI 明确提示，避免误导）。
  const outlineCompleteRef = useRef(false);
  // 跳转目标尚未渲染时的待办锚点，续带命中后自动滚动。
  const pendingAnchorRef = useRef<string | null>(null);
  const [outline, setOutline] = useState<MarkdownOutlineItem[]>([]);
  const [outlineComplete, setOutlineComplete] = useState(false);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [pendingResume, setPendingResume] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMatchCount, setSearchMatchCount] = useState(0);
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1);

  const revokeAll = () => {
    for (const url of objectUrlsRef.current) {
      try { URL.revokeObjectURL(url); } catch { /* ignore */ }
    }
    objectUrlsRef.current = [];
  };

  // 回收当前已挂载分块产生的图片加载器 / blob / 滚动续带监听。ETag 变化、
  // 服务端忽略 Range 回整篇、卸载/重开都必须走这里，否则旧图 blob 会泄漏。
  const teardownRenderedContent = () => {
    imageLoaderCleanupRef.current?.();
    imageLoaderCleanupRef.current = null;
    for (const cleanup of chunkImageCleanupsRef.current) cleanup();
    chunkImageCleanupsRef.current = [];
    resumeCleanupRef.current?.();
    resumeCleanupRef.current = null;
    revokeAll();
  };

  // 基于当前已挂载的全部块重算目录，保证打开目录/跳转时覆盖所有已加载内容。
  const rebuildOutline = () => {
    const container = contentRef.current;
    if (!container) return;
    outlineUsedRef.current = new Map();
    setOutline(buildMarkdownOutline(container, outlineUsedRef.current));
  };

  const resolvePendingAnchor = () => {
    const anchorId = pendingAnchorRef.current;
    const container = contentRef.current;
    if (!anchorId || !container) return;
    const target = [...container.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6")]
      .find((heading) => heading.id === anchorId);
    if (!target) return;
    pendingAnchorRef.current = null;
    if (typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  const activateSearchMatch = (index: number, scroll = true) => {
    const matches = searchMatchesRef.current;
    matches.forEach((element) => element.classList.remove("reader-markdown-search-hit-active"));
    if (matches.length === 0) {
      setActiveSearchIndex(-1);
      return;
    }
    const normalized = (index + matches.length) % matches.length;
    const target = matches[normalized];
    target.classList.add("reader-markdown-search-hit-active");
    setActiveSearchIndex(normalized);
    if (scroll && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  };

  const applySearch = (query: string, scroll = false) => {
    const needle = `${query || ""}`.trim();
    // 搜索要覆盖整篇：让分段渲染器解除视口暂停并把剩余块全部渲染；渲染完成后
    // 会再调一次 applySearch 重算匹配。
    renderAllRef.current = needle.length > 0;
    if (renderAllRef.current) resumeCleanupRef.current?.();
    if (!contentRef.current) return;
    const matches = findMarkdownSearchTargets(contentRef.current, query);
    searchMatchesRef.current = matches;
    setSearchMatchCount(matches.length);
    activateSearchMatch(matches.length > 0 ? 0 : -1, scroll);
  };

  useEffect(() => {
    return () => {
      imageLoaderCleanupRef.current?.();
      revokeAll();
    };
  }, []);

  useEffect(() => {
    if (!open) {
      teardownRenderedContent();
      setOutline([]);
      outlineCompleteRef.current = false;
      setOutlineComplete(false);
      return;
    }
    let cancelled = false;
    // 每次重新加载前回收上一轮 blob / 图片 / 滚动监听，避免 jobId 切换/重开时泄漏
    teardownRenderedContent();
    outlineUsedRef.current = new Map();
    outlineCompleteRef.current = false;
    setOutlineComplete(false);
    setOutline([]);
    renderAllRef.current = false;
    pendingAnchorRef.current = null;
    setPendingResume(false);
    // 卸载/重来时中止在途的 Range / 图片请求，避免旧版本结果落地。
    const controller = new AbortController();

    const dataPort: any = defaultReaderDataPort;

    async function load() {
      const isSynthetic = jobId.startsWith("doc:");
      if (!jobId || isSynthetic) {
        // OCR 吸怪：馆藏合成 job(doc:*) 仍提示源文档无 Markdown；但 OCR-only 已通过 active_job_id 落真实 job_id（非合成），此分支不再误拦
        const msg = !jobId && sourceOnly ? "源文档阅读不提供 Markdown 产物" : "该任务暂无 Markdown 产物";
        setStatus(msg);
        if (contentRef.current) {
          contentRef.current.replaceChildren();
          contentRef.current.classList.add("hidden");
        }
        return;
      }
      setStatus("正在加载 Markdown…");
      contentRef.current?.replaceChildren();
      contentRef.current?.classList.add("hidden");

      // ---- 分段读取（真实后端：?raw=true 支持 HTTP Range）----
      // 仅在宿主注入 loadMarkdownSource/fetchMarkdownRange 时启用；mock/旧宿主回退整篇。
      try {
        if (typeof dataPort?.loadMarkdownSource === "function"
          && typeof dataPort?.loadMarkdownRange === "function") {
          const source = await dataPort.loadMarkdownSource(jobId, controller.signal);
          if (cancelled) return;
          if (source?.rawUrl) {
            await loadProgressive(source);
            return;
          }
        }
      } catch {
        // 来源解析失败：回退整篇加载
      }

      // ---- 整篇加载（mock / 旧宿主）----
      try {
        const payload = await defaultReaderDataPort.loadMarkdownPayload(jobId);
        if (cancelled) return;
        const { content, imagesBaseUrl } = normalizeMarkdownPayload(payload);
        if (!content.trim()) {
          setStatus("该任务暂无 Markdown 产物");
          contentRef.current?.replaceChildren();
          contentRef.current?.classList.add("hidden");
          return;
        }
        const { marked } = await loadMarked();
        if (cancelled || !contentRef.current) return;
        const { text: protectedMarkdown, slots } = extractMarkdownMath(content);
        const parsedHtml = String(marked.parse(protectedMarkdown, { async: false }));
        const fastHtml = materializeMarkdownMathFallbackHtml(parsedHtml, slots);
        mountRenderedMarkdown(contentRef.current, fastHtml, imagesBaseUrl);
        setOutline(buildMarkdownOutline(contentRef.current));
        applySearch(searchQueryRef.current);
        setStatus(slots.length > 0 ? `正文已显示 · 正在渲染 ${slots.length} 个公式…` : "");

        const html = slots.length > 0
          ? await materializeMarkdownMathHtml(parsedHtml, slots)
          : parsedHtml;
        if (cancelled || !contentRef.current) return;
        const images = mountRenderedMarkdown(contentRef.current, html, imagesBaseUrl);
        setOutline(buildMarkdownOutline(contentRef.current));
        outlineCompleteRef.current = true;
        setOutlineComplete(true);
        applySearch(searchQueryRef.current);
        setStatus("");
        const scrollRoot = contentRef.current.closest(".reader-notes-panel-body");
        imageLoaderCleanupRef.current = startMarkdownImageLoading(images, {
          root: scrollRoot,
          protectedBaseUrl: imagesBaseUrl || contentRef.current.ownerDocument.baseURI,
          fetchImage: fetchProtected,
          signal: controller.signal,
          onObjectUrl: (url) => objectUrlsRef.current.push(url),
          onProgress: ({ failed }) => {
            if (!cancelled && failed > 0) setStatus(`正文已加载 · ${failed} 张图片不可用`);
          },
        });
      } catch (err) {
        if (cancelled) return;
        setStatus(err instanceof Error ? err.message : "Markdown 加载失败");
      }
    }

    // 分段读取：Range 拉取（单 TextDecoder 跨块解码）→ 按块边界增量渲染 →
    // 滚动到接近底部再续拉/续渲染。这样几百页 md 首屏只解析前几块，不再一次性
    // parse + 挂载整篇。
    async function loadProgressive(source: any) {
      const container = contentRef.current;
      if (!container) return;
      const WINDOW = 262144;
      const MIN_CHUNK = 8192;
      const imagesBaseUrl = `${source.imagesBaseUrl || ""}`;
      const scrollRoot = container.closest(".reader-notes-panel-body") as HTMLElement | null;
      // 不清则重来时残留污染解码状态；不清零则漏掉半截多字节字符。
      let decoder = new TextDecoder();
      let cursor = 0;
      let etag = `${source.etag || ""}`;
      let total: number | null = Number.isFinite(Number(source.totalBytes))
        ? Number(source.totalBytes)
        : null;
      let pending = "";
      let atEof = false;
      // 用户不滚动时不能永久卡住：有限次自动续带（防一次性拉满），超出后保留
      // 明确的「继续加载」入口。
      const MAX_AUTO_RESUME = 4;
      const RESUME_TIMEOUT_MS = 4000;
      let autoResumeCount = 0;

      // ETag 变化 / 回整篇重建前必须回收旧的图片加载器与 blob，否则泄漏。
      const resetRenderedOutput = () => {
        for (const cleanup of chunkImageCleanupsRef.current) cleanup();
        chunkImageCleanupsRef.current = [];
        revokeAll();
        outlineUsedRef.current = new Map();
        setOutline([]);
      };

      const mountChunk = async (markdownChunk: string) => {
        const { marked } = await loadMarked();
        if (cancelled || !contentRef.current) return;
        const { text, slots } = extractMarkdownMath(markdownChunk);
        const parsedHtml = String(marked.parse(text, { async: false }));
        const html = slots.length > 0
          ? await materializeMarkdownMathHtml(parsedHtml, slots)
          : parsedHtml;
        if (cancelled || !contentRef.current) return;
        const section = container.ownerDocument.createElement("section");
        section.className = "reader-markdown-chunk";
        const images = mountRenderedMarkdown(section, html, imagesBaseUrl);
        container.appendChild(section);
        container.classList.remove("hidden");
        const items = buildMarkdownOutline(section, outlineUsedRef.current);
        if (items.length) setOutline((prev) => [...prev, ...items]);
        resolvePendingAnchor();
        const cleanup = startMarkdownImageLoading(images, {
          root: scrollRoot,
          protectedBaseUrl: imagesBaseUrl || container.ownerDocument.baseURI,
          fetchImage: fetchProtected,
          signal: controller.signal,
          onObjectUrl: (url) => objectUrlsRef.current.push(url),
          onProgress: ({ failed }) => {
            if (!cancelled && failed > 0) setStatus(`正文已加载 · ${failed} 张图片不可用`);
          },
        });
        chunkImageCleanupsRef.current.push(cleanup);
      };

      // 已渲染内容超过约两屏时暂停，等用户滚动到接近底部再继续；用户不滚动时
      // 也有限次自动续带（避免永久卡在「正在加载 Markdown…」），超出上限后保留
      // 「继续加载」按钮，绝不无限等待，也不会一次性拉满整篇。
      const pauseIfLongEnough = async () => {
        if (renderAllRef.current || !scrollRoot || cancelled) return;
        if (container.scrollHeight <= scrollRoot.clientHeight * 2) return;
        setPendingResume(true);
        setStatus("已加载部分 · 滚动或点击继续加载");
        await new Promise<void>((resolve) => {
          let settled = false;
          let timer: ReturnType<typeof setTimeout> | null = null;
          const finish = (manual: boolean) => {
            if (settled) return;
            settled = true;
            scrollRoot.removeEventListener("scroll", onScroll);
            if (timer) {
              clearTimeout(timer);
              timer = null;
            }
            resumeCleanupRef.current = null;
            if (!cancelled) {
              setPendingResume(false);
              // 用户主动滚动/点击后续带后，重新给满自动续带额度。
              if (manual) autoResumeCount = 0;
            }
            resolve();
          };
          const onScroll = () => {
            if (container.scrollHeight <= scrollRoot.clientHeight * 2
              || scrollRoot.scrollTop + scrollRoot.clientHeight >= container.scrollHeight - 800) {
              finish(true);
            }
          };
          resumeCleanupRef.current = () => finish(true);
          scrollRoot.addEventListener("scroll", onScroll, { passive: true });
          if (autoResumeCount < MAX_AUTO_RESUME) {
            autoResumeCount += 1;
            timer = setTimeout(() => finish(false), RESUME_TIMEOUT_MS);
          }
        });
      };

      try {
        while (!atEof && !cancelled) {
          const res = await dataPort.loadMarkdownRange(
            source.rawUrl,
            cursor,
            cursor + WINDOW - 1,
            etag || undefined,
            controller.signal,
          );
          if (cancelled) return;
          if (res.status === 404) {
            setStatus("该任务暂无 Markdown 产物");
            container.replaceChildren();
            container.classList.add("hidden");
            return;
          }
          if (res.status === 200) {
            // 服务端忽略了 Range（ETag 变了 / 无 Range 支持）：按整篇重建。
            container.replaceChildren();
            resetRenderedOutput();
            decoder = new TextDecoder();
            pending = decoder.decode(res.bytes, { stream: false });
            atEof = true;
          } else if (res.status === 206) {
            // 段落之间 ETag 变了（文件被就地改写）：已拼内容会是两个版本的混合，
            // 静默错误最危险 —— 直接清零，从 0 重来。
            if (etag && res.etag && res.etag !== etag) {
              container.replaceChildren();
              resetRenderedOutput();
              decoder = new TextDecoder();
              pending = "";
              cursor = 0;
              atEof = false;
              etag = res.etag;
              continue;
            }
            if (!etag && res.etag) etag = res.etag;
            if (res.totalBytes != null) total = res.totalBytes;
            const next = res.rangeEnd != null ? res.rangeEnd + 1 : cursor + res.bytes.length;
            atEof = total != null ? next >= total : res.bytes.length < WINDOW;
            pending += decoder.decode(res.bytes, { stream: !atEof });
            cursor = next;
          } else {
            throw new Error(`读取 Markdown 失败，请稍后重试。(${res.status})`);
          }

          let chunk = takeCompleteMarkdownChunk(pending, { minChars: MIN_CHUNK });
          while (chunk && !cancelled) {
            pending = chunk.rest;
            await mountChunk(chunk.complete);
            if (cancelled) return;
            await pauseIfLongEnough();
            chunk = takeCompleteMarkdownChunk(pending, { minChars: MIN_CHUNK });
          }
          if (atEof && pending.trim()) {
            await mountChunk(pending);
            pending = "";
          }
        }
        if (!cancelled) {
          // 整篇完成后基于全部已加载块重建目录并标记完整，供打开目录/跳转使用。
          rebuildOutline();
          outlineCompleteRef.current = true;
          setOutlineComplete(true);
          resolvePendingAnchor();
          setStatus("");
          // 整篇渲染完成后重算搜索：覆盖之前只渲染部分块时漏掉的命中。
          if (searchQueryRef.current.trim()) applySearch(searchQueryRef.current);
        }
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        setStatus(err instanceof Error ? err.message : "Markdown 加载失败");
      }
    }

    void load();
    return () => {
      cancelled = true;
      // 中止在途 Range / 图片请求；旧结果因 cancelled / signal.aborted 不再落地。
      controller.abort();
      teardownRenderedContent();
      // 中途取消时可能仍持有已创建的 blob，teardown 已回收；此处不直接 revoke
      // 与进行中 Promise 竞争，依赖 cancelled 检查让落点自行 revoke。
    };
  }, [open, jobId, sourceOnly]);

  return (
    <ReaderFloatShell
      id="reader-markdown-panel"
      open={open}
      title="Markdown"
      subtitle={layout === "docked" ? "识别与翻译产出 · PDF / Markdown 分栏" : "识别与翻译产出 · 拖动可移动"}
      titleIcon={<FileCode2 size={14} strokeWidth={2.25} aria-hidden />}
      storageKey="retainpdf.reader.markdown-float.pos.v1"
      ariaLabel="Markdown 预览"
      width={420}
      placement={layout === "workspace" ? "workspace" : layout === "docked" ? "dock-right" : "floating"}
      showHeader={layout !== "workspace"}
      className={layout === "workspace" ? `is-pane-${side}` : undefined}
      onClose={onClose}
      toolbar={(
        <span className="reader-notes-count">{status || "已加载"}</span>
      )}
    >
      <div className="reader-markdown-nav" aria-label="Markdown 导航与搜索">
        <label className="reader-markdown-search">
          <Search size={13} aria-hidden />
          <input
            type="search"
            value={searchQuery}
            placeholder="搜索正文"
            aria-label="搜索 Markdown 正文"
            onChange={(event) => {
              const query = event.target.value;
              searchQueryRef.current = query;
              setSearchQuery(query);
              applySearch(query, false);
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter" || searchMatchCount === 0) return;
              event.preventDefault();
              activateSearchMatch(activeSearchIndex + (event.shiftKey ? -1 : 1));
            }}
          />
          {searchQuery ? (
            <span className="reader-markdown-search-count" aria-live="polite">
              {searchMatchCount > 0 ? `${activeSearchIndex + 1}/${searchMatchCount}` : "0/0"}
            </span>
          ) : null}
          <button
            type="button"
            aria-label="上一个搜索结果"
            disabled={searchMatchCount === 0}
            onClick={() => activateSearchMatch(activeSearchIndex - 1)}
          >
            <ChevronUp size={13} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="下一个搜索结果"
            disabled={searchMatchCount === 0}
            onClick={() => activateSearchMatch(activeSearchIndex + 1)}
          >
            <ChevronDown size={13} aria-hidden />
          </button>
        </label>
        <button
          type="button"
          className="reader-markdown-outline-toggle"
          aria-expanded={outlineOpen}
          disabled={outline.length === 0}
          onClick={() => {
            // 打开目录前重算一次：覆盖所有已挂载块，而非只依赖增量追加。
            rebuildOutline();
            setOutlineComplete(outlineCompleteRef.current);
            setOutlineOpen((value) => !value);
          }}
        >
          <ListTree size={13} aria-hidden />
          目录{outline.length > 0 ? ` ${outline.length}` : ""}
        </button>
        {pendingResume ? (
          <button
            type="button"
            className="reader-markdown-resume"
            onClick={() => resumeCleanupRef.current?.()}
          >
            继续加载
          </button>
        ) : null}
      </div>
      {outlineOpen && outline.length > 0 ? (
        <nav className="reader-markdown-outline" aria-label="Markdown 目录">
          {!outlineComplete ? (
            <p className="reader-markdown-outline-note">仅显示已加载内容，滚动可加载更多</p>
          ) : null}
          {outline.map((item) => (
            <button
              key={item.id}
              type="button"
              style={{ "--reader-md-outline-level": item.level - 1 } as CSSProperties}
              onClick={() => {
                const target = [...(contentRef.current?.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6") || [])]
                  .find((heading) => heading.id === item.id);
                if (target && typeof target.scrollIntoView === "function") {
                  target.scrollIntoView({ block: "start", behavior: "smooth" });
                  return;
                }
                // 目标章节还没渲染：续带整篇并在命中后自动滚动，避免点了没反应。
                pendingAnchorRef.current = item.id;
                renderAllRef.current = true;
                resumeCleanupRef.current?.();
                setStatus("正在加载目标章节…");
              }}
            >
              {item.text}
            </button>
          ))}
        </nav>
      ) : null}
      {status && !contentRef.current?.childNodes?.length ? (
        <p className="reader-notes-empty">{status}</p>
      ) : null}
      <article
        ref={contentRef as RefObject<HTMLElement>}
        id="reader-markdown-content"
        className="reader-markdown-content reader-float-markdown-content"
      />
    </ReaderFloatShell>
  );
}
