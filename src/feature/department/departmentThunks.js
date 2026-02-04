import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// GET DEPARTMENTS
export const getDepartments = createAsyncThunk(
  "department/getDepartments",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/departments/${payload ? payload : ""}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch departments!",
      );
    }
  },
);

// CREATE DEPARTMENT
export const createDepartment = createAsyncThunk(
  "department/createDepartment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/departments/`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create department!",
      );
    }
  },
);

// UPDATE DEPARTMENT
export const updateDepartment = createAsyncThunk(
  "department/updateDepartment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/departments/${payload.id}/`,
        payload.data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update department!",
      );
    }
  },
);

// DELETE DEPARTMENT
export const deleteDepartment = createAsyncThunk(
  "department/deleteDepartment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/departments/${payload}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete department!",
      );
    }
  },
);
