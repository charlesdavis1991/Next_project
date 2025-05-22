import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData, setIsSearchDisabled } from "../Directory/directorySlice";

export const fetchProcessServerData = createAsyncThunk(
  "processServers/fetchProcessServerData",
  async ({url, config},{dispatch}) => {
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
  processServers: [],
  status: "idle",
  loading: true,
  error: null,
};

const processServerSlice = createSlice({
  name: "processServers",
  initialState,
  reducers: {
    addProcessServer: (state, action) => {
      state.processServers.push(action.payload);
    },

    updateProcessServer: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.processServers.findIndex(
        (processServer) => processServer.id === id
      );
      if (index !== -1) {
        state.processServers[index] = { ...updatedData };
      }
    },

    deleteProcessServer: (state, action) => {
      const id = action.payload;
      state.processServers = state.processServers.filter(
        (processServer) => processServer.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProcessServerData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchProcessServerData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.processServers = action.payload;
        state.loading = false;
      })
      .addCase(fetchProcessServerData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addProcessServer, updateProcessServer, deleteProcessServer } =
  processServerSlice.actions;

export default processServerSlice.reducer;
