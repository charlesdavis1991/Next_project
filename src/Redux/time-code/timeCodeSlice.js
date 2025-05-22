import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData, setIsSearchDisabled } from "../Directory/directorySlice";

export const fetchTimeCode = createAsyncThunk(
  "timeCodes/fetchTimeCodeData",
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
  timeCodes: [],
  status: "idle",
  loading: true,
  error: null,
};

const timeCodeSlice = createSlice({
  name: "timeCodes",
  initialState,
  reducers: {
    addTimeCode: (state, action) => {
      state.timeCodes.push(action.payload);
    },

    updateTimeCode: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.timeCodes.findIndex(
        (timecode) => timecode.id === id
      );
      if (index !== -1) {
        state.timeCodes[index] = { ...updatedData };
      }
    },

    deleteTimeCode: (state, action) => {
      const id = action.payload;
      state.timeCodes = state.timeCodes.filter(
        (timecode) => timecode.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeCode.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchTimeCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.timeCodes = action.payload;
        state.loading = false;
      })
      .addCase(fetchTimeCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addTimeCode, updateTimeCode, deleteTimeCode } =
  timeCodeSlice.actions;

export default timeCodeSlice.reducer;
