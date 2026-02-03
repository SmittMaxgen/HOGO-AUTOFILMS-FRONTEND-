export const selectUsers = (state) => state.user.list;
export const selectUserLoading = (state) => state.user.loading;
export const selectCreateUserLoading = (state) => state.user.createLoading;
export const selectUpdateUserLoading = (state) => state.user.updateLoading;
export const selectDeleteUserLoading = (state) => state.user.deleteLoading;
export const selectUserError = (state) => state.user.error;
export const selectUserSuccess = (state) => state.user.success;
