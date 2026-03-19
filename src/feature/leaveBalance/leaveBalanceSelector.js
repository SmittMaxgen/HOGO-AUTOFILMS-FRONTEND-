export const selectLeaveBalances = (state) => state.leaveBalance.list;
export const selectLeaveBalanceLoading = (state) => state.leaveBalance.loading;
export const selectCreateLeaveBalanceLoading = (state) =>
  state.leaveBalance.createLoading;
export const selectUpdateLeaveBalanceLoading = (state) =>
  state.leaveBalance.updateLoading;
export const selectDeleteLeaveBalanceLoading = (state) =>
  state.leaveBalance.deleteLoading;
export const selectLeaveBalanceError = (state) => state.leaveBalance.error;
export const selectLeaveBalanceSuccess = (state) => state.leaveBalance.success;
