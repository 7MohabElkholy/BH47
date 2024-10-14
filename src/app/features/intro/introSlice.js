import { createSlice } from "@reduxjs/toolkit";

export const introSlice = createSlice({
  name: "intro",
  initialState: {
    skiped: true,
  },
  reducers: {
    skipIntro: (state) => {
      state.skiped = true;
    },
  },
});

export const { skipIntro } = introSlice.actions;

export default introSlice.reducer;
