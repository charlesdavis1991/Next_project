import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchPanelChecklistData = createAsyncThunk(
  "panelChecklists/fetchPanelChecklistData",
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
  panelChecklists: [],
  status: "idle",
  loading: true,
  error: null,
};

const panelChecklistsSlice = createSlice({
  name: "panelChecklists",
  initialState,
  reducers: {
    addPanelChecklist: (state, action) => {
      state.panelChecklists.push(action.payload);
    },

    updatePanelChecklist: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.panelChecklists.findIndex((panelChecklist) => panelChecklist.id === id);
      if (index !== -1) {
        state.panelChecklists[index] = { ...updatedData };
      }
    },

    deletePanelChecklist: (state, action) => {
      const id = action.payload;
      state.panelChecklists = state.panelChecklists.filter(
        (panelChecklist) => panelChecklist.id !== id
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPanelChecklistData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchPanelChecklistData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.panelChecklists = action.payload;
        state.loading = false;
      })
      .addCase(fetchPanelChecklistData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addPanelChecklist, updatePanelChecklist, deletePanelChecklist } = panelChecklistsSlice.actions;

export default panelChecklistsSlice.reducer;