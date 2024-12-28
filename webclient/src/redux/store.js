import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import profileReducer from './profileSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, // Add authSlice as the reducer
    profile: profileReducer,
  },
});

export default store;
