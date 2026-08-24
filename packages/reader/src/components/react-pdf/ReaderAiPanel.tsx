// Notion AI 式右侧栏：Markdown 线程 + 会话窗口 + 分支开窗

import { useCallback, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  isReaderAiNavigationLocked,
  type AiCitationLike,
} from "../../external.js";
import { ReaderFloatShell } from "./ReaderFloatShell.js";
import { ReaderAssistantThread } from "./assistant/ReaderAssistantThread.js";
import { ReaderConversationBar } from "./assistant/ReaderConversationBar.js";
import { useReaderAskRuntime } from "./assistant/use-reader-ask-runtime.js";

export type ReaderAiPanelProps = {
  open: boolean;
  jobId: string;
  onClose: () => void;
  /** page_idx 为 0 基；由阅读器 goToPage(page_idx+1) */
  onJumpCitation: (citation: AiCitationLike) => void;
  layout?: "floating" | "docked";
};

export function ReaderAiPanel({
  open,
  jobId,
  onClose,
  onJumpCitation,
  layout = "floating",
}: ReaderAiPanelProps) {
  // 当前问答是 Markdown-only：是否存在译文与 AI 无关。
  // 只要 OCR job 已解析出 Markdown，就应允许输入和问答。
  const enabled = open && Boolean(jobId);
  const {
    citationsByMessageId,
    progressByMessageId,
    contentByMessageId,
    streamingAssistantId,
    isRunning,
    sessions,
    activeConversationId,
    sessionBusy,
    sessionError,
    messages,
    submitQuestion,
    retryAnswer,
    cancelAnswer,
    newSession,
    switchSession,
    removeSession,
    renameSession,
    branchFromAnswer,
  } = useReaderAskRuntime({
    jobId,
    enabled,
  });

  const [branchNotice, setBranchNotice] = useState("");

  const handleBranch = useCallback(async (assistantId: string) => {
    setBranchNotice("");
    const ok = await branchFromAnswer(assistantId);
    if (ok) {
      setBranchNotice(
        "已保存新对话（fork-n-原名）：复制了到此答案的上文，原对话不变。顶部列表可切换。",
      );
      window.setTimeout(() => setBranchNotice(""), 6000);
    }
  }, [branchFromAnswer]);

  // 分支/切会话锁定期内不跳 PDF，避免误触引用
  const safeJumpCitation = useCallback((citation: AiCitationLike) => {
    if (isReaderAiNavigationLocked()) return;
    onJumpCitation(citation);
  }, [onJumpCitation]);

  return (
    <ReaderFloatShell
      id="reader-ai-panel"
      open={open}
      title="RetainPDF AI"
      subtitle="当前文档"
      titleIcon={<Sparkles size={14} strokeWidth={2.1} aria-hidden />}
      storageKey="retainpdf.reader.ai-float.pos.v2"
      ariaLabel="阅读问答"
      width={420}
      placement={layout === "docked" ? "dock-right" : "floating"}
      className={`reader-float-ai is-${layout}${sessionBusy ? " is-session-busy" : ""}`}
      onClose={onClose}
    >
      {!jobId ? (
        <div className="reader-float-ai-empty">
          <Sparkles size={22} strokeWidth={1.75} aria-hidden />
          <p>当前文档还没有可用于问答的 Markdown</p>
          <span>请先完成 OCR 文档解析</span>
        </div>
      ) : (
        <div className="reader-float-ai-body">
          <ReaderConversationBar
            sessions={sessions}
            activeId={activeConversationId}
            busy={sessionBusy}
            errorText={sessionError}
            onSwitch={switchSession}
            onNew={newSession}
            onDelete={removeSession}
            onRename={renameSession}
          />
          {branchNotice ? (
            <div className="aui-session-banner" role="status">
              {branchNotice}
            </div>
          ) : null}
          <div className="reader-float-ai-thread-wrap" aria-busy={sessionBusy || undefined}>
            <ReaderAssistantThread
              jobId={jobId}
              messages={messages}
              citationsByMessageId={citationsByMessageId}
              progressByMessageId={progressByMessageId}
              contentByMessageId={contentByMessageId}
              streamingAssistantId={streamingAssistantId}
              isRunning={isRunning}
              onSubmit={submitQuestion}
              onRetry={retryAnswer}
              onCancel={cancelAnswer}
              onJumpCitation={safeJumpCitation}
              onBranchFromAnswer={handleBranch}
              branchBusy={sessionBusy}
            />
          </div>
        </div>
      )}
    </ReaderFloatShell>
  );
}
