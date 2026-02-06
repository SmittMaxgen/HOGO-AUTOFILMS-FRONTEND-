export const selectPurchaseOrders = (state) =>
  state.purchaseOrder.purchaseOrders;

export const selectPurchaseOrderLoading = (state) =>
  state.purchaseOrder.loading;

export const selectPurchaseOrderError = (state) =>
  state.purchaseOrder.error;

export const selectCreatePurchaseOrderLoading = (state) =>
  state.purchaseOrder.createLoading;

export const selectCreatePurchaseOrderSuccess = (state) =>
  state.purchaseOrder.createSuccess;

export const selectUpdatePurchaseOrderLoading = (state) =>
  state.purchaseOrder.updateLoading;

export const selectUpdatePurchaseOrderSuccess = (state) =>
  state.purchaseOrder.updateSuccess;

export const selectDeletePurchaseOrderLoading = (state) =>
  state.purchaseOrder.deleteLoading;

export const selectDeletePurchaseOrderSuccess = (state) =>
  state.purchaseOrder.deleteSuccess;
