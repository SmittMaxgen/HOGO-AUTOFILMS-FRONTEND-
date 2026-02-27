// visitSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  getVisits,
  createVisit,
  updateVisit,
  deleteVisit,
} from "./visitThunks";

const initialState = {
  list: [],
  count: 0,
  loading: false,
  error: null,
};

const visitSlice = createSlice({
  name: "visit",
  initialState,
  reducers: {
    clearVisitError: (state) => {
      state.error = null;
    },
    resetVisitState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || action.payload || [];
        state.count =
          action.payload?.count ||
          action.payload?.data?.length ||
          state.list.length;
      })
      .addCase(getVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVisit.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.list.push(action.payload.data);
          state.count += 1;
        } else {
          state.list.push(action.payload);
          state.count += 1;
        }
      })
      .addCase(createVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVisit.fulfilled, (state, action) => {
        state.loading = false;
        const updatedVisit = action.payload?.data || action.payload;
        if (updatedVisit) {
          const index = state.list.findIndex(
            (item) => item.id === updatedVisit.id,
          );
          if (index !== -1) {
            state.list[index] = updatedVisit;
          }
        }
      })
      .addCase(updateVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVisit.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;
        state.list = state.list.filter((item) => item.id !== deletedId);
        state.count = state.count > 0 ? state.count - 1 : 0;
      })
      .addCase(deleteVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVisitError, resetVisitState } = visitSlice.actions;

export default visitSlice.reducer;
