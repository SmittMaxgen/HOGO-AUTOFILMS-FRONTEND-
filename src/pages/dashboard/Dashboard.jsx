// import React, { useEffect } from "react";
// import { Box, Typography, Grid, Paper } from "@mui/material";
// import { makeStyles } from "@mui/styles";
// import { useDispatch, useSelector } from "react-redux";
// import PeopleIcon from "@mui/icons-material/People";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// import { getProducts } from "../../feature/products/productThunks";
// import { getCategory } from "../../feature/category/categoryThunks";
// import { getBanners } from "../../feature/banner/bannerThunks";
// import { getMaterials } from "../../feature/material/materialThunks";
// import { getColors } from "../../feature/color/colorThunks";
// import { getCost } from "../../feature/cost/costThunks";
// import { getShipments } from "../../feature/shipments/shipmentThunks";
// import { getShipmentProducts } from "../../feature/shipmentProducts/shipmentProductThunks";
// import { getInventorySerials } from "../../feature/inventorySerials/inventorySerialsThunks";

// import { selectColors } from "../../feature/color/colorSelector";
// import { selectCostList } from "../../feature/cost/costSelector";
// import { selectBannerList } from "../../feature/banner/bannerSelector";
// import { selectShipmentOptions } from "../../feature/shipments/shipmentSelector";
// import { selectShipmentProductOptions } from "../../feature/shipmentProducts/shipmentProductSelector";
// import { selectInventorySerials } from "../../feature/inventorySerials/inventorySerialsSelector";

// const useStyles = makeStyles(() => ({
//   main: {
//     padding: "24px",
//   },

//   statCard: {
//     height: 140,
//     borderRadius: 18,
//     backgroundColor: "#fff !important",
//     border: "1px solid #E6EAF2",
//     padding: "18px 20px",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//   },

//   iconBox: {
//     width: 44,
//     height: 44,
//     borderRadius: 14,
//     backgroundColor: "#F1F5F9",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     "& svg": {
//       fontSize: 22,
//       color: "#0F172A",
//     },
//   },

//   title: {
//     fontSize: 15,
//     color: "#475569",
//     marginTop: 8,
//   },

//   value: {
//     fontSize: 28,
//     fontWeight: 700,
//     color: "#0F172A",
//     marginTop: 4,
//   },

//   bottomRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-end",
//   },

//   liveBadge: {
//     fontSize: 12,
//     fontWeight: 600,
//     padding: "4px 10px",
//     borderRadius: 999,
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 4,
//   },

//   liveUp: {
//     backgroundColor: "#E7F8EF",
//     color: "#16A34A",
//   },

//   liveDown: {
//     backgroundColor: "#FDECEC",
//     color: "#DC2626",
//   },
// }));

// const Dashboard = () => {
//   const classes = useStyles();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(getProducts());
//     dispatch(getCategory());
//     dispatch(getBanners());
//     dispatch(getMaterials());
//     dispatch(getColors());
//     dispatch(getCost());
//     dispatch(getShipments());
//     dispatch(getShipmentProducts());
//     dispatch(getInventorySerials());
//   }, [dispatch]);

//   const products = useSelector((state) => state.product?.list || []);
//   const categories = useSelector((state) => state.category?.list || []);
//   const banners = useSelector(selectBannerList);
//   const materials = useSelector((state) => state.material?.list || []);
//   const colors = useSelector(selectColors);
//   const costs = useSelector(selectCostList);
//   const shipments = useSelector(selectShipmentOptions);
//   const shipmentProducts = useSelector(selectShipmentProductOptions);
//   const inventorySerials = useSelector(selectInventorySerials);
//   const cards = [
//     {
//       title: "Materials",
//       value: materials.length,
//       icon: <PeopleIcon />,
//     },
//     {
//       title: "Costs",
//       value: costs.length,
//       icon: <BarChartIcon />,
//     },
//     {
//       title: "Colors",
//       value: colors.length,
//       icon: <PeopleIcon />,
//     },
//     {
//       title: "Categories",
//       value: categories?.data?.length || 0,
//       icon: <BarChartIcon />,
//     },
//     {
//       title: "Banners",
//       value: banners?.length,
//       icon: <PeopleIcon />,
//     },
//     {
//       title: "Shipments",
//       value: shipments?.length,
//       icon: <BarChartIcon />,
//     },
//     {
//       title: "Shipment Products",
//       value: shipmentProducts?.length,
//       icon: <PeopleIcon />,
//     },
//     {
//       title: "Inventory Serials",
//       value: inventorySerials?.length,
//       icon: <PeopleIcon />,
//     },
//   ];

//   return (
//     <Box className={classes.main}>
//       <Grid container spacing={3}>
//         {cards.map((card, index) => (
//           <Grid item xs={12} sm={6} md={3} key={index}>
//             <Paper elevation={0} className={classes.statCard}>
//               <Box className={classes.iconBox}>{card.icon}</Box>

//               <Box className={classes.bottomRow}>
//                 <Box>
//                   <Typography className={classes.title}>
//                     {card.title}
//                   </Typography>
//                   <Typography className={classes.value}>
//                     {card.value}
//                   </Typography>
//                 </Box>

