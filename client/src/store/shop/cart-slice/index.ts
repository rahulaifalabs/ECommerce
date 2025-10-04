// src/store/shop/cart-slice/index.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";

// ✅ Define CartItem type
export interface CartItem {
  productId: string;
    title: string;

  name: string;
  price: number;
  quantity: number;
  image?: string;
    salePrice?: number; 

}

interface CartState {
  cartItems: CartItem[];
  isLoading: boolean;
}

const initialState: CartState = {
  cartItems: [],
  isLoading: false,
};

// ✅ addToCart thunk
export const addToCart = createAsyncThunk<
  { data: CartItem[] }, // return type
  { userId: string; productId: string; quantity: number } // argument type
>(
  "cart/addToCart",
  async ({ userId, productId, quantity }) => {
    const response = await api.post("/shop/cart/add", {
      userId,
      productId,
      quantity,
    });
    return response.data;
  }
);


// ✅ fetchCartItems thunk
export const fetchCartItems = createAsyncThunk<
  { data: CartItem[] },
  string // userId
>("cart/fetchCartItems", async (userId) => {
  const response = await api.get(`/shop/cart/get/${userId}`);
  return response.data;
});

// ✅ deleteCartItem thunk
export const deleteCartItem = createAsyncThunk<
  { data: CartItem[] },
  { userId: string; productId: string }
>("cart/deleteCartItem", async ({ userId, productId }) => {
  const response = await api.delete(`/shop/cart/${userId}/${productId}`);
  return response.data;
});

// ✅ updateCartQuantity thunk
export const updateCartQuantity = createAsyncThunk<
  { data: CartItem[] },
  { userId: string; productId: string; quantity: number }
>("cart/updateCartQuantity", async ({ userId, productId, quantity }) => {
  const response = await api.put("/shop/cart/update-cart", {
    userId,
    productId,
    quantity,
  });
  return response.data;
});

// ✅ Slice
const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<{ data: CartItem[] }>) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })

      // fetchCartItems
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action: PayloadAction<{ data: CartItem[] }>) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })

      // updateCartQuantity
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action: PayloadAction<{ data: CartItem[] }>) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })

      // deleteCartItem
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action: PayloadAction<{ data: CartItem[] }>) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      });
  },
});

export default shoppingCartSlice.reducer;
