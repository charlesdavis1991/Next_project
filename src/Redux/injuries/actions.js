import { getCaseId, getClientId, getToken } from "../../Utils/helper";
import axios from "axios";
import { setError } from "../todos/actions";
import api from "../../api/api";

// To do page
// Action Types

export const SET_LOADING = "SET_LOADING";
export const MODIFY_INJURIES_DATA = "MODIFY_INJURIES_DATA";
export const MODIFY_PREEXIST_INJURIES_DATA = "MODIFY_PREEXIST_INJURIES_DATA";
export const SET_INJURIES_DATA = "SET_INJURIES_DATA";
export const UPDATE_INJURIES = 'UPDATE_INJURIES';

export const updateInjuries = (injuries) => ({
  type: UPDATE_INJURIES,
  payload: injuries,
});

// const origin = process.env.REACT_APP_BACKEND_URL;

const baseUrl = "https://dev.simplefirm.com";
//const baseUrl = "http://127.0.0.1:8000/api";

const auth_config = {
  headers: {
    "Content-Type": "application/json",
    Authorization: getToken(),
  },
};

axios.defaults.timeout = 3000000;
axios.defaults.timeoutErrorMessage = "TIMEOUT_CODE";

// Injury page
// Action Types

// Action Creators

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

// * Api Calls
export const fetchInjuryPageData = async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await api.get(
      `/api/injury/${getClientId()}/${getCaseId()}/`,
      auth_config
    );

    const data = response.data;
    dispatch(setInjuriesData(data));
    dispatch(setLoading(false));
    //alert(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(error);
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

export const addInjury = async (data, dispatch) => {
  try {
    const response = await api.post(
      `/api/injury/add_injury/${getClientId()}/${getCaseId()}/`,
      data,
      auth_config
    );
    const updatedInjuriesData = response.data;
    //dispatch(modifyInjutries(updatedInjuriesData));
    return response.data;
  } catch (error) {}
};

export const addPreexistingInjuries = async (data) => {
  try {
    const response = await api.post(
      `/api/injury/add_pre_existing_injury/`,
      data,
      auth_config
    );

    const res = response.data;
    return res;
  } catch (error) {}
};
