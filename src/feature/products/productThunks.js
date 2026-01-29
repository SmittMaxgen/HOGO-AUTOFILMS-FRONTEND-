import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async ({ search = "" } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/products/", {
        params: {
          search, // backend should read ?search=
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products!",
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

export const updateProducts = createAsyncThunk(
  "product/updateProducts",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/products/${payload.id}/`,
        payload.data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product !",
      );
    }
  },
);

export const deleteProducts = createAsyncThunk(
  "product/deleteProducts",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/products/${payload}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product !",
      );
    }
  },
);
