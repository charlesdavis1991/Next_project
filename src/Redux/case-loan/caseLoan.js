import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";
// import { setHasNoData } from "../Directory/directorySlice";


export const fetchCaseLoanData = createAsyncThunk(
  "caseLoans/fetchCaseLoanData",
  async ({url, config}, { dispatch }) => {
    const response = await axios.get(url, config);
    const data = response.data.data
    // Dispatch setHasNoData based on whether the data is empty or not
    if (!data || data.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
    }
    return response.data.data;
  }
);

const initialState = {
  caseLoans: [],
  status: "idle",
  loading: true,
  error: null,
};

const caseLoanSlice = createSlice({
  name: "caseLoan",
  initialState,
  reducers: {
    addCaseLoan: (state, action) => {
      state.caseLoans.push(action.payload);
    },

    updateCaseLoan: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.caseLoans.findIndex(
        (caseLoan) => caseLoan.id === id
      );
      if (index !== -1) {
        state.caseLoans[index] = { ...updatedData };
      }
    },

    deleteCaseLoan: (state, action) => {
      const id = action.payload;
      state.caseLoans = state.caseLoans.filter(
        (caseLoan) => caseLoan.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCaseLoanData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchCaseLoanData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.caseLoans = action.payload;
        state.loading = false;
      })
      .addCase(fetchCaseLoanData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addCaseLoan, updateCaseLoan, deleteCaseLoan } =
  caseLoanSlice.actions;

export default caseLoanSlice.reducer;
