export const selectCostState = (state) => state.cost;

export const selectCostList = (state) => state.cost.list;

export const selectCostCount = (state) => state.cost.count;

export const selectCostLoading = (state) => state.cost.loading;

export const selectCostError = (state) => state.cost.error;

export const selectCostsByShipmentId = (shipmentId) => (state) =>
  state.cost.list.filter(
    (item) => Number(item.shipment_id) === Number(shipmentId),
  );

export const selectCostById = (id) => (state) =>
  state.cost.list.find((item) => item.id === id);
