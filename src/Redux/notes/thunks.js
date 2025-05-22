// asyncActions.js
import axios from 'axios';
import {
  assignTodoRequest,
  assignTodoSuccess,
  assignTodoFailure,
} from './actions';
export const assignTodo = (taskData) => async (dispatch) => {
  dispatch(assignTodoRequest());
  try {
    const token = localStorage.getItem('token');
    const origin = process.env.REACT_APP_BACKEND_URL;
  
    const response = await axios.post(`${origin}/api/add_task_note/`, taskData, {
      headers: {
        Authorization: token,
      },

    });

    dispatch(assignTodoSuccess(response.data));
    return response.data;
    
  } catch (error) {
    dispatch(assignTodoFailure(error.message));
  }
};












