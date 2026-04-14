import { FormControl, Select, MenuItem } from "@mui/material";

const CommonSelectField = ({
  value = "",
  onChange,
  options = [],
  placeholder = "Select...",
  size = "small",
  fullWidth = true,
  sx = {},
  renderValue,
}) => {
  return (
    <FormControl fullWidth={fullWidth} size={size} sx={{ minWidth: 140 }}>
      <Select
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        displayEmpty
        renderValue={
          renderValue ||
          ((selected) => {
            if (!selected) return <em>{placeholder}</em>;
            const found = options.find((o) => o.value === selected);
            return found?.label || selected;
          })
        }
        sx={{
          height: 39,
          borderRadius: "10px",
          fontSize: 13,
          color: "grey",
          backgroundColor: "#f5f5f5",
          "&:hover fieldset": { borderColor: "#D20000" },
          "&.Mui-focused fieldset": { borderColor: "#D20000" },
          ...sx,
        }}
      >
        <MenuItem value="">
          <em>{placeholder}</em>
        </MenuItem>

        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CommonSelectField;
