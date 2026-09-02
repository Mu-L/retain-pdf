// 从 apps/web 迁入的 React-pdf 视图真值，现为 @retainpdf/reader 主入口
import { lazy, Suspense, useCallback } from "react";
import { useReaderReactController } from "./hooks/use-reader-react-controller.js";
import {
  ReaderCloseHome,
  ReaderModeTabs,
  ReaderReactBoot,
  ReaderCompareGrid,
  ReaderZoomHud,
  ReaderFab,
  ReaderSelectionToolbar,
} from "./components/react-pdf/index.js";
import { DownloadToastHost } from "./shared/react/DownloadToastHost.jsx";
import { isReaderAiNavigationLocked } from "./external.js";

const ReaderNotesPanel = lazy(() => import("./components/react-pdf/ReaderNotesPanel.js").then((m) => ({ default: m.ReaderNotesPanel })));
const ReaderFavoritesPanel = lazy(() => import("./components/react-pdf/ReaderFavoritesPanel.js").then((m) => ({ default: m.ReaderFavoritesPanel })));
const ReaderMarkdownPanel = lazy(() => import("./components/react-pdf/ReaderMarkdownPanel.js").then((m) => ({ default: m.ReaderMarkdownPanel })));
const ReaderAiPanel = lazy(() => import("./components/react-pdf/ReaderAiPanel.js").then((m) => ({ default: m.ReaderAiPanel })));
const ReaderAiSplitResizeHandle = lazy(() => import("./components/react-pdf/ReaderAiSplitResizeHandle.js").then((m) => ({ default: m.ReaderAiSplitResizeHandle })));

type ReaderAiLayout = "floating" | "docked";

/**
 * 单文档阅读时让 AI 成为稳定右栏；对照阅读已经有两栏，AI 改为悬浮，
 * 避免把原文和译文同时压成三条窄栏。
 */
export function resolveReaderAiLayout(mode: string): ReaderAiLayout {
  return mode === "compare" ? "floating" : "docked";
}

export function ReaderAppReactPdf() {
  const c = useReaderReactController();
  const { boot, panes, shell, sessionFiles, notes, tools, session } = c;
  const markdownSplitOpen = tools.isOpen("markdown");
  const aiLayout = resolveReaderAiLayout(c.mode);
  const aiSplitOpen = tools.isOpen("ai") && aiLayout === "docked";
  const sourceViewOnly = c.sourceOnly || !sessionFiles.translatedUrl;
  const closeTool = useCallback(() => { tools.close(); }, [tools]);
  const jumpCitation = useCallback((citation: { page_idx?: number; page?: number; block_id?: string; } | number) => {
    if (isReaderAiNavigationLocked()) return;
    c.jumpToAnchor(citation);
  }, [c.jumpToAnchor]);
  const refreshCommittedDocument = useCallback((input: { documentId: string; revision: string }) => {
    session.refreshCommittedDocument(input);
  }, [session.refreshCommittedDocument]);

  return (
    <div className={`reader-react-root${markdownSplitOpen ? " is-markdown-split" : ""}${aiSplitOpen ? " is-ai-split" : ""}`} data-reader-engine="react-pdf">
      <ReaderReactBoot loading={boot.loading} failed={boot.failed} text={boot.text} percent={boot.percent} />
      <ReaderCloseHome onBeforeClose={session.prepareClose} />
      <ReaderModeTabs mode={c.mode} sourceOnly={sourceViewOnly} onModeChange={c.setModeKeepingPage} />
      {c.showHud ? <ReaderFab activeTool={tools.active} notesCount={notes.count} sourceOnly={c.sourceOnly} onToggleTool={tools.toggle} download={c.download} /> : null}
      <ReaderCompareGrid mode={c.mode} bindShell={shell.bindShell} shellEl={shell.shellEl} userZoom={c.userZoom} compareMode={panes.compareMode} shellWidth={shell.shellWidth} compareColWidth={shell.compareColWidth} rowHeights={c.rowHeights} mountSource={panes.mountSource} mountTranslated={panes.mountTranslated} showSource={panes.showSource} showTranslated={panes.showTranslated} sourceOnly={sourceViewOnly} sourceUrl={sessionFiles.sourceUrl} translatedUrl={sessionFiles.translatedUrl} sourceFile={sessionFiles.sourceFile} translatedFile={sessionFiles.translatedFile} activeRegion={c.activeRegion} readerMetadata={session.readerMetadata} markdownSplit={markdownSplitOpen} assistantSplit={aiSplitOpen} onMetrics={panes.onMetrics} onNumPagesChange={panes.onNumPages} />
      {c.showHud ? <ReaderZoomHud userZoom={c.userZoom} onZoomChange={c.onZoomChange} currentPage={c.currentPage} numPages={panes.hudNumPages} mode={c.mode} onGoToPage={c.goToPage} /> : null}
      <Suspense fallback={null}>
        <ReaderNotesPanel open={tools.isOpen("notes")} groups={notes.groups} count={notes.count} onClose={closeTool} onJump={c.jumpToNote} onUpdateNote={notes.updateNote} onRemove={notes.remove} onExport={() => notes.exportMarkdown(c.documentTitle)} />
        <ReaderFavoritesPanel open={tools.isOpen("favorites")} jobId={session.jobId} documentId={session.documentId} onClose={closeTool} onJumpPage={c.goToPage} />
        <ReaderMarkdownPanel open={markdownSplitOpen} jobId={session.jobId} sourceOnly={c.sourceOnly} layout="docked" onClose={closeTool} />
        <ReaderAiPanel key={session.jobId || "reader-ai-pending"} open={tools.isOpen("ai")} jobId={session.jobId} layout={aiLayout} onClose={closeTool} onJumpCitation={jumpCitation} onDocumentCommitted={refreshCommittedDocument} />
        {aiSplitOpen ? <ReaderAiSplitResizeHandle /> : null}
      </Suspense>
      <ReaderSelectionToolbar selection={c.selection} onAddNote={c.addNoteFromSelection} onDismiss={c.clearSelection} />
      <DownloadToastHost />
    </div>
  );
}
