import { createSlice } from "@reduxjs/toolkit";
import { getWarranties, updateWarranty } from "./warrantyThunks";

const initialState = {
  warranties: [],
  count: 0,
  loading: false,
  error: null,

  updateLoading: false,
  updateSuccess: false,
};

const warrantySlice = createSlice({
  name: "warranty",
  initialState,
  reducers: {
    clearWarrantyState: (state) => {
      state.loading = false;
      state.updateLoading = false;
      state.updateSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET WARRANTIES
      .addCase(getWarranties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWarranties.fulfilled, (state, action) => {
        state.loading = false;
        state.warranties = action.payload?.data || [];
        state.count = action.payload?.count || 0;
      })
      .addCase(getWarranties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE WARRANTY
      .addCase(updateWarranty.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
        state.error = null;
      })
      .addCase(updateWarranty.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;

        if (action.payload?.data) {
          const index = state.warranties.findIndex(
            (w) => w.id === action.payload.data.id,
          );
          if (index !== -1) {
            state.warranties[index] = action.payload.data;
          }
        }
      })
      .addCase(updateWarranty.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = false;
        state.error = action.payload;
      });
  },
});

export const { clearWarrantyState } = warrantySlice.actions;
export default warrantySlice.reducer;
