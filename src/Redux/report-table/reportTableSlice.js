import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

// Thunk to fetch report tables
export const fetchReportTable = createAsyncThunk(
  "reportData/fetchReportData",
  async (url,{dispatch}) => {
    const response = await axios.get(url);
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
  reportTables: [],
  status: "idle",
  loading: true,
  error: null,
};

const reportTableSlice = createSlice({
  name: "reportTables",
  initialState,
  reducers: {
    addReportTable: (state, action) => {
      state.reportTables.push(action.payload);
    },
    updateReportTable: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.reportTables.findIndex(
        (reportTable) => reportTable.id === id
      );
      if (index !== -1) {
        state.reportTables[index] = { ...updatedData };
      }
    },
    deleteReportTable: (state, action) => {
      const id = action.payload;
      state.reportTables = state.reportTables.filter(
        (reportTable) => reportTable.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportTable.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchReportTable.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reportTables = action.payload;
        state.loading = false;
      })
      .addCase(fetchReportTable.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addReportTable, updateReportTable, deleteReportTable } =
  reportTableSlice.actions;

export default reportTableSlice.reducer;
