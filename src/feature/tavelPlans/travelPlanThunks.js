import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getTravelPlans = createAsyncThunk(
  "travelPlan/getTravelPlans",
  async (
    { month = "", region = "", employee_id = "" } = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.get("/travel-plan/", {
        params: { month, region, employee_id },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch travel plans",
      );
    }
  },
);

export const createTravelPlan = createAsyncThunk(
  "travelPlan/createTravelPlan",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/travel-plan/", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create travel plan",
      );
    }
  },
);

export const updateTravelPlan = createAsyncThunk(
  "travelPlan/updateTravelPlan",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/travel-plan/${id}/`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update travel plan",
      );
    }
  },
);

export const deleteTravelPlan = createAsyncThunk(
  "travelPlan/deleteTravelPlan",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/travel-plan/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete travel plan",
      );
    }
  },
);
