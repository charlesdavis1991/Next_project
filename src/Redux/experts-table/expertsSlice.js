import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchExpertData = createAsyncThunk(
  "experts/fetchExpertData",
  async ({url, config}, { dispatch }) => {
    const response = await axios.get(url, config);
    const data = response.data.data;
    // Dispatch setHasNoData based on whether the data is empty or not
    if (!data || data.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
    }
    return response.data.data;
  }
);

const initialState = {
  experts: [],
  status: "idle",
  loading: true,
  error: null,
};

const expertSlice = createSlice({
  name: "experts",
  initialState,
  reducers: {
    addExpertData: (state, action) => {
      state.experts.push(action.payload);
    },

    updateExpertData: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.experts.findIndex((expert) => expert.id === id);
      if (index !== -1) {
        state.experts[index] = { ...updatedData };
      }
    },

    deleteExpert: (state, action) => {
      const id = action.payload;
      state.experts = state.experts.filter((expert) => expert.id !== id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpertData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchExpertData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.experts = action.payload;
        state.loading = false;
      })
      .addCase(fetchExpertData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const { addExpertData, updateExpertData, deleteExpert } =
  expertSlice.actions;

export default expertSlice.reducer;
