import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchClickKeyData = createAsyncThunk(
  "clickKeys/fetchClickKeyData",
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
  clickKeys: [],
  status: "idle",
  loading: true,
  error: null,
};

const clickKeysSlice = createSlice({
  name: "clickKeys",
  initialState,
  reducers: {
    addClickKey: (state, action) => {
      state.clickKeys.push(action.payload);
    },

    updateClickKey: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.clickKeys.findIndex((division) => division.id === id);
      if (index !== -1) {
        state.clickKeys[index] = { ...updatedData };
      }
    },

    deleteClickKey: (state, action) => {
      const id = action.payload;
      state.clickKeys = state.clickKeys.filter(
        (division) => division.id !== id
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchClickKeyData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchClickKeyData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.clickKeys = action.payload;
        state.loading = false;
      })
      .addCase(fetchClickKeyData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addClickKey, updateClickKey, deleteClickKey } =
  clickKeysSlice.actions;

export default clickKeysSlice.reducer;
