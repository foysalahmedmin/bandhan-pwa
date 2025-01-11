import { configureStore } from "@reduxjs/toolkit";
import motionReducer from "./slices/motionSlice";

export default configureStore({
  reducer: {
    motion: motionReducer,
  },
});
