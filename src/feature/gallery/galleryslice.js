import { createSlice } from "@reduxjs/toolkit";
import {
  createGallery,
  deleteGallery,
  getGalleries,
  updateGallery,
} from "./gallerythunks.js";

const initialState = {
  list: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  success: false,
  error: null,
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    clearGalleryState: (state) => {
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
      // ⏳ GET GALLERIES PENDING
      .addCase(getGalleries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // ✅ GET GALLERIES FULFILLED
      .addCase(getGalleries.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
      })
      // ❌ GET GALLERIES REJECTED
      .addCase(getGalleries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ⏳ CREATE GALLERY PENDING
      .addCase(createGallery.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.success = false;
      })
      // ✅ CREATE GALLERY FULFILLED
      .addCase(createGallery.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        if (action.payload?.data) {
          state.list.unshift(action.payload.data); // add new gallery item at top
        }
      })
      // ❌ CREATE GALLERY REJECTED
      .addCase(createGallery.rejected, (state, action) => {
        state.createLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ⏳ UPDATE GALLERY PENDING
      .addCase(updateGallery.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.success = false;
      })
      // ✅ UPDATE GALLERY FULFILLED
      .addCase(updateGallery.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;
        if (action.payload?.data) {
          // Replace the updated gallery item in list
          const index = state.list.findIndex(
            (g) => g.id === action.payload.data.id,
          );
          if (index !== -1) {
            state.list[index] = action.payload.data;
          }
        }
      })
      // ❌ UPDATE GALLERY REJECTED
      .addCase(updateGallery.rejected, (state, action) => {
        state.updateLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ⏳ DELETE GALLERY PENDING
      .addCase(deleteGallery.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      // ✅ DELETE GALLERY FULFILLED
      .addCase(deleteGallery.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // Remove deleted gallery item from list using the id passed as payload
        if (action.meta.arg) {
          state.list = state.list.filter((g) => g.id !== action.meta.arg);
        }
      })
      // ❌ DELETE GALLERY REJECTED
      .addCase(deleteGallery.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGalleryState } = gallerySlice.actions;
export default gallerySlice.reducer;
