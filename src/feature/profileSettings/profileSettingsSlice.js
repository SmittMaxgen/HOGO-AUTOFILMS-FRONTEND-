import { createSlice } from "@reduxjs/toolkit";
import { forgotPassword, resetPassword } from "./profileSettingsThunks";

const initialState = {
  loading: false,
  success: false,
  error: null,
  message: null,
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    clearForgotPasswordState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload?.message || "Check your email for reset link";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload?.message || "Password reset successfully";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearForgotPasswordState } = forgotPasswordSlice.actions;
export const selectForgotPasswordLoading = (state) =>
  state.forgotPassword.loading;
export const selectForgotPasswordError = (state) => state.forgotPassword.error;
export const selectForgotPasswordSuccess = (state) =>
  state.forgotPassword.success;
export const selectForgotPasswordMessage = (state) =>
  state.forgotPassword.message;

export default forgotPasswordSlice.reducer;
