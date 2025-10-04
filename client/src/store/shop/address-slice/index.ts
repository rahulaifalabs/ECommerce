import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";

// ---- Types ----
export interface AddressFormData {
  address: string;
  city: string;
  phone: string;
  pincode: string;
  notes?: string;
}

export interface AddressInfo extends AddressFormData {
  _id: string;
}

// Generic API response type
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

interface AddressState {
  isLoading: boolean;
  addressList: AddressInfo[];
}

const initialState: AddressState = {
  isLoading: false,
  addressList: [],
};

// ---- Thunks ----

// Add new address
export const addNewAddress = createAsyncThunk<
  ApiResponse, // response type
  AddressFormData & { userId: string } // payload type
>("/addresses/addNewAddress", async (formData) => {
  const response = await api.post("/shop/address/add", formData);
  return response.data;
});

// Fetch all addresses
export const fetchAllAddresses = createAsyncThunk<
  ApiResponse<AddressInfo[]>, // response type with data: AddressInfo[]
  string // payload type = userId
>("/addresses/fetchAllAddresses", async (userId) => {
  const response = await api.get(`/shop/address/get/${userId}`);
  return response.data;
});

// Edit an address
export const editaAddress = createAsyncThunk<
  ApiResponse, // response type
  { userId: string; addressId: string; formData: AddressFormData } // payload type
>("/addresses/editaAddress", async ({ userId, addressId, formData }) => {
  const response = await api.put(
    `/shop/address/update/${userId}/${addressId}`,
    formData
  );
  return response.data;
});

// Delete an address
export const deleteAddress = createAsyncThunk<
  ApiResponse, // response type
  { userId: string; addressId: string } // payload type
>("/addresses/deleteAddress", async ({ userId, addressId }) => {
  const response = await api.delete(
    `/shop/address/delete/${userId}/${addressId}`
  );
  return response.data;
});

// ---- Slice ----
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // addNewAddress
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })

      // fetchAllAddresses
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchAllAddresses.fulfilled,
        (state, action: PayloadAction<ApiResponse<AddressInfo[]>>) => {
          state.isLoading = false;
          state.addressList = action.payload.data ?? [];
        }
      )
      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
  },
});

export default addressSlice.reducer;
