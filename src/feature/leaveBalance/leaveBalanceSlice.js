import { createSlice } from "@reduxjs/toolkit";
import {
  getLeaveBalances,
  createLeaveBalance,
  updateLeaveBalance,
  deleteLeaveBalance,
} from "./leaveBalanceThunks";

const initialState = {
  list: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  success: false,
  error: null,
};

const leaveBalanceSlice = createSlice({
  name: "leaveBalance",
  initialState,
  reducers: {
    clearLeaveBalanceState: (state) => {
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
      // ⏳ GET PENDING
      .addCase(getLeaveBalances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // ✅ GET FULFILLED
      .addCase(getLeaveBalances.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
      })
      // ❌ GET REJECTED
      .addCase(getLeaveBalances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ⏳ CREATE PENDING
      .addCase(createLeaveBalance.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.success = false;
      })
      // ✅ CREATE FULFILLED
      .addCase(createLeaveBalance.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        if (action.payload?.data) {
          state.list.unshift(action.payload.data);
        }
      })
      // ❌ CREATE REJECTED
      .addCase(createLeaveBalance.rejected, (state, action) => {
        state.createLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ⏳ UPDATE PENDING
      .addCase(updateLeaveBalance.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.success = false;
      })
      // ✅ UPDATE FULFILLED
      .addCase(updateLeaveBalance.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;
        if (action.payload?.data) {
          const index = state.list.findIndex(
            (lb) => lb.id === action.payload.data.id,
          );
          if (index !== -1) {
            state.list[index] = action.payload.data;
          }
        }
      })
      // ❌ UPDATE REJECTED
      .addCase(updateLeaveBalance.rejected, (state, action) => {
        state.updateLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ⏳ DELETE PENDING
      .addCase(deleteLeaveBalance.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      // ✅ DELETE FULFILLED
      .addCase(deleteLeaveBalance.fulfilled, (state, action) => {
        state.deleteLoading = false;
        if (action.meta.arg) {
          state.list = state.list.filter((lb) => lb.id !== action.meta.arg);
        }
      })
      // ❌ DELETE REJECTED
      .addCase(deleteLeaveBalance.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLeaveBalanceState } = leaveBalanceSlice.actions;
export default leaveBalanceSlice.reducer;
