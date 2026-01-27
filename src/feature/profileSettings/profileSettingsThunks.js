import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const forgotPassword = createAsyncThunk(
  "forgotPass/AdminForgotPassword/",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/admin_forgot_password/`,
        payload,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch banners",
      );
    }
  },
);
export const resetPassword = createAsyncThunk(
  "forgotPass/AdminResetPassword/",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/admin_reset_password//`,
        payload,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create banner",
      );
    }
  },
);
