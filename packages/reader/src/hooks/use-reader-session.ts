// React 阅读会话：
// 1) 解析 job/document → URL
// 2) 整文件下载完原文/译文 PDF（遮罩不关）
// 3) 再展示阅读器；可见页渲染等优化在显示之后进行

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  loadProtectedPdfFile,
  type ProtectedPdfFile,
} from "../pdf/useProtectedPdfFile.js";
import {
  isMockMode,
  resolveResourceUrl,
  MOCK_DOCUMENT_SOURCE_PDF_URL,
  READER_DIALOG_MESSAGES,
  defaultReaderDataPort,
  defaultReaderPageConfigPort,
  resolveReaderDocumentId,
  resolveReaderJobId,
  resolveReaderArtifactUrl,
  resolveReaderSourcePdf,
  resolveReaderTranslatedPdfUrl,
  READER_PROGRESS_COPY,
} from "../external.js";
import {
  normalizeReaderMetadata,
  normalizeReaderRegions,
  type ReaderMetadata,
  type ReaderRegion,
} from "../shared/data/reader-regions.js";

export type ReaderMode = "source" | "translated" | "compare";

/** 与 legacy ReaderDownloadMenu 相同的下载上下文 */
export type ReaderDownloadContext = {
  fetchProtected: typeof defaultReaderDataPort.fetchProtected;
  jobId: string;
  jobPayload: Record<string, unknown> | null;
  manifestPayload: Record<string, unknown> | null;
  /** 馆藏只读等无 job 时直接用已解析 URL */
  sourceUrl: string;
  translatedUrl: string;
  sourceOnly: boolean;
};

export type ReaderSessionState = {
  jobId: string;
  documentId: string;
  sourceOnly: boolean;
  mode: ReaderMode;
  setMode: (mode: ReaderMode) => void;
  sourceUrl: string;
  translatedUrl: string;
  /** 预下载完成的 PDF 字节；展示前已就绪 */
  sourceFile: ProtectedPdfFile | null;
  translatedFile: ProtectedPdfFile | null;
  /** 下载完成、可以挂载 Document */
  assetsReady: boolean;
  boot: {
    loading: boolean;
    percent: number;
    text: string;
    stage: string;
    failed: boolean;
  };
  // display title; react chrome currently does not render it
  title: string;
  regions: ReaderRegion[];
  readerMetadata: ReaderMetadata;
  download: ReaderDownloadContext;
  /** Agent 提交新文档版本后，切换到文档当前源文件并重新下载。 */
  refreshCommittedDocument: (input: {
    documentId: string;
    revision: string;
  }) => void;
  /** 关闭导航前建立取消栅栏，禁止迟到请求再写入 Reader UI。 */
  prepareClose: () => void;
};

type CommittedDocumentSource = {
  documentId: string;
  revision: string;
};

export function buildCommittedDocumentSourceUrl(
  documentId: string,
  revision: string,
): string {
  const path = `/api/v1/documents/${encodeURIComponent(documentId)}/source.pdf`;
  const normalizedRevision = `${revision || ""}`.trim();
  return resolveResourceUrl(normalizedRevision
    ? `${path}?version=${encodeURIComponent(normalizedRevision)}`
    : path);
}

/** Keep body `reader-mode-*` in sync (legacy CSS + chrome). */
function applyBodyReaderMode(mode: ReaderMode) {
  document.body.classList.remove(
    "reader-mode-source",
    "reader-mode-translated",
    "reader-mode-compare",
  );
  document.body.classList.add(`reader-mode-${mode}`);
}

function isJobIdLikeTitle(title: string, jobId = "") {
  const t = `${title || ""}`.trim();
  const id = `${jobId || ""}`.trim();
  if (!t) return true;
  if (id && (t === id || t === `${id}.pdf`)) return true;
  if (/^\d{8,14}-[0-9a-f]{4,}$/i.test(t)) return true;
  return false;
}

