import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "Api/index.api.ts";
import type { CategoryInfor } from "Types/category.ts";

const initialState = {
  categoryList: Array<CategoryInfor>(),
  status: 'idle'
}

export const getCategories = createAsyncThunk(
  "categories/getCategories",
  async () => {
    const response = await api.categories.fetchTopLevel();
    return response.data;
  }
);

const categoriesSlice = createSlice({
  name: "categoriesSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.categoryList = action.payload;
      state.status = 'idle';
      console.log("Categories fetched:", action);
    })
    builder.addCase(getCategories.pending, (state) => {
      state.status = 'pending';
      console.log("Fetching categories...");
    })
    builder.addCase(getCategories.rejected, (state, action) => {
      state.status = 'idle';
      console.error("Fetching categories failed:", action.error);
    })
  }
});

export default categoriesSlice.reducer;
