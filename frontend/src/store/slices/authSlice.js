import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const signupUser = createAsyncThunk("/auth/signup", async (formData) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/user/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );
  const data = await response.json();
  return data;
});

export const loginUser = createAsyncThunk("/auth/login", async (formData) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );
  const data = await response.json();
  return data;
});

export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async () => {
    localStorage?.setItem("user", null);
  }
);

export const ca = createAsyncThunk("/auth/checkauth", async () => {
  const token = localStorage?.getItem("user") || "";
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/user/checkauth`,
    {
      method: "GET",
      headers: {
        authorization: token,
        "Accept-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.success ? action?.payload?.user : null;
        state.isAuthenticated = action?.payload?.success;
      })
      .addCase(signupUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(ca.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ca.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(ca.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
