export const selectCategoryState = (state) => state.category;

export const selectCategoryList = (state) => state.category.list;

export const selectSingleCategory = (state) => state.category.single;

export const selectCategoryLoading = (state) => state.category.loading;

export const selectCategoryError = (state) => state.category.error;

export const selectCategorySuccess = (state) => state.category.success;
