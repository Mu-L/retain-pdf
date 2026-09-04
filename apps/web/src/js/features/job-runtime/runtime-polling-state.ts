import { createStore, type Store } from "../../app-framework/store.js";

export const JOB_POLL_INTERVAL_MS = 1000;

const RUNTIME_POLLING_STORE_KEY = Symbol.for("retainpdf.runtimePollingStore");

/** Normalized runtime-polling sub-store snapshot. */
export interface RuntimePollingState {
  jobId: string;
  generation: number;
  pollInFlight: boolean;
  /** 在途时又来一拍的合并标记，finishPoll 消费后补发一次。 */
  pollPending: boolean;
}

/** Host-state or partial fields accepted when seeding the store. */
export type RuntimePollingInitialState = Partial<RuntimePollingState> & {
  currentJobId?: string;
  currentJobPollGeneration?: number;
  currentJobPollInFlight?: boolean;
  currentJobPollPending?: boolean;
  currentJobStartedAt?: string;
  /** DOM / Node timer handle (number or Timeout depending on lib). */
  timer?: unknown;
  [key: string]: unknown;
};

export type IntervalClearFn = (handle?: unknown) => void;
export type IntervalSetFn = (
  handler: (...args: unknown[]) => void,
  timeout?: number,
  ...args: unknown[]
) => unknown;

export interface RuntimePollingStatePortOptions {
  clearIntervalFn?: IntervalClearFn;
  setIntervalFn?: IntervalSetFn;
  now?: () => string;
}

export type RuntimePollingActions = {
  stop(currentState: RuntimePollingState): RuntimePollingState;
  beginPoll(currentState: RuntimePollingState): RuntimePollingState;
  finishPoll(currentState: RuntimePollingState): RuntimePollingState;
  startJob(currentState: RuntimePollingState, jobId: unknown): RuntimePollingState;
};

export type RuntimePollingStore = Store<RuntimePollingState, RuntimePollingActions>;

export interface RuntimePollingStartResult {
  generation: number;
  startedAt: string;
}

export interface RuntimePollingStatePort {
  store: RuntimePollingStore;
  getSnapshot: () => RuntimePollingState;
  stop: () => RuntimePollingState;
  beginPoll: () => number | null;
  /** 返回 true 表示消费掉一次合并待发，调用方需补发一次。 */
  finishPoll: (generation?: unknown) => boolean;
  isCurrentGeneration: (jobId: unknown, generation: unknown) => boolean;
  startJob: (jobId: unknown) => RuntimePollingStartResult;
  startTimer: (
    callback: (...args: unknown[]) => void,
    intervalMs?: number,
  ) => unknown;
}

function normalizePollingState(
  initialState: RuntimePollingInitialState = {},
): RuntimePollingState {
  return {
    jobId: `${initialState.jobId ?? initialState.currentJobId ?? ""}`.trim(),
    generation: Number(initialState.generation ?? initialState.currentJobPollGeneration ?? 0),
    pollInFlight: Boolean(initialState.pollInFlight ?? initialState.currentJobPollInFlight),
    pollPending: Boolean(
      (initialState as RuntimePollingInitialState).pollPending
        ?? initialState.currentJobPollPending
        ?? false,
    ),
  };
}

export function createRuntimePollingStore(
  initialState: RuntimePollingInitialState = {},
): RuntimePollingStore {
  return createStore<RuntimePollingState, RuntimePollingActions>({
    name: "runtimePolling",
    initialState: normalizePollingState(initialState),
    actions: {
      stop(currentState) {
        // 旧 fetch 决议后靠 generation 失配直接返回，不再清新轮询的 pollInFlight。
        return {
          ...currentState,
          generation: Number(currentState.generation || 0) + 1,
          pollInFlight: false,
          pollPending: false,
        };
      },
      beginPoll(currentState) {
        // 在途不再返 null 丢拍：合并为 pending，由 finishPoll 消费补发一次。
        if (currentState.pollInFlight) {
          return {
            ...currentState,
            pollPending: true,
          };
        }
        return {
          ...currentState,
          pollInFlight: true,
        };
      },
      finishPoll(currentState) {
        if (currentState.pollPending) {
          return {
            ...currentState,
            pollPending: false,
            pollInFlight: false,
          };
        }
        return {
          ...currentState,
          pollInFlight: false,
        };
      },
      startJob(currentState, jobId) {
        return {
          ...currentState,
          jobId: `${jobId || ""}`.trim(),
          generation: Number(currentState.generation || 0) + 1,
          pollInFlight: false,
          pollPending: false,
        };
      },
    },
  });
}

