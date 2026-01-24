import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getCost = createAsyncThunk(
  "cost/getCost",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/costs/${payload ? payload : ""}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch costs !",
      );
    }
  },
);

export const createCost = createAsyncThunk(
  "cost/createCost",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/costs/`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create costs !",
      );
    }
  },
);

export const updateCost = createAsyncThunk(
  "cost/updateCost",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/costs/${payload.id}/`,
        payload.data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update costs !",
      );
    }
  },
);

export const deleteCost = createAsyncThunk(
  "cost/deleteCost",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/costs/${payload}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete cost !",
      );
    }
  },
);
