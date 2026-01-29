import { useState, useEffect } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const CommonSearchField = ({
  placeholder = "Search...",
  type = "text",
  value = "",
  onChange,
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if (onChange) onChange(inputValue);
  }, [inputValue, onChange]);

  const handleClear = () => {
    setInputValue("");
  };

  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder={placeholder}
      value={inputValue}
      type={type}
      onChange={(e) => setInputValue(e.target.value)}
      InputProps={{
        startAdornment:
          type === "text" ? (
            <InputAdornment position="start">
              <SearchIcon style={{ color: "grey" }} />
            </InputAdornment>
          ) : null,
        endAdornment: inputValue && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear}>
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
        sx: {
          margin: "10px",
          borderRadius: "12px",
          color: "grey",
          backgroundColor: "#f5f5f5",
        },
      }}
      InputLabelProps={type === "date" ? { shrink: true } : undefined}
    />
  );
};

export default CommonSearchField;