//                 <Box
//                   className={`${classes.liveBadge} ${
//                     card.value > 0 ? classes.liveUp : classes.liveDown
//                   }`}
//                 >
//                   {card.value > 0 ? "↑ Live" : "↓ Live"}
//                 </Box>
//               </Box>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default Dashboard;
import React, { useEffect } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import CategoryIcon from "@mui/icons-material/Category";
import ImageIcon from "@mui/icons-material/Image";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import PaletteIcon from "@mui/icons-material/Palette";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import { getProducts } from "../../feature/products/productThunks";
import { getCategory } from "../../feature/category/categoryThunks";
import { getBanners } from "../../feature/banner/bannerThunks";
import { getMaterials } from "../../feature/material/materialThunks";
import { getColors } from "../../feature/color/colorThunks";
import { getCost } from "../../feature/cost/costThunks";
import { getShipments } from "../../feature/shipments/shipmentThunks";
import { getShipmentProducts } from "../../feature/shipmentProducts/shipmentProductThunks";
import { getInventorySerials } from "../../feature/inventorySerials/inventorySerialsThunks";

import { selectColors } from "../../feature/color/colorSelector";
import { selectCostList } from "../../feature/cost/costSelector";
import { selectBannerList } from "../../feature/banner/bannerSelector";
import { selectShipmentOptions } from "../../feature/shipments/shipmentSelector";
import { selectShipmentProductOptions } from "../../feature/shipmentProducts/shipmentProductSelector";
import { selectInventorySerials } from "../../feature/inventorySerials/inventorySerialsSelector";

// ─── Stat Card (outside component — no remount issues) ────────────────────────
const StatCard = ({ title, value, icon, accent }) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: 3,
      border: "1px solid #f0f0f0",
      p: 2.5,
      display: "flex",
      flexDirection: "column",
      gap: 2,
      bgcolor: "#fff",
      transition: "box-shadow 0.2s, transform 0.2s",
      "&:hover": {
        boxShadow: "0 8px 24px rgba(210,0,0,0.10)",
        transform: "translateY(-2px)",
      },
    }}
  >
    {/* Icon + badge row */}
    <Box
      sx={{
        width: 150,
        height: 44,
      }}
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <Box
        sx={{
          borderRadius: 2,
          bgcolor: accent + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "& svg": { fontSize: 22, color: accent },
        }}
      >
        {icon}
      </Box>
      <Box
        sx={{
          px: 1.2, py: 0.4, borderRadius: "999px",
          bgcolor: value > 0 ? "#e8f5e9" : "#fce4ec",
          border: `1px solid ${value > 0 ? "#c8e6c9" : "#ef9a9a"}`,
          display: "flex", alignItems: "center", gap: 0.5,
        }}
      >
        <Typography
          sx={{
            fontSize: 11, fontWeight: 700,
            color: value > 0 ? "#2e7d32" : "#c62828",
          }}
        >
          {value > 0 ? "↑ Live" : "↓ Empty"}
        </Typography>
      </Box>
    </Box>

    {/* Value + title */}
    <Box>
      <Typography
        sx={{ fontSize: 30, fontWeight: 800, color: "#1a1a1a", lineHeight: 1 }}
      >
        {value ?? 0}
      </Typography>
      <Typography
        sx={{ fontSize: 13, color: "#757575", mt: 0.5, fontWeight: 500 }}
      >
        {title}
      </Typography>
    </Box>

    {/* Bottom accent bar */}
    <Box
      sx={{
        height: 3,
        borderRadius: 2,
        bgcolor: accent + "30",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: value > 0 ? "100%" : "10%",
          bgcolor: accent,
          borderRadius: 2,
          transition: "width 0.8s ease",
        }}
      />
    </Box>
  </Paper>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategory());
    dispatch(getBanners());
    dispatch(getMaterials());
    dispatch(getColors());
    dispatch(getCost());
    dispatch(getShipments());
    dispatch(getShipmentProducts());
    dispatch(getInventorySerials());
  }, [dispatch]);

  const products = useSelector((state) => state.product?.list || []);
  const categories = useSelector((state) => state.category?.list || []);
  const banners = useSelector(selectBannerList);
  const materials = useSelector((state) => state.material?.list || []);
  const colors = useSelector(selectColors);
  const costs = useSelector(selectCostList);
  const shipments = useSelector(selectShipmentOptions);
  const shipmentProducts = useSelector(selectShipmentProductOptions);
  const inventorySerials = useSelector(selectInventorySerials);

  const cards = [
    {
      title: "Materials",
      value: materials?.length,
      icon: <PeopleIcon />,
      accent: "#D20000",
    },
    {
      title: "Costs",
      value: costs?.length,
      icon: <AttachMoneyIcon />,
      accent: "#1565c0",
    },
    {
      title: "Colors",
      value: colors?.length,
      icon: <PaletteIcon />,
      accent: "#7b1fa2",
    },
    {
      title: "Categories",
      value: categories?.data?.length || 0,
      icon: <CategoryIcon />,
      accent: "#e65100",
    },
    {
      title: "Banners",
      value: banners?.length,
      icon: <ImageIcon />,
      accent: "#00796b",
    },
    {
      title: "Shipments",
      value: shipments?.length,
      icon: <LocalShippingIcon />,
      accent: "#2e7d32",
    },
    {
      title: "Shipment Products",
      value: shipmentProducts?.length,
      icon: <InventoryIcon />,
      accent: "#f57c00",
    },
    {
      title: "Inventory Serials",
      value: inventorySerials?.length,
      icon: <BarChartIcon />,
      accent: "#c2185b",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Page heading */}
      <Box display="flex" alignItems="center" gap={1.5} mb={3}>
        <Box
          sx={{ width: 5, height: 32, bgcolor: "#D20000", borderRadius: 1 }}
        />
        <Box>
          <Typography variant="h5" fontWeight={800} color="#1a1a1a">
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of your inventory and logistics
          </Typography>
        </Box>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={2.5}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
