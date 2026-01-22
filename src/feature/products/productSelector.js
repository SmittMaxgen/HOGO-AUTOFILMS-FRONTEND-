export const selectProducts = (state) => state.product.list;
export const selectProductCount = (state) => state.product.count;
export const selectProductLoading = (state) => state.product.loading;
export const selectProductError = (state) => state.product.error;
export const selectCreateProductLoading = (state) =>
  state.product.createLoading;

export const selectCreateProductSuccess = (state) =>
  state.product.createSuccess;

export const selectCreateProductError = (state) => state.product.createError;
