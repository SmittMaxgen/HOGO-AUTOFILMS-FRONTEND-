import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getDistributors = createAsyncThunk(
  "distributor/getDistributors",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};

      if (payload.distributor_name)
        params.distributor_name = payload.distributor_name;

      if (payload.status !== undefined) params.status = payload.status;

      if (payload.email_id) params.email_id = payload.email_id;

      const response = await axiosInstance.get("/distributor-information/", {
        params,
      });

      return response.data; // { success, count, data }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch distributors!",
      );
    }
  },
);

export const createDistributor = createAsyncThunk(
  "distributor/createDistributor",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/distributor-information/",
        payload,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create distributor!",
      );
    }
  },
);


export const updateDistributor = createAsyncThunk(
  "distributor/updateDistributor",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;

      const response = await axiosInstance.patch(
        `/distributor-information/${id}/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update distributor!",
      );
    }
  },
);

export const deleteDistributor = createAsyncThunk(
  "distributor/deleteDistributor",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/distributor-information/${payload}/`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete distributor!",
      );
    }
  },
);
