// BookDetailDialog —— 容器：组合 hooks + shell/tabs。
// 业务状态见 use-book-detail-*.js；UI 见 shell / tabs / panels。

import { useHomeServices } from "../../../home-services-context.js";
import { useDialogState } from "../../../state/use-dialog-state.js";
import { useDialogReturnFocus } from "@/shared/react/use-dialog-return-focus.js";
import { useRecentJobCover } from "../display/useRecentJobCover.js";
import { BookDetailShell } from "./shell/BookDetailShell.jsx";
import { CoverActionsPanel } from "./panels/CoverActionsPanel.jsx";
import {
  BookDetailRightTabs,
  BookDetailOverviewTab,
  BookDetailTranslateTab,
  BookDetailMoreTab,
} from "./tabs/index.js";
import { useBookDetailLiveItem } from "./use-book-detail-live-item.js";
import { useBookDetailDocument } from "./use-book-detail-document.js";
import { useBookDetailTranslate } from "./use-book-detail-translate.js";
import { useBookDetailCover } from "./use-book-detail-cover.js";
import { useBookDetailTab } from "./use-book-detail-tab.js";
import { useStoreSnapshot } from "@/shared/react/use-store.js";

export function BookDetailDialog() {
  const services = useHomeServices();
  const { dialogStore } = services.bookDetail;
  const actions = services.library.actions;
  const collectionsCtl = services.collections?.controller;
  const collectionsReload = services.collections?.reloadSignal;
  const dialogState: any = useDialogState(dialogStore);
  const open = Boolean(dialogState.open);
  const payloadItem: any = dialogState.payload || {};
  const { onCloseAutoFocus } = useDialogReturnFocus(open);

  const item = useBookDetailLiveItem(services, payloadItem);
  const statusCardState = useStoreSnapshot(services.statusCard.store);
  const documentId = `${item.document_id || ""}`.trim();
  const { status, coverProcessing, readerAvailable, canTranslate, isActive, cardJobId } =
    useBookDetailCover({ item, statusCardState });
  const jobId = `${item.job_id || item.active_job_id || cardJobId || ""}`.trim();
  const coverUrl = useRecentJobCover(item);

  // 点「翻译整本」/ 网格选中活跃任务：强制翻译 Tab，进度在 bd-job-status-inner
  const { preferTranslateTab, defaultTab, setPreferTranslateTab } = useBookDetailTab({
    open,
    payloadItem,
    item,
    readerAvailable,
    isActive,
  });

  const close = () => dialogStore.close();

  const docState = useBookDetailDocument({
    open,
    documentId,
    item,
    actions,
    collectionsCtl,
    collectionsReload,
    onClose: close,
  });

  const translateState = useBookDetailTranslate({
    open,
    documentId,
    pageCount: docState.pageCount,
    actions,
    withBusy: docState.withBusy,
    setError: docState.setError,
    onTranslateStarted: () => setPreferTranslateTab(true),
  });

  const handleOpenChange = (next) => {
    if (!next) close();
  };

  return (
    <BookDetailShell
      open={open}
      onOpenChange={handleOpenChange}
      onCloseAutoFocus={onCloseAutoFocus}
      left={(
        <CoverActionsPanel
          coverUrl={coverUrl}
          readerAvailable={readerAvailable}
          documentId={documentId}
          busy={docState.busy}
          processing={coverProcessing}
          onCompare={() => {
            actions.openJobReader(jobId);
            close();
          }}
          onReadSource={() => {
            actions.openSourceReader(documentId);
            close();
          }}
        />
      )}
      right={(
        <BookDetailRightTabs
          open={open}
          resetKey={documentId}
          defaultTab={defaultTab}
          overviewTab={(
            <BookDetailOverviewTab
              pageCount={docState.pageCount}
              bytes={docState.doc?.bytes}
              addedAt={docState.doc?.added_at}
              memberCollections={docState.memberCollections}
              editing={docState.editing}
              titleText={docState.titleText}
              tagsText={docState.tagsText}
              tags={docState.tags}
              authors={docState.authors}
              year={docState.doc?.year}
              displayTitle={docState.doc?.title || docState.titleText}
              busy={docState.busy}
              onStartEdit={docState.startEdit}
              onCancelEdit={() => docState.setEditing(false)}
              onSave={docState.handleSaveEdit}
              onTitleChange={docState.setTitleText}
              onTagsTextChange={docState.setTagsText}
            />
          )}
          translateTab={({ activeTab }) => (
            <BookDetailTranslateTab
              item={item}
              status={status}
              isActive={isActive}
              canTranslate={canTranslate}
              readerAvailable={readerAvailable}
              dialogOpen={open}
              tabActive={activeTab === "translate"}
              rangeOn={translateState.rangeOn}
              startPage={translateState.startPage}
              endPage={translateState.endPage}
              pageCount={docState.pageCount}
              busy={docState.busy}
              error={docState.error}
              onRangeOnChange={translateState.setRangeOn}
              onStartPageChange={translateState.setStartPage}
              onEndPageChange={translateState.setEndPage}
              onTranslate={translateState.handleTranslate}
            />
          )}
          moreTab={(
            <BookDetailMoreTab
              readingStatus={docState.readingStatus}
              busy={docState.busy}
              onReadingStatusChange={docState.handleReadingStatus}
              collections={docState.collections}
              collectionsBusy={docState.collectionsBusy}
              onToggleCollection={docState.toggleCollection}
              error={docState.error}
              confirmingDelete={docState.confirmingDelete}
              onDelete={docState.handleDelete}
            />
          )}
        />
      )}
    />
  );
}
