import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import darkModeReducer from "../features/darkMode/darkModeSlice";
import userReducer from "../features/userSlice";
export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    darkMode: darkModeReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
