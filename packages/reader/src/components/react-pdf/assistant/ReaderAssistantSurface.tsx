// RetainPDF-flavoured copy of assistant-ui's official Thread component.
// Keep this file presentational: runtime/backend ownership stays in
// ReaderAssistantThread, while document Markdown and citations remain slots.

import {
  ActionBarPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  type MessageState,
} from "@assistant-ui/react";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Copy,
  FlaskConical,
  GitBranch,
  ListTree,
  Loader2,
  RefreshCw,
  Sparkles,
  Square,
} from "lucide-react";
import {
  MISSING_MODEL_API_KEY_MESSAGE,
  armReaderAiClickShield,
  lockReaderAiNavigation,
  type AiCitationLike,
} from "../../../external.js";
import { AiMarkdownAnswer } from "../../ai/AiMarkdownAnswer.js";
import type { ReaderAskStoreMessage } from "./reader-ask-tree.js";

const SUGGESTIONS = [
  { prompt: "用几句话总结这篇文献的核心内容。", label: "总结本文", icon: BookOpen },
  { prompt: "这篇文献的主要结论是什么？", label: "提炼主要结论", icon: ListTree },
  { prompt: "作者用了什么方法或模型？", label: "梳理方法与模型", icon: FlaskConical },
  { prompt: "有哪些关键结果或数据？", label: "标出关键结果", icon: Sparkles },
] as const;

export type ReaderAssistantSurfaceProps = {
  jobId: string;
  messages: readonly ReaderAskStoreMessage[];
  citationsByMessageId: Record<string, AiCitationLike[]>;
  progressByMessageId: Record<string, string>;
  streamingAssistantId: string;
  isRunning: boolean;
  missingLlmKey: boolean;
  branchBusy: boolean;
  onJumpCitation?: (citation: AiCitationLike) => void;
  onBranchFromAnswer?: (assistantMessageId: string) => void | Promise<boolean | void>;
};

function messageText(message: Pick<MessageState, "content">): string {
  return message.content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

function ThinkingRow({ label }: { label: string }) {
  return (
    <div className="aui-thinking" role="status" aria-live="polite">
      <Loader2 className="aui-spin" size={14} strokeWidth={2.4} aria-hidden />
      <span>{label || "思考中…"}</span>
    </div>
  );
}

function ThreadWelcome({ disabled }: { disabled: boolean }) {
  return (
    <div className="aui-empty">
      <div className="aui-empty-mascot" aria-hidden>
        <span className="aui-empty-mascot-face">
          <Sparkles size={21} strokeWidth={1.9} />
        </span>
      </div>
      <h2 className="aui-empty-title">有什么可以帮你？</h2>
      <p className="aui-empty-sub">仅根据当前文档的 Markdown 回答，引用可以直接跳页</p>
      <div className="aui-suggestions" role="group" aria-label="推荐问题">
        {SUGGESTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <ThreadPrimitive.Suggestion
              key={item.prompt}
              prompt={item.prompt}
              send
              type="button"
              className="aui-suggestion"
              disabled={disabled}
            >
              <Icon size={14} strokeWidth={2} aria-hidden className="aui-suggestion-icon" />
              <span className="aui-suggestion-label">{item.label}</span>
            </ThreadPrimitive.Suggestion>
          );
        })}
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: MessageState }) {
  return (
    <MessagePrimitive.Root className="aui-msg aui-msg-user" data-role="user">
      <div className="aui-msg-bubble">
        <div className="aui-md-plain">{messageText(message)}</div>
      </div>
    </MessagePrimitive.Root>
  );
}

type AssistantMessageProps = {
  jobId: string;
  message: MessageState;
  citations: AiCitationLike[];
  progress: string;
  streaming: boolean;
  branchBusy: boolean;
  onJumpCitation?: (citation: AiCitationLike) => void;
  onBranchFromAnswer?: (assistantMessageId: string) => void | Promise<boolean | void>;
};

function AssistantMessage({
  jobId,
  message,
  citations,
  progress,
  streaming,
  branchBusy,
  onJumpCitation,
  onBranchFromAnswer,
}: AssistantMessageProps) {
  const content = messageText(message);
  return (
    <MessagePrimitive.Root className="aui-msg aui-msg-assistant" data-role="assistant">
      <div className="aui-msg-stack">
        {streaming && progress ? <ThinkingRow label={progress} /> : null}
        {streaming && !progress && !content ? <ThinkingRow label="思考中…" /> : null}
        {content ? (
          <div className="aui-msg-bubble">
            <AiMarkdownAnswer
              content={content}
              streaming={streaming}
              citations={citations}
              jobId={jobId}
              className="aui-md"
              streamingClassName="aui-md-streaming"
              pendingClassName="aui-md-pending"
              finalClassName="aui-md-final"
              onJumpCitation={onJumpCitation}
            />
          </div>
        ) : null}
        <ActionBarPrimitive.Root
          className="aui-msg-actions"
          data-reader-ai-actions=""
          hideWhenRunning
          autohide="not-last"
        >
          <ActionBarPrimitive.Copy className="aui-action-btn" aria-label="复制答案" title="复制答案">
            <Copy size={14} strokeWidth={2.1} aria-hidden />
          </ActionBarPrimitive.Copy>
          {onBranchFromAnswer ? (
            <button
              type="button"
              className="aui-action-btn aui-action-btn-branch"
              aria-label="从这里开新对话"
              title="从这里开新对话"
              disabled={branchBusy}
              onClick={async () => {
                armReaderAiClickShield(1200, { overlayDelayMs: 0 });
                lockReaderAiNavigation(1200);
                await onBranchFromAnswer(message.id);
              }}
            >
              <GitBranch size={14} strokeWidth={2.2} aria-hidden />
            </button>
          ) : null}
          <ActionBarPrimitive.Reload className="aui-action-btn" aria-label="重新生成" title="重新生成">
            <RefreshCw size={14} strokeWidth={2.2} aria-hidden />
          </ActionBarPrimitive.Reload>
        </ActionBarPrimitive.Root>
      </div>
    </MessagePrimitive.Root>
  );
}

