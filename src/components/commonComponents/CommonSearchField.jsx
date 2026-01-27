import { useState, useEffect } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const CommonSearchField = ({
  placeholder = "Search...",
  value = "",
  onChange,
  debounceTime = 300,
}) => {
  const [inputValue, setInputValue] = useState(value);

  // Debounce to avoid firing on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      if (onChange) onChange(inputValue);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [inputValue, onChange, debounceTime]);

  const handleClear = () => {
    setInputValue("");
    if (onChange) onChange("");
  };

  return (
    <TextField
      // fullWidth
      size="small"
      variant="outlined"
      placeholder={placeholder}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
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
          backgroundColor: "#f5f5f5",
        },
      }}
    />
  );
};

export default CommonSearchField;
