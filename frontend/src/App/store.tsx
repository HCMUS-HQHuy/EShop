import { configureStore } from "@reduxjs/toolkit";
import alertsSlice from "../Features/alertsSlice.jsx";
import formsSlice from "../Features/formsSlice.tsx";
import globalSlice from "../Features/globalSlice.jsx";
import loadingSlice from "../Features/loadingSlice.jsx";
import productsSlice from "../Features/productsSlice.jsx";
import userSlice from "../Features/userSlice.jsx";
import categoriesSlice from "../Features/categoriesSlice.tsx";
import sellerSlice from "../Features/sellerSlice.tsx";

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