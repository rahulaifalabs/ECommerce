import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";

// ---------------- Types ----------------
export type UserObj = {
  role: string;
  id: string;
  email: string;
  userName?: string; // made optional since not always returned
};

export type UserState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserObj | null;
  token: string | null;
};

// Login/Register request payloads
export interface AuthCredentials {
  email: string;
  password: string;
}

// API response shape (adjust to your backend)
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserObj;
}

// ---------------- Initial State ----------------
const initialState: UserState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: localStorage.getItem("token"),
};

// ---------------- Thunks ----------------

// Register
export const registerUser = createAsyncThunk<
  AuthResponse,         // return type
  AuthCredentials       // arg type
>("/auth/register", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/register", formData, {
      withCredentials: true,
    });
    return response.data as AuthResponse;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { success: false, message: "Register failed" });
  }
});

// Login
export const loginUser = createAsyncThunk<
  AuthResponse,         // return type
  AuthCredentials       // arg type
>("/auth/login", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", formData, {
      withCredentials: true,
    });
    return response.data as AuthResponse;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { success: false, message: "Login failed" });
  }
});

// Logout
export const logoutUser = createAsyncThunk<AuthResponse>(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/logout");
      return response.data as AuthResponse;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { success: false, message: "Logout failed" });
    }
  }
);

// Check Auth
export const checkAuth = createAsyncThunk<AuthResponse>(
  "/auth/checkauth",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/auth/check-auth", {
        withCredentials: true,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data as AuthResponse;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { success: false, message: "Check auth failed" });
    }
  }
);

// ---------------- Slice ----------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserObj | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user || null : null;
        state.isAuthenticated = action.payload.success;
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
          state.token = action.payload.token;
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user || null : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        localStorage.removeItem("token");
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.token = null;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
