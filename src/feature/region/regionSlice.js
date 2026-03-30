import { createSlice } from "@reduxjs/toolkit";
import {
  getRegions,
  createRegion,
  updateRegion,
  deleteRegion,
} from "./regionThunks";

const initialState = {
  list: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  success: false,
  error: null,
};

const regionSlice = createSlice({
  name: "region",
  initialState,
  reducers: {
    clearRegionState: (state) => {
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
      // ─── GET ───────────────────────────────────────────
      .addCase(getRegions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRegions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || action.payload || [];
      })
      .addCase(getRegions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── CREATE ────────────────────────────────────────
      .addCase(createRegion.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createRegion.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        const newItem = action.payload?.data || action.payload;
        if (newItem) state.list.unshift(newItem);
      })
      .addCase(createRegion.rejected, (state, action) => {
        state.createLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ─── UPDATE ────────────────────────────────────────
      .addCase(updateRegion.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateRegion.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;
        const updated = action.payload?.data || action.payload;
        if (updated) {
          const index = state.list.findIndex((r) => r.id === updated.id);
          if (index !== -1) state.list[index] = updated;
        }
      })
      .addCase(updateRegion.rejected, (state, action) => {
        state.updateLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ─── DELETE ────────────────────────────────────────
      .addCase(deleteRegion.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteRegion.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const deletedId = action.meta.arg;
        if (deletedId) {
          state.list = state.list.filter((r) => r.id !== deletedId);
        }
      })
      .addCase(deleteRegion.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRegionState } = regionSlice.actions;
export default regionSlice.reducer;
