// HomeAskComposer 的输入 / @ 选择器 / 范围状态与交互逻辑（纯逻辑，不含渲染）

import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  filterDocumentOptions,
  loadPickerOptions,
  parseAtQuery,
} from "../domain/document-picker.js";
import type { HomeAskScope } from "../domain/types.js";
import { scopeKey } from "../domain/types.js";

export const MAX_SCOPES = 4;

export type UseHomeAskComposerParams = {
  disabled: boolean;
  isRunning: boolean;
  credentialBlocked: boolean;
  credentialMessage: string;
  scopes: HomeAskScope[];
  onScopesChange: (next: HomeAskScope[]) => void;
  onSend: (question: string) => void;
};

export function useHomeAskComposer({
  disabled,
  isRunning,
  credentialBlocked,
  credentialMessage,
  scopes,
  onScopesChange,
  onSend,
}: UseHomeAskComposerParams) {
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

  const pickScope = useCallback((item: HomeAskScope) => {
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
  }, [atStart, closePicker, onScopesChange, scopes, text]);

  const syncAtState = useCallback((value: string, caret: number) => {
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
  }, [closePicker, ensureOptions, pickerOpen]);

  const handleTextChange = useCallback((value: string, caret: number) => {
    setText(value);
    syncAtState(value, caret);
  }, [syncAtState]);

  const handleSend = () => {
    const q = text.trim();
    if (!q || disabled || isRunning || credentialBlocked) return;
    onSend(q);
    setText("");
    closePicker();
  };

  const inputDisabled = disabled || credentialBlocked;

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

  const canSend = Boolean(text.trim()) && !disabled && !isRunning && !credentialBlocked;

  const scopeHint = (() => {
    if (credentialBlocked) return credentialMessage;
    if (!scopes.length) return "全库 · @ 文章或合集";
    const cols = scopes.filter((s) => s.kind === "collection").length;
    const docs = scopes.filter((s) => s.kind === "document").length;
    const parts: string[] = [];
    if (cols) parts.push(`${cols} 合集`);
    if (docs) parts.push(`${docs} 篇`);
    return parts.join(" · ") || "已限定";
  })();

  return {
    text,
    pickerOpen,
    highlight,
    filtered,
    loadingOpts,
    optionsLoaded,
    textareaRef,
    listId,
    inputDisabled,
    canSend,
    scopeHint,
    closePicker,
    pickScope,
    handleSend,
    onKeyDown,
    handleTextChange,
    syncAtState,
    setHighlight,
  };
}
