import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchCalculatedDates = createAsyncThunk(
  "calculatedDates/fetchCalculatedDates",
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
  calculatedDates: [],
  status: "idle",
  loading: true,
  error: null,
};

const calculatedDateSlice = createSlice({
  name: "calculatedDates",
  initialState,
  reducers: {
    addCalculatedDate: (state, action) => {
      state.calculatedDates.push(action.payload);
    },

    updateCalculatedDate: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.calculatedDates.findIndex(
        (district) => district.id === id
      );
      if (index !== -1) {
        state.calculatedDates[index] = { ...updatedData };
      }
    },

    deleteCalculatedDate: (state, action) => {
      const id = action.payload;
      state.calculatedDates = state.calculatedDates.filter(
        (calculatedDate) => calculatedDate.id !== id
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCalculatedDates.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchCalculatedDates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.calculatedDates = action.payload;
        state.loading = false;
      })
      .addCase(fetchCalculatedDates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addCalculatedDate, updateCalculatedDate, deleteCalculatedDate } =
  calculatedDateSlice.actions;

export default calculatedDateSlice.reducer;
