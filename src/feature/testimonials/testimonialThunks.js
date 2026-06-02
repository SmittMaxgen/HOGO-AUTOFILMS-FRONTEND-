import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ✅ GET TESTIMONIALS
export const getTestimonials = createAsyncThunk(
  "testimonials/getTestimonials",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page);
      if (params.search) queryParams.append("search", params.search);
      // Add more filters if needed in future

      const url = `/testimonials/?${queryParams.toString()}`;

      const res = await axiosInstance.get(url);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch testimonials",
      );
    }
  },
);

// ✅ CREATE TESTIMONIAL
export const createTestimonial = createAsyncThunk(
  "testimonials/createTestimonial",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/testimonials/`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to create testimonial",
      );
    }
  },
);

// ✅ UPDATE TESTIMONIAL (PATCH)
export const updateTestimonial = createAsyncThunk(
  "testimonials/updateTestimonial",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/testimonials/${id}/`, data);
      return res.data;
    } catch (err) {
      console.error("Update Testimonial Error:", err.response?.data);
      return rejectWithValue(
        err.response?.data || "Failed to update testimonial",
      );
    }
  },
);

// ✅ DELETE TESTIMONIAL
export const deleteTestimonial = createAsyncThunk(
  "testimonials/deleteTestimonial",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/testimonials/${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to delete testimonial",
      );
    }
  },
);