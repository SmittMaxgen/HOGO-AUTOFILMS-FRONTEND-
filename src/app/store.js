import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";
import adminReducer from "../feature/Admin/adminSlice";
import colorReducer from "../feature/color/colorSlice";
import materialReducer from "../feature/material/materialSlice";
import bannerReducer from "../feature/banner/bannerSlice";
import productReducer from "../feature/products/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    banner: bannerReducer,
    color: colorReducer,
    material: materialReducer,
    product: productReducer,
  },
});
