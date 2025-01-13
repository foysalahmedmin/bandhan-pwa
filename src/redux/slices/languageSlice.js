import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("language") || "en";

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, { payload }) => {
      const language = payload;
      localStorage.setItem("language", language);
      return language;
    },
    toggleLanguage: (state) => {
      const language = state === "en" ? "bn" : "en";
      localStorage.setItem("language", language);
      return language;
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;
