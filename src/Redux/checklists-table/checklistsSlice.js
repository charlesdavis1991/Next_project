import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchChecklistData = createAsyncThunk(
  "checklists/fetchChecklistData",
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
  checklists: [],
  status: "idle",
  loading: true,
  error: null,
};

const checklistsSlice = createSlice({
  name: "checklists",
  initialState,
  reducers: {
    addChecklist: (state, action) => {
      state.checklists.push(action.payload);
    },

    updateChecklist: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.checklists.findIndex((checklist) => checklist.id === id);
      if (index !== -1) {
        state.checklists[index] = { ...updatedData };
      }
    },

    deleteChecklist: (state, action) => {
      const id = action.payload;
      state.checklists = state.checklists.filter(
        (checklist) => checklist.id !== id
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchChecklistData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchChecklistData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.checklists = action.payload;
        state.loading = false;
      })
      .addCase(fetchChecklistData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addChecklist, updateChecklist, deleteChecklist } = checklistsSlice.actions;

export default checklistsSlice.reducer;