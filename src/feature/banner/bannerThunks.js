import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getBanners = createAsyncThunk(
  "banner/getBanners",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/banner/${payload ? payload : ""}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch banners",
      );
    }
  },
);
export const createBanner = createAsyncThunk(
  "banner/createBanner",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/banner/`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create banner",
      );
    }
  },
);

export const updateBanner = createAsyncThunk(
  "banner/updateBanner",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;
      const response = await axiosInstance.patch(`/banner/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update banner!",
      );
    }
  },
);

export const deleteBanner = createAsyncThunk(
  "banner/deleteBanner",
  async (payload, { rejectWithValue }) => {
    try {

      const response = await axiosInstance.delete(`/banner/${payload}/`);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete banner!",
      );
    }
  },
);
