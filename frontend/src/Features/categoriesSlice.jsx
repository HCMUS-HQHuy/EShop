import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "Api/index.api.ts";

const initialState = {
  categoryList: [],
  status: 'idle'
}

export const getCategories = createAsyncThunk(
  "categories/getCategories",
  async () => {
    console.log("Fetching categories...");
    const response = await api.categories.getAll();
    console.log("Fetched categories:", response.data);
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
      console.log("Categories fetched:", action.payload);
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
