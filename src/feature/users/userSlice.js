import { createSlice } from "@reduxjs/toolkit";
import { getUsers, createUser, updateUser, deleteUser } from "./userThunks";

const initialState = {
  list: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  success: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.list = [];
      state.loading = false;
      state.createLoading = false;
      state.updateLoading = false;
      state.deleteLoading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createUser.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        if (action.payload?.data) state.list.unshift(action.payload.data);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      .addCase(updateUser.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;
        if (action.payload?.data) {
          const index = state.list.findIndex(
            (u) => u.id === action.payload.data.id,
          );
          if (index !== -1) state.list[index] = action.payload.data;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      .addCase(deleteUser.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteLoading = false;
        if (action.meta.arg)
          state.list = state.list.filter((u) => u.id !== action.meta.arg);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
