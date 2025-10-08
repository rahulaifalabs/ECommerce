// ✅ TypeScript Redux Slice for Admin Products
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { Product } from "@/pages/admin-view/Products";

// ---------------------- State Type ----------------------
interface AdminProductsState {
  isLoading: boolean;
  productList: Product[];
}

// ---------------------- Initial State ----------------------
const initialState: AdminProductsState = {
  isLoading: false,
  productList: [],
};

// ---------------------- Thunks ----------------------

/**
 * ✅ Add New Product
 */
export const addNewProduct = createAsyncThunk<
  // Return type
  any,
  // Argument type
  Product
>("/products/addnewproduct", async (formData) => {
  const result = await api.post("/admin/products/add", formData, {
    headers: { "Content-Type": "application/json" },
  });
  return result?.data;
});

/**
 * ✅ Fetch All Products
 */
export const fetchAllProducts = createAsyncThunk<any>(
  "/products/fetchAllProducts",
  async () => {
    const result = await api.get("/admin/products/get");
    return result?.data;
  }
);

/**
 * ✅ Edit Product
 */
export const editProduct = createAsyncThunk<
  any,
  { id: string; formData: Product }
>("/products/editProduct", async ({ id, formData }) => {
  const result = await api.put(`/admin/products/edit/${id}`, formData, {
    headers: { "Content-Type": "application/json" },
  });
  return result?.data;
});

/**
 * ✅ Delete Product
 */
export const deleteProduct = createAsyncThunk<any, string>(
  "/products/deleteProduct",
  async (id) => {
    const result = await api.delete(`/admin/products/delete/${id}`);
    return result?.data;
  }
);

// ---------------------- Slice ----------------------
const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch All Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;

        // ✅ Safely handle response structure
        state.productList =
          action.payload?.data && Array.isArray(action.payload.data)
            ? action.payload.data
            : [];
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default AdminProductsSlice.reducer;
