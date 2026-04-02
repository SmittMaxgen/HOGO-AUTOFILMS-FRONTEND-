// // import { createAsyncThunk } from "@reduxjs/toolkit";
// // import axios from "axios";

// // const API_URL = "https://hogofilm.pythonanywhere.com/contacts/";

// // // ✅ GET CONTACTS
// // export const getContacts = createAsyncThunk(
// //   "contacts/getContacts",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const res = await axios.get(API_URL);
// //       return res.data.data; // 👈 API returns { success, count, data }
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data || "Failed to fetch contacts");
// //     }
// //   },
// // );

// // // ✅ CREATE CONTACT
// // export const createContact = createAsyncThunk(
// //   "contacts/createContact",
// //   async (payload, { rejectWithValue }) => {
// //     try {
// //       const res = await axios.post(API_URL, payload);
// //       return res.data;
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data);
// //     }
// //   },
// // );

// // // ✅ UPDATE CONTACT (PATCH)
// // export const updateContact = createAsyncThunk(
// //   "contacts/updateContact",
// //   async ({ id, data }, { rejectWithValue }) => {
// //     try {
// //       const res = await axios.patch(`${API_URL}${id}/`, data);
// //       return res.data;
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data);
// //     }
// //   },
// // );

// // // ✅ DELETE CONTACT
// // export const deleteContact = createAsyncThunk(
// //   "contacts/deleteContact",
// //   async (id, { rejectWithValue }) => {
// //     try {
// //       await axios.delete(`${API_URL}${id}/`);
// //       return id;
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data);
// //     }
// //   },
// // );
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_URL = "https://hogofilm.pythonanywhere.com/contacts/";

// // ✅ GET CONTACTS (with optional filters)
// // Usage:
// //   dispatch(getContacts())                              → all contacts
// //   dispatch(getContacts({ name: "mamta gothi" }))      → filter by name
// //   dispatch(getContacts({ email: "x@gmail.com" }))     → filter by email
// //   dispatch(getContacts({ mobile: "753" }))            → filter by mobile
// export const getContacts = createAsyncThunk(
//   "contacts/getContacts",
//   async (filters = {}, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(API_URL, {
//         params: filters, // axios auto-builds ?key=value query string
//       });
//       return res.data.data; // 👈 API returns { success, count, data }
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Failed to fetch contacts");
//     }
//   },
// );

// // ✅ CREATE CONTACT
// export const createContact = createAsyncThunk(
//   "contacts/createContact",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await axios.post(API_URL, payload);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data);
//     }
//   },
// );

// // ✅ UPDATE CONTACT (PATCH)
// export const updateContact = createAsyncThunk(
//   "contacts/updateContact",
//   async ({ id, data }, { rejectWithValue }) => {
//     try {
//       const res = await axios.patch(`${API_URL}${id}/`, data);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data);
//     }
//   },
// );

// // ✅ DELETE CONTACT
// export const deleteContact = createAsyncThunk(
//   "contacts/deleteContact",
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

const API_URL = "https://hogofilm.pythonanywhere.com/contacts/";

// ✅ GET CONTACTS (with optional filters)
// Usage:
//   dispatch(getContacts())                              → all contacts
//   dispatch(getContacts({ name: "mamta gothi" }))      → filter by name
//   dispatch(getContacts({ email: "x@gmail.com" }))     → filter by email
//   dispatch(getContacts({ mobile: "753" }))            → filter by mobile
export const getContacts = createAsyncThunk(
  "contacts/getContacts",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL, {
        params: filters, // axios auto-builds ?key=value query string
      });
      return res.data.data; // 👈 API returns { success, count, data }
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch contacts");
    }
  },
);

// ✅ CREATE CONTACT
export const createContact = createAsyncThunk(
  "contacts/createContact",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

// ✅ UPDATE CONTACT (PATCH)
export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}${id}/`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

// ✅ DELETE CONTACT
export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);
