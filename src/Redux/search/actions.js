import api from "../../api/api";

export const FETCH_LAST_ACCESSED_CASES_BEGIN =
  "FETCH_LAST_ACCESSED_CASES_BEGIN";
export const FETCH_LAST_ACCESSED_CASES_SUCCESS =
  "FETCH_LAST_ACCESSED_CASES_SUCCESS";
export const FETCH_LAST_ACCESSED_CASES_FAILURE =
  "FETCH_LAST_ACCESSED_CASES_FAILURE";

export const FETCH_COMMULATIVE_CHECKLIST_BEGIN =
  "FETCH_COMMULATIVE_CHECKLIST_BEGIN";
export const FETCH_COMMULATIVE_CHECKLIST_SUCCESS =
  "FETCH_COMMULATIVE_CHECKLIST_SUCCESS";
export const FETCH_COMMULATIVE_CHECKLIST_FAILURE =
  "FETCH_COMMULATIVE_CHECKLIST_FAILURE";

export const FETCH_SEARCH_DATA_BEGIN = "FETCH_SEARCH_DATA_BEGIN";
export const FETCH_SEARCH_DATA_SUCCESS = "FETCH_SEARCH_DATA_SUCCESS";
export const FETCH_SEARCH_DATA_FAILURE = "FETCH_SEARCH_DATA_FAILURE";

// search attorney list starts here

export const FETCH_SEARCH_ATTORNEY_BEGIN = "FETCH_SEARCH_ATTORNEY_BEGIN";
export const FETCH_SEARCH_ATTORNEY_SUCCESS = "FETCH_SEARCH_ATTORNEY_SUCCESS";
export const FETCH_SEARCH_ATTORNEY_FAILURE = "FETCH_SEARCH_ATTORNEY_FAILURE";

export const FETCH_ATTORNEY_DATA_BEGIN = "FETCH_ATTORNEY_DATA_BEGIN";
export const FETCH_ATTORNEY_DATA_SUCCESS = "FETCH_ATTORNEY_DATA_SUCCESS";
export const FETCH_ATTORNEY_DATA_FAILURE = "FETCH_ATTORNEY_DATA_FAILURE";

// serch attorney list ends here

export const setClientId = (client_id) => ({
  type: "SET_CLIENT_ID",
  payload: client_id,
});

export const setCaseId = (case_id) => ({
  type: "SET_CASE_ID",
  payload: case_id,
});

export const setSearchTabResults = (results) => ({
  type: "SET_SEARCH_TAB_RESULTS",
  payload: results,
});

export const setSearchClientResults = (results) => ({
  type: "SET_SEARCH_CLIENT_RESULTS",
  payload: results,
});

export const setCurrentSearchStatus = (status) => ({
  type: "SET_CURRENT_SEARCH_STATUS",
  payload: status,
});

export const setSearchName = (name) => ({
  type: "SET_SEARCH_NAME",
  payload: name,
});

export const setSearchText = (text) => ({
  type: "SET_SEARCH_TEXT",
  payload: text,
});

export const setCurrentTab = (tab) => ({
  type: "SET_CURRENT_TAB",
  payload: tab,
});

export const setSearchTableLoader = (loader) => ({
  type: "SET_SEARCH_TABLE_LOADER",
  payload: loader,
});
export const setAlphabetSearch = (status) => ({
  type: "SET_ALPHABET_SEARCH",
  payload: status,
});

export const setLoginLoader = (loader) => ({
  type: "SET_LOGIN_LOADER",
  payload: loader,
});

export const setTabsResultCount = (tabs_count) => ({
  type: "SET_TABS_RESULT_COUNT",
  payload: tabs_count,
});

export const fetchLastAccessedCasesBegin = () => ({
  type: FETCH_LAST_ACCESSED_CASES_BEGIN,
});

export const fetchLastAccessedCasesSuccess = (cases) => ({
  type: FETCH_LAST_ACCESSED_CASES_SUCCESS,
  payload: { cases },
});

export const fetchLastAccessedCasesFailure = (error) => ({
  type: FETCH_LAST_ACCESSED_CASES_FAILURE,
  payload: { error },
});

