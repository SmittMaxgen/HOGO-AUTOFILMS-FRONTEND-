import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET inventory serials
 * payload (optional):
 *  - serial_no
 *  - status
 */
export const getInventorySerials = createAsyncThunk(
  "inventorySerial/getInventorySerials",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};

      if (payload.serial_number) params.serial_number = payload.serial_number;
      if (payload.batch_id) params.batch_id = payload.batch_id;
      if (payload.status !== undefined) params.status = payload.status;

      const response = await axiosInstance.get("/inventory_serials/", {
        params,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch inventory serials!",
      );
    }
  },
);

/**
 * CREATE inventory serial
 */
export const createInventorySerial = createAsyncThunk(
  "inventorySerial/createInventorySerial",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/inventory_serials/",
        payload,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create inventory serial!",
      );
    }
  },
);

/**
 * UPDATE inventory serial
 */
export const updateInventorySerial = createAsyncThunk(
  "inventorySerial/updateInventorySerial",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;

      const response = await axiosInstance.patch(
        `/inventory_serials/${id}/`,
        data,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update inventory serial!",
      );
    }
  },
);

/**
 * DELETE inventory serial
 */
export const deleteInventorySerial = createAsyncThunk(
  "inventorySerial/deleteInventorySerial",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/inventory_serials/${id}/`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete inventory serial!",
      );
    }
  },
);
