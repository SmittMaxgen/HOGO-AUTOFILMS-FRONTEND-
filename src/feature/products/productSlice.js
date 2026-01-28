import { createSlice } from "@reduxjs/toolkit";
import { getProducts, createProducts, updateProducts } from "./productThunks";

const initialState = {
  list: [],
  count: 0,
  loading: false,
  createLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductState: (state) => {
      state.list = [];
      state.count = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ⏳ Pending
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ✅ Fulfilled
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
        state.count = action.payload?.count || 0;
      })

      // ❌ Rejected
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  CREATE PRODUCT

      .addCase(createProducts.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createProducts.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;

        if (action.payload?.data) {
          state.list.unshift(action.payload.data);
          state.count += 1;
        }
      })

      .addCase(createProducts.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(updateProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        if (action.payload?.data) {
          state.list.unshift(action.payload.data);
          state.count += 1;
        }
      })

      .addCase(updateProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
