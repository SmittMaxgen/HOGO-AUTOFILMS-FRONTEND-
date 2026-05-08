import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// GET REPLACEMENTS
export const getReplacements = createAsyncThunk(
  "replacement/getReplacements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/replacement/`);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          "Failed to fetch replacement requests",
      );
    }
  },
);

// CREATE REPLACEMENT
export const createReplacement = createAsyncThunk(
  "replacement/createReplacement",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/replacement/`, payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          "Failed to create replacement request",
      );
    }
  },
);

// UPDATE REPLACEMENT
export const updateReplacement = createAsyncThunk(
  "replacement/updateReplacement",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;

      const response = await axiosInstance.patch(`/replacement/${id}/`, data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          "Failed to update replacement request",
      );
    }
  },
);

// DELETE REPLACEMENT
export const deleteReplacement = createAsyncThunk(
  "replacement/deleteReplacement",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/replacement/${id}/`);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          "Failed to delete replacement request",
      );
    }
  },
);
