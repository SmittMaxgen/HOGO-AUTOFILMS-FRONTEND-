import { createSlice } from "@reduxjs/toolkit";
import { getCost, createCost, updateCost, deleteCost } from "./costThunks";

const initialState = {
  list: [],
  count: 0,
  loading: false,
  error: null,
};

const costSlice = createSlice({
  name: "cost",
  initialState,
  reducers: {
    clearCostError: (state) => {
      state.error = null;
    },
    resetCostState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCost.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
        state.count = action.payload?.count || 0;
      })
      .addCase(getCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCost.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.list.push(action.payload.data);
          state.count += 1;
        }
      })
      .addCase(createCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCost.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCost = action.payload?.data;
        if (updatedCost) {
          const index = state.list.findIndex(
            (item) => item.id === updatedCost.id,
          );
          if (index !== -1) {
            state.list[index] = updatedCost;
          }
        }
      })
      .addCase(updateCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCost.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;
        state.list = state.list.filter((item) => item.id !== deletedId);
        state.count = state.count > 0 ? state.count - 1 : 0;
      })
      .addCase(deleteCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCostError, resetCostState } = costSlice.actions;

export default costSlice.reducer;
