// 从 frontend/web 迁入的 React-pdf 视图真值，现为 @retainpdf/reader 主入口
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useReaderReactController } from "./hooks/use-reader-react-controller.js";
import {
  ReaderAiSplitResizeHandle,
  ReaderAssistantDock,
  ReaderCloseHome,
  ReaderWorkspaceTabs,
  ReaderReactBoot,
  ReaderCompareGrid,
  ReaderZoomHud,
  ReaderFab,
  ReaderSelectionToolbar,
  ReaderNotesPanel,
} from "./components/react-pdf/index.js";
import type { ReaderAssistantPanel, ReaderWorkspaceMode } from "./components/react-pdf/index.js";
import type { ReaderFabToolId } from "./components/react-pdf/ReaderFab.js";
import { useReaderAnnotations } from "./hooks/use-reader-annotations.js";
import type { ReaderNote } from "./annotations/types.js";
import { DownloadToastHost } from "./shared/react/DownloadToastHost.jsx";
import {
  loadReaderViewState,
  saveReaderViewState,
} from "./shared/state/reader-view-state.js";
import type { ReaderSelection } from "./shared/data/reader-regions.js";
import type { ReaderSelectionNoteInput } from "./components/react-pdf/ReaderSelectionToolbar.js";

const ReaderFavoritesPanel = lazy(() => import("./components/react-pdf/ReaderFavoritesPanel.js").then((m) => ({ default: m.ReaderFavoritesPanel })));
const ReaderMarkdownPanel = lazy(() => import("./components/react-pdf/ReaderMarkdownPanel.js").then((m) => ({ default: m.ReaderMarkdownPanel })));
const ReaderAiPanel = lazy(() => import("./components/react-pdf/ReaderAiPanel.js").then((m) => ({ default: m.ReaderAiPanel })));

/**
 * 「曾经打开过」latch：上面三个面板是 lazy 的，但 lazy() 的动态 import 在组件
 * 挂载时就会触发 —— 无条件渲染(仅用 open 控制显隐)会让分包边界形同虚设，
 * reader 首屏因此白拉整个 AI 面板与 mathjax。
 *
 * 不能改成 `open && <Panel/>` 条件渲染：关闭即卸载会丢掉面板内部状态
 * (AI 会话、滚动位置)。故首次打开后就一直挂载，仅把首次加载推迟到真正需要时。
 *
 * 用 ref 而非 state：取值只会 false→true 单调翻转，且发生在 open 变化已经
 * 触发的那次渲染内，不需要额外再渲染一轮。
 */
function useMountedSinceFirstOpen(open: boolean): boolean {
  const everOpened = useRef(false);
  if (open) {
    everOpened.current = true;
  }
  return everOpened.current;
}

export function resolveReaderAiLayout(_mode: string): "workspace" {
  return "workspace";
}

export function resolveVisiblePdfMode(
  mode: "source" | "compare" | "translated",
  assistantPanel: ReaderAssistantPanel | null,
) {
  return assistantPanel !== null && mode === "compare"
    ? "source"
    : mode;
}

export function resolveInitialAssistantPanel(
  mode: "source" | "compare" | "translated",
  saved: ReturnType<typeof loadReaderViewState>,
): ReaderAssistantPanel | null {
  // A newly opened job always starts in its canonical PDF comparison view.
  if (mode === "compare") return null;
  if (saved?.assistantPanel === "markdown" || saved?.assistantPanel === "ai") {
    return saved.assistantPanel;
  }
  // One-time migration from the former arbitrary two-pane layout.
  if (saved?.splitLayout?.left === "ai" || saved?.splitLayout?.right === "ai") return "ai";
  if (saved?.splitLayout?.left === "markdown" || saved?.splitLayout?.right === "markdown") {
    return "markdown";
  }
  return null;
}

