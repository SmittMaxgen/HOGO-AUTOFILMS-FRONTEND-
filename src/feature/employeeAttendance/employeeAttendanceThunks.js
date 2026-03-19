import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET Employee Attendances
 * payload (optional):
 *  - employee → filter by employee ID
 *  - date     → filter by date (e.g. "2026-03-18")
 *  - status   → filter by status (true / false)
 */
export const getEmployeeAttendances = createAsyncThunk(
  "employeeAttendance/getEmployeeAttendances",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};

      if (payload.employee) params.employee = payload.employee;
      if (payload.date) params.date = payload.date;
      if (payload.status !== undefined) params.status = payload.status;

      const response = await axiosInstance.get("/employee_attendence/", {
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch attendance records!",
      );
    }
  },
);

/**
 * POST Create Employee Attendance
 * payload: { employee, start_time, end_time, date, status, full_leave, half_leave }
 */
export const createEmployeeAttendance = createAsyncThunk(
  "employeeAttendance/createEmployeeAttendance",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/employee_attendence/",
        payload,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create attendance record!",
      );
    }
  },
);

/**
 * PATCH Update Employee Attendance
 * payload: { id, data }
 *  - id   → Attendance record ID
 *  - data → fields to update
 */
export const updateEmployeeAttendance = createAsyncThunk(
  "employeeAttendance/updateEmployeeAttendance",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;
      const response = await axiosInstance.patch(
        `/employee_attendence/${id}/`,
        data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update attendance record!",
      );
    }
  },
);

/**
 * DELETE Employee Attendance
 * payload: id → Attendance record ID
 */
export const deleteEmployeeAttendance = createAsyncThunk(
  "employeeAttendance/deleteEmployeeAttendance",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/employee_attendence/${id}/`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete attendance record!",
      );
    }
  },
);
