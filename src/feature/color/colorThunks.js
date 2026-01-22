import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET colors
 * payload (optional):
 *  - id → fetch single color
 *  - null → fetch all colors
 */
export const getColors = createAsyncThunk(
  "color/getColors",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/colour/${payload ? payload : ""}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch colors !",
      );
    }
  },
);

export const createColor = createAsyncThunk(
  "color/createColors",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/colour/`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create color !",
      );
    }
  },
);

export const updateColor = createAsyncThunk(
  "color/updateColors",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload; // data is the FormData

      const response = await axiosInstance.patch(`/colour/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update color !",
      );
    }
  },
);

export const deleteColor = createAsyncThunk(
  "color/deleteColors",
  async (payload, { rejectWithValue }) => {
    try {
      // const { id, data } = payload; // data is the FormData

      const response = await axiosInstance.delete(`/colour/${payload}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete color !",
      );
    }
  },
);
