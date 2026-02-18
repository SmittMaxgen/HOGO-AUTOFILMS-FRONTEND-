export const selectLocations = (state) => state.location.list;

export const selectLocationLoading = (state) => state.location.loading;

export const selectCreateLocationLoading = (state) =>
  state.location.createLoading;

export const selectUpdateLocationLoading = (state) =>
  state.location.updateLoading;

export const selectDeleteLocationLoading = (state) =>
  state.location.deleteLoading;

export const selectLocationError = (state) => state.location.error;

export const selectLocationSuccess = (state) => state.location.success;
