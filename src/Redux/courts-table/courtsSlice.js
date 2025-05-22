import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchCourtData = createAsyncThunk(
  "courts/fetchCourtData",
  async ({ url, config }, { dispatch }) => {
    const response = await axios.get(url, config);
    const data = response.data.data
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
  courts: [],
  status: "idle",
  loading: true,
  error: null,
};

const courtSlice = createSlice({
  name: "courts",
  initialState,
  reducers: {
    addCourt: (state, action) => {
      state.courts.push(action.payload);
    },

    updateCourt: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.courts.findIndex((court) => court.id === id);
      if (index !== -1) {
        state.courts[index] = { ...state.courts[index], ...updatedData };
      }
    },

    deleteCourt: (state, action) => {
      const id = action.payload;
      state.courts = state.courts.filter((court) => court.id !== id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourtData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchCourtData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.courts = action.payload;
        state.loading = false;
      })
      .addCase(fetchCourtData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addCourt, updateCourt, deleteCourt } = courtSlice.actions;

export default courtSlice.reducer;
