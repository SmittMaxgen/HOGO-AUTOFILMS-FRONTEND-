import { createSlice } from "@reduxjs/toolkit";
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
} from "./leadThunks";

const initialState = {
  leads: [],
  loading: false,
  error: null,

  createLoading: false,
  createSuccess: false,

  updateLoading: false,
  updateSuccess: false,

  deleteLoading: false,
};

const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    resetLeadStatus: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= GET =================
      .addCase(getLeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(getLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= CREATE =================
      .addCase(createLead.pending, (state) => {
        state.createLoading = true;
        state.createSuccess = false;
      })
      .addCase(createLead.fulfilled, (state) => {
        state.createLoading = false;
        state.createSuccess = true;
      })
      .addCase(createLead.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      // ================= UPDATE =================
      .addCase(updateLead.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
      })
      .addCase(updateLead.fulfilled, (state) => {
        state.updateLoading = false;
        state.updateSuccess = true;
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // ================= DELETE =================
      .addCase(deleteLead.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.leads = state.leads.filter(
          (l) => l.id !== action.payload,
        );
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetLeadStatus } = leadsSlice.actions;
export default leadsSlice.reducer;
