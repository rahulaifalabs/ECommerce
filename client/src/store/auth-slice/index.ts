// AUTO-CONVERTED: extension changed to TypeScript. Please review and add explicit types.
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "@/utils/api";

export type UserObj = {
  role: string;
  id: string;
  email: string;
};

export type User = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserObj | null;
  token: string;
};

const initialState: User = {
  isAuthenticated: false,
  isLoading: true,
  user: {
    id: "",
    email: "",
    role: "",
  },
  token: localStorage.getItem("token") as string, // Initialize from localStorage if available
};

export const registerUser = createAsyncThunk(
  "/auth/register",

  async (formData) => {
    const response = await api.post("/auth/register", formData, {
      withCredentials: true,
    });

    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",

  async (formData) => {
    const response = await api.post("/auth/login", formData, {
      withCredentials: true,
    });

    return response.data;
  }
);

export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  // No need to send credentials if we're not using cookies
  const response = await api.post("/auth/logout");
  return response.data;
});

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",

  async () => {
    const token = localStorage.getItem("token");
    const response = await api.get("/auth/check-auth", {
      withCredentials: true,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action);

        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        localStorage.removeItem("token"); // remove JWT from client storage
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
