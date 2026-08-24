// Composes full react-pdf reader logic (session → shell → panes → tools → HUD).

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useReaderSession } from "./use-reader-session.js";
import { useReaderKeyboard } from "./use-reader-keyboard.js";
import { useReaderShell } from "./use-reader-shell.js";
import { useReaderPaneModel } from "./use-reader-pane-model.js";
import { useReaderZoom } from "./use-reader-zoom.js";
import { useReaderModeNavigation } from "./use-reader-mode-navigation.js";
import { useReaderAnnotations } from "./use-reader-annotations.js";
import { useReaderTextSelection } from "./use-reader-text-selection.js";
import { useReaderTools, type ReaderToolsApi } from "./use-reader-tools.js";
import { useCurrentPage } from "../pdf/useCurrentPage.js";
import { usePageRowSync } from "../pdf/usePageRowSync.js";
import { useReadingAnchor } from "../pdf/useReadingAnchor.js";
import { useUrlAnchorJump } from "./use-url-anchor-jump.js";
import type { PageRowHeights } from "../pdf/usePageRowSync.js";
import type { ReaderMode, ReaderSessionState } from "./use-reader-session.js";
import type { ProtectedPdfFile } from "../pdf/useProtectedPdfFile.js";
import type { ReaderPaneModel } from "./use-reader-pane-model.js";
import type { ReaderAnnotationsApi } from "./use-reader-annotations.js";
import type { ReaderTextSelection } from "./use-reader-text-selection.js";
import type { ReaderNote } from "../annotations/types.js";
import {
  findReaderRegion,
  regionBoxForPane,
  type ReaderRegion,
} from "../shared/data/reader-regions.js";

export type ReaderAnchorTarget = number | {
  page_idx?: number;
  page?: number;
  block_id?: string;
};

export type ReaderReactController = {
  session: ReaderSessionState;
  boot: ReaderSessionState["boot"];
  sourceOnly: boolean;
  mode: ReaderMode;
  userZoom: number;
  onZoomChange: (zoom: number) => void;
  shell: {
    bindShell: (node: HTMLDivElement | null) => void;
    shellEl: HTMLElement | null;
    shellWidth: number;
    compareColWidth: number;
    shellRef: RefObject<HTMLDivElement | null>;
  };
  panes: ReaderPaneModel;
  sessionFiles: {
    sourceUrl: string;
    translatedUrl: string;
    sourceFile: ProtectedPdfFile | null;
    translatedFile: ProtectedPdfFile | null;
  };
  rowHeights: PageRowHeights;
  currentPage: number;
  goToPage: (page: number) => void;
  activeRegion: ReaderRegion | null;
  jumpToAnchor: (target: ReaderAnchorTarget) => void;
  setModeKeepingPage: (next: ReaderMode) => void;
  showHud: boolean;
  tools: ReaderToolsApi;
  notes: ReaderAnnotationsApi;
  selection: ReaderTextSelection | null;
  clearSelection: () => void;
  addNoteFromSelection: (selection: ReaderTextSelection) => void;
  jumpToNote: (note: ReaderNote) => void;
  documentTitle: string;
  download: ReaderSessionState["download"];
};


