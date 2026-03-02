// officeBranchThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET Office Branches
 */
export const getOfficeBranches = createAsyncThunk(
  "officeBranch/getOfficeBranches",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};

      if (payload.city) params.city = payload.city;
      if (payload.state) params.state = payload.state;

      const response = await axiosInstance.get("/office_branches/", { params });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch office branches!",
      );
    }
  },
);

/**
 * CREATE Office Branch
 */
export const createOfficeBranch = createAsyncThunk(
  "officeBranch/createOfficeBranch",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/office_branches/", payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create office branch!",
      );
    }
  },
);

/**
 * UPDATE Office Branch
 */
export const updateOfficeBranch = createAsyncThunk(
  "officeBranch/updateOfficeBranch",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;

      const response = await axiosInstance.patch(
        `/office_branches/${id}/`,
        data,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update office branch!",
      );
    }
  },
);

/**
 * DELETE Office Branch
 */
export const deleteOfficeBranch = createAsyncThunk(
  "officeBranch/deleteOfficeBranch",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/office_branches/${id}/`);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete office branch!",
      );
    }
  },
);
