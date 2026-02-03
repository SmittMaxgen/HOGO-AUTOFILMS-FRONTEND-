export const selectEmployeePersonalDetails = (state) =>
  state.employeePersonalDetails.list;

export const selectEmployeePersonalDetailsLoading = (state) =>
  state.employeePersonalDetails.loading;

export const selectCreateEmployeePersonalDetailsLoading = (state) =>
  state.employeePersonalDetails.createLoading;

export const selectUpdateEmployeePersonalDetailsLoading = (state) =>
  state.employeePersonalDetails.updateLoading;

export const selectDeleteEmployeePersonalDetailsLoading = (state) =>
  state.employeePersonalDetails.deleteLoading;

export const selectEmployeePersonalDetailsError = (state) =>
  state.employeePersonalDetails.error;

export const selectEmployeePersonalDetailsSuccess = (state) =>
  state.employeePersonalDetails.success;
