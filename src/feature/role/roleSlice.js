import { createSlice } from "@reduxjs/toolkit";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "./roleThunks";

const initialState = {
  list: [],
  count: 0,
  loading: false,
  error: null,
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    clearRoleError: (state) => {
      state.error = null;
    },
    resetRoleState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
        state.count = action.payload?.count || 0;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.list.push(action.payload.data);
          state.count += 1;
        }
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRole = action.payload?.data;
        if (updatedRole) {
          const index = state.list.findIndex(
            (item) => item.id === updatedRole.id
          );
          if (index !== -1) {
            state.list[index] = updatedRole;
          }
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;
        state.list = state.list.filter((item) => item.id !== deletedId);
        state.count = state.count > 0 ? state.count - 1 : 0;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRoleError, resetRoleState } = roleSlice.actions;

export default roleSlice.reducer;
