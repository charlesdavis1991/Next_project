import {
  getCaseId,
  getClientId,
  getToken,
  removeToken,
} from "../../Utils/helper";
import axios from "axios";
import api from "../../api/api";

// const origin = process.env.REACT_APP_BACKEND_URL;
const origin = "https://dev.simplefirm.com";
const baseUrl = "https://dev.simplefirm.com";
// const baseUrl = "http://127.0.0.1:8000/api";

const auth_config = {
  headers: {
    "Content-Type": "application/json",
    Authorization: getToken(),
  },
};

axios.defaults.timeout = 3000000;
axios.defaults.timeoutErrorMessage = "TIMEOUT_CODE";

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

export const setLoginLoader = (loader) => ({
  type: "SET_LOGIN_LOADER",
  payload: loader,
});

export const setTabsResultCount = (tabs_count) => ({
  type: "SET_TABS_RESULT_COUNT",
  payload: tabs_count,
});

// To do page
// Action Types
export const SET_CASES = "SET_CASES";
export const SET_CLIENT = "SET_CLIENT";
export const SET_CURRENT_CASE = "SET_CURRENT_CASE";
export const SET_LAST_ACCESSED_CASES = "SET_LAST_ACCESSED_CASES";
export const SET_PAGES = "SET_PAGES";
export const SET_ALL_CLIENTS = "SET_ALL_CLIENTS";
export const SET_TODOS = "SET_TODOS";
export const SET_TODO_TABS = "SET_TODO_TABS";
export const SET_SEARCH_TABLE_LOADER = "SET_SEARCH_TABLE_LOADER";
export const SET_ERROR = "SET_ERROR";
export const SET_LOADING = "SET_LOADING";
export const SET_CURRENT_TODOS_TAB = "SET_CURRENT_TODOS_TAB";
export const MODIFY_INJURIES_DATA = "MODIFY_INJURIES_DATA";
export const MODIFY_PREEXIST_INJURIES_DATA = "MODIFY_PREEXIST_INJURIES_DATA";
export const SET_WORK_LIST_DATA = "SET_WORK_LIST_DATA";

// Injury page
// Action Types

export const SET_INJURIES_DATA = "SET_INJURIES_DATA";

// Action Creators
export const setCases = (cases) => ({
  type: SET_CASES,
  payload: cases,
});

export const setClient = (client) => ({
  type: SET_CLIENT,
  payload: client,
});

export const setCurrentCase = (currentCase) => ({
  type: SET_CURRENT_CASE,
  payload: currentCase,
});

export const setLastAccessedCases = (lastAccessedCases) => ({
  type: SET_LAST_ACCESSED_CASES,
  payload: lastAccessedCases,
});

export const setPages = (pages) => ({
  type: SET_PAGES,
  payload: pages,
});

export const setAllClients = (allClients) => ({
  type: SET_ALL_CLIENTS,
  payload: allClients,
});

export const setTodos = (todos) => ({
  type: SET_TODOS,
  payload: todos,
});
export const setWorkListData = (workList) => ({
  type: SET_WORK_LIST_DATA,
  payload: workList,
});

export const setTodoTabs = (todoTabs) => ({
  type: SET_TODO_TABS,
  payload: todoTabs,
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

export const setLoading = (isLoading) => ({
  type: SET_LOADING,
  payload: isLoading,
});
export const setInjuriesData = (bodyData) => ({
  type: SET_INJURIES_DATA,
  payload: bodyData,
});

export const modifyInjutries = (bodyData) => ({
  type: MODIFY_INJURIES_DATA,
  payload: bodyData,
});
export const modifyPreexistInjutries = (bodyData) => ({
  type: MODIFY_PREEXIST_INJURIES_DATA,
  payload: bodyData,
});

export const setCurrentTodosTab = (selectedTab) => ({
  type: SET_CURRENT_TODOS_TAB,
  payload: selectedTab,
});

export const fetchTaskDocumentPopupData = async (
  client_id,
  case_id,
  user_id,
  doc_id,
  setTaskDocumentPopupData
) => {
  await api
    .post(
      `/api/add_task_document_popup/`,
      {
        client_id: client_id,
        case_id: case_id,
        user_id: user_id,
        doc_id: doc_id,
      },
      auth_config
    )
    .then((res) => {
      setTaskDocumentPopupData(res?.data);
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        window.location.reload();
      }
    });
};

export const fetchTodosPageData = async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const response = await api.get(
      `/api/todos/${getClientId()}/${getCaseId()}/`,
      auth_config
    );
    const data = response.data;
    dispatch(setCases(data.case));
    dispatch(setClient(data.client));
    dispatch(setCurrentCase(data.current_case));
    dispatch(setLastAccessedCases(data.last_accessed_cases));
    dispatch(setPages(data.pages));
    dispatch(setAllClients(data.all_clients));
    dispatch(setTodos(data));
    dispatch(setTodoTabs(data?.todo_types));
    dispatch(setLoading(false));
  } catch (error) {
    console.error(error);
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

export const fetchWorkListPageData = async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const response = await api.get(
      `/api/work_list/${getClientId()}/${getCaseId()}/`,
      auth_config
    );

    const data = response.data;
    dispatch(setCases(data.case));
    dispatch(setClient(data.client));
    dispatch(setCurrentCase(data.current_case));
    dispatch(setLastAccessedCases(data.last_accessed_cases));
    dispatch(setPages(data.pages));
    dispatch(setAllClients(data.all_clients));
    dispatch(setWorkListData(data));
    dispatch(setTodoTabs(data?.todo_types));
    dispatch(setLoading(false));
    dispatch(setError(null));
  } catch (error) {
    console.error(error);
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

export const postTodosCompletion = async (data) => {
  try {
    const response = await api.post(`/api/todo_completion/`, data, auth_config);
    return response.data;
  } catch (error) {
    console.error(error?.response?.status);
    throw error;
  }
};

export const sendChatMessage = async (data) => {
  try {
    const response = await api.post(
      `/api/send_chat_message/3/4/`,
      data,
      auth_config
    );

    return response.data;
  } catch (error) {
    console.error(error?.response?.status);
    throw error;
  }
};
