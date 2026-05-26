import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ✅ GET LEADS
export const getLeads = createAsyncThunk(
  "leads/getLeads",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page);
      if (params.search) queryParams.append("search", params.search);
      if (params.lead_type) queryParams.append("lead_type", params.lead_type);
      if (params.interest_level)
        queryParams.append("interest_level", params.interest_level);
      if (params.lead_status)
        queryParams.append("lead_status", params.lead_status);
      if (params.created_by)
        queryParams.append("created_by", params.created_by);
      if (params.assigned_to)
        queryParams.append("assigned_to", params.assigned_to);

      const url = `/leads/?${queryParams.toString()}`;

      const res = await axiosInstance.get(url);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch leads");
    }
  },
);

// ✅ CREATE LEAD
export const createLead = createAsyncThunk(
  "leads/createLead",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/leads/`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create lead");
    }
  },
);

// ✅ UPDATE LEAD (Using PATCH)
export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/leads/${id}/`, data);
      return res.data;
    } catch (err) {
      console.error("Update Error:", err.response?.data); // For debugging
      return rejectWithValue(err.response?.data || "Failed to update lead");
    }
  },
);

// ✅ DELETE LEAD
export const deleteLead = createAsyncThunk(
  "leads/deleteLead",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/leads/${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete lead");
    }
  },
);

// ✅ DOWNLOAD EMPLOYEE LEAD MONTHLY REPORT
export const downloadEmployeeLeadReport = createAsyncThunk(
  "leads/downloadEmployeeLeadReport",
  async (params, { rejectWithValue }) => {
    try {
      let url = `/employee-lead-monthly-report/`;

      const queryParams = new URLSearchParams();
      if (params.month) queryParams.append("month", params.month);
      if (params.year) queryParams.append("year", params.year);
      if (params.employee_id)
        queryParams.append("employee_id", params.employee_id);

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const res = await axiosInstance.get(url, { responseType: "blob" });
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to download report";
      return rejectWithValue({ message });
    }
  },
);
