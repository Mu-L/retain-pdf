// 从 apps/web 迁入的 React-pdf 视图真值，现为 @retainpdf/reader 主入口
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
} from "./components/react-pdf/index.js";
import type { ReaderAssistantPanel, ReaderWorkspaceMode } from "./components/react-pdf/index.js";
import { DownloadToastHost } from "./shared/react/DownloadToastHost.jsx";
import {
  loadReaderViewState,
  saveReaderViewState,
} from "./shared/state/reader-view-state.js";
import type { ReaderSelection } from "./shared/data/reader-regions.js";

const ReaderFavoritesPanel = lazy(() => import("./components/react-pdf/ReaderFavoritesPanel.js").then((m) => ({ default: m.ReaderFavoritesPanel })));
const ReaderMarkdownPanel = lazy(() => import("./components/react-pdf/ReaderMarkdownPanel.js").then((m) => ({ default: m.ReaderMarkdownPanel })));
const ReaderAiPanel = lazy(() => import("./components/react-pdf/ReaderAiPanel.js").then((m) => ({ default: m.ReaderAiPanel })));
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

  useEffect(() => {
    setAiSelectionContext(null);
    setLiveTranslationVisible(true);
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
  const workspaceView = assistantPanel || (c.mode === "compare" ? "compare" : "reading");
  const assistantOpen = assistantPanel !== null;
  const pdfMode = assistantPdfPane || resolveVisiblePdfMode(c.mode, assistantPanel);
  // Live translation is a dedicated reading workspace: the source remains
  // stable on the left while committed blocks materialize on a source-backed
  // canvas on the right. Markdown/AI splits keep their existing composition.
  const liveTranslationPair = Boolean(
    c.liveTranslationAvailable && liveTranslationVisible && !assistantOpen,
  );
  const visiblePdfMode = liveTranslationPair ? "compare" : pdfMode;
  const closeTool = useCallback(() => { tools.close(); }, [tools]);
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
      {c.showHud ? <ReaderFab activeTool={tools.active} sourceOnly={c.sourceOnly} onToggleTool={tools.toggle} download={c.download} /> : null}
      <ReaderCompareGrid mode={visiblePdfMode} bindShell={shell.bindShell} shellEl={shell.shellEl} userZoom={c.userZoom} compareMode={visiblePdfMode === "compare"} shellWidth={shell.shellWidth} compareColWidth={shell.compareColWidth} rowHeights={c.rowHeights} mountSource={panes.mountSource} mountTranslated={panes.mountTranslated} showSource={liveTranslationPair || visiblePdfMode !== "translated"} showTranslated={liveTranslationPair || visiblePdfMode === "translated" || visiblePdfMode === "compare"} sourceOnly={sourceViewOnly} sourceUrl={sessionFiles.sourceUrl} translatedUrl={sessionFiles.translatedUrl} sourceFile={sessionFiles.sourceFile} translatedFile={sessionFiles.translatedFile} activeRegion={c.activeRegion} regions={session.regions} readerMetadata={session.readerMetadata} onSelectRegion={c.selectRegion} markdownSplit={assistantPanel === "markdown"} assistantSplit={assistantOpen} onMetrics={panes.onMetrics} onNumPagesChange={panes.onNumPages} liveTranslation={liveTranslationVisible ? c.liveTranslation : undefined} liveTranslationPair={liveTranslationPair} />
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
        <ReaderFavoritesPanel open={tools.isOpen("favorites")} jobId={session.jobId} documentId={session.documentId} onClose={closeTool} onJumpPage={c.goToPage} />
        <ReaderMarkdownPanel open={assistantPanel === "markdown"} jobId={session.jobId} sourceOnly={c.sourceOnly} layout="workspace" side="right" onClose={closeAssistant} />
        <ReaderAiPanel key={session.documentId || session.jobId || "reader-ai-pending"} open={assistantPanel === "ai"} jobId={session.jobId} documentId={session.documentId} layout={resolveReaderAiLayout(c.mode)} side="right" selectionContext={aiSelectionContext} onClearSelectionContext={() => setAiSelectionContext(null)} onClose={closeAssistant} onJumpCitation={jumpCitation} onDocumentCommitted={refreshCommittedDocument} />
      </Suspense>
      <ReaderSelectionToolbar selection={c.selection} onDismiss={c.clearSelection} onAskAi={askSelectedRegion} />
      <DownloadToastHost />
    </div>
  );
}
