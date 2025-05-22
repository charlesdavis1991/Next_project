import { createSlice } from '@reduxjs/toolkit'

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    attorneyBranding: {
        logo: '',
        name: '',
        website: '',
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    setAttorneyBranding: (state, action) => {
      state.attorneyBranding = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  }
})

export const { setAttorneyBranding, setLoading, setError } = settingsSlice.actions

export default settingsSlice.reducer