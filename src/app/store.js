import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";
import adminReducer from "../feature/Admin/adminSlice";
import colorReducer from "../feature/color/colorSlice";
import materialReducer from "../feature/material/materialSlice";
import bannerReducer from "../feature/banner/bannerSlice";
import productReducer from "../feature/products/productSlice";
import categoryReducer from "../feature/category/categorySlice";
import costReducer from "../feature/cost/costSlice";
import purchaseOrderReducer from "../feature/purchaseOrder/purchaseOrderSlice";
import shipmentReducer from "../feature/shipments/shipmentSlice";
import shipmentProductReducer from "../feature/shipmentProducts/shipmentProductSlice";
import inventorySerialReducer from "../feature/inventorySerials/inventorySerialsSlice";
import forgotPasswordReducer from "../feature/profileSettings/profileSettingsSlice";
import distributorReducer from "../feature/distributors/distributorSlice";
import warrantyReducer from "../feature/Warranty/warrantySlice";
import userReducer from "../feature/users/userSlice";
import leadsReducer from "../feature/leads/leadSlice";
import roleReducer from "../feature/role/roleSlice";
import departmentReducer from "../feature/department/departmentSlice";
import employeeSalaryReducer from "../feature/employeeSalary/employeeSalarySlice";
import employeeReducer from "../feature/employee/employeeSlice";
import employeeDocumentsReducer from "../feature/employeeDocuments/employeeDocumentsSlice";
import employeePersonalDetailsReducer from "../feature/employeePersonalDetails/employeePersonalDetailsSlice";
import warehouseReducer from "../feature/warehouse/warehouseSlice";
import locationReducer from "../feature/location/locationSlice";
import visitReducer from "../feature/visit/visitSlice";

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
    user: userReducer,
    employee: employeeReducer,
    employeeSalary: employeeSalaryReducer,
    employeeDocuments: employeeDocumentsReducer,
    employeePersonalDetails: employeePersonalDetailsReducer,
    department: departmentReducer,
    role: roleReducer,
    purchaseOrder: purchaseOrderReducer,
    leads: leadsReducer,
    employeeSalary: employeeSalaryReducer,
    warehouse: warehouseReducer,
    location: locationReducer,
    visit: visitReducer,
  },
});
