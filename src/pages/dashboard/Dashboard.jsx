// import React from "react";
// import { useDispatch } from "react-redux";
// import { logout } from "../../feature/auth/authSlice";
// import { Box, Typography, Grid, Paper, Avatar, Divider } from "@mui/material";
// import { styled } from "@mui/system";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import CategoryIcon from "@mui/icons-material/Category";
// import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// const Sidebar = styled(Box)({
//   width: 250,
//   minHeight: "100vh",
//   backgroundColor: "#F3A5A7", // updated sidebar color
//   display: "flex",
//   flexDirection: "column",
//   padding: "1rem",
//   color: "#1F0405", // dark text/icons for contrast
// });

// const SidebarItem = styled(Box)({
//   display: "flex",
//   alignItems: "center",
//   padding: "0.75rem 1rem",
//   borderRadius: 8,
//   marginBottom: "0.5rem",
//   cursor: "pointer",
//   color: "#1F0405", // dark text
//   "&:hover": {
//     backgroundColor: "#ED787A", // slightly darker on hover
//   },
//   svg: {
//     color: "#1F0405", // dark icons
//   },
// });

// const DashboardCard = styled(Paper)(({ color }) => ({
//   padding: "1rem",
//   borderRadius: 12,
//   backgroundColor: color || "#f5f5f5",
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",
//   alignItems: "center",
//   minHeight: 100,
// }));

// const Dashboard = () => {
//   const dispatch = useDispatch();

//   const cards = [
//     { title: "Categories", count: 9, color: "#FCE9E9" },
//     { title: "Subcategories", count: 55, color: "#F9D2D3" },
//     { title: "Products", count: 10, color: "#F3A5A7" },
//     { title: "Total Orders", count: 5, color: "#ED787A" },
//     { title: "New Orders", count: 0, color: "#E74B4E" },
//     { title: "Pending Orders", count: 0, color: "#E01F22" },
//     { title: "Shipped Orders", count: 2, color: "#B4181B" },
//     { title: "Orders", count: 5, color: "#871214" },
//     { title: "Inquiries", count: 0, color: "#5A0C0E" },
//   ];

//   return (
//     <Box display="flex">
//       {/* Sidebar */}
//       <Sidebar>
//         <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
//           <Avatar sx={{ width: 60, height: 60, bgcolor: "#E74B4E" }}>M</Avatar>
//           <Typography variant="subtitle1" mt={1} sx={{ color: "#1F0405" }}>
//             Smit Trivedi
//           </Typography>
//           <Typography variant="body2" sx={{ color: "#871214" }}>
//             smitt533@gmail.com
//           </Typography>
//         </Box>
//         <Divider sx={{ mb: 2, borderColor: "#E01F22" }} />
//         <SidebarItem>
//           <DashboardIcon sx={{ mr: 1 }} /> Dashboard
//         </SidebarItem>
//         <SidebarItem>
//           <CategoryIcon sx={{ mr: 1 }} /> Category
//         </SidebarItem>
//         <SidebarItem>
//           <SubdirectoryArrowRightIcon sx={{ mr: 1 }} /> Subcategory
//         </SidebarItem>
//         <SidebarItem>
//           <InventoryIcon sx={{ mr: 1 }} /> Products
//         </SidebarItem>
//         <SidebarItem>
//           <ShoppingBagIcon sx={{ mr: 1 }} /> Order Management
//         </SidebarItem>
//         <Divider sx={{ mt: 2, mb: 2, borderColor: "#E01F22" }} />
//         <SidebarItem onClick={() => dispatch(logout())}>
//           <AccountCircleIcon sx={{ mr: 1 }} /> Logout
//         </SidebarItem>
//       </Sidebar>

