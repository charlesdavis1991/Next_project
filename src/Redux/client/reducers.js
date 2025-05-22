// src/reducers/clientReducer.js
import { FETCH_CLIENT_DATA_REQUEST, FETCH_CLIENT_DATA_SUCCESS, FETCH_CLIENT_DATA_FAILURE } from './actions';

const initialState = {
  loading: false,
  clientData: {},
  error: null,
};

const clientReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CLIENT_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_CLIENT_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        clientData: action.payload,
      };
    case FETCH_CLIENT_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default clientReducer;
