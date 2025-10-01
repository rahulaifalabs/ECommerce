// AUTO-CONVERTED: extension changed to TypeScript. Please review and add explicit types.
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "@/utils/api";
import { Product } from "@/pages/admin-view/Products";

const initialState = {
  isLoading: false,
  productList: [],
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await api.post("/admin/products/add", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return result?.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    const result = await api.get("/admin/products/get");

    return result?.data;
  }
);

export const editProduct = createAsyncThunk<
  {},
  {
    id: string | undefined;
    formData: Product;
  }
>("/products/editProduct", async ({ id, formData }) => {
  const result = await api.put(`/admin/products/edit/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return result?.data;
});

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id: string) => {
    const result = await api.delete(`/admin/products/delete/${id}`);

    return result?.data;
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default AdminProductsSlice.reducer;
