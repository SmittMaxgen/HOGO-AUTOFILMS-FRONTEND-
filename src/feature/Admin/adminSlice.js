import { createSlice } from "@reduxjs/toolkit";
import { AdminUser } from "./adminThunks";

const initialState = {
  list: [],        // admin users data
  loading: false,  // pending state
  error: null,     // error message
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
      });
  },
});

export default adminSlice.reducer;
