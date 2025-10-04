// src/store/shop/order-slice/index.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";

// ---------------- Types ----------------
export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderItem {
  _id: string;
  orderDate: string;
  orderStatus: "confirmed" | "rejected" | string;
  totalAmount: number;
  cartItems: CartItem[];
  paymentMethod?: string;
  paymentStatus?: string;
  addressInfo?: {
    address?: string;
    city?: string;
    pincode?: string;
    phone?: string;
    notes?: string;
  };
}

interface ShoppingOrderState {
  approvalURL: string | null;
  isLoading: boolean;
  orderId: string | null;
  orderList: OrderItem[];
  orderDetails: OrderItem | null;
}

// ---------------- Initial State ----------------
const initialState: ShoppingOrderState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

// ---------------- Thunks ----------------
export const createNewOrder = createAsyncThunk<
  { approvalURL: string; orderId: string },
  Record<string, any>
>("shoppingOrder/createNewOrder", async (orderData) => {
  const response = await api.post("/shop/order/create", orderData);
  return response.data;
});

export const capturePayment = createAsyncThunk<
  Record<string, any>,
  { paymentId: string; payerId: string; orderId: string }
>("shoppingOrder/capturePayment", async ({ paymentId, payerId, orderId }) => {
  const response = await api.post("/shop/order/capture", {
    paymentId,
    payerId,
    orderId,
  });
  return response.data;
});

export const getAllOrdersByUserId = createAsyncThunk<
  { data: OrderItem[] },
  string
>("shoppingOrder/getAllOrdersByUserId", async (userId) => {
  const response = await api.get(`/shop/order/list/${userId}`);
  return response.data;
});

export const getOrderDetails = createAsyncThunk<
  { data: OrderItem },
  string
>("shoppingOrder/getOrderDetails", async (id) => {
  const response = await api.get(`/shop/order/details/${id}`);
  return response.data;
});

// ---------------- Slice ----------------
const shoppingOrderSlice = createSlice({
  name: "shoppingOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createNewOrder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        createNewOrder.fulfilled,
        (state, action: PayloadAction<{ approvalURL: string; orderId: string }>) => {
          state.isLoading = false;
          state.approvalURL = action.payload.approvalURL;
          state.orderId = action.payload.orderId;
          sessionStorage.setItem("currentOrderId", JSON.stringify(action.payload.orderId));
        }
      )
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })

      // getAllOrdersByUserId
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getAllOrdersByUserId.fulfilled,
        (state, action: PayloadAction<{ data: OrderItem[] }>) => {
          state.isLoading = false;
          state.orderList = action.payload.data;
        }
      )
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })

      // getOrderDetails
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getOrderDetails.fulfilled,
        (state, action: PayloadAction<{ data: OrderItem }>) => {
          state.isLoading = false;
          state.orderDetails = action.payload.data;
        }
      )
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
