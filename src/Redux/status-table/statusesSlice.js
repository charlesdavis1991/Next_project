import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchStatusData = createAsyncThunk(
  "statuses/fetchStatusData",
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
  statuses: [],
  status: "idle",
  loading: true,
  error: null,
};

const statusesSlice = createSlice({
  name: "statuses",
  initialState,
  reducers: {
    addStatus: (state, action) => {
      state.statuses.push(action.payload);
    },

    updateStatus: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.statuses.findIndex((status) => status.id === id);
      if (index !== -1) {
        state.statuses[index] = { ...updatedData };
      }
    },

    deleteStatus: (state, action) => {
      const id = action.payload;
      state.statuses = state.statuses.filter(
        (status) => status.id !== id
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchStatusData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchStatusData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.statuses = action.payload;
        state.loading = false;
      })
      .addCase(fetchStatusData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addStatus, updateStatus, deleteStatus } = statusesSlice.actions;

export default statusesSlice.reducer;