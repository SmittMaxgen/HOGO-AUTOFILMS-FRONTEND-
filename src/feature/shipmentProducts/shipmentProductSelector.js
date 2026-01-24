export const selectShipmentProductState = (state) => state.shipmentProduct;

export const selectShipmentProducts = (state) => state.shipmentProduct.list;

export const selectShipmentProductCount = (state) =>
  state.shipmentProduct.count;

export const selectShipmentProductLoading = (state) =>
  state.shipmentProduct.loading;

export const selectShipmentProductError = (state) =>
  state.shipmentProduct.error;

export const selectCreateShipmentProductLoading = (state) =>
  state.shipmentProduct.createLoading;

export const selectCreateShipmentProductSuccess = (state) =>
  state.shipmentProduct.createSuccess;

export const selectUpdateShipmentProductLoading = (state) =>
  state.shipmentProduct.updateLoading;

export const selectUpdateShipmentProductSuccess = (state) =>
  state.shipmentProduct.updateSuccess;

export const selectDeleteShipmentProductLoading = (state) =>
  state.shipmentProduct.deleteLoading;

export const selectProductsByShipmentId = (shipmentId) => (state) =>
  state.shipmentProduct.list.filter(
    (item) => Number(item.shipment_id) === Number(shipmentId),
  );

export const selectShipmentProductById = (id) => (state) =>
  state.shipmentProduct.list.find((item) => item.id === id);

export const selectShipmentProductOptions = (state) =>
  state.shipmentProduct.list.map((item) => ({
    label: item.product_name || `Product #${item.product_id}`,
    value: item.product_id,
  }));
