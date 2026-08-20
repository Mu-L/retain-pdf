import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { ArrowUp, BookOpen, FolderOpen, Loader2, Square, X } from "lucide-react";
import { filterDocumentOptions, loadPickerOptions, parseAtQuery } from "./document-picker.ts";
import type { HomeAskScope } from "./types.ts";
import { scopeKey } from "./types.ts";

const MAX_SCOPES = 4;

export type HomeAskComposerProps = {
  disabled?: boolean;
  isRunning?: boolean;
  missingLlmKey?: boolean;
  scopes: HomeAskScope[];
  onScopesChange: (next: HomeAskScope[]) => void;
  onSend: (question: string) => void;
  onStop?: () => void;
  variant?: "hero" | "dock";
};

export function HomeAskComposer({
  disabled = false,
  isRunning = false,
  missingLlmKey = false,
  scopes,
  onScopesChange,
  onSend,
  onStop,
  variant = "dock",
}: HomeAskComposerProps) {
  const [text, setText] = useState("");
  const [options, setOptions] = useState<HomeAskScope[]>([]);
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [atStart, setAtStart] = useState(-1);
  const [atQuery, setAtQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const [loadingOpts, setLoadingOpts] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const listId = useId();

  const filtered = filterDocumentOptions(
    options,
    atQuery,
    scopes.map((s) => scopeKey(s)),
  );

  const ensureOptions = useCallback(async () => {
    if (optionsLoaded || loadingOpts) return;
    setLoadingOpts(true);
    try {
      const list = await loadPickerOptions(100);
      setOptions(list);
      setOptionsLoaded(true);
    } catch {
      setOptions([]);
      setOptionsLoaded(true);
    } finally {
      setLoadingOpts(false);
    }
  }, [loadingOpts, optionsLoaded]);

  const closePicker = useCallback(() => {
    setPickerOpen(false);
    setAtStart(-1);
    setAtQuery("");
    setHighlight(0);
  }, []);

  const pickScope = useCallback(
    (item: HomeAskScope) => {
      if (!item.id) return;
      if (scopes.some((s) => scopeKey(s) === scopeKey(item))) {
        closePicker();
        return;
      }
      if (scopes.length >= MAX_SCOPES) {
        closePicker();
        return;
      }
      const el = textareaRef.current;
      const value = text;
      const start = atStart >= 0 ? atStart : value.lastIndexOf("@");
      if (start >= 0 && el) {
        const caret = el.selectionStart ?? value.length;
        const next = `${value.slice(0, start)}${value.slice(caret)}`.replace(/\s{2,}/g, " ");
        setText(next.trimStart());
      }
      onScopesChange([...scopes, item]);
      closePicker();
      requestAnimationFrame(() => textareaRef.current?.focus());
    },
    [atStart, closePicker, onScopesChange, scopes, text],
  );

  const syncAtState = useCallback(
    (value: string, caret: number) => {
      const parsed = parseAtQuery(value, caret);
      if (!parsed) {
        if (pickerOpen) closePicker();
        return;
      }
      void ensureOptions();
      setAtStart(parsed.start);
      setAtQuery(parsed.query);
      setPickerOpen(true);
      setHighlight(0);
    },
    [closePicker, ensureOptions, pickerOpen],
  );

  const handleSend = () => {
    const q = text.trim();
    if (!q || disabled || isRunning || missingLlmKey) return;
    onSend(q);
    setText("");
    closePicker();
  };

  const inputDisabled = disabled || missingLlmKey;
  const onKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (pickerOpen && filtered.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlight((h) => (h + 1) % filtered.length);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlight((h) => (h - 1 + filtered.length) % filtered.length);
        return;
      }
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        pickScope(filtered[highlight] || filtered[0]);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        closePicker();
        return;
      }
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (!pickerOpen) return;
    const onDoc = (e: PointerEvent) => {
      const t = e.target as Node | null;
      const root = textareaRef.current?.closest(".home-ask-composer");
      if (root && t && root.contains(t)) return;
      closePicker();
    };
    document.addEventListener("pointerdown", onDoc, true);
    return () => document.removeEventListener("pointerdown", onDoc, true);
  }, [closePicker, pickerOpen]);

  const canSend = Boolean(text.trim()) && !disabled && !isRunning && !missingLlmKey;

  const scopeHint = (() => {
    if (missingLlmKey) return "请先在设置 → API 设置中填写模型 API Key";
    if (!scopes.length) return "全库 · @ 文章或合集";
    const cols = scopes.filter((s) => s.kind === "collection").length;
    const docs = scopes.filter((s) => s.kind === "document").length;
    const parts: string[] = [];
    if (cols) parts.push(`${cols} 合集`);
    if (docs) parts.push(`${docs} 篇`);
    return parts.join(" · ") || "已限定";
  })();

  return (
    <div className={`home-ask-composer relative flex flex-col gap-2 ${variant === "hero" ? "mx-auto w-full max-w-[640px]" : "w-full"} ${missingLlmKey ? "opacity-60" : ""}`}>
      {missingLlmKey ? (
        <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm" role="alert">
          <p className="text-amber-800">未配置模型 API Key，无法输入或提问。</p>
          <button
            type="button"
            className="rounded bg-amber-600 px-3 py-1 text-xs font-medium text-white hover:bg-amber-700"
            onClick={() => {
              document.dispatchEvent(new CustomEvent("retainpdf:open-browser-credentials"));
            }}
          >
            打开设置
          </button>
        </div>
      ) : null}
      {scopes.length > 0 ? (
        <div className="flex flex-wrap gap-1.5" aria-label="提问范围">
          {scopes.map((s) => (
            <span
              key={scopeKey(s)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${s.kind === "collection" ? "border-violet-200 bg-violet-50 text-violet-700" : "border-neutral-200 bg-neutral-50 text-neutral-700"}`}
            >
              {s.kind === "collection" ? <FolderOpen size={12} strokeWidth={2.2} aria-hidden /> : <BookOpen size={12} strokeWidth={2.2} aria-hidden />}
              <span className="max-w-[140px] truncate" title={s.title}>
                {s.kind === "collection" ? `合集 · ${s.title}` : s.title}
              </span>
              <button
                type="button"
                className="ml-0.5 rounded-full p-0.5 hover:bg-black/10"
                aria-label={`移除 ${s.title}`}
                disabled={disabled || isRunning}
                onClick={() => onScopesChange(scopes.filter((x) => scopeKey(x) !== scopeKey(s)))}
              >
                <X size={12} strokeWidth={2.4} aria-hidden />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div className="home-ask-composer relative rounded-2xl border bg-white shadow-sm">
        {missingLlmKey ? (
          <div
            className="absolute inset-0 z-10 rounded-2xl"
            aria-hidden
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />
        ) : null}
        <textarea
          ref={textareaRef}
          className="min-h-[56px] w-full resize-none rounded-2xl border-0 bg-transparent px-4 py-3 pr-12 text-sm outline-none placeholder:text-neutral-400 disabled:opacity-50"
          rows={2}
          value={missingLlmKey ? "" : text}
          disabled={inputDisabled}
          readOnly={missingLlmKey}
          tabIndex={missingLlmKey ? -1 : 0}
          aria-disabled={missingLlmKey}
          placeholder={
            missingLlmKey
              ? "请先配置模型 API Key…"
              : scopes.length
                ? "继续提问… @ 可再指定文章或合集"
                : variant === "hero"
                  ? "用 AI 做任何事… 输入 @ 指定文章或合集"
                  : "继续提问… 输入 @ 指定文章或合集"
          }
          onChange={(e) => {
            if (missingLlmKey) return;
            const value = e.target.value;
            setText(value);
            syncAtState(value, e.target.selectionStart ?? value.length);
          }}
          onBeforeInput={(e) => {
            if (missingLlmKey) e.preventDefault();
          }}
          onPaste={(e) => {
            if (missingLlmKey) e.preventDefault();
          }}
          onClick={(e) => {
            if (missingLlmKey) {
              e.preventDefault();
              return;
            }
            const t = e.currentTarget;
            syncAtState(t.value, t.selectionStart ?? t.value.length);
          }}
          onKeyUp={(e) => {
            if (missingLlmKey) return;
            const t = e.currentTarget;
            if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
              syncAtState(t.value, t.selectionStart ?? t.value.length);
            }
          }}
          onKeyDown={(e) => {
            if (missingLlmKey) {
              e.preventDefault();
              return;
            }
            onKeyDown(e);
          }}
        />

        {pickerOpen ? (
          <div className="absolute bottom-full left-0 right-0 z-20 mb-2 max-h-[220px] overflow-auto rounded-xl border bg-white p-1 shadow-lg" role="listbox" id={listId} aria-label="选择文档或合集">
            {loadingOpts && !optionsLoaded ? (
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500">
                <Loader2 className="animate-spin" size={14} aria-hidden />
                加载中…
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-neutral-500">{optionsLoaded ? "没有匹配的文章或合集" : "暂无数据"}</div>
            ) : (
              filtered.map((item, index) => (
                <button
                  key={scopeKey(item)}
                  type="button"
                  role="option"
                  aria-selected={index === highlight}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral-100 ${index === highlight ? "bg-neutral-100" : ""} ${item.kind === "collection" ? "text-violet-700" : ""}`}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => pickScope(item)}
                >
                  {item.kind === "collection" ? <FolderOpen size={14} strokeWidth={2} aria-hidden /> : <BookOpen size={14} strokeWidth={2} aria-hidden />}
                  <span className="flex-1 truncate">{item.title}</span>
                  <span className="text-xs text-neutral-400">
                    {item.kind === "collection" ? `合集${item.document_count != null ? ` · ${item.document_count}` : ""}` : "文章"}
                  </span>
                </button>
              ))
            )}
            {scopes.length >= MAX_SCOPES ? (
              <div className="px-3 py-1 text-xs text-neutral-400">最多指定 {MAX_SCOPES} 个范围</div>
            ) : (
              <div className="px-3 py-1 text-xs text-neutral-400">合集会展开其中的文献再检索</div>
            )}
          </div>
        ) : null}

        <div className="flex items-center justify-between border-t px-3 py-2">
          <span className="text-xs text-neutral-500">{scopeHint}</span>
          {isRunning ? (
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50"
              aria-label="停止生成"
              title="停止生成"
              disabled={!onStop}
              onClick={() => onStop?.()}
            >
              <Square size={12} strokeWidth={2.6} aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-40"
              aria-label="发送"
              disabled={!canSend}
              onClick={handleSend}
            >
              <ArrowUp size={16} strokeWidth={2.5} aria-hidden />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
