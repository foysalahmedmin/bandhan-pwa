import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: localStorage.getItem("authToken") || null,
  userInfo: {},
  loginPanel: "",
};

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.isAuthenticated = true;
      state.userInfo = payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = {};
    },

    setUser: (state, { payload }) => {
      if (payload) {
        localStorage.setItem("authToken", payload);
        state.user = payload;
        state.isAuthenticated = true;
      } else {
        localStorage.removeItem("authToken");
        state.user = null;
        state.userInfo = {};
        state.isAuthenticated = false;
      }
    },
    setUserInfo: (state, { payload }) => {
      if (Object.keys(payload)?.length > 0) {
        state.userInfo = payload;
        state.isAuthenticated = true;
      } else {
        state.userInfo = {};
        state.isAuthenticated = false;
      }
    },

    setLoginPanel: (state, { payload }) => {
      state.loginPanel = payload;
    },
    removeLoginPanel: (state) => {
      state.loginPanel = "";
    },
  },
});
export const {
  login,
  logout,
  setUser,
  setUserInfo,
  setLoginPanel,
  removeLoginPanel,
} = authenticationSlice.actions;
export default authenticationSlice.reducer;