function asPollingHost(state: object): RuntimePollingInitialState {
  return state as RuntimePollingInitialState;
}

function pollingStoreSlot(state: object): RuntimePollingStore | undefined {
  return (state as Record<PropertyKey, unknown>)[RUNTIME_POLLING_STORE_KEY] as
    | RuntimePollingStore
    | undefined;
}

export function runtimePollingStoreFor(
  state: object | null | undefined,
): RuntimePollingStore {
  if (!state || typeof state !== "object") {
    return createRuntimePollingStore();
  }
  const existing = pollingStoreSlot(state);
  if (!existing) {
    Object.defineProperty(state, RUNTIME_POLLING_STORE_KEY, {
      configurable: false,
      enumerable: false,
      value: createRuntimePollingStore(asPollingHost(state)),
      writable: false,
    });
  }
  return pollingStoreSlot(state) as RuntimePollingStore;
}

function applyRuntimePollingAction(
  state: object,
  action: (store: RuntimePollingStore) => RuntimePollingState,
): RuntimePollingState {
  const store = runtimePollingStoreFor(state);
  return action(store);
}

export function createRuntimePollingStatePort(
  state: object,
  {
    clearIntervalFn = clearInterval as IntervalClearFn,
    setIntervalFn = setInterval as IntervalSetFn,
    now = () => new Date().toISOString(),
  }: RuntimePollingStatePortOptions = {},
): RuntimePollingStatePort {
  const host = asPollingHost(state);
  const store = runtimePollingStoreFor(state);
  return {
    store,
    getSnapshot: () => store.getSnapshot(),
    stop() {
      if (host?.timer) {
        clearIntervalFn(host.timer);
        host.timer = null;
      }
      return applyRuntimePollingAction(state, (currentStore) => currentStore.actions.stop());
    },
    beginPoll() {
      const snapshot = applyRuntimePollingAction(state, (currentStore) => currentStore.actions.beginPoll());
      return snapshot.generation;
    },
    finishPoll(generation?: unknown) {
      if (generation !== undefined && generation !== null) {
        const current = store.getSnapshot();
        if (Number(generation) !== Number(current.generation || 0)) {
          return false;
        }
        const hadPending = Boolean(current.pollPending);
        applyRuntimePollingAction(state, (currentStore) => currentStore.actions.finishPoll());
        return hadPending;
      }
      const hadPending = Boolean(store.getSnapshot().pollPending);
      applyRuntimePollingAction(state, (currentStore) => currentStore.actions.finishPoll());
      return hadPending;
    },
    isCurrentGeneration(jobId, generation) {
      const current = store.getSnapshot();
      return current.jobId === jobId && Number(generation) === Number(current.generation || 0);
    },
    startJob(jobId) {
      const snapshot = applyRuntimePollingAction(
        state,
        (currentStore) => currentStore.actions.startJob(jobId),
      );
      if (host && !host.currentJobStartedAt) {
        host.currentJobStartedAt = now();
      }
      return {
        generation: Number(snapshot.generation || 0),
        startedAt: `${host?.currentJobStartedAt || ""}`,
      };
    },
    startTimer(callback, intervalMs = JOB_POLL_INTERVAL_MS) {
      if (host?.timer) {
        clearIntervalFn(host.timer);
      }
      const timer = setIntervalFn(callback, intervalMs);
      if (host) {
        host.timer = timer;
      }
      return timer;
    },
  };
}

export function stopPolling(state: unknown) {
  createRuntimePollingStatePort(state as object).stop();
}

export function beginJobPoll(state: unknown) {
  return createRuntimePollingStatePort(state as object).beginPoll();
}

export function finishJobPoll(state: unknown) {
  createRuntimePollingStatePort(state as object).finishPoll();
}

export function isCurrentJobGeneration(
  state: unknown,
  jobId: unknown,
  generation: unknown,
) {
  return createRuntimePollingStatePort(state as object).isCurrentGeneration(jobId, generation);
}

export function startRuntimeJob(state: unknown, jobId: unknown) {
  return createRuntimePollingStatePort(state as object).startJob(jobId);
}

export function startPollingTimer(
  state: unknown,
  callback: (...args: unknown[]) => void,
  intervalMs = JOB_POLL_INTERVAL_MS,
) {
  createRuntimePollingStatePort(state as object).startTimer(callback, intervalMs);
}
