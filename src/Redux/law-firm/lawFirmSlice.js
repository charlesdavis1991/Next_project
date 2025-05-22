import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";
// import { setHasNoData } from "../Directory/directorySlice";
export const fetchLawFirmData = createAsyncThunk(
  "lawFirms/fetchLawFirmData",
  async ({url, config}, { dispatch }) => {
    const response = await axios.get(url, config);
    const data = response.data.data;
    // Dispatch setHasNoData based on whether the data is empty or not
    if (!data || data.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
    }
    return data;
  }
);

const initialState = {
  lawFirms: [],
  status: "idle",
  loading: true,
  error: null,
};

const lawFirmSlice = createSlice({
  name: "lawFirm",
  initialState,
  reducers: {
    addLawFirm: (state, action) => {
      state.lawFirms.push(action.payload);
    },

    updateLawFirm: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.lawFirms.findIndex(
        (lawFirm) => lawFirm.id === id
      );
      if (index !== -1) {
        state.lawFirms[index] = { ...updatedData };
      }
    },

    deleteLawFirm: (state, action) => {
      const id = action.payload;
      state.lawFirms = state.lawFirms.filter(
        (lawFirm) => lawFirm.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLawFirmData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchLawFirmData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lawFirms = action.payload;
        state.loading = false;
      })
      .addCase(fetchLawFirmData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
    
export const { addLawFirm, updateLawFirm, deleteLawFirm } =
  lawFirmSlice.actions;

export default lawFirmSlice.reducer;
