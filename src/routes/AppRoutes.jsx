import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Banner from "../pages/banner/Banner";
import Color from "../pages/color/color";
import Material from "../pages/material/Material";
import Category from "../pages/category/Category";
import Product from "../pages/product/Products";
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
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
