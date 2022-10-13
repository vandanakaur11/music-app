import { configureStore } from "@reduxjs/toolkit";
import musicReducer from "./musicReducer";

export const store = configureStore({
  reducer: {
    music: musicReducer,
  },
});
