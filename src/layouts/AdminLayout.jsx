// import React, { useEffect, useState } from "react";
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../feature/auth/authSlice";
// import { Box, Typography, Avatar, Divider } from "@mui/material";
// import { makeStyles } from "@mui/styles";

// import DashboardIcon from "@mui/icons-material/Dashboard";
// import CategoryIcon from "@mui/icons-material/Category";
// import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
// import HogoLogo from "../../public/hogoAFM.png";
// import { AdminUser } from "../feature/Admin/adminThunks";
// import { selectAdminList } from "../feature/Admin/adminSelector";

// import DarkModeIcon from "@mui/icons-material/DarkMode";
// import LightModeIcon from "@mui/icons-material/LightMode";
// import IconButton from "@mui/material/IconButton";

// const SIDEBAR_BG = "#7E7E7E";
// const ACTIVE_BG = "#D20000";
// const ACTIVE_HOVER = "#ED3434";

// const useStyles = makeStyles(() => ({
//   root: {
//     display: "flex",
//     minHeight: "100vh",
//     // backgroundColor: "#f4f6f8",
//   },

//   sidebar: {
//     width: 270,
//     backgroundColor: SIDEBAR_BG,
//     // color: "#fff",
//     padding: "1.2rem",
//     display: "flex",
//     flexDirection: "column",
//   },

//   profileBox: {
//     textAlign: "center",
//     marginBottom: "1.5rem",
//   },

//   avatar: {
//     width: 56,
//     height: 56,
//     margin: "0 auto 0.5rem",
//     backgroundColor: ACTIVE_BG,
//     fontSize: "1.4rem",
//     fontWeight: 600,
//   },

//   adminName: {
//     fontWeight: 600,
//     fontSize: "1rem",
//   },

//   adminEmail: {
//     fontSize: "0.8rem",
//     opacity: 0.85,
//   },

//   divider: {
//     backgroundColor: "rgba(255,255,255,0.2)",
//     margin: "12px 0",
//   },

//   /* ---------- MENU ITEM ---------- */
//   sidebarItem: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     padding: "10px 14px",
//     borderRadius: 10,
//     cursor: "pointer",
//     fontSize: "0.95rem",
//     fontWeight: 500,
//     marginBottom: 6,
//     transition: "all 0.25s ease",
//     "& svg": {
//       fontSize: 20,
//       opacity: 0.9,
//     },
//     "&:hover": {
//       backgroundColor: ACTIVE_HOVER,
//     },
//   },

//   activeItem: {
//     backgroundColor: ACTIVE_BG,
//     boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
//     "&:hover": {
//       backgroundColor: ACTIVE_BG,
//     },
//   },

//   spacer: {
//     flexGrow: 1,
//   },

//   logoutBox: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     padding: "10px 14px",
//     borderRadius: 10,
//     cursor: "pointer",
//     transition: "0.25s",
//     "&:hover": {
//       backgroundColor: "#ED3434",
//     },
//   },

//   logoAvatar: {
//     width: 36,
//     height: 36,
//     // backgroundColor: "#fff",
//     "& img": {
//       width: "70%",
//       height: "70%",
//       objectFit: "contain",
//     },
//   },

//   logoutText: {
//     fontWeight: 500,
//   },

//   content: {
//     flex: 1,
//     padding: "2rem",
//     // backgroundColor: "#fff",
//   },
// }));

// const AdminLayout = ({ toggleTheme, mode }) => {
//   const classes = useStyles();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const admin = useSelector((state) => state.auth.user);

//   const [activePath, setActivePath] = useState(
//     localStorage.getItem("activeTab") || location.pathname,
//   );
//   const adminList = useSelector(selectAdminList);
//   useEffect(() => {
//     setActivePath(location.pathname);
//     localStorage.setItem("activeTab", location.pathname);
//   }, [location.pathname]);

