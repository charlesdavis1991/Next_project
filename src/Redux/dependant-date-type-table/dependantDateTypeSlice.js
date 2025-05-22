import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchDependantDateTypeData = createAsyncThunk(
  "dependantDateTypes/fetchDependantDateTypeData",
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
  dependantDateTypes: [],
  status: "idle",
  loading: true,
  error: null,
};

const dependantDateTypeSlice = createSlice({
  name: "dependantDateTypes",
  initialState,
  reducers: {
    addDependantDateType: (state, action) => {
      state.dependantDateTypes.push(action.payload);
    },

    updateDependantDateType: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.dependantDateTypes.findIndex((dependantDateType) => dependantDateType.id === id);
      if (index !== -1) {
        state.dependantDateTypes[index] = { ...updatedData };
      }
    },

    deleteDependantDateType: (state, action) => {
      const id = action.payload;
      state.dependantDateTypes = state.dependantDateTypes.filter(
        (dependantDateType) => dependantDateType.id !== id
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchDependantDateTypeData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchDependantDateTypeData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dependantDateTypes = action.payload;
        state.loading = false;
      })
      .addCase(fetchDependantDateTypeData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addDependantDateType, updateDependantDateType, deleteDependantDateType } =
  dependantDateTypeSlice.actions;

export default dependantDateTypeSlice.reducer;
