// import { createSlice } from "@reduxjs/toolkit";
// import {
//   getEmployeeAttendances,
//   createEmployeeAttendance,
//   updateEmployeeAttendance,
//   deleteEmployeeAttendance,
// } from "./employeeAttendanceThunks";

// const initialState = {
//   list: [],
//   count: 0,
//   loading: false,
//   createLoading: false,
//   updateLoading: false,
//   deleteLoading: false,
//   success: false,
//   error: null,
// };

// const employeeAttendanceSlice = createSlice({
//   name: "employeeAttendance",
//   initialState,
//   reducers: {
//     clearEmployeeAttendanceState: (state) => {
//       state.list = [];
//       state.count = 0;
//       state.loading = false;
//       state.createLoading = false;
//       state.updateLoading = false;
//       state.deleteLoading = false;
//       state.success = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // ⏳ GET PENDING
//       .addCase(getEmployeeAttendances.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       // ✅ GET FULFILLED
//       .addCase(getEmployeeAttendances.fulfilled, (state, action) => {
//         state.loading = false;
//         state.list = action.payload?.data || [];
//         state.count = action.payload?.count || 0;
//       })
//       // ❌ GET REJECTED
//       .addCase(getEmployeeAttendances.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ⏳ CREATE PENDING
//       .addCase(createEmployeeAttendance.pending, (state) => {
//         state.createLoading = true;
//         state.error = null;
//         state.success = false;
//       })
//       // ✅ CREATE FULFILLED
//       .addCase(createEmployeeAttendance.fulfilled, (state, action) => {
//         state.createLoading = false;
//         state.success = true;
//         if (action.payload?.data) {
//           state.list.unshift(action.payload.data);
//           state.count += 1;
//         }
//       })
//       // ❌ CREATE REJECTED
//       .addCase(createEmployeeAttendance.rejected, (state, action) => {
//         state.createLoading = false;
//         state.success = false;
//         state.error = action.payload;
//       })

//       // ⏳ UPDATE PENDING
//       .addCase(updateEmployeeAttendance.pending, (state) => {
//         state.updateLoading = true;
//         state.error = null;
//         state.success = false;
//       })
//       // ✅ UPDATE FULFILLED
//       .addCase(updateEmployeeAttendance.fulfilled, (state, action) => {
//         state.updateLoading = false;
//         state.success = true;
//         if (action.payload?.data) {
//           const index = state.list.findIndex(
//             (att) => att.id === action.payload.data.id,
//           );
//           if (index !== -1) {
//             state.list[index] = action.payload.data;
//           }
//         }
//       })
//       // ❌ UPDATE REJECTED
//       .addCase(updateEmployeeAttendance.rejected, (state, action) => {
//         state.updateLoading = false;
//         state.success = false;
//         state.error = action.payload;
//       })

//       // ⏳ DELETE PENDING
//       .addCase(deleteEmployeeAttendance.pending, (state) => {
//         state.deleteLoading = true;
//         state.error = null;
//       })
//       // ✅ DELETE FULFILLED
//       .addCase(deleteEmployeeAttendance.fulfilled, (state, action) => {
//         state.deleteLoading = false;
//         if (action.meta.arg) {
//           state.list = state.list.filter((att) => att.id !== action.meta.arg);
//           state.count = Math.max(0, state.count - 1);
//         }
//       })
//       // ❌ DELETE REJECTED
//       .addCase(deleteEmployeeAttendance.rejected, (state, action) => {
//         state.deleteLoading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearEmployeeAttendanceState } = employeeAttendanceSlice.actions;
// export default employeeAttendanceSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
import {
  getEmployeeAttendances,
  createEmployeeAttendance,
  updateEmployeeAttendance,
  deleteEmployeeAttendance,
} from "./employeeAttendanceThunks";

const initialState = {
  list: [],
  count: 0,
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  success: false,
  error: null,
};

const employeeAttendanceSlice = createSlice({
  name: "employeeAttendance",
  initialState,
  reducers: {
    clearEmployeeAttendanceState: (state) => {
      state.list = [];
      state.count = 0;
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
      // ===== GET ATTENDANCES =====
      .addCase(getEmployeeAttendances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeAttendances.fulfilled, (state, action) => {
        state.loading = false;
        // Thunk already unwraps response.data?.data → so payload is the array directly
        state.list = Array.isArray(action.payload) ? action.payload : [];
        state.count = state.list.length;
      })
      .addCase(getEmployeeAttendances.rejected, (state, action) => {
        state.loading = false;
        state.list = [];
        state.error = action.payload;
      })

      // ===== CREATE ATTENDANCE =====
      .addCase(createEmployeeAttendance.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createEmployeeAttendance.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        // Prepend new record to list if it's a valid object
        if (
          action.payload &&
          typeof action.payload === "object" &&
          action.payload.id
        ) {
          state.list.unshift(action.payload);
          state.count += 1;
        }
      })
      .addCase(createEmployeeAttendance.rejected, (state, action) => {
        state.createLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ===== UPDATE ATTENDANCE =====
      .addCase(updateEmployeeAttendance.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateEmployeeAttendance.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;
        if (action.payload && action.payload.id) {
          const idx = state.list.findIndex((r) => r.id === action.payload.id);
          if (idx !== -1) state.list[idx] = action.payload;
        }
      })
      .addCase(updateEmployeeAttendance.rejected, (state, action) => {
        state.updateLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ===== DELETE ATTENDANCE =====
      .addCase(deleteEmployeeAttendance.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteEmployeeAttendance.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // Thunk returns the deleted id
        state.list = state.list.filter((r) => r.id !== action.payload);
        state.count = state.list.length;
      })
      .addCase(deleteEmployeeAttendance.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEmployeeAttendanceState } = employeeAttendanceSlice.actions;
export default employeeAttendanceSlice.reducer;
