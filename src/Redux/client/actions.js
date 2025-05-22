import { getCaseId, getClientId, getToken } from "../../Utils/helper";
import api from '../../api/api';
import axios from "axios";
// src/actions/actionTypes.js
export const FETCH_CLIENT_DATA_REQUEST = 'FETCH_CLIENT_DATA_REQUEST';
export const FETCH_CLIENT_DATA_SUCCESS = 'FETCH_CLIENT_DATA_SUCCESS';
export const FETCH_CLIENT_DATA_FAILURE = 'FETCH_CLIENT_DATA_FAILURE';

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
  

export const fetchClientDataRequest = () => ({
    type: FETCH_CLIENT_DATA_REQUEST,
});

export const fetchClientDataSuccess = (clientData) => ({
    type: FETCH_CLIENT_DATA_SUCCESS,
    payload: clientData,
});

export const fetchClientDataFailure = (error) => ({
    type: FETCH_CLIENT_DATA_FAILURE,
    payload: error,
});

export const fetchClientData = async (dispatch) => {
    dispatch(fetchClientDataRequest());

    try {
      const response = await api.get(
        `/api/client-page/client/${getClientId()}/case/${getCaseId()}/`,
        auth_config
      );

      const data = response.data;
      dispatch(fetchClientDataSuccess(data));
      //alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      dispatch(fetchClientDataFailure(error));
    }
    
};
