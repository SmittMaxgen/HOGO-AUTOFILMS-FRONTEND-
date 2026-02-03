export const selectEmployeeDocuments = (state) =>
  state.employeeDocuments.list;

export const selectEmployeeDocumentsLoading = (state) =>
  state.employeeDocuments.loading;

export const selectCreateEmployeeDocumentLoading = (state) =>
  state.employeeDocuments.createLoading;

export const selectUpdateEmployeeDocumentLoading = (state) =>
  state.employeeDocuments.updateLoading;

export const selectDeleteEmployeeDocumentLoading = (state) =>
  state.employeeDocuments.deleteLoading;

export const selectEmployeeDocumentsError = (state) =>
  state.employeeDocuments.error;

export const selectEmployeeDocumentsSuccess = (state) =>
  state.employeeDocuments.success;
