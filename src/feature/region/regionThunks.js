import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getRegions = createAsyncThunk(
  "region/getRegions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (payload.name)   params.name   = payload.name;
      if (payload.status) params.status = payload.status; // "enable" / "disable"

      const response = await axiosInstance.get("/regions/", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch regions!"
      );
    }
  }
);

export const createRegion = createAsyncThunk(
  "region/createRegion",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/regions/", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create region!"
      );
    }
  }
);

export const updateRegion = createAsyncThunk(
  "region/updateRegion",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;
      const response = await axiosInstance.patch(`/regions/${id}/`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update region!"
      );
    }
  }
);

export const deleteRegion = createAsyncThunk(
  "region/deleteRegion",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/regions/${payload}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete region!"
      );
    }
  }
);