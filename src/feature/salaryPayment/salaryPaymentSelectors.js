// ─── Base Selector ─────────────────────────────
export const selectSalaryPaymentState = (state) => state.salaryPayments;

// ─── All Salary Payments ───────────────────────
export const selectSalaryPayments = (state) =>
  state.salaryPayments.salaryPayments;

// ─── Loading ───────────────────────────────────
export const selectSalaryPaymentsLoading = (state) =>
  state.salaryPayments.loading;

// ─── Create ────────────────────────────────────
export const selectCreateSalaryPaymentLoading = (state) =>
  state.salaryPayments.createLoading;

export const selectCreateSalaryPaymentSuccess = (state) =>
  state.salaryPayments.createSuccess;

// ─── Update ────────────────────────────────────
export const selectUpdateSalaryPaymentLoading = (state) =>
  state.salaryPayments.updateLoading;

export const selectUpdateSalaryPaymentSuccess = (state) =>
  state.salaryPayments.updateSuccess;

// ─── Delete ────────────────────────────────────
export const selectDeleteSalaryPaymentLoading = (state) =>
  state.salaryPayments.deleteLoading;

// ─── Error ─────────────────────────────────────
export const selectSalaryPaymentError = (state) => state.salaryPayments.error;
