import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getDailyPlans = createAsyncThunk(
  "dailyPlan/getDailyPlans",
  async ({ travel_plan = "", date = "", place = "" } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/daily-plan/", {
        params: { travel_plan, date, place },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch daily plans"
      );
    }
  }
);

export const createDailyPlan = createAsyncThunk(
  "dailyPlan/createDailyPlan",
  async (payload, { rejectWithValue }) => {
    try {
      // payload shape: { travel_plan, date, place, notes }
      const response = await axiosInstance.post("/daily-plan/", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create daily plan"
      );
    }
  }
);

export const updateDailyPlan = createAsyncThunk(
  "dailyPlan/updateDailyPlan",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/daily-plan/${id}/`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update daily plan"
      );
    }
  }
);

export const deleteDailyPlan = createAsyncThunk(
  "dailyPlan/deleteDailyPlan",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/daily-plan/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete daily plan"
      );
    }
  }
);