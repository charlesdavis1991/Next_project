import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchDistrictData = createAsyncThunk(
  "districts/fetchDistrictData",
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
  districts: [],
  status: "idle",
  loading: true,
  error: null,
};

const districtSlice = createSlice({
  name: "districts",
  initialState,
  reducers: {
    addDistrict: (state, action) => {
      state.districts.push(action.payload);
    },

    updateDistrict: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.districts.findIndex((district) => district.id === id);
      if (index !== -1) {
        state.districts[index] = { ...updatedData };
      }
    },

    deleteDistrict: (state, action) => {
      const id = action.payload;
      state.districts = state.districts.filter(
        (district) => district.id !== id
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchDistrictData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchDistrictData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.districts = action.payload;
        state.loading = false;
      })
      .addCase(fetchDistrictData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addDistrict, updateDistrict, deleteDistrict } =
  districtSlice.actions;

export default districtSlice.reducer;
