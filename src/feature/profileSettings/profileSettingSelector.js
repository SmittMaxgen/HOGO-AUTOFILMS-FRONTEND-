export const selectForgotPasswordLoading = (state) =>
  state.forgotPassword.loading;
export const selectForgotPasswordError = (state) => state.forgotPassword.error;
export const selectForgotPasswordSuccess = (state) =>
  state.forgotPassword.success;
export const selectForgotPasswordMessage = (state) =>
  state.forgotPassword.message;
