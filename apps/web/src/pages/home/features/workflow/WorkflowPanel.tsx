// 工作流面板(翻译工作流卡片,对照 partials/main-content.html 的
// .translation-workflow-card 区块逐 id 镜像)。
//
// - #job-warning:workflow 视图 store(updateJobWarning 桥回调写入)
// - #job-form:提交流程属 app-actions 域(3b),onSubmit 走 bridge.submitForm
//   (3a 为 preventDefault 占位;隐藏凭据 input 由 credentials 域的
//   HiddenCredentialInputs 接管,渲染唯一一份,不重复制造 DOM id)
// - 上传瓦片/动作组/行内错误盒分别由 upload 域组件与 InlineErrorBox 落位
//
// Decoupled: HiddenCredentialInputs 不再由 workflow 直接 import(曾是
// workflow → credentials 跨域耦合),改为由 HomeApp/TranslationWorkflowDialog
// 经 props/slot 注入(hiddenInputsSlot)。workflow 域只管渲染 slot。
//
// OCR 模式切换：由复选框重构为分段控制器（TabsPrimitive.Root，2 tabs + 图标），
// 提示区用 rAF 测量高度 + CSS height/opacity 过渡实现折叠动画；提交按钮文案
// 与图标随 ocrOnly 切换（直接翻译 ↔ 开始 OCR），预算/术语表等翻译配置
// 在 ocrOnly 时隐藏（由 UploadTile 通过 store.ocrOnly 控制）。

import { useEffect, useRef, useState } from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { ScanSearch, Languages, Info } from "lucide-react";
import { useStoreSnapshot } from "@/shared/react/use-store.js";
import { useHomeServices } from "../../home-services-context.js";
import { HeroUpload } from "./components/UploadTile.jsx";
import { InlineErrorBox } from "../../components/InlineErrorBox.jsx";

export function WorkflowPanel({ hiddenInputsSlot = null }: { hiddenInputsSlot?: React.ReactNode | null }) {
  const services = useHomeServices();
  const workflow = useStoreSnapshot(services.stores.workflowView);
  const ocrOnly = Boolean((workflow as any).ocrOnly);

  // 高度动画：rAF 测量 + CSS transition，避免 max-height 硬编码截断
  const hintInnerRef = useRef<HTMLDivElement>(null);
  const [hintHeight, setHintHeight] = useState(0);

  useEffect(() => {
    const el = hintInnerRef.current;
    if (!el) return;
    if (ocrOnly) {
      // 先置 0 再在下一帧设为 scrollHeight，触发 CSS transition
      const target = el.scrollHeight;
      // 若已为目标值则不重复
      if (hintHeight === target) return;
      // 置 0 → rAF → 目标高度，保证动画可感知
      requestAnimationFrame(() => setHintHeight(target));
    } else {
      setHintHeight(0);
    }
  }, [ocrOnly, hintHeight]);

  // ocrOnly 切换后同步测量（内容高度可能变化时）
  useEffect(() => {
    if (!ocrOnly) return;
    const el = hintInnerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setHintHeight(el.scrollHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ocrOnly]);

  function handleModeChange(value: string) {
    const next = value === "ocr";
    if (next === ocrOnly) return;
    (services.workflowViewActions as any).setOcrOnly?.(next);
    // 同步刷新提交态与标题/预算提示
    (services.features as any).workflowFeature?.refreshSubmitControls?.();
    (services.features as any).workflowFeature?.applyWorkflowMode?.();
  }

  return (
    <section className="translation-workflow-card">
      <div id="job-warning" className={`job-warning${workflow.jobWarningVisible ? "" : " hidden"}`}>
        检测到上一个任务仍在处理中。建议先等待当前任务结束，再提交新的 PDF。
      </div>

      {/* 分段控制器：翻译 / 仅 OCR（带图标） */}
      <TabsPrimitive.Root
        value={ocrOnly ? "ocr" : "translate"}
        onValueChange={handleModeChange}
        className="w-full"
      >
        <TabsPrimitive.List
          id="ocr-only-toggle"
          aria-label="工作流模式"
          className="inline-flex w-full items-center justify-center rounded-full bg-muted p-1 gap-1 mb-3"
        >
          <TabsPrimitive.Trigger
            value="translate"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            aria-label="翻译模式"
          >
            <Languages className="h-4 w-4 shrink-0" aria-hidden="true" />
            翻译
          </TabsPrimitive.Trigger>
          <TabsPrimitive.Trigger
            value="ocr"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            aria-label="仅 OCR 模式"
          >
            <ScanSearch className="h-4 w-4 shrink-0" aria-hidden="true" />
            仅 OCR
          </TabsPrimitive.Trigger>
        </TabsPrimitive.List>
      </TabsPrimitive.Root>

      {/* 提示区：高度 + 透明度动画；ocrOnly 时展开并显示图标 */}
      <div
        aria-hidden={!ocrOnly}
        style={{
          overflow: "hidden",
          height: hintHeight,
          opacity: ocrOnly ? 1 : 0,
          transition: "height 280ms cubic-bezier(0.32,0.72,0,1), opacity 200ms ease",
          marginBottom: ocrOnly ? 12 : 0,
        }}
      >
        <div
          ref={hintInnerRef}
          id="ocr-only-hint"
          className="ocr-only-hint"
          style={{
            background: "var(--color-bg-subtle, #f6f7f9)",
            border: "1px solid var(--color-border, #e5e7eb)",
            borderRadius: 12,
            padding: "8px 10px",
            fontSize: 13,
            lineHeight: "1.5",
            color: "var(--color-text-secondary, #6b7280)",
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
          }}
          aria-live="polite"
        >
          <Info className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" aria-hidden="true" />
          <span>
            已选择<strong>仅做 OCR</strong>：将跳过翻译与渲染，仅提取版面与文本。无需术语表、目标语言等翻译配置。
          </span>
        </div>
      </div>

      <form
        id="job-form"
        className="form"
        noValidate
        onSubmit={(event) => services.bridge.submitForm(event)}
      >
        {hiddenInputsSlot}

        <HeroUpload />
        <InlineErrorBox />
      </form>
    </section>
  );
}
