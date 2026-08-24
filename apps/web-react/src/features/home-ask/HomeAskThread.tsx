import { useEffect, useRef } from "react";
import { BookOpen, FlaskConical, ListTree, Loader2, Sparkles } from "lucide-react";
import { AiMarkdownAnswer } from "@retainpdf/reader/ai";
import "@retainpdf/reader/ai.css";
import type { HomeAskMessage } from "./types.ts";

export const HOME_ASK_SUGGESTIONS: Array<{
  prompt: string;
  label: string;
  icon: typeof BookOpen;
}> = [
  { prompt: "最近入库的文献里，有哪些值得优先阅读的主题？", label: "浏览馆藏主题", icon: BookOpen },
  { prompt: "帮我对比不同文献对同一问题的主要结论。", label: "跨文献对比结论", icon: ListTree },
  { prompt: "有哪些常用的方法或实验设计？", label: "梳理方法模型", icon: FlaskConical },
  { prompt: "用几句话总结图书馆里一篇核心论文。", label: "快速总结一篇", icon: Sparkles },
];

function AssistantBody({ message }: { message: HomeAskMessage }) {
  const streaming = message.status === "streaming";
  const bodyText = `${message.content || ""}`;
  return (
    <AiMarkdownAnswer
      content={bodyText}
      streaming={streaming}
      citations={message.citations || []}
      className="prose prose-sm max-w-none text-sm leading-relaxed"
      streamingClassName="whitespace-pre-wrap"
      pendingClassName="whitespace-pre-wrap"
      finalClassName="whitespace-normal"
    />
  );
}

export type HomeAskThreadProps = {
  messages: HomeAskMessage[];
  isRunning?: boolean;
};

export function HomeAskThread({ messages, isRunning = false }: HomeAskThreadProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const empty = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, isRunning]);

  if (empty) return null;

  return (
    <div className="flex flex-col gap-4 p-4" role="log" aria-live="polite">
      {messages.map((m) => {
        if (m.role === "user") {
          return (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[78%] rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm text-white">{m.content}</div>
            </div>
          );
        }
        const streaming = m.status === "streaming";
        const hasBody = Boolean(m.content?.trim());
        return (
          <div key={m.id} className="flex justify-start">
            <div className="max-w-[85%]">
              {streaming && m.progress ? (
                <div className="mb-1 flex items-center gap-1.5 text-xs text-neutral-500" role="status">
                  <Loader2 className="animate-spin" size={13} strokeWidth={2.4} aria-hidden />
                  <span>{m.progress}</span>
                </div>
              ) : null}
              {streaming && !m.progress && !hasBody ? (
                <div className="mb-1 flex items-center gap-1.5 text-xs text-neutral-500" role="status">
                  <Loader2 className="animate-spin" size={13} strokeWidth={2.4} aria-hidden />
                  <span>思考中…</span>
                </div>
              ) : null}
              {hasBody || m.status === "error" ? (
                <div className={`rounded-2xl border bg-white px-4 py-3 shadow-sm ${m.status === "error" ? "border-red-200 bg-red-50" : "border-neutral-200"}`}>
                  <AssistantBody message={m} />
                  {m.citations && m.citations.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {m.citations.slice(0, 5).map((c, idx) => (
                        <span key={`${c.block_id || c.ref || idx}`} className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-600">
                          [{c.ref ?? idx + 1}] {c.snippet ? `${String(c.snippet).slice(0, 40)}` : c.block_id || ""}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
