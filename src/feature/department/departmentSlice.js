import { createSlice } from "@reduxjs/toolkit";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "./departmentThunks";

const initialState = {
  list: [],
  count: 0,
  loading: false,
  error: null,
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    clearDepartmentError: (state) => {
      state.error = null;
    },
    resetDepartmentState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
        state.count = action.payload?.count || 0;
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.list.push(action.payload.data);
          state.count += 1;
        }
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedDepartment = action.payload?.data;
        if (updatedDepartment) {
          const index = state.list.findIndex(
            (item) => item.id === updatedDepartment.id,
          );
          if (index !== -1) {
            state.list[index] = updatedDepartment;
          }
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;
        state.list = state.list.filter((item) => item.id !== deletedId);
        state.count = state.count > 0 ? state.count - 1 : 0;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDepartmentError, resetDepartmentState } =
  departmentSlice.actions;

export default departmentSlice.reducer;
