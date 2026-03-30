import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ─────────────────────────────────────────────
// 1. DISTRIBUTOR TARGET
// ─────────────────────────────────────────────

export const getDistributorTargets = createAsyncThunk(
  "target/getDistributorTargets",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (payload.distributor) params.distributor = payload.distributor;
      if (payload.month) params.month = payload.month;

      const response = await axiosInstance.get("/distributortargets/", {
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch distributor targets!",
      );
    }
  },
);

export const createDistributorTarget = createAsyncThunk(
  "target/createDistributorTarget",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/distributortargets/",
        payload,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create distributor target!",
      );
    }
  },
);

export const updateDistributorTarget = createAsyncThunk(
  "target/updateDistributorTarget",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;
      const response = await axiosInstance.patch(
        `/distributortargets/${id}/`,
        data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update distributor target!",
      );
    }
  },
);

export const deleteDistributorTarget = createAsyncThunk(
  "target/deleteDistributorTarget",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/distributortargets/${payload}/`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete distributor target!",
      );
    }
  },
);

// ─────────────────────────────────────────────
// 2. PRODUCT TARGET
// ─────────────────────────────────────────────

export const getProductTargets = createAsyncThunk(
  "target/getProductTargets",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (payload.product) params.product = payload.product;
      if (payload.month) params.month = payload.month;

      const response = await axiosInstance.get("/producttargets/", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product targets!",
      );
    }
  },
);

export const createProductTarget = createAsyncThunk(
  "target/createProductTarget",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/producttargets/", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product target!",
      );
    }
  },
);

export const updateProductTarget = createAsyncThunk(
  "target/updateProductTarget",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;
      const response = await axiosInstance.patch(
        `/producttargets/${id}/`,
        data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product target!",
      );
    }
  },
);

export const deleteProductTarget = createAsyncThunk(
  "target/deleteProductTarget",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/producttargets/${payload}/`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product target!",
      );
    }
  },
);

// ─────────────────────────────────────────────
// 3. CATEGORY TARGET
// ─────────────────────────────────────────────

export const getCategoryTargets = createAsyncThunk(
  "target/getCategoryTargets",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (payload.category) params.category = payload.category;
      if (payload.month) params.month = payload.month;

      const response = await axiosInstance.get("/categorytargets/", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch category targets!",
      );
    }
  },
);

export const createCategoryTarget = createAsyncThunk(
  "target/createCategoryTarget",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/categorytargets/", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create category target!",
      );
    }
  },
);

export const updateCategoryTarget = createAsyncThunk(
  "target/updateCategoryTarget",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;
      const response = await axiosInstance.patch(
        `/categorytargets/${id}/`,
        data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update category target!",
      );
    }
  },
);

export const deleteCategoryTarget = createAsyncThunk(
  "target/deleteCategoryTarget",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/categorytargets/${payload}/`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete category target!",
      );
    }
  },
);

// ─────────────────────────────────────────────
// 4. REGION TARGET
// ─────────────────────────────────────────────

export const getRegionTargets = createAsyncThunk(
  "target/getRegionTargets",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (payload.region) params.region = payload.region;
      if (payload.month) params.month = payload.month;

      const response = await axiosInstance.get("/regiontargets/", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch region targets!",
      );
    }
  },
);

export const createRegionTarget = createAsyncThunk(
  "target/createRegionTarget",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/regiontargets/", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create region target!",
      );
    }
  },
);

export const updateRegionTarget = createAsyncThunk(
  "target/updateRegionTarget",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;
      const response = await axiosInstance.patch(`/regiontargets/${id}/`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update region target!",
      );
    }
  },
);

export const deleteRegionTarget = createAsyncThunk(
  "target/deleteRegionTarget",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/regiontargets/${payload}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete region target!",
      );
    }
  },
);
