import { createSlice } from '@reduxjs/toolkit'
import api from '../../api/api'

export const clientSlice = createSlice({
  name: 'client',
  initialState: {
    current: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setCurrentClient: (state, action) => {
      state.current  = action.payload
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  }
})

export const { setCurrentClient, setLoading, setError } = clientSlice.actions

export const fetchCurrentClient = (clientId) => async (dispatch, getState) => {
  if (getState().client.current) {
    return;
  }
  
  dispatch(setLoading(true));

  try {
    const response = await api.get(`/api/clients/${clientId}/`);
    dispatch(setCurrentClient(response.data));
  } catch (error) {
    console.error("Error occurred while fetching client", error);
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default clientSlice.reducer