export const selectLeads = (state) => state.leads.leads;
export const selectLeadsLoading = (state) => state.leads.loading;

export const selectCreateLeadLoading = (state) =>
  state.leads.createLoading;
export const selectCreateLeadSuccess = (state) =>
  state.leads.createSuccess;

export const selectUpdateLeadLoading = (state) =>
  state.leads.updateLoading;
export const selectUpdateLeadSuccess = (state) =>
  state.leads.updateSuccess;

export const selectDeleteLeadLoading = (state) =>
  state.leads.deleteLoading;

export const selectLeadError = (state) => state.leads.error;
