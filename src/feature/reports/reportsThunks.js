import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ─────────────────────────────────────────────
// 1. DISTRIBUTOR REPORT
// GET /distributor-target-report/?distributor_id=3&month=2026-03
// ─────────────────────────────────────────────

export const getDistributorReport = createAsyncThunk(
  "report/getDistributorReport",
  async ({ distributor_id, month }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/distributor-target-report/", {
        params: { distributor_id, month },
      });
      return { data: response.data, month };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch distributor report!",
      );
    }
  },
);

// ─────────────────────────────────────────────
// 2. PRODUCT REPORT
// GET /product-target-report/?product_id=9&month=2026-03
// ─────────────────────────────────────────────

export const getProductReport = createAsyncThunk(
  "report/getProductReport",
  async ({ product_id, month }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/product-target-report/", {
        params: { product_id, month },
      });
      return { data: response.data, month };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product report!",
      );
    }
  },
);

// ─────────────────────────────────────────────
// 3. CATEGORY REPORT
// GET /category-target-report/?category=3&month=2026-03
// ─────────────────────────────────────────────

export const getCategoryReport = createAsyncThunk(
  "report/getCategoryReport",
  async ({ category, month }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/category-target-report/", {
        params: { category, month },
      });
      return { data: response.data, month };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch category report!",
      );
    }
  },
);

// ─────────────────────────────────────────────
// 4. REGION REPORT
// GET /region-target-report/?region=North&month=2026-03
// Note: region param = entity name (string), not id
// ─────────────────────────────────────────────

export const getRegionReport = createAsyncThunk(
  "report/getRegionReport",
  async ({ region, month }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/region-target-report/", {
        params: { region, month },
      });
      return { data: response.data, month };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch region report!",
      );
    }
  },
);
