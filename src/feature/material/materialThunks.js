import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET materials
 * payload (optional):
 *  - id → fetch single material
 *  - null → fetch all materials
 */
export const getMaterials = createAsyncThunk(
  "material/getMaterials",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/material/${payload ? payload : ""}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch materials !",
      );
    }
  },
);

export const createMaterials = createAsyncThunk(
  "material/createMaterials",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/material/`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create material !",
      );
    }
  },
);

export const updateMaterials = createAsyncThunk(
  "material/updateMaterials",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload; // data is the FormData

      const response = await axiosInstance.patch(`/material/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update material !",
      );
    }
  },
);

export const deleteMaterials = createAsyncThunk(
  "material/deleteMaterials",
  async (payload, { rejectWithValue }) => {
    try {
      // const { id, data } = payload; // data is the FormData

      const response = await axiosInstance.delete(`/material/${payload}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete material !",
      );
    }
  },
);
