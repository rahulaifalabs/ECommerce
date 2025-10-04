import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";

// ---------------- Types ----------------
export interface Review {
  productId: string;
  userId: string;
  userName: string;
  reviewMessage: string;
  reviewValue: number;
}

interface ReviewState {
  isLoading: boolean;
  reviews: Review[];
}

// ---------------- Initial State ----------------
const initialState: ReviewState = {
  isLoading: false,
  reviews: [],
};

// ---------------- Thunks ----------------

// Add a new review (typed payload)
export const addReview = createAsyncThunk<
  any, // return type (API response)
  Review // argument type
>("/order/addReview", async (formData) => {
  const response = await api.post(`/shop/review/add`, formData);
  return response.data;
});

// Fetch reviews by product ID
export const getReviews = createAsyncThunk<
  any,
  string // product ID
>("/order/getReviews", async (id) => {
  const response = await api.get(`/shop/review/${id}`);
  return response.data;
});

// ---------------- Slice ----------------
const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action: PayloadAction<{ data: Review[] }>) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      })
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addReview.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default reviewSlice.reducer;
