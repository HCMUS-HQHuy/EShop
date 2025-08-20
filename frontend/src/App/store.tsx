import { configureStore } from "@reduxjs/toolkit";
import alertsSlice from "src/Features/alertsSlice.tsx";
import formsSlice from "src/Features/formsSlice.tsx";
import globalSlice from "src/Features/globalSlice.tsx";
import loadingSlice from "src/Features/loadingSlice.tsx";
import productsSlice from "src/Features/productsSlice.tsx";
import userSlice from "src/Features/userSlice.tsx";
import categoriesSlice from "src/Features/categoriesSlice.tsx";
import sellerSlice from "src/Features/sellerSlice.tsx";

export const store = configureStore({
  reducer: {
    global: globalSlice,
    user: userSlice,
    products: productsSlice,
    forms: formsSlice,
    alerts: alertsSlice,
    loading: loadingSlice,
    categories: categoriesSlice,
    seller: sellerSlice
  },
});

export default store;