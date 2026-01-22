import { createSlice } from "@reduxjs/toolkit";
import { getBanners, updateBanner, deleteBanner } from "./bannerThunks";

const initialState = {
  banners: [],
  loading: false,
  updateLoading: false, // loading state for update
  updateError: null,
  updateSuccess: false,
  deleteLoading: false, // loading state for delete
  deleteError: null,
  deleteSuccess: false,
  error: null,
};

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    clearBannerState: (state) => {
      state.banners = [];
      state.loading = false;
      state.error = null;
    },
    clearUpdateState: (state) => {
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = false;
    },
    clearDeleteState: (state) => {
      state.deleteLoading = false;
      state.deleteError = null;
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET BANNERS
      .addCase(getBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload?.data || [];
      })
      .addCase(getBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateBanner.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        // update the specific banner in the list
        const index = state.banners.findIndex(
          (b) => b.id === action.payload?.data?.id,
        );
        if (index !== -1) {
          state.banners[index] = action.payload.data;
        }
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
      })

      // DELETE BANNER
      .addCase(deleteBanner.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        // Remove the deleted banner from list
        state.banners = state.banners.filter(
          (banner) => banner.id !== action.meta.arg,
        );
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
        state.deleteSuccess = false;
      });
  },
});

export const { clearBannerState, clearUpdateState, clearDeleteState } =
  bannerSlice.actions;
export default bannerSlice.reducer;
