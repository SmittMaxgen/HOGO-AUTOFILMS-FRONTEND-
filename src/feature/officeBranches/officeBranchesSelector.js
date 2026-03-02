// officeBranchSelector.js

export const selectOfficeBranches = (state) => state.officeBranch.list;

export const selectOfficeBranchLoading = (state) => state.officeBranch.loading;

export const selectCreateOfficeBranchLoading = (state) =>
  state.officeBranch.createLoading;

export const selectUpdateOfficeBranchLoading = (state) =>
  state.officeBranch.updateLoading;

export const selectDeleteOfficeBranchLoading = (state) =>
  state.officeBranch.deleteLoading;

export const selectOfficeBranchError = (state) => state.officeBranch.error;

export const selectOfficeBranchSuccess = (state) => state.officeBranch.success;

export const selectOfficeBranchCount = (state) => state.officeBranch.count;
