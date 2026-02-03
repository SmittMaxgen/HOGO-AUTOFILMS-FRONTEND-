import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET warranties
 * Filters (optional):
 *  - serial_id
 *  - warranty_status
 *  - product_status
 */
export const getWarranties = createAsyncThunk(
  "warranty/getWarranties",
  async (
    { serial_id = "", warranty_status = "", product_status = "" } = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.get("/warranty/", {
        params: {
          serial_id,
          warranty_status,
          product_status,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch warranties!",
      );
    }
  },
);

/**
 * UPDATE warranty (approve / reject / status update)
 */
// export const updateWarranty = createAsyncThunk(
//   "warranty/updateWarranty",
//   async ({ id, data }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.patch(
//         `/warranty/${id}/`,
//         data,
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to update warranty!",
//       );
//     }
//   },
// );
export const updateWarranty = createAsyncThunk(
  "warranty/updateWarranty",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      const response = await axiosInstance.patch(
        `/warranty/${id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update warranty!"
      );
    }
  }
);
