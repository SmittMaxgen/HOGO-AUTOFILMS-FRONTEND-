export const selectInventorySerials = (state) =>
  state.inventorySerial.list;

export const selectInventorySerialLoading = (state) =>
  state.inventorySerial.loading;

export const selectCreateInventorySerialLoading = (state) =>
  state.inventorySerial.createLoading;

export const selectUpdateInventorySerialLoading = (state) =>
  state.inventorySerial.updateLoading;

export const selectDeleteInventorySerialLoading = (state) =>
  state.inventorySerial.deleteLoading;

export const selectInventorySerialError = (state) =>
  state.inventorySerial.error;

export const selectInventorySerialSuccess = (state) =>
  state.inventorySerial.success;
