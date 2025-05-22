import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchWorkunitData = createAsyncThunk(
  "workunits/fetchWorkunitData",
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
  workunits: [],
  status: "idle",
  loading: true,
  error: null,
};

const workunitsSlice = createSlice({
  name: "workunits",
  initialState,
  reducers: {
    addWorkunit: (state, action) => {
      state.workunits.push(action.payload);
    },

    updateWorkunit: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.workunits.findIndex((workunit) => workunit.id === id);
      if (index !== -1) {
        state.workunits[index] = { ...updatedData };
      }
    },

    deleteWorkunit: (state, action) => {
      const id = action.payload;
      state.workunits = state.workunits.filter(
        (workunit) => workunit.id !== id
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkunitData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchWorkunitData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.workunits = action.payload;
        state.loading = false;
      })
      .addCase(fetchWorkunitData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addWorkunit, updateWorkunit, deleteWorkunit } = workunitsSlice.actions;

export default workunitsSlice.reducer;