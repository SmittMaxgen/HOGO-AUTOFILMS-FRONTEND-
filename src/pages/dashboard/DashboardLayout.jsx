// src/pages/dashboard/DashboardLayout.jsx
import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Dashboard from "./Dashboard";

const DashboardLayout = () => {
  return (
    <Box display="flex">
      {/* Sidebar + Header are inside Dashboard */}
      <Dashboard />

      {/* Page Content */}
      <Outlet />
    </Box>
  );
};

export default DashboardLayout;
