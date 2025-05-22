import { createSlice } from "@reduxjs/toolkit";

const loadTokenFromLocalStorage = () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      return token;
    }
  } catch (error) {
    console.error("Error loading token from local storage:", error);
  }
  return null;
};

const initialState = {
  token: loadTokenFromLocalStorage(),
  refreshToken: null,
  userId: null,
  firstName: null,
  lastName: null,
  ip: null,
  loggedInAt: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    removeToken: (state) => {
      state.token = null;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setUserInfo: (state, action) => {
      const { userId, firstName, lastName, ip, loggedInAt } = action.payload;
      state.userId = userId;
      state.firstName = firstName;
      state.lastName = lastName;
      state.ip = ip;
      state.loggedInAt = loggedInAt;
    },
  },
});

export const { setToken, removeToken, setRefreshToken, setUserInfo } =
  authSlice.actions;

export default authSlice.reducer;
