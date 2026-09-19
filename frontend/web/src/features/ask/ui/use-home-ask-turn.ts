// 主页 AI 单轮问答的运行态：abort 控制、流式回调落地、错误/停止收尾。
// 纯编排；消息 patch 与状态 setter 由 runtime 组合层注入。

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  askLibraryAi,
  AiAskError,
  createConversation,
} from "@/platform/api/index.js";
import {
  resolveReaderAiConfig,
  sanitizeAssistantAnswer,
} from "@/features/reader/domain.js";
import { buildHomeAskModelRequestOverrides } from "../domain/home-ask-request-config.js";
import { buildScopedQuestion, resolveScopesForAsk } from "../domain/home-ask-scope-prompt.js";
import { describeToolEvent, findTurnUserMessage } from "../domain/home-ask-message-mapping.js";
import { operationSignalsFromResult } from "../domain/home-ask-operation-signal.js";
import { makeId } from "../domain/home-ask-ids.js";
import { saveConversationId } from "../domain/home-ask-conversation-storage.js";
import type { HomeAskCitation, HomeAskMessage, HomeAskScope } from "../domain/types.js";

type EnqueueOperationSignal = (params: {
  operationId: string;
  conversationId: string;
  dedupeKey: string;
}) => void;

type HomeAskTurnDeps = {
  runningRef: { current: boolean };
  conversationIdRef: { current: string };
  messagesRef: { current: HomeAskMessage[] };
  patchMessage: (id: string, patch: Partial<HomeAskMessage>) => void;
  setMessages: Dispatch<SetStateAction<HomeAskMessage[]>>;
  setConversationId: Dispatch<SetStateAction<string>>;
  setAgentRuntime: Dispatch<SetStateAction<string>>;
  enqueueOperationSignal: EnqueueOperationSignal;
  refreshSessions: () => void | Promise<void>;
};

