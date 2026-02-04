import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// GET ROLES
export const getRoles = createAsyncThunk(
  "role/getRoles",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/roles/${payload ? payload : ""}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch roles!"
      );
    }
  }
);

// CREATE ROLE
export const createRole = createAsyncThunk(
  "role/createRole",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/roles/`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create role!"
      );
    }
  }
);

// UPDATE ROLE
export const updateRole = createAsyncThunk(
  "role/updateRole",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/roles/${payload.id}/`,
        payload.data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update role!"
      );
    }
  }
);

// DELETE ROLE
export const deleteRole = createAsyncThunk(
  "role/deleteRole",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/roles/${payload}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete role!"
      );
    }
  }
);
