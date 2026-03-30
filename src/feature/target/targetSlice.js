import { createSlice } from "@reduxjs/toolkit";
import {
  getDistributorTargets,
  createDistributorTarget,
  updateDistributorTarget,
  deleteDistributorTarget,
  getProductTargets,
  createProductTarget,
  updateProductTarget,
  deleteProductTarget,
  getCategoryTargets,
  createCategoryTarget,
  updateCategoryTarget,
  deleteCategoryTarget,
  getRegionTargets,
  createRegionTarget,
  updateRegionTarget,
  deleteRegionTarget,
} from "./targetThunks";

// ─── Reusable sub-state shape ───────────────────────────────
const targetState = {
  list: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  success: false,
  error: null,
};

const initialState = {
  distributor: { ...targetState },
  product: { ...targetState },
  category: { ...targetState },
  region: { ...targetState },
};

// ─── Helper: build extra-reducer cases for one target domain ─
const buildCases = (builder, domain, thunks) => {
  const { getThunk, createThunk, updateThunk, deleteThunk } = thunks;

  builder
    // GET
    .addCase(getThunk.pending, (state) => {
      state[domain].loading = true;
      state[domain].error = null;
    })
    .addCase(getThunk.fulfilled, (state, action) => {
      state[domain].loading = false;
      state[domain].list = action.payload?.data || action.payload || [];
    })
    .addCase(getThunk.rejected, (state, action) => {
      state[domain].loading = false;
      state[domain].error = action.payload;
    })

    // CREATE
    .addCase(createThunk.pending, (state) => {
      state[domain].createLoading = true;
      state[domain].error = null;
      state[domain].success = false;
    })
    .addCase(createThunk.fulfilled, (state, action) => {
      state[domain].createLoading = false;
      state[domain].success = true;
      const newItem = action.payload?.data || action.payload;
      if (newItem) {
        state[domain].list.unshift(newItem); // add at top
      }
    })
    .addCase(createThunk.rejected, (state, action) => {
      state[domain].createLoading = false;
      state[domain].success = false;
      state[domain].error = action.payload;
    })

    // UPDATE
    .addCase(updateThunk.pending, (state) => {
      state[domain].updateLoading = true;
      state[domain].error = null;
      state[domain].success = false;
    })
    .addCase(updateThunk.fulfilled, (state, action) => {
      state[domain].updateLoading = false;
      state[domain].success = true;
      const updated = action.payload?.data || action.payload;
      if (updated) {
        const index = state[domain].list.findIndex((m) => m.id === updated.id);
        if (index !== -1) {
          state[domain].list[index] = updated;
        }
      }
    })
    .addCase(updateThunk.rejected, (state, action) => {
      state[domain].updateLoading = false;
      state[domain].success = false;
      state[domain].error = action.payload;
    })

    // DELETE
    .addCase(deleteThunk.pending, (state) => {
      state[domain].deleteLoading = true;
      state[domain].error = null;
    })
    .addCase(deleteThunk.fulfilled, (state, action) => {
      state[domain].deleteLoading = false;
      // meta.arg is the id passed to the thunk
      const deletedId = action.meta.arg;
      if (deletedId) {
        state[domain].list = state[domain].list.filter(
          (m) => m.id !== deletedId
        );
      }
    })
    .addCase(deleteThunk.rejected, (state, action) => {
      state[domain].deleteLoading = false;
      state[domain].error = action.payload;
    });
};

// ─────────────────────────────────────────────────────────────

const targetSlice = createSlice({
  name: "target",
  initialState,
  reducers: {
    clearDistributorTargetState: (state) => {
      state.distributor = { ...targetState };
    },
    clearProductTargetState: (state) => {
      state.product = { ...targetState };
    },
    clearCategoryTargetState: (state) => {
      state.category = { ...targetState };
    },
    clearRegionTargetState: (state) => {
      state.region = { ...targetState };
    },
    clearAllTargetState: () => initialState,
  },
  extraReducers: (builder) => {
    // 1. Distributor
    buildCases(builder, "distributor", {
      getThunk: getDistributorTargets,
      createThunk: createDistributorTarget,
      updateThunk: updateDistributorTarget,
      deleteThunk: deleteDistributorTarget,
    });

    // 2. Product
    buildCases(builder, "product", {
      getThunk: getProductTargets,
      createThunk: createProductTarget,
      updateThunk: updateProductTarget,
      deleteThunk: deleteProductTarget,
    });

    // 3. Category
    buildCases(builder, "category", {
      getThunk: getCategoryTargets,
      createThunk: createCategoryTarget,
      updateThunk: updateCategoryTarget,
      deleteThunk: deleteCategoryTarget,
    });

    // 4. Region
    buildCases(builder, "region", {
      getThunk: getRegionTargets,
      createThunk: createRegionTarget,
      updateThunk: updateRegionTarget,
      deleteThunk: deleteRegionTarget,
    });
  },
});

export const {
  clearDistributorTargetState,
  clearProductTargetState,
  clearCategoryTargetState,
  clearRegionTargetState,
  clearAllTargetState,
} = targetSlice.actions;

export default targetSlice.reducer;