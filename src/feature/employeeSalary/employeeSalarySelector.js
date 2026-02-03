export const selectEmployeeSalaries = (state) =>
  state.employeeSalary.list;

export const selectEmployeeSalaryLoading = (state) =>
  state.employeeSalary.loading;

export const selectCreateEmployeeSalaryLoading = (state) =>
  state.employeeSalary.createLoading;

export const selectUpdateEmployeeSalaryLoading = (state) =>
  state.employeeSalary.updateLoading;

export const selectDeleteEmployeeSalaryLoading = (state) =>
  state.employeeSalary.deleteLoading;

export const selectEmployeeSalaryError = (state) =>
  state.employeeSalary.error;

export const selectEmployeeSalarySuccess = (state) =>
  state.employeeSalary.success;
