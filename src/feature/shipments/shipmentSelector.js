export const selectShipmentState = (state) => state.shipment;

export const selectShipments = (state) => state.shipment.list;

export const selectShipmentCount = (state) => state.shipment.count;

export const selectShipmentLoading = (state) => state.shipment.loading;

export const selectShipmentError = (state) => state.shipment.error;

export const selectShipmentById = (id) => (state) =>
  state.shipment.list.find((item) => item.id === id);

export const selectShipmentOptions = (state) =>
  state.shipment.list.map((item) => ({
    label: `${item.supplier_name} (${item.supplier_invoice_no})`,
    value: item.id,
  }));
