import React from "react";
import { Button } from "@mui/material";

const CommonButton = ({
  children,
  variant = "contained",
  startIcon,
  endIcon,
  disabled = false,
  onClick,
  sx = {},
  ...rest
}) => {
  return (
    <Button
      variant={variant}
      startIcon={startIcon}
      endIcon={endIcon}
      disabled={disabled}
      onClick={onClick}
      disableElevation
      sx={{
        backgroundColor: variant === "contained" ? "#D20000" : "transparent",
        color: variant === "contained" ? "#FAFAFA" : "#D20000",
        textTransform: "none",
        fontWeight: 600,
        fontSize: "14px",
        padding: "8px 20px",
        borderRadius: "8px",
        border: variant === "outlined" ? "1.5px solid #7E7E7E" : "none",
        boxShadow:
          variant === "contained"
            ? "0px 4px 10px rgba(210, 0, 0, 0.25)"
            : "none",
        transition: "all 0.25s ease",

        "&:hover": {
          backgroundColor:
            variant === "contained" ? "#B80000" : "rgba(210, 0, 0, 0.08)",
          borderColor: "#D20000",
          boxShadow:
            variant === "contained"
              ? "0px 6px 14px rgba(210, 0, 0, 0.35)"
              : "none",
        },

        "&:active": {
          transform: "scale(0.97)",
        },

        "&.Mui-disabled": {
          backgroundColor: "#7E7E7E",
          color: "#FAFAFA",
          borderColor: "#7E7E7E",
          boxShadow: "none",
        },

        ...sx, // allow overrides per usage
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default CommonButton;
