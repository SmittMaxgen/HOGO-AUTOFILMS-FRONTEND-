import { createSlice } from "@reduxjs/toolkit";
import {
  getShipments,
  createShipment,
  updateShipment,
  deleteShipment,
} from "./shipmentThunks";

const initialState = {
  list: [],
  count: 0,
  loading: false,
  error: null,
};

const shipmentSlice = createSlice({
  name: "shipment",
  initialState,
  reducers: {
    clearShipmentError: (state) => {
      state.error = null;
    },
    resetShipmentState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getShipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShipments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
        state.count = action.payload?.count || 0;
      })
      .addCase(getShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShipment.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.list.push(action.payload.data);
          state.count += 1;
        }
      })
      .addCase(createShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShipment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedShipment = action.payload?.data;
        if (updatedShipment) {
          const index = state.list.findIndex(
            (item) => item.id === updatedShipment.id,
          );
          if (index !== -1) {
            state.list[index] = updatedShipment;
          }
        }
      })
      .addCase(updateShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShipment.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;
        state.list = state.list.filter((item) => item.id !== deletedId);
        state.count = state.count > 0 ? state.count - 1 : 0;
      })
      .addCase(deleteShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearShipmentError, resetShipmentState } = shipmentSlice.actions;

export default shipmentSlice.reducer;
