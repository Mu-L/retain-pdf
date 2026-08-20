// 单页：对齐旧 createManualPageElement + setManualPageSize（固定宽高）
// 对照时 syncedMinHeight 来自 syncReaderPageRows 的 max 高度

import { memo, useEffect, useRef, useState } from "react";
import { Page } from "react-pdf";
import {
  READER_PAGE_SLOT_CLASS,
  type ReaderPaneId,
} from "./reader-dom-contract.js";

const DEFAULT_ASPECT = 1.414;
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
}: PdfPageSlotProps) {
  const slotRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [aspect, setAspect] = useState(DEFAULT_ASPECT);

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

  return (
    <div
      ref={slotRef}
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
                setAspect((prev) => (Math.abs(prev - next) < 0.001 ? prev : next));
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
