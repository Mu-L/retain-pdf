// 主页图书馆级 AI 问答：全库 / @ 文档 + 会话列表（侧栏历史）
//
// 组合根。纯逻辑拆到 ../domain/：
// - home-ask-conversation-storage.ts 粘性会话 id 持久化
// - home-ask-scope-prompt.ts         提问范围 prompt 构建 + 合集展开
// - home-ask-message-mapping.ts      服务端消息/工具事件映射
// - home-ask-session.ts              会话列表项映射
// 副作用拆到同目录子 hook：
// - use-home-ask-sessions.ts         历史列表 / hydrate / 切换 / 删除 / 重命名
// - use-home-ask-turn.ts             单轮流式问答运行态
// - use-home-ask-operation-signals.ts Agent 操作信号日志
// 本文件只负责组合，并保持对外导出名/返回形状不变。

import { useCallback, useRef, useState } from "react";
import {
  loadConversationId,
  saveConversationId,
} from "../domain/home-ask-conversation-storage.js";
import type { HomeAskMessage } from "../domain/types.js";
import { useHomeAskOperationSignals } from "./use-home-ask-operation-signals.js";
import { useHomeAskSessions } from "./use-home-ask-sessions.js";
import { useHomeAskTurn } from "./use-home-ask-turn.js";

export type { HomeAskSession } from "../domain/home-ask-session.js";
export type { HomeAgentOperationSignal } from "../domain/home-ask-operation-signal.js";

export function useHomeAskRuntime() {
  const [messages, setMessages] = useState<HomeAskMessage[]>([]);
  const [conversationId, setConversationId] = useState(loadConversationId);
  const [agentRuntime, setAgentRuntime] = useState("");
  const runningRef = useRef(false);
  const conversationIdRef = useRef(conversationId);
  conversationIdRef.current = conversationId;
  // 发一轮请求要知道当前可见路径的末端（挂 parent_id）和某条回答对应的提问
  // （重新生成）。turn 里拿不到 messages 的当前值，和 conversationIdRef 同样用
  // 渲染期赋值的 ref 递过去。
  const messagesRef = useRef<HomeAskMessage[]>(messages);
  messagesRef.current = messages;

  const patchMessage = useCallback((id: string, patch: Partial<HomeAskMessage>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }, []);

  const signals = useHomeAskOperationSignals();
  const sessions = useHomeAskSessions({
    runningRef,
    conversationIdRef,
    messagesLength: messages.length,
    setMessages,
    setConversationId,
    setAgentRuntime,
  });
  const turn = useHomeAskTurn({
    runningRef,
    conversationIdRef,
    messagesRef,
    patchMessage,
    setMessages,
    setConversationId,
    setAgentRuntime,
    enqueueOperationSignal: signals.enqueueOperationSignal,
    refreshSessions: sessions.refreshSessions,
  });

  const newSession = useCallback(() => {
    // 新对话时若正在生成，先中止
    if (runningRef.current) turn.stop();
    turn.resetRunState();
    setMessages([]);
    setConversationId("");
    setAgentRuntime("");
    signals.resetOperationSignals();
    conversationIdRef.current = "";
    saveConversationId("");
  }, [turn.stop, turn.resetRunState, signals.resetOperationSignals]);

  return {
    messages,
    isRunning: turn.isRunning,
    conversationId,
    sessions: sessions.sessions,
    sessionsLoading: sessions.sessionsLoading,
    sessionBusy: sessions.sessionBusy,
    agentRuntime,
    operationSignals: signals.operationSignals,
    send: turn.send,
    stop: turn.stop,
    newSession,
    switchSession: sessions.switchSession,
    removeSession: sessions.removeSession,
    renameSession: sessions.renameSession,
    refreshSessions: sessions.refreshSessions,
    clearChat: newSession,
  };
}
