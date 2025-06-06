import { configureStore } from "@reduxjs/toolkit";
import { sheikhApi, zenithApi } from "./services/tmsApi";
import authenticationReducer, {
  authenticationSlice,
} from "./slices/authenticationSlice";
import languageReducer, { languageSlice } from "./slices/languageSlice";
import surveyReducer, { surveySlice } from "./slices/surveySlice";

export default configureStore({
  reducer: {
    [authenticationSlice.name]: authenticationReducer,
    [languageSlice.name]: languageReducer,
    [surveySlice.name]: surveyReducer,

    // Include API reducers
    [zenithApi.reducerPath]: zenithApi.reducer,
    [sheikhApi.reducerPath]: sheikhApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(zenithApi.middleware, sheikhApi.middleware),
});
