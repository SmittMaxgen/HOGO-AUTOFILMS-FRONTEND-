import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET galleries
 * payload (optional):
 *  - name            → filter by gallery name
 *  - gallery_sequence → filter by sequence number
 *  - null / {}       → fetch all galleries
 */
export const getGalleries = createAsyncThunk(
  "gallery/getGalleries",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (payload.name) params.name = payload.name;
      if (payload.gallery_sequence !== undefined)
        params.gallery_sequence = payload.gallery_sequence;

      const response = await axiosInstance.get("/gallery/", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch galleries!",
      );
    }
  },
);

/**
 * POST gallery
 * payload: FormData or plain object
 *  - name, image, gallery_sequence
 */
export const createGallery = createAsyncThunk(
  "gallery/createGallery",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/gallery/", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create gallery!",
      );
    }
  },
);

/**
 * PATCH gallery
 * payload:
 *  - id   → gallery id to update
 *  - data → FormData or partial object with fields to update
 */
export const updateGallery = createAsyncThunk(
  "gallery/updateGallery",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;
      const response = await axiosInstance.patch(`/gallery/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update gallery!",
      );
    }
  },
);

/**
 * DELETE gallery
 * payload: gallery id (number)
 */
export const deleteGallery = createAsyncThunk(
  "gallery/deleteGallery",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/gallery/${payload}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete gallery!",
      );
    }
  },
);
