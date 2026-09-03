import {
  createStore,
  type BoundStoreActions,
  type Store,
} from "../../app-framework/store.js";
import {
  HOME_LOADING_STATES,
  HOME_VIEW_MODES,
} from "../../contracts/home-view-contract.js";

export { HOME_LOADING_STATES, HOME_VIEW_MODES };

export type HomeViewMode = (typeof HOME_VIEW_MODES)[keyof typeof HOME_VIEW_MODES];
export type HomeLoadingState = (typeof HOME_LOADING_STATES)[keyof typeof HOME_LOADING_STATES];

export interface HomeState {
  viewMode: HomeViewMode;
  recentJobsLoadingState: HomeLoadingState;
  recentJobsError: string;
}

/** 兼容旧扁平字段名的初始态 */
export type HomeInitialState = Partial<HomeState> & {
  homeViewMode?: HomeViewMode | string;
  homeRecentJobsLoadingState?: HomeLoadingState | string;
  homeRecentJobsError?: string;
};

export interface CreateHomeStatePortOptions {
  // 遗留字段：事件已删（store 是唯一真值），保留签名兼容调用方。
  eventTarget?: {
    dispatchEvent?: (event: Event) => boolean;
  } | null;
}

export type HomeActions = {
  setViewMode(currentState: HomeState, mode?: unknown): HomeState;
  setRecentJobsLoadingState(
    currentState: HomeState,
    loadingState?: unknown,
    error?: string,
  ): HomeState;
};

export type HomeStore = Store<HomeState, HomeActions>;

export interface HomeStatePort {
  getSnapshot(): HomeState;
  setRecentJobsLoadingState(loadingState?: unknown, error?: string): void;
  setViewMode(mode?: string): void;
  store: HomeStore;
}

function normalizeHomeViewMode(mode: unknown): HomeViewMode {
  return (Object.values(HOME_VIEW_MODES) as string[]).includes(mode as string)
    ? (mode as HomeViewMode)
    : HOME_VIEW_MODES.LIBRARY;
}

function normalizeHomeLoadingState(loadingState: unknown): HomeLoadingState {
  return (Object.values(HOME_LOADING_STATES) as string[]).includes(loadingState as string)
    ? (loadingState as HomeLoadingState)
    : HOME_LOADING_STATES.IDLE;
}

export function createHomeStore(initialState: HomeInitialState = {}): HomeStore {
  return createStore<HomeState, HomeActions>({
    name: "home",
    initialState: {
      viewMode: normalizeHomeViewMode(initialState.viewMode
        ?? initialState.homeViewMode
        ?? HOME_VIEW_MODES.LIBRARY),
      recentJobsLoadingState: normalizeHomeLoadingState(initialState.recentJobsLoadingState
        ?? initialState.homeRecentJobsLoadingState
        ?? HOME_LOADING_STATES.IDLE),
      recentJobsError: `${initialState.recentJobsError ?? initialState.homeRecentJobsError ?? ""}`,
    },
    actions: {
      setViewMode(currentState, mode) {
        return {
          ...currentState,
          viewMode: normalizeHomeViewMode(mode),
        };
      },
      setRecentJobsLoadingState(currentState, loadingState, error = "") {
        return {
          ...currentState,
          recentJobsLoadingState: normalizeHomeLoadingState(loadingState),
          recentJobsError: `${error || ""}`,
        };
      },
    },
  });
}

export function createHomeStatePort(
  targetState: HomeInitialState = {},
  _options: CreateHomeStatePortOptions = {},
): HomeStatePort {
  const store = createHomeStore(targetState);
  const actions: BoundStoreActions<HomeState, HomeActions> = store.actions;

  function setViewMode(mode?: string) {
    // store 是唯一真值；旧 homeViewModeChanged 事件已删（0 消费者）。
    return actions.setViewMode(mode);
  }

  function setRecentJobsLoadingState(loadingState?: unknown, error = "") {
    // 同上：旧 homeRecentJobsStateChanged 事件已删，读 store 即可。
    return actions.setRecentJobsLoadingState(loadingState, error);
  }

  function getSnapshot(): HomeState {
    return store.getSnapshot();
  }

  return {
    getSnapshot,
    setRecentJobsLoadingState,
    setViewMode,
    store,
  };
}

let defaultHomeStatePort: HomeStatePort | null = null;

function getDefaultHomeStatePort(): HomeStatePort {
  if (!defaultHomeStatePort) {
    defaultHomeStatePort = createHomeStatePort();
  }
  return defaultHomeStatePort;
}

export function setHomeViewMode(mode?: string) {
  getDefaultHomeStatePort().setViewMode(mode);
}

export function setHomeRecentJobsLoadingState(loadingState?: unknown, error = "") {
  getDefaultHomeStatePort().setRecentJobsLoadingState(loadingState, error);
}

export function getHomeState(): HomeState {
  return getDefaultHomeStatePort().getSnapshot();
}
