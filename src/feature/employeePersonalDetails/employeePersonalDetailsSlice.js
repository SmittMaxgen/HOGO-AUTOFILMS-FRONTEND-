import { createSlice } from "@reduxjs/toolkit";
import {
  getEmployeePersonalDetails,
  createEmployeePersonalDetails,
  updateEmployeePersonalDetails,
  deleteEmployeePersonalDetails,
} from "./employeePersonalDetailsThunks";

const initialState = {
  list: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  success: false,
  error: null,
};

const employeePersonalDetailsSlice = createSlice({
  name: "employeePersonalDetails",
  initialState,
  reducers: {
    clearEmployeePersonalDetailsState: (state) => {
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
      // ===== GET DETAILS =====
      .addCase(getEmployeePersonalDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeePersonalDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
      })
      .addCase(getEmployeePersonalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== CREATE DETAILS =====
      .addCase(createEmployeePersonalDetails.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        createEmployeePersonalDetails.fulfilled,
        (state, action) => {
          state.createLoading = false;
          state.success = true;
          if (action.payload?.data) {
            state.list.unshift(action.payload.data);
          }
        },
      )
      .addCase(
        createEmployeePersonalDetails.rejected,
        (state, action) => {
          state.createLoading = false;
          state.success = false;
          state.error = action.payload;
        },
      )

      // ===== UPDATE DETAILS =====
      .addCase(updateEmployeePersonalDetails.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        updateEmployeePersonalDetails.fulfilled,
        (state, action) => {
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
        },
      )
      .addCase(
        updateEmployeePersonalDetails.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.success = false;
          state.error = action.payload;
        },
      )

      // ===== DELETE DETAILS =====
      .addCase(deleteEmployeePersonalDetails.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(
        deleteEmployeePersonalDetails.fulfilled,
        (state, action) => {
          state.deleteLoading = false;
          if (action.meta.arg) {
            state.list = state.list.filter(
              (d) => d.id !== action.meta.arg,
            );
          }
        },
      )
      .addCase(
        deleteEmployeePersonalDetails.rejected,
        (state, action) => {
          state.deleteLoading = false;
          state.error = action.payload;
        },
      );
  },
});

export const {
  clearEmployeePersonalDetailsState,
} = employeePersonalDetailsSlice.actions;

export default employeePersonalDetailsSlice.reducer;
