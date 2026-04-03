import { createSlice } from "@reduxjs/toolkit";
import {
  getSalaryPayments,
  createSalaryPayment,
  updateSalaryPayment,
  deleteSalaryPayment,
} from "./salaryPaymentThunks";

const initialState = {
  salaryPayments: [],
  loading: false,
  error: null,

  createLoading: false,
  createSuccess: false,

  updateLoading: false,
  updateSuccess: false,

  deleteLoading: false,
};

const salaryPaymentSlice = createSlice({
  name: "salaryPayments",
  initialState,
  reducers: {
    resetSalaryPaymentStatus: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= GET =================
      .addCase(getSalaryPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSalaryPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.salaryPayments = action.payload;
      })
      .addCase(getSalaryPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= CREATE =================
      .addCase(createSalaryPayment.pending, (state) => {
        state.createLoading = true;
        state.createSuccess = false;
      })
      .addCase(createSalaryPayment.fulfilled, (state) => {
        state.createLoading = false;
        state.createSuccess = true;
      })
      .addCase(createSalaryPayment.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      // ================= UPDATE =================
      .addCase(updateSalaryPayment.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
      })
      .addCase(updateSalaryPayment.fulfilled, (state) => {
        state.updateLoading = false;
        state.updateSuccess = true;
      })
      .addCase(updateSalaryPayment.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // ================= DELETE =================
      .addCase(deleteSalaryPayment.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteSalaryPayment.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.salaryPayments = state.salaryPayments.filter(
          (s) => s.id !== action.payload,
        );
      })
      .addCase(deleteSalaryPayment.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSalaryPaymentStatus } = salaryPaymentSlice.actions;
export default salaryPaymentSlice.reducer;
