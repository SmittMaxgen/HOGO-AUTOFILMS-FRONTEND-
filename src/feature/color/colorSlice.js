import { createSlice } from "@reduxjs/toolkit";
import {
  createColor,
  getColors,
  updateColor,
  deleteColor,
} from "./colorThunks";

const initialState = {
  colors: [],
  loading: false,
  error: null,
  createLoading: false,
  createSuccess: false,
  updateLoading: false,
  updateSuccess: false,
  deleteLoading: false,
  deleteSuccess: false,
};

const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    clearColorState: (state) => {
      state.colors = [];
      state.loading = false;
      state.createLoading = false;
      state.createSuccess = false;
      state.updateLoading = false;
      state.updateSuccess = false;
      state.deleteLoading = false;
      state.deleteSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET COLORS
      .addCase(getColors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getColors.fulfilled, (state, action) => {
        state.loading = false;
        state.colors = action.payload?.data || [];
      })
      .addCase(getColors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE COLOR
      .addCase(createColor.pending, (state) => {
        state.createLoading = true;
        state.createSuccess = false;
        state.error = null;
      })
      .addCase(createColor.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        if (action.payload?.data) {
          state.colors.push(action.payload.data); // add new color to list
        }
      })
      .addCase(createColor.rejected, (state, action) => {
        state.createLoading = false;
        state.createSuccess = false;
        state.error = action.payload;
      })

      // UPDATE COLOR
      .addCase(updateColor.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
        state.error = null;
      })
      .addCase(updateColor.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        if (action.payload?.data) {
          // Update the color in the list
          const index = state.colors.findIndex(
            (c) => c.id === action.payload.data.id,
          );
          if (index !== -1) {
            state.colors[index] = action.payload.data;
          }
        }
      })
      .addCase(updateColor.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = false;
        state.error = action.payload;
      })

      .addCase(deleteColor.pending, (state) => {
        state.deleteLoading = true;
        state.deleteSuccess = false;
        state.error = null;
      })
      .addCase(deleteColor.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        const deletedId = action.meta.arg; // the payload we sent in thunk is the id
        state.colors = state.colors.filter((c) => c.id !== deletedId);
      })
      .addCase(deleteColor.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = false;
        state.error = action.payload;
      });
  },
});

export const { clearColorState } = colorSlice.actions;
export default colorSlice.reducer;
