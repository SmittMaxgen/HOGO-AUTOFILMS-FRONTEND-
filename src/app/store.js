import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";
import adminReducer from "../feature/Admin/adminSlice";
import colorReducer from "../feature/color/colorSlice";
import materialReducer from "../feature/material/materialSlice";
import bannerReducer from "../feature/banner/bannerSlice";
import productReducer from "../feature/products/productSlice";
import categoryReducer from "../feature/category/categorySlice";
import costReducer from "../feature/cost/costSlice";
import shipmentReducer from "../feature/shipments/shipmentSlice";
import shipmentProductReducer from "../feature/shipmentProducts/shipmentProductSlice";
import inventorySerialReducer from "../feature/inventorySerials/inventorySerialsSlice";
import forgotPasswordReducer from "../feature/profileSettings/profileSettingsSlice";
import distributorReducer from "../feature/distributors/distributorSlice";
import warrantyReducer from "../feature/Warranty/warrantySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    banner: bannerReducer,
    color: colorReducer,
    material: materialReducer,
    product: productReducer,
    category: categoryReducer,
    cost: costReducer,
    shipment: shipmentReducer,
    shipmentProduct: shipmentProductReducer,
    inventorySerial: inventorySerialReducer,
    forgotPassword: forgotPasswordReducer,
    distributor: distributorReducer,
    warranty: warrantyReducer,
  },
});
