import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchExpertCategoryData = createAsyncThunk(
  "expertCategories/fetchExpertCategoryData",
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
  expertCategories: [],
  status: "idle",
  loading: true,
  error: null,
};

const expertCategorySlice = createSlice({
  name: "expertCategories",
  initialState,
  reducers: {
    addExpertCategory: (state, action) => {
      state.expertCategories.push(action.payload);
    },

    updateExpertCategory: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.expertCategories.findIndex((division) => division.id === id);
      if (index !== -1) {
        state.expertCategories[index] = { ...updatedData };
      }
    },

    deleteExpertCategory: (state, action) => {
      const id = action.payload;
      state.expertCategories = state.expertCategories.filter(
        (division) => division.id !== id
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchExpertCategoryData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchExpertCategoryData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expertCategories = action.payload;
        state.loading = false;
      })
      .addCase(fetchExpertCategoryData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addExpertCategory, updateExpertCategory, deleteExpertCategory } =
  expertCategorySlice.actions;

export default expertCategorySlice.reducer;
