// File: components/Loader.jsx
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  fullScreen: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },

  spinner: {
    color: "#ED3434 !important",
  },

  textPrimary: {
    marginTop: 16,
    color: "#7E7E7E",
    fontWeight: 600,
    letterSpacing: "0.5px",
  },

  textSecondary: {
    color: "#7E7E7E",
    fontWeight: 500,
  },
}));

const Loader = ({ size = 40, text = "", fullScreen = false }) => {
  const classes = useStyles();

  if (fullScreen) {
    return (
      <Box className={classes.fullScreen}>
        <CircularProgress size={size} className={classes.spinner} />

        {text && (
          <Typography variant="body1" className={classes.textPrimary}>
            {text}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <CircularProgress size={size} className={classes.spinner} />

      {text && (
        <Typography variant="body2" className={classes.textSecondary}>
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;
