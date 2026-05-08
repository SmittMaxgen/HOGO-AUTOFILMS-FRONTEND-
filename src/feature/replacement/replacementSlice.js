import { createSlice } from "@reduxjs/toolkit";
import {
  getReplacements,
  createReplacement,
  updateReplacement,
  deleteReplacement,
} from "./replacementThunks";

const initialState = {
  replacements: [],

  loading: false,
  error: null,

  createLoading: false,
  createError: null,
  createSuccess: false,

  updateLoading: false,
  updateError: null,
  updateSuccess: false,

  deleteLoading: false,
  deleteError: null,
  deleteSuccess: false,
};

const replacementSlice = createSlice({
  name: "replacement",
  initialState,

  reducers: {
    clearReplacementState: (state) => {
      state.replacements = [];
      state.loading = false;
      state.error = null;
    },

    clearCreateState: (state) => {
      state.createLoading = false;
      state.createError = null;
      state.createSuccess = false;
    },

    clearUpdateState: (state) => {
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = false;
    },

    clearDeleteState: (state) => {
      state.deleteLoading = false;
      state.deleteError = null;
      state.deleteSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // GET
      .addCase(getReplacements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getReplacements.fulfilled, (state, action) => {
        state.loading = false;
        state.replacements = action.payload?.data || [];
      })

      .addCase(getReplacements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createReplacement.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })

      .addCase(createReplacement.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;

        state.replacements.unshift(action.payload?.data);
      })

      .addCase(createReplacement.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })

      // UPDATE
      .addCase(updateReplacement.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })

      .addCase(updateReplacement.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;

        const index = state.replacements.findIndex(
          (item) => item.id === action.payload?.data?.id,
        );

        if (index !== -1) {
          state.replacements[index] = action.payload.data;
        }
      })

      .addCase(updateReplacement.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })

      // DELETE
      .addCase(deleteReplacement.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })

      .addCase(deleteReplacement.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;

        state.replacements = state.replacements.filter(
          (item) => item.id !== action.meta.arg,
        );
      })

      .addCase(deleteReplacement.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

export const {
  clearReplacementState,
  clearCreateState,
  clearUpdateState,
  clearDeleteState,
} = replacementSlice.actions;

export default replacementSlice.reducer;
