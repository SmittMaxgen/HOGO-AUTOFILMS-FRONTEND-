export const selectRoleState = (state) => state.role;

export const selectRoleList = (state) => state.role.list;

export const selectRoleCount = (state) => state.role.count;

export const selectRoleLoading = (state) => state.role.loading;

export const selectRoleError = (state) => state.role.error;

export const selectRoleById = (id) => (state) =>
  state.role.list.find((item) => item.id === id);
