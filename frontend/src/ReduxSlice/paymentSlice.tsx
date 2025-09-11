import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/Api/index.api.ts";
import { PAYMENT_METHOD } from "src/Types/common.ts";
import type { PaymentMethodInforType } from "src/Types/paymentMethodInfor.ts";

const initialState = {
  paymentMethodList: Array<PaymentMethodInforType>(),
  paymentType: PAYMENT_METHOD.COD,
  status: 'idle'
}

export const getPaymentMethods = createAsyncThunk(
  "payment/getPaymentMethods",
  async (_, { rejectWithValue }) => {
      try {
        const response = await api.paymentMethods.getAll();
        return response.data.paymentMethods;
      } catch(error) {
        console.warn("Error fetching payment methods:", error);
        return rejectWithValue(error);
      }
  }
);

const paymentSlice = createSlice({
  name: "paymentSlice",
  initialState,
  reducers: {
    setPaymentType: (state, action) => {
      state.paymentType = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getPaymentMethods.fulfilled, (state, action) => {
      state.paymentMethodList = action.payload;
      state.status = 'idle';
      console.log("Payment methods fetched:", action);
    })
    .addCase(getPaymentMethods.rejected, (state, action) => {
      state.status = 'idle';
      console.error("Fetching payment methods failed:", action.error);
    })
  }
});

export const { setPaymentType } = paymentSlice.actions;
export default paymentSlice.reducer;
