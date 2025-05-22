import {
  FETCH_LAST_ACCESSED_CASES_BEGIN,
  FETCH_LAST_ACCESSED_CASES_FAILURE,
  FETCH_LAST_ACCESSED_CASES_SUCCESS,
  FETCH_COMMULATIVE_CHECKLIST_BEGIN,
  FETCH_COMMULATIVE_CHECKLIST_FAILURE,
  FETCH_COMMULATIVE_CHECKLIST_SUCCESS,
  FETCH_SEARCH_DATA_BEGIN,
  FETCH_SEARCH_DATA_SUCCESS,
  FETCH_SEARCH_DATA_FAILURE,
  FETCH_SEARCH_ATTORNEY_BEGIN,
  FETCH_SEARCH_ATTORNEY_SUCCESS,
  FETCH_SEARCH_ATTORNEY_FAILURE,
  FETCH_ATTORNEY_DATA_BEGIN,
  FETCH_ATTORNEY_DATA_SUCCESS,
  FETCH_ATTORNEY_DATA_FAILURE,
} from "./actions";

const initialState = {
  last_accessed_cases: [],
  loading_last_accessed_cases: false,
  error_last_accessed_cases: null,

  commulative_checklist: [],
  loading_commulative_checklist: false,
  error_commulative_checklist: null,

  searchData: null,
  loadingSearchData: false,
  errorSearchData: null,

  searchAttorneyData: null,
  loadingSearchAttorney: false,
  errorSearchAttorney: null,

  loadingAttorneyData: false,
  errorAttorneyData: null,
  attorneyData: null,

  // client: "",
  clientId: "",
  caseId: "",
  // pages: [],
  // currentCase: "",
  searchResults: [],
  currentSearchStatus: "clients",
  currentTab: "client-name",
  searchName: "",
  searchText: "",
  alphabetSearch:true,
  searchTableLoader: false,
  loginLoader: false,
  tabsResultCount: {
    "client-name": 0,
    "client-email": 0,
    defendant: 0,
    witness: 0,
    claim: 0,
    "court-case": 0,
    otherparty: 0,
    address: 0,
    notes: 0,
    document: 0,
  },
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LAST_ACCESSED_CASES_BEGIN:
      return {
        ...state,
        loading_last_accessed_cases: true,
        error_last_accessed_cases: null,
      };

    case FETCH_LAST_ACCESSED_CASES_SUCCESS:
      return {
        ...state,
        loading_last_accessed_cases: false,
        last_accessed_cases: action.payload.cases,
      };

    case FETCH_LAST_ACCESSED_CASES_FAILURE:
      return {
        ...state,
        loading_last_accessed_cases: false,
        error_last_accessed_cases: action.payload.error,
        last_accessed_cases: [],
      };

    case FETCH_SEARCH_DATA_BEGIN:
      return {
        ...state,
        loadingSearchData: true,
        errorSearchData: null,
      };

    case FETCH_SEARCH_DATA_SUCCESS:
      return {
        ...state,
        loadingSearchData: false,
        searchData: action.payload.data,
      };

    case FETCH_SEARCH_DATA_FAILURE:
      return {
        ...state,
        loadingSearchData: false,
        errorSearchData: action.payload.error,
      };

    case FETCH_SEARCH_ATTORNEY_BEGIN:
      return {
        ...state,
        loadingSearchAttorney: true,
        errorSearchAttorney: null,
      };

    case FETCH_SEARCH_ATTORNEY_SUCCESS:
      return {
        ...state,
        loadingSearchAttorney: false,
        searchAttorneyData: action.payload.data,
      };

    case FETCH_SEARCH_ATTORNEY_FAILURE:
      return {
        ...state,
        loadingSearchAttorney: false,
        errorSearchAttorney: action.payload.error,
      };

    case FETCH_ATTORNEY_DATA_BEGIN:
      return {
        ...state,
        loadingAttorneyData: true,
        errorAttorneyData: null,
      };

    case FETCH_ATTORNEY_DATA_SUCCESS:
      return {
        ...state,
        loadingAttorneyData: false,
        attorneyData: action.payload,
      };

    case FETCH_ATTORNEY_DATA_FAILURE:
      return {
        ...state,
        loadingAttorneyData: false,
        errorAttorneyData: action.payload.error,
      };

    case FETCH_COMMULATIVE_CHECKLIST_BEGIN:
      return {
        ...state,
        loading_commulative_checklist: true,
        error_commulative_checklist: null,
      };

    case FETCH_COMMULATIVE_CHECKLIST_SUCCESS:
      return {
        ...state,
        commulative_checklist: action.payload.all_checklists,
        loading_commulative_checklist: false,
      };

    case FETCH_COMMULATIVE_CHECKLIST_FAILURE:
      return {
        ...state,
        error_commulative_checklist: action.payload.error,
        commulative_checklist: [],
      };

    case "SET_CLIENT_ID":
      return { ...state, clientId: action.payload };
    case "SET_CASE_ID":
      return { ...state, caseId: action.payload };
    case "SET_CLIENT":
      return { ...state, client: action.payload };
    case "SET_PAGES":
      return { ...state, pages: action.payload };
    case "SET_CURRENT_CASE":
      return { ...state, currentCase: action.payload };
    case "SET_SEARCH_TAB_RESULTS":
      return { ...state, searchResults: action.payload };
    case "SET_SEARCH_CLIENT_RESULTS":
      return { ...state, searchResults: action.payload };
    case "SET_CURRENT_SEARCH_STATUS":
      return { ...state, currentSearchStatus: action.payload };
    case "SET_SEARCH_NAME":
      return { ...state, searchName: action.payload };
    case "SET_SEARCH_TEXT":
      return { ...state, searchText: action.payload };
    case "SET_CURRENT_TAB":
      return { ...state, currentTab: action.payload };
    case "SET_SEARCH_TABLE_LOADER":
      return { ...state, searchTableLoader: action.payload };
    case "SET_ALPHABET_SEARCH":
      return { ...state, alphabetSearch: action.payload };
    case "SET_LOGIN_LOADER":
      return { ...state, loginLoader: action.payload };
    case "SET_TABS_RESULT_COUNT":
      return { ...state, tabsResultCount: action.payload };
    default:
      return state;
  }
};

export default searchReducer;
