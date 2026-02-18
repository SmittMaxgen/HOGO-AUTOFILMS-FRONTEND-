import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET Warehouses
 * payload (optional):
 *  - name → filter by name
 *  - status → active / deactive
 */
export const getWarehouses = createAsyncThunk(
  "warehouse/getWarehouses",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};

      if (payload.name) params.name = payload.name;
      if (payload.status) params.status = payload.status;

      const response = await axiosInstance.get("/warehouses/", {
        params,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch warehouses!",
      );
    }
  },
);

/**
 * CREATE Warehouse
 */
export const createWarehouse = createAsyncThunk(
  "warehouse/createWarehouse",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/warehouses/", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create warehouse!",
      );
    }
  },
);

/**
 * UPDATE Warehouse
 */
export const updateWarehouse = createAsyncThunk(
  "warehouse/updateWarehouse",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;

      const response = await axiosInstance.patch(`/warehouses/${id}/`, data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update warehouse!",
      );
    }
  },
);

/**
 * DELETE Warehouse
 */
export const deleteWarehouse = createAsyncThunk(
  "warehouse/deleteWarehouse",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/warehouses/${id}/`);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete warehouse!",
      );
    }
  },
);
