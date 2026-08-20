// 单页：对齐旧 createManualPageElement + setManualPageSize（固定宽高）
// 对照时 syncedMinHeight 来自 syncReaderPageRows 的 max 高度

import { memo, useEffect, useRef, useState } from "react";
import { Page } from "react-pdf";
import {
  READER_PAGE_SLOT_CLASS,
  type ReaderPaneId,
} from "./reader-dom-contract.js";

export const DEFAULT_ASPECT = 1.414;
const ROOT_MARGIN = "120% 0px";

export type PdfPageSlotProps = {
  pageNumber: number;
  width: number;
  devicePixelRatio: number;
  scrollRoot: HTMLElement | null;
  pane?: ReaderPaneId;
  /** 对照左右同页 max 高度 */
  syncedMinHeight?: number;
  onMetrics?: () => void;
  /** windowed rendering: aspect cache from pane to keep placeholder height correct */
  cachedAspect?: number;
  onAspectChange?: (pageNumber: number, aspect: number) => void;
  /** pane-level windowing sentinel registration (shared observer also handles windowing) */
  sentinelRef?: (el: HTMLDivElement | null) => void;
};

type SharedObserverEntry = {
  observer: IntersectionObserver;
  elements: Map<Element, (isIntersecting: boolean) => void>;
};

const sharedObserverMap = new Map<HTMLElement | null, SharedObserverEntry>();

function getSharedObserver(
  root: HTMLElement | null,
  onIntersect: (isIntersecting: boolean) => void,
  el: Element,
): SharedObserverEntry {
  let entry = sharedObserverMap.get(root);
  if (!entry) {
    const elements = new Map<Element, (isIntersecting: boolean) => void>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const ent of entries) {
          const cb = elements.get(ent.target);
          if (cb) cb(ent.isIntersecting);
        }
      },
      { root, rootMargin: ROOT_MARGIN, threshold: 0 },
    );
    entry = { observer, elements };
    sharedObserverMap.set(root, entry);
  }
  entry.elements.set(el, onIntersect);
  entry.observer.observe(el);
  return entry;
}

function releaseSharedObserver(root: HTMLElement | null, el: Element) {
  const entry = sharedObserverMap.get(root);
  if (!entry) return;
  entry.observer.unobserve(el);
  entry.elements.delete(el);
  if (entry.elements.size === 0) {
    entry.observer.disconnect();
    sharedObserverMap.delete(root);
  }
}

function PdfPageSlotInner({
  pageNumber,
  width,
  devicePixelRatio,
  scrollRoot,
  pane,
  syncedMinHeight = 0,
  onMetrics,
  cachedAspect,
  onAspectChange,
  sentinelRef,
}: PdfPageSlotProps) {
  const slotRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [aspect, setAspect] = useState(cachedAspect ?? DEFAULT_ASPECT);

  // keep local aspect in sync with pane-level cache (e.g. after remount)
  useEffect(() => {
    if (cachedAspect != null && Math.abs(cachedAspect - aspect) >= 0.001) {
      setAspect(cachedAspect);
    }
  }, [cachedAspect]); // eslint-disable-line react-hooks/exhaustive-deps

  const sentinelRefRef = useRef(sentinelRef);
  sentinelRefRef.current = sentinelRef;
  // stable callback ref that merges internal slotRef + pane windowing sentinel registration
  const mergedRefCallback = useRef<(el: HTMLDivElement | null) => void>((el: HTMLDivElement | null) => {
    (slotRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    sentinelRefRef.current?.(el);
  }).current;

  useEffect(() => {
    const el = slotRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    // hysteresis: keep active for a short grace period when leaving viewport
    let deactivateTimer: ReturnType<typeof setTimeout> | null = null;
    const onIntersect = (isIntersecting: boolean) => {
      if (isIntersecting) {
        if (deactivateTimer) {
          clearTimeout(deactivateTimer);
          deactivateTimer = null;
        }
        setActive(true);
      } else {
        // hysteresis to avoid rapid toggle on edge
        if (deactivateTimer) clearTimeout(deactivateTimer);
        deactivateTimer = setTimeout(() => {
          setActive(false);
        }, 120);
      }
    };
    const entry = getSharedObserver(scrollRoot, onIntersect, el);
    return () => {
      if (deactivateTimer) clearTimeout(deactivateTimer);
      releaseSharedObserver(scrollRoot, el);
      // keep observer shared; do not disconnect globally if still has elements
      void entry;
    };
  }, [scrollRoot, pageNumber]);

  // 旧引擎 page 固定 height = viewport * scale
  const naturalHeight = Math.max(120, Math.floor(width * aspect));
  const boxHeight = Math.max(naturalHeight, Math.ceil(syncedMinHeight || 0));

  // notify pane of aspect so placeholder heights stay correct when windowed out
  const handleAspect = (next: number) => {
    setAspect((prev) => {
      if (Math.abs(prev - next) < 0.001) return prev;
      // defer parent notification to avoid setState during render
      const notify = () => onAspectChange?.(pageNumber, next);
      if (typeof queueMicrotask !== "undefined") queueMicrotask(notify);
      else setTimeout(notify, 0);
      return next;
    });
  };

  return (
    <div
      ref={mergedRefCallback}
      data-reader-page={pageNumber}
      data-reader-pane={pane}
      data-natural-height={naturalHeight}
      className={READER_PAGE_SLOT_CLASS}
      style={{
        width,
        height: boxHeight,
        minHeight: boxHeight,
      }}
    >
      {active ? (
        <Page
          pageNumber={pageNumber}
          width={width}
          devicePixelRatio={devicePixelRatio}
          renderTextLayer
          renderAnnotationLayer={false}
          className="reader-react-pdf-page"
          loading={
            <div
              className="reader-react-pdf-page-placeholder"
              style={{ width, height: naturalHeight }}
            />
          }
          onLoadSuccess={(page) => {
            try {
              const viewport = page.getViewport({ scale: 1 });
              if (viewport.width > 0) {
                const next = viewport.height / viewport.width;
                handleAspect(next);
              }
            } catch {
              // ignore
            }
            onMetrics?.();
          }}
          onRenderSuccess={() => {
            onMetrics?.();
          }}
        />
      ) : (
        <div
          className="reader-react-pdf-page-placeholder"
          style={{ width, height: naturalHeight }}
          aria-hidden
        />
      )}
    </div>
  );
}

export const PdfPageSlot = memo(PdfPageSlotInner);
