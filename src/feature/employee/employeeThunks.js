import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET employees
 * payload (optional filters)
 */
export const getEmployees = createAsyncThunk(
  "employee/getEmployees",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};

      if (payload.name) params.name = payload.name;
      if (payload.status !== undefined) params.status = payload.status;

      const response = await axiosInstance.get(
        `/employee/${payload.employee_id ? payload.employee_id : ""}`,
        { params },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch employees!",
      );
    }
  },
);

/**
 * CREATE employee
 */
export const createEmployee = createAsyncThunk(
  "employee/createEmployee",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/employee/", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create employee!",
      );
    }
  },
);

/**
 * UPDATE employee
 */
export const updateEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;

      const response = await axiosInstance.patch(`/employee/${id}/`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update employee!",
      );
    }
  },
);

/**
 * DELETE employee
 */
export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/employee/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete employee!",
      );
    }
  },
);
