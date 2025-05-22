import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchInsuranceAdjusterData = createAsyncThunk(
  "insuranceAdjusters/fetchInsuranceAdjusterData",
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
  insuranceAdjusters: [],
  status: "idle",
  loading: true,
  error: null,
};

const insuranceAdjusterSlice = createSlice({
  name: "insuranceAdjusters",
  initialState,
  reducers: {
    addInsuranceAdjuster: (state, action) => {
      state.insuranceAdjusters.push(action.payload);
    },

    updateInsuranceAdjuster: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.insuranceAdjusters.findIndex(
        (adjuster) => adjuster.id === id
      );
      if (index !== -1) {
        state.insuranceAdjusters[index] = { ...updatedData };
      }
    },

    deleteInsuranceAdjuster: (state, action) => {
      const id = action.payload;
      state.insuranceAdjusters = state.insuranceAdjusters.filter(
        (adjuster) => adjuster.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInsuranceAdjusterData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchInsuranceAdjusterData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.insuranceAdjusters = action.payload;
        state.loading = false;
      })
      .addCase(fetchInsuranceAdjusterData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const {
  addInsuranceAdjuster,
  updateInsuranceAdjuster,
  deleteInsuranceAdjuster,
} = insuranceAdjusterSlice.actions;

export default insuranceAdjusterSlice.reducer;
