import { createSlice } from "@reduxjs/toolkit";
import {
  getQuotes,
  createQuote,
  updateQuote,
  deleteQuote,
} from "./quotesThunks";

const initialState = {
  quotes: [],
  loading: false,
  error: null,

  createLoading: false,
  createSuccess: false,

  updateLoading: false,
  updateSuccess: false,

  deleteLoading: false,
};

const quotesSlice = createSlice({
  name: "quotes",
  initialState,
  reducers: {
    resetQuoteStatus: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= GET =================
      .addCase(getQuotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getQuotes.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes = action.payload;
      })
      .addCase(getQuotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= CREATE =================
      .addCase(createQuote.pending, (state) => {
        state.createLoading = true;
        state.createSuccess = false;
      })
      .addCase(createQuote.fulfilled, (state) => {
        state.createLoading = false;
        state.createSuccess = true;
      })
      .addCase(createQuote.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      // ================= UPDATE =================
      .addCase(updateQuote.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
      })
      .addCase(updateQuote.fulfilled, (state) => {
        state.updateLoading = false;
        state.updateSuccess = true;
      })
      .addCase(updateQuote.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // ================= DELETE =================
      .addCase(deleteQuote.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteQuote.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.quotes = state.quotes.filter((q) => q.id !== action.payload);
      })
      .addCase(deleteQuote.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetQuoteStatus } = quotesSlice.actions;
export default quotesSlice.reducer;
