import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./authThunks";

// const initialState = {
//   user: null,
//   token: null,
//   loading: false,
//   error: null,
//   isAuthenticated: false,
// };

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // logout(state) {
    //   state.user = null;
    //   state.token = null;
    //   state.isAuthenticated = false;
    // },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // ⏳ Pending
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // ✅ Success
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        console.log("action:::::", action);
        localStorage.setItem("token", action.payload.access_token);
      })

      // ❌ Error
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
