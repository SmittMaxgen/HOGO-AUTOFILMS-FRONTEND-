// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "../../api/axiosInstance";

// /**
//  * GET Employee Attendances
//  * payload (optional):
//  *  - employee → filter by employee ID
//  *  - date     → filter by date (e.g. "2026-03-18")
//  *  - status   → filter by status (true / false)
//  */
// export const getEmployeeAttendances = createAsyncThunk(
//   "employeeAttendance/getEmployeeAttendances",
//   async (payload = {}, { rejectWithValue }) => {
//     try {
//       const params = {};

//       if (payload.employee) params.employee = payload.employee;
//       if (payload.date) params.date = payload.date;
//       if (payload.status !== undefined) params.status = payload.status;

//       const response = await axiosInstance.get("/employee_attendence/", {
//         params,
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch attendance records!",
//       );
//     }
//   },
// );

// /**
//  * POST Create Employee Attendance
//  * payload: { employee, start_time, end_time, date, status, full_leave, half_leave }
//  */
// export const createEmployeeAttendance = createAsyncThunk(
//   "employeeAttendance/createEmployeeAttendance",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post(
//         "/employee_attendence/",
//         payload,
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to create attendance record!",
//       );
//     }
//   },
// );

// /**
//  * PATCH Update Employee Attendance
//  * payload: { id, data }
//  *  - id   → Attendance record ID
//  *  - data → fields to update
//  */
// export const updateEmployeeAttendance = createAsyncThunk(
//   "employeeAttendance/updateEmployeeAttendance",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const { id, data } = payload;
//       const response = await axiosInstance.patch(
//         `/employee_attendence/${id}/`,
//         data,
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to update attendance record!",
//       );
//     }
//   },
// );

// /**
//  * DELETE Employee Attendance
//  * payload: id → Attendance record ID
//  */
// export const deleteEmployeeAttendance = createAsyncThunk(
//   "employeeAttendance/deleteEmployeeAttendance",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.delete(
//         `/employee_attendence/${id}/`,
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to delete attendance record!",
//       );
//     }
//   },
// );

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET Employee Attendances
 *
 * payload (all optional):
 *  - employee_id  → filter by employee ID
 *  - date         → single date  "2026-03-18"
 *  - month        → month number  3
 *  - year         → year number   2026
 *  - start_date   → range start  "2026-03-10"
 *  - end_date     → range end    "2026-03-25"
 *  - full_leave   → boolean
 *  - half_leave   → boolean
 *
 * Response shape: { success, message, count, data: [...] }
 */
export const getEmployeeAttendances = createAsyncThunk(
  "employeeAttendance/getEmployeeAttendances",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};

      if (payload.employee_id) params.employee_id = payload.employee_id;
      if (payload.date) params.date = payload.date;
      if (payload.month !== undefined) params.month = payload.month;
      if (payload.year !== undefined) params.year = payload.year;
      if (payload.start_date) params.start_date = payload.start_date;
      if (payload.end_date) params.end_date = payload.end_date;
      if (payload.full_leave !== undefined)
        params.full_leave = payload.full_leave;
      if (payload.half_leave !== undefined)
        params.half_leave = payload.half_leave;

      const response = await axiosInstance.get("/employee_attendence/", {
        params,
      });

      // New API returns { success, message, count, data: [...] }
      // Fall back to raw array for backwards compatibility
      return response.data?.data ?? response.data;
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
      return response.data?.data ?? response.data;
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
 */
export const updateEmployeeAttendance = createAsyncThunk(
  "employeeAttendance/updateEmployeeAttendance",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/employee_attendence/${id}/`,
        data,
      );
      return response.data?.data ?? response.data;
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
      return id; // return deleted id so reducer can remove it from state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete attendance record!",
      );
    }
  },
);
