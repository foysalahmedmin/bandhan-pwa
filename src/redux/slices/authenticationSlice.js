import authStorage from "@/utils/authStorage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  user: authStorage.getAuthToken() || null,
  userInfo: {},
  loginPanel: "",
};

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.userInfo = payload;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      authStorage.removeAuthToken();
      state.user = null;
      state.userInfo = {};
      state.isAuthenticated = false;
      state.loginPanel = "";
    },

    setIsLoading: (state, { payload }) => {
      state.isLoading = payload;
    },

    setUser: (state, { payload }) => {
      if (payload) {
        authStorage.storeAuthToken(payload);
        state.user = payload;
        state.isAuthenticated = true;
      } else {
        authStorage.removeAuthToken();
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
  setIsLoading,
  setUser,
  setUserInfo,
  setLoginPanel,
  removeLoginPanel,
} = authenticationSlice.actions;
export default authenticationSlice.reducer;
