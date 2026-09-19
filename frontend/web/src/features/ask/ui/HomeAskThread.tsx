// 主页 AI 消息列表：轻量 markdown 预览 + 引用跳阅读器

import { useCallback, useState } from "react";
import { BookOpen, Check, Copy, FlaskConical, ListTree, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { AiMarkdownAnswer, type AiCitationLike } from "@retainpdf/reader/ai";
import { buildReaderUrl } from "@/platform/navigation/pages.js";
import { navigateToReader } from "@/features/reader/domain.js";
import type { HomeAskCitation, HomeAskMessage } from "../domain/types.js";
import { AgentOperationCard } from "./operations/AgentOperationCard.js";
import type {
  AgentOperationAction,
  AgentOperationEntry,
  AgentOperationPerformOptions,
  AgentOperationView,
  AgentConfirmationMode,
} from "../domain/operations/types.js";

export const HOME_ASK_SUGGESTIONS: Array<{
  prompt: string;
  label: string;
  icon: typeof BookOpen;
}> = [
  {
    prompt: "最近入库的文献里，有哪些值得优先阅读的主题？",
    label: "浏览存档主题",
    icon: BookOpen,
  },
  {
    prompt: "帮我对比不同文献对同一问题的主要结论。",
    label: "跨文献对比结论",
    icon: ListTree,
  },
  {
    prompt: "有哪些常用的方法或实验设计？",
    label: "梳理方法模型",
    icon: FlaskConical,
  },
  {
    prompt: "用几句话总结图书馆里一篇核心论文。",
    label: "快速总结一篇",
    icon: Sparkles,
  },
];

function openCitation(citation: HomeAskCitation) {
  const jobId = `${citation.job_id || ""}`.trim();
  if (!jobId) return;
  const rawPageIdx = citation.page_idx;
  const pageIdx = rawPageIdx !== null && rawPageIdx !== undefined && `${rawPageIdx}`.trim() !== "" && Number.isFinite(Number(rawPageIdx))
    ? Math.max(0, Math.floor(Number(citation.page_idx)))
    : undefined;
  const blockId = `${citation.block_id || ""}`.trim();
  const url = buildReaderUrl(jobId, { page: pageIdx ?? null, blockId });
  if (!url) return;
  navigateToReader(url);
}

function AssistantBody({
  message,
}: {
  message: HomeAskMessage;
}) {
  const streaming = message.status === "streaming";
  const bodyText = `${message.content || ""}`;
  const citations = (message.citations || []) as AiCitationLike[];
  return (
    <AiMarkdownAnswer
      content={bodyText}
      streaming={streaming}
      citations={citations}
      className="home-ask-md"
      streamingClassName="home-ask-md-streaming"
      pendingClassName="home-ask-md-pending"
      finalClassName="home-ask-md-final"
      onJumpCitation={(citation) => openCitation(citation as HomeAskCitation)}
    />
  );
}

export type HomeAskThreadProps = {
  messages: HomeAskMessage[];
  isRunning?: boolean;
  operationsByRequestMessage?: Record<string, AgentOperationEntry[]>;
  loadCandidate?: (operation: AgentOperationView) => Promise<Blob>;
  confirmationMode?: AgentConfirmationMode;
  onOperationAction?: (
    action: AgentOperationAction,
    operation: AgentOperationView,
    options?: AgentOperationPerformOptions,
  ) => void | Promise<void>;
  /** 重新生成/重试:用对应的用户提问重新发一次。 */
  onRegenerate?: (question: string) => void;
};

export function HomeAskThread({
  messages,
  isRunning = false,
  operationsByRequestMessage = {},
  loadCandidate = async () => new Blob(),
  confirmationMode = "explicit",
  onOperationAction = () => {},
  onRegenerate,
}: HomeAskThreadProps) {
  const empty = messages.length === 0;
  // 操作卡片按「触发它的那条请求消息」归位,而不是全部堆在线程最底部。
  // 多轮对话里堆在最后会让人看不出哪张卡对应哪次请求。
  const operationsFor = (requestMessageId: string) => {
    const group = operationsByRequestMessage[requestMessageId] || [];
    const seen = new Set<string>();
    return group.filter((entry) => {
      const id = `${entry.remote.operation_id || ""}`.trim();
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

  // 空态由 HomeAskView 的 hero 区渲染（Notion：问候 + 居中输入 + 建议）
  if (empty) {
    return null;
  }

  return (
    <div className="home-ask-thread" role="log" aria-live="polite">
      {messages.map((m) => {
        if (m.role === "user") {
          return (
            <div key={m.id} className="home-ask-msg home-ask-msg-user">
              <div className="home-ask-msg-bubble">
                <div className="home-ask-md-plain">{m.content}</div>
              </div>
            </div>
          );
        }
        const streaming = m.status === "streaming";
        const hasBody = Boolean(m.content?.trim());
        const failed = m.status === "error";
        // 重新生成要用触发这条回答的那次提问。消息是成对追加的,所以取它前面那条 user。
        const askedIndex = messages.findIndex((item) => item.id === m.id) - 1;
        const askedQuestion = askedIndex >= 0 && messages[askedIndex]?.role === "user"
          ? `${messages[askedIndex].content || ""}`.trim()
          : "";
        const operations = operationsFor(m.id);
        return (
          <div key={m.id} className="home-ask-msg home-ask-msg-assistant">
            {streaming && m.progress ? (
              <div className="home-ask-thinking" role="status">
                <Loader2 className="home-ask-spin" size={13} strokeWidth={2.4} aria-hidden />
                <span>{m.progress}</span>
              </div>
            ) : null}
            {streaming && !m.progress && !hasBody ? (
              <div className="home-ask-thinking" role="status">
                <Loader2 className="home-ask-spin" size={13} strokeWidth={2.4} aria-hidden />
                <span>思考中…</span>
              </div>
            ) : null}
            {hasBody || failed ? (
              <div className={`home-ask-msg-bubble${failed ? " is-error" : ""}`}>
                <AssistantBody message={m} />
              </div>
            ) : null}
            {!streaming && (hasBody || failed) ? (
              <MessageActions
                content={m.content || ""}
                failed={failed}
                canRegenerate={Boolean(askedQuestion) && !isRunning}
                onRegenerate={() => onRegenerate?.(askedQuestion)}
              />
            ) : null}
            {operations.map((entry) => (
              <div key={entry.remote.operation_id} className="home-ask-msg-operation">
                <AgentOperationCard
                  entry={entry}
                  loadCandidate={loadCandidate}
                  confirmationMode={confirmationMode}
                  onAction={onOperationAction}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}


/** 一条回答下面的操作。阅读器那侧早就有复制与重新生成，主页此前一个都没有。 */
function MessageActions({
  content,
  failed,
  canRegenerate,
  onRegenerate,
}: {
  content: string;
  failed: boolean;
  canRegenerate: boolean;
  onRegenerate: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    const text = `${content || ""}`.trim();
    if (!text) return;
    // 剪贴板在非安全上下文或被拒权限时会 reject。复制失败不该让整条消息崩掉,
    // 也不该假装成功——按钮不变成对勾就是没复制上。
    void navigator.clipboard?.writeText(text).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      },
      () => {},
    );
  }, [content]);

  return (
    <div className="home-ask-msg-actions">
      {content.trim() ? (
        <button type="button" className="home-ask-msg-action" onClick={copy} title="复制回答">
          {copied
            ? <Check size={13} strokeWidth={2.2} aria-hidden />
            : <Copy size={13} strokeWidth={2.2} aria-hidden />}
          <span>{copied ? "已复制" : "复制"}</span>
        </button>
      ) : null}
      {canRegenerate ? (
        <button
          type="button"
          className="home-ask-msg-action"
          onClick={onRegenerate}
          title={failed ? "重试这次提问" : "重新生成回答"}
        >
          <RotateCcw size={13} strokeWidth={2.2} aria-hidden />
          <span>{failed ? "重试" : "重新生成"}</span>
        </button>
      ) : null}
    </div>
  );
}
