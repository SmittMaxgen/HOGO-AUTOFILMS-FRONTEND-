import { createSlice } from "@reduxjs/toolkit";
import {
  getDailyPlans,
  createDailyPlan,
  updateDailyPlan,
  deleteDailyPlan,
} from "./dailyPlanThunks";

const initialState = {
  dailyPlans: [],
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

const dailyPlanSlice = createSlice({
  name: "dailyPlan",
  initialState,
  reducers: {
    clearDailyPlanState: (state) => {
      state.dailyPlans = [];
      state.loading = false;
      state.error = null;
    },
    clearDailyPlanCreateState: (state) => {
      state.createLoading = false;
      state.createError = null;
      state.createSuccess = false;
    },
    clearDailyPlanUpdateState: (state) => {
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = false;
    },
    clearDailyPlanDeleteState: (state) => {
      state.deleteLoading = false;
      state.deleteError = null;
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getDailyPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDailyPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyPlans = action.payload?.data || [];
      })
      .addCase(getDailyPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createDailyPlan.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createDailyPlan.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        if (action.payload?.data) {
          state.dailyPlans.push(action.payload.data);
        }
      })
      .addCase(createDailyPlan.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
        state.createSuccess = false;
      })

      // UPDATE
      .addCase(updateDailyPlan.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateDailyPlan.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        const index = state.dailyPlans.findIndex(
          (plan) => plan.id === action.payload?.data?.id,
        );
        if (index !== -1) {
          state.dailyPlans[index] = action.payload.data;
        }
      })
      .addCase(updateDailyPlan.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
      })

      // DELETE
      .addCase(deleteDailyPlan.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteDailyPlan.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.dailyPlans = state.dailyPlans.filter(
          (plan) => plan.id !== action.meta.arg,
        );
      })
      .addCase(deleteDailyPlan.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
        state.deleteSuccess = false;
      });
  },
});

export const {
  clearDailyPlanState,
  clearDailyPlanCreateState,
  clearDailyPlanUpdateState,
  clearDailyPlanDeleteState,
} = dailyPlanSlice.actions;

export default dailyPlanSlice.reducer;