//   useEffect(() => {
//     const savedTab = localStorage.getItem("activeTab");
//     if (location.pathname === "/" && savedTab) {
//       navigate(savedTab, { replace: true });
//     }
//   }, []);

//   const isActive = (path) => activePath.startsWith(path);

//   const handleNavigate = (path) => {
//     setActivePath(path);
//     localStorage.setItem("activeTab", path);
//     navigate(path);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("activeTab");
//     dispatch(logout());
//   };
//   useEffect(() => {
//     dispatch(AdminUser());
//   }, [dispatch]);
//   return (
//     <Box className={classes.root}>
//       {/* SIDEBAR */}
//       <Box className={classes.sidebar}>
//         <Box className={classes.profileBox}>
//           <Avatar className={classes.avatar}>
//             {adminList?.name?.[0] || "A"}
//           </Avatar>
//           <Typography className={classes.adminName}>
//             {adminList?.name}
//           </Typography>
//           <Typography className={classes.adminEmail}>
//             {adminList?.email}
//           </Typography>
//         </Box>

//         <Divider className={classes.divider} />

//         <Box
//           className={`${classes.sidebarItem} ${
//             isActive("/dashboard") ? classes.activeItem : ""
//           }`}
//           onClick={() => handleNavigate("/dashboard")}
//         >
//           <DashboardIcon /> Dashboard
//         </Box>

//         <Box
//           className={`${classes.sidebarItem} ${
//             isActive("/products") ? classes.activeItem : ""
//           }`}
//           onClick={() => handleNavigate("/products")}
//         >
//           <InventoryIcon /> Products
//         </Box>

//         <Box
//           className={`${classes.sidebarItem} ${
//             isActive("/category") ? classes.activeItem : ""
//           }`}
//           onClick={() => handleNavigate("/category")}
//         >
//           <CategoryIcon /> Category
//         </Box>

//         <Box
//           className={`${classes.sidebarItem} ${
//             isActive("/banners") ? classes.activeItem : ""
//           }`}
//           onClick={() => handleNavigate("/banners")}
//         >
//           <CategoryIcon /> Banners
//         </Box>

//         <Box
//           className={`${classes.sidebarItem} ${
//             isActive("/colour") ? classes.activeItem : ""
//           }`}
//           onClick={() => handleNavigate("/colour")}
//         >
//           <SubdirectoryArrowRightIcon /> Colors
//         </Box>

//         <Box
//           className={`${classes.sidebarItem} ${
//             isActive("/materials") ? classes.activeItem : ""
//           }`}
//           onClick={() => handleNavigate("/materials")}
//         >
//           <ShoppingBagIcon /> Materials
//         </Box>

//         <Box className={classes.spacer} />

//         <Divider className={classes.divider} />
//         <Box display="flex" justifyContent="center" mb={1}>
//           <IconButton onClick={toggleTheme} sx={{ color: "#fff" }}>
//             {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
//           </IconButton>
//         </Box>

//         <Box className={classes.logoutBox} onClick={handleLogout}>
//           <Avatar className={classes.logoAvatar}>
//             <img src={HogoLogo} alt="Hogo Logo" />
//           </Avatar>
//           <Typography className={classes.logoutText}>Logout</Typography>
//         </Box>
//       </Box>

//       {/* CONTENT */}
//       <Box className={classes.content}>
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default AdminLayout;
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../feature/auth/authSlice";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
// import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import ImageIcon from "@mui/icons-material/Image";

// import DarkModeIcon from "@mui/icons-material/DarkMode";
// import LightModeIcon from "@mui/icons-material/LightMode";

import HogoLogo from "../../public/hogoAFM.png";
import { AdminUser } from "../feature/Admin/adminThunks";
import { selectAdminList } from "../feature/Admin/adminSelector";

const SIDEBAR_BG = "#050622";
const ACTIVE_BG = "#D20000";
const ACTIVE_HOVER = "#ED3434";

