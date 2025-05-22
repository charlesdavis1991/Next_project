import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchReportingAgencyData = createAsyncThunk(
  "reportingAgencies/fetchReportingAgencyData",
  async ({url, config}, { dispatch }) => {
    const response = await axios.get(url, config);
    return response.data.data;
  }
);

const initialState = {
  reportingAgencies: [],
  status: "idle",
  loading: true,
  error: null,
};

const reportingAgencySlice = createSlice({
  name: "reportingAgencies",
  initialState,
  reducers: {
    addReportingAgency: (state, action) => {
      state.reportingAgencies.push(action.payload);
    },

    updateReportingAgency: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.reportingAgencies.findIndex(
        (agency) => agency.id === id
      );
      if (index !== -1) {
        state.reportingAgencies[index] = { ...updatedData };
      }
    },

    deleteReportingAgency: (state, action) => {
      const id = action.payload;
      state.reportingAgencies = state.reportingAgencies.filter(
        (agency) => agency.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportingAgencyData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchReportingAgencyData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reportingAgencies = action.payload;
        state.loading = false;
      })
      .addCase(fetchReportingAgencyData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const {
  addReportingAgency,
  updateReportingAgency,
  deleteReportingAgency,
} = reportingAgencySlice.actions;

export default reportingAgencySlice.reducer;
