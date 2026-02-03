import { createSlice } from "@reduxjs/toolkit";
import {
  getEmployeeDocuments,
  createEmployeeDocument,
  updateEmployeeDocument,
  deleteEmployeeDocument,
} from "./employeeDocumentsThunks";

const initialState = {
  list: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  success: false,
  error: null,
};

const employeeDocumentsSlice = createSlice({
  name: "employeeDocuments",
  initialState,
  reducers: {
    clearEmployeeDocumentsState: (state) => {
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
      // ===== GET DOCUMENTS =====
      .addCase(getEmployeeDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
      })
      .addCase(getEmployeeDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== CREATE DOCUMENT =====
      .addCase(createEmployeeDocument.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createEmployeeDocument.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        if (action.payload?.data) {
          state.list.unshift(action.payload.data);
        }
      })
      .addCase(createEmployeeDocument.rejected, (state, action) => {
        state.createLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ===== UPDATE DOCUMENT =====
      .addCase(updateEmployeeDocument.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateEmployeeDocument.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;
        if (action.payload?.data) {
          const index = state.list.findIndex(
            (d) => d.id === action.payload.data.id,
          );
          if (index !== -1) {
            state.list[index] = action.payload.data;
          }
        }
      })
      .addCase(updateEmployeeDocument.rejected, (state, action) => {
        state.updateLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ===== DELETE DOCUMENT =====
      .addCase(deleteEmployeeDocument.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteEmployeeDocument.fulfilled, (state, action) => {
        state.deleteLoading = false;
        if (action.meta.arg) {
          state.list = state.list.filter(
            (d) => d.id !== action.meta.arg,
          );
        }
      })
      .addCase(deleteEmployeeDocument.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEmployeeDocumentsState } =
  employeeDocumentsSlice.actions;

export default employeeDocumentsSlice.reducer;
