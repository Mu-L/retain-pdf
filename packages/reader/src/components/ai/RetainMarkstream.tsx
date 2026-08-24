import {
  createContext,
  useContext,
  type MouseEvent as ReactMouseEvent,
} from "react";
import MarkdownRender, {
  MathInlineNode,
  setCustomComponents,
  type ImageNodeProps,
  type LinkNodeProps,
  type MathInlineNodeProps,
} from "markstream-react";
import { resolveAnswerImageUrl } from "../../shared/ai/answer-enhance.js";

const RETAINPDF_MARKSTREAM_ID = "retainpdf-ai-answer";

type AssetContextValue = {
  final: boolean;
  jobId: string;
};

const AssetContext = createContext<AssetContextValue>({ final: false, jobId: "" });

function RetainImageNode({ node }: ImageNodeProps) {
  const { final, jobId } = useContext(AssetContext);
  const alt = `${node.alt || ""}`.trim();
  if (!final) {
    return (
      <span className="aui-image-pending" aria-label={alt || "图片加载中"}>
        {alt ? `[图片：${alt}]` : "[图片加载中]"}
      </span>
    );
  }
  const safeUrl = resolveAnswerImageUrl(node.src, jobId);
  if (!safeUrl) {
    return (
      <span className="aui-image-blocked">
        {alt ? `[图片不可用：${alt}]` : "[图片不可用]"}
      </span>
    );
  }
  return (
    <img
      alt={alt}
      data-ai-src={safeUrl}
      decoding="async"
      loading="lazy"
      title={node.title || undefined}
    />
  );
}

function RetainLinkNode({ node }: LinkNodeProps) {
  const label = `${node.text || node.href || ""}`.trim();
  return (
    <span
      className="aui-md-extlink"
      data-href={`${node.href || ""}`.trim() || undefined}
      title={label || undefined}
    >
      {label}
    </span>
  );
}

function RetainMathInlineNode({ node }: MathInlineNodeProps) {
  // Markstream accepts $$...$$ in the middle of a paragraph and then asks
  // KaTeX to use display mode inside an inline span. That produces the giant
  // fractions and displaced punctuation seen in Reader answers. A real block
  // formula is parsed as math_block, so inline nodes should always use KaTeX's
  // text style regardless of which delimiter the model happened to emit.
  return (
    <MathInlineNode
      node={node.markup === "$$" ? { ...node, markup: "$" } : node}
    />
  );
}

// Scoped registration: only RetainPDF's renderer instance gets the protected
// image and non-navigating link nodes. The React context keeps per-message job
// state out of Markstream's global component registry.
setCustomComponents(RETAINPDF_MARKSTREAM_ID, {
  image: RetainImageNode,
  link: RetainLinkNode,
  math_inline: RetainMathInlineNode,
});

export type RetainMarkstreamProps = {
  content: string;
  final: boolean;
  indexKey: string;
  jobId: string;
  onClickCapture?: (event: ReactMouseEvent<HTMLDivElement>) => void;
};

export function RetainMarkstream({
  content,
  final,
  indexKey,
  jobId,
  onClickCapture,
}: RetainMarkstreamProps) {
  return (
    <AssetContext.Provider value={{ final, jobId }}>
      <div
        className="retain-markstream-shell"
        data-markdown-renderer="markstream-react"
        onClickCapture={onClickCapture}
      >
        <MarkdownRender
          batchRendering={!final}
          content={content}
          customId={RETAINPDF_MARKSTREAM_ID}
          fade={false}
          final={final}
          // AI output is untrusted. Markstream's "safe" policy intentionally
          // still permits ordinary <img>/<a>; "escape" prevents raw HTML from
          // bypassing RetainPDF's protected image and inert link nodes.
          htmlPolicy="escape"
          indexKey={indexKey}
          maxLiveNodes={0}
          renderCodeBlocksAsPre
          showTooltips={false}
          smoothStreaming={final ? false : "auto"}
          typewriter={!final}
        />
      </div>
    </AssetContext.Provider>
  );
}
