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
import HogoLogo from "../../public/hogoAFM.png";
import { AdminUser } from "../feature/Admin/adminThunks";
import { selectAdminList } from "../feature/Admin/adminSelector";

const SIDEBAR_BG = "#7E7E7E";
const ACTIVE_BG = "#D20000";
const ACTIVE_HOVER = "#ED3434";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
  },

  sidebar: {
    width: 240,
    backgroundColor: SIDEBAR_BG,
    color: "#fff",
    padding: "1.2rem",
    display: "flex",
    flexDirection: "column",
  },

  profileBox: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },

  avatar: {
    width: 56,
    height: 56,
    margin: "0 auto 0.5rem",
    backgroundColor: ACTIVE_BG,
    fontSize: "1.4rem",
    fontWeight: 600,
  },

  adminName: {
    fontWeight: 600,
    fontSize: "1rem",
  },

  adminEmail: {
    fontSize: "0.8rem",
    opacity: 0.85,
  },

  divider: {
    backgroundColor: "rgba(255,255,255,0.2)",
    margin: "12px 0",
  },

  /* ---------- MENU ITEM ---------- */
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 500,
    marginBottom: 6,
    transition: "all 0.25s ease",
    "& svg": {
      fontSize: 20,
      opacity: 0.9,
    },
    "&:hover": {
      backgroundColor: ACTIVE_HOVER,
    },
  },

  activeItem: {
    backgroundColor: ACTIVE_BG,
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
    "&:hover": {
      backgroundColor: ACTIVE_BG,
    },
  },

  spacer: {
    flexGrow: 1,
  },

  logoutBox: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
    transition: "0.25s",
    "&:hover": {
      backgroundColor: "#ED3434",
    },
  },

  logoAvatar: {
    width: 36,
    height: 36,
    backgroundColor: "#fff",
    "& img": {
      width: "70%",
      height: "70%",
      objectFit: "contain",
    },
  },

  logoutText: {
    fontWeight: 500,
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

  const [activePath, setActivePath] = useState(
    localStorage.getItem("activeTab") || location.pathname,
  );
  const adminList = useSelector(selectAdminList);
  useEffect(() => {
    setActivePath(location.pathname);
    localStorage.setItem("activeTab", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (location.pathname === "/" && savedTab) {
      navigate(savedTab, { replace: true });
    }
  }, []);

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
  useEffect(() => {
    dispatch(AdminUser());
  }, [dispatch]);
  return (
    <Box className={classes.root}>
      {/* SIDEBAR */}
      <Box className={classes.sidebar}>
        <Box className={classes.profileBox}>
          <Avatar className={classes.avatar}>
            {adminList?.name?.[0] || "A"}
          </Avatar>
          <Typography className={classes.adminName}>
            {adminList?.name}
          </Typography>
          <Typography className={classes.adminEmail}>
            {adminList?.email}
          </Typography>
        </Box>

        <Divider className={classes.divider} />

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
            isActive("/category") ? classes.activeItem : ""
          }`}
          onClick={() => handleNavigate("/category")}
        >
          <CategoryIcon /> Category
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
            isActive("/colour") ? classes.activeItem : ""
          }`}
          onClick={() => handleNavigate("/colour")}
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

        <Box className={classes.spacer} />

        <Divider className={classes.divider} />

        <Box className={classes.logoutBox} onClick={handleLogout}>
          <Avatar className={classes.logoAvatar}>
            <img src={HogoLogo} alt="Hogo Logo" />
          </Avatar>
          <Typography className={classes.logoutText}>Logout</Typography>
        </Box>
      </Box>

      {/* CONTENT */}
      <Box className={classes.content}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
