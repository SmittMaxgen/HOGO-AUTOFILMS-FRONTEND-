import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET employee salaries
 * payload (optional):
 *  - employee_id
 */
export const getEmployeeSalaries = createAsyncThunk(
  "employeeSalary/getEmployeeSalaries",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};

      // if (payload.employee_id)
      //   params.employee_id = payload.employee_id;

      const response = await axiosInstance.get(
        `/employee-salary/${payload.employee_id ? payload.employee_id : ""}`,
        {
          params,
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch employee salaries!",
      );
    }
  },
);

/**
 * CREATE employee salary
 */
export const createEmployeeSalary = createAsyncThunk(
  "employeeSalary/createEmployeeSalary",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/employee-salary/", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create employee salary!",
      );
    }
  },
);

/**
 * UPDATE employee salary
 */
export const updateEmployeeSalary = createAsyncThunk(
  "employeeSalary/updateEmployeeSalary",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;

      const response = await axiosInstance.patch(
        `/employee-salary/${id}/`,
        data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update employee salary!",
      );
    }
  },
);

/**
 * DELETE employee salary
 */
export const deleteEmployeeSalary = createAsyncThunk(
  "employeeSalary/deleteEmployeeSalary",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/employee-salary/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete employee salary!",
      );
    }
  },
);