const useStyles = makeStyles(() => ({
  root: {
    // position: "fixed",
    display: "flex",
    minHeight: "100vh",
  },
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    backgroundColor: SIDEBAR_BG,
    padding: "1.2rem",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.3s ease",
    boxShadow: "4px 0 15px rgba(0, 0, 0, 0.2)",
    zIndex: 1200,
  },

  sidebarExpanded: {
    width: 270,
  },

  sidebarCollapsed: {
    width: 80,
    alignItems: "center",
  },

  toggleBtn: {
    alignSelf: "flex-end",
    color: ACTIVE_BG,
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
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#ffffff",
    lineHeight: 1.2,
    letterSpacing: "0.3px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  adminRole: {
    fontSize: "0.72rem",
    fontWeight: 500,
    color: "rgba(255,255,255,0.65)",
    marginTop: 2,
  },

  adminEmail: {
    fontSize: "0.8rem",
    opacity: 0.85,
  },

  divider: {
    width: "auto",
    backgroundColor: "rgba(255, 255, 255, 1)",
    margin: "12px 0",
    marginBottom: "7px",
  },

  sidebarItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    borderRadius: 10,
    color: "whitesmoke",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 500,
    marginBottom: 6,
    transition: "all 0.25s ease",
    "& svg": {
      fontSize: 20,
    },
    "&:hover": {
      backgroundColor: ACTIVE_HOVER,
    },
  },

  activeItem: {
    backgroundColor: ACTIVE_BG,
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
    "&:hover": {
      backgroundColor: "#ED3434",
    },
  },

  logoAvatar: {
    width: 36,
    height: 36,
    "& img": {
      width: "70%",
      height: "70%",
      objectFit: "contain",
    },
  },

  content: {
    flex: 1,
    marginLeft: 270, // expanded sidebar width
    padding: "2rem",
    height: "100vh",
    overflowY: "auto",
    transition: "margin-left 0.3s ease",
  },
  header: {
    height: 64,
    backgroundColor: "#ffffff",
    color: "#111",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    zIndex: 1100,
  },

  searchBox: {
    position: "relative",
    left: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f1f3f4",
    padding: "6px 12px",
    borderRadius: 10,
    width: 360,
    gap: 8,
  },
  headerLeft: {
    display: "flex",
    justifyContent: "space-between",
  },
  headerRight: {
    color: "white",
  },
  searchInput: {
    flex: 1,
    fontSize: "0.9rem",
  },
  suggestionBox: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    zIndex: 999,
    maxHeight: 200,
    overflowY: "auto",
  },
}));

