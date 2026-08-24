// Reader 问答编排：会话、流式回答与本地快照。

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  armReaderAiClickShield,
  clearThreadBranchSnapshot,
  createReaderAskAnswerer,
  createReaderMarkdownAnswerer,
  defaultReaderDataPort,
  deleteConversation,
  forkConversationFromPath,
  getConversation,
  listConversations,
  loadStoredConversationId,
  loadThreadBranchSnapshot,
  lockReaderAiNavigation,
  messagesToBranchItems,
  nextForkConversationTitle,
  patchConversation,
  saveThreadBranchSnapshot,
  type AiCitationLike,
  type ConversationRecord,
} from "../../../external.js";
import {
  findMessage,
  pathForBranch,
  snapshotFromTree,
  treeFromSnapshot,
  treeItemsFromBranchItems,
  visibleMessages,
  type ReaderAskStoreMessage,
  type ReaderAskTreeItem,
} from "./reader-ask-tree.js";
import {
  chatMessageToStore,
  lastAssistantMessage,
  storeMessagesToChat,
  useReaderChat,
} from "./use-reader-chat.js";
export type { ReaderAskStoreMessage } from "./reader-ask-tree.js";

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export type ReaderAskSessionSummary = {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
  active: boolean;
};

export function useReaderAskRuntime(options: {
  jobId: string;
  enabled: boolean;
}) {
  const { jobId, enabled } = options;
  const [items, setItems] = useState<ReaderAskTreeItem[]>([]);
  const [headId, setHeadId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ConversationRecord[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [sessionBusy, setSessionBusy] = useState(false);
  const [sessionError, setSessionError] = useState("");
  const itemsRef = useRef(items);
  const headIdRef = useRef(headId);
  const activeConversationIdRef = useRef(activeConversationId);
  const persistReadyRef = useRef(false);
  const lastJobRef = useRef("");
  const documentIdRef = useRef("");
  const switchTokenRef = useRef(0);

  itemsRef.current = items;
  headIdRef.current = headId;
  activeConversationIdRef.current = activeConversationId;

  const remoteAnswerer = useMemo(() => {
    if (!enabled || !jobId) return null;
    return createReaderAskAnswerer({ jobId });
  }, [enabled, jobId]);

  const localAnswerer = useMemo(() => {
    if (!enabled || !jobId) return null;
    return createReaderMarkdownAnswerer({
      loadMarkdownPayload: defaultReaderDataPort.loadMarkdownPayload,
    });
  }, [enabled, jobId]);

  const {
    error: chatError,
    messages: chatMessages,
    regenerate: regenerateChat,
    sendMessage,
    setMessages: setChatMessages,
    status: chatStatus,
    stop: stopChat,
  } = useReaderChat({ jobId, remoteAnswerer, localAnswerer });
  const isRunning = chatStatus === "submitted" || chatStatus === "streaming";
  const runningRef = useRef(isRunning);
  runningRef.current = isRunning;

  const refreshSessions = useCallback(async (documentId = "") => {
    const doc = `${documentId || documentIdRef.current || ""}`.trim();
    if (!doc) {
      setSessions([]);
      return;
    }
    try {
      const res = await listConversations({ document_id: doc, limit: 50 });
      setSessions(res.conversations || []);
    } catch {
      // 列表失败不挡主流程
    }
  }, []);

  const applyConversationTree = useCallback((
    branchItems: ReturnType<typeof messagesToBranchItems>,
    head?: string | null,
  ) => {
    const tree = treeItemsFromBranchItems(branchItems);
    const nextHead = `${head || ""}`.trim()
      || tree[tree.length - 1]?.message.id
      || null;
    setItems(tree);
    setHeadId(nextHead);
    setChatMessages(storeMessagesToChat(visibleMessages(tree, nextHead)));
  }, [setChatMessages]);

  // job 切换 / 面板打开：拉会话列表 + hydrate 消息树
  // 注意：面板关闭时 enabled=false 也会跑 effect；不能用 lastJobRef 在 enabled 翻转时直接 return，
  // 否则「打开面板」永远不会 refreshSessions（用户只能新对话后才看到列表）。
  useEffect(() => {
    if (!jobId) {
      setItems([]);
      setHeadId(null);
      setSessions([]);
      setActiveConversationId("");
      setChatMessages([]);
      activeConversationIdRef.current = "";
      lastJobRef.current = "";
      documentIdRef.current = "";
      persistReadyRef.current = false;
      return;
    }

    const jobChanged = lastJobRef.current !== jobId;
    if (jobChanged) {
      lastJobRef.current = jobId;
      persistReadyRef.current = false;
      setItems([]);
      setHeadId(null);
      setChatMessages([]);
      setSessions([]);
      setActiveConversationId("");
      activeConversationIdRef.current = "";
      documentIdRef.current = "";
    }

    // 面板未打开：只记 job，等 enabled 再拉网
    if (!enabled || !remoteAnswerer) return;

    let cancelled = false;
    void (async () => {
      // 1) 解析 document_id（列表按文档过滤）
      let docId = `${documentIdRef.current || ""}`.trim();
      if (!docId) {
        try {
          docId = `${(await remoteAnswerer.getDocumentId?.()) || ""}`.trim();
        } catch {
          docId = "";
        }
        if (docId) documentIdRef.current = docId;
      }

      // 2) 始终刷新会话列表（打开面板 / 切 job 都要）
      if (!cancelled && docId) {
        await refreshSessions(docId);
      }

      // 3) 消息树：job 刚切换，或当前还是空树时再 hydrate
      const needHydrate = jobChanged || !itemsRef.current.length;
      if (!needHydrate || cancelled) {
        if (!cancelled) persistReadyRef.current = true;
        return;
      }

      const convId =
        loadStoredConversationId({ jobId, documentId: docId })
        || `${remoteAnswerer.getConversationId?.() || ""}`.trim();

      if (convId) {
        setActiveConversationId(convId);
        activeConversationIdRef.current = convId;
        remoteAnswerer.setConversationId?.(convId, docId);
        try {
          const detail = await getConversation(convId);
          if (cancelled) return;
          const branchItems = messagesToBranchItems(detail.messages || []);
          if (branchItems.length) {
            applyConversationTree(branchItems, detail.head_id);
            requestAnimationFrame(() => {
              if (!cancelled) persistReadyRef.current = true;
            });
            return;
          }
        } catch {
          // 网络/404 → 本地快照
        }
      }

      // 无粘性会话：若列表里已有对话，自动挂最近一条，便于直接切换
      if (!cancelled && docId) {
        try {
          const listed = await listConversations({ document_id: docId, limit: 50 });
          if (cancelled) return;
          const rows = listed.conversations || [];
          setSessions(rows);
          const latest = rows[0];
          if (latest?.conversation_id) {
            const latestId = latest.conversation_id;
            setActiveConversationId(latestId);
            activeConversationIdRef.current = latestId;
            remoteAnswerer.setConversationId?.(latestId, docId);
            try {
              const detail = await getConversation(latestId);
              if (cancelled) return;
              applyConversationTree(
                messagesToBranchItems(detail.messages || []),
                detail.head_id,
              );
              requestAnimationFrame(() => {
                if (!cancelled) persistReadyRef.current = true;
              });
              return;
            } catch {
              // fall through to snapshot
            }
          }
        } catch {
          // ignore list failure
        }
      }

      if (cancelled) return;
      const saved = loadThreadBranchSnapshot(jobId, convId);
      if (saved?.items.length) {
        const tree = treeFromSnapshot(saved);
        setItems(tree.items);
        setHeadId(tree.headId);
        setChatMessages(storeMessagesToChat(visibleMessages(tree.items, tree.headId)));
      } else {
        setItems([]);
        setHeadId(null);
        setChatMessages([]);
      }
      requestAnimationFrame(() => {
        if (!cancelled) persistReadyRef.current = true;
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [jobId, enabled, remoteAnswerer, refreshSessions, applyConversationTree, setChatMessages]);

  // 防抖持久化全量树（按会话隔离）
  useEffect(() => {
    if (!jobId || !persistReadyRef.current) return;
    const convId = activeConversationId;
    const timer = window.setTimeout(() => {
      if (!items.length) {
        clearThreadBranchSnapshot(jobId, convId);
        return;
      }
      saveThreadBranchSnapshot(jobId, snapshotFromTree(items, headId), convId);
    }, 280);
    return () => window.clearTimeout(timer);
  }, [jobId, items, headId, activeConversationId]);

  const messages = useMemo(
    () => visibleMessages(items, headId),
    [items, headId],
  );

  const citationsByMessageId = useMemo(() => {
    const map: Record<string, AiCitationLike[]> = {};
    for (const item of items) {
      const m = item.message;
      if (m.role === "assistant" && m.citations?.length) {
        map[m.id] = m.citations as AiCitationLike[];
      }
    }
    return map;
  }, [items]);

  const progressByMessageId = useMemo(() => {
    const map: Record<string, string> = {};
    for (const item of items) {
      const m = item.message;
      if (m.role === "assistant" && m.progress) {
        map[m.id] = m.progress;
      }
    }
    return map;
  }, [items]);

  const contentByMessageId = useMemo(() => {
    const map: Record<string, string> = {};
    for (const item of items) {
      const m = item.message;
      if (m.content) map[m.id] = m.content;
    }
    return map;
  }, [items]);

  // AI SDK owns the streaming message. Mirror only the current linear branch
  // into RetainPDF's persisted tree so branching/session features stay intact.
  useEffect(() => {
    if (!chatMessages.length) return;
    const byId = new Map(chatMessages.map((message) => [message.id, message]));
    setItems((previous) => previous.map((item) => {
      const chatMessage = byId.get(item.message.id);
      if (!chatMessage) return item;
      const next = chatMessageToStore(chatMessage);
      return { ...item, message: { ...item.message, ...next } };
    }));
  }, [chatMessages]);

  useEffect(() => {
    if (!chatError || chatStatus !== "error") return;
    setItems((previous) => previous.map((item) => (
      item.message.status?.type === "running"
        ? {
          ...item,
          message: {
            ...item.message,
            content: item.message.content.trim() || chatError.message || "生成回答失败，请重试。",
            progress: "",
            citations: [],
            status: { type: "incomplete" as const, reason: "error" as const },
          },
        }
        : item
    )));
  }, [chatError, chatStatus]);

  const streamingAssistantId = isRunning
    ? `${lastAssistantMessage(chatMessages)?.id || ""}`
    : "";

  const submitQuestion = useCallback(async (questionInput: string) => {
    if (runningRef.current) return;
    const question = `${questionInput || ""}`.trim();
    if (!question) return;

    const parentId = headIdRef.current;
    const userId = makeId("u");
    const assistantId = makeId("a");

    setItems((prev) => [
      ...prev,
      { parentId, message: { id: userId, role: "user", content: question } },
      {
        parentId: userId,
        message: {
          id: assistantId,
          role: "assistant",
          content: "",
          progress: "正在检索文档…",
          status: { type: "running" },
          citations: [],
        },
      },
    ]);
    setHeadId(assistantId);
    await sendMessage(
      {
        id: userId,
        role: "user",
        parts: [{ type: "text", text: question }],
      },
      {
        body: {
          assistantMessageId: assistantId,
          parentId,
          question,
          regenerate: false,
          userMessageId: userId,
        },
      },
    );
  }, [sendMessage]);

  /** 重新生成：parentId 为被替换助手消息的父节点（通常是 user）。 */
  const retryAnswer = useCallback(async (assistantMessageId: string) => {
    if (runningRef.current) return;
    const tree = itemsRef.current;
    const assistantItem = tree.find(
      (item) => item.message.id === assistantMessageId && item.message.role === "assistant",
    );
    const parentId = assistantItem?.parentId ?? null;
    const parent = parentId ? findMessage(tree, parentId) : null;
    let question = "";
    let userId = parentId;
    if (parent?.role === "user") {
      question = parent.content.trim();
    } else {
      // 兜底：沿可见路径找最后一个 user
      const path = visibleMessages(tree, parentId ?? headIdRef.current);
      for (let i = path.length - 1; i >= 0; i -= 1) {
        if (path[i].role === "user") {
          question = path[i].content.trim();
          userId = path[i].id;
          break;
        }
      }
    }
    if (!question) return;

    const assistantId = makeId("a");
    const branchParent = userId || parentId;
    setItems((prev) => [
      ...prev,
      {
        parentId: branchParent,
        message: {
          id: assistantId,
          role: "assistant",
          content: "",
          progress: "正在重新生成…",
          status: { type: "running" },
          citations: [],
        },
      },
    ]);
    setHeadId(assistantId);
    setChatMessages(storeMessagesToChat(visibleMessages(tree, assistantMessageId)));
    await regenerateChat({
      messageId: assistantMessageId,
      body: {
        assistantMessageId: assistantId,
        parentId: branchParent,
        question,
        regenerate: true,
        userMessageId: userId || "",
      },
    });
  }, [regenerateChat, setChatMessages]);

  const cancelAnswer = useCallback(async () => {
    await stopChat();
    setItems((prev) =>
      prev.map((item) =>
        item.message.status?.type === "running"
          ? {
            ...item,
            message: {
              ...item.message,
              status: { type: "incomplete", reason: "cancelled" as const },
              progress: "",
              content: item.message.content.trim() || "已取消",
            },
          }
          : item,
      ),
    );
  }, [stopChat]);

  /** 新对话窗口：清空气泡，下次 ask 会 auto-create 新 conversation。 */
  const newSession = useCallback(async () => {
    if (sessionBusy) return;
    // AI SDK 统一持有取消控制器；切窗前停止旧流，避免回写新会话。
    if (runningRef.current) await stopChat();
    armReaderAiClickShield(900);
    lockReaderAiNavigation(900);
    setSessionBusy(true);
    setSessionError("");
    const token = ++switchTokenRef.current;
    try {
      await new Promise<void>((r) => {
        window.setTimeout(r, 40);
      });
      if (token !== switchTokenRef.current) return;
      const docId = documentIdRef.current
        || `${(await remoteAnswerer?.getDocumentId?.()) || ""}`.trim();
      documentIdRef.current = docId;
      remoteAnswerer?.clearConversationId?.(docId);
      setActiveConversationId("");
      activeConversationIdRef.current = "";
      setItems([]);
      setHeadId(null);
      setChatMessages([]);
      clearThreadBranchSnapshot(jobId);
      if (docId) await refreshSessions(docId);
    } catch (error) {
      console.warn("[reader-ai] new session failed", error);
      setSessionError("无法创建新对话，请重试。");
    } finally {
      if (token === switchTokenRef.current) setSessionBusy(false);
    }
  }, [jobId, remoteAnswerer, refreshSessions, sessionBusy, setChatMessages, stopChat]);

  /** 切换已有会话窗口。 */
  const switchSession = useCallback(async (conversationId: string) => {
    const id = `${conversationId || ""}`.trim();
    const current =
      activeConversationIdRef.current
      || remoteAnswerer?.getConversationId?.()
      || "";
    if (!id || id === current || sessionBusy) return;

    if (runningRef.current) await stopChat();

    // 短时隔离即可；过长会像「点了没反应 / 乱跳」
    armReaderAiClickShield(1200);
    lockReaderAiNavigation(1200);
    setSessionBusy(true);
    setSessionError("");
    const token = ++switchTokenRef.current;

    // 先切 UI 选中态 + 清空，避免仍显示上一会话内容
    setActiveConversationId(id);
    activeConversationIdRef.current = id;
    setItems([]);
    setHeadId(null);
    setChatMessages([]);

    try {
      await new Promise<void>((r) => {
        window.setTimeout(r, 80);
      });
      if (token !== switchTokenRef.current) return;

      try {
        (globalThis.document?.activeElement as HTMLElement | null)?.blur?.();
      } catch {
        // ignore
      }

      const docId = documentIdRef.current
        || `${(await remoteAnswerer?.getDocumentId?.()) || ""}`.trim();
      documentIdRef.current = docId;

      const detail = await getConversation(id);
      if (token !== switchTokenRef.current) return;

      armReaderAiClickShield(800);
      lockReaderAiNavigation(800);

      const branchItems = messagesToBranchItems(detail.messages || []);
      applyConversationTree(branchItems, detail.head_id);
      remoteAnswerer?.setConversationId?.(id, docId);

      // 本地快照与服务端对齐（按会话隔离）
      if (branchItems.length) {
        const snapshotItems = treeItemsFromBranchItems(branchItems);
        saveThreadBranchSnapshot(
          jobId,
          snapshotFromTree(
            snapshotItems,
            `${detail.head_id || ""}`.trim()
              || snapshotItems.at(-1)?.message.id
              || null,
          ),
          id,
        );
      } else {
        clearThreadBranchSnapshot(jobId, id);
      }

      if (docId) await refreshSessions(docId);

      // assistant-ui ThreadPrimitive.Viewport 管理滚动；这里不再直接操作 DOM。
      armReaderAiClickShield(350);
      lockReaderAiNavigation(350);
    } catch (error) {
      console.warn("[reader-ai] switch session failed", error);
      if (token === switchTokenRef.current) {
        setSessionError("加载该对话失败，请检查网络后重试。");
        // 失败时不要假装已切换：恢复为空，避免展示错会话
        setItems([]);
        setHeadId(null);
      }
    } finally {
      if (token === switchTokenRef.current) setSessionBusy(false);
    }
  }, [
    applyConversationTree,
    jobId,
    remoteAnswerer,
    refreshSessions,
    sessionBusy,
    setChatMessages,
    stopChat,
  ]);

  /**
   * 从某条助手答案「开新对话」：
   * 复制 root→该答案 的历史到新 conversation，原会话原样保留。
   * 之后提问只带新会话上下文，避免原线程被续写污染（ChatGPT Branch in new chat）。
   * @returns 是否成功
   */
  const branchFromAnswer = useCallback(async (assistantMessageId: string): Promise<boolean> => {
    const forkId = `${assistantMessageId || ""}`.trim();
    // 允许在 busy 时排队失败要有提示；生成中也可 fork（先停本地 running）
    if (!forkId) {
      setSessionError("无法分支：消息 id 无效。");
      return false;
    }
    if (sessionBusy) {
      setSessionError("请稍候，当前有会话操作进行中。");
      return false;
    }
    if (runningRef.current) {
      await stopChat();
    }

    const path = pathForBranch(itemsRef.current, forkId, headIdRef.current);
    if (!path.length) {
      setSessionError("无法分支：找不到到此答案的对话路径。");
      return false;
    }
    const last = path[path.length - 1];
    if (last.message.role !== "assistant") {
      setSessionError("只能从助手答案处开新对话。");
      return false;
    }

    setSessionBusy(true);
    setSessionError("");
    try {
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 40);
      });

      let docId = documentIdRef.current
        || `${(await remoteAnswerer?.getDocumentId?.()) || ""}`.trim();
      documentIdRef.current = docId;
      if (!docId) {
        // 再试一次解析
        try {
          docId = `${(await remoteAnswerer?.getDocumentId?.()) || ""}`.trim();
          documentIdRef.current = docId;
        } catch {
          docId = "";
        }
      }
      if (!docId) {
        setSessionError("无法分支：文档未就绪，请稍后重试。");
        return false;
      }

      // 线性化 parent，保证 fork 写入时父子链完整（不依赖可能断裂的旧 parentId）
      const pathPayload = path.map((item, i) => ({
        id: item.message.id,
        role: item.message.role as "user" | "assistant",
        content: item.message.content,
        citations: item.message.citations,
        parentId: i === 0 ? null : path[i - 1].message.id,
      }));

      // 标题：fork-n-xxx（xxx = 当前/原始对话名）
      const currentId =
        activeConversationIdRef.current
        || remoteAnswerer?.getConversationId?.()
        || "";
      const currentRow = (sessions || []).find((s) => s.conversation_id === currentId);
      const firstUser = pathPayload.find((p) => p.role === "user");
      const sourceTitle =
        `${currentRow?.title || ""}`.trim()
        || `${firstUser?.content || ""}`.replace(/\s+/g, " ").trim()
        || "未命名对话";
      const existingTitles = (sessions || []).map((s) => s.title || "");
      const branchTitle = nextForkConversationTitle(sourceTitle, existingTitles);

      // 必须完整 fork 到服务端（含消息），禁止只建空会话
      const forked = await forkConversationFromPath({
        documentId: docId,
        title: branchTitle,
        path: pathPayload,
      });
      const nextItems = treeItemsFromBranchItems(forked.items);
      const nextHead = nextItems[nextItems.length - 1]?.message.id || null;
      const nextConvId = forked.conversation.conversation_id;
      if (!nextConvId || !nextItems.length) {
        throw new Error("fork returned empty conversation");
      }

      armReaderAiClickShield(600);
      lockReaderAiNavigation(600);

      // 切到新会话：原会话仍在列表里可切回
      setItems(nextItems);
      setHeadId(nextHead);
      setChatMessages(storeMessagesToChat(visibleMessages(nextItems, nextHead)));
      setActiveConversationId(nextConvId);
      activeConversationIdRef.current = nextConvId;
      remoteAnswerer?.setConversationId?.(nextConvId, docId);

      // 乐观插入列表（带正确标题与消息数），再 refresh 对齐服务端
      setSessions((prev) => {
        const row: ConversationRecord = {
          conversation_id: nextConvId,
          title: branchTitle,
          document_id: docId,
          created_at: forked.conversation.created_at || new Date().toISOString(),
          updated_at: forked.conversation.updated_at || new Date().toISOString(),
          message_count: nextItems.length,
          head_id: nextHead || "",
        };
        const without = prev.filter((s) => s.conversation_id !== nextConvId);
        return [row, ...without];
      });

      saveThreadBranchSnapshot(
        jobId,
        snapshotFromTree(nextItems, nextHead),
        nextConvId,
      );
      await refreshSessions(docId);

      return true;
    } catch (error) {
      console.warn("[reader-ai] branch from answer failed", error);
      setSessionError("分支失败：未能复制上文到新对话。请检查网络后重试。");
      return false;
    } finally {
      setSessionBusy(false);
    }
  }, [jobId, remoteAnswerer, refreshSessions, sessionBusy, sessions, setChatMessages, stopChat]);

  /** 删除会话（服务端 + 本地快照）；删当前则切到最近一条或空窗。 */
  const removeSession = useCallback(async (conversationId: string) => {
    const id = `${conversationId || ""}`.trim();
    if (!id || sessionBusy) return;
    if (runningRef.current) await stopChat();
    setSessionBusy(true);
    setSessionError("");
    const token = ++switchTokenRef.current;
    try {
      const docId = documentIdRef.current
        || `${(await remoteAnswerer?.getDocumentId?.()) || ""}`.trim();
      documentIdRef.current = docId;

      try {
        await deleteConversation(id);
      } catch (error) {
        const status = Number((error as { status?: number })?.status) || 0;
        if (status !== 404) throw error;
      }
      clearThreadBranchSnapshot(jobId, id);

      const current =
        activeConversationIdRef.current
        || remoteAnswerer?.getConversationId?.()
        || "";
      const deletingActive = current === id;

      setSessions((prev) => prev.filter((s) => s.conversation_id !== id));

      if (deletingActive) {
        remoteAnswerer?.clearConversationId?.(docId);
        setActiveConversationId("");
        activeConversationIdRef.current = "";
        setItems([]);
        setHeadId(null);
        setChatMessages([]);
        clearThreadBranchSnapshot(jobId);

        const list = docId
          ? ((await listConversations({ document_id: docId, limit: 50 }).catch(
            () => ({ conversations: [] as ConversationRecord[] }),
          )).conversations || [])
          : [];
        if (token !== switchTokenRef.current) return;
        setSessions(list);

        const next = list[0];
        if (next?.conversation_id) {
          const nextId = next.conversation_id;
          setActiveConversationId(nextId);
          activeConversationIdRef.current = nextId;
          try {
            const detail = await getConversation(nextId);
            if (token !== switchTokenRef.current) return;
            applyConversationTree(
              messagesToBranchItems(detail.messages || []),
              detail.head_id,
            );
            remoteAnswerer?.setConversationId?.(nextId, docId);
          } catch {
            setItems([]);
            setHeadId(null);
          }
        }
      } else if (docId) {
        await refreshSessions(docId);
      }
    } catch (error) {
      console.warn("[reader-ai] delete session failed", error);
      setSessionError("删除对话失败，请重试。");
    } finally {
      if (token === switchTokenRef.current) setSessionBusy(false);
    }
  }, [applyConversationTree, jobId, remoteAnswerer, refreshSessions, sessionBusy, setChatMessages, stopChat]);

  /** 重命名会话标题。 */
  const renameSession = useCallback(async (conversationId: string, title: string) => {
    const id = `${conversationId || ""}`.trim();
    const nextTitle = `${title || ""}`.replace(/\s+/g, " ").trim();
    if (!id || !nextTitle || sessionBusy) return;
    setSessionBusy(true);
    setSessionError("");
    try {
      const clipped = nextTitle.slice(0, 80);
      await patchConversation(id, { title: clipped });
      setSessions((prev) =>
        prev.map((s) =>
          s.conversation_id === id ? { ...s, title: clipped } : s,
        ),
      );
      const docId = documentIdRef.current;
      if (docId) await refreshSessions(docId);
    } catch (error) {
      console.warn("[reader-ai] rename session failed", error);
      setSessionError("重命名失败，请重试。");
    } finally {
      setSessionBusy(false);
    }
  }, [refreshSessions, sessionBusy]);

  // 问答完成后刷新会话列表标题/排序
  const prevRunning = useRef(false);
  useEffect(() => {
    if (prevRunning.current && !isRunning) {
      const docId = documentIdRef.current;
      if (docId) void refreshSessions(docId);
      const id = remoteAnswerer?.getConversationId?.() || "";
      if (id) setActiveConversationId(id);
    }
    prevRunning.current = isRunning;
  }, [isRunning, remoteAnswerer, refreshSessions]);

  const sessionSummaries: ReaderAskSessionSummary[] = useMemo(() => {
    const active = activeConversationId
      || remoteAnswerer?.getConversationId?.()
      || "";
    return (sessions || []).map((s) => ({
      id: s.conversation_id,
      title: `${s.title || ""}`.trim() || "未命名对话",
      updatedAt: s.updated_at || "",
      messageCount: Number(s.message_count) || 0,
      active: s.conversation_id === active,
    }));
  }, [sessions, activeConversationId, remoteAnswerer]);

  return {
    citationsByMessageId,
    progressByMessageId,
    contentByMessageId,
    streamingAssistantId,
    isRunning,
    messages,
    sessions: sessionSummaries,
    activeConversationId: activeConversationId
      || remoteAnswerer?.getConversationId?.()
      || "",
    sessionBusy,
    sessionError,
    submitQuestion,
    retryAnswer,
    cancelAnswer,
    newSession,
    switchSession,
    removeSession,
    renameSession,
    branchFromAnswer,
  };
}
