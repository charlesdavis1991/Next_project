import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchDepartmentData = createAsyncThunk(
  "departments/fetchDepartmentData",
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
  departments: [],
  status: "idle",
  loading: true,
  error: null,
};

const departmentSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    addDepartment: (state, action) => {
      state.departments.push(action.payload);
    },

    updateDepartment: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.departments.findIndex(
        (department) => department.id === id
      );
      if (index !== -1) {
        state.departments[index] = { ...updatedData };
      }
    },

    deleteDepartment: (state, action) => {
      const id = action.payload;
      state.departments = state.departments.filter(
        (department) => department.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartmentData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchDepartmentData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.departments = action.payload;
        state.loading = false;
      })
      .addCase(fetchDepartmentData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addDepartment, updateDepartment, deleteDepartment } =
  departmentSlice.actions;

export default departmentSlice.reducer;
