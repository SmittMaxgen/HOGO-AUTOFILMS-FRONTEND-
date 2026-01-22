// File: components/Loader.jsx
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const Loader = ({ size = 40, text = "", fullScreen = false }) => {
  if (fullScreen) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={size} />
        {text && (
          <Typography mt={2} variant="body1">
            {text}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <CircularProgress size={size} />
      {text && <Typography variant="body2">{text}</Typography>}
    </Box>
  );
};

export default Loader;
