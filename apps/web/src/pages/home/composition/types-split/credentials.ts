// types-split/credentials.ts — 凭据/术语表/更新域。
import type { DialogStore } from "../../state/dialog-store.js";
import type { HandlersBag, ReadOnlyStore } from "./common.js";
import type {
  AppUpdateFeature,
  BrowserCredentialsFeature,
  GlossariesFeature,
} from "./features.js";

export type CredentialsElementsRef = {
  apiKeyInput: HTMLInputElement | null;
  modelBaseUrlInput: HTMLInputElement | null;
  modelNameInput: HTMLInputElement | null;
  translationWorkersInput: HTMLInputElement | null;
  mathModeSelect: HTMLSelectElement | null;
  tokenInputs: Record<string, HTMLInputElement | null | undefined>;
};

export type CredentialsViewBag = {
  store: ReadOnlyStore;
  handlersRef: { current: HandlersBag | null };
  tokenInputRef: (providerId: string) => (node: HTMLInputElement | null) => void;
  elementsRef: CredentialsElementsRef;
  elementsPort?: unknown;
  viewPort?: unknown;
};

export type HomeCredentials = {
  feature: BrowserCredentialsFeature | undefined;
  view: CredentialsViewBag;
  dialogStore: DialogStore;
};

export type HomeSettingsHub = {
  dialogStore: DialogStore<{ tab?: string } | null>;
};

export type GlossariesViewBag = {
  store: ReadOnlyStore;
  handlersRef: { current: HandlersBag | null };
  viewPort?: unknown;
  /** 编辑器态端口(draft/csvText 的 ref 持有 + 订阅,见 glossaries-store.js) */
  editor?: {
    getSnapshot: () => { draft: unknown; csvText: string };
    subscribe: (listener: (snapshot: unknown) => void) => () => void;
    actions: Record<string, (...args: any[]) => unknown>;
  };
};

export type HomeGlossaries = {
  feature: GlossariesFeature | undefined;
  view: GlossariesViewBag;
  dialogStore: DialogStore;
};

export type AppUpdateViewBag = {
  store: ReadOnlyStore;
  viewPort?: unknown;
  handlersRef: { current: HandlersBag | null };
};

export type HomeAppUpdate = {
  feature: AppUpdateFeature | undefined;
  view: AppUpdateViewBag;
  handlersRef: AppUpdateViewBag["handlersRef"];
};
