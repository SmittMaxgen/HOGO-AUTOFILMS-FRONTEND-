import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getShipments = createAsyncThunk(
  "shipment/getShipment",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/shipments/", {
        params: {
          supplier_name: params.supplier_name || "",
          supplier_invoice_no: params.supplier_invoice_no || "",
          invoice_currency: params.invoice_currency || "",
          arrival_date: params.arrival_date || "",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch shipment!",
      );
    }
  },
);

export const createShipment = createAsyncThunk(
  "shipment/createShipment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/shipments/`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create shipment !",
      );
    }
  },
);

export const updateShipment = createAsyncThunk(
  "shipment/updateShipment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/shipments/${payload.id}/`,
        payload.data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update shipment !",
      );
    }
  },
);

export const deleteShipment = createAsyncThunk(
  "shipment/deleteShipment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/shipments/${payload}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete shipment !",
      );
    }
  },
);
