import { createSlice } from "@reduxjs/toolkit";
import {
  createShipment,
  deleteShipment,
  getShipments,
  updateShipment,
} from "./shipmentFormThunks";

const initialState = {
  list: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  success: false,
  error: null,
};

const shipmentSlice = createSlice({
  name: "shipment",
  initialState,
  reducers: {
    clearShipmentState: (state) => {
      state.list = [];
      state.loading = false;
      state.createLoading = false;
      state.updateLoading = false;
      state.deleteLoading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ⏳ GET SHIPMENTS PENDING
      .addCase(getShipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // ✅ GET SHIPMENTS FULFILLED
      .addCase(getShipments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
      })
      // ❌ GET SHIPMENTS REJECTED
      .addCase(getShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ⏳ CREATE SHIPMENT PENDING
      .addCase(createShipment.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.success = false;
      })
      // ✅ CREATE SHIPMENT FULFILLED
      .addCase(createShipment.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        if (action.payload?.data) {
          state.list.unshift(action.payload.data); // add new shipment at top
        }
      })
      // ❌ CREATE SHIPMENT REJECTED
      .addCase(createShipment.rejected, (state, action) => {
        state.createLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ⏳ UPDATE SHIPMENT PENDING
      .addCase(updateShipment.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.success = false;
      })
      // ✅ UPDATE SHIPMENT FULFILLED
      .addCase(updateShipment.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;
        if (action.payload?.data) {
          // Replace the updated shipment in list
          const index = state.list.findIndex(
            (s) => s.id === action.payload.data.id,
          );
          if (index !== -1) {
            state.list[index] = action.payload.data;
          }
        }
      })
      // ❌ UPDATE SHIPMENT REJECTED
      .addCase(updateShipment.rejected, (state, action) => {
        state.updateLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ⏳ DELETE SHIPMENT PENDING
      .addCase(deleteShipment.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      // ✅ DELETE SHIPMENT FULFILLED
      .addCase(deleteShipment.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // Remove deleted shipment from list using the id passed as payload
        if (action.meta.arg) {
          state.list = state.list.filter((s) => s.id !== action.meta.arg);
        }
      })
      // ❌ DELETE SHIPMENT REJECTED
      .addCase(deleteShipment.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearShipmentState } = shipmentSlice.actions;
export default shipmentSlice.reducer;
