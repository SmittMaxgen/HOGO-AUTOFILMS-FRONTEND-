// ─── List ────────────────────────────────────────────────────────────────────
export const selectGalleries = (state) => state.gallery.list;

// ─── Loading States ───────────────────────────────────────────────────────────
export const selectGalleryLoading = (state) => state.gallery.loading;
export const selectCreateGalleryLoading = (state) =>
  state.gallery.createLoading;
export const selectUpdateGalleryLoading = (state) =>
  state.gallery.updateLoading;
export const selectDeleteGalleryLoading = (state) =>
  state.gallery.deleteLoading;

// ─── Status ───────────────────────────────────────────────────────────────────
export const selectGalleryError = (state) => state.gallery.error;
export const selectGallerySuccess = (state) => state.gallery.success;
