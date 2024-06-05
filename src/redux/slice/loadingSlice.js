import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    Value: false,
  },
  reducers: {
    showLoading: (state) => {
      state.Value = true;
    },
    closeLoading: (state) => {
      state.Value = false;
    },
  },
});
export const { showLoading, closeLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
