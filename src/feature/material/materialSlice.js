import { createSlice } from "@reduxjs/toolkit";
import {
  createMaterials,
  deleteMaterials,
  getMaterials,
  updateMaterials,
} from "./materialThunks";

const initialState = {
  list: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  success: false,
  error: null,
};

const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {
    clearMaterialState: (state) => {
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
      // ⏳ Pending
      .addCase(getMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ✅ Fulfilled
      .addCase(getMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
      })

      // ❌ Rejected
      .addCase(getMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ⏳ CREATE MATERIALS PENDING
      .addCase(createMaterials.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.success = false;
      })
      // ✅ CREATE MATERIALS FULFILLED
      .addCase(createMaterials.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        if (action.payload?.data) {
          state.list.unshift(action.payload.data); // add new material at top
        }
      })
      // ❌ CREATE MATERIALS REJECTED
      .addCase(createMaterials.rejected, (state, action) => {
        state.createLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      .addCase(updateMaterials.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateMaterials.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;
        if (action.payload?.data) {
          // Replace the updated material in list
          const index = state.list.findIndex(
            (m) => m.id === action.payload.data.id,
          );
          if (index !== -1) {
            state.list[index] = action.payload.data;
          }
        }
      })
      .addCase(updateMaterials.rejected, (state, action) => {
        state.updateLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // DELETE MATERIALS
      .addCase(deleteMaterials.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteMaterials.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // remove deleted material from list
        if (action.meta.arg?.id) {
          state.list = state.list.filter((m) => m.id !== action.meta.arg.id);
        }
      })
      .addCase(deleteMaterials.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMaterialState } = materialSlice.actions;
export default materialSlice.reducer;
