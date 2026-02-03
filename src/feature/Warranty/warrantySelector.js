export const selectWarrantyState = (state) => state.warranty;

export const selectWarrantyList = (state) => state.warranty.warranties;

export const selectWarrantyCount = (state) => state.warranty.count;
export const selectWarrantyUpdateSuccess = (state) =>
  state.warranty.updateSuccess;

export const selectWarrantyLoading = (state) => state.warranty.loading;

export const selectWarrantyUpdateLoading = (state) =>
  state.warranty.updateLoading;

export const selectWarrantyError = (state) => state.warranty.error;

export const selectWarrantyById = (id) => (state) =>
  state.warranty.warranties.find((item) => item.id === id);

export const selectWarrantiesBySerialId = (serialId) => (state) =>
  state.warranty.warranties.filter(
    (item) => Number(item.serial_id) === Number(serialId),
  );
