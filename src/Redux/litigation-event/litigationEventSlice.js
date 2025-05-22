import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData, setIsSearchDisabled } from "../Directory/directorySlice";

export const fetchLitigationData = createAsyncThunk(
  "litigations/fetchLitigationData",
  async ({ url, config }, { dispatch }) => {
    try {
      const response = await axios.get(url, config);
      const data = response.data.data;

      // Dispatch setHasNoData based on whether the data is empty or not
      if (!data || data.length === 0) {
        dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
      } else {
        dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
        dispatch(setIsSearchDisabled(false));
      }

      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch data");
    }
  }
);

const initialState = {
  litigations: [],
  status: "idle",
  loading: true,
  error: null,
};

const litigationEventSlice = createSlice({
  name: "litigationEvent",
  initialState,
  reducers: {
    addLitigation: (state, action) => {
      state.litigations.push(action.payload);
    },

    updateLitigation: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.litigations.findIndex(
        (litigation) => litigation.id === id
      );
      if (index !== -1) {
        state.litigations[index] = { ...updatedData };
      }
    },

    deleteLitigation: (state, action) => {
      const id = action.payload;
      state.litigations = state.litigations.filter(
        (litigation) => litigation.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLitigationData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchLitigationData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.litigations = action.payload;
        state.loading = false;
      })
      .addCase(fetchLitigationData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addLitigation, updateLitigation, deleteLitigation } =
  litigationEventSlice.actions;

export default litigationEventSlice.reducer;
