import {
  FETCH_CASE_PAGE_DATA_BEGIN,
  FETCH_CASE_PAGE_DATA_FAILURE,
  FETCH_CASE_PAGE_DATA_SUCCESS,
  CREATE_NEW_CLIENT_BEGIN,
  CREATE_NEW_CLIENT_SUCCESS,
  CREATE_NEW_CLIENT_FAILURE,
  ADD_CO_COUNSELING_BEGIN,
  ADD_CO_COUNSELING_SUCCESS,
  ADD_CO_COUNSELING_FAILURE,
  UPDATE_WORKER_ON_CASE_BEGIN,
  UPDATE_WORKER_ON_CASE_SUCCESS,
  UPDATE_WORKER_ON_CASE_FAIL,
  FETCH_CLIENTS_ON_CASE_BEGIN,
  FETCH_CLIENTS_ON_CASE_SUCCESS,
  FETCH_CLIENTS_ON_CASE_FAILURE,
} from "./actions";

const initialState = {
  caseData: null,
  loadingCaseData: false,
  errorCaseData: null,

  clientsOnCase: null,
  loadingClientsOnCase: false,
  errorClientsOnCase: null,

  loadingCoCounselingData: false,
  errorCoCounselingData: null,
  coCounselingData: [],
};

const caseReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CASE_PAGE_DATA_BEGIN:
      return {
        ...state,
        loadingCaseData: true,
        errorCaseData: null,
      };

    case FETCH_CASE_PAGE_DATA_SUCCESS:
      return {
        ...state,
        loadingCaseData: false,
        caseData: action.payload.cases,
      };

    case FETCH_CASE_PAGE_DATA_FAILURE:
      return {
        ...state,
        loadingCaseData: false,
        errorCaseData: action.payload.error,
        caseData: [],
      };

      // clients on case
      case FETCH_CLIENTS_ON_CASE_BEGIN:
        return {
          ...state,
          loadingClientsOnCase: true,
          errorClientsOnCase: null,
        };
  
      case FETCH_CLIENTS_ON_CASE_SUCCESS:
        return {
          ...state,
          loadingClientsOnCase: false,
          clientsOnCase: action.payload.clients_on_case,
        };
  
      case FETCH_CLIENTS_ON_CASE_FAILURE:
        return {
          ...state,
          loadingClientsOnCase: false,
          errorClientsOnCase: action.payload.error,
          clientsOnCase: [],
        };
      case UPDATE_WORKER_ON_CASE_BEGIN:
        return {
          ...state,
          loadingCaseData: true,
          errorCaseData: null,
        };
  
      case UPDATE_WORKER_ON_CASE_SUCCESS:
        return {
          ...state,
          loadingCaseData: false,
          caseData: {...state.caseData, case: action.payload},
        };
  
      case UPDATE_WORKER_ON_CASE_FAIL:
        return {
          ...state,
          loadingCaseData: false,
          errorCaseData: action.payload.error,
          caseData: [],
        };
    case CREATE_NEW_CLIENT_BEGIN:
      return {
        ...state,
        loadingClientData: true,
        errorClientData: null,
      };

    case CREATE_NEW_CLIENT_SUCCESS:
      return {
        ...state,
        loadingClientData: false,
        clientData: action.payload.client,
      };

    case CREATE_NEW_CLIENT_FAILURE:
      return {
        ...state,
        loadingClientData: false,
        errorClientData: action.payload.error,
        clientData: [],
      };

    case ADD_CO_COUNSELING_BEGIN:
      return {
        ...state,
        loadingCoCounselingData: true,
        errorCoCounselingData: null,
      };

    case ADD_CO_COUNSELING_SUCCESS:
      return {
        ...state,
        loadingCoCounselingData: false,
        coCounselingData: action.payload,
      };

    case ADD_CO_COUNSELING_FAILURE:
      return {
        ...state,
        loadingCoCounselingData: false,
        errorCoCounselingData: action.payload.error,
        coCounselingData: [],
      };

    default:
      return state;
  }
};

export default caseReducer;
