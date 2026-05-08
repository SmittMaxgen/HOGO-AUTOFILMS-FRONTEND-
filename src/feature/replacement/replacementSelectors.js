export const selectReplacementList = (state) => state.replacement.replacements;

export const selectReplacementLoading = (state) => state.replacement.loading;

export const selectReplacementError = (state) => state.replacement.error;

export const selectReplacementCreateLoading = (state) =>
  state.replacement.createLoading;

export const selectReplacementCreateError = (state) =>
  state.replacement.createError;

export const selectReplacementCreateSuccess = (state) =>
  state.replacement.createSuccess;

export const selectReplacementUpdateLoading = (state) =>
  state.replacement.updateLoading;

export const selectReplacementUpdateError = (state) =>
  state.replacement.updateError;

export const selectReplacementUpdateSuccess = (state) =>
  state.replacement.updateSuccess;

export const selectReplacementDeleteLoading = (state) =>
  state.replacement.deleteLoading;

export const selectReplacementDeleteError = (state) =>
  state.replacement.deleteError;

export const selectReplacementDeleteSuccess = (state) =>
  state.replacement.deleteSuccess;
