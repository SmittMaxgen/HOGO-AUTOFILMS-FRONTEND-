import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// export const getShipmentProducts = createAsyncThunk(
//   "shipmentProduct/getShipmentProduct",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(
//         `/shipment_products/${payload ? payload : ""}`,
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch Shipment Products !",
//       );
//     }
//   },
// );

// Updated getShipmentProducts thunk
export const getShipmentProducts = createAsyncThunk(
  "shipmentProduct/getShipmentProduct",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(
        Object.entries(params).filter(([_, v]) => v !== "" && v !== null),
      ).toString();

      const url = queryString
        ? `/shipment_products/?${queryString}`
        : "/shipment_products/";

      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch Shipment Products!",
      );
    }
  },
);

export const createShipmentProduct = createAsyncThunk(
  "shipmentProduct/createShipmentProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/shipment_products/`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create Shipment Product !",
      );
    }
  },
);

export const updateShipmentProduct = createAsyncThunk(
  "shipmentProduct/updateShipmentProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/shipment_products/${payload.id}/`,
        payload.data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update Shipment Product !",
      );
    }
  },
);

export const deleteShipmentProduct = createAsyncThunk(
  "shipmentProduct/deleteShipmentProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/shipment_products/${payload}/`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete Shipment Product !",
      );
    }
  },
);

// Corrected Excel Download Thunk
export const downloadShipmentProductExcel = createAsyncThunk(
  "shipmentProduct/downloadShipmentProductExcel",
  async (batch_id, { rejectWithValue }) => {
    try {
      // Ensure batch_id is string and not object
      const cleanBatchId =
        typeof batch_id === "object"
          ? batch_id?.id || batch_id?.batch_data || String(batch_id)
          : String(batch_id);

      const url =
        cleanBatchId && cleanBatchId !== "undefined" && cleanBatchId !== "null"
          ? `/shipment-product-excel-download/?batch_id=${encodeURIComponent(cleanBatchId)}`
          : "/shipment-product-excel-download/";

      const response = await axiosInstance.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `shipment_products_${cleanBatchId || "all"}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return "Excel downloaded successfully";
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to download Excel!",
      );
    }
  },
);
