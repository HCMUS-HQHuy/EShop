import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/Api/index.api.ts";
import type { OrderType, ProductType } from "src/Types/product.ts";
import { STORAGE_KEYS } from "src/Types/common.ts";

type ProductsState = {
  saveBillingInfoToLocal: boolean;
  productsList: ProductType[];
  favoritesProducts: ProductType[];
  searchProducts: ProductType[];
  orderProducts: OrderType[];
  cartProducts: ProductType[];
  wishList: ProductType[];
  productQuantity: number;
  selectedProduct: ProductType | null;
  removeOrderProduct: string;
  numberOfProducts: number;
};

const initialState: ProductsState = {
  saveBillingInfoToLocal: false,
  productsList: [],
  favoritesProducts: [],
  searchProducts: [],
  orderProducts: [],
  cartProducts: localStorage.getItem(STORAGE_KEYS.CART_PRODUCTS) ? JSON.parse(localStorage.getItem(STORAGE_KEYS.CART_PRODUCTS)!) : [],
  wishList: [],
  numberOfProducts: 0,
  productQuantity: 1,
  selectedProduct: null,
  removeOrderProduct: "",
};

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, {rejectWithValue}) => {
  try {
    const response = await api.user.fetchProducts();
    return { numberOfProducts: response.data.numberOfProducts ,products: response.data.products};
  } catch (error: any) {
    console.log('Error fetching products:', error);
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
      const updatedState = state[key].filter((item: any) => item.productId !== id);
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
      // state.orderProducts = state.orderProducts.concat(state.cartProducts.map(product => ({ ...product, status: ORDER_STATUS.PENDING })));
      state.cartProducts = [];
      localStorage.removeItem(STORAGE_KEYS.CART_PRODUCTS);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.numberOfProducts = action.payload.numberOfProducts;
        state.productsList = [...action.payload.products];
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
