import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const AdminUser = createAsyncThunk(
  "admin/AdminUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/admin_profile/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "GET : Admin data failed !",
      );
    }
  },
);
