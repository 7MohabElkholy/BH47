import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // This will hold user data in the future
  luctureIndex: undefined,
  subject: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    setSubject: (state, action) => {
      state.subject = action.payload;
    },
    setLucture: (state, action) => {
      state.luctureIndex = action.payload;
    },
    clearSubject: (state) => {
      state.luctureIndex = undefined;
      state.subject = undefined;
    },
  },
});

export const { setUser, logout, setLucture, setSubject, clearSubject } =
  userSlice.actions;

export const selectUser = (state) => state.user.user;
export const currentLucture = (state) => state.user.luctureIndex;
export const currentSubject = (state) => state.user.subject;

export default userSlice.reducer;