function pickDisplayTitle(jobPayload: Record<string, unknown> | null | undefined, jobId: string) {
  const candidates = [
    jobPayload?.title,
    jobPayload?.display_name,
    jobPayload?.source_file_name,
    (jobPayload as { book_summary?: { source_file_name?: string } } | null)?.book_summary?.source_file_name,
  ];
  for (const raw of candidates) {
    const text = `${raw || ""}`.trim();
    if (text && !isJobIdLikeTitle(text, jobId)) {
      return text.replace(/\.pdf$/i, "");
    }
  }
  return "";
}

function postProgress({
  percent,
  text,
  stage,
}: {
  percent: number;
  text: string;
  stage: string;
}) {
  try {
    window.parent?.postMessage(
      {
        type: READER_DIALOG_MESSAGES.progress,
        stage,
        percent,
        text,
      },
      defaultReaderPageConfigPort.messageTargetOrigin(),
    );
  } catch {
    // ignore
  }
}

type BootState = ReaderSessionState["boot"];

function setBootProgress(
  setBoot: (value: BootState | ((prev: BootState) => BootState)) => void,
  percent: number,
  text: string,
  stage = "progress",
) {
  setBoot({
    loading: true,
    percent,
    text,
    stage,
    failed: false,
  });
  postProgress({ percent, text, stage });
}

