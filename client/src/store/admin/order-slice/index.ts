import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";

// ✅ Types
interface CartItem {
  title: string;
  quantity: number;
  price: number;
}

interface AddressInfo {
  address: string;
  city: string;
  pincode: string;
  phone: string;
  notes?: string;
}

export interface Order {
  _id: string;
  orderDate: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  cartItems: CartItem[];
  addressInfo: AddressInfo;
}

interface AdminOrderState {
  orderList: Order[];
  orderDetails: Order | null;
  isLoading: boolean;
}

// ✅ Initial state
const initialState: AdminOrderState = {
  orderList: [],
  orderDetails: null,
  isLoading: false,
};

// ✅ Thunks

export const getAllOrdersForAdmin = createAsyncThunk<Order[]>(
  "order/getAllOrdersForAdmin",
  async () => {
    const response = await api.get("/admin/orders/get");
    return response.data.data; // assuming your API returns { data: [...] }
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk<Order, string>(
  "order/getOrderDetailsForAdmin",
  async (id: string) => {
    const response = await api.get(`/admin/orders/details/${id}`);
    return response.data.data; // assuming API returns { data: {...} }
  }
);

export const updateOrderStatus = createAsyncThunk<
  { success: boolean; message: string },
  { id: string; orderStatus: string }
>(
  "order/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await api.put(`/admin/orders/update/${id}`, {
      orderStatus,
    });
    return response.data;
  }
);

// ✅ Slice
const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllOrdersForAdmin
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.isLoading = false;
        state.orderList = action.payload;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })

      // getOrderDetailsForAdmin
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action: PayloadAction<Order>) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
