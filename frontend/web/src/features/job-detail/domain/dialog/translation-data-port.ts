/** createTranslationState() 状态袋形状（可变，由 dataPort 就地写） */
export interface TranslationStateBag {
  jobId: string;
  loaded: boolean;
  summary: unknown;
  query: {
    finalStatus: string;
    q: string;
    limit: number;
    offset: number;
  };
  list: Array<{ item_id?: string; [key: string]: unknown }>;
  total: number;
  selectedItemId: string;
  selectedItem: unknown;
  replay: unknown;
}

export interface TranslationDataPortDeps {
  translationState: TranslationStateBag;
  apiPrefix?: string;
  currentJobId?: (() => string) | null;
  fetchTranslationDiagnostics: (jobId: string, apiPrefix?: string) => Promise<unknown>;
  fetchTranslationItems: (
    jobId: string,
    apiPrefix?: string,
    query?: TranslationStateBag["query"] | Record<string, unknown>,
  ) => Promise<unknown>;
  fetchTranslationItem: (
    jobId: string,
    itemId: string,
    apiPrefix?: string,
  ) => Promise<unknown>;
  replayTranslationItem: (
    jobId: string,
    itemId: string,
    apiPrefix?: string,
  ) => Promise<unknown>;
}

export interface TranslationLoadItemsOptions {
  selectFirst?: boolean;
}

export interface TranslationApplyQueryOptions {
  finalStatus?: string;
  q?: string;
}

