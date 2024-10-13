import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";
import userReducer from "./userSlice";
import introReducer from "./features/intro/introSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    intro: introReducer,
    user: userReducer,
  },
});
