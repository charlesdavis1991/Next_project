import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchCourtForms = createAsyncThunk(
  "courtForms/fetchCourtForms",
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
  courtForms: [],
  status: "idle",
  loading: true,
  error: null,
};

const courtFormSlice = createSlice({
  name: "courtForms",
  initialState,
  reducers: {
    addCourtForm: (state, action) => {
      state.courtForms.push(action.payload);
    },

    updateCourtForm: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.courtForms.findIndex(
        (district) => district.id === id
      );
      if (index !== -1) {
        state.courtForms[index] = { ...updatedData };
      }
    },

    deleteCourtForm: (state, action) => {
      const id = action.payload;
      state.courtForms = state.courtForms.filter(
        (courtForm) => courtForm.id !== id
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCourtForms.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchCourtForms.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.courtForms = action.payload;
        state.loading = false;
      })
      .addCase(fetchCourtForms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addCourtForm, updateCourtForm, deleteCourtForm } =
  courtFormSlice.actions;

export default courtFormSlice.reducer;