function Composer({ isRunning, branchBusy }: { isRunning: boolean; branchBusy: boolean }) {
  return (
    <ComposerPrimitive.Root className="aui-composer" data-reader-ai-composer="">
      <div className="aui-composer-shell">
        <ComposerPrimitive.Input
          className="aui-input"
          rows={1}
          placeholder="询问当前文档…"
          aria-label="向当前文档提问"
          autoFocus
          enterKeyHint="send"
          disabled={branchBusy}
          submitMode="enter"
        />
        <div className="aui-composer-toolbar">
          <span className="aui-composer-chip" title="检索范围">
            <BookOpen size={12} strokeWidth={2.2} aria-hidden />当前文档
          </span>
          <div className="aui-composer-actions">
            {isRunning ? (
              <ComposerPrimitive.Cancel className="aui-send aui-send-stop" aria-label="停止生成">
                <Square size={12} strokeWidth={2.6} aria-hidden />
              </ComposerPrimitive.Cancel>
            ) : (
              <ComposerPrimitive.Send className="aui-send" aria-label="发送">
                <ArrowUp size={16} strokeWidth={2.5} aria-hidden />
              </ComposerPrimitive.Send>
            )}
          </div>
        </div>
      </div>
      <p className="aui-hint">AI 可能会出错，请核对原文与引用</p>
    </ComposerPrimitive.Root>
  );
}

function LockedComposer() {
  return (
    <div className="aui-composer aui-composer-locked" role="alert">
      <p className="aui-llm-lock-msg">{MISSING_MODEL_API_KEY_MESSAGE}</p>
      <p className="aui-hint">请到首页「设置 → API 设置」填写模型 Key 后即可提问</p>
    </div>
  );
}

export function ReaderAssistantSurface({
  jobId,
  messages,
  citationsByMessageId,
  progressByMessageId,
  streamingAssistantId,
  isRunning,
  missingLlmKey,
  branchBusy,
  onJumpCitation,
  onBranchFromAnswer,
}: ReaderAssistantSurfaceProps) {
  const empty = messages.length === 0;
  return (
    <ThreadPrimitive.Root
      className={`aui-thread aui-thread-root${missingLlmKey ? " is-llm-locked" : ""}`}
      data-chat-ui="assistant-ui-official-thread"
    >
      <ThreadPrimitive.Viewport
        className="aui-viewport"
        data-slot="aui_thread-viewport"
        data-reader-ai-viewport="true"
        turnAnchor="top"
        autoScroll
      >
        <div className={`aui-thread-inner${empty ? " is-empty" : ""}`}>
          {empty ? <ThreadWelcome disabled={branchBusy || missingLlmKey} /> : null}
          <div className="aui-message-group" data-slot="aui_message-group">
            <ThreadPrimitive.Messages>
              {({ message }) => {
                if (message.role === "user") return <UserMessage message={message} />;
                if (message.role !== "assistant") return null;
                const streaming = message.status?.type === "running"
                  || (isRunning && streamingAssistantId === message.id);
                return (
                  <AssistantMessage
                    jobId={jobId}
                    message={message}
                    citations={citationsByMessageId[message.id] || []}
                    progress={progressByMessageId[message.id] || ""}
                    streaming={streaming}
                    branchBusy={branchBusy}
                    onJumpCitation={onJumpCitation}
                    onBranchFromAnswer={onBranchFromAnswer}
                  />
                );
              }}
            </ThreadPrimitive.Messages>
          </div>

          <ThreadPrimitive.ViewportFooter className="aui-thread-viewport-footer">
            {!empty && !branchBusy ? (
              <ThreadPrimitive.ScrollToBottom
                className="aui-scroll-bottom-btn aui-scroll-bottom"
                aria-label="滚到最新"
              >
                <ArrowDown size={16} strokeWidth={2.25} aria-hidden />
              </ThreadPrimitive.ScrollToBottom>
            ) : null}
            {missingLlmKey ? <LockedComposer /> : (
              <Composer isRunning={isRunning} branchBusy={branchBusy} />
            )}
          </ThreadPrimitive.ViewportFooter>
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
}
