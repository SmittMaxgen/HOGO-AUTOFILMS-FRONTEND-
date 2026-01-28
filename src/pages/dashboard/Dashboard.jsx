import React, { useEffect } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { getProducts } from "../../feature/products/productThunks";
import { getCategory } from "../../feature/category/categoryThunks";
import { getBanners } from "../../feature/banner/bannerThunks";
import { getMaterials } from "../../feature/material/materialThunks";
import { getColors } from "../../feature/color/colorThunks";
import { selectColors } from "../../feature/color/colorSelector";
import { selectCostList } from "../../feature/cost/costSelector";
import { getCost } from "../../feature/cost/costThunks";

const useStyles = makeStyles(() => ({
  main: {
    padding: "24px",
  },

  statCard: {
    height: 140,
    borderRadius: 18,
    backgroundColor: "#fff !important",
    border: "1px solid #E6EAF2",
    padding: "18px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& svg": {
      fontSize: 22,
      color: "#0F172A",
    },
  },

  title: {
    fontSize: 15,
    color: "#475569",
    marginTop: 8,
  },

  value: {
    fontSize: 28,
    fontWeight: 700,
    color: "#0F172A",
    marginTop: 4,
  },

  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  liveBadge: {
    fontSize: 12,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },

  liveUp: {
    backgroundColor: "#E7F8EF",
    color: "#16A34A",
  },

  liveDown: {
    backgroundColor: "#FDECEC",
    color: "#DC2626",
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategory());
    dispatch(getBanners());
    dispatch(getMaterials());
    dispatch(getColors());
    dispatch(getCost());
  }, [dispatch]);

  const products = useSelector((state) => state.product?.list || []);
  const categories = useSelector((state) => state.category?.list || []);
  const banners = useSelector((state) => state.banner?.list || []);
  const materials = useSelector((state) => state.material?.list || []);
  const colors = useSelector(selectColors);
  const costs = useSelector(selectCostList);

  const cards = [
    {
      title: "Materials",
      value: materials.length,
      icon: <PeopleIcon />,
    },
    {
      title: "Costs",
      value: costs.length,
      icon: <BarChartIcon />,
    },
    {
      title: "Colors",
      value: colors.length,
      icon: <PeopleIcon />,
    },
    {
      title: "Categories",
      value: categories?.data?.length || 0,
      icon: <BarChartIcon />,
    },
    {
      title: "Banners",
      value: banners.length,
      icon: <PeopleIcon />,
    },
    {
      title: "Shipments",
      value: 0,
      icon: <BarChartIcon />,
    },
    {
      title: "Shipment Products",
      value: 0,
      icon: <PeopleIcon />,
    },
  ];

  return (
    <Box className={classes.main}>
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={0} className={classes.statCard}>
              <Box className={classes.iconBox}>{card.icon}</Box>

              <Box className={classes.bottomRow}>
                <Box>
                  <Typography className={classes.title}>
                    {card.title}
                  </Typography>
                  <Typography className={classes.value}>
                    {card.value}
                  </Typography>
                </Box>

                <Box
                  className={`${classes.liveBadge} ${
                    card.value > 0 ? classes.liveUp : classes.liveDown
                  }`}
                >
                  {card.value > 0 ? "↑ Live" : "↓ Live"}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
