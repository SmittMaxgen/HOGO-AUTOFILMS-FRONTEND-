import { createSlice } from "@reduxjs/toolkit";
import {
  getDistributorReport,
  getProductReport,
  getCategoryReport,
  getRegionReport,
} from "./reportsThunks";

// ─── Reusable sub-state shape ───────────────────────────────
// monthlyData: keyed by "YYYY-MM" → full API response object
// loadingCount: tracks how many in-flight requests exist (12 parallel calls)
const reportState = {
  monthlyData: {}, // { "2026-01": { target, summary, orders/products, ... } }
  loadingCount: 0, // >0 means loading
  error: null,
};

const initialState = {
  distributor: { ...reportState },
  product: { ...reportState },
  category: { ...reportState },
  region: { ...reportState },
};

// ─── Helper: build extra-reducer cases for one report domain ─
const buildReportCases = (builder, domain, thunk) => {
  builder
    .addCase(thunk.pending, (state) => {
      state[domain].loadingCount += 1;
      state[domain].error = null;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state[domain].loadingCount = Math.max(0, state[domain].loadingCount - 1);
      // Store the full API response keyed by month string
      state[domain].monthlyData[action.payload.month] = action.payload.data;
    })
    .addCase(thunk.rejected, (state, action) => {
      state[domain].loadingCount = Math.max(0, state[domain].loadingCount - 1);
      state[domain].error = action.payload || "Something went wrong";
    });
};

// ─────────────────────────────────────────────────────────────

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    clearDistributorReport: (state) => {
      state.distributor = { ...reportState, monthlyData: {} };
    },
    clearProductReport: (state) => {
      state.product = { ...reportState, monthlyData: {} };
    },
    clearCategoryReport: (state) => {
      state.category = { ...reportState, monthlyData: {} };
    },
    clearRegionReport: (state) => {
      state.region = { ...reportState, monthlyData: {} };
    },
    clearAllReports: () => initialState,
  },
  extraReducers: (builder) => {
    buildReportCases(builder, "distributor", getDistributorReport);
    buildReportCases(builder, "product", getProductReport);
    buildReportCases(builder, "category", getCategoryReport);
    buildReportCases(builder, "region", getRegionReport);
  },
});

export const {
  clearDistributorReport,
  clearProductReport,
  clearCategoryReport,
  clearRegionReport,
  clearAllReports,
} = reportSlice.actions;

export default reportSlice.reducer;
