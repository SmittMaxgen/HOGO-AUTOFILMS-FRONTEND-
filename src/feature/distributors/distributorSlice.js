import { createSlice } from "@reduxjs/toolkit";
import {
  getDistributors,
  createDistributor,
  updateDistributor,
  deleteDistributor,
} from "./distributorThunks";

const initialState = {
  list: [],
  loading: false,
  error: null,

  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

const distributorSlice = createSlice({
  name: "distributor",
  initialState,
  reducers: {
    clearDistributorError: (state) => {
      state.error = null;
    },
    resetDistributorState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      /* ================= GET ================= */
      .addCase(getDistributors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDistributors.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || action.payload || [];
      })
      .addCase(getDistributors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= CREATE ================= */
      .addCase(createDistributor.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(createDistributor.fulfilled, (state, action) => {
        state.createLoading = false;
        if (action.payload?.data) {
          state.list.unshift(action.payload.data);
        }
      })
      .addCase(createDistributor.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      /* ================= UPDATE ================= */
      .addCase(updateDistributor.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateDistributor.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updated = action.payload?.data;
        if (updated) {
          const index = state.list.findIndex((i) => i.id === updated.id);
          if (index !== -1) state.list[index] = updated;
        }
      })
      .addCase(updateDistributor.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      /* ================= DELETE ================= */
      .addCase(deleteDistributor.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteDistributor.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.list = state.list.filter((i) => i.id !== action.payload);
      })
      .addCase(deleteDistributor.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDistributorError, resetDistributorState } =
  distributorSlice.actions;

export default distributorSlice.reducer;
