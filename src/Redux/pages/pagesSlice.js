import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData, setIsSearchDisabled } from "../Directory/directorySlice";

export const fetchAllPages_New = createAsyncThunk(
  "allPages/fetchAllPages",
  async (url) => {
    const response = await axios.get(url);
    // const data = response.data.data;
    // // Dispatch setHasNoData based on whether the data is empty or not
    // if (!data || data.length === 0) {
    //   dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    // } else {
    //   dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
    //   dispatch(setIsSearchDisabled(false));
    // }
    return response.data;
  }
);

const initialState = {
  allPages: [],
  status: "idle",
  loading: true,
  error: null,
};

const allPagesSlice = createSlice({
  name: "allPages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPages_New.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchAllPages_New.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allPages = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllPages_New.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default allPagesSlice.reducer;
