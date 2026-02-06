import { createSlice } from "@reduxjs/toolkit";
import {
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
} from "./purchaseOrderThunks";

const initialState = {
  purchaseOrders: [],
  loading: false,
  error: null,

  createLoading: false,
  createSuccess: false,

  updateLoading: false,
  updateSuccess: false,

  deleteLoading: false,
  deleteSuccess: false,
};

const purchaseOrderSlice = createSlice({
  name: "purchaseOrder",
  initialState,
  reducers: {
    clearPurchaseOrderState: (state) => {
      state.purchaseOrders = [];
      state.loading = false;
      state.error = null;

      state.createLoading = false;
      state.createSuccess = false;

      state.updateLoading = false;
      state.updateSuccess = false;

      state.deleteLoading = false;
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= GET =================
      .addCase(getPurchaseOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrders = action.payload?.data || [];
      })
      .addCase(getPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= CREATE =================
      .addCase(createPurchaseOrder.pending, (state) => {
        state.createLoading = true;
        state.createSuccess = false;
        state.error = null;
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        if (action.payload?.data) {
          state.purchaseOrders.unshift(action.payload.data);
        }
      })
      .addCase(createPurchaseOrder.rejected, (state, action) => {
        state.createLoading = false;
        state.createSuccess = false;
        state.error = action.payload;
      })

      // ================= UPDATE =================
      .addCase(updatePurchaseOrder.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
        state.error = null;
      })
      .addCase(updatePurchaseOrder.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;

        if (action.payload?.data) {
          const index = state.purchaseOrders.findIndex(
            (po) => po.id === action.payload.data.id,
          );
          if (index !== -1) {
            state.purchaseOrders[index] = action.payload.data;
          }
        }
      })
      .addCase(updatePurchaseOrder.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = false;
        state.error = action.payload;
      })

      // ================= DELETE =================
      .addCase(deletePurchaseOrder.pending, (state) => {
        state.deleteLoading = true;
        state.deleteSuccess = false;
        state.error = null;
      })
      .addCase(deletePurchaseOrder.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;

        const deletedId = action.meta.arg;
        state.purchaseOrders = state.purchaseOrders.filter(
          (po) => po.id !== deletedId,
        );
      })
      .addCase(deletePurchaseOrder.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = false;
        state.error = action.payload;
      });
  },
});

export const { clearPurchaseOrderState } = purchaseOrderSlice.actions;
export default purchaseOrderSlice.reducer;
