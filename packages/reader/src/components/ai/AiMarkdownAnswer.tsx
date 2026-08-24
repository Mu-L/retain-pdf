import { useEffect, useId, useMemo, useRef } from "react";
import {
  hydrateProtectedImages,
  injectCitationMarkers,
  isAgenticCitation,
  neutralizeMarkdownAnchors,
  renderCitationFooter,
  revokeHydratedImageUrls,
  type AiCitationLike,
} from "../../shared/ai/answer-enhance.js";
import { shouldIgnoreReaderAiNavEvent } from "../../shared/ai/ui-interaction-lock.js";
import { RetainMarkstream } from "./RetainMarkstream.js";

export type AiMarkdownAnswerProps = {
  content: string;
  streaming?: boolean;
  citations?: AiCitationLike[];
  jobId?: string;
  className?: string;
  streamingClassName?: string;
  pendingClassName?: string;
  finalClassName?: string;
  citationFooterMax?: number;
  onJumpCitation?: (citation: AiCitationLike) => void;
};

/**
 * Single Markstream renderer for Reader and home AI answers. It owns Markdown/Math render,
 * citation injection and authenticated current-job image hydration.
 */
export function AiMarkdownAnswer({
  content,
  streaming = false,
  citations = [],
  jobId = "",
  className = "",
  streamingClassName = "",
  pendingClassName = "",
  finalClassName = "",
  citationFooterMax = 5,
  onJumpCitation,
}: AiMarkdownAnswerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const rendererId = useId();
  const bodyText = streaming ? `${content || ""}` : `${content || ""}`.trim();
  const resolvedJobId = `${jobId || citations.find((item) => item.job_id)?.job_id || ""}`.trim();

  const citationByRef = useMemo(() => {
    const map = new Map<string, AiCitationLike>();
    for (const citation of citations) {
      if (isAgenticCitation(citation)) map.set(`${citation.ref}`, citation);
    }
    return map;
  }, [citations]);
  useEffect(() => {
    const root = rootRef.current;
    if (!root || streaming || !bodyText) return;
    revokeHydratedImageUrls(root);
    neutralizeMarkdownAnchors(root, { onOpen: () => true });
    injectCitationMarkers(root, citationByRef, onJumpCitation || null);
    const controller = new AbortController();
    if (root.querySelector("img[data-ai-src]")) {
      void hydrateProtectedImages(root, { signal: controller.signal });
    }
    const bubble = root.parentElement;
    if (bubble instanceof HTMLElement) {
      renderCitationFooter(bubble, citations, {
        onJump: (citation) => {
          if (!shouldIgnoreReaderAiNavEvent(null)) onJumpCitation?.(citation);
        },
        answerText: bodyText,
        max: citationFooterMax,
      });
    }
    return () => controller.abort();
  }, [streaming, resolvedJobId, citationByRef, citations, onJumpCitation, bodyText, citationFooterMax]);

  useEffect(() => () => revokeHydratedImageUrls(rootRef.current), []);

  if (!bodyText.trim()) return null;
  const stateClassName = streaming
    ? streamingClassName
    : finalClassName || pendingClassName;
  return (
    <div ref={rootRef} className={`${className} ${stateClassName}`.trim()}>
      <RetainMarkstream
        content={bodyText}
        final={!streaming}
        indexKey={rendererId}
        jobId={resolvedJobId}
        onClickCapture={(event) => {
          const target = event.target;
          if (!(target instanceof Element)) return;
          if (target.closest("a[href]")) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      />
    </div>
  );
}