export function ReaderAppReactPdf() {
  const c = useReaderReactController();
  const { boot, panes, shell, sessionFiles, tools, session } = c;
  const sourceViewOnly = c.sourceOnly || !sessionFiles.translatedUrl;
  const [assistantPanel, setAssistantPanel] = useState<ReaderAssistantPanel | null>(() => (
    resolveInitialAssistantPanel(c.mode, loadReaderViewState(c.viewStateKey))
  ));
  const [assistantPdfPane, setAssistantPdfPane] = useState<"source" | "translated" | null>(null);
  const [aiSelectionContext, setAiSelectionContext] = useState<ReaderSelection | null>(null);
  const [liveTranslationVisible, setLiveTranslationVisible] = useState(true);
  const layoutScopeRef = useRef(c.viewStateKey);
  const modeScopeRef = useRef<string | null>(null);

  // 本地批注：选中文字后生成注记，面板内按页分组 / 编辑 / 删除 / 导出。
  const [notesOpen, setNotesOpen] = useState(false);
  const openNotes = useCallback(() => setNotesOpen(true), []);
  const toggleNotes = useCallback(() => setNotesOpen((value) => !value), []);
  const annotations = useReaderAnnotations(
    { jobId: session.jobId, documentId: session.documentId },
    { onAfterAdd: openNotes },
  );
  const addNoteFromSelection = useCallback((input: ReaderSelectionNoteInput) => {
    annotations.addFromQuote(input);
    c.clearSelection();
  }, [annotations.addFromQuote, c.clearSelection]);
  const jumpToNote = useCallback((note: ReaderNote) => {
    c.goToPage(note.page, note.pane === "translated" ? "translated" : "source");
  }, [c.goToPage]);
  const exportNotes = useCallback(
    () => annotations.exportMarkdown(session.title || ""),
    [annotations.exportMarkdown, session.title],
  );

  useEffect(() => {
    setAiSelectionContext(null);
    setLiveTranslationVisible(true);
    setNotesOpen(false);
  }, [c.viewStateKey]);

  useEffect(() => {
    if (boot.loading) return;
    if (layoutScopeRef.current !== c.viewStateKey) {
      layoutScopeRef.current = c.viewStateKey;
      const saved = loadReaderViewState(c.viewStateKey);
      setAssistantPanel(resolveInitialAssistantPanel(c.mode, saved));
      setAssistantPdfPane(null);
      return;
    }
    saveReaderViewState(c.viewStateKey, { assistantPanel, splitLayout: null });
  }, [assistantPanel, boot.loading, c.mode, c.viewStateKey]);

  // 阅读模式恢复/持久化：与 anchor/zoom 对齐。sourceViewOnly 时只允许 source。
  useEffect(() => {
    if (boot.loading || boot.failed) return;
    if (modeScopeRef.current !== c.viewStateKey) {
      modeScopeRef.current = c.viewStateKey;
      const saved = loadReaderViewState(c.viewStateKey);
      const target = sourceViewOnly ? "source" : saved?.mode;
      if (target && target !== c.mode) {
        c.setModeKeepingPage(target);
      }
      return;
    }
    saveReaderViewState(c.viewStateKey, { mode: c.mode });
  }, [boot.failed, boot.loading, c.mode, c.setModeKeepingPage, c.viewStateKey, sourceViewOnly]);
  const workspaceView = assistantPanel || (c.mode === "compare" ? "compare" : "reading");
  const assistantOpen = assistantPanel !== null;
  // 三个 lazy 面板各自的挂载 latch，见 useMountedSinceFirstOpen。
  const favoritesMounted = useMountedSinceFirstOpen(tools.isOpen("favorites"));
  const markdownMounted = useMountedSinceFirstOpen(assistantPanel === "markdown");
  const aiMounted = useMountedSinceFirstOpen(assistantPanel === "ai");
  const pdfMode = assistantPdfPane || resolveVisiblePdfMode(c.mode, assistantPanel);
  // Live translation is a dedicated reading workspace: the source remains
  // stable on the left while committed blocks materialize on a source-backed
  // canvas on the right. Markdown/AI splits keep their existing composition.
  const liveTranslationPair = Boolean(
    c.liveTranslationAvailable && liveTranslationVisible && !assistantOpen,
  );
  const visiblePdfMode = liveTranslationPair ? "compare" : pdfMode;
  const closeTool = useCallback(() => { tools.close(); }, [tools]);
  // 批注作为 FAB 工具项：notesOpen 独立于 tools 的 active，保留与辅助面板并存的能力。
  const handleFabTool = useCallback((id: ReaderFabToolId) => {
    if (id === "notes") {
      toggleNotes();
      return;
    }
    tools.toggle(id);
  }, [toggleNotes, tools]);
  const closeAssistant = useCallback(() => {
    setAssistantPanel(null);
    setAssistantPdfPane(null);
    setAiSelectionContext(null);
  }, []);
  const jumpCitation = useCallback((citation: { page_idx?: number; page?: number; block_id?: string; image_url?: string; snippet?: string; } | number) => {
    const visiblePane = visiblePdfMode === "translated" ? "translated" : "source";
    c.jumpToAnchor(citation, visiblePane);
  }, [c.jumpToAnchor, visiblePdfMode]);
  const refreshCommittedDocument = useCallback((input: { documentId: string; revision: string }) => {
    session.refreshCommittedDocument(input);
  }, [session.refreshCommittedDocument]);
  const changeWorkspace = useCallback((next: ReaderWorkspaceMode) => {
    tools.close();
    setAssistantPdfPane(null);
    // A running translation can provide the compare workspace before the
    // immutable translated PDF exists. Keep the visible workspace and the
    // top-bar selection in sync instead of asking the session mode (which is
    // correctly source-only until the final artifact arrives) to represent
    // this temporary live pair.
    if (next === "compare" && c.liveTranslationAvailable) {
      setLiveTranslationVisible(true);
    } else if (next !== "compare") {
      setLiveTranslationVisible(false);
    }
    c.setModeKeepingPage(next);
  }, [c.liveTranslationAvailable, c.setModeKeepingPage, tools]);

  const selectAssistant = useCallback((next: ReaderAssistantPanel) => {
    setAssistantPanel(next);
    if (next !== "ai") setAiSelectionContext(null);
  }, []);

  const askSelectedRegion = useCallback((selection: ReaderSelection) => {
    const pdf = selection.pane === "translated" && !sourceViewOnly
      ? "translated"
      : "source";
    setAiSelectionContext(selection);
    setAssistantPanel("ai");
    setAssistantPdfPane(pdf);
    c.clearSelection();
  }, [c.clearSelection, sourceViewOnly]);

  const rootClasses = [
    "reader-react-root",
    `is-workspace-${workspaceView}`,
    assistantOpen ? "is-assistant-open" : "",
    liveTranslationPair ? "is-live-translation-pair" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={rootClasses} data-reader-engine="react-pdf" data-reader-workspace={workspaceView}>
      <ReaderReactBoot loading={boot.loading} failed={boot.failed} text={boot.text} percent={boot.percent} />
      <ReaderCloseHome onBeforeClose={session.prepareClose} />
      <ReaderWorkspaceTabs
        mode={visiblePdfMode}
        documentReady={Boolean(session.jobId)}
        sourceOnly={sourceViewOnly}
        onModeChange={changeWorkspace}
        liveTranslation={c.liveTranslationAvailable ? {
          visible: liveTranslationVisible,
          state: c.liveTranslation,
          onToggle: () => setLiveTranslationVisible((visible) => !visible),
        } : null}
      />
      <ReaderAssistantDock active={assistantPanel} onSelect={selectAssistant} onClose={closeAssistant} />
      {assistantOpen ? <ReaderAiSplitResizeHandle /> : null}
      {c.showHud ? <ReaderFab activeTool={notesOpen ? "notes" : tools.active} noteCount={annotations.count} sourceOnly={c.sourceOnly} onToggleTool={handleFabTool} download={c.download} /> : null}
      <ReaderCompareGrid mode={visiblePdfMode} bindShell={shell.bindShell} shellEl={shell.shellEl} userZoom={c.userZoom} compareMode={visiblePdfMode === "compare"} shellWidth={shell.shellWidth} rowHeights={c.rowHeights} mountSource={panes.mountSource} mountTranslated={panes.mountTranslated} showSource={liveTranslationPair || visiblePdfMode !== "translated"} showTranslated={liveTranslationPair || visiblePdfMode === "translated" || visiblePdfMode === "compare"} sourceOnly={sourceViewOnly} sourceUrl={sessionFiles.sourceUrl} translatedUrl={sessionFiles.translatedUrl} sourceFile={sessionFiles.sourceFile} translatedFile={sessionFiles.translatedFile} activeRegion={c.activeRegion} regions={session.regions} readerMetadata={session.readerMetadata} onSelectRegion={c.selectRegion} markdownSplit={assistantPanel === "markdown"} assistantSplit={assistantOpen} onMetrics={panes.onMetrics} onNumPagesChange={panes.onNumPages} liveTranslation={liveTranslationVisible ? c.liveTranslation : undefined} liveTranslationPair={liveTranslationPair} />
      {c.showHud ? (
        <ReaderZoomHud
          userZoom={c.userZoom}
          onZoomChange={c.onZoomChange}
          currentPage={c.currentPage}
          numPages={panes.hudNumPages}
          mode={visiblePdfMode}
          onGoToPage={c.goToPage}
          modeControls={null}
        />
      ) : null}
      <Suspense fallback={null}>
        {favoritesMounted ? <ReaderFavoritesPanel open={tools.isOpen("favorites")} jobId={session.jobId} documentId={session.documentId} onClose={closeTool} onJumpPage={c.goToPage} /> : null}
        {markdownMounted ? <ReaderMarkdownPanel open={assistantPanel === "markdown"} jobId={session.jobId} sourceOnly={c.sourceOnly} layout="workspace" side="right" onClose={closeAssistant} /> : null}
        {aiMounted ? <ReaderAiPanel key={session.documentId || session.jobId || "reader-ai-pending"} open={assistantPanel === "ai"} jobId={session.jobId} documentId={session.documentId} layout={resolveReaderAiLayout(c.mode)} side="right" selectionContext={aiSelectionContext} onClearSelectionContext={() => setAiSelectionContext(null)} onClose={closeAssistant} onJumpCitation={jumpCitation} onDocumentCommitted={refreshCommittedDocument} /> : null}
      </Suspense>
      <ReaderNotesPanel
        open={notesOpen}
        groups={annotations.groups}
        count={annotations.count}
        onClose={() => setNotesOpen(false)}
        onJump={jumpToNote}
        onUpdateNote={annotations.updateNote}
        onRemove={annotations.remove}
        onExport={exportNotes}
      />
      <ReaderSelectionToolbar selection={c.selection} onDismiss={c.clearSelection} onAskAi={askSelectedRegion} onAddNote={addNoteFromSelection} />
      <DownloadToastHost />
    </div>
  );
}
