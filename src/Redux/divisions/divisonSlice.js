import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchDivisionData = createAsyncThunk(
  "divisions/fetchDivisionData",
  async ({url, config}, { dispatch }) => {
    const response = await axios.get(url, config);
    const data = response.data.data;

    if (!data || data.length === 0) {
      dispatch(setHasNoData(true));
    } else {
      dispatch(setHasNoData(false));
    }
    return data;
  }
);

const initialState = {
  divisions: [],
  status: "idle",
  loading: true,
  error: null,
};

const divisionSlice = createSlice({
  name: "divisions",
  initialState,
  reducers: {
    addDivision: (state, action) => {
      state.divisions.push(action.payload);
    },

    updateDivision: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.divisions.findIndex((division) => division.id === id);
      if (index !== -1) {
        state.divisions[index] = { ...updatedData };
      }
    },

    deleteDivision: (state, action) => {
      const id = action.payload;
      state.divisions = state.divisions.filter(
        (division) => division.id !== id
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchDivisionData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchDivisionData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.divisions = action.payload;
        state.loading = false;
      })
      .addCase(fetchDivisionData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addDivision, updateDivision, deleteDivision } =
  divisionSlice.actions;

export default divisionSlice.reducer;
