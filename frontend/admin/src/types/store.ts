import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import darkModeReducer from "../features/darkMode/darkModeSlice";
import userReducer from "../features/userSlice";
import formReducer from "../features/formsSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    darkMode: darkModeReducer,
    user: userReducer,
    form: formReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