const AdminLayout = ({ toggleTheme, mode }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const adminList = useSelector(selectAdminList);
  const [collapsed, setCollapsed] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const [activePath, setActivePath] = useState(
    localStorage.getItem("activeTab") || location.pathname,
  );

  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const pages = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Products", path: "/products" },
    { label: "Category", path: "/category" },
    { label: "Banner", path: "/banners" },
    { label: "Material", path: "/materials" },
    { label: "Cost", path: "/costs" },
    { label: "Shipment", path: "/shipments" },
    { label: "Shipment Products", path: "/shipments_products" },
    { label: "Distributors", path: "/distributor-information" },
  ];
  // Filter pages by search query
  const filteredPages = pages.filter((p) =>
    p.label.toLowerCase().includes(query.toLowerCase()),
  );

  // const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    dispatch(AdminUser());
  }, [dispatch]);

  useEffect(() => {
    setActivePath(location.pathname);
    localStorage.setItem("activeTab", location.pathname);
  }, [location.pathname]);

  useEffect(() => {}, []);
  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleNavigate = (path) => {
    setActivePath(path);
    localStorage.setItem("activeTab", path);
    navigate(path);
  };
  const handleSelect = (e, path) => {
    e.stopPropagation();
    navigate(path);
    setQuery("");
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("activeTab");
    dispatch(logout());
    handleNavigate("/login");
  };

  return (
    <Box className={classes.root}>
      {/* SIDEBAR */}
      <Box
        className={`${classes.sidebar} ${
          collapsed ? classes.sidebarCollapsed : classes.sidebarExpanded
        }`}
      >
        {/* <Divider className={classes.divider} /> */}

        {/* PROFILE */}
        {!collapsed && (
          <>
            <Box className={classes.profileBox}>
              <Avatar className={classes.avatar}>
                {adminList?.name?.[0] || "A"}
              </Avatar>
              <Box>
                <Typography className={classes.adminName}>
                  {adminList?.name || "Admin User"}
                </Typography>
                <Typography className={classes.adminRole}>
                  Administrator
                </Typography>
              </Box>
            </Box>
            {/* <Divider className={classes.divider} /> */}
          </>
        )}

        {/* MENU */}
        <Box
          className={`${classes.sidebarItem} ${
            isActive("/dashboard") ? classes.activeItem : ""
          }`}
          onClick={() => handleNavigate("/dashboard")}
        >
          <DashboardIcon />
          {!collapsed && "Dashboard"}
        </Box>

        <Box
          className={`${classes.sidebarItem} ${
            isActive("/products") ? classes.activeItem : ""
          }`}
          onClick={() => handleNavigate("/products")}
        >
          <InventoryIcon />
          {!collapsed && "Products"}
        </Box>

        <Box
          className={`${classes.sidebarItem} ${
            isActive("/category") ? classes.activeItem : ""
          }`}
          onClick={() => handleNavigate("/category")}
        >
          <CategoryIcon />
          {!collapsed && "Category"}
        </Box>

        <Box
          className={`${classes.sidebarItem} ${
            isActive("/banners") ? classes.activeItem : ""
          }`}
          onClick={() => handleNavigate("/banners")}
        >
          <ImageIcon />
          {!collapsed && "Banners"}
        </Box>

        <Box
          className={`${classes.sidebarItem} ${
            isActive("/colour") ? classes.activeItem : ""
          }`}
          onClick={() => handleNavigate("/colour")}
        >
          <SubdirectoryArrowRightIcon />
          {!collapsed && "Colors"}
        </Box>

        <Box
          className={`${classes.sidebarItem} ${
            isActive("/materials") ? classes.activeItem : ""
          }`}
          onClick={() => handleNavigate("/materials")}
        >
          <ShoppingBagIcon />
          {!collapsed && "Materials"}
        </Box>

        <Box
          className={`${classes.sidebarItem} ${
            isActive("/costs") ? classes.activeItem : ""
          }`}
          onClick={() => handleNavigate("/costs")}
        >
          <CurrencyRupeeIcon />
          {!collapsed && "Costs"}
        </Box>

        <Box
          className={`${classes.sidebarItem} ${isActive("/shipments") ? classes.activeItem : ""}`}
          onClick={() => handleNavigate("/shipments")}
        >
          <LocalShippingIcon />
          {!collapsed && "Shipments"}
        </Box>

        <Box
          className={`${classes.sidebarItem} ${
            isActive("/shipments_products") ? classes.activeItem : ""
          }`}
          onClick={() => handleNavigate("/shipments_products")}
        >
          <Inventory2Icon />
          {!collapsed && "Shipment Products"}
        </Box>

        <Box
          className={`${classes.sidebarItem} ${
            isActive("/distributor-information") ? classes.activeItem : ""
          }`}
          onClick={() => handleNavigate("/distributor-information")}
        >
          <BusinessIcon />
          {!collapsed && "Distributor"}
        </Box>

        <Box className={classes.spacer} />

        {/* <Divider className={classes.divider} /> */}

        {/* THEME TOGGLE */}
        {/* <Box display="flex" justifyContent="center"> */}
        {/* <IconButton onClick={toggleTheme} sx={{ color: "#fff" }}>
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton> */}
        {/* </Box> */}

        {/* LOGOUT */}
        {/* <Box className={classes.sidebarItem} onClick={handleLogout}>
          <Avatar className={classes.logoAvatar}>
            <img src={HogoLogo} alt="Hogo Logo" />
          </Avatar>
          {!collapsed && <Typography>Logout</Typography>}
        </Box> */}
      </Box>

      {/* CONTENT */}
      {/* <Box className={classes.content}>
        <Outlet />
      </Box> */}
      {/* HEADER */}
      <AppBar
        position="fixed"
        // className={classes.header}
        sx={{
          left: collapsed ? 80 : 270,
          width: `calc(100% - ${collapsed ? 80 : 270}px)`,
          background: "#0d0e36",
          transition: "left 0.3s ease, width 0.3s ease", // <-- Add this line
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* SEARCH */}
          <Box className={classes.headerLeft}>
            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              sx={{
                // position: "absolute",
                width: 36,
                height: 36,
                mb: 0.5,
                alignSelf: collapsed ? "center" : "flex-end",
                color: "#fff",
                borderRadius: "50%",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                transition: "all 0.25s ease",
                "&:hover": {
                  backgroundColor: "#ED3434",
                  transform: "scale(1.05)",
                },
              }}
            >
              {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
            <Box className={classes.searchBox}>
              <SearchIcon fontSize="small" style={{ color: "grey" }} />
              <InputBase
                style={{ color: "grey", height: "2px" }}
                placeholder="Search or type …"
                className={classes.searchInput}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                // onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {/* <Typography variant="caption">⌘K</Typography> */}

              {/* Dropdown suggestions */}
              {showSuggestions && query && (
                <Box className={classes.suggestionBox}>
                  {filteredPages.length > 0 ? (
                    filteredPages.map((p) => (
                      <ListItem key={p.path} disablePadding>
                        <ListItemButton
                          style={{ color: "grey" }}
                          // onClick={(e) => handleSelect(e, p.path)}
                          onClick={(e) => handleSelect(e, p.path)}
                        >
                          <p style={{ color: "grey" }}>{p.label}</p>
                        </ListItemButton>
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <Typography
                        style={{ color: "grey" }}
                        variant="body2"
                        sx={{ p: 1 }}
                      >
                        No results found
                      </Typography>
                    </ListItem>
                  )}
                </Box>
              )}
            </Box>
          </Box>

          {/* RIGHT ACTIONS */}
          {/* <Box display="flex" alignItems="center" gap={1}>
            <IconButton sx={{ color: "white" }} onClick={toggleTheme}>
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            <IconButton sx={{ color: "white" }}>
              <Badge badgeContent={3} color="error">
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>

            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {adminList?.name?.[0] || "A"}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box> */}
          <Box display="flex" alignItems="center" gap={1}>
            {/* Theme toggle */}
            <IconButton style={{ color: "white" }} onClick={toggleTheme}>
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* Notifications */}
            <IconButton style={{ color: "white" }}>
              <Badge badgeContent={3} color="error">
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>

            {/* Avatar */}
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar src={adminList?.avatar} sx={{ width: 34, height: 34 }}>
                {adminList?.name?.[0] || "A"}
              </Avatar>
            </IconButton>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                sx: {
                  width: 240,
                  borderRadius: 3,
                  mt: 1.5,
                  p: 1,
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {/* User info */}
              <Box px={2} py={1}>
                <Typography fontWeight={600}>
                  {adminList?.name || "Admin User"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {adminList?.email || "admin@example.com"}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <MenuItem onClick={() => handleNavigate("/profile")}>
                <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                Edit profile
              </MenuItem>
              {/* 
              <MenuItem onClick={() => handleNavigate("/account_settings")}>
                <SettingsOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                Account settings
              </MenuItem> */}

              <MenuItem>
                <HelpOutlineIcon fontSize="small" sx={{ mr: 1 }} />
                Support
              </MenuItem>

              <Divider sx={{ my: 1 }} />

              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                <LogoutOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                Sign out
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        className={classes.content}
        sx={{
          marginLeft: collapsed ? "80px" : "270px",
          marginTop: "64px",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
