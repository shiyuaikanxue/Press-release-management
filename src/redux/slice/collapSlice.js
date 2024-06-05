import { createSlice } from "@reduxjs/toolkit";

export const collapSlice = createSlice({
  name: "collap",
  initialState: {
    Value: false,
  },
  reducers: {
    handleCollapShow: (state) => {
      state.Value = true;
    },
    handleCollapClose: (state) => {
      state.Value = false;
    },
    handleCollap: (state) => {
      state.Value = !state.Value;
    },
  },
});
export const { handleCollapShow, handleCollapClose, handleCollap } =
  collapSlice.actions;
export default collapSlice.reducer;
