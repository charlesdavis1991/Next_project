import { getCaseId, getClientId } from "../../Utils/helper";
import api from "../../api/api";
import { fetchCaseSummary } from "../../api/case";
import { setCaseSummary } from "../caseData/caseDataSlice";

export const FETCH_CASE_PAGE_DATA_BEGIN = "FETCH_CASE_PAGE_DATA_BEGIN";
export const FETCH_CASE_PAGE_DATA_SUCCESS = "FETCH_CASE_PAGE_DATA_SUCCESS";
export const FETCH_CASE_PAGE_DATA_FAILURE = "FETCH_CASE_PAGE_DATA_FAILURE";

export const FETCH_CLIENTS_ON_CASE_BEGIN = "FETCH_CLIENTS_ON_CASE_BEGIN";
export const FETCH_CLIENTS_ON_CASE_SUCCESS = "FETCH_CLIENTS_ON_CASE_SUCCESS";
export const FETCH_CLIENTS_ON_CASE_FAILURE = "FETCH_CLIENTS_ON_CASE_FAILURE";

export const CREATE_NEW_CLIENT_BEGIN = "CREATE_NEW_CLIENT_BEGIN";
export const CREATE_NEW_CLIENT_SUCCESS = "CREATE_NEW_CLIENT_SUCCESS";
export const CREATE_NEW_CLIENT_FAILURE = "CREATE_NEW_CLIENT_FAILURE";

export const UPDATE_WORKER_ON_CASE_BEGIN = "UPDATE_WORKER_ON_CASE_BEGIN";
export const UPDATE_WORKER_ON_CASE_SUCCESS = "UPDATE_WORKER_ON_CASE_SUCCESS";
export const UPDATE_WORKER_ON_CASE_FAIL = "UPDATE_WORKER_ON_CASE_FAIL";

export const ADD_CO_COUNSELING_BEGIN = "ADD_CO_COUNSELING_BEGIN";
export const ADD_CO_COUNSELING_SUCCESS = "ADD_CO_COUNSELING_SUCCESS";
export const ADD_CO_COUNSELING_FAILURE = "ADD_CO_COUNSELING_FAILURE";

export const fetchCaseDataBegin = () => ({
  type: FETCH_CASE_PAGE_DATA_BEGIN,
});

export const fetchCaseDataSuccess = (cases) => ({
  type: FETCH_CASE_PAGE_DATA_SUCCESS,
  payload: { cases },
});

export const fetchCaseDataFail = (error) => ({
  type: FETCH_CASE_PAGE_DATA_FAILURE,
  payload: { error },
});

// fetch clients on case
export const fetchClientsOnCaseBegin = () => ({
  type: FETCH_CLIENTS_ON_CASE_BEGIN,
});

export const fetchClientsOnCaseSuccess = (clients_on_case) => ({
  type: FETCH_CLIENTS_ON_CASE_SUCCESS,
  payload: { clients_on_case },
});

export const fetchClientsOnCaseFail = (error) => ({
  type: FETCH_CLIENTS_ON_CASE_FAILURE,
  payload: { error },
});
// create new Client start here

export const createNewClientBegin = () => ({
  type: CREATE_NEW_CLIENT_BEGIN,
});

export const createNewClientSuccess = (client) => ({
  type: CREATE_NEW_CLIENT_SUCCESS,
  payload: { client },
});

export const createNewClientFail = (error) => ({
  type: CREATE_NEW_CLIENT_FAILURE,
  payload: { error },
});

export const updateWorkerOnCaseBegin = () => ({
  type: UPDATE_WORKER_ON_CASE_BEGIN,
});

export const updateWorkerOnCaseSuccess = (payload) => ({
  type: UPDATE_WORKER_ON_CASE_SUCCESS,
  payload,
});

export const updateWorkerOnCaseFail = (error) => ({
  type: UPDATE_WORKER_ON_CASE_FAIL,
  payload: { error },
});
// create new Client ends here

// addCoCounselingFirm start here

export const addCoCounselingFirmBegin = () => ({
  type: ADD_CO_COUNSELING_BEGIN,
});

export const addCoCounselingFirmSuccess = (data) => ({
  type: ADD_CO_COUNSELING_SUCCESS,
  payload: data,
});

export const addCoCounselingFirmFail = (error) => ({
  type: ADD_CO_COUNSELING_FAILURE,
  payload: { error },
});

// addCoCounselingFirm ends here

export const fetchCasePageData = (client_id, case_id) => {
  return (dispatch) => {
    dispatch(fetchCaseDataBegin());
    api
      .get(`/api/case/${client_id}/${case_id}/`)
      .then((response) => {
        dispatch(fetchCaseDataSuccess(response.data));
      })
      .catch((error) => {
        console.error("error", error);
        dispatch(fetchCaseDataFail(error));
      });
  };
};

export const fetchClientsOnCase = (case_id) => {
  return (dispatch) => {
    dispatch(fetchClientsOnCaseBegin());
    api
      .get(`/api/case-clients/${case_id}/`)
      .then((response) => {
        dispatch(fetchClientsOnCaseSuccess(response.data));
      })
      .catch((error) => {
        console.error("error", error);
        dispatch(fetchClientsOnCaseFail(error));
      });
  };
};

export const createNewClientInExistingCase = (data) => {
  return (dispatch) => {
    dispatch(createNewClientBegin());
    api
      .post(`/api/case/new-client/`, data)
      .then((response) => {
        dispatch(createNewClientSuccess(response.data));
        if (response.data) {
          dispatch(fetchClientsOnCase(data.case_id));
        }
      })
      .catch((error) => {
        console.error("error", error);
        dispatch(createNewClientFail(error));
      });
  };
};

export const updateWorkerOnCase = (data) => {
  return (dispatch) => {
    dispatch(updateWorkerOnCaseBegin());
    api
      .post(`/api/case-update/`, data)
      .then((response) => {
        dispatch(updateWorkerOnCaseSuccess(response.data));
      })
      .catch((error) => {
        console.error("error", error);
        dispatch(updateWorkerOnCaseFail(error));
      });
  };
};

export const addCoCounselingFirm = (data) => {
  return (dispatch) => {
    dispatch(addCoCounselingFirmBegin());

    api
      .post(`/api/addCoCounselingFirm/`, data)
      .then((response) => {
        dispatch(addCoCounselingFirmSuccess(response.data));
        fetchCaseSummary(getClientId(), getCaseId())
          .then((data) => {
            dispatch(setCaseSummary(data));
          })
          .catch((err) => {
            console.error("Error occurred", err);
          });
      })
      .catch((error) => {
        console.error("error", error);
        dispatch(addCoCounselingFirmFail(error));
      });
  };
};


export const sendChatMessage = async (data, callback) => {
  api
    .post(`/api/send_case_worker_chat_message/${getClientId()}/${getCaseId()}/`, data)
    .then((response) => {
      callback()
      return response?.data;
    })
    .catch((error) => {
      console.error("error", error);
    });
};
