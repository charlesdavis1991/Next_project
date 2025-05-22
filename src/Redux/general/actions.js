export const setInactivityTimeout = (inactivity_timeout) => ({
    type: 'SET_INACTIVITY_TIMEOUT',
    payload: inactivity_timeout,
});

export const setStatusLoader = (status_loader) => ({
    type: 'SET_STATUS_LOADER',
    payload: status_loader,
});

export const setToDoCount = (to_do_count) => ({
    type: 'SET_TO_DO_COUNT',
    payload: to_do_count,
});

export const setFlaggedPageCount = (flagged_page_count) => ({
    type: 'SET_FLAGGED_PAGE_COUNT',
    payload: flagged_page_count,
});