import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHasNoData } from "../Directory/directorySlice";

export const fetchJudgeData = createAsyncThunk(
  "judges/fetchJudgeData",
  async ({ url, config }, { dispatch }) => {
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
export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async ({ url, config }) => {
    const response = await axios.get(url, config);
    return response.data.data;
  }
);

const initialState = {
  judges: [],
  status: "idle",
  loading: true,
  error: null,
  departments: [],
};

const judgeSlice = createSlice({
  name: "judges",
  initialState,
  reducers: {
    addJudge: (state, action) => {
      state.judges.push(action.payload);
    },

    updateJudge: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.judges.findIndex((judge) => judge.id === id);
      if (index !== -1) {
        state.judges[index] = { ...updatedData };
      }
    },

    deleteJudge: (state, action) => {
      const id = action.payload;
      state.judges = state.judges.filter((judge) => judge.id !== id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJudgeData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchJudgeData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.judges = action.payload;
        state.loading = false;
      })
      .addCase(fetchJudgeData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    // fetchDepartments
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { addJudge, updateJudge, deleteJudge } = judgeSlice.actions;

export default judgeSlice.reducer;
