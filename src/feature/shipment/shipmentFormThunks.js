import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * GET shipments
 * payload (optional):
 *  - shipment_status → filter by status (e.g. "created", "shipped")
 *  - order_id        → filter by purchase order id
 *  - null / {}       → fetch all shipments
 */
export const getShipments = createAsyncThunk(
  "shipment/getShipments",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};

      if (payload.shipment_status) params.shipment_status = payload.shipment_status;
      if (payload.order_id) params.order_id = payload.order_id;

      const response = await axiosInstance.get("/shipment/", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch shipments!"
      );
    }
  }
);

/**
 * POST shipment
 * payload: FormData or plain object containing shipment fields
 *  - order_id, tracking_number, shipment_status, shipped_at,
 *    estimated_delivery, name, contact_number, email, service_type, image
 */
export const createShipment = createAsyncThunk(
  "shipment/createShipment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/shipment/", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create shipment!"
      );
    }
  }
);

/**
 * PATCH shipment
 * payload:
 *  - id   → shipment_id to update
 *  - data → FormData or partial object with fields to update
 */
export const updateShipment = createAsyncThunk(
  "shipment/updateShipment",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;

      const response = await axiosInstance.patch(`/shipment/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update shipment!"
      );
    }
  }
);

/**
 * DELETE shipment
 * payload: shipment_id (number)
 */
export const deleteShipment = createAsyncThunk(
  "shipment/deleteShipment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/shipment/${payload}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete shipment!"
      );
    }
  }
);