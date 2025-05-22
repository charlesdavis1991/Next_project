import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchAttorneyDirectoryData = createAsyncThunk(
  "attorneyDirectories/fetchAttorneyDirectoryData",
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
  attorneyDirectories: [],
  status: "idle",
  loading: true,
  error: null,
};

const attorneyDirectorySlice = createSlice({
  name: "attorneyDirectories",
  initialState,
  reducers: {
    addAttorneyDirectory: (state, action) => {
      state.attorneyDirectories.push(action.payload);
    },

    updateAttorneyDirectory: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.attorneyDirectories.findIndex(
        (directory) => directory.id === id
      );
      if (index !== -1) {
        state.attorneyDirectories[index] = { ...updatedData };
      }
    },

    deleteAttorneyDirectory: (state, action) => {
      const id = action.payload;
      state.attorneyDirectories = state.attorneyDirectories.filter(
        (directory) => directory.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttorneyDirectoryData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchAttorneyDirectoryData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.attorneyDirectories = action.payload;
        state.loading = false;
      })
      .addCase(fetchAttorneyDirectoryData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const {
  addAttorneyDirectory,
  updateAttorneyDirectory,
  deleteAttorneyDirectory,
} = attorneyDirectorySlice.actions;

export default attorneyDirectorySlice.reducer;
