import { createSlice } from "@reduxjs/toolkit";
import {
  getShipmentProducts,
  createShipmentProduct,
  updateShipmentProduct,
  deleteShipmentProduct,
} from "./shipmentProductThunks";

const initialState = {
  list: [],
  count: 0,
  loading: false,
  error: null,

  createLoading: false,
  createSuccess: false,

  updateLoading: false,
  updateSuccess: false,

  deleteLoading: false,
};

const shipmentProductSlice = createSlice({
  name: "shipmentProduct",
  initialState,
  reducers: {
    clearShipmentProductError: (state) => {
      state.error = null;
    },
    resetShipmentProductState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getShipmentProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShipmentProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
        state.count = action.payload?.count || 0;
      })
      .addCase(getShipmentProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createShipmentProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShipmentProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.list.push(action.payload.data);
          state.count += 1;
        }
      })
      .addCase(createShipmentProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateShipmentProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShipmentProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload?.data;
        if (updatedItem) {
          const index = state.list.findIndex(
            (item) => item.id === updatedItem.id,
          );
          if (index !== -1) {
            state.list[index] = updatedItem;
          }
        }
      })
      .addCase(updateShipmentProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteShipmentProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShipmentProduct.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;
        state.list = state.list.filter((item) => item.id !== deletedId);
        state.count = state.count > 0 ? state.count - 1 : 0;
      })
      .addCase(deleteShipmentProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearShipmentProductError, resetShipmentProductState } =
  shipmentProductSlice.actions;

export default shipmentProductSlice.reducer;
