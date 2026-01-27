import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getCategory = createAsyncThunk(
  "category/getCategory",
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/category/`, {
        params: searchQuery ? { search: searchQuery } : {},
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories!",
      );
    }
  },
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/category/`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create category !",
      );
    }
  },
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;
      const response = await axiosInstance.patch(`/category/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update category !",
      );
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/category/${payload}/`);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete category !",
      );
    }
  },
);
