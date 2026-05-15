import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

const BASE_URL = "/trip/";

// Get Trip by Visit ID
export const getTripByVisit = createAsyncThunk(
  "trip/getTripByVisit",
  async (visit_id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${BASE_URL}?visit_id=${visit_id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch trip");
    }
  },
);

// Get Trip by Employee (optional)
export const getTripByEmployee = createAsyncThunk(
  "trip/getTripByEmployee",
  async (employee_id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `${BASE_URL}?employee_id=${employee_id}`,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);
