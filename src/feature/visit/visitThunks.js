import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET Visits
 * payload (optional):
 *  - lead_id → filter by lead
 *  - employee_id → filter by employee
 */
export const getVisits = createAsyncThunk(
  "visit/getVisits",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};

      if (payload.lead_id) params.lead_id = payload.lead_id;
      if (payload.employee_id) params.employee_id = payload.employee_id;

      const response = await axiosInstance.get("/visits/", {
        params,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch visits!",
      );
    }
  },
);

/**
 * CREATE Visit
 */
export const createVisit = createAsyncThunk(
  "visit/createVisit",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/visits/", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create visit!",
      );
    }
  },
);

/**
 * UPDATE Visit
 */
export const updateVisit = createAsyncThunk(
  "visit/updateVisit",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;

      const response = await axiosInstance.patch(`/visits/${id}/`, data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update visit!",
      );
    }
  },
);

/**
 * DELETE Visit
 */
export const deleteVisit = createAsyncThunk(
  "visit/deleteVisit",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/visits/${id}/`);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete visit!",
      );
    }
  },
);
