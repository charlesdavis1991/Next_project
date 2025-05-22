// src/features/directory/directorySlice.js

import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  directories: [], // List of directories
  currentTab: localStorage.getItem("activeTab") || "copilotfirms",
  isSearchDisabled: false,
  hasNoData: false,
};

// Create the slice
const directorySlice = createSlice({
  name: "directory", // Name of the slice
  initialState, // Initial state
  reducers: {
    setDirectories: (state, action) => {
      // Action to set the list of directories
      state.directories = action.payload;
    },
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
    setIsSearchDisabled: (state, action) => {
      state.isSearchDisabled = action.payload;
    },
    setHasNoData: (state, action) => {
      state.hasNoData = action.payload;
    },
  },
});

// Export actions
export const {
  setDirectories,
  setCurrentTab,
  setIsSearchDisabled,
  setHasNoData,
} = directorySlice.actions;

// Export the reducer
export default directorySlice.reducer;
