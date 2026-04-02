export const selectContacts = (state) => state.contacts.contacts;
export const selectContactsLoading = (state) => state.contacts.loading;

export const selectCreateContactLoading = (state) =>
  state.contacts.createLoading;
export const selectCreateContactSuccess = (state) =>
  state.contacts.createSuccess;

export const selectUpdateContactLoading = (state) =>
  state.contacts.updateLoading;
export const selectUpdateContactSuccess = (state) =>
  state.contacts.updateSuccess;

export const selectDeleteContactLoading = (state) =>
  state.contacts.deleteLoading;

export const selectContactError = (state) => state.contacts.error;
