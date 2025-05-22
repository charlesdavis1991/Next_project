export const setInboxTab = (tab_name) => ({
  type: "SET_INBOX_TAB",
  payload: tab_name,
});

export const setInboxDocPanels = (doc_panels) => ({
  type: "SET_INBOX_DOC_PANELS",
  payload: doc_panels,
});

export const setInboxTabsCount = (tabs_count) => ({
  type: "SET_INBOX_TABS_COUNT",
  payload: tabs_count,
});

export const setInboxTableLoader = (inbox_loader) => ({
  type: "SET_INBOX_TABLE_LOADER",
  payload: inbox_loader,
});

export const setInboxDocumentHistory = (document_history) => ({
  type: "SET_INBOX_DOCUMENT_HISTORY",
  payload: document_history,
});

export const setInboxAllDocuments = (all_documents) => ({
  type: "SET_INBOX_ALL_DOCUMENTS",
  payload: all_documents,
});

export const setInboxProcessingDocuments = (processing_documents) => ({
  type: "SET_INBOX_PROCESSING_DOCUMENTS",
  payload: processing_documents,
});

export const setInboxFailedOcrDocuments = (failed_ocr_documents) => ({
  type: "SET_INBOX_FAILED_OCR_DOCUMENTS",
  payload: failed_ocr_documents,
});

export const setInboxRefreshDocuments = (inbox_refresh_documents) => ({
  type: "SET_INBOX_REFRESH_DOCUMENTS",
  payload: inbox_refresh_documents,
});

export const setInboxRefreshDocumentsDueToDelete = (
  inbox_refresh_documents_due_to_delete
) => ({
  type: "SET_INBOX_REFRESH_DOCUMENTS_DUE_TO_DELETE",
  payload: inbox_refresh_documents_due_to_delete,
});

export const setLoginUserInfo = (loginUserInfo) => ({
  type: "SET_LOGIN_USER_INFO",
  payload: loginUserInfo,
});

export const setUnsortedCase = (unsortedCase) => ({
  type: "SET_UNSORTED_CASE",
  payload: unsortedCase,
});

export const setUnsortedPage = (unsortedPage) => ({
  type: "SET_UNSORTED_PAGE",
  payload: unsortedPage,
});

export const setTabsToShow = (tabsToShow) => ({
  type: "SET_TABS_TO_SHOW",
  payload: tabsToShow,
});

export const setNestedDropdowns = (nestedDropdowns) => ({
  type: "SET_NESTED_DROPDOWNS",
  payload: nestedDropdowns,
});

export const setSelectedPanelId = (selectedPanelId) => ({
  type: "SET_SELECTED_PANEL_ID",
  payload: selectedPanelId,
});

export const setSelectedPanelName = (selectedPanelName) => ({
  type: "SET_SELECTED_PANEL_NAME",
  payload: selectedPanelName,
});

export const setDefaultUserTypes = (defaultuserTypes) => ({
  type: "SET_DEFAULT_USER_TYPES",
  payload: defaultuserTypes,
});

export const setInboxSearch = (inboxSearch) => ({
  type: "SET_INBOX_SEARCH",
  payload: inboxSearch,
});

export const setInboxHistoryLoader = (history_loader) => ({
  type: "SET_INBOX_HISTORY_LOADER",
  payload: history_loader,
});