//       {/* Main Dashboard */}
//       <Box flex={1} p={4} sx={{ backgroundColor: "#fff" }}>
//         <Typography variant="h4" mb={4}>
//           Dashboard Overview
//         </Typography>
//         <Grid container spacing={3}>
//           {cards.map((card, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <DashboardCard color={card.color}>
//                 <Typography
//                   variant="h6"
//                   sx={{
//                     color: [
//                       "#871214",
//                       "#5A0C0E",
//                       "#2D0607",
//                       "#1F0405",
//                     ].includes(card.color)
//                       ? "#fff"
//                       : "#000",
//                   }}
//                 >
//                   {card.title}
//                 </Typography>
//                 <Typography
//                   variant="h4"
//                   sx={{
//                     color: [
//                       "#871214",
//                       "#5A0C0E",
//                       "#2D0607",
//                       "#1F0405",
//                     ].includes(card.color)
//                       ? "#fff"
//                       : "#000",
//                   }}
//                 >
//                   {card.count}
//                 </Typography>
//               </DashboardCard>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../feature/auth/authSlice";
import { Box, Typography, Grid, Paper, Avatar, Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";

import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useEffect } from "react";
import { AdminUser } from "../../feature/Admin/adminThunks";
import {
  selectAdminList,
  selectAdminLoading,
} from "../../feature/Admin/adminSelector";
import { useNavigate } from "react-router-dom";

/* =======================
   STYLES
======================= */
const useStyles = makeStyles(() => ({
  sidebar: {
    width: 250,
    minHeight: "100vh",
    backgroundColor: "#F3A5A7",
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    color: "#1F0405",
  },

  sidebarItem: {
    display: "flex",
    alignItems: "center",
    padding: "0.75rem 1rem",
    borderRadius: 8,
    marginBottom: "0.5rem",
    cursor: "pointer",
    color: "#1F0405",

    "&:hover": {
      backgroundColor: "#ED787A",
    },

    "& svg": {
      color: "#1F0405",
      marginRight: 8,
    },
  },

  dashboardCard: {
    padding: "1rem",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 100,
  },

  main: {
    flex: 1,
    padding: "2rem",
    // backgroundColor: "#fff",
  },

  avatar: {
    width: 60,
    height: 60,
    backgroundColor: "#E74B4E",
  },

  divider: {
    borderColor: "#E01F22",
    margin: "1rem 0",
  },
}));

/* =======================
   COMPONENT
======================= */
const Dashboard = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const adminList = useSelector(selectAdminList);
  console.log("adminList:::", adminList);
  const adminLoading = useSelector(selectAdminLoading);

  const cards = [
    { title: "Categories", count: 9, color: "#FCE9E9" },
    { title: "Subcategories", count: 55, color: "#F9D2D3" },
    { title: "Products", count: 10, color: "#F3A5A7" },
    { title: "Total Orders", count: 5, color: "#ED787A" },
    { title: "New Orders", count: 0, color: "#E74B4E" },
    { title: "Pending Orders", count: 0, color: "#E01F22" },
    { title: "Shipped Orders", count: 2, color: "#B4181B" },
    { title: "Orders", count: 5, color: "#871214" },
    { title: "Inquiries", count: 0, color: "#5A0C0E" },
  ];
  // useEffect(() => {
  //   dispatch(AdminUser());
  // }, [dispatch]);

  return (
    <Box display="flex">
      {/* Sidebar */}

      {/* Main */}
      <Box className={classes.main}>
        <Typography variant="h4" mb={4}>
          Dashboard Overview
        </Typography>

        <Grid container spacing={3}>
          {/* {cards.map((card, index) => {
            const isDark = [
              "#871214",
              "#5A0C0E",
              "#2D0607",
              "#1F0405",
            ].includes(card.color);

            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  className={classes.dashboardCard}
                  style={{ backgroundColor: card.color }}
                >
                  <Typography
                    variant="h6"
                    style={{ color: isDark ? "#fff" : "#000" }}
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    style={{ color: isDark ? "#fff" : "#000" }}
                  >
                    {card.count}
                  </Typography>
                </Paper>
              </Grid>
            );
          })} */}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
