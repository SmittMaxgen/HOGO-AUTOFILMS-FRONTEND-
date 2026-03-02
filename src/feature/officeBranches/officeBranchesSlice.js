// officeBranchSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  getOfficeBranches,
  createOfficeBranch,
  updateOfficeBranch,
  deleteOfficeBranch,
} from "./officeBranchesThunks";

const initialState = {
  list: [],
  count: 0,
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  success: false,
  error: null,
};

const officeBranchSlice = createSlice({
  name: "officeBranch",
  initialState,
  reducers: {
    clearOfficeBranchState: (state) => {
      state.list = [];
      state.count = 0;
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

      // ========================
      // GET
      // ========================
      .addCase(getOfficeBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOfficeBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
        state.count = action.payload?.count || 0;
      })
      .addCase(getOfficeBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================
      // CREATE
      // ========================
      .addCase(createOfficeBranch.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOfficeBranch.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;

        if (action.payload?.data) {
          state.list.unshift(action.payload.data);
          state.count += 1;
        }
      })
      .addCase(createOfficeBranch.rejected, (state, action) => {
        state.createLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ========================
      // UPDATE
      // ========================
      .addCase(updateOfficeBranch.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateOfficeBranch.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;

        if (action.payload?.data) {
          const index = state.list.findIndex(
            (branch) => branch.id === action.payload.data.id,
          );

          if (index !== -1) {
            state.list[index] = action.payload.data;
          }
        }
      })
      .addCase(updateOfficeBranch.rejected, (state, action) => {
        state.updateLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ========================
      // DELETE
      // ========================
      .addCase(deleteOfficeBranch.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteOfficeBranch.fulfilled, (state, action) => {
        state.deleteLoading = false;

        if (action.meta.arg) {
          state.list = state.list.filter(
            (branch) => branch.id !== action.meta.arg,
          );
          state.count -= 1;
        }
      })
      .addCase(deleteOfficeBranch.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOfficeBranchState } = officeBranchSlice.actions;

export default officeBranchSlice.reducer;
