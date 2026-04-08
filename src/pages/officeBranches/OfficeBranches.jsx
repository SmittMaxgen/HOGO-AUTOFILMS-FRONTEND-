import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Grid,
  Button,
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Select,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import ApartmentIcon from "@mui/icons-material/Apartment";

import {
  getOfficeBranches,
  createOfficeBranch,
  updateOfficeBranch,
  deleteOfficeBranch,
} from "../../feature/officeBranches/officeBranchesThunks";
import {
  selectOfficeBranches,
  selectOfficeBranchLoading,
  selectCreateOfficeBranchLoading,
  selectUpdateOfficeBranchLoading,
  selectDeleteOfficeBranchLoading,
} from "../../feature/officeBranches/officeBranchesSelector";
import CommonButton from "../../components/commonComponents/CommonButton";
import CommonToast from "../../components/commonComponents/Toster";

// ─── Design tokens ────────────────────────────────────────────────────────────
const fieldSx = {
  "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#D20000" },
  "& label.Mui-focused": { color: "#D20000" },
};

const STATUS_STYLE = {
  Active: { bgcolor: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9" },
  Inactive: {
    bgcolor: "#f5f5f5",
    color: "#757575",
    border: "1px solid #e0e0e0",
  },
};

// ─── Initial state ────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: "",
  branch_code: "",
  manager_name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  status: "Active",
  is_headquarters: false,
  remarks: "",
};

const REQUIRED = new Set([
  "name",
  "branch_code",
  "phone",
  "email",
  "address",
  "city",
  "state",
  "pincode",
]);

// ─── Components outside main (prevents remount / focus-loss) ─────────────────

const SectionHeading = ({ title }) => (
  <Box display="flex" alignItems="center" gap={1.5} mb={2.5}>
    <Box sx={{ width: 4, height: 22, bgcolor: "#D20000", borderRadius: 1 }} />
    <Typography
      variant="subtitle1"
      fontWeight={700}
      color="#1a1a1a"
      letterSpacing={0.4}
    >
      {title}
    </Typography>
  </Box>
);

// Field — receives state via props so it stays at module level
const Field = ({
  label,
  field,
  type = "text",
  options = {},
  formData,
  formErrors,
  isEditable,
  setFormData,
  setFormErrors,
}) => {
  const required = REQUIRED.has(field);
  const { children: selectChildren, ...rest } = options;
  const props = {
    fullWidth: true,
    label: required && isEditable ? `${label} *` : label,
    type,
    value: formData[field] ?? "",
    sx: fieldSx,
    InputProps: { readOnly: !isEditable },
    error: isEditable && !!formErrors[field],
    helperText: isEditable ? formErrors[field] : undefined,
    onChange: isEditable
      ? (e) => {
          let v = e.target.value;
          if (type === "tel") v = v.replace(/\D/g, "");
          setFormData((p) => ({ ...p, [field]: v }));
          if (formErrors[field])
            setFormErrors((p) => ({ ...p, [field]: undefined }));
        }
      : undefined,
    ...rest,
  };
  if (rest.select && selectChildren)
    return <TextField {...props}>{selectChildren}</TextField>;
  return <TextField {...props} />;
};

