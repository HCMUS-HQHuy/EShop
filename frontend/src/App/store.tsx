import { configureStore } from "@reduxjs/toolkit";
import alertsSlice from "src/ReduxSlice/alertsSlice.tsx";
import formsSlice from "src/ReduxSlice/formsSlice.tsx";
import globalSlice from "src/ReduxSlice/globalSlice.tsx";
import loadingSlice from "src/ReduxSlice/loadingSlice.tsx";
import productsSlice from "src/ReduxSlice/productsSlice.tsx";
import userSlice from "src/ReduxSlice/userSlice.tsx";
import categoriesSlice from "src/ReduxSlice/categoriesSlice.tsx";
import sellerSlice from "src/ReduxSlice/sellerSlice.tsx";
import paymentSlice from "src/ReduxSlice/paymentSlice.tsx";
import conversationSlice from "src/ReduxSlice/conversationSlice.tsx";

export const store = configureStore({
  reducer: {
    global: globalSlice,
    user: userSlice,
    products: productsSlice,
    forms: formsSlice,
    alerts: alertsSlice,
    loading: loadingSlice,
    categories: categoriesSlice,
    seller: sellerSlice,
    payment: paymentSlice,
    conversation: conversationSlice
  },
});

export default store;