export function useReaderSession(): ReaderSessionState {
  const closingRef = useRef(false);
  const activeLoadAbortRef = useRef<AbortController | null>(null);
  const [locationKey, setLocationKey] = useState(() => globalThis.location?.search || globalThis.location?.href || "");
  useEffect(() => {
    const handler = () => setLocationKey(globalThis.location?.search || globalThis.location?.href || "");
    // pushState/replaceState do not fire popstate; monkeypatch to detect SPA navigation
    const origPush = globalThis.history?.pushState?.bind(globalThis.history);
    const origReplace = globalThis.history?.replaceState?.bind(globalThis.history);
    let patched = false;
    if (origPush && origReplace) {
      try {
        const wrap = (orig: typeof origPush) => function (this: History, ...args: Parameters<History["pushState"]>) {
          const ret = (orig as unknown as (...a: unknown[]) => unknown).apply(this, args);
          handler();
          globalThis.dispatchEvent(new Event("pushstate"));
          globalThis.dispatchEvent(new Event("replacestate"));
          globalThis.dispatchEvent(new Event("locationchange"));
          return ret;
        };
        (globalThis.history.pushState as unknown) = wrap(origPush);
        (globalThis.history.replaceState as unknown) = wrap(origReplace);
        patched = true;
      } catch {
        /* ignore patch failure */
      }
    }
    window.addEventListener("popstate", handler);
    window.addEventListener("hashchange", handler);
    window.addEventListener("pushstate", handler as EventListener);
    window.addEventListener("replacestate", handler as EventListener);
    window.addEventListener("locationchange", handler as EventListener);
    return () => {
      window.removeEventListener("popstate", handler);
      window.removeEventListener("hashchange", handler);
      window.removeEventListener("pushstate", handler as EventListener);
      window.removeEventListener("replacestate", handler as EventListener);
      window.removeEventListener("locationchange", handler as EventListener);
      if (patched && origPush && origReplace) {
        try {
          globalThis.history.pushState = origPush as unknown as typeof history.pushState;
          globalThis.history.replaceState = origReplace as unknown as typeof history.replaceState;
        } catch {
          /* ignore */
        }
      }
    };
  }, []);
  const jobId = useMemo(() => resolveReaderJobId(defaultReaderPageConfigPort), [locationKey]);
  const documentId = useMemo(
    () => (jobId ? "" : resolveReaderDocumentId()),
    [locationKey, jobId],
  );
  const [resolvedDocumentJob, setResolvedDocumentJob] = useState({
    documentId: "",
    jobId: "",
  });
  const documentJobId = resolvedDocumentJob.documentId === documentId
    ? resolvedDocumentJob.jobId
    : "";
  const sessionJobId = jobId || documentJobId;
  const sourceOnly = Boolean(documentId) && !sessionJobId;
  const [committedDocumentSource, setCommittedDocumentSource] = useState<CommittedDocumentSource | null>(null);
  // sourceOnly 表示“没有任务 job”，用于判断 Markdown/AI 能力。
  // sourceViewOnly 只表示当前没有可安全并排的译文，两者不能混用。
  const sourceViewOnly = sourceOnly || Boolean(committedDocumentSource?.documentId);

  const [mode, setModeState] = useState<ReaderMode>(sourceViewOnly ? "source" : "compare");
  const [sourceUrl, setSourceUrl] = useState("");
  const [translatedUrl, setTranslatedUrl] = useState("");
  const [sourceFile, setSourceFile] = useState<ProtectedPdfFile | null>(null);
  const [translatedFile, setTranslatedFile] = useState<ProtectedPdfFile | null>(null);
  const [assetsReady, setAssetsReady] = useState(false);
  const [title, setTitle] = useState("");
  const [jobPayload, setJobPayload] = useState<Record<string, unknown> | null>(null);
  const [manifestPayload, setManifestPayload] = useState<Record<string, unknown> | null>(null);
  const [regions, setRegions] = useState<ReaderRegion[]>([]);
  const [readerMetadata, setReaderMetadata] = useState<ReaderMetadata>(() => ({
    source: null,
    translated: null,
  }));
  const [boot, setBoot] = useState<ReaderSessionState["boot"]>({
    loading: true,
    percent: 4,
    text: READER_PROGRESS_COPY.boot,
    stage: "progress",
    failed: false,
  });

  const setMode = useCallback((next: ReaderMode) => {
    if (sourceViewOnly && next !== "source") {
      return;
    }
    setModeState(next);
    applyBodyReaderMode(next);
  }, [sourceViewOnly]);

  const refreshCommittedDocument = useCallback((input: {
    documentId: string;
    revision: string;
  }) => {
    const nextDocumentId = `${input.documentId || ""}`.trim();
    if (!nextDocumentId) return;
    const nextRevision = `${input.revision || ""}`.trim() || `${Date.now()}`;
    setCommittedDocumentSource({
      documentId: nextDocumentId,
      revision: nextRevision,
    });
    setModeState("source");
    applyBodyReaderMode("source");
  }, []);

  const prepareClose = useCallback(() => {
    closingRef.current = true;
    activeLoadAbortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (sourceViewOnly) {
      document.documentElement.classList.add("reader-source-only");
    }
    applyBodyReaderMode(mode);
    return () => {
      document.documentElement.classList.remove("reader-source-only");
    };
  }, [sourceViewOnly, mode]);

  useEffect(() => {
    const abort = new AbortController();
    let cancelled = false;
    activeLoadAbortRef.current = abort;
    const isInactive = () => cancelled || closingRef.current || abort.signal.aborted;

    if (closingRef.current) {
      abort.abort();
      return () => {
        cancelled = true;
        if (activeLoadAbortRef.current === abort) {
          activeLoadAbortRef.current = null;
        }
      };
    }

    async function downloadOne(
      url: string,
      label: string,
      percentStart: number,
      percentEnd: number,
    ): Promise<ProtectedPdfFile | null> {
      if (!url) {
        return null;
      }
      if (isInactive()) {
        return null;
      }
      setBootProgress(setBoot, percentStart, label, "download");
      const file = await loadProtectedPdfFile(url, defaultReaderDataPort.fetchProtected, {
        signal: abort.signal,
      });
      if (isInactive()) {
        return null;
      }
      setBootProgress(setBoot, percentEnd, label, "download");
      return file;
    }

    async function load() {
      setAssetsReady(false);
      setSourceFile(null);
      setTranslatedFile(null);
      setRegions([]);
      setReaderMetadata({ source: null, translated: null });
      setBootProgress(setBoot, 8, READER_PROGRESS_COPY.metadata, "metadata");

      try {
        if (sourceOnly) {
          // OCR 吸怪：document_id 直开时，若文档已有 active_job_id（OCR-only 已回填），则按 job 链路加载以提供 Markdown/译文
          let effectiveJobId: string | null = null;
          try {
            const docResp = await defaultReaderDataPort.fetchProtected(
              resolveResourceUrl(`/api/v1/documents/${encodeURIComponent(documentId)}`),
            );
            if (docResp?.ok) {
              const docJson: any = await docResp.json().catch(() => null);
              const docData: any = docJson?.data ?? docJson;
              const active = `${docData?.active_job_id || ""}`.trim();
              if (active && !active.startsWith("doc:")) effectiveJobId = active;
            }
          } catch {
            /* ignore, fallback to pure source */
          }
          if (effectiveJobId && !isInactive()) {
            // 记录实际 job 后重新进入统一 job 加载分支。session 对外也必须暴露
            // 这个 id，否则 Markdown/AI/下载仍会把馆藏入口误判为纯源文档。
            setResolvedDocumentJob({ documentId, jobId: effectiveJobId });
            return;
          }
          const url = committedDocumentSource?.documentId
            ? buildCommittedDocumentSourceUrl(
              committedDocumentSource.documentId,
              committedDocumentSource.revision,
            )
            : isMockMode()
            ? MOCK_DOCUMENT_SOURCE_PDF_URL
            : resolveResourceUrl(`/api/v1/documents/${encodeURIComponent(documentId)}/source.pdf`);
          if (isInactive()) return;
          setSourceUrl(url);
          setTranslatedUrl("");
          setTitle("");
          setJobPayload(null);
          setManifestPayload(null);
          const file = await downloadOne(url, "正在下载原文 PDF…", 30, 85);
          if (isInactive()) return;
          if (!file) {
            setBoot({
              loading: false,
              percent: 100,
              text: "源文件不可用：该文档没有可读取的源 PDF。",
              stage: "failed",
              failed: true,
            });
            postProgress({ percent: 100, text: "源文件下载失败", stage: "failed" });
            return;
          }
          setSourceFile(file);
          setAssetsReady(true);
          setBoot({
            loading: false,
            percent: 100,
            text: READER_PROGRESS_COPY.ready,
            stage: "ready",
            failed: false,
          });
          postProgress({ percent: 100, text: READER_PROGRESS_COPY.ready, stage: "ready" });
          // URL 锚点跳页见 useUrlAnchorJump（react-pdf 控制器）
          return;
        }

        if (!sessionJobId) {
          setBoot({
            loading: false,
            percent: 100,
            text: READER_PROGRESS_COPY.failed,
            stage: "failed",
            failed: true,
          });
          postProgress({ percent: 100, text: READER_PROGRESS_COPY.failed, stage: "failed" });
          return;
        }

        // 显式 job_id 表示流水线的不可变阅读快照。即使所属文档后来被
        // Agent 修改，也必须继续加载该 job 自己配套的原文和译文；否则
        // 历史翻译任务会因为 document.active_version_id 而失去对照阅读。
        // Reader 当前会话内完成 Agent 提交时，refreshCommittedDocument
        // 会显式设置 committedDocumentSource，并切换到新的文档源版本。
        const payload = await defaultReaderDataPort.loadReaderPayload(sessionJobId);
        if (isInactive()) return;

        const source = resolveReaderSourcePdf(payload.manifestPayload);
        const translated = resolveReaderTranslatedPdfUrl(payload.jobPayload, payload.manifestPayload);
        const resolvedSourceFinal = typeof source === "string"
          ? source
          : resolveReaderArtifactUrl(source);
        // OCR-only job 未必生成 PDF artifact；从 document_id 进入时继续使用
        // 馆藏源文件，同时保留真实 jobId 供 Markdown/AI 使用。
        const sourceFinal = committedDocumentSource?.documentId
          ? buildCommittedDocumentSourceUrl(
            committedDocumentSource.documentId,
            committedDocumentSource.revision,
          )
          : resolvedSourceFinal || (documentId
          ? resolveResourceUrl(`/api/v1/documents/${encodeURIComponent(documentId)}/source.pdf`)
          : "");
        // 文档操作产生的是新的源版本；旧 job 的译文、region 与 metadata
        // 仍对应旧页序，不能继续和新源文件并排显示。
        const translatedFinal = committedDocumentSource ? "" : translated || "";

        setSourceUrl(sourceFinal || "");
        setTranslatedUrl(translatedFinal);
        setTitle(pickDisplayTitle(payload.jobPayload as Record<string, unknown>, sessionJobId));
        setJobPayload((payload.jobPayload as Record<string, unknown>) || null);
        setManifestPayload((payload.manifestPayload as Record<string, unknown>) || null);
        setRegions(committedDocumentSource ? [] : normalizeReaderRegions(payload.regionsPayload));
        setReaderMetadata(committedDocumentSource
          ? { source: null, translated: null }
          : normalizeReaderMetadata(payload.readerMetadata));

        if (!sourceFinal && !translatedFinal) {
          setBoot({
            loading: false,
            percent: 100,
            text: READER_PROGRESS_COPY.failed,
            stage: "failed",
            failed: true,
          });
          postProgress({ percent: 100, text: READER_PROGRESS_COPY.failed, stage: "failed" });
          return;
        }

        // 先下完所有 PDF，再允许界面挂载 Document
        setBootProgress(setBoot, 25, "正在下载 PDF…", "download");
        const tasks: Promise<void>[] = [];
        let sourceBytes: ProtectedPdfFile | null = null;
        let translatedBytes: ProtectedPdfFile | null = null;

        if (sourceFinal) {
          tasks.push(
            downloadOne(sourceFinal, "正在下载原文 PDF…", 30, 55).then((f) => {
              sourceBytes = f;
            }),
          );
        }
        if (translatedFinal) {
          tasks.push(
            downloadOne(translatedFinal, "正在下载译文 PDF…", 55, 85).then((f) => {
              translatedBytes = f;
            }),
          );
        }
        await Promise.all(tasks);
        if (isInactive()) return;

        const needSource = Boolean(sourceFinal);
        const needTranslated = Boolean(translatedFinal);
        if ((needSource && !sourceBytes) || (needTranslated && !translatedBytes)) {
          setBoot({
            loading: false,
            percent: 100,
            text: "PDF 下载失败，请重试",
            stage: "failed",
            failed: true,
          });
          postProgress({ percent: 100, text: "PDF 下载失败", stage: "failed" });
          return;
        }

        setSourceFile(sourceBytes);
        setTranslatedFile(translatedBytes);
        setAssetsReady(true);
        setBoot({
          loading: false,
          percent: 100,
          text: READER_PROGRESS_COPY.ready,
          stage: "ready",
          failed: false,
        });
        postProgress({ percent: 100, text: READER_PROGRESS_COPY.ready, stage: "ready" });
        // URL 锚点跳页见 useUrlAnchorJump（react-pdf 控制器）
      } catch (err) {
        if (isInactive()) return;
        // AbortError from fetch is not a real failure
        if ((err as Error)?.name === "AbortError") return;
        const text = err instanceof Error ? err.message : READER_PROGRESS_COPY.failed;
        setBoot({
          loading: false,
          percent: 100,
          text,
          stage: "failed",
          failed: true,
        });
        postProgress({ percent: 100, text, stage: "failed" });
      }
    }

    void load();
    return () => {
      cancelled = true;
      abort.abort();
      if (activeLoadAbortRef.current === abort) {
        activeLoadAbortRef.current = null;
      }
    };
  }, [sessionJobId, documentId, sourceOnly, locationKey, committedDocumentSource]);

  const download = useMemo<ReaderDownloadContext>(
    () => ({
      fetchProtected: defaultReaderDataPort.fetchProtected,
      jobId: sessionJobId,
      jobPayload,
      manifestPayload,
      sourceUrl,
      translatedUrl,
      sourceOnly: sourceViewOnly,
    }),
    [sessionJobId, jobPayload, manifestPayload, sourceUrl, translatedUrl, sourceViewOnly],
  );

  return {
    jobId: sessionJobId,
    documentId,
    sourceOnly,
    mode,
    setMode,
    sourceUrl,
    translatedUrl,
    sourceFile,
    translatedFile,
    assetsReady,
    boot,
    title,
    regions,
    readerMetadata,
    download,
    refreshCommittedDocument,
    prepareClose,
  };
}
