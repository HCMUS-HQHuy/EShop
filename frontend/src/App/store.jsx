import { configureStore } from "@reduxjs/toolkit";
import alertsSlice from "../Features/alertsSlice";
import formsSlice from "../Features/formsSlice";
import globalSlice from "../Features/globalSlice";
import loadingSlice from "../Features/loadingSlice";
import productsSlice from "../Features/productsSlice";
import userSlice from "../Features/userSlice";
import categoriesSlice from "../Api/categories.api";

export const store = configureStore({
  reducer: {
    global: globalSlice,
    user: userSlice,
    products: productsSlice,
    forms: formsSlice,
    alerts: alertsSlice,
    loading: loadingSlice,
    // categories: categoriesSlice,
  },
});
