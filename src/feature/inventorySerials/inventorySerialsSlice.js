import { createSlice } from "@reduxjs/toolkit";
import {
  getInventorySerials,
  createInventorySerial,
  updateInventorySerial,
  deleteInventorySerial,
} from "./inventorySerialsThunks";

const initialState = {
  list: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  success: false,
  error: null,
};

const inventorySerialSlice = createSlice({
  name: "inventorySerial",
  initialState,
  reducers: {
    clearInventorySerialState: (state) => {
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
      // ================= GET =================
      .addCase(getInventorySerials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInventorySerials.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
      })
      .addCase(getInventorySerials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= CREATE =================
      .addCase(createInventorySerial.pending, (state) => {
        state.createLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createInventorySerial.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        if (action.payload?.data) {
          state.list.unshift(action.payload.data);
        }
      })
      .addCase(createInventorySerial.rejected, (state, action) => {
        state.createLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ================= UPDATE =================
      .addCase(updateInventorySerial.pending, (state) => {
        state.updateLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateInventorySerial.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;
        if (action.payload?.data) {
          const index = state.list.findIndex(
            (i) => i.id === action.payload.data.id,
          );
          if (index !== -1) {
            state.list[index] = action.payload.data;
          }
        }
      })
      .addCase(updateInventorySerial.rejected, (state, action) => {
        state.updateLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ================= DELETE =================
      .addCase(deleteInventorySerial.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteInventorySerial.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const deletedId = action.meta.arg;
        state.list = state.list.filter((i) => i.id !== deletedId);
      })
      .addCase(deleteInventorySerial.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInventorySerialState } = inventorySerialSlice.actions;

export default inventorySerialSlice.reducer;
