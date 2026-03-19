import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET Leave Balances
 * payload (optional):
 *  - employee_id → filter by employee
 *  - leave_type  → filter by leave type (e.g. "paid leave", "sick")
 */
export const getLeaveBalances = createAsyncThunk(
  "leaveBalance/getLeaveBalances",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};

      if (payload.employee_id) params.employee_id = payload.employee_id;
      if (payload.leave_type) params.leave_type = payload.leave_type;

      const response = await axiosInstance.get("/leave-balance/", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leave balances!",
      );
    }
  },
);

/**
 * POST Create Leave Balance
 * payload: { employee_id, leave_type, total_allocated, used_days, ... }
 */
export const createLeaveBalance = createAsyncThunk(
  "leaveBalance/createLeaveBalance",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/leave-balance/", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create leave balance!",
      );
    }
  },
);

/**
 * PATCH Update Leave Balance
 * payload: { id, data }
 *  - id   → LeaveBalance ID
 *  - data → fields to update
 */
export const updateLeaveBalance = createAsyncThunk(
  "leaveBalance/updateLeaveBalance",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;
      const response = await axiosInstance.patch(`/leave-balance/${id}/`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update leave balance!",
      );
    }
  },
);

/**
 * DELETE Leave Balance
 * payload: id → LeaveBalance ID
 */
export const deleteLeaveBalance = createAsyncThunk(
  "leaveBalance/deleteLeaveBalance",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/leave-balance/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete leave balance!",
      );
    }
  },
);
