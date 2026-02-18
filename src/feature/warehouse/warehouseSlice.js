import { createSlice } from "@reduxjs/toolkit";
import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "./warehouseThunks";

const initialState = {
  list: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  success: false,
  error: null,
};

const warehouseSlice = createSlice({
  name: "warehouse",
  initialState,
  reducers: {
    clearWarehouseState: (state) => {
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

      // ======================
      // GET WAREHOUSES
      // ======================
      .addCase(getWarehouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWarehouses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || action.payload || [];
      })
      .addCase(getWarehouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // CREATE WAREHOUSE
      // ======================
      .addCase(createWarehouse.pending, (state) => {
        state.createLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createWarehouse.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;

        if (action.payload?.data) {
          state.list.unshift(action.payload.data);
        } else {
          state.list.unshift(action.payload);
        }
      })
      .addCase(createWarehouse.rejected, (state, action) => {
        state.createLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ======================
      // UPDATE WAREHOUSE
      // ======================
      .addCase(updateWarehouse.pending, (state) => {
        state.updateLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateWarehouse.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;

        const updatedData = action.payload?.data || action.payload;

        const index = state.list.findIndex(
          (item) => item.id === updatedData.id,
        );

        if (index !== -1) {
          state.list[index] = updatedData;
        }
      })
      .addCase(updateWarehouse.rejected, (state, action) => {
        state.updateLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ======================
      // DELETE WAREHOUSE
      // ======================
      .addCase(deleteWarehouse.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteWarehouse.fulfilled, (state, action) => {
        state.deleteLoading = false;

        const deletedId = action.meta.arg;

        state.list = state.list.filter((item) => item.id !== deletedId);
      })
      .addCase(deleteWarehouse.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWarehouseState } = warehouseSlice.actions;
export default warehouseSlice.reducer;
