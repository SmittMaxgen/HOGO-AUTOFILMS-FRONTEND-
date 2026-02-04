export const selectDepartmentState = (state) => state.department;

export const selectDepartmentList = (state) => state.department.list;

export const selectDepartmentCount = (state) => state.department.count;

export const selectDepartmentLoading = (state) => state.department.loading;

export const selectDepartmentError = (state) => state.department.error;

export const selectDepartmentById = (id) => (state) =>
  state.department.list.find((item) => item.id === id);
