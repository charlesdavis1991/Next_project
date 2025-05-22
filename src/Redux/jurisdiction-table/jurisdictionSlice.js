import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchJurisdictionData = createAsyncThunk(
  "jurisdictions/fetchJurisdictionData",
  async ({ url, config }, { dispatch }) => {
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
  jurisdictions: [],
  status: "idle",
  loading: true,
  error: null,
};

const jurisdictionSlice = createSlice({
  name: "jurisdictions",
  initialState,
  reducers: {
    addJurisdiction: (state, action) => {
      state.jurisdictions.push(action.payload);
    },

    updateJurisdiction: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.jurisdictions.findIndex(
        (jurisdiction) => jurisdiction.id === id
      );
      if (index !== -1) {
        state.jurisdictions[index] = { ...updatedData };
      }
    },

    deleteJurisdiction: (state, action) => {
      const id = action.payload;
      state.jurisdictions = state.jurisdictions.filter(
        (jurisdiction) => jurisdiction.id !== id
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchJurisdictionData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchJurisdictionData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jurisdictions = action.payload;
        state.loading = false;
      })
      .addCase(fetchJurisdictionData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addJurisdiction, updateJurisdiction, deleteJurisdiction } =
  jurisdictionSlice.actions;

export default jurisdictionSlice.reducer;
