// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_URL = "https://hogofilm.pythonanywhere.com/quotes/";

// // ✅ GET QUOTES
// export const getQuotes = createAsyncThunk(
//   "quotes/getQuotes",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(API_URL);
//       return res.data.data; // 👈 API returns { success, count, data }
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Failed to fetch quotes");
//     }
//   },
// );

// // ✅ CREATE QUOTE
// export const createQuote = createAsyncThunk(
//   "quotes/createQuote",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await axios.post(API_URL, payload);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data);
//     }
//   },
// );

// // ✅ UPDATE QUOTE (PATCH)
// export const updateQuote = createAsyncThunk(
//   "quotes/updateQuote",
//   async ({ id, data }, { rejectWithValue }) => {
//     try {
//       const res = await axios.patch(`${API_URL}${id}/`, data);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data);
//     }
//   },
// );

// // ✅ DELETE QUOTE
// export const deleteQuote = createAsyncThunk(
//   "quotes/deleteQuote",
//   async (id, { rejectWithValue }) => {
//     try {
//       await axios.delete(`${API_URL}${id}/`);
//       return id;
//     } catch (err) {
//       return rejectWithValue(err.response?.data);
//     }
//   },
// );

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://hogofilm.pythonanywhere.com/quotes/";

// ✅ GET QUOTES (with optional filters)
// Usage:
//   dispatch(getQuotes())                                        → all quotes
//   dispatch(getQuotes({ full_name: "vrutik" }))                → filter by name
//   dispatch(getQuotes({ email: "x@gmail.com" }))               → filter by email
//   dispatch(getQuotes({ service: "WINDOW FILM" }))             → filter by service
//   dispatch(getQuotes({ contact: "9090909090" }))              → filter by contact
//   dispatch(getQuotes({ brand_id: 1 }))                        → filter by brand
//   dispatch(getQuotes({ model_id: 1 }))                        → filter by model
export const getQuotes = createAsyncThunk(
  "quotes/getQuotes",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL, {
        params: filters, // axios auto-builds ?key=value query string
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch quotes");
    }
  },
);

// ✅ CREATE QUOTE
export const createQuote = createAsyncThunk(
  "quotes/createQuote",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

// ✅ UPDATE QUOTE (PATCH)
export const updateQuote = createAsyncThunk(
  "quotes/updateQuote",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}${id}/`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

// ✅ DELETE QUOTE
export const deleteQuote = createAsyncThunk(
  "quotes/deleteQuote",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);
