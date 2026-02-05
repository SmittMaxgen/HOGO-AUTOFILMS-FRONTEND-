import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET employee documents
 * payload (optional):
 *  - employee_id
 */
// export const getEmployeeDocuments = createAsyncThunk(
//   "employeeDocuments/getEmployeeDocuments",
//   async (payload = {}, { rejectWithValue }) => {
//     try {
//       const params = {};

//       // if (payload.employee_id)
//       //   params.employee_id = payload.employee_id;

//       const response = await axiosInstance.get(
//         `/employee-documents/${payload.employee_id ? payload.employee_id : ""}`,
//         { params },
//       );

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch employee documents!",
//       );
//     }
//   },
// );
export const getEmployeeDocuments = createAsyncThunk(
  "employeeDocuments/getEmployeeDocuments",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};

      if (payload.employee_id) {
        params.employee_id = payload.employee_id;
      }

      const response = await axiosInstance.get(
        "/employee-documents/",
        { params }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch employee documents!"
      );
    }
  }
);

/**
 * CREATE employee document (file upload)
 */
export const createEmployeeDocument = createAsyncThunk(
  "employeeDocuments/createEmployeeDocument",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/employee-documents/",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload employee document!",
      );
    }
  },
);

/**
 * UPDATE employee document
 */
export const updateEmployeeDocument = createAsyncThunk(
  "employeeDocuments/updateEmployeeDocument",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;

      const response = await axiosInstance.patch(
        `/employee-documents/${id}/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update employee document!",
      );
    }
  },
);

/**
 * DELETE employee document
 */
export const deleteEmployeeDocument = createAsyncThunk(
  "employeeDocuments/deleteEmployeeDocument",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/employee-documents/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete employee document!",
      );
    }
  },
);
