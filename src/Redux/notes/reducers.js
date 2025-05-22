
import {
  ASSIGN_TODO_REQUEST,
  ASSIGN_TODO_SUCCESS,
  ASSIGN_TODO_FAILURE
} from './actions';

const initialState = {
  loading: false,
  task: null,
  error: null,
};

const noteReducer = (state = initialState, action) => {
 
  switch (action.type) {
    case ASSIGN_TODO_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ASSIGN_TODO_SUCCESS:
     
      return {
        ...state,
        loading: false,
        task: action.payload,
      };
    case ASSIGN_TODO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default noteReducer;