import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";

// ---------------- Types ----------------
// ------------------- Types -------------------
export interface Product {
  _id: string;
  title: string;
  category: string;
  brand: string;
  image: string;
  price: number;
  salePrice?: number; // optional
  description?: string; // optional to match slice
  totalStock?: number;  // optional if slice may not have it
}




interface FeatureImage {
  _id: string;
  image: string;
}

interface UserObj {
  id: string;
  name: string;
  email: string;
}


interface ProductsState {
  isLoading: boolean;
  productList: Product[];
  productDetails: Product | null;
}

// ---------------- Initial State ----------------
const initialState: ProductsState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

// ---------------- Async Thunks ----------------
export const fetchAllFilteredProducts = createAsyncThunk<
  { data: Product[] },
  { filterParams: Record<string, string>; sortParams: string }
>("/products/fetchAllProducts", async ({ filterParams, sortParams }) => {
  const query = new URLSearchParams({
    ...filterParams,
    sortBy: sortParams,
  });

  const result = await api.get(`/shop/products/get?${query}`);
  return result.data;
});

export const fetchProductDetails = createAsyncThunk<
  { data: Product },
  { id: string }
>("/products/fetchProductDetails", async ({ id }) => {
  const result = await api.get(`/shop/products/get/${id}`);
  return result.data;
});

// ---------------- Slice ----------------
const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state, action: PayloadAction<Product | null>) => {
      state.productDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
