import { createSlice } from "@reduxjs/toolkit";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "./testimonialThunks";

const initialState = {
  testimonials: [],
  loading: false,
  error: null,

  createLoading: false,
  createSuccess: false,

  updateLoading: false,
  updateSuccess: false,

  deleteLoading: false,
};

const testimonialsSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    resetTestimonialStatus: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= GET =================
      .addCase(getTestimonials.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = action.payload;
      })
      .addCase(getTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= CREATE =================
      .addCase(createTestimonial.pending, (state) => {
        state.createLoading = true;
        state.createSuccess = false;
      })
      .addCase(createTestimonial.fulfilled, (state) => {
        state.createLoading = false;
        state.createSuccess = true;
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      // ================= UPDATE =================
      .addCase(updateTestimonial.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
      })
      .addCase(updateTestimonial.fulfilled, (state) => {
        state.updateLoading = false;
        state.updateSuccess = true;
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // ================= DELETE =================
      .addCase(deleteTestimonial.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.testimonials = state.testimonials.filter(
          (t) => t.id !== action.payload,
        );
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTestimonialStatus } = testimonialsSlice.actions;
export default testimonialsSlice.reducer;
