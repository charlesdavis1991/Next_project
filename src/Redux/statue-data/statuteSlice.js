import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData, setIsSearchDisabled } from "../Directory/directorySlice";

export const fetchStatuteData = createAsyncThunk(
  "statutes/fetchStatuteData",
  async ({url, config}, { dispatch }) => {
    const response = await axios.get(url, config);
    const data = response.data.data
    // Dispatch setHasNoData based on whether the data is empty or not
    if (!data || data.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
      
    } else {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
      dispatch(setIsSearchDisabled(false));
    }
    return response.data.data;
  }
);

const initialState = {
  statutes: [],
  status: "idle",
  loading: true,
  error: null,
};

const statuteSlice = createSlice({
  name: "statutes",
  initialState,
  reducers: {
    addStatute: (state, action) => {
      state.statutes.push(action.payload);
    },

    updateStatute: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.statutes.findIndex(
        (statute) => statute.id === id
      );
      if (index !== -1) {
        state.statutes[index] = { ...updatedData };
      }
    },

    deleteStatute: (state, action) => {
      const id = action.payload;
      state.statutes = state.statutes.filter(
        (statute) => statute.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatuteData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchStatuteData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.statutes = action.payload;
        state.loading = false;
      })
      .addCase(fetchStatuteData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addStatute, updateStatute, deleteStatute } =
  statuteSlice.actions;

export default statuteSlice.reducer;
