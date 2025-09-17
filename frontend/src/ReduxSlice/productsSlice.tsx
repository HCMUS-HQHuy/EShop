import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "src/Api/index.api.ts";
import type { OrderType, ProductDetailType, ProductType } from "src/Types/product.ts";
import { STORAGE_KEYS } from "src/Types/common.ts";

type ProductsState = {
  saveBillingInfoToLocal: boolean;
  productsList: ProductType[];
  searchProducts: ProductType[];
  orderProducts: OrderType[];
  cartProducts: ProductType[];
  productQuantity: number;
  selectedProduct: ProductDetailType | null;
  removeOrderProduct: string;
  numberOfProducts: number;
};

const initialState: ProductsState = {
  saveBillingInfoToLocal: false,
  productsList: [],
  searchProducts: [],
  orderProducts: [],
  cartProducts: localStorage.getItem(STORAGE_KEYS.CART_PRODUCTS) ? JSON.parse(localStorage.getItem(STORAGE_KEYS.CART_PRODUCTS)!) : [],
  numberOfProducts: 0,
  productQuantity: 1,
  selectedProduct: null,
  removeOrderProduct: "",
};
type ArrayKeys = "productsList" | "searchProducts" | "orderProducts" | "cartProducts";

type UpdateProductsState<T extends keyof ProductsState>  = {
  key: T;
  value: ProductsState[T];
}

type AddToArray<T extends ArrayKeys>  = {
  key: T;
  value: ProductType | OrderType;
}

type SetEmptyArrays<T extends ArrayKeys>  = {
  keys: T[];
}

type RemoveById<T extends ArrayKeys>  = {
  key: T;
  id: number;
}

type RemoveByKeyName<T extends ArrayKeys> = {
  dataKey: ArrayKeys;
  itemKey: string;
  keyValue: string | number;
}

type TransferProducts<T extends ArrayKeys> = {
  from: ArrayKeys;
  to: ArrayKeys;
}

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
    updateProductsState: <T extends keyof ProductsState>(state: ProductsState, action: PayloadAction<UpdateProductsState<T>>) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    addToArray: <T extends ArrayKeys>(state: ProductsState, action: PayloadAction<AddToArray<T>>) => {
      const { key, value } = action.payload;
      if (key === "orderProducts") {
        (state[key] as OrderType[]).push(value as OrderType);
      } else {
        (state[key] as ProductType[]).push(value as ProductType);
      }
    },
    removeById: <T extends ArrayKeys>(state: ProductsState, action: PayloadAction<RemoveById<T>>) => {
      const { key, id } = action.payload;
      (state[key] as any) = state[key].filter((item: any) => item.productId !== id);
    },
    removeByKeyName: <T extends ArrayKeys>(state: ProductsState, action: PayloadAction<RemoveByKeyName<T>>) => {
      const { dataKey, itemKey, keyValue } = action.payload;
      const updatedState = state[dataKey].filter(
        (item: any) => item[itemKey] !== keyValue
      );
      (state[dataKey] as any) = updatedState;
    },
    setEmptyArrays: <T extends ArrayKeys>(state: ProductsState, action: PayloadAction<SetEmptyArrays<T>>) => {
      const { keys } = action.payload;
      for (const key of keys) {
        state[key] = [];
      }
    },
    transferProducts: <T extends ArrayKeys>(state: ProductsState, action: PayloadAction<TransferProducts<T>>) => {
      const { from, to } = action.payload;
      (state[to] as any) = state[to].concat(state[from]);
      (state[from] as ProductType[] | OrderType[]) = [];
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
