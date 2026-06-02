// ==================== SELECTORS ====================

export const selectTestimonials = (state) => state.testimonials.testimonials;
export const selectTestimonialsLoading = (state) => state.testimonials.loading;
export const selectTestimonialError = (state) => state.testimonials.error;

export const selectCreateTestimonialLoading = (state) =>
  state.testimonials.createLoading;
export const selectCreateTestimonialSuccess = (state) =>
  state.testimonials.createSuccess;

export const selectUpdateTestimonialLoading = (state) =>
  state.testimonials.updateLoading;
export const selectUpdateTestimonialSuccess = (state) =>
  state.testimonials.updateSuccess;

export const selectDeleteTestimonialLoading = (state) =>
  state.testimonials.deleteLoading;
