import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { AssistantRuntimeProvider, useExternalStoreRuntime } from "@assistant-ui/react";
import { HomeAskComposer } from "./HomeAskComposer.tsx";
import { HomeAskSidebar } from "./HomeAskSidebar.tsx";
import { HomeAskThread, HOME_ASK_SUGGESTIONS } from "./HomeAskThread.tsx";
import { useHomeAskRuntime, CREDENTIALS_CHANGED_EVENT, hasModelApiKey } from "./use-home-ask-runtime.ts";
import type { HomeAskScope } from "./types.ts";
import type { ThreadMessageLike } from "@assistant-ui/react";

const SIDEBAR_COLLAPSED_KEY = "retainpdf.home.ai.sidebar-collapsed.v1";

function loadSidebarCollapsed(): boolean {
  try {
    return globalThis.localStorage?.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

function saveSidebarCollapsed(collapsed: boolean) {
  try {
    globalThis.localStorage?.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function HomeAskInner() {
  const {
    messages,
    isRunning,
    conversationId,
    sessions,
    sessionsLoading,
    sessionBusy,
    send,
    stop,
    newSession,
    switchSession,
    removeSession,
    renameSession,
  } = useHomeAskRuntime();
  const [scopes, setScopes] = useState<HomeAskScope[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(loadSidebarCollapsed);
  const [credTick, setCredTick] = useState(0);
  const empty = messages.length === 0;

  useEffect(() => {
    saveSidebarCollapsed(sidebarCollapsed);
  }, [sidebarCollapsed]);

  useEffect(() => {
    const bump = () => setCredTick((n) => n + 1);
    window.addEventListener("focus", bump);
    window.addEventListener("storage", bump);
    document.addEventListener("visibilitychange", bump);
    document.addEventListener(CREDENTIALS_CHANGED_EVENT, bump);
    return () => {
      window.removeEventListener("focus", bump);
      window.removeEventListener("storage", bump);
      document.removeEventListener("visibilitychange", bump);
      document.removeEventListener(CREDENTIALS_CHANGED_EVENT, bump);
    };
  }, []);

  // consume tick to avoid lint unused
  void credTick;
  const missingLlmKey = !hasModelApiKey();

  // — assistant-ui runtime bridge —
  // Convert HomeAskMessage[] -> ThreadMessageLike[] for @assistant-ui/react
  const threadMessages = useMemo<ThreadMessageLike[]>(
    () =>
      messages.map((m) => ({
        role: m.role,
        content: [{ type: "text" as const, text: m.content }],
        // preserve id via metadata if needed; assistant-ui uses internal id generation
      })),
    [messages],
  );

  // Provide minimal no-op for onNew when variant using assistant-ui composer would call it
  const runtime = useExternalStoreRuntime({
    messages: threadMessages,
    isRunning,
    convertMessage: (message: ThreadMessageLike) => message,
    onNew: async (message) => {
      const text =
        message.content
          .filter((p) => p.type === "text")
          .map((p) => (p as { type: "text"; text: string }).text)
          .join("\n")
          .trim() || "";
      if (!text) return;
      await send(text, scopes);
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <section
        id="home-ask-view"
        className={`flex h-[calc(100vh-64px)] min-h-[480px] overflow-hidden rounded-xl border bg-neutral-50 ${empty ? "is-empty" : "is-chat"} ${sidebarCollapsed ? "is-sidebar-collapsed" : ""}`}
        aria-label="AI 问答"
        data-home-ask=""
      >
        <HomeAskSidebar
          sessions={sessions}
          activeId={conversationId}
          loading={sessionsLoading}
          busy={sessionBusy || isRunning}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          onNew={newSession}
          onSelect={(id) => {
            void switchSession(id);
          }}
          onDelete={(id) => {
            void removeSession(id);
          }}
          onRename={(id, title) => renameSession(id, title)}
        />

        <div className="flex flex-1 flex-col overflow-hidden bg-white">
          {empty ? (
            <div className="flex flex-1 flex-col items-center justify-center p-6">
              <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-violet-100 text-violet-600" aria-hidden>
                <Sparkles size={22} strokeWidth={1.85} />
              </div>
              <h2 className="mb-6 text-lg font-medium">随时待命，有什么可以帮你？</h2>
              <HomeAskComposer
                isRunning={isRunning}
                missingLlmKey={missingLlmKey}
                scopes={scopes}
                onScopesChange={setScopes}
                onSend={(q) => {
                  void send(q, scopes);
                }}
                onStop={stop}
                variant="hero"
              />
              <div className="mt-4 flex flex-wrap justify-center gap-2" role="group" aria-label="推荐问题">
                {HOME_ASK_SUGGESTIONS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.prompt}
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-xs hover:bg-neutral-50 disabled:opacity-50"
                      disabled={missingLlmKey || isRunning}
                      onClick={() => {
                        if (missingLlmKey) return;
                        void send(item.prompt, scopes);
                      }}
                    >
                      <Icon size={14} strokeWidth={2} aria-hidden className="text-neutral-500" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto">
                <HomeAskThread messages={messages} isRunning={isRunning} />
              </div>
              <div className="border-t bg-white p-3">
                <HomeAskComposer
                  isRunning={isRunning}
                  missingLlmKey={missingLlmKey}
                  scopes={scopes}
                  onScopesChange={setScopes}
                  onSend={(q) => {
                    void send(q, scopes);
                  }}
                  onStop={stop}
                  variant="dock"
                />
              </div>
            </>
          )}
        </div>
      </section>
    </AssistantRuntimeProvider>
  );
}

export function HomeAskView() {
  // Top-level wrapper ensures hook call inside provider boundary is valid.
  // HomeAskInner owns the runtime so provider can be constructed with live messages.
  return <HomeAskInner />;
}

export default HomeAskView;
