import { createSlice, type PayloadAction, type Update } from "@reduxjs/toolkit";

type LoadingState = {
  loadingCategoryPage: boolean;
  loadingProductDetails: boolean;
  loadingSearchProducts: boolean;
  loadingProductsPage: boolean;
};

const initialState: LoadingState = {
  loadingCategoryPage: false,
  loadingProductDetails: false,
  loadingSearchProducts: false,
  loadingProductsPage: false,
};

type UpdateActionPayload<T extends keyof LoadingState> = {
  key: T;
  value: LoadingState[T];
};

const loadingSlice = createSlice({
  initialState,
  name: "loadingSlice",
  reducers: {
    updateLoadingState: <T extends keyof LoadingState>(
      state: LoadingState, 
      action: PayloadAction<UpdateActionPayload<T>>
    ) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

export const { updateLoadingState } = loadingSlice.actions;
export default loadingSlice.reducer;
