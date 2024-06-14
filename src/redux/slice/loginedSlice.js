import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
    name: "login",
    initialState: {
      Value: false,
    },
    reducers: {
      login: (state) => {
        state.Value = true;
      },
      logout: (state) => {
        state.Value = false;
      },
    },
  });
  export const { login, logout } = loginSlice.actions;
  export default loginSlice.reducer;
  