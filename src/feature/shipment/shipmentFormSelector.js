// ─── List ────────────────────────────────────────────────────────────────────
export const selectShipmentFormList = (state) => state.shipmentForm.list;

// ─── Loading States ───────────────────────────────────────────────────────────
export const selectShipmentFormLoading = (state) => state.shipmentForm.loading;
export const selectCreateShipmentFormLoading = (state) =>
  state.shipmentForm.createLoading;
export const selectUpdateShipmentFormLoading = (state) =>
  state.shipmentForm.updateLoading;
export const selectDeleteShipmentFormLoading = (state) =>
  state.shipmentForm.deleteLoading;

// ─── Status ───────────────────────────────────────────────────────────────────
export const selectShipmentFormError = (state) => state.shipmentForm.error;
export const selectShipmentFormSuccess = (state) => state.shipmentForm.success;
