import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchActData = createAsyncThunk(
  "acts/fetchActData",
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
  acts: [],
  status: "idle",
  loading: true,
  error: null,
};

const actsSlice = createSlice({
  name: "acts",
  initialState,
  reducers: {
    addAct: (state, action) => {
      state.acts.push(action.payload);
    },

    updateAct: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.acts.findIndex((act) => act.id === id);
      if (index !== -1) {
        state.acts[index] = { ...updatedData };
      }
    },

    deleteAct: (state, action) => {
      const id = action.payload;
      state.acts = state.acts.filter(
        (act) => act.id !== id
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchActData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchActData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.acts = action.payload;
        state.loading = false;
      })
      .addCase(fetchActData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addAct, updateAct, deleteAct } = actsSlice.actions;

export default actsSlice.reducer;