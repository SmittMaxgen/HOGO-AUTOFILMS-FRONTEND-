export const selectMaterials = (state) => state.material.list;
export const selectMaterialLoading = (state) => state.material.loading;
export const selectCreateMaterialLoading = (state) =>
  state.material.createLoading;
export const selectUpdateMaterialLoading = (state) =>
  state.material.updateLoading;
export const selectDeleteMaterialLoading = (state) =>
  state.material.deleteLoading; // new selector

export const selectMaterialError = (state) => state.material.error;
export const selectCreateMaterialSuccess = (state) => state.material.success;
