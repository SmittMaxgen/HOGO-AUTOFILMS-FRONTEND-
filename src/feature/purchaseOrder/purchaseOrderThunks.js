import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET purchase orders
 * optional params can be added later (status, distributor_id etc.)
 */
export const getPurchaseOrders = createAsyncThunk(
  "purchaseOrder/getPurchaseOrders",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/purchase-orders/", {
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch purchase orders!",
      );
    }
  },
);

/**
 * CREATE purchase order
 */
export const createPurchaseOrder = createAsyncThunk(
  "purchaseOrder/createPurchaseOrder",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/purchase-orders/",
        payload,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create purchase order!",
      );
    }
  },
);

/**
 * UPDATE purchase order (PATCH)
 */
export const updatePurchaseOrder = createAsyncThunk(
  "purchaseOrder/updatePurchaseOrder",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/purchase-orders/${id}/`,
        data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update purchase order!",
      );
    }
  },
);

/**
 * DELETE purchase order
 */
export const deletePurchaseOrder = createAsyncThunk(
  "purchaseOrder/deletePurchaseOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/purchase-orders/${id}/`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete purchase order!",
      );
    }
  },
);
