import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getContacts = createAsyncThunk(
  "contacts/getContacts",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/contacts/", {
        params: filters,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch contacts",
      );
    }
  },
);

// ✅ CREATE CONTACT
export const createContact = createAsyncThunk(
  "contacts/createContact",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/contacts/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create contact",
      );
    }
  },
);

// ✅ UPDATE CONTACT (PATCH)
export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/contacts/${id}/`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update contact",
      );
    }
  },
);

// ✅ DELETE CONTACT
export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/contacts/${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete contact",
      );
    }
  },
);
