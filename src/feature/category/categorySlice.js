import { createSlice } from "@reduxjs/toolkit";
import {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categoryThunks";

const initialState = {
  list: [],
  single: null,
  loading: false,
  error: null,
  success: false,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    resetCategoryState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;

        // if (action.meta.arg) {
        //   state.single = action.payload;
        // } else {
        //   state.list = action.payload;
        // }
      })
      .addCase(getCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        if (Array.isArray(state.list)) {
          state.list.unshift(action.payload);
        } else {
          state.list = [action.payload];
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create category";
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        if (Array.isArray(state.list?.data)) {
          state.list.data = state.list.data.map((item) =>
            item.id === action.payload.id ? action.payload : item,
          );
        }

        if (state.single?.id === action.payload.id) {
          state.single = action.payload;
        }
      })

      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;

        if (Array.isArray(state.list)) {
          state.list = state.list.filter((item) => item.id !== action.meta.arg);
        } else {
          state.list = [];
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete category";
      });
  },
});

export const { resetCategoryState } = categorySlice.actions;

export default categorySlice.reducer;
