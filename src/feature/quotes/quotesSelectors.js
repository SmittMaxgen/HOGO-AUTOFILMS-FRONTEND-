// ─── List & Loading ─────────────────────────────────────────────
export const selectQuotes = (state) => state.quotes.quotes;
export const selectQuotesLoading = (state) => state.quotes.loading;

// ─── Create ──────────────────────────────────────────────────────
export const selectCreateQuoteLoading = (state) => state.quotes.createLoading;
export const selectCreateQuoteSuccess = (state) => state.quotes.createSuccess;

// ─── Update ──────────────────────────────────────────────────────
export const selectUpdateQuoteLoading = (state) => state.quotes.updateLoading;
export const selectUpdateQuoteSuccess = (state) => state.quotes.updateSuccess;

// ─── Delete ──────────────────────────────────────────────────────
export const selectDeleteQuoteLoading = (state) => state.quotes.deleteLoading;

// ─── Error ───────────────────────────────────────────────────────
export const selectQuoteError = (state) => state.quotes.error;

// ─── Derived / Filtered ──────────────────────────────────────────
export const selectQuotesByService = (service) => (state) =>
  state.quotes.quotes.filter((q) => q.service === service);

export const selectQuoteById = (id) => (state) =>
  state.quotes.quotes.find((q) => q.id === id);
