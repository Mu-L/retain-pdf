// Shared hook for library search binding — extracted from
// features/library/page/RecentJobsLibrary.tsx to decouple app-shell → library.
//
// app-shell's AppBottomBar previously imported useLibrarySearchBinding directly
// from ../library/page/RecentJobsLibrary, creating a sibling cross-feature
// coupling. Moving the hook to features/shared/ makes the dependency
// unidirectional via a shared leaf (no cycle risk) and keeps the runtime
// source identical (services.library.viewPort).
//
// RecentJobsLibrary re-exports this hook for backward-compat; new consumers
// should import from here.

import { useHomeServices } from "../../home-services-context.js";
import { useStoreSnapshot } from "@/shared/react/use-store.js";

export function useLibrarySearchBinding() {
  const services = useHomeServices();
  const { viewPort } = services.library;
  const view = useStoreSnapshot(viewPort.store);

  function onSearchChange(event: { target: { value: string } }) {
    const value = event.target.value;
    viewPort.store.actions.setQuery(value);
    viewPort.handlersRef.current.onSearch?.(value);
  }

  return { query: view.query as string, onSearchChange };
}
