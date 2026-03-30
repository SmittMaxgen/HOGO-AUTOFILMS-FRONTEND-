import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Banner from "../pages/banner/Banner";
import Color from "../pages/color/color";
import Material from "../pages/material/Material";
import Category from "../pages/category/Category";
import Product from "../pages/product/Products";
import Cost from "../pages/cost/Cost";
import Shipment from "../pages/shipment/Shipment";
import ShipmentProducts from "../pages/shipmentProduct/ShipmentProduct";
import InventorySerial from "../pages/shipmentProduct/InventorySerial";
import Warranty from "../pages/warranty/Warranty";
import EmployeeManagement from "../pages/EmployeeManagement/EmployeeManagement";
import PurchaseOrder from "../pages/purchaseOrder/PurchaseOrder";
import Leads from "../pages/Lead/Lead";
import OfficeBranches from "../pages/officeBranches/OfficeBranches";
import Departments from "../pages/Department/Department";
import Roles from "../pages/role/Role";
import Warehouse from "../pages/warehouse/Warehouse";
import Location from "../pages/location/Location";
import Plans from "../pages/plan/Plans";
import LeaveBalance from "../pages/Leavebalance/Leavebalance";
import EmployeeAttendance from "../pages/EmployeeAttendance/EmployeeAttendance";
import Target from "../pages/target/Target";
import EditProfile from "../pages/auth/EditProfile";
import AccountSettings from "../pages/auth/AccountSettings";
import Distributors from "../pages/distributor/Distributor";

import ProtectedRoute from "./ProtectedRoutes";

import AdminLayout from "../layouts/AdminLayout";

const AppRoutes = ({ toggleTheme, mode }) => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout toggleTheme={toggleTheme} mode={mode} />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Product />} />
          <Route path="/banners" element={<Banner />} />
          <Route path="/colour" element={<Color />} />
          <Route path="/materials" element={<Material />} />
          <Route path="/category" element={<Category />} />
          <Route path="/costs" element={<Cost />} />
          <Route path="/shipments" element={<Shipment />} />
          <Route path="/shipments_products" element={<ShipmentProducts />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/account_settings" element={<AccountSettings />} />
          <Route path="/distributor-information" element={<Distributors />} />
          <Route path="/inventory_serials" element={<InventorySerial />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="/employee_management" element={<EmployeeManagement />} />
          <Route path="/purchase_order" element={<PurchaseOrder />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/office_branches" element={<OfficeBranches />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/location" element={<Location />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/leave-balance" element={<LeaveBalance />} />
          <Route path="/employee-attendance" element={<EmployeeAttendance />} />
          <Route path="/target" element={<Target />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
