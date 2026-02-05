import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// export const getUsers = createAsyncThunk(
//   "user/getUsers",
//   async (payload = {}, { rejectWithValue }) => {
//     try {
//       const params = {};

//       if (payload.name) params.name = payload.name;
//       if (payload.status !== undefined) params.status = payload.status;

//       const response = await axiosInstance.get(
//         `/users/${payload.employee_id}`,
//         {
//           params,
//         },
//       );

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch users!",
//       );
//     }
//   },
// );
export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const params = {};

      if (payload.employee_id) params.employee_id = payload.employee_id;
      if (payload.name) params.name = payload.name;
      if (payload.status !== undefined) params.status = payload.status;

      const response = await axiosInstance.get(
        "/users/",
        { params }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users!"
      );
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create user!",
      );
    }
  },
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/users/${id}/`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user!",
      );
    }
  },
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/users/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user!",
      );
    }
  },
);
