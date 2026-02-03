import { createSlice } from "@reduxjs/toolkit";
import {
  getEmployeeSalaries,
  createEmployeeSalary,
  updateEmployeeSalary,
  deleteEmployeeSalary,
} from "./employeeSalaryThunks";

const initialState = {
  list: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  success: false,
  error: null,
};

const employeeSalarySlice = createSlice({
  name: "employeeSalary",
  initialState,
  reducers: {
    clearEmployeeSalaryState: (state) => {
      state.list = [];
      state.loading = false;
      state.createLoading = false;
      state.updateLoading = false;
      state.deleteLoading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== GET SALARIES =====
      .addCase(getEmployeeSalaries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeSalaries.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
      })
      .addCase(getEmployeeSalaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== CREATE SALARY =====
      .addCase(createEmployeeSalary.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createEmployeeSalary.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        if (action.payload?.data) {
          state.list.unshift(action.payload.data);
        }
      })
      .addCase(createEmployeeSalary.rejected, (state, action) => {
        state.createLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ===== UPDATE SALARY =====
      .addCase(updateEmployeeSalary.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateEmployeeSalary.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;
        if (action.payload?.data) {
          const index = state.list.findIndex(
            (s) => s.id === action.payload.data.id,
          );
          if (index !== -1) {
            state.list[index] = action.payload.data;
          }
        }
      })
      .addCase(updateEmployeeSalary.rejected, (state, action) => {
        state.updateLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ===== DELETE SALARY =====
      .addCase(deleteEmployeeSalary.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteEmployeeSalary.fulfilled, (state, action) => {
        state.deleteLoading = false;
        if (action.meta.arg) {
          state.list = state.list.filter(
            (s) => s.id !== action.meta.arg,
          );
        }
      })
      .addCase(deleteEmployeeSalary.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEmployeeSalaryState } =
  employeeSalarySlice.actions;

export default employeeSalarySlice.reducer;