export function useReaderReactController(): ReaderReactController {
  const session = useReaderSession();
  const tools = useReaderTools();
  const { shellRef, shellEl, shellWidth, compareColWidth, bindShell } = useReaderShell();
  const { userZoom, onZoomChange } = useReaderZoom(session.mode, shellRef);

  const panes = useReaderPaneModel(
    {
      mode: session.mode,
      sourceOnly: session.sourceOnly,
      assetsReady: session.assetsReady,
      sourceUrl: session.sourceUrl,
      translatedUrl: session.translatedUrl,
      sourceFile: session.sourceFile,
      translatedFile: session.translatedFile,
    },
    { userZoom, shellWidth },
  );

  const {
    beginModeSwitch,
    goToPage: goToPageWithTotal,
    repinIfRestoring,
  } = useReadingAnchor(shellRef, {
    primaryPane: panes.primaryPane,
    mode: session.mode,
    enabled: !session.boot.loading,
  });

  useEffect(() => {
    repinIfRestoring();
  }, [shellWidth, repinIfRestoring]);

  const rowHeights = usePageRowSync(
    shellRef,
    panes.compareMode,
    panes.rowSyncRevision,
    repinIfRestoring,
  );

  const currentPage = useCurrentPage(
    shellRef,
    panes.primaryNumPages,
    !session.boot.loading,
    `${session.mode}-${userZoom}-${panes.metricsTick}`,
    panes.primaryPane,
  );

  const goToPage = useCallback((page: number) => {
    // 取已加载栏的最大页数；未知时传 0，由 clampPageNumber 放行目标页
    const total = Math.max(
      Number(panes.hudNumPages) || 0,
      Number(panes.primaryNumPages) || 0,
      Number(panes.numPagesByPane?.source) || 0,
      Number(panes.numPagesByPane?.translated) || 0,
    );
    goToPageWithTotal(page, total);
  }, [goToPageWithTotal, panes.hudNumPages, panes.primaryNumPages, panes.numPagesByPane]);

  const [activeRegion, setActiveRegion] = useState<ReaderRegion | null>(null);
  const clearRegionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activateRegion = useCallback((region: ReaderRegion | null) => {
    if (clearRegionTimerRef.current) clearTimeout(clearRegionTimerRef.current);
    setActiveRegion(region);
    if (region) {
      clearRegionTimerRef.current = setTimeout(() => setActiveRegion(null), 6000);
    }
  }, []);
  useEffect(() => () => {
    if (clearRegionTimerRef.current) clearTimeout(clearRegionTimerRef.current);
  }, []);

  const resolveBlockPage = useCallback((blockId: string) => {
    const region = findReaderRegion(session.regions, blockId);
    return region ? regionBoxForPane(region, panes.primaryPane).page : null;
  }, [session.regions, panes.primaryPane]);

  const jumpToAnchor = useCallback((target: ReaderAnchorTarget) => {
    const blockId = typeof target === "object" && target
      ? `${target.block_id || ""}`.trim()
      : "";
    const region = findReaderRegion(session.regions, blockId);
    let page: number | null = region
      ? regionBoxForPane(region, panes.primaryPane).page
      : null;
    if (page == null) {
      const raw = typeof target === "number"
        ? target
        : target?.page_idx ?? target?.page;
      if (raw !== undefined && raw !== null && `${raw}`.trim() !== "") {
        const pageIdx = Number(raw);
        if (Number.isFinite(pageIdx) && pageIdx >= 0) page = Math.floor(pageIdx) + 1;
      }
    }
    if (page == null || page < 1) return;
    activateRegion(region);
    goToPage(page);
  }, [activateRegion, goToPage, panes.primaryPane, session.regions]);

  // 收藏 / 搜索回跳：URL ?page_idx= → 页码（0 基 → 1 基）
  useUrlAnchorJump({
    enabled: !session.boot.loading && !session.boot.failed && session.assetsReady,
    numPages: panes.hudNumPages || 0,
    goToPage,
    resolveBlockPage,
    onAnchorApplied: (anchor) => {
      activateRegion(findReaderRegion(session.regions, anchor.blockId));
    },
  });

  const { setModeKeepingPage } = useReaderModeNavigation({
    mode: session.mode,
    setMode: session.setMode,
    beginModeSwitch,
  });

  const openNotes = useCallback(() => {
    tools.open("notes");
  }, [tools]);

  const notes = useReaderAnnotations(
    {
      jobId: session.jobId,
      documentId: session.documentId,
    },
    { onAfterAdd: openNotes },
  );

  const { selection, clearSelection } = useReaderTextSelection(
    shellRef,
    !session.boot.loading && !session.boot.failed,
  );

  const addNoteFromSelection = useCallback((sel: ReaderTextSelection) => {
    notes.addFromQuote({
      page: sel.page,
      pane: sel.pane,
      quote: sel.quote,
    });
    clearSelection();
  }, [notes, clearSelection]);

  const jumpToNote = useCallback((note: ReaderNote) => {
    // 若批注在译文/原文栏，尽量切到对应单栏或对照
    if (note.pane === "translated" && session.mode === "source") {
      beginModeSwitch();
      session.setMode("compare");
    } else if (note.pane === "source" && session.mode === "translated") {
      beginModeSwitch();
      session.setMode("compare");
    }
    goToPage(note.page);
  }, [session, beginModeSwitch, goToPage]);

  const showHud = !session.boot.loading && !session.boot.failed;

  useReaderKeyboard({
    mode: session.mode,
    sourceOnly: session.sourceOnly,
    setMode: setModeKeepingPage,
    userZoom,
    onZoomChange,
    currentPage,
    numPages: panes.hudNumPages,
    goToPage,
    enabled: showHud,
  });

  // tools 对象引用稳定到 active 变化时
  const toolsApi = useMemo(() => tools, [tools.active, tools.open, tools.close, tools.toggle, tools.isOpen]);

  const shellMemo = useMemo(() => ({ bindShell, shellEl, shellWidth, compareColWidth, shellRef }), [bindShell, shellEl, shellWidth, compareColWidth, shellRef]);
  const sessionFilesMemo = useMemo(() => ({
    sourceUrl: session.sourceUrl,
    translatedUrl: session.translatedUrl,
    sourceFile: session.sourceFile,
    translatedFile: session.translatedFile,
  }), [session.sourceUrl, session.translatedUrl, session.sourceFile, session.translatedFile]);

  // 将频繁变化的 currentPage 隔离：主体 shell/panes/tools 等保持稳定，避免滚动时全量重渲染
  const stablePart = useMemo(() => ({
    session,
    boot: session.boot,
    sourceOnly: session.sourceOnly,
    mode: session.mode,
    userZoom,
    onZoomChange,
    shell: shellMemo,
    panes,
    sessionFiles: sessionFilesMemo,
    rowHeights,
    goToPage,
    activeRegion,
    jumpToAnchor,
    setModeKeepingPage,
    download: session.download,
    showHud,
    tools: toolsApi,
    notes,
    selection,
    clearSelection,
    addNoteFromSelection,
    jumpToNote,
    documentTitle: session.title || "",
  }), [session, shellMemo, panes, sessionFilesMemo, rowHeights, goToPage, activeRegion, jumpToAnchor, setModeKeepingPage, showHud, toolsApi, notes, selection, clearSelection, addNoteFromSelection, jumpToNote, userZoom, onZoomChange]);

  return useMemo(() => ({
    ...stablePart,
    currentPage,
  }), [stablePart, currentPage]);
}
