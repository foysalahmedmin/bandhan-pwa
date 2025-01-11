import { createSlice } from "@reduxjs/toolkit";

const initialState = true;

export const usersSlice = createSlice({
  name: "motion",
  initialState,
  reducers: {
    setMotionToggle: (state) => {
      if (state) {
        state = false;
      } else {
        state = true;
      }
    },
  },
});
export const { setMotionToggle } = usersSlice.actions;
export default usersSlice.reducer;
