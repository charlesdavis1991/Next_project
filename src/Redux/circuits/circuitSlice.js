import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchCircuitData = createAsyncThunk(
  "circuits/fetchCircuitData",
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
  circuits: [],
  status: "idle",
  loading: true,
  error: null,
};

const circuitSlice = createSlice({
  name: "circuits",
  initialState,
  reducers: {
    addCircuit: (state, action) => {
      state.circuits.push(action.payload);
    },

    updateCircuit: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.circuits.findIndex((circuit) => circuit.id === id);
      if (index !== -1) {
        state.circuits[index] = { ...updatedData };
      }
    },

    deleteCircuit: (state, action) => {
      const id = action.payload;
      state.circuits = state.circuits.filter((circuit) => circuit.id !== id);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCircuitData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchCircuitData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.circuits = action.payload;
        state.loading = false;
      })
      .addCase(fetchCircuitData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addCircuit, updateCircuit, deleteCircuit } =
  circuitSlice.actions;

export default circuitSlice.reducer;
