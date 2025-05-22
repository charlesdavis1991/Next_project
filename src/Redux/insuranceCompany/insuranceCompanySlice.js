import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchInsuranceCompanyData = createAsyncThunk(
  "insuranceCompanies/fetchInsuranceCompanyData",
  async ({url, config}, { dispatch }) => {
    const response = await axios.get(url, config);
    const data = response.data.data;
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
  insuranceCompanies: [],
  status: "idle",
  loading: true,
  error: null,
};

const insuranceCompanySlice = createSlice({
  name: "insuranceCompanies",
  initialState,
  reducers: {
    addInsuranceCompany: (state, action) => {
      state.insuranceCompanies.push(action.payload);
    },

    updateInsuranceCompany: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.insuranceCompanies.findIndex(
        (company) => company.id === id
      );
      if (index !== -1) {
        state.insuranceCompanies[index] = { ...updatedData };
      }
    },

    deleteInsuranceCompany: (state, action) => {
      const id = action.payload;
      state.insuranceCompanies = state.insuranceCompanies.filter(
        (company) => company.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInsuranceCompanyData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchInsuranceCompanyData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.insuranceCompanies = action.payload;
        state.loading = false;
      })
      .addCase(fetchInsuranceCompanyData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const {
  addInsuranceCompany,
  updateInsuranceCompany,
  deleteInsuranceCompany,
} = insuranceCompanySlice.actions;

export default insuranceCompanySlice.reducer;
