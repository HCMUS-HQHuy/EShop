import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/index.api.ts";
import type { SellerRegistrationFormValues } from "src/Types/forms.ts";

type ShopInfo = {
  name: string;
  email: string;
  phoneNumber: string;
  description: string;
  address: string;
  status: string | null;
};

type InitialState = {
  shopInfo: ShopInfo;
  status: 'idle' | 'pending';
};

const initialState: InitialState = {
  shopInfo: {
    name: "",
    email: "",
    phoneNumber: "",
    description: "",
    address: "",
    status: null,
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
      return rejectWithValue(error.response.data);
    }
  }
);

export const setShopData = createAsyncThunk(
  "seller/getShopData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.seller.getShopInfo();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const sellerSlice = createSlice({
  name: "sellerSlice",
  initialState,
  reducers: {
    setShopStatus: (state, action) => {
      state.shopInfo.status = action.payload;
      state.status = 'idle';
    }
  },
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
      state.shopInfo = { ...action.payload.data[0] };
      console.log("Shop info updated:", state.shopInfo);
    });
    builder.addCase(setShopData.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(setShopData.rejected, (state, action) => {
      state.status = 'idle';
      console.log("Fetching shop data failed:", action.payload);
    });
  }
});

export const { setShopStatus } = sellerSlice.actions;
export default sellerSlice.reducer;
