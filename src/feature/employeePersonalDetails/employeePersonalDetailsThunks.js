import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET employee personal details
 * payload (optional):
 *  - employee_id
 */
// export const getEmployeePersonalDetails = createAsyncThunk(
//   "employeePersonalDetails/getEmployeePersonalDetails",
//   async (payload = {}, { rejectWithValue }) => {
//     try {
//       const params = {};

//       if (payload.employee_id) params.employee_id = payload.employee_id;

//       const response = await axiosInstance.get(
//         `/Employeepersonaldetails/${payload.employee_id ? payload.employee_id : ""}`,
//         { params },
//       );

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message ||
//           "Failed to fetch employee personal details!",
//       );
//     }
//   },
// );

export const getEmployeePersonalDetails = createAsyncThunk(
  "employeePersonalDetails/getEmployeePersonalDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};

      if (payload.employee_id) {
        params.employee_id = payload.employee_id;
      }

      const response = await axiosInstance.get(
        "/Employeepersonaldetails/",
        { params }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch employee personal details!"
      );
    }
  }
);
/**
 * CREATE employee personal details
 */
export const createEmployeePersonalDetails = createAsyncThunk(
  "employeePersonalDetails/createEmployeePersonalDetails",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/Employeepersonaldetails/",
        payload,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create employee personal details!",
      );
    }
  },
);

/**
 * UPDATE employee personal details
 */
export const updateEmployeePersonalDetails = createAsyncThunk(
  "employeePersonalDetails/updateEmployeePersonalDetails",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;

      const response = await axiosInstance.patch(
        `/Employeepersonaldetails/${id}/`,
        data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update employee personal details!",
      );
    }
  },
);

/**
 * DELETE employee personal details
 */
export const deleteEmployeePersonalDetails = createAsyncThunk(
  "employeePersonalDetails/deleteEmployeePersonalDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/Employeepersonaldetails/${id}/`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete employee personal details!",
      );
    }
  },
);