export function createStatusDetailTranslationDataPort({
  translationState,
  apiPrefix,
  currentJobId,
  fetchTranslationDiagnostics,
  fetchTranslationItems,
  fetchTranslationItem,
  replayTranslationItem,
}: TranslationDataPortDeps) {
  // 跨任务串话防护：单调 token；发起加载/重置时推进，await 后校验，不一致丢弃写入。
  let requestToken = 0;

  function jobId() {
    return `${currentJobId?.() || ""}`.trim();
  }

  function reset(nextJobId = "") {
    requestToken += 1;
    // 首次绑定（此前无任务）保留调用方预置的过滤器；切任务/清空不继承旧过滤器。
    // 调用方确认：syncJob 切任务与无任务清空均无保留语义依赖；applyFilter 先设过滤
    // 后首绑加载属于用户本次显式选择，应予以保留。
    const firstBind = !translationState.jobId && nextJobId;
    translationState.jobId = nextJobId;
    translationState.loaded = false;
    translationState.summary = null;
    if (!firstBind) {
      translationState.query.finalStatus = "";
      translationState.query.q = "";
      translationState.query.offset = 0;
    }
    translationState.list = [];
    translationState.total = 0;
    translationState.selectedItemId = "";
    translationState.selectedItem = null;
    translationState.replay = null;
  }
  function syncJob() {
    const nextJobId = jobId();
    if (!nextJobId) {
      reset("");
      return "";
    }
    if (translationState.jobId !== nextJobId) {
      reset(nextJobId);
    }
    return nextJobId;
  }
  async function loadSummary(nextJobId: string, token: number) {
    const payload = await fetchTranslationDiagnostics(nextJobId, apiPrefix);
    if (token !== requestToken) {
      return translationState.summary;
    }
    const current = jobId();
    if (current && current !== nextJobId) {
      return translationState.summary;
    }
    translationState.summary = payload;
    return translationState.summary;
  }

  async function readItems(
    nextJobId: string,
    { selectFirst = false }: TranslationLoadItemsOptions = {},
    token: number,
  ) {
    const payload = await fetchTranslationItems(nextJobId, apiPrefix, translationState.query) as {
      items?: Array<{ item_id?: string; [key: string]: unknown }>;
      total?: number;
    } | null | undefined;
    if (token !== requestToken) {
      return {
        selectedItemId: translationState.selectedItemId,
        shouldLoadSelectedItem: false,
        selectionChanged: false,
      };
    }
    const current = jobId();
    if (current && current !== nextJobId) {
      return {
        selectedItemId: translationState.selectedItemId,
        shouldLoadSelectedItem: false,
        selectionChanged: false,
      };
    }
    translationState.list = Array.isArray(payload?.items) ? payload.items : [];
    translationState.total = Number(payload?.total || 0);
    const shouldKeepCurrent = translationState.list.some((item) => item.item_id === translationState.selectedItemId);
    if (shouldKeepCurrent) {
      return {
        selectedItemId: translationState.selectedItemId,
        shouldLoadSelectedItem: false,
        selectionChanged: false,
      };
    }
    const nextItemId = selectFirst && translationState.list.length
      ? `${translationState.list[0].item_id || ""}`.trim()
      : "";
    translationState.selectedItemId = nextItemId;
    translationState.selectedItem = null;
    translationState.replay = null;
    return {
      selectedItemId: nextItemId,
      shouldLoadSelectedItem: Boolean(nextItemId),
      selectionChanged: true,
    };
  }

  async function loadItems(nextJobId: string, options: TranslationLoadItemsOptions = {}) {
    return readItems(nextJobId, options, ++requestToken);
  }

  async function loadSummaryAndItems({ selectFirst = false }: TranslationLoadItemsOptions = {}) {
    const nextJobId = syncJob();
    if (!nextJobId) {
      return {
        jobId: "",
        selectedItemId: "",
        shouldLoadSelectedItem: false,
        selectionChanged: true,
      };
    }
    const token = ++requestToken;
    await loadSummary(nextJobId, token);
    const current = jobId();
    if (token !== requestToken || (current && current !== nextJobId)) {
      return {
        jobId: nextJobId,
        selectedItemId: translationState.selectedItemId,
        shouldLoadSelectedItem: false,
        selectionChanged: false,
      };
    }
    const itemSelection = await readItems(nextJobId, { selectFirst }, token);
    return {
      jobId: nextJobId,
      ...itemSelection,
    };
  }

  async function loadItem(nextJobId: string, itemId: string) {
    const normalizedItemId = `${itemId || ""}`.trim();
    if (!normalizedItemId) {
      return null;
    }
    const token = ++requestToken;
    translationState.selectedItemId = normalizedItemId;
    translationState.replay = null;
    const payload = await fetchTranslationItem(nextJobId, normalizedItemId, apiPrefix);
    if (token !== requestToken) {
      return translationState.selectedItem;
    }
    const current = jobId();
    if (current && current !== nextJobId) {
      return translationState.selectedItem;
    }
    translationState.selectedItem = payload;
    return translationState.selectedItem;
  }

  async function replaySelectedItem() {
    const nextJobId = jobId();
    const itemId = `${translationState.selectedItemId || ""}`.trim();
    if (!nextJobId || !itemId) {
      return null;
    }
    translationState.replay = await replayTranslationItem(nextJobId, itemId, apiPrefix);
    return translationState.replay;
  }

  function applyQuery({ finalStatus = "", q = "" }: TranslationApplyQueryOptions = {}) {
    translationState.query.finalStatus = finalStatus;
    translationState.query.q = q;
    translationState.query.offset = 0;
    translationState.loaded = true;
  }

  function changePage(direction: string) {
    const limit = Number(translationState.query.limit || 20);
    const currentOffset = Number(translationState.query.offset || 0);
    const nextOffset = direction === "next"
      ? currentOffset + limit
      : Math.max(0, currentOffset - limit);
    if (nextOffset === currentOffset) {
      return false;
    }
    translationState.query.offset = nextOffset;
    return true;
  }

  function markLoaded() {
    translationState.loaded = true;
  }

  return {
    state: translationState,
    jobId,
    syncJob,
    reset,
    loadSummaryAndItems,
    loadItems,
    loadItem,
    replaySelectedItem,
    applyQuery,
    changePage,
    markLoaded,
  };
}

export type StatusDetailTranslationDataPort = ReturnType<typeof createStatusDetailTranslationDataPort>;
