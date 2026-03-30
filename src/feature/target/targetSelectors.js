// ─────────────────────────────────────────────
// 1. DISTRIBUTOR TARGET SELECTORS
// ─────────────────────────────────────────────

export const selectDistributorTargets = (state) =>
  state.target.distributor.list;
export const selectDistributorTargetLoading = (state) =>
  state.target.distributor.loading;
export const selectCreateDistributorLoading = (state) =>
  state.target.distributor.createLoading;
export const selectUpdateDistributorLoading = (state) =>
  state.target.distributor.updateLoading;
export const selectDeleteDistributorLoading = (state) =>
  state.target.distributor.deleteLoading;
export const selectDistributorTargetError = (state) =>
  state.target.distributor.error;
export const selectDistributorTargetSuccess = (state) =>
  state.target.distributor.success;

// ─────────────────────────────────────────────
// 2. PRODUCT TARGET SELECTORS
// ─────────────────────────────────────────────

export const selectProductTargets = (state) => state.target.product.list;
export const selectProductTargetLoading = (state) =>
  state.target.product.loading;
export const selectCreateProductLoading = (state) =>
  state.target.product.createLoading;
export const selectUpdateProductLoading = (state) =>
  state.target.product.updateLoading;
export const selectDeleteProductLoading = (state) =>
  state.target.product.deleteLoading;
export const selectProductTargetError = (state) => state.target.product.error;
export const selectProductTargetSuccess = (state) =>
  state.target.product.success;

// ─────────────────────────────────────────────
// 3. CATEGORY TARGET SELECTORS
// ─────────────────────────────────────────────

export const selectCategoryTargets = (state) => state.target.category.list;
export const selectCategoryTargetLoading = (state) =>
  state.target.category.loading;
export const selectCreateCategoryLoading = (state) =>
  state.target.category.createLoading;
export const selectUpdateCategoryLoading = (state) =>
  state.target.category.updateLoading;
export const selectDeleteCategoryLoading = (state) =>
  state.target.category.deleteLoading;
export const selectCategoryTargetError = (state) => state.target.category.error;
export const selectCategoryTargetSuccess = (state) =>
  state.target.category.success;

// ─────────────────────────────────────────────
// 4. REGION TARGET SELECTORS
// ─────────────────────────────────────────────

export const selectRegionTargets = (state) => state.target.region.list;
export const selectRegionTargetLoading = (state) => state.target.region.loading;
export const selectCreateRegionLoading = (state) =>
  state.target.region.createLoading;
export const selectUpdateRegionLoading = (state) =>
  state.target.region.updateLoading;
export const selectDeleteRegionLoading = (state) =>
  state.target.region.deleteLoading;
export const selectRegionTargetError = (state) => state.target.region.error;
export const selectRegionTargetSuccess = (state) => state.target.region.success;