export const fetchCommulativeChecklistFailure = (error) => ({
  type: FETCH_COMMULATIVE_CHECKLIST_FAILURE,
  payload: { error },
});

export const fetchCommulativeChecklistBegin = () => ({
  type: FETCH_COMMULATIVE_CHECKLIST_BEGIN,
});

export const fetchCommulativeChecklistSuccess = (all_checklists) => ({
  type: FETCH_COMMULATIVE_CHECKLIST_SUCCESS,
  payload: { all_checklists },
});

export const fetchSearchDataFailure = (error) => ({
  type: FETCH_SEARCH_DATA_FAILURE,
  payload: { error },
});

// search attorney starts here

export const fetchAttorneylistBegin = () => ({
  type: FETCH_SEARCH_ATTORNEY_BEGIN,
});

export const fetchAttorneylistSuccess = (list) => ({
  type: FETCH_SEARCH_ATTORNEY_SUCCESS,
  payload: list,
});

export const fetchAttorneylistFailure = (error) => ({
  type: FETCH_SEARCH_ATTORNEY_FAILURE,
  payload: { error },
});

export const fetchAttorneyDataBegin = () => ({
  type: FETCH_ATTORNEY_DATA_BEGIN,
});

export const fetchAttorneyDataSuccess = (data) => ({
  type: FETCH_ATTORNEY_DATA_SUCCESS,
  payload: data,
});

export const fetchAttorneyDataFailure = (error) => ({
  type: FETCH_ATTORNEY_DATA_FAILURE,
  payload: { error },
});

// search attorney ends here

export const fetchSearchDataBegin = () => ({
  type: FETCH_SEARCH_DATA_BEGIN,
});

export const fetchSearchDataSuccess = (data) => ({
  type: FETCH_SEARCH_DATA_SUCCESS,
  payload: { data },
});

export const fetchLastAccessedCases = (client_id, case_id) => {
  return (dispatch) => {
    dispatch(fetchLastAccessedCasesBegin());
    api
      .get(`/api/last-accessed-cases/${client_id}/${case_id}/`)
      .then((response) => {
        dispatch(fetchLastAccessedCasesSuccess(response.data));
      })
      .catch((error) => {
        console.error("error", error);
        dispatch(fetchLastAccessedCasesFailure(error));
      });
  };
};

export const fetchSearchPageData = (client_id, case_id) => {
  return (dispatch) => {
    dispatch(fetchSearchDataBegin());
    api
      .get(`/api/global-search/${client_id}/${case_id}/`)
      .then((response) => {
        dispatch(fetchSearchDataSuccess(response.data));
      })
      .catch((error) => {
        dispatch(fetchSearchDataFailure(error));
      });
  };
};

export const fetchCommulativeChecklist = (client_id, case_id) => {
  return (dispatch) => {
    dispatch(fetchCommulativeChecklistBegin());
    api
      .get(`/api/commulative-checklist/${client_id}/${case_id}/`)
      .then((response) => {
        dispatch(fetchCommulativeChecklistSuccess(response.data));
      })
      .catch((error) => {
        console.error("error", error);
        dispatch(fetchCommulativeChecklistFailure(error));
      });
  };
};

export const fetchAttorneylist = (name, id) => {
  return (dispatch) => {
    dispatch(fetchAttorneylistBegin());
    api
      .get(`/api/SearchAttorney/?query=${name}&attorney_id=${id}`)
      .then((response) => {
        dispatch(fetchAttorneylistSuccess(response.data));
      })
      .catch((error) => {
        console.error("error", error);
        dispatch(fetchAttorneylistFailure(error));
      });
  };
};

export const fetchAttorneyData = (name, id) => {
  return (dispatch) => {
    dispatch(fetchAttorneyDataBegin());
    api
      .get(`/api/SearchAttorney/?query=${name}&attorney_id=${id}`)
      .then((response) => {
        dispatch(fetchAttorneyDataSuccess(response.data));
      })
      .catch((error) => {
        dispatch(fetchAttorneyDataFailure(error));
      });
  };
};
