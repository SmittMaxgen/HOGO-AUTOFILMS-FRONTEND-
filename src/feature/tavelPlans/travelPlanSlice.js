import { createSlice } from "@reduxjs/toolkit";
import {
  getTravelPlans,
  createTravelPlan,
  updateTravelPlan,
  deleteTravelPlan,
} from "./travelPlanThunks";

const initialState = {
  travelPlans: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  createSuccess: false,
  updateLoading: false,
  updateError: null,
  updateSuccess: false,
  deleteLoading: false,
  deleteError: null,
  deleteSuccess: false,
};

const travelPlanSlice = createSlice({
  name: "travelPlan",
  initialState,
  reducers: {
    clearTravelPlanState: (state) => {
      state.travelPlans = [];
      state.loading = false;
      state.error = null;
    },
    clearCreateState: (state) => {
      state.createLoading = false;
      state.createError = null;
      state.createSuccess = false;
    },
    clearUpdateState: (state) => {
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = false;
    },
    clearDeleteState: (state) => {
      state.deleteLoading = false;
      state.deleteError = null;
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getTravelPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTravelPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.travelPlans = action.payload?.data || [];
      })
      .addCase(getTravelPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createTravelPlan.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createTravelPlan.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        if (action.payload?.data) {
          state.travelPlans.push(action.payload.data);
        }
      })
      .addCase(createTravelPlan.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
        state.createSuccess = false;
      })

      // UPDATE
      .addCase(updateTravelPlan.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateTravelPlan.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        const index = state.travelPlans.findIndex(
          (plan) => plan.id === action.payload?.data?.id,
        );
        if (index !== -1) {
          state.travelPlans[index] = action.payload.data;
        }
      })
      .addCase(updateTravelPlan.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
      })

      // DELETE
      .addCase(deleteTravelPlan.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteTravelPlan.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.travelPlans = state.travelPlans.filter(
          (plan) => plan.id !== action.meta.arg,
        );
      })
      .addCase(deleteTravelPlan.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
        state.deleteSuccess = false;
      });
  },
});

export const {
  clearTravelPlanState,
  clearCreateState,
  clearUpdateState,
  clearDeleteState,
} = travelPlanSlice.actions;

export default travelPlanSlice.reducer;
