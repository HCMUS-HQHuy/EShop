import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/Api/index.api.ts";
import type { ProductType, ProductOrderType } from "src/Types/product.ts";
import { setAfterDiscountKey, setFormattedPrice } from "src/Functions/formatting.ts";
import { STORAGE_KEYS, ORDER_STATUS } from "src/Types/common.ts";

type ProductsState = {
  saveBillingInfoToLocal: boolean;
  productsList: ProductType[];
  favoritesProducts: ProductType[];
  searchProducts: ProductType[];
  orderProducts: ProductOrderType[];
  cartProducts: ProductType[];
  wishList: ProductType[];
  productQuantity: number;
  selectedProduct: ProductType | null;
  removeOrderProduct: string;
};

const initialState: ProductsState = {
  saveBillingInfoToLocal: false,
  productsList: [],
  favoritesProducts: [],
  searchProducts: [],
  orderProducts: [],
  cartProducts: localStorage.getItem(STORAGE_KEYS.CART_PRODUCTS) ? JSON.parse(localStorage.getItem(STORAGE_KEYS.CART_PRODUCTS)!) : [],
  wishList: [],
  productQuantity: 1,
  selectedProduct: null,
  removeOrderProduct: "",
};

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, {rejectWithValue}) => {
  try {
    const response = await api.product.fetchAll();
    const products: ProductType[] = response.data.products;
    products.forEach((product: any) => {
      setAfterDiscountKey(product);
      setFormattedPrice(product);
    });
    return products;
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
    },
    storeToStorage: (state, { payload: {key} } : {payload: {key: keyof ProductsState}}) => {
      localStorage.setItem(key, JSON.stringify(state[key]));
    },
    transferCartToOrder: (state) => {
      state.orderProducts = state.orderProducts.concat(state.cartProducts.map(product => ({ ...product, status: ORDER_STATUS.PENDING })));
      state.cartProducts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        // console.log("Fetching products...");
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.productsList = [...action.payload];
        // console.log("Products fetched successfully:", state.productsList);
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
  storeToStorage,
  transferCartToOrder
} = productsSlice.actions;
export default productsSlice.reducer;
