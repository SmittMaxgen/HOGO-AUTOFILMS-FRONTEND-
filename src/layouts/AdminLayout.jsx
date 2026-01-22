import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../feature/auth/authSlice";
import { Box, Typography, Avatar, Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";

import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    minHeight: "100vh",
  },
  sidebar: {
    width: 200,
    backgroundColor: "#F3A5A7",
    padding: "1rem",
  },
  profileBox: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  avatar: {
    backgroundColor: "#E74B4E",
    margin: "0 auto 0.5rem",
  },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    padding: "0.75rem 1rem",
    borderRadius: 8,
    cursor: "pointer",
    marginBottom: 8,
    fontWeight: 500,
    transition: "0.2s ease",
    "&:hover": {
      backgroundColor: "#ED787A",
    },
    "& svg": {
      marginRight: 10,
    },
  },
  activeItem: {
    backgroundColor: "#E74B4E",
    color: "#fff",
    "& svg": {
      color: "#fff",
    },
  },
  content: {
    flex: 1,
    padding: "2rem",
    backgroundColor: "#fff",
  },
}));

const AdminLayout = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const admin = useSelector((state) => state.auth.user);

  // 🔹 Active tab (localStorage fallback)
  const [activePath, setActivePath] = useState(
    localStorage.getItem("activeTab") || location.pathname,
  );

  // 🔹 Keep active tab in sync with URL
  useEffect(() => {
    setActivePath(location.pathname);
    localStorage.setItem("activeTab", location.pathname);
  }, [location.pathname]);

  // 🔹 Redirect ONLY if user lands on "/"
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");

    if (location.pathname === "/" && savedTab) {
      navigate(savedTab, { replace: true });
    }
  }, []); // run once on mount

  const isActive = (path) => activePath.startsWith(path);

  const handleNavigate = (path) => {
    setActivePath(path);
    localStorage.setItem("activeTab", path);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("activeTab");
    dispatch(logout());
  };

  return (
    <Box className={classes.root}>
      {/* SIDEBAR */}
      <Box className={classes.sidebar}>
        <Box className={classes.profileBox}>
          <Avatar className={classes.avatar}>{admin?.name?.[0] || "A"}</Avatar>
          <Typography fontWeight={600}>{admin?.name}</Typography>
          <Typography variant="body2">{admin?.email}</Typography>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <Box
          className={`${classes.sidebarItem} ${
            isActive("/dashboard") ? classes.activeItem : ""
          }`}
          onClick={() => handleNavigate("/dashboard")}
        >
          <DashboardIcon /> Dashboard
        </Box>

        <Box
          className={`${classes.sidebarItem} ${
            isActive("/products") ? classes.activeItem : ""
          }`}
          onClick={() => handleNavigate("/products")}
        >
          <InventoryIcon /> Products
        </Box>

        <Box
          className={`${classes.sidebarItem} ${
            isActive("/banners") ? classes.activeItem : ""
          }`}
          onClick={() => handleNavigate("/banners")}
        >
          <CategoryIcon /> Banners
        </Box>

        <Box
          className={`${classes.sidebarItem} ${
            isActive("/colors") ? classes.activeItem : ""
          }`}
          onClick={() => handleNavigate("/colors")}
        >
          <SubdirectoryArrowRightIcon /> Colors
        </Box>

        <Box
          className={`${classes.sidebarItem} ${
            isActive("/materials") ? classes.activeItem : ""
          }`}
          onClick={() => handleNavigate("/materials")}
        >
          <ShoppingBagIcon /> Materials
        </Box>

        <Divider sx={{ mt: 1 }} />

        <Box className={classes.sidebarItem} onClick={handleLogout}>
          <AccountCircleIcon style={{ color: "red" }} />{" "}
          <p style={{ color: "red" }}> Logout</p>
        </Box>
      </Box>

      {/* PAGE CONTENT */}
      <Box className={classes.content}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
