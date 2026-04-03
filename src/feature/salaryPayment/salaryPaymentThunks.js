import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://hogofilm.pythonanywhere.com/salary-payment/";

// ✅ GET SALARY PAYMENTS (with filters)
export const getSalaryPayments = createAsyncThunk(
  "salaryPayments/getSalaryPayments",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL, { params });
      return res.data.data; // { success, count, data }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch salary payments",
      );
    }
  },
);

// (Optional - if future API supports create/update/delete)
// keeping structure ready like your leads

export const createSalaryPayment = createAsyncThunk(
  "salaryPayments/createSalaryPayment",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updateSalaryPayment = createAsyncThunk(
  "salaryPayments/updateSalaryPayment",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}${id}/`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const deleteSalaryPayment = createAsyncThunk(
  "salaryPayments/deleteSalaryPayment",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);
