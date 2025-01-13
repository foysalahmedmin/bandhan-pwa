import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer, {
  authenticationSlice,
} from "./slices/authenticationSlice";
import languageReducer, { languageSlice } from "./slices/languageSlice";

export default configureStore({
  reducer: {
    [authenticationSlice.name]: authenticationReducer,
    [languageSlice.name]: languageReducer,
  },
});
