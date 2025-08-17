import { configureStore } from "@reduxjs/toolkit";
import alertsSlice from "../Features/alertsSlice.jsx";
import formsSlice from "../Features/formsSlice.jsx";
import globalSlice from "../Features/globalSlice.jsx";
import loadingSlice from "../Features/loadingSlice.jsx";
import productsSlice from "../Features/productsSlice.jsx";
import userSlice from "../Features/userSlice.jsx";
import categoriesSlice from "../Api/categories.api.js";

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

export default store;