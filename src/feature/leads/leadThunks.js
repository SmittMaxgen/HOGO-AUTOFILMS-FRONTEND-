import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://hogofilm.pythonanywhere.com/leads/";

// ✅ GET LEADS
export const getLeads = createAsyncThunk(
  "leads/getLeads",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data.data; // 👈 API returns { success, count, data }
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
      const res = await axios.post(API_URL, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

// ✅ UPDATE LEAD (PATCH)
export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}${id}/`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

// ✅ DELETE LEAD
export const deleteLead = createAsyncThunk(
  "leads/deleteLead",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);