export function useHomeAskTurn({
  runningRef,
  conversationIdRef,
  messagesRef,
  patchMessage,
  setMessages,
  setConversationId,
  setAgentRuntime,
  enqueueOperationSignal,
  refreshSessions,
}: HomeAskTurnDeps) {
  const [isRunning, setIsRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  /** 当前流式 assistant 消息 id，停止时用于收尾文案 */
  const streamingAssistantIdRef = useRef("");

  // 卸载（如切走 AI Tab）中止在途流式请求：请求跑到结束才释放既浪费，
  // patchMessage 还会写已卸载状态。注意只 abort，不断运行态（重挂载读持久会话）。
  useEffect(() => () => {
    try {
      abortRef.current?.abort();
    } catch {
      /* ignore */
    }
  }, []);

  const stop = useCallback(() => {
    const ctrl = abortRef.current;
    if (!ctrl) return;
    try {
      ctrl.abort();
    } catch {
      /* ignore */
    }
  }, []);

  // 与 send finally 同口径复位运行态；中止是异步落定的，runningRef 卡住会
  // 挡掉紧接着的 send（入口直接 return）。newSession 依赖此复位。
  const resetRunState = useCallback(() => {
    abortRef.current = null;
    streamingAssistantIdRef.current = "";
    runningRef.current = false;
    setIsRunning(false);
  }, [runningRef]);

  const send = useCallback(async (
    rawQuestion: string,
    scopes: HomeAskScope[] = [],
    { regenerateOf = "" }: { regenerateOf?: string } = {},
  ) => {
    const question = `${rawQuestion || ""}`.trim();
    if (!question || runningRef.current) return;

    // 重新生成不是「把同一个问题再问一遍」:服务端在 regenerate 时跳过写入 user 消息，
    // 只把新答案挂到 parent_id 下成为兄弟分支，并把喂给模型的历史截断到 parent
    // （不然模型会看见自己刚被否掉的那一版）。少传 parent_id 就会退化成多一轮重复提问。
    const priorMessages = messagesRef.current;
    const regenerating = Boolean(regenerateOf);
    const parentUser = regenerating
      ? findTurnUserMessage(priorMessages, regenerateOf)
      : null;
    if (regenerating && !parentUser) return;
    // 重新生成失败时把原答案放回去——它在服务端还在（成了兄弟分支），但视图里已经被
    // 换掉了，不还原就等于点一次重试把看得见的答案弄丢了。
    const priorAssistant = regenerating
      ? priorMessages.find((m) => m.id === regenerateOf) || null
      : null;
    const headId = priorMessages.length
      ? `${priorMessages[priorMessages.length - 1].id}`
      : "";

    // 运行配置及密钥以本机后端的 runtime-config 为权威。浏览器里的旧配置
    // 只作为本次请求的可选覆盖；为空时让后端使用安全保存的凭据。
    const config = resolveReaderAiConfig();
    const modelRequestOverrides = buildHomeAskModelRequestOverrides(config);

    const userId = parentUser ? parentUser.id : makeId("u");
    const assistantId = makeId("a");
    const displayUser = scopes.length
      ? `${question}\n\n${scopes.map((s) => (s.kind === "collection" ? `@合集:${s.title}` : `@${s.title}`)).join(" ")}`
      : question;

    // 新请求前中止上一轮
    try {
      abortRef.current?.abort();
    } catch {
      /* ignore */
    }
    const abort = new AbortController();
    abortRef.current = abort;
    streamingAssistantIdRef.current = assistantId;

    runningRef.current = true;
    setIsRunning(true);
    const streamingAssistant: HomeAskMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      progress: regenerating
        ? "正在重新生成…"
        : (scopes.some((s) => s.kind === "collection") ? "正在解析合集…" : "正在准备…"),
      status: "streaming",
      parentId: userId,
    };
    setMessages((prev) => (regenerating
      // 原答案从可见路径上换下来（服务端保留为兄弟分支），而不是在它下面再堆一条。
      ? prev.map((m) => (m.id === regenerateOf ? streamingAssistant : m))
      : [
        ...prev,
        {
          id: userId,
          role: "user",
          content: displayUser,
          status: "complete",
          ...(headId ? { parentId: headId } : {}),
        },
        streamingAssistant,
      ]));

    try {
      const { primaryDoc, resolvedDocs } = await resolveScopesForAsk(scopes);
      if (abort.signal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      if (scopes.some((s) => s.kind === "collection") && resolvedDocs.length === 0) {
        const emptyCol = scopes.find((s) => s.kind === "collection");
        patchMessage(assistantId, {
          content: `合集「${emptyCol?.title || ""}」里暂无文档，请先往合集加入文献后再问。`,
          progress: "",
          status: "error",
          citations: [],
        });
        return;
      }

      // 首轮请求必须先拿到 durable conversation_id。过去依赖 /ai/ask 在
      // done 才回传自动创建的会话；若 Agent 已创建 operation、但浏览器在
      // done 前断线，前端连按哪个 conversation 恢复都不知道。
      let requestConversationId = conversationIdRef.current;
      if (!requestConversationId) {
        const created = await createConversation({
          title: question.replace(/\s+/g, " ").trim().slice(0, 80),
          document_id: primaryDoc?.id || "",
        });
        requestConversationId = `${created?.conversation_id || ""}`.trim();
        if (!requestConversationId) throw new Error("创建 AI 会话失败，请重试。");
        setConversationId(requestConversationId);
        conversationIdRef.current = requestConversationId;
        saveConversationId(requestConversationId);
      }

      // 重新生成要原样重发当轮发过的那串文本。展示用的 content 带着「@标题」后缀，
      // 拿它去发等于把后缀也当成问题的一部分。
      const scopedQuestion = regenerating
        ? `${parentUser?.prompt || parentUser?.content || question}`
        : buildScopedQuestion(question, scopes, resolvedDocs);
      if (!regenerating && scopedQuestion !== displayUser) {
        patchMessage(userId, { prompt: scopedQuestion });
      }
      let answerStarted = false;
      const result = await askLibraryAi({
        question: scopedQuestion,
        documentId: primaryDoc?.id || "",
        jobId: primaryDoc?.job_id || "",
        conversationId: requestConversationId,
        parentId: regenerating ? userId : headId,
        regenerate: regenerating,
        userMessageId: userId,
        assistantMessageId: assistantId,
        ...modelRequestOverrides,
        signal: abort.signal,
        onToolEvent: (event) => {
          if (abort.signal.aborted || answerStarted) return;
          patchMessage(assistantId, {
            progress: describeToolEvent(event),
            status: "streaming",
          });
        },
        onAgentSessionEvent: (event) => {
          const runtime = `${event?.agent_runtime || event?.runtime || ""}`.trim();
          if (runtime) setAgentRuntime(runtime);
        },
        onAgentOperationEvent: (event) => {
          const operationId = `${event?.operation_id || ""}`.trim();
          if (!operationId) return;
          const attempt = Number(event?.current_attempt) || 0;
          const latestSeq = Number(event?.latest_event_seq) || 0;
          enqueueOperationSignal({
            operationId,
            conversationId: `${event?.conversation_id || requestConversationId}`.trim(),
            dedupeKey: `${event?.event_id || `${operationId}:state:${attempt}:${latestSeq}:${event?.status || ""}`}`,
          });
        },
        onAgentConfirmationRequiredEvent: (event) => {
          const operationId = `${event?.operation_id || ""}`.trim();
          if (!operationId) return;
          enqueueOperationSignal({
            operationId,
            conversationId: requestConversationId,
            dedupeKey: `${operationId}:${event?.action || "refresh"}:${Number(event?.current_attempt) || 0}`,
          });
        },
        onAnswerDelta: (fullText: string) => {
          if (abort.signal.aborted) return;
          answerStarted = true;
          const cleaned = sanitizeAssistantAnswer(fullText || "", []);
          const show = cleaned.trim() ? cleaned : `${fullText || ""}`;
          patchMessage(assistantId, {
            content: show,
            progress: "",
            status: "streaming",
          });
        },
      });

      if (abort.signal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }

      const citations = (Array.isArray(result?.citations)
        ? result.citations
        : []) as HomeAskCitation[];
      const answer = sanitizeAssistantAnswer(
        `${result?.answer || ""}`.trim() || "没有找到可用回答。",
        citations,
      );
      const nextConv = `${result?.conversationId || ""}`.trim();
      const resultRuntime = `${result?.agentRuntime || ""}`.trim();
      if (resultRuntime) setAgentRuntime(resultRuntime);
      for (const signal of operationSignalsFromResult(result, requestConversationId)) {
        enqueueOperationSignal(signal);
      }
      if (nextConv) {
        setConversationId(nextConv);
        conversationIdRef.current = nextConv;
        saveConversationId(nextConv);
      }
      patchMessage(assistantId, {
        content: answer,
        citations,
        progress: "",
        status: "complete",
      });
      void refreshSessions();
    } catch (error) {
      const aborted = (
        (error instanceof DOMException && error.name === "AbortError")
        || (error instanceof Error && (
          error.name === "AbortError"
          || /abort/i.test(error.message)
        ))
        || abort.signal.aborted
      );
      if (aborted) {
        // 保留已流式输出的正文，追加「已停止」
        setMessages((prev) => prev.map((m) => {
          if (m.id !== assistantId) return m;
          const partial = `${m.content || ""}`.trim();
          // 重新生成一个字都没出来就被停掉:把原答案放回去，别留一条空壳。
          if (!partial && priorAssistant) return priorAssistant;
          return {
            ...m,
            content: partial
              ? `${partial}\n\n_（已停止生成）_`
              : "_（已停止生成）_",
            progress: "",
            status: "complete" as const,
          };
        }));
      } else {
        const msg = error instanceof AiAskError
          ? error.message
          : error instanceof Error
            ? error.message
            : "生成回答失败，请重试。";
        if (priorAssistant) {
          // 重新生成失败:原答案回位，错误另起一条。把原答案改写成报错等于因为一次
          // 失败的重试就把用户手里已有的回答弄没了。
          setMessages((prev) => prev.flatMap((m) => (m.id === assistantId
            ? [priorAssistant, {
              ...m,
              content: msg,
              progress: "",
              status: "error" as const,
              citations: [],
            }]
            : [m])));
        } else {
          patchMessage(assistantId, {
            content: msg,
            progress: "",
            status: "error",
            citations: [],
          });
        }
      }
    } finally {
      if (abortRef.current === abort) {
        abortRef.current = null;
      }
      streamingAssistantIdRef.current = "";
      runningRef.current = false;
      setIsRunning(false);
    }
  }, [
    conversationIdRef,
    enqueueOperationSignal,
    messagesRef,
    patchMessage,
    refreshSessions,
    runningRef,
    setAgentRuntime,
    setConversationId,
    setMessages,
  ]);

  return { isRunning, send, stop, resetRunState };
}
