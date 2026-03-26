// export const selectEmployeeAttendances = (state) =>
//   state.employeeAttendance.list;
// export const selectEmployeeAttendanceCount = (state) =>
//   state.employeeAttendance.count;
// export const selectEmployeeAttendanceLoading = (state) =>
//   state.employeeAttendance.loading;
// export const selectCreateEmployeeAttendanceLoading = (state) =>
//   state.employeeAttendance.createLoading;
// export const selectUpdateEmployeeAttendanceLoading = (state) =>
//   state.employeeAttendance.updateLoading;
// export const selectDeleteEmployeeAttendanceLoading = (state) =>
//   state.employeeAttendance.deleteLoading;
// export const selectEmployeeAttendanceError = (state) =>
//   state.employeeAttendance.error;
// export const selectEmployeeAttendanceSuccess = (state) =>
//   state.employeeAttendance.success;
// employeeAttendanceSelector.js
// All selectors read from state.employeeAttendance
// Make sure your store has:  employeeAttendance: employeeAttendanceReducer

export const selectEmployeeAttendances = (state) =>
  state.employeeAttendance.list;

export const selectEmployeeAttendanceCount = (state) =>
  state.employeeAttendance.count;

export const selectEmployeeAttendanceLoading = (state) =>
  state.employeeAttendance.loading;

export const selectCreateEmployeeAttendanceLoading = (state) =>
  state.employeeAttendance.createLoading;

export const selectUpdateEmployeeAttendanceLoading = (state) =>
  state.employeeAttendance.updateLoading;

export const selectDeleteEmployeeAttendanceLoading = (state) =>
  state.employeeAttendance.deleteLoading;

export const selectEmployeeAttendanceError = (state) =>
  state.employeeAttendance.error;

export const selectEmployeeAttendanceSuccess = (state) =>
  state.employeeAttendance.success;
