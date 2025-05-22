import { getCaseId, getClientId, getToken } from "../../Utils/helper";
import axios from "axios";
import { setError } from "../todos/actions";
import api from "../../api/api";


export const SET_LOADING = "SET_LOADING";
export const MODIFY_CHECKLIST_DATA = "MODIFY_CHECKLIST_DATA";
export const MODIFY_PREEXIST_CHECKLIST_DATA = "MODIFY_PREEXIST_CHECKLIST_DATA";
export const SET_CHECKLIST_DATA = "SET_CHECKLIST_DATA";
export const SET_FIRM_CASES = "SET_FIRM_CASES";
export const CHECKLIST_CASE_PERCENTAGE = "CHECKLIST_CASE_PERCENTAGE";
export const SET_CASES_BY_CASE_TYPE = "SET_CASES_BY_CASE_TYPE";
export const SET_CASE_WORKER_TYPES = "SET_CASE_WORKER_TYPES";
export const SET_CASE_ASSIGN_TASKS = "SET_CASE_ASSIGN_TASKS";



// const baseUrl = "https://dev.simplefirm.com";



const auth_config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken(),
    },
  };



axios.defaults.timeout = 3000000;
axios.defaults.timeoutErrorMessage = "TIMEOUT_CODE";



export const setLoading = (isLoading) => ({
    type: SET_LOADING,
    payload: isLoading,
  });
  export const setCheckListData = (bodyData) => ({
    type: SET_CHECKLIST_DATA,
    payload: bodyData,
  });
  
  export const modifyCheckList = (bodyData) => ({
    type: MODIFY_CHECKLIST_DATA,
    payload: bodyData,
  });
  export const modifyPreexistCheckList = (bodyData) => ({
    type: MODIFY_PREEXIST_CHECKLIST_DATA,
    payload: bodyData,
  });

  export const setFirmCases = (bodyData) => ({
    type : SET_FIRM_CASES,
    payload : bodyData
  })

  export const setCheckListCasePercentage = (bodyData) => ({
    type : CHECKLIST_CASE_PERCENTAGE,
    payload : bodyData
  })

  export const setCasesByCaseType = (bodyData) => ({
    type : SET_CASES_BY_CASE_TYPE,
    payload : bodyData
  })
  
  export const setCaseWorkerTypes = (bodyData) => ({
    type : SET_CASE_WORKER_TYPES,
    payload : bodyData
  })
  

  export const assignCaseTask = (bodyData) => ({
    type : SET_CASE_ASSIGN_TASKS,
    payload : bodyData
  })


// * Api Calls
export const fetchCheckListPageData = async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await api.get(
      `/api/checklist/${getClientId()}/${getCaseId()}/`,
      auth_config
    );
    const data = response?.data;
    dispatch(setCheckListData(data));
    dispatch(setLoading(false));
  } catch (error) {
    console.error(error);
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};


export const getCaseTypes = async (dispatch, duration) => {
  dispatch(setLoading(true));
    try {
      const response = await api.post(
        `/api/get_page_casetype_name/`,
        {
          duration : duration
        },
        auth_config
      );
      dispatch(setFirmCases(response?.data));
    } catch (error) {
      console.error("getCaseTypes API Called Error : ", error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
}

export const getCheckListPercentage  = async (dispatch,  page_name, duration, case_type) => {
  dispatch(setLoading(true));
  try {
    const data = {
      page_name: page_name,
      duration: duration,
      case_type : case_type
    }
    const response = await api.post(
      `/api/calculate_checklist_percentages/`,
      data 
    );
    dispatch(setCheckListCasePercentage({
      "caseType" : case_type,
      "pageName" : page_name,
      "data" : response?.data?.checklist_percentage
    }));
  } catch (error) {
    console.error("getCheckListPercentage API Called Error : ", error);
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
}


export const getCasesByCaseType  = async (dispatch,  page_name, duration, case_type) => {
  dispatch(setLoading(true));
  try {
    const data = {
      page_name: page_name,
      duration: duration,
      case_type : case_type
    }
    const response = await api.post(
      `/api/casetype_checklist_cases/`,
      data 
    );
    dispatch(setCasesByCaseType({
      case_type : case_type,
      page_name : page_name,
      data_cases : response?.data
    }));
  } catch (error) {
    console.error("getCasesByCaseType API Called Error : ", error);
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
}

export const getCaseWorkerTypes  = async (dispatch,  case_id, userprofile_id) => {
  dispatch(setLoading(true));
  try {
    const data = {
      case_id: case_id,
      userprofile_id: userprofile_id,
    }
    const response = await api.post(
      `/api/case_worker_types/`,
      data 
    );
    dispatch(setCaseWorkerTypes(response?.data));
  } catch (error) {
    console.error("getCaseWorkerTypes API Called Error : ", error);
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
}



export const setCaseAssignTasks = async (dispatch, postData) => {
  dispatch(setLoading(true))
  
  try{
    const response = await api.post(
      `/api/addTaskChecklistPopUp/`,
      postData
    );
    dispatch(assignCaseTask(response?.data))
  } catch(error) {
    console.error("setCaseAssignTasks API Called Error : ", error);
    dispatch(setError(error.message));
  }
  finally {
    dispatch(setLoading(false));
  }
}

  export const addCheckList = async (data) => {
    // try {
    //   const response = await api.post(
    //     `/api/injury/add_injury/3/4/`,
    //     data,
    //     auth_config
    //   );
    //   console.log(response, "090909");
    //   return response.data;
    // } catch (error) {}
  };
  


  export const addPreexistingCheckList = async (data) => {
    // try {
    //   const response = await api.post(
    //     `/api/injury/add_pre_existing_injury/`,
    //     data,
    //     auth_config
    //   );
  
    //   console.log(response, "090909");
    //   const res = response.data;
    //   return res;
    // } catch (error) {}
  };
  