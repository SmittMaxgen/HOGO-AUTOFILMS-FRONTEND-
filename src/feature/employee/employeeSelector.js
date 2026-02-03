export const selectEmployees = (state) => state.employee.list;

export const selectEmployeeLoading = (state) => state.employee.loading;
export const selectCreateEmployeeLoading = (state) =>
  state.employee.createLoading;
export const selectUpdateEmployeeLoading = (state) =>
  state.employee.updateLoading;
export const selectDeleteEmployeeLoading = (state) =>
  state.employee.deleteLoading;

export const selectEmployeeError = (state) => state.employee.error;
export const selectEmployeeSuccess = (state) => state.employee.success;
