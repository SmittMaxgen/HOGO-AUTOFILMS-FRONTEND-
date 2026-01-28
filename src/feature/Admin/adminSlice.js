import { createSlice } from "@reduxjs/toolkit";
import { AdminUser, UpdateAdminUser } from "./adminThunks";

const initialState = {
  list: [],
  loading: false,
  updateLoading: false,
  updateError: null,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ⏳ Pending
      .addCase(AdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ✅ Fulfilled
      .addCase(AdminUser.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
      })

      // ❌ Rejected
      .addCase(AdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(UpdateAdminUser.fulfilled, (state, action) => {
        state.updateLoading = false;

        const updatedAdmin = action.payload?.data;
        if (!updatedAdmin) return;

        const index = state.list.findIndex(
          (item) => item.id === updatedAdmin.id,
        );

        if (index !== -1) {
          state.list[index] = updatedAdmin;
        }
      })
      .addCase(UpdateAdminUser.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  },
});

export default adminSlice.reducer;
