export const selectWarehouses = (state) => state.warehouse.list;

export const selectWarehouseLoading = (state) => state.warehouse.loading;

export const selectCreateWarehouseLoading = (state) =>
  state.warehouse.createLoading;

export const selectUpdateWarehouseLoading = (state) =>
  state.warehouse.updateLoading;

export const selectDeleteWarehouseLoading = (state) =>
  state.warehouse.deleteLoading;

export const selectWarehouseError = (state) => state.warehouse.error;

export const selectWarehouseSuccess = (state) => state.warehouse.success;
