import { createSlice } from "@reduxjs/toolkit";
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "./locationThunks";

const initialState = {
  list: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  success: false,
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    clearLocationState: (state) => {
      state.list = [];
      state.loading = false;
      state.createLoading = false;
      state.updateLoading = false;
      state.deleteLoading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // =====================
      // GET
      // =====================
      .addCase(getLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
      })
      .addCase(getLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =====================
      // CREATE
      // =====================
      .addCase(createLocation.pending, (state) => {
        state.createLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createLocation.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;

        const newData = action.payload?.data;

        if (newData) {
          state.list.unshift(newData);
        }
      })
      .addCase(createLocation.rejected, (state, action) => {
        state.createLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // =====================
      // UPDATE
      // =====================
      .addCase(updateLocation.pending, (state) => {
        state.updateLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;

        const updatedData = action.payload?.data;

        const index = state.list.findIndex(
          (item) => item.id === updatedData.id,
        );

        if (index !== -1) {
          state.list[index] = updatedData;
        }
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.updateLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // =====================
      // DELETE
      // =====================
      .addCase(deleteLocation.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.deleteLoading = false;

        const deletedId = action.meta.arg;

        state.list = state.list.filter((item) => item.id !== deletedId);
      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLocationState } = locationSlice.actions;
export default locationSlice.reducer;
