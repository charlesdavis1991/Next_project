import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchStates = createAsyncThunk(
  "states/fetchStates",
  async (_, { getState }) => {

    const { states } = getState();
    if (states.statesData?.length > 0) {
      return states.statesData;
    }
    
    const tokenBearer = localStorage.getItem("token");
    const origin = process.env.REACT_APP_BACKEND_URL;
    
    const response = await axios.get(`${origin}/api/all/states/`, {
      headers: {
        Authorization: tokenBearer,
      },
    });
    
    return response.data.data;
  }
);

const initialState = {
  statesData: [],
  status: "idle",
  loading: true,
  error: null,
};

const statesSlice = createSlice({
  name: "states",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.statesData = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      });
  },
});

export default statesSlice.reducer;