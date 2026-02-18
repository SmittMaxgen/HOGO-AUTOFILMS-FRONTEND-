import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET Locations
 * Optional filters:
 *  - name
 *  - warehouse_id
 *  - status (active / deactive)
 */
export const getLocations = createAsyncThunk(
  "location/getLocations",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};

      if (payload.name) params.name = payload.name;
      if (payload.warehouse_id) params.warehouse_id = payload.warehouse_id;
      if (payload.status) params.status = payload.status;

      const response = await axiosInstance.get("/locations/", { params });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch locations!"
      );
    }
  }
);

/**
 * CREATE Location
 */
export const createLocation = createAsyncThunk(
  "location/createLocation",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/locations/", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create location!"
      );
    }
  }
);

/**
 * UPDATE Location
 */
export const updateLocation = createAsyncThunk(
  "location/updateLocation",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/locations/${id}/`,
        data
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update location!"
      );
    }
  }
);

/**
 * DELETE Location
 */
export const deleteLocation = createAsyncThunk(
  "location/deleteLocation",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/locations/${id}/`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete location!"
      );
    }
  }
);
