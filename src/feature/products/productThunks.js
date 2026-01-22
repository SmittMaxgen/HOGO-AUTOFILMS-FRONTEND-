import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET products
 * payload (optional):
 *  - id → fetch single product
 *  - null → fetch all products
 */
export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/products/${payload ? payload : ""}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products !",
      );
    }
  },
);

export const createProducts = createAsyncThunk(
  "product/createProducts",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/products/`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product !",
      );
    }
  },
);
