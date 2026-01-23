import React from "react";
import { Typography } from "@mui/material";

const CommonLabel = ({
  children,
  variant = "h5",
  weight = 600,
  color = "#7E7E7E",
  align = "left",
  sx = {},
  ...rest
}) => {
  return (
    <Typography
      variant={variant}
      fontWeight={weight}
      textAlign={align}
      sx={{
        color,
        letterSpacing: "0.4px",
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Typography>
  );
};

export default CommonLabel;