// DetailCard — read-only info tile used in view mode
const DetailCard = ({ icon, label, value }) => (
  <Box
    sx={{
      bgcolor: "#fafafa",
      borderRadius: 2,
      p: 2,
      border: "1px solid #f0f0f0",
      display: "flex",
      gap: 1.5,
      alignItems: "flex-start",
    }}
  >
    <Box sx={{ color: "#D20000", mt: 0.2, flexShrink: 0 }}>{icon}</Box>
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        display="block"
      >
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} color="#1a1a1a" mt={0.3}>
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const OfficeBranch = () => {
  const dispatch = useDispatch();

  const branches = useSelector(selectOfficeBranches);
  const loading = useSelector(selectOfficeBranchLoading);
  const createLoading = useSelector(selectCreateOfficeBranchLoading);
  const updateLoading = useSelector(selectUpdateOfficeBranchLoading);
  const deleteLoading = useSelector(selectDeleteOfficeBranchLoading);

  // ── State ──────────────────────────────────────────────────────────────────
  const [selected, setSelected] = useState(null); // null = list view
  const [mode, setMode] = useState("view"); // "view" | "edit" | "create"
  const [deleteDialogOpen, setDeleteDialog] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getOfficeBranches());
  }, [dispatch]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const isEditable = mode === "edit" || mode === "create";
  const fieldProps = {
    formData,
    formErrors,
    isEditable,
    setFormData,
    setFormErrors,
  };

  const loadForm = (branch) =>
    setFormData({
      name: branch.name || "",
      branch_code: branch.branch_code || "",
      manager_name: branch.manager_name || "",
      phone: branch.phone || "",
      email: branch.email || "",
      address: branch.address || "",
      city: branch.city || "",
      state: branch.state || "",
      pincode: branch.pincode || "",
      country: branch.country || "India",
      status: branch.status || "Active",
      is_headquarters: branch.is_headquarters || false,
      remarks: branch.remarks || "",
    });

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = "Branch name is required";
    // if (!formData.branch_code?.trim())
    //   errors.branch_code = "Branch code is required";
    // if (!formData.phone?.trim()) errors.phone = "Phone is required";
    // else if (!/^\d{10}$/.test(formData.phone))
    //   errors.phone = "Phone must be 10 digits";
    // if (!formData.email?.trim()) errors.email = "Email is required";
    // else if (!/\S+@\S+\.\S+/.test(formData.email))
    //   errors.email = "Email is invalid";
    if (!formData.address?.trim()) errors.address = "Address is required";
    if (!formData.city?.trim()) errors.city = "City is required";
    if (!formData.state?.trim()) errors.state = "State is required";
    // if (!formData.pincode?.trim()) errors.pincode = "Pincode is required";
    // else if (!/^\d{6}$/.test(formData.pincode))
    //   errors.pincode = "Pincode must be 6 digits";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleView = (branch) => {
    setSelected(branch);
    loadForm(branch);
    setMode("view");
    setFormErrors({});
  };

  const handleAdd = () => {
    setSelected({});
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setMode("create");
  };

  const handleBack = () => {
    setSelected(null);
    setMode("view");
    setFormErrors({});
  };

  const handleCreate = async () => {
    if (!validate()) return;
    const result = await dispatch(createOfficeBranch(formData));
    if (result.type.includes("fulfilled")) {
      CommonToast("Branch created successfully", "success");
      dispatch(getOfficeBranches());
      handleBack();
    } else {
      CommonToast("Failed to create branch", "error");
    }
  };

  const handleSave = async () => {
    if (!validate()) return;
    const result = await dispatch(
      updateOfficeBranch({ id: selected.id, data: formData }),
    );
    if (result.type.includes("fulfilled")) {
      CommonToast("Branch updated successfully", "success");
      dispatch(getOfficeBranches());
      const updated = { ...selected, ...formData };
      setSelected(updated);
      loadForm(updated);
      setMode("view");
    } else {
      CommonToast("Failed to update branch", "error");
    }
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteOfficeBranch(selected.id));
    if (result.type.includes("fulfilled")) {
      CommonToast("Branch deleted successfully", "success");
      dispatch(getOfficeBranches());
    } else {
      CommonToast("Failed to delete branch", "error");
    }
    setDeleteDialog(false);
    handleBack();
  };

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  if (!selected) {
    return (
      <Box>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
              <Box
                sx={{
                  width: 5,
                  height: 32,
                  bgcolor: "#D20000",
                  borderRadius: 1,
                }}
              />
              <Typography variant="h5" fontWeight={800} color="#1a1a1a">
                Office Branches
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" ml={2.5}>
              Manage all office branch locations
            </Typography>
          </Box>
          <CommonButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{
              bgcolor: "#D20000",
              "&:hover": { bgcolor: "#a80000" },
              fontWeight: 700,
              borderRadius: 1.5,
              px: 2.5,
              boxShadow: "0 4px 12px rgba(210,0,0,0.3)",
            }}
          >
            Add Branch
          </CommonButton>
        </Stack>

        {/* Table */}
        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #f0f0f0",
          }}
        >
          {loading ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              py={8}
              gap={1}
            >
              <CircularProgress size={32} sx={{ color: "#D20000" }} />
              <Typography variant="body2" color="text.secondary">
                Loading branches...
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      background:
                        "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
                    }}
                  >
                    {[
                      "Sr",
                      "Branch",
                      // "Code",
                      "City",
                      "State",
                      // "Phone",
                      // "Manager",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          fontWeight: 700,
                          color: "#fff",
                          fontSize: 13,
                          letterSpacing: 0.5,
                          border: "none",
                          py: 1.5,
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {branches?.map((branch, i) => (
                    <TableRow
                      key={branch.id}
                      hover
                      sx={{
                        "&:hover": { bgcolor: "#fff5f5" },
                        "&:last-child td": { border: 0 },
                        borderBottom: "1px solid #f5f5f5",
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Sr */}
                      <TableCell
                        sx={{ fontWeight: 700, color: "#D20000", width: 45 }}
                      >
                        {i + 1}
                      </TableCell>

                      {/* Branch name */}
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1.2}>
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: 1,
                              bgcolor: "#fff0f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px solid #ffd0d0",
                              flexShrink: 0,
                            }}
                          >
                            <ApartmentIcon
                              sx={{ fontSize: 15, color: "#D20000" }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              fontWeight={600}
                              fontSize={13}
                              color="#1a1a1a"
                            >
                              {branch.name}
                            </Typography>
                            {branch.is_headquarters && (
                              <Chip
                                label="HQ"
                                size="small"
                                sx={{
                                  height: 16,
                                  fontSize: 10,
                                  fontWeight: 700,
                                  bgcolor: "#fff3e0",
                                  color: "#e65100",
                                  border: "1px solid #ffe0b2",
                                  mt: 0.3,
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Code */}
                      {/* <TableCell>
                        <Chip
                          label={branch.branch_code || "N/A"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: 11,
                            borderRadius: 1,
                            bgcolor: "#f0f4ff",
                            color: "#1565c0",
                            border: "1px solid #d0deff",
                          }}
                        />
                      </TableCell> */}

                      {/* City */}
                      <TableCell>
                        <Typography fontSize={13} color="#1a1a1a">
                          {branch.city}
                        </Typography>
                      </TableCell>

                      {/* State */}
                      <TableCell>
                        <Typography fontSize={12} color="text.secondary">
                          {branch.state}
                        </Typography>
                      </TableCell>

                      {/* Phone */}
                      {/* <TableCell>
                        <Typography fontSize={13}>{branch.phone}</Typography>
                      </TableCell> */}

                      {/* Manager */}
                      {/* <TableCell>
                        <Typography fontSize={12} color="text.secondary">
                          {branch.manager_name || "—"}
                        </Typography>
                      </TableCell> */}

                      {/* Status */}
                      {/* <TableCell>
                        <Chip
                          label={branch.status || "Active"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            borderRadius: 1,
                            fontSize: 11,
                            ...(STATUS_STYLE[branch.status] ||
                              STATUS_STYLE.Active),
                          }}
                        />
                      </TableCell> */}
                      {/* Status */}
                      <TableCell>
                        <Select
                          size="small"
                          value={branch.status || "Active"}
                          onChange={async (e) => {
                            const result = await dispatch(
                              updateOfficeBranch({
                                id: branch.id,
                                data: { status: e.target.value },
                              }),
                            );
                            if (result.type.includes("fulfilled")) {
                              CommonToast("Status updated", "success");
                              dispatch(getOfficeBranches());
                            }
                          }}
                          sx={{
                            minWidth: 100,
                            height: 26,
                            borderRadius: "999px",
                            fontWeight: 700,
                            fontSize: 11,
                            color:
                              STATUS_STYLE[branch.status]?.color ||
                              STATUS_STYLE.Active.color,
                            bgcolor:
                              STATUS_STYLE[branch.status]?.bgcolor ||
                              STATUS_STYLE.Active.bgcolor,
                            border:
                              STATUS_STYLE[branch.status]?.border ||
                              STATUS_STYLE.Active.border,
                            "& .MuiSelect-select": {
                              py: 0.5,
                              pl: 1.5,
                              display: "flex",
                              alignItems: "center",
                            },
                            "& fieldset": { border: "none" },
                            "& svg": {
                              color:
                                STATUS_STYLE[branch.status]?.color ||
                                STATUS_STYLE.Active.color,
                            },
                          }}
                        >
                          <MenuItem value="Active" sx={{ fontSize: 13 }}>
                            Active
                          </MenuItem>
                          <MenuItem value="Inactive" sx={{ fontSize: 13 }}>
                            Inactive
                          </MenuItem>
                        </Select>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <Stack direction="row" spacing={0.8}>
                          <IconButton
                            size="small"
                            onClick={() => handleView(branch)}
                            sx={{
                              bgcolor: "#f0f4ff",
                              color: "#1565c0",
                              "&:hover": { bgcolor: "#d0deff" },
                              borderRadius: 1,
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelected(branch);
                              loadForm(branch);
                              setMode("edit");
                              setFormErrors({});
                            }}
                            sx={{
                              bgcolor: "#fff8e1",
                              color: "#f57c00",
                              "&:hover": { bgcolor: "#ffe082" },
                              borderRadius: 1,
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelected(branch);
                              setDeleteDialog(true);
                            }}
                            sx={{
                              bgcolor: "#fce4ec",
                              color: "#c62828",
                              "&:hover": { bgcolor: "#ef9a9a" },
                              borderRadius: 1,
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}

                  {!loading && (!branches || branches.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          gap={1}
                        >
                          <ApartmentIcon
                            sx={{ fontSize: 40, color: "#e0e0e0" }}
                          />
                          <Typography color="text.secondary" fontWeight={500}>
                            No branches found
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    );
  }

  // ── DETAIL / CREATE / EDIT VIEW ────────────────────────────────────────────
  return (
    <Box sx={{ bgcolor: "#f8f8f8", minHeight: "100vh" }}>
      {/* Red gradient header */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
          px: 3,
          py: 3,
          boxShadow: "0 4px 16px rgba(210,0,0,0.25)",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          mb={mode === "create" ? 0 : 2.5}
        >
          <IconButton onClick={handleBack} sx={{ color: "#fff", mr: 1.5 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            fontWeight={700}
            color="#fff"
            letterSpacing={1}
            flex={1}
          >
            {mode === "create"
              ? "Add New Branch"
              : mode === "edit"
                ? "Edit Branch"
                : "Branch Details"}
          </Typography>

          {mode === "view" && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setMode("edit")}
                sx={{
                  borderColor: "rgba(255,255,255,0.6)",
                  color: "#fff",
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                  fontWeight: 700,
                  borderRadius: 1.5,
                  textTransform: "none",
                }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialog(true)}
                sx={{
                  borderColor: "rgba(255,255,255,0.6)",
                  color: "#fff",
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                  fontWeight: 700,
                  borderRadius: 1.5,
                  textTransform: "none",
                }}
              >
                Delete
              </Button>
            </Stack>
          )}

          {mode === "edit" && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={updateLoading}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                  fontWeight: 700,
                  borderRadius: 1.5,
                  textTransform: "none",
                }}
              >
                {updateLoading ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => {
                  loadForm(selected);
                  setMode("view");
                  setFormErrors({});
                }}
                sx={{
                  borderColor: "rgba(255,255,255,0.6)",
                  color: "#fff",
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                  fontWeight: 700,
                  borderRadius: 1.5,
                  textTransform: "none",
                }}
              >
                Cancel
              </Button>
            </Stack>
          )}
        </Box>

        {/* Identity strip (view mode only) */}
        {mode === "view" && selected?.name && (
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              <ApartmentIcon sx={{ fontSize: 30, color: "#fff" }} />
            </Box>
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h5" fontWeight={700} color="#fff">
                  {selected.name}
                </Typography>
                {selected.is_headquarters && (
                  <Chip
                    label="HQ"
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: 11,
                      bgcolor: "#fff3e0",
                      color: "#e65100",
                      border: "1px solid #ffe0b2",
                    }}
                  />
                )}
              </Box>
              <Box display="flex" gap={1} mt={0.8}>
                <Chip
                  label={selected.branch_code}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: 11,
                    borderRadius: 1,
                    bgcolor: "#f0f4ff",
                    color: "#1565c0",
                    border: "1px solid #d0deff",
                  }}
                />
                <Chip
                  label={selected.status || "Active"}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: 11,
                    borderRadius: 1,
                    ...(STATUS_STYLE[selected.status] || STATUS_STYLE.Active),
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.8)", mt: 0.8 }}
              >
                {selected.city}, {selected.state} • {selected.phone}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {mode === "view" ? (
          // ── VIEW MODE: Detail cards ────────────────────────────────────────
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Branch Info */}
            <Paper
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #f0f0f0",
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  bgcolor: "#fafafa",
                  borderBottom: "1px solid #ebebeb",
                }}
              >
                <SectionHeading title="Branch Information" />
              </Box>
              <Box px={4} py={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <DetailCard
                      icon={<BusinessIcon fontSize="small" />}
                      label="Branch Name"
                      value={selected.name}
                    />
                  </Grid>
                  {/* <Grid item xs={12} sm={6} md={4}>
                    <DetailCard
                      icon={<ApartmentIcon fontSize="small" />}
                      label="Branch Code"
                      value={selected.branch_code}
                    />
                  </Grid> */}
                  {/* <Grid item xs={12} sm={6} md={4}>
                    <DetailCard
                      icon={<PersonIcon fontSize="small" />}
                      label="Manager"
                      value={selected.manager_name}
                    />
                  </Grid> */}
                  {/* <Grid item xs={12} sm={6} md={4}>
                    <DetailCard
                      icon={<PhoneIcon fontSize="small" />}
                      label="Phone"
                      value={selected.phone}
                    />
                  </Grid> */}
                  {/* <Grid item xs={12} sm={6} md={4}>
                    <DetailCard
                      icon={<EmailIcon fontSize="small" />}
                      label="Email"
                      value={selected.email}
                    />
                  </Grid> */}
                </Grid>
              </Box>
            </Paper>

            {/* Address */}
            <Paper
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #f0f0f0",
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  bgcolor: "#fafafa",
                  borderBottom: "1px solid #ebebeb",
                }}
              >
                <SectionHeading title="Address" />
              </Box>
              <Box px={4} py={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <DetailCard
                      icon={<LocationOnIcon fontSize="small" />}
                      label="Address"
                      value={selected.address}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <DetailCard
                      icon={<LocationOnIcon fontSize="small" />}
                      label="City"
                      value={selected.city}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <DetailCard
                      icon={<LocationOnIcon fontSize="small" />}
                      label="State"
                      value={selected.state}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <DetailCard
                      icon={<LocationOnIcon fontSize="small" />}
                      label="Pincode"
                      value={selected.pincode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <DetailCard
                      icon={<LocationOnIcon fontSize="small" />}
                      label="Country"
                      value={selected.country}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* Remarks */}
            {selected.remarks && (
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid #f0f0f0",
                }}
              >
                <Box
                  sx={{
                    px: 3,
                    py: 2,
                    bgcolor: "#fafafa",
                    borderBottom: "1px solid #ebebeb",
                  }}
                >
                  <SectionHeading title="Remarks" />
                </Box>
                <Box px={4} py={3}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    lineHeight={1.7}
                  >
                    {selected.remarks}
                  </Typography>
                </Box>
              </Paper>
            )}
          </Box>
        ) : (
          // ── CREATE / EDIT MODE: Form ───────────────────────────────────────
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Branch Info */}
            <Paper
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #f0f0f0",
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  bgcolor: "#fafafa",
                  borderBottom: "1px solid #ebebeb",
                }}
              >
                <SectionHeading title="Branch Information" />
              </Box>
              <Box px={4} py={3}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <Field {...fieldProps} label="Branch Name" field="name" />
                  </Grid>
                  {/* <Grid item xs={12} sm={6}>
                    <Field
                      {...fieldProps}
                      label="Branch Code"
                      field="branch_code"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      {...fieldProps}
                      label="Manager Name"
                      field="manager_name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      {...fieldProps}
                      label="Phone"
                      field="phone"
                      type="tel"
                      options={{
                        inputProps: {
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          maxLength: 10,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      {...fieldProps}
                      label="Email"
                      field="email"
                      type="email"
                    />
                  </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <Field
                      {...fieldProps}
                      label="Status"
                      field="status"
                      options={{
                        select: true,
                        children: [
                          <MenuItem key="Active" value="Active">
                            Active
                          </MenuItem>,
                          <MenuItem key="Inactive" value="Inactive">
                            Inactive
                          </MenuItem>,
                        ],
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!formData.is_headquarters}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              is_headquarters: e.target.checked,
                            }))
                          }
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#D20000",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              { bgcolor: "#D20000" },
                          }}
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Mark as Headquarters
                        </Typography>
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* Address */}
            <Paper
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #f0f0f0",
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  bgcolor: "#fafafa",
                  borderBottom: "1px solid #ebebeb",
                }}
              >
                <SectionHeading title="Address" />
              </Box>
              <Box px={4} py={3}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <Field
                      {...fieldProps}
                      label="Address"
                      field="address"
                      options={{ multiline: true, minRows: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Field {...fieldProps} label="City" field="city" />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Field {...fieldProps} label="State" field="state" />
                  </Grid>
                  {/* <Grid item xs={12} sm={4}>
                    <Field
                      {...fieldProps}
                      label="Pincode"
                      field="pincode"
                      type="tel"
                      options={{
                        inputProps: {
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          maxLength: 6,
                        },
                      }}
                    />
                  </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <Field {...fieldProps} label="Country" field="country" />
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* Remarks */}
            <Paper
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #f0f0f0",
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  bgcolor: "#fafafa",
                  borderBottom: "1px solid #ebebeb",
                }}
              >
                <SectionHeading title="Remarks" />
              </Box>
              <Box px={4} py={3}>
                <Field
                  {...fieldProps}
                  label="Remarks"
                  field="remarks"
                  options={{ multiline: true, minRows: 3 }}
                />
              </Box>
            </Paper>

            {/* Submit */}
            {mode === "create" && (
              <Box>
                <CommonButton
                  variant="contained"
                  size="large"
                  onClick={handleCreate}
                  disabled={createLoading}
                  sx={{
                    bgcolor: "#D20000",
                    "&:hover": { bgcolor: "#a80000" },
                    fontWeight: 700,
                    borderRadius: 1.5,
                    px: 4,
                    boxShadow: "0 4px 12px rgba(210,0,0,0.3)",
                  }}
                >
                  {createLoading ? "Creating..." : "Create Branch"}
                </CommonButton>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        <Box
          sx={{
            background: "linear-gradient(90deg, #D20000 0%, #8B0000 100%)",
            px: 3,
            py: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#fff">
            Confirm Delete
          </Typography>
        </Box>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Are you sure you want to delete{" "}
            <Typography component="span" fontWeight={700} color="#1a1a1a">
              {selected?.name}
            </Typography>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialog(false)}
            sx={{ fontWeight: 600, borderRadius: 1.5, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            disabled={deleteLoading}
            sx={{
              bgcolor: "#D20000",
              "&:hover": { bgcolor: "#a80000" },
              fontWeight: 700,
              borderRadius: 1.5,
              textTransform: "none",
              px: 3,
            }}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OfficeBranch;
