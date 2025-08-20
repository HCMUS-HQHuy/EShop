import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/index.api.ts";
import type { SellerRegistrationFormValues } from "src/Types/forms.ts";
import { setLoginData } from "./userSlice.tsx";

const initialState = {
  shopInfo: {
    shopId: "",
    address: "",
    phoneNumber: "",
    email: "",
    isSeller: false,
    sellerStatus: "",
  },
  status: 'idle'
}

export const newShop = createAsyncThunk(
  "seller/newShop",
  async (shopInfo: SellerRegistrationFormValues, { rejectWithValue }) => {
    try {
      const response = await api.seller.createShop(shopInfo);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Undefined Error" });
    }
  }
);

export const setShopData = createAsyncThunk(
  "seller/getShopData",
  async () => {
    const response = await api.seller.getShopInfo();
    return response.data;
  }
);

const sellerSlice = createSlice({
  name: "sellerSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(newShop.fulfilled, (state, action) => {
      state.status = 'idle';
      console.log("New shop created:", action.payload);
    })
    builder.addCase(newShop.pending, (state) => {
      state.status = 'pending';
      console.log("SendingForm in user...");
    })
    builder.addCase(newShop.rejected, (state, action) => {
      state.status = 'idle';
      console.error("Cannot send the form:", action.payload);
    })

    builder.addCase(setShopData.fulfilled, (state, action) => {
      state.shopInfo = { ...action.payload };
      console.log("Shop info updated:", state.shopInfo);
    });
    builder.addCase(setShopData.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(setLoginData.rejected, (state, action) => {
      state.status = 'idle';
      console.error("Fetching shop data failed:", action.error);
    });
  }
});

export default sellerSlice.reducer;
