import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/Api/index.api.ts";
import type { Product } from "src/Types/product.ts";
import { setAfterDiscountKey, setFormattedPrice } from "src/Functions/formatting.ts";

type ProductsState = {
  saveBillingInfoToLocal: boolean;
  productsList: Product[];
  favoritesProducts: Product[];
  searchProducts: Product[];
  orderProducts: Product[];
  cartProducts: Product[];
  wishList: Product[];
  productQuantity: number;
  selectedProduct: Product | null;
  removeOrderProduct: string;
};

const initialState: ProductsState = {
  saveBillingInfoToLocal: false,
  productsList: [],
  favoritesProducts: [],
  searchProducts: [],
  orderProducts: [],
  cartProducts: [],
  wishList: [],
  productQuantity: 1,
  selectedProduct: null,
  removeOrderProduct: "",
};

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, {rejectWithValue}) => {
  try {
    const response = await api.product.fetchAll();
    response.data.forEach((product: any) => {
      setAfterDiscountKey(product);
      setFormattedPrice(product);
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

const productsSlice = createSlice({
  initialState,
  name: "productsSlice",
  reducers: {
    updateProductsState: (state, { payload: { key, value } }) => {
      state[key] = value;
    },
    addToArray: (state, { payload: { key, value } }) => {
      state[key].push(value);
    },
    removeById: (state, { payload: { key, id } }) => {
      const updatedState = state[key].filter((item: any) => item.id !== id);
      state[key] = updatedState;
    },
    removeByKeyName: (state, { payload: { dataKey, itemKey, keyValue } }) => {
      const updatedState = state[dataKey].filter(
        (item: any) => item[itemKey] !== keyValue
      );
      state[dataKey] = updatedState;
    },
    setEmptyArrays: (state, { payload: { keys } }) => {
      for (let i = 0; i < keys.length; i++) state[keys[i]] = [];
    },
    transferProducts: (state, { payload: { from, to } }) => {
      state[to] = state[to].concat(state[from]);
      state[from] = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        console.log("Fetching products...");
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.productsList = [...action.payload];
        console.log("Products fetched successfully:", state.productsList);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.error("Failed to fetch products:", action.payload);
      });
  },
});

export const {
  updateProductsState,
  addToArray,
  removeById,
  removeByKeyName,
  setEmptyArrays,
  transferProducts,
} = productsSlice.actions;
export default productsSlice.reducer;
