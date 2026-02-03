import { createSlice } from "@reduxjs/toolkit";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "./employeeThunks";

const initialState = {
  list: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  success: false,
  error: null,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    clearEmployeeState: (state) => {
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
      // ===== GET EMPLOYEES =====
      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== CREATE EMPLOYEE =====
      .addCase(createEmployee.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        if (action.payload?.data) {
          state.list.unshift(action.payload.data);
        }
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.createLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ===== UPDATE EMPLOYEE =====
      .addCase(updateEmployee.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;
        if (action.payload?.data) {
          const index = state.list.findIndex(
            (e) => e.id === action.payload.data.id,
          );
          if (index !== -1) {
            state.list[index] = action.payload.data;
          }
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.updateLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ===== DELETE EMPLOYEE =====
      .addCase(deleteEmployee.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.deleteLoading = false;
        if (action.meta.arg) {
          state.list = state.list.filter(
            (e) => e.id !== action.meta.arg,
          );
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEmployeeState } = employeeSlice.actions;
export default employeeSlice.reducer;
