import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
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

    setUser: (state) => {
      state.user = {};
    },
    setUserInfo: (state) => {
      state.userInfo = {};
    },

    setLoginPanel: (state, { payload }) => {
      state.loginPanel = payload;
    },
    removeLoginPanel: (state) => {
      state.loginPanel = "";
    },
  },
});
export const { login, logout, setLoginPanel, removeLoginPanel } =
  authenticationSlice.actions;
export default authenticationSlice.reducer;
