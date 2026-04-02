import { createSlice } from "@reduxjs/toolkit";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "./contactThunks";

const initialState = {
  contacts: [],
  loading: false,
  error: null,

  createLoading: false,
  createSuccess: false,

  updateLoading: false,
  updateSuccess: false,

  deleteLoading: false,
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    resetContactStatus: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= GET =================
      .addCase(getContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(getContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= CREATE =================
      .addCase(createContact.pending, (state) => {
        state.createLoading = true;
        state.createSuccess = false;
      })
      .addCase(createContact.fulfilled, (state) => {
        state.createLoading = false;
        state.createSuccess = true;
      })
      .addCase(createContact.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      // ================= UPDATE =================
      .addCase(updateContact.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
      })
      .addCase(updateContact.fulfilled, (state) => {
        state.updateLoading = false;
        state.updateSuccess = true;
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // ================= DELETE =================
      .addCase(deleteContact.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.contacts = state.contacts.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetContactStatus } = contactsSlice.actions;
export default contactsSlice.reducer;
