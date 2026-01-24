import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getShipmentProducts = createAsyncThunk(
  "shipmentProduct/getShipmentProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/shipment_products/${payload ? payload : ""}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch Shipment Products !",
      );
    }
  },
);

export const createShipmentProduct = createAsyncThunk(
  "shipmentProduct/createShipmentProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/shipment_products/`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create Shipment Product !",
      );
    }
  },
);

export const updateShipmentProduct = createAsyncThunk(
  "shipmentProduct/updateShipmentProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/shipment_products/${payload.id}/`,
        payload.data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update Shipment Product !",
      );
    }
  },
);

export const deleteShipmentProduct = createAsyncThunk(
  "shipmentProduct/deleteShipmentProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/shipment_products/${payload}/`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete Shipment Product !",
      );
    }
  },
);
