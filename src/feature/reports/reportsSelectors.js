// ─────────────────────────────────────────────
// 1. DISTRIBUTOR REPORT SELECTORS
// ─────────────────────────────────────────────

export const selectDistributorMonthlyData = (state) =>
  state.report.distributor.monthlyData;

export const selectDistributorReportLoading = (state) =>
  state.report.distributor.loadingCount > 0;

export const selectDistributorReportError = (state) =>
  state.report.distributor.error;

// ─────────────────────────────────────────────
// 2. PRODUCT REPORT SELECTORS
// ─────────────────────────────────────────────

export const selectProductMonthlyData = (state) =>
  state.report.product.monthlyData;

export const selectProductReportLoading = (state) =>
  state.report.product.loadingCount > 0;

export const selectProductReportError = (state) => state.report.product.error;

// ─────────────────────────────────────────────
// 3. CATEGORY REPORT SELECTORS
// ─────────────────────────────────────────────

export const selectCategoryMonthlyData = (state) =>
  state.report.category.monthlyData;

export const selectCategoryReportLoading = (state) =>
  state.report.category.loadingCount > 0;

export const selectCategoryReportError = (state) => state.report.category.error;

// ─────────────────────────────────────────────
// 4. REGION REPORT SELECTORS
// ─────────────────────────────────────────────

export const selectRegionMonthlyData = (state) =>
  state.report.region.monthlyData;

export const selectRegionReportLoading = (state) =>
  state.report.region.loadingCount > 0;

export const selectRegionReportError = (state) => state.report.region.error;
