import { useEffect, useRef, useState } from "react";
import { Check, MessageSquarePlus, PanelLeftClose, PanelLeftOpen, Pencil, Trash2, X } from "lucide-react";
import type { HomeAskSession } from "./use-home-ask-runtime.ts";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function groupLabel(updatedAt: string, now = Date.now()): string {
  const t = Date.parse(updatedAt);
  if (!Number.isFinite(t)) return "更早";
  const day = startOfDay(new Date(t));
  const today = startOfDay(new Date(now));
  const diffDays = Math.round((today - day) / 86400000);
  if (diffDays <= 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return "过去 7 天";
  if (diffDays < 30) return "过去 30 天";
  return "更早";
}

function groupSessions(sessions: HomeAskSession[]) {
  const order = ["今天", "昨天", "过去 7 天", "过去 30 天", "更早"];
  const map = new Map<string, HomeAskSession[]>();
  for (const s of sessions) {
    const label = groupLabel(s.updatedAt);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(s);
  }
  return order.filter((k) => map.has(k)).map((label) => ({ label, items: map.get(label)! }));
}

function displayTitle(raw: string): string {
  const m = `${raw || ""}`.match(/^fork-(\d+)-(.*)$/i);
  if (!m) return raw || "未命名对话";
  const rest = m[2].trim();
  return rest ? `${rest} · 分支${m[1]}` : `分支${m[1]}`;
}

export type HomeAskSidebarProps = {
  sessions: HomeAskSession[];
  activeId: string;
  loading?: boolean;
  busy?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onNew: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void | Promise<boolean>;
};

export function HomeAskSidebar({
  sessions,
  activeId,
  loading = false,
  busy = false,
  collapsed = false,
  onCollapsedChange,
  onNew,
  onSelect,
  onDelete,
  onRename,
}: HomeAskSidebarProps) {
  const groups = groupSessions(sessions);
  const [editingId, setEditingId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!editingId) return;
    const el = editInputRef.current;
    if (!el) return;
    el.focus();
    el.select();
  }, [editingId]);

  const startRename = (s: HomeAskSession) => {
    if (busy) return;
    setEditingId(s.id);
    setEditTitle(s.title || "");
  };

  const cancelRename = () => {
    setEditingId("");
    setEditTitle("");
  };

  const commitRename = async () => {
    const id = editingId;
    const title = editTitle.trim();
    if (!id) return;
    if (!title) {
      cancelRename();
      return;
    }
    setEditingId("");
    await onRename(id, title);
  };

  if (collapsed) {
    return (
      <aside className="home-ask-sidebar is-collapsed flex flex-col items-center gap-2 border-r bg-white p-2" aria-label="对话历史（已折叠）">
        <button
          type="button"
          className="rounded p-2 hover:bg-neutral-100"
          title="展开历史"
          aria-label="展开对话历史"
          aria-expanded={false}
          onClick={() => onCollapsedChange?.(false)}
        >
          <PanelLeftOpen size={16} strokeWidth={2.1} aria-hidden />
        </button>
        <button
          type="button"
          className="rounded p-2 hover:bg-neutral-100 disabled:opacity-50"
          disabled={busy}
          title="新对话"
          aria-label="新对话"
          onClick={onNew}
        >
          <MessageSquarePlus size={16} strokeWidth={2.1} aria-hidden />
        </button>
      </aside>
    );
  }

  return (
    <aside className="home-ask-sidebar flex w-[260px] shrink-0 flex-col border-r bg-white" aria-label="对话历史">
      <div className="border-b p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">历史</span>
          <button
            type="button"
            className="rounded p-1.5 hover:bg-neutral-100"
            title="折叠侧栏"
            aria-label="折叠对话历史"
            aria-expanded={true}
            onClick={() => onCollapsedChange?.(true)}
          >
            <PanelLeftClose size={15} strokeWidth={2.1} aria-hidden />
          </button>
        </div>
        <button
          type="button"
          className="mt-3 flex w-full items-center gap-2 rounded-md border bg-neutral-950 px-3 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50"
          disabled={busy}
          title="新对话"
          onClick={onNew}
        >
          <MessageSquarePlus size={15} strokeWidth={2.1} aria-hidden />
          <span>新对话</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {loading && sessions.length === 0 ? (
          <p className="p-3 text-sm text-neutral-500">加载历史…</p>
        ) : sessions.length === 0 ? (
          <p className="p-3 text-sm text-neutral-500">暂无历史对话</p>
        ) : (
          groups.map((g) => (
            <div key={g.label} className="mb-3">
              <div className="px-2 py-1 text-xs font-medium text-neutral-500">{g.label}</div>
              <ul className="space-y-1">
                {g.items.map((s) => {
                  const active = s.id === activeId;
                  const title = displayTitle(s.title);
                  const editing = editingId === s.id;
                  return (
                    <li key={s.id} className="flex items-center gap-1">
                      {editing ? (
                        <div className="flex flex-1 items-center gap-1">
                          <input
                            ref={editInputRef}
                            className="flex-1 rounded border px-2 py-1 text-sm"
                            value={editTitle}
                            maxLength={80}
                            disabled={busy}
                            aria-label="对话标题"
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                void commitRename();
                              } else if (e.key === "Escape") {
                                e.preventDefault();
                                cancelRename();
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            type="button"
                            className="rounded p-1 hover:bg-neutral-100 disabled:opacity-50"
                            disabled={busy || !editTitle.trim()}
                            aria-label="保存标题"
                            title="保存"
                            onClick={(e) => {
                              e.stopPropagation();
                              void commitRename();
                            }}
                          >
                            <Check size={13} strokeWidth={2.5} aria-hidden />
                          </button>
                          <button
                            type="button"
                            className="rounded p-1 hover:bg-neutral-100 disabled:opacity-50"
                            disabled={busy}
                            aria-label="取消重命名"
                            title="取消"
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelRename();
                            }}
                          >
                            <X size={13} strokeWidth={2.5} aria-hidden />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            className={`flex-1 truncate rounded px-2 py-1.5 text-left text-sm hover:bg-neutral-100 ${active ? "bg-neutral-100 font-medium" : ""}`}
                            disabled={busy}
                            title={`${title}（双击重命名）`}
                            onClick={() => onSelect(s.id)}
                            onDoubleClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              startRename(s);
                            }}
                          >
                            <span className="truncate">{title}</span>
                          </button>
                          <button
                            type="button"
                            className="rounded p-1 hover:bg-neutral-100 disabled:opacity-50"
                            disabled={busy}
                            aria-label={`重命名 ${title}`}
                            title="重命名"
                            onClick={(e) => {
                              e.stopPropagation();
                              startRename(s);
                            }}
                          >
                            <Pencil size={12} strokeWidth={2.2} aria-hidden />
                          </button>
                          <button
                            type="button"
                            className="rounded p-1 hover:bg-neutral-100 hover:text-red-600 disabled:opacity-50"
                            disabled={busy}
                            aria-label={`删除 ${title}`}
                            title="删除"
                            onClick={(e) => {
                              e.stopPropagation();
                              const ok = globalThis.confirm?.(`删除对话「${title}」？`);
                              if (ok) onDelete(s.id);
                            }}
                          >
                            <Trash2 size={13} strokeWidth={2.2} aria-hidden />
                          </button>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
